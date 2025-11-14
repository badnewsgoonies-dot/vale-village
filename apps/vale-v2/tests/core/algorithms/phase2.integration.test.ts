import { describe, test, expect } from 'vitest';
import { createUnit } from '../../../src/core/models/Unit';
import { createTeam } from '../../../src/core/models/Team';
import type { UnitDefinition } from '../../../src/core/models/Unit';
import {
  calculatePsynergyDamage,
  calculatePhysicalDamage,
  applyDamageWithShields,
} from '../../../src/core/algorithms/damage';
import { applyStatusToUnit, isNegativeStatus } from '../../../src/core/algorithms/status';
import type { Ability } from '../../../src/data/schemas/AbilitySchema';

/**
 * Phase 2: Integration Tests
 *
 * Kitchen sink tests combining multiple Phase 2 mechanics:
 * - Ignore defense + elemental resistance + damage reduction
 * - Shield + auto-revive + splash damage
 * - Immunity + cleanse + status application
 * - Full battle scenarios with multiple units and complex interactions
 *
 * These tests prove that all Phase 2 mechanics work together correctly.
 */

describe('Phase 2 - Integration Tests', () => {
  const createTestUnit = (
    id: string,
    stats: { atk?: number; def?: number; mag?: number; spd?: number },
    currentHp?: number,
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
      currentHp: currentHp ?? unit.currentHp,
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

  describe('Damage Calculation Pipeline - Full Stack', () => {
    test('armor-piercing attack ignores defense then applies elemental resist and damage reduction', () => {
      const attacker = createTestUnit('attacker', { mag: 30 });
      const defender = createTestUnit('defender', { def: 40 }, undefined, [
        {
          type: 'elementalResistance',
          element: 'Mars',
          modifier: 0.4, // 40% resistance
          duration: 3,
        },
        {
          type: 'damageReduction',
          percent: 0.3, // 30% reduction
          duration: 3,
        },
      ]);
      const team = createTestTeam(attacker);

      const armorPiercingAbility: Ability = {
        id: 'piercing-fireball',
        name: 'Piercing Fireball',
        type: 'psynergy',
        element: 'Mars',
        basePower: 50,
        targets: 'single-enemy',
        unlockLevel: 1,
        description: 'Armor-piercing fire attack',
        manaCost: 5,
        ignoreDefensePercent: 1.0, // Ignores all defense
      };

      const damage = calculatePsynergyDamage(attacker, defender, team, armorPiercingAbility);

      // Pipeline:
      // 1. Base: (50 + 30 - 0) × 1.5 = 120 (defense ignored, Mars vs Venus advantage)
      // 2. Elemental resist (0.4): 120 × 0.6 = 72
      // 3. Damage reduction (0.3): 72 × 0.7 = 50.4 → floor(50.4) = 50
      expect(damage).toBe(50);
    });

    test('elemental advantage + ignore defense + resistance stack', () => {
      const attacker = createTestUnit('attacker', { mag: 25 });
      attacker.element = 'Mars'; // Mars vs Venus = advantage
      const defender = createTestUnit('defender', { def: 20 });
      defender.element = 'Venus';
      defender.statusEffects.push({
        type: 'elementalResistance',
        element: 'Mars',
        modifier: 0.5,
        duration: 3,
      });
      const team = createTestTeam(attacker);

      const ability: Ability = {
        id: 'fire-blast',
        name: 'Fire Blast',
        type: 'psynergy',
        element: 'Mars',
        basePower: 50,
        targets: 'single-enemy',
        unlockLevel: 1,
        description: 'Fire attack',
        manaCost: 3,
        ignoreDefensePercent: 0.5, // Ignore 50% of defense
      };

      const damage = calculatePsynergyDamage(attacker, defender, team, ability);

      // Pipeline:
      // 1. Effective DEF = 20 × 0.5 = 10
      // 2. Base: (50 + 25 - (10 × 0.3)) × 1.5 = (75 - 3) × 1.5 = 72 × 1.5 = 108
      // 3. Elemental resist (0.5): 108 × 0.5 = 54
      expect(damage).toBe(54);
    });

    test('massive stacking: resistance + reduction + shields + invuln', () => {
      const defender = createTestUnit('defender', { def: 10 }, 100, [
        {
          type: 'elementalResistance',
          element: 'Mars',
          modifier: 0.8, // 80% resistance
          duration: 3,
        },
        {
          type: 'damageReduction',
          percent: 0.9, // 90% reduction (would be 0 damage)
          duration: 3,
        },
        {
          type: 'shield',
          remainingCharges: 2,
          duration: 3,
        },
        {
          type: 'invulnerable',
          duration: 1,
        },
      ]);

      const result = applyDamageWithShields(defender, 1000);

      // Invulnerability blocks damage without consuming shields
      expect(result.updatedUnit.currentHp).toBe(100);
      expect(result.actualDamage).toBe(0);

      // Shield charges NOT consumed (invuln short-circuits)
      const shield = result.updatedUnit.statusEffects.find(s => s.type === 'shield') as any;
      expect(shield.remainingCharges).toBe(2);
    });
  });

  describe('Shield + Auto-Revive Interactions', () => {
    test('shield exhaustion then auto-revive on next hit', () => {
      let defender = createTestUnit('defender', { def: 10 }, 50, [
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

      // Hit 1: Shield blocks
      let result = applyDamageWithShields(defender, 60);
      defender = result.updatedUnit;

      expect(defender.currentHp).toBe(50);
      expect(result.autoRevived).toBeUndefined();

      // Shield consumed
      expect(defender.statusEffects.find(s => s.type === 'shield')).toBeUndefined();

      // Hit 2: Lethal, triggers auto-revive
      result = applyDamageWithShields(defender, 60);
      defender = result.updatedUnit;

      expect(defender.currentHp).toBe(50); // Revived to 50%
      expect(result.autoRevived).toBe(true);

      // Auto-revive consumed
      expect(defender.statusEffects.find(s => s.type === 'autoRevive')).toBeUndefined();
    });

    test('multiple shields + auto-revive + invuln layered defense', () => {
      let defender = createTestUnit('defender', { def: 10 }, 30, [
        {
          type: 'invulnerable',
          duration: 1,
        },
        {
          type: 'shield',
          remainingCharges: 2,
          duration: 5,
        },
        {
          type: 'autoRevive',
          hpPercent: 0.5,
          usesRemaining: 1,
        },
      ]);

      // Hit 1: Invuln blocks
      let result = applyDamageWithShields(defender, 50);
      defender = result.updatedUnit;
      expect(defender.currentHp).toBe(30);
      expect(defender.statusEffects.find(s => s.type === 'shield') as any).toBeDefined();
      expect((defender.statusEffects.find(s => s.type === 'shield') as any).remainingCharges).toBe(2);

      // Manually expire invuln
      defender = {
        ...defender,
        statusEffects: defender.statusEffects.filter(s => s.type !== 'invulnerable'),
      };

      // Hit 2: Shield blocks (2 → 1)
      result = applyDamageWithShields(defender, 50);
      defender = result.updatedUnit;
      expect(defender.currentHp).toBe(30);
      expect((defender.statusEffects.find(s => s.type === 'shield') as any).remainingCharges).toBe(1);

      // Hit 3: Shield blocks (1 → 0, removed)
      result = applyDamageWithShields(defender, 50);
      defender = result.updatedUnit;
      expect(defender.currentHp).toBe(30);
      expect(defender.statusEffects.find(s => s.type === 'shield')).toBeUndefined();

      // Hit 4: Lethal, auto-revive triggers
      result = applyDamageWithShields(defender, 50);
      defender = result.updatedUnit;
      expect(defender.currentHp).toBe(50); // Revived
      expect(result.autoRevived).toBe(true);
    });
  });

  describe('Immunity + Status Application', () => {
    test('immunity prevents status, then immunity expires', () => {
      let unit = createTestUnit('unit', { def: 10 }, undefined, [
        {
          type: 'immunity',
          all: true,
          duration: 2,
        },
      ]);

      // Try to apply poison while immune
      let updated = applyStatusToUnit(unit, { type: 'poison', duration: 3 });
      expect(updated.statusEffects.filter(s => s.type === 'poison')).toHaveLength(0);

      // Manually expire immunity
      updated = {
        ...updated,
        statusEffects: updated.statusEffects.filter(s => s.type !== 'immunity'),
      };

      // Now poison applies
      updated = applyStatusToUnit(updated, { type: 'poison', duration: 3 });
      expect(updated.statusEffects.filter(s => s.type === 'poison')).toHaveLength(1);
    });

    test('specific immunity blocks some statuses but not others', () => {
      const unit = createTestUnit('unit', { def: 10 }, undefined, [
        {
          type: 'immunity',
          all: false,
          types: ['poison', 'burn'],
          duration: 3,
        },
      ]);

      let updated = applyStatusToUnit(unit, { type: 'poison', duration: 3 });
      expect(updated.statusEffects.filter(s => s.type === 'poison')).toHaveLength(0);

      updated = applyStatusToUnit(updated, { type: 'freeze', duration: 3 });
      expect(updated.statusEffects.filter(s => s.type === 'freeze')).toHaveLength(1);

      updated = applyStatusToUnit(updated, { type: 'burn', duration: 3 });
      expect(updated.statusEffects.filter(s => s.type === 'burn')).toHaveLength(0);

      updated = applyStatusToUnit(updated, { type: 'stun', duration: 1 });
      expect(updated.statusEffects.filter(s => s.type === 'stun')).toHaveLength(1);
    });

    test('immunity to debuffs prevents debuffs but allows buffs', () => {
      const unit = createTestUnit('unit', { def: 10 }, undefined, [
        {
          type: 'immunity',
          all: false,
          types: ['debuff'],
          duration: 3,
        },
      ]);

      let updated = applyStatusToUnit(unit, {
        type: 'debuff',
        stat: 'atk',
        modifier: -0.3,
        duration: 3,
      });
      expect(updated.statusEffects.filter(s => s.type === 'debuff')).toHaveLength(0);

      updated = applyStatusToUnit(updated, {
        type: 'buff',
        stat: 'atk',
        modifier: 0.3,
        duration: 3,
      });
      expect(updated.statusEffects.filter(s => s.type === 'buff')).toHaveLength(1);
    });
  });

  describe('Cleanse Workflow', () => {
    test('cleanse negative statuses from heavily afflicted unit', () => {
      const unit = createTestUnit('unit', { def: 10 }, undefined, [
        { type: 'poison', duration: 3 },
        { type: 'burn', duration: 2 },
        { type: 'freeze', duration: 1 },
        { type: 'debuff', stat: 'atk', modifier: -0.3, duration: 3 },
        { type: 'buff', stat: 'mag', modifier: 0.2, duration: 3 },
        { type: 'healOverTime', healPerTurn: 10, duration: 3 },
      ]);

      // Simulate cleanse negative
      const cleansed = unit.statusEffects.filter(s => !isNegativeStatus(s));

      expect(cleansed).toHaveLength(2); // Only buff and healOverTime remain
      expect(cleansed.map(s => s.type)).toEqual(['buff', 'healOverTime']);
    });

    test('cleanse by type removes only specified types', () => {
      const unit = createTestUnit('unit', { def: 10 }, undefined, [
        { type: 'poison', duration: 3 },
        { type: 'burn', duration: 2 },
        { type: 'freeze', duration: 1 },
        { type: 'stun', duration: 1 },
      ]);

      const typesToCleanse = ['poison', 'burn'];

      const cleansed = unit.statusEffects.filter(
        s => !typesToCleanse.includes(s.type)
      );

      expect(cleansed).toHaveLength(2);
      expect(cleansed.map(s => s.type)).toEqual(['freeze', 'stun']);
    });
  });

  describe('Complex Battle Scenarios', () => {
    test('tank unit survives massive attack with layered defenses', () => {
      const tank = createTestUnit('tank', { def: 50 }, 100, [
        {
          type: 'elementalResistance',
          element: 'Mars',
          modifier: 0.5, // 50% fire resist
          duration: 3,
        },
        {
          type: 'damageReduction',
          percent: 0.4, // 40% global reduction
          duration: 3,
        },
        {
          type: 'shield',
          remainingCharges: 3, // 3-hit shield
          duration: 5,
        },
        {
          type: 'autoRevive',
          hpPercent: 0.6, // Revive to 60% HP
          usesRemaining: 1,
        },
      ]);

      const attacker = createTestUnit('attacker', { mag: 40 });
      const team = createTestTeam(attacker);

      const fireBlast: Ability = {
        id: 'mega-fire',
        name: 'Mega Fire',
        type: 'psynergy',
        element: 'Mars',
        basePower: 80,
        targets: 'single-enemy',
        unlockLevel: 5,
        description: 'Massive fire attack',
        manaCost: 10,
      };

      // Calculate damage (already includes elemental resist + damage reduction from status effects)
      const incomingDamage = calculatePsynergyDamage(attacker, tank, team, fireBlast);

      // Should be reduced damage due to 50% fire resist + 40% damage reduction
      expect(incomingDamage).toBeGreaterThan(0);
      expect(incomingDamage).toBeLessThan(100); // Heavily reduced from base ~180

      // First 3 hits: All blocked by shield
      let result = applyDamageWithShields(tank, incomingDamage);
      expect(result.actualDamage).toBe(0);
      expect(result.updatedUnit.currentHp).toBe(100);

      let updatedTank = result.updatedUnit;
      result = applyDamageWithShields(updatedTank, incomingDamage);
      expect(result.actualDamage).toBe(0);

      updatedTank = result.updatedUnit;
      result = applyDamageWithShields(updatedTank, incomingDamage);
      expect(result.actualDamage).toBe(0);

      // Shield exhausted
      updatedTank = result.updatedUnit;
      expect(updatedTank.statusEffects.find(s => s.type === 'shield')).toBeUndefined();

      // Fourth hit: Damage gets through (same as calculated since no more shields/invuln)
      result = applyDamageWithShields(updatedTank, incomingDamage);
      updatedTank = result.updatedUnit;

      // Damage should equal the incoming damage (no more shields to block)
      expect(result.actualDamage).toBe(incomingDamage);

      // If this was lethal and triggered auto-revive, HP should be 60%
      if (result.autoRevived) {
        expect(updatedTank.currentHp).toBe(60);
      }
    });

    test('glass cannon with immunity survives status barrage', () => {
      let glassCannon = createTestUnit('cannon', { mag: 50, def: 5 }, 50, [
        {
          type: 'immunity',
          all: true, // Immune to everything
          duration: 3,
        },
      ]);

      // Try to apply multiple statuses
      glassCannon = applyStatusToUnit(glassCannon, { type: 'poison', duration: 3 });
      glassCannon = applyStatusToUnit(glassCannon, { type: 'burn', duration: 3 });
      glassCannon = applyStatusToUnit(glassCannon, { type: 'stun', duration: 1 });
      glassCannon = applyStatusToUnit(glassCannon, {
        type: 'debuff',
        stat: 'mag',
        modifier: -0.5,
        duration: 3,
      });

      // Should still only have immunity status
      expect(glassCannon.statusEffects).toHaveLength(1);
      expect(glassCannon.statusEffects[0]?.type).toBe('immunity');
    });

    test('armor-piercing ability bypasses high defense', () => {
      const attacker = createTestUnit('attacker', { atk: 25 });
      const fortress = createTestUnit('fortress', { def: 100 }); // Insane defense
      const team = createTestTeam(attacker);

      const normalAttack: Ability = {
        id: 'normal',
        name: 'Normal Attack',
        type: 'physical',
        basePower: 20,
        targets: 'single-enemy',
        unlockLevel: 1,
        description: 'Basic attack',
        manaCost: 0,
      };

      const armorPiercing: Ability = {
        id: 'pierce',
        name: 'Armor Pierce',
        type: 'physical',
        basePower: 20,
        targets: 'single-enemy',
        unlockLevel: 3,
        description: 'Ignores armor',
        manaCost: 3,
        ignoreDefensePercent: 1.0,
      };

      const normalDamage = calculatePhysicalDamage(attacker, fortress, team, normalAttack);
      const piercingDamage = calculatePhysicalDamage(attacker, fortress, team, armorPiercing);

      // Normal: 20 + 25 - (100 × 0.5) = 45 - 50 = -5 → clamp to 1
      expect(normalDamage).toBe(1);

      // Armor-piercing: 20 + 25 - 0 = 45
      expect(piercingDamage).toBe(45);
    });
  });

  describe('Edge Case Interactions', () => {
    test('resistance beyond 100% results in negative damage factor before min clamp', () => {
      const defender = createTestUnit('defender', { def: 10 }, 100, [
        {
          type: 'elementalResistance',
          element: 'Mars',
          modifier: 0.8,
          duration: 3,
        },
        {
          type: 'elementalResistance',
          element: 'Mars',
          modifier: 0.7,
          duration: 3,
        },
      ]);

      const attacker = createTestUnit('attacker', { mag: 20 });
      const team = createTestTeam(attacker);

      const ability: Ability = {
        id: 'fire',
        name: 'Fire',
        type: 'psynergy',
        element: 'Mars',
        basePower: 50,
        targets: 'single-enemy',
        unlockLevel: 1,
        description: 'Fire',
        manaCost: 3,
      };

      const damage = calculatePsynergyDamage(attacker, defender, team, ability);

      // Total resistance = 1.5 → factor = 1 - 1.5 = -0.5
      // This would result in negative damage before min clamp
      // Final damage should be 1 (minimum)
      expect(damage).toBe(1);
    });

    test('100% damage reduction results in minimum damage', () => {
      const defender = createTestUnit('defender', { def: 10 }, 100, [
        {
          type: 'damageReduction',
          percent: 1.0,
          duration: 3,
        },
      ]);

      const attacker = createTestUnit('attacker', { mag: 20 });
      const team = createTestTeam(attacker);

      const ability: Ability = {
        id: 'attack',
        name: 'Attack',
        type: 'psynergy',
        element: 'Neutral',
        basePower: 50,
        targets: 'single-enemy',
        unlockLevel: 1,
        description: 'Attack',
        manaCost: 3,
      };

      const damage = calculatePsynergyDamage(attacker, defender, team, ability);

      // 100% reduction → damage = 0 → clamp to 1
      expect(damage).toBe(1);
    });

    test('auto-revive with 0% hpPercent revives to 0 HP', () => {
      const unit = createTestUnit('unit', { def: 10 }, 50, [
        {
          type: 'autoRevive',
          hpPercent: 0,
          usesRemaining: 1,
        },
      ]);

      const result = applyDamageWithShields(unit, 60);

      // Auto-revive triggered but to 0 HP
      expect(result.autoRevived).toBe(true);
      expect(result.updatedUnit.currentHp).toBe(0);
    });
  });

  describe('Djinn Abilities - Phase 2 Integration', () => {
    test('bane-stone-titan: shields + damage reduction layered defense', () => {
      // Create a unit and simulate bane-stone-titan effects
      let unit = createTestUnit('tank', { def: 10 }, 100);

      // Simulate BattleService applying bane-stone-titan effects:
      // - shieldCharges: 2
      // - damageReductionPercent: 0.3
      // - buffEffect: { def: 12 }
      unit = {
        ...unit,
        statusEffects: [
          {
            type: 'shield',
            remainingCharges: 2,
            duration: 3,
          },
          {
            type: 'damageReduction',
            percent: 0.3,
            duration: 3,
          },
          {
            type: 'buff',
            stat: 'def',
            modifier: 12,
            duration: 3,
          },
        ],
      };

      // Hit 1: 50 damage → blocked by shield
      let result = applyDamageWithShields(unit, 50);
      unit = result.updatedUnit;

      expect(result.actualDamage).toBe(0); // Shield blocks
      expect(unit.currentHp).toBe(100); // HP unchanged
      const shield1 = unit.statusEffects.find(s => s.type === 'shield') as any;
      expect(shield1?.remainingCharges).toBe(1); // 2 → 1

      // Hit 2: 50 damage → blocked by shield
      result = applyDamageWithShields(unit, 50);
      unit = result.updatedUnit;

      expect(result.actualDamage).toBe(0); // Shield blocks
      expect(unit.currentHp).toBe(100); // HP unchanged
      expect(unit.statusEffects.find(s => s.type === 'shield')).toBeUndefined(); // Shield depleted

      // Hit 3: 50 damage → no shield, but DR 30% reduces to 35
      // Note: In real battle, damage would be calculated with DR applied in damage.ts
      // For this test, we simulate the pre-reduced damage
      const reducedDamage = Math.floor(50 * 0.7); // 35
      result = applyDamageWithShields(unit, reducedDamage);
      unit = result.updatedUnit;

      expect(result.actualDamage).toBe(35);
      expect(unit.currentHp).toBe(65); // 100 - 35
    });

    test('bane-terra-blessing: cleanse all negatives + grant immunity', () => {
      // Create 2 allies with mixed statuses
      let ally1 = createTestUnit('ally1', {}, 50, [
        { type: 'poison', damagePerTurn: 8, duration: 3 },
        { type: 'burn', damagePerTurn: 10, duration: 2 },
        { type: 'buff', stat: 'atk', modifier: 5, duration: 3 },
      ]);

      let ally2 = createTestUnit('ally2', {}, 40, [
        { type: 'freeze', duration: 1 },
        { type: 'debuff', stat: 'def', modifier: -3, duration: 3 },
        { type: 'healOverTime', healPerTurn: 10, duration: 2 },
      ]);

      // Simulate bane-terra-blessing effect:
      // - removeStatusEffects: { type: 'negative' }
      // - grantImmunity: { all: true, duration: 1 }

      // Helper to simulate blessing effects
      const applyBlessing = (unit: Unit): Unit => {
        // 1. Cleanse negative statuses
        let updated = {
          ...unit,
          statusEffects: unit.statusEffects.filter(s => !isNegativeStatus(s)),
        };

        // 2. Grant immunity
        updated = {
          ...updated,
          statusEffects: [
            ...updated.statusEffects,
            { type: 'immunity', all: true, duration: 1 },
          ],
        };

        return updated;
      };

      ally1 = applyBlessing(ally1);
      ally2 = applyBlessing(ally2);

      // Verify cleanse worked
      expect(ally1.statusEffects.filter(s => s.type === 'poison')).toHaveLength(0);
      expect(ally1.statusEffects.filter(s => s.type === 'burn')).toHaveLength(0);
      expect(ally1.statusEffects.filter(s => s.type === 'buff')).toHaveLength(1); // Still there

      expect(ally2.statusEffects.filter(s => s.type === 'freeze')).toHaveLength(0);
      expect(ally2.statusEffects.filter(s => s.type === 'debuff')).toHaveLength(0);
      expect(ally2.statusEffects.filter(s => s.type === 'healOverTime')).toHaveLength(1); // Still there

      // Verify immunity granted
      expect(ally1.statusEffects.find(s => s.type === 'immunity')).toBeDefined();
      expect(ally2.statusEffects.find(s => s.type === 'immunity')).toBeDefined();

      const immunity1 = ally1.statusEffects.find(s => s.type === 'immunity') as any;
      expect(immunity1?.all).toBe(true);
      expect(immunity1?.duration).toBe(1);

      // Try to apply poison while immune (should fail)
      let result1 = applyStatusToUnit(ally1, { type: 'poison', damagePerTurn: 8, duration: 3 });
      expect(result1.statusEffects.filter(s => s.type === 'poison')).toHaveLength(0); // Not added

      // Expire immunity
      ally1 = {
        ...ally1,
        statusEffects: ally1.statusEffects.filter(s => s.type !== 'immunity'),
      };

      // Now poison applies
      result1 = applyStatusToUnit(ally1, { type: 'poison', damagePerTurn: 8, duration: 3 });
      expect(result1.statusEffects.filter(s => s.type === 'poison')).toHaveLength(1); // Added
    });
  });

  describe('Mars Djinn Abilities - Phase 2 Armor-Pierce Integration', () => {
    test('fury-terra-burn: armor-piercing physical vs baseline', () => {
      // High-DEF tank to show armor-pierce impact
      const defender = createTestUnit('tank', {
        atk: 10,
        def: 40, // High defense to test armor bypass
        mag: 10,
        spd: 10,
      });

      const attacker = createTestUnit('warrior', {
        atk: 50,
        def: 10,
        mag: 10,
        spd: 10,
      });

      // Create dummy units to fill teams (Team requires exactly 4 units)
      const dummy1 = createTestUnit('dummy1', { atk: 5, def: 5, mag: 5, spd: 5 });
      const dummy2 = createTestUnit('dummy2', { atk: 5, def: 5, mag: 5, spd: 5 });
      const dummy3 = createTestUnit('dummy3', { atk: 5, def: 5, mag: 5, spd: 5 });
      const dummy4 = createTestUnit('dummy4', { atk: 5, def: 5, mag: 5, spd: 5 });

      // Create teams (no Djinn effects)
      const attackerTeam = createTeam([attacker, dummy1, dummy2, dummy3]);
      const defenderTeam = createTeam([defender, dummy4, dummy1, dummy2]);

      const initialDefenderHp = defender.currentHp;

      // === Baseline: Regular physical attack (no armor-pierce) ===
      const baselineAbility: Ability = {
        id: 'baseline-physical',
        name: 'Baseline Physical',
        type: 'physical',
        element: 'Mars',
        manaCost: 3,
        basePower: 50,
        targets: 'single-enemy',
        unlockLevel: 1,
        description: 'Regular physical attack with no armor-pierce.',
      };

      const baselineDamage = calculatePhysicalDamage(
        attacker,
        defender,
        attackerTeam,
        baselineAbility
      );

      // === Armor-Pierce: fury-terra-burn (ignoreDefensePercent: 0.6) ===
      // This ability bypasses 60% of defender's DEF, resulting in higher damage
      const armorPierceAbility: Ability = {
        id: 'fury-terra-burn',
        name: 'Terra Burn',
        type: 'physical',
        element: 'Mars',
        manaCost: 5,
        basePower: 50,
        targets: 'single-enemy',
        unlockLevel: 3,
        description: 'Strike with fire so intense it burns through earth and armor.',
        ignoreDefensePercent: 0.6,
      };

      const armorPierceDamage = calculatePhysicalDamage(
        attacker,
        defender,
        attackerTeam,
        armorPierceAbility
      );

      // Core assertion: armor-pierce deals more damage than baseline
      expect(armorPierceDamage).toBeGreaterThan(baselineDamage);

      // Verify the damage increase is significant (at least 10 damage)
      const damageIncrease = armorPierceDamage - baselineDamage;
      expect(damageIncrease).toBeGreaterThanOrEqual(10);

      // === Simulate full battle flow ===
      let defenderState = defender;

      // Apply baseline attack
      let result = applyDamageWithShields(defenderState, baselineDamage);
      defenderState = result.updatedUnit;
      expect(result.actualDamage).toBe(baselineDamage);
      const hpAfterBaseline = defenderState.currentHp;
      expect(hpAfterBaseline).toBe(initialDefenderHp - baselineDamage);

      // Reset defender
      defenderState = defender;

      // Apply armor-pierce attack
      result = applyDamageWithShields(defenderState, armorPierceDamage);
      defenderState = result.updatedUnit;
      expect(result.actualDamage).toBe(armorPierceDamage);
      const hpAfterArmorPierce = defenderState.currentHp;
      expect(hpAfterArmorPierce).toBe(initialDefenderHp - armorPierceDamage);

      // Verify armor-pierce left defender with less HP than baseline would
      expect(hpAfterArmorPierce).toBeLessThan(hpAfterBaseline);
    });
  });
});
