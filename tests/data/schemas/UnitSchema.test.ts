import { describe, test, expect } from 'vitest';
import {
  UnitSchema,
  UnitDefinitionSchema,
  StatusEffectSchema,
  ElementSchema,
  UnitRoleSchema,
  DjinnStateSchema,
} from '@/data/schemas/UnitSchema';

describe('ElementSchema', () => {
  test('should accept all valid elements', () => {
    expect(ElementSchema.safeParse('Venus').success).toBe(true);
    expect(ElementSchema.safeParse('Mars').success).toBe(true);
    expect(ElementSchema.safeParse('Mercury').success).toBe(true);
    expect(ElementSchema.safeParse('Jupiter').success).toBe(true);
    expect(ElementSchema.safeParse('Neutral').success).toBe(true);
  });

  test('should reject invalid elements', () => {
    expect(ElementSchema.safeParse('Fire').success).toBe(false);
    expect(ElementSchema.safeParse('Water').success).toBe(false);
    expect(ElementSchema.safeParse('').success).toBe(false);
    expect(ElementSchema.safeParse(null).success).toBe(false);
  });
});

describe('UnitRoleSchema', () => {
  test('should accept all valid roles', () => {
    const validRoles = [
      'Balanced Warrior',
      'Pure DPS',
      'Elemental Mage',
      'Healer',
      'Rogue Assassin',
      'AoE Fire Mage',
      'Support Buffer',
      'Defensive Tank',
      'Versatile Scholar',
      'Master Warrior',
    ];

    for (const role of validRoles) {
      expect(UnitRoleSchema.safeParse(role).success).toBe(true);
    }
  });

  test('should reject invalid roles', () => {
    expect(UnitRoleSchema.safeParse('Tank').success).toBe(false);
    expect(UnitRoleSchema.safeParse('DPS').success).toBe(false);
  });
});

describe('DjinnStateSchema', () => {
  test('should accept all valid states', () => {
    expect(DjinnStateSchema.safeParse('Set').success).toBe(true);
    expect(DjinnStateSchema.safeParse('Standby').success).toBe(true);
    expect(DjinnStateSchema.safeParse('Recovery').success).toBe(true);
  });

  test('should reject invalid states', () => {
    expect(DjinnStateSchema.safeParse('Active').success).toBe(false);
    expect(DjinnStateSchema.safeParse('').success).toBe(false);
  });
});

describe('StatusEffectSchema', () => {
  test('should accept valid buff status', () => {
    const buff = {
      type: 'buff',
      stat: 'atk',
      modifier: 10,
      duration: 3,
    };
    expect(StatusEffectSchema.safeParse(buff).success).toBe(true);
  });

  test('should accept valid debuff status', () => {
    const debuff = {
      type: 'debuff',
      stat: 'def',
      modifier: -5,
      duration: 2,
    };
    expect(StatusEffectSchema.safeParse(debuff).success).toBe(true);
  });

  test('should accept valid poison status', () => {
    const poison = {
      type: 'poison',
      damagePerTurn: 5,
      duration: 3,
    };
    expect(StatusEffectSchema.safeParse(poison).success).toBe(true);
  });

  test('should accept valid burn status', () => {
    const burn = {
      type: 'burn',
      damagePerTurn: 8,
      duration: 2,
    };
    expect(StatusEffectSchema.safeParse(burn).success).toBe(true);
  });

  test('should accept valid freeze status', () => {
    const freeze = {
      type: 'freeze',
      duration: 1,
    };
    expect(StatusEffectSchema.safeParse(freeze).success).toBe(true);
  });

  test('should accept valid healOverTime status', () => {
    const hot = {
      type: 'healOverTime',
      healPerTurn: 10,
      duration: 3,
    };
    expect(StatusEffectSchema.safeParse(hot).success).toBe(true);
  });

  test('should reject buff with negative modifier', () => {
    const invalidBuff = {
      type: 'buff',
      stat: 'atk',
      modifier: -10,
      duration: 3,
    };
    expect(StatusEffectSchema.safeParse(invalidBuff).success).toBe(false);
  });

  test('should reject debuff with positive modifier', () => {
    const invalidDebuff = {
      type: 'debuff',
      stat: 'def',
      modifier: 5,
      duration: 2,
    };
    expect(StatusEffectSchema.safeParse(invalidDebuff).success).toBe(false);
  });

  test('should reject poison with negative damagePerTurn', () => {
    const invalidPoison = {
      type: 'poison',
      damagePerTurn: -5,
      duration: 3,
    };
    expect(StatusEffectSchema.safeParse(invalidPoison).success).toBe(false);
  });

  test('should reject status with zero duration', () => {
    const invalidStatus = {
      type: 'poison',
      damagePerTurn: 5,
      duration: 0,
    };
    expect(StatusEffectSchema.safeParse(invalidStatus).success).toBe(false);
  });

  test('should accept elemental resistance status', () => {
    const resistance = {
      type: 'elementalResistance',
      element: 'Mars',
      modifier: 0.4,
      duration: 3,
    };
    expect(StatusEffectSchema.safeParse(resistance).success).toBe(true);
  });

  test('should accept damage reduction status', () => {
    const reduction = {
      type: 'damageReduction',
      percent: 0.3,
      duration: 2,
    };
    expect(StatusEffectSchema.safeParse(reduction).success).toBe(true);
  });

  test('should reject damage reduction with percent > 1', () => {
    const invalid = {
      type: 'damageReduction',
      percent: 1.5,
      duration: 2,
    };
    expect(StatusEffectSchema.safeParse(invalid).success).toBe(false);
  });

  test('should accept shield status', () => {
    const shield = {
      type: 'shield',
      remainingCharges: 3,
      duration: 5,
    };
    expect(StatusEffectSchema.safeParse(shield).success).toBe(true);
  });

  test('should accept invulnerable status', () => {
    const invuln = {
      type: 'invulnerable',
      duration: 1,
    };
    expect(StatusEffectSchema.safeParse(invuln).success).toBe(true);
  });

  test('should accept immunity status', () => {
    const immunity = {
      type: 'immunity',
      all: true,
      duration: 3,
    };
    expect(StatusEffectSchema.safeParse(immunity).success).toBe(true);
  });

  test('should accept autoRevive status', () => {
    const revive = {
      type: 'autoRevive',
      hpPercent: 0.5,
      usesRemaining: 1,
    };
    expect(StatusEffectSchema.safeParse(revive).success).toBe(true);
  });
});

describe('UnitDefinitionSchema', () => {
  const minimalUnitDef = {
    id: 'test-unit',
    name: 'Test Unit',
    element: 'Venus' as const,
    role: 'Balanced Warrior' as const,
    baseStats: {
      hp: 100,
      pp: 20,
      atk: 15,
      def: 10,
      mag: 5,
      spd: 8,
    },
    growthRates: {
      hp: 10,
      pp: 2,
      atk: 3,
      def: 2,
      mag: 1,
      spd: 1,
    },
    abilities: [],
    manaContribution: 1,
    description: 'A test unit',
  };

  test('should accept minimal valid unit definition', () => {
    expect(UnitDefinitionSchema.safeParse(minimalUnitDef).success).toBe(true);
  });

  test('should reject unit with empty id', () => {
    const invalid = { ...minimalUnitDef, id: '' };
    expect(UnitDefinitionSchema.safeParse(invalid).success).toBe(false);
  });

  test('should reject unit with empty name', () => {
    const invalid = { ...minimalUnitDef, name: '' };
    expect(UnitDefinitionSchema.safeParse(invalid).success).toBe(false);
  });

  test('should reject unit with negative manaContribution', () => {
    const invalid = { ...minimalUnitDef, manaContribution: -1 };
    expect(UnitDefinitionSchema.safeParse(invalid).success).toBe(false);
  });

  test('should accept unit with optional autoAttackTiming', () => {
    const withTiming = { ...minimalUnitDef, autoAttackTiming: 'same-turn' as const };
    expect(UnitDefinitionSchema.safeParse(withTiming).success).toBe(true);
  });
});

describe('UnitSchema', () => {
  const minimalUnit = {
    id: 'test-unit',
    name: 'Test Unit',
    element: 'Venus' as const,
    role: 'Balanced Warrior' as const,
    baseStats: {
      hp: 100,
      pp: 20,
      atk: 15,
      def: 10,
      mag: 5,
      spd: 8,
    },
    growthRates: {
      hp: 10,
      pp: 2,
      atk: 3,
      def: 2,
      mag: 1,
      spd: 1,
    },
    description: 'A test unit',
    manaContribution: 1,
    level: 1,
    xp: 0,
    currentHp: 100,
    equipment: {
      weapon: null,
      armor: null,
      helm: null,
      boots: null,
      accessory: null,
    },
    storeUnlocked: false,
    djinn: [],
    djinnStates: {},
    abilities: [],
    unlockedAbilityIds: [],
    statusEffects: [],
    actionsTaken: 0,
    battleStats: {
      damageDealt: 0,
      damageTaken: 0,
    },
  };

  test('should accept minimal valid unit', () => {
    expect(UnitSchema.safeParse(minimalUnit).success).toBe(true);
  });

  test('should accept level 1 unit', () => {
    const level1 = { ...minimalUnit, level: 1 };
    expect(UnitSchema.safeParse(level1).success).toBe(true);
  });

  test('should accept level 20 unit', () => {
    const level20 = { ...minimalUnit, level: 20, currentHp: 290 }; // 100 + 19*10
    expect(UnitSchema.safeParse(level20).success).toBe(true);
  });

  test('should reject level 0 unit', () => {
    const invalid = { ...minimalUnit, level: 0 };
    expect(UnitSchema.safeParse(invalid).success).toBe(false);
  });

  test('should reject level 21 unit', () => {
    const invalid = { ...minimalUnit, level: 21 };
    expect(UnitSchema.safeParse(invalid).success).toBe(false);
  });

  test('should reject negative currentHp', () => {
    const invalid = { ...minimalUnit, currentHp: -10 };
    expect(UnitSchema.safeParse(invalid).success).toBe(false);
  });

  test('should reject negative xp', () => {
    const invalid = { ...minimalUnit, xp: -100 };
    expect(UnitSchema.safeParse(invalid).success).toBe(false);
  });

  test('should reject currentHp exceeding maxHp', () => {
    const invalid = { ...minimalUnit, level: 1, currentHp: 200 }; // maxHp = 100
    const result = UnitSchema.safeParse(invalid);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toContain('exceeds maxHp');
    }
  });

  test('should accept currentHp equal to maxHp', () => {
    const valid = { ...minimalUnit, level: 5, currentHp: 140 }; // 100 + 4*10
    expect(UnitSchema.safeParse(valid).success).toBe(true);
  });

  test('should accept unit with statusEffects', () => {
    const withStatus = {
      ...minimalUnit,
      statusEffects: [
        {
          type: 'buff',
          stat: 'atk',
          modifier: 10,
          duration: 3,
        },
      ],
    };
    expect(UnitSchema.safeParse(withStatus).success).toBe(true);
  });

  test('should reject negative actionsTaken', () => {
    const invalid = { ...minimalUnit, actionsTaken: -1 };
    expect(UnitSchema.safeParse(invalid).success).toBe(false);
  });

  test('should reject negative battleStats', () => {
    const invalid = {
      ...minimalUnit,
      battleStats: {
        damageDealt: -100,
        damageTaken: 0,
      },
    };
    expect(UnitSchema.safeParse(invalid).success).toBe(false);
  });
});
