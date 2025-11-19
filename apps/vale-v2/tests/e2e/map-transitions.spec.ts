import type { Page } from '@playwright/test';
import { test, expect } from '@playwright/test';
import { getGameState, waitForMode, navigateToPosition, skipStartupScreens } from './helpers';

/**
 * Map Transition E2E Tests
 *
 * Tests map transition system:
 * - Transition trigger detection
 * - Map changes (vale-village → weapon-shop-interior)
 * - Position teleportation
 * - Return transition (weapon-shop-interior → vale-village)
 *
 * Transition Locations:
 * - Entry: (8, 6) on vale-village → (5, 7) on weapon-shop-interior
 * - Exit: (5, 7) on weapon-shop-interior → (8, 6) on vale-village
 */

/**
 * Wait for map transition to complete
 * Verifies currentMapId matches expected map
 */
async function waitForMapTransition(
  page: Page,
  expectedMapId: string,
  timeout: number = 3000
): Promise<void> {
  await page.waitForFunction(
    (mapId) => {
      const store = (window as any).__VALE_STORE__;
      if (!store) return false;
      return store.getState().currentMapId === mapId;
    },
    expectedMapId,
    { timeout }
  );
}

test.describe('Map Transitions', () => {
  test('transitions from vale-village to weapon-shop-interior', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Skip startup screens
    await skipStartupScreens(page);

    // Initial state
    let state = await getGameState(page);
    expect(state?.currentMapId).toBe('vale-village');
    expect(state?.playerPosition).toEqual({ x: 15, y: 10 });

    // Navigate to transition trigger at (8, 6)
    // From (15, 10): move up 4, then left 7
    console.log('→ Navigating to transition trigger (8, 6)...');
    
    // Move up 4 steps
    for (let i = 0; i < 4; i++) {
      await page.keyboard.press('ArrowUp');
      await page.waitForTimeout(150);
    }
    
    // Move left 7 steps
    for (let i = 0; i < 7; i++) {
      await page.keyboard.press('ArrowLeft');
      await page.waitForTimeout(150);
    }

    // Wait for transition to complete
    // Check if already transitioned, otherwise wait
    await page.waitForTimeout(300);
    state = await getGameState(page);
    if (state?.currentMapId !== 'weapon-shop-interior') {
      await waitForMapTransition(page, 'weapon-shop-interior', 3000);
      state = await getGameState(page);
    }

    // Verify map transition occurred
    expect(state?.currentMapId).toBe('weapon-shop-interior');
    expect(state?.playerPosition).toEqual({ x: 5, y: 7 });
    expect(state?.mode).toBe('overworld'); // Should still be in overworld mode

    console.log('✅ Map transition successful');
    console.log(`   Map: ${state?.currentMapId}`);
    console.log(`   Position: (${state?.playerPosition.x}, ${state?.playerPosition.y})`);
  });

  test('transitions back from weapon-shop-interior to vale-village', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Skip startup screens
    await skipStartupScreens(page);

    // First transition to weapon-shop-interior (manual navigation)
    // From (15, 10): move up 4, then left 7
    for (let i = 0; i < 4; i++) {
      await page.keyboard.press('ArrowUp');
      await page.waitForTimeout(150);
    }
    for (let i = 0; i < 7; i++) {
      await page.keyboard.press('ArrowLeft');
      await page.waitForTimeout(150);
    }
    // Wait for transition to complete
    await page.waitForTimeout(500);

    // Verify we're in weapon-shop-interior
    let state = await getGameState(page);
    expect(state?.currentMapId).toBe('weapon-shop-interior');
    expect(state?.playerPosition).toEqual({ x: 5, y: 7 });

    console.log('→ Transitioning back to vale-village...');

    // Exit trigger is at (5, 7) - we're already there
    // Step off and back on to trigger return transition
    // (Can't step down - bottom of map, so step left instead)
    await page.keyboard.press('ArrowLeft');
    await page.waitForTimeout(150);
    await page.keyboard.press('ArrowRight');
    await waitForMapTransition(page, 'vale-village', 3000);

    // Verify we're back in vale-village
    state = await getGameState(page);
    expect(state?.currentMapId).toBe('vale-village');
    expect(state?.playerPosition).toEqual({ x: 8, y: 6 });

    console.log('✅ Return transition successful');
    console.log(`   Map: ${state?.currentMapId}`);
    console.log(`   Position: (${state?.playerPosition.x}, ${state?.playerPosition.y})`);
  });

  test('transition preserves overworld mode', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Skip startup screens
    await skipStartupScreens(page);

    // Transition to weapon-shop-interior (manual navigation)
    for (let i = 0; i < 4; i++) {
      await page.keyboard.press('ArrowUp');
      await page.waitForTimeout(150);
    }
    for (let i = 0; i < 7; i++) {
      await page.keyboard.press('ArrowLeft');
      await page.waitForTimeout(150);
    }
    // Wait for transition to complete
    await page.waitForTimeout(500);

    // Verify mode is still overworld
    let state = await getGameState(page);
    expect(state?.mode).toBe('overworld');
    expect(state?.currentMapId).toBe('weapon-shop-interior');

    // Transition back (we're already at (5, 7), step off and back to trigger)
    // (Can't step down - bottom of map, so step left instead)
    await page.keyboard.press('ArrowLeft');
    await page.waitForTimeout(150);
    await page.keyboard.press('ArrowRight');
    await waitForMapTransition(page, 'vale-village', 3000);

    // Verify still in overworld mode
    state = await getGameState(page);
    expect(state?.mode).toBe('overworld');
    expect(state?.currentMapId).toBe('vale-village');

    console.log('✅ Overworld mode preserved through transitions');
  });

  test('can move after transition', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Transition to weapon-shop-interior (manual navigation)
    for (let i = 0; i < 4; i++) {
      await page.keyboard.press('ArrowUp');
      await page.waitForTimeout(150);
    }
    for (let i = 0; i < 7; i++) {
      await page.keyboard.press('ArrowLeft');
      await page.waitForTimeout(150);
    }
    // Wait for transition to complete
    await page.waitForTimeout(500);

    let state = await getGameState(page);
    expect(state?.currentMapId).toBe('weapon-shop-interior');
    const initialPos = { ...state?.playerPosition };

    // Move right
    await page.keyboard.press('ArrowRight');
    await page.waitForTimeout(150);

    // Verify position changed
    state = await getGameState(page);
    expect(state?.playerPosition.x).toBe(initialPos.x + 1);
    expect(state?.playerPosition.y).toBe(initialPos.y);
    expect(state?.currentMapId).toBe('weapon-shop-interior'); // Still on same map

    console.log('✅ Movement works after transition');
  });
});

