/**
 * Encounter definitions - Liberation of Vale Village
 * These will be validated against EncounterSchema at startup
 *
 * Chapter 1: 20 Houses - The Liberation Arc
 * - Act 1: Discovery (Houses 1-7)
 * - Act 2: Resistance (Houses 8-14)
 * - Act 3: Liberation (Houses 15-20)
 *
 * Djinn Rewards: 12 total across houses 2, 4, 6, 8, 10, 12, 14, 16, 18, 19, 20
 * Unit Recruitments: Sentinel (House 8), Stormcaller (House 15)
 */
import type { Encounter } from '../schemas/EncounterSchema';

// ============================================================================
// ACT 1: DISCOVERY (Houses 1-7)
// ============================================================================

export const HOUSE_01_TUTORIAL: Encounter = {
  id: 'house-01',
  name: 'House 1: The First Cage',
  enemies: ['earth-scout', 'venus-wolf'],
  difficulty: 'easy',
  reward: {
    xp: 50,
    gold: 18,
    equipment: {
      type: 'fixed',
      itemId: 'wooden-sword',
    },
  },
};

export const HOUSE_02_FLINT: Encounter = {
  id: 'house-02',
  name: 'House 2: Flames of Oppression',
  enemies: ['flame-scout', 'mars-wolf'],
  difficulty: 'easy',
  reward: {
    xp: 60,
    gold: 19,
    equipment: { type: 'none' },
    djinn: 'flint', // Venus T1 Djinn
  },
};

export const HOUSE_03_ICE: Encounter = {
  id: 'house-03',
  name: 'House 3: Frozen Chains',
  enemies: ['frost-scout', 'mercury-wolf'],
  difficulty: 'easy',
  reward: {
    xp: 70,
    gold: 22,
    equipment: {
      type: 'fixed',
      itemId: 'leather-vest',
    },
  },
};

export const HOUSE_04_BREEZE: Encounter = {
  id: 'house-04',
  name: 'House 4: Winds of Change',
  enemies: ['gale-scout', 'jupiter-wolf'],
  difficulty: 'easy',
  reward: {
    xp: 80,
    gold: 24,
    equipment: { type: 'none' },
    djinn: 'breeze', // Jupiter T1 Djinn
  },
};

export const HOUSE_05_ESCALATION: Encounter = {
  id: 'house-05',
  name: 'House 5: Double Trouble',
  enemies: ['earth-scout', 'flame-scout', 'venus-wolf'],
  difficulty: 'medium',
  reward: {
    xp: 90,
    gold: 26,
    equipment: {
      type: 'fixed',
      itemId: 'bronze-sword',
    },
  },
};

export const HOUSE_06_FORGE: Encounter = {
  id: 'house-06',
  name: 'House 6: Terra\'s Wrath',
  enemies: ['terra-soldier', 'venus-bear'],
  difficulty: 'medium',
  reward: {
    xp: 100,
    gold: 28,
    equipment: { type: 'none' },
    djinn: 'forge', // Mars T1 Djinn
  },
};

export const HOUSE_07_WIND_CHALLENGE: Encounter = {
  id: 'house-07',
  name: 'House 7: The Storm Rises',
  enemies: ['wind-soldier', 'jupiter-bear'],
  difficulty: 'medium',
  reward: {
    xp: 110,
    gold: 30,
    equipment: {
      type: 'choice',
      options: ['steel-sword', 'steel-armor', 'steel-helm'],
    },
  },
};

// ============================================================================
// ACT 2: RESISTANCE (Houses 8-14)
// ============================================================================

export const HOUSE_08_SENTINEL_FIZZ: Encounter = {
  id: 'house-08',
  name: 'House 8: A Frozen Ally',
  enemies: ['tide-soldier', 'mercury-bear', 'ice-elemental'],
  difficulty: 'hard',
  reward: {
    xp: 180,
    gold: 50,
    equipment: { type: 'none' },
    djinn: 'fizz', // Mercury T1 Djinn
    unlockUnit: 'sentinel', // Recruit Sentinel
  },
};

export const HOUSE_09_INFERNO: Encounter = {
  id: 'house-09',
  name: 'House 9: Inferno\'s Fury',
  enemies: ['blaze-soldier', 'mars-bear', 'flame-elemental'],
  difficulty: 'hard',
  reward: {
    xp: 175,
    gold: 50,
    equipment: {
      type: 'choice',
      options: ['flame-sword', 'ember-armor', 'fire-boots'],
    },
  },
};

export const HOUSE_10_GRANITE: Encounter = {
  id: 'house-10',
  name: 'House 10: The Stone Captain',
  enemies: ['stone-captain', 'rock-elemental'],
  difficulty: 'hard',
  reward: {
    xp: 200,
    gold: 52,
    equipment: { type: 'none' },
    djinn: 'granite', // Venus T2 Djinn - POWER SPIKE
  },
};

export const HOUSE_11_PHOENIX: Encounter = {
  id: 'house-11',
  name: 'House 11: Rise of the Phoenix',
  enemies: ['inferno-captain', 'phoenix'],
  difficulty: 'hard',
  reward: {
    xp: 220,
    gold: 78,
    equipment: {
      type: 'choice',
      options: ['phoenix-blade', 'flame-shield', 'crimson-boots'],
    },
  },
};

export const HOUSE_12_SQUALL: Encounter = {
  id: 'house-12',
  name: 'House 12: Leviathan\'s Depths',
  enemies: ['glacier-captain', 'leviathan'],
  difficulty: 'hard',
  reward: {
    xp: 225,
    gold: 78,
    equipment: { type: 'none' },
    djinn: 'squall', // Jupiter T2 Djinn
  },
};

export const HOUSE_13_THUNDERBIRD: Encounter = {
  id: 'house-13',
  name: 'House 13: Lightning\'s Call',
  enemies: ['thunder-captain', 'thunderbird'],
  difficulty: 'hard',
  reward: {
    xp: 220,
    gold: 78,
    equipment: {
      type: 'choice',
      options: ['thunder-blade', 'storm-mail', 'gale-boots'],
    },
  },
};

export const HOUSE_14_CORONA: Encounter = {
  id: 'house-14',
  name: 'House 14: Multi-Front Assault',
  enemies: ['terra-soldier', 'blaze-soldier', 'wind-soldier'],
  difficulty: 'hard',
  reward: {
    xp: 230,
    gold: 48,
    equipment: { type: 'none' },
    djinn: 'corona', // Mars T2 Djinn
  },
};

// ============================================================================
// ACT 3: LIBERATION (Houses 15-20)
// ============================================================================

export const HOUSE_15_STORMCALLER: Encounter = {
  id: 'house-15',
  name: 'House 15: The Lightning Commander',
  enemies: ['lightning-commander', 'storm-elemental', 'jupiter-bear'],
  difficulty: 'boss',
  reward: {
    xp: 300,
    gold: 90,
    equipment: {
      type: 'choice',
      options: ['tempest-spear', 'volt-armor', 'sky-crown'],
    },
    unlockUnit: 'stormcaller', // Recruit Stormcaller
  },
};

export const HOUSE_16_TONIC: Encounter = {
  id: 'house-16',
  name: 'House 16: The Mountain\'s Shadow',
  enemies: ['mountain-commander', 'basilisk', 'rock-elemental'],
  difficulty: 'boss',
  reward: {
    xp: 320,
    gold: 90,
    equipment: { type: 'none' },
    djinn: 'tonic', // Mercury T2 Djinn
  },
};

export const HOUSE_17_WARLORDS: Encounter = {
  id: 'house-17',
  name: 'House 17: Warlord Duo',
  enemies: ['fire-commander', 'volcano-warlord'],
  difficulty: 'boss',
  reward: {
    xp: 380,
    gold: 100,
    equipment: {
      type: 'choice',
      options: ['gaia-blade', 'dragon-scales', 'terra-crown'],
    },
  },
};

export const HOUSE_18_BANE: Encounter = {
  id: 'house-18',
  name: 'House 18: Hydra\'s Lair',
  enemies: ['storm-commander', 'hydra'],
  difficulty: 'boss',
  reward: {
    xp: 400,
    gold: 110,
    equipment: { type: 'none' },
    djinn: 'bane', // Venus T3 Djinn
  },
};

export const HOUSE_19_FURY: Encounter = {
  id: 'house-19',
  name: 'House 19: Warlords\' Last Stand',
  enemies: ['granite-warlord', 'blizzard-warlord'],
  difficulty: 'boss',
  reward: {
    xp: 480,
    gold: 120,
    equipment: { type: 'none' },
    djinn: 'fury', // Mars T3 Djinn
  },
};

export const HOUSE_20_OVERSEER: Encounter = {
  id: 'house-20',
  name: 'House 20: The Overseer Falls',
  enemies: ['overseer', 'chimera', 'tempest-warlord'],
  difficulty: 'boss',
  rules: {
    phaseChange: {
      hpPct: 0.5, // At 50% HP, Overseer gets enraged
      addAbility: 'party-heal', // Overseer can heal at 50%
    },
  },
  reward: {
    xp: 1000,
    gold: 250,
    djinn: 'storm', // Jupiter T3 Djinn
    equipment: {
      type: 'choice',
      options: ['liberation-blade', 'vale-mail', 'hero-crown', 'freedom-boots'],
    },
  },
};

// ============================================================================
// BONUS ENCOUNTER - Training Mode
// ============================================================================

export const TRAINING_DUMMY: Encounter = {
  id: 'training-dummy',
  name: 'Training Arena',
  enemies: ['mercury-slime'],
  difficulty: 'easy',
  reward: {
    xp: 10,
    gold: 0,
    equipment: {
      type: 'none',
    },
  },
};

// ============================================================================
// VS1 DEMO ENCOUNTER
// ============================================================================

export const VS1_GARET: Encounter = {
  id: 'vs1-garet',
  name: 'VS1: Garet\'s Challenge',
  enemies: ['garet-enemy'],
  difficulty: 'medium',
  reward: {
    xp: 60,
    gold: 19,
    equipment: {
      type: 'none',
    },
    djinn: 'forge', // Mars T1 Djinn
    unlockUnit: 'war-mage', // Recruit Garet
  },
};

// ============================================================================
// Export all encounters
// ============================================================================

export const ENCOUNTERS: Record<string, Encounter> = {
  // Act 1: Discovery
  'house-01': HOUSE_01_TUTORIAL,
  'house-02': HOUSE_02_FLINT,
  'house-03': HOUSE_03_ICE,
  'house-04': HOUSE_04_BREEZE,
  'house-05': HOUSE_05_ESCALATION,
  'house-06': HOUSE_06_FORGE,
  'house-07': HOUSE_07_WIND_CHALLENGE,

  // Act 2: Resistance
  'house-08': HOUSE_08_SENTINEL_FIZZ,
  'house-09': HOUSE_09_INFERNO,
  'house-10': HOUSE_10_GRANITE,
  'house-11': HOUSE_11_PHOENIX,
  'house-12': HOUSE_12_SQUALL,
  'house-13': HOUSE_13_THUNDERBIRD,
  'house-14': HOUSE_14_CORONA,

  // Act 3: Liberation
  'house-15': HOUSE_15_STORMCALLER,
  'house-16': HOUSE_16_TONIC,
  'house-17': HOUSE_17_WARLORDS,
  'house-18': HOUSE_18_BANE,
  'house-19': HOUSE_19_FURY,
  'house-20': HOUSE_20_OVERSEER,

  // Bonus
  'training-dummy': TRAINING_DUMMY,

  // VS1 Demo
  'vs1-garet': VS1_GARET,
};

// ============================================================================
// Djinn Distribution Summary
// ============================================================================

/**
 * DJINN REWARDS BY HOUSE:
 *
 * House 2:  Flint (Venus T1)
 * House 4:  Breeze (Jupiter T1)
 * House 6:  Forge (Mars T1)
 * House 8:  Fizz (Mercury T1) + SENTINEL RECRUITMENT
 * House 10: Granite (Venus T2) - Power Spike
 * House 12: Squall (Jupiter T2)
 * House 14: Corona (Mars T2)
 * House 15: STORMCALLER RECRUITMENT
 * House 16: Tonic (Mercury T2)
 * House 18: Bane (Venus T3)
 * House 19: Fury (Mars T3)
 * House 20: Storm (Jupiter T3) - FINAL BOSS
 *
 * MISSING: Crystal (Mercury T3) - Award as post-boss bonus or hidden
 */
