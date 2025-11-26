import { describe, test, expect } from 'vitest';
import { SaveV1Schema } from '@/data/schemas/SaveV1Schema';

describe('SaveV1Schema', () => {
  const minimalUnit = {
    id: 'adept',
    name: 'Adept',
    element: 'Venus' as const,
    role: 'Balanced Warrior' as const,
    baseStats: { hp: 100, pp: 20, atk: 15, def: 10, mag: 5, spd: 8 },
    growthRates: { hp: 10, pp: 2, atk: 3, def: 2, mag: 1, spd: 1 },
    description: 'Starter unit',
    manaContribution: 1,
    level: 1,
    xp: 0,
    currentHp: 100,
    equipment: { weapon: null, armor: null, helm: null, boots: null, accessory: null },
    storeUnlocked: false,
    djinn: [],
    djinnStates: {},
    abilities: [],
    unlockedAbilityIds: [],
    statusEffects: [],
    actionsTaken: 0,
    battleStats: { damageDealt: 0, damageTaken: 0 },
  };

  const minimalSave = {
    version: '1.0.0' as const,
    timestamp: Date.now(),
    chapter: 1,
    playerData: {
      unitsCollected: [minimalUnit],
      activeParty: ['adept'],
      inventory: [],
      gold: 100,
      djinnCollected: [],
      recruitmentFlags: {},
      storyFlags: {},
    },
    overworldState: {
      playerPosition: { x: 0, y: 0 },
      currentScene: 'town-square',
      npcStates: {},
    },
    stats: {
      battlesWon: 0,
      battlesLost: 0,
      totalDamageDealt: 0,
      totalHealingDone: 0,
      playtime: 0,
    },
  };

  test('should accept minimal valid save file', () => {
    expect(SaveV1Schema.safeParse(minimalSave).success).toBe(true);
  });

  test('should reject wrong version', () => {
    const invalid = { ...minimalSave, version: '2.0.0' };
    expect(SaveV1Schema.safeParse(invalid).success).toBe(false);
  });

  test('should reject negative timestamp', () => {
    const invalid = { ...minimalSave, timestamp: -1 };
    expect(SaveV1Schema.safeParse(invalid).success).toBe(false);
  });

  test('should reject zero timestamp', () => {
    const invalid = { ...minimalSave, timestamp: 0 };
    expect(SaveV1Schema.safeParse(invalid).success).toBe(false);
  });

  test('should reject chapter < 1', () => {
    const invalid = { ...minimalSave, chapter: 0 };
    expect(SaveV1Schema.safeParse(invalid).success).toBe(false);
  });

  test('should accept chapter = 1', () => {
    const valid = { ...minimalSave, chapter: 1 };
    expect(SaveV1Schema.safeParse(valid).success).toBe(true);
  });

  test('should accept save with 10 units (max)', () => {
    const units = Array.from({ length: 10 }, (_, i) => ({
      ...minimalUnit,
      id: `unit-${i}`,
      name: `Unit ${i}`,
    }));
    const withMaxUnits = {
      ...minimalSave,
      playerData: {
        ...minimalSave.playerData,
        unitsCollected: units,
      },
    };
    expect(SaveV1Schema.safeParse(withMaxUnits).success).toBe(true);
  });

  test('should reject save with > 10 units', () => {
    const units = Array.from({ length: 11 }, (_, i) => ({
      ...minimalUnit,
      id: `unit-${i}`,
      name: `Unit ${i}`,
    }));
    const invalid = {
      ...minimalSave,
      playerData: {
        ...minimalSave.playerData,
        unitsCollected: units,
      },
    };
    expect(SaveV1Schema.safeParse(invalid).success).toBe(false);
  });

  test('should accept save with 1 active party member (min)', () => {
    const valid = {
      ...minimalSave,
      playerData: {
        ...minimalSave.playerData,
        activeParty: ['adept'],
      },
    };
    expect(SaveV1Schema.safeParse(valid).success).toBe(true);
  });

  test('should accept save with 4 active party members (max)', () => {
    const units = Array.from({ length: 4 }, (_, i) => ({
      ...minimalUnit,
      id: `unit-${i}`,
      name: `Unit ${i}`,
    }));
    const valid = {
      ...minimalSave,
      playerData: {
        ...minimalSave.playerData,
        unitsCollected: units,
        activeParty: ['unit-0', 'unit-1', 'unit-2', 'unit-3'],
      },
    };
    expect(SaveV1Schema.safeParse(valid).success).toBe(true);
  });

  test('should reject save with 0 active party members', () => {
    const invalid = {
      ...minimalSave,
      playerData: {
        ...minimalSave.playerData,
        activeParty: [],
      },
    };
    expect(SaveV1Schema.safeParse(invalid).success).toBe(false);
  });

  test('should reject save with > 4 active party members', () => {
    const invalid = {
      ...minimalSave,
      playerData: {
        ...minimalSave.playerData,
        activeParty: ['unit-1', 'unit-2', 'unit-3', 'unit-4', 'unit-5'],
      },
    };
    expect(SaveV1Schema.safeParse(invalid).success).toBe(false);
  });

  test('should reject negative gold', () => {
    const invalid = {
      ...minimalSave,
      playerData: {
        ...minimalSave.playerData,
        gold: -100,
      },
    };
    expect(SaveV1Schema.safeParse(invalid).success).toBe(false);
  });

  test('should accept zero gold', () => {
    const valid = {
      ...minimalSave,
      playerData: {
        ...minimalSave.playerData,
        gold: 0,
      },
    };
    expect(SaveV1Schema.safeParse(valid).success).toBe(true);
  });

  test('should accept save with 12 djinn collected (max)', () => {
    const djinn = Array.from({ length: 12 }, (_, i) => `djinn-${i}`);
    const valid = {
      ...minimalSave,
      playerData: {
        ...minimalSave.playerData,
        djinnCollected: djinn,
      },
    };
    expect(SaveV1Schema.safeParse(valid).success).toBe(true);
  });

  test('should reject save with > 12 djinn collected', () => {
    const djinn = Array.from({ length: 13 }, (_, i) => `djinn-${i}`);
    const invalid = {
      ...minimalSave,
      playerData: {
        ...minimalSave.playerData,
        djinnCollected: djinn,
      },
    };
    expect(SaveV1Schema.safeParse(invalid).success).toBe(false);
  });

  test('should accept save with 3 equipped djinn (max)', () => {
    const valid = {
      ...minimalSave,
      playerData: {
        ...minimalSave.playerData,
        djinnCollected: ['flint', 'granite', 'quartz'],
        equippedDjinn: ['flint', 'granite', 'quartz'],
      },
    };
    expect(SaveV1Schema.safeParse(valid).success).toBe(true);
  });

  test('should reject save with > 3 equipped djinn', () => {
    const invalid = {
      ...minimalSave,
      playerData: {
        ...minimalSave.playerData,
        djinnCollected: ['flint', 'granite', 'quartz', 'sap'],
        equippedDjinn: ['flint', 'granite', 'quartz', 'sap'],
      },
    };
    expect(SaveV1Schema.safeParse(invalid).success).toBe(false);
  });

  test('should accept save with recruitment and story flags', () => {
    const withFlags = {
      ...minimalSave,
      playerData: {
        ...minimalSave.playerData,
        recruitmentFlags: {
          'war-mage': true,
          mystic: false,
        },
        storyFlags: {
          tutorial_complete: true,
          chapter_1_started: true,
        },
      },
    };
    expect(SaveV1Schema.safeParse(withFlags).success).toBe(true);
  });

  test('should accept save with NPC states', () => {
    const withNPCs = {
      ...minimalSave,
      overworldState: {
        ...minimalSave.overworldState,
        npcStates: {
          'merchant-1': {
            defeated: false,
            dialogueSeen: true,
          },
          'guard-1': {
            defeated: true,
            questProgress: 2,
          },
        },
      },
    };
    expect(SaveV1Schema.safeParse(withNPCs).success).toBe(true);
  });

  test('should reject negative battle stats', () => {
    const invalid = {
      ...minimalSave,
      stats: {
        battlesWon: -1,
        battlesLost: 0,
        totalDamageDealt: 0,
        totalHealingDone: 0,
        playtime: 0,
      },
    };
    expect(SaveV1Schema.safeParse(invalid).success).toBe(false);
  });

  test('should reject negative playtime', () => {
    const invalid = {
      ...minimalSave,
      stats: {
        battlesWon: 0,
        battlesLost: 0,
        totalDamageDealt: 0,
        totalHealingDone: 0,
        playtime: -100,
      },
    };
    expect(SaveV1Schema.safeParse(invalid).success).toBe(false);
  });

  test('should accept save with tower stats', () => {
    const withTowerStats = {
      ...minimalSave,
      towerStats: {
        highestFloorEver: 10,
        totalRuns: 5,
        bestRunTurns: 150,
        bestRunDamageDealt: 5000,
      },
    };
    expect(SaveV1Schema.safeParse(withTowerStats).success).toBe(true);
  });

  test('should accept save without tower stats (optional)', () => {
    const withoutTower = { ...minimalSave };
    expect(SaveV1Schema.safeParse(withoutTower).success).toBe(true);
  });

  test('should accept save with equipment inventory', () => {
    const equipment = {
      id: 'iron-sword',
      name: 'Iron Sword',
      slot: 'weapon' as const,
      tier: 'iron' as const,
      cost: 200,
      statBonus: { atk: 15 },
      allowedElements: ['Venus'],
    };
    const withInventory = {
      ...minimalSave,
      playerData: {
        ...minimalSave.playerData,
        inventory: [equipment],
      },
    };
    expect(SaveV1Schema.safeParse(withInventory).success).toBe(true);
  });
});
