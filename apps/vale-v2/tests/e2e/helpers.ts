import { Page } from '@playwright/test';

/**
 * E2E Test Helpers
 * Reusable utilities for Playwright tests
 */

export interface GameState {
  hasTeam: boolean;
  teamSize: number;
  rosterSize: number;
  gold: number;
  mode: string;
  currentMapId: string;
  playerPosition: { x: number; y: number };
  stepCount: number;
  pendingBattleEncounterId: string | null;
  battle: any;
  lastBattleRewards: any;
  equipment: any[];
}

/**
 * Get full game state from Zustand store
 */
export async function getGameState(page: Page): Promise<GameState | null> {
  return page.evaluate(() => {
    const store = (window as any).__VALE_STORE__;
    if (!store) return null;

    const state = store.getState();
    return {
      hasTeam: !!state.team,
      teamSize: state.team?.units.length ?? 0,
      rosterSize: state.roster?.length ?? 0,
      gold: state.gold ?? 0,
      mode: state.mode,
      currentMapId: state.currentMapId,
      playerPosition: state.playerPosition ?? { x: 0, y: 0 },
      stepCount: state.stepCount ?? 0,
      pendingBattleEncounterId: state.pendingBattleEncounterId ?? null,
      battle: state.battle,
      lastBattleRewards: state.lastBattleRewards,
      equipment: state.equipment ?? [],
    };
  });
}

/**
 * Wait for game mode to change to expected value
 */
export async function waitForMode(
  page: Page,
  expectedMode: string,
  timeout: number = 30000
): Promise<void> {
  await page.waitForFunction(
    (mode) => {
      const store = (window as any).__VALE_STORE__;
      if (!store) return false;
      return store.getState().mode === mode;
    },
    expectedMode,
    { timeout }
  );
}

/**
 * Navigate player to target coordinates using arrow keys
 * Returns false if path is blocked
 */
export async function navigateToPosition(
  page: Page,
  targetX: number,
  targetY: number
): Promise<boolean> {
  const maxSteps = 100;
  let steps = 0;

  while (steps < maxSteps) {
    const currentState = await getGameState(page);
    if (!currentState) return false;

    const { x, y } = currentState.playerPosition;

    // Check if we've arrived
    if (x === targetX && y === targetY) {
      return true;
    }

    // Calculate next move
    let key: string | null = null;
    if (x < targetX) key = 'ArrowRight';
    else if (x > targetX) key = 'ArrowLeft';
    else if (y < targetY) key = 'ArrowDown';
    else if (y > targetY) key = 'ArrowUp';

    if (!key) break;

    // Press key and wait for state update
    await page.keyboard.press(key);
    await page.waitForTimeout(100);

    // Check if position changed (might be blocked)
    const newState = await getGameState(page);
    if (!newState) return false;

    if (newState.playerPosition.x === x && newState.playerPosition.y === y) {
      // Position didn't change - path blocked
      return false;
    }

    steps++;
  }

  return false;
}

/**
 * Assert store state matches expected partial state
 */
export async function assertStoreState(
  page: Page,
  expected: Partial<GameState>
): Promise<void> {
  const state = await getGameState(page);
  if (!state) {
    throw new Error('Store state is null');
  }

  for (const [key, value] of Object.entries(expected)) {
    const actualValue = (state as any)[key];
    if (JSON.stringify(actualValue) !== JSON.stringify(value)) {
      throw new Error(
        `State mismatch for ${key}: expected ${JSON.stringify(value)}, got ${JSON.stringify(actualValue)}`
      );
    }
  }
}

/**
 * Get unit data from team
 */
export async function getUnitData(page: Page, unitIndex: number = 0) {
  return page.evaluate((idx) => {
    const store = (window as any).__VALE_STORE__;
    if (!store) return null;

    const state = store.getState();
    const unit = state.team?.units[idx];
    if (!unit) return null;

    return {
      id: unit.id,
      name: unit.name,
      level: unit.level,
      xp: unit.xp,
      currentHp: unit.currentHp,
    };
  }, unitIndex);
}

/**
 * Battle state captured after claiming rewards
 */
export interface BattleResult {
  gold: number;
  roster: Array<{
    id: string;
    level: number;
    xp: number;
    maxHp: number;
    currentHp: number;
    [key: string]: any;
  }>;
  equipment: string[];
  djinn: string[];
}

/**
 * Complete a battle from start to finish
 * 
 * This helper automates the entire battle flow:
 * 1. Simulates victory (sets enemy HP to 0)
 * 2. Calls processVictory() (applies XP, level-ups)
 * 3. Waits for rewards screen
 * 4. Calls claimRewards() (adds gold, equipment)
 * 5. Optionally captures final state
 * 6. Returns to overworld
 * 
 * @param page - Playwright page instance
 * @param options - Configuration options
 * @returns Battle result state if captureStateAfterClaim is true, null otherwise
 */
export async function completeBattle(
  page: Page,
  options?: {
    captureStateAfterClaim?: boolean;
    logDetails?: boolean;
  }
): Promise<BattleResult | null> {
  const { captureStateAfterClaim = false, logDetails = true } = options ?? {};

  // 1. Simulate victory
  await page.evaluate(() => {
    const store = (window as any).__VALE_STORE__;
    const battleState = store.getState().battle;

    if (!battleState) return;

    const updatedBattle = {
      ...battleState,
      enemies: battleState.enemies?.map((enemy: any) => ({
        ...enemy,
        currentHp: 0,
      })),
      battleOver: true,
      victory: true,
    };

    store.setState({ battle: updatedBattle });
    store.getState().processVictory(updatedBattle);
  });

  // 2. Wait for rewards screen
  await waitForMode(page, 'rewards', 10000);
  if (logDetails) {
    console.log('   Victory! Rewards shown');
  }

  // 3. Claim rewards (optionally capture state)
  let capturedState: BattleResult | null = null;

  if (captureStateAfterClaim) {
    capturedState = await page.evaluate(() => {
      const store = (window as any).__VALE_STORE__;
      store.getState().claimRewards();

      const state = store.getState();
      return {
        gold: state.gold ?? 0,
        roster: state.roster ?? [],
        equipment: state.equipment?.map((e: any) => e.id) ?? [],
        djinn: state.team?.collectedDjinn ?? [],
      };
    });
  } else {
    // Just claim without capturing
    await page.evaluate(() => {
      const store = (window as any).__VALE_STORE__;
      store.getState().claimRewards();
    });
  }

  // 4. Try clicking button (for UI completeness)
  const claimButton = page.getByRole('button', { name: /claim|continue|next/i });
  const isVisible = await claimButton.isVisible().catch(() => false);
  if (isVisible) {
    await claimButton.click();
  }

  // 5. Wait for return to overworld
  await waitForMode(page, 'overworld', 5000);

  return capturedState;
}
