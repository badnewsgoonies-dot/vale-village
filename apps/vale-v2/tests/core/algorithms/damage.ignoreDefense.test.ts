import { describe, test, expect } from 'vitest';
import { createUnit } from '../../../src/core/models/Unit';
import { createTeam } from '../../../src/core/models/Team';
import type { UnitDefinition } from '../../../src/core/models/Unit';
import {
  calculatePhysicalDamage,
  calculatePsynergyDamage,
} from '../../../src/core/algorithms/damage';
import type { Ability } from '../../../src/data/schemas/AbilitySchema';

/**
 * Phase 2: Ignore Defense Tests
 *
 * Tests the ignoreDefensePercent field on abilities:
 * - 0% = normal defense calculation (default)
 * - 50% = half of defender's defense ignored
 * - 100% = full defense ignored (armor-piercing)
 * - Clamping at [0, 1] for safety
 * - Works for both physical and psynergy damage
 */

describe('Damage Phase 2 - Ignore Defense', () => {
  const createTestUnit = (
    id: string,
    stats: { atk?: number; def?: number; mag?: number; spd?: number }
  ): ReturnType<typeof createUnit> => {
    const definition: UnitDefinition = {
      id,
      name: `Test Unit ${id}`,
      element: 'Venus',
      role: 'Balanced Warrior',
      baseStats: {
        hp: 100,
        pp: 20,
        atk: stats.atk || 10,
        def: stats.def || 8,
        mag: stats.mag || 5,
        spd: stats.spd || 12,
      },
      growthRates: {
        hp: 20,
        pp: 5,
        atk: 3,
        def: 2,
        mag: 2,
        spd: 1,
      },
      abilities: [],
      manaContribution: 1,
      description: 'A test unit',
    };

    return createUnit(definition, 1, 0);
  };

  // Helper to create 4-unit team (required for damage calculations)
  const createTestTeam = (mainUnit: ReturnType<typeof createUnit>) => {
    const dummies = Array.from({ length: 3 }, (_, i) =>
      createTestUnit(`dummy-${i}`, {})
    );
    return createTeam([mainUnit, ...dummies], []);
  };

  const basePhysicalAbility: Ability = {
    id: 'sword-strike',
    name: 'Sword Strike',
    type: 'physical',
    basePower: 20,
    targets: 'single-enemy',
    unlockLevel: 1,
    description: 'Basic physical attack',
    manaCost: 0,
  };

  const basePsynergyAbility: Ability = {
    id: 'fire-blast',
    name: 'Fire Blast',
    type: 'psynergy',
    element: 'Mars',
    basePower: 50,
    targets: 'single-enemy',
    unlockLevel: 1,
    description: 'Mars elemental psynergy',
    manaCost: 3,
  };

  describe('Physical Damage - Ignore Defense', () => {
    test('no ignoreDefensePercent means full defense applies', () => {
      const attacker = createTestUnit('attacker', { atk: 30 });
      const defender = createTestUnit('defender', { def: 20 });
      const team = createTestTeam(attacker);

      const ability: Ability = {
        ...basePhysicalAbility,
        // ignoreDefensePercent undefined (default)
      };

      const damage = calculatePhysicalDamage(attacker, defender, team, ability);

      // Formula: basePower + ATK - (DEF × 0.5)
      // 20 + 30 - (20 × 0.5) = 50 - 10 = 40
      expect(damage).toBe(40);
    });

    test('0% ignore defense is same as undefined', () => {
      const attacker = createTestUnit('attacker', { atk: 30 });
      const defender = createTestUnit('defender', { def: 20 });
      const team = createTestTeam(attacker);

      const ability: Ability = {
        ...basePhysicalAbility,
        ignoreDefensePercent: 0,
      };

      const damage = calculatePhysicalDamage(attacker, defender, team, ability);

      expect(damage).toBe(40); // Same as no ignore
    });

    test('50% ignore defense applies half of defense', () => {
      const attacker = createTestUnit('attacker', { atk: 30 });
      const defender = createTestUnit('defender', { def: 20 });
      const team = createTestTeam(attacker);

      const ability: Ability = {
        ...basePhysicalAbility,
        ignoreDefensePercent: 0.5,
      };

      const damage = calculatePhysicalDamage(attacker, defender, team, ability);

      // Effective DEF = 20 × (1 - 0.5) = 10
      // 20 + 30 - (10 × 0.5) = 50 - 5 = 45
      expect(damage).toBe(45);
    });

    test('100% ignore defense ignores all defense (armor-piercing)', () => {
      const attacker = createTestUnit('attacker', { atk: 30 });
      const defender = createTestUnit('defender', { def: 20 });
      const team = createTestTeam(attacker);

      const ability: Ability = {
        ...basePhysicalAbility,
        ignoreDefensePercent: 1.0,
      };

      const damage = calculatePhysicalDamage(attacker, defender, team, ability);

      // Effective DEF = 20 × (1 - 1.0) = 0
      // 20 + 30 - (0 × 0.5) = 50 - 0 = 50
      expect(damage).toBe(50);
    });

    test('75% ignore defense applies only 25% of defense', () => {
      const attacker = createTestUnit('attacker', { atk: 30 });
      const defender = createTestUnit('defender', { def: 20 });
      const team = createTestTeam(attacker);

      const ability: Ability = {
        ...basePhysicalAbility,
        ignoreDefensePercent: 0.75,
      };

      const damage = calculatePhysicalDamage(attacker, defender, team, ability);

      // Effective DEF = 20 × (1 - 0.75) = 5
      // 20 + 30 - (5 × 0.5) = 50 - 2.5 = 47.5 → floor(47.5) = 47
      expect(damage).toBe(47);
    });
  });

  describe('Psynergy Damage - Ignore Defense', () => {
    test('no ignoreDefensePercent means full defense applies', () => {
      const attacker = createTestUnit('attacker', { mag: 25 });
      const defender = createTestUnit('defender', { def: 20 });
      const team = createTestTeam(attacker);

      const ability: Ability = {
        ...basePsynergyAbility,
        element: 'Neutral', // Avoid element modifier
        // ignoreDefensePercent undefined (default)
      };

      const damage = calculatePsynergyDamage(attacker, defender, team, ability);

      // Formula: (basePower + MAG - (DEF × 0.3)) × elementModifier
      // (50 + 25 - (20 × 0.3)) × 1.0 = (75 - 6) × 1.0 = 69
      expect(damage).toBe(69);
    });

    test('50% ignore defense applies half of defense', () => {
      const attacker = createTestUnit('attacker', { mag: 25 });
      const defender = createTestUnit('defender', { def: 20 });
      const team = createTestTeam(attacker);

      const ability: Ability = {
        ...basePsynergyAbility,
        element: 'Neutral',
        ignoreDefensePercent: 0.5,
      };

      const damage = calculatePsynergyDamage(attacker, defender, team, ability);

      // Effective DEF = 20 × (1 - 0.5) = 10
      // (50 + 25 - (10 × 0.3)) × 1.0 = (75 - 3) × 1.0 = 72
      expect(damage).toBe(72);
    });

    test('100% ignore defense ignores all defense', () => {
      const attacker = createTestUnit('attacker', { mag: 25 });
      const defender = createTestUnit('defender', { def: 20 });
      const team = createTestTeam(attacker);

      const ability: Ability = {
        ...basePsynergyAbility,
        element: 'Neutral',
        ignoreDefensePercent: 1.0,
      };

      const damage = calculatePsynergyDamage(attacker, defender, team, ability);

      // Effective DEF = 20 × (1 - 1.0) = 0
      // (50 + 25 - (0 × 0.3)) × 1.0 = 75
      expect(damage).toBe(75);
    });
  });

  describe('Edge Cases', () => {
    test('very high defense becomes negligible with 100% ignore', () => {
      const attacker = createTestUnit('attacker', { atk: 30 });
      const defender = createTestUnit('defender', { def: 100 }); // Very high defense
      const team = createTestTeam(attacker);

      const normalAbility: Ability = {
        ...basePhysicalAbility,
        ignoreDefensePercent: 0,
      };

      const armorPiercingAbility: Ability = {
        ...basePhysicalAbility,
        ignoreDefensePercent: 1.0,
      };

      const normalDamage = calculatePhysicalDamage(attacker, defender, team, normalAbility);
      const armorPiercingDamage = calculatePhysicalDamage(attacker, defender, team, armorPiercingAbility);

      // Normal: 20 + 30 - (100 × 0.5) = 50 - 50 = 0 → clamp to 1
      expect(normalDamage).toBe(1);

      // Armor-piercing: 20 + 30 - (0 × 0.5) = 50
      expect(armorPiercingDamage).toBe(50);
    });

    test('fractional ignore defense percentages work correctly', () => {
      const attacker = createTestUnit('attacker', { atk: 30 });
      const defender = createTestUnit('defender', { def: 20 });
      const team = createTestTeam(attacker);

      const ability: Ability = {
        ...basePhysicalAbility,
        ignoreDefensePercent: 0.33,
      };

      const damage = calculatePhysicalDamage(attacker, defender, team, ability);

      // Effective DEF = 20 × (1 - 0.33) = 20 × 0.67 = 13.4
      // 20 + 30 - (13.4 × 0.5) = 50 - 6.7 = 43.3 → floor(43.3) = 43
      expect(damage).toBe(43);
    });

    test('defensive clamping prevents values > 1.0', () => {
      const attacker = createTestUnit('attacker', { atk: 30 });
      const defender = createTestUnit('defender', { def: 20 });
      const team = createTestTeam(attacker);

      // In production, schema validation prevents this, but defensive clamping is still present
      const ability: Ability = {
        ...basePhysicalAbility,
        ignoreDefensePercent: 1.5 as any, // Invalid, should be clamped
      };

      const damage = calculatePhysicalDamage(attacker, defender, team, ability);

      // Should clamp 1.5 to 1.0 internally
      // Effective DEF = 20 × (1 - 1.0) = 0
      // 20 + 30 - (0 × 0.5) = 50
      expect(damage).toBe(50);
    });

    test('defensive clamping prevents negative values', () => {
      const attacker = createTestUnit('attacker', { atk: 30 });
      const defender = createTestUnit('defender', { def: 20 });
      const team = createTestTeam(attacker);

      const ability: Ability = {
        ...basePhysicalAbility,
        ignoreDefensePercent: -0.5 as any, // Invalid, should be clamped
      };

      const damage = calculatePhysicalDamage(attacker, defender, team, ability);

      // Should clamp -0.5 to 0.0 internally
      // Effective DEF = 20 × (1 - 0.0) = 20
      // 20 + 30 - (20 × 0.5) = 50 - 10 = 40
      expect(damage).toBe(40);
    });
  });

  describe('Comparison Tests', () => {
    test('ignoring more defense always results in higher damage', () => {
      const attacker = createTestUnit('attacker', { atk: 30 });
      const defender = createTestUnit('defender', { def: 20 });
      const team = createTestTeam(attacker);

      const ability0: Ability = { ...basePhysicalAbility, ignoreDefensePercent: 0 };
      const ability25: Ability = { ...basePhysicalAbility, ignoreDefensePercent: 0.25 };
      const ability50: Ability = { ...basePhysicalAbility, ignoreDefensePercent: 0.5 };
      const ability75: Ability = { ...basePhysicalAbility, ignoreDefensePercent: 0.75 };
      const ability100: Ability = { ...basePhysicalAbility, ignoreDefensePercent: 1.0 };

      const damage0 = calculatePhysicalDamage(attacker, defender, team, ability0);
      const damage25 = calculatePhysicalDamage(attacker, defender, team, ability25);
      const damage50 = calculatePhysicalDamage(attacker, defender, team, ability50);
      const damage75 = calculatePhysicalDamage(attacker, defender, team, ability75);
      const damage100 = calculatePhysicalDamage(attacker, defender, team, ability100);

      // Damage should monotonically increase
      expect(damage25).toBeGreaterThan(damage0);
      expect(damage50).toBeGreaterThan(damage25);
      expect(damage75).toBeGreaterThan(damage50);
      expect(damage100).toBeGreaterThan(damage75);
    });

    test('ignore defense works with element advantage', () => {
      const attacker = createTestUnit('attacker', { mag: 25 });
      attacker.element = 'Mars';
      const defender = createTestUnit('defender', { def: 20 });
      defender.element = 'Venus';
      const team = createTestTeam(attacker);

      const normalAbility: Ability = {
        ...basePsynergyAbility,
        element: 'Mars',
        ignoreDefensePercent: 0,
      };

      const armorPiercingAbility: Ability = {
        ...basePsynergyAbility,
        element: 'Mars',
        ignoreDefensePercent: 1.0,
      };

      const normalDamage = calculatePsynergyDamage(attacker, defender, team, normalAbility);
      const armorPiercingDamage = calculatePsynergyDamage(attacker, defender, team, armorPiercingAbility);

      // Both get element advantage (1.5x)
      // Normal: (50 + 25 - 6) × 1.5 = 69 × 1.5 = 103.5 → 103
      // Armor-piercing: (50 + 25 - 0) × 1.5 = 75 × 1.5 = 112.5 → 112

      expect(normalDamage).toBe(103);
      expect(armorPiercingDamage).toBe(112);
    });
  });

  describe('Integration with Status Effects', () => {
    test('ignore defense works with damage reduction', () => {
      const attacker = createTestUnit('attacker', { atk: 30 });
      const defender = createTestUnit('defender', { def: 20 });
      defender.statusEffects.push({
        type: 'damageReduction',
        percent: 0.5,
        duration: 3,
      });
      const team = createTestTeam(attacker);

      const armorPiercingAbility: Ability = {
        ...basePhysicalAbility,
        ignoreDefensePercent: 1.0,
      };

      const damage = calculatePhysicalDamage(attacker, defender, team, armorPiercingAbility);

      // Base damage (ignoring defense): 20 + 30 - 0 = 50
      // After damage reduction (50%): 50 × 0.5 = 25
      expect(damage).toBe(25);
    });

    test('ignore defense does not bypass elemental resistance', () => {
      const attacker = createTestUnit('attacker', { mag: 25 });
      const defender = createTestUnit('defender', { def: 20 });
      defender.statusEffects.push({
        type: 'elementalResistance',
        element: 'Mars',
        modifier: 0.5,
        duration: 3,
      });
      const team = createTestTeam(attacker);

      const armorPiercingAbility: Ability = {
        ...basePsynergyAbility,
        element: 'Mars',
        ignoreDefensePercent: 1.0,
      };

      const damage = calculatePsynergyDamage(attacker, defender, team, armorPiercingAbility);

      // Base damage (ignoring defense): (50 + 25 - 0) × 1.5 = 112.5 (Mars vs Venus advantage)
      // After elemental resistance (0.5 modifier): 112.5 × 0.5 = 56.25 → 56
      expect(damage).toBe(56);
    });
  });
});
