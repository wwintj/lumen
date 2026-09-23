const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch({ headless: true, channel: 'chrome', args: ['--no-sandbox'] });
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  await page.goto('http://127.0.0.1:4242/wp-login.php', { waitUntil: 'domcontentloaded', timeout: 30000 });
  console.log('login page title:', await page.title());
  await page.fill('input[name="log"]', 'admin');
  await page.fill('input[name="pwd"]', 'admin');
  await page.click('#wp-submit');
  await page.waitForURL('http://127.0.0.1:4242/wp-admin/**', { waitUntil: 'networkidle', timeout: 30000 });
  console.log('admin dashboard URL:', page.url());
  // navigate to frontend
  await page.goto('http://127.0.0.1:4242/', { waitUntil: 'networkidle', timeout: 30000 });
  const isAdmin = await page.evaluate('document.body.classList.contains("admin-bar")');
  const hasBar = await page.evaluate('!!document.getElementById("wpadminbar")');
  const barBottom = await page.evaluate('() => { const b = document.getElementById("wpadminbar"); return b ? b.getBoundingClientRect().bottom : null; }');
  const headerTop = await page.evaluate('() => { const h = document.querySelector(".lumen-site-header"); return h ? h.getBoundingClientRect().top : null; }');
  console.log('body.admin-bar:', isAdmin);
  console.log('#wpadminbar exists:', hasBar);
  console.log('adminBar.bottom:', barBottom);
  console.log('siteHeader.top:', headerTop);
  console.log('header above bar:', headerTop >= barBottom ? 'PASS' : 'FAIL');
  await page.screenshot({ path: '/tmp/login-test.png' });
  await browser.close();
})();
