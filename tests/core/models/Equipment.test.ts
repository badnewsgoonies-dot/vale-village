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
      allowedElements: ['Venus'], // Required after refactor to element-based system
    };

    const armor: Equipment = {
      id: 'test-armor',
      name: 'Test Armor',
      slot: 'armor',
      tier: 'basic',
      cost: 150,
      statBonus: { def: 8, hp: 20 },
      allowedElements: ['Venus'], // Required after refactor to element-based system
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
      allowedElements: ['Venus'], // Required after refactor to element-based system
    };

    const result = EquipmentSchema.safeParse(equipment);
    expect(result.success).toBe(true);
  });

  test('should validate equipment loadout against schema', () => {
    const loadout = createEmptyLoadout();
    const result = EquipmentLoadoutSchema.safeParse(loadout);

    expect(result.success).toBe(true);
  });

  describe('calculateEquipmentBonuses edge cases', () => {
    test('should handle empty loadout', () => {
      const loadout = createEmptyLoadout();
      const bonuses = calculateEquipmentBonuses(loadout);

      expect(bonuses).toEqual({});
    });

    test('should handle multiple equipment pieces stacking bonuses', () => {
      const weapon: Equipment = {
        id: 'power-sword',
        name: 'Power Sword',
        slot: 'weapon',
        tier: 'iron',
        cost: 200,
        statBonus: { atk: 15, spd: 2 },
        allowedElements: ['Mars'],
      };

      const boots: Equipment = {
        id: 'speed-boots',
        name: 'Speed Boots',
        slot: 'boots',
        tier: 'iron',
        cost: 150,
        statBonus: { spd: 5 },
        allowedElements: ['Mars'],
      };

      const helm: Equipment = {
        id: 'iron-helm',
        name: 'Iron Helm',
        slot: 'helm',
        tier: 'iron',
        cost: 180,
        statBonus: { def: 6, atk: 2 },
        allowedElements: ['Mars'],
      };

      const loadout = {
        weapon,
        armor: null,
        helm,
        boots,
        accessory: null,
      };

      const bonuses = calculateEquipmentBonuses(loadout);

      expect(bonuses.atk).toBe(17); // 15 + 2
      expect(bonuses.spd).toBe(7); // 2 + 5
      expect(bonuses.def).toBe(6);
    });

    test('should handle equipment with undefined stat bonuses', () => {
      const accessory: Equipment = {
        id: 'lucky-charm',
        name: 'Lucky Charm',
        slot: 'accessory',
        tier: 'basic',
        cost: 100,
        statBonus: {}, // No bonuses
        allowedElements: ['Venus', 'Mars', 'Mercury', 'Jupiter'],
      };

      const loadout = {
        weapon: null,
        armor: null,
        helm: null,
        boots: null,
        accessory,
      };

      const bonuses = calculateEquipmentBonuses(loadout);

      expect(bonuses).toEqual({});
    });

    test('should handle equipment with partial stat bonuses', () => {
      const armor: Equipment = {
        id: 'partial-armor',
        name: 'Partial Armor',
        slot: 'armor',
        tier: 'basic',
        cost: 120,
        statBonus: { def: 10, hp: undefined as never }, // Mixed defined/undefined
        allowedElements: ['Venus'],
      };

      const loadout = {
        weapon: null,
        armor,
        helm: null,
        boots: null,
        accessory: null,
      };

      const bonuses = calculateEquipmentBonuses(loadout);

      expect(bonuses.def).toBe(10);
      expect(bonuses.hp).toBeUndefined();
    });

    test('should handle all equipment slots filled', () => {
      const createEquipment = (slot: Equipment['slot'], bonus: number): Equipment => ({
        id: `test-${slot}`,
        name: `Test ${slot}`,
        slot,
        tier: 'basic',
        cost: 100,
        statBonus: { atk: bonus },
        allowedElements: ['Venus'],
      });

      const loadout = {
        weapon: createEquipment('weapon', 10),
        armor: createEquipment('armor', 5),
        helm: createEquipment('helm', 3),
        boots: createEquipment('boots', 2),
        accessory: createEquipment('accessory', 1),
      };

      const bonuses = calculateEquipmentBonuses(loadout);

      expect(bonuses.atk).toBe(21); // 10 + 5 + 3 + 2 + 1
    });

    test('should handle zero stat bonuses', () => {
      const weapon: Equipment = {
        id: 'training-sword',
        name: 'Training Sword',
        slot: 'weapon',
        tier: 'basic',
        cost: 10,
        statBonus: { atk: 0 },
        allowedElements: ['Venus', 'Mars', 'Mercury', 'Jupiter'],
      };

      const loadout = {
        weapon,
        armor: null,
        helm: null,
        boots: null,
        accessory: null,
      };

      const bonuses = calculateEquipmentBonuses(loadout);

      expect(bonuses.atk).toBe(0);
    });

    test('should aggregate multiple stat types correctly', () => {
      const armor: Equipment = {
        id: 'balanced-armor',
        name: 'Balanced Armor',
        slot: 'armor',
        tier: 'steel',
        cost: 300,
        statBonus: {
          hp: 50,
          def: 15,
          mag: 5,
          spd: -2, // Speed penalty
        },
        allowedElements: ['Venus'],
      };

      const loadout = {
        weapon: null,
        armor,
        helm: null,
        boots: null,
        accessory: null,
      };

      const bonuses = calculateEquipmentBonuses(loadout);

      expect(bonuses.hp).toBe(50);
      expect(bonuses.def).toBe(15);
      expect(bonuses.mag).toBe(5);
      expect(bonuses.spd).toBe(-2); // Negative bonuses work
    });
  });
});

