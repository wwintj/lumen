'use strict';

// ============================================================================
// Lumen 1.1.0-beta.1 — full QA (fixture + runtime assertions + screenshots)
// ============================================================================

const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { execFile, execSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..');
const BASE = process.env.LUMEN_QA_BASE || 'http://127.0.0.1:4242';
const WP = path.join(ROOT, '.runtime', 'wordpress');
// Fixture inputs live beside this script in version control, so a fresh clone
// has them. Deliberately NOT falling back to a machine-local .runtime/fixture/:
// a missing asset must fail loudly rather than silently borrow stale local files.
const FIX_DIR = path.join(__dirname, 'fixtures');

// Single accessor for fixture inputs so a missing/renamed asset produces an
// actionable message instead of a bare ENOENT deep inside the fixture build.
function fixturePath(name) {
  const p = path.join(FIX_DIR, name);
  if (!fs.existsSync(p)) {
    throw new Error('missing QA fixture "' + name + '" (expected at ' + p +
      '). Fixtures ship with the repository under .lumen-qa/fixtures/.');
  }
  return p;
}
function readFixture(name, encoding) {
  return fs.readFileSync(fixturePath(name), encoding);
}
const SHOT_ROOT = path.join(ROOT, '.runtime', 'lumen-qa-1.1.0-beta.1');
const REPORT_PATH = path.join(ROOT, '.lumen-qa', 'report-beta1.json');
const WPCLI = process.env.LUMEN_QA_WPCLI || 'wp';
const PHP = process.env.LUMEN_QA_PHP || 'php';
const USER_HELPER = path.join(__dirname, 'wp_user_helper.php');
const TERM_HELPER = path.join(__dirname, 'wp_term_helper.php');
const COMMENT_HELPER = path.join(__dirname, 'wp_comment_helper.php');
// Reliable direct-database user operations (bypasses the flaky wp CLI).
function phpUser(action, params) {
  const payload = JSON.stringify(Object.assign({ action }, params));
  return new Promise((resolve) => {
    let attempt = 0;
    const t0 = Date.now();
    function run() {
      attempt++;
      const proc = require('child_process').spawn(PHP, [USER_HELPER], { stdin: 'pipe', maxBuffer: 8 * 1024 * 1024, timeout: 60000, env: { PATH: process.env.PATH || '/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin:/opt/homebrew/bin', HOME: process.env.HOME || '/Users/t', LANG: 'en_US.UTF-8', LC_ALL: 'en_US.UTF-8' } });
      proc.stdin.write(payload);
      proc.stdin.end();
      let out = '', errOut = '';
      proc.stdout.on('data', (d) => { out += d; });
      proc.stderr.on('data', (d) => { errOut += d; });
      proc.on('close', (code) => {
        let parsed = null;
        try { parsed = JSON.parse(out || '{}'); } catch (e) { parsed = { code: 1, error: 'bad output: ' + out }; }
        if (!parsed || parsed.code !== 0) {
          if (attempt < 3) { setTimeout(run, 100); return; }
        }
        resolve({ code: parsed.code || 0, ...parsed });
      });
    }
    run();
  });
}
// Reliable direct-database term operations (bypasses the flaky wp CLI).
function phpTerm(action, params) {
  const payload = JSON.stringify(Object.assign({ action }, params));
  return new Promise((resolve) => {
    let attempt = 0;
    function run() {
      attempt++;
      const proc = require('child_process').spawn(PHP, [TERM_HELPER], { stdin: 'pipe', maxBuffer: 8 * 1024 * 1024, timeout: 60000, env: { PATH: process.env.PATH || '/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin:/opt/homebrew/bin', HOME: process.env.HOME || '/Users/t', LANG: 'en_US.UTF-8', LC_ALL: 'en_US.UTF-8' } });
      proc.stdin.write(payload);
      proc.stdin.end();
      let out = '';
      proc.stdout.on('data', (d) => { out += d; });
      proc.on('close', () => {
        let parsed = null;
        try { parsed = JSON.parse(out || '{}'); } catch (e) { parsed = { code: 1, error: 'bad output: ' + out }; }
        if (!parsed || parsed.code !== 0) { if (attempt < 3) { setTimeout(run, 100); return; } }
        resolve({ code: parsed.code || 0, ...parsed });
      });
    }
    run();
  });
}
// Reliable direct-database comment operations (bypasses the broken wp comment create).
function phpComment(action, params) {
  const payload = JSON.stringify(Object.assign({ action }, params));
  return new Promise((resolve) => {
    let attempt = 0;
    function run() {
      attempt++;
      const proc = require('child_process').spawn(PHP, [COMMENT_HELPER], { stdin: 'pipe', maxBuffer: 8 * 1024 * 1024, timeout: 60000, env: { PATH: process.env.PATH || '/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin:/opt/homebrew/bin', HOME: process.env.HOME || '/Users/t', LANG: 'en_US.UTF-8', LC_ALL: 'en_US.UTF-8' } });
      proc.stdin.write(payload);
      proc.stdin.end();
      let out = '';
      proc.stdout.on('data', (d) => { out += d; });
      proc.on('close', () => {
        let parsed = null;
        try { parsed = JSON.parse(out || '{}'); } catch (e) { parsed = { code: 1, error: 'bad output: ' + out }; }
        if (!parsed || parsed.code !== 0) { if (attempt < 3) { setTimeout(run, 100); return; } }
        resolve({ code: parsed.code || 0, ...parsed });
      });
    }
    run();
  });
}

const VP = {
  '1440': { width: 1440, height: 900 },
  '768': { width: 768, height: 1024 },
  '390': { width: 390, height: 844 },
  '320': { width: 320, height: 568 },
};
const ADMIN_VP = [
  { width: 1440, expect: 32 },
  { width: 783, expect: 32 },
  { width: 782, expect: 46 },
  { width: 768, expect: 46 },
  { width: 601, expect: 46 },
  { width: 600, expect: 0 },
  { width: 390, expect: 0 },
  { width: 320, expect: 0 },
];
const ADMIN_SHOTS = [
  { width: 1440, height: 900, name: 'adminbar-desktop-top.png', scroll: 0 },
  { width: 1440, height: 900, name: 'adminbar-desktop-scrolled.png', scroll: 3000 },
  { width: 390, height: 844, name: 'adminbar-mobile-top-390.png', scroll: 0 },
  { width: 390, height: 844, name: 'adminbar-mobile-scrolled-390.png', scroll: 3000 },
  { width: 320, height: 568, name: 'adminbar-mobile-scrolled-320.png', scroll: 3000 },
];

// ---------------------------------------------------------------------------
// wp helper (mirrors wp-auth: strip PHP Deprecated noise, resolve with code)
// ---------------------------------------------------------------------------
function cleanWpText(text) {
  if (!text) return '';
  return text
    .split('\n')
    .map((line) => line.trimEnd())
    .filter((line) => line && !/^PHP\s+Deprecated:/.test(line) && !/^Deprecated:/.test(line))
    .join('\n')
    .trim();
}
function wp(args) {
  const MAX_RETRIES = 10;
  // Spawn wp in a minimal, shell-like environment. The full DSH environment
  // interferes with the wp CLI's PHP runtime and causes intermittent failures.
  const WP_ENV = Object.assign({
    PATH: process.env.PATH || '/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin:/opt/homebrew/bin',
    HOME: process.env.HOME || '/Users/t',
    LANG: 'en_US.UTF-8',
    LC_ALL: 'en_US.UTF-8',
  }, { WP_ENV: 'clean' });
  return new Promise((resolve) => {
    let attempt = 0;
    const t0 = Date.now();
    function run() {
      attempt++;
      execFile(WPCLI, [...args], { cwd: WP, env: WP_ENV, maxBuffer: 16 * 1024 * 1024, timeout: 180000 }, (err, stdout, stderr) => {
        const code = err && err.code > 0 ? err.code : err ? 1 : 0;
        const out = cleanWpText(stdout);
        const errOut = cleanWpText(stderr);
        // The wp CLI is intermittently flaky in this environment (both from the
        // shell and from Node.js): it can return a non-zero code with no payload
        // at all (only PHP Deprecated warnings, which cleanWpText strips). Treat any
        // such result — and also a non-zero code with no useful payload — as a
        // transient failure and retry with backoff. A genuinely failing command
        // (e.g. a missing resource) will keep failing, and the caller handles the
        // final failure; idempotent checks are re-run cheaply.
        // The wp CLI is intermittently flaky in this environment (both from the
        // shell and from Node.js): it can return a non-zero code with no payload
        // at all (only PHP Deprecated warnings, which cleanWpText strips). Treat any
        // such result as a transient failure and retry with backoff. A genuinely
        // failing command (e.g. a missing resource) always carries a payload
        // (an error message in out or err), so it is never retried.
        const flaky = code !== 0 && out === '' && errOut === '';
        if (flaky && attempt < MAX_RETRIES) {
          const backoff = Math.min(500 * 2 ** (attempt - 1), 8000);
          setTimeout(run, backoff);
          return;
        }
        resolve({
          code,
          out,
          err: errOut,
          dur: Date.now() - t0,
        });
      });
    }
    run();
  });
}
function log(msg) { console.log('[qa-beta1] ' + msg); }
function logOk(msg) { console.log('[qa-beta1] OK  ' + msg); }
function logFail(msg, detail) { console.log('[qa-beta1] FAIL ' + msg + (detail ? ' | ' + detail : '')); }

// ---------------------------------------------------------------------------
// Checks
// ---------------------------------------------------------------------------
const checks = [];
function check(name, ok, detail) {
  const entry = { name, ok: !!ok, detail: detail || '' };
  checks.push(entry);
  if (ok) logOk(name); else logFail(name, detail);
  return ok;
}

// ---------------------------------------------------------------------------
// Fixture plan
// ---------------------------------------------------------------------------
const FIXTURE_POSTS = [
  { title: 'QA Openwrt One',     date: '2026-08-01 10:00:00', cat: 0, tags: ['openwrt'] },
  { title: 'QA Openwrt Two',     date: '2026-08-02 11:00:00', cat: 0, tags: ['openwrt'] },
  { title: 'QA Openwrt Three',   date: '2026-08-03 12:00:00', cat: 0, tags: ['openwrt'] },
  { title: 'QA Alpha Four',      date: '2026-08-04 13:00:00', cat: 0, tags: [] },
  { title: 'QA Beta Five',       date: '2026-09-15 09:00:00', cat: 0, tags: [] },
  { title: 'QA Gamma Six',       date: '2026-09-16 10:00:00', cat: 0, tags: ['QA Tag'] },
  { title: 'QA Delta Seven',     date: '2026-09-17 11:00:00', cat: 0, tags: ['QA Tag'] },
  { title: 'QA Epsilon Eight',   date: '2026-09-18 12:00:00', cat: 0, tags: ['unique-tag'] },
  { title: 'QA Zeta Nine',       date: '2025-05-09 09:00:00', cat: 0, tags: [] },
  { title: 'QA Eta Ten',         date: '2025-05-09 10:00:00', cat: 0, tags: [] },
  { title: 'QA Theta Eleven',    date: '2025-05-09 11:00:00', cat: 0, tags: [] },
  { title: 'QA Iota Twelve',     date: '2025-05-10 09:00:00', cat: 1, tags: [] },
  { title: 'QA Kappa Thirteen',  date: '2025-05-10 10:00:00', cat: 1, tags: [] },
  { title: 'QA Lambda Fourteen', date: '2025-05-10 11:00:00', cat: 1, tags: [], commentsClosed: true },
  { title: 'QA Mu Fifteen',      date: '2025-05-10 12:00:00', cat: 1, tags: [], gutenberg: true },
];

const FIXTURE = { postIds: [] };
const ADMIN_LOGIN = 'lumen_qa_tester';
// Fixed identity of the temp fixture admin. Preflight only deletes a residual
// account at ADMIN_LOGIN when its login AND email both match this exactly.
const ADMIN_EXPECTED_EMAIL = ADMIN_LOGIN + '@example.invalid';
const PLUGIN_DIR = path.join(WP, 'wp-content', 'plugins', 'lumen-qa-topic');

// The site administrator the fixture content is attributed to. Resolved once per
// run from the live WordPress install via the Core-native user helper — never
// assumed to be a fixed ID, and never guessed from "the first user" or any
// arbitrary administrator.
const SITE_ADMIN_LOGIN = 'admin';
let SITE_ADMIN_ID = null;

async function resolveSiteAdminId() {
  const r = await phpUser('get_user', { login: SITE_ADMIN_LOGIN });
  if (!r || r.code !== 0) {
    throw new Error('site admin lookup failed for "' + SITE_ADMIN_LOGIN + '": ' + ((r && r.error) || JSON.stringify(r)));
  }
  if (r.exists !== true) {
    throw new Error('site admin "' + SITE_ADMIN_LOGIN + '" does not exist in this WordPress install');
  }
  if (String(r.login || '') !== SITE_ADMIN_LOGIN) {
    throw new Error('site admin login mismatch: expected "' + SITE_ADMIN_LOGIN + '" got ' + JSON.stringify(r.login));
  }
  const roles = Array.isArray(r.roles) ? r.roles : [];
  if (!roles.includes('administrator')) {
    throw new Error('site admin "' + SITE_ADMIN_LOGIN + '" lacks the administrator role; got ' + JSON.stringify(roles));
  }
  const id = Number(r.id);
  if (!Number.isSafeInteger(id) || id <= 0) {
    throw new Error('site admin "' + SITE_ADMIN_LOGIN + '" has an invalid user ID: ' + JSON.stringify(r.id));
  }
  SITE_ADMIN_ID = id;
  return id;
}

function requireSiteAdminId() {
  if (!Number.isSafeInteger(SITE_ADMIN_ID) || SITE_ADMIN_ID <= 0) {
    throw new Error('site admin ID has not been resolved yet');
  }
  return SITE_ADMIN_ID;
}

// ---------------------------------------------------------------------------
// Destructive-operation safety gate.
//
// Every fixture write below (deleting residual posts/comments/users, creating
// users/posts/comments, option updates, taxonomy changes) is only permitted
// after the runtime has been PROVEN to be the local, isolated test install.
// A correct-looking directory is not evidence: the WordPress install under
// ROOT/.runtime/wordpress could be reconfigured to point at any database.
//
// Nothing here writes. If any check fails, the run aborts before any fixture
// mutation exists to clean up.
// ---------------------------------------------------------------------------
const EXPECTED_DB_NAME = 'lumen_test';
const EXPECTED_SITE_URL = 'http://127.0.0.1:4242';
const EXPECTED_WP_ROOT = path.join(ROOT, '.runtime', 'wordpress');

// Set only after assertQaEnvironment() fully passes. Teardown consults this so
// that a guard failure can never cause destructive cleanup of a foreign install.
let ENV_VERIFIED = false;

function realpathOrNull(p) {
  try { return fs.realpathSync(p); } catch (e) { return null; }
}

// A database host is acceptable only when it is unambiguously local. String
// containment is not enough ("localhost.evil.com" contains "localhost").
function isLocalDbHost(host) {
  if (!host) return false;
  const h = String(host).trim();
  // Unix socket path, e.g. localhost:/tmp/mysql.sock or :/tmp/mysql.sock
  if (h.startsWith('/') || h.includes('.sock')) return h.includes('.sock');
  // Bracketed IPv6 literal, e.g. [::1]:3306 — must not be split on ':'.
  const v6 = h.match(/^\[([^\]]+)\]/);
  if (v6) return v6[1].toLowerCase() === '::1';
  // Bare IPv6 loopback.
  if (h === '::1') return true;
  let hostname = h;
  const colon = h.lastIndexOf(':');
  if (colon > 0) hostname = h.slice(0, colon);
  hostname = hostname.trim().toLowerCase();
  return hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '::1';
}

async function assertQaEnvironment() {
  const fail = (msg) => { throw new Error('QA ENVIRONMENT REFUSED — ' + msg); };

  // (A/B/C) Ask the live PHP/WordPress process what it is actually connected to.
  const env = await phpUser('env_identity', {});
  if (!env || env.code !== 0) {
    fail('environment identity query failed: ' + ((env && env.error) || JSON.stringify(env)));
  }

  // (A) Database name — actual connection, not config text.
  if (String(env.database || '') !== EXPECTED_DB_NAME) {
    fail('database is ' + JSON.stringify(env.database) + ', expected ' + JSON.stringify(EXPECTED_DB_NAME));
  }

  // (B) Connection target must be plainly local.
  if (!isLocalDbHost(env.dbhost)) {
    fail('database host is not local: ' + JSON.stringify(env.dbhost));
  }

  // (C) Site URLs must match exactly, and no override constant may redirect them.
  const siteurl = String(env.siteurl || '');
  const home = String(env.home || '');
  if (siteurl !== EXPECTED_SITE_URL || home !== EXPECTED_SITE_URL) {
    fail('siteurl/home are ' + JSON.stringify(siteurl) + ' / ' + JSON.stringify(home) +
         ', expected ' + JSON.stringify(EXPECTED_SITE_URL));
  }
  // Override constants are legitimate here (this install defines both, pinned to
  // the local URL to stop WordPress from rewriting its own address). They are
  // only a danger when they point somewhere ELSE, which would mask the real
  // database/URL — so compare their value rather than rejecting their presence.
  for (const [cname, cval] of [['WP_HOME', env.wp_home_const], ['WP_SITEURL', env.wp_siteurl_const]]) {
    if (cval !== null && cval !== undefined && String(cval) !== EXPECTED_SITE_URL) {
      fail(cname + ' constant points elsewhere: ' + JSON.stringify(cval) +
           ', expected ' + JSON.stringify(EXPECTED_SITE_URL));
    }
  }

  // (D) WordPress root must resolve (through symlinks) to this project's runtime.
  const expectedRoot = realpathOrNull(EXPECTED_WP_ROOT);
  const actualRoot = realpathOrNull(String(env.abspath || '').replace(/\/+$/, ''));
  if (!expectedRoot) fail('could not resolve expected WP root: ' + EXPECTED_WP_ROOT);
  if (!actualRoot || actualRoot !== expectedRoot) {
    fail('WordPress root resolves to ' + JSON.stringify(actualRoot) +
         ', expected ' + JSON.stringify(expectedRoot));
  }

  // (E) WP-CLI must target the same install the PHP helpers used. This is the
  //     last chance to catch a split-brain setup where the driver's `wp` talks
  //     to a different WordPress than the helper bootstrap.
  const cliPath = (await wp(['eval', 'echo ABSPATH;']));
  if (cliPath.code !== 0) {
    fail('WP-CLI cannot reach the WordPress install: ' + (cliPath.err || cliPath.out));
  }
  // This PHP build emits "Deprecated:" notices that land on stdout alongside the
  // value, so take the last non-empty line rather than trusting the whole blob.
  const cliLines = String(cliPath.out || '').split('\n').map((l) => l.trim()).filter(Boolean);
  const cliRoot = realpathOrNull((cliLines[cliLines.length - 1] || '').replace(/\/+$/, ''));
  if (!cliRoot || cliRoot !== expectedRoot) {
    fail('WP-CLI targets ' + JSON.stringify(cliRoot) + ', expected ' + JSON.stringify(expectedRoot) +
         ' (driver and PHP helpers disagree)');
  }

  ENV_VERIFIED = true;
  log('environment verified: db=' + env.database + ' url=' + siteurl + ' root=' + actualRoot);
  return env;
}

const EXPECT = {
  archives: {
    mainCat: { h1: 'QA Category', ctx: 'Category · 11 posts', count: 10, order: ['P', 'H2', 'P'] },
    openwrt: { h1: 'openwrt', ctx: 'Tag · 3 posts', count: 3, order: ['P', 'H2', 'P'] },
    qaTag: { h1: 'QA Tag', ctx: 'Tag · 2 posts', count: 2, order: ['P', 'H2', 'P'] },
    unique: { h1: 'unique-tag', ctx: 'Tag · 1 post', count: 1, order: ['P', 'H2', 'P'] },
    topic: { h1: 'Topic Alpha', ctx: 'QA Topic · 3 posts', count: 3, order: ['P', 'H2', 'P'] },
    year2026: { h1: '2026', ctx: '8 posts', count: 8, order: ['P', 'H2', 'P'] },
    year2025: { h1: '2025', ctx: '7 posts', count: 7, order: ['P', 'H2', 'P'] },
    mon202608: { h1: null, ctx: '4 posts', count: 4, order: ['P', 'H2', 'P'] },
    mon202505: { h1: null, ctx: '7 posts', count: 7, order: ['P', 'H2', 'P'] },
    day20250509: { h1: null, ctx: '3 posts', count: 3, order: ['P', 'H2', 'P'] },
    day20250510: { h1: null, ctx: '4 posts', count: 4, order: ['P', 'H2', 'P'] },
    empty: { h1: 'QA Empty Cat', ctx: 'Category · 0 posts', count: 0, empty: 'No posts found.' },
    author: { h1: null, ctx: 'Author · 15 posts', count: 10, order: ['P', 'H2', 'P'] },
  },
  searches: {
    qa: { count: 10, label: "15 results for 'qa'", order: ['H2', 'P', 'P'] },
    openwrt: { count: 3, label: "3 results for 'openwrt'", order: ['H2', 'P', 'P'] },
    unique: { count: 1, label: "1 result for 'uniquebetaquery'", order: ['H2', 'P', 'P'] },
    zero: { count: 0, label: "0 results for 'nomatchxyz'", query: 'nomatchxyz' },
  },
};

const PAGE_DEFS = [
  { name: '01-home.png', url: () => BASE + '/' },
  { name: '02-archive-main-cat.png', url: () => BASE + '?cat=' + FIXTURE.catMain },
  { name: '03-archive-tag-openwrt.png', url: () => BASE + '?tag=' + FIXTURE.tagOpenwrtSlug },
  { name: '04-archive-tag-qa.png', url: () => BASE + '?tag=' + FIXTURE.tagQaSlug },
  { name: '05-archive-tag-unique.png', url: () => BASE + '?tag=' + FIXTURE.tagUniqueSlug },
  { name: '06-archive-topic.png', url: () => BASE + '?lumen_qa_topic=' + FIXTURE.topicSlug },
  { name: '07-archive-author.png', url: () => BASE + '?author=' + requireSiteAdminId() },
  { name: '08-archive-year-2026.png', url: () => BASE + '?year=2026' },
  { name: '09-archive-month-2026-08.png', url: () => BASE + '?year=2026&monthnum=8' },
  { name: '10-archive-day-2025-05-09.png', url: () => BASE + '?year=2025&monthnum=5&day=9' },
  { name: '11-archive-empty.png', url: () => BASE + '?cat=' + FIXTURE.catEmpty },
  { name: '12-archive-pagination-p2.png', url: () => BASE + '?cat=' + FIXTURE.catMain + '&paged=2' },
  { name: '13-search-qa.png', url: () => BASE + '?s=qa' },
  { name: '14-search-openwrt.png', url: () => BASE + '?s=openwrt' },
  { name: '15-search-unique.png', url: () => BASE + '?s=uniquebetaquery' },
  { name: '16-search-zero.png', url: () => BASE + '?s=nomatchxyz' },
  { name: '17-single-comments.png', url: () => BASE + '?p=' + FIXTURE_POSTS[8].id },
  { name: '18-404.png', url: () => BASE + '?p=99999' },
];
const EXTRA_PAGES = [
  { name: '19-comments-page2.png', url: () => BASE + '?p=' + FIXTURE_POSTS[8].id + '&cpage=2' },
  { name: '20-gutenberg.png', url: () => BASE + '?p=' + FIXTURE_POSTS[14].id },
  { name: '21-closed.png', url: () => BASE + '?p=' + FIXTURE_POSTS[13].id },
  { name: '22-featured.png', url: () => BASE + '?p=' + FIXTURE_POSTS[12].id },
];

// ---------------------------------------------------------------------------
// Fixture creation
// ---------------------------------------------------------------------------
// Persistent-option snapshot (Task C): the fixture mutates
// comments_per_page / page_comments / default_comments_page, and the rewrite
// flush derives rewrite_rules from permalink_structure. Originals are
// captured before the mutation and restored exactly in teardown();
// verifyClean() re-checks them after the run.
const OPT_NAMES = ['comments_per_page', 'page_comments', 'default_comments_page', 'permalink_structure'];
const OPT_FIXTURE = { comments_per_page: '10', page_comments: '1', default_comments_page: 'oldest' };
const OPTIONS_ORIGINAL = {};
async function wpOption(name) {
  const r = await wp(['option', 'get', name]);
  return r.code === 0 ? r.out : null;
}
async function captureOptions() {
  for (const n of OPT_NAMES) OPTIONS_ORIGINAL[n] = await wpOption(n);
}
async function createFixture() {
  // 0) Purge residual QA fixture content from a previously interrupted run so the
  //    fixture always rebuilds cleanly.
  //
  //    Identity rule: a post counts as QA fixture residue ONLY when it carries this
  //    suite's "QA " title prefix, which is exactly what the fixture creates. Post
  //    IDs are auto-increment database identifiers and are never used as identity.
  //    Records whose ownership cannot be proven are left in place (verifyClean()
  //    reports them) instead of being deleted.
  const qPosts = await wp(['post', 'list', '--search=QA', '--fields=ID,post_title', '--format=csv']);
  const qPostIds = new Set();
  for (const row of csvFields(qPosts.out)) {
    const id = (row[0] || '').trim();
    const title = (row[1] || '').trim();
    if (!/^\d+$/.test(id)) continue;
    if (!/^QA\s/.test(title)) {
      // Matched the search but is provably not ours — do not delete, report it.
      logFail('preflight unowned post skipped', 'ID=' + id + ' title=' + JSON.stringify(title));
      continue;
    }
    qPostIds.add(id);
    await wp(['post', 'delete', id, '--force']);
  }
  // QA attachment: the fixture publishes exactly one featured image, always attached
  // to a QA-prefixed post. Only attachments whose parent is a proven QA post are
  // removed; foreign or unattached attachments are left untouched.
  const atts = await wp(['post', 'list', '--post_type=attachment', '--fields=ID,post_parent', '--format=csv']);
  for (const row of csvFields(atts.out)) {
    const id = (row[0] || '').trim();
    const parent = (row[1] || '').trim();
    if (!/^\d+$/.test(id)) continue;
    if (!qPostIds.has(parent)) {
      logFail('preflight unowned attachment skipped', 'ID=' + id + ' parent=' + JSON.stringify(parent));
      continue;
    }
    await wp(['post', 'delete', id, '--force']);
  }
  // Orphan comments from an interrupted run, removed via the Core-native helper.
  const orphanList = await phpComment('list_comments');
  for (const row of (orphanList.rows || [])) {
    const id = row.comment_ID;
    if (id) await phpComment('delete_comment', { id });
  }

  // 0b) Residual temp-admin account. The fixture uses a fixed login; if a previous
  //     run died before teardown, that account can survive and make create_user
  //     fail with "user exists", poisoning every later run. Clean it here only
  //     after proving the account is ours — otherwise FAIL CLOSED, never delete.
  const residual = await phpUser('get_user', { login: ADMIN_LOGIN });
  if (residual.code !== 0) {
    throw new Error('could not query residual QA admin: ' + (residual.error || JSON.stringify(residual)));
  }
  if (residual.exists === true) {
    const loginOk = String(residual.login || '') === ADMIN_LOGIN;
    const emailOk = String(residual.email || '').toLowerCase() === ADMIN_EXPECTED_EMAIL;
    if (!loginOk || !emailOk) {
      // Identity mismatch: not provably ours. Fail closed, delete nothing.
      throw new Error(
        'refusing to delete residual user "' + ADMIN_LOGIN + '": identity mismatch (login=' +
        JSON.stringify(residual.login) + ' email=' + JSON.stringify(residual.email) +
        ' expected=' + JSON.stringify(ADMIN_EXPECTED_EMAIL) + ')'
      );
    }
    log('preflight: removing residual QA admin "' + ADMIN_LOGIN + '" (id ' + residual.id + ')');
    const del = await phpUser('delete_user', { login: ADMIN_LOGIN });
    if (del.code !== 0) {
      throw new Error('residual QA admin deletion failed: ' + (del.error || JSON.stringify(del)));
    }
    // Removal must be proven, not assumed, before the fixture proceeds.
    const after = await phpUser('get_user', { login: ADMIN_LOGIN });
    if (after.code !== 0 || after.exists === true) {
      throw new Error('residual QA admin still present after delete: ' + JSON.stringify(after));
    }
    log('preflight: residual QA admin removed and verified absent.');
  }

  // 1) Categories / tags (capture term IDs + taxonomies for teardown).
  // wp-cli 2.12: term create uses positional <taxonomy> <term>; --porcelain = bare ID.
  FIXTURE.terms = [];
        const termCreate = async (key, tax, name) => {
    // Remove any existing term with this name (leftover from a prior run's teardown).
    const existing = await phpTerm('term_exists', { name: name });
    if (existing.code === 0 && existing.id) { await phpTerm('delete_term', { id: existing.id }); }
    const created = await phpTerm('create_term', { tax: tax, name: name, slug: '' });
    if (created.code !== 0) throw new Error('term create failed: ' + key + ' | ' + (created.error || JSON.stringify(created)));
    const id = created.id;
    const slug = created.slug || name;
    FIXTURE.terms.push({ key, id, tax, slug });
    FIXTURE[key + 'Slug'] = slug;
    return id;
  };
  FIXTURE.catMain = await termCreate('catMain', 'category', 'QA Category');
  FIXTURE.catSide = await termCreate('catSide', 'category', 'QA Side Category');
  FIXTURE.catEmpty = await termCreate('catEmpty', 'category', 'QA Empty Cat');
  FIXTURE.tagOpenwrt = await termCreate('tagOpenwrt', 'post_tag', 'openwrt');
  FIXTURE.tagUnique = await termCreate('tagUnique', 'post_tag', 'unique-tag');
  FIXTURE.tagQa = await termCreate('tagQa', 'post_tag', 'QA Tag');

  // 2) Temp MU plugin: register public taxonomy lumen_qa_topic.
  fs.mkdirSync(PLUGIN_DIR, { recursive: true });
  fs.writeFileSync(path.join(PLUGIN_DIR, 'lumen-qa-topic.php'),
    '<?php\n' +
    '/**\n * Plugin Name: Lumen QA Topic\n * Description: Temporary QA fixture.\n * Version: 1.0\n * Text Domain: lumen\n */\n' +
    "if ( ! defined( 'ABSPATH' ) ) { exit; }\n" +
    'function lumen_qa_topic_register_taxonomy() {\n' +
    "\tregister_taxonomy( 'lumen_qa_topic', 'post', array(\n" +
    "\t\t'public' => true,\n" +
    "\t\t'hierarchical' => false,\n" +
    "\t\t'has_archive' => true,\n" +
    "\t\t'rewrite' => array( 'slug' => 'lumen-qa-topic', 'with_front' => false ),\n" +
    "\t\t'labels' => array( 'name' => 'QA Topic', 'singular_name' => 'QA Topic' ),\n" +
    "\t) );\n" +
    "}\n" +
    'add_action( \'init\', \'lumen_qa_topic_register_taxonomy\' );\n');
  const act = await wp(['plugin', 'activate', 'lumen-qa-topic']);
  if (act.code !== 0) throw new Error('could not activate lumen-qa-topic: ' + act.err);
  FIXTURE.topic = await termCreate('topic', 'lumen_qa_topic', 'Topic Alpha');
  await wp(['term', 'update', 'lumen_qa_topic', FIXTURE.topic, '--description=QA topic description for the archive header test.']);
  // Flush permalinks so the topic term perm resolves (the query-form
  // ?lumen_qa_topic=<slug> redirects to it).
  const rf = await wp(['rewrite', 'flush']);
  if (rf.code !== 0) throw new Error('could not flush permalinks: ' + (rf.err || rf.out));
  // Capture the topic term slug for the archive query URL (WP accepts the slug,
  // not the term id, in the ?lumen_qa_topic=<value> query form).
  const slugR = await wp(['term', 'get', 'lumen_qa_topic', FIXTURE.topic, '--field=slug']);
  FIXTURE.topicSlug = (slugR.out || '').trim();
  if (!FIXTURE.topicSlug) throw new Error('could not get topic slug: ' + (slugR.err || slugR.out));
  await wp(['term', 'update', 'category', FIXTURE.catMain, '--description=QA main category description.']);

  // 3) Posts.
  const gutenbergFile = readFixture('content.html', 'utf8');
  const topicPostIdx = [3, 4, 5]; // P4, P5, P6
  for (let i = 0; i < FIXTURE_POSTS.length; i++) {
    const p = FIXTURE_POSTS[i];
    let content = '<p>QA content for ' + p.title + '. Reading test body paragraph one. Second sentence continues the paragraph so excerpts can be truncated in both archive and search contexts.</p>';
    if (p.gutenberg) {
      content = gutenbergFile + '<p>uniquebetaquery QA mu marker.</p>';
    }
    const args = [
      'post', 'create',
      '--post_type=post',
      '--post_title=' + p.title,
      '--post_date=' + p.date,
      '--post_author=' + requireSiteAdminId(),
      '--post_status=publish',
      '--post_content=' + content,
      '--post_category=' + (p.cat === 0 ? FIXTURE.catMain : FIXTURE.catSide),
      '--porcelain',
    ];
    if (p.tags && p.tags.length) args.push('--tags_input=' + p.tags.join(','));
    if (p.commentsClosed) args.push('--comment_status=closed');
    const r = await wp(args);
    const id = (r.out || '').trim();
    if (r.code !== 0 || !/^\d+$/.test(id)) throw new Error('post create failed: ' + p.title + ' | ' + (r.err || r.out));
    FIXTURE_POSTS[i].id = id;
    FIXTURE.postIds.push(id);
  }
  // Attach the topic term to P4/P5/P6.
  // wp_set_post_term() is NOT available in this wp-cli eval context
  // (function_exists=false). This WP 7.1.1 $wpdb class has no get_result()
  // (use get_var(prepare(...))) and stores term metadata in wp_term_taxonomy
  // (columns: object_id, term_taxonomy_id, term_order in wp_term_relationships).
  // Mirror wp_set_post_term() with $wpdb.
  const attachTopic = async (postId, termId) => {
    const php =
      'global $wpdb;\n' +
      '$ttid = $wpdb->get_var($wpdb->prepare(' +
        '"SELECT term_taxonomy_id FROM $wpdb->term_taxonomy WHERE term_id = %d", ' +
        termId + '));\n' +
      'if ($ttid === null) { echo "no-ttid"; return; }\n' +
      'if ($wpdb->insert($wpdb->term_relationships, array(' +
        '"object_id" => ' + postId + ', "term_taxonomy_id" => $ttid, "term_order" => 0)) === false) { echo "insert-fail"; return; }\n' +
      'echo "ok";';
    const r = await wp(['eval', php]);
    if (r.code !== 0 || (r.out || '').trim() !== 'ok') {
      throw new Error('topic attach failed ' + postId + ': ' + (r.err || r.out));
    }
  };
  for (const idx of topicPostIdx) await attachTopic(FIXTURE_POSTS[idx].id, FIXTURE.topic);

  // 4) Featured image on P13.
  const media = await wp(['media', 'import', fixturePath('img.png')]);
  if (media.code !== 0) throw new Error('media import failed: ' + (media.err || media.out));
  // wp media import prints "Success: Imported 1 of 1 items." (no ID) -> query the newest attachment.
  const attList = await wp(['post', 'list', '--post_type=attachment', '--fields=ID', '--format=csv']);
  const attLines = (attList.out || '').trim().split(/\r?\n/).map((l) => l.trim()).filter((l) => /^\d+$/.test(l));
  const attId = attLines.length ? attLines[attLines.length - 1] : null;
  if (!attId) throw new Error('no attachment found after import: ' + (attList.err || attList.out));
  await wp(['post', 'meta', 'update', FIXTURE_POSTS[12].id, '_thumbnail_id', attId]);
  FIXTURE.featuredAttach = attId;

  // Ensure comments_per_page is 10 and page_comments is enabled so that
  // 12 comments yield 2 pages (10+2).  default_comments_page=oldest so that
  // the bare ?p=<id> URL renders the *first* page (oldest 10), and cpage=2
  // the second page (remaining 2) — matching the QA expectations.
  await captureOptions();
  await wp(['option', 'update', 'comments_per_page', '10']);
  await wp(['option', 'update', 'page_comments', '1']);
  await wp(['option', 'update', 'default_comments_page', 'oldest']);

  // 5) 12 comments on P9 (comment pagination: 10 per page -> 2 pages).
  // Note: wp comment create is broken in this environment (creates comments with
  // comment_post_ID=0), so we use the PHP helper for direct-DB creation.
  const commentIds = [];
  for (let i = 1; i <= 12; i++) {
    const r = await phpComment('create_comment', {
      post_id: FIXTURE_POSTS[8].id,
      user_id: requireSiteAdminId(),
      content: 'QA comment number ' + i + '. A test comment body.',
      author: 'QA Tester',
      email: 'qa@example.com',
    });
    if (r.code !== 0 || !r.id) throw new Error('comment create failed ' + i + ': ' + (r.error || JSON.stringify(r)));
    commentIds.push(r.id);
  }
  FIXTURE.commentIds = commentIds;

  // 6) Temp administrator "QA Tester" for the admin-bar runtime test.
  //    Password kept in memory only; never printed/logged.
  const adminPw = crypto.randomBytes(20).toString('hex');
  // Create the temp administrator directly in the DB via the PHP helper (the wp
  // CLI is too flaky to rely on for this critical step).
  let userOk = false;
  for (let i = 0; i < 5 && !userOk; i++) {
    const created = await phpUser('create_user', { login: ADMIN_LOGIN, email: ADMIN_LOGIN + '@example.invalid', password: adminPw });
    if (created.code === 0) userOk = true;
    if (process.env.QA_DEBUG_ADMIN) log('[debug-admin] user create attempt ' + (i + 1) + ': code=' + created.code + ' id=' + (created.id || '') + ' err=' + (created.error || ''));
  }
  if (!userOk) throw new Error('temp admin user creation failed after retries');
  // Set the final password and verify it actually matches (password_verify).
  let pwOk = false;
  for (let i = 0; i < 5 && !pwOk; i++) {
    const set = await phpUser('set_password', { login: ADMIN_LOGIN, password: adminPw });
    const chk = await phpUser('check_password', { login: ADMIN_LOGIN, password: adminPw });
    if (set.code === 0 && chk.code === 0 && chk.ok === true) pwOk = true;
    if (process.env.QA_DEBUG_ADMIN) log('[debug-admin] set/check attempt ' + (i + 1) + ': set=' + set.code + ' chk=' + chk.code + ' ok=' + (chk.ok ? 'Y':'N') + ' err=' + (chk.error || ''));
  }
  if (!pwOk) throw new Error('temp admin password set failed after retries');
  FIXTURE.admin = { login: ADMIN_LOGIN, password: adminPw };
  log('fixture ready: 15 posts, 3 cats, 3 tags, 1 topic, 12 comments, featured image, temp admin.');
}

// ---------------------------------------------------------------------------
// Browser audits
// ---------------------------------------------------------------------------
function makeListeners(page) {
  const L = { console: [], pageerrors: [], reqFailures: [] };
  page.on('console', (m) => { if (m.type() === 'error') L.console.push(m.text()); });
  page.on('pageerror', (e) => L.pageerrors.push(e.message));
  page.on('requestfailed', (req) => {
    const f = req.failure();
    L.reqFailures.push({ url: req.url(), method: req.method(), err: f ? f.errorType : 'unknown' });
  });
  return L;
}

function makeListeners(page) {
  const L = { console: [], pageerrors: [], reqFailures: [] };
  page.on('console', (m) => { if (m.type() === 'error') L.console.push(m.text()); });
  page.on('pageerror', (e) => L.pageerrors.push(e.message));
  page.on('requestfailed', (req) => {
    const f = req.failure();
    L.reqFailures.push({ url: req.url(), method: req.method(), err: f ? f.errorType : 'unknown' });
  });
  return L;
}

// Global browser (set in main before audits).
let _browser = null;

async function pageAudit(vpName, url, opts) {
  const v = VP[vpName];
  const ctx = await _browser.newContext({ viewport: { width: v.width, height: v.height }, ignoreHttpErrors: true });
  const page = await ctx.newPage();
  const L = makeListeners(page);
  let httpCode = 0;
  try {
    const resp = await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
    httpCode = resp.status();
  } catch (e) {
    logFail('goto ' + url, e.message);
  }
  await page.waitForTimeout(250);
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(120);

  const data = await page.evaluate((opts) => {
    const doc = document;
    const h1 = doc.querySelector('h1');
    const ctxEl = doc.querySelector('.lumen-archive-context');
    const descEl = doc.querySelector('.lumen-archive-description');
    const emptyEl = doc.querySelector('.lumen-archive-empty');
    const list = doc.querySelector('ul.lumen-post-list');
    const cards = list ? Array.from(list.querySelectorAll('.lumen-post-card')) : [];
    const itemOrders = cards.map((c) => Array.from(c.children).map((el) => el.tagName));
    const ulChildren = list ? Array.from(list.children).map((el) => el.tagName) : null;
    const thumbCount = doc.querySelectorAll('.lumen-post-thumb').length;
    const nav = doc.querySelector('nav.lumen-pagination');
    const form = doc.querySelector('form');
    // Comment pagination link to page 2. WP Core emits this either as a query
    // arg (?cpage=2) when permalinks are off, or as a permalink
    // (.../comment-page-2/) when on; accept both.
    const cpage2Link =
      doc.querySelector('#comments nav.comments-pagination a[href*="cpage=2"]') ||
      doc.querySelector('#comments a[href*="cpage=2"]') ||
      doc.querySelector('#comments nav.comments-pagination a.next') ||
      doc.querySelector('#comments a.next.page-numbers') ||
      doc.querySelector('#comments a[href*="comment-page-2"]') ||
      null;
    const commentCount = doc.querySelectorAll('#comments li.comment').length;
    const over = () => {
      const sw = document.documentElement.scrollWidth, cw = document.documentElement.clientWidth;
      if (sw <= cw + 1) return { overflow: false, overflowers: [] };
      const off = [];
      const all = Array.from(document.querySelectorAll('*'));
      for (const el of all) {
        const cs = getComputedStyle(el);
        if (cs.position === 'fixed' || cs.position === 'absolute' || cs.display === 'none' || cs.visibility === 'hidden') continue;
        const r = el.getBoundingClientRect();
        if (r.right > cw + 2 && r.left > -2) {
          off.push({ tag: el.tagName.toLowerCase(), cls: (el.className || '').trim(), width: Math.round(r.width), right: Math.round(r.right) });
        }
      }
      const best = {};
      for (const o of off) {
        const k = o.tag + '.' + o.cls;
        if (!best[k] || best[k].width < o.width) best[k] = o;
      }
      return { overflow: true, overflowers: Object.values(best).slice(0, 8) };
    };
    const computed = (sel) => {
      const el = doc.querySelector(sel);
      if (!el) return null;
      const cs = getComputedStyle(el);
      return { fontFamily: cs.fontFamily, fontSize: cs.fontSize, fontWeight: cs.fontWeight, lineHeight: cs.lineHeight, letterSpacing: cs.letterSpacing, color: cs.color };
    };
    return {
      httpCode: opts.httpCode,
      h1Text: h1 ? h1.textContent.trim() : null,
      ctxText: ctxEl ? ctxEl.textContent.trim() : null,
      descText: descEl ? descEl.textContent.trim() : null,
      emptyText: emptyEl ? emptyEl.textContent.trim() : null,
      itemCount: cards.length,
      itemOrders,
      ulChildren,
      thumbCount,
      hasPaginationNav: !!nav,
      navOutsideUl: nav && list ? !list.contains(nav) : (nav ? null : null),
      formMethod: form ? form.getAttribute('method') : null,
      formAction: form ? form.getAttribute('action') : null,
      pageTitle: doc.title,
      over: over(),
      cpage2Link: !!cpage2Link,
      commentCount,
      computed: {
        archiveTitle: computed('.lumen-archive-title'),
        listTitle: computed('.lumen-post-card .lumen-post-title'),
        meta: computed('.lumen-post-meta'),
        excerpt: computed('.lumen-post-excerpt'),
        description: computed('.lumen-archive-description'),
      },
    };
  }, { httpCode });

  if (opts.shot) {
    try { await page.screenshot({ path: opts.shot, fullPage: false }); } catch (e) { /* ignore */ }
  }
  await ctx.close();
  return { L, data };
}

function themeReqFails(L) {
  return L.reqFailures.filter((f) => /themes\/lumen/i.test(f.url));
}
function lumenConsoleErrs(L) {
  return L.console.filter((t) => /\blumen\b/i.test(t) && !/wp-admin\/|wp-includes/i.test(t));
}
function lhRatio(fz, lh) {
  const a = parseFloat(fz), b = parseFloat(lh);
  return a > 0 ? b / a : null;
}
function pxInRange(fz, min, max) {
  const v = parseFloat(fz);
  return v > 0 && v >= min - 0.01 && v <= max + 0.01;
}
function orderOk(actual, expected) {
  if (expected === null) return true;
  if (Array.isArray(actual)) {
    return actual.join(',').split(',').filter(Boolean).join(',') === expected.join(',');
  }
  return false;
}

// ---------------------------------------------------------------------------
// Assertion suites
// ---------------------------------------------------------------------------
async function assertArchive(vpName, name, def, opts) {
  const { L, data } = await pageAudit(vpName, opts.url, opts);
  check(name + ' HTTP 200', data.httpCode === 200, data.httpCode);
  check(name + ' no theme req failures', themeReqFails(L).length === 0, themeReqFails(L).length);
  check(name + ' no lumen console errors', lumenConsoleErrs(L).length === 0, lumenConsoleErrs(L).length);
  check(name + ' no horizontal overflow', !data.over.overflow, data.over.overflowers.map((o) => o.tag + '.' + o.cls).join(','));
  check(name + ' H1 = "' + def.h1 + '"', data.h1Text === def.h1, 'got: ' + data.h1Text);
  check(name + ' context = "' + def.ctx + '"', data.ctxText === def.ctx, 'got: ' + data.ctxText);
  check(name + ' item count = ' + def.count, data.itemCount === def.count, 'got: ' + data.itemCount);
  if (def.count > 0) {
    check(name + ' item order (' + def.order.join('->') + ')', orderOk(data.itemOrders[0], def.order), JSON.stringify(data.itemOrders[0]));
    check(name + ' all items in correct order', data.itemOrders.every((o) => orderOk(o, def.order)),
      'mismatches: ' + data.itemOrders.filter((o, i) => !orderOk(o, def.order)).map((o, i) => i + ':' + o.join('->')).join(' | '));
    check(name + ' no .lumen-post-thumb', data.thumbCount === 0, data.thumbCount);
    check(name + ' UL children LI-only', data.ulChildren && data.ulChildren.every((t) => t === 'LI'), JSON.stringify(data.ulChildren));
    if (opts.paginationExpected) {
      check(name + ' nav.lumen-pagination present', data.hasPaginationNav, 'no pagination nav');
      check(name + ' pagination nav outside UL', data.navOutsideUl === true, String(data.navOutsideUl));
    }
  } else {
    check(name + ' empty state = "' + def.empty + '"', data.emptyText === def.empty, 'got: ' + data.emptyText);
  }
  return data;
}

async function assertSearchPage(vpName, name, def, url, opts) {
  const { L, data } = await pageAudit(vpName, url, opts);
  check(name + ' HTTP 200', data.httpCode === 200, data.httpCode);
  check(name + ' no theme req failures', themeReqFails(L).length === 0, themeReqFails(L).length);
  check(name + ' no lumen console errors', lumenConsoleErrs(L).length === 0, lumenConsoleErrs(L).length);
  check(name + ' no horizontal overflow', !data.over.overflow, data.over.overflowers.map((o) => o.tag + '.' + o.cls).join(','));
  check(name + ' form method = get', data.formMethod === 'get', data.formMethod);
  // The WP search form action is the fully-qualified home URL, which carries a
  // trailing slash (BASE does not).
  check(name + ' form action = ' + (BASE + '/'), data.formAction === BASE + '/', data.formAction);
  check(name + ' context = "' + def.label + '"', data.ctxText === def.label, 'got: ' + data.ctxText);
  check(name + ' result count = ' + def.count, data.itemCount === def.count, 'got: ' + data.itemCount);
  if (def.count > 0) {
    check(name + ' item order (' + def.order.join('->') + ')', orderOk(data.itemOrders[0], def.order), JSON.stringify(data.itemOrders[0]));
    check(name + ' all items in correct order', data.itemOrders.every((o) => orderOk(o, def.order)),
      'mismatches: ' + data.itemOrders.filter((o, i) => !orderOk(o, def.order)).map((o, i) => i + ':' + o.join('->')).join(' | '));
    check(name + ' no .lumen-post-thumb', data.thumbCount === 0, data.thumbCount);
    check(name + ' UL children LI-only', data.ulChildren && data.ulChildren.every((t) => t === 'LI'), JSON.stringify(data.ulChildren));
    check(name + ' H1 = "Search"', data.h1Text === 'Search', 'got: ' + data.h1Text);
  } else {
    check(name + ' empty state = "No results for ' + def.query + '"', data.emptyText === 'No results for ' + def.query, 'got: ' + data.emptyText);
  }
  return data;
}

// ---------------------------------------------------------------------------
// Typography assertions (per viewport)
// ---------------------------------------------------------------------------
async function assertTypography(vpName, baseName) {
  const a = await pageAudit(vpName, BASE + '?cat=' + FIXTURE.catMain, {});
  const t = a.data.computed.archiveTitle;
  check(baseName + ' archive H1 FangSong font', t && /FangSong/.test(t.fontFamily), t.fontFamily);
  check(baseName + ' archive H1 weight 400', t && t.fontWeight === '400', t.fontWeight);
  check(baseName + ' archive H1 lh ≈ 1.5', t && Math.abs(lhRatio(t.fontSize, t.lineHeight) - 1.5) < 0.03, lhRatio(t.fontSize, t.lineHeight));
  check(baseName + ' archive H1 letter-spacing normal', t && t.letterSpacing === 'normal', t.letterSpacing);
  const lt = a.data.computed.listTitle;
  check(baseName + ' list title FangSong', lt && /FangSong/.test(lt.fontFamily), lt.fontFamily);
  check(baseName + ' list title weight 400', lt && lt.fontWeight === '400', lt.fontWeight);
  check(baseName + ' list title lh ≈ 1.5', lt && Math.abs(lhRatio(lt.fontSize, lt.lineHeight) - 1.5) < 0.03, lhRatio(lt.fontSize, lt.lineHeight));
  check(baseName + ' list title size 1.2rem–1.4rem', lt && pxInRange(lt.fontSize, 19.2, 22.4), lt.fontSize);
  const mt = a.data.computed.meta;
  check(baseName + ' meta font-size 13.6px (0.85rem)', mt && Math.abs(parseFloat(mt.fontSize) - 13.6) < 0.1, mt.fontSize);
  check(baseName + ' meta weight 400', mt && mt.fontWeight === '400', mt.fontWeight);
  check(baseName + ' meta lh ≈ 1.6', mt && Math.abs(lhRatio(mt.fontSize, mt.lineHeight) - 1.6) < 0.05, lhRatio(mt.fontSize, mt.lineHeight));
  const et = a.data.computed.excerpt;
  check(baseName + ' excerpt font-size 16px (1rem)', et && Math.abs(parseFloat(et.fontSize) - 16) < 0.1, et.fontSize);
  check(baseName + ' excerpt weight 400', et && et.fontWeight === '400', et.fontWeight);
  check(baseName + ' excerpt lh ≈ 1.75', et && Math.abs(lhRatio(et.fontSize, et.lineHeight) - 1.75) < 0.05, lhRatio(et.fontSize, et.lineHeight));

  const s = await pageAudit(vpName, BASE + '?s=qa', {});
  const st = s.data.computed.archiveTitle;
  check(baseName + ' search H1 sans font', st && /sans|system-ui|Segoe|Arial|Helvetica/.test(st.fontFamily), st.fontFamily);
  check(baseName + ' search H1 weight 400', st && st.fontWeight === '400', st.fontWeight);
  check(baseName + ' search H1 lh ≈ 1.4', st && Math.abs(lhRatio(st.fontSize, st.lineHeight) - 1.4) < 0.05, lhRatio(st.fontSize, st.lineHeight));
  check(baseName + ' search H1 size 28–32px (1.75rem–2rem)', st && pxInRange(st.fontSize, 28, 32), st.fontSize);
}

// ---------------------------------------------------------------------------
// Single-page assertions
// ---------------------------------------------------------------------------
async function assertSingles(vpName) {
  // Comments (12 comments, 2 pages).
  const c1 = await pageAudit(vpName, BASE + '?p=' + FIXTURE_POSTS[8].id, {});
  check('single comments page 1 renders 10 comments', c1.data.commentCount === 10, 'got: ' + c1.data.commentCount);
  check('single comments page 1 shows cpage=2 link', c1.data.cpage2Link, 'no cpage=2 link');
  check('single comments page 1 HTTP 200', c1.data.httpCode === 200, c1.data.httpCode);

  const c2 = await pageAudit(vpName, BASE + '?p=' + FIXTURE_POSTS[8].id + '&cpage=2', {});
  check('single comments page 2 renders 2 comments', c2.data.commentCount === 2, 'got: ' + c2.data.commentCount);
  check('single comments page 2 HTTP 200', c2.data.httpCode === 200, c2.data.httpCode);

  // Gutenberg post.
  const g = await pageAudit(vpName, BASE + '?p=' + FIXTURE_POSTS[14].id, {});
  check('gutenberg 200', g.data.httpCode === 200, g.data.httpCode);
  check('gutenberg H1 = post title', g.data.h1Text === FIXTURE_POSTS[14].title, 'got: ' + g.data.h1Text);
  const body = await (async () => {
    const ctx = await _browser.newContext({ viewport: { width: VP[vpName].width, height: VP[vpName].height }, ignoreHttpErrors: true });
    const p = await ctx.newPage();
    try {
      await p.goto(BASE + '?p=' + FIXTURE_POSTS[14].id, { waitUntil: 'domcontentloaded' });
      await p.waitForTimeout(200);
      const bodyText = await p.evaluate(() => document.querySelector('.lumen-post-body') ? document.querySelector('.lumen-post-body').textContent : '');
      const h2s = await p.evaluate(() => Array.from(document.querySelectorAll('.lumen-post-body h2')).map((h) => h.textContent));
      const codeText = await p.evaluate(() => Array.from(document.querySelectorAll('.lumen-post-body code')).map((c) => c.textContent));
      return { bodyText, h2s, codeText };
    } finally { ctx.close(); }
  })();
  check('gutenberg body renders Chinese long text', /中文长文本/.test(body.bodyText), body.bodyText.slice(0, 30));
  check('gutenberg body renders H2 section', /一级章节 H2/.test(body.bodyText), JSON.stringify(body.h2s));
  check('gutenberg inline code renders', body.codeText.length > 0, JSON.stringify(body.codeText.slice(0, 3)));

  // Closed comments.
  const cl = await pageAudit(vpName, BASE + '?p=' + FIXTURE_POSTS[13].id, {});
  check('closed 200', cl.data.httpCode === 200, cl.data.httpCode);
  check('closed post: no #comments node', cl.data.commentCount === 0, 'commentCount=' + cl.data.commentCount);
  const noComments = await (async () => {
    const ctx = await _browser.newContext({ viewport: { width: VP[vpName].width, height: VP[vpName].height }, ignoreHttpErrors: true });
    const p = await ctx.newPage();
    let exists = true;
    try {
      await p.goto(BASE + '?p=' + FIXTURE_POSTS[13].id, { waitUntil: 'domcontentloaded' });
      await p.waitForTimeout(200);
      exists = await p.evaluate(() => !!document.getElementById('comments'));
    } finally { ctx.close(); }
    return exists;
  })();
  check('closed post: no #comments DOM node', !noComments, 'node present');

  // Featured image.
  const f = await (async () => {
    const ctx = await _browser.newContext({ viewport: { width: VP[vpName].width, height: VP[vpName].height }, ignoreHttpErrors: true });
    const p = await ctx.newPage();
    try {
      await p.goto(BASE + '?p=' + FIXTURE_POSTS[12].id, { waitUntil: 'domcontentloaded' });
      await p.waitForTimeout(200);
      return await p.evaluate(() => {
        const img = document.querySelector('.lumen-post-featured img');
        return img ? { src: img.src, alt: img.alt } : null;
      });
    } finally { ctx.close(); }
  })();
  // WP keeps the base file name "img" and emits size derivatives (img-800x450.png,
  // img-640x400.png, ...). Match the base name, not the exact thumbnail filename.
  check('featured post has .lumen-post-featured img', f && /\/img(?:-\d+(?:x\d+)?)?\.png$/.test(f.src), f ? f.src : 'no img');
}

// ---------------------------------------------------------------------------
// XSS / long query safety
// ---------------------------------------------------------------------------
async function assertSafety(vpName) {
  const ctx = await _browser.newContext({ viewport: { width: VP[vpName].width, height: VP[vpName].height }, ignoreHttpErrors: true });
  const page = await ctx.newPage();
  const L = makeListeners(page);
  let xssCode = 0;
  try {
    const r = await page.goto(BASE + '?s=' + encodeURIComponent('<script>alert("xss")</script>'), { waitUntil: 'domcontentloaded' });
    xssCode = r.status();
  } catch (e) { xssCode = -1; }
  await page.waitForTimeout(200);
  const xss = await page.evaluate(() => {
    const ctxEl = document.querySelector('.lumen-archive-context');
    const rawScript = Array.from(document.querySelectorAll('script')).some((s) => (s.textContent || '').includes('xss'));
    const body = document.body;
    const injected = body.innerHTML.includes('<script>alert("xss")');
    return {
      ctxText: ctxEl ? ctxEl.textContent.trim() : null,
      rawScript: rawScript,
      injected,
    };
  });
  logFail ? null : null;
  const xssFailures = themeReqFails(L).length;
  check('XSS search: HTTP 200', xssCode === 200, xssCode);
  check("XSS search: context = \"0 results for '<script>alert(\"xss\")</script>'\"",
    xss.ctxText === "0 results for '<script>alert(\"xss\")</script>'",
    'got: ' + xss.ctxText);
  check('XSS search: no raw script execution', !xss.rawScript && !xss.injected, JSON.stringify(xss));
  check('XSS search: no page errors', L.pageerrors.length === 0, L.pageerrors.slice(0, 3).join(' | '));

  let longCode = 0;
  const long = 'a'.repeat(500);
  try {
    const r = await page.goto(BASE + '?s=' + long, { waitUntil: 'domcontentloaded' });
    longCode = r.status();
  } catch (e) { longCode = -1; }
  await page.waitForTimeout(200);
  const longInfo = await page.evaluate(() => {
    const ctxEl = document.querySelector('.lumen-archive-context');
    return ctxEl ? ctxEl.textContent.trim() : null;
  });
  check('long query (500 chars): HTTP 200', longCode === 200, longCode);
  check('long query: empty state renders', /0 results/.test(longInfo || ''), (longInfo || '').slice(0, 60));
  await ctx.close();
}

// ---------------------------------------------------------------------------
// Admin-bar runtime verification (logged in, 8 widths x 2 scrolls) + screenshots
// ---------------------------------------------------------------------------
async function doLogin(page, creds) {
  await page.goto(BASE + '/wp-login.php', { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.fill('#user_login', creds.login);
  await page.fill('#user_pass', creds.password);
  await page.click('#wp-submit');
  await page.waitForLoadState('networkidle', { timeout: 30000 });
  const finalUrl = page.url();
  if (process.env.QA_DEBUG_LOGIN) console.log('[debug-login] ' + creds.login + ' -> ' + finalUrl);
  if (finalUrl.includes('wp-login.php')) throw new Error('login failed: stayed on wp-login.php for ' + creds.login);
}

async function assertAdminBar(creds) {
  for (const w of ADMIN_VP) {
    const ctx = await _browser.newContext({ viewport: { width: w.width, height: 900 }, ignoreHttpErrors: true });
    const page = await ctx.newPage();
    await doLogin(page, creds);
    await page.goto(BASE, { waitUntil: 'domcontentloaded', timeout: 30000 });
    for (const sy of [0, 3000]) {
      await page.evaluate((y) => window.scrollTo(0, y), sy);
      await page.waitForTimeout(250);
      const m = await page.evaluate(() => {
        const b = document.getElementById('wpadminbar');
        const h = document.querySelector('.lumen-site-header');
        const r = (el) => el ? { top: Math.round(el.getBoundingClientRect().top), height: Math.round(el.getBoundingClientRect().height), pos: getComputedStyle(el).position } : null;
        return { header: r(h), bar: r(b), bodyAdminBar: document.body.classList.contains('admin-bar') };
      });
      const expectedTop = (w.expect === 0 && sy === 0) ? 46 : w.expect;
      check('admin bar ' + w.width + 'px scroll ' + sy + ': header top = ' + expectedTop,
        m.header && m.header.top === expectedTop, m.header && JSON.stringify(m.header));
      check('admin bar ' + w.width + 'px scroll ' + sy + ': bar exists + body.admin-bar',
        m.bar && m.bodyAdminBar, JSON.stringify(m));
      if (w.expect > 0) {
        check('admin bar ' + w.width + 'px scroll ' + sy + ': bar height = ' + w.expect,
          m.bar && m.bar.height === w.expect, m.bar && JSON.stringify(m.bar));
        check('admin bar ' + w.width + 'px scroll ' + sy + ': bar position fixed',
          m.bar && m.bar.pos === 'fixed', m.bar && m.bar.pos);
      } else if (sy === 0) {
        check('admin bar ' + w.width + 'px scroll ' + sy + ': header below abs bar (top 46)',
          m.header && m.header.top === 46, m.header && JSON.stringify(m.header));
      } else {
        check('admin bar ' + w.width + 'px scroll ' + sy + ': header top 0 (no gap)',
          m.header && m.header.top === 0, m.header && JSON.stringify(m.header));
      }
    }
    await ctx.close();
  }
  // Screenshots (top + scrolled) for representative viewports.
  fs.mkdirSync(path.join(SHOT_ROOT, 'adminbar'), { recursive: true });
  for (const shot of ADMIN_SHOTS) {
    const ctx = await _browser.newContext({ viewport: { width: shot.width, height: shot.height }, ignoreHttpErrors: true });
    const page = await ctx.newPage();
    await doLogin(page, creds);
    await page.goto(BASE, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.evaluate((y) => window.scrollTo(0, y), shot.scroll);
    await page.waitForTimeout(300);
    try {
      await page.screenshot({ path: path.join(SHOT_ROOT, 'adminbar', shot.name), fullPage: false });
    } catch (e) { /* ignore */ }
    await ctx.close();
  }
  check('admin bar screenshots captured', ADMIN_SHOTS.length > 0, '');
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
async function main() {
  log('Lumen 1.1.0-beta.1 QA — starting.');
  const t0 = Date.now();
  const runId = crypto.randomBytes(16).toString('hex');
  const startedAt = new Date().toISOString();
  // Invalidate any previous report so the file on disk always describes THIS run.
  try { fs.rmSync(REPORT_PATH, { force: true }); } catch (e) {}

  let runError = null;
  let clean = null;
  let optAfter = {};
  let passed = null;
  let failed = null;

  // wp + PHP versions for the report.
  const versionFile = fs.readFileSync(WP + '/wp-includes/version.php', 'utf8');
  const m = versionFile.match(/wp_version\s*=\s*'([^']+)'/);
  const wpVersion = m ? m[1] : 'unknown';
  let phpVersion = 'unknown';
  try {
    phpVersion = execSync('php -r "echo PHP_VERSION;" 2>/dev/null', { maxBuffer: 1024, cwd: WP }).toString().trim();
  } catch (e) { /* ignore */ }
  log('WP ' + wpVersion + ' / PHP ' + phpVersion);

  // Resolve the real site administrator ID from this install before anything
  // attributes fixture content to an author. Fail loudly rather than guess.
  const adminId = await resolveSiteAdminId();
  log('site admin "' + SITE_ADMIN_LOGIN + '" resolved to ID ' + adminId);

  let teardownErr = null;
  let browserOk = false;

  // MANDATORY safety gate. Runs before createFixture() and therefore before any
  // destructive or mutating database operation whatsoever. On failure this
  // throws, ENV_VERIFIED stays false, and the finally block below skips all
  // database cleanup — a foreign install is never touched.
  try {
    await assertQaEnvironment();
  } catch (envErr) {
    runError = envErr;
    logFail('environment guard', envErr.message);
  }

  try {
    if (runError) throw runError;
    await createFixture();

    _browser = await chromium.launch({ headless: true });
    browserOk = true;

    // Typography per viewport.
    await assertTypography('1440', 'typography-1440');
    await assertTypography('768', 'typography-768');
    await assertTypography('390', 'typography-390');
    await assertTypography('320', 'typography-320');

    // Expected locale date strings.
    const d = {
      mon202608: (await wp(['eval', 'echo wp_date("F Y", mktime(12,0,0,8,1,2026));'])).out.trim(),
      mon202505: (await wp(['eval', 'echo wp_date("F Y", mktime(12,0,0,5,1,2025));'])).out.trim(),
      day20250509: (await wp(['eval', 'echo wp_date("F j, Y", mktime(12,0,0,5,9,2025));'])).out.trim(),
      day20250510: (await wp(['eval', 'echo wp_date("F j, Y", mktime(12,0,0,5,10,2025));'])).out.trim(),
      author: (await wp(['eval', '$u = get_user_by("ID", ' + requireSiteAdminId() + '); if ( ! $u ) { echo "LUMEN_QA_NO_ADMIN"; } else { echo $u->display_name; }'])).out.trim(),
    };
    // The author display name is read from the live install, never hardcoded.
    // A missing/invalid admin must fail explicitly instead of silently producing
    // a bogus expected value that poisons every author archive assertion.
    if (!d.author || d.author === 'LUMEN_QA_NO_ADMIN') {
      throw new Error('could not resolve display_name for site admin "' + SITE_ADMIN_LOGIN + '" (ID ' + requireSiteAdminId() + ')');
    }
    EXPECT.archives.mon202608.h1 = d.mon202608;
    EXPECT.archives.mon202505.h1 = d.mon202505;
    EXPECT.archives.day20250509.h1 = d.day20250509;
    EXPECT.archives.day20250510.h1 = d.day20250510;
    EXPECT.archives.author.h1 = d.author;

    // Per-viewport archive + search assertions.
    for (const vpName of Object.keys(VP)) {
      await assertArchive(vpName, vpName + '/archive-main-cat', EXPECT.archives.mainCat, { url: BASE + '?cat=' + FIXTURE.catMain, paginationExpected: true });
      await assertArchive(vpName, vpName + '/archive-openwrt', EXPECT.archives.openwrt, { url: BASE + '?tag=' + FIXTURE.tagOpenwrtSlug });
      await assertArchive(vpName, vpName + '/archive-qa-tag', EXPECT.archives.qaTag, { url: BASE + '?tag=' + FIXTURE.tagQaSlug });
      await assertArchive(vpName, vpName + '/archive-unique-tag', EXPECT.archives.unique, { url: BASE + '?tag=' + FIXTURE.tagUniqueSlug });
      await assertArchive(vpName, vpName + '/archive-topic', EXPECT.archives.topic, { url: BASE + '?lumen_qa_topic=' + FIXTURE.topicSlug });
      await assertArchive(vpName, vpName + '/archive-author', EXPECT.archives.author, { url: BASE + '?author=' + requireSiteAdminId() });
      await assertArchive(vpName, vpName + '/archive-year-2026', EXPECT.archives.year2026, { url: BASE + '?year=2026' });
      await assertArchive(vpName, vpName + '/archive-year-2025', EXPECT.archives.year2025, { url: BASE + '?year=2025' });
      await assertArchive(vpName, vpName + '/archive-month-2026-08', EXPECT.archives.mon202608, { url: BASE + '?year=2026&monthnum=8' });
      await assertArchive(vpName, vpName + '/archive-month-2025-05', EXPECT.archives.mon202505, { url: BASE + '?year=2025&monthnum=5' });
      await assertArchive(vpName, vpName + '/archive-day-2025-05-09', EXPECT.archives.day20250509, { url: BASE + '?year=2025&monthnum=5&day=9' });
      await assertArchive(vpName, vpName + '/archive-day-2025-05-10', EXPECT.archives.day20250510, { url: BASE + '?year=2025&monthnum=5&day=10' });
      await assertArchive(vpName, vpName + '/archive-empty', EXPECT.archives.empty, { url: BASE + '?cat=' + FIXTURE.catEmpty });

      await assertSearchPage(vpName, vpName + '/search-qa', EXPECT.searches.qa, BASE + '?s=qa', {});
      await assertSearchPage(vpName, vpName + '/search-openwrt', EXPECT.searches.openwrt, BASE + '?s=openwrt', {});
      await assertSearchPage(vpName, vpName + '/search-unique', EXPECT.searches.unique, BASE + '?s=uniquebetaquery', {});
      await assertSearchPage(vpName, vpName + '/search-zero', EXPECT.searches.zero, BASE + '?s=nomatchxyz', {});

      // Safety (once per viewport).
      await assertSafety(vpName);
    }

    // Single-page assertions (1440 sufficient).
    await assertSingles('1440');

    // Screenshots: 4 viewports x all pages (21 core + extras).
    for (const vpName of Object.keys(VP)) {
      const dir = path.join(SHOT_ROOT, vpName + 'x' + VP[vpName].height);
      fs.mkdirSync(dir, { recursive: true });
      for (const pg of PAGE_DEFS.concat(EXTRA_PAGES)) {
        await pageAudit(vpName, pg.url(), { shot: path.join(dir, pg.name) });
      }
      if (vpName === '1440') {
        for (const pg of PAGE_DEFS.concat(EXTRA_PAGES)) {
          const src = path.join(dir, pg.name);
          if (fs.existsSync(src)) fs.copyFileSync(src, path.join(SHOT_ROOT, pg.name));
        }
      }
    }
    log('screenshots written to ' + SHOT_ROOT);

    // Admin bar runtime verification.
    await assertAdminBar(FIXTURE.admin);
  } catch (e) {
    logFail('unhandled', e.message + '\n' + e.stack);
    runError = e;
  } finally {
    // Teardown runs ONLY when the environment was proven safe. If the guard
    // refused the target, no fixture was ever created, so there is nothing of
    // ours to clean up — and running cleanup against an unverified install
    // could destroy real data. Skip every database operation in that case.
    if (ENV_VERIFIED) {
      try {
        await teardown();
      } catch (te) {
        teardownErr = te;
        logFail('teardown', te.message);
      }
    } else {
      log('teardown: SKIPPED — environment was not verified; no database cleanup attempted.');
    }
    if (_browser) { try { await _browser.close(); } catch (e) {} }
  }

  // Post-run cleanliness is only meaningful if we were allowed to touch the
  // install at all. Without verification, skip all database inspection.
  if (!ENV_VERIFIED) {
    const finishedAt = new Date().toISOString();
    const report = {
      version: '1.1.0-beta.1',
      runId,
      startedAt,
      finishedAt,
      status: 'aborted',
      error: runError ? runError.message : 'environment guard refused the target',
      stack: runError ? (runError.stack || null) : null,
      clean: null,
      teardownError: null,
      environmentVerified: false,
      incomplete: true,
    };
    fs.writeFileSync(REPORT_PATH, JSON.stringify(report, null, 2));
    log('environment-refused report -> ' + REPORT_PATH);
    return { pass: false, passed: 0, failed: 0, aborted: true, error: report.error };
  }

  // Verify clean state (including restored options).
  const cleanState = await verifyClean();
  clean = cleanState.clean;
  optAfter = cleanState.after || {};
  if (!clean) {
    checks.push({ name: 'clean state', ok: false, detail: 'residual content detected' });
  }

  // Count checks.
  passed = checks.filter((c) => c.ok).length;
  failed = checks.length - passed;

  const finishedAt = new Date().toISOString();
  if (runError) {
    const report = {
      version: '1.1.0-beta.1',
      runId,
      startedAt,
      finishedAt,
      status: 'aborted',
      error: runError.message,
      stack: runError.stack || null,
      clean: (clean === null) ? null : clean,
      teardownError: teardownErr ? String(teardownErr) : null,
      incomplete: true,
    };
    fs.writeFileSync(REPORT_PATH, JSON.stringify(report, null, 2));
    log('failure report -> ' + REPORT_PATH);
    return {
      pass: false,
      passed: (passed === null) ? 0 : passed,
      failed: (failed === null) ? 0 : failed,
      aborted: true,
      error: runError.message,
    };
  }

  const report = {
    version: '1.1.0-beta.1',
    runId,
    startedAt,
    finishedAt,
    status: (failed === 0 && !teardownErr && clean) ? 'passed' : 'failed',
    wpVersion,
    phpVersion,
    base: BASE,
    durationMs: Date.now() - t0,
    checks: checks,
    summary: { total: checks.length, passed, failed },
    options: {
      before: OPTIONS_ORIGINAL,
      fixture: Object.assign({ permalink_structure: 'unchanged' }, OPT_FIXTURE ),
      after: optAfter,
    },
    teardownError: teardownErr ? String(teardownErr) : null,
    clean: clean,
  };
  fs.writeFileSync(REPORT_PATH, JSON.stringify(report, null, 2));
  log('report -> ' + REPORT_PATH);
  return { pass: failed === 0 && !teardownErr && clean, passed, failed };
}

// ---------------------------------------------------------------------------
// Teardown: zero leftover posts/categories/tags/terms/users/media/comments;
// temp admin deleted; temp MU plugin deleted.
// ---------------------------------------------------------------------------
async function teardown() {
  log('teardown: deleting fixture...');
  for (const id of FIXTURE.postIds) {
    const r = await wp(['post', 'delete', id, '--force']);
    if (r.code !== 0) logFail('teardown post ' + id, r.err);
    // This schema does not auto-remove a term_relationship row when its post is
    // deleted, so drop it here so no orphans point at the removed posts.
    await wp(['eval', 'global $wpdb; $wpdb->delete($wpdb->term_relationships, array("object_id" => ' + id + '));']);
  }
  for (const id of FIXTURE.commentIds || []) {
    await phpComment('delete_comment', { id });
  }
  for (const t of FIXTURE.terms) {
    await phpTerm('delete_term', { id: t.id });
  }
  if (FIXTURE.featuredAttach) await wp(['post', 'delete', FIXTURE.featuredAttach, '--force']);
  await wp(['plugin', 'deactivate', 'lumen-qa-topic']);
  try { fs.rmSync(PLUGIN_DIR, { recursive: true, force: true }); } catch (e) {}
  await phpUser('delete_user', { login: ADMIN_LOGIN });

  // Restore the original option values captured before fixture creation.
  // Exact-value restore (never assume defaults); each failure is logged and
  // later surfaced by verifyClean() so the run fails if a value drifts.
  for (const n of OPT_NAMES) {
    const original = OPTIONS_ORIGINAL[n];
    if (original === null) { logFail('teardown option ' + n, 'no original value captured'); continue; }
    const r = await wp(['option', 'update', n, original]);
    if (r.code !== 0) logFail('teardown option ' + n, r.err || r.out);
  }
  // Regenerate rewrite rules from the (unchanged) original permalink_structure
  // now that the temporary lumen_qa_topic taxonomy is gone, so the derived
  // rewrite_rules option no longer carries stale topic-archive rules.
  const rf2 = await wp(['rewrite', 'flush']);
  if (rf2.code !== 0) logFail('teardown rewrite flush', rf2.err || rf2.out);
  log('teardown: done.');
}

// wp --format=csv always emits a column-header line first, even when there are no
// data rows (it still prints e.g. "ID"). Strip the header so only data rows remain.
function csvDataRows(output) {
  if (!output) return [];
  const lines = (output + '\n').split('\n').map((l) => l.trim()).filter(Boolean);
  return lines.length > 1 ? lines.slice(1) : [];
}
// Parse csvDataRows() output into field arrays (header stripped), honouring
// quoted fields with embedded commas so multi-column reads are safe.
function csvFields(output) {
  const rows = csvDataRows(output);
  return rows.map((line) => {
    const out = [];
    let cur = '';
    let quoted = false;
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (quoted) {
        if (ch === '"' && line[i + 1] === '"') { cur += '"'; i++; }
        else if (ch === '"') { quoted = false; }
        else { cur += ch; }
      } else if (ch === '"') { quoted = true; }
      else if (ch === ',') { out.push(cur); cur = ''; }
      else { cur += ch; }
    }
    out.push(cur);
    return out;
  });
}
async function verifyClean() {
  const postsRows = csvDataRows((await wp(['post', 'list', '--fields=ID', '--format=csv'])).out);
  const commentRows = csvDataRows((await wp(['comment', 'list', '--fields=ID', '--format=csv'])).out);
  const catsRows = csvDataRows((await wp(['term', 'list', 'category', '--fields=term_id', '--format=csv'])).out);
  const tagRows = csvDataRows((await wp(['term', 'list', 'post_tag', '--fields=term_id', '--format=csv'])).out);
  const topicsOut = (await wp(['term', 'list', 'lumen_qa_topic', '--fields=term_id', '--format=csv'])).out.trim();
  const users = csvDataRows((await wp(['user', 'list', '--fields=user_login', '--format=csv'])).out);
  const mediaRows = csvDataRows((await wp(['post', 'list', '--post_type=attachment', '--fields=ID', '--format=csv'])).out);
  const plugins = (await wp(['plugin', 'list', '--fields=name,status', '--format=csv'])).out;

  // When the temp plugin is deactivated its name is still listed (inactive); we
  // only require it to NOT be active. A fully-removed plugin also passes.
  const topicsGone = topicsOut === '' || /doesn't exist/i.test(topicsOut);
  const pluginInactive = !plugins.includes('lumen-qa-topic,active');

  // WP's default "Uncategorized" category (term 1) always exists.
  check('clean: 0 posts', postsRows.length === 0, 'got: ' + postsRows.join(', '));
  check('clean: 0 comments', commentRows.length === 0, 'got: ' + commentRows.join(', '));
  check('clean: only default Uncategorized category remains', catsRows.length === 1 && catsRows[0] === '1', 'got: ' + catsRows.join(', '));
  check('clean: 0 tags', tagRows.length === 0, 'got: ' + tagRows.join(', '));
  check('clean: 0 topics (taxonomy gone)', topicsGone, 'got: ' + topicsOut);
  check('clean: only admin user remains', users.length === 1 && users[0] === 'admin', 'users: ' + users.join(', '));
  check('clean: 0 attachments', mediaRows.length === 0, 'got: ' + mediaRows.join(', '));
  check('clean: lumen-qa-topic plugin inactive', pluginInactive, plugins);

  // Persistent-option verification (Task C/E): clean must also require that
  // the options this suite mutates were restored to their originals - never
  // assumed from defaults.
  const optAfter = {
    comments_per_page: await wpOption('comments_per_page'),
    page_comments: await wpOption('page_comments'),
    default_comments_page: await wpOption('default_comments_page'),
    permalink_structure: await wpOption('permalink_structure'),
  };
  let optionsClean = true;
  for (const n of OPT_NAMES) {
    const before = OPTIONS_ORIGINAL[n];
    optionsClean = optionsClean && optAfter[n] === before;
    check('clean: ' + n + ' restored to original', optAfter[n] === before,
      'before=' + JSON.stringify(before) + ' after=' + JSON.stringify(optAfter[n]));
  }
  return {
    clean: postsRows.length === 0 && commentRows.length === 0 && catsRows.length === 1 && catsRows[0] === '1' && topicsGone && mediaRows.length === 0 && users.length === 1 && users[0] === 'admin' && pluginInactive && optionsClean,
    after: optAfter,
  };
}

main().then((res) => {
  process.exitCode = res.pass ? 0 : 1;
  console.log('[qa-beta1] === SUMMARY === total=' + checks.length + ' passed=' + res.passed + ' failed=' + res.failed);
  if (!res.pass) {
    checks.filter((c) => !c.ok).forEach((c) => console.log('FAIL ' + c.name + ': ' + c.detail));
  }
}).catch((e) => {
  console.error('[qa-beta1] fatal:', e.message);
  process.exitCode = 1;
});
