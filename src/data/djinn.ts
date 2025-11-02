import type { Djinn } from '@/types/Djinn';

/**
 * All 12 Djinn from GAME_MECHANICS.md Section 2
 */

// ========== VENUS (EARTH) DJINN ==========
export const FLINT: Djinn = {
  id: 'flint',
  name: 'Flint',
  element: 'Venus',
  tier: 1,
  lore: 'A sturdy earth spirit found in Vale Cavern',
  unleashEffect: {
    type: 'damage',
    basePower: 50,
    targets: 'single-enemy',
  },
  source: 'Vale Cavern (Tutorial)',
};

export const GRANITE: Djinn = {
  id: 'granite',
  name: 'Granite',
  element: 'Venus',
  tier: 2,
  lore: 'A rock-solid earth spirit from Kolima Forest',
  unleashEffect: {
    type: 'damage',
    basePower: 80,
    targets: 'single-enemy',
  },
  source: 'Kolima Forest (Recruit Mia)',
};

export const BANE: Djinn = {
  id: 'bane',
  name: 'Bane',
  element: 'Venus',
  tier: 3,
  lore: 'A fearsome earth spirit guarding Mercury Lighthouse',
  unleashEffect: {
    type: 'damage',
    basePower: 120,
    targets: 'single-enemy',
  },
  source: 'Mercury Lighthouse (Boss drop)',
};

// ========== MARS (FIRE) DJINN ==========
export const FORGE: Djinn = {
  id: 'forge',
  name: 'Forge',
  element: 'Mars',
  tier: 1,
  lore: 'A blazing fire spirit from Goma Plateau',
  unleashEffect: {
    type: 'damage',
    basePower: 55,
    targets: 'single-enemy',
  },
  source: 'Goma Plateau',
};

export const CORONA: Djinn = {
  id: 'corona',
  name: 'Corona',
  element: 'Mars',
  tier: 2,
  lore: 'A scorching fire spirit from Mt. Aleph',
  unleashEffect: {
    type: 'damage',
    basePower: 85,
    targets: 'all-enemies',
  },
  source: 'Mt. Aleph',
};

export const FURY: Djinn = {
  id: 'fury',
  name: 'Fury',
  element: 'Mars',
  tier: 3,
  lore: 'A raging fire spirit from Mars Lighthouse',
  unleashEffect: {
    type: 'damage',
    basePower: 130,
    targets: 'all-enemies',
  },
  source: 'Mars Lighthouse (Boss drop)',
};

// ========== MERCURY (WATER) DJINN ==========
export const FIZZ: Djinn = {
  id: 'fizz',
  name: 'Fizz',
  element: 'Mercury',
  tier: 1,
  lore: 'A bubbling water spirit from Mogall Forest',
  unleashEffect: {
    type: 'heal',
    basePower: 60,
    targets: 'single-ally',
  },
  source: 'Mogall Forest',
};

export const TONIC: Djinn = {
  id: 'tonic',
  name: 'Tonic',
  element: 'Mercury',
  tier: 2,
  lore: 'A soothing water spirit from Xian',
  unleashEffect: {
    type: 'heal',
    basePower: 100,
    targets: 'all-allies',
  },
  source: 'Xian (Shop)',
};

export const CRYSTAL: Djinn = {
  id: 'crystal',
  name: 'Crystal',
  element: 'Mercury',
  tier: 3,
  lore: 'A pristine water spirit from Mercury Lighthouse',
  unleashEffect: {
    type: 'heal',
    basePower: 150,
    targets: 'all-allies',
  },
  source: 'Mercury Lighthouse (Hidden room)',
};

// ========== JUPITER (WIND) DJINN ==========
export const BREEZE: Djinn = {
  id: 'breeze',
  name: 'Breeze',
  element: 'Jupiter',
  tier: 1,
  lore: 'A swift wind spirit from Kalay Docks',
  unleashEffect: {
    type: 'damage',
    basePower: 45,
    targets: 'all-enemies',
  },
  source: 'Kalay Docks',
};

export const SQUALL: Djinn = {
  id: 'squall',
  name: 'Squall',
  element: 'Jupiter',
  tier: 2,
  lore: 'A violent wind spirit from Tolbi',
  unleashEffect: {
    type: 'buff',
    basePower: 0,
    targets: 'all-allies',
  },
  source: 'Tolbi (Colosso reward)',
};

export const STORM: Djinn = {
  id: 'storm',
  name: 'Storm',
  element: 'Jupiter',
  tier: 3,
  lore: 'A devastating wind spirit from Jupiter Lighthouse',
  unleashEffect: {
    type: 'damage',
    basePower: 140,
    targets: 'all-enemies',
  },
  source: 'Jupiter Lighthouse (Boss drop)',
};

/**
 * All Djinn indexed by ID
 */
export const ALL_DJINN: Record<string, Djinn> = {
  flint: FLINT,
  granite: GRANITE,
  bane: BANE,
  forge: FORGE,
  corona: CORONA,
  fury: FURY,
  fizz: FIZZ,
  tonic: TONIC,
  crystal: CRYSTAL,
  breeze: BREEZE,
  squall: SQUALL,
  storm: STORM,
};

/**
 * Djinn by element
 */
export const DJINN_BY_ELEMENT = {
  Venus: [FLINT, GRANITE, BANE],
  Mars: [FORGE, CORONA, FURY],
  Mercury: [FIZZ, TONIC, CRYSTAL],
  Jupiter: [BREEZE, SQUALL, STORM],
};
