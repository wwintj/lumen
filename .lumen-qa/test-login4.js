const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch({ headless: true, channel: 'chrome', args: ['--no-sandbox'] });
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  await page.goto('http://127.0.0.1:4242/wp-login.php', { waitUntil: 'domcontentloaded' });
  await page.fill('input[name="log"]', 'admin');
  await page.fill('input[name="pwd"]', 'admin');
  await page.click('#wp-submit');
  await page.waitForURL('http://127.0.0.1:4242/wp-admin/**', { timeout: 30000 });
  await page.goto('http://127.0.0.1:4242/', { waitUntil: 'networkidle' });
  // Robust: wait for the admin bar to be visible
  await page.waitForSelector('body.admin-bar', { state: 'visible' });
  await page.waitForSelector('#wpadminbar', { state: 'visible' });
  const info = await page.evaluate(() => {
    const b = document.getElementById('wpadminbar');
    const h = document.querySelector('.lumen-site-header');
    const r = (el) => el ? { x:Math.round(el.getBoundingClientRect().x), y:Math.round(el.getBoundingClientRect().y), w:Math.round(el.getBoundingClientRect().width), h:Math.round(el.getBoundingClientRect().height), bottom:Math.round(el.getBoundingClientRect().bottom), top:Math.round(el.getBoundingClientRect().top), display:getComputedStyle(el).display, visibility:getComputedStyle(el).visibility } : null;
    return { bodyAdminBar: document.body.classList.contains('admin-bar'), barExists: !!b, bar: r(b), header: r(h), headerExists: !!h };
  });
  console.log(JSON.stringify(info, null, 2));
  await browser.close();
})();
