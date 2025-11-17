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

  // Check console for errors and catalog logs
  console.log('\n=== Console Messages ===');
  const allMessages = consoleMessages.map(msg => `[${msg.type.toUpperCase()}] ${msg.text}`);
  const catalogLogs = allMessages.filter(msg => msg.includes('SpriteCatalog') || msg.includes('SPRITE_LIST'));
  const spriteLogs = allMessages.filter(msg => msg.includes('SimpleSprite'));
  const errors = consoleMessages.filter(msg => msg.type === 'error' || msg.type === 'warning');
  
  if (catalogLogs.length > 0) {
    console.log('\n=== Sprite Catalog Logs ===');
    catalogLogs.forEach(log => console.log(log));
  } else {
    console.log('⚠️  No SpriteCatalog logs found - catalog may not be loading!');
  }
  
  if (spriteLogs.length > 0) {
    console.log('\n=== SimpleSprite Logs (first 10) ===');
    spriteLogs.slice(0, 10).forEach(log => console.log(log));
  }
  
  console.log('\n=== Errors & Warnings ===');
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
    const imgs = Array.from(document.querySelectorAll('img[src*="sprites"]'));
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

  // Try to navigate to overworld or party screen to see sprites
  console.log('\n=== Attempting to Navigate to Overworld ===');
  try {
    // Look for "Start" or "Continue" button
    const startButton = page.locator('text=/start|continue|new game/i').first();
    if (await startButton.isVisible({ timeout: 2000 }).catch(() => false)) {
      await startButton.click();
      await page.waitForTimeout(2000);
      await page.screenshot({ path: '/tmp/sprite-check-overworld.png', fullPage: true });
      console.log('✅ Overworld screenshot saved: /tmp/sprite-check-overworld.png');
    }

    // Try to open party management (P key or button)
    await page.keyboard.press('P');
    await page.waitForTimeout(1000);
    await page.screenshot({ path: '/tmp/sprite-check-party.png', fullPage: true });
    console.log('✅ Party screen screenshot saved: /tmp/sprite-check-party.png');

    // Check sprites again after navigation
    const spritesAfterNav = await page.evaluate(() => {
      const imgs = Array.from(document.querySelectorAll('img[src*="sprites"]'));
      return imgs.map(img => ({
        src: img.src,
        loaded: img.complete && img.naturalWidth > 0,
        width: img.naturalWidth,
        height: img.naturalHeight,
      }));
    });

    console.log(`\n=== Sprites After Navigation: ${spritesAfterNav.length} found ===`);
    spritesAfterNav.forEach((sprite, i) => {
      const status = sprite.loaded ? '✅' : '❌';
      const filename = sprite.src.split('/').pop() || 'unknown';
      console.log(`${status} [${i + 1}] ${filename} (${sprite.width}x${sprite.height})`);
    });

    // Deep DOM inspection - check for SimpleSprite components and test catalog access
    const domInspection = await page.evaluate(() => {
      // Test if catalog is accessible from browser context
      const testCatalog = (window as any).__VALE_CATALOG__ || null;
      
      // Look for any divs that might be sprite containers
      const allDivs = Array.from(document.querySelectorAll('div'));
      const spriteContainers = allDivs.filter(div => {
        const children = Array.from(div.children);
        const hasImg = children.some(child => child.tagName === 'IMG');
        const style = window.getComputedStyle(div);
        const hasSize = parseInt(style.width) > 0 && parseInt(style.height) > 0;
        const hasSmallSize = parseInt(style.width) > 0 && parseInt(style.width) < 200 && 
                             parseInt(style.height) > 0 && parseInt(style.height) < 200;
        return hasImg || hasSmallSize;
      }).slice(0, 30);

      return {
        catalogAccessible: testCatalog !== null,
        spriteContainers: spriteContainers.map(div => {
          const imgs = Array.from(div.querySelectorAll('img'));
          const style = window.getComputedStyle(div);
          return {
            className: div.className,
            hasImg: imgs.length > 0,
            imgSrc: imgs[0]?.src || null,
            imgLoaded: imgs[0]?.complete || false,
            imgError: imgs[0]?.naturalWidth === 0 || false,
            textContent: div.textContent?.trim().substring(0, 30) || '',
            computedWidth: style.width,
            computedHeight: style.height,
            backgroundColor: style.backgroundColor,
            // Check if this looks like a placeholder (colored div with text)
            looksLikePlaceholder: style.backgroundColor !== 'rgba(0, 0, 0, 0)' && 
                                  div.textContent && div.textContent.trim().length > 0 &&
                                  div.textContent.trim().length < 30,
          };
        }),
      };
    });

    console.log('\n=== DOM Inspection (Sprite Containers) ===');
    console.log(`Catalog accessible from window: ${domInspection.catalogAccessible ? '✅' : '❌'}`);
    
    const placeholders = domInspection.spriteContainers.filter(c => c.looksLikePlaceholder);
    const withImages = domInspection.spriteContainers.filter(c => c.hasImg);
    
    console.log(`\nFound ${placeholders.length} potential placeholder divs`);
    console.log(`Found ${withImages.length} divs with images`);
    
    if (placeholders.length > 0) {
      console.log('\n=== Potential Sprite Placeholders ===');
      placeholders.slice(0, 10).forEach((container, i) => {
        console.log(`[${i + 1}] ${container.className || '(no class)'}`);
        console.log(`    Size: ${container.computedWidth} x ${container.computedHeight}`);
        console.log(`    BG: ${container.backgroundColor}`);
        console.log(`    Text: "${container.textContent}"`);
      });
    }
    
    if (withImages.length > 0) {
      console.log('\n=== Divs with Images ===');
      withImages.slice(0, 10).forEach((container, i) => {
        const filename = container.imgSrc?.split('/').pop() || 'unknown';
        const status = container.imgLoaded ? '✅' : (container.imgError ? '❌ ERROR' : '⏳ LOADING');
        console.log(`[${i + 1}] ${status} ${filename}`);
        console.log(`    Container: ${container.className || '(no class)'}`);
        console.log(`    Size: ${container.computedWidth} x ${container.computedHeight}`);
      });
    }
  } catch (e) {
    console.log('⚠️  Could not navigate:', e.message);
  }

  // Keep browser open briefly for inspection
  await page.waitForTimeout(2000);
});

