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

  describe('createUnit with abilities', () => {
    test('should unlock abilities based on level', () => {
      const defWithAbilities: UnitDefinition = {
        ...sampleDefinition,
        abilities: [
          { id: 'basic-attack', name: 'Basic Attack', unlockLevel: 1, basePower: 10, manaCost: 0, targetType: 'single-enemy', elementType: 'physical' },
          { id: 'strong-attack', name: 'Strong Attack', unlockLevel: 3, basePower: 20, manaCost: 2, targetType: 'single-enemy', elementType: 'physical' },
          { id: 'mega-attack', name: 'Mega Attack', unlockLevel: 5, basePower: 30, manaCost: 5, targetType: 'single-enemy', elementType: 'physical' },
        ],
      };

      const level1 = createUnit(defWithAbilities, 1, 0);
      expect(level1.unlockedAbilityIds).toEqual(['basic-attack']);

      const level3 = createUnit(defWithAbilities, 3, 0);
      expect(level3.unlockedAbilityIds).toEqual(['basic-attack', 'strong-attack']);

      const level5 = createUnit(defWithAbilities, 5, 0);
      expect(level5.unlockedAbilityIds).toEqual(['basic-attack', 'strong-attack', 'mega-attack']);
    });

    test('should unlock abilities without unlockLevel (defaults to 1)', () => {
      const defWithAbilities: UnitDefinition = {
        ...sampleDefinition,
        abilities: [
          { id: 'always-available', name: 'Always Available', basePower: 10, manaCost: 0, targetType: 'single-enemy', elementType: 'physical' },
        ],
      };

      const unit = createUnit(defWithAbilities, 1, 0);
      expect(unit.unlockedAbilityIds).toEqual(['always-available']);
    });
  });

  describe('createUnit defaults', () => {
    test('should default to level 1 if not specified', () => {
      const unit = createUnit(sampleDefinition);
      expect(unit.level).toBe(1);
      expect(unit.xp).toBe(0);
    });

    test('should default autoAttackTiming to same-turn', () => {
      const unit = createUnit(sampleDefinition);
      expect(unit.autoAttackTiming).toBe('same-turn');
    });

    test('should use provided autoAttackTiming if specified', () => {
      const defWithTiming: UnitDefinition = {
        ...sampleDefinition,
        autoAttackTiming: 'next-turn',
      };

      const unit = createUnit(defWithTiming);
      expect(unit.autoAttackTiming).toBe('next-turn');
    });

    test('should initialize battle stats to zero', () => {
      const unit = createUnit(sampleDefinition);
      expect(unit.battleStats.damageDealt).toBe(0);
      expect(unit.battleStats.damageTaken).toBe(0);
    });

    test('should initialize storeUnlocked to false', () => {
      const unit = createUnit(sampleDefinition);
      expect(unit.storeUnlocked).toBe(false);
    });
  });

  describe('updateUnit nested objects', () => {
    test('should update equipment immutably', () => {
      const unit = createUnit(sampleDefinition);
      const weapon = {
        id: 'test-sword',
        name: 'Test Sword',
        slot: 'weapon' as const,
        tier: 'basic' as const,
        cost: 100,
        statBonus: { atk: 10 },
        allowedElements: ['Venus' as const],
      };

      const updated = updateUnit(unit, { equipment: { weapon } });

      expect(unit.equipment.weapon).toBeNull(); // Original unchanged
      expect(updated.equipment.weapon).toBe(weapon);
      expect(updated.equipment.armor).toBeNull(); // Other slots preserved
    });

    test('should update battleStats immutably', () => {
      const unit = createUnit(sampleDefinition);
      const updated = updateUnit(unit, {
        battleStats: { damageDealt: 100 },
      });

      expect(unit.battleStats.damageDealt).toBe(0); // Original unchanged
      expect(updated.battleStats.damageDealt).toBe(100);
      expect(updated.battleStats.damageTaken).toBe(0); // Other stats preserved
    });

    test('should preserve nested objects when not updating them', () => {
      const unit = createUnit(sampleDefinition);
      const originalEquipment = unit.equipment;
      const originalBattleStats = unit.battleStats;

      const updated = updateUnit(unit, { level: 2 });

      expect(updated.equipment).toBe(originalEquipment);
      expect(updated.battleStats).toBe(originalBattleStats);
    });
  });

  describe('calculateMaxHp edge cases', () => {
    test('should handle level 20 correctly', () => {
      const unit = createUnit(sampleDefinition, 20, 0);
      // baseStats.hp (100) + (20 - 1) * growthRates.hp (20) = 100 + 380 = 480
      expect(calculateMaxHp(unit)).toBe(480);
    });

    test('should handle units with zero HP growth', () => {
      const defWithZeroGrowth: UnitDefinition = {
        ...sampleDefinition,
        growthRates: {
          ...sampleDefinition.growthRates,
          hp: 0,
        },
      };

      const unit = createUnit(defWithZeroGrowth, 10, 0);
      expect(calculateMaxHp(unit)).toBe(100); // No growth
    });
  });

  describe('isUnitKO boundary conditions', () => {
    test('should return false for unit at 1 HP', () => {
      const unit = createUnit(sampleDefinition);
      const lowHp = updateUnit(unit, { currentHp: 1 });
      expect(isUnitKO(lowHp)).toBe(false);
    });

    test('should return true for unit at exactly 0 HP', () => {
      const unit = createUnit(sampleDefinition);
      const zeroHp = updateUnit(unit, { currentHp: 0 });
      expect(isUnitKO(zeroHp)).toBe(true);
    });
  });
});

