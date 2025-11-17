// Use Playwright CLI instead
import { exec } from 'child_process';
import { promisify } from 'util';
const execAsync = promisify(exec);

const browser = await chromium.launch({ headless: false });
const page = await browser.newPage();

// Capture console messages
const consoleMessages = [];
page.on('console', msg => {
  consoleMessages.push({
    type: msg.type(),
    text: msg.text(),
  });
});

// Capture network errors
const networkErrors = [];
page.on('response', response => {
  if (response.status() >= 400) {
    networkErrors.push({
      url: response.url(),
      status: response.status(),
    });
  }
});

console.log('Navigating to http://localhost:5173...');
await page.goto('http://localhost:5173', { waitUntil: 'networkidle' });

console.log('Waiting for game to load...');
await page.waitForTimeout(3000);

// Take screenshot of main screen
await page.screenshot({ path: '/tmp/sprite-check-main.png', fullPage: true });
console.log('✅ Screenshot saved: /tmp/sprite-check-main.png');

// Try to navigate to battle or party screen to see sprites
console.log('\n=== Console Messages ===');
consoleMessages.forEach(msg => {
  if (msg.type === 'error' || msg.type === 'warning') {
    console.log(`[${msg.type.toUpperCase()}] ${msg.text}`);
  }
});

console.log('\n=== Network Errors ===');
if (networkErrors.length > 0) {
  networkErrors.forEach(err => {
    console.log(`❌ ${err.status}: ${err.url}`);
  });
} else {
  console.log('✅ No network errors');
}

// Check if sprites are loading by looking for img tags
const spriteImages = await page.evaluate(() => {
  const imgs = Array.from(document.querySelectorAll('img'));
  return imgs.map(img => ({
    src: img.src,
    loaded: img.complete && img.naturalWidth > 0,
    width: img.naturalWidth,
    height: img.naturalHeight,
  }));
});

console.log('\n=== Sprite Images Found ===');
spriteImages.forEach((img, i) => {
  const status = img.loaded ? '✅' : '❌';
  const filename = img.src.split('/').pop();
  console.log(`${status} [${i + 1}] ${filename} (${img.width}x${img.height})`);
  if (!img.loaded) {
    console.log(`   URL: ${img.src}`);
  }
});

// Check for placeholder divs (fallback sprites)
const placeholders = await page.evaluate(() => {
  const divs = Array.from(document.querySelectorAll('div'));
  return divs.filter(div => {
    const style = window.getComputedStyle(div);
    return style.backgroundColor && style.backgroundColor !== 'rgba(0, 0, 0, 0)' &&
           div.textContent && div.textContent.length < 20;
  }).map(div => ({
    text: div.textContent.trim(),
    bgColor: window.getComputedStyle(div).backgroundColor,
  }));
});

if (placeholders.length > 0) {
  console.log('\n=== Placeholder Divs (Possible Sprite Fallbacks) ===');
  placeholders.slice(0, 10).forEach((p, i) => {
    console.log(`[${i + 1}] "${p.text}" (bg: ${p.bgColor})`);
  });
}

// Try to click into battle or party management
console.log('\n=== Attempting to Navigate to Battle/Party Screen ===');
try {
  // Look for any clickable elements that might lead to battle
  const battleButton = await page.locator('text=/battle|fight|start/i').first();
  if (await battleButton.isVisible({ timeout: 2000 }).catch(() => false)) {
    await battleButton.click();
    await page.waitForTimeout(2000);
    await page.screenshot({ path: '/tmp/sprite-check-battle.png', fullPage: true });
    console.log('✅ Battle screenshot saved: /tmp/sprite-check-battle.png');
  }
} catch (e) {
  console.log('⚠️  Could not navigate to battle screen');
}

// Keep browser open for manual inspection
console.log('\n=== Browser will stay open for 30 seconds for manual inspection ===');
console.log('Check the browser window and then press Ctrl+C to close');
await page.waitForTimeout(30000);

await browser.close();

