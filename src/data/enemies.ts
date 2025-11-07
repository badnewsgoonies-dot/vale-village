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
  RAGNAROK,
  PYROCLASM,
  TEMPEST,
  GLACIAL_BLESSING,
  JUDGMENT,
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

// ========== TIER 4: FINAL BOSS ==========

/**
 * Nox Typhon - Ancient Demon Final Boss
 *
 * The ultimate challenge of Vale Chronicles.
 * Ancient shadow elemental sealed beneath Sol Sanctum.
 *
 * BOSS MECHANICS:
 * - 3-Phase Battle: AI adapts based on HP thresholds
 *   - Phase 1 (100-66% HP): Balanced elemental attacks
 *   - Phase 2 (66-33% HP): Aggressive multi-target AOE spam
 *   - Phase 3 (<33% HP): Desperate ultimate abilities + self-healing
 * - Cannot Flee: This is a boss battle
 * - Multi-Element Mastery: Only enemy that uses all 4 elements
 * - Self-Healing: GLACIAL_BLESSING allows sustain mechanic
 *
 * DESIGN INTENT:
 * - Tests mastery of all game systems (elements, equipment, Djinn, strategy)
 * - Long battle (500 HP = ~25-30 hits from level 5 party)
 * - Highest stats in the entire game
 * - Massive rewards justify difficulty (2000 XP, 1000 Gold)
 *
 * STORY CONTEXT:
 * - Sealed beneath Sol Sanctum for centuries
 * - Final boss of main story (Story Beat 9)
 * - Can wield any element (reflects "shadow elemental" lore)
 * - Defeat unlocks ending sequence
 */
export const NOX_TYPHON: Enemy = {
  id: 'nox-typhon',
  name: 'Nox Typhon',
  level: 10,
  stats: {
    hp: 500,   // Massive HP pool (1.67× expected level 10 enemy)
    pp: 100,   // Huge PP pool for sustained ultimate spam
    atk: 35,   // High physical attack
    def: 30,   // High defense
    mag: 40,   // HIGHEST magic in entire game
    spd: 25,   // High speed (acts before most units)
  },
  abilities: [
    RAGNAROK,          // Venus ultimate (Earth)
    PYROCLASM,         // Mars ultimate (Fire) - AOE
    TEMPEST,           // Jupiter ultimate (Wind) - AOE
    GLACIAL_BLESSING,  // Mercury ultimate (Water) - Heal self!
    JUDGMENT,          // Signature ultimate ability - AOE
  ],
  element: 'Neutral', // Can use all 4 elements!
  baseXp: 2000,  // Massive reward (enough to level entire party 1-2 levels)
  baseGold: 1000, // Game-ending reward
  drops: [], // No equipment drops - this is the final boss
};

/**
 * All enemies indexed by ID
 */
export const ENEMIES: Record<string, Enemy> = {
  // Tier 1: Early Game
  'goblin': GOBLIN,
  'wild-wolf': WILD_WOLF,
  'slime': SLIME,

  // Tier 2: Mid Game
  'fire-sprite': FIRE_SPRITE,
  'earth-golem': EARTH_GOLEM,
  'wind-wisp': WIND_WISP,

  // Tier 3: Late Game
  'fire-elemental': FIRE_ELEMENTAL,
  'ice-guardian': ICE_GUARDIAN,
  'stone-titan': STONE_TITAN,
  'storm-lord': STORM_LORD,

  // Tier 4: Final Boss
  'nox-typhon': NOX_TYPHON,
};
