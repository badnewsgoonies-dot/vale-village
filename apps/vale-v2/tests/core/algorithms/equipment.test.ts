import { describe, test, expect } from 'vitest';
import { canEquipItem, getEquippableItems } from '@/core/algorithms/equipment';
import { mkUnit } from '@/test/factories';
import type { Equipment } from '@/data/schemas/EquipmentSchema';

describe('Equipment helpers', () => {
  const testEquipment: Equipment = {
    id: 'test-sword',
    name: 'Test Sword',
    slot: 'weapon',
    tier: 'iron',
    cost: 100,
    statBonus: { atk: 10 },
    allowedElements: ['Venus'], // Venus units only (Adept, Sentinel)
  };

  const testEquipment2: Equipment = {
    id: 'test-staff',
    name: 'Test Staff',
    slot: 'weapon',
    tier: 'bronze',
    cost: 200,
    statBonus: { mag: 12 },
    allowedElements: ['Mercury'], // Mercury units only (Mystic)
  };

  test('canEquipItem returns true when unit element allowed', () => {
    const unit = mkUnit(); // Default is Adept (Venus element)
    expect(canEquipItem(unit, testEquipment)).toBe(true);
  });

  test('canEquipItem returns false when element not allowed', () => {
    const unit = mkUnit({ element: 'Mars' }); // Override element to Mars
    expect(canEquipItem(unit, testEquipment)).toBe(false); // testEquipment is Venus-only
  });

  test('getEquippableItems filters correctly', () => {
    const venusUnit = mkUnit(); // Default is Adept (Venus element)
    const equipmentList = [testEquipment, testEquipment2];
    const result = getEquippableItems(equipmentList, venusUnit);
    expect(result).toHaveLength(1);
    expect(result[0]?.id).toBe('test-sword'); // Only Venus equipment
  });
});
