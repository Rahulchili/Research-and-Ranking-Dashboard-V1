const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

(async () => {
  const browser = await puppeteer.launch({
    args: ['--no-sandbox','--disable-setuid-sandbox'],
    headless: 'new'
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });
  const filePath = 'file:///sessions/compassionate-nice-johnson/mnt/Q2Q_ER_Cowork/management_credibility_project/Dashboard.html';
  await page.goto(filePath, { waitUntil: 'networkidle2', timeout: 30000 });

  // Click through each META sub-page and screenshot
  const pages = [
    { id: 'dashboard',          file: '00_home.png' },
    { id: 'meta-fundamental',   file: '01_meta_fundamental.png' },
    { id: 'meta-technical',     file: '02_meta_technical.png' },
    { id: 'ticker:META',        file: '03_meta_mcs.png' },
    { id: 'meta-options',       file: '04_meta_options.png' },
    { id: 'meta-valuation',     file: '05_meta_valuation.png' },
    { id: 'meta-consolidated',  file: '06_meta_consolidated.png' },
    { id: 'meta-summary',       file: '07_meta_summary.png' },
  ];
  const outDir = '/sessions/compassionate-nice-johnson/mnt/outputs/dash_render';
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir);

  for (const p of pages) {
    await page.evaluate((id) => {
      window.activePage = id;
      buildSidebar();
      render();
      window.scrollTo({ top: 0 });
    }, p.id);
    await new Promise(r => setTimeout(r, 800));
    await page.screenshot({ path: path.join(outDir, p.file), fullPage: true });
    console.log('Captured', p.file);
  }
  await browser.close();
})();
