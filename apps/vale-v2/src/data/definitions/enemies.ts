/**
 * Enemy definitions
 * These will be validated against EnemySchema at startup
 * 
 * Golden Path (Chapter 1): 8 enemies
 * - Tier 1: Slime, Wolf, Bandit, Sprite, Beetle
 * - Mini-boss: Gladiator (priority boots)
 * - Boss: Elemental Guardian (phase change at 50%)
 * - Boss add: Guardian Shard
 */
import type { Enemy } from '../schemas/EnemySchema';
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
} from './abilities';

// ============================================================================
// Tier 1 Enemies (5)
// ============================================================================

export const SLIME: Enemy = {
  id: 'slime',
  name: 'Slime',
  level: 1,
  element: 'Neutral',
  stats: {
    hp: 40,
    pp: 5,
    atk: 6,
    def: 4,
    mag: 3,
    spd: 5,
  },
  abilities: [
    { ...STRIKE, unlockLevel: 1 },
  ],
  baseXp: 10,
  baseGold: 5,
};

export const WOLF: Enemy = {
  id: 'wolf',
  name: 'Wolf',
  level: 1,
  element: 'Neutral',
  stats: {
    hp: 55,
    pp: 8,
    atk: 10,
    def: 6,
    mag: 2,
    spd: 12,
  },
  abilities: [
    { ...STRIKE, unlockLevel: 1 },
    { ...HEAVY_STRIKE, unlockLevel: 1 },
  ],
  baseXp: 15,
  baseGold: 8,
};

export const BANDIT: Enemy = {
  id: 'bandit',
  name: 'Bandit',
  level: 2,
  element: 'Neutral',
  stats: {
    hp: 65,
    pp: 10,
    atk: 12,
    def: 7,
    mag: 4,
    spd: 10,
  },
  abilities: [
    { ...STRIKE, unlockLevel: 1 },
    { ...HEAVY_STRIKE, unlockLevel: 1 },
  ],
  baseXp: 20,
  baseGold: 12,
};

export const SPRITE: Enemy = {
  id: 'sprite',
  name: 'Sprite',
  level: 2,
  element: 'Jupiter',
  stats: {
    hp: 45,
    pp: 15,
    atk: 5,
    def: 5,
    mag: 14,
    spd: 16,
  },
  abilities: [
    { ...GUST, unlockLevel: 1 },
    { ...BLIND, unlockLevel: 1 },
  ],
  baseXp: 18,
  baseGold: 10,
};

export const BEETLE: Enemy = {
  id: 'beetle',
  name: 'Beetle',
  level: 2,
  element: 'Venus',
  stats: {
    hp: 80,
    pp: 8,
    atk: 8,
    def: 14,
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
// Mini-Boss (1)
// ============================================================================

export const GLADIATOR: Enemy = {
  id: 'gladiator',
  name: 'Gladiator',
  level: 3,
  element: 'Neutral',
  stats: {
    hp: 120,
    pp: 15,
    atk: 18,
    def: 12,
    mag: 6,
    spd: 11,
  },
  abilities: [
    { ...STRIKE, unlockLevel: 1 },
    { ...HEAVY_STRIKE, unlockLevel: 1 },
    { ...GUARD_BREAK, unlockLevel: 1 },
    { ...BOOST_ATK, unlockLevel: 1 },
  ],
  baseXp: 50,
  baseGold: 30,
};

// ============================================================================
// Boss (1)
// ============================================================================

export const ELEMENTAL_GUARDIAN: Enemy = {
  id: 'elemental_guardian',
  name: 'Elemental Guardian',
  level: 4,
  element: 'Neutral',
  stats: {
    hp: 200,
    pp: 30,
    atk: 16,
    def: 14,
    mag: 20,
    spd: 10,
  },
  abilities: [
    { ...STRIKE, unlockLevel: 1 },
    { ...FIREBALL, unlockLevel: 1 },
    { ...ICE_SHARD, unlockLevel: 1 },
    { ...QUAKE, unlockLevel: 1 },
    { ...GUST, unlockLevel: 1 },
  ],
  baseXp: 100,
  baseGold: 150,
};

// ============================================================================
// Boss Add (1)
// ============================================================================

export const GUARDIAN_SHARD_FIRE: Enemy = {
  id: 'guardian_shard_fire',
  name: 'Fire Shard',
  level: 2,
  element: 'Mars',
  stats: {
    hp: 50,
    pp: 12,
    atk: 8,
    def: 6,
    mag: 16,
    spd: 8,
  },
  abilities: [
    { ...FIREBALL, unlockLevel: 1 },
  ],
  baseXp: 15,
  baseGold: 10,
};

export const GUARDIAN_SHARD_WATER: Enemy = {
  id: 'guardian_shard_water',
  name: 'Water Shard',
  level: 2,
  element: 'Mercury',
  stats: {
    hp: 50,
    pp: 12,
    atk: 8,
    def: 6,
    mag: 16,
    spd: 8,
  },
  abilities: [
    { ...ICE_SHARD, unlockLevel: 1 },
  ],
  baseXp: 15,
  baseGold: 10,
};

// ============================================================================
// Export all enemies
// ============================================================================

export const ENEMIES: Record<string, Enemy> = {
  slime: SLIME,
  wolf: WOLF,
  bandit: BANDIT,
  sprite: SPRITE,
  beetle: BEETLE,
  gladiator: GLADIATOR,
  elemental_guardian: ELEMENTAL_GUARDIAN,
  guardian_shard_fire: GUARDIAN_SHARD_FIRE,
  guardian_shard_water: GUARDIAN_SHARD_WATER,
};
