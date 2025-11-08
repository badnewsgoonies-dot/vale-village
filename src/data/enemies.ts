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
  TEMPEST,
} from './abilities';
import {
  LEATHER_VEST,
  CLOTH_CAP,
  LEATHER_BOOTS,
  LEATHER_CAP,
  WOODEN_SWORD,
  WOODEN_AXE,
  WOODEN_STAFF,
  COTTON_SHIRT,
  BRONZE_SWORD,
  BRONZE_ARMOR,
  BRONZE_HELM,
  IRON_SWORD,
  IRON_ARMOR,
  IRON_HELM,
  IRON_BOOTS,
  STEEL_SWORD,
  STEEL_ARMOR,
  STEEL_HELM,
  STEEL_GREAVES,
  HYPER_BOOTS,
  POWER_RING,
  GUARDIAN_RING,
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
  drops: [
    { equipment: LEATHER_BOOTS, chance: 0.05 }, // 5% drop rate
  ],
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
  drops: [
    { equipment: CLOTH_CAP, chance: 0.06 }, // 6% drop rate
  ],
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
  drops: [
    { equipment: WOODEN_SWORD, chance: 0.07 }, // 7% drop rate
  ],
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
  drops: [
    { equipment: COTTON_SHIRT, chance: 0.08 }, // 8% drop rate
  ],
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
  drops: [
    { equipment: LEATHER_CAP, chance: 0.06 }, // 6% drop rate
  ],
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
  drops: [
    { equipment: LEATHER_VEST, chance: 0.05 }, // 5% drop rate
  ],
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
  drops: [
    { equipment: WOODEN_AXE, chance: 0.07 }, // 7% drop rate
  ],
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
  drops: [
    { equipment: BRONZE_SWORD, chance: 0.09 }, // 9% drop rate
  ],
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
  drops: [
    { equipment: GUARDIAN_RING, chance: 0.04 }, // 4% drop rate - accessory is rarer
  ],
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
  drops: [
    { equipment: POWER_RING, chance: 0.04 }, // 4% drop rate - accessory is rarer
  ],
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
  drops: [
    { equipment: IRON_BOOTS, chance: 0.10 }, // 10% drop rate
  ],
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
  drops: [
    { equipment: BRONZE_ARMOR, chance: 0.10 }, // 10% drop rate
  ],
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
  drops: [
    { equipment: BRONZE_HELM, chance: 0.09 }, // 9% drop rate
  ],
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
  drops: [
    { equipment: IRON_HELM, chance: 0.11 }, // 11% drop rate
  ],
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

// ========== BATCH 2: Common Enemies (Levels 2-3) ==========

export const HOBGOBLIN: Enemy = {
  id: 'hobgoblin',
  name: 'Hobgoblin',
  level: 2,
  stats: { hp: 38, pp: 0, atk: 11, def: 6, mag: 4, spd: 9 },
  abilities: [SLASH],
  element: 'Neutral',
  baseXp: 20,
  baseGold: 15,
};

export const ALEC_GOBLIN: Enemy = {
  id: 'alec-goblin',
  name: 'Alec Goblin',
  level: 2,
  stats: { hp: 36, pp: 5, atk: 10, def: 7, mag: 6, spd: 10 },
  abilities: [SLASH, FIREBALL],
  element: 'Mars',
  baseXp: 21,
  baseGold: 16,
};

export const DIRE_WOLF: Enemy = {
  id: 'dire-wolf',
  name: 'Dire Wolf',
  level: 3,
  stats: { hp: 50, pp: 0, atk: 15, def: 6, mag: 4, spd: 16 },
  abilities: [SLASH],
  element: 'Neutral',
  baseXp: 28,
  baseGold: 20,
};

export const WOLFKIN: Enemy = {
  id: 'wolfkin',
  name: 'Wolfkin',
  level: 3,
  stats: { hp: 55, pp: 8, atk: 13, def: 8, mag: 7, spd: 14 },
  abilities: [SLASH, GUST],
  element: 'Neutral',
  baseXp: 30,
  baseGold: 22,
};

export const WOLFKIN_CUB: Enemy = {
  id: 'wolfkin-cub',
  name: 'Wolfkin Cub',
  level: 3,
  stats: { hp: 48, pp: 5, atk: 11, def: 6, mag: 5, spd: 15 },
  abilities: [SLASH],
  element: 'Neutral',
  baseXp: 26,
  baseGold: 19,
};

export const DREAD_HOUND: Enemy = {
  id: 'dread-hound',
  name: 'Dread Hound',
  level: 3,
  stats: { hp: 52, pp: 12, atk: 14, def: 7, mag: 11, spd: 13 },
  abilities: [SLASH, FIREBALL],
  element: 'Mars',
  baseXp: 29,
  baseGold: 21,
};

export const RABID_BAT: Enemy = {
  id: 'rabid-bat',
  name: 'Rabid Bat',
  level: 3,
  stats: { hp: 42, pp: 10, atk: 10, def: 5, mag: 9, spd: 18 },
  abilities: [SLASH, GUST],
  element: 'Jupiter',
  baseXp: 27,
  baseGold: 20,
};

export const TARANTULA: Enemy = {
  id: 'tarantula',
  name: 'Tarantula',
  level: 3,
  stats: { hp: 46, pp: 0, atk: 12, def: 9, mag: 6, spd: 12 },
  abilities: [SLASH],
  element: 'Venus',
  baseXp: 28,
  baseGold: 20,
};

export const RECLUSE: Enemy = {
  id: 'recluse',
  name: 'Recluse',
  level: 3,
  stats: { hp: 44, pp: 8, atk: 11, def: 8, mag: 10, spd: 13 },
  abilities: [SLASH, QUAKE],
  element: 'Venus',
  baseXp: 27,
  baseGold: 20,
};

export const ARMORED_RAT: Enemy = {
  id: 'armored-rat',
  name: 'Armored Rat',
  level: 3,
  stats: { hp: 40, pp: 0, atk: 10, def: 12, mag: 4, spd: 11 },
  abilities: [SLASH],
  element: 'Neutral',
  baseXp: 26,
  baseGold: 19,
};

export const PLATED_RAT: Enemy = {
  id: 'plated-rat',
  name: 'Plated Rat',
  level: 3,
  stats: { hp: 42, pp: 0, atk: 11, def: 14, mag: 4, spd: 10 },
  abilities: [SLASH],
  element: 'Neutral',
  baseXp: 27,
  baseGold: 19,
};

export const RAT_FIGHTER: Enemy = {
  id: 'rat-fighter',
  name: 'Rat Fighter',
  level: 3,
  stats: { hp: 38, pp: 0, atk: 13, def: 8, mag: 4, spd: 14 },
  abilities: [SLASH],
  element: 'Neutral',
  baseXp: 26,
  baseGold: 19,
};

export const RAT_SOLDIER: Enemy = {
  id: 'rat-soldier',
  name: 'Rat Soldier',
  level: 3,
  stats: { hp: 40, pp: 0, atk: 12, def: 10, mag: 4, spd: 12 },
  abilities: [SLASH],
  element: 'Neutral',
  baseXp: 27,
  baseGold: 19,
};

export const RAT_WARRIOR: Enemy = {
  id: 'rat-warrior',
  name: 'Rat Warrior',
  level: 3,
  stats: { hp: 45, pp: 0, atk: 14, def: 9, mag: 5, spd: 13 },
  abilities: [SLASH],
  element: 'Neutral',
  baseXp: 28,
  baseGold: 20,
};

export const ANT_LION: Enemy = {
  id: 'ant-lion',
  name: 'Ant Lion',
  level: 3,
  stats: { hp: 48, pp: 10, atk: 13, def: 11, mag: 8, spd: 10 },
  abilities: [SLASH, QUAKE],
  element: 'Venus',
  baseXp: 29,
  baseGold: 21,
};

export const FLASH_ANT: Enemy = {
  id: 'flash-ant',
  name: 'Flash Ant',
  level: 3,
  stats: { hp: 40, pp: 12, atk: 11, def: 7, mag: 11, spd: 17 },
  abilities: [SLASH, PLASMA],
  element: 'Jupiter',
  baseXp: 28,
  baseGold: 20,
};

export const NUMB_ANT: Enemy = {
  id: 'numb-ant',
  name: 'Numb Ant',
  level: 3,
  stats: { hp: 42, pp: 10, atk: 10, def: 8, mag: 10, spd: 15 },
  abilities: [SLASH, PLASMA],
  element: 'Jupiter',
  baseXp: 27,
  baseGold: 20,
};

export const PUNCH_ANT: Enemy = {
  id: 'punch-ant',
  name: 'Punch Ant',
  level: 3,
  stats: { hp: 45, pp: 0, atk: 15, def: 9, mag: 5, spd: 12 },
  abilities: [SLASH],
  element: 'Neutral',
  baseXp: 28,
  baseGold: 20,
};

export const DRONE_BEE: Enemy = {
  id: 'drone-bee',
  name: 'Drone Bee',
  level: 3,
  stats: { hp: 38, pp: 8, atk: 10, def: 6, mag: 9, spd: 16 },
  abilities: [SLASH, GUST],
  element: 'Jupiter',
  baseXp: 26,
  baseGold: 19,
};

export const FIGHTER_BEE: Enemy = {
  id: 'fighter-bee',
  name: 'Fighter Bee',
  level: 3,
  stats: { hp: 40, pp: 10, atk: 12, def: 7, mag: 10, spd: 17 },
  abilities: [SLASH, GUST],
  element: 'Jupiter',
  baseXp: 27,
  baseGold: 20,
};

export const WARRIOR_BEE: Enemy = {
  id: 'warrior-bee',
  name: 'Warrior Bee',
  level: 3,
  stats: { hp: 43, pp: 12, atk: 13, def: 8, mag: 11, spd: 18 },
  abilities: [SLASH, GUST],
  element: 'Jupiter',
  baseXp: 28,
  baseGold: 20,
};

export const OOZE: Enemy = {
  id: 'ooze',
  name: 'Ooze',
  level: 3,
  stats: { hp: 50, pp: 15, atk: 9, def: 10, mag: 12, spd: 7 },
  abilities: [SLASH, FROST],
  element: 'Mercury',
  baseXp: 29,
  baseGold: 21,
};

export const SLIME_BEAST: Enemy = {
  id: 'slime-beast',
  name: 'Slime Beast',
  level: 3,
  stats: { hp: 55, pp: 18, atk: 10, def: 11, mag: 14, spd: 8 },
  abilities: [SLASH, FROST, ICE_HORN],
  element: 'Mercury',
  baseXp: 30,
  baseGold: 22,
};

export const SALAMANDER: Enemy = {
  id: 'salamander',
  name: 'Salamander',
  level: 3,
  stats: { hp: 47, pp: 14, atk: 12, def: 8, mag: 13, spd: 11 },
  abilities: [SLASH, FIREBALL],
  element: 'Mars',
  baseXp: 28,
  baseGold: 20,
};

export const FIRE_WORM: Enemy = {
  id: 'fire-worm',
  name: 'Fire Worm',
  level: 3,
  stats: { hp: 46, pp: 16, atk: 11, def: 9, mag: 14, spd: 9 },
  abilities: [SLASH, FIREBALL, VOLCANO],
  element: 'Mars',
  baseXp: 29,
  baseGold: 21,
};

// Cat Family
export const WILD_CAT: Enemy = {
  id: 'wild-cat',
  name: 'Wild Cat',
  level: 2,
  stats: { hp: 32, pp: 0, atk: 12, def: 5, mag: 4, spd: 16 },
  abilities: [SLASH],
  element: 'Neutral',
  baseXp: 19,
  baseGold: 14,
};

export const LYNX: Enemy = {
  id: 'lynx',
  name: 'Lynx',
  level: 2,
  stats: { hp: 34, pp: 0, atk: 13, def: 6, mag: 5, spd: 17 },
  abilities: [SLASH],
  element: 'Neutral',
  baseXp: 20,
  baseGold: 15,
};

export const PUMA: Enemy = {
  id: 'puma',
  name: 'Puma',
  level: 3,
  stats: { hp: 42, pp: 0, atk: 15, def: 7, mag: 5, spd: 18 },
  abilities: [SLASH],
  element: 'Neutral',
  baseXp: 27,
  baseGold: 20,
};

export const PANTHER: Enemy = {
  id: 'panther',
  name: 'Panther',
  level: 3,
  stats: { hp: 45, pp: 0, atk: 17, def: 8, mag: 6, spd: 19 },
  abilities: [SLASH],
  element: 'Neutral',
  baseXp: 29,
  baseGold: 21,
};

// Wasp/Hornet Family
export const HORNET: Enemy = {
  id: 'hornet',
  name: 'Hornet',
  level: 3,
  stats: { hp: 37, pp: 10, atk: 11, def: 6, mag: 10, spd: 19 },
  abilities: [SLASH, GUST],
  element: 'Jupiter',
  baseXp: 27,
  baseGold: 20,
};

export const WASP: Enemy = {
  id: 'wasp',
  name: 'Wasp',
  level: 3,
  stats: { hp: 39, pp: 12, atk: 12, def: 7, mag: 11, spd: 20 },
  abilities: [SLASH, GUST, PLASMA],
  element: 'Jupiter',
  baseXp: 28,
  baseGold: 20,
};

export const VESPID: Enemy = {
  id: 'vespid',
  name: 'Vespid',
  level: 3,
  stats: { hp: 41, pp: 14, atk: 13, def: 8, mag: 12, spd: 21 },
  abilities: [SLASH, GUST, PLASMA],
  element: 'Jupiter',
  baseXp: 29,
  baseGold: 21,
};

// ========== BATCH 3: Intermediate Enemies (Levels 3-4) ==========

export const GNOME: Enemy = {
  id: 'gnome',
  name: 'Gnome',
  level: 3,
  stats: { hp: 52, pp: 16, atk: 10, def: 12, mag: 15, spd: 10 },
  abilities: [SLASH, QUAKE],
  element: 'Venus',
  baseXp: 30,
  baseGold: 22,
};

export const GNOME_MAGE: Enemy = {
  id: 'gnome-mage',
  name: 'Gnome Mage',
  level: 3,
  stats: { hp: 48, pp: 20, atk: 9, def: 11, mag: 17, spd: 11 },
  abilities: [SLASH, QUAKE, CLAY_SPIRE],
  element: 'Venus',
  baseXp: 31,
  baseGold: 23,
};

export const GNOME_WIZARD: Enemy = {
  id: 'gnome-wizard',
  name: 'Gnome Wizard',
  level: 4,
  stats: { hp: 60, pp: 25, atk: 10, def: 13, mag: 20, spd: 12 },
  abilities: [SLASH, QUAKE, CLAY_SPIRE],
  element: 'Venus',
  baseXp: 38,
  baseGold: 28,
};

export const PIXIE: Enemy = {
  id: 'pixie',
  name: 'Pixie',
  level: 3,
  stats: { hp: 40, pp: 18, atk: 8, def: 7, mag: 16, spd: 19 },
  abilities: [SLASH, GUST],
  element: 'Jupiter',
  baseXp: 29,
  baseGold: 21,
};

export const FAERY: Enemy = {
  id: 'faery',
  name: 'Faery',
  level: 3,
  stats: { hp: 42, pp: 20, atk: 9, def: 8, mag: 17, spd: 18 },
  abilities: [SLASH, GUST, PLASMA],
  element: 'Jupiter',
  baseXp: 30,
  baseGold: 22,
};

export const WILLOWISP: Enemy = {
  id: 'willowisp',
  name: 'Willowisp',
  level: 4,
  stats: { hp: 55, pp: 24, atk: 10, def: 9, mag: 20, spd: 20 },
  abilities: [GUST, PLASMA],
  element: 'Jupiter',
  baseXp: 38,
  baseGold: 28,
};

export const GHOST: Enemy = {
  id: 'ghost',
  name: 'Ghost',
  level: 3,
  stats: { hp: 45, pp: 14, atk: 11, def: 6, mag: 13, spd: 15 },
  abilities: [SLASH],
  element: 'Neutral',
  baseXp: 28,
  baseGold: 20,
};

export const SPIRIT: Enemy = {
  id: 'spirit',
  name: 'Spirit',
  level: 3,
  stats: { hp: 43, pp: 16, atk: 10, def: 7, mag: 14, spd: 16 },
  abilities: [SLASH, GUST],
  element: 'Neutral',
  baseXp: 28,
  baseGold: 20,
};

export const WILL_HEAD: Enemy = {
  id: 'will-head',
  name: 'Will Head',
  level: 3,
  stats: { hp: 40, pp: 18, atk: 9, def: 5, mag: 15, spd: 17 },
  abilities: [FIREBALL],
  element: 'Neutral',
  baseXp: 27,
  baseGold: 20,
};

export const HORNED_GHOST: Enemy = {
  id: 'horned-ghost',
  name: 'Horned Ghost',
  level: 4,
  stats: { hp: 62, pp: 20, atk: 15, def: 9, mag: 17, spd: 16 },
  abilities: [SLASH, FIREBALL],
  element: 'Neutral',
  baseXp: 39,
  baseGold: 29,
};

export const SKELETON: Enemy = {
  id: 'skeleton',
  name: 'Skeleton',
  level: 3,
  stats: { hp: 50, pp: 0, atk: 14, def: 10, mag: 6, spd: 11 },
  abilities: [SLASH],
  element: 'Neutral',
  baseXp: 29,
  baseGold: 21,
};

export const UNDEAD: Enemy = {
  id: 'undead',
  name: 'Undead',
  level: 3,
  stats: { hp: 54, pp: 0, atk: 13, def: 11, mag: 7, spd: 9 },
  abilities: [SLASH],
  element: 'Neutral',
  baseXp: 30,
  baseGold: 22,
};

export const ZOMBIE: Enemy = {
  id: 'zombie',
  name: 'Zombie',
  level: 3,
  stats: { hp: 58, pp: 0, atk: 12, def: 12, mag: 6, spd: 7 },
  abilities: [SLASH],
  element: 'Neutral',
  baseXp: 30,
  baseGold: 22,
};

export const GHOUL: Enemy = {
  id: 'ghoul',
  name: 'Ghoul',
  level: 4,
  stats: { hp: 70, pp: 0, atk: 16, def: 13, mag: 8, spd: 12 },
  abilities: [SLASH],
  element: 'Neutral',
  baseXp: 40,
  baseGold: 30,
};

export const CANNIBAL_GHOUL: Enemy = {
  id: 'cannibal-ghoul',
  name: 'Cannibal Ghoul',
  level: 4,
  stats: { hp: 75, pp: 0, atk: 17, def: 12, mag: 8, spd: 13 },
  abilities: [SLASH],
  element: 'Neutral',
  baseXp: 41,
  baseGold: 31,
};

export const FIENDISH_GHOUL: Enemy = {
  id: 'fiendish-ghoul',
  name: 'Fiendish Ghoul',
  level: 4,
  stats: { hp: 78, pp: 12, atk: 18, def: 13, mag: 12, spd: 14 },
  abilities: [SLASH, FIREBALL],
  element: 'Neutral',
  baseXp: 42,
  baseGold: 32,
};

export const ORC: Enemy = {
  id: 'orc',
  name: 'Orc',
  level: 4,
  stats: { hp: 80, pp: 0, atk: 20, def: 14, mag: 8, spd: 11 },
  abilities: [SLASH],
  element: 'Neutral',
  baseXp: 42,
  baseGold: 32,
};

export const BRIGAND: Enemy = {
  id: 'brigand',
  name: 'Brigand',
  level: 4,
  stats: { hp: 72, pp: 0, atk: 18, def: 12, mag: 7, spd: 14 },
  abilities: [SLASH],
  element: 'Neutral',
  baseXp: 40,
  baseGold: 30,
};

export const THIEF: Enemy = {
  id: 'thief',
  name: 'Thief',
  level: 4,
  stats: { hp: 65, pp: 0, atk: 16, def: 10, mag: 8, spd: 18 },
  abilities: [SLASH],
  element: 'Neutral',
  baseXp: 39,
  baseGold: 29,
};

export const RUFFIAN: Enemy = {
  id: 'ruffian',
  name: 'Ruffian',
  level: 4,
  stats: { hp: 68, pp: 0, atk: 17, def: 11, mag: 7, spd: 15 },
  abilities: [SLASH],
  element: 'Neutral',
  baseXp: 39,
  baseGold: 29,
};

export const ASSASSIN: Enemy = {
  id: 'assassin',
  name: 'Assassin',
  level: 4,
  stats: { hp: 60, pp: 0, atk: 19, def: 9, mag: 8, spd: 20 },
  abilities: [SLASH],
  element: 'Neutral',
  baseXp: 40,
  baseGold: 30,
};

export const EARTH_LIZARD: Enemy = {
  id: 'earth-lizard',
  name: 'Earth Lizard',
  level: 4,
  stats: { hp: 75, pp: 16, atk: 16, def: 16, mag: 14, spd: 12 },
  abilities: [SLASH, QUAKE],
  element: 'Venus',
  baseXp: 41,
  baseGold: 31,
};

export const LIZARD_MAN: Enemy = {
  id: 'lizard-man',
  name: 'Lizard Man',
  level: 4,
  stats: { hp: 78, pp: 10, atk: 18, def: 14, mag: 11, spd: 13 },
  abilities: [SLASH, QUAKE],
  element: 'Neutral',
  baseXp: 41,
  baseGold: 31,
};

export const LIZARD_FIGHTER: Enemy = {
  id: 'lizard-fighter',
  name: 'Lizard Fighter',
  level: 4,
  stats: { hp: 82, pp: 8, atk: 20, def: 15, mag: 10, spd: 12 },
  abilities: [SLASH],
  element: 'Neutral',
  baseXp: 42,
  baseGold: 32,
};

export const THUNDER_LIZARD: Enemy = {
  id: 'thunder-lizard',
  name: 'Thunder Lizard',
  level: 4,
  stats: { hp: 70, pp: 18, atk: 15, def: 12, mag: 16, spd: 15 },
  abilities: [SLASH, PLASMA],
  element: 'Jupiter',
  baseXp: 40,
  baseGold: 30,
};

// ========== BATCH 4: Advanced Enemies (Levels 4-5) ==========

// Aquatic Humanoids
export const MERMAN: Enemy = {
  id: 'merman',
  name: 'Merman',
  level: 4,
  stats: { hp: 85, pp: 20, atk: 16, def: 12, mag: 18, spd: 14 },
  abilities: [SLASH, FROST, ICE_HORN],
  element: 'Mercury',
  baseXp: 42,
  baseGold: 32,
};

export const GILLMAN: Enemy = {
  id: 'gillman',
  name: 'Gillman',
  level: 4,
  stats: { hp: 78, pp: 16, atk: 17, def: 11, mag: 15, spd: 13 },
  abilities: [SLASH, FROST],
  element: 'Mercury',
  baseXp: 40,
  baseGold: 30,
};

export const GILLMAN_LORD: Enemy = {
  id: 'gillman-lord',
  name: 'Gillman Lord',
  level: 5,
  stats: { hp: 95, pp: 24, atk: 20, def: 14, mag: 20, spd: 15 },
  abilities: [SLASH, FROST, ICE_HORN],
  element: 'Mercury',
  baseXp: 52,
  baseGold: 40,
};

// Ape Family
export const APE: Enemy = {
  id: 'ape',
  name: 'Ape',
  level: 4,
  stats: { hp: 88, pp: 0, atk: 20, def: 10, mag: 6, spd: 11 },
  abilities: [SLASH],
  element: 'Neutral',
  baseXp: 41,
  baseGold: 31,
};

export const CHIMP_KING: Enemy = {
  id: 'chimp-king',
  name: 'Chimp King',
  level: 5,
  stats: { hp: 100, pp: 0, atk: 24, def: 12, mag: 7, spd: 13 },
  abilities: [SLASH],
  element: 'Neutral',
  baseXp: 54,
  baseGold: 42,
};

// Plant Enemies
export const CREEPER: Enemy = {
  id: 'creeper',
  name: 'Creeper',
  level: 4,
  stats: { hp: 70, pp: 18, atk: 12, def: 15, mag: 16, spd: 8 },
  abilities: [SLASH, QUAKE],
  element: 'Venus',
  baseXp: 39,
  baseGold: 29,
};

export const VINE: Enemy = {
  id: 'vine',
  name: 'Vine',
  level: 4,
  stats: { hp: 75, pp: 20, atk: 13, def: 16, mag: 17, spd: 7 },
  abilities: [SLASH, QUAKE],
  element: 'Venus',
  baseXp: 40,
  baseGold: 30,
};

export const BRAMBLER: Enemy = {
  id: 'brambler',
  name: 'Brambler',
  level: 5,
  stats: { hp: 85, pp: 24, atk: 15, def: 18, mag: 19, spd: 9 },
  abilities: [SLASH, QUAKE, CLAY_SPIRE],
  element: 'Venus',
  baseXp: 51,
  baseGold: 39,
};

// Dinosaur Family
export const RAPTOR: Enemy = {
  id: 'raptor',
  name: 'Raptor',
  level: 4,
  stats: { hp: 72, pp: 0, atk: 19, def: 9, mag: 6, spd: 19 },
  abilities: [SLASH],
  element: 'Neutral',
  baseXp: 40,
  baseGold: 30,
};

export const DINO: Enemy = {
  id: 'dino',
  name: 'Dino',
  level: 5,
  stats: { hp: 110, pp: 0, atk: 22, def: 16, mag: 7, spd: 12 },
  abilities: [SLASH],
  element: 'Neutral',
  baseXp: 53,
  baseGold: 41,
};

export const THUNDER_LIZARD_KING: Enemy = {
  id: 'thunder-lizard-king',
  name: 'Thunder Lizard King',
  level: 5,
  stats: { hp: 92, pp: 26, atk: 19, def: 15, mag: 22, spd: 17 },
  abilities: [SLASH, PLASMA, TEMPEST],
  element: 'Jupiter',
  baseXp: 56,
  baseGold: 44,
};

// Golem Family
export const ROCK_GOLEM: Enemy = {
  id: 'rock-golem',
  name: 'Rock Golem',
  level: 4,
  stats: { hp: 95, pp: 14, atk: 17, def: 20, mag: 13, spd: 6 },
  abilities: [SLASH, QUAKE],
  element: 'Venus',
  baseXp: 43,
  baseGold: 33,
};

export const STONE_GOLEM: Enemy = {
  id: 'stone-golem',
  name: 'Stone Golem',
  level: 5,
  stats: { hp: 115, pp: 16, atk: 20, def: 24, mag: 14, spd: 7 },
  abilities: [SLASH, QUAKE, CLAY_SPIRE],
  element: 'Venus',
  baseXp: 55,
  baseGold: 43,
};

export const IRON_GOLEM: Enemy = {
  id: 'iron-golem',
  name: 'Iron Golem',
  level: 5,
  stats: { hp: 125, pp: 12, atk: 24, def: 28, mag: 12, spd: 5 },
  abilities: [SLASH, QUAKE],
  element: 'Venus',
  baseXp: 58,
  baseGold: 46,
};

// Gargoyle Family
export const GARGOYLE: Enemy = {
  id: 'gargoyle',
  name: 'Gargoyle',
  level: 4,
  stats: { hp: 80, pp: 18, atk: 16, def: 18, mag: 15, spd: 14 },
  abilities: [SLASH, GUST],
  element: 'Jupiter',
  baseXp: 42,
  baseGold: 32,
};

export const STONE_GARGOYLE: Enemy = {
  id: 'stone-gargoyle',
  name: 'Stone Gargoyle',
  level: 5,
  stats: { hp: 90, pp: 20, atk: 18, def: 22, mag: 17, spd: 15 },
  abilities: [SLASH, GUST, PLASMA],
  element: 'Jupiter',
  baseXp: 54,
  baseGold: 42,
};

// Serpent Family
export const VIPER: Enemy = {
  id: 'viper',
  name: 'Viper',
  level: 4,
  stats: { hp: 65, pp: 0, atk: 18, def: 8, mag: 10, spd: 18 },
  abilities: [SLASH],
  element: 'Neutral',
  baseXp: 39,
  baseGold: 29,
};

export const PYTHON: Enemy = {
  id: 'python',
  name: 'Python',
  level: 5,
  stats: { hp: 88, pp: 0, atk: 21, def: 11, mag: 11, spd: 16 },
  abilities: [SLASH],
  element: 'Neutral',
  baseXp: 51,
  baseGold: 39,
};

export const KING_COBRA: Enemy = {
  id: 'king-cobra',
  name: 'King Cobra',
  level: 5,
  stats: { hp: 78, pp: 16, atk: 22, def: 10, mag: 16, spd: 20 },
  abilities: [SLASH, FROST],
  element: 'Mercury',
  baseXp: 53,
  baseGold: 41,
};

// Demon Spawn
export const IMP: Enemy = {
  id: 'imp',
  name: 'Imp',
  level: 4,
  stats: { hp: 68, pp: 22, atk: 14, def: 10, mag: 19, spd: 16 },
  abilities: [SLASH, FIREBALL],
  element: 'Mars',
  baseXp: 40,
  baseGold: 30,
};

export const DEMON_IMP: Enemy = {
  id: 'demon-imp',
  name: 'Demon Imp',
  level: 5,
  stats: { hp: 82, pp: 26, atk: 17, def: 12, mag: 22, spd: 18 },
  abilities: [SLASH, FIREBALL, VOLCANO],
  element: 'Mars',
  baseXp: 54,
  baseGold: 42,
};

// Mantis Family
export const MANTIS: Enemy = {
  id: 'mantis',
  name: 'Mantis',
  level: 5,
  stats: { hp: 75, pp: 0, atk: 23, def: 10, mag: 8, spd: 21 },
  abilities: [SLASH],
  element: 'Neutral',
  baseXp: 52,
  baseGold: 40,
};

export const SCYTHE_MANTIS: Enemy = {
  id: 'scythe-mantis',
  name: 'Scythe Mantis',
  level: 5,
  stats: { hp: 72, pp: 0, atk: 26, def: 9, mag: 8, spd: 22 },
  abilities: [SLASH],
  element: 'Neutral',
  baseXp: 55,
  baseGold: 43,
};

// ========== BATCH 5: Elite Enemies (Levels 5-6) ==========

// Minotaur Family
export const MINOTAUR: Enemy = {
  id: 'minotaur',
  name: 'Minotaur',
  level: 5,
  stats: { hp: 120, pp: 0, atk: 28, def: 16, mag: 8, spd: 10 },
  abilities: [SLASH],
  element: 'Neutral',
  baseXp: 60,
  baseGold: 48,
};

export const BULL_MINOTAUR: Enemy = {
  id: 'bull-minotaur',
  name: 'Bull Minotaur',
  level: 6,
  stats: { hp: 140, pp: 0, atk: 32, def: 18, mag: 9, spd: 11 },
  abilities: [SLASH],
  element: 'Neutral',
  baseXp: 70,
  baseGold: 56,
};

// Troll Family
export const TROLL: Enemy = {
  id: 'troll',
  name: 'Troll',
  level: 5,
  stats: { hp: 130, pp: 0, atk: 24, def: 20, mag: 7, spd: 8 },
  abilities: [SLASH],
  element: 'Neutral',
  baseXp: 58,
  baseGold: 46,
};

export const CAVE_TROLL: Enemy = {
  id: 'cave-troll',
  name: 'Cave Troll',
  level: 6,
  stats: { hp: 150, pp: 18, atk: 28, def: 24, mag: 16, spd: 9 },
  abilities: [SLASH, QUAKE],
  element: 'Venus',
  baseXp: 72,
  baseGold: 58,
};

export const MOUNTAIN_TROLL: Enemy = {
  id: 'mountain-troll',
  name: 'Mountain Troll',
  level: 6,
  stats: { hp: 160, pp: 16, atk: 30, def: 26, mag: 14, spd: 8 },
  abilities: [SLASH, CLAY_SPIRE],
  element: 'Venus',
  baseXp: 75,
  baseGold: 60,
};

// Orc Warriors
export const ORC_WARRIOR: Enemy = {
  id: 'orc-warrior',
  name: 'Orc Warrior',
  level: 5,
  stats: { hp: 105, pp: 0, atk: 26, def: 14, mag: 7, spd: 12 },
  abilities: [SLASH],
  element: 'Neutral',
  baseXp: 56,
  baseGold: 44,
};

export const ORC_BERSERKER: Enemy = {
  id: 'orc-berserker',
  name: 'Orc Berserker',
  level: 6,
  stats: { hp: 118, pp: 0, atk: 34, def: 12, mag: 7, spd: 14 },
  abilities: [SLASH],
  element: 'Neutral',
  baseXp: 68,
  baseGold: 54,
};

export const ORC_LORD: Enemy = {
  id: 'orc-lord',
  name: 'Orc Lord',
  level: 6,
  stats: { hp: 135, pp: 20, atk: 30, def: 18, mag: 16, spd: 13 },
  abilities: [SLASH, FIREBALL],
  element: 'Mars',
  baseXp: 74,
  baseGold: 59,
};

// Undead Elite
export const MUMMY: Enemy = {
  id: 'mummy',
  name: 'Mummy',
  level: 5,
  stats: { hp: 98, pp: 22, atk: 20, def: 18, mag: 18, spd: 10 },
  abilities: [SLASH, FIREBALL],
  element: 'Mars',
  baseXp: 57,
  baseGold: 45,
};

export const CURSED_MUMMY: Enemy = {
  id: 'cursed-mummy',
  name: 'Cursed Mummy',
  level: 6,
  stats: { hp: 115, pp: 26, atk: 23, def: 20, mag: 21, spd: 11 },
  abilities: [SLASH, FIREBALL, VOLCANO],
  element: 'Mars',
  baseXp: 71,
  baseGold: 57,
};

export const WIGHT: Enemy = {
  id: 'wight',
  name: 'Wight',
  level: 6,
  stats: { hp: 108, pp: 28, atk: 22, def: 16, mag: 23, spd: 14 },
  abilities: [SLASH, FROST, ICE_HORN],
  element: 'Mercury',
  baseXp: 69,
  baseGold: 55,
};

export const WRAITH: Enemy = {
  id: 'wraith',
  name: 'Wraith',
  level: 6,
  stats: { hp: 95, pp: 30, atk: 20, def: 14, mag: 25, spd: 18 },
  abilities: [SLASH, PLASMA, TEMPEST],
  element: 'Jupiter',
  baseXp: 73,
  baseGold: 58,
};

// Harpy Family
export const HARPY: Enemy = {
  id: 'harpy',
  name: 'Harpy',
  level: 5,
  stats: { hp: 85, pp: 24, atk: 21, def: 12, mag: 20, spd: 20 },
  abilities: [SLASH, GUST, PLASMA],
  element: 'Jupiter',
  baseXp: 55,
  baseGold: 43,
};

export const HARPY_QUEEN: Enemy = {
  id: 'harpy-queen',
  name: 'Harpy Queen',
  level: 6,
  stats: { hp: 100, pp: 28, atk: 24, def: 14, mag: 24, spd: 22 },
  abilities: [SLASH, GUST, PLASMA, TEMPEST],
  element: 'Jupiter',
  baseXp: 76,
  baseGold: 61,
};

// Gryphon Family
export const GRYPHON: Enemy = {
  id: 'gryphon',
  name: 'Gryphon',
  level: 6,
  stats: { hp: 125, pp: 22, atk: 28, def: 20, mag: 19, spd: 18 },
  abilities: [SLASH, GUST, PLASMA],
  element: 'Jupiter',
  baseXp: 74,
  baseGold: 59,
};

export const GRAND_GRYPHON: Enemy = {
  id: 'grand-gryphon',
  name: 'Grand Gryphon',
  level: 6,
  stats: { hp: 138, pp: 26, atk: 31, def: 22, mag: 22, spd: 19 },
  abilities: [SLASH, GUST, PLASMA, TEMPEST],
  element: 'Jupiter',
  baseXp: 78,
  baseGold: 62,
};

// Wyvern Family
export const WYVERN: Enemy = {
  id: 'wyvern',
  name: 'Wyvern',
  level: 6,
  stats: { hp: 130, pp: 24, atk: 29, def: 18, mag: 20, spd: 17 },
  abilities: [SLASH, FIREBALL, VOLCANO],
  element: 'Mars',
  baseXp: 75,
  baseGold: 60,
};

export const FIRE_WYVERN: Enemy = {
  id: 'fire-wyvern',
  name: 'Fire Wyvern',
  level: 6,
  stats: { hp: 135, pp: 28, atk: 30, def: 19, mag: 24, spd: 16 },
  abilities: [SLASH, FIREBALL, VOLCANO],
  element: 'Mars',
  baseXp: 77,
  baseGold: 61,
};

export const THUNDER_WYVERN: Enemy = {
  id: 'thunder-wyvern',
  name: 'Thunder Wyvern',
  level: 6,
  stats: { hp: 128, pp: 30, atk: 28, def: 17, mag: 26, spd: 19 },
  abilities: [SLASH, PLASMA, TEMPEST],
  element: 'Jupiter',
  baseXp: 76,
  baseGold: 61,
};

// Scorpion Family
export const SCORPION: Enemy = {
  id: 'scorpion',
  name: 'Scorpion',
  level: 5,
  stats: { hp: 90, pp: 18, atk: 24, def: 16, mag: 15, spd: 15 },
  abilities: [SLASH, FROST],
  element: 'Mercury',
  baseXp: 54,
  baseGold: 42,
};

export const DEATH_SCORPION: Enemy = {
  id: 'death-scorpion',
  name: 'Death Scorpion',
  level: 6,
  stats: { hp: 110, pp: 22, atk: 28, def: 18, mag: 18, spd: 16 },
  abilities: [SLASH, FROST, ICE_HORN],
  element: 'Mercury',
  baseXp: 72,
  baseGold: 58,
};

// Basilisk Family
export const BASILISK: Enemy = {
  id: 'basilisk',
  name: 'Basilisk',
  level: 6,
  stats: { hp: 118, pp: 24, atk: 26, def: 22, mag: 20, spd: 14 },
  abilities: [SLASH, QUAKE, CLAY_SPIRE],
  element: 'Venus',
  baseXp: 73,
  baseGold: 58,
};

export const KING_BASILISK: Enemy = {
  id: 'king-basilisk',
  name: 'King Basilisk',
  level: 6,
  stats: { hp: 132, pp: 28, atk: 29, def: 24, mag: 23, spd: 15 },
  abilities: [SLASH, QUAKE, CLAY_SPIRE],
  element: 'Venus',
  baseXp: 77,
  baseGold: 62,
};

// ========== BATCH 6: High-Level Enemies (Levels 6-8) ==========

// Dragon Family
export const DRAGON: Enemy = {
  id: 'dragon',
  name: 'Dragon',
  level: 7,
  stats: { hp: 180, pp: 32, atk: 35, def: 26, mag: 28, spd: 18 },
  abilities: [SLASH, FIREBALL, VOLCANO],
  element: 'Mars',
  baseXp: 95,
  baseGold: 76,
};

export const FIRE_DRAGON: Enemy = {
  id: 'fire-dragon',
  name: 'Fire Dragon',
  level: 7,
  stats: { hp: 195, pp: 36, atk: 38, def: 28, mag: 32, spd: 17 },
  abilities: [SLASH, FIREBALL, VOLCANO],
  element: 'Mars',
  baseXp: 100,
  baseGold: 80,
};

export const ICE_DRAGON: Enemy = {
  id: 'ice-dragon',
  name: 'Ice Dragon',
  level: 7,
  stats: { hp: 190, pp: 38, atk: 36, def: 30, mag: 33, spd: 16 },
  abilities: [SLASH, FROST, ICE_HORN],
  element: 'Mercury',
  baseXp: 98,
  baseGold: 78,
};

export const STORM_DRAGON: Enemy = {
  id: 'storm-dragon',
  name: 'Storm Dragon',
  level: 8,
  stats: { hp: 200, pp: 40, atk: 37, def: 29, mag: 35, spd: 20 },
  abilities: [SLASH, PLASMA, TEMPEST],
  element: 'Jupiter',
  baseXp: 105,
  baseGold: 84,
};

export const EARTH_DRAGON: Enemy = {
  id: 'earth-dragon',
  name: 'Earth Dragon',
  level: 8,
  stats: { hp: 220, pp: 34, atk: 40, def: 35, mag: 30, spd: 14 },
  abilities: [SLASH, QUAKE, CLAY_SPIRE],
  element: 'Venus',
  baseXp: 110,
  baseGold: 88,
};

// Demon Family
export const DEMON: Enemy = {
  id: 'demon',
  name: 'Demon',
  level: 7,
  stats: { hp: 170, pp: 36, atk: 33, def: 22, mag: 32, spd: 21 },
  abilities: [SLASH, FIREBALL, VOLCANO],
  element: 'Mars',
  baseXp: 96,
  baseGold: 77,
};

export const ARCH_DEMON: Enemy = {
  id: 'arch-demon',
  name: 'Arch Demon',
  level: 8,
  stats: { hp: 195, pp: 42, atk: 38, def: 25, mag: 38, spd: 22 },
  abilities: [SLASH, FIREBALL, VOLCANO],
  element: 'Mars',
  baseXp: 108,
  baseGold: 86,
};

export const SHADOW_DEMON: Enemy = {
  id: 'shadow-demon',
  name: 'Shadow Demon',
  level: 8,
  stats: { hp: 175, pp: 44, atk: 36, def: 23, mag: 40, spd: 24 },
  abilities: [SLASH, PLASMA, TEMPEST],
  element: 'Jupiter',
  baseXp: 106,
  baseGold: 85,
};

// Chimera Family
export const CHIMERA: Enemy = {
  id: 'chimera',
  name: 'Chimera',
  level: 7,
  stats: { hp: 185, pp: 34, atk: 36, def: 24, mag: 30, spd: 19 },
  abilities: [SLASH, FIREBALL, VOLCANO],
  element: 'Mars',
  baseXp: 97,
  baseGold: 78,
};

export const GRAND_CHIMERA: Enemy = {
  id: 'grand-chimera',
  name: 'Grand Chimera',
  level: 8,
  stats: { hp: 210, pp: 38, atk: 40, def: 27, mag: 34, spd: 20 },
  abilities: [SLASH, FIREBALL, VOLCANO],
  element: 'Mars',
  baseXp: 109,
  baseGold: 87,
};

// Phoenix Family
export const PHOENIX: Enemy = {
  id: 'phoenix',
  name: 'Phoenix',
  level: 7,
  stats: { hp: 165, pp: 40, atk: 32, def: 20, mag: 36, spd: 23 },
  abilities: [SLASH, FIREBALL, VOLCANO],
  element: 'Mars',
  baseXp: 99,
  baseGold: 79,
};

export const DARK_PHOENIX: Enemy = {
  id: 'dark-phoenix',
  name: 'Dark Phoenix',
  level: 8,
  stats: { hp: 180, pp: 46, atk: 35, def: 22, mag: 42, spd: 25 },
  abilities: [SLASH, FIREBALL, VOLCANO],
  element: 'Mars',
  baseXp: 112,
  baseGold: 90,
};

// Fenrir Family
export const FENRIR: Enemy = {
  id: 'fenrir',
  name: 'Fenrir',
  level: 7,
  stats: { hp: 175, pp: 30, atk: 40, def: 20, mag: 24, spd: 26 },
  abilities: [SLASH, FROST],
  element: 'Mercury',
  baseXp: 98,
  baseGold: 78,
};

export const FROST_FENRIR: Enemy = {
  id: 'frost-fenrir',
  name: 'Frost Fenrir',
  level: 8,
  stats: { hp: 190, pp: 34, atk: 44, def: 22, mag: 28, spd: 28 },
  abilities: [SLASH, FROST, ICE_HORN],
  element: 'Mercury',
  baseXp: 107,
  baseGold: 86,
};

// Hydra Family
export const HYDRA: Enemy = {
  id: 'hydra',
  name: 'Hydra',
  level: 8,
  stats: { hp: 240, pp: 36, atk: 38, def: 28, mag: 32, spd: 15 },
  abilities: [SLASH, FROST, ICE_HORN],
  element: 'Mercury',
  baseXp: 115,
  baseGold: 92,
};

export const KING_HYDRA: Enemy = {
  id: 'king-hydra',
  name: 'King Hydra',
  level: 8,
  stats: { hp: 260, pp: 40, atk: 42, def: 30, mag: 36, spd: 16 },
  abilities: [SLASH, FROST, ICE_HORN],
  element: 'Mercury',
  baseXp: 120,
  baseGold: 96,
};

// Golem Elite
export const CRYSTAL_GOLEM: Enemy = {
  id: 'crystal-golem',
  name: 'Crystal Golem',
  level: 7,
  stats: { hp: 200, pp: 28, atk: 34, def: 32, mag: 26, spd: 10 },
  abilities: [SLASH, QUAKE, CLAY_SPIRE],
  element: 'Venus',
  baseXp: 101,
  baseGold: 81,
};

export const DIAMOND_GOLEM: Enemy = {
  id: 'diamond-golem',
  name: 'Diamond Golem',
  level: 8,
  stats: { hp: 230, pp: 30, atk: 38, def: 38, mag: 28, spd: 11 },
  abilities: [SLASH, QUAKE, CLAY_SPIRE],
  element: 'Venus',
  baseXp: 118,
  baseGold: 94,
};

// Elemental Lords
export const FLAME_LORD: Enemy = {
  id: 'flame-lord',
  name: 'Flame Lord',
  level: 7,
  stats: { hp: 168, pp: 42, atk: 30, def: 24, mag: 38, spd: 20 },
  abilities: [SLASH, FIREBALL, VOLCANO],
  element: 'Mars',
  baseXp: 100,
  baseGold: 80,
};

export const FROST_LORD: Enemy = {
  id: 'frost-lord',
  name: 'Frost Lord',
  level: 7,
  stats: { hp: 172, pp: 40, atk: 28, def: 28, mag: 37, spd: 18 },
  abilities: [SLASH, FROST, ICE_HORN],
  element: 'Mercury',
  baseXp: 99,
  baseGold: 79,
};

export const GALE_LORD: Enemy = {
  id: 'gale-lord',
  name: 'Gale Lord',
  level: 8,
  stats: { hp: 165, pp: 44, atk: 32, def: 22, mag: 40, spd: 26 },
  abilities: [SLASH, PLASMA, TEMPEST],
  element: 'Jupiter',
  baseXp: 107,
  baseGold: 86,
};

export const QUAKE_LORD: Enemy = {
  id: 'quake-lord',
  name: 'Quake Lord',
  level: 8,
  stats: { hp: 205, pp: 38, atk: 35, def: 34, mag: 35, spd: 16 },
  abilities: [SLASH, QUAKE, CLAY_SPIRE],
  element: 'Venus',
  baseXp: 111,
  baseGold: 89,
};

// Ancient Beasts
export const BEHEMOTH: Enemy = {
  id: 'behemoth',
  name: 'Behemoth',
  level: 8,
  stats: { hp: 250, pp: 0, atk: 46, def: 32, mag: 12, spd: 12 },
  abilities: [SLASH],
  element: 'Neutral',
  baseXp: 116,
  baseGold: 93,
};

export const LEVIATHAN: Enemy = {
  id: 'leviathan',
  name: 'Leviathan',
  level: 8,
  stats: { hp: 235, pp: 42, atk: 40, def: 28, mag: 38, spd: 17 },
  abilities: [SLASH, FROST, ICE_HORN],
  element: 'Mercury',
  baseXp: 119,
  baseGold: 95,
};

// ========== BATCH 7: Late-Game Enemies (Levels 8-10) ==========

// Lich Family
export const LICH: Enemy = {
  id: 'lich',
  name: 'Lich',
  level: 8,
  stats: { hp: 190, pp: 50, atk: 32, def: 26, mag: 44, spd: 20 },
  abilities: [SLASH, FROST, ICE_HORN],
  element: 'Mercury',
  baseXp: 122,
  baseGold: 98,
};

export const ARCH_LICH: Enemy = {
  id: 'arch-lich',
  name: 'Arch Lich',
  level: 9,
  stats: { hp: 210, pp: 56, atk: 36, def: 28, mag: 50, spd: 22 },
  abilities: [SLASH, FROST, ICE_HORN],
  element: 'Mercury',
  baseXp: 145,
  baseGold: 116,
};

export const DEATH_LICH: Enemy = {
  id: 'death-lich',
  name: 'Death Lich',
  level: 10,
  stats: { hp: 230, pp: 62, atk: 40, def: 30, mag: 56, spd: 24 },
  abilities: [SLASH, FROST, ICE_HORN],
  element: 'Mercury',
  baseXp: 175,
  baseGold: 140,
};

// Ancient Golems
export const GRAND_GOLEM: Enemy = {
  id: 'grand-golem',
  name: 'Grand Golem',
  level: 8,
  stats: { hp: 270, pp: 32, atk: 42, def: 42, mag: 30, spd: 12 },
  abilities: [SLASH, QUAKE, CLAY_SPIRE],
  element: 'Venus',
  baseXp: 125,
  baseGold: 100,
};

export const TITAN_GOLEM: Enemy = {
  id: 'titan-golem',
  name: 'Titan Golem',
  level: 9,
  stats: { hp: 310, pp: 36, atk: 48, def: 48, mag: 32, spd: 13 },
  abilities: [SLASH, QUAKE, CLAY_SPIRE],
  element: 'Venus',
  baseXp: 152,
  baseGold: 122,
};

export const COLOSSUS: Enemy = {
  id: 'colossus',
  name: 'Colossus',
  level: 10,
  stats: { hp: 350, pp: 40, atk: 54, def: 54, mag: 34, spd: 14 },
  abilities: [SLASH, QUAKE, CLAY_SPIRE],
  element: 'Venus',
  baseXp: 180,
  baseGold: 144,
};

// Slayer Family
export const SLAYER: Enemy = {
  id: 'slayer',
  name: 'Slayer',
  level: 8,
  stats: { hp: 185, pp: 0, atk: 48, def: 24, mag: 14, spd: 24 },
  abilities: [SLASH],
  element: 'Neutral',
  baseXp: 120,
  baseGold: 96,
};

export const DEATH_SLAYER: Enemy = {
  id: 'death-slayer',
  name: 'Death Slayer',
  level: 9,
  stats: { hp: 205, pp: 0, atk: 56, def: 26, mag: 16, spd: 26 },
  abilities: [SLASH],
  element: 'Neutral',
  baseXp: 148,
  baseGold: 118,
};

export const EXECUTIONER: Enemy = {
  id: 'executioner',
  name: 'Executioner',
  level: 10,
  stats: { hp: 225, pp: 0, atk: 64, def: 28, mag: 18, spd: 28 },
  abilities: [SLASH],
  element: 'Neutral',
  baseXp: 178,
  baseGold: 142,
};

// Ancient Dragons
export const ANCIENT_DRAGON: Enemy = {
  id: 'ancient-dragon',
  name: 'Ancient Dragon',
  level: 9,
  stats: { hp: 280, pp: 48, atk: 50, def: 36, mag: 44, spd: 22 },
  abilities: [SLASH, FIREBALL, VOLCANO],
  element: 'Mars',
  baseXp: 155,
  baseGold: 124,
};

export const ELDER_DRAGON: Enemy = {
  id: 'elder-dragon',
  name: 'Elder Dragon',
  level: 10,
  stats: { hp: 320, pp: 54, atk: 56, def: 40, mag: 50, spd: 24 },
  abilities: [SLASH, FIREBALL, VOLCANO],
  element: 'Mars',
  baseXp: 185,
  baseGold: 148,
};

// Wargold's Forces
export const WARGOLD_SOLDIER: Enemy = {
  id: 'wargold-soldier',
  name: 'Wargold Soldier',
  level: 9,
  stats: { hp: 220, pp: 0, atk: 52, def: 32, mag: 18, spd: 20 },
  abilities: [SLASH],
  element: 'Neutral',
  baseXp: 150,
  baseGold: 120,
};

export const WARGOLD_CAPTAIN: Enemy = {
  id: 'wargold-captain',
  name: 'Wargold Captain',
  level: 9,
  stats: { hp: 240, pp: 34, atk: 54, def: 34, mag: 32, spd: 21 },
  abilities: [SLASH, FIREBALL],
  element: 'Mars',
  baseXp: 158,
  baseGold: 126,
};

export const WARGOLD_KNIGHT: Enemy = {
  id: 'wargold-knight',
  name: 'Wargold Knight',
  level: 10,
  stats: { hp: 280, pp: 38, atk: 58, def: 40, mag: 36, spd: 22 },
  abilities: [SLASH, FIREBALL, VOLCANO],
  element: 'Mars',
  baseXp: 182,
  baseGold: 146,
};

// Legendary Beasts
export const CERBERUS: Enemy = {
  id: 'cerberus',
  name: 'Cerberus',
  level: 9,
  stats: { hp: 255, pp: 40, atk: 54, def: 30, mag: 38, spd: 25 },
  abilities: [SLASH, FIREBALL, VOLCANO],
  element: 'Mars',
  baseXp: 160,
  baseGold: 128,
};

export const KRAKEN: Enemy = {
  id: 'kraken',
  name: 'Kraken',
  level: 9,
  stats: { hp: 290, pp: 46, atk: 48, def: 34, mag: 42, spd: 19 },
  abilities: [SLASH, FROST, ICE_HORN],
  element: 'Mercury',
  baseXp: 162,
  baseGold: 130,
};

export const THUNDERBIRD: Enemy = {
  id: 'thunderbird',
  name: 'Thunderbird',
  level: 10,
  stats: { hp: 245, pp: 52, atk: 50, def: 28, mag: 48, spd: 30 },
  abilities: [SLASH, PLASMA, TEMPEST],
  element: 'Jupiter',
  baseXp: 188,
  baseGold: 150,
};

// Celestial Beings
export const SERAPHIM: Enemy = {
  id: 'seraphim',
  name: 'Seraphim',
  level: 9,
  stats: { hp: 235, pp: 54, atk: 44, def: 32, mag: 50, spd: 27 },
  abilities: [SLASH, PLASMA, TEMPEST],
  element: 'Jupiter',
  baseXp: 165,
  baseGold: 132,
};

export const ARCHANGEL: Enemy = {
  id: 'archangel',
  name: 'Archangel',
  level: 10,
  stats: { hp: 260, pp: 60, atk: 48, def: 36, mag: 56, spd: 29 },
  abilities: [SLASH, PLASMA, TEMPEST],
  element: 'Jupiter',
  baseXp: 190,
  baseGold: 152,
};

// Elite Demons
export const DEMON_LORD: Enemy = {
  id: 'demon-lord',
  name: 'Demon Lord',
  level: 9,
  stats: { hp: 270, pp: 50, atk: 52, def: 30, mag: 46, spd: 23 },
  abilities: [SLASH, FIREBALL, VOLCANO],
  element: 'Mars',
  baseXp: 168,
  baseGold: 134,
};

export const SHADOW_LORD: Enemy = {
  id: 'shadow-lord',
  name: 'Shadow Lord',
  level: 10,
  stats: { hp: 265, pp: 56, atk: 50, def: 32, mag: 52, spd: 26 },
  abilities: [SLASH, FROST, ICE_HORN],
  element: 'Mercury',
  baseXp: 192,
  baseGold: 154,
};

// Primordial Forces
export const CHAOS_TITAN: Enemy = {
  id: 'chaos-titan',
  name: 'Chaos Titan',
  level: 10,
  stats: { hp: 340, pp: 48, atk: 60, def: 44, mag: 42, spd: 18 },
  abilities: [SLASH, QUAKE, CLAY_SPIRE],
  element: 'Venus',
  baseXp: 195,
  baseGold: 156,
};

export const VOID_WYRM: Enemy = {
  id: 'void-wyrm',
  name: 'Void Wyrm',
  level: 10,
  stats: { hp: 300, pp: 58, atk: 54, def: 38, mag: 54, spd: 25 },
  abilities: [SLASH, PLASMA, TEMPEST],
  element: 'Jupiter',
  baseXp: 198,
  baseGold: 158,
};

export const INFERNO_KING: Enemy = {
  id: 'inferno-king',
  name: 'Inferno King',
  level: 10,
  stats: { hp: 310, pp: 56, atk: 56, def: 36, mag: 52, spd: 23 },
  abilities: [SLASH, FIREBALL, VOLCANO],
  element: 'Mars',
  baseXp: 200,
  baseGold: 160,
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

  // Batch 2: Common Enemies (Levels 2-3)
  'hobgoblin': HOBGOBLIN,
  'dire-wolf': DIRE_WOLF,
  'armored-rat': ARMORED_RAT,
  'plated-rat': PLATED_RAT,
  'rat-fighter': RAT_FIGHTER,
  'rat-soldier': RAT_SOLDIER,
  'rat-warrior': RAT_WARRIOR,
  'ant-lion': ANT_LION,
  'flash-ant': FLASH_ANT,
  'numb-ant': NUMB_ANT,
  'punch-ant': PUNCH_ANT,
  'drone-bee': DRONE_BEE,
  'fighter-bee': FIGHTER_BEE,
  'warrior-bee': WARRIOR_BEE,
  'ooze': OOZE,
  'slime-beast': SLIME_BEAST,
  'salamander': SALAMANDER,
  'fire-worm': FIRE_WORM,
  'wild-cat': WILD_CAT,
  'lynx': LYNX,
  'puma': PUMA,
  'panther': PANTHER,
  'hornet': HORNET,
  'wasp': WASP,
  'vespid': VESPID,

  // Batch 3: Intermediate Enemies (Levels 3-4)
  'gnome': GNOME,
  'gnome-mage': GNOME_MAGE,
  'gnome-wizard': GNOME_WIZARD,
  'pixie': PIXIE,
  'faery': FAERY,
  'willowisp': WILLOWISP,
  'ghost': GHOST,
  'spirit': SPIRIT,
  'will-head': WILL_HEAD,
  'horned-ghost': HORNED_GHOST,
  'skeleton': SKELETON,
  'undead': UNDEAD,
  'zombie': ZOMBIE,
  'ghoul': GHOUL,
  'cannibal-ghoul': CANNIBAL_GHOUL,
  'fiendish-ghoul': FIENDISH_GHOUL,
  'orc': ORC,
  'brigand': BRIGAND,
  'thief': THIEF,
  'ruffian': RUFFIAN,
  'assassin': ASSASSIN,
  'earth-lizard': EARTH_LIZARD,
  'lizard-man': LIZARD_MAN,
  'lizard-fighter': LIZARD_FIGHTER,
  'thunder-lizard': THUNDER_LIZARD,

  // Batch 4: Advanced Enemies (Levels 4-5)
  'merman': MERMAN,
  'gillman': GILLMAN,
  'gillman-lord': GILLMAN_LORD,
  'ape': APE,
  'chimp-king': CHIMP_KING,
  'creeper': CREEPER,
  'vine': VINE,
  'brambler': BRAMBLER,
  'raptor': RAPTOR,
  'dino': DINO,
  'thunder-lizard-king': THUNDER_LIZARD_KING,
  'rock-golem': ROCK_GOLEM,
  'stone-golem': STONE_GOLEM,
  'iron-golem': IRON_GOLEM,
  'gargoyle': GARGOYLE,
  'stone-gargoyle': STONE_GARGOYLE,
  'viper': VIPER,
  'python': PYTHON,
  'king-cobra': KING_COBRA,
  'imp': IMP,
  'demon-imp': DEMON_IMP,
  'mantis': MANTIS,
  'scythe-mantis': SCYTHE_MANTIS,

  // Batch 5: Elite Enemies (Levels 5-6)
  'minotaur': MINOTAUR,
  'bull-minotaur': BULL_MINOTAUR,
  'troll': TROLL,
  'cave-troll': CAVE_TROLL,
  'mountain-troll': MOUNTAIN_TROLL,
  'orc-warrior': ORC_WARRIOR,
  'orc-berserker': ORC_BERSERKER,
  'orc-lord': ORC_LORD,
  'mummy': MUMMY,
  'cursed-mummy': CURSED_MUMMY,
  'wight': WIGHT,
  'wraith': WRAITH,
  'harpy': HARPY,
  'harpy-queen': HARPY_QUEEN,
  'gryphon': GRYPHON,
  'grand-gryphon': GRAND_GRYPHON,
  'wyvern': WYVERN,
  'fire-wyvern': FIRE_WYVERN,
  'thunder-wyvern': THUNDER_WYVERN,
  'scorpion': SCORPION,
  'death-scorpion': DEATH_SCORPION,
  'basilisk': BASILISK,
  'king-basilisk': KING_BASILISK,

  // Batch 6: High-Level Enemies (Levels 6-8)
  'dragon': DRAGON,
  'fire-dragon': FIRE_DRAGON,
  'ice-dragon': ICE_DRAGON,
  'storm-dragon': STORM_DRAGON,
  'earth-dragon': EARTH_DRAGON,
  'demon': DEMON,
  'arch-demon': ARCH_DEMON,
  'shadow-demon': SHADOW_DEMON,
  'chimera': CHIMERA,
  'grand-chimera': GRAND_CHIMERA,
  'phoenix': PHOENIX,
  'dark-phoenix': DARK_PHOENIX,
  'fenrir': FENRIR,
  'frost-fenrir': FROST_FENRIR,
  'hydra': HYDRA,
  'king-hydra': KING_HYDRA,
  'crystal-golem': CRYSTAL_GOLEM,
  'diamond-golem': DIAMOND_GOLEM,
  'flame-lord': FLAME_LORD,
  'frost-lord': FROST_LORD,
  'gale-lord': GALE_LORD,
  'quake-lord': QUAKE_LORD,
  'behemoth': BEHEMOTH,
  'leviathan': LEVIATHAN,

  // Batch 7: Late-Game Enemies (Levels 8-10)
  'lich': LICH,
  'arch-lich': ARCH_LICH,
  'death-lich': DEATH_LICH,
  'grand-golem': GRAND_GOLEM,
  'titan-golem': TITAN_GOLEM,
  'colossus': COLOSSUS,
  'slayer': SLAYER,
  'death-slayer': DEATH_SLAYER,
  'executioner': EXECUTIONER,
  'ancient-dragon': ANCIENT_DRAGON,
  'elder-dragon': ELDER_DRAGON,
  'wargold-soldier': WARGOLD_SOLDIER,
  'wargold-captain': WARGOLD_CAPTAIN,
  'wargold-knight': WARGOLD_KNIGHT,
  'cerberus': CERBERUS,
  'kraken': KRAKEN,
  'thunderbird': THUNDERBIRD,
  'seraphim': SERAPHIM,
  'archangel': ARCHANGEL,
  'demon-lord': DEMON_LORD,
  'shadow-lord': SHADOW_LORD,
  'chaos-titan': CHAOS_TITAN,
  'void-wyrm': VOID_WYRM,
  'inferno-king': INFERNO_KING,
};
