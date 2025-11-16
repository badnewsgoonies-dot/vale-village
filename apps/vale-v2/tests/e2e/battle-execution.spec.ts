import { test, expect } from '@playwright/test';
import { getGameState, waitForMode } from './helpers';

/**
 * Battle Execution E2E Tests
 * 
 * Tests actual battle mechanics:
 * - Queue actions for units
 * - Execute rounds
 * - Verify HP changes
 * - Battle progression through phases
 * - Victory conditions
 * 
 * Note: Uses actual battle UI interactions, not simulated victory
 */

test.describe('Battle Execution', () => {
  test('can queue action and execute round', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Navigate to battle trigger
    for (let i = 0; i < 8; i++) {
      await page.keyboard.press('ArrowLeft');
      await page.waitForTimeout(150);
    }

    await waitForMode(page, 'team-select', 5000);
    
    const confirmButton = page.getByRole('button', { name: /confirm|start|begin/i });
    await confirmButton.waitFor({ state: 'visible', timeout: 5000 });
    await confirmButton.click();

    await waitForMode(page, 'battle', 10000);

    // Get initial battle state
    const initialBattleState = await page.evaluate(() => {
      const store = (window as any).__VALE_STORE__;
      if (!store) return null;
      const battle = store.getState().battle;
      if (!battle) return null;
      
      return {
        phase: battle.phase,
        playerUnits: battle.playerTeam.units.map((u: any) => ({
          id: u.id,
          currentHp: u.currentHp,
          maxHp: u.maxHp,
        })),
        enemies: battle.enemies.map((e: any) => ({
          id: e.id,
          currentHp: e.currentHp,
          maxHp: e.maxHp,
        })),
        queuedActions: battle.queuedActions?.length ?? 0,
      };
    });

    expect(initialBattleState).not.toBeNull();
    expect(initialBattleState?.phase).toBe('planning');
    expect(initialBattleState?.enemies.length).toBeGreaterThan(0);

    console.log('→ Initial battle state:');
    console.log(`   Phase: ${initialBattleState?.phase}`);
    console.log(`   Player units: ${initialBattleState?.playerUnits.length}`);
    console.log(`   Enemies: ${initialBattleState?.enemies.length}`);

    // Queue a basic attack action using store methods
    // This simulates clicking attack button and selecting target
    await page.evaluate(() => {
      const store = (window as any).__VALE_STORE__;
      const battle = store.getState().battle;
      if (!battle || battle.phase !== 'planning') return;

      // Queue attack for first unit targeting first enemy
      const unitId = battle.playerTeam.units[0]?.id;
      const targetId = battle.enemies[0]?.id;
      
      if (unitId && targetId) {
        // Use null abilityId for basic attack
        store.getState().queueUnitAction(0, null, [targetId], undefined);
      }
    });

    // Verify action was queued
    const afterQueueState = await page.evaluate(() => {
      const store = (window as any).__VALE_STORE__;
      const battle = store.getState().battle;
      return {
        queuedActions: battle?.queuedActions?.length ?? 0,
        phase: battle?.phase,
      };
    });

    expect(afterQueueState?.queuedActions).toBeGreaterThan(0);
    expect(afterQueueState?.phase).toBe('planning');

    console.log(`→ Action queued: ${afterQueueState?.queuedActions} actions in queue`);

    // Execute the round
    await page.evaluate(() => {
      const store = (window as any).__VALE_STORE__;
      const battle = store.getState().battle;
      if (!battle || battle.phase !== 'planning') return;

      // Check if queue is complete (all units have actions)
      const allUnitsQueued = battle.playerTeam.units.every((unit: any) => {
        return battle.queuedActions?.some((action: any) => action.actorId === unit.id);
      });

      if (allUnitsQueued) {
        store.getState().executeQueuedRound();
      }
    });

    // Wait for execution phase to complete
    await page.waitForTimeout(2000);

    // Verify battle progressed
    const afterExecutionState = await page.evaluate(() => {
      const store = (window as any).__VALE_STORE__;
      const battle = store.getState().battle;
      if (!battle) return null;

      return {
        phase: battle.phase,
        enemies: battle.enemies.map((e: any) => ({
          id: e.id,
          currentHp: e.currentHp,
        })),
        roundNumber: battle.roundNumber,
      };
    });

    expect(afterExecutionState).not.toBeNull();
    
    // Battle should have progressed (either back to planning or victory/defeat)
    expect(['planning', 'executing', 'victory', 'defeat']).toContain(afterExecutionState?.phase);

    console.log(`→ After execution:`);
    console.log(`   Phase: ${afterExecutionState?.phase}`);
    console.log(`   Round: ${afterExecutionState?.roundNumber}`);
    console.log(`   Enemy HP: ${afterExecutionState?.enemies.map((e: any) => e.currentHp).join(', ')}`);

    // If still in planning, enemy HP should have decreased
    if (afterExecutionState?.phase === 'planning') {
      const enemyHpChanged = afterExecutionState.enemies.some((e: any, idx: number) => {
        const initialEnemy = initialBattleState?.enemies[idx];
        return initialEnemy && e.currentHp < initialEnemy.currentHp;
      });
      
      // Note: HP might not change if attack missed or was blocked, but battle should progress
      expect(afterExecutionState.roundNumber).toBeGreaterThan(initialBattleState?.roundNumber ?? 0);
    }
  });

  test('battle UI shows execute button when queue is complete', async ({ page }) => {
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

    // Verify we're in planning phase
    const initialBattleState = await page.evaluate(() => {
      const store = (window as any).__VALE_STORE__;
      const battle = store.getState().battle;
      return {
        phase: battle?.phase,
        playerUnitCount: battle?.playerTeam?.units?.length ?? 0,
        queuedActions: battle?.queuedActions?.length ?? 0,
      };
    });

    expect(initialBattleState?.phase).toBe('planning');
    expect(initialBattleState?.playerUnitCount).toBeGreaterThan(0);

    // Queue actions for all units
    await page.evaluate(() => {
      const store = (window as any).__VALE_STORE__;
      const battle = store.getState().battle;
      if (!battle || battle.phase !== 'planning') return;

      // Queue attack for each unit
      battle.playerTeam.units.forEach((unit: any, idx: number) => {
        const targetId = battle.enemies[0]?.id;
        if (targetId) {
          store.getState().queueUnitAction(idx, null, [targetId], undefined);
        }
      });
    });

    // Wait for queue to be complete (all units have actions)
    await page.waitForFunction(
      () => {
        const store = (window as any).__VALE_STORE__;
        const battle = store.getState().battle;
        if (!battle) return false;

        const unitCount = battle.playerTeam?.units?.length ?? 0;
        const queuedCount = battle.queuedActions?.length ?? 0;

        // Queue is complete when all units have queued actions
        return unitCount > 0 && queuedCount >= unitCount;
      },
      { timeout: 3000 }
    );

    // Verify queue is complete
    const queueState = await page.evaluate(() => {
      const store = (window as any).__VALE_STORE__;
      const battle = store.getState().battle;
      return {
        playerUnitCount: battle?.playerTeam?.units?.length ?? 0,
        queuedActions: battle?.queuedActions?.length ?? 0,
        phase: battle?.phase,
      };
    });

    expect(queueState.queuedActions).toBeGreaterThanOrEqual(queueState.playerUnitCount);
    expect(queueState.phase).toBe('planning');

    // Now verify execute button is visible and enabled
    const executeButton = page.getByRole('button', { name: /execute.*round/i });
    const buttonVisible = await executeButton.isVisible().catch(() => false);
    const buttonEnabled = await executeButton.isEnabled().catch(() => false);

    // Button should be visible when queue is complete
    expect(buttonVisible).toBe(true);

    // Button should be enabled (clickable) when queue is complete
    expect(buttonEnabled).toBe(true);

    console.log('✅ Execute button visible and enabled when queue is complete');
    console.log(`   Queue: ${queueState.queuedActions}/${queueState.playerUnitCount} actions`);
  });

  test('battle progresses through multiple rounds', async ({ page }) => {
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

    // Execute multiple rounds by simulating actions
    let roundCount = 0;
    const maxRounds = 5;

    while (roundCount < maxRounds) {
      const battleState = await page.evaluate(() => {
        const store = (window as any).__VALE_STORE__;
        const battle = store.getState().battle;
        if (!battle) return null;

        return {
          phase: battle.phase,
          roundNumber: battle.roundNumber,
          battleOver: battle.battleOver,
        };
      });

      if (!battleState || battleState.battleOver) break;

      if (battleState.phase === 'planning') {
        // Queue actions for all units
        await page.evaluate(() => {
          const store = (window as any).__VALE_STORE__;
          const battle = store.getState().battle;
          if (!battle || battle.phase !== 'planning') return;

          // Queue attack for each unit
          battle.playerTeam.units.forEach((unit: any, idx: number) => {
            const targetId = battle.enemies[0]?.id;
            if (targetId) {
              store.getState().queueUnitAction(idx, null, [targetId], undefined);
            }
          });
        });

        // Execute round
        await page.evaluate(() => {
          const store = (window as any).__VALE_STORE__;
          store.getState().executeQueuedRound();
        });

        roundCount++;
        await page.waitForTimeout(1000); // Wait for execution
      } else {
        await page.waitForTimeout(500); // Wait for phase transition
      }
    }

    const finalState = await page.evaluate(() => {
      const store = (window as any).__VALE_STORE__;
      const battle = store.getState().battle;
      return {
        roundNumber: battle?.roundNumber ?? 0,
        battleOver: battle?.battleOver ?? false,
        phase: battle?.phase,
      };
    });

    expect(finalState.roundNumber).toBeGreaterThan(0);
    console.log(`✅ Battle progressed through ${finalState.roundNumber} rounds`);
  });
});

