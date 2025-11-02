import type { UnitDefinition } from '@/types/Unit';
import { ABILITIES } from './abilities';

/**
 * All 10 recruitable units with exact stats from GAME_MECHANICS.md Section 1.3
 */

/**
 * Isaac (Venus - Balanced Warrior)
 * From GAME_MECHANICS.md Section 1.3
 */
export const ISAAC: UnitDefinition = {
  id: 'isaac',
  name: 'Isaac',
  element: 'Venus',
  role: 'Balanced Warrior',
  baseStats: {
    hp: 100,
    pp: 20,
    atk: 15,
    def: 10,
    mag: 12,
    spd: 12,
  },
  growthRates: {
    hp: 20,
    pp: 4,
    atk: 3,
    def: 2,
    mag: 2,
    spd: 1,
  },
  abilities: [
    ABILITIES.SLASH,
    ABILITIES.QUAKE,
    ABILITIES.CLAY_SPIRE,
    ABILITIES.RAGNAROK,
    ABILITIES.JUDGMENT,
  ],
  description: 'A balanced Earth Adept from Vale, skilled in both combat and Psynergy',
};

/**
 * Garet (Mars - Pure DPS)
 */
export const GARET: UnitDefinition = {
  id: 'garet',
  name: 'Garet',
  element: 'Mars',
  role: 'Pure DPS',
  baseStats: {
    hp: 120,
    pp: 15,
    atk: 18,
    def: 8,
    mag: 10,
    spd: 10,
  },
  growthRates: {
    hp: 15,
    pp: 3,
    atk: 4,
    def: 1,
    mag: 2,
    spd: 1,
  },
  abilities: [
    ABILITIES.SLASH,
    ABILITIES.FIREBALL,
    ABILITIES.VOLCANO,
    ABILITIES.METEOR_STRIKE,
    ABILITIES.PYROCLASM,
  ],
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
    ABILITIES.SLASH,
    ABILITIES.GUST,
    ABILITIES.PLASMA,
    ABILITIES.THUNDERCLAP,
    ABILITIES.TEMPEST,
  ],
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
    ABILITIES.PLY,
    ABILITIES.FROST,
    ABILITIES.ICE_HORN,
    ABILITIES.WISH,
    ABILITIES.GLACIAL_BLESSING,
  ],
  description: 'A compassionate Water Adept specialized in healing and support',
};

/**
 * Felix (Venus - Rogue Assassin)
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
    atk: 4,
    def: 1,
    mag: 2,
    spd: 3,
  },
  abilities: [
    ABILITIES.SLASH,
    ABILITIES.CLEAVE,
    ABILITIES.CLAY_SPIRE,
    ABILITIES.METEOR_STRIKE,
    ABILITIES.PYROCLASM,
  ],
  description: 'A fast Earth Adept specializing in quick, deadly strikes',
};

/**
 * Jenna (Mars - AoE Fire Mage)
 */
export const JENNA: UnitDefinition = {
  id: 'jenna',
  name: 'Jenna',
  element: 'Mars',
  role: 'AoE Fire Mage',
  baseStats: {
    hp: 75,
    pp: 28,
    atk: 9,
    def: 5,
    mag: 20,
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
    ABILITIES.SLASH,
    ABILITIES.FIREBALL,
    ABILITIES.VOLCANO,
    ABILITIES.METEOR_STRIKE,
    ABILITIES.PYROCLASM,
  ],
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
    ABILITIES.SLASH,
    ABILITIES.GUST,
    ABILITIES.BLESSING,
    ABILITIES.THUNDERCLAP,
    ABILITIES.TEMPEST,
  ],
  description: 'A versatile Wind Adept skilled in buffing and support magic',
};

/**
 * Piers (Mercury - Defensive Tank)
 */
export const PIERS: UnitDefinition = {
  id: 'piers',
  name: 'Piers',
  element: 'Mercury',
  role: 'Defensive Tank',
  baseStats: {
    hp: 140,
    pp: 20,
    atk: 14,
    def: 16,
    mag: 13,
    spd: 8,
  },
  growthRates: {
    hp: 18,
    pp: 4,
    atk: 2,
    def: 3,
    mag: 2,
    spd: 1,
  },
  abilities: [
    ABILITIES.SLASH,
    ABILITIES.FROST,
    ABILITIES.GUARDIANS_STANCE,
    ABILITIES.WISH,
    ABILITIES.GLACIAL_BLESSING,
  ],
  description: 'A stalwart Water Adept built to withstand enemy assaults',
};

/**
 * Kraden (Neutral - Versatile Scholar)
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
    atk: 1,
    def: 2,
    mag: 3,
    spd: 1,
  },
  abilities: [
    ABILITIES.SLASH,
    ABILITIES.QUAKE,
    ABILITIES.BLESSING,
    ABILITIES.RAGNAROK,
    ABILITIES.JUDGMENT,
  ],
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
    ABILITIES.SLASH,
    ABILITIES.FIREBALL,
    ABILITIES.GUARDIANS_STANCE,
    ABILITIES.METEOR_STRIKE,
    ABILITIES.PYROCLASM,
  ],
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
