import { describe, test, expect } from 'vitest';
import { AbilitySchema, abilityIdRegex } from '@/data/schemas/AbilitySchema';

describe('abilityIdRegex', () => {
  test('should accept valid kebab-case IDs', () => {
    expect(abilityIdRegex.test('strike')).toBe(true);
    expect(abilityIdRegex.test('heavy-strike')).toBe(true);
    expect(abilityIdRegex.test('chain-lightning')).toBe(true);
    expect(abilityIdRegex.test('heal-over-time-3')).toBe(true);
  });

  test('should reject invalid ID formats', () => {
    expect(abilityIdRegex.test('Strike')).toBe(false); // uppercase
    expect(abilityIdRegex.test('heavy_strike')).toBe(false); // underscore
    expect(abilityIdRegex.test('heavy strike')).toBe(false); // space
    expect(abilityIdRegex.test('-strike')).toBe(false); // leading hyphen
    expect(abilityIdRegex.test('strike-')).toBe(false); // trailing hyphen
    expect(abilityIdRegex.test('')).toBe(false); // empty
  });
});

describe('AbilitySchema', () => {
  const minimalAbility = {
    id: 'test-ability',
    name: 'Test Ability',
    type: 'physical' as const,
    manaCost: 0,
    basePower: 10,
    targets: 'single-enemy' as const,
    unlockLevel: 1,
    description: 'A test ability',
  };

  test('should accept minimal valid ability', () => {
    expect(AbilitySchema.safeParse(minimalAbility).success).toBe(true);
  });

  test('should accept all valid ability types', () => {
    const types = ['physical', 'psynergy', 'healing', 'buff', 'debuff', 'summon'] as const;
    for (const type of types) {
      const ability = { ...minimalAbility, type };
      expect(AbilitySchema.safeParse(ability).success).toBe(true);
    }
  });

  test('should accept all valid target types', () => {
    const targets = [
      'single-enemy',
      'all-enemies',
      'single-ally',
      'all-allies',
      'self',
    ] as const;
    for (const target of targets) {
      const ability = { ...minimalAbility, targets: target };
      expect(AbilitySchema.safeParse(ability).success).toBe(true);
    }
  });

  test('should accept all valid elements', () => {
    const elements = ['Venus', 'Mars', 'Jupiter', 'Mercury', 'Neutral'] as const;
    for (const element of elements) {
      const ability = { ...minimalAbility, element };
      expect(AbilitySchema.safeParse(ability).success).toBe(true);
    }
  });

  test('should reject invalid ability ID format', () => {
    const invalid = { ...minimalAbility, id: 'Invalid_ID' };
    const result = AbilitySchema.safeParse(invalid);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toContain('kebab-case');
    }
  });

  test('should reject empty name', () => {
    const invalid = { ...minimalAbility, name: '' };
    expect(AbilitySchema.safeParse(invalid).success).toBe(false);
  });

  test('should reject negative manaCost', () => {
    const invalid = { ...minimalAbility, manaCost: -1 };
    expect(AbilitySchema.safeParse(invalid).success).toBe(false);
  });

  test('should reject manaCost > 5', () => {
    const invalid = { ...minimalAbility, manaCost: 6 };
    expect(AbilitySchema.safeParse(invalid).success).toBe(false);
  });

  test('should accept manaCost = 5 (max)', () => {
    const valid = { ...minimalAbility, manaCost: 5 };
    expect(AbilitySchema.safeParse(valid).success).toBe(true);
  });

  test('should reject negative basePower', () => {
    const invalid = { ...minimalAbility, basePower: -10 };
    expect(AbilitySchema.safeParse(invalid).success).toBe(false);
  });

  test('should accept zero basePower', () => {
    const valid = { ...minimalAbility, basePower: 0 };
    expect(AbilitySchema.safeParse(valid).success).toBe(true);
  });

  test('should reject unlockLevel < 1', () => {
    const invalid = { ...minimalAbility, unlockLevel: 0 };
    expect(AbilitySchema.safeParse(invalid).success).toBe(false);
  });

  test('should reject unlockLevel > 20', () => {
    const invalid = { ...minimalAbility, unlockLevel: 21 };
    expect(AbilitySchema.safeParse(invalid).success).toBe(false);
  });

  test('should accept unlockLevel = 1 (min)', () => {
    const valid = { ...minimalAbility, unlockLevel: 1 };
    expect(AbilitySchema.safeParse(valid).success).toBe(true);
  });

  test('should accept unlockLevel = 20 (max)', () => {
    const valid = { ...minimalAbility, unlockLevel: 20 };
    expect(AbilitySchema.safeParse(valid).success).toBe(true);
  });

  test('should accept ability with buffEffect', () => {
    const withBuff = {
      ...minimalAbility,
      type: 'buff' as const,
      buffEffect: {
        atk: 10,
        def: 5,
      },
      duration: 3,
    };
    expect(AbilitySchema.safeParse(withBuff).success).toBe(true);
  });

  test('should accept ability with debuffEffect', () => {
    const withDebuff = {
      ...minimalAbility,
      type: 'debuff' as const,
      debuffEffect: {
        atk: -5,
        def: -3,
      },
      duration: 2,
    };
    expect(AbilitySchema.safeParse(withDebuff).success).toBe(true);
  });

  test('should accept ability with statusEffect', () => {
    const withStatus = {
      ...minimalAbility,
      statusEffect: {
        type: 'poison' as const,
        duration: 3,
        chance: 0.8,
      },
    };
    expect(AbilitySchema.safeParse(withStatus).success).toBe(true);
  });

  test('should reject statusEffect with invalid chance', () => {
    const invalid = {
      ...minimalAbility,
      statusEffect: {
        type: 'poison' as const,
        duration: 3,
        chance: 1.5,
      },
    };
    expect(AbilitySchema.safeParse(invalid).success).toBe(false);
  });

  test('should accept ability with healOverTime', () => {
    const withHoT = {
      ...minimalAbility,
      type: 'healing' as const,
      healOverTime: {
        amount: 10,
        duration: 3,
      },
    };
    expect(AbilitySchema.safeParse(withHoT).success).toBe(true);
  });

  test('should accept ability with hitCount', () => {
    const withHits = {
      ...minimalAbility,
      hitCount: 3,
    };
    expect(AbilitySchema.safeParse(withHits).success).toBe(true);
  });

  test('should reject hitCount > 10', () => {
    const invalid = {
      ...minimalAbility,
      hitCount: 11,
    };
    expect(AbilitySchema.safeParse(invalid).success).toBe(false);
  });

  test('should accept ability with revive mechanics', () => {
    const withRevive = {
      ...minimalAbility,
      type: 'healing' as const,
      revive: true,
      reviveHPPercent: 0.5,
    };
    expect(AbilitySchema.safeParse(withRevive).success).toBe(true);
  });

  test('should reject reviveHPPercent > 1', () => {
    const invalid = {
      ...minimalAbility,
      revive: true,
      reviveHPPercent: 1.5,
    };
    expect(AbilitySchema.safeParse(invalid).success).toBe(false);
  });

  test('should accept ability with ignoreDefensePercent', () => {
    const withIgnoreDef = {
      ...minimalAbility,
      ignoreDefensePercent: 0.5,
    };
    expect(AbilitySchema.safeParse(withIgnoreDef).success).toBe(true);
  });

  test('should reject ignoreDefensePercent > 1', () => {
    const invalid = {
      ...minimalAbility,
      ignoreDefensePercent: 1.2,
    };
    expect(AbilitySchema.safeParse(invalid).success).toBe(false);
  });

  test('should accept ability with splashDamagePercent', () => {
    const withSplash = {
      ...minimalAbility,
      splashDamagePercent: 0.3,
    };
    expect(AbilitySchema.safeParse(withSplash).success).toBe(true);
  });

  test('should accept ability with shieldCharges', () => {
    const withShield = {
      ...minimalAbility,
      type: 'buff' as const,
      shieldCharges: 3,
    };
    expect(AbilitySchema.safeParse(withShield).success).toBe(true);
  });

  test('should accept ability with removeStatusEffects (all)', () => {
    const withCleanse = {
      ...minimalAbility,
      type: 'healing' as const,
      removeStatusEffects: {
        type: 'all' as const,
      },
    };
    expect(AbilitySchema.safeParse(withCleanse).success).toBe(true);
  });

  test('should accept ability with removeStatusEffects (negative)', () => {
    const withCleanse = {
      ...minimalAbility,
      type: 'healing' as const,
      removeStatusEffects: {
        type: 'negative' as const,
      },
    };
    expect(AbilitySchema.safeParse(withCleanse).success).toBe(true);
  });

  test('should accept ability with removeStatusEffects (byType)', () => {
    const withCleanse = {
      ...minimalAbility,
      type: 'healing' as const,
      removeStatusEffects: {
        type: 'byType' as const,
        statuses: ['poison', 'burn'],
      },
    };
    expect(AbilitySchema.safeParse(withCleanse).success).toBe(true);
  });

  test('should accept ability with damageReductionPercent', () => {
    const withDR = {
      ...minimalAbility,
      type: 'buff' as const,
      damageReductionPercent: 0.3,
    };
    expect(AbilitySchema.safeParse(withDR).success).toBe(true);
  });

  test('should accept ability with elementalResistance', () => {
    const withER = {
      ...minimalAbility,
      type: 'buff' as const,
      elementalResistance: {
        element: 'Mars' as const,
        modifier: 0.4,
      },
    };
    expect(AbilitySchema.safeParse(withER).success).toBe(true);
  });

  test('should accept ability with grantImmunity', () => {
    const withImmunity = {
      ...minimalAbility,
      type: 'buff' as const,
      grantImmunity: {
        all: true,
        duration: 3,
      },
    };
    expect(AbilitySchema.safeParse(withImmunity).success).toBe(true);
  });

  test('should accept ability with aiHints', () => {
    const withAI = {
      ...minimalAbility,
      aiHints: {
        priority: 2.5,
        target: 'weakest' as const,
        avoidOverkill: true,
        opener: false,
      },
    };
    expect(AbilitySchema.safeParse(withAI).success).toBe(true);
  });

  test('should reject aiHints with priority > 3', () => {
    const invalid = {
      ...minimalAbility,
      aiHints: {
        priority: 4,
      },
    };
    expect(AbilitySchema.safeParse(invalid).success).toBe(false);
  });

  test('should accept ability with all optional fields', () => {
    const complex = {
      ...minimalAbility,
      element: 'Mars' as const,
      kind: 'psynergy' as const,
      chainDamage: true,
      buffEffect: { atk: 10 },
      duration: 3,
      statusEffect: {
        type: 'burn' as const,
        duration: 2,
        chance: 0.7,
      },
      hitCount: 2,
      ignoreDefensePercent: 0.2,
      splashDamagePercent: 0.3,
      aiHints: {
        priority: 2,
        target: 'lowestRes' as const,
      },
    };
    expect(AbilitySchema.safeParse(complex).success).toBe(true);
  });
});
