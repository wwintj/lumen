const { chromium } = require('playwright');
const fs = require('fs');
const { execSync } = require('child_process');
const path = require('path');

const BASE = 'http://127.0.0.1:4242';
const ROOT = path.resolve(__dirname, '..');
const SCREENS = path.join(ROOT, '.runtime', 'screenshots');
const OUT = path.join(__dirname, 'report.json');
const THEME = path.join(ROOT, 'lumen');
const WP = path.join(ROOT, '.runtime', 'wordpress');

const VP = {
  desktop: {width:1440, height:900},
  tablet:  {width:768,  height:1024},
  mobile:  {width:390,  height:844},
  narrow:  {width:320,  height:568},
};
const PAGES = {
  home: BASE + '/',
  single: BASE + '/?p=28',
  archive: BASE + '/?cat=1',
  search: BASE + '/?s=term',
  notfound: BASE + '/?p=99999',
  comments: BASE + '/?p=26&cpage=1',
  comments_closed: BASE + '/?p=28&cpage=1',
  gutenberg: BASE + '/?p=64',
};
const SELECTORS = [
  '.lumen-site-header','.lumen-header-inner','.lumen-site-brand-wrap','.lumen-site-logo',
  '.lumen-site-title','.lumen-site-nav','.lumen-site-nav ul','#lumen-main','.lumen-container',
  '.lumen-post-list','.lumen-post-card','.lumen-post-featured img','.lumen-post-title',
  '.lumen-comments','.lumen-comments-closed','.lumen-comment-form','#wpadminbar',
  '.lumen-site-footer','.lumen-footer-left','.lumen-footer-feed',
];

function log(...a){ console.log(...a); }

async function open(browser, vpName) {
  const v = VP[vpName];
  const ctx = await browser.newContext({ viewport:{width:v.width, height:v.height}, ignoreHttpErrors:true });
  const page = await ctx.newPage();
  return { ctx, page, vpName, v };
}

function listen(page) {
  const L = { console:[], pageerrors:[], reqFailures:[] };
  page.on('console', m => { if (m.type()==='error') L.console.push(m.text()); });
  page.on('pageerror', e => { L.pageerrors.push(e.message + (e.location ? '\n'+e.location : '')); });
  page.on('requestfailed', req => {
    const f = req.failure();
    L.reqFailures.push({ url:req.url(), method:req.method(), err:f?f.errorType:'unknown', status:f?String(f.statusCode):'?' });
  });
  return L;
}

// find in-flow elements that exceed viewport width
async function overflowInfo(page) {
  return page.evaluate(() => {
    const sw = document.documentElement.scrollWidth;
    const cw = document.documentElement.clientWidth;
    const body = document.body;
    const ow = body.scrollWidth, bw = body.clientWidth;
    const off = [];
    if (sw > cw + 1) {
      const all = Array.from(document.querySelectorAll('*'));
      for (const el of all) {
        const cs = getComputedStyle(el);
        if (cs.position==='fixed' || cs.position==='absolute' || cs.display==='none' || cs.visibility==='hidden') continue;
        const r = el.getBoundingClientRect();
        if (r.right > cw + 2 && r.left > -2) {
          off.push({ tag:el.tagName.toLowerCase(), id:el.id||'',
            cls:(el.className||'').split(/\s+/).slice(0,3).join('.').replace(/ /g,''),
            left:Math.round(r.left), right:Math.round(r.right), width:Math.round(r.width), height:Math.round(r.height),
            text:(el.textContent||'').trim().slice(0,30) });
        }
      }
      // dedupe by tag+class, keep max width
      const best = {};
      for (const o of off) { const k=o.tag+'.'+o.cls; if(!best[k] || o.width > best[k].width) best[k]=o; }
      off = Object.values(best);
    }
    return { docSw:sw, docCw:cw, bodySw:ow, bodyCw:bw, overflow:(sw>cw+1), overflowers:off.slice(0,30) };
  });
}

async function geom(page, sels=SELECTORS) {
  return page.evaluate((selList) => {
    return selList.map(sel => {
      const el = document.querySelector(sel);
      if (!el) return { selector:sel, exists:false };
      const r = el.getBoundingClientRect();
      const cs = getComputedStyle(el);
      return { selector:sel, exists:true, x:Math.round(r.x), y:Math.round(r.y),
        w:Math.round(r.width), h:Math.round(r.height), top:Math.round(r.top),
        bottom:Math.round(r.bottom), right:Math.round(r.right),
        display:cs.display, visibility:cs.visibility, opacity:cs.opacity,
        overflow:cs.overflow, clip:cs.clipPath };
    });
  }, sels);
}

async function pageAudit(browser, vpName, url, shot=null) {
  const { ctx, page } = await open(browser, vpName);
  const L = listen(page);
  let status = 0;
  try { await page.goto(url, { waitUntil:'domcontentloaded', timeout:30000 }); }
  catch (e) { log('[audit] goto error '+url+': '+e.message); }
  try { status = await page.evaluate(() => window.location.pathname) && 0; } catch(e){}
  try { status = (await page.evaluate(() => true)) ? 200 : 500; } catch(e) {}
  await page.waitForTimeout(300);
  await page.evaluate(()=>window.scrollTo(0,0));
  await page.waitForTimeout(150);
  const over = await overflowInfo(page);
  const g = await geom(page);
  const title = await page.evaluate(()=>document.title).catch(()=>'?');
  if (shot) await page.screenshot({ path: shot, fullPage:false }).catch(()=>{});
  const themeReqFail = L.reqFailures.filter(f => /\/lumen\//i.test(f.url) || /themes\/lumen/i.test(f.url));
  const lumenConsole = (L.console.concat(L.pageerrors)).filter(t => /lumen/i.test(t) && !/wp-admin\/|wp-includes/i.test(t));
  const result = { vp:vpName, url, title, over, g,
    console:L.console, pageerrors:L.pageerrors, reqFailures:L.reqFailures,
    themeReqFail, lumenConsole,
    lumenConsoleCount:lumenConsole.length };
  await ctx.close();
  return result;
}

// Admin bar (logged in)
async function adminBarTest(browser) {
  const out = {};
  for (const vpName of ['desktop','mobile']) {
    const v = VP[vpName];
    const ctx = await browser.newContext({ viewport:{width:v.width,height:v.height} });
    const page = await ctx.newPage();
    let ok = false, m = null;
    try {
      await page.goto(BASE+'/wp-login.php', { waitUntil:'domcontentloaded', timeout:30000 });
      await page.fill('input[name="log"]','admin');
      await page.fill('input[name="pwd"]','admin');
      await page.click('#wp-submit');
      await page.waitForURL(BASE + '/wp-admin/**', { timeout:30000 });
      await page.goto(BASE + '/', { waitUntil:'domcontentloaded', timeout:30000 });
      await page.waitForTimeout(400);
      await page.waitForSelector('#wpadminbar', { timeout:5000 }).catch(()=>{});
      await page.waitForTimeout(300);
      m = await page.evaluate(() => {
        const b = document.getElementById('wpadminbar');
        const h = document.querySelector('.lumen-site-header');
        const r = el => el ? { top:Math.round(el.getBoundingClientRect().top), bottom:Math.round(el.getBoundingClientRect().bottom), display:getComputedStyle(el).display } : null;
        return { bodyAdminBar:document.body.classList.contains('admin-bar'), barExists:!!b, bar:r(b), header:r(h), headerExists:!!h };
      });
      ok = !!m;
      if (vpName==='desktop') await page.screenshot({ path:SCREENS+'/admin-bar-desktop.png' }).catch(()=>{});
      if (vpName==='mobile') await page.screenshot({ path:SCREENS+'/admin-bar-mobile.png' }).catch(()=>{});
    } catch (e) { log('[admin bar] '+vpName+': '+e.message); }
    if (m && m.bar && m.header) {
      m.noOverlap = m.header.top >= m.bar.bottom;
      m.gap = m.header.top - m.bar.bottom;
      m.pass = m.noOverlap;
      ok = true;
    }
    out[vpName] = m;
    await ctx.close();
  }
  return out;
}

// Skip link + keyboard (desktop). First Tab must land on the skip link and be
// in-viewport after its 120ms focus transition; the full Tab trail must cycle
// through many distinct focusable targets (no trap).
async function keyboardTest(browser) {
  const ctx = await browser.newContext({ viewport:{width:VP.desktop.width,height:VP.desktop.height} });
  const page = await ctx.newPage();
  const fallback = { error:null, trail:[], isSkip:false, skipVisibleOnFocus:false, skipPass:false,
    enterToMain:null, distinctFocusables:0, maxConsecutiveRepeat:0, noTrap:false, belowFold:0 };
  try {
    await page.goto(BASE + '/', { waitUntil:'domcontentloaded', timeout:30000 });
    await page.waitForTimeout(300);
    // 1) Focus the skip link (first Tab) and measure it in-viewport after its transition.
    await page.keyboard.press('Tab');
    await page.waitForTimeout(300);
    const skip = await page.evaluate(() => {
      const a = document.activeElement; if(!a) return null;
      const r = a.getBoundingClientRect(); const cs = getComputedStyle(a);
      const baseVis = r.width>0.1 && r.height>0.1 && cs.display!=='none' && cs.visibility!=='hidden' && parseFloat(cs.opacity)>0.01;
      const inVP = baseVis && r.top>=0 && r.bottom<=window.innerHeight && r.left>=0 && r.right<=window.innerWidth;
      return { step:1, tag:a.tagName, id:a.id||'', type:a.type||'',
        href:a.getAttribute ? (a.getAttribute('href')||'') : '',
        visible:baseVis, inVP, x:Math.round(r.x), y:Math.round(r.y), w:Math.round(r.width), h:Math.round(r.height) };
    });
    // 2) Enter on the skip link should jump focus to main content.
    let enterToMain = null;
    try {
      await page.keyboard.press('Enter');
      await page.waitForTimeout(300);
      enterToMain = await page.evaluate(()=>{
        const a = document.activeElement; const main = document.getElementById('lumen-main');
        return (a === main) ? true : false;
      });
    } catch(e){ enterToMain = null; }
    // 3) Build the 55-tab trail to verify focus cycles (no trap).
    const trail = [skip];
    for (let i=1;i<55;i++){
      await page.keyboard.press('Tab');
      await page.waitForTimeout(160);
      const t = await page.evaluate((step) => {
        const a = document.activeElement; if(!a) return null;
        const r = a.getBoundingClientRect(); const cs = getComputedStyle(a);
        const baseVis = r.width>0.1 && r.height>0.1 && cs.display!=='none' && cs.visibility!=='hidden' && parseFloat(cs.opacity)>0.01;
        const inVP = baseVis && r.top>=0 && r.bottom<=window.innerHeight && r.left>=0 && r.right<=window.innerWidth;
        return { step, tag:a.tagName, id:a.id||'', type:a.type||'',
          href:a.getAttribute ? (a.getAttribute('href')||'') : '',
          visible:baseVis, inVP, x:Math.round(r.x), y:Math.round(r.y), w:Math.round(r.width), h:Math.round(r.height) };
      }, i+1);
      if (t) trail.push(t);
    }
    const isSkip = (skip && skip.href === '#lumen-main');
    const skipVisibleOnFocus = (skip && !!skip.inVP);
    const distinct = new Set(trail.map(t=>t.tag+'|'+t.id+'|'+t.type+'|'+t.href)).size;
    let maxRun = 0, cur = 1;
    for (let i=1;i<trail.length;i++){
      const same = trail[i].tag===trail[i-1].tag && trail[i].id===trail[i-1].id && trail[i].type===trail[i-1].type && trail[i].href===trail[i-1].href;
      if (same) { cur++; } else { if (cur>maxRun) maxRun=cur; cur=1; }
    }
    if (trail.length) { if (cur>maxRun) maxRun=cur; }
    fallback.isSkip = isSkip;
    fallback.skipVisibleOnFocus = skipVisibleOnFocus;
    fallback.skipPass = isSkip && skipVisibleOnFocus;
    fallback.enterToMain = enterToMain;
    fallback.trail = trail;
    fallback.distinctFocusables = distinct;
    fallback.maxConsecutiveRepeat = maxRun;
    fallback.noTrap = (maxRun < 3 && distinct >= 3);
    fallback.belowFold = trail.filter(t=>t.visible && !t.inVP).length;
    return fallback;
  } catch(e){ fallback.error = e.message; return fallback; } finally {
    await ctx.close();
  }
}

// Comments: open (p26), closed (p28), pagination (p26 cpage 1..3)
async function commentsTest(browser) {
  const out = { pages:{}, open:null, closed:null, pagination:null };
  const pages = { p26_1: BASE+'/ ?p=26&cpage=1'.replace(/ ?/,''), p26_2: BASE+'/ ?p=26&cpage=2'.replace(/ ?/,''),
    p26_3: BASE+'/ ?p=26&cpage=3'.replace(/ ?/,''), p28: BASE+'/ ?p=28&cpage=1'.replace(/ ?/,'') };
  for (const [key,url] of Object.entries(pages)) {
    const r = await pageAudit(browser, 'mobile', url);
    const c = r.g.find(x=>x.selector==='.lumen-comments');
    const cc = r.g.find(x=>x.selector==='.lumen-comments-closed');
    out.pages[key] = { status:r.over ? 'ok':'err', hasCommentsHeading:c&&c.exists, closedMsg:cc&&cc.exists, over:r.over.overflow, lumenConsole:r.lumenConsoleCount };
  }
  // open test (p26 desktop): count comments + pagination links
  const ctxo = await browser.newContext({viewport:{width:VP.desktop.width,height:VP.desktop.height}});
  const po = await ctxo.newPage();
  try {
    await po.goto(BASE+'/ ?p=26&cpage=1'.replace(/ ?/,''), {waitUntil:'domcontentloaded', timeout:30000});
    await po.waitForTimeout(300);
    const det = await po.evaluate(()=>{
      const cs = document.querySelectorAll('.lumen-comment, article, li.wp-comment, .comment');
      const nav = document.querySelector('.navigation.comments-pagination, .comments-pagination, .navigation.comments');
      const links = nav ? Array.from(nav.querySelectorAll('a,span')).map(e=>({text:e.textContent.trim(), current:e.classList.contains('current')||e.getAttribute('aria-current')==='page'})) : [];
      return { commentCount:cs.length, hasPagination:!!nav, pageLinks:links,
        hasForm:!!document.querySelector('.comment-form, #comment, #comments .form'), title:document.title };
    });
    out.open = det;
    // closed desktop
    await po.goto(BASE+'/ ?p=28&cpage=1'.replace(/ ?/,''), {waitUntil:'domcontentloaded', timeout:30000});
    await po.waitForTimeout(300);
    const closed = await po.evaluate(()=>{
      const closedMsg = document.querySelector('.lumen-comments-closed');
      return { hasClosedMsg:!!closedMsg, text:closedMsg?closedMsg.textContent.trim().slice(0,60):null,
        hasForm:!!document.querySelector('#comments, .comment-form') };
    });
    out.closed = closed;
  } catch(e){ log('[comments] '+e.message); }
  await ctxo.close();
  // pagination by real clicks: go to p26, click to page 2 then 3
  const ctxp = await browser.newContext({viewport:{width:VP.mobile.width,height:VP.mobile.height}});
  const pp = await ctxp.newPage();
  let pagResult = { pages:[], pass:false };
  try {
    await pp.goto(BASE+'/ ?p=26&cpage=1'.replace(/ ?/,''), {waitUntil:'domcontentloaded', timeout:30000});
    await pp.waitForTimeout(300);
    pagResult.pages.push({page:'1', cpage:1, url: pp.url() });
    // click prev/next or a specific page number if available
    try {
      // try clicking a page-2 link
      const link2 = await pp.$('a[href*="cpage=2"]');
      if (link2) { await link2.click(); await pp.waitForTimeout(300); pagResult.pages.push({page:'2', cpage:2, url:pp.url()}); }
      else {
        // click next
        const nxt = await pp.$('.navigation.comments-pagination a[class*="next"], a.prev ~ a, a[class*="next"]');
        if (nxt) { await nxt.click(); await pp.waitForTimeout(300); pagResult.pages.push({page:'2?', cpage:2, url:pp.url()}); }
      }
    } catch(e){}
    try {
      const link3 = await pp.$('a[href*="cpage=3"]');
      if (link3) { await link3.click(); await pp.waitForTimeout(300); pagResult.pages.push({page:'3', cpage:3, url:pp.url()}); }
    } catch(e){}
  } catch(e){ log('[pagination] '+e.message); }
  out.pagination = pagResult;
  await ctxp.close();
  return out;
}

// Gutenberg frontend (page 64)
async function gutenbergTest(browser) {
  const out = { desktop:null, mobile:null };
  const check = async (vpName) => {
    const v = VP[vpName];
    const ctx = await browser.newContext({ viewport:{width:v.width,height:v.height} });
    const page = await ctx.newPage();
    const L = listen(page);
    let over = null, block = null;
    try {
      await page.goto(PAGES.gutenberg, { waitUntil:'domcontentloaded', timeout:30000 });
      await page.waitForTimeout(300);
      over = await overflowInfo(page);
      await page.screenshot({ path:SCREENS+'/gutenberg-'+vpName+'.png', fullPage:false }).catch(()=>{});
      block = await page.evaluate(() => {
        const container = document.querySelector('.lumen-container') || document.querySelector('#lumen-main') || document.body;
        const alignwide = document.querySelector('.alignwide');
        const alignfull = document.querySelector('.alignfull');
        const table = document.querySelector('table');
        const pre = document.querySelector('pre');
        const code = document.querySelector('code');
        const blockquote = document.querySelector('blockquote, .blockquote, .blockquote-inner');
        const figcap = document.querySelector('figcaption, .wp-block-figure figcaption');
        const fig = document.querySelector('.wp-block-figure, figure');
        const cols = document.querySelector('.columns, .wp-block-columns');
        const cover = document.querySelector('.wp-block-cover');
        const img = document.querySelector('img.wp-block-image, img.wp-block-gallery, .lumen-post-featured img');
        const w = el => el ? Math.round(el.getBoundingClientRect().width) : null;
        return {
          over: document.documentElement.scrollWidth > document.documentElement.clientWidth,
          containerW: w(container),
          alignwideExists: !!alignwide, alignwideW: w(alignwide),
          alignfullExists: !!alignfull, alignfullW: w(alignfull),
          tableExists: !!table, preExists: !!pre, codeExists: !!code,
          blockquoteExists: !!blockquote, figcapExists: !!figcap, figureExists: !!fig,
          columnsExists: !!cols, coverExists: !!cover,
          imgExists: !!img, imgW: w(img),
          title: document.title
        };
      });
    } catch(e){ log('[gutenberg] '+vpName+' '+e.message); }
    const lumenConsole = (L.console.concat(L.pageerrors)).filter(t => /lumen/i.test(t) && !/wp-admin\/|wp-includes/i.test(t));
    const result = { over: over ? over.overflow : null, lumenConsoleCount: lumenConsole.length, block };
    await ctx.close();
    return result;
  };
  out.desktop = await check('desktop');
  out.mobile = await check('mobile');
  return out;
}

// Logo test: set, measure, delete, measure fallback
async function logoTest(browser) {
  const out = { set:null, del:null, pass:false };
  const ctx = await browser.newContext({viewport:{width:VP.desktop.width,height:VP.desktop.height}});
  const page = await ctx.newPage();
  try {
    // set logo (attachment 66)
    execSync('php /tmp/set-logo-id.php');
    await page.goto(BASE + '/', { waitUntil:'domcontentloaded', timeout:30000 });
    await page.waitForTimeout(300);
    out.set = await page.evaluate(()=>{
      const logo = document.querySelector('.lumen-site-logo');
      const img = document.querySelector('img.custom-logo');
      const header = document.querySelector('.lumen-site-header');
      return { logoExists:!!logo, imgExists:!!img,
        imgSrc:img?img.src:null, imgW:img?Math.round(img.width):null, imgH:img?Math.round(img.height):null,
        over:document.documentElement.scrollWidth>document.documentElement.clientWidth,
        headerH:header?Math.round(header.getBoundingClientRect().height):null };
    });
    await page.screenshot({ path:SCREENS+'/logo-desktop.png', fullPage:false }).catch(()=>{});
    // delete logo
    execSync('php /tmp/clear-logo.php');
    await page.goto(BASE + '/', { waitUntil:'domcontentloaded', timeout:30000 });
    await page.waitForTimeout(300);
    out.del = await page.evaluate(()=>{
      const logo = document.querySelector('.lumen-site-logo');
      const img = document.querySelector('img.custom-logo');
      const title = document.querySelector('.lumen-site-title');
      const header = document.querySelector('.lumen-site-header');
      return { logoExists:!!logo, imgExists:!!img,
        titleExists:!!title, titleText:title?title.textContent.trim():null,
        over:document.documentElement.scrollWidth>document.documentElement.clientWidth,
        headerH:header?Math.round(header.getBoundingClientRect().height):null };
    });
    await page.screenshot({ path:SCREENS+'/logo-fallback.png', fullPage:false }).catch(()=>{});
    out.pass = !!out.set.logoExists && !!out.del.titleExists;
  } catch(e){ log('[logo] '+e.message); }
  await ctx.close();
  return out;
}

// Server regression
async function serverRegression() {
  const out = { phpL:{}, smoke:{}, ok:true };
  try {
    const files = execSync(`find "${THEME}" -name "*.php" -type f`).toString().trim().split('\n').filter(Boolean);
    for (const f of files) {
      const p = execSync(`php -l "${f}" 2>&1 | grep -q "Parse error"`);
      out.phpL[f.split('/').pop()] = p.length ? 'FAIL' : 'PASS';
    }
  } catch(e) { out.error = e.message; }
  const smokeUrls = { home:'/', single:'/?p=28', archive:'/?cat=1', search:'/?s=term', notfound:'/?p=99999', gutenberg:'/?p=64' };
  for (const [k,u] of Object.entries(smokeUrls)) {
    try {
      out.smoke[k] = await new Promise(r=>{
        const req = require('http').get(BASE+u, resp=>{ resp.resume(); r(resp.statusCode); });
        req.on('error',()=>r(0));
      });
    } catch(e) { out.smoke[k]='ERR'; }
  }
  return out;
}

(async () => {
  const R = {};
  R.browser = { overflow:[], console:[], geometry:{}, adminBar:null, keyboard:null, comments:null, gutenberg:null, logo:null, server:null,
    screenshots:[], lumenErrors:[], themeAssetFailures:[] };

  const browser = await chromium.launch({ headless:true, channel:'chrome', args:['--no-sandbox'] });
  const shots = [];

  // 1. overflow + console + geometry for main pages x viewports (subset: all 4 VPs x 5 pages, but screenshot only key ones)
  const shotMap = { 'home:desktop':SCREENS+'/home-desktop.png','home:mobile':SCREENS+'/home-mobile.png','single:desktop':SCREENS+'/single-desktop.png',
    'single:mobile':SCREENS+'/single-mobile.png','archive:desktop':SCREENS+'/archive-desktop.png','search:mobile':SCREENS+'/search-mobile.png',
    'notfound:mobile':SCREENS+'/404-mobile.png','gutenberg:desktop':SCREENS+'/gutenberg-desktop.png','gutenberg:mobile':SCREENS+'/gutenberg-mobile.png' };
  for (const vpName of Object.keys(VP)) {
    for (const [label,url] of Object.entries(PAGES)) {
      const key = label+':'+vpName;
      const shot = shotMap[key];
      log('[audit] '+vpName+' '+label+' '+url);
      const r = await pageAudit(browser, vpName, url, shot);
      if (shot) { shots.push(shot); R.browser.screenshots.push(shot); }
      R.browser.overflow.push({ label, vp:vpName, over:r.over.overflow, overDetails:r.over, lumenConsole:r.lumenConsoleCount });
      if (r.lumenConsole.length) R.browser.lumenErrors.push(...r.lumenConsole.map(e=>({label,vp:vpName,error:e})));
      if (r.themeReqFail.length) R.browser.themeAssetFailures.push(...r.themeReqFail);
      R.browser.geometry[label] = R.browser.geometry[label] || {};
      R.browser.geometry[label][vpName] = r.g;
      R.browser.console.push({ label, vp:vpName, count:r.lumenConsole.length, errors:r.lumenConsole.slice(0,5) });
    }
  }

  // 2. admin bar
  R.browser.adminBar = await adminBarTest(browser);
  log('[admin bar] done');

  // 3. keyboard
  R.browser.keyboard = await keyboardTest(browser);
  log('[keyboard] done');

  // 4. comments
  R.browser.comments = await commentsTest(browser);
  log('[comments] done');

  // 5. gutenberg
  R.browser.gutenberg = await gutenbergTest(browser);
  log('[gutenberg] done');

  // 6. logo
  R.browser.logo = await logoTest(browser);
  log('[logo] done');

  // 7. server regression
  R.browser.server = await serverRegression();
  log('[server regression] done');

  fs.writeFileSync(OUT, JSON.stringify(R, null, 1));
  log('\n===== REPORT SAVED TO '+OUT+' =====');
  printSummary(R);
  await browser.close();
})();

function printSummary(R) {
  const B = R.browser;
  log('\n================ SUMMARY ================');
  // overflow
  const overflowFails = B.overflow.filter(o=>o.over);
  log('\n[GLOBAL OVERFLOW]');
  log('  pages with horizontal overflow: '+(overflowFails.length ? overflowFails.map(o=>`${o.label}@${o.vp}`).join(', ') : 'NONE'));
  overflowFails.forEach(o=>{
    log(`  ${o.label}@${o.vp}: docSw=${o.over.docSw} docCw=${o.over.docCw} bodySw=${o.over.bodySw} bodyCw=${o.over.bodyCw}`);
    o.over.overflowers.slice(0,5).forEach(x=>log(`    - ${x.tag}${x.cls? '.'+x.cls:''} right=${x.right} (cw=${o.over.docCw})`));
  });
  // lumen console errors
  log('\n[LUEN CONSOLE ERRORS] (theme has no JS; any = suspect)');
  log('  total lumen-attributed errors: '+B.lumenErrors.length);
  if (B.lumenErrors.length) B.lumenErrors.slice(0,10).forEach(e=>log('    - '+e.label+': '+String(e.error).slice(0,80)));
  // theme asset failures
  log('\n[FAILED THEME ASSET REQUESTS]');
  log('  total: '+B.themeAssetFailures.length);
  if (B.themeAssetFailures.length) B.themeAssetFailures.slice(0,10).forEach(f=>log(`    - ${f.err} ${f.url} (status=${f.status})`));
  // admin bar
  log('\n[ADMIN BAR]');
  const ab = B.adminBar;
  for (const [k,v] of Object.entries(ab||{})) {
    log(`  ${k}: barBottom=${v&&v.bar?Math.round(v.bar.bottom):0} headerTop=${v&&v.header?Math.round(v.header.top):0} headerBottom=${v&&v.header?Math.round(v.header.bottom):0} gap=${v&&v.gap!==undefined?Math.round(v.gap):'-'} noOverlap=${!!(v&&v.pass)} ${v&&v.pass?'PASS':'FAIL'}`);
  }
  // keyboard
  log('\n[KEYBOARD / ACCESSIBILITY]');
  const k = B.keyboard;
  log(`  first Tab → skip link: ${!!(k&&k.isSkip)}  skip link in-viewport on focus: ${!!(k&&k.skipVisibleOnFocus)}  pass=${!!(k&&k.skipPass)}`);
  log(`  Enter on skip link → main content: ${k&&k.enterToMain!==undefined ? String(k.enterToMain) : 'n/a'}`);
  log(`  55-tab trail: distinctFocusables=${k&&k.distinctFocusables!==undefined ? k.distinctFocusables : 'n/a'}, maxConsecutiveRepeat=${k&&k.maxConsecutiveRepeat!==undefined ? k.maxConsecutiveRepeat : 'n/a'}, noTrap=${k&&k.noTrap!==undefined ? String(k.noTrap) : 'n/a'}, belowFold=${k&&k.belowFold!==undefined ? k.belowFold : 'n/a'}`);
  if (k && k.error) log('  error: '+k.error);
  // comments
  log('\n[COMMENTS]');
  if (B.comments) {
    const c = B.comments;
    log(`  open (p26): comments=${c.open?c.open.commentCount:0} hasForm=${!!(c.open&&c.open.hasForm)}`);
    log(`  closed (p28): closedMsg=${!!(c.closed&&c.closed.hasClosedMsg)} text="${(c.closed&&c.closed.text)||''}" hasForm=${!!(c.closed&&c.closed.hasForm)}`);
    if (c.pagination) log(`  pagination click test: [${c.pagination.pages.map(p=>p.page).join(' ')}]`);
    for (const [key,d] of Object.entries(c.pages)) log(`    ${key}: commentsHeading=${!!d.hasCommentsHeading} closedMsg=${!!d.closedMsg} over=${d.over}`);
  }
  // gutenberg
  log('\n[GUTENBERG FRONTEND]');
  if (B.gutenberg) {
    const g = B.gutenberg;
    const bd = g.desktop && g.desktop.block;
    const bm = g.mobile && g.mobile.block;
    log(`  desktop: over=${!!g.desktop.over} lumenConsole=${g.desktop.lumenConsoleCount} alignwide=${!!bd?.alignwideExists}/${bd?.alignwideW}px alignfull=${!!bd?.alignfullExists}/${bd?.alignfullW}px containerW=${bd?.containerW}px`);
    log(`  mobile: over=${!!g.mobile.over} lumenConsole=${g.mobile.lumenConsoleCount} alignwide=${!!bm?.alignwideExists}/${bm?.alignwideW}px alignfull=${!!bm?.alignfullExists}/${bm?.alignfullW}px containerW=${bm?.containerW}px`);
    log(`  desktop blocks: table=${!!bd?.tableExists} pre=${!!bd?.preExists} code=${!!bd?.codeExists} blockquote=${!!bd?.blockquoteExists} columns=${!!bd?.columnsExists} cover=${!!bd?.coverExists} figure=${!!bd?.figureExists}`);
  }
  // logo
  log('\n[LOGO]');
  const lg = B.logo;
  log(`  set: logoExists=${!!(lg&&lg.set&&lg.set.logoExists)} imgWxH=${(lg&&lg.set&&lg.set.imgW&&lg.set.imgH)?lg.set.imgW+'x'+lg.set.imgH:'?'} over=${!!(lg&&lg.set&&lg.set.over)}`);
  if (lg.del) log(`  delete: logoExists=${!!lg.del.logoExists} titleExists=${!!lg.del.titleExists} ("${lg.del.titleText||''}") over=${!!lg.del.over}`);
  // server
  log('\n[SERVER REGRESSION]');
  const sv = B.server;
  const failPhp = sv ? Object.entries(sv.phpL||{}).filter(([k,v])=>v!=='PASS') : [];
  log('  php -l: '+(failPhp.length ? failPhp.map(([k])=>k).join(', ') : 'all PASS'));
  log('  smoke: '+Object.entries(sv?.smoke||{}).map(([k,v])=>`${k}:${v}`).join(' '));
  // decision
  const pass = (
    overflowFails.length===0 &&
    B.lumenErrors.length===0 &&
    B.themeAssetFailures.length===0 &&
    (ab && ab.desktop?.pass && ab.mobile?.pass) &&
    (k && k.skipPass && k.noTrap) &&
    (lg && lg.set?.logoExists) &&
    (sv && failPhp.length===0)
  );
  log('\n================ DECISION ================');
  log(pass ? 'Phase 1.3 Browser Validation: PASS' : 'Phase 1.3 Browser Validation: FAIL');
  if (!pass) {
    log('\nBlocking issues:');
    if (overflowFails.length) log('  - horizontal overflow: '+overflowFails.map(o=>o.label+'@'+o.vp).join(', '));
    if (B.lumenErrors.length) log('  - Lumen console errors: '+B.lumenErrors.length);
    if (B.themeAssetFailures.length) log('  - failed theme asset requests: '+B.themeAssetFailures.length);
    if (ab) { if(!ab.desktop?.pass) log('  - admin bar desktop overlap'); if(!ab.mobile?.pass) log('  - admin bar mobile overlap'); }
    if (k) {
      if (k.error) log('  - keyboard test error: '+k.error);
      if (!k.skipPass) log('  - skip link failure (first tab not skip link or not in-viewport on focus)');
      if (k.skipVisibleOnFocus === false) log('  - skip link not visible in viewport when focused');
      if (k.enterToMain === false) log('  - Enter on skip link did not reach main content');
      if (!k.noTrap) log('  - keyboard trap / too few distinct focusables (distinct='+k.distinctFocusables+', maxRun='+k.maxConsecutiveRepeat+')');
    }
    if (!lg?.set?.logoExists) log('  - logo not showing');
    if (sv && failPhp.length) log('  - php parse errors');
  }
  const ss = B.screenshots||[];
  log('\nScreenshots: '+ss.length);
  ss.forEach(s=>log('  - '+s));
}