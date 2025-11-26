import { describe, test, expect } from 'vitest';
import { DjinnSchema, DjinnSummonEffectSchema } from '@/data/schemas/DjinnSchema';

describe('DjinnSummonEffectSchema', () => {
  test('should accept damage summon effect', () => {
    const damage = {
      type: 'damage' as const,
      description: 'Deals 100 damage',
      damage: 100,
    };
    expect(DjinnSummonEffectSchema.safeParse(damage).success).toBe(true);
  });

  test('should accept heal summon effect', () => {
    const heal = {
      type: 'heal' as const,
      description: 'Heals 80 HP',
      healAmount: 80,
    };
    expect(DjinnSummonEffectSchema.safeParse(heal).success).toBe(true);
  });

  test('should accept buff summon effect', () => {
    const buff = {
      type: 'buff' as const,
      description: 'Increases ATK and DEF',
      statBonus: {
        atk: 15,
        def: 10,
      },
    };
    expect(DjinnSummonEffectSchema.safeParse(buff).success).toBe(true);
  });

  test('should accept special summon effect', () => {
    const special = {
      type: 'special' as const,
      description: 'Unique effect',
    };
    expect(DjinnSummonEffectSchema.safeParse(special).success).toBe(true);
  });

  test('should reject damage with negative value', () => {
    const invalid = {
      type: 'damage' as const,
      description: 'Invalid',
      damage: -50,
    };
    expect(DjinnSummonEffectSchema.safeParse(invalid).success).toBe(false);
  });

  test('should reject heal with negative value', () => {
    const invalid = {
      type: 'heal' as const,
      description: 'Invalid',
      healAmount: -30,
    };
    expect(DjinnSummonEffectSchema.safeParse(invalid).success).toBe(false);
  });

  test('should accept buff with partial stat bonus', () => {
    const partialBuff = {
      type: 'buff' as const,
      description: 'Speed boost',
      statBonus: {
        spd: 8,
      },
    };
    expect(DjinnSummonEffectSchema.safeParse(partialBuff).success).toBe(true);
  });
});

describe('DjinnSchema', () => {
  const minimalDjinn = {
    id: 'test-djinn',
    name: 'Test Djinn',
    element: 'Venus' as const,
    tier: '1' as const,
    summonEffect: {
      type: 'damage' as const,
      description: 'Deals damage',
      damage: 50,
    },
    grantedAbilities: {
      adept: {
        same: [],
        counter: [],
        neutral: [],
      },
    },
  };

  test('should accept minimal valid djinn', () => {
    expect(DjinnSchema.safeParse(minimalDjinn).success).toBe(true);
  });

  test('should reject empty id', () => {
    const invalid = { ...minimalDjinn, id: '' };
    expect(DjinnSchema.safeParse(invalid).success).toBe(false);
  });

  test('should reject empty name', () => {
    const invalid = { ...minimalDjinn, name: '' };
    expect(DjinnSchema.safeParse(invalid).success).toBe(false);
  });

  test('should accept all valid elements', () => {
    const elements = ['Venus', 'Mars', 'Mercury', 'Jupiter', 'Neutral'] as const;
    for (const element of elements) {
      const djinn = { ...minimalDjinn, element };
      expect(DjinnSchema.safeParse(djinn).success).toBe(true);
    }
  });

  test('should accept all valid tiers', () => {
    const tiers = ['1', '2', '3'] as const;
    for (const tier of tiers) {
      const djinn = { ...minimalDjinn, tier };
      expect(DjinnSchema.safeParse(djinn).success).toBe(true);
    }
  });

  test('should reject invalid tier', () => {
    const invalid = { ...minimalDjinn, tier: '4' };
    expect(DjinnSchema.safeParse(invalid).success).toBe(false);
  });

  test('should accept djinn with granted abilities', () => {
    const withAbilities = {
      ...minimalDjinn,
      grantedAbilities: {
        adept: {
          same: ['quake'],
          counter: ['fireball'],
          neutral: ['heal'],
        },
        'war-mage': {
          same: ['burn-touch'],
          counter: [],
          neutral: ['boost-atk'],
        },
      },
    };
    expect(DjinnSchema.safeParse(withAbilities).success).toBe(true);
  });

  test('should reject grantedAbilities with > 4 same element abilities', () => {
    const invalid = {
      ...minimalDjinn,
      grantedAbilities: {
        adept: {
          same: ['ability1', 'ability2', 'ability3', 'ability4', 'ability5'],
          counter: [],
          neutral: [],
        },
      },
    };
    expect(DjinnSchema.safeParse(invalid).success).toBe(false);
  });

  test('should reject grantedAbilities with > 4 counter element abilities', () => {
    const invalid = {
      ...minimalDjinn,
      grantedAbilities: {
        adept: {
          same: [],
          counter: ['ability1', 'ability2', 'ability3', 'ability4', 'ability5'],
          neutral: [],
        },
      },
    };
    expect(DjinnSchema.safeParse(invalid).success).toBe(false);
  });

  test('should reject grantedAbilities with > 4 neutral abilities', () => {
    const invalid = {
      ...minimalDjinn,
      grantedAbilities: {
        adept: {
          same: [],
          counter: [],
          neutral: ['ability1', 'ability2', 'ability3', 'ability4', 'ability5'],
        },
      },
    };
    expect(DjinnSchema.safeParse(invalid).success).toBe(false);
  });

  test('should accept grantedAbilities with exactly 4 abilities per type', () => {
    const maxAbilities = {
      ...minimalDjinn,
      grantedAbilities: {
        adept: {
          same: ['ability1', 'ability2', 'ability3', 'ability4'],
          counter: ['ability5', 'ability6', 'ability7', 'ability8'],
          neutral: ['ability9', 'ability10', 'ability11', 'ability12'],
        },
      },
    };
    expect(DjinnSchema.safeParse(maxAbilities).success).toBe(true);
  });

  test('should accept djinn with damage summon effect', () => {
    const damageDjinn = {
      ...minimalDjinn,
      summonEffect: {
        type: 'damage' as const,
        description: 'Deals 150 damage',
        damage: 150,
      },
    };
    expect(DjinnSchema.safeParse(damageDjinn).success).toBe(true);
  });

  test('should accept djinn with heal summon effect', () => {
    const healDjinn = {
      ...minimalDjinn,
      summonEffect: {
        type: 'heal' as const,
        description: 'Heals 100 HP',
        healAmount: 100,
      },
    };
    expect(DjinnSchema.safeParse(healDjinn).success).toBe(true);
  });

  test('should accept djinn with buff summon effect', () => {
    const buffDjinn = {
      ...minimalDjinn,
      summonEffect: {
        type: 'buff' as const,
        description: 'Boosts all stats',
        statBonus: {
          atk: 20,
          def: 15,
          mag: 10,
          spd: 5,
        },
      },
    };
    expect(DjinnSchema.safeParse(buffDjinn).success).toBe(true);
  });
});
