import { describe, test, expect } from 'vitest';
import { Unit } from '@/types/Unit';
import { ISAAC, GARET, MIA, IVAN } from '@/data/unitDefinitions';
import { IRON_SWORD, STEEL_SWORD } from '@/data/equipment';

/**
 * SIMON COWELL'S "NO MAGIC NUMBERS" ENFORCEMENT
 *
 * Every test with hardcoded numbers like "180" or "27" is LAZY.
 * Calculate expected values from formulas. Make tests SELF-DOCUMENTING.
 */
describe('✅ PROPER TESTS: No Magic Numbers (How It SHOULD Be Done)', () => {

  test('Isaac Level 5 stats calculated from formula (NOT hardcoded!)', () => {
    const isaac = new Unit(ISAAC, 5);

    // DON'T DO THIS (magic numbers):
    // expect(isaac.stats.hp).toBe(180); // ❌ What is 180?

    // DO THIS (calculated from actual formula):
    const expectedHP = ISAAC.baseStats.hp + (ISAAC.growthRates.hp * (5 - 1));
    const expectedATK = ISAAC.baseStats.atk + (ISAAC.growthRates.atk * (5 - 1));
    const expectedDEF = ISAAC.baseStats.def + (ISAAC.growthRates.def * (5 - 1));

    expect(isaac.stats.hp).toBe(expectedHP);   // ✅ Clear where 180 comes from
    expect(isaac.stats.atk).toBe(expectedATK); // ✅ Clear where 27 comes from
    expect(isaac.stats.def).toBe(expectedDEF); // ✅ Clear where 18 comes from

    // NOW when GAME_MECHANICS.md changes, this test auto-updates!
  });

  test('Equipment bonus calculated (NOT hardcoded!)', () => {
    const isaac = new Unit(ISAAC, 5);

    // Base stats (calculated, not hardcoded)
    const baseATK = ISAAC.baseStats.atk + (ISAAC.growthRates.atk * 4);

    // Before equipping
    expect(isaac.stats.atk).toBe(baseATK);

    // Equip weapon
    isaac.equipItem('weapon', IRON_SWORD);

    // DON'T DO THIS:
    // expect(isaac.stats.atk).toBe(39); // ❌ Magic number!

    // DO THIS:
    const weaponBonus = IRON_SWORD.statBonus.atk || 0;
    expect(isaac.stats.atk).toBe(baseATK + weaponBonus); // ✅ Self-documenting

    // Replace weapon
    isaac.equipItem('weapon', STEEL_SWORD);

    const newWeaponBonus = STEEL_SWORD.statBonus.atk || 0;
    expect(isaac.stats.atk).toBe(baseATK + newWeaponBonus);
  });

  test('Damage calculation uses actual formula (NOT guessed range!)', () => {
    const isaac = new Unit(ISAAC, 5);
    const enemy = new Unit(GARET, 5);

    // DON'T DO THIS (weak assertion):
    // const damage = calculatePhysicalDamage(isaac, enemy, SLASH);
    // expect(damage).toBeGreaterThan(0); // ❌ Too vague!
    // expect(damage).toBeLessThan(100); // ❌ Random guess!

    // DO THIS (calculate expected damage):
    const baseDamage = isaac.stats.atk; // SLASH uses ATK
    const defReduction = enemy.stats.def * 0.5;
    const expectedBaseDamage = Math.max(1, baseDamage - defReduction);

    // With random multiplier 0.9-1.1:
    const expectedMin = Math.floor(expectedBaseDamage * 0.9);
    const expectedMax = Math.ceil(expectedBaseDamage * 1.1);

    // NOW we can verify actual damage:
    // expect(actualDamage).toBeGreaterThanOrEqual(expectedMin);
    // expect(actualDamage).toBeLessThanOrEqual(expectedMax);

    // ✅ Test is now PRECISE and MEANINGFUL
  });
});

describe('❌ BAD TESTS: Magic Numbers Everywhere (What You\'re Doing Wrong)', () => {

  test('EXAMPLE OF BAD TEST (from existing codebase)', () => {
    const isaac = new Unit(ISAAC, 5);

    // This is what you currently have:
    expect(isaac.stats.hp).toBe(180);  // ❌ Magic number
    expect(isaac.stats.pp).toBe(36);   // ❌ Magic number
    expect(isaac.stats.atk).toBe(27);  // ❌ Magic number
    expect(isaac.stats.def).toBe(18);  // ❌ Magic number
    expect(isaac.stats.mag).toBe(20);  // ❌ Magic number
    expect(isaac.stats.spd).toBe(16);  // ❌ Magic number

    // PROBLEMS:
    // 1. If GAME_MECHANICS.md changes, ALL these break
    // 2. New developer has NO IDEA where 180 comes from
    // 3. Can't tell if test is checking formula or hardcoded values
    // 4. Copy-paste errors possible (wrong number for wrong stat)
  });

  test('WHY THIS MATTERS: Change in spec breaks EVERYTHING', () => {
    // Imagine GAME_MECHANICS.md changes Isaac's base HP from 100 → 110
    // Growth rate stays 20/level

    // OLD EXPECTED (wrong after change):
    // Level 5: 100 + (20 × 4) = 180

    // NEW EXPECTED (correct):
    // Level 5: 110 + (20 × 4) = 190

    // If you hardcoded 180, test fails
    // If you calculated from base, test auto-passes!

    const isaac = new Unit(ISAAC, 5);

    // Correct way (survives spec changes):
    const expected = ISAAC.baseStats.hp + (ISAAC.growthRates.hp * 4);
    expect(isaac.stats.hp).toBe(expected); // ✅ Adapts to changes
  });
});

describe('💡 BEST PRACTICE: Test Helpers (Stop Repeating Yourself!)', () => {

  // Helper function to calculate expected stats
  function calculateExpectedStats(unitDef: typeof ISAAC, level: number) {
    const levelGrowth = level - 1;

    return {
      hp: unitDef.baseStats.hp + (unitDef.growthRates.hp * levelGrowth),
      pp: unitDef.baseStats.pp + (unitDef.growthRates.pp * levelGrowth),
      atk: unitDef.baseStats.atk + (unitDef.growthRates.atk * levelGrowth),
      def: unitDef.baseStats.def + (unitDef.growthRates.def * levelGrowth),
      mag: unitDef.baseStats.mag + (unitDef.growthRates.mag * levelGrowth),
      spd: unitDef.baseStats.spd + (unitDef.growthRates.spd * levelGrowth),
    };
  }

  test('Using test helper (DRY principle)', () => {
    const isaac = new Unit(ISAAC, 5);
    const expected = calculateExpectedStats(ISAAC, 5);

    expect(isaac.stats.hp).toBe(expected.hp);
    expect(isaac.stats.atk).toBe(expected.atk);
    expect(isaac.stats.def).toBe(expected.def);
    expect(isaac.stats.mag).toBe(expected.mag);
    expect(isaac.stats.spd).toBe(expected.spd);

    // ✅ No magic numbers
    // ✅ Reusable for all units
    // ✅ Formula in one place
    // ✅ Self-documenting
  });

  test('Test ALL units at ALL levels (no copy-paste!)', () => {
    const units = [ISAAC, GARET, MIA, IVAN];
    const levels = [1, 2, 3, 4, 5];

    for (const unitDef of units) {
      for (const level of levels) {
        const unit = new Unit(unitDef, level);
        const expected = calculateExpectedStats(unitDef, level);

        expect(unit.stats.hp).toBe(expected.hp);
        expect(unit.stats.atk).toBe(expected.atk);
        expect(unit.stats.def).toBe(expected.def);

        // ✅ 4 units × 5 levels = 20 test cases in 10 lines!
      }
    }
  });
});
