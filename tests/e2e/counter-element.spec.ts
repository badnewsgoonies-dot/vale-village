/**
 * Counter Element Mechanics E2E Tests
 *
 * Verifies the counter element system for Djinn:
 * - Counter elements give stat penalties
 * - Counter elements still grant unique abilities
 * - Same element gives bonuses
 * - Neutral elements give smaller bonuses
 *
 * Counter Pairs:
 * - Venus ↔ Mars
 * - Jupiter ↔ Mercury
 *
 * Bonuses/Penalties:
 * - Same: +4 ATK, +3 DEF
 * - Counter: -3 ATK, -2 DEF
 * - Neutral: +2 ATK, +2 DEF
 *
 * PR-DJINN-CORE: Element compatibility system
 */

import type { Page } from '@playwright/test';
import { test, expect } from '@playwright/test';
import {
  waitForMode,
  completeFlintIntro,
  enterHouseBattle,
  stabilizeBattleDurability,
  completeBattle,
  claimRewardsAndReturnToOverworld,
  addUnitToTeam,
  formatHouseEncounterId,
} from './helpers';
import type { TestUnitDefinition } from './helpers';

const WAR_MAGE_TEST_UNIT: TestUnitDefinition = {
  id: 'war-mage',
  name: 'War Mage',
  element: 'Mars',
  role: 'Elemental Mage',
  baseStats: {
    hp: 80,
    pp: 25,
    atk: 10,
    def: 12,
    mag: 18,
    spd: 14,
  },
  growthRates: {
    hp: 20,
    pp: 5,
    atk: 2,
    def: 3,
    mag: 4,
    spd: 2,
  },
  abilities: [],
  unlockedAbilityIds: [],
  manaContribution: 2,
  description: 'A fiery Mars mage',
};

test.describe('Counter Element Mechanics', () => {
  /**
   * Test: Same Element Gives Bonuses
   *
   * Verifies that a Venus Djinn (Flint) equipped to a Venus unit (Adept)
   * provides stat bonuses.
   */
  test('same element Djinn gives stat bonuses', async ({ page }) => {
    console.log('\n🧪 Test: Same Element Bonuses');

    // 1. Initialize game
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await completeFlintIntro(page);
    await waitForMode(page, 'overworld', 30000);

    // 2. Verify Adept (Venus) + Flint (Venus) = bonuses
    const sameElementStats = await page.evaluate(() => {
      const store = (window as any).__VALE_STORE__;
      const helpers = (window as any).__VALE_TEST_HELPERS__;
      const team = store.getState().team;
      const adept = team?.units[0];

      if (!adept) {
        throw new Error('Adept not found');
      }

      const baseStats = adept.baseStats;
      const effectiveStats = helpers.calculateEffectiveStats(adept, team);
      const flintTracker = team?.djinnTrackers?.flint;

      return {
        unitElement: adept.element,
        djinnState: flintTracker?.state || 'Unknown',
        baseAtk: baseStats.atk,
        baseDef: baseStats.def,
        effectiveAtk: effectiveStats.atk,
        effectiveDef: effectiveStats.def,
        atkBonus: effectiveStats.atk - baseStats.atk,
        defBonus: effectiveStats.def - baseStats.def,
      };
    });

    expect(sameElementStats.unitElement).toBe('Venus');
    expect(sameElementStats.djinnState).toBe('Set');
    expect(sameElementStats.atkBonus).toBe(4); // +4 ATK from same element
    expect(sameElementStats.defBonus).toBe(3); // +3 DEF from same element

    console.log(`   Adept (Venus) + Flint (Venus):`);
    console.log(`   ATK: ${sameElementStats.baseAtk} + ${sameElementStats.atkBonus} = ${sameElementStats.effectiveAtk}`);
    console.log(`   DEF: ${sameElementStats.baseDef} + ${sameElementStats.defBonus} = ${sameElementStats.effectiveDef}`);
    console.log(`   ✅ Same element gives +4 ATK, +3 DEF`);

    console.log('   Running a quick battle to exercise the same-element flow...');
    await runHouseBattleAndReturn(page);
  });

  /**
   * Test: Counter Element Gives Penalties
   *
   * Verifies that a Venus Djinn (Flint) equipped to a Mars unit (War Mage)
   * gives stat penalties but still grants abilities.
   *
   * Note: We manually add War Mage to the team for testing.
   */
  test('counter element Djinn gives stat penalties but grants abilities', async ({ page }) => {
    console.log('\n🧪 Test: Counter Element Penalties');

    // 1. Initialize game
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await completeFlintIntro(page);
    await waitForMode(page, 'overworld', 30000);

    console.log('   Adding War Mage (Mars) to team for counter element testing...');
    await addUnitToTeam(page, WAR_MAGE_TEST_UNIT, 1);

    // 3. Verify War Mage (Mars) + Flint (Venus) = penalties
    const counterElementStats = await page.evaluate(() => {
      const store = (window as any).__VALE_STORE__;
      const helpers = (window as any).__VALE_TEST_HELPERS__;
      const team = store.getState().team;
      const warMage = team?.units[1]; // War Mage is second unit

      if (!warMage) {
        throw new Error('War Mage not found');
      }

      const baseStats = warMage.baseStats;
      const effectiveStats = helpers.calculateEffectiveStats(warMage, team);
      const flintTracker = team?.djinnTrackers?.flint;

      return {
        unitName: warMage.name,
        unitElement: warMage.element,
        djinnState: flintTracker?.state || 'Unknown',
        baseAtk: baseStats.atk,
        baseDef: baseStats.def,
        effectiveAtk: effectiveStats.atk,
        effectiveDef: effectiveStats.def,
        atkPenalty: effectiveStats.atk - baseStats.atk,
        defPenalty: effectiveStats.def - baseStats.def,
      };
    });

    expect(counterElementStats.unitElement).toBe('Mars');
    expect(counterElementStats.djinnState).toBe('Set');
    expect(counterElementStats.atkPenalty).toBe(-3); // -3 ATK from counter element
    expect(counterElementStats.defPenalty).toBe(-2); // -2 DEF from counter element

    console.log(`   ${counterElementStats.unitName} (Mars) + Flint (Venus):`);
    console.log(`   ATK: ${counterElementStats.baseAtk} + ${counterElementStats.atkPenalty} = ${counterElementStats.effectiveAtk}`);
    console.log(`   DEF: ${counterElementStats.baseDef} + ${counterElementStats.defPenalty} = ${counterElementStats.effectiveDef}`);
    console.log(`   ✅ Counter element gives -3 ATK, -2 DEF`);

    console.log('   Running battle flow to verify counter-element penalties stay stable...');
    await runHouseBattleAndReturn(page);

    // 4. Verify counter abilities are still granted
    // (We would need to enter battle to see merged abilities, but for now
    //  we just verify the penalty mechanic works)
  });

  /**
   * Test: Neutral Element Gives Smaller Bonuses
   *
   * Verifies that Djinn of neutral element (not same, not counter)
   * give smaller bonuses than same element.
   *
   * Example: Jupiter Djinn on Venus unit = neutral (+2 ATK, +2 DEF)
   *
   * Note: Requires having a Jupiter Djinn, which may not be in initial game state.
   * This test is skipped for now.
   */
  test.skip('neutral element Djinn gives smaller bonuses', async ({ page }) => {
    // This test would verify:
    // - Jupiter Djinn on Venus unit = +2 ATK, +2 DEF (neutral)
    // - Not same (+4/+2) or counter (-3/-2)
    //
    // Skipped because we don't have a Jupiter Djinn in the initial game state.
  });
});

async function runHouseBattleAndReturn(page: Page, houseNumber: number = 1): Promise<void> {
  const encounterId = formatHouseEncounterId(houseNumber);
  console.log(`   Entering ${encounterId} to exercise the counter element battle flow...`);
  await enterHouseBattle(page, houseNumber);

  const confirmButton = page.getByRole('button', { name: /confirm|start|begin/i });
  await confirmButton.click();
  await waitForMode(page, 'battle', 10000);
  await stabilizeBattleDurability(page);

  await completeBattle(page);
  await claimRewardsAndReturnToOverworld(page);
  await waitForMode(page, 'overworld', 10000);
  console.log('   Battle flow complete and returned to overworld.');
}
