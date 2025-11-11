import { describe, test, expect } from 'vitest';
import { createEmptyLoadout, calculateEquipmentBonuses } from '../../../src/core/models/Equipment';
import type { Equipment } from '../../../src/core/models/Equipment';
import { EquipmentSchema, EquipmentLoadoutSchema } from '../../../src/data/schemas/EquipmentSchema';

describe('Equipment Model', () => {
  test('should create empty loadout', () => {
    const loadout = createEmptyLoadout();

    expect(loadout.weapon).toBeNull();
    expect(loadout.armor).toBeNull();
    expect(loadout.helm).toBeNull();
    expect(loadout.boots).toBeNull();
    expect(loadout.accessory).toBeNull();
  });

  test('should calculate equipment bonuses correctly', () => {
    const weapon: Equipment = {
      id: 'test-sword',
      name: 'Test Sword',
      slot: 'weapon',
      tier: 'basic',
      cost: 100,
      statBonus: { atk: 10 },
    };

    const armor: Equipment = {
      id: 'test-armor',
      name: 'Test Armor',
      slot: 'armor',
      tier: 'basic',
      cost: 150,
      statBonus: { def: 8, hp: 20 },
    };

    const loadout = {
      weapon,
      armor,
      helm: null,
      boots: null,
      accessory: null,
    };

    const bonuses = calculateEquipmentBonuses(loadout);

    expect(bonuses.atk).toBe(10);
    expect(bonuses.def).toBe(8);
    expect(bonuses.hp).toBe(20);
  });

  test('should validate equipment against schema', () => {
    const equipment: Equipment = {
      id: 'test-equipment',
      name: 'Test Equipment',
      slot: 'weapon',
      tier: 'basic',
      cost: 100,
      statBonus: { atk: 10 },
    };

    const result = EquipmentSchema.safeParse(equipment);
    expect(result.success).toBe(true);
  });

  test('should validate equipment loadout against schema', () => {
    const loadout = createEmptyLoadout();
    const result = EquipmentLoadoutSchema.safeParse(loadout);

    expect(result.success).toBe(true);
  });
});

