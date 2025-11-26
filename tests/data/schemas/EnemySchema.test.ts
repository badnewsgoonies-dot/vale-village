import { describe, test, expect } from 'vitest';
import { EnemySchema, EquipmentDropSchema } from '@/data/schemas/EnemySchema';

describe('EquipmentDropSchema', () => {
  const minimalEquipment = {
    id: 'test-sword',
    name: 'Test Sword',
    slot: 'weapon' as const,
    tier: 'iron' as const,
    cost: 100,
    statBonus: {},
    allowedElements: ['Venus'],
  };

  test('should accept valid equipment drop', () => {
    const drop = {
      equipment: minimalEquipment,
      chance: 0.5,
    };
    expect(EquipmentDropSchema.safeParse(drop).success).toBe(true);
  });

  test('should accept chance = 0 (never drops)', () => {
    const drop = {
      equipment: minimalEquipment,
      chance: 0,
    };
    expect(EquipmentDropSchema.safeParse(drop).success).toBe(true);
  });

  test('should accept chance = 1 (always drops)', () => {
    const drop = {
      equipment: minimalEquipment,
      chance: 1,
    };
    expect(EquipmentDropSchema.safeParse(drop).success).toBe(true);
  });

  test('should reject chance < 0', () => {
    const invalid = {
      equipment: minimalEquipment,
      chance: -0.1,
    };
    expect(EquipmentDropSchema.safeParse(invalid).success).toBe(false);
  });

  test('should reject chance > 1', () => {
    const invalid = {
      equipment: minimalEquipment,
      chance: 1.5,
    };
    expect(EquipmentDropSchema.safeParse(invalid).success).toBe(false);
  });
});

describe('EnemySchema', () => {
  const minimalAbility = {
    id: 'strike',
    name: 'Strike',
    type: 'physical' as const,
    manaCost: 0,
    basePower: 10,
    targets: 'single-enemy' as const,
    unlockLevel: 1,
    description: 'Basic attack',
  };

  const minimalEnemy = {
    id: 'test-enemy',
    name: 'Test Enemy',
    level: 5,
    stats: {
      hp: 80,
      pp: 10,
      atk: 12,
      def: 8,
      mag: 5,
      spd: 6,
    },
    abilities: [minimalAbility],
    element: 'Mars' as const,
    baseXp: 50,
    baseGold: 30,
  };

  test('should accept minimal valid enemy', () => {
    expect(EnemySchema.safeParse(minimalEnemy).success).toBe(true);
  });

  test('should reject empty id', () => {
    const invalid = { ...minimalEnemy, id: '' };
    expect(EnemySchema.safeParse(invalid).success).toBe(false);
  });

  test('should reject empty name', () => {
    const invalid = { ...minimalEnemy, name: '' };
    expect(EnemySchema.safeParse(invalid).success).toBe(false);
  });

  test('should accept level 1 enemy', () => {
    const level1 = { ...minimalEnemy, level: 1 };
    expect(EnemySchema.safeParse(level1).success).toBe(true);
  });

  test('should accept level 20 enemy', () => {
    const level20 = { ...minimalEnemy, level: 20 };
    expect(EnemySchema.safeParse(level20).success).toBe(true);
  });

  test('should reject level 0 enemy', () => {
    const invalid = { ...minimalEnemy, level: 0 };
    expect(EnemySchema.safeParse(invalid).success).toBe(false);
  });

  test('should reject level 21 enemy', () => {
    const invalid = { ...minimalEnemy, level: 21 };
    expect(EnemySchema.safeParse(invalid).success).toBe(false);
  });

  test('should reject enemy with no abilities', () => {
    const invalid = { ...minimalEnemy, abilities: [] };
    expect(EnemySchema.safeParse(invalid).success).toBe(false);
  });

  test('should accept enemy with multiple abilities', () => {
    const multiAbility = {
      ...minimalEnemy,
      abilities: [
        minimalAbility,
        { ...minimalAbility, id: 'fireball', name: 'Fireball' },
      ],
    };
    expect(EnemySchema.safeParse(multiAbility).success).toBe(true);
  });

  test('should accept all valid elements', () => {
    const elements = ['Venus', 'Mars', 'Mercury', 'Jupiter', 'Neutral'] as const;
    for (const element of elements) {
      const enemy = { ...minimalEnemy, element };
      expect(EnemySchema.safeParse(enemy).success).toBe(true);
    }
  });

  test('should reject negative baseXp', () => {
    const invalid = { ...minimalEnemy, baseXp: -10 };
    expect(EnemySchema.safeParse(invalid).success).toBe(false);
  });

  test('should reject negative baseGold', () => {
    const invalid = { ...minimalEnemy, baseGold: -5 };
    expect(EnemySchema.safeParse(invalid).success).toBe(false);
  });

  test('should accept enemy with zero baseXp', () => {
    const noXp = { ...minimalEnemy, baseXp: 0 };
    expect(EnemySchema.safeParse(noXp).success).toBe(true);
  });

  test('should accept enemy with zero baseGold', () => {
    const noGold = { ...minimalEnemy, baseGold: 0 };
    expect(EnemySchema.safeParse(noGold).success).toBe(true);
  });

  test('should accept enemy with equipment drops', () => {
    const equipment = {
      id: 'iron-sword',
      name: 'Iron Sword',
      slot: 'weapon' as const,
      tier: 'iron' as const,
      cost: 200,
      statBonus: { atk: 15 },
      allowedElements: ['Venus'],
    };

    const withDrops = {
      ...minimalEnemy,
      drops: [
        { equipment, chance: 0.3 },
      ],
    };
    expect(EnemySchema.safeParse(withDrops).success).toBe(true);
  });

  test('should accept enemy with multiple equipment drops', () => {
    const weapon = {
      id: 'iron-sword',
      name: 'Iron Sword',
      slot: 'weapon' as const,
      tier: 'iron' as const,
      cost: 200,
      statBonus: { atk: 15 },
      allowedElements: ['Venus'],
    };

    const armor = {
      id: 'iron-armor',
      name: 'Iron Armor',
      slot: 'armor' as const,
      tier: 'iron' as const,
      cost: 180,
      statBonus: { def: 12 },
      allowedElements: ['Venus'],
    };

    const withMultiDrops = {
      ...minimalEnemy,
      drops: [
        { equipment: weapon, chance: 0.2 },
        { equipment: armor, chance: 0.15 },
      ],
    };
    expect(EnemySchema.safeParse(withMultiDrops).success).toBe(true);
  });

  test('should accept enemy without drops (optional)', () => {
    const noDrops = { ...minimalEnemy };
    delete (noDrops as any).drops;
    expect(EnemySchema.safeParse(noDrops).success).toBe(true);
  });

  test('should reject enemy with negative stat values', () => {
    const invalid = {
      ...minimalEnemy,
      stats: {
        hp: -50,
        pp: 10,
        atk: 12,
        def: 8,
        mag: 5,
        spd: 6,
      },
    };
    expect(EnemySchema.safeParse(invalid).success).toBe(false);
  });
});
