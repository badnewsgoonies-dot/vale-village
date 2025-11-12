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
  aiHints: {
    priority: 1.0,
    target: 'weakest',
    avoidOverkill: false,
  },
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
  aiHints: {
    priority: 2.0,
    target: 'weakest',
    avoidOverkill: true,
  },
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
  aiHints: {
    priority: 2.5,
    target: 'highestDef',
    avoidOverkill: false,
  },
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
  aiHints: {
    priority: 1.5,
    target: 'weakest',
    avoidOverkill: true,
  },
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
  aiHints: {
    priority: 2.0,
    target: 'lowestRes',
    avoidOverkill: false,
  },
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
  aiHints: {
    priority: 2.0,
    target: 'lowestRes',
    avoidOverkill: false,
  },
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
  aiHints: {
    priority: 2.5,
    target: 'random',
    avoidOverkill: false,
  },
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
  aiHints: {
    priority: 1.5,
    target: 'weakest',
    avoidOverkill: false,
  },
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
  aiHints: {
    priority: 3.0,
    target: 'random',
    avoidOverkill: false,
  },
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
  aiHints: {
    priority: 2.5,
    target: 'healerFirst',
    avoidOverkill: false,
  },
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
  aiHints: {
    priority: 3.0,
    target: 'random',
    avoidOverkill: false,
  },
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
  aiHints: {
    priority: 1.5,
    target: 'random',
    opener: true,
  },
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
  aiHints: {
    priority: 1.5,
    target: 'random',
    opener: true,
  },
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
  aiHints: {
    priority: 2.0,
    target: 'lowestRes',
    avoidOverkill: false,
  },
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
  aiHints: {
    priority: 2.0,
    target: 'random',
    avoidOverkill: false,
  },
};

// ============================================================================
// Status Effect Abilities (4)
// ============================================================================

export const POISON_STRIKE: Ability = {
  id: 'poison-strike',
  name: 'Poison Strike',
  type: 'physical',
  manaCost: 1,
  basePower: 10,
  targets: 'single-enemy',
  unlockLevel: 2,
  description: 'Physical attack that poisons the target',
  statusEffect: {
    type: 'poison',
    duration: 3,
  },
  aiHints: {
    priority: 2.0,
    target: 'weakest',
    avoidOverkill: false,
  },
};

export const BURN_TOUCH: Ability = {
  id: 'burn-touch',
  name: 'Burn Touch',
  type: 'psynergy',
  element: 'Mars',
  manaCost: 2,
  basePower: 25,
  targets: 'single-enemy',
  unlockLevel: 2,
  description: 'Fire psynergy that burns the target',
  statusEffect: {
    type: 'burn',
    duration: 3,
  },
  aiHints: {
    priority: 2.0,
    target: 'weakest',
    avoidOverkill: false,
  },
};

export const FREEZE_BLAST: Ability = {
  id: 'freeze-blast',
  name: 'Freeze Blast',
  type: 'psynergy',
  element: 'Mercury',
  manaCost: 2,
  basePower: 20,
  targets: 'single-enemy',
  unlockLevel: 3,
  description: 'Ice psynergy that freezes the target',
  statusEffect: {
    type: 'freeze',
    duration: 2,
  },
  aiHints: {
    priority: 2.5,
    target: 'weakest',
    avoidOverkill: false,
  },
};

export const PARALYZE_SHOCK: Ability = {
  id: 'paralyze-shock',
  name: 'Paralyze Shock',
  type: 'psynergy',
  element: 'Jupiter',
  manaCost: 2,
  basePower: 15,
  targets: 'single-enemy',
  unlockLevel: 3,
  description: 'Lightning psynergy that paralyzes the target',
  statusEffect: {
    type: 'paralyze',
    duration: 2,
  },
  aiHints: {
    priority: 2.0,
    target: 'healerFirst',
    avoidOverkill: false,
  },
};

// ============================================================================
// Export all abilities
// ============================================================================

export const ABILITIES: Record<string, Ability> = {
  // Physical
  strike: STRIKE,
  attack: STRIKE,
  'heavy-strike': HEAVY_STRIKE,
  'guard-break': GUARD_BREAK,
  'precise-jab': PRECISE_JAB,
  'poison-strike': POISON_STRIKE,
  // Psynergy
  fireball: FIREBALL,
  'ice-shard': ICE_SHARD,
  quake: QUAKE,
  gust: GUST,
  'chain-lightning': CHAIN_LIGHTNING,
  'burn-touch': BURN_TOUCH,
  'freeze-blast': FREEZE_BLAST,
  'paralyze-shock': PARALYZE_SHOCK,
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
