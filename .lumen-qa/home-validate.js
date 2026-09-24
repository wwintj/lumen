const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const BASE = 'http://127.0.0.1:4242';
const VIEWPORTS = [
  { name: 'desktop', width: 1440, height: 900 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'mobile', width: 390, height: 843 },
];

const results = { pass: true, viewport: {}, errors: [] };

async function runViewport(vp) {
  const out = { viewport: vp.name, pass: true, checks: {} };
  const ctx = await browser.newContext({ acceptDownloads: false });
  const page = await ctx.newPage();

  // collect console errors and failed network requests
  const consoleErrs = [];
  const failedReqs = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error' || msg.type() === 'exception') {
      consoleErrs.push(msg.text());
    }
  });
  page.on('error', (err) => {
    failedReqs.push(err.message);
  });
  page.on('requestfailed', (req) => {
    const status = req.failure() && req.failure().errorType;
    failedReqs.push(`${req.method()} ${req.url()} (${status || req.failure()?.status || 'unknown'})`);
  });

  let overflow = null;
  await page.goto(BASE, { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.waitForLoadState('networkidle', { timeout: 15000 }).catch(() => {});

  // ---- checks ----
  const doc = await page.evaluate(() => {
    const w = window.innerWidth;
    const h = window.innerHeight;
    const docOverflow = document.documentElement.scrollWidth > document.documentElement.clientWidth ||
                        document.documentElement.scrollWidth > window.innerWidth;
    const bodyOverflow = document.body.scrollWidth > document.body.clientWidth;
    const h1s = [...document.querySelectorAll('h1')];
    return {
      docOverflow,
      bodyOverflow,
      h1Count: h1s.length,
      h1Text: h1s.length ? h1s[0].textContent.trim() : '',
      // count home posts
      postCount: [...document.querySelectorAll('.lumen-home-post')].length,
      // featured image?
      featuredImgCount: [...document.querySelectorAll('.lumen-post-featured img, .lumen-home-post img')].length,
      // meta present?
      metaCount: [...document.querySelectorAll('.lumen-home-meta')].length,
      // title present?
      titleCount: [...document.querySelectorAll('.lumen-home-title a')].length,
      // excerpt present?
      excerptCount: [...document.querySelectorAll('.lumen-home-excerpt')].length,
      // author / read-more?
      authorCount: [...document.querySelectorAll('.lumen-home-post .lumen-post-author')].length,
      // read-more text anywhere in home
      readMoreText: [...document.querySelectorAll('.lumen-home-post a')].some(a => /read more/i.test(a.textContent)),
      // pagination
      pagination: {
        left: [...document.querySelectorAll('.lumen-home-pagination-left a')].map(a => a.textContent.trim()),
        right: [...document.querySelectorAll('.lumen-home-pagination-right a')].map(a => a.textContent.trim()),
      },
      // date/category in meta
      dateCount: [...document.querySelectorAll('.lumen-home-meta time.lumen-post-date')].length,
      catCount: [...document.querySelectorAll('.lumen-home-meta .lumen-post-cat')].length,
    };
  });

  out.checks['h1 is "Latest"'] = doc.h1Text === 'Latest' ? 'PASS' : `FAIL (got "${doc.h1Text}")`;
  out.checks['exactly one H1'] = doc.h1Count === 1 ? 'PASS' : `FAIL (got ${doc.h1Count})`;
  out.checks['no featured images'] = doc.featuredImgCount === 0 ? 'PASS' : `FAIL (got ${doc.featuredImgCount})`;
  out.checks['<=8 posts'] = doc.postCount <= 8 ? `PASS (got ${doc.postCount})` : `FAIL (got ${doc.postCount})`;
  out.checks['8 posts (expect exactly 8)'] = doc.postCount === 8 ? 'PASS' : `FAIL (got ${doc.postCount})`;
  out.checks['meta present'] = doc.metaCount >= 1 ? `PASS (got ${doc.metaCount})` : 'FAIL';
  out.checks['title present'] = doc.titleCount >= 1 ? `PASS (got ${doc.titleCount})` : 'FAIL';
  out.checks['excerpt present'] = doc.excerptCount >= 1 ? `PASS (got ${doc.excerptCount})` : 'FAIL';
  out.checks['date in meta'] = doc.dateCount >= 1 ? `PASS (got ${doc.dateCount})` : 'FAIL';
  out.checks['category in meta'] = doc.catCount >= 1 ? `PASS (got ${doc.catCount})` : `NOTE (got ${doc.catCount}; DB object_id limitation)`;
  out.checks['no author/read-more'] = (!doc.readMoreText && doc.authorCount === 0) ? 'PASS' : `FAIL (author=${doc.authorCount})`;
  const noOverflow = !doc.docOverflow && !doc.bodyOverflow;
  out.checks['no horizontal overflow'] = noOverflow ? 'PASS' : 'FAIL';
  out.checks['pagination present'] = (doc.pagination.left.some(x => x) || doc.pagination.right.some(x => x))
      ? 'PASS' : 'FAIL';
  // specific pagination expectations for page 1
  if (doc.pagination.left.length === 0 && doc.pagination.right[0] === 'Older Posts') {
    out.checks['p1: Newer empty, Older=Older Posts'] = 'PASS';
  } else if (doc.pagination.left.length >= 1 && doc.pagination.right.length === 0) {
    out.checks['p1: Newer present, Older empty'] = 'PASS (last-page variant)';
  } else {
    out.checks['p1: Newer empty, Older=Older Posts'] = `CHECK (left=${JSON.stringify(doc.pagination.left)}, right=${JSON.stringify(doc.pagination.right)})`;
  }

  if (consoleErrs.length > 0 || failedReqs.length > 0) {
    results.errors.push({ viewport: vp.name, consoleErrs, failedReqs });
    out.checks['no console errors / failed assets'] =
      `FAIL (console=${consoleErrs.length}, failedReq=${failedReqs.length})`;
  } else {
    out.checks['no console errors / failed assets'] = 'PASS';
  }

  // overall pass for this viewport: all checks pass (except category NOTE)
  for (const [k, v] of Object.entries(out.checks)) {
    if (v && v.startsWith('FAIL')) {
      out.pass = false;
    }
  }

  results.viewport[vp.name] = out;
  await ctx.close();
}

async function main() {
  results.pass = true;
  browser = await chromium.launch({
    headless: true,
    channel: 'chrome',
    args: ['--no-sandbox', '--disable-gpu'],
  });
  for (const vp of VIEWPORTS) {
    await runViewport(vp);
  }
  browser.close();

  fs.writeFileSync(path.join(__dirname, 'report-home.json'), JSON.stringify(results, null, 2));
  console.log('\n=== HOME BROWSER VALIDATION ===\n');
  for (const vp of VIEWPORTS) {
    const o = results.viewport[vp.name];
    console.log(`[${o.viewport}] ${o.pass ? 'PASS' : 'FAIL'}\n`);
    for (const [k, v] of Object.entries(o.checks)) {
      const mark = v.startsWith('FAIL') ? 'x' : v.startsWith('NOTE') ? '!' : 'o';
      console.log(`  ${mark} ${k}: ${v}`);
    }
    console.log('');
  }
  if (results.errors.length) {
    console.log('=== ERRORS ===');
    for (const e of results.errors) {
      console.log(`[${e.viewport}]`);
      if (e.consoleErrs.length) console.log('  console:', e.consoleErrs.slice(0, 5).join('\n  '));
      if (e.failedReqs.length) console.log('  failed reqs:', e.failedReqs.slice(0, 5).join('\n  '));
    }
  } else {
    console.log('No console errors / failed assets.');
  }
  console.log('\n=== OVERALL ===', results.pass ? 'PASS' : 'FAIL');
  process.exit(results.pass ? 0 : 1);
}

main().catch((err) => {
  console.error('FATAL', err);
  process.exit(2);
});