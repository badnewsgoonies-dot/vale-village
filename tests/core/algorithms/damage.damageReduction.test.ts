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
 * Phase 2: Damage Reduction Tests
 *
 * Tests the damageReduction status effect in the damage pipeline:
 * - Single reduction (30% → damage × 0.7)
 * - Stacking reductions (additive)
 * - Clamping at 100% (prevents negative damage)
 * - Applied AFTER elemental resistance
 * - Edge cases (0%, >100%)
 */

describe('Damage Phase 2 - Damage Reduction', () => {
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

  describe('Basic Damage Reduction', () => {
    test('no reduction status means no modification', () => {
      const baseDamage = 100;

      const defender = createTestUnit('defender', { def: 10 }, []);

      const modifiedDamage = applyDamageModifiers(baseDamage, 'Mars', defender);

      expect(modifiedDamage).toBe(baseDamage);
    });

    test('single reduction reduces damage (30% reduction)', () => {
      const baseDamage = 100;

      const defender = createTestUnit('defender', { def: 10 }, [
        {
          type: 'damageReduction',
          percent: 0.3,
          duration: 3,
        },
      ]);

      const modifiedDamage = applyDamageModifiers(baseDamage, 'Mars', defender);

      // 30% reduction → damage × 0.7
      expect(modifiedDamage).toBe(70);
    });

    test('50% reduction halves damage', () => {
      const baseDamage = 100;

      const defender = createTestUnit('defender', { def: 10 }, [
        {
          type: 'damageReduction',
          percent: 0.5,
          duration: 3,
        },
      ]);

      const modifiedDamage = applyDamageModifiers(baseDamage, 'Mars', defender);

      expect(modifiedDamage).toBe(50);
    });
  });

  describe('Stacking Reductions', () => {
    test('two reductions stack additively', () => {
      const baseDamage = 100;

      const defender = createTestUnit('defender', { def: 10 }, [
        {
          type: 'damageReduction',
          percent: 0.3,
          duration: 3,
        },
        {
          type: 'damageReduction',
          percent: 0.2,
          duration: 3,
        },
      ]);

      const modifiedDamage = applyDamageModifiers(baseDamage, 'Mars', defender);

      // Total reduction = 0.3 + 0.2 = 0.5 → damage × 0.5
      expect(modifiedDamage).toBe(50);
    });

    test('three reductions stack additively', () => {
      const baseDamage = 100;

      const defender = createTestUnit('defender', { def: 10 }, [
        {
          type: 'damageReduction',
          percent: 0.2,
          duration: 3,
        },
        {
          type: 'damageReduction',
          percent: 0.3,
          duration: 3,
        },
        {
          type: 'damageReduction',
          percent: 0.1,
          duration: 3,
        },
      ]);

      const modifiedDamage = applyDamageModifiers(baseDamage, 'Mars', defender);

      // Total reduction = 0.2 + 0.3 + 0.1 = 0.6 → damage × 0.4
      expect(modifiedDamage).toBe(40);
    });
  });

  describe('Clamping at 100%', () => {
    test('exactly 100% reduction results in 0 damage', () => {
      const baseDamage = 100;

      const defender = createTestUnit('defender', { def: 10 }, [
        {
          type: 'damageReduction',
          percent: 1.0,
          duration: 3,
        },
      ]);

      const modifiedDamage = applyDamageModifiers(baseDamage, 'Mars', defender);

      expect(modifiedDamage).toBe(0);
    });

    test('stacking beyond 100% is clamped to prevent negative damage', () => {
      const baseDamage = 100;

      const defender = createTestUnit('defender', { def: 10 }, [
        {
          type: 'damageReduction',
          percent: 0.7,
          duration: 3,
        },
        {
          type: 'damageReduction',
          percent: 0.6,
          duration: 3,
        },
      ]);

      const modifiedDamage = applyDamageModifiers(baseDamage, 'Mars', defender);

      // Total = 0.7 + 0.6 = 1.3, clamped to 1.0 → damage × 0 = 0
      expect(modifiedDamage).toBe(0);
    });

    test('extreme stacking (200% total) is clamped', () => {
      const baseDamage = 100;

      const defender = createTestUnit('defender', { def: 10 }, [
        {
          type: 'damageReduction',
          percent: 1.0,
          duration: 3,
        },
        {
          type: 'damageReduction',
          percent: 0.5,
          duration: 3,
        },
        {
          type: 'damageReduction',
          percent: 0.5,
          duration: 3,
        },
      ]);

      const modifiedDamage = applyDamageModifiers(baseDamage, 'Mars', defender);

      // Total = 2.0, clamped to 1.0 → damage = 0
      expect(modifiedDamage).toBe(0);
    });
  });

  describe('Combined with Elemental Resistance', () => {
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

    test('multiple resistances then multiple reductions', () => {
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
        {
          type: 'damageReduction',
          percent: 0.3,
          duration: 3,
        },
        {
          type: 'damageReduction',
          percent: 0.2,
          duration: 3,
        },
      ]);

      const modifiedDamage = applyDamageModifiers(baseDamage, 'Mars', defender);

      // After resistance (0.2 + 0.3 = 0.5): 100 × 0.5 = 50
      // After reduction (0.3 + 0.2 = 0.5): 50 × 0.5 = 25
      expect(modifiedDamage).toBe(25);
    });
  });

  describe('Edge Cases', () => {
    test('0% reduction has no effect', () => {
      const baseDamage = 100;

      const defender = createTestUnit('defender', { def: 10 }, [
        {
          type: 'damageReduction',
          percent: 0,
          duration: 3,
        },
      ]);

      const modifiedDamage = applyDamageModifiers(baseDamage, 'Mars', defender);

      expect(modifiedDamage).toBe(100);
    });

    test('99% reduction nearly eliminates damage', () => {
      const baseDamage = 100;

      const defender = createTestUnit('defender', { def: 10 }, [
        {
          type: 'damageReduction',
          percent: 0.99,
          duration: 3,
        },
      ]);

      const modifiedDamage = applyDamageModifiers(baseDamage, 'Mars', defender);

      expect(modifiedDamage).toBeCloseTo(1, 5); // 100 × 0.01 = 1 (with floating point tolerance)
    });

    test('fractional damage rounds correctly', () => {
      const baseDamage = 100;

      const defender = createTestUnit('defender', { def: 10 }, [
        {
          type: 'damageReduction',
          percent: 0.33,
          duration: 3,
        },
      ]);

      const modifiedDamage = applyDamageModifiers(baseDamage, 'Mars', defender);

      // 100 × 0.67 = 67
      expect(modifiedDamage).toBe(67);
    });
  });

  describe('Integration with Full Damage Calculation', () => {
    test('damage reduction integrated in psynergy damage', () => {
      const attacker = createTestUnit('attacker', { mag: 20 });
      const defender = createTestUnit('defender', { def: 10 }, [
        {
          type: 'damageReduction',
          percent: 0.5,
          duration: 3,
        },
      ]);
      const team = createTestTeam(attacker);

      const damage = calculatePsynergyDamage(attacker, defender, team, marsAbility);

      // Damage should be reduced by 50% compared to no reduction
      const defenderNoReduction = createTestUnit('defender2', { def: 10 }, []);
      const baseDamage = calculatePsynergyDamage(attacker, defenderNoReduction, team, marsAbility);

      // Should be approximately half (accounting for minimum damage clamping)
      expect(damage).toBeLessThan(baseDamage);
      expect(damage).toBeGreaterThan(0);

      // More precise check: should be roughly half
      const ratio = damage / baseDamage;
      expect(ratio).toBeGreaterThan(0.4);
      expect(ratio).toBeLessThan(0.6);
    });

    test('100% reduction results in minimum damage', () => {
      const attacker = createTestUnit('attacker', { mag: 20 });
      const defender = createTestUnit('defender', { def: 10 }, [
        {
          type: 'damageReduction',
          percent: 1.0,
          duration: 3,
        },
      ]);
      const team = createTestTeam(attacker);

      const damage = calculatePsynergyDamage(attacker, defender, team, marsAbility);

      // Should clamp to minimum damage (1) after modifiers result in 0
      expect(damage).toBe(1);
    });
  });
});
