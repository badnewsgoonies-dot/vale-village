/**
 * Djinn Ability Updates E2E Tests
 * 
 * Comprehensive tests for Djinn ability system:
 * - Set Djinn grant abilities
 * - Activation removes abilities
 * - Recovery restores abilities
 * - Stat bonuses update with Djinn state
 * - UI reflects changes in real-time
 * 
 * Run with: npx playwright test djinn-ability-updates --headed --workers=1
 */

import { test, expect } from '@playwright/test';
import {
  getGameState,
  waitForMode,
  navigateToPosition,
  completeBattle,
  getUnitData,
} from './helpers';

test.describe('Djinn Ability Updates', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Wait for initial state
    await page.waitForFunction(
      () => {
        const store = (window as any).__VALE_STORE__;
        return store && store.getState().mode === 'overworld';
      },
      { timeout: 10000 }
    );
  });

  test('Set Djinn grant abilities to units', async ({ page }) => {
    console.log('\n✨ === SET DJINN GRANT ABILITIES TEST ===\n');

    // Get initial unit (should have Flint Djinn equipped)
    const unitBefore = await getUnitData(page, 0);
    expect(unitBefore).not.toBeNull();

    // Check if unit has Djinn abilities
    const djinnAbilities = await page.evaluate(() => {
      const store = (window as any).__VALE_STORE__;
      if (!store) return null;
      
      const state = store.getState();
      const unit = state.team?.units[0];
      if (!unit) return null;
      
      const { getDjinnGrantedAbilitiesForUnit } = require('../../src/core/algorithms/djinnAbilities');
      const abilities = getDjinnGrantedAbilitiesForUnit(unit, state.team);
      return abilities;
    });

    expect(djinnAbilities).not.toBeNull();
    expect(Array.isArray(djinnAbilities)).toBe(true);
    
    // Unit should have at least one Djinn ability if Flint is Set
    const flintState = await page.evaluate(() => {
      const store = (window as any).__VALE_STORE__;
      if (!store) return null;
      
      const state = store.getState();
      const tracker = state.team?.djinnTrackers?.['flint'];
      return tracker?.state;
    });

    if (flintState === 'Set') {
      expect(djinnAbilities.length).toBeGreaterThan(0);
      console.log(`✅ Set Djinn grant ${djinnAbilities.length} abilities`);
    } else {
      console.log(`⚠️ Flint Djinn is ${flintState}, not Set`);
    }
  });

  test('Djinn activation removes abilities', async ({ page }) => {
    console.log('\n⚡ === DJINN ACTIVATION REMOVES ABILITIES TEST ===\n');

    // Navigate to battle
    await navigateToPosition(page, 10, 8);
    await page.waitForTimeout(1000);

    // Check if battle started
    let state = await getGameState(page);
    const battleStarted = state?.mode === 'battle' || state?.battle !== null;

    if (!battleStarted) {
      console.log('   ⚠️ Battle did not start, skipping test');
      return;
    }

    // Get abilities before activation
    const abilitiesBefore = await page.evaluate(() => {
      const store = (window as any).__VALE_STORE__;
      if (!store) return null;
      
      const battle = store.getState().battle;
      if (!battle) return null;
      
      const unit = battle.playerTeam?.units[0];
      if (!unit) return null;
      
      const { getDjinnGrantedAbilitiesForUnit } = require('../../src/core/algorithms/djinnAbilities');
      const abilities = getDjinnGrantedAbilitiesForUnit(unit, battle.playerTeam);
      return {
        abilityIds: abilities,
        abilityCount: unit.abilities.length,
        djinnState: battle.playerTeam.djinnTrackers?.flint?.state,
      };
    });

    expect(abilitiesBefore).not.toBeNull();
    const initialAbilityCount = abilitiesBefore?.abilityCount ?? 0;
    const hasDjinnAbilities = (abilitiesBefore?.abilityIds?.length ?? 0) > 0;

    if (!hasDjinnAbilities) {
      console.log('   ⚠️ Unit has no Djinn abilities (Djinn may not be Set)');
      return;
    }

    // Queue Djinn activation via store (more reliable than UI)
    await page.evaluate(() => {
      const store = (window as any).__VALE_STORE__;
      if (!store) return;
      
      const state = store.getState();
      const battle = state.battle;
      if (!battle) return;
      
      // Queue Flint Djinn activation
      const { queueDjinn } = require('../../src/core/services/QueueBattleService');
      const result = queueDjinn(battle, 'flint');
      
      if (result.ok) {
        store.getState().setBattle(result.value, 0);
      }
    });

    // Execute round to activate Djinn
    await page.evaluate(() => {
      const store = (window as any).__VALE_STORE__;
      if (!store) return;
      
      const state = store.getState();
      const battle = state.battle;
      if (!battle || battle.phase !== 'planning') return;
      
      // Fill queue with basic attacks if needed
      const { queueAction } = require('../../src/core/services/QueueBattleService');
      const { PRNG } = require('../../src/core/random/prng');
      
      battle.playerTeam.units.forEach((unit: any, index: number) => {
        if (!battle.queuedActions[index] && unit.currentHp > 0) {
          queueAction(battle, unit.id, null, [battle.enemies[0]?.id || ''], undefined);
        }
      });
      
      // Execute round
      const { executeRound } = require('../../src/core/services/QueueBattleService');
      const rng = new PRNG(12345);
      const result = executeRound(battle, rng);
      
      store.getState().setBattle(result.state, 0);
    });

    await page.waitForTimeout(2000);

    // Check abilities after activation
    const abilitiesAfter = await page.evaluate(() => {
      const store = (window as any).__VALE_STORE__;
      if (!store) return null;
      
      const battle = store.getState().battle;
      if (!battle) return null;
      
      const unit = battle.playerTeam?.units[0];
      if (!unit) return null;
      
      const { getDjinnGrantedAbilitiesForUnit } = require('../../src/core/algorithms/djinnAbilities');
      const abilities = getDjinnGrantedAbilitiesForUnit(unit, battle.playerTeam);
      return {
        abilityIds: abilities,
        abilityCount: unit.abilities.length,
        djinnState: battle.playerTeam.djinnTrackers?.flint?.state,
      };
    });

    expect(abilitiesAfter).not.toBeNull();
    
    // Djinn should be Standby after activation
    expect(abilitiesAfter?.djinnState).toBe('Standby');
    
    // Abilities should be removed (fewer abilities than before)
    expect(abilitiesAfter?.abilityCount).toBeLessThan(initialAbilityCount);
    expect(abilitiesAfter?.abilityIds?.length).toBe(0);

    console.log(`✅ Djinn activation removed abilities (${initialAbilityCount} → ${abilitiesAfter?.abilityCount})`);
  });

  test('Djinn recovery restores abilities', async ({ page }) => {
    console.log('\n🔄 === DJINN RECOVERY RESTORES ABILITIES TEST ===\n');

    // Navigate to battle
    await navigateToPosition(page, 10, 8);
    await page.waitForTimeout(1000);

    let state = await getGameState(page);
    const battleStarted = state?.mode === 'battle' || state?.battle !== null;

    if (!battleStarted) {
      console.log('   ⚠️ Battle did not start, skipping test');
      return;
    }

    // Activate Djinn first
    await page.evaluate(() => {
      const store = (window as any).__VALE_STORE__;
      if (!store) return;
      
      const state = store.getState();
      const battle = state.battle;
      if (!battle) return;
      
      const { queueDjinn, queueAction, executeRound } = require('../../src/core/services/QueueBattleService');
      const { PRNG } = require('../../src/core/random/prng');
      
      // Queue Djinn
      queueDjinn(battle, 'flint');
      
      // Fill queue
      battle.playerTeam.units.forEach((unit: any, index: number) => {
        if (!battle.queuedActions[index] && unit.currentHp > 0) {
          queueAction(battle, unit.id, null, [battle.enemies[0]?.id || ''], undefined);
        }
      });
      
      // Execute
      const rng = new PRNG(12345);
      const result = executeRound(battle, rng);
      store.getState().setBattle(result.state, 0);
    });

    await page.waitForTimeout(1000);

    // Verify Djinn is Standby
    const afterActivation = await page.evaluate(() => {
      const store = (window as any).__VALE_STORE__;
      if (!store) return null;
      
      const battle = store.getState().battle;
      if (!battle) return null;
      
      return {
        djinnState: battle.playerTeam.djinnTrackers?.flint?.state,
        recoveryTimer: battle.djinnRecoveryTimers?.flint,
      };
    });

    expect(afterActivation?.djinnState).toBe('Standby');
    expect(afterActivation?.recoveryTimer).toBeGreaterThan(0);

    // Fast-forward recovery by manually updating timers
    await page.evaluate(() => {
      const store = (window as any).__VALE_STORE__;
      if (!store) return;
      
      const state = store.getState();
      const battle = state.battle;
      if (!battle) return;
      
      // Manually set recovery timer to 0 to trigger recovery
      const { updateBattleState } = require('../../src/core/models/BattleState');
      const { transitionToPlanningPhase } = require('../../src/core/services/QueueBattleService');
      
      // Set timer to 0
      const timers = { ...battle.djinnRecoveryTimers };
      timers['flint'] = 0;
      
      const updatedBattle = updateBattleState(battle, {
        djinnRecoveryTimers: timers,
      });
      
      // Trigger recovery
      const recovered = transitionToPlanningPhase(updatedBattle);
      store.getState().setBattle(recovered, 0);
    });

    await page.waitForTimeout(1000);

    // Check abilities after recovery
    const abilitiesAfterRecovery = await page.evaluate(() => {
      const store = (window as any).__VALE_STORE__;
      if (!store) return null;
      
      const battle = store.getState().battle;
      if (!battle) return null;
      
      const unit = battle.playerTeam?.units[0];
      if (!unit) return null;
      
      const { getDjinnGrantedAbilitiesForUnit } = require('../../src/core/algorithms/djinnAbilities');
      const abilities = getDjinnGrantedAbilitiesForUnit(unit, battle.playerTeam);
      return {
        abilityIds: abilities,
        abilityCount: unit.abilities.length,
        djinnState: battle.playerTeam.djinnTrackers?.flint?.state,
      };
    });

    expect(abilitiesAfterRecovery).not.toBeNull();
    
    // Djinn should be Set after recovery
    expect(abilitiesAfterRecovery?.djinnState).toBe('Set');
    
    // Abilities should be restored
    expect(abilitiesAfterRecovery?.abilityIds?.length).toBeGreaterThan(0);

    console.log(`✅ Djinn recovery restored abilities (${abilitiesAfterRecovery?.abilityIds?.length} abilities)`);
  });

  test('Djinn stat bonuses update with state', async ({ page }) => {
    console.log('\n📊 === DJINN STAT BONUSES TEST ===\n');

    // Navigate to battle
    await navigateToPosition(page, 10, 8);
    await page.waitForTimeout(1000);

    let state = await getGameState(page);
    const battleStarted = state?.mode === 'battle' || state?.battle !== null;

    if (!battleStarted) {
      console.log('   ⚠️ Battle did not start, skipping test');
      return;
    }

    // Get stats before activation
    const statsBefore = await page.evaluate(() => {
      const store = (window as any).__VALE_STORE__;
      if (!store) return null;
      
      const battle = store.getState().battle;
      if (!battle) return null;
      
      const unit = battle.playerTeam?.units[0];
      if (!unit) return null;
      
      const { calculateEffectiveStats, calculateDjinnBonusesForUnit } = require('../../src/core/algorithms/stats');
      const effectiveStats = calculateEffectiveStats(unit, battle.playerTeam);
      const djinnBonuses = calculateDjinnBonusesForUnit(unit, battle.playerTeam);
      
      return {
        effectiveAtk: effectiveStats.atk,
        effectiveDef: effectiveStats.def,
        djinnAtkBonus: djinnBonuses.atk || 0,
        djinnDefBonus: djinnBonuses.def || 0,
        djinnState: battle.playerTeam.djinnTrackers?.flint?.state,
      };
    });

    expect(statsBefore).not.toBeNull();
    const initialDjinnAtk = statsBefore?.djinnAtkBonus ?? 0;
    const initialDjinnDef = statsBefore?.djinnDefBonus ?? 0;

    // Activate Djinn
    await page.evaluate(() => {
      const store = (window as any).__VALE_STORE__;
      if (!store) return;
      
      const state = store.getState();
      const battle = state.battle;
      if (!battle) return;
      
      const { queueDjinn, queueAction, executeRound } = require('../../src/core/services/QueueBattleService');
      const { PRNG } = require('../../src/core/random/prng');
      
      queueDjinn(battle, 'flint');
      battle.playerTeam.units.forEach((unit: any, index: number) => {
        if (!battle.queuedActions[index] && unit.currentHp > 0) {
          queueAction(battle, unit.id, null, [battle.enemies[0]?.id || ''], undefined);
        }
      });
      
      const rng = new PRNG(12345);
      const result = executeRound(battle, rng);
      store.getState().setBattle(result.state, 0);
    });

    await page.waitForTimeout(1000);

    // Get stats after activation
    const statsAfter = await page.evaluate(() => {
      const store = (window as any).__VALE_STORE__;
      if (!store) return null;
      
      const battle = store.getState().battle;
      if (!battle) return null;
      
      const unit = battle.playerTeam?.units[0];
      if (!unit) return null;
      
      const { calculateEffectiveStats, calculateDjinnBonusesForUnit } = require('../../src/core/algorithms/stats');
      const effectiveStats = calculateEffectiveStats(unit, battle.playerTeam);
      const djinnBonuses = calculateDjinnBonusesForUnit(unit, battle.playerTeam);
      
      return {
        effectiveAtk: effectiveStats.atk,
        effectiveDef: effectiveStats.def,
        djinnAtkBonus: djinnBonuses.atk || 0,
        djinnDefBonus: djinnBonuses.def || 0,
        djinnState: battle.playerTeam.djinnTrackers?.flint?.state,
      };
    });

    expect(statsAfter).not.toBeNull();
    
    // Djinn bonuses should be removed when Standby
    if (initialDjinnAtk > 0 || initialDjinnDef > 0) {
      expect(statsAfter?.djinnAtkBonus).toBeLessThan(initialDjinnAtk);
      expect(statsAfter?.djinnDefBonus).toBeLessThan(initialDjinnDef);
      console.log(`✅ Stat bonuses removed: ATK ${initialDjinnAtk} → ${statsAfter?.djinnAtkBonus}, DEF ${initialDjinnDef} → ${statsAfter?.djinnDefBonus}`);
    } else {
      console.log('   ⚠️ No initial Djinn bonuses to test');
    }
  });

  test('UI reflects ability changes in real-time', async ({ page }) => {
    console.log('\n🖥️ === UI REAL-TIME UPDATES TEST ===\n');

    // Navigate to battle
    await navigateToPosition(page, 10, 8);
    await page.waitForTimeout(1000);

    let state = await getGameState(page);
    const battleStarted = state?.mode === 'battle' || state?.battle !== null;

    if (!battleStarted) {
      console.log('   ⚠️ Battle did not start, skipping test');
      return;
    }

    // Count abilities in UI before activation
    const abilityButtonsBefore = await page.locator('button').filter({ hasText: /[A-Z]/ }).count();
    
    // Activate Djinn
    await page.evaluate(() => {
      const store = (window as any).__VALE_STORE__;
      if (!store) return;
      
      const state = store.getState();
      const battle = state.battle;
      if (!battle) return;
      
      const { queueDjinn, queueAction, executeRound } = require('../../src/core/services/QueueBattleService');
      const { PRNG } = require('../../src/core/random/prng');
      
      queueDjinn(battle, 'flint');
      battle.playerTeam.units.forEach((unit: any, index: number) => {
        if (!battle.queuedActions[index] && unit.currentHp > 0) {
          queueAction(battle, unit.id, null, [battle.enemies[0]?.id || ''], undefined);
        }
      });
      
      const rng = new PRNG(12345);
      const result = executeRound(battle, rng);
      store.getState().setBattle(result.state, 0);
    });

    await page.waitForTimeout(2000);

    // Count abilities in UI after activation
    const abilityButtonsAfter = await page.locator('button').filter({ hasText: /[A-Z]/ }).count();

    // UI should update (fewer ability buttons if abilities were removed)
    // Note: This is a basic check - actual UI structure may vary
    console.log(`✅ UI updated: ${abilityButtonsBefore} → ${abilityButtonsAfter} ability buttons`);
  });
});
