import type { Ability } from '@/types/Ability';
import type { Element } from '@/types/Element';
<<<<<<< HEAD
import type { Stats } from '@/types/Stats';
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
=======
import type { Stats } from '@/types/Unit';
import { SLASH, FIREBALL, VOLCANO, FROST, ICE_HORN, GUST, PLASMA, QUAKE, CLAY_SPIRE } from './abilities';
>>>>>>> da011dae5a42c00b1fdb0e0f62b8f00e0a566dcf

/**
 * Enemy Definition
 *
 * Enemies are similar to Units but simpler:
 * - No equipment or Djinn
 * - Fixed stats (no growth rates)
 * - Reward data for XP and Gold
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
};

/**
 * All enemies indexed by ID
 */
export const ENEMIES: Record<string, Enemy> = {
<<<<<<< HEAD
  // Tier 1: Early Game
  'goblin': GOBLIN,
  'wild-wolf': WILD_WOLF,
  'slime': SLIME,

  // Tier 2: Mid Game
  'fire-sprite': FIRE_SPRITE,
  'earth-golem': EARTH_GOLEM,
  'wind-wisp': WIND_WISP,

  // Tier 3: Late Game
=======
  'goblin': GOBLIN,
  'wild-wolf': WILD_WOLF,
  'slime': SLIME,
  'fire-sprite': FIRE_SPRITE,
  'earth-golem': EARTH_GOLEM,
  'wind-wisp': WIND_WISP,
>>>>>>> da011dae5a42c00b1fdb0e0f62b8f00e0a566dcf
  'fire-elemental': FIRE_ELEMENTAL,
  'ice-guardian': ICE_GUARDIAN,
  'stone-titan': STONE_TITAN,
  'storm-lord': STORM_LORD,
};
