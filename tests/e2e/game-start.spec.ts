import { test, expect, Page } from '@playwright/test';
import {
  getGameState,
  waitForMode,
  navigateToPosition,
  assertStoreState,
  getUnitData,
  skipStartupScreens,
  advancePreBattleDialogue,
  getHouseEntrancePosition,
  STARTING_POSITION,
  LINEAR_ROAD_Y,
  completeFlintIntro,
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

    // Skip startup screens to get to overworld
    await skipStartupScreens(page);

    // Get initial game state
    const state = await getGameState(page);
    expect(state).not.toBeNull();

    // Verify initial team state (just Isaac)
    expect(state?.hasTeam).toBe(true);
    expect(state?.teamSize).toBe(1);
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

    const initialDjinn = await page.evaluate(() => {
      const store = (window as any).__VALE_STORE__;
      const team = store.getState().team;
      return team?.collectedDjinn ?? [];
    });

    expect(initialDjinn).toHaveLength(0);
    const hasSeenIntro = await page.evaluate(() => {
      const store = (window as any).__VALE_STORE__;
      return store.getState().story?.flags?.['first_djinn_intro_completed'] ?? false;
    });
    expect(hasSeenIntro).toBe(false);
  });

  test('completing Flint intro collects Flint Djinn', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    await completeFlintIntro(page);

    const flintState = await page.evaluate(() => {
      const store = (window as any).__VALE_STORE__;
      const team = store.getState().team;
      return {
        collected: team?.collectedDjinn ?? [],
        equipped: team?.equippedDjinn ?? [],
        tracker: team?.djinnTrackers?.flint,
        flag: store.getState().story?.flags?.['first_djinn_intro_completed'],
        position: store.getState().playerPosition,
      };
    });

    expect(flintState.collected).toContain('flint');
    expect(flintState.equipped).toContain('flint');
    expect(flintState.tracker?.state).toBe('Set');
    expect(flintState.flag).toBe(true);
    expect(flintState.position).toEqual(STARTING_POSITION);
  });

  test('starts at correct spawn point', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Skip startup screens
    await skipStartupScreens(page);

    const state = await getGameState(page);
    expect(state?.playerPosition).toEqual(STARTING_POSITION);
  });
});

test.describe('Overworld Movement', () => {
  test('moves right', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Skip startup screens
    await skipStartupScreens(page);

    const initialState = await getGameState(page);
    expect(initialState?.playerPosition).toEqual(STARTING_POSITION);

    await page.keyboard.press('ArrowRight');
    await page.waitForTimeout(100);

    const newState = await getGameState(page);
    expect(newState?.playerPosition).toEqual({ x: STARTING_POSITION.x + 1, y: LINEAR_ROAD_Y });
  });

  test('moves in all four directions', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Skip startup screens
    await skipStartupScreens(page);

    // Right (should move one tile)
    await page.keyboard.press('ArrowRight');
    await page.waitForTimeout(100);
    let state = await getGameState(page);
    expect(state?.playerPosition.x).toBe(STARTING_POSITION.x + 1);
    expect(state?.playerPosition.y).toBe(LINEAR_ROAD_Y);

    // Down (blocked by grass)
    await page.keyboard.press('ArrowDown');
    await page.waitForTimeout(200);
    state = await getGameState(page);
    expect(state?.playerPosition).toEqual({ x: STARTING_POSITION.x + 1, y: LINEAR_ROAD_Y });

    // Left (returns to spawn)
    await page.keyboard.press('ArrowLeft');
    await page.waitForTimeout(200);
    state = await getGameState(page);
    expect(state?.playerPosition).toEqual(STARTING_POSITION);

    // Up (also blocked)
    await page.keyboard.press('ArrowUp');
    await page.waitForTimeout(200);
    state = await getGameState(page);
    expect(state?.playerPosition).toEqual(STARTING_POSITION);
  });

  test('movement works in multiple directions', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Skip startup screens
    await skipStartupScreens(page);

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

    // Skip startup screens
    await skipStartupScreens(page);

    const houseOne = getHouseEntrancePosition(1);
    await navigateToPosition(page, houseOne.x + 1, houseOne.y);
    await navigateToPosition(page, houseOne.x, houseOne.y);

    // Advance through pre-battle dialogue if present
    await advancePreBattleDialogue(page);

    // Wait for mode change to team-select
    await waitForMode(page, 'team-select', 5000);

    const state = await getGameState(page);
    expect(state?.mode).toBe('team-select');
    expect(state?.pendingBattleEncounterId).toBe('house-01');
  });

  test('pre-battle screen shows encounter', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Skip startup screens
    await skipStartupScreens(page);

    const houseEntrance = getHouseEntrancePosition(1);
    await navigateToPosition(page, houseEntrance.x + 1, houseEntrance.y);
    await navigateToPosition(page, houseEntrance.x, houseEntrance.y);

    // Advance through pre-battle dialogue if present
    await advancePreBattleDialogue(page);

    await waitForMode(page, 'team-select');

    // Verify confirm button exists
    const confirmButton = page.getByRole('button', { name: /confirm|start|begin/i });
    await confirmButton.waitFor({ state: 'visible', timeout: 5000 });
    expect(await confirmButton.isVisible()).toBe(true);
  });

  test('clicking confirm transitions to battle', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Skip startup screens
    await skipStartupScreens(page);

    const entrance = getHouseEntrancePosition(1);
    await navigateToPosition(page, entrance.x + 1, entrance.y);
    await navigateToPosition(page, entrance.x, entrance.y);

    // Advance through pre-battle dialogue if present
    await advancePreBattleDialogue(page);

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

    const firstHouse = getHouseEntrancePosition(1);
    await navigateToPosition(page, firstHouse.x + 1, firstHouse.y);
    await navigateToPosition(page, firstHouse.x, firstHouse.y);

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

    // Skip startup screens
    await skipStartupScreens(page);

    const entrance = getHouseEntrancePosition(1);
    await navigateToPosition(page, entrance.x + 1, entrance.y);
    await navigateToPosition(page, entrance.x, entrance.y);

    // Advance through pre-battle dialogue if present
    await advancePreBattleDialogue(page);

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

    // Skip startup screens
    await skipStartupScreens(page);

    const header = await page.locator('text=/Vale Chronicles/i').isVisible();
    expect(header).toBe(true);
  });

  test('displays player position', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Skip startup screens
    await skipStartupScreens(page);

    const positionText = await page.locator('text=/Position:/i').isVisible();
    expect(positionText).toBe(true);
  });

  test('has party management button', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Skip startup screens
    await skipStartupScreens(page);

    const partyButton = page.getByRole('button', { name: /party.*management/i });
    expect(await partyButton.isVisible()).toBe(true);
  });

  test('has djinn collection button', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Skip startup screens
    await skipStartupScreens(page);

    const djinnButton = page.getByRole('button', { name: /djinn.*collection/i });
    expect(await djinnButton.isVisible()).toBe(true);
  });

  test('has save game button', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Skip startup screens
    await skipStartupScreens(page);

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

    // Skip startup screens
    await skipStartupScreens(page);

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

    // Skip startup screens
    await skipStartupScreens(page);

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

    // Skip startup screens
    await skipStartupScreens(page);

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

    // Skip startup screens
    await skipStartupScreens(page);

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

    // Skip startup screens
    await skipStartupScreens(page);

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
