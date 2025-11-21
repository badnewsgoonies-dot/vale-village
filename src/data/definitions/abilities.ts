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
// NEW ABILITIES - LEVEL 1-20 PROGRESSION (145 Total)
// ============================================================================

// ADEPT (Venus Tank) - Levels 7-20
export const FORTIFY: Ability = {
  id: 'fortify',
  name: 'Fortify',
  type: 'buff',
  element: 'Venus',
  manaCost: 2,
  basePower: 0,
  targets: 'self',
  unlockLevel: 7,
  description: 'Earth strengthens your resolve. Grants shield charges and DEF boost.',
  shieldCharges: 2,
  buffEffect: { def: 5 },
  duration: 3,
  aiHints: { priority: 2.0, target: 'random', opener: true },
};

export const TREMOR: Ability = {
  id: 'tremor',
  name: 'Tremor',
  type: 'psynergy',
  element: 'Venus',
  manaCost: 3,
  basePower: 28,
  targets: 'all-enemies',
  unlockLevel: 8,
  description: 'Shake the earth beneath all enemies.',
  aiHints: { priority: 2.5, target: 'random', avoidOverkill: false },
};

export const GUARDIAN_STANCE: Ability = {
  id: 'guardian-stance',
  name: 'Guardian Stance',
  type: 'buff',
  manaCost: 2,
  basePower: 0,
  targets: 'self',
  unlockLevel: 9,
  description: 'Reduce incoming damage significantly.',
  damageReductionPercent: 0.25,
  duration: 4,
  aiHints: { priority: 2.2, target: 'random', opener: true },
};

export const ROCK_BREAKER: Ability = {
  id: 'rock-breaker',
  name: 'Rock Breaker',
  type: 'physical',
  element: 'Venus',
  manaCost: 1,
  basePower: 18,
  targets: 'single-enemy',
  unlockLevel: 10,
  description: 'Strike twice with earth-shattering force.',
  hitCount: 2,
  aiHints: { priority: 2.0, target: 'weakest', avoidOverkill: false },
};

export const EARTHQUAKE: Ability = {
  id: 'earthquake',
  name: 'Earthquake',
  type: 'psynergy',
  element: 'Venus',
  manaCost: 4,
  basePower: 35,
  targets: 'all-enemies',
  unlockLevel: 11,
  description: 'Devastating earthquake hits all enemies.',
  splashDamagePercent: 1.0,
  aiHints: { priority: 2.8, target: 'random', avoidOverkill: false },
};

export const STONE_WALL: Ability = {
  id: 'stone-wall',
  name: 'Stone Wall',
  type: 'buff',
  element: 'Venus',
  manaCost: 3,
  basePower: 0,
  targets: 'all-allies',
  unlockLevel: 12,
  description: 'Raise a wall of stone, protecting all allies.',
  buffEffect: { def: 6 },
  duration: 3,
  aiHints: { priority: 2.5, target: 'random', opener: true },
};

export const UNBREAKABLE: Ability = {
  id: 'unbreakable',
  name: 'Unbreakable',
  type: 'buff',
  manaCost: 3,
  basePower: 0,
  targets: 'self',
  unlockLevel: 13,
  description: 'Become nearly invulnerable for a short time.',
  damageReductionPercent: 0.4,
  shieldCharges: 3,
  duration: 3,
  aiHints: { priority: 2.8, target: 'random', opener: true },
};

export const TITAN_GRIP: Ability = {
  id: 'titan-grip',
  name: 'Titan Grip',
  type: 'physical',
  element: 'Venus',
  manaCost: 2,
  basePower: 40,
  targets: 'single-enemy',
  unlockLevel: 14,
  description: 'Crushing blow that ignores half of enemy defenses.',
  ignoreDefensePercent: 0.5,
  aiHints: { priority: 2.8, target: 'highestDef', avoidOverkill: false },
};

export const GAIA_SHIELD: Ability = {
  id: 'gaia-shield',
  name: 'Gaia Shield',
  type: 'buff',
  element: 'Venus',
  manaCost: 4,
  basePower: 0,
  targets: 'all-allies',
  unlockLevel: 15,
  description: 'Earth\'s protection shields the entire party.',
  shieldCharges: 3,
  duration: 4,
  aiHints: { priority: 3.0, target: 'random', opener: true },
};

export const PETRIFY_STRIKE: Ability = {
  id: 'petrify-strike',
  name: 'Petrify Strike',
  type: 'physical',
  element: 'Venus',
  manaCost: 2,
  basePower: 25,
  targets: 'single-enemy',
  unlockLevel: 16,
  description: 'Attack that may freeze enemies in stone.',
  statusEffect: { type: 'freeze', duration: 2, chance: 0.5 },
  aiHints: { priority: 2.5, target: 'weakest', avoidOverkill: false },
};

export const MOUNTAIN_ENDURANCE: Ability = {
  id: 'mountain-endurance',
  name: 'Mountain\'s Endurance',
  type: 'buff',
  manaCost: 3,
  basePower: 0,
  targets: 'self',
  unlockLevel: 17,
  description: 'Channel the mountain\'s endurance. Heal over time and immunity.',
  healOverTime: { amount: 15, duration: 3 },
  grantImmunity: { all: true, duration: 2 },
  aiHints: { priority: 2.8, target: 'random', opener: false },
};

export const LANDSLIDE: Ability = {
  id: 'landslide',
  name: 'Landslide',
  type: 'psynergy',
  element: 'Venus',
  manaCost: 5,
  basePower: 50,
  targets: 'all-enemies',
  unlockLevel: 18,
  description: 'Massive landslide buries all enemies.',
  splashDamagePercent: 1.0,
  aiHints: { priority: 3.0, target: 'random', avoidOverkill: false },
};

export const EARTH_BLESSING: Ability = {
  id: 'earth-blessing',
  name: 'Earth\'s Blessing',
  type: 'healing',
  element: 'Venus',
  manaCost: 4,
  basePower: 60,
  targets: 'all-allies',
  unlockLevel: 19,
  description: 'Earth\'s power restores the entire party.',
  aiHints: { priority: 3.0, target: 'healerFirst', avoidOverkill: false },
};

export const GAIA_REBIRTH: Ability = {
  id: 'gaia-rebirth',
  name: 'Gaia Rebirth',
  type: 'healing',
  element: 'Venus',
  manaCost: 5,
  basePower: 80,
  targets: 'all-allies',
  unlockLevel: 20,
  description: 'Channel Gaia\'s power to heal all allies and revive fallen.',
  revive: true,
  reviveHPPercent: 0.5,
  removeStatusEffects: { type: 'negative' },
  aiHints: { priority: 3.0, target: 'healerFirst', avoidOverkill: false },
};

// WAR MAGE (Mars Mage) - Levels 7-20
export const IGNITE: Ability = {
  id: 'ignite',
  name: 'Ignite',
  type: 'psynergy',
  element: 'Mars',
  manaCost: 2,
  basePower: 25,
  targets: 'single-enemy',
  unlockLevel: 7,
  description: 'Set enemy ablaze with persistent flames.',
  statusEffect: { type: 'burn', duration: 3, chance: 0.8 },
  aiHints: { priority: 2.2, target: 'weakest', avoidOverkill: false },
};

export const FLAME_WALL: Ability = {
  id: 'flame-wall',
  name: 'Flame Wall',
  type: 'buff',
  element: 'Mars',
  manaCost: 2,
  basePower: 0,
  targets: 'self',
  unlockLevel: 8,
  description: 'Surround yourself with flames, granting fire resistance.',
  elementalResistance: { element: 'Mars', modifier: 0.3 },
  duration: 4,
  aiHints: { priority: 2.0, target: 'random', opener: true },
};

export const INFERNO_SLASH: Ability = {
  id: 'inferno-slash',
  name: 'Inferno Slash',
  type: 'physical',
  element: 'Mars',
  manaCost: 1,
  basePower: 22,
  targets: 'single-enemy',
  unlockLevel: 9,
  description: 'Fire-infused blade strike.',
  aiHints: { priority: 2.0, target: 'weakest', avoidOverkill: false },
};

export const BLAZING_FURY: Ability = {
  id: 'blazing-fury',
  name: 'Blazing Fury',
  type: 'psynergy',
  element: 'Mars',
  manaCost: 3,
  basePower: 20,
  targets: 'single-enemy',
  unlockLevel: 10,
  description: 'Rapid-fire explosions hit the target.',
  hitCount: 3,
  aiHints: { priority: 2.5, target: 'weakest', avoidOverkill: false },
};

export const PYROCLASM: Ability = {
  id: 'pyroclasm',
  name: 'Pyroclasm',
  type: 'psynergy',
  element: 'Mars',
  manaCost: 4,
  basePower: 40,
  targets: 'all-enemies',
  unlockLevel: 11,
  description: 'Volcanic eruption engulfs all enemies.',
  aiHints: { priority: 2.8, target: 'random', avoidOverkill: false },
};

export const FIRE_AURA: Ability = {
  id: 'fire-aura',
  name: 'Fire Aura',
  type: 'buff',
  element: 'Mars',
  manaCost: 3,
  basePower: 0,
  targets: 'all-allies',
  unlockLevel: 12,
  description: 'Grant fire power to all allies.',
  buffEffect: { atk: 7, mag: 7 },
  duration: 3,
  aiHints: { priority: 2.5, target: 'random', opener: true },
};

export const METEOR_STRIKE: Ability = {
  id: 'meteor-strike',
  name: 'Meteor Strike',
  type: 'psynergy',
  element: 'Mars',
  manaCost: 4,
  basePower: 45,
  targets: 'single-enemy',
  unlockLevel: 13,
  description: 'Call down a meteor on a single target.',
  splashDamagePercent: 0.4,
  aiHints: { priority: 2.8, target: 'weakest', avoidOverkill: false },
};

export const PHOENIX_FLAMES: Ability = {
  id: 'phoenix-flames',
  name: 'Phoenix Flames',
  type: 'healing',
  element: 'Mars',
  manaCost: 3,
  basePower: 40,
  targets: 'single-ally',
  unlockLevel: 14,
  description: 'Healing flames of the phoenix.',
  removeStatusEffects: { type: 'byType', statuses: ['burn', 'poison'] },
  aiHints: { priority: 2.5, target: 'healerFirst', avoidOverkill: false },
};

export const MAGMA_BURST: Ability = {
  id: 'magma-burst',
  name: 'Magma Burst',
  type: 'psynergy',
  element: 'Mars',
  manaCost: 5,
  basePower: 55,
  targets: 'single-enemy',
  unlockLevel: 15,
  description: 'Devastating magma explosion.',
  statusEffect: { type: 'burn', duration: 3, chance: 1.0 },
  aiHints: { priority: 3.0, target: 'weakest', avoidOverkill: false },
};

export const FLAME_SHIELD: Ability = {
  id: 'flame-shield',
  name: 'Flame Shield',
  type: 'buff',
  element: 'Mars',
  manaCost: 3,
  basePower: 0,
  targets: 'all-allies',
  unlockLevel: 16,
  description: 'Fiery barrier protects all allies from status.',
  grantImmunity: { all: false, types: ['freeze', 'poison'], duration: 3 },
  aiHints: { priority: 2.5, target: 'random', opener: true },
};

export const SUPERNOVA: Ability = {
  id: 'supernova',
  name: 'Supernova',
  type: 'psynergy',
  element: 'Mars',
  manaCost: 5,
  basePower: 48,
  targets: 'all-enemies',
  unlockLevel: 17,
  description: 'Explosive nova hits all enemies with burn.',
  statusEffect: { type: 'burn', duration: 2, chance: 0.6 },
  aiHints: { priority: 3.0, target: 'random', avoidOverkill: false },
};

export const INFERNAL_RAGE: Ability = {
  id: 'infernal-rage',
  name: 'Infernal Rage',
  type: 'buff',
  manaCost: 4,
  basePower: 0,
  targets: 'self',
  unlockLevel: 18,
  description: 'Channel pure rage into power.',
  buffEffect: { atk: 15, mag: 15 },
  duration: 3,
  aiHints: { priority: 2.8, target: 'random', opener: true },
};

export const DRAGON_BREATH: Ability = {
  id: 'dragon-breath',
  name: 'Dragon Breath',
  type: 'psynergy',
  element: 'Mars',
  manaCost: 5,
  basePower: 60,
  targets: 'all-enemies',
  unlockLevel: 19,
  description: 'Breathe dragon fire across all enemies.',
  chainDamage: true,
  aiHints: { priority: 3.0, target: 'random', avoidOverkill: false },
};

export const RAGNAROK_FLAMES: Ability = {
  id: 'ragnarok-flames',
  name: 'Ragnarok Flames',
  type: 'psynergy',
  element: 'Mars',
  manaCost: 5,
  basePower: 70,
  targets: 'all-enemies',
  unlockLevel: 20,
  description: 'Apocalyptic flames consume all enemies.',
  splashDamagePercent: 1.0,
  statusEffect: { type: 'burn', duration: 3, chance: 1.0 },
  aiHints: { priority: 3.0, target: 'random', avoidOverkill: false },
};

// MYSTIC (Mercury Healer) - Levels 7-20
export const CLEANSE: Ability = {
  id: 'cleanse',
  name: 'Cleanse',
  type: 'healing',
  element: 'Mercury',
  manaCost: 2,
  basePower: 0,
  targets: 'single-ally',
  unlockLevel: 7,
  description: 'Purifying waters remove negative effects.',
  removeStatusEffects: { type: 'negative' },
  aiHints: { priority: 2.5, target: 'healerFirst', avoidOverkill: false },
};

export const FROST_WAVE: Ability = {
  id: 'frost-wave',
  name: 'Frost Wave',
  type: 'psynergy',
  element: 'Mercury',
  manaCost: 3,
  basePower: 30,
  targets: 'all-enemies',
  unlockLevel: 8,
  description: 'Wave of frost hits all enemies.',
  aiHints: { priority: 2.5, target: 'random', avoidOverkill: false },
};

export const REGEN: Ability = {
  id: 'regen',
  name: 'Regen',
  type: 'healing',
  element: 'Mercury',
  manaCost: 2,
  basePower: 20,
  targets: 'single-ally',
  unlockLevel: 9,
  description: 'Grant regeneration over time.',
  healOverTime: { amount: 12, duration: 3 },
  aiHints: { priority: 2.0, target: 'healerFirst', avoidOverkill: false },
};

export const DIAMOND_DUST: Ability = {
  id: 'diamond-dust',
  name: 'Diamond Dust',
  type: 'psynergy',
  element: 'Mercury',
  manaCost: 3,
  basePower: 25,
  targets: 'all-enemies',
  unlockLevel: 10,
  description: 'Freezing ice crystals that may freeze enemies.',
  statusEffect: { type: 'freeze', duration: 2, chance: 0.4 },
  aiHints: { priority: 2.5, target: 'random', avoidOverkill: false },
};

export const MASS_REGEN: Ability = {
  id: 'mass-regen',
  name: 'Mass Regen',
  type: 'healing',
  element: 'Mercury',
  manaCost: 4,
  basePower: 0,
  targets: 'all-allies',
  unlockLevel: 11,
  description: 'Grant regeneration to entire party.',
  healOverTime: { amount: 10, duration: 3 },
  aiHints: { priority: 2.8, target: 'healerFirst', avoidOverkill: false },
};

export const GLACIAL_SHIELD: Ability = {
  id: 'glacial-shield',
  name: 'Glacial Shield',
  type: 'buff',
  element: 'Mercury',
  manaCost: 3,
  basePower: 0,
  targets: 'all-allies',
  unlockLevel: 12,
  description: 'Ice barrier protects all allies.',
  shieldCharges: 2,
  duration: 3,
  aiHints: { priority: 2.5, target: 'random', opener: true },
};

export const DEEP_FREEZE: Ability = {
  id: 'deep-freeze',
  name: 'Deep Freeze',
  type: 'psynergy',
  element: 'Mercury',
  manaCost: 4,
  basePower: 35,
  targets: 'single-enemy',
  unlockLevel: 13,
  description: 'Encase enemy in solid ice.',
  statusEffect: { type: 'freeze', duration: 3, chance: 0.8 },
  aiHints: { priority: 2.8, target: 'weakest', avoidOverkill: false },
};

export const SANCTUARY: Ability = {
  id: 'sanctuary',
  name: 'Sanctuary',
  type: 'buff',
  manaCost: 4,
  basePower: 0,
  targets: 'all-allies',
  unlockLevel: 14,
  description: 'Create sanctuary granting immunity and damage reduction.',
  grantImmunity: { all: true, duration: 2 },
  damageReductionPercent: 0.2,
  duration: 3,
  aiHints: { priority: 3.0, target: 'random', opener: true },
};

export const BLIZZARD: Ability = {
  id: 'blizzard',
  name: 'Blizzard',
  type: 'psynergy',
  element: 'Mercury',
  manaCost: 5,
  basePower: 45,
  targets: 'all-enemies',
  unlockLevel: 15,
  description: 'Massive blizzard engulfs battlefield.',
  chainDamage: true,
  aiHints: { priority: 3.0, target: 'random', avoidOverkill: false },
};

export const RESTORATION: Ability = {
  id: 'restoration',
  name: 'Restoration',
  type: 'healing',
  element: 'Mercury',
  manaCost: 4,
  basePower: 70,
  targets: 'single-ally',
  unlockLevel: 16,
  description: 'Complete restoration of ally.',
  removeStatusEffects: { type: 'all' },
  aiHints: { priority: 3.0, target: 'healerFirst', avoidOverkill: false },
};

export const FROZEN_TOMB: Ability = {
  id: 'frozen-tomb',
  name: 'Frozen Tomb',
  type: 'psynergy',
  element: 'Mercury',
  manaCost: 4,
  basePower: 30,
  targets: 'single-enemy',
  unlockLevel: 17,
  description: 'Trap enemy in frozen tomb for extended duration.',
  statusEffect: { type: 'freeze', duration: 4, chance: 1.0 },
  aiHints: { priority: 2.8, target: 'weakest', avoidOverkill: false },
};

export const AQUA_BARRIER: Ability = {
  id: 'aqua-barrier',
  name: 'Aqua Barrier',
  type: 'buff',
  element: 'Mercury',
  manaCost: 5,
  basePower: 0,
  targets: 'all-allies',
  unlockLevel: 18,
  description: 'Ultimate water barrier shields and heals party.',
  shieldCharges: 4,
  healOverTime: { amount: 15, duration: 3 },
  aiHints: { priority: 3.0, target: 'random', opener: true },
};

export const ABSOLUTE_ZERO: Ability = {
  id: 'absolute-zero',
  name: 'Absolute Zero',
  type: 'psynergy',
  element: 'Mercury',
  manaCost: 5,
  basePower: 60,
  targets: 'all-enemies',
  unlockLevel: 19,
  description: 'Freeze all enemies at absolute zero temperature.',
  statusEffect: { type: 'freeze', duration: 2, chance: 0.7 },
  aiHints: { priority: 3.0, target: 'random', avoidOverkill: false },
};

export const LEVIATHAN_GRACE: Ability = {
  id: 'leviathan-grace',
  name: 'Leviathan\'s Grace',
  type: 'healing',
  element: 'Mercury',
  manaCost: 5,
  basePower: 100,
  targets: 'all-allies',
  unlockLevel: 20,
  description: 'Channel Leviathan\'s power for complete party restoration.',
  revive: true,
  reviveHPPercent: 0.75,
  removeStatusEffects: { type: 'all' },
  healOverTime: { amount: 20, duration: 3 },
  aiHints: { priority: 3.0, target: 'healerFirst', avoidOverkill: false },
};

// RANGER (Jupiter DPS) - Levels 7-20
export const SWIFT_STRIKE: Ability = {
  id: 'swift-strike',
  name: 'Swift Strike',
  type: 'physical',
  element: 'Jupiter',
  manaCost: 1,
  basePower: 12,
  targets: 'single-enemy',
  unlockLevel: 7,
  description: 'Lightning-fast double strike.',
  hitCount: 2,
  aiHints: { priority: 2.0, target: 'weakest', avoidOverkill: false },
};

export const SHOCK_BOLT: Ability = {
  id: 'shock-bolt',
  name: 'Shock Bolt',
  type: 'psynergy',
  element: 'Jupiter',
  manaCost: 3,
  basePower: 30,
  targets: 'single-enemy',
  unlockLevel: 8,
  description: 'Lightning bolt that may paralyze.',
  statusEffect: { type: 'paralyze', duration: 2, chance: 0.5 },
  aiHints: { priority: 2.5, target: 'weakest', avoidOverkill: false },
};

export const TEMPEST: Ability = {
  id: 'tempest',
  name: 'Tempest',
  type: 'psynergy',
  element: 'Jupiter',
  manaCost: 3,
  basePower: 28,
  targets: 'all-enemies',
  unlockLevel: 9,
  description: 'Violent tempest strikes all enemies.',
  aiHints: { priority: 2.5, target: 'random', avoidOverkill: false },
};

export const HURRICANE_SLASH: Ability = {
  id: 'hurricane-slash',
  name: 'Hurricane Slash',
  type: 'physical',
  element: 'Jupiter',
  manaCost: 2,
  basePower: 25,
  targets: 'single-enemy',
  unlockLevel: 10,
  description: 'Wind-infused slash that penetrates defenses.',
  ignoreDefensePercent: 0.3,
  aiHints: { priority: 2.5, target: 'highestDef', avoidOverkill: false },
};

export const PLASMA_SHOT: Ability = {
  id: 'plasma-shot',
  name: 'Plasma Shot',
  type: 'psynergy',
  element: 'Jupiter',
  manaCost: 4,
  basePower: 18,
  targets: 'single-enemy',
  unlockLevel: 11,
  description: 'Rapid plasma bolts.',
  hitCount: 3,
  aiHints: { priority: 2.8, target: 'weakest', avoidOverkill: false },
};

export const CYCLONE: Ability = {
  id: 'cyclone',
  name: 'Cyclone',
  type: 'psynergy',
  element: 'Jupiter',
  manaCost: 4,
  basePower: 35,
  targets: 'all-enemies',
  unlockLevel: 12,
  description: 'Devastating cyclone tears through enemies.',
  splashDamagePercent: 1.0,
  aiHints: { priority: 2.8, target: 'random', avoidOverkill: false },
};

export const THUNDER_GOD_FURY: Ability = {
  id: 'thunder-god-fury',
  name: 'Thunder God\'s Fury',
  type: 'physical',
  element: 'Jupiter',
  manaCost: 3,
  basePower: 16,
  targets: 'single-enemy',
  unlockLevel: 13,
  description: 'Unleash a barrage of lightning strikes.',
  hitCount: 4,
  aiHints: { priority: 2.8, target: 'weakest', avoidOverkill: false },
};

export const STORM_BLESSING: Ability = {
  id: 'storm-blessing',
  name: 'Storm Blessing',
  type: 'buff',
  element: 'Jupiter',
  manaCost: 3,
  basePower: 0,
  targets: 'all-allies',
  unlockLevel: 14,
  description: 'Grant the party speed and evasion.',
  buffEffect: { spd: 10 },
  duration: 4,
  aiHints: { priority: 2.5, target: 'random', opener: true },
};

export const JUDGMENT_BOLT: Ability = {
  id: 'judgment-bolt',
  name: 'Judgment Bolt',
  type: 'psynergy',
  element: 'Jupiter',
  manaCost: 5,
  basePower: 55,
  targets: 'single-enemy',
  unlockLevel: 15,
  description: 'Divine lightning strikes with massive power.',
  ignoreDefensePercent: 0.4,
  aiHints: { priority: 3.0, target: 'weakest', avoidOverkill: false },
};

export const STATIC_FIELD: Ability = {
  id: 'static-field',
  name: 'Static Field',
  type: 'psynergy',
  element: 'Jupiter',
  manaCost: 4,
  basePower: 25,
  targets: 'all-enemies',
  unlockLevel: 16,
  description: 'Electric field paralyzes all enemies.',
  statusEffect: { type: 'paralyze', duration: 2, chance: 0.6 },
  aiHints: { priority: 2.8, target: 'random', avoidOverkill: false },
};

export const WIND_WALKER: Ability = {
  id: 'wind-walker',
  name: 'Wind Walker',
  type: 'buff',
  manaCost: 3,
  basePower: 0,
  targets: 'self',
  unlockLevel: 17,
  description: 'Become one with the wind, dodging and striking.',
  buffEffect: { spd: 15, atk: 10 },
  damageReductionPercent: 0.25,
  duration: 3,
  aiHints: { priority: 2.8, target: 'random', opener: true },
};

export const MAELSTROM: Ability = {
  id: 'maelstrom',
  name: 'Maelstrom',
  type: 'psynergy',
  element: 'Jupiter',
  manaCost: 5,
  basePower: 50,
  targets: 'all-enemies',
  unlockLevel: 18,
  description: 'Massive storm of wind and lightning.',
  chainDamage: true,
  statusEffect: { type: 'paralyze', duration: 2, chance: 0.4 },
  aiHints: { priority: 3.0, target: 'random', avoidOverkill: false },
};

export const ZEUS_WRATH: Ability = {
  id: 'zeus-wrath',
  name: 'Zeus\'s Wrath',
  type: 'psynergy',
  element: 'Jupiter',
  manaCost: 5,
  basePower: 25,
  targets: 'all-enemies',
  unlockLevel: 19,
  description: 'God of thunder unleashes wrath.',
  hitCount: 3,
  chainDamage: true,
  aiHints: { priority: 3.0, target: 'random', avoidOverkill: false },
};

export const STORM_SOVEREIGN: Ability = {
  id: 'storm-sovereign',
  name: 'Storm Sovereign',
  type: 'psynergy',
  element: 'Jupiter',
  manaCost: 5,
  basePower: 65,
  targets: 'all-enemies',
  unlockLevel: 20,
  description: 'Become the storm itself, devastating all enemies.',
  hitCount: 2,
  chainDamage: true,
  splashDamagePercent: 1.0,
  statusEffect: { type: 'paralyze', duration: 3, chance: 0.8 },
  aiHints: { priority: 3.0, target: 'random', avoidOverkill: false },
};

// SENTINEL (Venus Tank) - Levels 4-20
export const TAUNT: Ability = {
  id: 'taunt',
  name: 'Taunt',
  type: 'debuff',
  manaCost: 1,
  basePower: 0,
  targets: 'single-enemy',
  unlockLevel: 4,
  description: 'Provoke enemy, reducing their accuracy.',
  debuffEffect: { atk: -5 },
  duration: 2,
  aiHints: { priority: 1.5, target: 'random', avoidOverkill: false },
};

export const SHIELD_BASH: Ability = {
  id: 'shield-bash',
  name: 'Shield Bash',
  type: 'physical',
  element: 'Venus',
  manaCost: 0,
  basePower: 16,
  targets: 'single-enemy',
  unlockLevel: 5,
  description: 'Bash with shield, dealing damage and stunning.',
  statusEffect: { type: 'stun', duration: 1, chance: 0.4 },
  aiHints: { priority: 2.0, target: 'weakest', avoidOverkill: false },
};

export const IRON_WALL: Ability = {
  id: 'iron-wall',
  name: 'Iron Wall',
  type: 'buff',
  element: 'Venus',
  manaCost: 2,
  basePower: 0,
  targets: 'self',
  unlockLevel: 6,
  description: 'Become an immovable wall.',
  buffEffect: { def: 12 },
  duration: 4,
  aiHints: { priority: 2.0, target: 'random', opener: true },
};

export const COUNTER_STANCE: Ability = {
  id: 'counter-stance',
  name: 'Counter Stance',
  type: 'buff',
  manaCost: 2,
  basePower: 0,
  targets: 'self',
  unlockLevel: 7,
  description: 'Prepare to counter attacks.',
  damageReductionPercent: 0.2,
  duration: 3,
  aiHints: { priority: 2.0, target: 'random', opener: true },
};

export const TREMOR_STRIKE: Ability = {
  id: 'tremor-strike',
  name: 'Tremor Strike',
  type: 'physical',
  element: 'Venus',
  manaCost: 1,
  basePower: 20,
  targets: 'single-enemy',
  unlockLevel: 8,
  description: 'Ground-shaking strike hits hard.',
  aiHints: { priority: 2.0, target: 'weakest', avoidOverkill: false },
};

export const FORTIFIED_GUARD: Ability = {
  id: 'fortified-guard',
  name: 'Fortified Guard',
  type: 'buff',
  manaCost: 3,
  basePower: 0,
  targets: 'self',
  unlockLevel: 9,
  description: 'Ultimate defensive stance.',
  shieldCharges: 3,
  buffEffect: { def: 8 },
  duration: 3,
  aiHints: { priority: 2.5, target: 'random', opener: true },
};

export const BULWARK: Ability = {
  id: 'bulwark',
  name: 'Bulwark',
  type: 'buff',
  element: 'Venus',
  manaCost: 3,
  basePower: 0,
  targets: 'all-allies',
  unlockLevel: 10,
  description: 'Raise defenses for entire party.',
  buffEffect: { def: 6 },
  duration: 3,
  aiHints: { priority: 2.5, target: 'random', opener: true },
};

export const CRUSHING_BLOW: Ability = {
  id: 'crushing-blow',
  name: 'Crushing Blow',
  type: 'physical',
  element: 'Venus',
  manaCost: 2,
  basePower: 35,
  targets: 'single-enemy',
  unlockLevel: 11,
  description: 'Overwhelming force crushes defenses.',
  ignoreDefensePercent: 0.4,
  aiHints: { priority: 2.5, target: 'highestDef', avoidOverkill: false },
};

export const EARTHEN_ARMOR: Ability = {
  id: 'earthen-armor',
  name: 'Earthen Armor',
  type: 'buff',
  element: 'Venus',
  manaCost: 3,
  basePower: 0,
  targets: 'self',
  unlockLevel: 12,
  description: 'Cover yourself in earthen plates.',
  damageReductionPercent: 0.35,
  elementalResistance: { element: 'Venus', modifier: 0.3 },
  duration: 4,
  aiHints: { priority: 2.5, target: 'random', opener: true },
};

export const SHOCKWAVE: Ability = {
  id: 'shockwave',
  name: 'Shockwave',
  type: 'psynergy',
  element: 'Venus',
  manaCost: 4,
  basePower: 32,
  targets: 'all-enemies',
  unlockLevel: 13,
  description: 'Send shockwave through ground.',
  splashDamagePercent: 1.0,
  aiHints: { priority: 2.8, target: 'random', avoidOverkill: false },
};

export const GUARDIAN_RESOLVE: Ability = {
  id: 'guardian-resolve',
  name: 'Guardian\'s Resolve',
  type: 'buff',
  manaCost: 4,
  basePower: 0,
  targets: 'all-allies',
  unlockLevel: 14,
  description: 'Inspire party with unwavering resolve.',
  buffEffect: { def: 7 },
  duration: 3,
  aiHints: { priority: 2.8, target: 'random', opener: true },
};

export const TITAN_GRIP_SENTINEL: Ability = {
  id: 'titan-grip-sentinel',
  name: 'Titan\'s Grip',
  type: 'physical',
  element: 'Venus',
  manaCost: 3,
  basePower: 45,
  targets: 'single-enemy',
  unlockLevel: 15,
  description: 'Grip with titan strength, ignoring defenses.',
  ignoreDefensePercent: 0.6,
  aiHints: { priority: 2.8, target: 'highestDef', avoidOverkill: false },
};

export const STONE_FORTRESS: Ability = {
  id: 'stone-fortress',
  name: 'Stone Fortress',
  type: 'buff',
  element: 'Venus',
  manaCost: 4,
  basePower: 0,
  targets: 'all-allies',
  unlockLevel: 16,
  description: 'Turn party into fortified position.',
  shieldCharges: 3,
  damageReductionPercent: 0.25,
  duration: 4,
  aiHints: { priority: 3.0, target: 'random', opener: true },
};

export const AVALANCHE: Ability = {
  id: 'avalanche',
  name: 'Avalanche',
  type: 'psynergy',
  element: 'Venus',
  manaCost: 5,
  basePower: 50,
  targets: 'all-enemies',
  unlockLevel: 17,
  description: 'Massive avalanche buries enemies.',
  splashDamagePercent: 1.0,
  aiHints: { priority: 3.0, target: 'random', avoidOverkill: false },
};

export const IMMORTAL_BULWARK: Ability = {
  id: 'immortal-bulwark',
  name: 'Immortal Bulwark',
  type: 'buff',
  manaCost: 5,
  basePower: 0,
  targets: 'self',
  unlockLevel: 18,
  description: 'Become nearly invincible.',
  damageReductionPercent: 0.5,
  shieldCharges: 5,
  grantImmunity: { all: true, duration: 2 },
  aiHints: { priority: 3.0, target: 'random', opener: true },
};

export const EARTH_SPLITTER: Ability = {
  id: 'earth-splitter',
  name: 'Earth Splitter',
  type: 'physical',
  element: 'Venus',
  manaCost: 4,
  basePower: 55,
  targets: 'single-enemy',
  unlockLevel: 19,
  description: 'Split the earth with devastating force.',
  ignoreDefensePercent: 0.7,
  splashDamagePercent: 0.3,
  aiHints: { priority: 3.0, target: 'highestDef', avoidOverkill: false },
};

export const ATLAS_STAND: Ability = {
  id: 'atlas-stand',
  name: 'Atlas\'s Stand',
  type: 'buff',
  element: 'Venus',
  manaCost: 5,
  basePower: 0,
  targets: 'all-allies',
  unlockLevel: 20,
  description: 'Channel Atlas, protecting party completely.',
  shieldCharges: 6,
  buffEffect: { def: 15 },
  damageReductionPercent: 0.4,
  grantImmunity: { all: false, types: ['stun', 'paralyze', 'freeze'], duration: 3 },
  duration: 4,
  aiHints: { priority: 3.0, target: 'random', opener: true },
};

// STORMCALLER (Jupiter AoE Mage) - Levels 4-20
export const THUNDER_CLAP: Ability = {
  id: 'thunder-clap',
  name: 'Thunder Clap',
  type: 'psynergy',
  element: 'Jupiter',
  manaCost: 2,
  basePower: 20,
  targets: 'all-enemies',
  unlockLevel: 4,
  description: 'Loud thunder damages and disorients.',
  debuffEffect: { spd: -5 },
  duration: 2,
  aiHints: { priority: 2.0, target: 'random', avoidOverkill: false },
};

export const STORM_CALL: Ability = {
  id: 'storm-call',
  name: 'Storm Call',
  type: 'psynergy',
  element: 'Jupiter',
  manaCost: 3,
  basePower: 25,
  targets: 'all-enemies',
  unlockLevel: 5,
  description: 'Call down storm on all enemies.',
  aiHints: { priority: 2.0, target: 'random', avoidOverkill: false },
};

export const STATIC_CHARGE: Ability = {
  id: 'static-charge',
  name: 'Static Charge',
  type: 'buff',
  element: 'Jupiter',
  manaCost: 2,
  basePower: 0,
  targets: 'self',
  unlockLevel: 6,
  description: 'Build static electricity, boosting MAG.',
  buffEffect: { mag: 10 },
  duration: 3,
  aiHints: { priority: 2.0, target: 'random', opener: true },
};

export const LIGHTNING_ARC: Ability = {
  id: 'lightning-arc',
  name: 'Lightning Arc',
  type: 'psynergy',
  element: 'Jupiter',
  manaCost: 3,
  basePower: 35,
  targets: 'single-enemy',
  unlockLevel: 7,
  description: 'Concentrated lightning arc.',
  aiHints: { priority: 2.5, target: 'weakest', avoidOverkill: false },
};

export const SHOCK_PULSE: Ability = {
  id: 'shock-pulse',
  name: 'Shock Pulse',
  type: 'psynergy',
  element: 'Jupiter',
  manaCost: 3,
  basePower: 22,
  targets: 'all-enemies',
  unlockLevel: 8,
  description: 'Electric pulse paralyzes enemies.',
  statusEffect: { type: 'paralyze', duration: 2, chance: 0.5 },
  aiHints: { priority: 2.5, target: 'random', avoidOverkill: false },
};

export const WIND_MASTERY: Ability = {
  id: 'wind-mastery',
  name: 'Wind Mastery',
  type: 'buff',
  element: 'Jupiter',
  manaCost: 3,
  basePower: 0,
  targets: 'all-allies',
  unlockLevel: 9,
  description: 'Grant wind mastery to party.',
  buffEffect: { spd: 8, mag: 5 },
  duration: 3,
  aiHints: { priority: 2.5, target: 'random', opener: true },
};

export const THUNDER_STORM: Ability = {
  id: 'thunder-storm',
  name: 'Thunder Storm',
  type: 'psynergy',
  element: 'Jupiter',
  manaCost: 4,
  basePower: 38,
  targets: 'all-enemies',
  unlockLevel: 10,
  description: 'Massive thunderstorm engulfs battlefield.',
  chainDamage: true,
  aiHints: { priority: 2.8, target: 'random', avoidOverkill: false },
};

export const ELECTRIC_OVERLOAD: Ability = {
  id: 'electric-overload',
  name: 'Electric Overload',
  type: 'psynergy',
  element: 'Jupiter',
  manaCost: 4,
  basePower: 20,
  targets: 'all-enemies',
  unlockLevel: 11,
  description: 'Multiple lightning strikes hit all enemies.',
  hitCount: 2,
  aiHints: { priority: 2.8, target: 'random', avoidOverkill: false },
};

export const STORM_SHIELD: Ability = {
  id: 'storm-shield',
  name: 'Storm Shield',
  type: 'buff',
  element: 'Jupiter',
  manaCost: 3,
  basePower: 0,
  targets: 'all-allies',
  unlockLevel: 12,
  description: 'Wind barrier protects and speeds party.',
  shieldCharges: 2,
  buffEffect: { spd: 6 },
  duration: 3,
  aiHints: { priority: 2.5, target: 'random', opener: true },
};

export const BOLT_BARRAGE: Ability = {
  id: 'bolt-barrage',
  name: 'Bolt Barrage',
  type: 'psynergy',
  element: 'Jupiter',
  manaCost: 5,
  basePower: 18,
  targets: 'all-enemies',
  unlockLevel: 13,
  description: 'Barrage of lightning bolts.',
  hitCount: 3,
  chainDamage: true,
  aiHints: { priority: 3.0, target: 'random', avoidOverkill: false },
};

export const HURRICANE_FORCE: Ability = {
  id: 'hurricane-force',
  name: 'Hurricane Force',
  type: 'psynergy',
  element: 'Jupiter',
  manaCost: 5,
  basePower: 45,
  targets: 'all-enemies',
  unlockLevel: 14,
  description: 'Hurricane winds devastate enemies.',
  splashDamagePercent: 1.0,
  aiHints: { priority: 3.0, target: 'random', avoidOverkill: false },
};

export const THOR_HAMMER: Ability = {
  id: 'thor-hammer',
  name: 'Thor\'s Hammer',
  type: 'psynergy',
  element: 'Jupiter',
  manaCost: 5,
  basePower: 50,
  targets: 'single-enemy',
  unlockLevel: 15,
  description: 'Call down Thor\'s hammer with massive force.',
  ignoreDefensePercent: 0.4,
  splashDamagePercent: 0.5,
  aiHints: { priority: 3.0, target: 'weakest', avoidOverkill: false },
};

export const LIGHTNING_SANCTUARY: Ability = {
  id: 'lightning-sanctuary',
  name: 'Lightning Sanctuary',
  type: 'buff',
  element: 'Jupiter',
  manaCost: 4,
  basePower: 0,
  targets: 'all-allies',
  unlockLevel: 16,
  description: 'Electric field protects party.',
  grantImmunity: { all: false, types: ['paralyze', 'stun'], duration: 3 },
  elementalResistance: { element: 'Jupiter', modifier: 0.4 },
  duration: 4,
  aiHints: { priority: 2.8, target: 'random', opener: true },
};

export const APOCALYPTIC_STORM: Ability = {
  id: 'apocalyptic-storm',
  name: 'Apocalyptic Storm',
  type: 'psynergy',
  element: 'Jupiter',
  manaCost: 5,
  basePower: 55,
  targets: 'all-enemies',
  unlockLevel: 17,
  description: 'Ultimate storm devastates all.',
  chainDamage: true,
  splashDamagePercent: 1.0,
  aiHints: { priority: 3.0, target: 'random', avoidOverkill: false },
};

export const GOD_THUNDER: Ability = {
  id: 'god-thunder',
  name: 'God Thunder',
  type: 'psynergy',
  element: 'Jupiter',
  manaCost: 5,
  basePower: 25,
  targets: 'all-enemies',
  unlockLevel: 18,
  description: 'Divine thunder strikes repeatedly.',
  hitCount: 4,
  chainDamage: true,
  aiHints: { priority: 3.0, target: 'random', avoidOverkill: false },
};

export const WORLD_STORM: Ability = {
  id: 'world-storm',
  name: 'World Storm',
  type: 'psynergy',
  element: 'Jupiter',
  manaCost: 5,
  basePower: 60,
  targets: 'all-enemies',
  unlockLevel: 19,
  description: 'Storm that engulfs the world.',
  chainDamage: true,
  splashDamagePercent: 1.0,
  statusEffect: { type: 'paralyze', duration: 2, chance: 0.6 },
  aiHints: { priority: 3.0, target: 'random', avoidOverkill: false },
};

export const TEMPEST_TYRANT: Ability = {
  id: 'tempest-tyrant',
  name: 'Tempest Tyrant',
  type: 'psynergy',
  element: 'Jupiter',
  manaCost: 5,
  basePower: 70,
  targets: 'all-enemies',
  unlockLevel: 20,
  description: 'Become the tyrant of storms, obliterating all.',
  hitCount: 2,
  chainDamage: true,
  splashDamagePercent: 1.0,
  statusEffect: { type: 'stun', duration: 2, chance: 0.7 },
  aiHints: { priority: 3.0, target: 'random', avoidOverkill: false },
};

// BLAZE (Mars Balanced Warrior) - Levels 4-20
export const FLAME_BLADE: Ability = {
  id: 'flame-blade',
  name: 'Flame Blade',
  type: 'physical',
  element: 'Mars',
  manaCost: 1,
  basePower: 20,
  targets: 'single-enemy',
  unlockLevel: 4,
  description: 'Fire-imbued blade strike.',
  aiHints: { priority: 2.0, target: 'weakest', avoidOverkill: false },
};

export const BATTLE_CRY: Ability = {
  id: 'battle-cry',
  name: 'Battle Cry',
  type: 'buff',
  manaCost: 2,
  basePower: 0,
  targets: 'self',
  unlockLevel: 5,
  description: 'Roar increases ATK significantly.',
  buffEffect: { atk: 10 },
  duration: 3,
  aiHints: { priority: 2.0, target: 'random', opener: true },
};

export const INFERNO_STRIKE: Ability = {
  id: 'inferno-strike',
  name: 'Inferno Strike',
  type: 'physical',
  element: 'Mars',
  manaCost: 2,
  basePower: 16,
  targets: 'single-enemy',
  unlockLevel: 6,
  description: 'Rapid fire strikes.',
  hitCount: 2,
  aiHints: { priority: 2.0, target: 'weakest', avoidOverkill: false },
};

export const PYROBLAST: Ability = {
  id: 'pyroblast',
  name: 'Pyroblast',
  type: 'psynergy',
  element: 'Mars',
  manaCost: 3,
  basePower: 35,
  targets: 'single-enemy',
  unlockLevel: 7,
  description: 'Concentrated fire blast.',
  aiHints: { priority: 2.5, target: 'weakest', avoidOverkill: false },
};

export const WARRIOR_FLAME: Ability = {
  id: 'warrior-flame',
  name: 'Warrior\'s Flame',
  type: 'buff',
  element: 'Mars',
  manaCost: 2,
  basePower: 0,
  targets: 'self',
  unlockLevel: 8,
  description: 'Inner fire enhances combat prowess.',
  buffEffect: { atk: 8, mag: 8 },
  duration: 3,
  aiHints: { priority: 2.5, target: 'random', opener: true },
};

export const MOLTEN_SLASH: Ability = {
  id: 'molten-slash',
  name: 'Molten Slash',
  type: 'physical',
  element: 'Mars',
  manaCost: 2,
  basePower: 28,
  targets: 'single-enemy',
  unlockLevel: 9,
  description: 'Superheated blade melts through defenses.',
  ignoreDefensePercent: 0.3,
  statusEffect: { type: 'burn', duration: 2, chance: 0.4 },
  aiHints: { priority: 2.5, target: 'highestDef', avoidOverkill: false },
};

export const FIRE_NOVA: Ability = {
  id: 'fire-nova',
  name: 'Fire Nova',
  type: 'psynergy',
  element: 'Mars',
  manaCost: 4,
  basePower: 30,
  targets: 'all-enemies',
  unlockLevel: 10,
  description: 'Explosive nova hits all enemies.',
  aiHints: { priority: 2.8, target: 'random', avoidOverkill: false },
};

export const BLAZING_ASSAULT: Ability = {
  id: 'blazing-assault',
  name: 'Blazing Assault',
  type: 'physical',
  element: 'Mars',
  manaCost: 3,
  basePower: 18,
  targets: 'single-enemy',
  unlockLevel: 11,
  description: 'Relentless flaming assault.',
  hitCount: 3,
  aiHints: { priority: 2.8, target: 'weakest', avoidOverkill: false },
};

export const MAGMA_WAVE: Ability = {
  id: 'magma-wave',
  name: 'Magma Wave',
  type: 'psynergy',
  element: 'Mars',
  manaCost: 4,
  basePower: 40,
  targets: 'all-enemies',
  unlockLevel: 12,
  description: 'Wave of magma burns all.',
  statusEffect: { type: 'burn', duration: 2, chance: 0.5 },
  aiHints: { priority: 2.8, target: 'random', avoidOverkill: false },
};

export const BERSERKER_RAGE: Ability = {
  id: 'berserker-rage',
  name: 'Berserker Rage',
  type: 'buff',
  manaCost: 3,
  basePower: 0,
  targets: 'self',
  unlockLevel: 13,
  description: 'Enter berserker state.',
  buffEffect: { atk: 15, spd: 10 },
  damageReductionPercent: 0.15,
  duration: 3,
  aiHints: { priority: 2.8, target: 'random', opener: true },
};

export const CRIMSON_FURY: Ability = {
  id: 'crimson-fury',
  name: 'Crimson Fury',
  type: 'physical',
  element: 'Mars',
  manaCost: 4,
  basePower: 20,
  targets: 'single-enemy',
  unlockLevel: 14,
  description: 'Fury unleashed in multiple strikes.',
  hitCount: 4,
  aiHints: { priority: 2.8, target: 'weakest', avoidOverkill: false },
};

export const METEOR_CRASH: Ability = {
  id: 'meteor-crash',
  name: 'Meteor Crash',
  type: 'psynergy',
  element: 'Mars',
  manaCost: 5,
  basePower: 55,
  targets: 'single-enemy',
  unlockLevel: 15,
  description: 'Call down burning meteor.',
  ignoreDefensePercent: 0.4,
  splashDamagePercent: 0.4,
  aiHints: { priority: 3.0, target: 'weakest', avoidOverkill: false },
};

export const PHOENIX_AURA: Ability = {
  id: 'phoenix-aura',
  name: 'Phoenix Aura',
  type: 'buff',
  element: 'Mars',
  manaCost: 4,
  basePower: 0,
  targets: 'self',
  unlockLevel: 16,
  description: 'Channel phoenix power.',
  buffEffect: { atk: 12, mag: 12, def: 8 },
  healOverTime: { amount: 12, duration: 3 },
  aiHints: { priority: 3.0, target: 'random', opener: true },
};

export const SOLAR_FLARE: Ability = {
  id: 'solar-flare',
  name: 'Solar Flare',
  type: 'psynergy',
  element: 'Mars',
  manaCost: 5,
  basePower: 50,
  targets: 'all-enemies',
  unlockLevel: 17,
  description: 'Solar flare burns all enemies.',
  statusEffect: { type: 'burn', duration: 3, chance: 0.8 },
  aiHints: { priority: 3.0, target: 'random', avoidOverkill: false },
};

export const ULTIMATE_WARRIOR: Ability = {
  id: 'ultimate-warrior',
  name: 'Ultimate Warrior',
  type: 'buff',
  manaCost: 5,
  basePower: 0,
  targets: 'self',
  unlockLevel: 18,
  description: 'Reach peak warrior form.',
  buffEffect: { atk: 18, def: 10, spd: 12 },
  damageReductionPercent: 0.25,
  duration: 4,
  aiHints: { priority: 3.0, target: 'random', opener: true },
};

export const INFERNO_BARRAGE: Ability = {
  id: 'inferno-barrage',
  name: 'Inferno Barrage',
  type: 'physical',
  element: 'Mars',
  manaCost: 5,
  basePower: 22,
  targets: 'all-enemies',
  unlockLevel: 19,
  description: 'Barrage of flaming strikes hits all.',
  hitCount: 3,
  aiHints: { priority: 3.0, target: 'random', avoidOverkill: false },
};

export const SUPERNOVA_STRIKE: Ability = {
  id: 'supernova-strike',
  name: 'Supernova Strike',
  type: 'physical',
  element: 'Mars',
  manaCost: 5,
  basePower: 65,
  targets: 'all-enemies',
  unlockLevel: 20,
  description: 'Channel a supernova into devastating strike.',
  hitCount: 2,
  ignoreDefensePercent: 0.5,
  splashDamagePercent: 1.0,
  statusEffect: { type: 'burn', duration: 3, chance: 1.0 },
  aiHints: { priority: 3.0, target: 'random', avoidOverkill: false },
};

// KARIS (Mercury Scholar) - Levels 5-20
export const FROST_SHIELD: Ability = {
  id: 'frost-shield',
  name: 'Frost Shield',
  type: 'buff',
  element: 'Mercury',
  manaCost: 2,
  basePower: 0,
  targets: 'single-ally',
  unlockLevel: 5,
  description: 'Ice barrier protects ally.',
  shieldCharges: 2,
  duration: 3,
  aiHints: { priority: 2.0, target: 'random', opener: true },
};

export const PURIFY: Ability = {
  id: 'purify',
  name: 'Purify',
  type: 'healing',
  element: 'Mercury',
  manaCost: 2,
  basePower: 0,
  targets: 'all-allies',
  unlockLevel: 6,
  description: 'Cleanse party of poison and burn.',
  removeStatusEffects: { type: 'byType', statuses: ['poison', 'burn'] },
  aiHints: { priority: 2.5, target: 'healerFirst', avoidOverkill: false },
};

export const ICE_SPEAR: Ability = {
  id: 'ice-spear',
  name: 'Ice Spear',
  type: 'psynergy',
  element: 'Mercury',
  manaCost: 3,
  basePower: 35,
  targets: 'single-enemy',
  unlockLevel: 7,
  description: 'Sharp spear of ice pierces target.',
  aiHints: { priority: 2.5, target: 'weakest', avoidOverkill: false },
};

export const SCHOLAR_WISDOM: Ability = {
  id: 'scholar-wisdom',
  name: 'Scholar\'s Wisdom',
  type: 'buff',
  manaCost: 2,
  basePower: 0,
  targets: 'self',
  unlockLevel: 8,
  description: 'Channel scholarly knowledge.',
  buffEffect: { mag: 12 },
  duration: 3,
  aiHints: { priority: 2.0, target: 'random', opener: true },
};

export const GLACIAL_WAVE: Ability = {
  id: 'glacial-wave',
  name: 'Glacial Wave',
  type: 'psynergy',
  element: 'Mercury',
  manaCost: 4,
  basePower: 32,
  targets: 'all-enemies',
  unlockLevel: 9,
  description: 'Freezing wave hits all enemies.',
  aiHints: { priority: 2.8, target: 'random', avoidOverkill: false },
};

export const RENEWAL: Ability = {
  id: 'renewal',
  name: 'Renewal',
  type: 'healing',
  element: 'Mercury',
  manaCost: 3,
  basePower: 25,
  targets: 'all-allies',
  unlockLevel: 10,
  description: 'Renewing waters grant regeneration.',
  healOverTime: { amount: 10, duration: 3 },
  aiHints: { priority: 2.5, target: 'healerFirst', avoidOverkill: false },
};

export const FROZEN_SPIKES: Ability = {
  id: 'frozen-spikes',
  name: 'Frozen Spikes',
  type: 'psynergy',
  element: 'Mercury',
  manaCost: 4,
  basePower: 20,
  targets: 'single-enemy',
  unlockLevel: 11,
  description: 'Multiple ice spikes pierce target.',
  hitCount: 3,
  aiHints: { priority: 2.8, target: 'weakest', avoidOverkill: false },
};

export const CRYSTAL_BARRIER: Ability = {
  id: 'crystal-barrier',
  name: 'Crystal Barrier',
  type: 'buff',
  element: 'Mercury',
  manaCost: 3,
  basePower: 0,
  targets: 'all-allies',
  unlockLevel: 12,
  description: 'Crystal barrier protects entire party.',
  shieldCharges: 2,
  buffEffect: { def: 6 },
  duration: 3,
  aiHints: { priority: 2.5, target: 'random', opener: true },
};

export const ICE_STORM: Ability = {
  id: 'ice-storm',
  name: 'Ice Storm',
  type: 'psynergy',
  element: 'Mercury',
  manaCost: 5,
  basePower: 45,
  targets: 'all-enemies',
  unlockLevel: 13,
  description: 'Devastating ice storm.',
  statusEffect: { type: 'freeze', duration: 2, chance: 0.5 },
  aiHints: { priority: 3.0, target: 'random', avoidOverkill: false },
};

export const MASS_RESTORATION: Ability = {
  id: 'mass-restoration',
  name: 'Mass Restoration',
  type: 'healing',
  element: 'Mercury',
  manaCost: 5,
  basePower: 60,
  targets: 'all-allies',
  unlockLevel: 14,
  description: 'Complete party restoration.',
  removeStatusEffects: { type: 'negative' },
  aiHints: { priority: 3.0, target: 'healerFirst', avoidOverkill: false },
};

export const FROZEN_TOMB_KARIS: Ability = {
  id: 'frozen-tomb-karis',
  name: 'Frozen Tomb',
  type: 'psynergy',
  element: 'Mercury',
  manaCost: 4,
  basePower: 35,
  targets: 'single-enemy',
  unlockLevel: 15,
  description: 'Trap enemy in ice for extended time.',
  statusEffect: { type: 'freeze', duration: 4, chance: 0.9 },
  aiHints: { priority: 2.8, target: 'weakest', avoidOverkill: false },
};

export const SCHOLAR_SANCTUARY: Ability = {
  id: 'scholar-sanctuary',
  name: 'Scholar\'s Sanctuary',
  type: 'buff',
  element: 'Mercury',
  manaCost: 4,
  basePower: 0,
  targets: 'all-allies',
  unlockLevel: 16,
  description: 'Create protective sanctuary.',
  buffEffect: { mag: 8, def: 8 },
  grantImmunity: { all: false, types: ['freeze', 'stun'], duration: 2 },
  duration: 3,
  aiHints: { priority: 3.0, target: 'random', opener: true },
};

export const BLIZZARD_CASCADE: Ability = {
  id: 'blizzard-cascade',
  name: 'Blizzard Cascade',
  type: 'psynergy',
  element: 'Mercury',
  manaCost: 5,
  basePower: 55,
  targets: 'all-enemies',
  unlockLevel: 17,
  description: 'Cascading blizzard overwhelms enemies.',
  chainDamage: true,
  aiHints: { priority: 3.0, target: 'random', avoidOverkill: false },
};

export const DIVINE_RENEWAL: Ability = {
  id: 'divine-renewal',
  name: 'Divine Renewal',
  type: 'healing',
  element: 'Mercury',
  manaCost: 5,
  basePower: 80,
  targets: 'all-allies',
  unlockLevel: 18,
  description: 'Divine healing restores party.',
  healOverTime: { amount: 15, duration: 3 },
  removeStatusEffects: { type: 'all' },
  aiHints: { priority: 3.0, target: 'healerFirst', avoidOverkill: false },
};

export const ABSOLUTE_ZERO_KARIS: Ability = {
  id: 'absolute-zero-karis',
  name: 'Absolute Zero',
  type: 'psynergy',
  element: 'Mercury',
  manaCost: 5,
  basePower: 65,
  targets: 'all-enemies',
  unlockLevel: 19,
  description: 'Ultimate freeze at absolute zero.',
  statusEffect: { type: 'freeze', duration: 3, chance: 0.8 },
  aiHints: { priority: 3.0, target: 'random', avoidOverkill: false },
};

export const AQUA_RESURRECTION: Ability = {
  id: 'aqua-resurrection',
  name: 'Aqua Resurrection',
  type: 'healing',
  element: 'Mercury',
  manaCost: 5,
  basePower: 100,
  targets: 'all-allies',
  unlockLevel: 20,
  description: 'Channel ocean\'s power for complete resurrection.',
  revive: true,
  reviveHPPercent: 0.8,
  removeStatusEffects: { type: 'all' },
  healOverTime: { amount: 20, duration: 4 },
  aiHints: { priority: 3.0, target: 'healerFirst', avoidOverkill: false },
};

// TYRELL (Mars Pure DPS) - Levels 5-20
export const RAPID_STRIKES: Ability = {
  id: 'rapid-strikes',
  name: 'Rapid Strikes',
  type: 'physical',
  manaCost: 0,
  basePower: 10,
  targets: 'single-enemy',
  unlockLevel: 5,
  description: 'Lightning-fast triple strike.',
  hitCount: 3,
  aiHints: { priority: 2.0, target: 'weakest', avoidOverkill: false },
};

export const FLAME_JAB: Ability = {
  id: 'flame-jab',
  name: 'Flame Jab',
  type: 'physical',
  element: 'Mars',
  manaCost: 1,
  basePower: 18,
  targets: 'single-enemy',
  unlockLevel: 6,
  description: 'Precise fire-imbued jab.',
  aiHints: { priority: 2.0, target: 'weakest', avoidOverkill: false },
};

export const ASSASSINATE: Ability = {
  id: 'assassinate',
  name: 'Assassinate',
  type: 'physical',
  manaCost: 2,
  basePower: 30,
  targets: 'single-enemy',
  unlockLevel: 7,
  description: 'Precise strike targeting vital points.',
  ignoreDefensePercent: 0.4,
  aiHints: { priority: 2.5, target: 'weakest', avoidOverkill: false },
};

export const COMBAT_FOCUS: Ability = {
  id: 'combat-focus',
  name: 'Combat Focus',
  type: 'buff',
  manaCost: 2,
  basePower: 0,
  targets: 'self',
  unlockLevel: 8,
  description: 'Focus increases damage output.',
  buffEffect: { atk: 12, spd: 8 },
  duration: 3,
  aiHints: { priority: 2.0, target: 'random', opener: true },
};

export const FLURRY: Ability = {
  id: 'flurry',
  name: 'Flurry',
  type: 'physical',
  element: 'Mars',
  manaCost: 2,
  basePower: 14,
  targets: 'single-enemy',
  unlockLevel: 9,
  description: 'Rapid flurry of burning strikes.',
  hitCount: 4,
  aiHints: { priority: 2.5, target: 'weakest', avoidOverkill: false },
};

export const INFERNO_ASSAULT: Ability = {
  id: 'inferno-assault',
  name: 'Inferno Assault',
  type: 'psynergy',
  element: 'Mars',
  manaCost: 3,
  basePower: 40,
  targets: 'single-enemy',
  unlockLevel: 10,
  description: 'Concentrated fire assault.',
  aiHints: { priority: 2.8, target: 'weakest', avoidOverkill: false },
};

export const PRECISION_STRIKE: Ability = {
  id: 'precision-strike',
  name: 'Precision Strike',
  type: 'physical',
  manaCost: 2,
  basePower: 35,
  targets: 'single-enemy',
  unlockLevel: 11,
  description: 'Perfect strike ignoring armor.',
  ignoreDefensePercent: 0.5,
  aiHints: { priority: 2.8, target: 'highestDef', avoidOverkill: false },
};

export const BLOOD_RUSH: Ability = {
  id: 'blood-rush',
  name: 'Blood Rush',
  type: 'buff',
  manaCost: 3,
  basePower: 0,
  targets: 'self',
  unlockLevel: 12,
  description: 'Adrenaline rush maximizes offense.',
  buffEffect: { atk: 15, spd: 12 },
  duration: 3,
  aiHints: { priority: 2.5, target: 'random', opener: true },
};

export const DEATH_STRIKE: Ability = {
  id: 'death-strike',
  name: 'Death Strike',
  type: 'physical',
  manaCost: 3,
  basePower: 18,
  targets: 'single-enemy',
  unlockLevel: 13,
  description: 'Deadly combination of strikes.',
  hitCount: 5,
  aiHints: { priority: 2.8, target: 'weakest', avoidOverkill: false },
};

export const FLAME_TORNADO: Ability = {
  id: 'flame-tornado',
  name: 'Flame Tornado',
  type: 'psynergy',
  element: 'Mars',
  manaCost: 4,
  basePower: 45,
  targets: 'single-enemy',
  unlockLevel: 14,
  description: 'Spinning tornado of flames.',
  ignoreDefensePercent: 0.3,
  aiHints: { priority: 2.8, target: 'weakest', avoidOverkill: false },
};

export const PERFECT_FORM: Ability = {
  id: 'perfect-form',
  name: 'Perfect Form',
  type: 'buff',
  manaCost: 4,
  basePower: 0,
  targets: 'self',
  unlockLevel: 15,
  description: 'Reach perfect combat form.',
  buffEffect: { atk: 18, spd: 15 },
  duration: 4,
  aiHints: { priority: 3.0, target: 'random', opener: true },
};

export const OBLITERATE: Ability = {
  id: 'obliterate',
  name: 'Obliterate',
  type: 'physical',
  element: 'Mars',
  manaCost: 4,
  basePower: 55,
  targets: 'single-enemy',
  unlockLevel: 16,
  description: 'Overwhelming force obliterates target.',
  ignoreDefensePercent: 0.6,
  aiHints: { priority: 3.0, target: 'weakest', avoidOverkill: false },
};

export const UNSTOPPABLE_FORCE: Ability = {
  id: 'unstoppable-force',
  name: 'Unstoppable Force',
  type: 'physical',
  manaCost: 4,
  basePower: 20,
  targets: 'single-enemy',
  unlockLevel: 17,
  description: 'Unstoppable barrage of strikes.',
  hitCount: 6,
  aiHints: { priority: 3.0, target: 'weakest', avoidOverkill: false },
};

export const SUPREME_FOCUS: Ability = {
  id: 'supreme-focus',
  name: 'Supreme Focus',
  type: 'buff',
  manaCost: 5,
  basePower: 0,
  targets: 'self',
  unlockLevel: 18,
  description: 'Achieve supreme combat focus.',
  buffEffect: { atk: 20, spd: 18, mag: 10 },
  damageReductionPercent: 0.2,
  duration: 4,
  aiHints: { priority: 3.0, target: 'random', opener: true },
};

export const ANNIHILATION: Ability = {
  id: 'annihilation',
  name: 'Annihilation',
  type: 'physical',
  element: 'Mars',
  manaCost: 5,
  basePower: 70,
  targets: 'single-enemy',
  unlockLevel: 19,
  description: 'Pure destructive force.',
  ignoreDefensePercent: 0.7,
  aiHints: { priority: 3.0, target: 'weakest', avoidOverkill: false },
};

export const ONE_THOUSAND_CUTS: Ability = {
  id: 'one-thousand-cuts',
  name: 'One Thousand Cuts',
  type: 'physical',
  element: 'Mars',
  manaCost: 5,
  basePower: 25,
  targets: 'single-enemy',
  unlockLevel: 20,
  description: 'Legendary technique striking multiple times at blinding speed.',
  hitCount: 8,
  ignoreDefensePercent: 0.5,
  statusEffect: { type: 'burn', duration: 3, chance: 1.0 },
  aiHints: { priority: 3.0, target: 'weakest', avoidOverkill: false },
};

// FELIX (Venus Master Warrior) - Levels 5-20
export const EARTH_STRIKE: Ability = {
  id: 'earth-strike',
  name: 'Earth Strike',
  type: 'physical',
  element: 'Venus',
  manaCost: 1,
  basePower: 22,
  targets: 'single-enemy',
  unlockLevel: 5,
  description: 'Earth-empowered strike.',
  aiHints: { priority: 2.0, target: 'weakest', avoidOverkill: false },
};

export const WARRIOR_RESOLVE: Ability = {
  id: 'warrior-resolve',
  name: 'Warrior\'s Resolve',
  type: 'buff',
  manaCost: 2,
  basePower: 0,
  targets: 'self',
  unlockLevel: 6,
  description: 'Strengthen resolve for battle.',
  buffEffect: { atk: 10, def: 8 },
  duration: 3,
  aiHints: { priority: 2.0, target: 'random', opener: true },
};

export const SUNDER_ARMOR: Ability = {
  id: 'sunder-armor',
  name: 'Sunder Armor',
  type: 'physical',
  element: 'Venus',
  manaCost: 2,
  basePower: 25,
  targets: 'single-enemy',
  unlockLevel: 7,
  description: 'Shatter enemy armor.',
  debuffEffect: { def: -10 },
  duration: 3,
  aiHints: { priority: 2.5, target: 'highestDef', avoidOverkill: false },
};

export const STONE_FIST: Ability = {
  id: 'stone-fist',
  name: 'Stone Fist',
  type: 'physical',
  element: 'Venus',
  manaCost: 2,
  basePower: 16,
  targets: 'single-enemy',
  unlockLevel: 8,
  description: 'Hardened fists strike twice.',
  hitCount: 2,
  aiHints: { priority: 2.0, target: 'weakest', avoidOverkill: false },
};

export const EARTH_SHAKER: Ability = {
  id: 'earth-shaker',
  name: 'Earth Shaker',
  type: 'psynergy',
  element: 'Venus',
  manaCost: 4,
  basePower: 38,
  targets: 'all-enemies',
  unlockLevel: 9,
  description: 'Massive earthquake shakes battlefield.',
  aiHints: { priority: 2.8, target: 'random', avoidOverkill: false },
};

export const BATTLE_MASTER: Ability = {
  id: 'battle-master',
  name: 'Battle Master',
  type: 'buff',
  manaCost: 3,
  basePower: 0,
  targets: 'self',
  unlockLevel: 10,
  description: 'Channel years of experience.',
  buffEffect: { atk: 12, def: 10, spd: 8 },
  duration: 3,
  aiHints: { priority: 2.5, target: 'random', opener: true },
};

export const CRUSHING_IMPACT: Ability = {
  id: 'crushing-impact',
  name: 'Crushing Impact',
  type: 'physical',
  element: 'Venus',
  manaCost: 3,
  basePower: 40,
  targets: 'single-enemy',
  unlockLevel: 11,
  description: 'Devastating impact crushes defenses.',
  ignoreDefensePercent: 0.4,
  aiHints: { priority: 2.8, target: 'highestDef', avoidOverkill: false },
};

export const MOUNTAIN_STRENGTH: Ability = {
  id: 'mountain-strength',
  name: 'Mountain\'s Strength',
  type: 'buff',
  element: 'Venus',
  manaCost: 3,
  basePower: 0,
  targets: 'self',
  unlockLevel: 12,
  description: 'Channel the mountain\'s strength.',
  buffEffect: { atk: 15, def: 12 },
  damageReductionPercent: 0.2,
  duration: 4,
  aiHints: { priority: 2.5, target: 'random', opener: true },
};

export const RAGNAROK_STRIKE: Ability = {
  id: 'ragnarok-strike',
  name: 'Ragnarok Strike',
  type: 'physical',
  element: 'Venus',
  manaCost: 4,
  basePower: 50,
  targets: 'single-enemy',
  unlockLevel: 13,
  description: 'Legendary strike of massive power.',
  ignoreDefensePercent: 0.5,
  aiHints: { priority: 2.8, target: 'weakest', avoidOverkill: false },
};

export const TERRA_SHIELD: Ability = {
  id: 'terra-shield',
  name: 'Terra Shield',
  type: 'buff',
  element: 'Venus',
  manaCost: 4,
  basePower: 0,
  targets: 'all-allies',
  unlockLevel: 14,
  description: 'Earth\'s protection shields party.',
  buffEffect: { def: 10 },
  shieldCharges: 3,
  duration: 3,
  aiHints: { priority: 2.8, target: 'random', opener: true },
};

export const GRAND_IMPACT: Ability = {
  id: 'grand-impact',
  name: 'Grand Impact',
  type: 'physical',
  element: 'Venus',
  manaCost: 4,
  basePower: 25,
  targets: 'single-enemy',
  unlockLevel: 15,
  description: 'Multiple earth-shattering strikes.',
  hitCount: 3,
  aiHints: { priority: 3.0, target: 'weakest', avoidOverkill: false },
};

export const LEGENDARY_WARRIOR: Ability = {
  id: 'legendary-warrior',
  name: 'Legendary Warrior',
  type: 'buff',
  manaCost: 5,
  basePower: 0,
  targets: 'self',
  unlockLevel: 16,
  description: 'Achieve legendary status.',
  buffEffect: { atk: 18, def: 15 },
  damageReductionPercent: 0.3,
  duration: 4,
  aiHints: { priority: 3.0, target: 'random', opener: true },
};

export const TITAN_FALL: Ability = {
  id: 'titan-fall',
  name: 'Titan Fall',
  type: 'physical',
  element: 'Venus',
  manaCost: 5,
  basePower: 60,
  targets: 'single-enemy',
  unlockLevel: 17,
  description: 'Fall upon enemy with titan\'s force.',
  ignoreDefensePercent: 0.6,
  splashDamagePercent: 0.4,
  aiHints: { priority: 3.0, target: 'weakest', avoidOverkill: false },
};

export const EARTH_JUDGMENT: Ability = {
  id: 'earth-judgment',
  name: 'Earth\'s Judgment',
  type: 'psynergy',
  element: 'Venus',
  manaCost: 5,
  basePower: 55,
  targets: 'all-enemies',
  unlockLevel: 18,
  description: 'Earth judges all enemies.',
  splashDamagePercent: 1.0,
  aiHints: { priority: 3.0, target: 'random', avoidOverkill: false },
};

export const MASTER_AURA: Ability = {
  id: 'master-aura',
  name: 'Master\'s Aura',
  type: 'buff',
  manaCost: 5,
  basePower: 0,
  targets: 'all-allies',
  unlockLevel: 19,
  description: 'Share master\'s aura with party.',
  buffEffect: { atk: 12, def: 12, spd: 10 },
  duration: 4,
  aiHints: { priority: 3.0, target: 'random', opener: true },
};

export const GAIA_BLADE: Ability = {
  id: 'gaia-blade',
  name: 'Gaia Blade',
  type: 'physical',
  element: 'Venus',
  manaCost: 5,
  basePower: 75,
  targets: 'single-enemy',
  unlockLevel: 20,
  description: 'Channel Gaia\'s full power into ultimate strike.',
  hitCount: 2,
  ignoreDefensePercent: 0.7,
  splashDamagePercent: 0.6,
  debuffEffect: { def: -15, atk: -10 },
  duration: 3,
  aiHints: { priority: 3.0, target: 'weakest', avoidOverkill: false },
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
  // Level Progression Abilities (145 new)
  // Adept
  'fortify': FORTIFY,
  'tremor': TREMOR,
  'guardian-stance': GUARDIAN_STANCE,
  'rock-breaker': ROCK_BREAKER,
  'earthquake': EARTHQUAKE,
  'stone-wall': STONE_WALL,
  'unbreakable': UNBREAKABLE,
  'titan-grip': TITAN_GRIP,
  'gaia-shield': GAIA_SHIELD,
  'petrify-strike': PETRIFY_STRIKE,
  'mountain-endurance': MOUNTAIN_ENDURANCE,
  'landslide': LANDSLIDE,
  'earth-blessing': EARTH_BLESSING,
  'gaia-rebirth': GAIA_REBIRTH,
  // War Mage
  'ignite': IGNITE,
  'flame-wall': FLAME_WALL,
  'inferno-slash': INFERNO_SLASH,
  'blazing-fury': BLAZING_FURY,
  'pyroclasm': PYROCLASM,
  'fire-aura': FIRE_AURA,
  'meteor-strike': METEOR_STRIKE,
  'phoenix-flames': PHOENIX_FLAMES,
  'magma-burst': MAGMA_BURST,
  'flame-shield': FLAME_SHIELD,
  'supernova': SUPERNOVA,
  'infernal-rage': INFERNAL_RAGE,
  'dragon-breath': DRAGON_BREATH,
  'ragnarok-flames': RAGNAROK_FLAMES,
  // Mystic
  'cleanse': CLEANSE,
  'frost-wave': FROST_WAVE,
  'regen': REGEN,
  'diamond-dust': DIAMOND_DUST,
  'mass-regen': MASS_REGEN,
  'glacial-shield': GLACIAL_SHIELD,
  'deep-freeze': DEEP_FREEZE,
  'sanctuary': SANCTUARY,
  'blizzard': BLIZZARD,
  'restoration': RESTORATION,
  'frozen-tomb': FROZEN_TOMB,
  'aqua-barrier': AQUA_BARRIER,
  'absolute-zero': ABSOLUTE_ZERO,
  'leviathan-grace': LEVIATHAN_GRACE,
  // Ranger
  'swift-strike': SWIFT_STRIKE,
  'shock-bolt': SHOCK_BOLT,
  'tempest': TEMPEST,
  'hurricane-slash': HURRICANE_SLASH,
  'plasma-shot': PLASMA_SHOT,
  'cyclone': CYCLONE,
  'thunder-god-fury': THUNDER_GOD_FURY,
  'storm-blessing': STORM_BLESSING,
  'judgment-bolt': JUDGMENT_BOLT,
  'static-field': STATIC_FIELD,
  'wind-walker': WIND_WALKER,
  'maelstrom': MAELSTROM,
  'zeus-wrath': ZEUS_WRATH,
  'storm-sovereign': STORM_SOVEREIGN,
  // Sentinel
  'taunt': TAUNT,
  'shield-bash': SHIELD_BASH,
  'iron-wall': IRON_WALL,
  'counter-stance': COUNTER_STANCE,
  'tremor-strike': TREMOR_STRIKE,
  'fortified-guard': FORTIFIED_GUARD,
  'bulwark': BULWARK,
  'crushing-blow': CRUSHING_BLOW,
  'earthen-armor': EARTHEN_ARMOR,
  'shockwave': SHOCKWAVE,
  'guardian-resolve': GUARDIAN_RESOLVE,
  'titan-grip-sentinel': TITAN_GRIP_SENTINEL,
  'stone-fortress': STONE_FORTRESS,
  'avalanche': AVALANCHE,
  'immortal-bulwark': IMMORTAL_BULWARK,
  'earth-splitter': EARTH_SPLITTER,
  'atlas-stand': ATLAS_STAND,
  // Stormcaller
  'thunder-clap': THUNDER_CLAP,
  'storm-call': STORM_CALL,
  'static-charge': STATIC_CHARGE,
  'lightning-arc': LIGHTNING_ARC,
  'shock-pulse': SHOCK_PULSE,
  'wind-mastery': WIND_MASTERY,
  'thunder-storm': THUNDER_STORM,
  'electric-overload': ELECTRIC_OVERLOAD,
  'storm-shield': STORM_SHIELD,
  'bolt-barrage': BOLT_BARRAGE,
  'hurricane-force': HURRICANE_FORCE,
  'thor-hammer': THOR_HAMMER,
  'lightning-sanctuary': LIGHTNING_SANCTUARY,
  'apocalyptic-storm': APOCALYPTIC_STORM,
  'god-thunder': GOD_THUNDER,
  'world-storm': WORLD_STORM,
  'tempest-tyrant': TEMPEST_TYRANT,
  // Blaze
  'flame-blade': FLAME_BLADE,
  'battle-cry': BATTLE_CRY,
  'inferno-strike': INFERNO_STRIKE,
  'pyroblast': PYROBLAST,
  'warrior-flame': WARRIOR_FLAME,
  'molten-slash': MOLTEN_SLASH,
  'fire-nova': FIRE_NOVA,
  'blazing-assault': BLAZING_ASSAULT,
  'magma-wave': MAGMA_WAVE,
  'berserker-rage': BERSERKER_RAGE,
  'crimson-fury': CRIMSON_FURY,
  'meteor-crash': METEOR_CRASH,
  'phoenix-aura': PHOENIX_AURA,
  'solar-flare': SOLAR_FLARE,
  'ultimate-warrior': ULTIMATE_WARRIOR,
  'inferno-barrage': INFERNO_BARRAGE,
  'supernova-strike': SUPERNOVA_STRIKE,
  // Karis
  'frost-shield': FROST_SHIELD,
  'purify': PURIFY,
  'ice-spear': ICE_SPEAR,
  'scholar-wisdom': SCHOLAR_WISDOM,
  'glacial-wave': GLACIAL_WAVE,
  'renewal': RENEWAL,
  'frozen-spikes': FROZEN_SPIKES,
  'crystal-barrier': CRYSTAL_BARRIER,
  'ice-storm': ICE_STORM,
  'mass-restoration': MASS_RESTORATION,
  'frozen-tomb-karis': FROZEN_TOMB_KARIS,
  'scholar-sanctuary': SCHOLAR_SANCTUARY,
  'blizzard-cascade': BLIZZARD_CASCADE,
  'divine-renewal': DIVINE_RENEWAL,
  'absolute-zero-karis': ABSOLUTE_ZERO_KARIS,
  'aqua-resurrection': AQUA_RESURRECTION,
  // Tyrell
  'rapid-strikes': RAPID_STRIKES,
  'flame-jab': FLAME_JAB,
  'assassinate': ASSASSINATE,
  'combat-focus': COMBAT_FOCUS,
  'flurry': FLURRY,
  'inferno-assault': INFERNO_ASSAULT,
  'precision-strike': PRECISION_STRIKE,
  'blood-rush': BLOOD_RUSH,
  'death-strike': DEATH_STRIKE,
  'flame-tornado': FLAME_TORNADO,
  'perfect-form': PERFECT_FORM,
  'obliterate': OBLITERATE,
  'unstoppable-force': UNSTOPPABLE_FORCE,
  'supreme-focus': SUPREME_FOCUS,
  'annihilation': ANNIHILATION,
  'one-thousand-cuts': ONE_THOUSAND_CUTS,
  // Felix
  'earth-strike': EARTH_STRIKE,
  'warrior-resolve': WARRIOR_RESOLVE,
  'sunder-armor': SUNDER_ARMOR,
  'stone-fist': STONE_FIST,
  'earth-shaker': EARTH_SHAKER,
  'battle-master': BATTLE_MASTER,
  'crushing-impact': CRUSHING_IMPACT,
  'mountain-strength': MOUNTAIN_STRENGTH,
  'ragnarok-strike': RAGNAROK_STRIKE,
  'terra-shield': TERRA_SHIELD,
  'grand-impact': GRAND_IMPACT,
  'legendary-warrior': LEGENDARY_WARRIOR,
  'titan-fall': TITAN_FALL,
  'earth-judgment': EARTH_JUDGMENT,
  'master-aura': MASTER_AURA,
  'gaia-blade': GAIA_BLADE,
};
