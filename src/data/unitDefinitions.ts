import type { UnitDefinition } from '@/types/Unit';
import {
  SLASH,
  CLEAVE,
  QUAKE,
  CLAY_SPIRE,
  RAGNAROK,
  JUDGMENT,
  FIREBALL,
  VOLCANO,
  METEOR_STRIKE,
  PYROCLASM,
  PLY,
  FROST,
  ICE_HORN,
  WISH,
  GLACIAL_BLESSING,
  GUST,
  PLASMA,
  THUNDERCLAP,
  TEMPEST,
  BLESSING,
  GUARDIANS_STANCE,
  WINDS_FAVOR,
} from './abilities';

/**
 * All 10 recruitable units with exact stats from GAME_MECHANICS.md Section 1.3
 */

/**
 * Isaac (Venus - Balanced Warrior)
 * Stats from GAME_MECHANICS.md Section 1.3
 */
export const ISAAC: UnitDefinition = {
  id: 'isaac',
  name: 'Isaac',
  element: 'Venus',
  role: 'Balanced Warrior',
  baseStats: {
    hp: 100,
    pp: 24,
    atk: 14, // BALANCE: 15→14 (unit identity vs Garet)
    def: 10,
    mag: 12,
    spd: 12,
  },
  growthRates: {
    hp: 20,
    pp: 3,
    atk: 3,
    def: 2,
    mag: 2,
    spd: 1,
  },
  abilities: [
    SLASH,
    QUAKE,
    CLAY_SPIRE,
    RAGNAROK,
    JUDGMENT,
  ],
  manaContribution: 2,
  description: 'A balanced Earth Adept from Vale, skilled in both combat and Psynergy',
};

/**
 * Garet (Mars - Pure DPS)
 * Stats from GAME_MECHANICS.md Section 1.3
 */
export const GARET: UnitDefinition = {
  id: 'garet',
  name: 'Garet',
  element: 'Mars',
  role: 'Pure DPS',
  baseStats: {
    hp: 120,
    pp: 15,
    atk: 19, // BALANCE: 18→19 (glass cannon)
    def: 7,  // BALANCE: 8→7 (glass cannon fragility)
    mag: 10,
    spd: 8,  // BALANCE: 10→8 (unit identity)
  },
  growthRates: {
    hp: 15,
    pp: 3,
    atk: 3, // BALANCE: 4→3 (reduce power gap)
    def: 1,
    mag: 2,
    spd: 1,
  },
  abilities: [
    SLASH,
    FIREBALL,
    VOLCANO,
    METEOR_STRIKE,
    PYROCLASM,
  ],
  manaContribution: 1,
  description: 'A powerful Fire Adept focused on raw damage output',
};

/**
 * Ivan (Jupiter - Elemental Mage)
 */
export const IVAN: UnitDefinition = {
  id: 'ivan',
  name: 'Ivan',
  element: 'Jupiter',
  role: 'Elemental Mage',
  baseStats: {
    hp: 80,
    pp: 30,
    atk: 10,
    def: 6,
    mag: 18,
    spd: 15,
  },
  growthRates: {
    hp: 12,
    pp: 6,
    atk: 2,
    def: 1,
    mag: 4,
    spd: 2,
  },
  abilities: [
    SLASH,
    GUST,
    PLASMA,
    THUNDERCLAP,
    TEMPEST,
  ],
  manaContribution: 3,
  description: 'A swift Wind Adept with devastating elemental magic',
};

/**
 * Mia (Mercury - Healer)
 */
export const MIA: UnitDefinition = {
  id: 'mia',
  name: 'Mia',
  element: 'Mercury',
  role: 'Healer',
  baseStats: {
    hp: 90,
    pp: 25,
    atk: 12,
    def: 12,
    mag: 16,
    spd: 11,
  },
  growthRates: {
    hp: 15,
    pp: 5,
    atk: 2,
    def: 3,
    mag: 3,
    spd: 1,
  },
  abilities: [
    PLY,
    FROST,
    ICE_HORN,
    WISH,
    GLACIAL_BLESSING,
  ],
  manaContribution: 2,
  description: 'A compassionate Water Adept specialized in healing and support',
};

/**
 * Felix (Venus - Rogue Assassin)
 * Stats from GAME_MECHANICS.md Section 1.3
 */
export const FELIX: UnitDefinition = {
  id: 'felix',
  name: 'Felix',
  element: 'Venus',
  role: 'Rogue Assassin',
  baseStats: {
    hp: 95,
    pp: 18,
    atk: 17,
    def: 9,
    mag: 11,
    spd: 18,
  },
  growthRates: {
    hp: 14,
    pp: 3,
    atk: 3, // BALANCE: 4→3 (reduce power gap)
    def: 1,
    mag: 2,
    spd: 3,
  },
  abilities: [
    SLASH,
    CLEAVE,
    CLAY_SPIRE,
    METEOR_STRIKE,
    PYROCLASM,
  ],
  manaContribution: 2,
  description: 'A fast Earth Adept specializing in quick, deadly strikes',
};

/**
 * Jenna (Mars - AoE Fire Mage)
 * Stats from GAME_MECHANICS.md Section 1.3
 */
export const JENNA: UnitDefinition = {
  id: 'jenna',
  name: 'Jenna',
  element: 'Mars',
  role: 'AoE Fire Mage',
  baseStats: {
    hp: 75,
    pp: 28,
    atk: 11, // BALANCE: 9→11 (glass cannon versatility)
    def: 5,
    mag: 28, // BALANCE: 20→28 (glass cannon high damage)
    spd: 13,
  },
  growthRates: {
    hp: 12,
    pp: 6,
    atk: 1,
    def: 1,
    mag: 5,
    spd: 2,
  },
  abilities: [
    SLASH,
    FIREBALL,
    VOLCANO,
    METEOR_STRIKE,
    PYROCLASM,
  ],
  manaContribution: 3,
  description: 'A powerful Fire Adept who excels at area-of-effect spells',
};

/**
 * Sheba (Jupiter - Support Buffer)
 */
export const SHEBA: UnitDefinition = {
  id: 'sheba',
  name: 'Sheba',
  element: 'Jupiter',
  role: 'Support Buffer',
  baseStats: {
    hp: 85,
    pp: 26,
    atk: 11,
    def: 7,
    mag: 17,
    spd: 14,
  },
  growthRates: {
    hp: 13,
    pp: 5,
    atk: 2,
    def: 2,
    mag: 4,
    spd: 2,
  },
  abilities: [
    SLASH,
    GUST,
    BLESSING,
    WINDS_FAVOR,
    TEMPEST,
  ],
  manaContribution: 2,
  description: 'A versatile Wind Adept skilled in buffing and support magic',
};

/**
 * Piers (Mercury - Defensive Tank)
 * Stats from GAME_MECHANICS.md Section 1.3
 */
export const PIERS: UnitDefinition = {
  id: 'piers',
  name: 'Piers',
  element: 'Mercury',
  role: 'Defensive Tank',
  baseStats: {
    hp: 140,
    pp: 20,
    atk: 10, // BALANCE: 14→10 (tank trades damage for survivability)
    def: 16,
    mag: 9,  // BALANCE: 13→9 (reduce magical damage)
    spd: 8,
  },
  growthRates: {
    hp: 18,
    pp: 4,
    atk: 1, // BALANCE: 2→1 (tanks don't scale ATK)
    def: 3,
    mag: 2,
    spd: 1,
  },
  abilities: [
    SLASH,
    FROST,
    GUARDIANS_STANCE,
    WISH,
    GLACIAL_BLESSING,
  ],
  manaContribution: 1,
  description: 'A stalwart Water Adept built to withstand enemy assaults',
};

/**
 * Kraden (Neutral - Versatile Scholar)
 * Stats from GAME_MECHANICS.md Section 1.3
 */
export const KRADEN: UnitDefinition = {
  id: 'kraden',
  name: 'Kraden',
  element: 'Neutral',
  role: 'Versatile Scholar',
  baseStats: {
    hp: 70,
    pp: 35,
    atk: 8,
    def: 8,
    mag: 15,
    spd: 10,
  },
  growthRates: {
    hp: 10,
    pp: 7,
    atk: 2, // BALANCE: 1→2 (improve scholar viability)
    def: 2,
    mag: 3,
    spd: 1,
  },
  abilities: [
    SLASH,
    QUAKE,
    BLESSING,
    RAGNAROK,
    JUDGMENT,
  ],
  manaContribution: 3,
  description: 'A wise scholar with diverse Psynergy abilities',
};

/**
 * Kyle (Mars - Master Warrior)
 */
export const KYLE: UnitDefinition = {
  id: 'kyle',
  name: 'Kyle',
  element: 'Mars',
  role: 'Master Warrior',
  baseStats: {
    hp: 130,
    pp: 22,
    atk: 16,
    def: 14,
    mag: 14,
    spd: 11,
  },
  growthRates: {
    hp: 17,
    pp: 4,
    atk: 3,
    def: 2,
    mag: 2,
    spd: 1,
  },
  abilities: [
    SLASH,
    FIREBALL,
    GUARDIANS_STANCE,
    METEOR_STRIKE,
    PYROCLASM,
  ],
  manaContribution: 2,
  description: 'A seasoned Fire Adept and the ultimate warrior',
};

/**
 * All unit definitions indexed by ID
 */
export const UNIT_DEFINITIONS: Record<string, UnitDefinition> = {
  isaac: ISAAC,
  garet: GARET,
  ivan: IVAN,
  mia: MIA,
  felix: FELIX,
  jenna: JENNA,
  sheba: SHEBA,
  piers: PIERS,
  kraden: KRADEN,
  kyle: KYLE,
};

/**
 * Starter units (choose 1 at tutorial)
 */
export const STARTER_UNITS = [ISAAC, GARET, IVAN];
