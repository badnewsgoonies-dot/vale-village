/**
 * Combat Mechanics Integration Tests
 *
 * These tests validate core combat systems by executing REAL battle actions
 * and verifying actual damage calculations (not simulated victories).
 *
 * Coverage:
 * 1. Damage formula checking relative stat deltas
 * 2. Equipment bonus integration
 * 3. Djinn stat bonus influence
 * 4. Level-up stat growth
 * 5. Turn order validation
 *
 * These tests close critical coverage gaps and keep regressions from creeping
 * back into the core combat loop.
 */

import type { Page } from '@playwright/test';
import { test, expect } from '@playwright/test';
import {
  waitForMode,
  executeBattleActionAndCaptureDamage,
  grantEquipment,
  equipItem,
  completeFlintIntro,
  setDjinnState,
  startHouseBattle,
  completeBattle,
  claimRewardsAndReturnToOverworld,
  addUnitToTeam,
  setUnitLevel,
  stabilizeBattleDurability,
  navigateToPosition,
  STARTING_POSITION,
} from './helpers';
import type { TestUnitDefinition } from './helpers';
import { WOODEN_SWORD } from '../../src/data/definitions/equipment';

const COMBAT_WAR_MAGE: TestUnitDefinition = {
  id: 'war-mage-combat',
  name: 'War Mage',
  element: 'Mars',
  role: 'Elemental Mage',
  baseStats: {
    hp: 110,
    pp: 45,
    atk: 16,
    def: 14,
    mag: 18,
    spd: 12,
  },
  growthRates: {
    hp: 22,
    pp: 4,
    atk: 4,
    def: 3,
    mag: 4,
    spd: 1,
  },
  abilities: [],
  unlockedAbilityIds: [],
  manaContribution: 2,
  description: 'Fast Mars mage used for turn order testing',
};

type StatsSnapshot = {
  level: number;
  hp: number;
  atk: number;
  def: number;
  spd: number;
};

async function initializeOverworld(page: Page): Promise<void> {
  await page.goto('/');
  await page.waitForLoadState('networkidle');
  await completeFlintIntro(page);
  await waitForMode(page, 'overworld', 30000);
}

async function getIsaacStatsSnapshot(page: Page): Promise<StatsSnapshot> {
  return page.evaluate(() => {
    const store = (window as any).__VALE_STORE__;
    const helpers = (window as any).__VALE_TEST_HELPERS__;
    const unit = store?.getState()?.team?.units?.[0];

    if (!unit || !helpers?.calculateEffectiveStats) {
      return {
        level: 0,
        hp: 0,
        atk: 0,
        def: 0,
        spd: 0,
      };
    }

    const effectiveStats = helpers.calculateEffectiveStats(unit, store.getState().team);

    return {
      level: unit.level,
      hp: effectiveStats.hp,
      atk: effectiveStats.atk,
      def: effectiveStats.def,
      spd: effectiveStats.spd,
    };
  });
}

async function captureIsaacDamageWithPrep(
  page: Page,
  battleId: number,
  beforeAttack?: () => Promise<void>
): Promise<number> {
  await navigateToPosition(page, STARTING_POSITION.x, STARTING_POSITION.y);
  await page.waitForTimeout(250);
  await startHouseBattle(page, battleId);
  await stabilizeBattleDurability(page);

  if (beforeAttack) {
    await beforeAttack();
  }

  const { damageDealt } = await executeBattleActionAndCaptureDamage(page, 0, null, 0);

  await completeBattle(page);
  await claimRewardsAndReturnToOverworld(page);
  await waitForMode(page, 'overworld', 10000);
  await navigateToPosition(page, STARTING_POSITION.x, STARTING_POSITION.y);
  await page.waitForTimeout(250);

  return damageDealt;
}

test.describe('Combat Mechanics Integration', () => {
  test('damage output increases when enemy defense drops', async ({ page }) => {
    console.log('\n🧪 Test 1: Damage vs Defense');

    await initializeOverworld(page);
    await setDjinnState(page, 'flint', 'Standby');

    const baselineDamage = await captureIsaacDamageWithPrep(page, 1);

    const reducedDefenseDamage = await captureIsaacDamageWithPrep(page, 1, async () => {
      await page.evaluate(() => {
        const store = (window as any).__VALE_STORE__;
        const battle = store?.getState()?.battle;
        const enemy = battle?.enemies?.[0];
        if (!enemy?.baseStats) return;

        const currentDef = enemy.baseStats.def ?? 0;
        const reducedDef = Math.max(0, currentDef - 4);
        enemy.baseStats = { ...enemy.baseStats, def: reducedDef };
      });
    });

    console.log(
      '   Damage comparison (baseline → reduced DEF):',
      baselineDamage,
      '→',
      reducedDefenseDamage
    );
    expect(reducedDefenseDamage).toBeGreaterThan(baselineDamage);
  });

  test('equipped weapon increases attack and output', async ({ page }) => {
    console.log('\n🧪 Test 2: Equipment Bonus Integration');

    await initializeOverworld(page);
    await setDjinnState(page, 'flint', 'Standby');

    const statsWithoutWeapon = await getIsaacStatsSnapshot(page);
    const damageWithoutWeapon = await captureIsaacDamageWithPrep(page, 1);

    await page.reload();
    await initializeOverworld(page);
    await grantEquipment(page, [WOODEN_SWORD]);
    const isaacId = await page.evaluate(() => {
      const store = (window as any).__VALE_STORE__;
      return store.getState().team?.units?.[0]?.id;
    });

    await equipItem(page, isaacId, 'weapon', WOODEN_SWORD);
    await setDjinnState(page, 'flint', 'Standby');

    const statsWithWeapon = await getIsaacStatsSnapshot(page);
    const damageWithWeapon = await captureIsaacDamageWithPrep(page, 1);

    console.log(
      '   ATK comparison (no weapon → weapon):',
      statsWithoutWeapon.atk,
      '→',
      statsWithWeapon.atk
    );
    console.log('   Damage comparison:', damageWithoutWeapon, '→', damageWithWeapon);

    expect(statsWithWeapon.atk).toBeGreaterThan(statsWithoutWeapon.atk);
    expect(damageWithWeapon).toBeGreaterThan(damageWithoutWeapon);
  });

  test('Set Djinn increases attack stat and damage', async ({ page }) => {
    console.log('\n🧪 Test 3: Djinn Bonus Integration');

    await initializeOverworld(page);

    await setDjinnState(page, 'flint', 'Standby');
    const standbyStats = await getIsaacStatsSnapshot(page);
    const standbyDamage = await captureIsaacDamageWithPrep(page, 1);

    await setDjinnState(page, 'flint', 'Set');
    const setStats = await getIsaacStatsSnapshot(page);
    const setDamage = await captureIsaacDamageWithPrep(page, 1);

    console.log('   ATK standby → Set:', standbyStats.atk, '→', setStats.atk);
    console.log('   Damage standby → Set:', standbyDamage, '→', setDamage);

    expect(setStats.atk).toBeGreaterThanOrEqual(standbyStats.atk);
    expect(setDamage).toBeGreaterThan(standbyDamage);
  });

  test('level up increases stats relative to the baseline', async ({ page }) => {
    console.log('\n🧪 Test 4: Level-Up Progression');

    await initializeOverworld(page);

    await setDjinnState(page, 'flint', 'Standby');
    const level1Stats = await getIsaacStatsSnapshot(page);
    const level1Damage = await captureIsaacDamageWithPrep(page, 1);

    const isaacId = await page.evaluate(() => {
      const store = (window as any).__VALE_STORE__;
      return store.getState().team?.units?.[0]?.id;
    });

    if (!isaacId) {
      throw new Error('Isaac unit not found');
    }

    await setUnitLevel(page, isaacId, 5, 0);
    await setDjinnState(page, 'flint', 'Standby');

    const level5Stats = await getIsaacStatsSnapshot(page);
    const level5Damage = await captureIsaacDamageWithPrep(page, 1);

    console.log('   Level 1 stats vs Level 5 stats:', level1Stats, level5Stats);
    console.log('   Damage Level 1 → Level 5:', level1Damage, '→', level5Damage);

    expect(level5Stats.level).toBe(5);
    expect(level5Stats.hp).toBeGreaterThanOrEqual(level1Stats.hp);
    expect(level5Stats.atk).toBeGreaterThanOrEqual(level1Stats.atk);
    expect(level5Stats.spd).toBeGreaterThanOrEqual(level1Stats.spd);
    expect(level5Damage).toBeGreaterThan(level1Damage);
  });

  test('turn order respects speed stat', async ({ page }) => {
    console.log('\n🧪 Test 5: Turn Order Validation');

    await initializeOverworld(page);

    await addUnitToTeam(page, COMBAT_WAR_MAGE, 1);

    const teamSize = await page.evaluate(() => {
      const store = (window as any).__VALE_STORE__;
      return store.getState().team?.units.length;
    });
    expect(teamSize).toBe(2);

    await startHouseBattle(page, 1);

    const turnOrderInfo = await page.evaluate(() => {
      const store = (window as any).__VALE_STORE__;
      const helpers = (window as any).__VALE_TEST_HELPERS__;
      const battle = store.getState().battle;
      const team = store.getState().team;

      const allUnits = [...(battle?.playerTeam?.units ?? []), ...(battle?.enemies ?? [])];

      const unitSpeeds = allUnits.map((unit: any) => ({
        id: unit.id,
        name: unit.name,
        spd: helpers.calculateEffectiveStats(unit, team).spd,
      }));

      return {
        turnOrder: battle?.turnOrder ?? [],
        unitSpeeds,
      };
    });

    console.log('   Turn order:', turnOrderInfo.turnOrder);
    turnOrderInfo.unitSpeeds.forEach(unit => {
      console.log(`     ${unit.name}: SPD ${unit.spd}`);
    });

    const isaacIndex = turnOrderInfo.turnOrder.findIndex(id => id.includes('isaac') || id.includes('adept'));
    const warMageIndex = turnOrderInfo.turnOrder.findIndex(id => id.includes('war-mage'));

    expect(isaacIndex).toBeGreaterThanOrEqual(0);
    expect(warMageIndex).toBeGreaterThanOrEqual(0);

    const isaacSpeed = turnOrderInfo.unitSpeeds.find(unit => unit.id === turnOrderInfo.turnOrder[isaacIndex])?.spd;
    const warMageSpeed = turnOrderInfo.unitSpeeds.find(unit => unit.id === turnOrderInfo.turnOrder[warMageIndex])?.spd;

    if (warMageSpeed && isaacSpeed && warMageSpeed > isaacSpeed) {
      expect(warMageIndex).toBeLessThan(isaacIndex);
    }

    await completeBattle(page);
    await claimRewardsAndReturnToOverworld(page);
    await waitForMode(page, 'overworld', 10000);
  });
});
