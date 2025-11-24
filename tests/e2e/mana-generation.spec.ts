/**
 * Mana Generation E2E Tests
 *
 * Verifies the mana generation mechanics in battle:
 * - Basic attacks generate +1 mana
 * - Mana generation enables slower units to cast spells
 * - Mana events are logged correctly
 *
 * PR-MANA-QUEUE: Team-wide mana pool management
 */

import { test, expect } from '@playwright/test';
import {
  waitForMode,
  completeFlintIntro,
  startHouseBattle,
  setDjinnState,
  completeBattle,
  claimRewardsAndReturnToOverworld,
  stabilizeBattleDurability,
} from './helpers';

test.describe('Mana Generation Mechanics', () => {
  /**
   * Test: Basic Attack Generates Mana
   *
   * Verifies that basic attacks generate +1 mana for the team pool.
   * This allows slower units to cast spells after faster units generate mana.
   *
   * Flow:
   * 1. Start battle with 1-unit team (1 mana pool)
   * 2. Queue basic attack (0 mana cost)
   * 3. Execute round
   * 4. Verify mana increased by +1 after basic attack hit
   * 5. Verify 'mana-generated' event logged
   */
  test('basic attack generates +1 mana', async ({ page }) => {
    console.log('\n🧪 Test: Basic Attack Mana Generation');

    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await completeFlintIntro(page);
    await waitForMode(page, 'overworld', 30000);

    await setDjinnState(page, 'flint', 'Standby');

    console.log('   Starting from overworld...');

    await startHouseBattle(page, 1);

    console.log('   Battle started - Planning phase');

    // 4. Verify initial mana pool
    const initialBattleState = await page.evaluate(() => {
      const store = (window as any).__VALE_STORE__;
      const battle = store.getState().battle;

      if (!battle) {
        throw new Error('Battle state not found');
      }

      return {
        maxMana: battle.maxMana,
        remainingMana: battle.remainingMana,
        phase: battle.phase,
        teamSize: battle.playerTeam?.units?.length || 0,
      };
    });

    expect(initialBattleState.phase).toBe('planning');
    expect(initialBattleState.teamSize).toBe(1);
    expect(initialBattleState.maxMana).toBe(1); // 1 unit × 1 manaContribution = 1 mana
    expect(initialBattleState.remainingMana).toBe(1); // Full pool at start

    console.log(`   Initial mana: ${initialBattleState.remainingMana}/${initialBattleState.maxMana}`);

    // 5. Queue basic attack for Isaac (Unit 0)
    console.log('   Queueing basic attack...');
    await page.evaluate(() => {
      const store = (window as any).__VALE_STORE__;
      const battle = store.getState().battle;

      if (!battle) {
        throw new Error('Battle state not found');
      }

      const targetId = battle.enemies?.[0]?.id;
      if (!targetId) {
        throw new Error('No enemy found');
      }

      // Queue basic attack (null abilityId = basic attack = 0 mana cost)
      store.getState().queueUnitAction(0, null, [targetId], undefined);
    });

    // 6. Verify mana remains 8 (basic attacks are free)
    const afterQueueingMana = await page.evaluate(() => {
      const store = (window as any).__VALE_STORE__;
      return store.getState().battle?.remainingMana || 0;
    });

    expect(afterQueueingMana).toBe(1); // Basic attack costs 0 mana
    console.log(`   Mana after queueing: ${afterQueueingMana} (basic attacks are free)`);

    // 6.5. Set mana to 0 to test generation from empty pool
    console.log('   Setting mana to 0 to test mana generation...');
    await page.evaluate(() => {
      const store = (window as any).__VALE_STORE__;
      const battle = store.getState().battle;

      if (!battle) {
        throw new Error('Battle state not found');
      }

      // Artificially set mana to 0 to test mana generation
      store.setState({
        battle: {
          ...battle,
          remainingMana: 0,
        },
      });
    });

    const manaBeforeExecution = await page.evaluate(() => {
      const store = (window as any).__VALE_STORE__;
      return store.getState().battle?.remainingMana || 0;
    });

    expect(manaBeforeExecution).toBe(0);
    console.log(`   Mana before execution: ${manaBeforeExecution}`);

    // 7. Execute round
    console.log('   Executing round...');
    await page.evaluate(() => {
      const store = (window as any).__VALE_STORE__;
      store.getState().executeQueuedRound();
    });

    // Wait for round execution
    await page.waitForTimeout(2000);

    // 8. Verify mana increased by +1 after basic attack
    const afterExecutionState = await page.evaluate(() => {
      const store = (window as any).__VALE_STORE__;
      const state = store.getState();

      return {
        remainingMana: state.battle?.remainingMana || 0,
        maxMana: state.battle?.maxMana || 0,
        events: state.events || [],
        phase: state.battle?.phase,
      };
    });

    console.log(`   Mana after execution: ${afterExecutionState.remainingMana}/${afterExecutionState.maxMana}`);
    console.log(`   Events logged: ${afterExecutionState.events.length}`);

    // Verify mana increased by exactly +1
    expect(afterExecutionState.remainingMana).toBe(1); // 0 + 1 from basic attack
    console.log(`   ✅ Mana increased: 0 → 1 (+1 from basic attack)`);

    // 9. Verify 'mana-generated' event in battle log
    const manaEvents = afterExecutionState.events.filter(
      (e: any) => e.type === 'mana-generated'
    );

    expect(manaEvents.length).toBeGreaterThan(0);
    console.log(`   ✅ Mana-generated events: ${manaEvents.length}`);

    if (manaEvents.length > 0) {
      const manaEvent = manaEvents[0];
      console.log(`   Event details:`, JSON.stringify(manaEvent, null, 2));

      expect(manaEvent.amount).toBe(1); // +1 mana per basic attack
      expect(manaEvent.newTotal).toBe(1); // New total = 1 (0 + 1)
      expect(manaEvent.source).toBeDefined(); // Source unit ID
    }

      console.log('   ✅ Basic attack mana generation verified!');

      await completeBattle(page);
      await claimRewardsAndReturnToOverworld(page);
      await waitForMode(page, 'overworld', 10000);
  });

  /**
   * Test: Mana Generation Enables Spell Casting
   *
   * Demonstrates the tactical importance of mana generation:
   * - Fast unit generates mana with basic attack
   * - Slow unit uses generated mana to cast spell
   *
   * This test requires a multi-unit team, so it's marked as a future enhancement
   * when the game has 2+ units in the starting party.
   */
  test.skip('mana generation enables slower units to cast spells', async ({ page }) => {
    // This test requires a 2+ unit party to demonstrate:
    // 1. Unit 1 (fast) basic attacks → generates +1 mana
    // 2. Unit 2 (slow) casts 3-mana spell using generated mana
    //
    // Implementation depends on game progression state
    // where player has recruited additional party members.
  });

  /**
   * Test: Mana Cap at Max Pool
   *
   * Verifies mana generation is capped at maxMana pool size.
   */
  test('mana generation caps at max pool', async ({ page }) => {
    console.log('\n🧪 Test: Mana Generation Caps at Max Pool');

    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await completeFlintIntro(page);
    await waitForMode(page, 'overworld', 30000);

    // Remove Flint for baseline
    await page.evaluate(() => {
      const store = (window as any).__VALE_STORE__;
      const team = store.getState().team;
      const updatedTrackers = {
        ...team.djinnTrackers,
        flint: { ...team.djinnTrackers?.flint, state: 'Standby' as const },
      };
      store.setState({
        team: {
          ...team,
          djinnTrackers: updatedTrackers,
        },
      });
    });

    await startHouseBattle(page, 1);

    // 2. Set mana to near-max (maxMana - 0.5) to test cap
    console.log('   Setting mana to near-max...');
    await page.evaluate(() => {
      const store = (window as any).__VALE_STORE__;
      const battle = store.getState().battle;

      if (!battle) {
        throw new Error('Battle state not found');
      }

      // Set mana to maxMana (8 for 1 unit)
      const nearMaxMana = battle.maxMana;

      // Update battle state with near-max mana
      store.setState({
        battle: {
          ...battle,
          remainingMana: nearMaxMana,
        },
      });
    });

    const manaBeforeCap = await page.evaluate(() => {
      const store = (window as any).__VALE_STORE__;
      const battle = store.getState().battle;
      return {
        remainingMana: battle?.remainingMana || 0,
        maxMana: battle?.maxMana || 0,
      };
    });

    console.log(`   Mana before attack: ${manaBeforeCap.remainingMana}/${manaBeforeCap.maxMana}`);

    // 3. Queue and execute basic attack
    console.log('   Queueing basic attack...');
    await page.evaluate(() => {
      const store = (window as any).__VALE_STORE__;
      const battle = store.getState().battle;
      const targetId = battle?.enemies?.[0]?.id;

      if (!targetId) {
        throw new Error('No enemy found');
      }

      store.getState().queueUnitAction(0, null, [targetId], undefined);
    });

    await page.evaluate(() => {
      const store = (window as any).__VALE_STORE__;
      store.getState().executeQueuedRound();
    });

    await page.waitForTimeout(2000);

    // 4. Verify mana capped at maxMana
    const manaAfterCap = await page.evaluate(() => {
      const store = (window as any).__VALE_STORE__;
      const battle = store.getState().battle;
      return {
        remainingMana: battle?.remainingMana || 0,
        maxMana: battle?.maxMana || 0,
      };
    });

    console.log(`   Mana after attack: ${manaAfterCap.remainingMana}/${manaAfterCap.maxMana}`);

    // Verify mana did not exceed max pool
    expect(manaAfterCap.remainingMana).toBeLessThanOrEqual(manaAfterCap.maxMana);
    expect(manaAfterCap.remainingMana).toBe(manaAfterCap.maxMana); // Should be exactly maxMana

    console.log(`   ✅ Mana capped at max pool: ${manaAfterCap.remainingMana}/${manaAfterCap.maxMana}`);

    await completeBattle(page);
    await claimRewardsAndReturnToOverworld(page);
    await waitForMode(page, 'overworld', 10000);
  });
});

