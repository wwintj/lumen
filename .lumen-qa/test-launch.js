const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch({ headless: true, channel: 'chrome', args: ['--no-sandbox'] });
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1440, height: 900 });
  const start = Date.now();
  await page.goto('http://127.0.0.1:4242/', { waitUntil: 'networkidle', timeout: 30000 });
  const title = await page.title();
  const url = page.url();
  const sw = await page.evaluate('document.documentElement.scrollWidth');
  const cw = await page.evaluate('document.documentElement.clientWidth');
  console.log('URL:', url);
  console.log('title:', title);
  console.log('scrollWidth:', sw, 'clientWidth:', cw, 'overflow:', sw > cw);
  console.log('TIME:', (Date.now()-start)+'ms');
  await browser.close();
})();
