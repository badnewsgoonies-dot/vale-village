/**
 * Unit definitions
 * These will be validated against UnitDefinitionSchema at startup
 *
 * Houses 1-20 Progression: 10 units total
 * - Starter: Adept (Venus/Isaac)
 * - House 1 (VS1): War Mage (Mars/Garet)
 * - Story Joins: Mystic (Mercury), Ranger (Jupiter)
 * - Recruits: Blaze (Mars), Sentinel (Venus), Karis (Mercury), Tyrell (Mars), Stormcaller (Jupiter), Felix (Venus)
 */
import type { UnitDefinition } from '../schemas/UnitSchema';
import {
  STRIKE,
  HEAVY_STRIKE,
  GUARD_BREAK,
  QUAKE,
  FIREBALL,
  BOOST_ATK,
  HEAL,
  PARTY_HEAL,
  ICE_SHARD,
  PRECISE_JAB,
  GUST,
  BLIND,
  BOOST_DEF,
  CHAIN_LIGHTNING,
  POISON_STRIKE,
  BURN_TOUCH,
  FREEZE_BLAST,
  PARALYZE_SHOCK,
  // Balanced ability sets
  EARTH_SPIKE_DAMAGE,
  STONE_SKIN_UTILITY,
  FLAME_BURST_DAMAGE,
  FIRE_WARD_UTILITY,
  ICE_LANCE_DAMAGE,
  AQUA_HEAL_UTILITY,
  GALE_FORCE_DAMAGE,
  WIND_BARRIER_UTILITY,
  FOCUS_STRIKE_NEUTRAL,
} from './abilities';

// ============================================================================
// Starter Units (4)
// ============================================================================

export const ADEPT: UnitDefinition = {
  id: 'adept',
  name: 'Adept',
  element: 'Venus',
  role: 'Defensive Tank',
  baseStats: {
    hp: 120,
    pp: 15,
    atk: 14,
    def: 16,
    mag: 8,
    spd: 10,
  },
  growthRates: {
    hp: 25,
    pp: 4,
    atk: 3,
    def: 4,
    mag: 2,
    spd: 1,
  },
  abilities: [
    { ...STRIKE, unlockLevel: 1 },
    // Same element (Venus): 1 damage, 1 utility
    { ...EARTH_SPIKE_DAMAGE, unlockLevel: 1 },
    { ...STONE_SKIN_UTILITY, unlockLevel: 1 },
    // Counter element (Mercury counters Venus): 1 damage, 1 utility
    { ...ICE_LANCE_DAMAGE, unlockLevel: 1 },
    { ...AQUA_HEAL_UTILITY, unlockLevel: 1 },
    // Neutral
    { ...FOCUS_STRIKE_NEUTRAL, unlockLevel: 1 },
  ],
  manaContribution: 1,
  description: 'A sturdy Earth adept who breaks through enemy defenses',
};

export const WAR_MAGE: UnitDefinition = {
  id: 'war-mage',
  name: 'War Mage',
  element: 'Mars',
  role: 'Elemental Mage',
  baseStats: {
    hp: 80,
    pp: 25,
    atk: 10,
    def: 8,
    mag: 18,
    spd: 12,
  },
  growthRates: {
    hp: 15,
    pp: 6,
    atk: 2,
    def: 2,
    mag: 5,
    spd: 2,
  },
  abilities: [
    { ...STRIKE, unlockLevel: 1 },
    // Same element (Mars): 1 damage, 1 utility
    { ...FLAME_BURST_DAMAGE, unlockLevel: 1 },
    { ...FIRE_WARD_UTILITY, unlockLevel: 1 },
    // Counter element (Jupiter counters Mars): 1 damage, 1 utility
    { ...GALE_FORCE_DAMAGE, unlockLevel: 1 },
    { ...WIND_BARRIER_UTILITY, unlockLevel: 1 },
    // Neutral
    { ...FOCUS_STRIKE_NEUTRAL, unlockLevel: 1 },
  ],
  manaContribution: 2,
  description: 'A fire mage who burns enemies with powerful psynergy',
};

export const MYSTIC: UnitDefinition = {
  id: 'mystic',
  name: 'Mystic',
  element: 'Mercury',
  role: 'Healer',
  baseStats: {
    hp: 90,
    pp: 30,
    atk: 8,
    def: 10,
    mag: 16,
    spd: 11,
  },
  growthRates: {
    hp: 18,
    pp: 7,
    atk: 1,
    def: 2,
    mag: 4,
    spd: 2,
  },
  abilities: [
    { ...STRIKE, unlockLevel: 1 },
    // Same element (Mercury): 1 damage, 1 utility
    { ...ICE_LANCE_DAMAGE, unlockLevel: 1 },
    { ...AQUA_HEAL_UTILITY, unlockLevel: 1 },
    // Counter element (Venus counters Mercury): 1 damage, 1 utility
    { ...EARTH_SPIKE_DAMAGE, unlockLevel: 1 },
    { ...STONE_SKIN_UTILITY, unlockLevel: 1 },
    // Neutral
    { ...FOCUS_STRIKE_NEUTRAL, unlockLevel: 1 },
  ],
  manaContribution: 2,
  description: 'A water mystic who heals allies and freezes enemies',
};

export const RANGER: UnitDefinition = {
  id: 'ranger',
  name: 'Ranger',
  element: 'Jupiter',
  role: 'Rogue Assassin',
  baseStats: {
    hp: 85,
    pp: 20,
    atk: 16,
    def: 9,
    mag: 10,
    spd: 18,
  },
  growthRates: {
    hp: 16,
    pp: 5,
    atk: 4,
    def: 2,
    mag: 2,
    spd: 4,
  },
  abilities: [
    { ...STRIKE, unlockLevel: 1 },
    // Same element (Jupiter): 1 damage, 1 utility
    { ...GALE_FORCE_DAMAGE, unlockLevel: 1 },
    { ...WIND_BARRIER_UTILITY, unlockLevel: 1 },
    // Counter element (Mars counters Jupiter): 1 damage, 1 utility
    { ...FLAME_BURST_DAMAGE, unlockLevel: 1 },
    { ...FIRE_WARD_UTILITY, unlockLevel: 1 },
    // Neutral
    { ...FOCUS_STRIKE_NEUTRAL, unlockLevel: 1 },
  ],
  manaContribution: 1,
  description: 'A swift wind ranger who strikes with precision and blinds foes',
};

// ============================================================================
// Recruitable Units (6 new units for Houses 1-20)
// ============================================================================

export const SENTINEL: UnitDefinition = {
  id: 'sentinel',
  name: 'Sentinel',
  element: 'Venus',
  role: 'Support Buffer',
  baseStats: {
    hp: 110,
    pp: 18,
    atk: 12,
    def: 18,
    mag: 9,
    spd: 9,
  },
  growthRates: {
    hp: 22,
    pp: 4,
    atk: 2,
    def: 5,
    mag: 2,
    spd: 1,
  },
  abilities: [
    { ...STRIKE, unlockLevel: 1 },
    { ...BOOST_DEF, unlockLevel: 1 },
    { ...GUARD_BREAK, unlockLevel: 2 },
    { ...QUAKE, unlockLevel: 3 },
  ],
  manaContribution: 1,
  description: 'A defensive sentinel who protects allies and breaks enemy guards',
};

export const STORMCALLER: UnitDefinition = {
  id: 'stormcaller',
  name: 'Stormcaller',
  element: 'Jupiter',
  role: 'AoE Fire Mage',
  baseStats: {
    hp: 75,
    pp: 28,
    atk: 9,
    def: 7,
    mag: 20,
    spd: 15,
  },
  growthRates: {
    hp: 14,
    pp: 7,
    atk: 1,
    def: 1,
    mag: 6,
    spd: 3,
  },
  abilities: [
    { ...STRIKE, unlockLevel: 1 },
    { ...GUST, unlockLevel: 1 },
    { ...CHAIN_LIGHTNING, unlockLevel: 2 },
    { ...BLIND, unlockLevel: 3 },
  ],
  manaContribution: 3,
  description: 'A storm caller who unleashes chain lightning on all enemies',
};

export const BLAZE: UnitDefinition = {
  id: 'blaze',
  name: 'Blaze',
  element: 'Mars',
  role: 'Balanced Warrior',
  baseStats: {
    hp: 95,
    pp: 22,
    atk: 15,
    def: 11,
    mag: 14,
    spd: 13,
  },
  growthRates: {
    hp: 18,
    pp: 5,
    atk: 3,
    def: 2,
    mag: 4,
    spd: 3,
  },
  abilities: [
    { ...STRIKE, unlockLevel: 1 },
    { ...HEAVY_STRIKE, unlockLevel: 1 },
    { ...FIREBALL, unlockLevel: 2 },
    { ...BURN_TOUCH, unlockLevel: 3 },
  ],
  manaContribution: 2,
  description: 'A versatile Mars warrior who balances physical and magical combat',
};

export const KARIS: UnitDefinition = {
  id: 'karis',
  name: 'Karis',
  element: 'Mercury',
  role: 'Versatile Scholar',
  baseStats: {
    hp: 88,
    pp: 28,
    atk: 7,
    def: 9,
    mag: 17,
    spd: 12,
  },
  growthRates: {
    hp: 17,
    pp: 6,
    atk: 1,
    def: 2,
    mag: 5,
    spd: 2,
  },
  abilities: [
    { ...STRIKE, unlockLevel: 1 },
    { ...ICE_SHARD, unlockLevel: 1 },
    { ...HEAL, unlockLevel: 2 },
    { ...FREEZE_BLAST, unlockLevel: 3 },
    { ...PARTY_HEAL, unlockLevel: 4 },
  ],
  manaContribution: 2,
  description: 'A scholarly mage with mastery of ice magic and healing arts',
};

export const TYRELL: UnitDefinition = {
  id: 'tyrell',
  name: 'Tyrell',
  element: 'Mars',
  role: 'Pure DPS',
  baseStats: {
    hp: 92,
    pp: 18,
    atk: 18,
    def: 10,
    mag: 12,
    spd: 16,
  },
  growthRates: {
    hp: 17,
    pp: 4,
    atk: 5,
    def: 2,
    mag: 3,
    spd: 4,
  },
  abilities: [
    { ...STRIKE, unlockLevel: 1 },
    { ...PRECISE_JAB, unlockLevel: 1 },
    { ...HEAVY_STRIKE, unlockLevel: 2 },
    { ...FIREBALL, unlockLevel: 3 },
    { ...BURN_TOUCH, unlockLevel: 4 },
  ],
  manaContribution: 1,
  description: 'A relentless damage dealer who excels in both physical and fire attacks',
};

export const FELIX: UnitDefinition = {
  id: 'felix',
  name: 'Felix',
  element: 'Venus',
  role: 'Master Warrior',
  baseStats: {
    hp: 125,
    pp: 16,
    atk: 16,
    def: 18,
    mag: 9,
    spd: 11,
  },
  growthRates: {
    hp: 26,
    pp: 4,
    atk: 4,
    def: 5,
    mag: 2,
    spd: 2,
  },
  abilities: [
    { ...STRIKE, unlockLevel: 1 },
    { ...GUARD_BREAK, unlockLevel: 1 },
    { ...HEAVY_STRIKE, unlockLevel: 2 },
    { ...QUAKE, unlockLevel: 3 },
    { ...BOOST_DEF, unlockLevel: 4 },
  ],
  manaContribution: 1,
  description: 'A legendary earth warrior with unmatched physical prowess and defensive mastery',
};

// ============================================================================
// Export all units
// ============================================================================

export const UNIT_DEFINITIONS: Record<string, UnitDefinition> = {
  adept: ADEPT,
  'war-mage': WAR_MAGE,
  mystic: MYSTIC,
  ranger: RANGER,
  sentinel: SENTINEL,
  stormcaller: STORMCALLER,
  blaze: BLAZE,
  karis: KARIS,
  tyrell: TYRELL,
  felix: FELIX,
};
