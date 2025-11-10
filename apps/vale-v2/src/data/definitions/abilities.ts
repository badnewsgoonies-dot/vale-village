/**
 * Ability definitions
 * These will be validated against AbilitySchema at startup
 *
 * Golden Path (Chapter 1): 12 abilities
 * - Physical: strike, heavy-strike, guard-break, precise-jab
 * - Psynergy: fireball, ice-shard, quake, gust, chain-lightning
 * - Healing: heal, party-heal
 * - Buffs: boost-atk, boost-def
 * - Debuffs: weaken-def, blind
 */
import type { Ability } from '@/data/schemas/AbilitySchema';

// ============================================================================
// Physical Abilities (4)
// ============================================================================

export const STRIKE: Ability = {
  id: 'strike',
  name: 'Strike',
  type: 'physical',
  manaCost: 0,
  basePower: 0, // Uses unit's ATK
  targets: 'single-enemy',
  unlockLevel: 1,
  description: 'Basic physical attack',
};

export const HEAVY_STRIKE: Ability = {
  id: 'heavy-strike',
  name: 'Heavy Strike',
  type: 'physical',
  manaCost: 0,
  basePower: 15,
  targets: 'single-enemy',
  unlockLevel: 2,
  description: 'Powerful physical strike',
};

export const GUARD_BREAK: Ability = {
  id: 'guard-break',
  name: 'Guard Break',
  type: 'physical',
  manaCost: 0,
  basePower: 18,
  targets: 'single-enemy',
  unlockLevel: 2,
  description: 'Strikes through defenses, reducing enemy DEF',
  buffEffect: {
    def: -6,
  },
  duration: 2,
};

export const PRECISE_JAB: Ability = {
  id: 'precise-jab',
  name: 'Precise Jab',
  type: 'physical',
  manaCost: 0,
  basePower: 12,
  targets: 'single-enemy',
  unlockLevel: 1,
  description: 'High accuracy attack that cannot crit',
};

// ============================================================================
// Psynergy Abilities (5)
// ============================================================================

export const FIREBALL: Ability = {
  id: 'fireball',
  name: 'Fireball',
  type: 'psynergy',
  element: 'Mars',
  manaCost: 2,
  basePower: 35,
  targets: 'single-enemy',
  unlockLevel: 1,
  description: 'Fire elemental attack',
};

export const ICE_SHARD: Ability = {
  id: 'ice-shard',
  name: 'Ice Shard',
  type: 'psynergy',
  element: 'Mercury',
  manaCost: 2,
  basePower: 32,
  targets: 'single-enemy',
  unlockLevel: 1,
  description: 'Ice elemental attack',
};

export const QUAKE: Ability = {
  id: 'quake',
  name: 'Quake',
  type: 'psynergy',
  element: 'Venus',
  manaCost: 3,
  basePower: 30,
  targets: 'all-enemies',
  unlockLevel: 2,
  description: 'Earth elemental attack hitting all enemies',
};

export const GUST: Ability = {
  id: 'gust',
  name: 'Gust',
  type: 'psynergy',
  element: 'Jupiter',
  manaCost: 2,
  basePower: 30,
  targets: 'single-enemy',
  unlockLevel: 1,
  description: 'Wind elemental attack',
};

export const CHAIN_LIGHTNING: Ability = {
  id: 'chain-lightning',
  name: 'Chain Lightning',
  type: 'psynergy',
  element: 'Jupiter',
  manaCost: 4,
  basePower: 25,
  targets: 'all-enemies',
  unlockLevel: 3,
  description: 'Lightning that chains between all enemies',
  chainDamage: true,
};

// ============================================================================
// Healing Abilities (2)
// ============================================================================

export const HEAL: Ability = {
  id: 'heal',
  name: 'Heal',
  type: 'healing',
  manaCost: 2,
  basePower: 40,
  targets: 'single-ally',
  unlockLevel: 1,
  description: 'Restores HP to a single ally',
};

export const PARTY_HEAL: Ability = {
  id: 'party-heal',
  name: 'Party Heal',
  type: 'healing',
  manaCost: 4,
  basePower: 25,
  targets: 'all-allies',
  unlockLevel: 2,
  description: 'Restores HP to all allies',
};

// ============================================================================
// Buff Abilities (2)
// ============================================================================

export const BOOST_ATK: Ability = {
  id: 'boost-atk',
  name: 'Boost Attack',
  type: 'buff',
  manaCost: 2,
  basePower: 0,
  targets: 'single-ally',
  unlockLevel: 1,
  description: 'Increases ally ATK',
  buffEffect: {
    atk: 8,
  },
  duration: 3,
};

export const BOOST_DEF: Ability = {
  id: 'boost-def',
  name: 'Boost Defense',
  type: 'buff',
  manaCost: 2,
  basePower: 0,
  targets: 'single-ally',
  unlockLevel: 1,
  description: 'Increases ally DEF',
  buffEffect: {
    def: 8,
  },
  duration: 3,
};

// ============================================================================
// Debuff Abilities (2)
// ============================================================================

export const WEAKEN_DEF: Ability = {
  id: 'weaken-def',
  name: 'Weaken Defense',
  type: 'debuff',
  manaCost: 2,
  basePower: 0,
  targets: 'single-enemy',
  unlockLevel: 2,
  description: 'Reduces enemy DEF',
  buffEffect: {
    def: -6,
  },
  duration: 2,
};

export const BLIND: Ability = {
  id: 'blind',
  name: 'Blind',
  type: 'debuff',
  manaCost: 2,
  basePower: 0,
  targets: 'single-enemy',
  unlockLevel: 2,
  description: 'Reduces enemy accuracy',
  buffEffect: {
    evasion: -20, // Negative evasion = accuracy debuff
  },
  duration: 2,
};

// ============================================================================
// Export all abilities
// ============================================================================

export const ABILITIES: Record<string, Ability> = {
  // Physical
  strike: STRIKE,
  'heavy-strike': HEAVY_STRIKE,
  'guard-break': GUARD_BREAK,
  'precise-jab': PRECISE_JAB,
  // Psynergy
  fireball: FIREBALL,
  'ice-shard': ICE_SHARD,
  quake: QUAKE,
  gust: GUST,
  'chain-lightning': CHAIN_LIGHTNING,
  // Healing
  heal: HEAL,
  'party-heal': PARTY_HEAL,
  // Buffs
  'boost-atk': BOOST_ATK,
  'boost-def': BOOST_DEF,
  // Debuffs
  'weaken-def': WEAKEN_DEF,
  blind: BLIND,
};

