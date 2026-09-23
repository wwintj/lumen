const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch({ headless:true, channel:'chrome', args:['--no-sandbox'] });
  const ctx = await browser.newContext({ viewport:{width:1440,height:900} });
  const page = await ctx.newPage();
  await page.goto('http://127.0.0.1:4242/', { waitUntil:'domcontentloaded', timeout:30000 });
  await page.waitForTimeout(300);
  // Count all focusable elements
  const focusable = await page.evaluate(() => {
    const els = Array.from(document.querySelectorAll('a[href], button, [tabindex]:not([tabindex="-1"]), input, select, textarea, [role="button"]'));
    return els.map(e => ({ tag:e.tagName, id:e.id, type:e.type, href:e.getAttribute&&e.getAttribute('href'),
      rect: e.getBoundingClientRect(),
      cs_display: getComputedStyle(e).display, cs_visibility: getComputedStyle(e).visibility, cs_pointer: getComputedStyle(e).pointerEvents }));
  });
  console.log('FOCUSABLE COUNT:', focusable.length);
  console.log('ALL FOCUSABLES:');
  focusable.forEach((e,i)=>{
    const inVp = e.rect.top>=0&&e.rect.bottom<=900&&e.rect.left>=0&&e.rect.right<=1440;
    console.log(`  ${i}: ${e.tag}#${e.id||''} type=${e.type||''} href=${(e.href||'').slice(0,40)} inVP=${inVp} disp=${e.cs_display} vis=${e.cs_visibility} pointer=${e.cs_pointer}`);
  });
  // Now press Tab several times
  console.log('\n\nTAB TRAIL:');
  for (let i=0;i<20;i++){
    await page.keyboard.press('Tab'); await page.waitForTimeout(80);
    const f = await page.evaluate(()=>{
      const a=document.activeElement; if(!a) return {none:true};
      const r=a.getBoundingClientRect(); const cs=getComputedStyle(a);
      const inVp = r.top>=0&&r.bottom<=window.innerHeight&&r.left>=0&&r.right<=window.innerWidth;
      return { tag:a.tagName, id:a.id, type:a.type, href:a.getAttribute&&a.getAttribute('href'),
        w:Math.round(r.width),h:Math.round(r.height),top:Math.round(r.top),left:Math.round(r.left),
        disp:cs.display,vis:cs.visibility,pointer:cs.pointerEvents,opacity:cs.opacity, inVP:inVp };
    });
    console.log(`Tab ${i+1}: ${f.tag}#${f.id||''} type=${f.type||''} href=${(f.href||'').slice(0,30)} inVP=${f.inVP} disp=${f.disp} vis=${f.vis} opacity=${f.opacity} w=${f.w}h=${f.h}`);
  }
  await browser.close();
})();
