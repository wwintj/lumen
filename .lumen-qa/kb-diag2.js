const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch({ headless:true, channel:'chrome', args:['--no-sandbox'] });
  const ctx = await browser.newContext({ viewport:{width:1440,height:900} });
  const page = await ctx.newPage();
  await page.goto('http://127.0.0.1:4242/', { waitUntil:'domcontentloaded', timeout:30000 });
  await page.waitForTimeout(300);
  // Focus skip link (Tab 1), wait for transition (250ms)
  await page.keyboard.press('Tab'); await page.waitForTimeout(250);
  const f1 = await page.evaluate(()=>{
    const a=document.activeElement; const r=a.getBoundingClientRect(); const cs=getComputedStyle(a);
    return { tag:a.tagName, top:Math.round(r.top), inVP:r.top>=0&&r.bottom<=window.innerHeight&&r.left>=0&&r.right<=window.innerWidth, topStyle:cs.top };
  });
  console.log('After Tab1 (skip link, 250ms):', JSON.stringify(f1));
  // Press Enter
  const beforeEnter = page.url();
  await page.keyboard.press('Enter'); await page.waitForTimeout(500);
  const f2 = await page.evaluate(()=>{
    const a=document.activeElement; const r=a.getBoundingClientRect();
    return { tag:a.tagName, id:a.id, inVP:r.top>=0&&r.bottom<=window.innerHeight, top:Math.round(r.top) };
  });
  console.log('URL unchanged?', beforeEnter === page.url(), ' After Enter active:', JSON.stringify(f2));
  // Now Tab 5 times
  for (let i=1;i<=5;i++){
    await page.keyboard.press('Tab'); await page.waitForTimeout(150);
    const f = await page.evaluate(()=>{
      const a=document.activeElement; const r=a.getBoundingClientRect();
      return { tab:i, tag:a.tagName, id:a.id, href:a.getAttribute&&a.getAttribute('href')?a.getAttribute('href').slice(0,30):'', inVP:r.top>=0&&r.bottom<=window.innerHeight&&r.left>=0&&r.right<=window.innerWidth };
    });
    console.log(JSON.stringify(f));
  }
  await browser.close();
})();
