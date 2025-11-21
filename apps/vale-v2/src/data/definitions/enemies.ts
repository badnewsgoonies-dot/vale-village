/**
 * Enemy definitions - Liberation of Vale Village
 * These will be validated against EnemySchema at startup
 *
 * Chapter 1: 50 unique enemies
 * - Enslaved Beasts (redesigned originals + new variants): 12 types
 * - Slavers (elemental specialists): 20 types
 * - Legendary Enslaved (elite): 9 types
 * - Boss Enemies: 9 types
 *
 * ALL ENEMIES ARE ELEMENTAL (Venus/Mars/Mercury/Jupiter)
 * NO NEUTRAL ELEMENT
 */
import type { Enemy } from '../schemas/EnemySchema';
import { unitDefinitionToEnemy } from '../../core/utils/unitToEnemy';
import { UNIT_DEFINITIONS } from './units';
import {
  STRIKE,
  HEAVY_STRIKE,
  GUARD_BREAK,
  GUST,
  BLIND,
  FIREBALL,
  ICE_SHARD,
  QUAKE,
  BOOST_ATK,
  BOOST_DEF,
  POISON_STRIKE,
  BURN_TOUCH,
  FREEZE_BLAST,
  PARALYZE_SHOCK,
  PRECISE_JAB,
  CHAIN_LIGHTNING,
  WEAKEN_DEF,
  HEAL,
  PARTY_HEAL,
} from './abilities';

// ============================================================================
// ENSLAVED BEASTS - Tier 1 (Redesigned Originals)
// ============================================================================

export const MERCURY_SLIME: Enemy = {
  id: 'mercury-slime',
  name: 'Mercury Slime',
  level: 1,
  element: 'Mercury',
  stats: {
    hp: 40,
    pp: 8,
    atk: 4,
    def: 5,
    mag: 6,
    spd: 5,
  },
  abilities: [
    { ...STRIKE, unlockLevel: 1 },
    { ...ICE_SHARD, unlockLevel: 1 },
  ],
  baseXp: 12,
  baseGold: 6,
};

export const VENUS_WOLF: Enemy = {
  id: 'venus-wolf',
  name: 'Earthbound Wolf',
  level: 1,
  element: 'Venus',
  stats: {
    hp: 275, // Increased from 55 (5x) for longer battles (target: 10-20 turns)
    pp: 8,
    atk: 16, // Increased from 11 to encourage defensive play
    def: 7,
    mag: 3,
    spd: 11,
  },
  abilities: [
    { ...STRIKE, unlockLevel: 1 },
    { ...HEAVY_STRIKE, unlockLevel: 1 },
  ],
  baseXp: 16,
  baseGold: 8,
};

export const MARS_BANDIT: Enemy = {
  id: 'mars-bandit',
  name: 'Flame Bandit',
  level: 2,
  element: 'Mars',
  stats: {
    hp: 60,
    pp: 12,
    atk: 13,
    def: 6,
    mag: 8,
    spd: 10,
  },
  abilities: [
    { ...STRIKE, unlockLevel: 1 },
    { ...HEAVY_STRIKE, unlockLevel: 1 },
    { ...FIREBALL, unlockLevel: 1 },
  ],
  baseXp: 20,
  baseGold: 12,
};

export const JUPITER_SPRITE: Enemy = {
  id: 'jupiter-sprite',
  name: 'Wind Sprite',
  level: 2,
  element: 'Jupiter',
  stats: {
    hp: 45,
    pp: 15,
    atk: 5,
    def: 5,
    mag: 14,
    spd: 17,
  },
  abilities: [
    { ...GUST, unlockLevel: 1 },
    { ...BLIND, unlockLevel: 1 },
    { ...PARALYZE_SHOCK, unlockLevel: 1 },
  ],
  baseXp: 18,
  baseGold: 10,
};

export const VENUS_BEETLE: Enemy = {
  id: 'venus-beetle',
  name: 'Stone Beetle',
  level: 2,
  element: 'Venus',
  stats: {
    hp: 80,
    pp: 8,
    atk: 8,
    def: 15,
    mag: 3,
    spd: 6,
  },
  abilities: [
    { ...STRIKE, unlockLevel: 1 },
    { ...GUARD_BREAK, unlockLevel: 1 },
  ],
  baseXp: 22,
  baseGold: 12,
};

// ============================================================================
// ENSLAVED BEASTS - Extended Wolf Pack
// ============================================================================

export const MARS_WOLF: Enemy = {
  id: 'mars-wolf',
  name: 'Flame Wolf',
  level: 2,
  element: 'Mars',
  stats: {
    hp: 290, // Increased from 58 (5x) for longer battles (target: 10-20 turns)
    pp: 10,
    atk: 18, // Increased from 12 to encourage defensive play
    def: 6,
    mag: 5,
    spd: 13,
  },
  abilities: [
    { ...STRIKE, unlockLevel: 1 },
    { ...HEAVY_STRIKE, unlockLevel: 1 },
    { ...BURN_TOUCH, unlockLevel: 1 },
  ],
  baseXp: 18,
  baseGold: 9,
};

export const MERCURY_WOLF: Enemy = {
  id: 'mercury-wolf',
  name: 'Frost Wolf',
  level: 2,
  element: 'Mercury',
  stats: {
    hp: 280, // Increased from 56 (5x) for longer battles (target: 10-20 turns)
    pp: 12,
    atk: 17, // Increased from 10 to encourage defensive play
    def: 7,
    mag: 6,
    spd: 14,
  },
  abilities: [
    { ...STRIKE, unlockLevel: 1 },
    { ...HEAVY_STRIKE, unlockLevel: 1 },
    { ...FREEZE_BLAST, unlockLevel: 1 },
  ],
  baseXp: 18,
  baseGold: 9,
};

export const JUPITER_WOLF: Enemy = {
  id: 'jupiter-wolf',
  name: 'Storm Wolf',
  level: 2,
  element: 'Jupiter',
  stats: {
    hp: 260, // Increased from 52 (5x) for longer battles (target: 10-20 turns)
    pp: 11,
    atk: 18, // Increased from 11 to encourage defensive play
    def: 6,
    mag: 7,
    spd: 16,
  },
  abilities: [
    { ...STRIKE, unlockLevel: 1 },
    { ...PRECISE_JAB, unlockLevel: 1 },
    { ...GUST, unlockLevel: 1 },
  ],
  baseXp: 18,
  baseGold: 9,
};

// ============================================================================
// ENSLAVED BEASTS - Bear Variants
// ============================================================================

export const VENUS_BEAR: Enemy = {
  id: 'venus-bear',
  name: 'Mountain Bear',
  level: 4,
  element: 'Venus',
  stats: {
    hp: 110,
    pp: 12,
    atk: 14,
    def: 18,
    mag: 6,
    spd: 8,
  },
  abilities: [
    { ...STRIKE, unlockLevel: 1 },
    { ...HEAVY_STRIKE, unlockLevel: 1 },
    { ...QUAKE, unlockLevel: 1 },
  ],
  baseXp: 35,
  baseGold: 18,
};

export const MARS_BEAR: Enemy = {
  id: 'mars-bear',
  name: 'Inferno Bear',
  level: 4,
  element: 'Mars',
  stats: {
    hp: 105,
    pp: 14,
    atk: 16,
    def: 16,
    mag: 8,
    spd: 9,
  },
  abilities: [
    { ...STRIKE, unlockLevel: 1 },
    { ...HEAVY_STRIKE, unlockLevel: 1 },
    { ...FIREBALL, unlockLevel: 1 },
  ],
  baseXp: 35,
  baseGold: 18,
};

export const MERCURY_BEAR: Enemy = {
  id: 'mercury-bear',
  name: 'Glacier Bear',
  level: 4,
  element: 'Mercury',
  stats: {
    hp: 115,
    pp: 13,
    atk: 13,
    def: 19,
    mag: 7,
    spd: 7,
  },
  abilities: [
    { ...STRIKE, unlockLevel: 1 },
    { ...HEAVY_STRIKE, unlockLevel: 1 },
    { ...ICE_SHARD, unlockLevel: 1 },
  ],
  baseXp: 35,
  baseGold: 18,
};

export const JUPITER_BEAR: Enemy = {
  id: 'jupiter-bear',
  name: 'Thunder Bear',
  level: 4,
  element: 'Jupiter',
  stats: {
    hp: 100,
    pp: 15,
    atk: 15,
    def: 15,
    mag: 10,
    spd: 12,
  },
  abilities: [
    { ...STRIKE, unlockLevel: 1 },
    { ...HEAVY_STRIKE, unlockLevel: 1 },
    { ...GUST, unlockLevel: 1 },
  ],
  baseXp: 35,
  baseGold: 18,
};

// ============================================================================
// SLAVERS - Tier 1 Scouts (Level 1-2)
// ============================================================================

export const EARTH_SCOUT: Enemy = {
  id: 'earth-scout',
  name: 'Earth Scout',
  level: 1,
  element: 'Venus',
  stats: {
    hp: 250, // Increased from 50 (5x) for longer battles (target: 10-20 turns)
    pp: 10,
    atk: 14, // Increased from 9 to encourage defensive play
    def: 8,
    mag: 5,
    spd: 8,
  },
  abilities: [
    { ...STRIKE, unlockLevel: 1 },
    { ...GUARD_BREAK, unlockLevel: 1 },
  ],
  baseXp: 15,
  baseGold: 10,
};

export const FLAME_SCOUT: Enemy = {
  id: 'flame-scout',
  name: 'Flame Scout',
  level: 1,
  element: 'Mars',
  stats: {
    hp: 225, // Increased from 45 (5x) for longer battles (target: 10-20 turns)
    pp: 12,
    atk: 15, // Increased from 10 to encourage defensive play
    def: 6,
    mag: 8,
    spd: 10,
  },
  abilities: [
    { ...STRIKE, unlockLevel: 1 },
    { ...FIREBALL, unlockLevel: 1 },
  ],
  baseXp: 15,
  baseGold: 10,
};

export const FROST_SCOUT: Enemy = {
  id: 'frost-scout',
  name: 'Frost Scout',
  level: 1,
  element: 'Mercury',
  stats: {
    hp: 240, // Increased from 48 (5x) for longer battles (target: 10-20 turns)
    pp: 11,
    atk: 14, // Increased from 8 to encourage defensive play
    def: 7,
    mag: 7,
    spd: 9,
  },
  abilities: [
    { ...STRIKE, unlockLevel: 1 },
    { ...ICE_SHARD, unlockLevel: 1 },
  ],
  baseXp: 15,
  baseGold: 10,
};

export const GALE_SCOUT: Enemy = {
  id: 'gale-scout',
  name: 'Gale Scout',
  level: 1,
  element: 'Jupiter',
  stats: {
    hp: 210, // Increased from 42 (5x) for longer battles (target: 10-20 turns)
    pp: 13,
    atk: 15, // Increased from 9 to encourage defensive play
    def: 6,
    mag: 9,
    spd: 12,
  },
  abilities: [
    { ...STRIKE, unlockLevel: 1 },
    { ...GUST, unlockLevel: 1 },
  ],
  baseXp: 15,
  baseGold: 10,
};

// ============================================================================
// SLAVERS - Tier 2 Soldiers (Level 3-4)
// ============================================================================

export const TERRA_SOLDIER: Enemy = {
  id: 'terra-soldier',
  name: 'Terra Soldier',
  level: 3,
  element: 'Venus',
  stats: {
    hp: 85,
    pp: 15,
    atk: 14,
    def: 13,
    mag: 7,
    spd: 9,
  },
  abilities: [
    { ...STRIKE, unlockLevel: 1 },
    { ...HEAVY_STRIKE, unlockLevel: 1 },
    { ...QUAKE, unlockLevel: 1 },
  ],
  baseXp: 28,
  baseGold: 16,
};

export const BLAZE_SOLDIER: Enemy = {
  id: 'blaze-soldier',
  name: 'Blaze Soldier',
  level: 3,
  element: 'Mars',
  stats: {
    hp: 75,
    pp: 18,
    atk: 15,
    def: 10,
    mag: 12,
    spd: 11,
  },
  abilities: [
    { ...STRIKE, unlockLevel: 1 },
    { ...FIREBALL, unlockLevel: 1 },
    { ...BURN_TOUCH, unlockLevel: 1 },
  ],
  baseXp: 28,
  baseGold: 16,
};

export const TIDE_SOLDIER: Enemy = {
  id: 'tide-soldier',
  name: 'Tide Soldier',
  level: 3,
  element: 'Mercury',
  stats: {
    hp: 80,
    pp: 16,
    atk: 12,
    def: 12,
    mag: 10,
    spd: 10,
  },
  abilities: [
    { ...STRIKE, unlockLevel: 1 },
    { ...ICE_SHARD, unlockLevel: 1 },
    { ...FREEZE_BLAST, unlockLevel: 1 },
  ],
  baseXp: 28,
  baseGold: 16,
};

export const WIND_SOLDIER: Enemy = {
  id: 'wind-soldier',
  name: 'Wind Soldier',
  level: 3,
  element: 'Jupiter',
  stats: {
    hp: 70,
    pp: 20,
    atk: 13,
    def: 9,
    mag: 13,
    spd: 14,
  },
  abilities: [
    { ...STRIKE, unlockLevel: 1 },
    { ...GUST, unlockLevel: 1 },
    { ...BLIND, unlockLevel: 1 },
  ],
  baseXp: 28,
  baseGold: 16,
};

// ============================================================================
// SLAVERS - Tier 3 Captains (Level 5-6)
// ============================================================================

export const STONE_CAPTAIN: Enemy = {
  id: 'stone-captain',
  name: 'Stone Captain',
  level: 5,
  element: 'Venus',
  stats: {
    hp: 130,
    pp: 20,
    atk: 18,
    def: 18,
    mag: 10,
    spd: 10,
  },
  abilities: [
    { ...STRIKE, unlockLevel: 1 },
    { ...HEAVY_STRIKE, unlockLevel: 1 },
    { ...QUAKE, unlockLevel: 1 },
    { ...BOOST_DEF, unlockLevel: 1 },
  ],
  baseXp: 50,
  baseGold: 28,
};

export const INFERNO_CAPTAIN: Enemy = {
  id: 'inferno-captain',
  name: 'Inferno Captain',
  level: 5,
  element: 'Mars',
  stats: {
    hp: 115,
    pp: 25,
    atk: 20,
    def: 14,
    mag: 16,
    spd: 12,
  },
  abilities: [
    { ...STRIKE, unlockLevel: 1 },
    { ...FIREBALL, unlockLevel: 1 },
    { ...BURN_TOUCH, unlockLevel: 1 },
    { ...BOOST_ATK, unlockLevel: 1 },
  ],
  baseXp: 50,
  baseGold: 28,
};

export const GLACIER_CAPTAIN: Enemy = {
  id: 'glacier-captain',
  name: 'Glacier Captain',
  level: 5,
  element: 'Mercury',
  stats: {
    hp: 125,
    pp: 22,
    atk: 16,
    def: 16,
    mag: 14,
    spd: 11,
  },
  abilities: [
    { ...STRIKE, unlockLevel: 1 },
    { ...ICE_SHARD, unlockLevel: 1 },
    { ...FREEZE_BLAST, unlockLevel: 1 },
    { ...HEAL, unlockLevel: 1 },
  ],
  baseXp: 50,
  baseGold: 28,
};

export const THUNDER_CAPTAIN: Enemy = {
  id: 'thunder-captain',
  name: 'Thunder Captain',
  level: 5,
  element: 'Jupiter',
  stats: {
    hp: 110,
    pp: 28,
    atk: 17,
    def: 13,
    mag: 18,
    spd: 15,
  },
  abilities: [
    { ...STRIKE, unlockLevel: 1 },
    { ...GUST, unlockLevel: 1 },
    { ...PARALYZE_SHOCK, unlockLevel: 1 },
    { ...BLIND, unlockLevel: 1 },
  ],
  baseXp: 50,
  baseGold: 28,
};

// ============================================================================
// SLAVERS - Tier 4 Commanders (Level 7-8)
// ============================================================================

export const MOUNTAIN_COMMANDER: Enemy = {
  id: 'mountain-commander',
  name: 'Mountain Commander',
  level: 7,
  element: 'Venus',
  stats: {
    hp: 180,
    pp: 28,
    atk: 22,
    def: 24,
    mag: 14,
    spd: 11,
  },
  abilities: [
    { ...STRIKE, unlockLevel: 1 },
    { ...HEAVY_STRIKE, unlockLevel: 1 },
    { ...QUAKE, unlockLevel: 1 },
    { ...GUARD_BREAK, unlockLevel: 1 },
    { ...BOOST_DEF, unlockLevel: 1 },
  ],
  baseXp: 75,
  baseGold: 40,
};

export const FIRE_COMMANDER: Enemy = {
  id: 'fire-commander',
  name: 'Fire Commander',
  level: 7,
  element: 'Mars',
  stats: {
    hp: 160,
    pp: 35,
    atk: 24,
    def: 18,
    mag: 22,
    spd: 13,
  },
  abilities: [
    { ...STRIKE, unlockLevel: 1 },
    { ...FIREBALL, unlockLevel: 1 },
    { ...BURN_TOUCH, unlockLevel: 1 },
    { ...BOOST_ATK, unlockLevel: 1 },
    { ...WEAKEN_DEF, unlockLevel: 1 },
  ],
  baseXp: 75,
  baseGold: 40,
};

export const STORM_COMMANDER: Enemy = {
  id: 'storm-commander',
  name: 'Storm Commander',
  level: 7,
  element: 'Mercury',
  stats: {
    hp: 170,
    pp: 30,
    atk: 20,
    def: 20,
    mag: 20,
    spd: 12,
  },
  abilities: [
    { ...STRIKE, unlockLevel: 1 },
    { ...ICE_SHARD, unlockLevel: 1 },
    { ...FREEZE_BLAST, unlockLevel: 1 },
    { ...HEAL, unlockLevel: 1 },
    { ...BOOST_DEF, unlockLevel: 1 },
  ],
  baseXp: 75,
  baseGold: 40,
};

export const LIGHTNING_COMMANDER: Enemy = {
  id: 'lightning-commander',
  name: 'Lightning Commander',
  level: 7,
  element: 'Jupiter',
  stats: {
    hp: 150,
    pp: 38,
    atk: 21,
    def: 16,
    mag: 24,
    spd: 18,
  },
  abilities: [
    { ...STRIKE, unlockLevel: 1 },
    { ...GUST, unlockLevel: 1 },
    { ...CHAIN_LIGHTNING, unlockLevel: 1 },
    { ...PARALYZE_SHOCK, unlockLevel: 1 },
    { ...BLIND, unlockLevel: 1 },
  ],
  baseXp: 75,
  baseGold: 40,
};

// ============================================================================
// SLAVERS - Tier 5 Warlords (Level 9-10) - Mini-Bosses
// ============================================================================

export const GRANITE_WARLORD: Enemy = {
  id: 'granite-warlord',
  name: 'Granite Warlord',
  level: 9,
  element: 'Venus',
  stats: {
    hp: 250,
    pp: 35,
    atk: 28,
    def: 30,
    mag: 18,
    spd: 12,
  },
  abilities: [
    { ...STRIKE, unlockLevel: 1 },
    { ...HEAVY_STRIKE, unlockLevel: 1 },
    { ...QUAKE, unlockLevel: 1 },
    { ...GUARD_BREAK, unlockLevel: 1 },
    { ...BOOST_DEF, unlockLevel: 1 },
    { ...HEAL, unlockLevel: 1 },
  ],
  baseXp: 120,
  baseGold: 60,
};

export const VOLCANO_WARLORD: Enemy = {
  id: 'volcano-warlord',
  name: 'Volcano Warlord',
  level: 9,
  element: 'Mars',
  stats: {
    hp: 220,
    pp: 45,
    atk: 30,
    def: 22,
    mag: 28,
    spd: 14,
  },
  abilities: [
    { ...STRIKE, unlockLevel: 1 },
    { ...FIREBALL, unlockLevel: 1 },
    { ...BURN_TOUCH, unlockLevel: 1 },
    { ...BOOST_ATK, unlockLevel: 1 },
    { ...WEAKEN_DEF, unlockLevel: 1 },
    { ...GUARD_BREAK, unlockLevel: 1 },
  ],
  baseXp: 120,
  baseGold: 60,
};

export const BLIZZARD_WARLORD: Enemy = {
  id: 'blizzard-warlord',
  name: 'Blizzard Warlord',
  level: 9,
  element: 'Mercury',
  stats: {
    hp: 240,
    pp: 40,
    atk: 24,
    def: 26,
    mag: 24,
    spd: 13,
  },
  abilities: [
    { ...STRIKE, unlockLevel: 1 },
    { ...ICE_SHARD, unlockLevel: 1 },
    { ...FREEZE_BLAST, unlockLevel: 1 },
    { ...HEAL, unlockLevel: 1 },
    { ...PARTY_HEAL, unlockLevel: 1 },
    { ...BOOST_DEF, unlockLevel: 1 },
  ],
  baseXp: 120,
  baseGold: 60,
};

export const TEMPEST_WARLORD: Enemy = {
  id: 'tempest-warlord',
  name: 'Tempest Warlord',
  level: 9,
  element: 'Jupiter',
  stats: {
    hp: 210,
    pp: 50,
    atk: 26,
    def: 20,
    mag: 30,
    spd: 20,
  },
  abilities: [
    { ...STRIKE, unlockLevel: 1 },
    { ...GUST, unlockLevel: 1 },
    { ...CHAIN_LIGHTNING, unlockLevel: 1 },
    { ...PARALYZE_SHOCK, unlockLevel: 1 },
    { ...BLIND, unlockLevel: 1 },
    { ...BOOST_ATK, unlockLevel: 1 },
  ],
  baseXp: 120,
  baseGold: 60,
};

// ============================================================================
// LEGENDARY ENSLAVED - Elemental Pure Forms
// ============================================================================

export const ROCK_ELEMENTAL: Enemy = {
  id: 'rock-elemental',
  name: 'Rock Elemental',
  level: 6,
  element: 'Venus',
  stats: {
    hp: 140,
    pp: 20,
    atk: 16,
    def: 22,
    mag: 12,
    spd: 8,
  },
  abilities: [
    { ...STRIKE, unlockLevel: 1 },
    { ...QUAKE, unlockLevel: 1 },
    { ...GUARD_BREAK, unlockLevel: 1 },
  ],
  baseXp: 45,
  baseGold: 24,
};

export const FLAME_ELEMENTAL: Enemy = {
  id: 'flame-elemental',
  name: 'Flame Elemental',
  level: 6,
  element: 'Mars',
  stats: {
    hp: 120,
    pp: 28,
    atk: 14,
    def: 14,
    mag: 20,
    spd: 14,
  },
  abilities: [
    { ...STRIKE, unlockLevel: 1 },
    { ...FIREBALL, unlockLevel: 1 },
    { ...BURN_TOUCH, unlockLevel: 1 },
  ],
  baseXp: 45,
  baseGold: 24,
};

export const ICE_ELEMENTAL: Enemy = {
  id: 'ice-elemental',
  name: 'Ice Elemental',
  level: 6,
  element: 'Mercury',
  stats: {
    hp: 130,
    pp: 24,
    atk: 12,
    def: 18,
    mag: 18,
    spd: 10,
  },
  abilities: [
    { ...STRIKE, unlockLevel: 1 },
    { ...ICE_SHARD, unlockLevel: 1 },
    { ...FREEZE_BLAST, unlockLevel: 1 },
  ],
  baseXp: 45,
  baseGold: 24,
};

export const STORM_ELEMENTAL: Enemy = {
  id: 'storm-elemental',
  name: 'Storm Elemental',
  level: 6,
  element: 'Jupiter',
  stats: {
    hp: 115,
    pp: 30,
    atk: 13,
    def: 13,
    mag: 22,
    spd: 16,
  },
  abilities: [
    { ...STRIKE, unlockLevel: 1 },
    { ...GUST, unlockLevel: 1 },
    { ...CHAIN_LIGHTNING, unlockLevel: 1 },
  ],
  baseXp: 45,
  baseGold: 24,
};

// ============================================================================
// LEGENDARY ENSLAVED - Mythical Beasts
// ============================================================================

export const BASILISK: Enemy = {
  id: 'basilisk',
  name: 'Basilisk',
  level: 8,
  element: 'Venus',
  stats: {
    hp: 200,
    pp: 25,
    atk: 24,
    def: 22,
    mag: 16,
    spd: 14,
  },
  abilities: [
    { ...STRIKE, unlockLevel: 1 },
    { ...HEAVY_STRIKE, unlockLevel: 1 },
    { ...QUAKE, unlockLevel: 1 },
    { ...POISON_STRIKE, unlockLevel: 1 },
  ],
  baseXp: 90,
  baseGold: 50,
};

export const PHOENIX: Enemy = {
  id: 'phoenix',
  name: 'Phoenix',
  level: 8,
  element: 'Mars',
  stats: {
    hp: 180,
    pp: 35,
    atk: 22,
    def: 18,
    mag: 26,
    spd: 18,
  },
  abilities: [
    { ...STRIKE, unlockLevel: 1 },
    { ...FIREBALL, unlockLevel: 1 },
    { ...BURN_TOUCH, unlockLevel: 1 },
    { ...HEAL, unlockLevel: 1 },
  ],
  baseXp: 90,
  baseGold: 50,
};

export const LEVIATHAN: Enemy = {
  id: 'leviathan',
  name: 'Leviathan',
  level: 8,
  element: 'Mercury',
  stats: {
    hp: 220,
    pp: 30,
    atk: 20,
    def: 24,
    mag: 22,
    spd: 12,
  },
  abilities: [
    { ...STRIKE, unlockLevel: 1 },
    { ...HEAVY_STRIKE, unlockLevel: 1 },
    { ...ICE_SHARD, unlockLevel: 1 },
    { ...FREEZE_BLAST, unlockLevel: 1 },
  ],
  baseXp: 90,
  baseGold: 50,
};

export const THUNDERBIRD: Enemy = {
  id: 'thunderbird',
  name: 'Thunderbird',
  level: 8,
  element: 'Jupiter',
  stats: {
    hp: 170,
    pp: 40,
    atk: 21,
    def: 16,
    mag: 28,
    spd: 22,
  },
  abilities: [
    { ...STRIKE, unlockLevel: 1 },
    { ...GUST, unlockLevel: 1 },
    { ...CHAIN_LIGHTNING, unlockLevel: 1 },
    { ...PARALYZE_SHOCK, unlockLevel: 1 },
  ],
  baseXp: 90,
  baseGold: 50,
};

export const HYDRA: Enemy = {
  id: 'hydra',
  name: 'Hydra',
  level: 9,
  element: 'Mercury',
  stats: {
    hp: 280,
    pp: 35,
    atk: 26,
    def: 26,
    mag: 20,
    spd: 13,
  },
  abilities: [
    { ...STRIKE, unlockLevel: 1 },
    { ...HEAVY_STRIKE, unlockLevel: 1 },
    { ...ICE_SHARD, unlockLevel: 1 },
    { ...POISON_STRIKE, unlockLevel: 1 },
    { ...HEAL, unlockLevel: 1 },
  ],
  baseXp: 110,
  baseGold: 55,
};

// ============================================================================
// BOSS ENEMIES - Special Encounters
// ============================================================================

export const MARS_SPRITE: Enemy = {
  id: 'mars-sprite',
  name: 'Flame Sprite',
  level: 3,
  element: 'Mars',
  stats: {
    hp: 48,
    pp: 18,
    atk: 6,
    def: 6,
    mag: 15,
    spd: 16,
  },
  abilities: [
    { ...FIREBALL, unlockLevel: 1 },
    { ...BURN_TOUCH, unlockLevel: 1 },
  ],
  baseXp: 20,
  baseGold: 12,
};

export const MERCURY_SPRITE: Enemy = {
  id: 'mercury-sprite',
  name: 'Frost Sprite',
  level: 3,
  element: 'Mercury',
  stats: {
    hp: 50,
    pp: 16,
    atk: 5,
    def: 7,
    mag: 14,
    spd: 15,
  },
  abilities: [
    { ...ICE_SHARD, unlockLevel: 1 },
    { ...FREEZE_BLAST, unlockLevel: 1 },
  ],
  baseXp: 20,
  baseGold: 12,
};

export const VENUS_SPRITE: Enemy = {
  id: 'venus-sprite',
  name: 'Stone Sprite',
  level: 3,
  element: 'Venus',
  stats: {
    hp: 55,
    pp: 14,
    atk: 6,
    def: 8,
    mag: 13,
    spd: 14,
  },
  abilities: [
    { ...STRIKE, unlockLevel: 1 },
    { ...QUAKE, unlockLevel: 1 },
  ],
  baseXp: 20,
  baseGold: 12,
};

export const CHIMERA: Enemy = {
  id: 'chimera',
  name: 'Chimera',
  level: 10,
  element: 'Mars',
  stats: {
    hp: 320,
    pp: 50,
    atk: 32,
    def: 28,
    mag: 30,
    spd: 16,
  },
  abilities: [
    { ...STRIKE, unlockLevel: 1 },
    { ...HEAVY_STRIKE, unlockLevel: 1 },
    { ...FIREBALL, unlockLevel: 1 },
    { ...BURN_TOUCH, unlockLevel: 1 },
    { ...POISON_STRIKE, unlockLevel: 1 },
    { ...BOOST_ATK, unlockLevel: 1 },
  ],
  baseXp: 200,
  baseGold: 100,
};

// ============================================================================
// CHAPTER BOSS - Overseer (Final Boss)
// ============================================================================

export const OVERSEER: Enemy = {
  id: 'overseer',
  name: 'The Overseer',
  level: 10,
  element: 'Jupiter',
  stats: {
    hp: 400,
    pp: 60,
    atk: 30,
    def: 30,
    mag: 35,
    spd: 20,
  },
  abilities: [
    { ...STRIKE, unlockLevel: 1 },
    { ...HEAVY_STRIKE, unlockLevel: 1 },
    { ...GUST, unlockLevel: 1 },
    { ...CHAIN_LIGHTNING, unlockLevel: 1 },
    { ...FIREBALL, unlockLevel: 1 },
    { ...ICE_SHARD, unlockLevel: 1 },
    { ...QUAKE, unlockLevel: 1 },
    { ...BOOST_ATK, unlockLevel: 1 },
    { ...BOOST_DEF, unlockLevel: 1 },
    { ...HEAL, unlockLevel: 1 },
  ],
  baseXp: 500,
  baseGold: 250,
};

// ============================================================================
// VS1 Demo Enemies
// ============================================================================

export const BANDIT_MINION: Enemy = {
  id: 'bandit-minion',
  name: 'Bandit',
  level: 3,
  element: 'Mars',
  stats: {
    hp: 48,
    pp: 0,
    atk: 13,
    def: 8,
    mag: 5,
    spd: 9,
  },
  abilities: [
    { ...STRIKE, unlockLevel: 1 },
  ],
  baseXp: 18,
  baseGold: 15,
};

export const BANDIT_CAPTAIN: Enemy = {
  id: 'bandit-captain',
  name: 'Bandit Captain',
  level: 4,
  element: 'Mars',
  stats: {
    hp: 90,
    pp: 0,
    atk: 16,
    def: 10,
    mag: 6,
    spd: 10,
  },
  abilities: [
    { ...STRIKE, unlockLevel: 1 },
    { ...HEAVY_STRIKE, unlockLevel: 1 },
  ],
  baseXp: 30,
  baseGold: 25,
};

// ============================================================================
// Recruitable Unit Enemies (generated from unit definitions)
// ============================================================================

// VS1: Garet (War Mage) - Level 2
const warMageDef = UNIT_DEFINITIONS['war-mage'];
if (!warMageDef) throw new Error('war-mage unit definition not found');
export const GARET_ENEMY = unitDefinitionToEnemy(
  warMageDef,
  2, // Level 2 for VS1
  60, // Base XP
  19, // Base Gold
  { 
    id: 'garet-enemy',
    stats: {
      // Increase HP significantly for longer battles (target: 10-20 turns)
      hp: (warMageDef.baseStats.hp + (1 * warMageDef.growthRates.hp)) * 3, // 3x HP (still tanky but within VS1 expectation)
      // Increase attack to encourage defensive play
      atk: warMageDef.baseStats.atk + (1 * warMageDef.growthRates.atk) + 4, // +4 ATK
    }
  }
);

// Sentinel - Level 3 (example for future encounters)
const sentinelDef = UNIT_DEFINITIONS['sentinel'];
if (!sentinelDef) throw new Error('sentinel unit definition not found');
export const SENTINEL_ENEMY = unitDefinitionToEnemy(
  sentinelDef,
  3, // Level 3
  80, // Base XP
  25, // Base Gold
  { id: 'sentinel-enemy' }
);

// Stormcaller - Level 3 (example for future encounters)
const stormcallerDef = UNIT_DEFINITIONS['stormcaller'];
if (!stormcallerDef) throw new Error('stormcaller unit definition not found');
export const STORMCALLER_ENEMY = unitDefinitionToEnemy(
  stormcallerDef,
  3, // Level 3
  80, // Base XP
  25, // Base Gold
  { id: 'stormcaller-enemy' }
);

// Note: Starter units (adept, mystic, ranger) can also have enemy versions
// if needed for story battles, but they're not typically recruited.
// Uncomment if needed:
// export const ADEPT_ENEMY = unitDefinitionToEnemy(UNIT_DEFINITIONS['adept'], 1, 50, 15);
// export const MYSTIC_ENEMY = unitDefinitionToEnemy(UNIT_DEFINITIONS['mystic'], 1, 50, 15);
// export const RANGER_ENEMY = unitDefinitionToEnemy(UNIT_DEFINITIONS['ranger'], 1, 50, 15);

// ============================================================================
// Export all enemies
// ============================================================================

export const ENEMIES: Record<string, Enemy> = {
  // Enslaved Beasts - Redesigned Originals
  'mercury-slime': MERCURY_SLIME,
  'venus-wolf': VENUS_WOLF,
  // Legacy/test-friendly aliases
  slime: MERCURY_SLIME,
  wolf: VENUS_WOLF,
  beetle: VENUS_BEETLE,
  'mars-bandit': MARS_BANDIT,
  'jupiter-sprite': JUPITER_SPRITE,
  'venus-beetle': VENUS_BEETLE,

  // Enslaved Beasts - Wolf Pack
  'mars-wolf': MARS_WOLF,
  'mercury-wolf': MERCURY_WOLF,
  'jupiter-wolf': JUPITER_WOLF,

  // Enslaved Beasts - Bear Variants
  'venus-bear': VENUS_BEAR,
  'mars-bear': MARS_BEAR,
  'mercury-bear': MERCURY_BEAR,
  'jupiter-bear': JUPITER_BEAR,

  // Slavers - Tier 1 Scouts
  'earth-scout': EARTH_SCOUT,
  'flame-scout': FLAME_SCOUT,
  'frost-scout': FROST_SCOUT,
  'gale-scout': GALE_SCOUT,

  // Slavers - Tier 2 Soldiers
  'terra-soldier': TERRA_SOLDIER,
  'blaze-soldier': BLAZE_SOLDIER,
  'tide-soldier': TIDE_SOLDIER,
  'wind-soldier': WIND_SOLDIER,

  // Slavers - Tier 3 Captains
  'stone-captain': STONE_CAPTAIN,
  'inferno-captain': INFERNO_CAPTAIN,
  'glacier-captain': GLACIER_CAPTAIN,
  'thunder-captain': THUNDER_CAPTAIN,

  // Slavers - Tier 4 Commanders
  'mountain-commander': MOUNTAIN_COMMANDER,
  'fire-commander': FIRE_COMMANDER,
  'storm-commander': STORM_COMMANDER,
  'lightning-commander': LIGHTNING_COMMANDER,

  // Slavers - Tier 5 Warlords (Mini-Bosses)
  'granite-warlord': GRANITE_WARLORD,
  'volcano-warlord': VOLCANO_WARLORD,
  'blizzard-warlord': BLIZZARD_WARLORD,
  'tempest-warlord': TEMPEST_WARLORD,

  // Legendary Enslaved - Elementals
  'rock-elemental': ROCK_ELEMENTAL,
  'flame-elemental': FLAME_ELEMENTAL,
  'ice-elemental': ICE_ELEMENTAL,
  'storm-elemental': STORM_ELEMENTAL,

  // Legendary Enslaved - Mythical Beasts
  basilisk: BASILISK,
  phoenix: PHOENIX,
  leviathan: LEVIATHAN,
  thunderbird: THUNDERBIRD,
  hydra: HYDRA,

  // Boss Enemies
  'mars-sprite': MARS_SPRITE,
  'mercury-sprite': MERCURY_SPRITE,
  'venus-sprite': VENUS_SPRITE,
  chimera: CHIMERA,
  overseer: OVERSEER,

  // VS1 Demo
  'bandit-minion': BANDIT_MINION,
  'bandit-captain': BANDIT_CAPTAIN,

  // Recruitable Unit Enemies
  'garet-enemy': GARET_ENEMY,
  'sentinel-enemy': SENTINEL_ENEMY,
  'stormcaller-enemy': STORMCALLER_ENEMY,
};
