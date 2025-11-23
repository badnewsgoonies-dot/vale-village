import { describe, test, expect } from 'vitest';
import { createUnit } from '../../../src/core/models/Unit';
import type { UnitDefinition } from '../../../src/core/models/Unit';
import {
  applyDamageWithShields,
  isInvulnerable,
  hasShieldCharges,
} from '../../../src/core/algorithms/damage';

/**
 * Phase 2: Shield & Invulnerability Tests
 *
 * Tests the damage pipeline for:
 * - Shield blocking (hit-based, charges consumed)
 * - Invulnerability (blocks damage without consuming shields)
 * - Auto-revive triggering (tested separately in damage.autoRevive.test.ts)
 *
 * Pipeline order:
 * 1. Check invulnerability (blocks damage, does NOT consume shield)
 * 2. Check shield (blocks damage, consumes 1 charge)
 * 3. Apply damage if not blocked
 * 4. Check for auto-revive if unit is KO'd
 */

describe('Damage Phase 2 - Shields & Invulnerability', () => {
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
      description: 'A test unit for shield/invuln tests',
    };

    const unit = createUnit(definition, 1, 0);
    return {
      ...unit,
      currentHp,
      statusEffects,
    };
  };

  describe('Shield Mechanics', () => {
    test('single-hit consumes one shield charge and blocks damage', () => {
      const defender = createTestUnit('defender', 100, [
        {
          type: 'shield',
          remainingCharges: 1,
          duration: 3,
        },
      ]);

      const result = applyDamageWithShields(defender, 50);

      // HP unchanged because shield blocked the hit
      expect(result.updatedUnit.currentHp).toBe(100);

      // Actual damage dealt is 0 (blocked)
      expect(result.actualDamage).toBe(0);

      // Shield consumed and removed when remainingCharges reaches 0
      const shield = result.updatedUnit.statusEffects.find(s => s.type === 'shield');
      expect(shield).toBeUndefined();
    });

    test('multi-hit consumes one shield charge per hit', () => {
      let defender = createTestUnit('defender', 100, [
        {
          type: 'shield',
          remainingCharges: 3,
          duration: 3,
        },
      ]);

      const damagePerHit = 10;

      // Hit 1: shield blocks, charges go 3 -> 2
      let result = applyDamageWithShields(defender, damagePerHit);
      defender = result.updatedUnit;
      expect(defender.currentHp).toBe(100);
      expect(result.actualDamage).toBe(0);
      let shield = defender.statusEffects.find(s => s.type === 'shield') as any;
      expect(shield).toBeDefined();
      expect(shield.remainingCharges).toBe(2);

      // Hit 2: shield blocks, charges go 2 -> 1
      result = applyDamageWithShields(defender, damagePerHit);
      defender = result.updatedUnit;
      expect(defender.currentHp).toBe(100);
      expect(result.actualDamage).toBe(0);
      shield = defender.statusEffects.find(s => s.type === 'shield') as any;
      expect(shield).toBeDefined();
      expect(shield.remainingCharges).toBe(1);

      // Hit 3: shield blocks, charges go 1 -> 0 and shield removed
      result = applyDamageWithShields(defender, damagePerHit);
      defender = result.updatedUnit;
      expect(defender.currentHp).toBe(100);
      expect(result.actualDamage).toBe(0);
      shield = defender.statusEffects.find(s => s.type === 'shield');
      expect(shield).toBeUndefined();

      // Hit 4: no shield left, damage applies
      result = applyDamageWithShields(defender, damagePerHit);
      defender = result.updatedUnit;
      expect(defender.currentHp).toBe(90);
      expect(result.actualDamage).toBe(10);
      expect(defender.statusEffects.find(s => s.type === 'shield')).toBeUndefined();
    });

    test('shield with 0 remainingCharges acts as no-op (damage applies)', () => {
      const defender = createTestUnit('defender', 100, [
        {
          type: 'shield',
          remainingCharges: 0,
          duration: 3,
        },
      ]);

      const result = applyDamageWithShields(defender, 50);

      // HP should be reduced because shield has no charges
      expect(result.updatedUnit.currentHp).toBe(50);
      expect(result.actualDamage).toBe(50);

      // Shield should be removed/cleaned up
      const shield = result.updatedUnit.statusEffects.find(s => s.type === 'shield');
      expect(shield).toBeUndefined();
    });

    test('hasShieldCharges correctly identifies shields with charges', () => {
      const withCharges = createTestUnit('with', 100, [
        { type: 'shield', remainingCharges: 2, duration: 3 },
      ]);
      expect(hasShieldCharges(withCharges)).toBe(true);

      const withoutCharges = createTestUnit('without', 100, [
        { type: 'shield', remainingCharges: 0, duration: 3 },
      ]);
      expect(hasShieldCharges(withoutCharges)).toBe(false);

      const noShield = createTestUnit('none', 100, []);
      expect(hasShieldCharges(noShield)).toBe(false);
    });
  });

  describe('Invulnerability Mechanics', () => {
    test('invulnerability blocks damage without consuming shield charges', () => {
      const defender = createTestUnit('defender', 100, [
        {
          type: 'invulnerable',
          duration: 1,
        },
        {
          type: 'shield',
          remainingCharges: 2,
          duration: 3,
        },
      ]);

      const result = applyDamageWithShields(defender, 50);

      // HP unchanged because invulnerability blocked the hit
      expect(result.updatedUnit.currentHp).toBe(100);
      expect(result.actualDamage).toBe(0);

      // Invulnerability still present
      const invuln = result.updatedUnit.statusEffects.find(s => s.type === 'invulnerable');
      expect(invuln).toBeDefined();

      // Shield charges did NOT change because invulnerability short-circuits before shields
      const shield = result.updatedUnit.statusEffects.find(s => s.type === 'shield') as any;
      expect(shield).toBeDefined();
      expect(shield.remainingCharges).toBe(2);
    });

    test('invulnerability without shields still blocks damage', () => {
      const defender = createTestUnit('defender', 100, [
        {
          type: 'invulnerable',
          duration: 2,
        },
      ]);

      const result = applyDamageWithShields(defender, 50);

      expect(result.updatedUnit.currentHp).toBe(100);
      expect(result.actualDamage).toBe(0);
    });

    test('isInvulnerable correctly identifies invulnerable units', () => {
      const invuln = createTestUnit('invuln', 100, [
        { type: 'invulnerable', duration: 1 },
      ]);
      expect(isInvulnerable(invuln)).toBe(true);

      const notInvuln = createTestUnit('not', 100, [
        { type: 'shield', remainingCharges: 2, duration: 3 },
      ]);
      expect(isInvulnerable(notInvuln)).toBe(false);
    });
  });

  describe('Combined Shield + Auto-Revive', () => {
    test('shield blocks damage, preventing auto-revive trigger', () => {
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

      // Auto-revive NOT triggered (unit wasn't KO'd)
      expect(result.autoRevived).toBeUndefined();

      // Auto-revive status still present with full uses
      const autoRevive = result.updatedUnit.statusEffects.find(s => s.type === 'autoRevive') as any;
      expect(autoRevive).toBeDefined();
      expect(autoRevive.usesRemaining).toBe(1);
    });

    test('lethal damage triggers auto-revive when shield exhausted', () => {
      const defender = createTestUnit('defender', 50, [
        {
          type: 'autoRevive',
          hpPercent: 0.5,
          usesRemaining: 1,
        },
      ]);

      const result = applyDamageWithShields(defender, 60);

      // Auto-revive triggered, HP restored to 50% of max (100 * 0.5 = 50)
      expect(result.updatedUnit.currentHp).toBe(50);
      expect(result.actualDamage).toBe(60);
      expect(result.autoRevived).toBe(true);

      // Auto-revive status removed after use
      const autoRevive = result.updatedUnit.statusEffects.find(s => s.type === 'autoRevive');
      expect(autoRevive).toBeUndefined();
    });
  });

  describe('Edge Cases', () => {
    test('zero damage with shield does not consume charges', () => {
      const defender = createTestUnit('defender', 100, [
        {
          type: 'shield',
          remainingCharges: 2,
          duration: 3,
        },
      ]);

      const result = applyDamageWithShields(defender, 0);

      // No damage, so shield not consumed
      expect(result.updatedUnit.currentHp).toBe(100);
      expect(result.actualDamage).toBe(0);

      // Shield should still have 2 charges
      const shield = result.updatedUnit.statusEffects.find(s => s.type === 'shield') as any;
      expect(shield).toBeDefined();
      expect(shield.remainingCharges).toBe(2);
    });

    test('multiple shields stack (both consume charges)', () => {
      const defender = createTestUnit('defender', 100, [
        {
          type: 'shield',
          remainingCharges: 1,
          duration: 3,
        },
        {
          type: 'shield',
          remainingCharges: 1,
          duration: 2,
        },
      ]);

      const result = applyDamageWithShields(defender, 50);

      // First shield consumed
      expect(result.updatedUnit.currentHp).toBe(100);
      expect(result.actualDamage).toBe(0);

      // One shield should be removed, one should remain
      const shields = result.updatedUnit.statusEffects.filter(s => s.type === 'shield');
      expect(shields.length).toBe(1);
      expect((shields[0] as any).remainingCharges).toBe(1);
    });
  });
});
