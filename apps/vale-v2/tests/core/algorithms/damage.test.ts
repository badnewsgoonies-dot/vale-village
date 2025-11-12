import { describe, test, expect } from 'vitest';
import { createUnit } from '../../../src/core/models/Unit';
import { createTeam } from '../../../src/core/models/Team';
import type { UnitDefinition } from '../../../src/core/models/Unit';
import {
  calculatePhysicalDamage,
  calculatePsynergyDamage,
  calculateHealAmount,
  applyDamage,
  applyHealing,
} from '../../../src/core/algorithms/damage';
import type { Ability } from '../../../src/data/schemas/AbilitySchema';

describe('Damage Algorithms', () => {
  const createSampleUnit = (id: string, stats: { atk?: number; def?: number; mag?: number; spd?: number }): ReturnType<typeof createUnit> => {
    const definition: UnitDefinition = {
      id,
      name: `Unit ${id}`,
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

  const physicalAbility: Ability = {
    id: 'slash',
    name: 'Slash',
    type: 'physical',
    basePower: 20,
    targets: 'single-enemy',
    unlockLevel: 1,
    description: 'Basic attack',
    manaCost: 0,
  };

  const psynergyAbility: Ability = {
    id: 'fireball',
    name: 'Fireball',
    type: 'psynergy',
    element: 'Mars',
    basePower: 30,
    targets: 'single-enemy',
    unlockLevel: 1,
    description: 'Fire attack',
    manaCost: 5,
  };

  const healingAbility: Ability = {
    id: 'heal',
    name: 'Heal',
    type: 'healing',
    basePower: 25,
    targets: 'single-ally',
    unlockLevel: 1,
    description: 'Heal ally',
    manaCost: 3,
  };

  test('should calculate physical damage', () => {
    const attacker = createSampleUnit('attacker', { atk: 15 });
    const defender = createSampleUnit('defender', { def: 10 });
    const team = createTeam([attacker, createSampleUnit('u2', {}), createSampleUnit('u3', {}), createSampleUnit('u4', {})]);

    const damage = calculatePhysicalDamage(attacker, defender, team, physicalAbility);

    // Damage should be positive and reasonable
    expect(damage).toBeGreaterThan(0);
    expect(damage).toBeLessThan(100); // Sanity check
  });

  test('should calculate psynergy damage', () => {
    const attacker = createSampleUnit('attacker', { mag: 20 });
    const defender = createSampleUnit('defender', { def: 10 });
    const team = createTeam([attacker, createSampleUnit('u2', {}), createSampleUnit('u3', {}), createSampleUnit('u4', {})]);

    const damage = calculatePsynergyDamage(attacker, defender, team, psynergyAbility);

    expect(damage).toBeGreaterThan(0);
  });

  test('should calculate healing amount', () => {
    const caster = createSampleUnit('caster', { mag: 15 });
    const team = createTeam([caster, createSampleUnit('u2', {}), createSampleUnit('u3', {}), createSampleUnit('u4', {})]);

    const healing = calculateHealAmount(caster, team, healingAbility);

    expect(healing).toBeGreaterThanOrEqual(0);
  });

  test('should apply damage to unit', () => {
    const unit = createSampleUnit('unit', {});
    const initialHp = unit.currentHp;
    const damage = 20;

    const damaged = applyDamage(unit, damage);

    expect(damaged.currentHp).toBe(initialHp - damage);
    expect(damaged.battleStats.damageTaken).toBe(damage);
  });

  test('should not allow HP to go below 0', () => {
    const unit = createSampleUnit('unit', {});
    const massiveDamage = 1000;

    const damaged = applyDamage(unit, massiveDamage);

    expect(damaged.currentHp).toBe(0);
  });

  test('should apply healing to unit', () => {
    const unit = createSampleUnit('unit', {});
    const damagedUnit = applyDamage(unit, 30);
    const healing = 20;

    const healed = applyHealing(damagedUnit, healing);

    expect(healed.currentHp).toBe(damagedUnit.currentHp + healing);
  });

  test('should not allow HP to exceed max HP', () => {
    const unit = createSampleUnit('unit', {});
    const massiveHealing = 1000;

    const healed = applyHealing(unit, massiveHealing);

    expect(healed.currentHp).toBeLessThanOrEqual(100); // Max HP for level 1
  });

  test('should reject negative healing values', () => {
    const unit = createSampleUnit('unit', {});

    expect(() => {
      applyHealing(unit, -10);
    }).toThrow('Cannot apply negative healing');
  });

  test('should reject healing KO\'d unit without revivesFallen', () => {
    const unit = createSampleUnit('unit', {});
    const koUnit = applyDamage(unit, 1000); // KO the unit

    expect(() => {
      applyHealing(koUnit, 50, false);
    }).toThrow('Cannot heal KO\'d unit without revivesFallen ability');
  });

  test('should allow healing KO\'d unit with revivesFallen', () => {
    const unit = createSampleUnit('unit', {});
    const koUnit = applyDamage(unit, 1000); // KO the unit

    // Should not throw when revivesFallen is true
    expect(() => {
      applyHealing(koUnit, 50, true);
    }).not.toThrow();
  });
});
