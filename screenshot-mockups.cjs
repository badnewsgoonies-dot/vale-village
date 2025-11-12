const puppeteer = require('puppeteer');
const path = require('path');

async function takeScreenshot(htmlFile, outputFile, viewport = { width: 1200, height: 900 }) {
  console.log(`Taking screenshot of ${htmlFile}...`);
  
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const page = await browser.newPage();
  await page.setViewport(viewport);
  
  const filePath = 'file://' + path.resolve(htmlFile);
  await page.goto(filePath, { waitUntil: 'networkidle0', timeout: 30000 });
  
  // Wait a bit for GIF animations to load
  await page.waitForTimeout(2000);
  
  await page.screenshot({ path: outputFile, fullPage: true });
  console.log(`✅ Saved: ${outputFile}`);
  
  await browser.close();
}

async function main() {
  const mockupDir = './mockups/sprite-implementation';
  
  await takeScreenshot(
    `${mockupDir}/battle-scene-mock.html`,
    `${mockupDir}/battle-scene-screenshot.png`,
    { width: 1200, height: 1000 }
  );
  
  await takeScreenshot(
    `${mockupDir}/menu-icons-mock.html`,
    `${mockupDir}/menu-icons-screenshot.png`,
    { width: 1400, height: 1200 }
  );
  
  await takeScreenshot(
    `${mockupDir}/overworld-characters-mock.html`,
    `${mockupDir}/overworld-screenshot.png`,
    { width: 1200, height: 1400 }
  );
  
  console.log('\n🎉 All screenshots captured!');
}

main().catch(console.error);
