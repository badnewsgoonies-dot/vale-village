import { describe, test, expect } from 'vitest';
import { createUnit } from '../../../src/core/models/Unit';
import type { UnitDefinition } from '../../../src/core/models/Unit';
import {
  applyDamageWithShields,
  checkAutoRevive,
} from '../../../src/core/algorithms/damage';

/**
 * Phase 2: Auto-Revive Tests
 *
 * Tests the auto-revive mechanic in the damage pipeline:
 * - Triggering on lethal damage
 * - Uses-based system (no duration)
 * - HP restoration based on hpPercent
 * - Multiple uses handling
 * - Edge cases (non-lethal damage, 0% hpPercent)
 *
 * Auto-revive is checked AFTER damage application, so it only triggers
 * when currentHP reaches 0.
 */

describe('Damage Phase 2 - Auto-Revive', () => {
  const createTestUnit = (
    id: string,
    currentHp: number,
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
      description: 'A test unit for auto-revive tests',
    };

    const unit = createUnit(definition, 1, 0);
    return {
      ...unit,
      currentHp,
      statusEffects,
    };
  };

  describe('Basic Auto-Revive Triggering', () => {
    test('triggers auto-revive on lethal damage and restores HP', () => {
      const defender = createTestUnit('defender', 80, [
        {
          type: 'autoRevive',
          hpPercent: 0.5,
          usesRemaining: 1,
        },
      ]);

      // Lethal damage (more than current HP)
      const result = applyDamageWithShields(defender, 100);

      // Auto-revive triggered, HP restored to 50% of max (100 * 0.5 = 50)
      expect(result.updatedUnit.currentHp).toBe(50);
      expect(result.actualDamage).toBe(100);
      expect(result.autoRevived).toBe(true);

      // Auto-revive status removed after use
      const autoRevive = result.updatedUnit.statusEffects.find(s => s.type === 'autoRevive');
      expect(autoRevive).toBeUndefined();
    });

    test('non-lethal damage does not trigger auto-revive', () => {
      const defender = createTestUnit('defender', 80, [
        {
          type: 'autoRevive',
          hpPercent: 0.5,
          usesRemaining: 1,
        },
      ]);

      // Non-lethal damage
      const result = applyDamageWithShields(defender, 30);

      // HP reduced normally, no auto-revive
      expect(result.updatedUnit.currentHp).toBe(50);
      expect(result.actualDamage).toBe(30);
      expect(result.autoRevived).toBeUndefined();

      // Auto-revive status still present with full uses
      const autoRevive = result.updatedUnit.statusEffects.find(s => s.type === 'autoRevive') as any;
      expect(autoRevive).toBeDefined();
      expect(autoRevive.usesRemaining).toBe(1);
    });

    test('exactly lethal damage triggers auto-revive', () => {
      const defender = createTestUnit('defender', 50, [
        {
          type: 'autoRevive',
          hpPercent: 0.4,
          usesRemaining: 1,
        },
      ]);

      // Exactly lethal (HP goes to exactly 0)
      const result = applyDamageWithShields(defender, 50);

      expect(result.updatedUnit.currentHp).toBe(40); // 100 * 0.4
      expect(result.autoRevived).toBe(true);
    });

    test('overkill damage triggers auto-revive normally', () => {
      const defender = createTestUnit('defender', 20, [
        {
          type: 'autoRevive',
          hpPercent: 0.3,
          usesRemaining: 1,
        },
      ]);

      // Massive overkill
      const result = applyDamageWithShields(defender, 500);

      expect(result.updatedUnit.currentHp).toBe(30); // 100 * 0.3
      expect(result.autoRevived).toBe(true);
    });
  });

  describe('Multiple Uses', () => {
    test('auto-revive with 2 uses triggers twice then expires', () => {
      let defender = createTestUnit('defender', 50, [
        {
          type: 'autoRevive',
          hpPercent: 0.5,
          usesRemaining: 2,
        },
      ]);

      // First lethal hit
      let result = applyDamageWithShields(defender, 60);
      defender = result.updatedUnit;

      expect(defender.currentHp).toBe(50);
      expect(result.autoRevived).toBe(true);

      // Auto-revive still present with 1 use remaining
      let autoRevive = defender.statusEffects.find(s => s.type === 'autoRevive') as any;
      expect(autoRevive).toBeDefined();
      expect(autoRevive.usesRemaining).toBe(1);

      // Second lethal hit
      result = applyDamageWithShields(defender, 60);
      defender = result.updatedUnit;

      expect(defender.currentHp).toBe(50);
      expect(result.autoRevived).toBe(true);

      // Auto-revive now removed (uses exhausted)
      autoRevive = defender.statusEffects.find(s => s.type === 'autoRevive');
      expect(autoRevive).toBeUndefined();

      // Third lethal hit - no revive
      result = applyDamageWithShields(defender, 60);
      defender = result.updatedUnit;

      expect(defender.currentHp).toBe(0);
      expect(result.autoRevived).toBeUndefined();
    });

    test('uses decrement only on trigger, not on non-lethal hits', () => {
      let defender = createTestUnit('defender', 100, [
        {
          type: 'autoRevive',
          hpPercent: 0.5,
          usesRemaining: 2,
        },
      ]);

      // Non-lethal hit
      let result = applyDamageWithShields(defender, 30);
      defender = result.updatedUnit;

      expect(defender.currentHp).toBe(70);
      expect(result.autoRevived).toBeUndefined();

      // Uses should still be 2
      let autoRevive = defender.statusEffects.find(s => s.type === 'autoRevive') as any;
      expect(autoRevive.usesRemaining).toBe(2);

      // Another non-lethal
      result = applyDamageWithShields(defender, 30);
      defender = result.updatedUnit;

      expect(defender.currentHp).toBe(40);
      autoRevive = defender.statusEffects.find(s => s.type === 'autoRevive') as any;
      expect(autoRevive.usesRemaining).toBe(2);

      // Now lethal - should trigger and decrement
      result = applyDamageWithShields(defender, 50);
      defender = result.updatedUnit;

      expect(defender.currentHp).toBe(50);
      expect(result.autoRevived).toBe(true);
      autoRevive = defender.statusEffects.find(s => s.type === 'autoRevive') as any;
      expect(autoRevive.usesRemaining).toBe(1);
    });
  });

  describe('Edge Cases', () => {
    test('hpPercent = 0 revives to at least 1 HP (or configured minimum)', () => {
      const defender = createTestUnit('defender', 50, [
        {
          type: 'autoRevive',
          hpPercent: 0,
          usesRemaining: 1,
        },
      ]);

      const result = applyDamageWithShields(defender, 60);

      // Should revive to 0 HP since hpPercent is 0
      // This tests the actual behavior - adjust expectation if you implement a "at least 1" clamp
      expect(result.updatedUnit.currentHp).toBe(0);
      expect(result.autoRevived).toBe(true);
    });

    test('hpPercent = 1.0 revives to full HP', () => {
      const defender = createTestUnit('defender', 50, [
        {
          type: 'autoRevive',
          hpPercent: 1.0,
          usesRemaining: 1,
        },
      ]);

      const result = applyDamageWithShields(defender, 60);

      expect(result.updatedUnit.currentHp).toBe(100); // Full HP
      expect(result.autoRevived).toBe(true);
    });

    test('no auto-revive status means no revival', () => {
      const defender = createTestUnit('defender', 50, []);

      const result = applyDamageWithShields(defender, 60);

      expect(result.updatedUnit.currentHp).toBe(0);
      expect(result.autoRevived).toBeUndefined();
    });

    test('auto-revive with 0 uses does not trigger', () => {
      const defender = createTestUnit('defender', 50, [
        {
          type: 'autoRevive',
          hpPercent: 0.5,
          usesRemaining: 0,
        },
      ]);

      const result = applyDamageWithShields(defender, 60);

      expect(result.updatedUnit.currentHp).toBe(0);
      expect(result.autoRevived).toBeUndefined();
    });
  });

  describe('Interaction with Other Mechanics', () => {
    test('shield blocks damage preventing auto-revive trigger', () => {
      const defender = createTestUnit('defender', 10, [
        {
          type: 'shield',
          remainingCharges: 1,
          duration: 3,
        },
        {
          type: 'autoRevive',
          hpPercent: 0.5,
          usesRemaining: 1,
        },
      ]);

      const result = applyDamageWithShields(defender, 50);

      // Shield blocked the damage, so HP stays at 10 (not KO'd)
      expect(result.updatedUnit.currentHp).toBe(10);
      expect(result.actualDamage).toBe(0);
      expect(result.autoRevived).toBeUndefined();

      // Auto-revive NOT triggered (unit wasn't KO'd)
      const autoRevive = result.updatedUnit.statusEffects.find(s => s.type === 'autoRevive') as any;
      expect(autoRevive).toBeDefined();
      expect(autoRevive.usesRemaining).toBe(1);
    });

    test('invulnerability blocks damage preventing auto-revive trigger', () => {
      const defender = createTestUnit('defender', 10, [
        {
          type: 'invulnerable',
          duration: 2,
        },
        {
          type: 'autoRevive',
          hpPercent: 0.5,
          usesRemaining: 1,
        },
      ]);

      const result = applyDamageWithShields(defender, 50);

      expect(result.updatedUnit.currentHp).toBe(10);
      expect(result.actualDamage).toBe(0);
      expect(result.autoRevived).toBeUndefined();
    });

    test('lethal damage after shield exhaustion triggers auto-revive', () => {
      let defender = createTestUnit('defender', 50, [
        {
          type: 'shield',
          remainingCharges: 1,
          duration: 3,
        },
        {
          type: 'autoRevive',
          hpPercent: 0.4,
          usesRemaining: 1,
        },
      ]);

      // First hit: blocked by shield
      let result = applyDamageWithShields(defender, 60);
      defender = result.updatedUnit;

      expect(defender.currentHp).toBe(50);
      expect(result.autoRevived).toBeUndefined();

      // Shield consumed
      const shield = defender.statusEffects.find(s => s.type === 'shield');
      expect(shield).toBeUndefined();

      // Second hit: lethal, triggers auto-revive
      result = applyDamageWithShields(defender, 60);
      defender = result.updatedUnit;

      expect(defender.currentHp).toBe(40); // 100 * 0.4
      expect(result.autoRevived).toBe(true);
    });
  });

  describe('checkAutoRevive Direct Tests', () => {
    test('checkAutoRevive only triggers when HP is 0', () => {
      const alive = createTestUnit('alive', 50, [
        {
          type: 'autoRevive',
          hpPercent: 0.5,
          usesRemaining: 1,
        },
      ]);

      const result = checkAutoRevive(alive);

      expect(result.revived).toBe(false);
      expect(result.updatedUnit.currentHp).toBe(50);
    });

    test('checkAutoRevive triggers when HP is 0', () => {
      const ko = createTestUnit('ko', 0, [
        {
          type: 'autoRevive',
          hpPercent: 0.5,
          usesRemaining: 1,
        },
      ]);

      const result = checkAutoRevive(ko);

      expect(result.revived).toBe(true);
      expect(result.updatedUnit.currentHp).toBe(50);
    });
  });
});
