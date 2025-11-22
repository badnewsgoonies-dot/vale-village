import { test, expect } from '@playwright/test';

test('Check sprites are loading', async ({ page }) => {
  // Capture console messages
  const consoleMessages: Array<{ type: string; text: string }> = [];
  page.on('console', msg => {
    consoleMessages.push({
      type: msg.type(),
      text: msg.text(),
    });
  });

  // Capture network errors
  const networkErrors: Array<{ url: string; status: number }> = [];
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

  // Check console for errors
  console.log('\n=== Console Messages ===');
  const errors = consoleMessages.filter(msg => msg.type === 'error' || msg.type === 'warning');
  errors.forEach(msg => {
    console.log(`[${msg.type.toUpperCase()}] ${msg.text}`);
  });

  // Check network errors
  console.log('\n=== Network Errors ===');
  if (networkErrors.length > 0) {
    networkErrors.forEach(err => {
      console.log(`❌ ${err.status}: ${err.url}`);
    });
  } else {
    console.log('✅ No network errors');
  }

  // Check if sprites are loading
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
    const filename = img.src.split('/').pop() || 'unknown';
    console.log(`${status} [${i + 1}] ${filename} (${img.width}x${img.height})`);
    if (!img.loaded && img.src.includes('sprites')) {
      console.log(`   ⚠️  Failed to load: ${img.src}`);
    }
  });

  // Check for placeholder divs
  const placeholders = await page.evaluate(() => {
    const divs = Array.from(document.querySelectorAll('div'));
    return divs.filter(div => {
      const style = window.getComputedStyle(div);
      const hasBg = style.backgroundColor && style.backgroundColor !== 'rgba(0, 0, 0, 0)';
      const hasText = div.textContent && div.textContent.trim().length > 0 && div.textContent.trim().length < 30;
      return hasBg && hasText;
    }).slice(0, 10).map(div => ({
      text: div.textContent?.trim() || '',
      bgColor: window.getComputedStyle(div).backgroundColor,
    }));
  });

  if (placeholders.length > 0) {
    console.log('\n=== Possible Sprite Placeholders Found ===');
    placeholders.forEach((p, i) => {
      console.log(`[${i + 1}] "${p.text.substring(0, 20)}" (bg: ${p.bgColor})`);
    });
  }

  // Try to navigate to areas with sprites
  console.log('\n=== Checking for sprite elements ===');
  const spriteElements = await page.evaluate(() => {
    // Look for SimpleSprite components (they render img tags)
    const imgs = Array.from(document.querySelectorAll('img[src*="sprites"]')) as HTMLImageElement[];
    return imgs.map(img => ({
      src: img.src,
      alt: img.alt,
      loaded: img.complete && img.naturalWidth > 0,
    }));
  });

  console.log(`Found ${spriteElements.length} sprite images`);
  spriteElements.forEach((sprite, i) => {
    const status = sprite.loaded ? '✅' : '❌';
    const filename = sprite.src.split('/').pop() || 'unknown';
    console.log(`${status} ${filename}`);
  });

  // Keep browser open briefly for inspection
  await page.waitForTimeout(2000);
});

