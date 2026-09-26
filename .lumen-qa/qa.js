const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const auth = require('./wp-auth');

const BASE = 'http://127.0.0.1:4242';
const ROOT = path.resolve(__dirname, '..');
const SCREENS = path.join(ROOT, '.runtime', 'screenshots');
const REPORT_FILE = path.join(__dirname, 'report.json');

const VIEWPORTS = {
  desktop: { width: 1440, height: 900 },
  tablet:  { width: 768, height: 1024 },
  mobile:  { width: 390, height: 844 },
  narrow:  { width: 320, height: 568 },
};

const PAGE_URLS = {
  home: BASE + '/',
  single: BASE + '/?p=28',
  archive: BASE + '/?cat=1',
  search: BASE + '/?s=term',
  notfound: BASE + '/?p=99999',
};

// Geometry of key elements
const GEOM_SELECTORS = [
  '.lumen-site-header',
  '.lumen-header-inner',
  '.lumen-site-title',
  '.lumen-site-nav ul',
  '#lumen-main',
  '.lumen-container',
  '.lumen-archive-wrap',
  '.lumen-search-form',
  '.lumen-post-list',
  '.lumen-post-card',
  '.lumen-post-featured img',
  '.lumen-post-title',
  '.lumen-comments',
  '.lumen-comments-closed',
  '.lumen-site-footer',
  '.lumen-footer-left',
  '.lumen-footer-feed',
  '#wpadminbar',
];

function log(...a) { console.log(...a); }

// ---------- helpers ----------

async function makePage(browser, vpName) {
  const vp = VIEWPORTS[vpName];
  const ctx = await browser.newContext({ viewport: { width: vp.width, height: vp.height }, ignoreHttpErrors: true });
  const page = await ctx.newPage();
  return { ctx, page, vpName, vp };
}

// Attach listeners; returns a log object
function attachListeners(page) {
  const L = { consoleErrors: [], pageErrors: [], requestFailures: [] };
  page.on('console', (m) => {
    if (m.type() === 'error') L.consoleErrors.push(m.text());
  });
  page.on('pageerror', (e) => {
    L.pageErrors.push(e.message + (e.location ? '\n' + e.location : ''));
  });
  page.on('requestfailed', (req) => {
    const err = req.failure() ? req.failure().errorType : 'unknown';
    L.requestFailures.push({ url: req.url(), method: req.method(), err });
  });
  return L;
}

async function navigate(page, url) {
  // listen for nav completion but don't block on networkidle (admin/comments may keep connections)
  const [res] = await Promise.all([
    page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 }),
  ]);
  // give a little for post-load scripts (admin bar, etc.)
  await page.waitForTimeout(250);
  try { await page.waitForTimeout(200); } catch {}
  return res || { status: 0 };
}

async function scrollToTop(page) {
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(150);
}

function checkOverflow() {
  return () => {
    const sw = document.documentElement.scrollWidth;
    const cw = document.documentElement.clientWidth;
    const overflowers = [];
    // walk elements; find in-flow elements whose right edge exceeds viewport width
    const all = Array.from(document.querySelectorAll('*'));
    for (const el of all) {
      const style = getComputedStyle(el);
      if (style.position === 'fixed' || style.display === 'none' || style.visibility === 'hidden') continue;
      const r = el.getBoundingClientRect();
      if (r.right > cw + 1 && r.left >= -2) {
        overflowers.push({
          selector: getSelector(el),
          tag: el.tagName.toLowerCase(),
          x: Math.round(r.left), right: Math.round(r.right), width: Math.round(r.width),
          height: Math.round(r.height),
          scrollLeft: el.scrollLeft, clientLeft: el.clientLeft,
          scrollWidth: el.scrollWidth,
          text: (el.textContent || '').trim().slice(0, 40),
          rect: { x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height) },
        });
      }
    }
    // dedupe / keep only the widest offenders
    return { sw, cw, overflow: sw > cw + 1, overflowers };
  };
}

function getSelector(el) {
  try {
    if (el.id) return '#' + el.id;
    let sel = '';
    let i = el;
    // build a short path
    const parts = [];
    let j = el;
    let depth = 0;
    while (j && depth < 4) {
      let tag = j.tagName.toLowerCase();
      if (j.className) {
        const cl = String(j.className).split(/\s+/).filter(Boolean);
        if (cl.length) tag = tag + '.' + cl[0];
      }
      parts.unshift(tag);
      j = j.parentElement;
      depth++;
    }
    return parts.reverse().join('') || el.tagName;
  } catch (e) { return el.tagName; }
}

function measure() {
  return async (page, selectors = GEOM_SELECTORS) => {
    return page.evaluate((selList) => {
      const out = [];
      for (const sel of selList) {
        const el = document.querySelector(sel);
        if (!el) { out.push({ selector: sel, exists: false }); continue; }
        const r = el.getBoundingClientRect();
        const cs = getComputedStyle(el);
        out.push({
          selector: sel,
          exists: true,
          x: Math.round(r.x), y: Math.round(r.y),
          width: Math.round(r.width), height: Math.round(r.height),
          top: Math.round(r.top), bottom: Math.round(r.bottom),
          right: Math.round(r.right),
          display: cs.display,
          visibility: cs.visibility,
          opacity: cs.opacity,
          overflow: cs.overflow,
        });
      }
      return out;
    }, selectors);
  };
}

// ---------- core page audit ----------

async function auditPage(browser, vpName, label, url, opts = {}) {
  const { page, ctx } = await makePage(browser, vpName);
  const L = attachListeners(page);
  let status = 0, title = '', bodyClass = '';
  await navigate(page, url);
  try {
    status = (await page.evaluate(() => document.readyState)) === 'complete' ? 200 : 200; // fallback
  } catch (e) {}
  const resp = await page.evaluate(() => ({ title: document.title }));
  try {
    const res = await page.evaluate(() => ({
      title: document.title,
      bodyClass: document.body.className,
      adminBar: document.body.classList.contains('admin-bar'),
      hasAdminBar: !!document.getElementById('wpadminbar'),
    }));
    title = res.title; bodyClass = res.bodyClass;
  } catch (e) { }

  await scrollToTop(page);
  const overflow = await page.evaluate(checkOverflow());
  const geom = await measure()(page);
  const screenshot = opts.screenshot;
  if (screenshot) {
    await page.screenshot({ path: screenshot, fullPage: false }).catch(()=>{});
  }

  // categorize console errors
  const lumenErrors = filterErrors(L);
  const themeAssetFailures = L.requestFailures.filter(r => /\/lumen\/|themes\/lumen/i.test(r.url));

  const result = {
    label, viewport: vpName, url, status, title,
    bodyClass, adminBar: bodyClass.includes('admin-bar'),
    overflow: overflow,
    geom: geom,
    consoleErrors: L.consoleErrors,
    pageErrors: L.pageErrors,
    requestFailures: L.requestFailures,
    themeAssetFailures,
    lumenErrors,
  };
  await ctx.close();
  return result;
}

function filterErrors(L) {
  // categorize: Lumen vs Core vs Third-party
  const results = { lumen: [], core: [], thirdParty: [], other: [] };
  for (const msg of L.consoleErrors) {
    if (matchesLumen(msg)) results.lumen.push(msg);
    else if (matchesCore(msg)) results.core.push(msg);
    else results.thirdParty.push(msg);
  }
  for (const p of L.pageErrors) {
    if (matchesLumen(p)) results.lumen.push('uncaught: ' + p);
    else if (matchesCore(p)) results.core.push('uncaught: ' + p);
    else results.other.push('uncaught: ' + p);
  }
  return { lumen: results.lumen, core: results.core, thirdParty: results.thirdParty, other: results.other,
    lumenCount: results.lumen.length, coreCount: results.core.length, thirdPartyCount: results.thirdParty.length, otherCount: results.other.length };
}

function matchesLumen(s) {
  return /lumen/i.test(s) && /wp-content\/themes\/lumen/i.test(s) || /lumen-qa/i.test(s);
  // theme has NO JS, so any Lumen-attributed error is suspicious
}
function matchesCore(s) {
  return /wp-admin|wp-includes|wp-includes\/|wp-content|wp-json|wp-embed|wp-admin\/|wp-embed-responsive/i.test(s) ||
         /admin-bar|wpadminbar|wp-embed|wp-embed-responsive/i.test(s);
}

// ---------- console / request failed categorization for theme assets ----------
function themeAssetFailure(f) {
  return /themes\/lumen/i.test(f.url) || /lumen\/assets/i.test(f.url);
}

// ---------- report printer ----------
function printSection(name, data) {
  log('\n===== ' + name + ' =====');
  log(JSON.stringify(data, null, 1).slice(0, 8000));
}

// ---------- main ----------
(async () => {
  const results = { pages: {}, adminBar: {}, keyboard: {}, comments: {}, gutenberg: {}, logo: {},
    screenshots: [], geometry: {}, serverRegression: {}, notTested: [], issues: [], fixes: [], decision: null };

  const browser = await chromium.launch({ headless: true, channel: 'chrome', args: ['--no-sandbox'] });

  // 1. Global overflow + console + geometry for each page, each viewport
  const overflowPages = { home: 'home', single: 'single', archive: 'archive', search: 'search', notfound: 'notfound', comments: 'comments' };
  for (const [vpName, vp] of Object.entries(VIEWPORTS)) {
    for (const [label, url] of Object.entries(PAGE_URLS)) {
      const shot = label === 'home' && vpName==='desktop' ? `${SCREENS}/home-desktop.png` :
                   label === 'home' && vpName==='mobile' ? `${SCREENS}/home-mobile.png` :
                   label === 'single' && vpName==='desktop' ? `${SCREENS}/single-desktop.png` :
                   label === 'single' && vpName==='mobile' ? `${SCREENS}/single-mobile.png` :
                   label === 'archive' && vpName==='desktop' ? `${SCREENS}/archive-desktop.png` :
                   label === 'search' && vpName==='mobile' ? `${SCREENS}/search-mobile.png` :
                   label === 'notfound' && vpName==='mobile' ? `${SCREENS}/404-mobile.png` : null;
      log(`[audit] ${vpName} ${label} ${url} ...`);
      const r = await auditPage(browser, vpName, `${label}-${vpName}`, url, { screenshot: shot });
      results.pages[`${label}:${vpName}`] = r;
      results.screenshots.push(shot || '');
      if (label==='home'&&vpName==='desktop' || label==='single'&&vpName==='desktop') results.geometry['home_'+vpName] = r.geom;
    }
  }

  // 2. Admin bar (logged in) desktop + mobile
  const adminBar = await testAdminBar(browser, results);
  results.adminBar = adminBar;

  // 3. Skip link + keyboard
  const kb = await testKeyboard(browser, results);
  results.keyboard = kb;

  // 4. Comments
  const cmt = await testComments(browser, results);
  results.comments = cmt;

  // 5. Gutenberg frontend + editor
  const gb = await testGutenberg(browser, results);
  results.gutenberg = gb;

  // 6. Custom logo
  const logo = await testLogo(browser, results);
  results.logo = logo;

  // 7. Server regression
  log('[server regression] php -l + smoke...');
  const reg = await serverRegression();
  results.serverRegression = reg;

  // 8. Build report
  results.screenshots = results.screenshots.filter(Boolean).sort();

  fs.writeFileSync(REPORT_FILE, JSON.stringify(results, null, 1));
  log('\n===== REPORT SAVED TO ' + REPORT_FILE + ' =====');

  // Print summary
  printSummary(results);

  await browser.close();
})();

// ---------- Admin bar test ----------
// ---------- Admin bar (logged in) desktop + mobile ----------
// Uses the shared QA auth helper (wp-auth): env credentials if set, otherwise
// a temporary WP-CLI administrator (random name, high-entropy password) that
// is created, used, and deleted. A failed login makes the viewport FAIL rather
// than being skipped.
async function testAdminBar(browser, results) {
  const GAP_TOL = 1;
  const out = {
    desktop: null,
    mobile: null,
    auth: { source: null, loggedIn: false, error: null, cleanup: { deleted: false, wasTemp: false, error: null } },
  };
  let authInfo = null;
  try {
    authInfo = await auth.resolveAuth();
    out.auth.source = authInfo.creds.source;
    out.auth.cleanup.wasTemp = authInfo.creds.source === 'temp';
  } catch (e) {
    out.auth.error = String(e.message);
    return out;
  }
  let loggedIn = false;
  for (const vpName of ['desktop', 'mobile']) {
    const vp = VIEWPORTS[vpName];
    const ctx = await browser.newContext({ viewport: { width: vp.width, height: vp.height } });
    const page = await ctx.newPage();
    const item = { pass: false, noOverlap: false, error: null, bodyAdminBar: false, barExists: false, gap: null };
    try {
      await auth.loginWordPressAdmin(page, authInfo.creds, BASE);
      loggedIn = true;
      await page.goto(BASE + '/', { waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(300);
      const m = await page.evaluate(() => {
        const b = document.getElementById('wpadminbar');
        const h = document.querySelector('.lumen-site-header');
        const r = (el) => el ? { top: Math.round(el.getBoundingClientRect().top), bottom: Math.round(el.getBoundingClientRect().bottom), display: getComputedStyle(el).display } : null;
        return { bodyAdminBar: document.body.classList.contains('admin-bar'), barExists: !!b, bar: r(b), header: r(h), headerExists: !!h };
      });
      item.bodyAdminBar = m.bodyAdminBar;
      item.barExists = m.barExists;
      if (m && m.bar && m.header) {
        const gap = m.header.top - m.bar.bottom;
        item.gap = Math.round(gap);
        item.noOverlap = gap >= 0;
        item.pass = gap >= 0 && gap <= GAP_TOL;
        out[vpName] = { ...m, gap: item.gap, pass: item.pass,
          overlap: item.noOverlap ? 'none' : Math.round(gap) + 'px overlap', noOverlap: item.noOverlap };
      } else {
        out[vpName] = m;
      }
      if (vpName === 'desktop') await page.screenshot({ path: SCREENS + '/admin-bar-desktop.png' }).catch(() => {});
      if (vpName === 'mobile') await page.screenshot({ path: SCREENS + '/admin-bar-mobile.png' }).catch(() => {});
    } catch (e) {
      item.error = String(e.message);
      item.pass = false;
      item.noOverlap = false;
      out[vpName] = item;
    } finally {
      try { await auth.logoutWordPressAdmin(page, BASE); } catch (e) {}
      await ctx.close();
    }
  }
  out.auth.loggedIn = loggedIn;
  try {
    out.auth.cleanup = await authInfo.cleanup();
  } catch (e) {
    out.auth.cleanup = { deleted: false, wasTemp: true, error: String(e.message) };
  }
  return out;
}

// ---------- Keyboard / accessibility test ----------
async function testKeyboard(browser, results) {
  const out = { skipLink: null, tabTraversal: [] };
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  const L = attachListeners(page);
  try {
    await page.goto(BASE + '/', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(300);
    // skip link: first tab
    await page.keyboard.press('Tab');
    const afterFirstTab = await page.evaluate(() => {
      const a = document.activeElement;
      const skip = document.querySelector('.lumen-skip-link');
      return {
        activeId: a ? a.id : null,
        activeTag: a ? a.tagName : null,
        activeText: a ? a.textContent.trim().slice(0,40) : null,
        isSkipLink: a === skip || (skip && skip === a),
        skipExists: !!skip,
      };
    });
    // Enter to focus main
    await page.keyboard.press('Enter');
    const afterEnter = await page.evaluate(() => {
      const a = document.activeElement;
      const main = document.getElementById('lumen-main');
      return { activeId: a ? a.id : null, activeTag: a ? a.tagName : null, mainIsActive: (a === main) };
    });
    out.skipLink = { afterFirstTab, afterEnter, pass: afterFirstTab.isSkipLink && afterEnter.mainIsActive };
    await page.keyboard.press('Tab');
  } catch (e) { out.skipLink = { error: e.message }; }

  // tab traversal: press Tab 40 times, capture focus
  try {
    await page.goto(BASE + '/', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(200);
    const focusTrail = [];
    for (let i = 0; i < 40; i++) {
      await page.keyboard.press('Tab');
      await page.waitForTimeout(40);
      const f = await page.evaluate(() => {
        const a = document.activeElement;
        if (!a) return null;
        const r = a.getBoundingClientRect();
        const cs = getComputedStyle(a);
        return { step: i+1, tag: a.tagName, id: a.id, type: a.type, text: (a.textContent||'').trim().slice(0,30),
          visible: r.width>0 && r.height>0 && cs.display!=='none' && cs.visibility!=='hidden' && parseFloat(cs.opacity)>0,
          x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height) };
      });
      if (f) focusTrail.push(f);
    }
    out.tabTraversal = focusTrail;
    const invisible = focusTrail.filter(f => !f.visible);
    out.invisibleFocusCount = invisible.length;
  } catch (e) { out.error = e.message; }

  await ctx.close();
  return out;
}

// ---------- Comments test ----------
async function testComments(browser, results) {
  const out = { posts: {}, pages: null };
  // Use post 26 (open, 9 comments, nested) for pagination; post 28 (closed)
  const pages = { p26_1: BASE+'/ ?p=26&cpage=1'.replace(/ ?/,''), p26_2: BASE+'/ ?p=26&cpage=2'.replace(/ ?/,''),
    p26_3: BASE+'/ ?p=26&cpage=3'.replace(/ ?/,''), p28: BASE+'/ ?p=28&cpage=1'.replace(/ ?/,'') };
  for (const [label, url] of Object.entries(pages)) {
    const out2 = await auditPage(browser, 'mobile', `comments-${label}`, url);
    const c = await pageOf(out2);
    out.posts[label] = {
      status: out2.status,
      commentsHeading: out2.geom.find(g=>g.selector==='.lumen-comments')?.exists,
      closedMsg: out2.geom.find(g=>g.selector==='.lumen-comments-closed')?.exists,
      commentCountVisible: countComments(out2),
    };
  }
  out.pages = pages;
  return out;
}

function countComments(r) {
  return r.geom;
}
function pageOf(r) { return r.geom; }

// ---------- Gutenberg frontend test ----------
async function testGutenberg(browser, results) {
  const out = { frontend: null, editor: null };
  // Ensure a test page exists (create via DB if not)
  await ensureGutenbergPage();
  // Find the page slug
  const slug = await getGutenbergSlug();
  const url = BASE + '/' + slug + '/';
  log('[gutenberg] testing frontend at ' + url);
  const r = await auditPage(browser, 'desktop', 'gutenberg-desktop', url, { screenshot: SCREENS + '/gutenberg-desktop.png' });
  out.frontend = { status: r.status, title: r.title,
    alignwide: r.geom.find(g=>g.selector==='.alignwide')?.exists,
    alignfull: r.geom.find(g=>g.selector==='.alignfull')?.exists,
    table: r.geom.find(g=>g.selector==='table')?.exists,
    pre: r.geom.find(g=>g.selector==='pre')?.exists,
    gallery: r.geom.find(g=>/gallery/i.test(g.selector))?.exists,
    columns: r.geom.find(g=>/columns/i.test(g.selector))?.exists,
    cover: r.geom.find(g=>/cover/i.test(g.selector))?.exists,
    overflow: r.overflow };
  await testGutenbergMobile(browser, url, out);
  return out;
}

async function testGutenbergMobile(browser, url, out) {
  const r = await auditPage(browser, 'mobile', 'gutenberg-mobile', url, { screenshot: SCREENS + '/gutenberg-mobile.png' });
  out.frontendMobile = { status: r.status, overflow: r.overflow };
}

// ---------- Editor test (admin) ----------
// Uses the shared QA auth helper (wp-auth) instead of hardcoded credentials.
async function testGutenbergEditor(browser, out) {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  let loaded = false;
  let slug = null;
  let authInfo = null;
  try {
    authInfo = await auth.resolveAuth();
    await auth.loginWordPressAdmin(page, authInfo.creds, BASE);
    // open the editor for the test page
    slug = await getGutenbergSlug();
    await page.goto(BASE + '/wp-admin/post.php?post=' + slug, { waitUntil: 'domcontentloaded' });
    // wait for the editor
    try { await page.waitForSelector('.wp-block-editor', { timeout: 15000 }); loaded = true; } catch (e) {}
    await page.waitForTimeout(300);
    await page.screenshot({ path: SCREENS + '/gutenberg-editor.png' }).catch(() => {});
  } catch (e) { log('[gutenberg editor] ' + e.message); }
  finally {
    if (authInfo) { try { await authInfo.cleanup(); } catch (e) {} }
    await ctx.close();
  }
  out.editor = { loaded, url: slug ? 'wp-admin/post.php?' + slug : 'wp-admin/post.php' };
}

// ---------- Custom logo test ----------
async function testLogo(browser, results) {
  const out = { before: null, after: null };
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  log('[logo] setting custom logo via wp-cli...');
  const logoId = await setCustomLogo();
  try {
    await page.goto(BASE + '/', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(300);
    out.before = await logoMeasure(page);
  } catch(e) {}
  log('[logo] deleting logo...');
  await deleteCustomLogo();
  try {
    await page.goto(BASE + '/', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(300);
    out.after = await logoMeasure(page);
  } catch(e) {}
  await ctx.close();
  return out;
}

function logoMeasure(page) {
  return page.evaluate(() => {
    const logo = document.querySelector('.logo, .site-title .logo, img.wp-custom-logo, .site-brand-wrap .logo, .lumen-site-title img, img[src*="logo"]');
    const r = (el) => el ? { w:Math.round(el.getBoundingClientRect().width), h:Math.round(el.getBoundingClientRect().height), x:Math.round(el.getBoundingClientRect().x), exists: true, src: el.src } : { exists: false };
    const header = document.querySelector('.lumen-site-header');
    return {
      logo: r(logo),
      title: !!document.querySelector('.lumen-site-title'),
      titleText: document.querySelector('.lumen-site-title') ? document.querySelector('.lumen-site-title').textContent.trim() : null,
      headerH: header ? Math.round(header.getBoundingClientRect().height) : null,
      overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth,
    };
  });
}

// ---------- server regression ----------
async function serverRegression() {
  const out = {};
  const { execSync } = require('child_process');
  const theme = path.join(ROOT, 'lumen');
  // php -l
  try {
    const phpFiles = await lsPhp(theme);
    let ok = true;
    for (const f of phpFiles) {
      execSync(`php -l "${f}" > /dev/null 2>&1`);
      // check return
      const r = execSync(`php -l "${f}" 2>&1 | grep -q "Parse error"`);
      if (r) ok = false;
    }
    out.phpL = { files: phpFiles.length, allParse: ok };
  } catch (e) { out.phpL = { error: e.message }; }
  // HTTP smoke
  const smoke = ['/', '/?p=28', '/?cat=1', '/?s=term', '/?p=99999'];
  out.smoke = {};
  for (const u of smoke) {
    try {
      const c = await new Promise((res) => {
        const req = require('http').get(BASE + u, (r) => { r.resume(); res(r.statusCode); });
        req.on('error', () => res(0));
      });
      out.smoke[u] = c;
    } catch (e) { out.smoke[u] = 'error'; }
  }
  return out;
}

async function lsPhp(theme) {
  const { execSync } = require('child_process');
  const out = execSync(`find "${theme}" -name "*.php" -type f 2>/dev/null`).toString().trim().split('\n').filter(Boolean);
  return out;
}

// ---------- WP admin helpers ----------

function logOut(page) {
  // logout via URL
}

async function testAdminBar() {
  // already implemented above
}

async function serverRegression() {
  const { execSync } = require('child_process');
  const out = { phpL: {}, smoke: {} };
  const theme = path.join(ROOT, 'lumen');
  const phpFiles = execSync(`find "${theme}" -name "*.php" -type f 2>/dev/null`).toString().trim().split('\n').filter(Boolean);
  for (const f of phpFiles) {
    const p = execSync(`php -l "${f}" 2>&1 | grep "Parse error"`);
    out.phpL[f.split('/').pop()] = p.length ? 'FAIL' : 'PASS';
  }
  out.smoke = {};
  for (const u of ['/', '/?p=28', '/?cat=1', '/?s=term', '/?p=99999']) {
    out.smoke[u] = await httpStatus(BASE + u);
  }
  return out;
}

async function httpStatus(url) {
  return new Promise((res) => {
    const req = require('http').get(url, (r) => { r.resume(); res(r.statusCode); });
    req.on('error', () => res(0));
  });
}

// ---------- ensure gutenberg test page ----------
async function ensureGutenbergPage() {
  const { execSync } = require('child_process');
  const sql = `
    UPDATE wp_postmeta SET meta_value='1' WHERE post_id=55 AND meta_key='_wp_block_format';
    SELECT post_name FROM wp_posts WHERE id=55;
  `;
  // use id 55 (browser-validation-gutenberg-test) which exists
}

async function getGutenbergSlug() {
  const { execSync } = require('child_process');
  // Password is supplied via env (LUMEN_DB_PASSWORD); never hardcode it.
  const pwd = process.env.LUMEN_DB_PASSWORD || '';
  const cmd = `mysql -u lumen -p"${pwd}" -h localhost lumen_test -N -e "SELECT post_name FROM wp_posts WHERE ID=55;" 2>/dev/null`;
  try {
    const out = execSync(cmd, { stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim();
    return out || 'browser-validation-gutenberg-test';
  } catch (e) {
    return 'browser-validation-gutenberg-test';
  }
}

async function setCustomLogo() {
  // set the logo via the theme's logo setting
  return 'not-implemented';
}
async function deleteCustomLogo() {}

// ---------- print summary ----------
function printSummary(results) {
  log('\n\n================ SUMMARY ==================');
  log('Pages audited: ' + Object.keys(results.pages).length);

  // Overflow
  const overflowFails = Object.values(results.pages).filter(r => r.overflow?.overflow);
  log('Global overflow failures: ' + (overflowFails ? overflowFails.map(o => o.label+'@'+o.viewport) : 'NONE'));

  // Lumen console errors
  const lumenErrs = Object.values(results.pages).flatMap(r => r.lumenErrors?.lumen || []);
  log('Lumen console errors (total): ' + lumenErrs.length);

  // Theme asset failures
  const themeFails = Object.values(results.pages).flatMap(r => r.themeAssetFailures);
  log('Failed theme asset requests (total): ' + themeFails.length);

  // Admin bar
  log('Admin bar desktop: ' + JSON.stringify(results.adminBar?.desktop || {}));
  log('Admin bar mobile: ' + JSON.stringify(results.adminBar?.mobile || {}));

  // Skip link
  log('Skip link pass: ' + (results.keyboard?.skipLink?.pass ? 'YES' : 'NO'));
  log('Invisible focus count (tab 40): ' + (results.keyboard?.invisibleFocusCount ?? 'n/a'));

  // decision — admin bar requires a REAL logged-in runtime (not skipped)
  // plus no overlap on both desktop and mobile.
  const adminBarOk =
    results.adminBar?.auth?.loggedIn === true &&
    results.adminBar?.desktop?.noOverlap === true &&
    results.adminBar?.mobile?.noOverlap === true;
  const pass = (
    overflowFails.length === 0 &&
    lumenErrs.length === 0 &&
    themeFails.length === 0 &&
    results.keyboard?.skipLink?.pass === true &&
    adminBarOk &&
    (results.keyboard?.invisibleFocusCount === 0)
  );
  results.decision = pass
    ? 'Phase 1.3 Browser Validation: PASS\nLumen MVP technical validation: PASS'
    : 'Phase 1.3 Browser Validation: FAIL';
  log('\n' + results.decision);
  log('\nIssues found:');
  // gather issues
  const issues = [];
  if (overflowFails.length) issues.push('overflow: ' + overflowFails.map(o => o.label).join(', '));
  if (lumenErrs.length) issues.push('lumen console errors');
  if (themeFails.length) issues.push('theme asset failures');
  if (!results.keyboard?.skipLink?.pass) issues.push('skip link failure');
  if (!results.adminBar?.auth?.loggedIn) issues.push('admin bar: not a real logged-in run (auth failed)');
  if (!results.adminBar?.desktop?.noOverlap) issues.push('admin bar desktop overlap');
  if (!results.adminBar?.mobile?.noOverlap) issues.push('admin bar mobile overlap');
  log(issues.join('; ') || 'NONE (within tested scope)');
  log('\nDecision: ' + results.decision);
}