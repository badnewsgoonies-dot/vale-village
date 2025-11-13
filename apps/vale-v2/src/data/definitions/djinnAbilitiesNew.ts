/**
 * NEW Djinn Abilities - 180 total (15 per Djinn)
 * Focus: Status effects, debuffs, healing, buffs, utility
 * Generated: 2025-11-13
 */
import type { Ability } from '../schemas/AbilitySchema';

const makeAbility = (ability: Ability): Ability => ability;

// ============================================================================
// FLINT (Venus T1) - 15 New Abilities
// ============================================================================

export const FLINT_STONE_ARMOR = makeAbility({
  id: 'flint-stone-armor',
  name: 'Stone Armor',
  type: 'buff',
  element: 'Venus',
  manaCost: 4,
  basePower: 0,
  targets: 'party',
  unlockLevel: 1,
  description: 'Harden all allies with stone, boosting defense.',
  buffEffect: { def: 3 },
  duration: 3,
});

export const FLINT_PETRIFY_GAZE = makeAbility({
  id: 'flint-petrify-gaze',
  name: 'Petrify Gaze',
  type: 'psynergy',
  element: 'Venus',
  manaCost: 5,
  basePower: 30,
  targets: 'single-enemy',
  unlockLevel: 1,
  description: 'Stare down a foe, chance to petrify.',
  statusEffect: { type: 'stun', duration: 2, chance: 0.4 },
});

export const FLINT_EARTH_DRAIN = makeAbility({
  id: 'flint-earth-drain',
  name: 'Earth Drain',
  type: 'psynergy',
  element: 'Venus',
  manaCost: 6,
  basePower: 50,
  targets: 'single-enemy',
  unlockLevel: 1,
  description: 'Drain HP from foe through earth connection.',
  drainPercentage: 0.5, // Heal 50% of damage dealt
});

export const FLINT_GROUND_SHATTER = makeAbility({
  id: 'flint-ground-shatter',
  name: 'Ground Shatter',
  type: 'psynergy',
  element: 'Venus',
  manaCost: 7,
  basePower: 40,
  targets: 'all-enemies',
  unlockLevel: 2,
  description: 'Shatter the ground, damaging all foes.',
});

export const FLINT_BOULDER_SHIELD = makeAbility({
  id: 'flint-boulder-shield',
  name: 'Boulder Shield',
  type: 'buff',
  element: 'Venus',
  manaCost: 5,
  basePower: 0,
  targets: 'single-ally',
  unlockLevel: 2,
  description: 'Encase ally in boulders, massively boosting defense.',
  buffEffect: { def: 15 },
  duration: 2,
});

export const FLINT_WEAKNESS_STONE = makeAbility({
  id: 'flint-weakness-stone',
  name: 'Weakness Stone',
  type: 'debuff',
  element: 'Venus',
  manaCost: 4,
  basePower: 0,
  targets: 'single-enemy',
  unlockLevel: 2,
  description: 'Curse foe with heavy stone, reducing attack.',
  debuffEffect: { atk: -5 },
  duration: 3,
});

export const FLINT_TERRA_REGENERATION = makeAbility({
  id: 'flint-terra-regeneration',
  name: 'Terra Regeneration',
  type: 'healing',
  element: 'Venus',
  manaCost: 6,
  basePower: 25,
  targets: 'party',
  unlockLevel: 3,
  description: 'Channel earth energy to heal all allies over time.',
  healOverTime: { amount: 10, duration: 3 },
});

export const FLINT_ROCK_THORNS = makeAbility({
  id: 'flint-rock-thorns',
  name: 'Rock Thorns',
  type: 'buff',
  element: 'Venus',
  manaCost: 5,
  basePower: 0,
  targets: 'self',
  unlockLevel: 3,
  description: 'Surround self with rock thorns that damage attackers.',
  counterDamage: 15,
  duration: 3,
});

export const FLINT_CRUSHING_WEIGHT = makeAbility({
  id: 'flint-crushing-weight',
  name: 'Crushing Weight',
  type: 'debuff',
  element: 'Venus',
  manaCost: 5,
  basePower: 0,
  targets: 'all-enemies',
  unlockLevel: 3,
  description: 'Increase gravity on all foes, reducing speed.',
  debuffEffect: { spd: -3 },
  duration: 3,
});

export const FLINT_EARTH_MEND = makeAbility({
  id: 'flint-earth-mend',
  name: 'Earth Mend',
  type: 'healing',
  element: 'Venus',
  manaCost: 4,
  basePower: 40,
  targets: 'single-ally',
  unlockLevel: 2,
  description: 'Heal ally and remove status effects.',
  removeStatusEffects: true,
});

export const FLINT_STONE_RAIN = makeAbility({
  id: 'flint-stone-rain',
  name: 'Stone Rain',
  type: 'psynergy',
  element: 'Venus',
  manaCost: 8,
  basePower: 35,
  targets: 'all-enemies',
  unlockLevel: 3,
  description: 'Rain stones on all foes, chance to stun.',
  statusEffect: { type: 'stun', duration: 1, chance: 0.3 },
});

export const FLINT_FORTIFY = makeAbility({
  id: 'flint-fortify',
  name: 'Fortify',
  type: 'buff',
  element: 'Venus',
  manaCost: 6,
  basePower: 0,
  targets: 'party',
  unlockLevel: 3,
  description: 'Boost all allies\' defense and HP.',
  buffEffect: { def: 4, hp: 20 },
  duration: 3,
});

export const FLINT_QUAKE_FISSURE = makeAbility({
  id: 'flint-quake-fissure',
  name: 'Quake Fissure',
  type: 'psynergy',
  element: 'Venus',
  manaCost: 9,
  basePower: 70,
  targets: 'single-enemy',
  unlockLevel: 4,
  description: 'Open a fissure beneath foe for massive damage.',
  ignoreDefensePercent: 0.25, // Ignore 25% of defense
});

export const FLINT_EARTH_SANCTUARY = makeAbility({
  id: 'flint-earth-sanctuary',
  name: 'Earth Sanctuary',
  type: 'buff',
  element: 'Venus',
  manaCost: 8,
  basePower: 0,
  targets: 'party',
  unlockLevel: 4,
  description: 'Create sanctuary that blocks one attack for each ally.',
  shieldCharges: 1,
  duration: 3,
});

export const FLINT_PETRIFYING_TOUCH = makeAbility({
  id: 'flint-petrifying-touch',
  name: 'Petrifying Touch',
  type: 'physical',
  element: 'Venus',
  manaCost: 6,
  basePower: 40,
  targets: 'single-enemy',
  unlockLevel: 4,
  description: 'Strike foe with petrifying force, high stun chance.',
  statusEffect: { type: 'stun', duration: 2, chance: 0.6 },
});

// ============================================================================
// GRANITE (Venus T2) - 15 New Abilities
// ============================================================================

export const GRANITE_STONE_GRASP = makeAbility({
  id: 'granite-stone-grasp',
  name: 'Stone Grasp',
  type: 'psynergy',
  element: 'Venus',
  manaCost: 7,
  basePower: 55,
  targets: 'single-enemy',
  unlockLevel: 2,
  description: 'Encase foe in stone, dealing damage and reducing speed.',
  debuffEffect: { spd: -5 },
  duration: 2,
});

export const GRANITE_EARTH_BARRIER = makeAbility({
  id: 'granite-earth-barrier',
  name: 'Earth Barrier',
  type: 'buff',
  element: 'Venus',
  manaCost: 6,
  basePower: 0,
  targets: 'party',
  unlockLevel: 2,
  description: 'Raise barrier that reduces damage from next attack.',
  damageReduction: 0.3, // Reduce 30% damage
  duration: 2,
});

export const GRANITE_LANDSLIDE = makeAbility({
  id: 'granite-landslide',
  name: 'Landslide',
  type: 'psynergy',
  element: 'Venus',
  manaCost: 10,
  basePower: 45,
  targets: 'all-enemies',
  unlockLevel: 3,
  description: 'Trigger landslide damaging all foes and reducing defense.',
  debuffEffect: { def: -4 },
  duration: 3,
});

export const GRANITE_STONE_SIPHON = makeAbility({
  id: 'granite-stone-siphon',
  name: 'Stone Siphon',
  type: 'psynergy',
  element: 'Venus',
  manaCost: 8,
  basePower: 60,
  targets: 'single-enemy',
  unlockLevel: 3,
  description: 'Drain foe\'s strength through earth, stealing attack.',
  stealStat: { stat: 'atk', amount: 3, duration: 3 },
});

export const GRANITE_EARTHQUAKE_SHIELD = makeAbility({
  id: 'granite-earthquake-shield',
  name: 'Earthquake Shield',
  type: 'buff',
  element: 'Venus',
  manaCost: 7,
  basePower: 0,
  targets: 'self',
  unlockLevel: 3,
  description: 'When hit, trigger earthquake damaging all attackers.',
  counterDamageAOE: 20,
  duration: 3,
});

export const GRANITE_TERRA_CURSE = makeAbility({
  id: 'granite-terra-curse',
  name: 'Terra Curse',
  type: 'debuff',
  element: 'Venus',
  manaCost: 6,
  basePower: 0,
  targets: 'single-enemy',
  unlockLevel: 3,
  description: 'Curse foe with heavy earth, reducing all stats.',
  debuffEffect: { atk: -3, def: -3, spd: -3 },
  duration: 2,
});

export const GRANITE_REJUVENATION = makeAbility({
  id: 'granite-rejuvenation',
  name: 'Rejuvenation',
  type: 'healing',
  element: 'Venus',
  manaCost: 7,
  basePower: 50,
  targets: 'single-ally',
  unlockLevel: 3,
  description: 'Heal ally and boost their HP regeneration.',
  healOverTime: { amount: 15, duration: 3 },
});

export const GRANITE_BOULDER_BARRAGE = makeAbility({
  id: 'granite-boulder-barrage',
  name: 'Boulder Barrage',
  type: 'psynergy',
  element: 'Venus',
  manaCost: 12,
  basePower: 40,
  targets: 'all-enemies',
  unlockLevel: 4,
  description: 'Hurl boulders at all foes multiple times.',
  hitCount: 2,
});

export const GRANITE_STALWART_STANCE = makeAbility({
  id: 'granite-stalwart-stance',
  name: 'Stalwart Stance',
  type: 'buff',
  element: 'Venus',
  manaCost: 8,
  basePower: 0,
  targets: 'self',
  unlockLevel: 4,
  description: 'Become immovable, immune to stun/knockback.',
  immunityStatus: ['stun', 'knockback'],
  duration: 3,
});

export const GRANITE_EARTH_BLESSING = makeAbility({
  id: 'granite-earth-blessing',
  name: 'Earth Blessing',
  type: 'buff',
  element: 'Venus',
  manaCost: 9,
  basePower: 0,
  targets: 'party',
  unlockLevel: 4,
  description: 'Bless all allies with earth protection and regen.',
  buffEffect: { def: 5 },
  healOverTime: { amount: 12, duration: 3 },
  duration: 3,
});

export const GRANITE_GROUND_SLAM = makeAbility({
  id: 'granite-ground-slam',
  name: 'Ground Slam',
  type: 'physical',
  element: 'Venus',
  manaCost: 8,
  basePower: 75,
  targets: 'single-enemy',
  unlockLevel: 4,
  description: 'Massive strike that cracks the ground.',
  splashDamagePercent: 0.3, // 30% damage to adjacent enemies
});

export const GRANITE_STONE_PRISON = makeAbility({
  id: 'granite-stone-prison',
  name: 'Stone Prison',
  type: 'debuff',
  element: 'Venus',
  manaCost: 7,
  basePower: 0,
  targets: 'single-enemy',
  unlockLevel: 4,
  description: 'Imprison foe in stone, preventing actions.',
  statusEffect: { type: 'stun', duration: 1, chance: 1.0 },
});

export const GRANITE_EARTH_NOVA = makeAbility({
  id: 'granite-earth-nova',
  name: 'Earth Nova',
  type: 'psynergy',
  element: 'Venus',
  manaCost: 15,
  basePower: 65,
  targets: 'all-enemies',
  unlockLevel: 5,
  description: 'Massive earth explosion hitting all foes.',
});

export const GRANITE_TITANIC_GUARD = makeAbility({
  id: 'granite-titanic-guard',
  name: 'Titanic Guard',
  type: 'buff',
  element: 'Venus',
  manaCost: 10,
  basePower: 0,
  targets: 'party',
  unlockLevel: 5,
  description: 'Ultimate earth defense for entire party.',
  buffEffect: { def: 10, hp: 30 },
  duration: 3,
});

export const GRANITE_LIFEDRAIN_EARTH = makeAbility({
  id: 'granite-lifedrain-earth',
  name: 'Lifedrain Earth',
  type: 'psynergy',
  element: 'Venus',
  manaCost: 10,
  basePower: 70,
  targets: 'single-enemy',
  unlockLevel: 5,
  description: 'Massive drain attack healing for 75% damage dealt.',
  drainPercentage: 0.75,
});

// ============================================================================
// BANE (Venus T3) - 15 New Abilities
// ============================================================================

export const BANE_APOCALYPSE_QUAKE = makeAbility({
  id: 'bane-apocalypse-quake',
  name: 'Apocalypse Quake',
  type: 'psynergy',
  element: 'Venus',
  manaCost: 18,
  basePower: 80,
  targets: 'all-enemies',
  unlockLevel: 5,
  description: 'Catastrophic earthquake devastating all foes.',
  ignoreDefensePercent: 0.3,
});

export const BANE_TITAN_FORTIFICATION = makeAbility({
  id: 'bane-titan-fortification',
  name: 'Titan Fortification',
  type: 'buff',
  element: 'Venus',
  manaCost: 12,
  basePower: 0,
  targets: 'party',
  unlockLevel: 5,
  description: 'Ultimate defensive stance, party immune to physical damage.',
  physicalImmunity: true,
  duration: 2,
});

export const BANE_CRUSHING_METEOR = makeAbility({
  id: 'bane-crushing-meteor',
  name: 'Crushing Meteor',
  type: 'psynergy',
  element: 'Venus',
  manaCost: 15,
  basePower: 120,
  targets: 'single-enemy',
  unlockLevel: 6,
  description: 'Call down meteor for devastating single-target damage.',
});

export const BANE_EARTH_SUPREMACY = makeAbility({
  id: 'bane-earth-supremacy',
  name: 'Earth Supremacy',
  type: 'buff',
  element: 'Venus',
  manaCost: 14,
  basePower: 0,
  targets: 'party',
  unlockLevel: 6,
  description: 'Party gains massive stat boost and earth resistance.',
  buffEffect: { atk: 7, def: 10, mag: 5 },
  elementalResistance: { Venus: 0.5 }, // 50% Venus damage reduction
  duration: 3,
});

export const BANE_PETRIFY_ALL = makeAbility({
  id: 'bane-petrify-all',
  name: 'Petrify All',
  type: 'debuff',
  element: 'Venus',
  manaCost: 16,
  basePower: 0,
  targets: 'all-enemies',
  unlockLevel: 6,
  description: 'Attempt to petrify all enemies.',
  statusEffect: { type: 'stun', duration: 2, chance: 0.5 },
});

export const BANE_DRAIN_EARTH = makeAbility({
  id: 'bane-drain-earth',
  name: 'Drain Earth',
  type: 'psynergy',
  element: 'Venus',
  manaCost: 13,
  basePower: 85,
  targets: 'single-enemy',
  unlockLevel: 6,
  description: 'Ultimate drain, healing for 100% damage and stealing stats.',
  drainPercentage: 1.0,
  stealStat: { stat: 'def', amount: 5, duration: 3 },
});

export const BANE_EARTHQUAKE_STORM = makeAbility({
  id: 'bane-earthquake-storm',
  name: 'Earthquake Storm',
  type: 'psynergy',
  element: 'Venus',
  manaCost: 20,
  basePower: 60,
  targets: 'all-enemies',
  unlockLevel: 7,
  description: 'Continuous earthquakes hitting all foes multiple times.',
  hitCount: 3,
});

export const BANE_PERFECT_GUARD = makeAbility({
  id: 'bane-perfect-guard',
  name: 'Perfect Guard',
  type: 'buff',
  element: 'Venus',
  manaCost: 15,
  basePower: 0,
  targets: 'single-ally',
  unlockLevel: 7,
  description: 'Target becomes invulnerable for 1 turn.',
  invulnerable: true,
  duration: 1,
});

export const BANE_EARTH_RESURRECTION = makeAbility({
  id: 'bane-earth-resurrection',
  name: 'Earth Resurrection',
  type: 'healing',
  element: 'Venus',
  manaCost: 18,
  basePower: 999,
  targets: 'single-ally',
  unlockLevel: 7,
  description: 'Revive fallen ally with full HP.',
  revive: true,
  reviveHPPercent: 1.0,
});

export const BANE_CATACLYSM = makeAbility({
  id: 'bane-cataclysm',
  name: 'Cataclysm',
  type: 'psynergy',
  element: 'Venus',
  manaCost: 25,
  basePower: 95,
  targets: 'all-enemies',
  unlockLevel: 8,
  description: 'Ultimate earth destruction hitting all foes.',
  debuffEffect: { def: -10 },
  duration: 2,
});

export const BANE_IMMOVABLE_FORTRESS = makeAbility({
  id: 'bane-immovable-fortress',
  name: 'Immovable Fortress',
  type: 'buff',
  element: 'Venus',
  manaCost: 16,
  basePower: 0,
  targets: 'party',
  unlockLevel: 8,
  description: 'Party becomes immune to debuffs and status effects.',
  immunityAll: true,
  duration: 3,
});

export const BANE_EARTH_JUDGMENT = makeAbility({
  id: 'bane-earth-judgment',
  name: 'Earth Judgment',
  type: 'psynergy',
  element: 'Venus',
  manaCost: 22,
  basePower: 110,
  targets: 'single-enemy',
  unlockLevel: 8,
  description: 'Judge foe with earth\'s wrath, ignoring all defenses.',
  ignoreDefensePercent: 1.0,
});

export const BANE_TERRA_ASCENSION = makeAbility({
  id: 'bane-terra-ascension',
  name: 'Terra Ascension',
  type: 'buff',
  element: 'Venus',
  manaCost: 20,
  basePower: 0,
  targets: 'party',
  unlockLevel: 9,
  description: 'Ascend party to ultimate earth form, massive stat boost.',
  buffEffect: { atk: 10, def: 15, mag: 8, spd: 5 },
  duration: 4,
});

export const BANE_WORLD_BREAKER = makeAbility({
  id: 'bane-world-breaker',
  name: 'World Breaker',
  type: 'psynergy',
  element: 'Venus',
  manaCost: 30,
  basePower: 150,
  targets: 'all-enemies',
  unlockLevel: 10,
  description: 'Shatter the world itself, ultimate earth attack.',
});

export const BANE_ETERNAL_STONE = makeAbility({
  id: 'bane-eternal-stone',
  name: 'Eternal Stone',
  type: 'buff',
  element: 'Venus',
  manaCost: 25,
  basePower: 0,
  targets: 'party',
  unlockLevel: 10,
  description: 'Party becomes eternal stone, immune to all damage for 1 turn.',
  invulnerable: true,
  duration: 1,
});

// ============================================================================
// FORGE (Mars T1) - 15 New Abilities
// ============================================================================

export const FORGE_BURN_CURSE = makeAbility({
  id: 'forge-burn-curse',
  name: 'Burn Curse',
  type: 'debuff',
  element: 'Mars',
  manaCost: 5,
  basePower: 0,
  targets: 'single-enemy',
  unlockLevel: 1,
  description: 'Curse foe with persistent burning.',
  statusEffect: { type: 'burn', duration: 4, chance: 0.9 },
});

export const FORGE_FLAME_WALL = makeAbility({
  id: 'forge-flame-wall',
  name: 'Flame Wall',
  type: 'buff',
  element: 'Mars',
  manaCost: 6,
  basePower: 0,
  targets: 'party',
  unlockLevel: 1,
  description: 'Create wall of flames that damages attackers.',
  counterDamage: 12,
  duration: 3,
});

export const FORGE_HEAT_DRAIN = makeAbility({
  id: 'forge-heat-drain',
  name: 'Heat Drain',
  type: 'psynergy',
  element: 'Mars',
  manaCost: 7,
  basePower: 55,
  targets: 'single-enemy',
  unlockLevel: 1,
  description: 'Drain heat from foe, healing self.',
  drainPercentage: 0.5,
});

export const FORGE_WILDFIRE = makeAbility({
  id: 'forge-wildfire',
  name: 'Wildfire',
  type: 'psynergy',
  element: 'Mars',
  manaCost: 8,
  basePower: 40,
  targets: 'all-enemies',
  unlockLevel: 2,
  description: 'Spread wildfire across all foes, burning them.',
  statusEffect: { type: 'burn', duration: 2, chance: 0.6 },
});

export const FORGE_EMBER_RAGE = makeAbility({
  id: 'forge-ember-rage',
  name: 'Ember Rage',
  type: 'buff',
  element: 'Mars',
  manaCost: 5,
  basePower: 0,
  targets: 'self',
  unlockLevel: 2,
  description: 'Enter burning rage, boosting attack at cost of defense.',
  buffEffect: { atk: 8, def: -3 },
  duration: 3,
});

export const FORGE_FIRE_WEAKNESS = makeAbility({
  id: 'forge-fire-weakness',
  name: 'Fire Weakness',
  type: 'debuff',
  element: 'Mars',
  manaCost: 6,
  basePower: 0,
  targets: 'single-enemy',
  unlockLevel: 2,
  description: 'Make foe vulnerable to fire damage.',
  elementalWeakness: { Mars: 0.5 }, // Take 50% more Mars damage
  duration: 3,
});

export const FORGE_FLAME_REGENERATION = makeAbility({
  id: 'forge-flame-regeneration',
  name: 'Flame Regeneration',
  type: 'healing',
  element: 'Mars',
  manaCost: 6,
  basePower: 25,
  targets: 'party',
  unlockLevel: 3,
  description: 'Warm all allies with healing flames.',
  healOverTime: { amount: 10, duration: 3 },
});

export const FORGE_EXPLOSION = makeAbility({
  id: 'forge-explosion',
  name: 'Explosion',
  type: 'psynergy',
  element: 'Mars',
  manaCost: 10,
  basePower: 65,
  targets: 'single-enemy',
  unlockLevel: 3,
  description: 'Massive explosion dealing splash damage.',
  splashDamagePercent: 0.4,
});

export const FORGE_BURNING_SPEED = makeAbility({
  id: 'forge-burning-speed',
  name: 'Burning Speed',
  type: 'buff',
  element: 'Mars',
  manaCost: 5,
  basePower: 0,
  targets: 'party',
  unlockLevel: 3,
  description: 'Ignite allies\' speed with fire.',
  buffEffect: { spd: 5 },
  duration: 3,
});

export const FORGE_MELT_ARMOR = makeAbility({
  id: 'forge-melt-armor',
  name: 'Melt Armor',
  type: 'debuff',
  element: 'Mars',
  manaCost: 7,
  basePower: 0,
  targets: 'single-enemy',
  unlockLevel: 3,
  description: 'Melt foe\'s armor, reducing defense drastically.',
  debuffEffect: { def: -8 },
  duration: 3,
});

export const FORGE_FIRE_RAIN = makeAbility({
  id: 'forge-fire-rain',
  name: 'Fire Rain',
  type: 'psynergy',
  element: 'Mars',
  manaCost: 12,
  basePower: 45,
  targets: 'all-enemies',
  unlockLevel: 4,
  description: 'Rain fire on all foes multiple times.',
  hitCount: 2,
});

export const FORGE_PHOENIX_GUARD = makeAbility({
  id: 'forge-phoenix-guard',
  name: 'Phoenix Guard',
  type: 'buff',
  element: 'Mars',
  manaCost: 10,
  basePower: 0,
  targets: 'party',
  unlockLevel: 4,
  description: 'If ally falls, auto-revive with 30% HP.',
  autoRevive: { hpPercent: 0.3 },
  duration: 3,
});

export const FORGE_INFERNO_BLAST = makeAbility({
  id: 'forge-inferno-blast',
  name: 'Inferno Blast',
  type: 'psynergy',
  element: 'Mars',
  manaCost: 11,
  basePower: 75,
  targets: 'single-enemy',
  unlockLevel: 4,
  description: 'Concentrated inferno attack with guaranteed burn.',
  statusEffect: { type: 'burn', duration: 3, chance: 1.0 },
});

export const FORGE_FIRE_SIPHON = makeAbility({
  id: 'forge-fire-siphon',
  name: 'Fire Siphon',
  type: 'psynergy',
  element: 'Mars',
  manaCost: 9,
  basePower: 60,
  targets: 'single-enemy',
  unlockLevel: 4,
  description: 'Drain fire from foe, stealing magic power.',
  stealStat: { stat: 'mag', amount: 4, duration: 3 },
});

export const FORGE_COMBUSTION = makeAbility({
  id: 'forge-combustion',
  name: 'Combustion',
  type: 'psynergy',
  element: 'Mars',
  manaCost: 13,
  basePower: 80,
  targets: 'all-enemies',
  unlockLevel: 5,
  description: 'Ignite all foes in spontaneous combustion.',
});

// ============================================================================
// CORONA (Mars T2) - 15 New Abilities
// ============================================================================

export const CORONA_SOLAR_FLARE = makeAbility({
  id: 'corona-solar-flare',
  name: 'Solar Flare',
  type: 'psynergy',
  element: 'Mars',
  manaCost: 9,
  basePower: 50,
  targets: 'all-enemies',
  unlockLevel: 2,
  description: 'Blinding solar flare hitting all foes.',
  statusEffect: { type: 'blind', duration: 2, chance: 0.5 },
});

export const CORONA_HEAT_SHIELD = makeAbility({
  id: 'corona-heat-shield',
  name: 'Heat Shield',
  type: 'buff',
  element: 'Mars',
  manaCost: 7,
  basePower: 0,
  targets: 'party',
  unlockLevel: 2,
  description: 'Shield party from fire damage.',
  elementalResistance: { Mars: 0.4 },
  duration: 3,
});

export const CORONA_MAGMA_DRAIN = makeAbility({
  id: 'corona-magma-drain',
  name: 'Magma Drain',
  type: 'psynergy',
  element: 'Mars',
  manaCost: 10,
  basePower: 75,
  targets: 'single-enemy',
  unlockLevel: 3,
  description: 'Drain foe through molten earth.',
  drainPercentage: 0.6,
});

export const CORONA_FLAME_VORTEX = makeAbility({
  id: 'corona-flame-vortex',
  name: 'Flame Vortex',
  type: 'psynergy',
  element: 'Mars',
  manaCost: 11,
  basePower: 55,
  targets: 'all-enemies',
  unlockLevel: 3,
  description: 'Swirling vortex of flames pulling in foes.',
  debuffEffect: { spd: -4 },
  duration: 2,
});

export const CORONA_BURNING_SOUL = makeAbility({
  id: 'corona-burning-soul',
  name: 'Burning Soul',
  type: 'buff',
  element: 'Mars',
  manaCost: 9,
  basePower: 0,
  targets: 'self',
  unlockLevel: 3,
  description: 'If you fall, revive with 50% HP.',
  autoRevive: { hpPercent: 0.5 },
  duration: 3,
});

export const CORONA_SCORCH_EARTH = makeAbility({
  id: 'corona-scorch-earth',
  name: 'Scorch Earth',
  type: 'psynergy',
  element: 'Mars',
  manaCost: 13,
  basePower: 50,
  targets: 'all-enemies',
  unlockLevel: 3,
  description: 'Scorch all foes with intense heat.',
  statusEffect: { type: 'burn', duration: 3, chance: 0.8 },
});

export const CORONA_SOLAR_HEAL = makeAbility({
  id: 'corona-solar-heal',
  name: 'Solar Heal',
  type: 'healing',
  element: 'Mars',
  manaCost: 8,
  basePower: 55,
  targets: 'party',
  unlockLevel: 3,
  description: 'Bathe allies in healing solar energy.',
});

export const CORONA_FIRE_NOVA = makeAbility({
  id: 'corona-fire-nova',
  name: 'Fire Nova',
  type: 'psynergy',
  element: 'Mars',
  manaCost: 15,
  basePower: 70,
  targets: 'all-enemies',
  unlockLevel: 4,
  description: 'Massive fire explosion from center.',
});

export const CORONA_BLAZING_AURA = makeAbility({
  id: 'corona-blazing-aura',
  name: 'Blazing Aura',
  type: 'buff',
  element: 'Mars',
  manaCost: 10,
  basePower: 0,
  targets: 'party',
  unlockLevel: 4,
  description: 'Ignite party\'s offensive power.',
  buffEffect: { atk: 6, mag: 6 },
  duration: 3,
});

export const CORONA_ASH_CLOUD = makeAbility({
  id: 'corona-ash-cloud',
  name: 'Ash Cloud',
  type: 'debuff',
  element: 'Mars',
  manaCost: 8,
  basePower: 0,
  targets: 'all-enemies',
  unlockLevel: 4,
  description: 'Blind all foes with ash.',
  statusEffect: { type: 'blind', duration: 3, chance: 0.7 },
});

export const CORONA_PYROCLASM = makeAbility({
  id: 'corona-pyroclasm',
  name: 'Pyroclasm',
  type: 'psynergy',
  element: 'Mars',
  manaCost: 14,
  basePower: 50,
  targets: 'all-enemies',
  unlockLevel: 4,
  description: 'Multiple volcanic eruptions hitting all foes.',
  hitCount: 2,
});

export const CORONA_PHOENIX_RISE = makeAbility({
  id: 'corona-phoenix-rise',
  name: 'Phoenix Rise',
  type: 'healing',
  element: 'Mars',
  manaCost: 15,
  basePower: 999,
  targets: 'single-ally',
  unlockLevel: 5,
  description: 'Revive fallen ally with buff.',
  revive: true,
  reviveHPPercent: 0.5,
  buffEffect: { atk: 5, def: 5 },
  duration: 3,
});

export const CORONA_INFERNO_SHIELD = makeAbility({
  id: 'corona-inferno-shield',
  name: 'Inferno Shield',
  type: 'buff',
  element: 'Mars',
  manaCost: 12,
  basePower: 0,
  targets: 'self',
  unlockLevel: 5,
  description: 'Immune to fire, counter with flames.',
  elementalResistance: { Mars: 1.0 },
  counterDamage: 25,
  duration: 3,
});

export const CORONA_SOLAR_SIPHON = makeAbility({
  id: 'corona-solar-siphon',
  name: 'Solar Siphon',
  type: 'psynergy',
  element: 'Mars',
  manaCost: 11,
  basePower: 70,
  targets: 'single-enemy',
  unlockLevel: 5,
  description: 'Drain foe, stealing all stats.',
  stealStat: { stat: 'atk', amount: 3, duration: 3 },
  debuffEffect: { def: -3, spd: -3 },
  duration: 3,
});

export const CORONA_SUPERNOVA = makeAbility({
  id: 'corona-supernova',
  name: 'Supernova',
  type: 'psynergy',
  element: 'Mars',
  manaCost: 18,
  basePower: 90,
  targets: 'all-enemies',
  unlockLevel: 6,
  description: 'Ultimate star explosion.',
});

// ============================================================================
// FURY (Mars T3) - 15 New Abilities
// ============================================================================

export const FURY_APOCALYPSE_FIRE = makeAbility({
  id: 'fury-apocalypse-fire',
  name: 'Apocalypse Fire',
  type: 'psynergy',
  element: 'Mars',
  manaCost: 20,
  basePower: 85,
  targets: 'all-enemies',
  unlockLevel: 5,
  description: 'Apocalyptic flames consuming all.',
  statusEffect: { type: 'burn', duration: 4, chance: 0.9 },
});

export const FURY_FLAME_ASCENSION = makeAbility({
  id: 'fury-flame-ascension',
  name: 'Flame Ascension',
  type: 'buff',
  element: 'Mars',
  manaCost: 15,
  basePower: 0,
  targets: 'party',
  unlockLevel: 5,
  description: 'Party ascends in flames, boosting offense and fire immunity.',
  buffEffect: { atk: 8, mag: 8 },
  elementalResistance: { Mars: 1.0 },
  duration: 3,
});

export const FURY_METEOR_STORM = makeAbility({
  id: 'fury-meteor-storm',
  name: 'Meteor Storm',
  type: 'psynergy',
  element: 'Mars',
  manaCost: 22,
  basePower: 65,
  targets: 'all-enemies',
  unlockLevel: 6,
  description: 'Rain meteors on all foes.',
  hitCount: 3,
});

export const FURY_BURNING_JUDGMENT = makeAbility({
  id: 'fury-burning-judgment',
  name: 'Burning Judgment',
  type: 'psynergy',
  element: 'Mars',
  manaCost: 17,
  basePower: 100,
  targets: 'single-enemy',
  unlockLevel: 6,
  description: 'Judge foe with fire, ignoring defense.',
  ignoreDefensePercent: 0.5,
  statusEffect: { type: 'burn', duration: 3, chance: 1.0 },
});

export const FURY_PHOENIX_REBIRTH = makeAbility({
  id: 'fury-phoenix-rebirth',
  name: 'Phoenix Rebirth',
  type: 'healing',
  element: 'Mars',
  manaCost: 25,
  basePower: 999,
  targets: 'party',
  unlockLevel: 6,
  description: 'Revive entire fallen party.',
  revive: true,
  reviveHPPercent: 0.4,
});

export const FURY_HELLFIRE = makeAbility({
  id: 'fury-hellfire',
  name: 'Hellfire',
  type: 'psynergy',
  element: 'Mars',
  manaCost: 20,
  basePower: 50,
  targets: 'all-enemies',
  unlockLevel: 7,
  description: 'Continuous hellfire damage over time.',
  statusEffect: { type: 'burn', duration: 5, chance: 1.0 },
});

export const FURY_SOLAR_ECLIPSE = makeAbility({
  id: 'fury-solar-eclipse',
  name: 'Solar Eclipse',
  type: 'debuff',
  element: 'Mars',
  manaCost: 14,
  basePower: 0,
  targets: 'all-enemies',
  unlockLevel: 7,
  description: 'Eclipse blinds and weakens all foes.',
  statusEffect: { type: 'blind', duration: 3, chance: 1.0 },
  debuffEffect: { atk: -6, mag: -6 },
  duration: 3,
});

export const FURY_MAGMA_ARMOR = makeAbility({
  id: 'fury-magma-armor',
  name: 'Magma Armor',
  type: 'buff',
  element: 'Mars',
  manaCost: 16,
  basePower: 0,
  targets: 'party',
  unlockLevel: 7,
  description: 'Party immune to physical attacks, counter with fire.',
  physicalImmunity: true,
  counterDamage: 30,
  duration: 2,
});

export const FURY_DRAIN_INFERNO = makeAbility({
  id: 'fury-drain-inferno',
  name: 'Drain Inferno',
  type: 'psynergy',
  element: 'Mars',
  manaCost: 18,
  basePower: 75,
  targets: 'all-enemies',
  unlockLevel: 8,
  description: 'Drain all foes through inferno.',
  drainPercentage: 0.5,
});

export const FURY_FLAME_EMPEROR = makeAbility({
  id: 'fury-flame-emperor',
  name: 'Flame Emperor',
  type: 'buff',
  element: 'Mars',
  manaCost: 18,
  basePower: 0,
  targets: 'self',
  unlockLevel: 8,
  description: 'Become fire emperor with massive stat boost.',
  buffEffect: { atk: 12, def: 8, mag: 12, spd: 8 },
  counterDamage: 25,
  duration: 4,
});

export const FURY_PYROCLASTIC_DESTRUCTION = makeAbility({
  id: 'fury-pyroclastic-destruction',
  name: 'Pyroclastic Destruction',
  type: 'psynergy',
  element: 'Mars',
  manaCost: 24,
  basePower: 130,
  targets: 'single-enemy',
  unlockLevel: 9,
  description: 'Ultimate single-target fire devastation.',
});

export const FURY_ETERNAL_FLAME = makeAbility({
  id: 'fury-eternal-flame',
  name: 'Eternal Flame',
  type: 'buff',
  element: 'Mars',
  manaCost: 22,
  basePower: 0,
  targets: 'party',
  unlockLevel: 9,
  description: 'Party cannot die for 2 turns, healing over time.',
  invulnerable: true,
  healOverTime: { amount: 20, duration: 2 },
  duration: 2,
});

export const FURY_CINDER_STORM = makeAbility({
  id: 'fury-cinder-storm',
  name: 'Cinder Storm',
  type: 'psynergy',
  element: 'Mars',
  manaCost: 23,
  basePower: 60,
  targets: 'all-enemies',
  unlockLevel: 10,
  description: 'Storm of cinders hitting multiple times.',
  hitCount: 4,
  statusEffect: { type: 'burn', duration: 3, chance: 0.8 },
});

export const FURY_MOLTEN_CORE = makeAbility({
  id: 'fury-molten-core',
  name: 'Molten Core',
  type: 'buff',
  element: 'Mars',
  manaCost: 20,
  basePower: 0,
  targets: 'party',
  unlockLevel: 10,
  description: 'Party gains molten core defense.',
  buffEffect: { def: 12 },
  counterDamageAOE: 35,
  duration: 3,
});

export const FURY_ARMAGEDDON = makeAbility({
  id: 'fury-armageddon',
  name: 'Armageddon',
  type: 'psynergy',
  element: 'Mars',
  manaCost: 30,
  basePower: 150,
  targets: 'all-enemies',
  unlockLevel: 10,
  description: 'End all with ultimate fire.',
});

// ============================================================================
// FIZZ (Mercury T1) - 15 New Abilities
// ============================================================================

export const FIZZ_FREEZE_SOLID = makeAbility({
  id: 'fizz-freeze-solid',
  name: 'Freeze Solid',
  type: 'psynergy',
  element: 'Mercury',
  manaCost: 5,
  basePower: 35,
  targets: 'single-enemy',
  unlockLevel: 1,
  description: 'Freeze foe solid, chance to stun.',
  statusEffect: { type: 'freeze', duration: 2, chance: 0.4 },
});

export const FIZZ_ICE_SHIELD = makeAbility({
  id: 'fizz-ice-shield',
  name: 'Ice Shield',
  type: 'buff',
  element: 'Mercury',
  manaCost: 5,
  basePower: 0,
  targets: 'party',
  unlockLevel: 1,
  description: 'Shield party from ice damage.',
  elementalResistance: { Mercury: 0.4 },
  duration: 3,
});

export const FIZZ_FROST_DRAIN = makeAbility({
  id: 'fizz-frost-drain',
  name: 'Frost Drain',
  type: 'psynergy',
  element: 'Mercury',
  manaCost: 6,
  basePower: 50,
  targets: 'single-enemy',
  unlockLevel: 1,
  description: 'Drain HP through frost.',
  drainPercentage: 0.5,
});

export const FIZZ_GLACIAL_WAVE = makeAbility({
  id: 'fizz-glacial-wave',
  name: 'Glacial Wave',
  type: 'psynergy',
  element: 'Mercury',
  manaCost: 7,
  basePower: 40,
  targets: 'all-enemies',
  unlockLevel: 2,
  description: 'Freeze all foes with glacial wave.',
  debuffEffect: { spd: -4 },
  duration: 2,
});

export const FIZZ_CHILL_TOUCH = makeAbility({
  id: 'fizz-chill-touch',
  name: 'Chill Touch',
  type: 'physical',
  element: 'Mercury',
  manaCost: 5,
  basePower: 40,
  targets: 'single-enemy',
  unlockLevel: 2,
  description: 'Freeze and weaken foe.',
  statusEffect: { type: 'freeze', duration: 1, chance: 0.5 },
  debuffEffect: { atk: -4 },
  duration: 2,
});

export const FIZZ_MIST_HEAL = makeAbility({
  id: 'fizz-mist-heal',
  name: 'Mist Heal',
  type: 'healing',
  element: 'Mercury',
  manaCost: 6,
  basePower: 45,
  targets: 'party',
  unlockLevel: 2,
  description: 'Heal all allies with mist.',
});

export const FIZZ_ICE_SPIKES = makeAbility({
  id: 'fizz-ice-spikes',
  name: 'Ice Spikes',
  type: 'buff',
  element: 'Mercury',
  manaCost: 5,
  basePower: 0,
  targets: 'self',
  unlockLevel: 3,
  description: 'Surround with ice spikes that damage attackers.',
  counterDamage: 15,
  duration: 3,
});

export const FIZZ_FROZEN_PRISON = makeAbility({
  id: 'fizz-frozen-prison',
  name: 'Frozen Prison',
  type: 'debuff',
  element: 'Mercury',
  manaCost: 6,
  basePower: 0,
  targets: 'single-enemy',
  unlockLevel: 3,
  description: 'Trap foe in ice prison.',
  statusEffect: { type: 'freeze', duration: 2, chance: 0.7 },
});

export const FIZZ_FROST_BITE = makeAbility({
  id: 'fizz-frost-bite',
  name: 'Frost Bite',
  type: 'psynergy',
  element: 'Mercury',
  manaCost: 8,
  basePower: 35,
  targets: 'single-enemy',
  unlockLevel: 3,
  description: 'Multiple frost bites freezing foe.',
  hitCount: 2,
  statusEffect: { type: 'freeze', duration: 1, chance: 0.5 },
});

export const FIZZ_AQUA_BLESSING = makeAbility({
  id: 'fizz-aqua-blessing',
  name: 'Aqua Blessing',
  type: 'buff',
  element: 'Mercury',
  manaCost: 6,
  basePower: 0,
  targets: 'party',
  unlockLevel: 3,
  description: 'Bless party with water, boosting defense and cleansing.',
  buffEffect: { def: 4 },
  removeStatusEffects: true,
  duration: 3,
});

export const FIZZ_ICE_RAIN = makeAbility({
  id: 'fizz-ice-rain',
  name: 'Ice Rain',
  type: 'psynergy',
  element: 'Mercury',
  manaCost: 9,
  basePower: 35,
  targets: 'all-enemies',
  unlockLevel: 4,
  description: 'Rain ice shards on all foes.',
  statusEffect: { type: 'freeze', duration: 1, chance: 0.3 },
});

export const FIZZ_FROZEN_ARMOR = makeAbility({
  id: 'fizz-frozen-armor',
  name: 'Frozen Armor',
  type: 'buff',
  element: 'Mercury',
  manaCost: 7,
  basePower: 0,
  targets: 'single-ally',
  unlockLevel: 4,
  description: 'Encase ally in ice armor.',
  buffEffect: { def: 12 },
  counterDamage: 18,
  duration: 3,
});

export const FIZZ_GLACIAL_SIPHON = makeAbility({
  id: 'fizz-glacial-siphon',
  name: 'Glacial Siphon',
  type: 'psynergy',
  element: 'Mercury',
  manaCost: 8,
  basePower: 60,
  targets: 'single-enemy',
  unlockLevel: 4,
  description: 'Drain foe, stealing speed.',
  stealStat: { stat: 'spd', amount: 4, duration: 3 },
});

export const FIZZ_BLIZZARD = makeAbility({
  id: 'fizz-blizzard',
  name: 'Blizzard',
  type: 'psynergy',
  element: 'Mercury',
  manaCost: 11,
  basePower: 60,
  targets: 'all-enemies',
  unlockLevel: 4,
  description: 'Massive blizzard freezing all.',
});

export const FIZZ_ABSOLUTE_ZERO = makeAbility({
  id: 'fizz-absolute-zero',
  name: 'Absolute Zero',
  type: 'debuff',
  element: 'Mercury',
  manaCost: 10,
  basePower: 0,
  targets: 'single-enemy',
  unlockLevel: 5,
  description: 'Drop temperature to absolute zero.',
  statusEffect: { type: 'freeze', duration: 3, chance: 0.9 },
});

// ============================================================================
// TONIC (Mercury T2) - 15 New Abilities
// ============================================================================

export const TONIC_HEALING_MIST = makeAbility({
  id: 'tonic-healing-mist',
  name: 'Healing Mist',
  type: 'healing',
  element: 'Mercury',
  manaCost: 8,
  basePower: 50,
  targets: 'party',
  unlockLevel: 2,
  description: 'Heal party over time with mist.',
  healOverTime: { amount: 12, duration: 3 },
});

export const TONIC_FROST_NOVA = makeAbility({
  id: 'tonic-frost-nova',
  name: 'Frost Nova',
  type: 'psynergy',
  element: 'Mercury',
  manaCost: 11,
  basePower: 55,
  targets: 'all-enemies',
  unlockLevel: 2,
  description: 'Frost explosion freezing all.',
  statusEffect: { type: 'freeze', duration: 2, chance: 0.6 },
});

export const TONIC_ICE_BARRIER = makeAbility({
  id: 'tonic-ice-barrier',
  name: 'Ice Barrier',
  type: 'buff',
  element: 'Mercury',
  manaCost: 8,
  basePower: 0,
  targets: 'party',
  unlockLevel: 3,
  description: 'Barrier reduces incoming damage.',
  damageReduction: 0.3,
  duration: 3,
});

export const TONIC_TIDAL_DRAIN = makeAbility({
  id: 'tonic-tidal-drain',
  name: 'Tidal Drain',
  type: 'psynergy',
  element: 'Mercury',
  manaCost: 10,
  basePower: 75,
  targets: 'single-enemy',
  unlockLevel: 3,
  description: 'Drain massive HP from foe.',
  drainPercentage: 0.6,
});

export const TONIC_FROZEN_HEART = makeAbility({
  id: 'tonic-frozen-heart',
  name: 'Frozen Heart',
  type: 'buff',
  element: 'Mercury',
  manaCost: 9,
  basePower: 0,
  targets: 'self',
  unlockLevel: 3,
  description: 'Become immune to status effects.',
  immunityStatus: ['burn', 'freeze', 'stun', 'paralyze', 'blind', 'poison'],
  duration: 3,
});

export const TONIC_PURIFYING_WATER = makeAbility({
  id: 'tonic-purifying-water',
  name: 'Purifying Water',
  type: 'healing',
  element: 'Mercury',
  manaCost: 7,
  basePower: 0,
  targets: 'party',
  unlockLevel: 3,
  description: 'Cleanse all debuffs from party.',
  removeStatusEffects: true,
});

export const TONIC_ICE_MIRROR = makeAbility({
  id: 'tonic-ice-mirror',
  name: 'Ice Mirror',
  type: 'buff',
  element: 'Mercury',
  manaCost: 8,
  basePower: 0,
  targets: 'self',
  unlockLevel: 3,
  description: 'Reflect next attack back.',
  shieldCharges: 1,
  counterDamage: 50,
  duration: 2,
});

export const TONIC_TSUNAMI = makeAbility({
  id: 'tonic-tsunami',
  name: 'Tsunami',
  type: 'psynergy',
  element: 'Mercury',
  manaCost: 14,
  basePower: 75,
  targets: 'all-enemies',
  unlockLevel: 4,
  description: 'Massive tidal wave crashing on foes.',
});

export const TONIC_AQUA_VITALITY = makeAbility({
  id: 'tonic-aqua-vitality',
  name: 'Aqua Vitality',
  type: 'buff',
  element: 'Mercury',
  manaCost: 10,
  basePower: 0,
  targets: 'party',
  unlockLevel: 4,
  description: 'Boost party HP and regeneration.',
  buffEffect: { hp: 40 },
  healOverTime: { amount: 15, duration: 3 },
  duration: 3,
});

export const TONIC_FREEZE_LOCK = makeAbility({
  id: 'tonic-freeze-lock',
  name: 'Freeze Lock',
  type: 'debuff',
  element: 'Mercury',
  manaCost: 9,
  basePower: 0,
  targets: 'single-enemy',
  unlockLevel: 4,
  description: 'Lock foe in guaranteed freeze.',
  statusEffect: { type: 'freeze', duration: 2, chance: 1.0 },
});

export const TONIC_GLACIER_SHIELD = makeAbility({
  id: 'tonic-glacier-shield',
  name: 'Glacier Shield',
  type: 'buff',
  element: 'Mercury',
  manaCost: 11,
  basePower: 0,
  targets: 'single-ally',
  unlockLevel: 4,
  description: 'Massive defense and ice immunity.',
  buffEffect: { def: 15 },
  elementalResistance: { Mercury: 1.0 },
  duration: 3,
});

export const TONIC_FROST_SIPHON = makeAbility({
  id: 'tonic-frost-siphon',
  name: 'Frost Siphon',
  type: 'psynergy',
  element: 'Mercury',
  manaCost: 10,
  basePower: 70,
  targets: 'single-enemy',
  unlockLevel: 5,
  description: 'Drain and steal magic.',
  stealStat: { stat: 'mag', amount: 5, duration: 3 },
});

export const TONIC_TIDAL_WAVE = makeAbility({
  id: 'tonic-tidal-wave',
  name: 'Tidal Wave',
  type: 'psynergy',
  element: 'Mercury',
  manaCost: 13,
  basePower: 50,
  targets: 'all-enemies',
  unlockLevel: 5,
  description: 'Multi-hit tidal wave.',
  hitCount: 2,
});

export const TONIC_MERCURY_BLESSING = makeAbility({
  id: 'tonic-mercury-blessing',
  name: 'Mercury Blessing',
  type: 'buff',
  element: 'Mercury',
  manaCost: 12,
  basePower: 0,
  targets: 'party',
  unlockLevel: 5,
  description: 'Cleanse and grant immunity.',
  removeStatusEffects: true,
  immunityStatus: ['burn', 'freeze', 'poison'],
  duration: 3,
});

export const TONIC_CRYSTAL_HEAL = makeAbility({
  id: 'tonic-crystal-heal',
  name: 'Crystal Heal',
  type: 'healing',
  element: 'Mercury',
  manaCost: 10,
  basePower: 999,
  targets: 'single-ally',
  unlockLevel: 5,
  description: 'Fully heal single ally.',
});

// ============================================================================
// CRYSTAL (Mercury T3) - 15 New Abilities
// ============================================================================

export const CRYSTAL_DIAMOND_DUST = makeAbility({
  id: 'crystal-diamond-dust',
  name: 'Diamond Dust',
  type: 'psynergy',
  element: 'Mercury',
  manaCost: 20,
  basePower: 85,
  targets: 'all-enemies',
  unlockLevel: 5,
  description: 'Ultimate ice attack freezing all.',
  statusEffect: { type: 'freeze', duration: 3, chance: 0.8 },
});

export const CRYSTAL_CRYSTAL_FORTRESS = makeAbility({
  id: 'crystal-crystal-fortress',
  name: 'Crystal Fortress',
  type: 'buff',
  element: 'Mercury',
  manaCost: 18,
  basePower: 0,
  targets: 'party',
  unlockLevel: 5,
  description: 'Party immune to all status and debuffs.',
  immunityAll: true,
  duration: 3,
});

export const CRYSTAL_ABSOLUTE_FREEZE = makeAbility({
  id: 'crystal-absolute-freeze',
  name: 'Absolute Freeze',
  type: 'psynergy',
  element: 'Mercury',
  manaCost: 17,
  basePower: 105,
  targets: 'single-enemy',
  unlockLevel: 6,
  description: 'Freeze foe absolutely.',
  statusEffect: { type: 'freeze', duration: 3, chance: 1.0 },
});

export const CRYSTAL_MERCURY_ASCENSION = makeAbility({
  id: 'crystal-mercury-ascension',
  name: 'Mercury Ascension',
  type: 'buff',
  element: 'Mercury',
  manaCost: 16,
  basePower: 0,
  targets: 'party',
  unlockLevel: 6,
  description: 'Party ascends with magic and defense.',
  buffEffect: { mag: 10, def: 10 },
  removeStatusEffects: true,
  duration: 4,
});

export const CRYSTAL_TIDAL_FORCE = makeAbility({
  id: 'crystal-tidal-force',
  name: 'Tidal Force',
  type: 'psynergy',
  element: 'Mercury',
  manaCost: 18,
  basePower: 110,
  targets: 'single-enemy',
  unlockLevel: 6,
  description: 'Ultimate water force ignoring defense.',
  ignoreDefensePercent: 0.5,
});

export const CRYSTAL_FROST_APOCALYPSE = makeAbility({
  id: 'crystal-frost-apocalypse',
  name: 'Frost Apocalypse',
  type: 'psynergy',
  element: 'Mercury',
  manaCost: 22,
  basePower: 80,
  targets: 'all-enemies',
  unlockLevel: 7,
  description: 'Apocalyptic frost freezing all.',
  statusEffect: { type: 'freeze', duration: 3, chance: 1.0 },
});

export const CRYSTAL_HEALING_DELUGE = makeAbility({
  id: 'crystal-healing-deluge',
  name: 'Healing Deluge',
  type: 'healing',
  element: 'Mercury',
  manaCost: 20,
  basePower: 999,
  targets: 'party',
  unlockLevel: 7,
  description: 'Full party heal with regen.',
  healOverTime: { amount: 25, duration: 3 },
});

export const CRYSTAL_ICE_AGE = makeAbility({
  id: 'crystal-ice-age',
  name: 'Ice Age',
  type: 'debuff',
  element: 'Mercury',
  manaCost: 16,
  basePower: 0,
  targets: 'all-enemies',
  unlockLevel: 7,
  description: 'Freeze and debuff all foes.',
  statusEffect: { type: 'freeze', duration: 2, chance: 0.7 },
  debuffEffect: { atk: -8, spd: -8 },
  duration: 3,
});

export const CRYSTAL_GLACIER_SLAM = makeAbility({
  id: 'crystal-glacier-slam',
  name: 'Glacier Slam',
  type: 'psynergy',
  element: 'Mercury',
  manaCost: 16,
  basePower: 95,
  targets: 'single-enemy',
  unlockLevel: 8,
  description: 'Slam foe with glacier, stunning them.',
  statusEffect: { type: 'stun', duration: 2, chance: 0.8 },
});

export const CRYSTAL_CRYSTAL_DRAIN = makeAbility({
  id: 'crystal-crystal-drain',
  name: 'Crystal Drain',
  type: 'psynergy',
  element: 'Mercury',
  manaCost: 18,
  basePower: 90,
  targets: 'single-enemy',
  unlockLevel: 8,
  description: 'Drain and steal all stats.',
  drainPercentage: 0.75,
  stealStat: { stat: 'atk', amount: 5, duration: 3 },
  debuffEffect: { def: -5, mag: -5 },
  duration: 3,
});

export const CRYSTAL_FROZEN_TIME = makeAbility({
  id: 'crystal-frozen-time',
  name: 'Frozen Time',
  type: 'debuff',
  element: 'Mercury',
  manaCost: 20,
  basePower: 0,
  targets: 'all-enemies',
  unlockLevel: 9,
  description: 'Stop all enemies for 1 turn.',
  statusEffect: { type: 'stun', duration: 1, chance: 1.0 },
});

export const CRYSTAL_MERCURY_SHIELD = makeAbility({
  id: 'crystal-mercury-shield',
  name: 'Mercury Shield',
  type: 'buff',
  element: 'Mercury',
  manaCost: 22,
  basePower: 0,
  targets: 'party',
  unlockLevel: 9,
  description: 'Party invulnerable for 1 turn.',
  invulnerable: true,
  duration: 1,
});

export const CRYSTAL_TIDAL_RESURRECTION = makeAbility({
  id: 'crystal-tidal-resurrection',
  name: 'Tidal Resurrection',
  type: 'healing',
  element: 'Mercury',
  manaCost: 24,
  basePower: 999,
  targets: 'party',
  unlockLevel: 10,
  description: 'Revive all at 50% HP.',
  revive: true,
  reviveHPPercent: 0.5,
});

export const CRYSTAL_PERMAFROST = makeAbility({
  id: 'crystal-permafrost',
  name: 'Permafrost',
  type: 'debuff',
  element: 'Mercury',
  manaCost: 19,
  basePower: 0,
  targets: 'single-enemy',
  unlockLevel: 10,
  description: 'Permanent freeze attempt.',
  statusEffect: { type: 'freeze', duration: 5, chance: 0.9 },
});

export const CRYSTAL_NIFLHEIM = makeAbility({
  id: 'crystal-niflheim',
  name: 'Niflheim',
  type: 'psynergy',
  element: 'Mercury',
  manaCost: 30,
  basePower: 150,
  targets: 'all-enemies',
  unlockLevel: 10,
  description: 'Ultimate ice realm destruction.',
});

// ============================================================================
// BREEZE (Jupiter T1) - 15 New Abilities
// ============================================================================

export const BREEZE_WIND_SLASH = makeAbility({
  id: 'breeze-wind-slash',
  name: 'Wind Slash',
  type: 'physical',
  element: 'Jupiter',
  manaCost: 4,
  basePower: 35,
  targets: 'single-enemy',
  unlockLevel: 1,
  description: 'Quick wind slash hitting multiple times.',
  hitCount: 2,
});

export const BREEZE_GALE_SHIELD = makeAbility({
  id: 'breeze-gale-shield',
  name: 'Gale Shield',
  type: 'buff',
  element: 'Jupiter',
  manaCost: 5,
  basePower: 0,
  targets: 'party',
  unlockLevel: 1,
  description: 'Wind shield boosting evasion.',
  elementalResistance: { Jupiter: 0.4 },
  duration: 3,
});

export const BREEZE_STORM_DRAIN = makeAbility({
  id: 'breeze-storm-drain',
  name: 'Storm Drain',
  type: 'psynergy',
  element: 'Jupiter',
  manaCost: 6,
  basePower: 50,
  targets: 'single-enemy',
  unlockLevel: 1,
  description: 'Drain through storm winds.',
  drainPercentage: 0.5,
});

export const BREEZE_THUNDER_CLAP = makeAbility({
  id: 'breeze-thunder-clap',
  name: 'Thunder Clap',
  type: 'psynergy',
  element: 'Jupiter',
  manaCost: 7,
  basePower: 40,
  targets: 'all-enemies',
  unlockLevel: 2,
  description: 'Thunder clap paralyzing foes.',
  statusEffect: { type: 'paralyze', duration: 2, chance: 0.4 },
});

export const BREEZE_WIND_BARRIER = makeAbility({
  id: 'breeze-wind-barrier',
  name: 'Wind Barrier',
  type: 'buff',
  element: 'Jupiter',
  manaCost: 5,
  basePower: 0,
  targets: 'party',
  unlockLevel: 2,
  description: 'Boost party evasion with wind.',
  buffEffect: { spd: 4 },
  duration: 3,
});

export const BREEZE_SHOCK_TOUCH = makeAbility({
  id: 'breeze-shock-touch',
  name: 'Shock Touch',
  type: 'physical',
  element: 'Jupiter',
  manaCost: 5,
  basePower: 40,
  targets: 'single-enemy',
  unlockLevel: 2,
  description: 'Shocking touch paralyzing foe.',
  statusEffect: { type: 'paralyze', duration: 1, chance: 0.5 },
  debuffEffect: { spd: -4 },
  duration: 2,
});

export const BREEZE_ZEPHYR_HEAL = makeAbility({
  id: 'breeze-zephyr-heal',
  name: 'Zephyr Heal',
  type: 'healing',
  element: 'Jupiter',
  manaCost: 6,
  basePower: 45,
  targets: 'party',
  unlockLevel: 3,
  description: 'Gentle winds heal and boost speed.',
  buffEffect: { spd: 3 },
  duration: 2,
});

export const BREEZE_LIGHTNING_COUNTER = makeAbility({
  id: 'breeze-lightning-counter',
  name: 'Lightning Counter',
  type: 'buff',
  element: 'Jupiter',
  manaCost: 5,
  basePower: 0,
  targets: 'self',
  unlockLevel: 3,
  description: 'Counter attacks with lightning.',
  counterDamage: 18,
  duration: 3,
});

export const BREEZE_WHIRLWIND = makeAbility({
  id: 'breeze-whirlwind',
  name: 'Whirlwind',
  type: 'psynergy',
  element: 'Jupiter',
  manaCost: 8,
  basePower: 45,
  targets: 'all-enemies',
  unlockLevel: 3,
  description: 'Whirlwind knocking back foes.',
  debuffEffect: { spd: -3 },
  duration: 2,
});

export const BREEZE_CHARGED_AURA = makeAbility({
  id: 'breeze-charged-aura',
  name: 'Charged Aura',
  type: 'buff',
  element: 'Jupiter',
  manaCost: 5,
  basePower: 0,
  targets: 'self',
  unlockLevel: 3,
  description: 'Charge self with lightning power.',
  buffEffect: { atk: 6, spd: 6 },
  duration: 3,
});

export const BREEZE_CHAIN_SHOCK = makeAbility({
  id: 'breeze-chain-shock',
  name: 'Chain Shock',
  type: 'psynergy',
  element: 'Jupiter',
  manaCost: 8,
  basePower: 50,
  targets: 'single-enemy',
  unlockLevel: 4,
  description: 'Chaining lightning with paralyze chance.',
  statusEffect: { type: 'paralyze', duration: 2, chance: 0.6 },
});

export const BREEZE_WIND_WALK = makeAbility({
  id: 'breeze-wind-walk',
  name: 'Wind Walk',
  type: 'buff',
  element: 'Jupiter',
  manaCost: 6,
  basePower: 0,
  targets: 'single-ally',
  unlockLevel: 4,
  description: 'Massive speed boost for ally.',
  buffEffect: { spd: 12 },
  duration: 3,
});

export const BREEZE_THUNDER_SIPHON = makeAbility({
  id: 'breeze-thunder-siphon',
  name: 'Thunder Siphon',
  type: 'psynergy',
  element: 'Jupiter',
  manaCost: 8,
  basePower: 60,
  targets: 'single-enemy',
  unlockLevel: 4,
  description: 'Drain and steal attack.',
  stealStat: { stat: 'atk', amount: 4, duration: 3 },
});

export const BREEZE_TEMPEST = makeAbility({
  id: 'breeze-tempest',
  name: 'Tempest',
  type: 'psynergy',
  element: 'Jupiter',
  manaCost: 10,
  basePower: 60,
  targets: 'all-enemies',
  unlockLevel: 4,
  description: 'Powerful tempest winds.',
});

export const BREEZE_STATIC_FIELD = makeAbility({
  id: 'breeze-static-field',
  name: 'Static Field',
  type: 'debuff',
  element: 'Jupiter',
  manaCost: 7,
  basePower: 0,
  targets: 'all-enemies',
  unlockLevel: 5,
  description: 'Create static field paralyzing foes.',
  statusEffect: { type: 'paralyze', duration: 2, chance: 0.5 },
});

// ============================================================================
// SQUALL (Jupiter T2) - 15 New Abilities
// ============================================================================

export const SQUALL_LIGHTNING_STORM = makeAbility({
  id: 'squall-lightning-storm',
  name: 'Lightning Storm',
  type: 'psynergy',
  element: 'Jupiter',
  manaCost: 12,
  basePower: 45,
  targets: 'all-enemies',
  unlockLevel: 2,
  description: 'Multi-hit lightning storm.',
  hitCount: 2,
});

export const SQUALL_STORM_SHIELD = makeAbility({
  id: 'squall-storm-shield',
  name: 'Storm Shield',
  type: 'buff',
  element: 'Jupiter',
  manaCost: 8,
  basePower: 0,
  targets: 'party',
  unlockLevel: 2,
  description: 'Shield reducing damage and countering.',
  damageReduction: 0.3,
  counterDamage: 15,
  duration: 3,
});

export const SQUALL_VOLT_DRAIN = makeAbility({
  id: 'squall-volt-drain',
  name: 'Volt Drain',
  type: 'psynergy',
  element: 'Jupiter',
  manaCost: 10,
  basePower: 75,
  targets: 'single-enemy',
  unlockLevel: 3,
  description: 'Drain massive voltage.',
  drainPercentage: 0.6,
});

export const SQUALL_HURRICANE = makeAbility({
  id: 'squall-hurricane',
  name: 'Hurricane',
  type: 'psynergy',
  element: 'Jupiter',
  manaCost: 14,
  basePower: 70,
  targets: 'all-enemies',
  unlockLevel: 3,
  description: 'Devastating hurricane winds.',
  debuffEffect: { spd: -5 },
  duration: 2,
});

export const SQUALL_THUNDER_AURA = makeAbility({
  id: 'squall-thunder-aura',
  name: 'Thunder Aura',
  type: 'buff',
  element: 'Jupiter',
  manaCost: 10,
  basePower: 0,
  targets: 'party',
  unlockLevel: 3,
  description: 'Boost party attack and speed.',
  buffEffect: { atk: 6, spd: 6 },
  duration: 3,
});

export const SQUALL_PARALYZE_ALL = makeAbility({
  id: 'squall-paralyze-all',
  name: 'Paralyze All',
  type: 'debuff',
  element: 'Jupiter',
  manaCost: 12,
  basePower: 0,
  targets: 'all-enemies',
  unlockLevel: 4,
  description: 'Attempt to paralyze all foes.',
  statusEffect: { type: 'paralyze', duration: 2, chance: 0.5 },
});

export const SQUALL_GALE_HEAL = makeAbility({
  id: 'squall-gale-heal',
  name: 'Gale Heal',
  type: 'healing',
  element: 'Jupiter',
  manaCost: 9,
  basePower: 60,
  targets: 'party',
  unlockLevel: 4,
  description: 'Heal party and cleanse.',
  removeStatusEffects: true,
});

export const SQUALL_LIGHTNING_NOVA = makeAbility({
  id: 'squall-lightning-nova',
  name: 'Lightning Nova',
  type: 'psynergy',
  element: 'Jupiter',
  manaCost: 15,
  basePower: 75,
  targets: 'all-enemies',
  unlockLevel: 4,
  description: 'Massive lightning explosion.',
});

export const SQUALL_WIND_SUPREMACY = makeAbility({
  id: 'squall-wind-supremacy',
  name: 'Wind Supremacy',
  type: 'buff',
  element: 'Jupiter',
  manaCost: 11,
  basePower: 0,
  targets: 'party',
  unlockLevel: 4,
  description: 'Party gains speed and evasion.',
  buffEffect: { spd: 8 },
  elementalResistance: { Jupiter: 0.5 },
  duration: 3,
});

export const SQUALL_SHOCK_PRISON = makeAbility({
  id: 'squall-shock-prison',
  name: 'Shock Prison',
  type: 'debuff',
  element: 'Jupiter',
  manaCost: 9,
  basePower: 0,
  targets: 'single-enemy',
  unlockLevel: 5,
  description: 'Guaranteed paralyze.',
  statusEffect: { type: 'paralyze', duration: 2, chance: 1.0 },
});

export const SQUALL_CYCLONE = makeAbility({
  id: 'squall-cyclone',
  name: 'Cyclone',
  type: 'psynergy',
  element: 'Jupiter',
  manaCost: 13,
  basePower: 50,
  targets: 'all-enemies',
  unlockLevel: 5,
  description: 'Multi-hit cyclone winds.',
  hitCount: 2,
});

export const SQUALL_VOLT_SIPHON = makeAbility({
  id: 'squall-volt-siphon',
  name: 'Volt Siphon',
  type: 'psynergy',
  element: 'Jupiter',
  manaCost: 11,
  basePower: 70,
  targets: 'single-enemy',
  unlockLevel: 5,
  description: 'Drain and steal speed and attack.',
  stealStat: { stat: 'spd', amount: 5, duration: 3 },
  debuffEffect: { atk: -4 },
  duration: 3,
});

export const SQUALL_THUNDER_CRASH = makeAbility({
  id: 'squall-thunder-crash',
  name: 'Thunder Crash',
  type: 'psynergy',
  element: 'Jupiter',
  manaCost: 12,
  basePower: 85,
  targets: 'single-enemy',
  unlockLevel: 5,
  description: 'Crashing thunder with splash.',
  splashDamagePercent: 0.3,
});

export const SQUALL_STORM_BLESSING = makeAbility({
  id: 'squall-storm-blessing',
  name: 'Storm Blessing',
  type: 'buff',
  element: 'Jupiter',
  manaCost: 11,
  basePower: 0,
  targets: 'party',
  unlockLevel: 5,
  description: 'Bless party with storm power.',
  buffEffect: { atk: 5, spd: 5 },
  healOverTime: { amount: 12, duration: 3 },
  duration: 3,
});

export const SQUALL_MAELSTROM = makeAbility({
  id: 'squall-maelstrom',
  name: 'Maelstrom',
  type: 'psynergy',
  element: 'Jupiter',
  manaCost: 16,
  basePower: 80,
  targets: 'all-enemies',
  unlockLevel: 6,
  description: 'Ultimate wind and lightning combo.',
});

// ============================================================================
// STORM (Jupiter T3) - 15 New Abilities
// ============================================================================

export const STORM_APOCALYPSE_STORM = makeAbility({
  id: 'storm-apocalypse-storm',
  name: 'Apocalypse Storm',
  type: 'psynergy',
  element: 'Jupiter',
  manaCost: 20,
  basePower: 85,
  targets: 'all-enemies',
  unlockLevel: 5,
  description: 'Apocalyptic storm of wind and lightning.',
  statusEffect: { type: 'paralyze', duration: 2, chance: 0.6 },
});

export const STORM_JUPITER_ASCENSION = makeAbility({
  id: 'storm-jupiter-ascension',
  name: 'Jupiter Ascension',
  type: 'buff',
  element: 'Jupiter',
  manaCost: 16,
  basePower: 0,
  targets: 'party',
  unlockLevel: 5,
  description: 'Party ascends with speed and attack.',
  buffEffect: { spd: 10, atk: 10 },
  immunityStatus: ['paralyze', 'stun'],
  duration: 4,
});

export const STORM_MJOLNIR = makeAbility({
  id: 'storm-mjolnir',
  name: 'Mjolnir',
  type: 'psynergy',
  element: 'Jupiter',
  manaCost: 18,
  basePower: 120,
  targets: 'single-enemy',
  unlockLevel: 6,
  description: 'Ultimate lightning hammer strike.',
});

export const STORM_PERFECT_STORM = makeAbility({
  id: 'storm-perfect-storm',
  name: 'Perfect Storm',
  type: 'psynergy',
  element: 'Jupiter',
  manaCost: 22,
  basePower: 60,
  targets: 'all-enemies',
  unlockLevel: 6,
  description: 'Continuous multi-hit storm.',
  hitCount: 3,
});

export const STORM_THUNDER_GOD = makeAbility({
  id: 'storm-thunder-god',
  name: 'Thunder God',
  type: 'buff',
  element: 'Jupiter',
  manaCost: 18,
  basePower: 0,
  targets: 'self',
  unlockLevel: 7,
  description: 'Become thunder god with massive power.',
  buffEffect: { atk: 12, mag: 10, spd: 12 },
  counterDamage: 30,
  duration: 4,
});

export const STORM_TYPHOON = makeAbility({
  id: 'storm-typhoon',
  name: 'Typhoon',
  type: 'psynergy',
  element: 'Jupiter',
  manaCost: 19,
  basePower: 110,
  targets: 'single-enemy',
  unlockLevel: 7,
  description: 'Typhoon force ignoring defense.',
  ignoreDefensePercent: 0.5,
});

export const STORM_VOLT_APOCALYPSE = makeAbility({
  id: 'storm-volt-apocalypse',
  name: 'Volt Apocalypse',
  type: 'psynergy',
  element: 'Jupiter',
  manaCost: 21,
  basePower: 80,
  targets: 'all-enemies',
  unlockLevel: 7,
  description: 'Apocalyptic voltage paralyzing all.',
  statusEffect: { type: 'paralyze', duration: 3, chance: 0.9 },
});

export const STORM_STORM_FORTRESS = makeAbility({
  id: 'storm-storm-fortress',
  name: 'Storm Fortress',
  type: 'buff',
  element: 'Jupiter',
  manaCost: 17,
  basePower: 0,
  targets: 'party',
  unlockLevel: 8,
  description: 'Party gains evasion and reflection.',
  buffEffect: { spd: 10 },
  shieldCharges: 2,
  duration: 3,
});

export const STORM_LIGHTNING_DRAIN = makeAbility({
  id: 'storm-lightning-drain',
  name: 'Lightning Drain',
  type: 'psynergy',
  element: 'Jupiter',
  manaCost: 18,
  basePower: 75,
  targets: 'all-enemies',
  unlockLevel: 8,
  description: 'Drain all foes with lightning.',
  drainPercentage: 0.5,
});

export const STORM_WIND_EMPEROR = makeAbility({
  id: 'storm-wind-emperor',
  name: 'Wind Emperor',
  type: 'buff',
  element: 'Jupiter',
  manaCost: 19,
  basePower: 0,
  targets: 'self',
  unlockLevel: 8,
  description: 'Become wind emperor with all stats.',
  buffEffect: { atk: 10, def: 8, mag: 10, spd: 15 },
  elementalResistance: { Jupiter: 1.0 },
  duration: 4,
});

export const STORM_THUNDER_JUDGMENT = makeAbility({
  id: 'storm-thunder-judgment',
  name: 'Thunder Judgment',
  type: 'psynergy',
  element: 'Jupiter',
  manaCost: 23,
  basePower: 110,
  targets: 'single-enemy',
  unlockLevel: 9,
  description: 'Judge foe with ultimate lightning.',
  ignoreDefensePercent: 1.0,
});

export const STORM_ETERNAL_WIND = makeAbility({
  id: 'storm-eternal-wind',
  name: 'Eternal Wind',
  type: 'buff',
  element: 'Jupiter',
  manaCost: 24,
  basePower: 0,
  targets: 'party',
  unlockLevel: 9,
  description: 'Party invulnerable for 1 turn.',
  invulnerable: true,
  duration: 1,
});

export const STORM_RAGNAROK_STORM = makeAbility({
  id: 'storm-ragnarok-storm',
  name: 'Ragnarok Storm',
  type: 'psynergy',
  element: 'Jupiter',
  manaCost: 25,
  basePower: 90,
  targets: 'all-enemies',
  unlockLevel: 10,
  description: 'Multi-hit ultimate storm.',
  hitCount: 4,
});

export const STORM_RESURRECTION_WIND = makeAbility({
  id: 'storm-resurrection-wind',
  name: 'Resurrection Wind',
  type: 'healing',
  element: 'Jupiter',
  manaCost: 26,
  basePower: 999,
  targets: 'party',
  unlockLevel: 10,
  description: 'Revive all at 75% HP.',
  revive: true,
  reviveHPPercent: 0.75,
});

export const STORM_ARMAGEDDON_STORM = makeAbility({
  id: 'storm-armageddon-storm',
  name: 'Armageddon Storm',
  type: 'psynergy',
  element: 'Jupiter',
  manaCost: 30,
  basePower: 150,
  targets: 'all-enemies',
  unlockLevel: 10,
  description: 'Ultimate storm apocalypse.',
});

