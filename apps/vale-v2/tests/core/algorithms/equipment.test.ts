import { describe, expect, test } from 'vitest';
import { canEquipItem, getEquippableItems } from '../../../src/core/algorithms/equipment';

const mockEquipment = {
  id: 'mock-sword',
  name: 'Mock Sword',
  slot: 'weapon',
  tier: 'basic',
  cost: 100,
  statBonus: {},
  allowedUnits: ['adept', 'sentinel'],
};

const otherEquipment = {
  ...mockEquipment,
  id: 'mock-axe',
  allowedUnits: ['war-mage'],
};

const mockUnit = {
  id: 'adept',
  name: 'Adept',
  element: 'Venus',
  role: 'Warrior',
  level: 1,
  xp: 0,
  manaContribution: 1,
  currentHp: 100,
  baseStats: { hp: 100, pp: 20, atk: 10, def: 10, mag: 5, spd: 8 },
  growthRates: { hp: 15, pp: 5, atk: 3, def: 2, mag: 2, spd: 1 },
  abilities: [],
  statusEffects: [],
  equipment: {
    weapon: null,
    armor: null,
    helm: null,
    boots: null,
    accessory: null,
  },
  storeUnlocked: false,
};

describe('Equipment helpers', () => {
  test('canEquipItem returns true when unit allowed', () => {
    expect(canEquipItem(mockUnit, mockEquipment)).toBe(true);
  });

  test('canEquipItem returns false when not in allowed list', () => {
    expect(canEquipItem(mockUnit, otherEquipment)).toBe(false);
  });

  test('getEquippableItems filters correctly', () => {
    const list = [mockEquipment, otherEquipment];
    const equippable = getEquippableItems(list, 'adept');
    expect(equippable).toEqual([mockEquipment]);
  });
});
