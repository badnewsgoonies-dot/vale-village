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
  manaCost: 0,
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
  manaCost: 0,
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
  manaCost: 1,
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
  manaCost: 2,
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
  manaCost: 3,
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
  manaCost: 4,
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
  manaCost: 1,
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
  manaCost: 2,
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
  manaCost: 3,
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
  manaCost: 4,
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
  manaCost: 1,
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
  manaCost: 1,
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
  manaCost: 2,
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
  manaCost: 3,
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
  manaCost: 5,
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
  manaCost: 1,
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
  manaCost: 2,
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
  manaCost: 3,
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
  manaCost: 4,
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
  manaCost: 2,
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
  manaCost: 1,
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
  manaCost: 2,
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
  manaCost: 4,
  basePower: 150,
  targets: 'single-enemy',
  unlockLevel: 99, // Only unlocked by Sol Blade
  description: 'Legendary sword technique unleashed by Sol Blade',
};

// ========== DJINN-GRANTED ABILITIES ==========
// Venus Djinn abilities (Flint, Granite, Quartz)
export const EARTHQUAKE: Ability = {
  id: 'earthquake',
  name: 'Earthquake',
  type: 'psynergy',
  element: 'Venus',
  ppCost: 7,
  manaCost: 2,
  basePower: 45,
  targets: 'all-enemies',
  unlockLevel: 1,
  description: 'Granted by Flint - Shatters the earth beneath enemies',
};

export const MAGMA_SURGE: Ability = {
  id: 'magma-surge',
  name: 'Magma Surge',
  type: 'psynergy',
  element: 'Mars',
  ppCost: 7,
  manaCost: 2,
  basePower: 45,
  targets: 'single-enemy',
  unlockLevel: 1,
  description: 'Granted by Flint (counter) - Erupts lava at target',
};

export const STONE_SPIRE: Ability = {
  id: 'stone-spire',
  name: 'Stone Spire',
  type: 'psynergy',
  element: 'Venus',
  ppCost: 10,
  manaCost: 2,
  basePower: 70,
  targets: 'single-enemy',
  unlockLevel: 1,
  description: 'Granted by Granite - Impales enemy with stone pillar',
};

export const INFERNO_BURST: Ability = {
  id: 'inferno-burst',
  name: 'Inferno Burst',
  type: 'psynergy',
  element: 'Mars',
  ppCost: 10,
  manaCost: 2,
  basePower: 70,
  targets: 'all-enemies',
  unlockLevel: 1,
  description: 'Granted by Granite (counter) - Explosive fire damage',
};

export const CRYSTAL_POWDER: Ability = {
  id: 'crystal-powder',
  name: 'Crystal Powder',
  type: 'psynergy',
  element: 'Venus',
  ppCost: 12,
  manaCost: 2,
  basePower: 90,
  targets: 'single-enemy',
  unlockLevel: 1,
  description: 'Granted by Quartz - Razor-sharp crystal shards',
};

export const FLAME_SHIELD: Ability = {
  id: 'flame-shield',
  name: 'Flame Shield',
  type: 'psynergy',
  element: 'Mars',
  ppCost: 8,
  manaCost: 2,
  basePower: 0,
  targets: 'single-ally',
  unlockLevel: 1,
  description: 'Granted by Quartz (counter) - Fire barrier that reflects damage',
};

// Mars Djinn abilities (Forge, Cannon, Scorch)
export const VOLCANIC_BLAST: Ability = {
  id: 'volcanic-blast',
  name: 'Volcanic Blast',
  type: 'psynergy',
  element: 'Mars',
  ppCost: 9,
  manaCost: 2,
  basePower: 55,
  targets: 'all-enemies',
  unlockLevel: 1,
  description: 'Granted by Forge - Molten rock bombardment',
};

export const GAIA_SHIELD: Ability = {
  id: 'gaia-shield',
  name: 'Gaia Shield',
  type: 'psynergy',
  element: 'Venus',
  ppCost: 9,
  manaCost: 2,
  basePower: 0,
  targets: 'single-ally',
  unlockLevel: 1,
  description: 'Granted by Forge (counter) - Earth barrier increases DEF',
};

export const BLAST_BURN: Ability = {
  id: 'blast-burn',
  name: 'Blast Burn',
  type: 'psynergy',
  element: 'Mars',
  ppCost: 11,
  manaCost: 2,
  basePower: 75,
  targets: 'single-enemy',
  unlockLevel: 1,
  description: 'Granted by Cannon - Concentrated fire beam',
};

export const TECTONIC_SHIFT: Ability = {
  id: 'tectonic-shift',
  name: 'Tectonic Shift',
  type: 'psynergy',
  element: 'Venus',
  ppCost: 11,
  manaCost: 2,
  basePower: 75,
  targets: 'all-enemies',
  unlockLevel: 1,
  description: 'Granted by Cannon (counter) - Ground-shaking tremor',
};

export const SOLAR_FLARE: Ability = {
  id: 'solar-flare',
  name: 'Solar Flare',
  type: 'psynergy',
  element: 'Mars',
  ppCost: 14,
  manaCost: 3,
  basePower: 95,
  targets: 'all-enemies',
  unlockLevel: 1,
  description: 'Granted by Scorch - Searing solar rays',
};

export const EARTHEN_WALL: Ability = {
  id: 'earthen-wall',
  name: 'Earthen Wall',
  type: 'psynergy',
  element: 'Venus',
  ppCost: 10,
  manaCost: 2,
  basePower: 0,
  targets: 'all-allies',
  unlockLevel: 1,
  description: 'Granted by Scorch (counter) - Stone barrier protects party',
};

// Mercury Djinn abilities (Fizz, Sleet, Mist)
export const TIDAL_WAVE: Ability = {
  id: 'tidal-wave',
  name: 'Tidal Wave',
  type: 'psynergy',
  element: 'Mercury',
  ppCost: 8,
  manaCost: 2,
  basePower: 50,
  targets: 'all-enemies',
  unlockLevel: 1,
  description: 'Granted by Fizz - Crashing water attack',
};

export const LIGHTNING_BOLT: Ability = {
  id: 'lightning-bolt',
  name: 'Lightning Bolt',
  type: 'psynergy',
  element: 'Jupiter',
  ppCost: 8,
  manaCost: 2,
  basePower: 50,
  targets: 'single-enemy',
  unlockLevel: 1,
  description: 'Granted by Fizz (counter) - Electric shock',
};

export const FREEZE_PRISM: Ability = {
  id: 'freeze-prism',
  name: 'Freeze Prism',
  type: 'psynergy',
  element: 'Mercury',
  ppCost: 11,
  manaCost: 2,
  basePower: 68,
  targets: 'single-enemy',
  unlockLevel: 1,
  description: 'Granted by Sleet - Encases enemy in ice',
};

export const SPARK_STORM: Ability = {
  id: 'spark-storm',
  name: 'Spark Storm',
  type: 'psynergy',
  element: 'Jupiter',
  ppCost: 11,
  manaCost: 2,
  basePower: 68,
  targets: 'all-enemies',
  unlockLevel: 1,
  description: 'Granted by Sleet (counter) - Electric discharge',
};

export const DELUGE: Ability = {
  id: 'deluge',
  name: 'Deluge',
  type: 'psynergy',
  element: 'Mercury',
  ppCost: 13,
  manaCost: 3,
  basePower: 88,
  targets: 'all-enemies',
  unlockLevel: 1,
  description: 'Granted by Mist - Torrential downpour',
};

export const THUNDER_MINE: Ability = {
  id: 'thunder-mine',
  name: 'Thunder Mine',
  type: 'psynergy',
  element: 'Jupiter',
  ppCost: 13,
  manaCost: 3,
  basePower: 88,
  targets: 'single-enemy',
  unlockLevel: 1,
  description: 'Granted by Mist (counter) - Explosive electric trap',
};

// Jupiter Djinn abilities (Gust, Breeze, Zephyr)
export const WHIRLWIND: Ability = {
  id: 'whirlwind',
  name: 'Whirlwind',
  type: 'psynergy',
  element: 'Jupiter',
  ppCost: 9,
  manaCost: 2,
  basePower: 53,
  targets: 'all-enemies',
  unlockLevel: 1,
  description: 'Granted by Gust - Violent wind vortex',
};

export const FROST_BITE: Ability = {
  id: 'frost-bite',
  name: 'Frost Bite',
  type: 'psynergy',
  element: 'Mercury',
  ppCost: 9,
  manaCost: 2,
  basePower: 53,
  targets: 'single-enemy',
  unlockLevel: 1,
  description: 'Granted by Gust (counter) - Freezing wind attack',
};

export const STORM_RAY: Ability = {
  id: 'storm-ray',
  name: 'Storm Ray',
  type: 'psynergy',
  element: 'Jupiter',
  ppCost: 12,
  manaCost: 2,
  basePower: 72,
  targets: 'single-enemy',
  unlockLevel: 1,
  description: 'Granted by Breeze - Concentrated lightning beam',
};

export const BLIZZARD: Ability = {
  id: 'blizzard',
  name: 'Blizzard',
  type: 'psynergy',
  element: 'Mercury',
  ppCost: 12,
  manaCost: 2,
  basePower: 72,
  targets: 'all-enemies',
  unlockLevel: 1,
  description: 'Granted by Breeze (counter) - Freezing snowstorm',
};

export const TORNADO: Ability = {
  id: 'tornado',
  name: 'Tornado',
  type: 'psynergy',
  element: 'Jupiter',
  ppCost: 15,
  manaCost: 3,
  basePower: 93,
  targets: 'all-enemies',
  unlockLevel: 1,
  description: 'Granted by Zephyr - Devastating cyclone',
};

export const ARCTIC_BLAST: Ability = {
  id: 'arctic-blast',
  name: 'Arctic Blast',
  type: 'psynergy',
  element: 'Mercury',
  ppCost: 15,
  manaCost: 3,
  basePower: 93,
  targets: 'all-enemies',
  unlockLevel: 1,
  description: 'Granted by Zephyr (counter) - Sub-zero wind burst',
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
  // Djinn-Granted Abilities
  'earthquake': EARTHQUAKE,
  'magma-surge': MAGMA_SURGE,
  'stone-spire': STONE_SPIRE,
  'inferno-burst': INFERNO_BURST,
  'crystal-powder': CRYSTAL_POWDER,
  'flame-shield': FLAME_SHIELD,
  'volcanic-blast': VOLCANIC_BLAST,
  'gaia-shield': GAIA_SHIELD,
  'blast-burn': BLAST_BURN,
  'tectonic-shift': TECTONIC_SHIFT,
  'solar-flare': SOLAR_FLARE,
  'earthen-wall': EARTHEN_WALL,
  'tidal-wave': TIDAL_WAVE,
  'lightning-bolt': LIGHTNING_BOLT,
  'freeze-prism': FREEZE_PRISM,
  'spark-storm': SPARK_STORM,
  'deluge': DELUGE,
  'thunder-mine': THUNDER_MINE,
  'whirlwind': WHIRLWIND,
  'frost-bite': FROST_BITE,
  'storm-ray': STORM_RAY,
  'blizzard': BLIZZARD,
  'tornado': TORNADO,
  'arctic-blast': ARCTIC_BLAST,
};
