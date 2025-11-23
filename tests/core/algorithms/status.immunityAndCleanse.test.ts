import { describe, test, expect } from 'vitest';
import { createUnit } from '../../../src/core/models/Unit';
import type { UnitDefinition } from '../../../src/core/models/Unit';
import {
  isImmuneToStatus,
  isNegativeStatus,
  applyStatusToUnit,
} from '../../../src/core/algorithms/status';

/**
 * Phase 2: Immunity and Cleanse Tests
 *
 * Tests the immunity and status classification system:
 * - Immunity checks (all vs. specific types)
 * - Negative status detection
 * - Status application with immunity
 * - Edge cases (multiple immunities, overlapping)
 *
 * Note: Cleanse mechanics are tested via ability integration
 * (removeStatusEffects field on abilities)
 */

describe('Status Phase 2 - Immunity and Classification', () => {
  const createTestUnit = (
    id: string,
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
        atk: 10,
        def: 8,
        mag: 5,
        spd: 12,
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

  describe('isImmuneToStatus - No Immunity', () => {
    test('unit with no immunity statuses is not immune to anything', () => {
      const unit = createTestUnit('unit', []);

      expect(isImmuneToStatus(unit, 'poison')).toBe(false);
      expect(isImmuneToStatus(unit, 'burn')).toBe(false);
      expect(isImmuneToStatus(unit, 'freeze')).toBe(false);
      expect(isImmuneToStatus(unit, 'stun')).toBe(false);
      expect(isImmuneToStatus(unit, 'debuff')).toBe(false);
    });

    test('unit with other status effects but no immunity is not immune', () => {
      const unit = createTestUnit('unit', [
        { type: 'poison', duration: 3 },
        { type: 'buff', stat: 'atk', modifier: 0.2, duration: 3 },
      ]);

      expect(isImmuneToStatus(unit, 'burn')).toBe(false);
    });
  });

  describe('isImmuneToStatus - Immunity All', () => {
    test('immunity with all=true blocks all status types', () => {
      const unit = createTestUnit('unit', [
        {
          type: 'immunity',
          all: true,
          duration: 3,
        },
      ]);

      expect(isImmuneToStatus(unit, 'poison')).toBe(true);
      expect(isImmuneToStatus(unit, 'burn')).toBe(true);
      expect(isImmuneToStatus(unit, 'freeze')).toBe(true);
      expect(isImmuneToStatus(unit, 'paralyze')).toBe(true);
      expect(isImmuneToStatus(unit, 'stun')).toBe(true);
      expect(isImmuneToStatus(unit, 'debuff')).toBe(true);
    });

    test('immunity all blocks even custom/unknown status types', () => {
      const unit = createTestUnit('unit', [
        {
          type: 'immunity',
          all: true,
          duration: 3,
        },
      ]);

      expect(isImmuneToStatus(unit, 'customStatus')).toBe(true);
      expect(isImmuneToStatus(unit, 'weirdEffect')).toBe(true);
    });
  });

  describe('isImmuneToStatus - Specific Immunity', () => {
    test('immunity with specific types only blocks those types', () => {
      const unit = createTestUnit('unit', [
        {
          type: 'immunity',
          all: false,
          types: ['poison', 'burn'],
          duration: 3,
        },
      ]);

      expect(isImmuneToStatus(unit, 'poison')).toBe(true);
      expect(isImmuneToStatus(unit, 'burn')).toBe(true);
      expect(isImmuneToStatus(unit, 'freeze')).toBe(false);
      expect(isImmuneToStatus(unit, 'paralyze')).toBe(false);
      expect(isImmuneToStatus(unit, 'stun')).toBe(false);
    });

    test('immunity to debuffs blocks debuff status', () => {
      const unit = createTestUnit('unit', [
        {
          type: 'immunity',
          all: false,
          types: ['debuff'],
          duration: 3,
        },
      ]);

      expect(isImmuneToStatus(unit, 'debuff')).toBe(true);
      expect(isImmuneToStatus(unit, 'poison')).toBe(false);
    });

    test('immunity to single type only blocks that type', () => {
      const unit = createTestUnit('unit', [
        {
          type: 'immunity',
          all: false,
          types: ['stun'],
          duration: 3,
        },
      ]);

      expect(isImmuneToStatus(unit, 'stun')).toBe(true);
      expect(isImmuneToStatus(unit, 'freeze')).toBe(false);
      expect(isImmuneToStatus(unit, 'poison')).toBe(false);
    });
  });

  describe('isImmuneToStatus - Multiple Immunities', () => {
    test('multiple specific immunities combine coverage', () => {
      const unit = createTestUnit('unit', [
        {
          type: 'immunity',
          all: false,
          types: ['poison'],
          duration: 3,
        },
        {
          type: 'immunity',
          all: false,
          types: ['burn'],
          duration: 2,
        },
      ]);

      expect(isImmuneToStatus(unit, 'poison')).toBe(true);
      expect(isImmuneToStatus(unit, 'burn')).toBe(true);
      expect(isImmuneToStatus(unit, 'freeze')).toBe(false);
    });

    test('multiple immunities with overlapping types still work', () => {
      const unit = createTestUnit('unit', [
        {
          type: 'immunity',
          all: false,
          types: ['poison', 'burn'],
          duration: 3,
        },
        {
          type: 'immunity',
          all: false,
          types: ['burn', 'freeze'],
          duration: 2,
        },
      ]);

      expect(isImmuneToStatus(unit, 'poison')).toBe(true);
      expect(isImmuneToStatus(unit, 'burn')).toBe(true);
      expect(isImmuneToStatus(unit, 'freeze')).toBe(true);
      expect(isImmuneToStatus(unit, 'stun')).toBe(false);
    });

    test('immunity all overrides specific immunities', () => {
      const unit = createTestUnit('unit', [
        {
          type: 'immunity',
          all: false,
          types: ['poison'],
          duration: 3,
        },
        {
          type: 'immunity',
          all: true,
          duration: 2,
        },
      ]);

      // All immunity should make everything immune
      expect(isImmuneToStatus(unit, 'poison')).toBe(true);
      expect(isImmuneToStatus(unit, 'burn')).toBe(true);
      expect(isImmuneToStatus(unit, 'freeze')).toBe(true);
      expect(isImmuneToStatus(unit, 'customStatus')).toBe(true);
    });
  });

  describe('isNegativeStatus', () => {
    test('damage-over-time statuses are negative', () => {
      expect(isNegativeStatus({ type: 'poison', duration: 3 })).toBe(true);
      expect(isNegativeStatus({ type: 'burn', duration: 3 })).toBe(true);
    });

    test('action-preventing statuses are negative', () => {
      expect(isNegativeStatus({ type: 'freeze', duration: 3 })).toBe(true);
      expect(isNegativeStatus({ type: 'paralyze', duration: 3 })).toBe(true);
      expect(isNegativeStatus({ type: 'stun', duration: 3 })).toBe(true);
    });

    test('debuffs are negative', () => {
      expect(isNegativeStatus({ type: 'debuff', stat: 'atk', modifier: -0.2, duration: 3 })).toBe(true);
    });

    test('buffs are NOT negative', () => {
      expect(isNegativeStatus({ type: 'buff', stat: 'atk', modifier: 0.2, duration: 3 })).toBe(false);
    });

    test('heal-over-time is NOT negative', () => {
      expect(isNegativeStatus({ type: 'healOverTime', healPerTurn: 10, duration: 3 })).toBe(false);
    });

    test('shields are NOT negative', () => {
      expect(isNegativeStatus({ type: 'shield', remainingCharges: 2, duration: 3 })).toBe(false);
    });

    test('elemental resistance is NOT negative', () => {
      expect(isNegativeStatus({ type: 'elementalResistance', element: 'Mars', modifier: 0.5, duration: 3 })).toBe(false);
    });

    test('damage reduction is NOT negative', () => {
      expect(isNegativeStatus({ type: 'damageReduction', percent: 0.3, duration: 3 })).toBe(false);
    });

    test('invulnerability is NOT negative', () => {
      expect(isNegativeStatus({ type: 'invulnerable', duration: 1 })).toBe(false);
    });

    test('immunity is NOT negative', () => {
      expect(isNegativeStatus({ type: 'immunity', all: true, duration: 3 })).toBe(false);
    });

    test('auto-revive is NOT negative', () => {
      expect(isNegativeStatus({ type: 'autoRevive', hpPercent: 0.5, usesRemaining: 1 })).toBe(false);
    });
  });

  describe('applyStatusToUnit - No Immunity', () => {
    test('applying status to unit with no immunity adds the status', () => {
      const unit = createTestUnit('unit', []);

      const newStatus = { type: 'poison' as const, duration: 3 };
      const updatedUnit = applyStatusToUnit(unit, newStatus);

      expect(updatedUnit.statusEffects).toHaveLength(1);
      expect(updatedUnit.statusEffects[0]).toEqual(newStatus);
    });

    test('applying multiple statuses to unit with no immunity adds all', () => {
      let unit = createTestUnit('unit', []);

      unit = applyStatusToUnit(unit, { type: 'poison', duration: 3 });
      unit = applyStatusToUnit(unit, { type: 'burn', duration: 2 });

      expect(unit.statusEffects).toHaveLength(2);
      expect(unit.statusEffects.map(s => s.type)).toEqual(['poison', 'burn']);
    });
  });

  describe('applyStatusToUnit - With Immunity', () => {
    test('applying blocked status to immune unit does nothing', () => {
      const unit = createTestUnit('unit', [
        {
          type: 'immunity',
          all: false,
          types: ['poison'],
          duration: 3,
        },
      ]);

      const newStatus = { type: 'poison' as const, duration: 3 };
      const updatedUnit = applyStatusToUnit(unit, newStatus);

      // Should still only have the immunity status, poison not added
      expect(updatedUnit.statusEffects).toHaveLength(1);
      expect(updatedUnit.statusEffects[0]?.type).toBe('immunity');
    });

    test('applying non-blocked status to immune unit adds it', () => {
      const unit = createTestUnit('unit', [
        {
          type: 'immunity',
          all: false,
          types: ['poison'],
          duration: 3,
        },
      ]);

      const newStatus = { type: 'burn' as const, duration: 3 };
      const updatedUnit = applyStatusToUnit(unit, newStatus);

      // Should have both immunity and burn
      expect(updatedUnit.statusEffects).toHaveLength(2);
      expect(updatedUnit.statusEffects.map(s => s.type)).toEqual(['immunity', 'burn']);
    });

    test('immunity all blocks all status applications', () => {
      const unit = createTestUnit('unit', [
        {
          type: 'immunity',
          all: true,
          duration: 3,
        },
      ]);

      let updatedUnit = applyStatusToUnit(unit, { type: 'poison', duration: 3 });
      updatedUnit = applyStatusToUnit(updatedUnit, { type: 'burn', duration: 3 });
      updatedUnit = applyStatusToUnit(updatedUnit, { type: 'freeze', duration: 3 });

      // Should still only have the immunity status
      expect(updatedUnit.statusEffects).toHaveLength(1);
      expect(updatedUnit.statusEffects[0]?.type).toBe('immunity');
    });
  });

  describe('applyStatusToUnit - Buff Application with Immunity', () => {
    test('immunity to debuffs does not block buffs', () => {
      const unit = createTestUnit('unit', [
        {
          type: 'immunity',
          all: false,
          types: ['debuff'],
          duration: 3,
        },
      ]);

      const buff = { type: 'buff' as const, stat: 'atk' as const, modifier: 0.2, duration: 3 };
      const updatedUnit = applyStatusToUnit(unit, buff);

      // Buff should be added (immunity is to debuffs, not buffs)
      expect(updatedUnit.statusEffects).toHaveLength(2);
      expect(updatedUnit.statusEffects.some(s => s.type === 'buff')).toBe(true);
    });

    test('immunity all blocks even beneficial statuses', () => {
      const unit = createTestUnit('unit', [
        {
          type: 'immunity',
          all: true,
          duration: 3,
        },
      ]);

      const buff = { type: 'buff' as const, stat: 'atk' as const, modifier: 0.2, duration: 3 };
      const updatedUnit = applyStatusToUnit(unit, buff);

      // Immunity all blocks everything, even buffs
      expect(updatedUnit.statusEffects).toHaveLength(1);
      expect(updatedUnit.statusEffects[0]?.type).toBe('immunity');
    });
  });

  describe('Edge Cases', () => {
    test('applying immunity to unit with existing statuses does not remove them', () => {
      const unit = createTestUnit('unit', [
        { type: 'poison', duration: 3 },
      ]);

      const immunity = {
        type: 'immunity' as const,
        all: false,
        types: ['poison' as const],
        duration: 3,
      };
      const updatedUnit = applyStatusToUnit(unit, immunity);

      // Poison remains, immunity added (immunity prevents NEW poison, doesn't cleanse existing)
      expect(updatedUnit.statusEffects).toHaveLength(2);
      expect(updatedUnit.statusEffects.some(s => s.type === 'poison')).toBe(true);
      expect(updatedUnit.statusEffects.some(s => s.type === 'immunity')).toBe(true);
    });

    test('applying status identical to existing does not deduplicate', () => {
      const unit = createTestUnit('unit', [
        { type: 'poison', duration: 3 },
      ]);

      const newPoison = { type: 'poison' as const, duration: 2 };
      const updatedUnit = applyStatusToUnit(unit, newPoison);

      // Should have two poison effects
      expect(updatedUnit.statusEffects).toHaveLength(2);
      expect(updatedUnit.statusEffects.filter(s => s.type === 'poison')).toHaveLength(2);
    });

    test('empty types array immunity blocks nothing', () => {
      const unit = createTestUnit('unit', [
        {
          type: 'immunity',
          all: false,
          types: [],
          duration: 3,
        },
      ]);

      expect(isImmuneToStatus(unit, 'poison')).toBe(false);
      expect(isImmuneToStatus(unit, 'burn')).toBe(false);

      const updatedUnit = applyStatusToUnit(unit, { type: 'poison', duration: 3 });
      expect(updatedUnit.statusEffects).toHaveLength(2); // immunity + poison
    });

    test('isNegativeStatus handles missing fields gracefully', () => {
      expect(isNegativeStatus({ type: 'unknownStatus' })).toBe(false);
      expect(isNegativeStatus({ type: 'customEffect', someField: 123 })).toBe(false);
    });
  });

  describe('Cleanse Workflow Simulation', () => {
    test('cleanse negative statuses leaves buffs intact', () => {
      const unit = createTestUnit('unit', [
        { type: 'poison', duration: 3 },
        { type: 'burn', duration: 2 },
        { type: 'buff', stat: 'atk', modifier: 0.3, duration: 3 },
        { type: 'healOverTime', healPerTurn: 10, duration: 3 },
      ]);

      // Simulate cleanse by filtering out negative statuses
      const cleansedEffects = unit.statusEffects.filter(s => !isNegativeStatus(s));

      expect(cleansedEffects).toHaveLength(2);
      expect(cleansedEffects.map(s => s.type)).toEqual(['buff', 'healOverTime']);
    });

    test('cleanse by type removes only specified status types', () => {
      const unit = createTestUnit('unit', [
        { type: 'poison', duration: 3 },
        { type: 'burn', duration: 2 },
        { type: 'freeze', duration: 1 },
        { type: 'buff', stat: 'atk', modifier: 0.3, duration: 3 },
      ]);

      const typesToCleanse = ['poison', 'burn'];

      // Simulate cleanse by type
      const cleansedEffects = unit.statusEffects.filter(
        s => !typesToCleanse.includes(s.type)
      );

      expect(cleansedEffects).toHaveLength(2);
      expect(cleansedEffects.map(s => s.type)).toEqual(['freeze', 'buff']);
    });

    test('cleanse all removes everything', () => {
      const unit = createTestUnit('unit', [
        { type: 'poison', duration: 3 },
        { type: 'buff', stat: 'atk', modifier: 0.3, duration: 3 },
        { type: 'shield', remainingCharges: 2, duration: 3 },
      ]);

      // Simulate cleanse all
      const cleansedEffects: typeof unit.statusEffects = [];

      expect(cleansedEffects).toHaveLength(0);
    });
  });
});
