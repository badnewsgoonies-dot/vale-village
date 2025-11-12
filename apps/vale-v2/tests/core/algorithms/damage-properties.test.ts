import { describe, test, expect } from 'vitest';
import * as fc from 'fast-check';
import { createUnit } from '../../../src/core/models/Unit';
import { createTeam } from '../../../src/core/models/Team';
import type { UnitDefinition } from '../../../src/core/models/Unit';
import type { Ability } from '../../../src/data/schemas/AbilitySchema';
import {
  calculatePhysicalDamage,
  applyHealing,
} from '../../../src/core/algorithms/damage';
import { calculateMaxHp } from '../../../src/core/models/Unit';

describe('Damage Algorithm Properties', () => {
  const createSampleUnit = (spd: number): ReturnType<typeof createUnit> => {
    const definition: UnitDefinition = {
      id: 'test-unit',
      name: 'Test Unit',
      element: 'Venus',
      role: 'Balanced Warrior',
      baseStats: {
        hp: 100,
        pp: 20,
        atk: 10,
        def: 8,
        mag: 5,
        spd,
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
    id: 'test-strike',
    name: 'Test Strike',
    type: 'physical',
    manaCost: 0,
    basePower: 10,
    targets: 'single-enemy',
    unlockLevel: 1,
    description: 'Test strike ability',
  };

  test('physical damage is deterministic given the same inputs', () => {
    const attacker = createSampleUnit(15);
    const defender = createSampleUnit(12);
    const team = createTeam([
      attacker,
      createSampleUnit(10),
      createSampleUnit(11),
      createSampleUnit(9),
    ]);

    const firstPass = calculatePhysicalDamage(attacker, defender, team, physicalAbility);
    const secondPass = calculatePhysicalDamage(attacker, defender, team, physicalAbility);

    expect(firstPass).toBeGreaterThanOrEqual(1);
    expect(secondPass).toBeGreaterThanOrEqual(1);
    expect(secondPass).toBe(firstPass);
  });

  test('should clamp healing to max HP', () => {
    fc.assert(
      fc.property(fc.integer({ min: 1, max: 1000 }), (healingAmount) => {
        const unit = createSampleUnit(12);
        const maxHp = calculateMaxHp(unit);
        
        const healed = applyHealing(unit, healingAmount);
        
        expect(healed.currentHp).toBeLessThanOrEqual(maxHp);
        expect(healed.currentHp).toBeGreaterThanOrEqual(0);
      })
    );
  });
});
