import { describe, test, expect } from 'vitest';
import { applyStatusToUnit, processStatusEffectTick, isImmuneToStatus } from '@/core/algorithms/status';
import { createUnit } from '@/core/models/Unit';
import { makePRNG } from '@/core/random/prng';
import type { Unit } from '@/core/models/Unit';

/**
 * Immunity Replacement Tests (Phase 2)
 *
 * Tests immunity status replacement behavior when multiple immunity-granting
 * abilities are cast in sequence.
 *
 * Scenarios:
 * 1. Specific immunity (burn/poison) replaced by all immunity
 * 2. All immunity replaced by narrower immunity (freeze only)
 * 3. Immunity expiration doesn't affect other statuses
 * 4. Attempt to apply blocked status immediately after replacement → blocked
 *
 * Expected behavior:
 * - Only ONE immunity status exists after casting multiple immunity abilities
 * - Latest immunity replaces previous immunity
 * - Other statuses (buffs, DR, resist) unaffected by immunity replacement
 */

describe('Immunity Replacement (Phase 2)', () => {
  const rng = makePRNG(999);

  // Helper: Create test unit
  function createTestUnit(id: string, element: 'Venus' | 'Mars' | 'Mercury' | 'Jupiter' = 'Mercury'): Unit {
    const definition: import('@/data/schemas/UnitSchema').UnitDefinition = {
      id,
      name: `${id} Unit`,
      element,
      role: 'Balanced',
      baseStats: { hp: 100, pp: 20, atk: 10, def: 10, mag: 10, spd: 10 },
      growthRates: { hp: 12, pp: 3, atk: 2, def: 2, mag: 2, spd: 1 },
      abilities: [],
      manaContribution: 1,
    };
    return createUnit(definition, 10);
  }

  test('specific immunity replaced by all immunity', () => {
    const unit = createTestUnit('defender', 'Mercury');

    // Initial state: No immunity
    expect(unit.statusEffects).toHaveLength(0);

    // Cast ability granting specific immunity (burn/poison, 2 turns)
    unit.statusEffects = [
      {
        type: 'immunity',
        all: false,
        types: ['burn', 'poison'],
        duration: 2,
      },
    ];

    // Verify burn/poison blocked
    expect(isImmuneToStatus(unit, 'burn')).toBe(true);
    expect(isImmuneToStatus(unit, 'poison')).toBe(true);
    expect(isImmuneToStatus(unit, 'freeze')).toBe(false); // Not immune to freeze

    // Cast second ability granting all immunity (1 turn)
    // This should replace the existing specific immunity
    const updatedUnit = applyStatusToUnit(unit, {
      type: 'immunity',
      all: true,
      duration: 1,
    });

    // Verify only ONE immunity status exists
    const immunityStatuses = updatedUnit.statusEffects.filter(s => s.type === 'immunity');
    expect(immunityStatuses).toHaveLength(1);

    // Verify it's the new all immunity
    const immunity = immunityStatuses[0];
    if (immunity && immunity.type === 'immunity') {
      expect(immunity.all).toBe(true);
      expect(immunity.duration).toBe(1);
    }

    // Verify all statuses now blocked
    expect(isImmuneToStatus(updatedUnit, 'burn')).toBe(true);
    expect(isImmuneToStatus(updatedUnit, 'poison')).toBe(true);
    expect(isImmuneToStatus(updatedUnit, 'freeze')).toBe(true); // Now immune to freeze
    expect(isImmuneToStatus(updatedUnit, 'paralyze')).toBe(true);
    expect(isImmuneToStatus(updatedUnit, 'stun')).toBe(true);
  });

  test('all immunity replaced by narrower immunity', () => {
    const unit = createTestUnit('defender', 'Mercury');

    // Initial: All immunity (2 turns)
    unit.statusEffects = [
      {
        type: 'immunity',
        all: true,
        duration: 2,
      },
    ];

    // Verify all blocked
    expect(isImmuneToStatus(unit, 'burn')).toBe(true);
    expect(isImmuneToStatus(unit, 'freeze')).toBe(true);
    expect(isImmuneToStatus(unit, 'paralyze')).toBe(true);

    // Cast second ability granting specific immunity (freeze only, 3 turns)
    const updatedUnit = applyStatusToUnit(unit, {
      type: 'immunity',
      all: false,
      types: ['freeze'],
      duration: 3,
    });

    // Verify only ONE immunity status
    const immunityStatuses = updatedUnit.statusEffects.filter(s => s.type === 'immunity');
    expect(immunityStatuses).toHaveLength(1);

    // Verify it's the new specific immunity
    const immunity = immunityStatuses[0];
    if (immunity && immunity.type === 'immunity') {
      expect(immunity.all).toBe(false);
      expect(immunity.types).toEqual(['freeze']);
      expect(immunity.duration).toBe(3);
    }

    // Verify only freeze blocked now
    expect(isImmuneToStatus(updatedUnit, 'freeze')).toBe(true);
    expect(isImmuneToStatus(updatedUnit, 'burn')).toBe(false); // No longer immune
    expect(isImmuneToStatus(updatedUnit, 'paralyze')).toBe(false);
  });

  test('immunity expiration doesn\'t affect other statuses', () => {
    const unit = createTestUnit('defender', 'Venus');

    // Initial: Immunity + buff + DR
    unit.statusEffects = [
      {
        type: 'immunity',
        all: true,
        duration: 1, // Will expire after 1 tick
      },
      {
        type: 'buff',
        stat: 'def',
        modifier: 10,
        duration: 3,
      },
      {
        type: 'damageReduction',
        percent: 0.3,
        duration: 3,
      },
    ];

    expect(unit.statusEffects).toHaveLength(3);

    // Tick statuses (immunity expires)
    const updatedUnit = processStatusEffectTick(unit, rng);

    // Verify immunity removed
    const immunityAfter = updatedUnit.statusEffects.find(s => s.type === 'immunity');
    expect(immunityAfter).toBeUndefined();

    // Verify other statuses retained with decremented duration
    const buffAfter = updatedUnit.statusEffects.find(s => s.type === 'buff');
    const drAfter = updatedUnit.statusEffects.find(s => s.type === 'damageReduction');

    expect(buffAfter).toBeDefined();
    expect(drAfter).toBeDefined();

    if (buffAfter && buffAfter.type === 'buff') {
      expect(buffAfter.stat).toBe('def');
      expect(buffAfter.modifier).toBe(10);
      expect(buffAfter.duration).toBe(2); // Decremented
    }

    if (drAfter && drAfter.type === 'damageReduction') {
      expect(drAfter.percent).toBe(0.3);
      expect(drAfter.duration).toBe(2); // Decremented
    }

    // Verify exactly 2 statuses remain
    expect(updatedUnit.statusEffects).toHaveLength(2);
  });

  test('blocked status cannot be applied while immune', () => {
    const unit = createTestUnit('defender', 'Mercury');

    // Grant immunity to burn
    unit.statusEffects = [
      {
        type: 'immunity',
        all: false,
        types: ['burn'],
        duration: 2,
      },
    ];

    // Attempt to apply burn (should be blocked)
    const updatedUnit = applyStatusToUnit(unit, {
      type: 'burn',
      damagePerTurn: 10,
      duration: 3,
    });

    // Verify burn NOT added
    const burnStatus = updatedUnit.statusEffects.find(s => s.type === 'burn');
    expect(burnStatus).toBeUndefined();

    // Verify immunity still present
    const immunity = updatedUnit.statusEffects.find(s => s.type === 'immunity');
    expect(immunity).toBeDefined();

    // Attempt to apply poison (NOT in immunity types, should succeed)
    const updatedUnit2 = applyStatusToUnit(updatedUnit, {
      type: 'poison',
      damagePerTurn: 8,
      duration: 3,
    });

    // Verify poison WAS added
    const poisonStatus = updatedUnit2.statusEffects.find(s => s.type === 'poison');
    expect(poisonStatus).toBeDefined();
  });

  test('immunity replacement preserves other statuses', () => {
    const unit = createTestUnit('defender', 'Venus');

    // Initial: Specific immunity + buff + elementalResistance
    unit.statusEffects = [
      {
        type: 'immunity',
        all: false,
        types: ['burn'],
        duration: 2,
      },
      {
        type: 'buff',
        stat: 'atk',
        modifier: 8,
        duration: 3,
      },
      {
        type: 'elementalResistance',
        element: 'Mars',
        modifier: 0.3,
        duration: 3,
      },
    ];

    expect(unit.statusEffects).toHaveLength(3);

    // Replace immunity
    const updatedUnit = applyStatusToUnit(unit, {
      type: 'immunity',
      all: true,
      duration: 1,
    });

    // Verify total count unchanged (replaced, not added)
    expect(updatedUnit.statusEffects).toHaveLength(3);

    // Verify new immunity present
    const immunity = updatedUnit.statusEffects.find(s => s.type === 'immunity');
    expect(immunity).toBeDefined();
    if (immunity && immunity.type === 'immunity') {
      expect(immunity.all).toBe(true);
      expect(immunity.duration).toBe(1);
    }

    // Verify other statuses unaffected
    const buff = updatedUnit.statusEffects.find(s => s.type === 'buff');
    const resist = updatedUnit.statusEffects.find(s => s.type === 'elementalResistance');

    expect(buff).toBeDefined();
    expect(resist).toBeDefined();

    if (buff && buff.type === 'buff') {
      expect(buff.stat).toBe('atk');
      expect(buff.modifier).toBe(8);
      expect(buff.duration).toBe(3);
    }

    if (resist && resist.type === 'elementalResistance') {
      expect(resist.element).toBe('Mars');
      expect(resist.modifier).toBe(0.3);
      expect(resist.duration).toBe(3);
    }
  });

  test('multiple immunity replacements in sequence', () => {
    const unit = createTestUnit('defender', 'Jupiter');

    // Sequence of immunity grants
    const immunitySequence = [
      { all: false, types: ['burn'], duration: 1 },
      { all: false, types: ['burn', 'poison'], duration: 2 },
      { all: true, duration: 3 },
      { all: false, types: ['freeze'], duration: 1 },
    ];

    let currentUnit = unit;

    for (const immunity of immunitySequence) {
      currentUnit = applyStatusToUnit(currentUnit, {
        type: 'immunity',
        ...immunity,
      });

      // After each application, verify only ONE immunity exists
      const immunityStatuses = currentUnit.statusEffects.filter(s => s.type === 'immunity');
      expect(immunityStatuses).toHaveLength(1);
    }

    // Final immunity should be freeze only
    const finalImmunity = currentUnit.statusEffects.find(s => s.type === 'immunity');
    expect(finalImmunity).toBeDefined();
    if (finalImmunity && finalImmunity.type === 'immunity') {
      expect(finalImmunity.all).toBe(false);
      expect(finalImmunity.types).toEqual(['freeze']);
      expect(finalImmunity.duration).toBe(1);
    }

    // Verify correct immunities
    expect(isImmuneToStatus(currentUnit, 'freeze')).toBe(true);
    expect(isImmuneToStatus(currentUnit, 'burn')).toBe(false);
    expect(isImmuneToStatus(currentUnit, 'poison')).toBe(false);
  });
});
