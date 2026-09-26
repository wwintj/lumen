'use strict';

const { execFile } = require('child_process');
const crypto = require('crypto');
const path = require('path');

// ---------------------------------------------------------------------------
// Configuration — everything overridable via environment.
// The QA harness NEVER hardcodes a credential, and the WP install path is a
// RELATIVE path (resolved against the QA's launch cwd, i.e. the repo root).
// Relative paths are used deliberately: this machine resolves the repo root
// through a symlink / mount where the *absolute* path behaves differently from
// the relative one, and relative invocation (wp-cli auto-detecting the install
// from cwd) is the most reliable.
// ---------------------------------------------------------------------------
const WPCLI = process.env.LUMEN_QA_WPCLI || 'wp';
// Absolute, cwd-independent: the WP install sits relative to the QA dir.
// (Absolute execFile cwd is reliable here, unlike bash cd/ls on the symlink
// path.) Override with LUMEN_QA_WP_PATH when needed.
const WP_PATH =
  process.env.LUMEN_QA_WP_PATH ||
  path.join(__dirname, '..', '.runtime', 'wordpress');
const BASE = process.env.LUMEN_QA_BASE || 'http://127.0.0.1:4242';

const QA_USER_PREFIX = 'lumen_qa_';
// Reserved TLD (RFC 2606) — a temp QA account can never receive real mail.
const QA_EMAIL_DOMAIN = 'example.invalid';

// ---------------------------------------------------------------------------
// WP-CLI wrapper.
//
// wp-cli (a bundled phar) can emit PHP 8 "Deprecated" noise on its streams on
// some machines. We run it with cwd = the WP install (wp-cli auto-detects the
// install from cwd — the most reliable invocation on this machine), strip the
// deprecation lines, and ALWAYS RESOLVE with { code, out, err, dur } so each
// caller decides what "success" means and can handle its own failure mode.
// ---------------------------------------------------------------------------
function cleanWpText(text) {
  if (!text) return '';
  return (
    text
      .split('\n')
      .map((line) => line.trimEnd())
      .filter((line) => line && !/^PHP\s+Deprecated:/.test(line) && !/^Deprecated:/.test(line))
      .join('\n')
      .trim()
      .slice(0, 500)
  );
}

function wp(args) {
  return new Promise((resolve) => {
    const t0 = Date.now();
    execFile(WPCLI, [...args], { cwd: WP_PATH, maxBuffer: 16 * 1024 * 1024, timeout: 120000 }, (err, stdout, stderr) => {
      const code = err && err.code > 0 ? err.code : err ? 1 : 0;
      resolve({ code, out: cleanWpText(stdout), err: cleanWpText(stderr), dur: Date.now() - t0 });
    });
  });
}

// ---------------------------------------------------------------------------
// Credential resolution (Strategy A first, Strategy B fallback).
//
//   A) LUMEN_QA_WP_USER / LUMEN_QA_WP_PASSWORD environment variables.
//   B) a temporary administrator created via WP-CLI, used only for this run
//      and deleted in cleanup — even when the test throws.
//
// The temporary password is high-entropy and is NEVER printed, logged, or
// written to any file.
// ---------------------------------------------------------------------------
function resolveEnvCredentials() {
  const u = process.env.LUMEN_QA_WP_USER;
  const p = process.env.LUMEN_QA_WP_PASSWORD;
  if (u && p) return { username: u, password: p, source: 'env' };
  return null;
}

async function createTempAdmin() {
  const username = QA_USER_PREFIX + crypto.randomBytes(6).toString('hex');
  const password = crypto.randomBytes(20).toString('hex'); // ~128 bits of entropy
  const email = username + '@' + QA_EMAIL_DOMAIN;

  // Step 1: create the user.  wp user create <login> <email> [--role=...]
  //   (the 2nd positional argument is the EMAIL; the role is a built-in name —
  //    WordPress's top role is "administrator", NOT "admin".)
  const created = await wp([
    'user',
    'create',
    username,
    email,
    '--role=administrator',
    '--porcelain',
  ]);
  if (created.code !== 0) {
    throw new Error(
      'wp user create failed (exit ' + created.code + '): ' + (created.err || created.out || 'no output')
    );
  }

  // Capture the user id returned by `--porcelain` (a plain numeric id).
  const uid = String(created.out).trim();
  if (!/^\d+$/.test(uid)) {
    throw new Error('wp user create did not return a numeric user id: ' + JSON.stringify(created.out));
  }

  // Step 2: set a known high-entropy password.
  //
  // In this install `wp user update --password` reports "Success" but does NOT
  // change the stored `user_pass` hash (a WP-CLI bug here), so we write the hash
  // directly through $wpdb->update + wp_hash_password via `wp eval`. The
  // password is hex (safe to embed) and the user id is numeric.
  const php =
    'global $wpdb; $wpdb->update("wp_users",["user_pass"=>wp_hash_password("' +
    password +
    '")],["ID"=>' + uid + ']);echo "set";';
  const setPw = await wp(['eval', php]);
  if (setPw.code !== 0 || setPw.out !== 'set') {
    // Password set failed — remove the partially-created account and fail loud.
    await wp(['user', 'delete', username, '--yes']);
    throw new Error(
      'wp eval set-password failed (exit ' + setPw.code + '): ' + (setPw.err || setPw.out || 'no output')
    );
  }

  return { username, password, email, source: 'temp' };
}

async function deleteTempAdmin(username) {
  // --yes answers the "delete user?" confirmation prompt (without it the CLI
  // hangs waiting on stdin). `user delete` has no --porcelain/--force here.
  const { code, err, out } = await wp(['user', 'delete', username, '--yes']);
  return { deleted: code === 0, error: code === 0 ? null : (err || out) || String(code) };
}

/**
 * Resolve credentials and return a paired cleanup function.
 * - env credentials  -> cleanup is a no-op.
 * - created admin    -> cleanup deletes the temporary user.
 * @returns {{creds:{username,password,email,source}, cleanup:()=>Promise<{deleted:boolean,wasTemp:boolean,error:string|null}>}}
 */
async function resolveAuth() {
  const envCreds = resolveEnvCredentials();
  if (envCreds) {
    const cleanup = async () => ({ deleted: false, wasTemp: false, error: null });
    return { creds: envCreds, cleanup };
  }
  const creds = await createTempAdmin();
  const cleanup = async () => {
    const result = await deleteTempAdmin(creds.username);
    return { deleted: result.deleted, wasTemp: true, error: result.error };
  };
  return { creds, cleanup };
}

// ---------------------------------------------------------------------------
// Playwright login helper.
// Verifies the admin bar really rendered (#wpadminbar AND body.admin-bar),
// not merely that the URL changed. A failed login is a hard FAIL, never a
// SKIP. The username is fine to surface; the password is never printed.
// ---------------------------------------------------------------------------
async function loginWordPressAdmin(page, creds, base) {
  base = base || BASE;
  const loginUrl = base.replace(/\/$/, '') + '/wp-login.php';
  await page.goto(loginUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.fill('input[name="log"]', creds.username);
  await page.fill('input[name="pwd"]', creds.password);
  try {
    await page.click('#wp-submit');
  } catch (e) {
    await page.click('button[type="submit"]');
  }
  try {
    await page.waitForSelector('body.admin-bar', { state: 'visible', timeout: 30000 });
    await page.waitForSelector('#wpadminbar', { state: 'visible', timeout: 15000 });
  } catch (e) {
    // Admin bar never rendered -> credentials rejected or site down.
    let wpMsg = '';
    try {
      wpMsg = (await page.evaluate(() => {
        const el = document.getElementById('error') || document.querySelector('.error');
        return el ? el.textContent.replace(/\s+/g, ' ').trim() : '';
      }))
        .slice(0, 120);
    } catch (m) {
      wpMsg = '';
    }
    throw new Error(
      'WordPress login failed (admin bar never rendered); the run FAILS, it is not a SKIP. user=' +
        creds.username +
        (wpMsg ? ' WP error: ' + wpMsg : '')
    );
  }
  const check = await page.evaluate(() => ({
    bodyAdminBar: document.body.classList.contains('admin-bar'),
    barExists: !!document.getElementById('wpadminbar'),
  }));
  if (!check.bodyAdminBar || !check.barExists) {
    throw new Error('login did not produce body.admin-bar / #wpadminbar');
  }
  return { ok: true };
}

// Logout is best-effort; the browser context is closed (and the session cookie
// discarded) immediately after each login in the QA suites, which is what
// actually clears the WordPress session.
async function logoutWordPressAdmin(page, base) {
  base = base || BASE;
  try {
    await page.goto(base.replace(/\/$/, '') + '/wp-admin/logout.php', {
      waitUntil: 'domcontentloaded',
      timeout: 30000,
    });
  } catch (e) {
    /* intentional no-op: see comment above */
  }
}

module.exports = {
  BASE,
  resolveEnvCredentials,
  createTempAdmin,
  deleteTempAdmin,
  resolveAuth,
  loginWordPressAdmin,
  logoutWordPressAdmin,
};
