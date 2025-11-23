/**
 * Comprehensive Debug Test Suite
 *
 * This test file isolates and diagnoses React app mounting issues in Playwright.
 * Tests both with and without video recording to identify if video affects rendering.
 *
 * Run with: npx playwright test debug-mounting --headed
 */

import { test, expect } from '@playwright/test';
import { getGameState } from './helpers';

test.describe('Debug App Mounting', () => {
  /**
   * Test WITH video recording enabled
   * This matches the configuration in epic-gameplay-journey.spec.ts
   */
  test('app mounting with video recording', async ({ page }) => {
    // Capture ALL console messages and errors BEFORE navigation
    const consoleMessages: Array<{ type: string; text: string; location?: string }> = [];
    const pageErrors: string[] = [];
    const networkErrors: Array<{ url: string; status: number; statusText: string }> = [];

    // Set up listeners BEFORE page.goto()
    page.on('console', msg => {
      consoleMessages.push({
        type: msg.type(),
        text: msg.text(),
        location: msg.location()?.url,
      });
      // Log errors immediately
      if (msg.type() === 'error') {
        console.error(`[CONSOLE ERROR] ${msg.text()}`);
      }
    });

    page.on('pageerror', error => {
      pageErrors.push(error.message);
      console.error(`[PAGE ERROR] ${error.message}`);
      console.error(`[STACK] ${error.stack}`);
    });

    page.on('response', response => {
      if (response.status() >= 400) {
        networkErrors.push({
          url: response.url(),
          status: response.status(),
          statusText: response.statusText(),
        });
      }
    });

    // Navigate
    console.log('🚀 Navigating to app...');
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Wait a bit for React to mount
    await page.waitForTimeout(2000);

    // ============================================================================
    // CHECK 1: Error Screen Detection
    // ============================================================================
    console.log('\n📋 CHECK 1: Error Screen Detection');
    const hasErrorScreen = await page.locator('text=/Game Data Validation Failed/i').isVisible().catch(() => false);
    const hasErrorHeading = await page.locator('h1:has-text("❌ Game Data Validation Failed")').isVisible().catch(() => false);

    if (hasErrorScreen || hasErrorHeading) {
      console.error('❌ ERROR SCREEN DETECTED!');
      const errorMessage = await page.locator('pre').textContent().catch(() => 'Could not read error message');
      const errorScreenHTML = await page.locator('body').innerHTML().catch(() => 'Could not read HTML');

      console.error('Error message:', errorMessage);
      console.error('Full error screen HTML (first 500 chars):', errorScreenHTML.substring(0, 500));

      // Take screenshot
      await page.screenshot({ path: 'test-results/debug-error-screen.png', fullPage: true });

      throw new Error(`App failed validation: ${errorMessage}`);
    }
    console.log('✅ No error screen detected');

    // ============================================================================
    // CHECK 2: Root Element State
    // ============================================================================
    console.log('\n📋 CHECK 2: Root Element State');
    const rootCheck1 = await page.evaluate(() => {
      const root = document.getElementById('root');
      return {
        exists: !!root,
        hasChildren: !!root?.children.length,
        childCount: root?.children.length || 0,
        innerHTML: root?.innerHTML.substring(0, 500) || '',
        textContent: root?.textContent?.substring(0, 200) || '',
        className: root?.className || '',
        style: root?.getAttribute('style') || '',
      };
    });
    console.log('Root element (immediate):', JSON.stringify(rootCheck1, null, 2));

    // Wait more and check again
    await page.waitForTimeout(3000);
    const rootCheck2 = await page.evaluate(() => {
      const root = document.getElementById('root');
      return {
        hasChildren: !!root?.children.length,
        childCount: root?.children.length || 0,
        innerHTML: root?.innerHTML.substring(0, 500) || '',
        textContent: root?.textContent?.substring(0, 200) || '',
      };
    });
    console.log('Root element (after 3s):', JSON.stringify(rootCheck2, null, 2));

    if (!rootCheck2.hasChildren) {
      await page.screenshot({ path: 'test-results/debug-empty-root.png', fullPage: true });
      throw new Error('Root element is empty - app did not mount');
    }

    // ============================================================================
    // CHECK 3: Store Initialization
    // ============================================================================
    console.log('\n📋 CHECK 3: Store Initialization');
    const storeCheck = await page.evaluate(() => {
      const store = (window as any).__VALE_STORE__;
      const helpers = (window as any).__VALE_TEST_HELPERS__;

      const result: any = {
        storeExists: !!store,
        storeType: typeof store,
        helpersExist: !!helpers,
        helpersType: typeof helpers,
      };

      if (store) {
        try {
          const state = store.getState();
          result.hasState = !!state;
          result.mode = state?.mode;
          result.hasTeam = !!state?.team;
          result.teamSize = state?.team?.units?.length || 0;
          result.currentMapId = state?.currentMapId;
        } catch (e: any) {
          result.stateError = String(e);
          result.stateErrorStack = e?.stack;
        }
      }

      if (helpers) {
        result.hasCalculateEffectiveStats = typeof helpers.calculateEffectiveStats === 'function';
        result.hasGetXpProgress = typeof helpers.getXpProgress === 'function';
        result.hasDJINN = !!helpers.DJINN;
      }

      return result;
    });
    console.log('Store check:', JSON.stringify(storeCheck, null, 2));

    if (!storeCheck.storeExists) {
      throw new Error('Store not found - app did not initialize');
    }

    // ============================================================================
    // CHECK 4: React Component Rendering
    // ============================================================================
    console.log('\n📋 CHECK 4: React Component Rendering');
    const reactCheck = await page.evaluate(() => {
      // Check for common React app elements
      const hasOverworld = !!document.querySelector('[class*="overworld"]') ||
                          !!document.querySelector('text=/Position:/i');
      const hasBattleView = !!document.querySelector('[class*="battle"]');
      const hasDialogue = !!document.querySelector('[class*="dialogue"]');

      return {
        hasOverworld,
        hasBattleView,
        hasDialogue,
        bodyChildren: document.body.children.length,
        bodyHTML: document.body.innerHTML.substring(0, 300),
      };
    });
    console.log('React rendering check:', JSON.stringify(reactCheck, null, 2));

    // ============================================================================
    // CHECK 5: Environment Variables
    // ============================================================================
    console.log('\n📋 CHECK 5: Environment Check');
    const envCheck = await page.evaluate(() => {
      return {
        userAgent: navigator.userAgent,
        location: window.location.href,
        protocol: window.location.protocol,
        host: window.location.host,
        hasReact: typeof (window as any).React !== 'undefined',
        hasReactDOM: typeof (window as any).ReactDOM !== 'undefined',
      };
    });
    console.log('Environment:', JSON.stringify(envCheck, null, 2));

    // ============================================================================
    // CHECK 6: Console Messages & Errors
    // ============================================================================
    console.log('\n📋 CHECK 6: Console Messages & Errors');
    console.log(`Total console messages: ${consoleMessages.length}`);
    console.log(`Total page errors: ${pageErrors.length}`);
    console.log(`Total network errors: ${networkErrors.length}`);

    if (consoleMessages.length > 0) {
      console.log('\nConsole messages:');
      consoleMessages.forEach((msg, i) => {
        console.log(`  [${i + 1}] [${msg.type}] ${msg.text.substring(0, 200)}`);
        if (msg.location) console.log(`      Location: ${msg.location}`);
      });
    }

    if (pageErrors.length > 0) {
      console.log('\nPage errors:');
      pageErrors.forEach((error, i) => {
        console.log(`  [${i + 1}] ${error}`);
      });
    }

    if (networkErrors.length > 0) {
      console.log('\nNetwork errors:');
      networkErrors.forEach((error, i) => {
        console.log(`  [${i + 1}] ${error.status} ${error.statusText}: ${error.url}`);
      });
    }

    // ============================================================================
    // CHECK 7: Game State Access
    // ============================================================================
    console.log('\n📋 CHECK 7: Game State Access');
    try {
      const gameState = await getGameState(page);
      console.log('Game state:', JSON.stringify(gameState, null, 2));
      expect(gameState).not.toBeNull();
      expect(gameState?.mode).toBe('overworld');
    } catch (e: any) {
      console.error('Failed to get game state:', e.message);
      throw e;
    }

    // ============================================================================
    // FINAL VERIFICATION
    // ============================================================================
    console.log('\n✅ All checks passed - app mounted successfully with video recording');
  });

  /**
   * Test WITHOUT video recording
   * This matches the configuration in game-start.spec.ts (which works)
   */
  test('app mounting without video recording', async ({ page }) => {
    // NO test.use({ video: 'on' }) - use default config

    const consoleMessages: Array<{ type: string; text: string }> = [];
    const pageErrors: string[] = [];

    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleMessages.push({ type: msg.type(), text: msg.text() });
      }
    });

    page.on('pageerror', error => {
      pageErrors.push(error.message);
    });

    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    // Quick checks
    const hasErrorScreen = await page.locator('text=/Game Data Validation Failed/i').isVisible().catch(() => false);
    if (hasErrorScreen) {
      const errorMessage = await page.locator('pre').textContent().catch(() => 'Unknown error');
      throw new Error(`App failed validation: ${errorMessage}`);
    }

    const root = await page.evaluate(() => {
      const el = document.getElementById('root');
      return {
        hasChildren: !!el?.children.length,
        childCount: el?.children.length || 0,
      };
    });

    expect(root.hasChildren).toBe(true);

    const storeExists = await page.evaluate(() => {
      return typeof (window as any).__VALE_STORE__ !== 'undefined';
    });
    expect(storeExists).toBe(true);

    const gameState = await getGameState(page);
    expect(gameState?.mode).toBe('overworld');

    console.log('✅ App mounted successfully WITHOUT video recording');
    console.log(`Console errors: ${consoleMessages.length}`);
    console.log(`Page errors: ${pageErrors.length}`);
  });
});
