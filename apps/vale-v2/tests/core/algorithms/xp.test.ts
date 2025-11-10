import { describe, it, expect } from 'vitest';
import { createUnit } from '../../../src/core/models/Unit';
import type { UnitDefinition } from '../../../src/core/models/Unit';
import {
  getXpForLevel,
  calculateLevelFromXp,
  addXp,
} from '../../../src/core/algorithms/xp';

describe('XP Algorithms', () => {
  const createSampleUnit = (level: number, xp: number): ReturnType<typeof createUnit> => {
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

    return createUnit(definition, level, xp);
  };

  it('should get XP required for level', () => {
    expect(getXpForLevel(1)).toBe(0);
    expect(getXpForLevel(2)).toBe(100);
    expect(getXpForLevel(3)).toBe(350);
    expect(getXpForLevel(4)).toBe(850);
    expect(getXpForLevel(5)).toBe(1850);
  });

  it('should calculate level from XP', () => {
    expect(calculateLevelFromXp(0)).toBe(1);
    expect(calculateLevelFromXp(50)).toBe(1);
    expect(calculateLevelFromXp(100)).toBe(2);
    expect(calculateLevelFromXp(200)).toBe(2);
    expect(calculateLevelFromXp(350)).toBe(3);
    expect(calculateLevelFromXp(500)).toBe(3);
    expect(calculateLevelFromXp(850)).toBe(4);
    expect(calculateLevelFromXp(1000)).toBe(4);
    expect(calculateLevelFromXp(1850)).toBe(5);
    expect(calculateLevelFromXp(2000)).toBe(5);
  });

  it('should add XP without leveling up', () => {
    const unit = createSampleUnit(1, 0);
    const result = addXp(unit, 50);

    expect(result.unit.xp).toBe(50);
    expect(result.unit.level).toBe(1);
    expect(result.leveledUp).toBe(false);
    expect(result.newLevel).toBe(1);
  });

  it('should level up when XP threshold is reached', () => {
    const unit = createSampleUnit(1, 0);
    const result = addXp(unit, 100);

    expect(result.unit.xp).toBe(100);
    expect(result.unit.level).toBe(2);
    expect(result.leveledUp).toBe(true);
    expect(result.newLevel).toBe(2);
  });

  it('should handle multiple level ups', () => {
    const unit = createSampleUnit(1, 0);
    const result = addXp(unit, 350);

    expect(result.unit.level).toBe(3);
    expect(result.leveledUp).toBe(true);
    expect(result.newLevel).toBe(3);
  });
});

