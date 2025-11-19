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
  description: 'High accuracy physical attack',
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
  description: 'Reduces enemy speed',
  buffEffect: {
    spd: -3,
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
// VS1 Demo Abilities
// ============================================================================

export const FLARE: Ability = {
  id: 'flare',
  name: 'Flare',
  type: 'psynergy',
  element: 'Mars',
  manaCost: 5,
  basePower: 30,
  targets: 'all-enemies',
  unlockLevel: 3,
  description: 'Fire elemental attack hitting all enemies',
  aiHints: {
    priority: 2.5,
    target: 'random',
    avoidOverkill: false,
  },
};

export const CURE: Ability = {
  id: 'cure',
  name: 'Cure',
  type: 'healing',
  element: 'Mercury',
  manaCost: 4,
  basePower: 40,
  targets: 'single-ally',
  unlockLevel: 2,
  description: 'Restores HP to a single ally',
  aiHints: {
    priority: 2.5,
    target: 'healerFirst',
    avoidOverkill: false,
  },
};

export const GUARD: Ability = {
  id: 'guard',
  name: 'Guard',
  type: 'buff',
  manaCost: 3,
  basePower: 0,
  targets: 'single-ally',
  unlockLevel: 2,
  description: 'Increases ally DEF temporarily',
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

export const EARTH_SPIKE: Ability = {
  id: 'earth-spike',
  name: 'Earth Spike',
  type: 'psynergy',
  element: 'Venus',
  manaCost: 0,
  basePower: 46,
  targets: 'single-enemy',
  unlockLevel: 1,
  description: 'Powerful earth spike - Djinn Unleash ability',
  aiHints: {
    priority: 3.0,
    target: 'weakest',
    avoidOverkill: false,
  },
};

export const FIRE_BURST: Ability = {
  id: 'fire-burst',
  name: 'Fire Burst',
  type: 'psynergy',
  element: 'Mars',
  manaCost: 0,
  basePower: 46,
  targets: 'single-enemy',
  unlockLevel: 1,
  description: 'Explosive fire burst - Djinn Unleash ability',
  aiHints: {
    priority: 3.0,
    target: 'weakest',
    avoidOverkill: false,
  },
};

// ============================================================================
// EQUIPMENT ABILITIES (20 Total - One per House Reward)
// ============================================================================

// ACT 1: DISCOVERY (Houses 1-7)
export const WOODEN_STRIKE: Ability = {
  id: 'wooden-strike',
  name: 'Wooden Strike',
  type: 'physical',
  manaCost: 0,
  basePower: 8,
  targets: 'single-enemy',
  unlockLevel: 1,
  description: 'A basic strike with a wooden blade. Simple but reliable.',
  aiHints: { priority: 1.0, target: 'weakest', avoidOverkill: false },
};

export const BRONZE_SLASH: Ability = {
  id: 'bronze-slash',
  name: 'Bronze Slash',
  type: 'physical',
  element: 'Venus',
  manaCost: 0,
  basePower: 12,
  targets: 'single-enemy',
  unlockLevel: 1,
  description: 'A sharp slash with a bronze blade. Earth-imbued strike.',
  aiHints: { priority: 1.2, target: 'weakest', avoidOverkill: false },
};

export const IRON_BULWARK: Ability = {
  id: 'iron-bulwark',
  name: 'Iron Bulwark',
  type: 'buff',
  manaCost: 1,
  basePower: 0,
  targets: 'self',
  unlockLevel: 1,
  description: 'Fortify yourself with iron defense. Increases DEF.',
  buffEffect: { def: 6 },
  duration: 3,
  aiHints: { priority: 1.5, target: 'random', opener: true },
};

export const ARCANE_BOLT: Ability = {
  id: 'arcane-bolt',
  name: 'Arcane Bolt',
  type: 'psynergy',
  manaCost: 1,
  basePower: 20,
  targets: 'single-enemy',
  unlockLevel: 1,
  description: 'A bolt of pure magical energy from your rod.',
  aiHints: { priority: 1.5, target: 'weakest', avoidOverkill: false },
};

export const IRON_THRUST: Ability = {
  id: 'iron-thrust',
  name: 'Iron Thrust',
  type: 'physical',
  element: 'Venus',
  manaCost: 0,
  basePower: 18,
  targets: 'single-enemy',
  ignoreDefensePercent: 0.2,
  unlockLevel: 1,
  description: 'A precise thrust that pierces defenses.',
  aiHints: { priority: 1.8, target: 'highestDef', avoidOverkill: false },
};

export const STEEL_FOCUS: Ability = {
  id: 'steel-focus',
  name: 'Steel Focus',
  type: 'buff',
  manaCost: 1,
  basePower: 0,
  targets: 'self',
  unlockLevel: 1,
  description: 'Focus your mind like steel. Increases ATK.',
  buffEffect: { atk: 5 },
  duration: 3,
  aiHints: { priority: 1.3, target: 'random', opener: true },
};

// ACT 2: RESISTANCE (Houses 8-14)
export const STEEL_WARD: Ability = {
  id: 'steel-ward',
  name: 'Steel Ward',
  type: 'buff',
  manaCost: 2,
  basePower: 0,
  targets: 'self',
  unlockLevel: 1,
  description: 'Protect yourself with steel. Grants damage reduction.',
  damageReductionPercent: 0.15,
  duration: 3,
  aiHints: { priority: 1.8, target: 'random', opener: true },
};

export const AXE_CLEAVE: Ability = {
  id: 'axe-cleave',
  name: 'Axe Cleave',
  type: 'physical',
  element: 'Mars',
  manaCost: 1,
  basePower: 22,
  targets: 'single-enemy',
  unlockLevel: 1,
  description: 'A powerful cleaving strike with your battle axe.',
  aiHints: { priority: 2.0, target: 'weakest', avoidOverkill: false },
};

export const IRON_MIND: Ability = {
  id: 'iron-mind',
  name: 'Iron Mind',
  type: 'buff',
  manaCost: 1,
  basePower: 0,
  targets: 'self',
  unlockLevel: 1,
  description: 'Steel your mind against status effects.',
  grantImmunity: {
    all: false,
    types: ['poison', 'burn', 'freeze', 'paralyze'],
    duration: 2,
  },
  aiHints: { priority: 2.0, target: 'random', opener: false },
};

export const SILVER_SHIELD: Ability = {
  id: 'silver-shield',
  name: 'Silver Shield',
  type: 'buff',
  manaCost: 2,
  basePower: 0,
  targets: 'self',
  unlockLevel: 1,
  description: 'Create a shimmering silver shield. Grants shield charges.',
  shieldCharges: 2,
  aiHints: { priority: 2.2, target: 'random', opener: true },
};

export const MYTHRIL_WISDOM: Ability = {
  id: 'mythril-wisdom',
  name: 'Mythril Wisdom',
  type: 'buff',
  manaCost: 2,
  basePower: 0,
  targets: 'self',
  unlockLevel: 1,
  description: 'Channel mythril wisdom. Increases MAG significantly.',
  buffEffect: { mag: 8 },
  duration: 4,
  aiHints: { priority: 2.0, target: 'random', opener: true },
};

export const HYPER_SPEED: Ability = {
  id: 'hyper-speed',
  name: 'Hyper Speed',
  type: 'buff',
  manaCost: 1,
  basePower: 0,
  targets: 'self',
  unlockLevel: 1,
  description: 'Activate hyper speed. Increases SPD dramatically.',
  buffEffect: { spd: 8 },
  duration: 3,
  aiHints: { priority: 2.5, target: 'random', opener: true },
};

// ACT 3: LIBERATION (Houses 15-20)
export const MYTHRIL_EDGE: Ability = {
  id: 'mythril-edge',
  name: 'Mythril Edge',
  type: 'physical',
  element: 'Venus',
  manaCost: 2,
  basePower: 35,
  targets: 'single-enemy',
  ignoreDefensePercent: 0.3,
  unlockLevel: 1,
  description: 'A devastating strike with mythril precision.',
  aiHints: { priority: 2.8, target: 'highestDef', avoidOverkill: false },
};

export const DRAGON_WARD: Ability = {
  id: 'dragon-ward',
  name: 'Dragon Ward',
  type: 'buff',
  manaCost: 3,
  basePower: 0,
  targets: 'self',
  unlockLevel: 1,
  description: 'Channel dragon scales\' power. Grants elemental resistance.',
  elementalResistance: {
    element: 'Mars',
    modifier: 0.3,
  },
  duration: 4,
  aiHints: { priority: 2.5, target: 'random', opener: true },
};

export const ORACLE_VISION: Ability = {
  id: 'oracle-vision',
  name: 'Oracle Vision',
  type: 'buff',
  manaCost: 2,
  basePower: 0,
  targets: 'all-allies',
  unlockLevel: 1,
  description: 'Share oracle wisdom with all allies. Increases MAG.',
  buffEffect: { mag: 6 },
  duration: 3,
  aiHints: { priority: 2.5, target: 'random', opener: true },
};

// Choice Equipment Abilities (for houses with choice rewards)
export const STEEL_SLASH: Ability = {
  id: 'steel-slash',
  name: 'Steel Slash',
  type: 'physical',
  element: 'Venus',
  manaCost: 1,
  basePower: 25,
  targets: 'single-enemy',
  unlockLevel: 1,
  description: 'A powerful slash with a steel blade. Earth-imbued strike.',
  aiHints: { priority: 2.0, target: 'weakest', avoidOverkill: false },
};

export const CRYSTAL_BLAST: Ability = {
  id: 'crystal-blast',
  name: 'Crystal Blast',
  type: 'psynergy',
  manaCost: 2,
  basePower: 28,
  targets: 'single-enemy',
  unlockLevel: 1,
  description: 'A burst of crystal energy from your rod.',
  aiHints: { priority: 2.0, target: 'weakest', avoidOverkill: false },
};

export const SILVER_STRIKE: Ability = {
  id: 'silver-strike',
  name: 'Silver Strike',
  type: 'physical',
  element: 'Venus',
  manaCost: 1,
  basePower: 30,
  targets: 'single-enemy',
  ignoreDefensePercent: 0.25,
  unlockLevel: 1,
  description: 'A precise silver strike that pierces defenses.',
  aiHints: { priority: 2.2, target: 'highestDef', avoidOverkill: false },
};

export const GREAT_CLEAVE: Ability = {
  id: 'great-cleave',
  name: 'Great Cleave',
  type: 'physical',
  element: 'Mars',
  manaCost: 2,
  basePower: 32,
  targets: 'single-enemy',
  unlockLevel: 1,
  description: 'A devastating cleaving strike with your great axe.',
  aiHints: { priority: 2.3, target: 'weakest', avoidOverkill: false },
};

export const ZODIAC_BOLT: Ability = {
  id: 'zodiac-bolt',
  name: 'Zodiac Bolt',
  type: 'psynergy',
  manaCost: 3,
  basePower: 40,
  targets: 'single-enemy',
  unlockLevel: 1,
  description: 'A powerful bolt of zodiac energy.',
  aiHints: { priority: 2.5, target: 'weakest', avoidOverkill: false },
};

// ============================================================================
// BALANCED ABILITY SETS (for balanced gameplay)
// ============================================================================

// VENUS (Earth) Abilities
export const EARTH_SPIKE_DAMAGE: Ability = {
  id: 'earth-spike-damage',
  name: 'Earth Spike',
  type: 'psynergy',
  element: 'Venus',
  manaCost: 3,
  basePower: 35,
  targets: 'single-enemy',
  unlockLevel: 1,
  description: 'Powerful earth spike that deals heavy damage',
  aiHints: { priority: 2.5, target: 'weakest', avoidOverkill: false },
};

export const STONE_SKIN_UTILITY: Ability = {
  id: 'stone-skin',
  name: 'Stone Skin',
  type: 'buff',
  element: 'Venus',
  manaCost: 2,
  basePower: 0,
  targets: 'single-ally',
  unlockLevel: 1,
  description: 'Harden skin like stone, increasing DEF significantly',
  buffEffect: { def: 10 },
  duration: 3,
  aiHints: { priority: 2.0, target: 'random', opener: true },
};

// MARS (Fire) Abilities
export const FLAME_BURST_DAMAGE: Ability = {
  id: 'flame-burst-damage',
  name: 'Flame Burst',
  type: 'psynergy',
  element: 'Mars',
  manaCost: 3,
  basePower: 38,
  targets: 'single-enemy',
  unlockLevel: 1,
  description: 'Explosive burst of flame dealing heavy damage',
  aiHints: { priority: 2.5, target: 'weakest', avoidOverkill: false },
};

export const FIRE_WARD_UTILITY: Ability = {
  id: 'fire-ward',
  name: 'Fire Ward',
  type: 'buff',
  element: 'Mars',
  manaCost: 2,
  basePower: 0,
  targets: 'single-ally',
  unlockLevel: 1,
  description: 'Ward yourself with fire, increasing ATK significantly',
  buffEffect: { atk: 10 },
  duration: 3,
  aiHints: { priority: 2.0, target: 'random', opener: true },
};

// MERCURY (Water) Abilities
export const ICE_LANCE_DAMAGE: Ability = {
  id: 'ice-lance-damage',
  name: 'Ice Lance',
  type: 'psynergy',
  element: 'Mercury',
  manaCost: 3,
  basePower: 36,
  targets: 'single-enemy',
  unlockLevel: 1,
  description: 'Piercing lance of ice dealing heavy damage',
  aiHints: { priority: 2.5, target: 'weakest', avoidOverkill: false },
};

export const AQUA_HEAL_UTILITY: Ability = {
  id: 'aqua-heal',
  name: 'Aqua Heal',
  type: 'healing',
  element: 'Mercury',
  manaCost: 3,
  basePower: 50,
  targets: 'single-ally',
  unlockLevel: 1,
  description: 'Restore HP with healing waters',
  aiHints: { priority: 3.0, target: 'healerFirst', avoidOverkill: false },
};

// JUPITER (Wind) Abilities
export const GALE_FORCE_DAMAGE: Ability = {
  id: 'gale-force-damage',
  name: 'Gale Force',
  type: 'psynergy',
  element: 'Jupiter',
  manaCost: 3,
  basePower: 34,
  targets: 'single-enemy',
  unlockLevel: 1,
  description: 'Powerful gale dealing heavy damage',
  aiHints: { priority: 2.5, target: 'weakest', avoidOverkill: false },
};

export const WIND_BARRIER_UTILITY: Ability = {
  id: 'wind-barrier',
  name: 'Wind Barrier',
  type: 'buff',
  element: 'Jupiter',
  manaCost: 2,
  basePower: 0,
  targets: 'single-ally',
  unlockLevel: 1,
  description: 'Create a barrier of wind, increasing SPD significantly',
  buffEffect: { spd: 8 },
  duration: 3,
  aiHints: { priority: 2.0, target: 'random', opener: true },
};

// NEUTRAL Abilities
export const FOCUS_STRIKE_NEUTRAL: Ability = {
  id: 'focus-strike-neutral',
  name: 'Focus Strike',
  type: 'physical',
  manaCost: 0,
  basePower: 20,
  targets: 'single-enemy',
  unlockLevel: 1,
  description: 'Focused physical strike with neutral element',
  aiHints: { priority: 1.8, target: 'weakest', avoidOverkill: false },
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
  // VS1 Demo
  flare: FLARE,
  cure: CURE,
  guard: GUARD,
  'earth-spike': EARTH_SPIKE,
  'fire-burst': FIRE_BURST,
  // Equipment Abilities (20 Total)
  'wooden-strike': WOODEN_STRIKE,
  'bronze-slash': BRONZE_SLASH,
  'iron-bulwark': IRON_BULWARK,
  'arcane-bolt': ARCANE_BOLT,
  'iron-thrust': IRON_THRUST,
  'steel-focus': STEEL_FOCUS,
  'steel-ward': STEEL_WARD,
  'axe-cleave': AXE_CLEAVE,
  'iron-mind': IRON_MIND,
  'silver-shield': SILVER_SHIELD,
  'mythril-wisdom': MYTHRIL_WISDOM,
  'hyper-speed': HYPER_SPEED,
  'mythril-edge': MYTHRIL_EDGE,
  'dragon-ward': DRAGON_WARD,
  'oracle-vision': ORACLE_VISION,
  // Choice Equipment Abilities
  'steel-slash': STEEL_SLASH,
  'crystal-blast': CRYSTAL_BLAST,
  'silver-strike': SILVER_STRIKE,
  'great-cleave': GREAT_CLEAVE,
  'zodiac-bolt': ZODIAC_BOLT,
  // Balanced Ability Sets
  'earth-spike-damage': EARTH_SPIKE_DAMAGE,
  'stone-skin': STONE_SKIN_UTILITY,
  'flame-burst-damage': FLAME_BURST_DAMAGE,
  'fire-ward': FIRE_WARD_UTILITY,
  'ice-lance-damage': ICE_LANCE_DAMAGE,
  'aqua-heal': AQUA_HEAL_UTILITY,
  'gale-force-damage': GALE_FORCE_DAMAGE,
  'wind-barrier': WIND_BARRIER_UTILITY,
  'focus-strike-neutral': FOCUS_STRIKE_NEUTRAL,
};
