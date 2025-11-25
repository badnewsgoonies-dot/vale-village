/**
 * Encounter definitions - Liberation of Vale Village (Houses 1-20)
 * These will be validated against EncounterSchema at startup
 *
 * Chapter 1: 20 Houses - The Liberation Arc
 * - Act 1: Discovery (Houses 1-7)
 * - Act 2: Resistance (Houses 8-14)
 * - Act 3: Liberation (Houses 15-20)
 *
 * LOCKED PROGRESSION: Rewards in this file must stay aligned with HOUSES_1-20_COMPLETE_PROGRESSION.md.
 * Any future changes must first update the locked spreadsheet before touching these definitions.
 *
 * SUMMARY:
 * - Pre-game: Isaac + Flint Djinn (story gift)
 * - House 1 (VS1): Garet recruit + Forge Djinn (no equipment)
 * - Houses 2-3: Mystic and Ranger story joins
 * - Houses 5, 8, 11, 14, 15, 17: New recruits (Blaze, Sentinel, Karis, Tyrell, Stormcaller, Felix)
 * - Djinn: Forge (H1), Breeze (H7), Fizz (H8), Granite (H12), Squall (H15), Bane (H18), Storm (H20)
 */
import type { Encounter } from '../schemas/EncounterSchema';

const createVs1Encounter = (id: string, name: string): Encounter => ({
  id,
  name,
  enemies: ['garet-enemy'], // Enemy version of War Mage
  difficulty: 'easy',
  reward: {
    xp: 60,
    gold: 20,
    equipment: { type: 'fixed', itemId: 'leather-cap' }, // Starter helm drop for House 1
    djinn: 'forge', // Mars T1 Djinn
    unlockUnit: 'war-mage', // Recruit Garet
  },
});

// ============================================================================
// ACT 1: DISCOVERY (Houses 1-7)
// ============================================================================

/**
 * HOUSE 1 (VS1 Tutorial)
 * - First battle, introduces combat
 * - Recruit: Garet (War Mage, Mars)
 * - Reward: Forge Djinn (Mars T1) without any equipment (locked blueprint)
 * - Milestone: First unit recruitment from battle!
 */
export const HOUSE_01_VS1: Encounter = createVs1Encounter('house-01', "House 1: Garet's Liberation");
export const VS1_GARET_ENCOUNTER: Encounter = createVs1Encounter('vs1-garet', "VS1: Garet's Liberation");

/**
 * HOUSE 2
 * - Equipment: bronze-sword (Venus)
 * - Story Event: Mystic joins after battle (auto-recruit, not from battle reward)
 */
export const HOUSE_02: Encounter = {
  id: 'house-02',
  name: 'House 2: The Bronze Trial',
  enemies: ['earth-scout', 'venus-wolf'],
  difficulty: 'easy',
  reward: {
    xp: 70,
    gold: 22,
    equipment: {
      type: 'fixed',
      itemId: 'bronze-sword',
    },
  },
};

/**
 * HOUSE 3
 * - Equipment: iron-armor (Venus/Mars shared)
 * - Story Event: Ranger joins after battle (auto-recruit, not from battle reward)
 */
export const HOUSE_03: Encounter = {
  id: 'house-03',
  name: 'House 3: Iron Bonds',
  enemies: ['flame-scout', 'mars-wolf'],
  difficulty: 'easy',
  reward: {
    xp: 80,
    gold: 24,
    equipment: {
      type: 'fixed',
      itemId: 'iron-armor',
    },
  },
};

/**
 * HOUSE 4
 * - Equipment: magic-rod (Mercury/Jupiter shared)
 */
export const HOUSE_04: Encounter = {
  id: 'house-04',
  name: 'House 4: Arcane Power',
  enemies: ['frost-scout', 'mercury-wolf'],
  difficulty: 'easy',
  reward: {
    xp: 90,
    gold: 26,
    equipment: {
      type: 'fixed',
      itemId: 'magic-rod',
    },
  },
};

/**
 * HOUSE 5
 * - Recruit: Blaze (Mars, Balanced Warrior)
 * - First recruitable Mars unit (shares equipment with Garet)
 * - Reward: Blaze is the upgrade – no equipment drop per blueprint
 */
export const HOUSE_05: Encounter = {
  id: 'house-05',
  name: 'House 5: The Blazing Warrior',
  enemies: ['gale-scout', 'jupiter-wolf'],
  difficulty: 'easy',
  reward: {
    xp: 100,
    gold: 28,
    equipment: { type: 'fixed', itemId: 'iron-sword' },
    unlockUnit: 'blaze', // Recruit Blaze (Mars Balanced Warrior)
  },
};

/**
 * HOUSE 6
 * - Equipment: steel-helm (Venus)
 */
export const HOUSE_06: Encounter = {
  id: 'house-06',
  name: 'House 6: The Steel Guardian',
  enemies: ['earth-scout', 'flame-scout', 'venus-wolf'],
  difficulty: 'medium',
  reward: {
    xp: 120,
    gold: 32,
    equipment: {
      type: 'fixed',
      itemId: 'steel-helm',
    },
  },
};

/**
 * HOUSE 7
 * - Reward: Breeze Djinn (Jupiter T1)
 * - Equipment Choice (steel-sword vs battle-axe per locked blueprint)
 * - MILESTONE: 3rd Djinn = SUMMONS UNLOCKED! (Flint + Forge + Breeze)
 */
export const HOUSE_07: Encounter = {
  id: 'house-07',
  name: 'House 7: Winds of Liberation',
  enemies: ['terra-soldier', 'venus-bear'],
  difficulty: 'medium',
  reward: {
    xp: 150,
    gold: 40,
    djinn: 'breeze', // Jupiter T1 Djinn - SUMMONS UNLOCK!
    equipment: {
      type: 'choice',
      options: ['steel-sword', 'battle-axe', 'crystal-rod'],
    },
  },
};

// ============================================================================
// ACT 2: RESISTANCE (Houses 8-14)
// ============================================================================

/**
 * HOUSE 8
 * - Reward: Fizz Djinn (Mercury T1) + Sentinel recruit (Venus Support Buffer)
 * - Milestone: Complete T1 Djinn set (4 elements) with no equipment drop
 */
export const HOUSE_08: Encounter = {
  id: 'house-08',
  name: 'House 8: The Frozen Sentinel',
  enemies: ['wind-soldier', 'jupiter-bear'],
  difficulty: 'medium',
  reward: {
    xp: 200,
    gold: 55,
    equipment: { type: 'fixed', itemId: 'steel-armor' },
    djinn: 'fizz', // Mercury T1 Djinn
    unlockUnit: 'sentinel', // Recruit Sentinel (Venus Support Buffer)
  },
};

/**
 * HOUSE 9
 * - Equipment: battle-axe (Mars)
 */
export const HOUSE_09: Encounter = {
  id: 'house-09',
  name: 'House 9: Inferno\'s Rage',
  enemies: ['tide-soldier', 'mercury-bear', 'ice-elemental'],
  difficulty: 'medium',
  reward: {
    xp: 215,
    gold: 58,
    equipment: {
      type: 'fixed',
      itemId: 'battle-axe',
    },
  },
};

/**
 * HOUSE 10
 * - No equipment/djinn rewards (progression house)
 */
export const HOUSE_10: Encounter = {
  id: 'house-10',
  name: 'House 10: The Burning Gauntlet',
  enemies: ['blaze-soldier', 'mars-bear', 'flame-elemental'],
  difficulty: 'medium',
  reward: {
    xp: 235,
    gold: 62,
    equipment: { type: 'fixed', itemId: 'silver-circlet' },
  },
};

/**
 * HOUSE 11
 * - Equipment: silver-armor (Venus)
 * - Recruit: Karis (Mercury, Versatile Scholar)
 */
export const HOUSE_11: Encounter = {
  id: 'house-11',
  name: 'House 11: The Scholar\'s Trial',
  enemies: ['stone-captain', 'rock-elemental'],
  difficulty: 'hard',
  reward: {
    xp: 255,
    gold: 68,
    equipment: {
      type: 'fixed',
      itemId: 'silver-armor',
    },
    unlockUnit: 'karis', // Recruit Karis (Mercury Versatile Scholar)
  },
};

/**
 * HOUSE 12
 * - Reward: Granite Djinn (Venus T2) only - no equipment drop per locked table
 * - MILESTONE: First T2 Djinn! (Djinn swapping strategy unlocked)
 */
export const HOUSE_12: Encounter = {
  id: 'house-12',
  name: 'House 12: The Granite Fortress',
  enemies: ['inferno-captain', 'phoenix'],
  difficulty: 'hard',
  reward: {
    xp: 275,
    gold: 72,
    equipment: { type: 'fixed', itemId: 'valkyrie-mail' },
    djinn: 'granite', // Venus T2 Djinn - POWER SPIKE
  },
};

/**
 * HOUSE 13
 * - Equipment Choice (mid-tier weapons)
 */
export const HOUSE_13: Encounter = {
  id: 'house-13',
  name: 'House 13: The Silver Strike',
  enemies: ['glacier-captain', 'leviathan'],
  difficulty: 'hard',
  reward: {
    xp: 295,
    gold: 76,
    equipment: {
      type: 'choice',
      options: ['silver-blade', 'great-axe', 'zodiac-wand'],
    },
  },
};

/**
 * HOUSE 14
 * - Equipment: hyper-boots (Jupiter)
 * - Recruit: Tyrell (Mars, Pure DPS)
 */
export const HOUSE_14: Encounter = {
  id: 'house-14',
  name: 'House 14: The Speed Demon',
  enemies: ['thunder-captain', 'thunderbird'],
  difficulty: 'hard',
  reward: {
    xp: 320,
    gold: 82,
    equipment: {
      type: 'fixed',
      itemId: 'hyper-boots',
    },
    unlockUnit: 'tyrell', // Recruit Tyrell (Mars Pure DPS)
  },
};

// ============================================================================
// ACT 3: LIBERATION (Houses 15-20)
// ============================================================================

/**
 * HOUSE 15
 * - Reward: Squall Djinn (Jupiter T2) + Stormcaller recruit
 * - Equipment Choice
 * - MILESTONE: 8 MANA/ROUND! (Stormcaller contributes 3 mana)
 */
export const HOUSE_15: Encounter = {
  id: 'house-15',
  name: 'House 15: The Storm Unleashed',
  enemies: ['terra-soldier', 'blaze-soldier', 'wind-soldier'],
  difficulty: 'hard',
  reward: {
    xp: 400,
    gold: 110,
    djinn: 'squall', // Jupiter T2 Djinn
    unlockUnit: 'stormcaller', // Recruit Stormcaller (Jupiter AoE Mage)
    equipment: {
      type: 'choice',
      options: ['mythril-armor', 'zodiac-wand', 'elemental-star'],
    },
  },
};

/**
 * HOUSE 16
 * - Equipment: mythril-blade (Venus)
 */
export const HOUSE_16: Encounter = {
  id: 'house-16',
  name: 'House 16: The Mythril Edge',
  enemies: ['lightning-commander', 'storm-elemental', 'jupiter-bear'],
  difficulty: 'boss',
  reward: {
    xp: 450,
    gold: 120,
    equipment: {
      type: 'fixed',
      itemId: 'mythril-blade',
    },
  },
};

/**
 * HOUSE 17
 * - Equipment: dragon-scales (Venus armor)
 * - Recruit: Felix (Venus, Master Warrior)
 * - MILESTONE: Full roster! (10 units total)
 */
export const HOUSE_17: Encounter = {
  id: 'house-17',
  name: 'House 17: The Master\'s Arrival',
  enemies: ['mountain-commander', 'basilisk', 'rock-elemental'],
  difficulty: 'boss',
  reward: {
    xp: 500,
    gold: 130,
    equipment: {
      type: 'fixed',
      itemId: 'dragon-scales',
    },
    unlockUnit: 'felix', // Recruit Felix (Venus Master Warrior)
  },
};

/**
 * HOUSE 18
 * - Reward: Bane Djinn (Venus T3) only - no equipment drop (locked blueprint)
 * - MILESTONE: First T3 Djinn!
 */
export const HOUSE_18: Encounter = {
  id: 'house-18',
  name: 'House 18: The Earth\'s Bane',
  enemies: ['fire-commander', 'volcano-warlord'],
  difficulty: 'boss',
  reward: {
    xp: 550,
    gold: 140,
    equipment: { type: 'fixed', itemId: 'oracles-crown' },
    djinn: 'bane', // Venus T3 Djinn
  },
};

/**
 * HOUSE 19
 * - Equipment Choice (legendary weapons)
 */
export const HOUSE_19: Encounter = {
  id: 'house-19',
  name: 'House 19: The Final Armament',
  enemies: ['storm-commander', 'hydra'],
  difficulty: 'boss',
  reward: {
    xp: 600,
    gold: 150,
    equipment: {
      type: 'choice',
      options: ['gaia-blade', 'titans-axe', 'staff-of-ages'],
    },
  },
};

/**
 * HOUSE 20 (FINALE)
 * - Reward: Storm Djinn (Jupiter T3)
 * - Equipment Choice (4 options!)
 * - MILESTONE: Final battle, full power achieved!
 */
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
    xp: 1500,
    gold: 300,
    djinn: 'storm', // Jupiter T3 Djinn - FINAL DJINN!
    equipment: {
      type: 'choice',
      options: ['sol-blade', 'titans-axe', 'staff-of-ages', 'cosmos-shield'],
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
    equipment: { type: 'none' },
  },
};

// ============================================================================
// Export all encounters
// ============================================================================

export const ENCOUNTERS: Record<string, Encounter> = {
  // Act 1: Discovery (Houses 1-7)
  'house-01': HOUSE_01_VS1,
  'vs1-garet': VS1_GARET_ENCOUNTER,
  'house-02': HOUSE_02,
  'house-03': HOUSE_03,
  'house-04': HOUSE_04,
  'house-05': HOUSE_05,
  'house-06': HOUSE_06,
  'house-07': HOUSE_07,

  // Act 2: Resistance (Houses 8-14)
  'house-08': HOUSE_08,
  'house-09': HOUSE_09,
  'house-10': HOUSE_10,
  'house-11': HOUSE_11,
  'house-12': HOUSE_12,
  'house-13': HOUSE_13,
  'house-14': HOUSE_14,

  // Act 3: Liberation (Houses 15-20)
  'house-15': HOUSE_15,
  'house-16': HOUSE_16,
  'house-17': HOUSE_17,
  'house-18': HOUSE_18,
  'house-19': HOUSE_19,
  'house-20': HOUSE_20_OVERSEER,

  // Bonus
  'training-dummy': TRAINING_DUMMY,
};

// ============================================================================
// Djinn Distribution Summary (NEW)
// ============================================================================

/**
 * DJINN REWARDS BY HOUSE (8 Total):
 *
 * PRE-GAME: Flint (Venus T1) - Story gift
 *
 * ACT 1 (Houses 1-7):
 * - House 1:  Forge (Mars T1) - First earned Djinn!
 * - House 7:  Breeze (Jupiter T1) - SUMMONS UNLOCKED! (3 Djinn total)
 *
 * ACT 2 (Houses 8-14):
 * - House 8:  Fizz (Mercury T1) - Complete T1 set (all 4 elements)
 * - House 12: Granite (Venus T2) - POWER SPIKE (first T2 Djinn)
 *
 * ACT 3 (Houses 15-20):
 * - House 15: Squall (Jupiter T2) - MANA SPIKE (8 mana/round with Stormcaller)
 * - House 18: Bane (Venus T3) - First T3 Djinn
 * - House 20: Storm (Jupiter T3) - FINALE
 *
 * RESERVED FOR FUTURE (Houses 21-40):
 * - Corona (Mars T2)
 * - Tonic (Mercury T2)
 * - Fury (Mars T3)
 * - Crystal (Mercury T3)
 */

/**
 * RECRUITMENT SCHEDULE (10 Total Units):
 *
 * PRE-GAME:
 * - Isaac (Adept, Venus) - Starter
 *
 * HOUSE 1 (VS1):
 * - Garet (War Mage, Mars) - First battle recruit!
 *
 * STORY JOINS (auto-recruit after battle):
 * - House 2: Mystic (Mercury, Healer)
 * - House 3: Ranger (Jupiter, Rogue Assassin)
 *
 * BATTLE RECRUITS:
 * - House 5:  Blaze (Mars, Balanced Warrior)
 * - House 8:  Sentinel (Venus, Support Buffer)
 * - House 11: Karis (Mercury, Versatile Scholar)
 * - House 14: Tyrell (Mars, Pure DPS)
 * - House 15: Stormcaller (Jupiter, AoE Fire Mage) - MANA SPIKE!
 * - House 17: Felix (Venus, Master Warrior) - FULL ROSTER!
 */
