import { describe, test, expect } from 'vitest';
import {
  EquipmentSchema,
  EquipmentSlotSchema,
  EquipmentTierSchema,
  EquipmentStatBonusSchema,
} from '@/data/schemas/EquipmentSchema';

describe('EquipmentSlotSchema', () => {
  test('should accept all valid slots', () => {
    const validSlots = ['weapon', 'armor', 'helm', 'boots', 'accessory'];
    for (const slot of validSlots) {
      expect(EquipmentSlotSchema.safeParse(slot).success).toBe(true);
    }
  });

  test('should reject invalid slots', () => {
    expect(EquipmentSlotSchema.safeParse('shield').success).toBe(false);
    expect(EquipmentSlotSchema.safeParse('ring').success).toBe(false);
  });
});

describe('EquipmentTierSchema', () => {
  test('should accept all valid tiers', () => {
    const validTiers = [
      'basic',
      'bronze',
      'iron',
      'steel',
      'silver',
      'mythril',
      'legendary',
      'artifact',
    ];
    for (const tier of validTiers) {
      expect(EquipmentTierSchema.safeParse(tier).success).toBe(true);
    }
  });

  test('should reject invalid tiers', () => {
    expect(EquipmentTierSchema.safeParse('gold').success).toBe(false);
    expect(EquipmentTierSchema.safeParse('platinum').success).toBe(false);
  });
});

describe('EquipmentStatBonusSchema', () => {
  test('should accept empty stat bonus', () => {
    expect(EquipmentStatBonusSchema.safeParse({}).success).toBe(true);
  });

  test('should accept partial stat bonus', () => {
    const partial = { atk: 10, def: 5 };
    expect(EquipmentStatBonusSchema.safeParse(partial).success).toBe(true);
  });

  test('should accept full stat bonus', () => {
    const full = {
      hp: 50,
      pp: 10,
      atk: 15,
      def: 12,
      mag: 8,
      spd: 5,
    };
    expect(EquipmentStatBonusSchema.safeParse(full).success).toBe(true);
  });

  test('should accept negative stat values (penalties)', () => {
    const withPenalty = { atk: 20, spd: -5 };
    expect(EquipmentStatBonusSchema.safeParse(withPenalty).success).toBe(true);
  });

  test('should reject non-integer stat values', () => {
    const invalid = { atk: 10.5 };
    expect(EquipmentStatBonusSchema.safeParse(invalid).success).toBe(false);
  });

  test('should accept unknown stat keys (partial schema allows extra fields)', () => {
    const withExtra = { atk: 10, strength: 5 };
    const result = EquipmentStatBonusSchema.safeParse(withExtra);
    expect(result.success).toBe(true);
    // Note: Zod .partial() with extra keys will include them
  });
});

describe('EquipmentSchema', () => {
  const minimalEquipment = {
    id: 'test-sword',
    name: 'Test Sword',
    slot: 'weapon' as const,
    tier: 'iron' as const,
    cost: 100,
    statBonus: {},
    allowedElements: ['Venus'],
  };

  test('should accept minimal valid equipment', () => {
    expect(EquipmentSchema.safeParse(minimalEquipment).success).toBe(true);
  });

  test('should accept weapon equipment', () => {
    const weapon = {
      ...minimalEquipment,
      slot: 'weapon' as const,
      statBonus: { atk: 15 },
    };
    expect(EquipmentSchema.safeParse(weapon).success).toBe(true);
  });

  test('should accept armor equipment', () => {
    const armor = {
      ...minimalEquipment,
      slot: 'armor' as const,
      statBonus: { def: 20, hp: 50 },
    };
    expect(EquipmentSchema.safeParse(armor).success).toBe(true);
  });

  test('should accept helm equipment', () => {
    const helm = {
      ...minimalEquipment,
      slot: 'helm' as const,
      statBonus: { def: 10 },
    };
    expect(EquipmentSchema.safeParse(helm).success).toBe(true);
  });

  test('should accept boots equipment', () => {
    const boots = {
      ...minimalEquipment,
      slot: 'boots' as const,
      statBonus: { spd: 8 },
    };
    expect(EquipmentSchema.safeParse(boots).success).toBe(true);
  });

  test('should accept accessory equipment', () => {
    const accessory = {
      ...minimalEquipment,
      slot: 'accessory' as const,
      statBonus: { mag: 12, pp: 10 },
    };
    expect(EquipmentSchema.safeParse(accessory).success).toBe(true);
  });

  test('should reject empty id', () => {
    const invalid = { ...minimalEquipment, id: '' };
    expect(EquipmentSchema.safeParse(invalid).success).toBe(false);
  });

  test('should reject empty name', () => {
    const invalid = { ...minimalEquipment, name: '' };
    expect(EquipmentSchema.safeParse(invalid).success).toBe(false);
  });

  test('should reject negative cost', () => {
    const invalid = { ...minimalEquipment, cost: -50 };
    expect(EquipmentSchema.safeParse(invalid).success).toBe(false);
  });

  test('should accept zero cost (starter equipment)', () => {
    const free = { ...minimalEquipment, cost: 0 };
    expect(EquipmentSchema.safeParse(free).success).toBe(true);
  });

  test('should reject empty allowedElements array', () => {
    const invalid = { ...minimalEquipment, allowedElements: [] };
    expect(EquipmentSchema.safeParse(invalid).success).toBe(false);
  });

  test('should accept multiple allowedElements', () => {
    const multiElement = {
      ...minimalEquipment,
      allowedElements: ['Venus', 'Mars', 'Jupiter'],
    };
    expect(EquipmentSchema.safeParse(multiElement).success).toBe(true);
  });

  test('should accept equipment with unlocksAbility', () => {
    const withAbility = {
      ...minimalEquipment,
      unlocksAbility: 'heavy-strike',
    };
    expect(EquipmentSchema.safeParse(withAbility).success).toBe(true);
  });

  test('should accept equipment with elementalResist', () => {
    const withResist = {
      ...minimalEquipment,
      elementalResist: 0.3,
    };
    expect(EquipmentSchema.safeParse(withResist).success).toBe(true);
  });

  test('should reject elementalResist > 1', () => {
    const invalid = {
      ...minimalEquipment,
      elementalResist: 1.5,
    };
    expect(EquipmentSchema.safeParse(invalid).success).toBe(false);
  });

  test('should reject negative elementalResist', () => {
    const invalid = {
      ...minimalEquipment,
      elementalResist: -0.2,
    };
    expect(EquipmentSchema.safeParse(invalid).success).toBe(false);
  });

  test('should accept equipment with alwaysFirstTurn', () => {
    const withFirstTurn = {
      ...minimalEquipment,
      alwaysFirstTurn: true,
    };
    expect(EquipmentSchema.safeParse(withFirstTurn).success).toBe(true);
  });

  test('should accept equipment with equipmentUnlocksPermanent', () => {
    const withPermanent = {
      ...minimalEquipment,
      unlocksAbility: 'special-move',
      equipmentUnlocksPermanent: true,
    };
    expect(EquipmentSchema.safeParse(withPermanent).success).toBe(true);
  });

  test('should accept equipment for all elements', () => {
    const allElements = {
      ...minimalEquipment,
      allowedElements: ['Venus', 'Mars', 'Mercury', 'Jupiter', 'Neutral'],
    };
    expect(EquipmentSchema.safeParse(allElements).success).toBe(true);
  });

  test('should accept artifact tier equipment', () => {
    const artifact = {
      ...minimalEquipment,
      tier: 'artifact' as const,
      cost: 9999,
      statBonus: { atk: 50, mag: 50, def: 30 },
    };
    expect(EquipmentSchema.safeParse(artifact).success).toBe(true);
  });

  test('should accept equipment with negative stat penalty', () => {
    const withPenalty = {
      ...minimalEquipment,
      statBonus: { atk: 30, spd: -10 }, // Heavy weapon
    };
    expect(EquipmentSchema.safeParse(withPenalty).success).toBe(true);
  });

  test('should default statBonus to empty object if missing', () => {
    const noBonus = {
      id: 'test-item',
      name: 'Test Item',
      slot: 'accessory' as const,
      tier: 'basic' as const,
      cost: 50,
      allowedElements: ['Neutral'],
    };
    const result = EquipmentSchema.safeParse(noBonus);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.statBonus).toEqual({});
    }
  });
});
