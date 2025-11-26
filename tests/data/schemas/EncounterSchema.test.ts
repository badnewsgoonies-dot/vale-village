import { describe, test, expect } from 'vitest';
import {
  EncounterSchema,
  EquipmentRewardSchema,
  EncounterRulesSchema,
  EncounterRewardsSchema,
} from '@/data/schemas/EncounterSchema';

describe('EquipmentRewardSchema', () => {
  test('should accept none reward', () => {
    const none = { type: 'none' as const };
    expect(EquipmentRewardSchema.safeParse(none).success).toBe(true);
  });

  test('should accept fixed reward', () => {
    const fixed = {
      type: 'fixed' as const,
      itemId: 'iron-sword',
    };
    expect(EquipmentRewardSchema.safeParse(fixed).success).toBe(true);
  });

  test('should accept choice reward with 3 options', () => {
    const choice = {
      type: 'choice' as const,
      options: ['iron-sword', 'bronze-axe', 'steel-helm'],
    };
    expect(EquipmentRewardSchema.safeParse(choice).success).toBe(true);
  });

  test('should reject choice with < 3 options', () => {
    const invalid = {
      type: 'choice' as const,
      options: ['iron-sword', 'bronze-axe'],
    };
    expect(EquipmentRewardSchema.safeParse(invalid).success).toBe(false);
  });

  test('should reject choice with > 3 options', () => {
    const invalid = {
      type: 'choice' as const,
      options: ['iron-sword', 'bronze-axe', 'steel-helm', 'mythril-armor'],
    };
    expect(EquipmentRewardSchema.safeParse(invalid).success).toBe(false);
  });

  test('should reject choice with duplicate options', () => {
    const invalid = {
      type: 'choice' as const,
      options: ['iron-sword', 'iron-sword', 'bronze-axe'],
    };
    const result = EquipmentRewardSchema.safeParse(invalid);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toContain('unique');
    }
  });

  test('should reject fixed with empty itemId', () => {
    const invalid = {
      type: 'fixed' as const,
      itemId: '',
    };
    expect(EquipmentRewardSchema.safeParse(invalid).success).toBe(false);
  });

  test('should reject choice with empty option', () => {
    const invalid = {
      type: 'choice' as const,
      options: ['iron-sword', '', 'bronze-axe'],
    };
    expect(EquipmentRewardSchema.safeParse(invalid).success).toBe(false);
  });
});

describe('EncounterRulesSchema', () => {
  test('should accept empty rules', () => {
    expect(EncounterRulesSchema.safeParse({}).success).toBe(true);
  });

  test('should accept rules with phaseChange', () => {
    const rules = {
      phaseChange: {
        hpPct: 0.5,
        addAbility: 'enrage',
      },
    };
    expect(EncounterRulesSchema.safeParse(rules).success).toBe(true);
  });

  test('should reject phaseChange with hpPct < 0', () => {
    const invalid = {
      phaseChange: {
        hpPct: -0.1,
        addAbility: 'enrage',
      },
    };
    expect(EncounterRulesSchema.safeParse(invalid).success).toBe(false);
  });

  test('should reject phaseChange with hpPct > 1', () => {
    const invalid = {
      phaseChange: {
        hpPct: 1.5,
        addAbility: 'enrage',
      },
    };
    expect(EncounterRulesSchema.safeParse(invalid).success).toBe(false);
  });

  test('should accept phaseChange with hpPct = 0', () => {
    const valid = {
      phaseChange: {
        hpPct: 0,
        addAbility: 'desperate-attack',
      },
    };
    expect(EncounterRulesSchema.safeParse(valid).success).toBe(true);
  });

  test('should accept phaseChange with hpPct = 1', () => {
    const valid = {
      phaseChange: {
        hpPct: 1,
        addAbility: 'opener',
      },
    };
    expect(EncounterRulesSchema.safeParse(valid).success).toBe(true);
  });

  test('should reject phaseChange with empty addAbility', () => {
    const invalid = {
      phaseChange: {
        hpPct: 0.5,
        addAbility: '',
      },
    };
    expect(EncounterRulesSchema.safeParse(invalid).success).toBe(false);
  });
});

describe('EncounterRewardsSchema', () => {
  test('should accept minimal valid rewards', () => {
    const rewards = {
      xp: 100,
      gold: 50,
      equipment: { type: 'none' as const },
    };
    expect(EncounterRewardsSchema.safeParse(rewards).success).toBe(true);
  });

  test('should reject negative xp', () => {
    const invalid = {
      xp: -50,
      gold: 50,
      equipment: { type: 'none' as const },
    };
    expect(EncounterRewardsSchema.safeParse(invalid).success).toBe(false);
  });

  test('should reject negative gold', () => {
    const invalid = {
      xp: 100,
      gold: -25,
      equipment: { type: 'none' as const },
    };
    expect(EncounterRewardsSchema.safeParse(invalid).success).toBe(false);
  });

  test('should accept zero xp', () => {
    const valid = {
      xp: 0,
      gold: 50,
      equipment: { type: 'none' as const },
    };
    expect(EncounterRewardsSchema.safeParse(valid).success).toBe(true);
  });

  test('should accept zero gold', () => {
    const valid = {
      xp: 100,
      gold: 0,
      equipment: { type: 'none' as const },
    };
    expect(EncounterRewardsSchema.safeParse(valid).success).toBe(true);
  });

  test('should accept rewards with djinn', () => {
    const withDjinn = {
      xp: 200,
      gold: 100,
      equipment: { type: 'none' as const },
      djinn: 'flint',
    };
    expect(EncounterRewardsSchema.safeParse(withDjinn).success).toBe(true);
  });

  test('should accept rewards with unlockUnit', () => {
    const withUnit = {
      xp: 150,
      gold: 75,
      equipment: { type: 'none' as const },
      unlockUnit: 'war-mage',
    };
    expect(EncounterRewardsSchema.safeParse(withUnit).success).toBe(true);
  });

  test('should accept rewards with unlockAbility', () => {
    const withAbility = {
      xp: 100,
      gold: 50,
      equipment: { type: 'none' as const },
      unlockAbility: 'chain-lightning',
    };
    expect(EncounterRewardsSchema.safeParse(withAbility).success).toBe(true);
  });

  test('should reject empty djinn id', () => {
    const invalid = {
      xp: 100,
      gold: 50,
      equipment: { type: 'none' as const },
      djinn: '',
    };
    expect(EncounterRewardsSchema.safeParse(invalid).success).toBe(false);
  });

  test('should reject empty unlockUnit id', () => {
    const invalid = {
      xp: 100,
      gold: 50,
      equipment: { type: 'none' as const },
      unlockUnit: '',
    };
    expect(EncounterRewardsSchema.safeParse(invalid).success).toBe(false);
  });
});

describe('EncounterSchema', () => {
  const minimalEncounter = {
    id: 'test-encounter',
    name: 'Test Encounter',
    enemies: ['goblin', 'wolf'],
    reward: {
      xp: 100,
      gold: 50,
      equipment: { type: 'none' as const },
    },
  };

  test('should accept minimal valid encounter', () => {
    expect(EncounterSchema.safeParse(minimalEncounter).success).toBe(true);
  });

  test('should reject empty id', () => {
    const invalid = { ...minimalEncounter, id: '' };
    expect(EncounterSchema.safeParse(invalid).success).toBe(false);
  });

  test('should reject empty name', () => {
    const invalid = { ...minimalEncounter, name: '' };
    expect(EncounterSchema.safeParse(invalid).success).toBe(false);
  });

  test('should reject encounter with no enemies', () => {
    const invalid = { ...minimalEncounter, enemies: [] };
    expect(EncounterSchema.safeParse(invalid).success).toBe(false);
  });

  test('should accept encounter with single enemy', () => {
    const single = { ...minimalEncounter, enemies: ['boss'] };
    expect(EncounterSchema.safeParse(single).success).toBe(true);
  });

  test('should accept all valid difficulty levels', () => {
    const difficulties = ['easy', 'medium', 'hard', 'boss'] as const;
    for (const difficulty of difficulties) {
      const encounter = { ...minimalEncounter, difficulty };
      expect(EncounterSchema.safeParse(encounter).success).toBe(true);
    }
  });

  test('should reject invalid difficulty', () => {
    const invalid = { ...minimalEncounter, difficulty: 'insane' };
    expect(EncounterSchema.safeParse(invalid).success).toBe(false);
  });

  test('should accept encounter with rules', () => {
    const withRules = {
      ...minimalEncounter,
      rules: {
        phaseChange: {
          hpPct: 0.3,
          addAbility: 'berserk',
        },
      },
    };
    expect(EncounterSchema.safeParse(withRules).success).toBe(true);
  });

  test('should accept encounter with fixed equipment reward', () => {
    const withEquipment = {
      ...minimalEncounter,
      reward: {
        xp: 200,
        gold: 100,
        equipment: {
          type: 'fixed' as const,
          itemId: 'iron-sword',
        },
      },
    };
    expect(EncounterSchema.safeParse(withEquipment).success).toBe(true);
  });

  test('should accept encounter with choice equipment reward', () => {
    const withChoice = {
      ...minimalEncounter,
      reward: {
        xp: 250,
        gold: 125,
        equipment: {
          type: 'choice' as const,
          options: ['iron-sword', 'bronze-axe', 'steel-helm'],
        },
      },
    };
    expect(EncounterSchema.safeParse(withChoice).success).toBe(true);
  });

  test('should accept boss encounter with all features', () => {
    const bossEncounter = {
      id: 'house-1-boss',
      name: 'House 1 Guardian',
      enemies: ['house-1-boss', 'minion-1', 'minion-2'],
      difficulty: 'boss' as const,
      rules: {
        phaseChange: {
          hpPct: 0.5,
          addAbility: 'ultimate-attack',
        },
      },
      reward: {
        xp: 500,
        gold: 250,
        equipment: {
          type: 'choice' as const,
          options: ['legendary-sword', 'mythril-armor', 'artifact-helm'],
        },
        djinn: 'flint',
        unlockUnit: 'war-mage',
      },
    };
    expect(EncounterSchema.safeParse(bossEncounter).success).toBe(true);
  });
});
