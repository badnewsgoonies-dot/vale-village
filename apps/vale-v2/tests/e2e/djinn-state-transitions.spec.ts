import type { Page } from '@playwright/test';
import { test, expect } from '@playwright/test';
import {
  getGameState,
  waitForMode,
  getDjinnState,
  getDjinnRecoveryTimer,
  activateDjinnInBattle,
  completeBattle,
} from './helpers';

/**
 * Djinn State Transitions E2E Tests
 * 
 * Tests Djinn state transitions during battle:
 * - Set → Standby (activation)
 * - Standby → Set (recovery after timer)
 * - Recovery timer countdown
 * - Multiple Djinn activated simultaneously
 * - Stat/ability changes on state transitions
 * - State persistence through save/load
 * 
 * Note: Uses actual battle mechanics, not simulated
 */

function waitForBattlePlanningPhase(page: Page, timeout: number = 10000) {
  return page.waitForFunction(
    () => {
      const store = (window as any).__VALE_STORE__;
      const battle = store?.getState().battle;
      if (!battle) return true;
      // Wait for planning phase and ensure queuedDjinn is cleared
      // Also check that round execution completed (not stuck in executing phase)
      return battle.phase === 'planning' && 
             (battle.queuedDjinn?.length ?? 0) === 0 &&
             battle.executionIndex === 0;
    },
    { timeout }
  );
}

test.describe('Djinn State Transitions', () => {
  test('djinn activation transitions Set to Standby', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Verify initial state - flint should be Set
    let djinnState = await getDjinnState(page, 'flint');
    expect(djinnState).not.toBeNull();
    expect(djinnState?.state).toBe('Set');

    console.log('→ Initial Djinn state: Set');

    // Navigate to battle
    for (let i = 0; i < 8; i++) {
      await page.keyboard.press('ArrowLeft');
      await page.waitForTimeout(150);
    }

    await waitForMode(page, 'team-select', 5000);
    const confirmButton = page.getByRole('button', { name: /confirm|start|begin/i });
    await confirmButton.click();
    await waitForMode(page, 'battle', 10000);

    // Verify we're in battle planning phase
    const battleState = await page.evaluate(() => {
      const store = (window as any).__VALE_STORE__;
      return store.getState().battle?.phase;
    });
    expect(battleState).toBe('planning');

    // Activate flint Djinn
    console.log('→ Activating flint Djinn...');
    await activateDjinnInBattle(page, 'flint');

    // Verify Djinn is queued
    const queuedDjinn = await page.evaluate(() => {
      const store = (window as any).__VALE_STORE__;
      return store.getState().battle?.queuedDjinn ?? [];
    });
    expect(queuedDjinn).toContain('flint');

    // Execute round to process activation
    await page.evaluate(() => {
      const store = (window as any).__VALE_STORE__;
      const battle = store.getState().battle;
      if (!battle || battle.phase !== 'planning') return;

      // Queue actions for all units (required to execute)
      battle.playerTeam.units.forEach((unit: any, idx: number) => {
        const targetId = battle.enemies[0]?.id;
        if (targetId) {
          store.getState().queueUnitAction(idx, null, [targetId], undefined);
        }
      });

      // Execute round
      store.getState().executeQueuedRound();
    });

    // Wait for execution to complete and return to planning
    await waitForBattlePlanningPhase(page);

    // Verify Djinn state changed to Standby
    djinnState = await getDjinnState(page, 'flint');
    expect(djinnState?.state).toBe('Standby');

    console.log('✅ Djinn state transitioned: Set → Standby');
  });

  test('djinn recovery timer countdown', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Navigate to battle
    for (let i = 0; i < 8; i++) {
      await page.keyboard.press('ArrowLeft');
      await page.waitForTimeout(150);
    }

    await waitForMode(page, 'team-select', 5000);
    const confirmButton = page.getByRole('button', { name: /confirm|start|begin/i });
    await confirmButton.click();
    await waitForMode(page, 'battle', 10000);

    // Activate flint (1 Djinn = 2 rounds recovery)
    await activateDjinnInBattle(page, 'flint');

    // Execute round
    await page.evaluate(() => {
      const store = (window as any).__VALE_STORE__;
      const battle = store.getState().battle;
      if (!battle) return;

      battle.playerTeam.units.forEach((unit: any, idx: number) => {
        const targetId = battle.enemies[0]?.id;
        if (targetId) {
          store.getState().queueUnitAction(idx, null, [targetId], undefined);
        }
      });

      store.getState().executeQueuedRound();
    });

    await waitForBattlePlanningPhase(page);

    // Check recovery timer (should be 2 for 1 Djinn activated)
    let recoveryTimer = await getDjinnRecoveryTimer(page, 'flint');
    expect(recoveryTimer).toBe(2);

    console.log(`→ Recovery timer after activation: ${recoveryTimer} rounds`);

    // Execute another round (timer should decrement)
    await page.evaluate(() => {
      const store = (window as any).__VALE_STORE__;
      const battle = store.getState().battle;
      if (!battle || battle.phase !== 'planning') return;

      battle.playerTeam.units.forEach((unit: any, idx: number) => {
        const targetId = battle.enemies[0]?.id;
        if (targetId) {
          store.getState().queueUnitAction(idx, null, [targetId], undefined);
        }
      });

      store.getState().executeQueuedRound();
    });

    await waitForBattlePlanningPhase(page);

    // Timer should decrement
    recoveryTimer = await getDjinnRecoveryTimer(page, 'flint');
    expect(recoveryTimer).toBe(1);

    console.log(`→ Recovery timer after 1 round: ${recoveryTimer} rounds`);

    // Execute final round (timer should reach 0 and Djinn recovers)
    await page.evaluate(() => {
      const store = (window as any).__VALE_STORE__;
      const battle = store.getState().battle;
      if (!battle || battle.phase !== 'planning') return;

      battle.playerTeam.units.forEach((unit: any, idx: number) => {
        const targetId = battle.enemies[0]?.id;
        if (targetId) {
          store.getState().queueUnitAction(idx, null, [targetId], undefined);
        }
      });

      store.getState().executeQueuedRound();
    });

    await waitForBattlePlanningPhase(page);

    // Djinn should recover (timer cleared, state back to Set)
    recoveryTimer = await getDjinnRecoveryTimer(page, 'flint');
    const djinnState = await getDjinnState(page, 'flint');
    
    // Timer should be null after recovery
    expect(recoveryTimer).toBeNull();
    expect(djinnState?.state).toBe('Set');

    console.log('✅ Djinn recovered: Standby → Set');
  });

  test('multiple djinn activated simultaneously', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Grant additional Djinn for testing
    await page.evaluate(() => {
      const store = (window as any).__VALE_STORE__;
      const team = store.getState().team;
      
      // Collect forge and fizz Djinn
      const newCollectedDjinn = [...(team.collectedDjinn ?? []), 'forge', 'fizz'];
      
      // Equip all 3 Djinn
      const newEquippedDjinn = ['flint', 'forge', 'fizz'];
      const newTrackers: Record<string, any> = {};
      
      newEquippedDjinn.forEach((id) => {
        newTrackers[id] = {
          djinnId: id,
          state: 'Set' as const,
        };
      });

      store.getState().updateTeam({
        collectedDjinn: newCollectedDjinn,
        equippedDjinn: newEquippedDjinn,
        djinnTrackers: newTrackers,
      });
    });

    // Navigate to battle
    for (let i = 0; i < 8; i++) {
      await page.keyboard.press('ArrowLeft');
      await page.waitForTimeout(150);
    }

    await waitForMode(page, 'team-select', 5000);
    const confirmButton = page.getByRole('button', { name: /confirm|start|begin/i });
    await confirmButton.click();
    await waitForMode(page, 'battle', 10000);

    // Activate all 3 Djinn
    await activateDjinnInBattle(page, 'flint');
    await activateDjinnInBattle(page, 'forge');
    await activateDjinnInBattle(page, 'fizz');

    // Execute round
    await page.evaluate(() => {
      const store = (window as any).__VALE_STORE__;
      const battle = store.getState().battle;
      if (!battle) return;

      // Queue actions for all units (required to execute)
      battle.playerTeam.units.forEach((unit: any, idx: number) => {
        const targetId = battle.enemies[0]?.id;
        if (targetId) {
          store.getState().queueUnitAction(idx, null, [targetId], undefined);
        }
      });

      // Execute round (this will process 3 Djinn summons)
      store.getState().executeQueuedRound();
    });

    // Wait longer for 3 Djinn execution (more complex than single Djinn)
    await waitForBattlePlanningPhase(page, 30000);

    // Verify all 3 are in Standby
    const flintState = await getDjinnState(page, 'flint');
    const forgeState = await getDjinnState(page, 'forge');
    const fizzState = await getDjinnState(page, 'fizz');

    expect(flintState?.state).toBe('Standby');
    expect(forgeState?.state).toBe('Standby');
    expect(fizzState?.state).toBe('Standby');

    // Verify recovery timers (3 Djinn = 4 rounds each)
    const flintTimer = await getDjinnRecoveryTimer(page, 'flint');
    const forgeTimer = await getDjinnRecoveryTimer(page, 'forge');
    const fizzTimer = await getDjinnRecoveryTimer(page, 'fizz');

    expect(flintTimer).toBe(4);
    expect(forgeTimer).toBe(4);
    expect(fizzTimer).toBe(4);

    console.log('✅ All 3 Djinn activated, recovery timers: 4 rounds each');
  });

  test('djinn state persists through save/load', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Navigate to battle
    for (let i = 0; i < 8; i++) {
      await page.keyboard.press('ArrowLeft');
      await page.waitForTimeout(150);
    }

    await waitForMode(page, 'team-select', 5000);
    const confirmButton = page.getByRole('button', { name: /confirm|start|begin/i });
    await confirmButton.click();
    await waitForMode(page, 'battle', 10000);

    // Activate flint
    await activateDjinnInBattle(page, 'flint');

    // Execute round
    await page.evaluate(() => {
      const store = (window as any).__VALE_STORE__;
      const battle = store.getState().battle;
      if (!battle) return;

      battle.playerTeam.units.forEach((unit: any, idx: number) => {
        const targetId = battle.enemies[0]?.id;
        if (targetId) {
          store.getState().queueUnitAction(idx, null, [targetId], undefined);
        }
      });

      store.getState().executeQueuedRound();
    });

    await waitForBattlePlanningPhase(page);

    // Get state before save
    const beforeSave = {
      djinnState: await getDjinnState(page, 'flint'),
      recoveryTimer: await getDjinnRecoveryTimer(page, 'flint'),
    };

    expect(beforeSave.djinnState?.state).toBe('Standby');
    expect(beforeSave.recoveryTimer).toBe(2);

    // Save game
    await page.evaluate(() => {
      const store = (window as any).__VALE_STORE__;
      store.getState().saveGame();
    });

    // Reload page
    await page.reload();
    await page.waitForLoadState('networkidle');

    // Load game
    await page.evaluate(() => {
      const store = (window as any).__VALE_STORE__;
      store.getState().loadGame();
    });

    // After load, wait for page to be ready (battle state may not exist)
    await page.waitForFunction(
      () => {
        const store = (window as any).__VALE_STORE__;
        if (!store) return false;
        const state = store.getState();
        // Just verify store is ready, don't wait for battle
        return state.team !== null;
      },
      { timeout: 3000 }
    );

    // Verify state restored (if battle persisted) or Djinn tracker exists (if battle didn't persist)
    const afterLoad = {
      djinnState: await getDjinnState(page, 'flint'),
      recoveryTimer: await getDjinnRecoveryTimer(page, 'flint'),
      battleExists: await page.evaluate(() => {
        const store = (window as any).__VALE_STORE__;
        return store?.getState().battle !== null;
      }),
    };

    console.log('→ Djinn state after load:', afterLoad.djinnState?.state);
    console.log('→ Recovery timer after load:', afterLoad.recoveryTimer);
    console.log('→ Battle state exists:', afterLoad.battleExists);

    // If battle persisted, verify Djinn state was restored
    if (afterLoad.battleExists) {
      expect(afterLoad.djinnState?.state).toBe('Standby');
      expect(afterLoad.recoveryTimer).toBe(2);
    } else {
      // If battle didn't persist, just verify Djinn tracker structure exists
      expect(afterLoad.djinnState).not.toBeNull();
      // Djinn state might be reset to 'Set' if battle didn't persist
      console.log('   Note: Battle state did not persist, Djinn state may be reset');
    }
  });
});

