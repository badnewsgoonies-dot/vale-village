import { describe, test, expect } from 'vitest';
import { createUnit } from '../../../src/core/models/Unit';
import { createTeam } from '../../../src/core/models/Team';
import type { UnitDefinition } from '../../../src/core/models/Unit';
import {
  calculatePsynergyDamage,
  applyDamageModifiers,
} from '../../../src/core/algorithms/damage';
import type { Ability } from '../../../src/data/schemas/AbilitySchema';

/**
 * Phase 2: Elemental Resistance Tests
 *
 * Tests the elementalResistance status effect in the damage pipeline:
 * - Convention: factor = 1 - modifier
 * - modifier > 0 = resistance (reduces damage)
 * - modifier < 0 = weakness (increases damage)
 * - Stacking multiple resistances
 * - Element matching
 * - Combined with damage reduction
 */

describe('Damage Phase 2 - Elemental Resistance', () => {
  const createTestUnit = (
    id: string,
    stats: { atk?: number; def?: number; mag?: number; spd?: number },
    statusEffects: any[] = []
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

    const unit = createUnit(definition, 1, 0);
    return {
      ...unit,
      statusEffects,
    };
  };

  // Helper to create 4-unit team (required for damage calculations)
  const createTestTeam = (mainUnit: ReturnType<typeof createUnit>) => {
    const dummies = Array.from({ length: 3 }, (_, i) =>
      createTestUnit(`dummy-${i}`, {})
    );
    return createTeam([mainUnit, ...dummies], []);
  };

  const marsAbility: Ability = {
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

  const jupiterAbility: Ability = {
    id: 'wind-slash',
    name: 'Wind Slash',
    type: 'psynergy',
    element: 'Jupiter',
    basePower: 50,
    targets: 'single-enemy',
    unlockLevel: 1,
    description: 'Jupiter elemental psynergy',
    manaCost: 3,
  };

  describe('Basic Elemental Resistance', () => {
    test('no resistance status means no modification', () => {
      const attacker = createTestUnit('attacker', { mag: 20 });
      const defender = createTestUnit('defender', { def: 10 }, []);
      const team = createTestTeam(attacker);

      const baseDamage = calculatePsynergyDamage(attacker, defender, team, marsAbility);

      // Apply modifiers with no resistance statuses
      const modifiedDamage = applyDamageModifiers(baseDamage, marsAbility.element, defender);

      expect(modifiedDamage).toBe(baseDamage);
    });

    test('single resistance reduces damage (positive modifier)', () => {
      const baseDamage = 100;

      const defender = createTestUnit('defender', { def: 10 }, [
        {
          type: 'elementalResistance',
          element: 'Mars',
          modifier: 0.4,
          duration: 3,
        },
      ]);

      const modifiedDamage = applyDamageModifiers(baseDamage, 'Mars', defender);

      // factor = 1 - 0.4 = 0.6 → damage × 0.6
      expect(modifiedDamage).toBe(60);
    });

    test('single weakness increases damage (negative modifier)', () => {
      const baseDamage = 100;

      const defender = createTestUnit('defender', { def: 10 }, [
        {
          type: 'elementalResistance',
          element: 'Mars',
          modifier: -0.2,
          duration: 3,
        },
      ]);

      const modifiedDamage = applyDamageModifiers(baseDamage, 'Mars', defender);

      // factor = 1 - (-0.2) = 1.2 → damage × 1.2
      expect(modifiedDamage).toBe(120);
    });
  });

  describe('Stacking Resistances', () => {
    test('two resistances to same element stack additively', () => {
      const baseDamage = 100;

      const defender = createTestUnit('defender', { def: 10 }, [
        {
          type: 'elementalResistance',
          element: 'Mars',
          modifier: 0.2,
          duration: 3,
        },
        {
          type: 'elementalResistance',
          element: 'Mars',
          modifier: 0.3,
          duration: 3,
        },
      ]);

      const modifiedDamage = applyDamageModifiers(baseDamage, 'Mars', defender);

      // Total modifier = 0.2 + 0.3 = 0.5
      // factor = 1 - 0.5 = 0.5 → damage × 0.5
      expect(modifiedDamage).toBe(50);
    });

    test('resistance and weakness to same element cancel partially', () => {
      const baseDamage = 100;

      const defender = createTestUnit('defender', { def: 10 }, [
        {
          type: 'elementalResistance',
          element: 'Mars',
          modifier: 0.4,
          duration: 3,
        },
        {
          type: 'elementalResistance',
          element: 'Mars',
          modifier: -0.2,
          duration: 3,
        },
      ]);

      const modifiedDamage = applyDamageModifiers(baseDamage, 'Mars', defender);

      // Total modifier = 0.4 + (-0.2) = 0.2
      // factor = 1 - 0.2 = 0.8 → damage × 0.8
      expect(modifiedDamage).toBe(80);
    });
  });

  describe('Element Matching', () => {
    test('non-matching element resistance is ignored', () => {
      const baseDamage = 100;

      const defender = createTestUnit('defender', { def: 10 }, [
        {
          type: 'elementalResistance',
          element: 'Jupiter',
          modifier: 0.5,
          duration: 3,
        },
      ]);

      // Ability is Mars element, resistance is Jupiter
      const modifiedDamage = applyDamageModifiers(baseDamage, 'Mars', defender);

      expect(modifiedDamage).toBe(baseDamage);
    });

    test('only matching element resistance applies', () => {
      const baseDamage = 100;

      const defender = createTestUnit('defender', { def: 10 }, [
        {
          type: 'elementalResistance',
          element: 'Mars',
          modifier: 0.4,
          duration: 3,
        },
        {
          type: 'elementalResistance',
          element: 'Jupiter',
          modifier: 0.5,
          duration: 3,
        },
        {
          type: 'elementalResistance',
          element: 'Mercury',
          modifier: 0.3,
          duration: 3,
        },
      ]);

      // Mars ability should only use Mars resistance
      const modifiedDamage = applyDamageModifiers(baseDamage, 'Mars', defender);

      expect(modifiedDamage).toBe(60); // Only 0.4 resist applies
    });

    test('neutral element ignores all resistances', () => {
      const baseDamage = 100;

      const defender = createTestUnit('defender', { def: 10 }, [
        {
          type: 'elementalResistance',
          element: 'Mars',
          modifier: 0.5,
          duration: 3,
        },
      ]);

      // Neutral element bypasses elemental resistance
      const modifiedDamage = applyDamageModifiers(baseDamage, 'Neutral', defender);

      expect(modifiedDamage).toBe(baseDamage);
    });

    test('undefined element bypasses elemental resistance', () => {
      const baseDamage = 100;

      const defender = createTestUnit('defender', { def: 10 }, [
        {
          type: 'elementalResistance',
          element: 'Mars',
          modifier: 0.5,
          duration: 3,
        },
      ]);

      const modifiedDamage = applyDamageModifiers(baseDamage, undefined, defender);

      expect(modifiedDamage).toBe(baseDamage);
    });
  });

  describe('Combined with Damage Reduction', () => {
    test('elemental resistance applies before damage reduction', () => {
      const baseDamage = 100;

      const defender = createTestUnit('defender', { def: 10 }, [
        {
          type: 'elementalResistance',
          element: 'Mars',
          modifier: 0.4,
          duration: 3,
        },
        {
          type: 'damageReduction',
          percent: 0.5,
          duration: 3,
        },
      ]);

      const modifiedDamage = applyDamageModifiers(baseDamage, 'Mars', defender);

      // Pipeline order: resistance → reduction
      // After resistance (0.4): 100 × 0.6 = 60
      // After reduction (0.5): 60 × 0.5 = 30
      expect(modifiedDamage).toBe(30);
    });

    test('weakness then damage reduction', () => {
      const baseDamage = 100;

      const defender = createTestUnit('defender', { def: 10 }, [
        {
          type: 'elementalResistance',
          element: 'Mars',
          modifier: -0.5,
          duration: 3,
        },
        {
          type: 'damageReduction',
          percent: 0.2,
          duration: 3,
        },
      ]);

      const modifiedDamage = applyDamageModifiers(baseDamage, 'Mars', defender);

      // After weakness (-0.5): 100 × 1.5 = 150
      // After reduction (0.2): 150 × 0.8 = 120
      expect(modifiedDamage).toBe(120);
    });
  });

  describe('Edge Cases', () => {
    test('extreme positive resistance (>= 1.0) heavily reduces damage', () => {
      const baseDamage = 100;

      const defender = createTestUnit('defender', { def: 10 }, [
        {
          type: 'elementalResistance',
          element: 'Mars',
          modifier: 1.0,
          duration: 3,
        },
      ]);

      const modifiedDamage = applyDamageModifiers(baseDamage, 'Mars', defender);

      // factor = 1 - 1.0 = 0 → damage × 0 = 0
      expect(modifiedDamage).toBe(0);
    });

    test('extreme negative resistance (weakness) significantly increases damage', () => {
      const baseDamage = 100;

      const defender = createTestUnit('defender', { def: 10 }, [
        {
          type: 'elementalResistance',
          element: 'Mars',
          modifier: -1.0,
          duration: 3,
        },
      ]);

      const modifiedDamage = applyDamageModifiers(baseDamage, 'Mars', defender);

      // factor = 1 - (-1.0) = 2.0 → damage × 2.0 = 200
      expect(modifiedDamage).toBe(200);
    });

    test('stacking to > 1.0 resistance can result in negative damage factor', () => {
      const baseDamage = 100;

      const defender = createTestUnit('defender', { def: 10 }, [
        {
          type: 'elementalResistance',
          element: 'Mars',
          modifier: 0.8,
          duration: 3,
        },
        {
          type: 'elementalResistance',
          element: 'Mars',
          modifier: 0.5,
          duration: 3,
        },
      ]);

      const modifiedDamage = applyDamageModifiers(baseDamage, 'Mars', defender);

      // Total modifier = 0.8 + 0.5 = 1.3
      // factor = 1 - 1.3 = -0.3 → damage × -0.3 = -30
      // This would result in negative damage if not clamped at minimum damage layer
      expect(modifiedDamage).toBeCloseTo(-30, 5);
    });
  });

  describe('Integration with Full Damage Calculation', () => {
    test('elemental resistance integrated in psynergy damage', () => {
      const attacker = createTestUnit('attacker', { mag: 20 });
      const defender = createTestUnit('defender', { def: 10 }, [
        {
          type: 'elementalResistance',
          element: 'Mars',
          modifier: 0.5,
          duration: 3,
        },
      ]);
      const team = createTestTeam(attacker);

      const damage = calculatePsynergyDamage(attacker, defender, team, marsAbility);

      // Damage should be reduced by 50% compared to no resistance
      const defenderNoResist = createTestUnit('defender2', { def: 10 }, []);
      const baseDamage = calculatePsynergyDamage(attacker, defenderNoResist, team, marsAbility);

      // Should be approximately half (accounting for minimum damage clamping)
      expect(damage).toBeLessThan(baseDamage);
      expect(damage).toBeGreaterThan(0);
    });
  });
});
