/**
 * Djinn Standby Mechanics E2E Tests
 *
 * Verifies the Djinn standby system:
 * - Activating Djinn removes stat bonuses and abilities
 * - Djinn enters Standby state with recovery timer
 * - After 2 rounds, Djinn returns to Set state
 * - Stats and abilities are restored after recovery
 *
 * PR-DJINN-CORE: Djinn summon and recovery system
 */

import { test, expect } from '@playwright/test';
import { waitForMode, completeFlintIntro } from './helpers';

test.describe('Djinn Standby Mechanics', () => {
  /**
   * Test: Activating Djinn Removes Stats and Abilities
   *
   * Verifies that when a Set Djinn is activated (summoned), the unit:
   * 1. Loses the stat bonuses from that Djinn
   * 2. Loses the abilities granted by that Djinn
   * 3. Djinn enters Standby state
   */
  test('activating Djinn removes stat bonuses and abilities', async ({ page }) => {
    console.log('\n🧪 Test: Djinn Activation → Standby');

    // 1. Initialize game
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await completeFlintIntro(page);
    await waitForMode(page, 'overworld', 30000);

    // 2. Verify Flint is Set (check in overworld)
    console.log('   Checking Flint Set state in overworld...');
    const overworldDjinnState = await page.evaluate(() => {
      const store = (window as any).__VALE_STORE__;
      const helpers = (window as any).__VALE_TEST_HELPERS__;
      const team = store.getState().team;
      const isaac = team?.units[0];

      if (!isaac) {
        throw new Error('Isaac not found');
      }

      const effectiveStats = helpers.calculateEffectiveStats(isaac, team);
      const flintTracker = team?.djinnTrackers?.flint;

      return {
        djinnState: flintTracker?.state || 'Unknown',
        atk: effectiveStats.atk,
      };
    });

    expect(overworldDjinnState.djinnState).toBe('Set');
    expect(overworldDjinnState.atk).toBe(18); // 14 base + 4 from Flint
    console.log(`   Flint Set: ATK ${overworldDjinnState.atk} (14 base + 4 Djinn bonus)`);

    // 3. Navigate to encounter and start battle
    console.log('   Starting battle...');
    for (let i = 0; i < 8; i++) {
      await page.keyboard.press('ArrowLeft');
      await page.waitForTimeout(150);
    }

    await waitForMode(page, 'team-select', 15000);
    const confirmButton = page.getByRole('button', { name: /confirm|start|begin/i });
    await confirmButton.waitFor({ state: 'visible', timeout: 10000 });
    await confirmButton.click();
    await waitForMode(page, 'battle', 15000);

    console.log('   Battle started - Round 1');

    // 3.5. Verify Flint abilities are present in battle
    const beforeActivation = await page.evaluate(() => {
      const store = (window as any).__VALE_STORE__;
      const helpers = (window as any).__VALE_TEST_HELPERS__;
      const battle = store.getState().battle;
      const isaac = battle?.playerTeam?.units[0];
      const team = battle?.playerTeam;

      if (!isaac || !team) {
        throw new Error('Isaac not found in battle');
      }

      const effectiveStats = helpers.calculateEffectiveStats(isaac, team);

      return {
        atk: effectiveStats.atk,
        abilities: isaac.abilities.map((a: any) => a.id),
        hasFlintAbility: isaac.abilities.some((a: any) => a.id?.includes('flint')),
      };
    });

    expect(beforeActivation.atk).toBe(18); // 14 base + 4 from Flint
    expect(beforeActivation.hasFlintAbility).toBe(true);
    console.log(`   Isaac in battle: ATK ${beforeActivation.atk}`);
    console.log(`   Flint abilities: ${beforeActivation.abilities.filter((id: string) => id.includes('flint')).join(', ')}`);

    // 4. Queue Djinn activation
    console.log('   Queueing Flint activation...');
    await page.evaluate(() => {
      const store = (window as any).__VALE_STORE__;
      store.getState().queueDjinnActivation('flint');
    });

    // 5. Verify Djinn is queued
    const queuedDjinn = await page.evaluate(() => {
      const store = (window as any).__VALE_STORE__;
      return store.getState().battle?.queuedDjinn || [];
    });

    expect(queuedDjinn).toContain('flint');
    console.log(`   Flint queued for activation: ${queuedDjinn.join(', ')}`);

    // 6. Queue player action (basic attack to complete round)
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

      // Queue basic attack for Isaac
      store.getState().queueUnitAction(0, null, [targetId], undefined);
    });

    // 7. Execute round
    console.log('   Executing round (activating Flint)...');
    await page.evaluate(() => {
      const store = (window as any).__VALE_STORE__;
      store.getState().executeQueuedRound();
    });

    await page.waitForTimeout(2000);

    // 8. Verify Djinn went to Standby and stats decreased
    const afterActivation = await page.evaluate(() => {
      const store = (window as any).__VALE_STORE__;
      const helpers = (window as any).__VALE_TEST_HELPERS__;
      const battle = store.getState().battle;
      const team = battle?.playerTeam;
      const isaac = team?.units[0];

      if (!isaac || !team) {
        throw new Error('Isaac or team not found');
      }

      const effectiveStats = helpers.calculateEffectiveStats(isaac, team);
      const flintTracker = team?.djinnTrackers?.flint;

      return {
        djinnState: flintTracker?.state || 'Unknown',
        atk: effectiveStats.atk,
        abilities: isaac.abilities.map((a: any) => a.id),
        hasFlintAbility: isaac.abilities.some((a: any) => a.id?.includes('flint')),
        recoveryTimer: battle?.djinnRecoveryTimers?.flint || 0,
        roundNumber: battle?.roundNumber || 0,
      };
    });

    expect(afterActivation.djinnState).toBe('Standby');
    expect(afterActivation.atk).toBe(14); // Lost Flint bonus!
    expect(afterActivation.hasFlintAbility).toBe(false); // Lost Flint abilities!
    expect(afterActivation.recoveryTimer).toBe(2); // 1 Djinn activated → recoveryTime = 1+1 = 2

    console.log(`   ✅ Flint activated → Standby`);
    console.log(`   ATK: 18 → ${afterActivation.atk} (lost +4 Djinn bonus)`);
    console.log(`   Flint abilities removed: ${!afterActivation.hasFlintAbility}`);
    console.log(`   Recovery timer: ${afterActivation.recoveryTimer} rounds`);
  });

  /**
   * Test: Djinn Recovery After 2 Rounds
   *
   * Verifies that after activating a Djinn:
   * 1. Timer starts at 2 rounds
   * 2. After 2 rounds (skip round 1, decrement rounds 2-3), Djinn returns to Set
   * 3. Stats and abilities are restored
   */
  test('Djinn recovers to Set after 2 rounds', async ({ page }) => {
    console.log('\n🧪 Test: Djinn Recovery System');

    // 1. Initialize and start battle
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await completeFlintIntro(page);
    await waitForMode(page, 'overworld', 30000);

    console.log('   Starting battle...');
    for (let i = 0; i < 8; i++) {
      await page.keyboard.press('ArrowLeft');
      await page.waitForTimeout(150);
    }

    await waitForMode(page, 'team-select', 15000);
    const confirmButton = page.getByRole('button', { name: /confirm|start|begin/i });
    await confirmButton.waitFor({ state: 'visible', timeout: 10000 });
    await confirmButton.click();
    await waitForMode(page, 'battle', 15000);

    console.log('   Battle started - Round 1');

    // 2. Activate Flint in Round 1
    console.log('   Round 1: Activating Flint...');
    await page.evaluate(() => {
      const store = (window as any).__VALE_STORE__;
      const battle = store.getState().battle;

      // Queue Djinn activation
      store.getState().queueDjinnActivation('flint');

      // Queue player action
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

    // 3. Verify Round 1 → Standby, timer = 2
    const round1State = await page.evaluate(() => {
      const store = (window as any).__VALE_STORE__;
      const battle = store.getState().battle;
      const team = battle?.playerTeam;
      const flintTracker = team?.djinnTrackers?.flint;

      return {
        djinnState: flintTracker?.state || 'Unknown',
        recoveryTimer: battle?.djinnRecoveryTimers?.flint || 0,
        roundNumber: battle?.roundNumber || 0,
        phase: battle?.phase || 'Unknown',
      };
    });

    expect(round1State.djinnState).toBe('Standby');
    expect(round1State.recoveryTimer).toBe(2);
    expect(round1State.phase).toBe('planning'); // Back to planning after execution
    console.log(`   Round ${round1State.roundNumber}: Djinn Standby, timer = ${round1State.recoveryTimer}`);

    // 4. Round 2: Execute another round (timer should stay at 2 due to skip logic)
    console.log('   Round 2: Continuing battle...');
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

    // 5. Verify Round 2 → timer decrements to 1
    const round2State = await page.evaluate(() => {
      const store = (window as any).__VALE_STORE__;
      const battle = store.getState().battle;
      const team = battle?.playerTeam;
      const flintTracker = team?.djinnTrackers?.flint;

      return {
        djinnState: flintTracker?.state || 'Unknown',
        recoveryTimer: battle?.djinnRecoveryTimers?.flint || 0,
        roundNumber: battle?.roundNumber || 0,
      };
    });

    expect(round2State.djinnState).toBe('Standby');
    expect(round2State.recoveryTimer).toBe(1); // Decremented from 2 → 1
    console.log(`   Round ${round2State.roundNumber}: Djinn still Standby, timer = ${round2State.recoveryTimer}`);

    // 6. Round 3: Execute another round (timer → 0, but recovery happens when round 4 starts)
    console.log('   Round 3: Continuing battle...');
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

    // 7. Verify Djinn recovered to Set after round 3 (recovery happens in startNextRound at end of round 3)
    const recoveredState = await page.evaluate(() => {
      const store = (window as any).__VALE_STORE__;
      const helpers = (window as any).__VALE_TEST_HELPERS__;
      const battle = store.getState().battle;
      const team = battle?.playerTeam;
      const isaac = team?.units[0];

      if (!isaac || !team) {
        throw new Error('Isaac or team not found');
      }

      const effectiveStats = helpers.calculateEffectiveStats(isaac, team);
      const flintTracker = team?.djinnTrackers?.flint;

      return {
        djinnState: flintTracker?.state || 'Unknown',
        recoveryTimer: battle?.djinnRecoveryTimers?.flint,
        atk: effectiveStats.atk,
        hasFlintAbility: isaac.abilities.some((a: any) => a.id?.includes('flint')),
        roundNumber: battle?.roundNumber || 0,
      };
    });

    expect(recoveredState.djinnState).toBe('Set');
    expect(recoveredState.recoveryTimer).toBeUndefined(); // Timer deleted when recovered
    expect(recoveredState.atk).toBe(18); // Flint bonus restored!
    expect(recoveredState.hasFlintAbility).toBe(true); // Flint abilities restored!

    console.log(`   ✅ Round ${recoveredState.roundNumber}: Djinn recovered to Set!`);
    console.log(`   ATK: 14 → ${recoveredState.atk} (+4 Djinn bonus restored)`);
    console.log(`   Flint abilities restored: ${recoveredState.hasFlintAbility}`);
    console.log(`   Recovery timer cleared: ${recoveredState.recoveryTimer === undefined}`);
  });
});
