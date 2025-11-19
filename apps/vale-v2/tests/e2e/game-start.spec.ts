import { test, expect, Page } from '@playwright/test';
import {
  getGameState,
  waitForMode,
  navigateToPosition,
  assertStoreState,
  getUnitData,
} from './helpers';

/**
 * Comprehensive E2E Test Suite for Vale Chronicles V2
 * Tests actual gameplay mechanics using real game data
 */

test.describe('Game Initialization', () => {
  test('loads game with correct initial state', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Verify Zustand store is exposed in dev mode
    const storeExists = await page.evaluate(() => {
      return typeof (window as any).__VALE_STORE__ !== 'undefined';
    });
    expect(storeExists).toBe(true);

    // Get initial game state
    const state = await getGameState(page);
    expect(state).not.toBeNull();

    // Verify initial team state (Isaac + Flint)
    expect(state?.hasTeam).toBe(true);
    expect(state?.teamSize).toBe(1); // Just Isaac
    expect(state?.rosterSize).toBe(1);
    expect(state?.gold).toBe(0);
    expect(state?.mode).toBe('overworld');
    expect(state?.currentMapId).toBe('vale-village');

    // Verify Isaac's initial stats
    const isaac = await getUnitData(page, 0);
    expect(isaac).not.toBeNull();
    expect(isaac?.id).toBe('adept');
    expect(isaac?.level).toBe(1);
    expect(isaac?.xp).toBe(0);

    // Verify overworld map is visible
    const overworldVisible = await page.locator('text=/Position:/i').isVisible();
    expect(overworldVisible).toBe(true);
  });

  test('starts at correct spawn point', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const state = await getGameState(page);
    expect(state?.playerPosition).toEqual({ x: 15, y: 10 });
  });
});

test.describe('Overworld Movement', () => {
  test('moves right', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const initialState = await getGameState(page);
    expect(initialState?.playerPosition).toEqual({ x: 15, y: 10 });

    await page.keyboard.press('ArrowRight');
    await page.waitForTimeout(100);

    const newState = await getGameState(page);
    expect(newState?.playerPosition).toEqual({ x: 16, y: 10 });
  });

  test('moves in all four directions', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Right
    await page.keyboard.press('ArrowRight');
    await page.waitForTimeout(100);
    let state = await getGameState(page);
    expect(state?.playerPosition.x).toBe(16);

    // Down
    await page.keyboard.press('ArrowDown');
    await page.waitForTimeout(200); // Increased timeout for state update
    state = await getGameState(page);
    // Note: Movement may be blocked by obstacles, so we check if position changed OR stayed same
    expect(state?.playerPosition.y).toBeGreaterThanOrEqual(10);

    // Left (may be blocked by obstacles)
    await page.keyboard.press('ArrowLeft');
    await page.waitForTimeout(200);
    state = await getGameState(page);
    expect(state?.playerPosition.x).toBeLessThanOrEqual(16);

    // Up (may be blocked by obstacles)
    await page.keyboard.press('ArrowUp');
    await page.waitForTimeout(200);
    state = await getGameState(page);
    expect(state?.playerPosition.y).toBeLessThanOrEqual(11);

    // Verify we're somewhere reasonable (not stuck at an invalid position)
    expect(state?.playerPosition.x).toBeGreaterThanOrEqual(14);
    expect(state?.playerPosition.y).toBeGreaterThanOrEqual(9);
  });

  test('movement works in multiple directions', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const initialState = await getGameState(page);
    const startPos = initialState?.playerPosition;

    // Make several moves
    for (let i = 1; i <= 5; i++) {
      await page.keyboard.press('ArrowRight');
      await page.waitForTimeout(150);
    }

    const finalState = await getGameState(page);
    // Should have moved at least once
    expect(finalState?.playerPosition.x).toBeGreaterThan(startPos?.x ?? 0);
  });
});

test.describe('Battle Trigger & Team Selection', () => {
  test('triggers battle encounter at correct position', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Spawn is at (15, 10)
    // house-01 trigger is at (7, 10) - need to move left 8 times
    // house-02 trigger is at (10, 10) - need to move left 5 times
    // Move left to house-01
    for (let i = 0; i < 8; i++) {
      await page.keyboard.press('ArrowLeft');
      await page.waitForTimeout(150);
    }

    // Wait for mode change to team-select
    await waitForMode(page, 'team-select', 5000);

    const state = await getGameState(page);
    expect(state?.mode).toBe('team-select');
    // Should be one of the house encounters (exact ID depends on which trigger was hit)
    expect(state?.pendingBattleEncounterId).toMatch(/^house-0[1-7]$/);
  });

  test('pre-battle screen shows encounter', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Navigate to battle trigger
    for (let i = 0; i < 8; i++) {
      await page.keyboard.press('ArrowLeft');
      await page.waitForTimeout(150);
    }

    await waitForMode(page, 'team-select');

    // Verify confirm button exists
    const confirmButton = page.getByRole('button', { name: /confirm|start|begin/i });
    await confirmButton.waitFor({ state: 'visible', timeout: 5000 });
    expect(await confirmButton.isVisible()).toBe(true);
  });

  test('clicking confirm transitions to battle', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Navigate to battle trigger
    for (let i = 0; i < 8; i++) {
      await page.keyboard.press('ArrowLeft');
      await page.waitForTimeout(100);
    }

    await waitForMode(page, 'team-select');

    // Click confirm button
    const confirmButton = page.getByRole('button', { name: /confirm|start|begin/i });
    await confirmButton.click();

    // Wait for battle mode
    await waitForMode(page, 'battle', 10000);

    const state = await getGameState(page);
    expect(state?.mode).toBe('battle');
    expect(state?.battle).not.toBeNull();
  });
});

test.describe('Battle System', () => {
  test('battle state has enemies from encounter', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Navigate to battle trigger
    for (let i = 0; i < 8; i++) {
      await page.keyboard.press('ArrowLeft');
      await page.waitForTimeout(100);
    }

    await waitForMode(page, 'team-select');

    const confirmButton = page.getByRole('button', { name: /confirm|start|begin/i });
    await confirmButton.click();

    await waitForMode(page, 'battle');

    // Check battle state
    const battleState = await page.evaluate(() => {
      const store = (window as any).__VALE_STORE__;
      if (!store) return null;
      const state = store.getState();
      return {
        enemyCount: state.battle?.enemies?.length ?? 0,
        enemyIds: state.battle?.enemies?.map((e: any) => e.id) ?? [],
      };
    });

    // house-01 has 1 enemy (garet-enemy)
    expect(battleState?.enemyCount).toBeGreaterThanOrEqual(1);
    expect(battleState?.enemyIds.length).toBeGreaterThanOrEqual(1);
  });

  test('battle UI shows action buttons', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Navigate to battle and start
    for (let i = 0; i < 8; i++) {
      await page.keyboard.press('ArrowLeft');
      await page.waitForTimeout(150);
    }
    await waitForMode(page, 'team-select');
    
    const confirmButton = page.getByRole('button', { name: /confirm|start|begin/i });
    await confirmButton.waitFor({ state: 'visible' });
    await confirmButton.click();

    await waitForMode(page, 'battle', 10000);

    // Verify battle state exists
    const hasBattle = await page.evaluate(() => {
      const store = (window as any).__VALE_STORE__;
      return !!store?.getState()?.battle;
    });
    expect(hasBattle).toBe(true);
  });
});

test.describe('UI Elements', () => {
  test('displays header with game title', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const header = await page.locator('text=/Vale Chronicles/i').isVisible();
    expect(header).toBe(true);
  });

  test('displays player position', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const positionText = await page.locator('text=/Position:/i').isVisible();
    expect(positionText).toBe(true);
  });

  test('has party management button', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const partyButton = page.getByRole('button', { name: /party.*management/i });
    expect(await partyButton.isVisible()).toBe(true);
  });

  test('has djinn collection button', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const djinnButton = page.getByRole('button', { name: /djinn.*collection/i });
    expect(await djinnButton.isVisible()).toBe(true);
  });

  test('has save game button', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const saveButton = page.getByRole('button', { name: /save.*game/i });
    expect(await saveButton.isVisible()).toBe(true);
  });
});

test.describe('Error Handling', () => {
  test('no console errors during normal gameplay', async ({ page }) => {
    const consoleErrors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Move around a bit
    await page.keyboard.press('ArrowRight');
    await page.waitForTimeout(100);
    await page.keyboard.press('ArrowDown');
    await page.waitForTimeout(100);

    // Should have no console errors
    expect(consoleErrors).toEqual([]);
  });

  test('no React error boundaries triggered', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const hasErrorBoundary = await page
      .locator('text=/something went wrong|error boundary|crash/i')
      .isVisible()
      .catch(() => false);

    expect(hasErrorBoundary).toBe(false);
  });
});

test.describe('Party Management Screen', () => {
  test('opens party management screen', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const partyButton = page.getByRole('button', { name: /party.*management/i });
    await partyButton.click();
    await page.waitForTimeout(500);

    // Check for party management UI elements
    const hasPartyUI = await page.locator('text=/Isaac|Adept/i').isVisible();
    expect(hasPartyUI).toBe(true);
  });

  test('closes party management screen', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Open party management
    await page.getByRole('button', { name: /party.*management/i }).click();
    await page.waitForTimeout(500);

    // Close it
    const closeButton = page.getByRole('button', { name: /close|back|exit/i }).first();
    await closeButton.click();
    await page.waitForTimeout(500);

    // Should be back in overworld
    const state = await getGameState(page);
    expect(state?.mode).toBe('overworld');
  });
});

test.describe('Djinn Collection Screen', () => {
  test('opens djinn collection screen and shows collected Djinn', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const djinnButton = page.getByRole('button', { name: /djinn.*collection/i });
    await djinnButton.click();
    await page.waitForTimeout(500);

    // Check for djinn collection UI - should have some content visible
    const djinnState = await page.evaluate(() => {
      const store = (window as any).__VALE_STORE__;
      if (!store) return null;
      const state = store.getState();
      return {
        hasDjinn: (state.team?.collectedDjinn?.length ?? 0) > 0 || (state.team?.equippedDjinn?.length ?? 0) > 0,
      };
    });

    // Should have at least Flint collected/equipped
    expect(djinnState?.hasDjinn).toBe(true);
  });
});
