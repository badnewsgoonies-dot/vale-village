import type { Ability } from '@/types/Ability';
import type { Element } from '@/types/Element';
import type { Stats } from '@/types/Stats';
import type { Equipment } from '@/types/Equipment';
import {
  SLASH,
  FIREBALL,
  VOLCANO,
  FROST,
  ICE_HORN,
  GUST,
  PLASMA,
  QUAKE,
  CLAY_SPIRE,
} from './abilities';
import {
  LEATHER_VEST,
  CLOTH_CAP,
  LEATHER_BOOTS,
  IRON_SWORD,
  IRON_ARMOR,
  IRON_HELM,
  STEEL_SWORD,
  STEEL_ARMOR,
  STEEL_HELM,
  HYPER_BOOTS,
} from './equipment';

/**
 * Enemy Definition
 *
 * Enemies are similar to Units but simpler:
 * - No equipment or Djinn
 * - Fixed stats (no growth rates)
 * - Reward data for XP and Gold
 * - Optional equipment drops with chances
 */
export interface Enemy {
  id: string;
  name: string;
  level: number;
  stats: Stats;
  abilities: Ability[];
  element: Element;

  /** Base XP before level multiplier */
  baseXp: number;

  /** Base Gold before level multiplier */
  baseGold: number;

  /** Optional equipment drops with drop rates (0.0 to 1.0) */
  drops?: {
    equipment: Equipment;
    chance: number; // 0.05 = 5%, 0.10 = 10%, etc.
  }[];
}

/**
 * Enemy Catalog
 * Organized by difficulty tier
 */

// ========== TIER 1: Early Game (Levels 1-2) ==========

export const GOBLIN: Enemy = {
  id: 'goblin',
  name: 'Goblin',
  level: 1,
  stats: {
    hp: 30,
    pp: 0,
    atk: 8,
    def: 5,
    mag: 3,
    spd: 8,
  },
  abilities: [SLASH],
  element: 'Neutral',
  baseXp: 15,
  baseGold: 10,
  drops: [
    { equipment: CLOTH_CAP, chance: 0.08 }, // 8% drop rate
  ],
};

export const WILD_WOLF: Enemy = {
  id: 'wild-wolf',
  name: 'Wild Wolf',
  level: 1,
  stats: {
    hp: 25,
    pp: 0,
    atk: 10,
    def: 3,
    mag: 2,
    spd: 12,
  },
  abilities: [SLASH],
  element: 'Neutral',
  baseXp: 12,
  baseGold: 8,
  drops: [
    { equipment: LEATHER_VEST, chance: 0.10 }, // 10% drop rate
  ],
};

export const SLIME: Enemy = {
  id: 'slime',
  name: 'Slime',
  level: 2,
  stats: {
    hp: 40,
    pp: 10,
    atk: 6,
    def: 8,
    mag: 8,
    spd: 6,
  },
  abilities: [SLASH, FROST],
  element: 'Mercury',
  baseXp: 20,
  baseGold: 15,
  drops: [
    { equipment: LEATHER_BOOTS, chance: 0.07 }, // 7% drop rate
  ],
};

// ========== TIER 2: Mid Game (Levels 2-3) ==========

export const FIRE_SPRITE: Enemy = {
  id: 'fire-sprite',
  name: 'Fire Sprite',
  level: 2,
  stats: {
    hp: 45,
    pp: 15,
    atk: 8,
    def: 6,
    mag: 12,
    spd: 10,
  },
  abilities: [SLASH, FIREBALL],
  element: 'Mars',
  baseXp: 25,
  baseGold: 18,
  drops: [
    { equipment: IRON_SWORD, chance: 0.12 }, // 12% drop rate
  ],
};

export const EARTH_GOLEM: Enemy = {
  id: 'earth-golem',
  name: 'Earth Golem',
  level: 3,
  stats: {
    hp: 90,
    pp: 10,
    atk: 15,
    def: 20,
    mag: 8,
    spd: 5,
  },
  abilities: [SLASH, QUAKE],
  element: 'Venus',
  baseXp: 45,
  baseGold: 30,
  drops: [
    { equipment: IRON_ARMOR, chance: 0.15 }, // 15% drop rate
  ],
};

export const WIND_WISP: Enemy = {
  id: 'wind-wisp',
  name: 'Wind Wisp',
  level: 3,
  stats: {
    hp: 55,
    pp: 20,
    atk: 10,
    def: 8,
    mag: 16,
    spd: 18,
  },
  abilities: [GUST, PLASMA],
  element: 'Jupiter',
  baseXp: 40,
  baseGold: 25,
  drops: [
    { equipment: IRON_HELM, chance: 0.14 }, // 14% drop rate
  ],
};

// ========== TIER 3: Late Game (Levels 4-5) ==========

export const FIRE_ELEMENTAL: Enemy = {
  id: 'fire-elemental',
  name: 'Fire Elemental',
  level: 4,
  stats: {
    hp: 120,
    pp: 30,
    atk: 18,
    def: 12,
    mag: 22,
    spd: 15,
  },
  abilities: [FIREBALL, VOLCANO],
  element: 'Mars',
  baseXp: 60,
  baseGold: 40,
  drops: [
    { equipment: STEEL_SWORD, chance: 0.18 }, // 18% drop rate
  ],
};

export const ICE_GUARDIAN: Enemy = {
  id: 'ice-guardian',
  name: 'Ice Guardian',
  level: 4,
  stats: {
    hp: 140,
    pp: 25,
    atk: 16,
    def: 18,
    mag: 20,
    spd: 12,
  },
  abilities: [FROST, ICE_HORN],
  element: 'Mercury',
  baseXp: 65,
  baseGold: 45,
  drops: [
    { equipment: STEEL_ARMOR, chance: 0.17 }, // 17% drop rate
  ],
};

export const STONE_TITAN: Enemy = {
  id: 'stone-titan',
  name: 'Stone Titan',
  level: 5,
  stats: {
    hp: 180,
    pp: 20,
    atk: 25,
    def: 28,
    mag: 12,
    spd: 8,
  },
  abilities: [SLASH, QUAKE, CLAY_SPIRE],
  element: 'Venus',
  baseXp: 80,
  baseGold: 60,
  drops: [
    { equipment: STEEL_HELM, chance: 0.20 }, // 20% drop rate
  ],
};

export const STORM_LORD: Enemy = {
  id: 'storm-lord',
  name: 'Storm Lord',
  level: 5,
  stats: {
    hp: 150,
    pp: 40,
    atk: 20,
    def: 15,
    mag: 28,
    spd: 22,
  },
  abilities: [GUST, PLASMA],
  element: 'Jupiter',
  baseXp: 90,
  baseGold: 70,
  drops: [
    { equipment: HYPER_BOOTS, chance: 0.22 }, // 22% drop rate
  ],
};

// ========== BATCH 1: Basic Enemies (Levels 1-2) ==========

export const RAT: Enemy = {
  id: 'rat',
  name: 'Rat',
  level: 1,
  stats: {
    hp: 20,
    pp: 0,
    atk: 6,
    def: 3,
    mag: 2,
    spd: 10,
  },
  abilities: [SLASH],
  element: 'Neutral',
  baseXp: 10,
  baseGold: 6,
};

export const BAT: Enemy = {
  id: 'bat',
  name: 'Bat',
  level: 1,
  stats: {
    hp: 18,
    pp: 5,
    atk: 5,
    def: 2,
    mag: 4,
    spd: 14,
  },
  abilities: [SLASH, GUST],
  element: 'Jupiter',
  baseXp: 12,
  baseGold: 7,
};

export const SPIDER: Enemy = {
  id: 'spider',
  name: 'Spider',
  level: 1,
  stats: {
    hp: 22,
    pp: 0,
    atk: 7,
    def: 4,
    mag: 3,
    spd: 9,
  },
  abilities: [SLASH],
  element: 'Venus',
  baseXp: 11,
  baseGold: 7,
};

export const GRUB: Enemy = {
  id: 'grub',
  name: 'Grub',
  level: 1,
  stats: {
    hp: 28,
    pp: 0,
    atk: 4,
    def: 8,
    mag: 2,
    spd: 4,
  },
  abilities: [SLASH],
  element: 'Neutral',
  baseXp: 8,
  baseGold: 5,
};

export const WORM: Enemy = {
  id: 'worm',
  name: 'Worm',
  level: 1,
  stats: {
    hp: 24,
    pp: 5,
    atk: 5,
    def: 6,
    mag: 5,
    spd: 5,
  },
  abilities: [SLASH, QUAKE],
  element: 'Venus',
  baseXp: 10,
  baseGold: 6,
};

export const VERMIN: Enemy = {
  id: 'vermin',
  name: 'Vermin',
  level: 1,
  stats: {
    hp: 16,
    pp: 0,
    atk: 7,
    def: 2,
    mag: 2,
    spd: 11,
  },
  abilities: [SLASH],
  element: 'Neutral',
  baseXp: 9,
  baseGold: 6,
};

export const MINI_GOBLIN: Enemy = {
  id: 'mini-goblin',
  name: 'Mini-Goblin',
  level: 1,
  stats: {
    hp: 22,
    pp: 0,
    atk: 6,
    def: 4,
    mag: 2,
    spd: 7,
  },
  abilities: [SLASH],
  element: 'Neutral',
  baseXp: 11,
  baseGold: 8,
};

export const KOBOLD: Enemy = {
  id: 'kobold',
  name: 'Kobold',
  level: 1,
  stats: {
    hp: 26,
    pp: 0,
    atk: 8,
    def: 5,
    mag: 3,
    spd: 8,
  },
  abilities: [SLASH],
  element: 'Neutral',
  baseXp: 13,
  baseGold: 9,
};

export const ROACH: Enemy = {
  id: 'roach',
  name: 'Roach',
  level: 1,
  stats: {
    hp: 19,
    pp: 0,
    atk: 5,
    def: 6,
    mag: 2,
    spd: 12,
  },
  abilities: [SLASH],
  element: 'Neutral',
  baseXp: 9,
  baseGold: 6,
};

export const MOMONGA: Enemy = {
  id: 'momonga',
  name: 'Momonga',
  level: 1,
  stats: {
    hp: 21,
    pp: 0,
    atk: 6,
    def: 3,
    mag: 3,
    spd: 13,
  },
  abilities: [SLASH],
  element: 'Neutral',
  baseXp: 10,
  baseGold: 7,
};

export const EMU: Enemy = {
  id: 'emu',
  name: 'Emu',
  level: 2,
  stats: {
    hp: 35,
    pp: 0,
    atk: 10,
    def: 5,
    mag: 3,
    spd: 15,
  },
  abilities: [SLASH],
  element: 'Neutral',
  baseXp: 18,
  baseGold: 13,
};

export const SEABIRD: Enemy = {
  id: 'seabird',
  name: 'Seabird',
  level: 2,
  stats: {
    hp: 30,
    pp: 8,
    atk: 8,
    def: 4,
    mag: 7,
    spd: 16,
  },
  abilities: [SLASH, GUST],
  element: 'Jupiter',
  baseXp: 16,
  baseGold: 12,
};

export const SEAFOWL: Enemy = {
  id: 'seafowl',
  name: 'Seafowl',
  level: 2,
  stats: {
    hp: 32,
    pp: 10,
    atk: 9,
    def: 4,
    mag: 8,
    spd: 14,
  },
  abilities: [SLASH, GUST],
  element: 'Jupiter',
  baseXp: 17,
  baseGold: 12,
};

export const WILD_MUSHROOM: Enemy = {
  id: 'wild-mushroom',
  name: 'Wild Mushroom',
  level: 2,
  stats: {
    hp: 38,
    pp: 12,
    atk: 6,
    def: 9,
    mag: 9,
    spd: 6,
  },
  abilities: [SLASH, QUAKE],
  element: 'Venus',
  baseXp: 19,
  baseGold: 14,
};

export const POISON_TOAD: Enemy = {
  id: 'poison-toad',
  name: 'Poison Toad',
  level: 2,
  stats: {
    hp: 36,
    pp: 10,
    atk: 7,
    def: 7,
    mag: 8,
    spd: 7,
  },
  abilities: [SLASH, FROST],
  element: 'Mercury',
  baseXp: 18,
  baseGold: 13,
};

export const DEVIL_FROG: Enemy = {
  id: 'devil-frog',
  name: 'Devil Frog',
  level: 2,
  stats: {
    hp: 40,
    pp: 12,
    atk: 9,
    def: 6,
    mag: 10,
    spd: 8,
  },
  abilities: [SLASH, FROST],
  element: 'Mercury',
  baseXp: 20,
  baseGold: 15,
  drops: [
    { equipment: LEATHER_VEST, chance: 0.08 }, // 8% drop rate
  ],
};

export const MOLE: Enemy = {
  id: 'mole',
  name: 'Mole',
  level: 2,
  stats: {
    hp: 34,
    pp: 8,
    atk: 8,
    def: 10,
    mag: 6,
    spd: 6,
  },
  abilities: [SLASH, QUAKE],
  element: 'Venus',
  baseXp: 17,
  baseGold: 12,
};

export const MAD_MOLE: Enemy = {
  id: 'mad-mole',
  name: 'Mad Mole',
  level: 2,
  stats: {
    hp: 37,
    pp: 10,
    atk: 11,
    def: 8,
    mag: 7,
    spd: 9,
  },
  abilities: [SLASH, QUAKE],
  element: 'Venus',
  baseXp: 19,
  baseGold: 14,
};

export const MAD_VERMIN: Enemy = {
  id: 'mad-vermin',
  name: 'Mad Vermin',
  level: 2,
  stats: {
    hp: 29,
    pp: 0,
    atk: 12,
    def: 4,
    mag: 3,
    spd: 15,
  },
  abilities: [SLASH],
  element: 'Neutral',
  baseXp: 18,
  baseGold: 13,
};

export const SQUIRRELFANG: Enemy = {
  id: 'squirrelfang',
  name: 'Squirrelfang',
  level: 2,
  stats: {
    hp: 31,
    pp: 0,
    atk: 10,
    def: 5,
    mag: 4,
    spd: 14,
  },
  abilities: [SLASH],
  element: 'Neutral',
  baseXp: 17,
  baseGold: 12,
};

/**
 * All enemies indexed by ID
 */
export const ENEMIES: Record<string, Enemy> = {
  // Tier 1: Early Game (Original)
  'goblin': GOBLIN,
  'wild-wolf': WILD_WOLF,
  'slime': SLIME,

  // Tier 2: Mid Game (Original)
  'fire-sprite': FIRE_SPRITE,
  'earth-golem': EARTH_GOLEM,
  'wind-wisp': WIND_WISP,

  // Tier 3: Late Game (Original)
  'fire-elemental': FIRE_ELEMENTAL,
  'ice-guardian': ICE_GUARDIAN,
  'stone-titan': STONE_TITAN,
  'storm-lord': STORM_LORD,

  // Batch 1: Basic Enemies (Levels 1-2)
  'rat': RAT,
  'bat': BAT,
  'spider': SPIDER,
  'grub': GRUB,
  'worm': WORM,
  'vermin': VERMIN,
  'mini-goblin': MINI_GOBLIN,
  'kobold': KOBOLD,
  'roach': ROACH,
  'momonga': MOMONGA,
  'emu': EMU,
  'seabird': SEABIRD,
  'seafowl': SEAFOWL,
  'wild-mushroom': WILD_MUSHROOM,
  'poison-toad': POISON_TOAD,
  'devil-frog': DEVIL_FROG,
  'mole': MOLE,
  'mad-mole': MAD_MOLE,
  'mad-vermin': MAD_VERMIN,
  'squirrelfang': SQUIRRELFANG,
};
