import type { Ability } from '@/types/Ability';

/**
 * All ability definitions from GAME_MECHANICS.md Section 5.3
 */

// ========== PHYSICAL ATTACKS ==========
export const SLASH: Ability = {
  id: 'slash',
  name: 'Slash',
  type: 'physical',
  ppCost: 0,
  basePower: 0, // Uses unit's ATK
  targets: 'single-enemy',
  unlockLevel: 1,
  description: 'Basic physical attack',
};

export const CLEAVE: Ability = {
  id: 'cleave',
  name: 'Cleave',
  type: 'physical',
  ppCost: 0,
  basePower: 0,
  targets: 'single-enemy',
  unlockLevel: 2,
  description: 'Powerful physical strike',
};

// ========== VENUS (EARTH) ABILITIES ==========
export const QUAKE: Ability = {
  id: 'quake',
  name: 'Quake',
  type: 'psynergy',
  element: 'Venus',
  ppCost: 5,
  basePower: 30,
  targets: 'all-enemies',
  unlockLevel: 2,
  description: 'Earth elemental attack hitting all enemies',
};

export const CLAY_SPIRE: Ability = {
  id: 'clay-spire',
  name: 'Clay Spire',
  type: 'psynergy',
  element: 'Venus',
  ppCost: 10,
  basePower: 60,
  targets: 'single-enemy',
  unlockLevel: 3,
  description: 'Powerful earth spike attack',
};

export const RAGNAROK: Ability = {
  id: 'ragnarok',
  name: 'Ragnarok',
  type: 'psynergy',
  element: 'Venus',
  ppCost: 15,
  basePower: 100,
  targets: 'single-enemy',
  unlockLevel: 4,
  description: 'Devastating earth blade attack',
};

export const JUDGMENT: Ability = {
  id: 'judgment',
  name: 'Judgment',
  type: 'psynergy',
  element: 'Venus',
  ppCost: 25,
  basePower: 150,
  targets: 'all-enemies',
  unlockLevel: 5,
  description: 'Ultimate earth attack hitting all enemies',
};

// ========== MARS (FIRE) ABILITIES ==========
export const FIREBALL: Ability = {
  id: 'fireball',
  name: 'Fireball',
  type: 'psynergy',
  element: 'Mars',
  ppCost: 5,
  basePower: 32,
  targets: 'single-enemy',
  unlockLevel: 2,
  description: 'Fire elemental attack',
};

export const VOLCANO: Ability = {
  id: 'volcano',
  name: 'Volcano',
  type: 'psynergy',
  element: 'Mars',
  ppCost: 12,
  basePower: 65,
  targets: 'all-enemies',
  unlockLevel: 3,
  description: 'Fiery eruption hitting all enemies',
};

export const METEOR_STRIKE: Ability = {
  id: 'meteor-strike',
  name: 'Meteor Strike',
  type: 'psynergy',
  element: 'Mars',
  ppCost: 18,
  basePower: 110,
  targets: 'single-enemy',
  unlockLevel: 4,
  description: 'Devastating meteor attack',
};

export const PYROCLASM: Ability = {
  id: 'pyroclasm',
  name: 'Pyroclasm',
  type: 'psynergy',
  element: 'Mars',
  ppCost: 30,
  basePower: 170,
  targets: 'all-enemies',
  unlockLevel: 5,
  description: 'Ultimate fire explosion hitting all enemies',
};

// ========== MERCURY (WATER) ABILITIES ==========
export const PLY: Ability = {
  id: 'ply',
  name: 'Ply',
  type: 'healing',
  element: 'Mercury',
  ppCost: 4,
  basePower: 40,
  targets: 'single-ally',
  unlockLevel: 1,
  description: 'Restore HP to one ally',
};

export const FROST: Ability = {
  id: 'frost',
  name: 'Frost',
  type: 'psynergy',
  element: 'Mercury',
  ppCost: 6,
  basePower: 28,
  targets: 'all-enemies',
  unlockLevel: 2,
  description: 'Ice attack hitting all enemies',
};

export const ICE_HORN: Ability = {
  id: 'ice-horn',
  name: 'Ice Horn',
  type: 'psynergy',
  element: 'Mercury',
  ppCost: 11,
  basePower: 58,
  targets: 'single-enemy',
  unlockLevel: 3,
  description: 'Powerful ice spear attack',
};

export const WISH: Ability = {
  id: 'wish',
  name: 'Wish',
  type: 'healing',
  element: 'Mercury',
  ppCost: 15,
  basePower: 70,
  targets: 'all-allies',
  unlockLevel: 4,
  description: 'Restore HP to all allies',
};

export const GLACIAL_BLESSING: Ability = {
  id: 'glacial-blessing',
  name: 'Glacial Blessing',
  type: 'healing',
  element: 'Mercury',
  ppCost: 35,
  basePower: 120,
  targets: 'all-allies',
  unlockLevel: 5,
  revivesFallen: true,
  description: 'Ultimate healing spell that can revive fallen allies',
};

// ========== JUPITER (WIND) ABILITIES ==========
export const GUST: Ability = {
  id: 'gust',
  name: 'Gust',
  type: 'psynergy',
  element: 'Jupiter',
  ppCost: 4,
  basePower: 25,
  targets: 'single-enemy',
  unlockLevel: 2,
  description: 'Wind elemental attack',
};

export const PLASMA: Ability = {
  id: 'plasma',
  name: 'Plasma',
  type: 'psynergy',
  element: 'Jupiter',
  ppCost: 10,
  basePower: 55,
  targets: 'all-enemies',
  unlockLevel: 3,
  chainDamage: true,
  description: 'Chaining lightning attack',
};

export const THUNDERCLAP: Ability = {
  id: 'thunderclap',
  name: 'Thunderclap',
  type: 'psynergy',
  element: 'Jupiter',
  ppCost: 16,
  basePower: 95,
  targets: 'all-enemies',
  unlockLevel: 4,
  description: 'Powerful thunder strike',
};

export const TEMPEST: Ability = {
  id: 'tempest',
  name: 'Tempest',
  type: 'psynergy',
  element: 'Jupiter',
  ppCost: 28,
  basePower: 160,
  targets: 'all-enemies',
  unlockLevel: 5,
  description: 'Ultimate wind storm hitting all enemies',
};

// ========== BUFF/DEBUFF ABILITIES ==========
export const BLESSING: Ability = {
  id: 'blessing',
  name: 'Blessing',
  type: 'buff',
  ppCost: 8,
  basePower: 0,
  targets: 'all-allies',
  unlockLevel: 3,
  buffEffect: {
    atk: 1.25,
    def: 1.25,
  },
  duration: 3,
  description: 'Increase ATK and DEF by 25% for 3 turns',
};

export const GUARDIANS_STANCE: Ability = {
  id: 'guardians-stance',
  name: "Guardian's Stance",
  type: 'buff',
  ppCost: 6,
  basePower: 0,
  targets: 'all-allies',
  unlockLevel: 3,
  buffEffect: {
    def: 1.5,
  },
  duration: 2,
  description: 'Increase DEF by 50% for 2 turns',
};

export const WINDS_FAVOR: Ability = {
  id: 'winds-favor',
  name: "Wind's Favor",
  type: 'buff',
  ppCost: 10,
  basePower: 0,
  targets: 'all-allies',
  unlockLevel: 4,
  buffEffect: {
    spd: 1.4,
    evasion: 20,
  },
  duration: 3,
  description: 'Increase SPD by 40% and evasion by 20% for 3 turns',
};

// ========== LEGENDARY ABILITIES ==========
export const MEGIDDO: Ability = {
  id: 'megiddo',
  name: 'Megiddo',
  type: 'psynergy',
  element: 'Venus',
  ppCost: 25,
  basePower: 150,
  targets: 'single-enemy',
  unlockLevel: 99, // Only unlocked by Sol Blade
  description: 'Legendary sword technique unleashed by Sol Blade',
};

/**
 * All abilities indexed by ID
 */
export const ABILITIES: Record<string, Ability> = {
  // Physical Attacks
  'slash': SLASH,
  'cleave': CLEAVE,
  // Venus (Earth)
  'quake': QUAKE,
  'clay-spire': CLAY_SPIRE,
  'ragnarok': RAGNAROK,
  'judgment': JUDGMENT,
  // Mars (Fire)
  'fireball': FIREBALL,
  'volcano': VOLCANO,
  'meteor-strike': METEOR_STRIKE,
  'pyroclasm': PYROCLASM,
  // Mercury (Water)
  'ply': PLY,
  'frost': FROST,
  'ice-horn': ICE_HORN,
  'wish': WISH,
  'glacial-blessing': GLACIAL_BLESSING,
  // Jupiter (Wind)
  'gust': GUST,
  'plasma': PLASMA,
  'thunderclap': THUNDERCLAP,
  'tempest': TEMPEST,
  // Buffs
  'blessing': BLESSING,
  'guardians-stance': GUARDIANS_STANCE,
  'winds-favor': WINDS_FAVOR,
  // Legendary
  'megiddo': MEGIDDO,
};
