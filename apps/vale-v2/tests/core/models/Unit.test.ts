import { describe, test, expect } from 'vitest';
import { createUnit, updateUnit, calculateMaxHp, isUnitKO } from '../../../src/core/models/Unit';
import type { UnitDefinition } from '../../../src/core/models/Unit';
import { UnitSchema } from '../../../src/data/schemas/UnitSchema';
import { createEmptyLoadout } from '../../../src/core/models/Equipment';

describe('Unit Model', () => {
  const sampleDefinition: UnitDefinition = {
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

  test('should create a unit from definition', () => {
    const unit = createUnit(sampleDefinition, 1, 0);

    expect(unit.id).toBe('test-unit');
    expect(unit.name).toBe('Test Unit');
    expect(unit.level).toBe(1);
    expect(unit.xp).toBe(0);
    expect(unit.currentHp).toBe(100); // baseStats.hp
    expect(unit.equipment).toEqual(createEmptyLoadout());
    expect(unit.djinn).toEqual([]);
    expect(unit.statusEffects).toEqual([]);
  });

  test('should calculate max HP correctly for level 1', () => {
    const unit = createUnit(sampleDefinition, 1, 0);
    expect(calculateMaxHp(unit)).toBe(100);
  });

  test('should calculate max HP correctly for level 2', () => {
    const unit = createUnit(sampleDefinition, 2, 0);
    // baseStats.hp (100) + (level - 1) * growthRates.hp (20) = 120
    expect(calculateMaxHp(unit)).toBe(120);
  });

  test('should check if unit is KO', () => {
    const unit = createUnit(sampleDefinition, 1, 0);
    expect(isUnitKO(unit)).toBe(false);

    const koUnit = updateUnit(unit, { currentHp: 0 });
    expect(isUnitKO(koUnit)).toBe(true);

    const negativeHpUnit = updateUnit(unit, { currentHp: -10 });
    expect(isUnitKO(negativeHpUnit)).toBe(true);
  });

  test('should update unit immutably', () => {
    const unit = createUnit(sampleDefinition, 1, 0);
    const updated = updateUnit(unit, { level: 2, xp: 100 });

    expect(unit.level).toBe(1); // Original unchanged
    expect(updated.level).toBe(2); // New object updated
    expect(updated.xp).toBe(100);
  });

  test('should validate unit against schema', () => {
    const unit = createUnit(sampleDefinition, 1, 0);
    const result = UnitSchema.safeParse(unit);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.id).toBe('test-unit');
    }
  });
});

