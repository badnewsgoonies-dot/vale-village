/**
 * Unit definitions
 * These will be validated against UnitDefinitionSchema at startup
 * 
 * Golden Path (Chapter 1): 6 units (4 starters + 2 recruits)
 * - Starters: Adept (Venus), War Mage (Mars), Mystic (Mercury), Ranger (Jupiter)
 * - Recruits: Sentinel (Venus), Stormcaller (Jupiter)
 */
import type { UnitDefinition } from '../schemas/UnitSchema';
import {
  STRIKE,
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
    { ...GUARD_BREAK, unlockLevel: 2 },
    { ...QUAKE, unlockLevel: 3 },
  ],
  manaContribution: 1,
  description: 'A sturdy Earth adept who breaks through enemy defenses',
};

export const WAR_MAGE: UnitDefinition = {
  id: 'war_mage',
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
    { ...FIREBALL, unlockLevel: 1 },
    { ...BOOST_ATK, unlockLevel: 2 },
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
    { ...HEAL, unlockLevel: 1 },
    { ...PARTY_HEAL, unlockLevel: 2 },
    { ...ICE_SHARD, unlockLevel: 3 },
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
    { ...PRECISE_JAB, unlockLevel: 1 },
    { ...GUST, unlockLevel: 2 },
    { ...BLIND, unlockLevel: 2 },
  ],
  manaContribution: 1,
  description: 'A swift wind ranger who strikes with precision and blinds foes',
};

// ============================================================================
// Recruitable Units (2 in GP)
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

// ============================================================================
// Export all units
// ============================================================================

export const UNIT_DEFINITIONS: Record<string, UnitDefinition> = {
  adept: ADEPT,
  war_mage: WAR_MAGE,
  mystic: MYSTIC,
  ranger: RANGER,
  sentinel: SENTINEL,
  stormcaller: STORMCALLER,
};
