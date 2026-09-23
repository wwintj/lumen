const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch({ headless: true, channel: 'chrome', args: ['--no-sandbox'] });
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  await page.goto('http://127.0.0.1:4242/wp-login.php', { waitUntil: 'domcontentloaded', timeout: 30000 });
  const html = await page.content();
  // find form and inputs
  const forms = html.match(/<form[^>]*>/gi);
  console.log('forms found:', forms);
  // find the login form id
  const loginForm = html.match(/<form[^>]*id="log-in"?[^>]*>/i) || html.match(/<form[^>]*name="log-in"/i) || [html];
  const buttons = html.match(/<button[^>]*>|<input[^>]*type="submit"[^>]*>/gi);
  console.log('buttons/submits:', buttons);
  const inputs = html.match(/<input[^>]*name="[a-z]+"[^>]*>/gi) || [];
  console.log('inputs (sample):', inputs.slice(0,20));
  await browser.close();
})();
