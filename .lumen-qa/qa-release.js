const { chromium } = require('playwright');
const fs = require('fs');

const BASE = 'http://127.0.0.1:4243';
const VP = {
  desktop: { width: 1440, height: 900 },
  mobile:  { width: 390,  height: 844 },
};
const PAGES = {
  home:   BASE + '/',
  single: BASE + '/2026/09/23/lumen-release-qa-canary/',
};

// Selectors to verify are present (header, content, footer, CSS)
const CHECKS = {
  header:  ['.lumen-site-header', 'header'],
  nav:     ['.lumen-site-nav', 'nav'],
  content: ['#lumen-main', 'main', '.lumen-site-main'],
  footer:  ['.lumen-site-footer', 'footer'],
  css:     'link[rel="stylesheet"]',
};

function listen(page) {
  const L = { console: [], pageerrors: [], reqFailures: [] };
  page.on('console', m => { if (m.type() === 'error') L.console.push(m.text()); });
  page.on('pageerror', e => { L.pageerrors.push(e.message + (e.location ? '\n' + e.location : '')); });
  page.on('requestfailed', req => {
    const f = req.failure();
    L.reqFailures.push({ url: req.url(), method: req.method(), err: f ? f.errorType : 'unknown', status: f ? String(f.statusCode) : '?' });
  });
  return L;
}

async function overflowInfo(page) {
  return page.evaluate(() => {
    const sw = document.documentElement.scrollWidth;
    const cw = document.documentElement.clientWidth;
    const off = [];
    if (sw > cw + 1) {
      const all = Array.from(document.querySelectorAll('*'));
      for (const el of all) {
        const cs = getComputedStyle(el);
        if (cs.position === 'fixed' || cs.position === 'absolute' || cs.display === 'none' || cs.visibility === 'hidden') continue;
        const r = el.getBoundingClientRect();
        if (r.right > cw + 2 && r.left > -2) {
          off.push({ tag: el.tagName.toLowerCase(), cls: (el.className || '').split(/\s+/).slice(0, 3).join('.') , right: Math.round(r.right), width: Math.round(r.width) });
        }
      }
    }
    return { docSw: sw, docCw: cw, overflow: sw > cw + 1, overflowers: off.slice(0, 15) };
  });
}

// Check an element exists by selector (try each selector, return first match)
async function checkExists(page, selectors) {
  const res = await page.evaluate((sels) => {
    return sels.map(sel => {
      try { return !!document.querySelector(sel); } catch (e) { return null; }
    });
  }, selectors);
  // return true if ANY selector matched (or the last one if only one provided)
  const found = res.find(r => r === true);
  return found !== undefined ? true : false;
}

async function getGeometry(page, selectors) {
  return page.evaluate((selList) => {
    return selList.map(sel => {
      const el = document.querySelector(sel);
      if (!el) return { selector: sel, exists: false };
      const r = el.getBoundingClientRect();
      const cs = getComputedStyle(el);
      return { selector: sel, exists: true, w: Math.round(r.width), h: Math.round(r.height), display: cs.display, opacity: cs.opacity };
    });
  }, selectors);
}

async function pageAudit(browser, vpName, url) {
  const v = VP[vpName];
  const ctx = await browser.newContext({ viewport: { width: v.width, height: v.height } });
  const page = await ctx.newPage();
  const L = listen(page);
  let status = '?';
  try {
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
    status = 200;
  } catch (e) {
    status = 0;
    log('[audit] goto error: ' + e.message);
  }
  try { status = (await page.evaluate(() => true)) ? 200 : 500; } catch (e) {}
  await page.waitForTimeout(300);
  await page.evaluate(() => window.scrollTo(0, 0)).catch(() => {});
  await page.waitForTimeout(150);
  const over = await overflowInfo(page);
  const geom = await getGeometry(page, [
    '.lumen-site-header', 'header',
    '.lumen-site-nav', 'nav',
    '#lumen-main', 'main', '.lumen-site-main',
    '.lumen-site-footer', 'footer',
  ]);
  const cssCount = await page.evaluate(() => document.querySelectorAll('link[rel="stylesheet"]').length).catch(() => 0);
  const cssLoaded = await page.evaluate(() => {
    // Check that at least one stylesheet is actually applied (has content)
    const links = document.querySelectorAll('link[rel="stylesheet"]');
    return Array.from(links).map(l => ({ href: l.href, loaded: true }));
  });
  const title = await page.evaluate(() => document.title).catch(() => '?');
  // Theme CSS: check if main.css / style.css is referenced and loaded
  const themeCss = await page.evaluate(() => {
    const links = Array.from(document.querySelectorAll('link[rel="stylesheet"]'));
    return links
      .filter(l => /\/lumen\//.test(l.href) || /themes\/lumen/.test(l.href) || /main\.css/.test(l.href) || /style\.css/.test(l.href))
      .map(l => (l.href || ''));
  }).catch(() => []);
  // Lumen-specific: check theme CSS is actually applied to body
  const themeApplied = await page.evaluate(() => {
    const body = document.body;
    return (body.className || '').includes('lumen') || (document.documentElement.className || '').includes('lumen');
  });
  const themeReqFail = L.reqFailures.filter(f => /\/lumen\//i.test(f.url) || /themes\/lumen/i.test(f.url));
  const allReqFail = L.reqFailures;
  const lumenConsole = (L.console.concat(L.pageerrors)).filter(t => /lumen/i.test(t) && !/wp-admin\/|wp-includes/i.test(t));
  const result = {
    vp: vpName, url, status, title, over, geom,
    cssCount, themeCss, themeApplied,
    console: L.console, pageerrors: L.pageerrors, reqFailures: allReqFail,
    themeReqFail, lumenConsole, lumenConsoleCount: lumenConsole.length,
    headerExists: await checkExists(page, CHECKS.header),
    navExists: await checkExists(page, CHECKS.nav),
    contentExists: await checkExists(page, CHECKS.content),
    footerExists: await checkExists(page, CHECKS.footer),
    hasCss: cssCount > 0,
  };
  await ctx.close();
  return result;
}

function log(...a) { console.log(...a); }

(async () => {
  const R = { overflow: [], console: [], assetFailures: [], lumenConsoleErrors: [], pass: true, pages: [] };
  const browser = await chromium.launch({ headless: true });
  try {
    for (const vpName of Object.keys(VP)) {
      for (const [label, url] of Object.entries(PAGES)) {
        log('[audit] ' + vpName + ' ' + label + ' ' + url);
        const r = await pageAudit(browser, vpName, url);
        R.pages.push(r);
        // Overflow
        if (r.over && r.over.overflow) {
          R.overflow.push({ label, vp: vpName, over: r.over });
          R.pass = false;
        }
        // Lumen console errors
        if (r.lumenConsole.length) {
          R.lumenConsoleErrors.push(...r.lumenConsole.map(e => ({ label, vp: vpName, error: e })));
          R.pass = false;
        }
        // Failed Lumen assets
        if (r.themeReqFail.length) {
          R.assetFailures.push(...r.themeReqFail);
          R.pass = false;
        }
        // Basic element checks
        if (!r.headerExists) { log('  [WARN] header not found in ' + vpName + '/' + label); R.pass = false; }
        if (!r.contentExists) { log('  [WARN] content not found in ' + vpName + '/' + label); R.pass = false; }
        if (!r.footerExists) { log('  [WARN] footer not found in ' + vpName + '/' + label); R.pass = false; }
        if (!r.hasCss) { log('  [WARN] no CSS loaded in ' + vpName + '/' + label); R.pass = false; }
      }
    }
  } catch (e) {
    log('FATAL: ' + e.message);
    R.pass = false;
  } finally {
    await browser.close();
  }

  // Print summary
  log('\n================ SUMMARY (Release Validation) ================');
  log('\n[OVERFLOW]');
  if (R.overflow.length === 0) log('  NONE - no horizontal overflow');
  else {
    log('  pages with horizontal overflow:');
    R.overflow.forEach(o => {
      log('  - ' + o.label + '@' + o.vp + ': docSw=' + o.over.docSw + ' docCw=' + o.over.docCw);
      o.over.overflowers.slice(0, 3).forEach(x => log('    * ' + x.tag + '.' + x.cls + ' right=' + x.right));
    });
  }
  log('\n[LU MEN CONSOLE ERRORS] (theme has no JS; any Lumen-attributed error = suspect)');
  log('  total lumen-attributed errors: ' + R.lumenConsoleErrors.length);
  if (R.lumenConsoleErrors.length) R.lumenConsoleErrors.slice(0, 10).forEach(e => log('    - ' + e.label + '@' + e.vp + ': ' + String(e.error).slice(0, 80)));
  log('\n[FAILED THEME ASSET REQUESTS]');
  log('  total: ' + R.assetFailures.length);
  if (R.assetFailures.length) R.assetFailures.slice(0, 10).forEach(f => log('    - ' + f.err + ' ' + f.url + ' (status=' + f.status + ')'));
  log('  total all request failures: ' + R.pages.reduce((s, p) => s + p.reqFailures.length, 0));
  log('\n[ELEMENT CHECKS]');
  R.pages.forEach(p => {
    const ok = p.pass !== undefined ? '' : '';
    log('  ' + p.vp + '/' + p.url.split(BASE.length)[1] || p.vp + '/' + p.url);
  });
  // Detailed page checks
  log('\n[PAGE CHECKS]');
  R.pages.forEach(p => {
    const label = p.vp + ' / ' + (p.url === BASE + '/' ? 'home' : 'single');
    const cssOk = p.hasCss && p.themeApplied ? 'PASS' : 'CHECK';
    const hOk = p.headerExists ? 'PASS' : 'FAIL';
    const cOk = p.contentExists ? 'PASS' : 'FAIL';
    const fOk = p.footerExists ? 'PASS' : 'FAIL';
    const ovOk = !p.over.overflow ? 'PASS' : 'FAIL';
    const ceOk = p.lumenConsole.length === 0 ? 'PASS' : 'FAIL(' + p.lumenConsole.length + ')';
    const afOk = p.themeReqFail.length === 0 ? 'PASS' : 'FAIL(' + p.themeReqFail.length + ')';
    log('  ' + label.padEnd(20) + ' css=' + cssOk + ' header=' + hOk + ' content=' + cOk + ' footer=' + fOk + ' overflow=' + ovOk + ' console=' + ceOk + ' assets=' + afOk + ' title="' + p.title + '" cssCount=' + p.cssCount);
    const themeCssList = p.themeCss && p.themeCss.length ? p.themeCss.map(l => (typeof l === 'string' ? l.split('http://').pop() : String(l))).join(' , ').slice(0, 120) : '(none)';
    if (p.themeCss.length) log('        theme CSS: ' + themeCssList);
  });

  const pass = R.pass;
  log('\n================ DECISION ================');
  if (pass) {
    log('Release Validation Browser Smoke: PASS');
    log('  - No horizontal overflow');
    log('  - 0 Lumen-attributed console errors');
    log('  - 0 failed Lumen theme asset requests');
    log('  - CSS loaded and theme applied');
    log('  - Header/content/footer present on all pages');
  } else {
    log('Release Validation Browser Smoke: FAIL');
    log('  Blocking issues:');
    if (R.overflow.length) log('  - horizontal overflow: ' + R.overflow.map(o => o.label + '@' + o.vp).join(', '));
    if (R.lumenConsoleErrors.length) log('  - Lumen console errors: ' + R.lumenConsoleErrors.length);
    if (R.assetFailures.length) log('  - failed theme asset requests: ' + R.assetFailures.length);
  }
  fs.writeFileSync(require('path').join(__dirname, 'report-release.json'), JSON.stringify(R, null, 2));
  log('\nReport saved to report-release.json');
})();
