import { describe, test, expect } from 'vitest';
import { applyDamageWithShields } from '@/core/algorithms/damage';
import { createUnit, calculateMaxHp } from '@/core/models/Unit';
import { makePRNG } from '@/core/random/prng';
import type { Unit } from '@/core/models/Unit';

/**
 * Auto-Revive Layering Tests (Phase 2)
 *
 * Tests complex layering of multiple Phase 2 defensive mechanics with auto-revive.
 *
 * Scenario:
 * - Unit has:
 *   - Exhausted shield (0 charges, should be removed)
 *   - Active damage reduction (0.3)
 *   - Active elemental resistance (Venus, 0.25)
 *   - Active immunity (all negative statuses)
 *   - Auto-revive (hpPercent: 0.5, usesRemaining: 1)
 * - Lethal hit (damage > currentHp after DR/resist)
 * - Verify:
 *   - Revived HP = floor(maxHp × 0.5)
 *   - DR/resist/immunity statuses retained
 *   - Exhausted shield removed
 *   - Auto-revive status removed (usesRemaining = 0)
 */

describe('Auto-Revive with Complex Layering (Phase 2)', () => {
  const rng = makePRNG(7);

  test('auto-revive with exhausted shield + DR + resist + immunity', () => {
    // Create unit with multiple defensive layers
    const definition: import('@/data/schemas/UnitSchema').UnitDefinition = {
      id: 'defender',
      name: 'Defender',
      element: 'Venus',
      role: 'Tank',
      baseStats: { hp: 100, pp: 20, atk: 10, def: 20, mag: 10, spd: 10 },
      growthRates: { hp: 15, pp: 3, atk: 1, def: 3, mag: 1, spd: 1 },
      abilities: [],
      manaContribution: 1,
    };
    const unit = createUnit(definition, 10);

    // Set low HP to guarantee KO
    unit.currentHp = 20;

    // Add complex status layering
    unit.statusEffects = [
      // Exhausted shield (should be removed after damage)
      {
        type: 'shield',
        remainingCharges: 0,
        duration: 2,
      },
      // Active damage reduction (should be retained after revive)
      {
        type: 'damageReduction',
        percent: 0.3,
        duration: 3,
      },
      // Active elemental resistance (should be retained after revive)
      {
        type: 'elementalResistance',
        element: 'Venus',
        modifier: 0.25,
        duration: 3,
      },
      // Active immunity (should be retained after revive)
      {
        type: 'immunity',
        all: true,
        duration: 2,
      },
      // Auto-revive (will trigger, then be removed)
      {
        type: 'autoRevive',
        hpPercent: 0.5,
        usesRemaining: 1,
      },
    ];

    const initialHp = unit.currentHp;
    const maxHp = calculateMaxHp(unit);

    // Calculate lethal damage (more than current HP)
    // Note: This damage would be reduced by DR (0.3) in real combat
    // For this test, we simulate the final damage value after reductions
    const lethalDamage = 50; // More than currentHp (20)

    // Apply damage (should trigger auto-revive)
    const result = applyDamageWithShields(unit, lethalDamage);

    // Verify auto-revive triggered
    expect(result.autoRevived).toBe(true);

    // Verify revived HP
    const expectedRevivedHp = Math.floor(maxHp * 0.5);
    expect(result.updatedUnit.currentHp).toBe(expectedRevivedHp);

    // Verify exhausted shield was removed
    const shieldAfter = result.updatedUnit.statusEffects.find(s => s.type === 'shield');
    expect(shieldAfter).toBeUndefined();

    // Verify DR status retained
    const drAfter = result.updatedUnit.statusEffects.find(s => s.type === 'damageReduction');
    expect(drAfter).toBeDefined();
    if (drAfter && drAfter.type === 'damageReduction') {
      expect(drAfter.percent).toBe(0.3);
      expect(drAfter.duration).toBe(3);
    }

    // Verify elemental resistance retained
    const resistAfter = result.updatedUnit.statusEffects.find(s => s.type === 'elementalResistance');
    expect(resistAfter).toBeDefined();
    if (resistAfter && resistAfter.type === 'elementalResistance') {
      expect(resistAfter.element).toBe('Venus');
      expect(resistAfter.modifier).toBe(0.25);
      expect(resistAfter.duration).toBe(3);
    }

    // Verify immunity retained
    const immunityAfter = result.updatedUnit.statusEffects.find(s => s.type === 'immunity');
    expect(immunityAfter).toBeDefined();
    if (immunityAfter && immunityAfter.type === 'immunity') {
      expect(immunityAfter.all).toBe(true);
      expect(immunityAfter.duration).toBe(2);
    }

    // Verify auto-revive removed (usesRemaining decremented to 0)
    const autoReviveAfter = result.updatedUnit.statusEffects.find(s => s.type === 'autoRevive');
    expect(autoReviveAfter).toBeUndefined();

    // Verify exactly 3 statuses remain (DR, resist, immunity)
    expect(result.updatedUnit.statusEffects).toHaveLength(3);
  });

  test('auto-revive does not trigger on non-lethal damage', () => {
    const definition: import('@/data/schemas/UnitSchema').UnitDefinition = {
      id: 'defender',
      name: 'Defender',
      element: 'Venus',
      role: 'Tank',
      baseStats: { hp: 100, pp: 20, atk: 10, def: 20, mag: 10, spd: 10 },
      growthRates: { hp: 15, pp: 3, atk: 1, def: 3, mag: 1, spd: 1 },
      abilities: [],
      manaContribution: 1,
    };
    const unit = createUnit(definition, 10);

    unit.currentHp = 50;

    unit.statusEffects = [
      {
        type: 'autoRevive',
        hpPercent: 0.5,
        usesRemaining: 1,
      },
    ];

    // Non-lethal damage (less than current HP)
    const damage = 30;

    const result = applyDamageWithShields(unit, damage);

    // Auto-revive should NOT trigger
    expect(result.autoRevived).toBeFalsy();
    expect(result.updatedUnit.currentHp).toBe(50 - 30);

    // Auto-revive status should still exist
    const autoReviveAfter = result.updatedUnit.statusEffects.find(s => s.type === 'autoRevive');
    expect(autoReviveAfter).toBeDefined();
    if (autoReviveAfter && autoReviveAfter.type === 'autoRevive') {
      expect(autoReviveAfter.usesRemaining).toBe(1); // Unchanged
    }
  });

  test('auto-revive with usesRemaining = 0 does not trigger', () => {
    const definition: import('@/data/schemas/UnitSchema').UnitDefinition = {
      id: 'defender',
      name: 'Defender',
      element: 'Venus',
      role: 'Tank',
      baseStats: { hp: 100, pp: 20, atk: 10, def: 20, mag: 10, spd: 10 },
      growthRates: { hp: 15, pp: 3, atk: 1, def: 3, mag: 1, spd: 1 },
      abilities: [],
      manaContribution: 1,
    };
    const unit = createUnit(definition, 10);

    unit.currentHp = 20;

    unit.statusEffects = [
      {
        type: 'autoRevive',
        hpPercent: 0.5,
        usesRemaining: 0, // Already exhausted
      },
    ];

    const lethalDamage = 50;

    const result = applyDamageWithShields(unit, lethalDamage);

    // Auto-revive should NOT trigger (usesRemaining = 0)
    expect(result.autoRevived).toBeFalsy();
    expect(result.updatedUnit.currentHp).toBe(0); // KO'd

    // Exhausted auto-revive should be removed
    const autoReviveAfter = result.updatedUnit.statusEffects.find(s => s.type === 'autoRevive');
    expect(autoReviveAfter).toBeUndefined();
  });

  test('auto-revive hpPercent edge cases', () => {
    const definition: import('@/data/schemas/UnitSchema').UnitDefinition = {
      id: 'defender',
      name: 'Defender',
      element: 'Venus',
      role: 'Tank',
      baseStats: { hp: 100, pp: 20, atk: 10, def: 20, mag: 10, spd: 10 },
      growthRates: { hp: 15, pp: 3, atk: 1, def: 3, mag: 1, spd: 1 },
      abilities: [],
      manaContribution: 1,
    };
    const unit = createUnit(definition, 10);

    unit.currentHp = 10;

    // Test various hpPercent values
    const testCases = [
      { hpPercent: 0.1, expected: 10 },  // 10% of 100
      { hpPercent: 0.25, expected: 25 }, // 25% of 100
      { hpPercent: 0.5, expected: 50 },  // 50% of 100
      { hpPercent: 0.75, expected: 75 }, // 75% of 100
      { hpPercent: 1.0, expected: 100 }, // 100% of 100 (full revive)
    ];

    for (const testCase of testCases) {
      const testUnit = { ...unit };
      testUnit.statusEffects = [
        {
          type: 'autoRevive',
          hpPercent: testCase.hpPercent,
          usesRemaining: 1,
        },
      ];

      const result = applyDamageWithShields(testUnit, 50);
      const expectedHp = Math.floor(calculateMaxHp(testUnit) * testCase.hpPercent);

      expect(result.autoRevived).toBe(true);
      expect(result.updatedUnit.currentHp).toBe(expectedHp);
    }
  });

  test('multiple auto-revive statuses use first one only', () => {
    const definition: import('@/data/schemas/UnitSchema').UnitDefinition = {
      id: 'defender',
      name: 'Defender',
      element: 'Venus',
      role: 'Tank',
      baseStats: { hp: 100, pp: 20, atk: 10, def: 20, mag: 10, spd: 10 },
      growthRates: { hp: 15, pp: 3, atk: 1, def: 3, mag: 1, spd: 1 },
      abilities: [],
      manaContribution: 1,
    };
    const unit = createUnit(definition, 10);

    unit.currentHp = 20;

    // Multiple auto-revive statuses (unusual but possible)
    unit.statusEffects = [
      {
        type: 'autoRevive',
        hpPercent: 0.5,
        usesRemaining: 1,
      },
      {
        type: 'autoRevive',
        hpPercent: 0.9,
        usesRemaining: 1,
      },
    ];

    const lethalDamage = 50;

    const result = applyDamageWithShields(unit, lethalDamage);

    // Only first auto-revive should trigger
    expect(result.autoRevived).toBe(true);
    const expectedHp = Math.floor(calculateMaxHp(unit) * 0.5); // First one (0.5)
    expect(result.updatedUnit.currentHp).toBe(expectedHp);

    // First auto-revive should be removed, second should remain
    const autoReviveStatuses = result.updatedUnit.statusEffects.filter(s => s.type === 'autoRevive');
    expect(autoReviveStatuses).toHaveLength(1);
    if (autoReviveStatuses[0] && autoReviveStatuses[0].type === 'autoRevive') {
      expect(autoReviveStatuses[0].hpPercent).toBe(0.9); // Second one remains
    }
  });
});
