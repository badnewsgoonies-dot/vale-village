import type { Ability } from '../schemas/AbilitySchema';
import { ABILITIES } from './abilities';

const makeAbility = (ability: Ability): Ability => ability;

export const FLINT_STONE_FIST = makeAbility({
  id: 'flint-stone-fist',
  name: 'Stone Fist',
  type: 'physical',
  element: 'Venus',
  manaCost: 2,
  basePower: 45,
  targets: 'single-enemy',
  unlockLevel: 1,
  description: 'Strike with earth-hardened fists.',
});

export const FLINT_GRANITE_GUARD = makeAbility({
  id: 'flint-granite-guard',
  name: 'Granite Guard',
  type: 'buff',
  element: 'Venus',
  manaCost: 3,
  basePower: 0,
  targets: 'self',
  unlockLevel: 1,
  description: 'Shields self with granite armor.',
  buffEffect: { def: 5 },
  duration: 3,
});

export const FLINT_LAVA_STONE = makeAbility({
  id: 'flint-lava-stone',
  name: 'Lava Stone',
  type: 'psynergy',
  element: 'Venus',
  manaCost: 3,
  basePower: 65,
  targets: 'single-enemy',
  unlockLevel: 1,
  description: 'Hurl molten rocks at a foe.',
});

export const FLINT_MAGMA_SHIELD = makeAbility({
  id: 'flint-magma-shield',
  name: 'Magma Shield',
  type: 'buff',
  element: 'Venus',
  manaCost: 4,
  basePower: 0,
  targets: 'self',
  unlockLevel: 1,
  description: 'Encase self in magma armor.',
  buffEffect: { def: 7 },
  duration: 3,
});

export const FLINT_EARTH_PULSE = makeAbility({
  id: 'flint-earth-pulse',
  name: 'Earth Pulse',
  type: 'psynergy',
  element: 'Venus',
  manaCost: 2,
  basePower: 40,
  targets: 'single-enemy',
  unlockLevel: 1,
  description: 'Send a shockwave through the earth.',
});

export const GRANITE_EARTH_WALL = makeAbility({
  id: 'granite-earth-wall',
  name: 'Earth Wall',
  type: 'buff',
  element: 'Venus',
  manaCost: 3,
  basePower: 0,
  targets: 'self',
  unlockLevel: 2,
  description: 'Raise an earthen wall, granting strong Venus resistance.',
  buffEffect: { def: 8 },
  duration: 3,
  elementalResistance: { element: 'Venus', modifier: 0.4 },
});

export const GRANITE_TERRA_BREAK = makeAbility({
  id: 'granite-terra-break',
  name: 'Terra Break',
  type: 'psynergy',
  element: 'Venus',
  manaCost: 3,
  basePower: 55,
  targets: 'single-enemy',
  unlockLevel: 2,
  description: 'Shatter the ground beneath the foe.',
});

export const GRANITE_MAGMA_BARRIER = makeAbility({
  id: 'granite-magma-barrier',
  name: 'Magma Barrier',
  type: 'buff',
  element: 'Venus',
  manaCost: 3,
  basePower: 0,
  targets: 'self',
  unlockLevel: 2,
  description: 'Surround yourself in molten stone.',
  buffEffect: { def: 6 },
  duration: 3,
});

export const GRANITE_VOLCANIC_SPIKE = makeAbility({
  id: 'granite-volcanic-spike',
  name: 'Volcanic Spike',
  type: 'physical',
  element: 'Venus',
  manaCost: 3,
  basePower: 60,
  targets: 'single-enemy',
  unlockLevel: 2,
  description: 'Impale foes with volcanic rock.',
});

export const GRANITE_GROUND_PULSE = makeAbility({
  id: 'granite-ground-pulse',
  name: 'Ground Pulse',
  type: 'psynergy',
  element: 'Venus',
  manaCost: 2,
  basePower: 45,
  targets: 'single-enemy',
  unlockLevel: 2,
  description: 'Send a reinforced pulse of earth.',
});

export const BANE_EARTHQUAKE = makeAbility({
  id: 'bane-earthquake',
  name: 'Earthquake',
  type: 'psynergy',
  element: 'Venus',
  manaCost: 5,
  basePower: 90,
  targets: 'all-enemies',
  unlockLevel: 3,
  description: 'Crack the battlefield with seismic force.',
});

export const BANE_TERRA_GUARD = makeAbility({
  id: 'bane-terra-guard',
  name: 'Terra Guard',
  type: 'buff',
  element: 'Venus',
  manaCost: 4,
  basePower: 0,
  targets: 'self',
  unlockLevel: 3,
  description: 'Massive defensive earth field.',
  buffEffect: { def: 10 },
  duration: 3,
});

export const BANE_LAVA_FIST = makeAbility({
  id: 'bane-lava-fist',
  name: 'Lava Fist',
  type: 'physical',
  element: 'Venus',
  manaCost: 4,
  basePower: 70,
  targets: 'single-enemy',
  unlockLevel: 3,
  description: 'Smash foes with molten fists.',
});

export const BANE_MOLTEN_ARMOR = makeAbility({
  id: 'bane-molten-armor',
  name: 'Molten Armor',
  type: 'buff',
  element: 'Venus',
  manaCost: 4,
  basePower: 0,
  targets: 'self',
  unlockLevel: 3,
  description: 'Envelop yourself in molten stone.',
  buffEffect: { def: 9 },
  duration: 3,
});

export const BANE_ROCK_PULSE = makeAbility({
  id: 'bane-rock-pulse',
  name: 'Rock Pulse',
  type: 'psynergy',
  element: 'Venus',
  manaCost: 3,
  basePower: 50,
  targets: 'single-enemy',
  unlockLevel: 3,
  description: 'Fire a concentrated quake beam.',
});

export const FORGE_FLAME_STRIKE = makeAbility({
  id: 'forge-flame-strike',
  name: 'Flame Strike',
  type: 'physical',
  element: 'Mars',
  manaCost: 2,
  basePower: 50,
  targets: 'single-enemy',
  unlockLevel: 1,
  description: 'Strike with a scorching blow.',
});

export const FORGE_INFERNO_BLAZE = makeAbility({
  id: 'forge-inferno-blaze',
  name: 'Inferno Blaze',
  type: 'psynergy',
  element: 'Mars',
  manaCost: 3,
  basePower: 60,
  targets: 'all-enemies',
  unlockLevel: 1,
  description: 'Engulf foes in raging fire.',
});

export const FORGE_STONE_SLAM = makeAbility({
  id: 'forge-stone-slam',
  name: 'Stone Slam',
  type: 'physical',
  element: 'Mars',
  manaCost: 3,
  basePower: 60,
  targets: 'single-enemy',
  unlockLevel: 1,
  description: 'Slam a molten fist into stone.',
});

export const FORGE_GRANITE_SHIELD = makeAbility({
  id: 'forge-granite-shield',
  name: 'Granite Shield',
  type: 'buff',
  element: 'Mars',
  manaCost: 3,
  basePower: 0,
  targets: 'self',
  unlockLevel: 1,
  description: 'Raise a shield of volcanic stone.',
  buffEffect: { def: 6 },
  duration: 3,
});

export const FORGE_EMBER_WAVE = makeAbility({
  id: 'forge-ember-wave',
  name: 'Ember Wave',
  type: 'psynergy',
  element: 'Mars',
  manaCost: 2,
  basePower: 45,
  targets: 'single-enemy',
  unlockLevel: 1,
  description: 'Send out a wave of red embers.',
});

export const FORGE_FLAME_BURST = makeAbility({
  id: 'forge-flame-burst',
  name: 'Flame Burst',
  type: 'psynergy',
  element: 'Mars',
  manaCost: 2,
  basePower: 48,
  targets: 'single-enemy',
  unlockLevel: 1,
  description: 'Unleash a burst of scorching flames.',
});

export const FORGE_INFERNO_SHIELD = makeAbility({
  id: 'forge-inferno-shield',
  name: 'Inferno Shield',
  type: 'buff',
  element: 'Mars',
  manaCost: 3,
  basePower: 0,
  targets: 'self',
  unlockLevel: 1,
  description: 'Envelop yourself in protective inferno flames.',
  buffEffect: { def: 6 },
  duration: 3,
});

export const FORGE_FIRE_STORM = makeAbility({
  id: 'forge-fire-storm',
  name: 'Fire Storm',
  type: 'psynergy',
  element: 'Mars',
  manaCost: 3,
  basePower: 35,
  targets: 'all-enemies',
  unlockLevel: 1,
  description: 'Engulf all enemies in a storm of fire.',
});

export const FORGE_STONE_MELT = makeAbility({
  id: 'forge-stone-melt',
  name: 'Stone Melt',
  type: 'psynergy',
  element: 'Mars',
  manaCost: 3,
  basePower: 65,
  targets: 'single-enemy',
  unlockLevel: 1,
  description: 'Melt stone with intense heat, bypassing half of enemy armor.',
  ignoreDefensePercent: 0.5,
});

export const FORGE_GRANITE_BURN = makeAbility({
  id: 'forge-granite-burn',
  name: 'Granite Burn',
  type: 'physical',
  element: 'Mars',
  manaCost: 3,
  basePower: 58,
  targets: 'single-enemy',
  unlockLevel: 1,
  description: 'Strike with heat-hardened fists that burn through stone.',
});

export const FORGE_EMBER_SHIELD = makeAbility({
  id: 'forge-ember-shield',
  name: 'Ember Shield',
  type: 'buff',
  element: 'Mars',
  manaCost: 2,
  basePower: 0,
  targets: 'self',
  unlockLevel: 1,
  description: 'Raise a shield of glowing embers.',
  buffEffect: { def: 4 },
  duration: 3,
});

export const FORGE_HEAT_WAVE = makeAbility({
  id: 'forge-heat-wave',
  name: 'Heat Wave',
  type: 'psynergy',
  element: 'Mars',
  manaCost: 3,
  basePower: 38,
  targets: 'all-enemies',
  unlockLevel: 1,
  description: 'Send a wave of searing heat across the battlefield.',
});

export const FORGE_WARMTH = makeAbility({
  id: 'forge-warmth',
  name: 'Warmth',
  type: 'healing',
  element: 'Mars',
  manaCost: 3,
  basePower: 45,
  targets: 'single-ally',
  unlockLevel: 1,
  description: 'Restore an ally with fire\'s gentle warmth.',
});

export const FORGE_BURN_TOUCH = makeAbility({
  id: 'forge-burn-touch',
  name: 'Burn Touch',
  type: 'debuff',
  element: 'Mars',
  manaCost: 2,
  basePower: 0,
  targets: 'single-enemy',
  unlockLevel: 1,
  description: 'Ignite the foe with searing flames.',
  statusEffect: { type: 'burn', duration: 2 },
});

export const FORGE_FLAME_HEAL = makeAbility({
  id: 'forge-flame-heal',
  name: 'Flame Heal',
  type: 'healing',
  element: 'Mars',
  manaCost: 4,
  basePower: 42,
  targets: 'all-allies',
  unlockLevel: 1,
  description: 'Heal all allies with fire\'s life-giving energy.',
});

export const CORONA_SCORCH = makeAbility({
  id: 'corona-scorch',
  name: 'Scorch',
  type: 'psynergy',
  element: 'Mars',
  manaCost: 3,
  basePower: 55,
  targets: 'single-enemy',
  unlockLevel: 2,
  description: 'Warm the air to murderous heat.',
});

export const CORONA_EMBER_VEIL = makeAbility({
  id: 'corona-ember-veil',
  name: 'Ember Veil',
  type: 'buff',
  element: 'Mars',
  manaCost: 3,
  basePower: 0,
  targets: 'self',
  unlockLevel: 2,
  description: 'Envelop self in ember mist.',
  buffEffect: { def: 5 },
  duration: 3,
});

export const CORONA_EARTHBREAKER = makeAbility({
  id: 'corona-earthbreaker',
  name: 'Earth Breaker',
  type: 'physical',
  element: 'Mars',
  manaCost: 3,
  basePower: 70,
  targets: 'single-enemy',
  unlockLevel: 2,
  description: 'Crush earth with molten fists.',
});

export const CORONA_MOUNTAIN_WALL = makeAbility({
  id: 'corona-mountain-wall',
  name: 'Mountain Wall',
  type: 'buff',
  element: 'Mars',
  manaCost: 4,
  basePower: 0,
  targets: 'self',
  unlockLevel: 2,
  description: 'Form a mountain barrier that reduces incoming damage.',
  buffEffect: { def: 8 },
  duration: 3,
  damageReductionPercent: 0.25,
});

export const CORONA_SOLAR_SPIN = makeAbility({
  id: 'corona-solar-spin',
  name: 'Solar Spin',
  type: 'psynergy',
  element: 'Mars',
  manaCost: 2,
  basePower: 50,
  targets: 'single-enemy',
  unlockLevel: 2,
  description: 'Spin blazing energy around the foe.',
});

export const CORONA_SOLAR_BLAST = makeAbility({
  id: 'corona-solar-blast',
  name: 'Solar Blast',
  type: 'psynergy',
  element: 'Mars',
  manaCost: 3,
  basePower: 62,
  targets: 'single-enemy',
  unlockLevel: 2,
  description: 'Unleash a concentrated blast of solar energy.',
});

export const CORONA_FLAME_BARRIER = makeAbility({
  id: 'corona-flame-barrier',
  name: 'Flame Barrier',
  type: 'buff',
  element: 'Mars',
  manaCost: 4,
  basePower: 0,
  targets: 'self',
  unlockLevel: 2,
  description: 'Create a barrier of intense flames that empowers your attacks.',
  buffEffect: { atk: 8 },
  duration: 3,
});

export const CORONA_FIRE_NOVA = makeAbility({
  id: 'corona-fire-nova',
  name: 'Fire Nova',
  type: 'psynergy',
  element: 'Mars',
  manaCost: 4,
  basePower: 52,
  targets: 'all-enemies',
  unlockLevel: 2,
  description: 'Detonate a nova of fire that scorches all enemies.',
});

export const CORONA_EARTH_MELT = makeAbility({
  id: 'corona-earth-melt',
  name: 'Earth Melt',
  type: 'psynergy',
  element: 'Mars',
  manaCost: 4,
  basePower: 70,
  targets: 'single-enemy',
  unlockLevel: 2,
  description: 'Melt earth with solar intensity, penetrating armor.',
  ignoreDefensePercent: 0.4,
});

export const CORONA_STONE_SCORCH = makeAbility({
  id: 'corona-stone-scorch',
  name: 'Stone Scorch',
  type: 'physical',
  element: 'Mars',
  manaCost: 4,
  basePower: 68,
  targets: 'single-enemy',
  unlockLevel: 2,
  description: 'Scorch foes with stone-melting heat.',
});

export const CORONA_SOLAR_GUARD = makeAbility({
  id: 'corona-solar-guard',
  name: 'Solar Guard',
  type: 'buff',
  element: 'Mars',
  manaCost: 3,
  basePower: 0,
  targets: 'self',
  unlockLevel: 2,
  description: 'Guard yourself with solar radiance.',
  buffEffect: { def: 5 },
  duration: 3,
});

export const CORONA_HEAT_PULSE = makeAbility({
  id: 'corona-heat-pulse',
  name: 'Heat Pulse',
  type: 'psynergy',
  element: 'Mars',
  manaCost: 3,
  basePower: 55,
  targets: 'single-enemy',
  unlockLevel: 2,
  description: 'Release a pulse of concentrated heat.',
});

export const CORONA_SOLAR_HEAL = makeAbility({
  id: 'corona-solar-heal',
  name: 'Solar Heal',
  type: 'healing',
  element: 'Mars',
  manaCost: 4,
  basePower: 60,
  targets: 'single-ally',
  unlockLevel: 2,
  description: 'Heal an ally with solar energy.',
});

export const CORONA_SCORCH_BURN = makeAbility({
  id: 'corona-scorch-burn',
  name: 'Scorch Burn',
  type: 'debuff',
  element: 'Mars',
  manaCost: 3,
  basePower: 0,
  targets: 'single-enemy',
  unlockLevel: 2,
  description: 'Scorch the enemy with lingering flames.',
  statusEffect: { type: 'burn', duration: 2 },
});

export const CORONA_FLAME_REVIVAL = makeAbility({
  id: 'corona-flare-revival',
  name: 'Flare Revival',
  type: 'healing',
  element: 'Mars',
  manaCost: 5,
  basePower: 80,
  targets: 'single-ally',
  unlockLevel: 2,
  description: 'Revive a fallen ally with fire\'s rebirth.',
  revivesFallen: true,
});

export const FURY_HEAT_RUSH = makeAbility({
  id: 'fury-heat-rush',
  name: 'Heat Rush',
  type: 'physical',
  element: 'Mars',
  manaCost: 3,
  basePower: 60,
  targets: 'single-enemy',
  unlockLevel: 3,
  description: 'Rush the enemy with heated fists.',
});

export const FURY_FLARE_GUARD = makeAbility({
  id: 'fury-flare-guard',
  name: 'Flare Guard',
  type: 'buff',
  element: 'Mars',
  manaCost: 4,
  basePower: 0,
  targets: 'self',
  unlockLevel: 3,
  description: 'Create a flare barrier.',
  buffEffect: { def: 9 },
  duration: 3,
});

export const FURY_STONE_BARRAGE = makeAbility({
  id: 'fury-stone-barrage',
  name: 'Stone Barrage',
  type: 'physical',
  element: 'Mars',
  manaCost: 4,
  basePower: 65,
  targets: 'all-enemies',
  unlockLevel: 3,
  description: 'Hurl randomized stones.',
});

export const FURY_TERRA_GATE = makeAbility({
  id: 'fury-terra-gate',
  name: 'Terra Gate',
  type: 'buff',
  element: 'Mars',
  manaCost: 4,
  basePower: 0,
  targets: 'self',
  unlockLevel: 3,
  description: 'Block with molten earth gate.',
  buffEffect: { def: 8 },
  duration: 3,
});

export const FURY_WIND_FLARE = makeAbility({
  id: 'fury-wind-flare',
  name: 'Wind Flare',
  type: 'psynergy',
  element: 'Mars',
  manaCost: 3,
  basePower: 55,
  targets: 'single-enemy',
  unlockLevel: 3,
  description: 'Twist fire into the wind.',
});

export const FURY_INFERNO_RAGE = makeAbility({
  id: 'fury-inferno-rage',
  name: 'Inferno Rage',
  type: 'psynergy',
  element: 'Mars',
  manaCost: 5,
  basePower: 85,
  targets: 'all-enemies',
  unlockLevel: 3,
  description: 'Unleash a cataclysmic inferno upon all enemies.',
});

export const FURY_FLAME_TITAN = makeAbility({
  id: 'fury-flame-titan',
  name: 'Flame Titan',
  type: 'buff',
  element: 'Mars',
  manaCost: 5,
  basePower: 0,
  targets: 'self',
  unlockLevel: 3,
  description: 'Transform into a titan of pure flame with extended protection and damage reduction.',
  buffEffect: { def: 12 },
  duration: 4,
  damageReductionPercent: 0.3,
});

export const FURY_FIRE_APOCALYPSE = makeAbility({
  id: 'fury-fire-apocalypse',
  name: 'Fire Apocalypse',
  type: 'psynergy',
  element: 'Mars',
  manaCost: 5,
  basePower: 90,
  targets: 'all-enemies',
  unlockLevel: 3,
  description: 'Bring about an apocalypse of fire and destruction.',
});

export const FURY_TERRA_BURN = makeAbility({
  id: 'fury-terra-burn',
  name: 'Terra Burn',
  type: 'physical',
  element: 'Mars',
  manaCost: 5,
  basePower: 78,
  targets: 'single-enemy',
  unlockLevel: 3,
  description: 'Strike with fire so intense it burns through earth and armor.',
  ignoreDefensePercent: 0.6,
});

export const FURY_HEAT_STORM = makeAbility({
  id: 'fury-heat-storm',
  name: 'Heat Storm',
  type: 'psynergy',
  element: 'Mars',
  manaCost: 4,
  basePower: 65,
  targets: 'all-enemies',
  unlockLevel: 3,
  description: 'Summon a storm of searing heat.',
});

export const FURY_FLARE_PULSE = makeAbility({
  id: 'fury-flare-pulse',
  name: 'Flare Pulse',
  type: 'psynergy',
  element: 'Mars',
  manaCost: 4,
  basePower: 70,
  targets: 'single-enemy',
  unlockLevel: 3,
  description: 'Release a pulse of concentrated flare energy.',
});

export const FURY_FLAME_REVIVAL = makeAbility({
  id: 'fury-flame-revival',
  name: 'Flame Revival',
  type: 'healing',
  element: 'Mars',
  manaCost: 5,
  basePower: 100,
  targets: 'single-ally',
  unlockLevel: 3,
  description: 'Revive a fallen ally with fire\'s full power.',
  revivesFallen: true,
});

export const FURY_BURN_VENOM = makeAbility({
  id: 'fury-burn-venom',
  name: 'Burn Venom',
  type: 'debuff',
  element: 'Mars',
  manaCost: 4,
  basePower: 0,
  targets: 'single-enemy',
  unlockLevel: 3,
  description: 'Ignite the foe with venomous flames that burn deep.',
  statusEffect: { type: 'burn', duration: 3 },
});

export const FURY_INFERNO_BLESSING = makeAbility({
  id: 'fury-inferno-blessing',
  name: 'Inferno Blessing',
  type: 'healing',
  element: 'Mars',
  manaCost: 5,
  basePower: 70,
  targets: 'all-allies',
  unlockLevel: 3,
  description: 'Bless all allies with inferno\'s protective embrace.',
});

export const FURY_MOLTEN_TORRENT = makeAbility({
  id: 'fury-molten-torrent',
  name: 'Molten Torrent',
  type: 'psynergy',
  element: 'Mars',
  manaCost: 6,
  basePower: 95,
  targets: 'single-enemy',
  unlockLevel: 3,
  description: 'Unleash a devastating stream of molten rock.',
});

// ============================================================================
// FLINT - Additional Abilities
// ============================================================================

export const FLINT_STONE_SPIKE = makeAbility({
  id: 'flint-stone-spike',
  name: 'Stone Spike',
  type: 'physical',
  element: 'Venus',
  manaCost: 2,
  basePower: 48,
  targets: 'single-enemy',
  unlockLevel: 1,
  description: 'Impale foes with sharpened stone spikes.',
});

export const FLINT_TERRA_ARMOR = makeAbility({
  id: 'flint-terra-armor',
  name: 'Terra Armor',
  type: 'buff',
  element: 'Venus',
  manaCost: 3,
  basePower: 0,
  targets: 'self',
  unlockLevel: 1,
  description: 'Encase yourself in hardened earth armor, reducing incoming damage.',
  buffEffect: { def: 6 },
  duration: 3,
  damageReductionPercent: 0.15,
});

export const FLINT_EARTHQUAKE_PUNCH = makeAbility({
  id: 'flint-earthquake-punch',
  name: 'Earthquake Punch',
  type: 'physical',
  element: 'Venus',
  manaCost: 3,
  basePower: 50,
  targets: 'single-enemy',
  unlockLevel: 1,
  description: 'Deliver a devastating punch that shakes the ground.',
});

export const FLINT_MOLTEN_BURST = makeAbility({
  id: 'flint-molten-burst',
  name: 'Molten Burst',
  type: 'psynergy',
  element: 'Venus',
  manaCost: 3,
  basePower: 68,
  targets: 'single-enemy',
  unlockLevel: 1,
  description: 'Erupt molten earth beneath the foe.',
});

export const FLINT_VOLCANIC_GUARD = makeAbility({
  id: 'flint-volcanic-guard',
  name: 'Volcanic Guard',
  type: 'buff',
  element: 'Venus',
  manaCost: 4,
  basePower: 0,
  targets: 'self',
  unlockLevel: 1,
  description: 'Surround yourself with volcanic rock.',
  buffEffect: { def: 8 },
  duration: 3,
});

export const FLINT_GROUND_SHIELD = makeAbility({
  id: 'flint-ground-shield',
  name: 'Ground Shield',
  type: 'buff',
  element: 'Venus',
  manaCost: 2,
  basePower: 0,
  targets: 'self',
  unlockLevel: 1,
  description: 'Raise a protective earth barrier that blocks 1 hit.',
  buffEffect: { def: 4 },
  duration: 3,
  shieldCharges: 1,
});

export const FLINT_ROCK_BARRAGE = makeAbility({
  id: 'flint-rock-barrage',
  name: 'Rock Barrage',
  type: 'psynergy',
  element: 'Venus',
  manaCost: 3,
  basePower: 35,
  targets: 'all-enemies',
  unlockLevel: 1,
  description: 'Hurl a volley of stones at all enemies.',
});

export const FLINT_SOOTHING_EARTH = makeAbility({
  id: 'flint-soothing-earth',
  name: 'Soothing Earth',
  type: 'healing',
  element: 'Venus',
  manaCost: 3,
  basePower: 45,
  targets: 'single-ally',
  unlockLevel: 1,
  description: 'Channel earth\'s restorative energy to heal an ally.',
});

export const FLINT_STONE_BIND = makeAbility({
  id: 'flint-stone-bind',
  name: 'Stone Bind',
  type: 'debuff',
  element: 'Venus',
  manaCost: 2,
  basePower: 0,
  targets: 'single-enemy',
  unlockLevel: 1,
  description: 'Entrap the foe in stone, paralyzing them.',
  statusEffect: { type: 'paralyze', duration: 1 },
});

export const FLINT_TERRA_HEAL = makeAbility({
  id: 'flint-terra-heal',
  name: 'Terra Heal',
  type: 'healing',
  element: 'Venus',
  manaCost: 4,
  basePower: 35,
  targets: 'all-allies',
  unlockLevel: 1,
  description: 'Heal all allies with earth\'s gentle touch.',
});

// ============================================================================ 
// GRANITE - Additional Abilities 
// ============================================================================

export const GRANITE_STONE_SPIKE = makeAbility({
  id: 'granite-stone-spike',
  name: 'Stone Spike',
  type: 'physical',
  element: 'Venus',
  manaCost: 3,
  basePower: 62,
  targets: 'single-enemy',
  unlockLevel: 2,
  description: 'Launch massive stone spikes at the enemy.',
});

export const GRANITE_EARTHQUAKE = makeAbility({
  id: 'granite-earthquake',
  name: 'Earthquake',
  type: 'psynergy',
  element: 'Venus',
  manaCost: 4,
  basePower: 50,
  targets: 'all-enemies',
  unlockLevel: 2,
  description: 'Trigger a localized earthquake under all foes.',
});

export const GRANITE_STONE_FORTRESS = makeAbility({
  id: 'granite-stone-fortress',
  name: 'Stone Fortress',
  type: 'buff',
  element: 'Venus',
  manaCost: 4,
  basePower: 0,
  targets: 'self',
  unlockLevel: 2,
  description: 'Erect an impenetrable stone fortress, greatly reducing damage.',
  buffEffect: { def: 9 },
  duration: 3,
  damageReductionPercent: 0.4,
});

export const GRANITE_MAGMA_BLAST = makeAbility({
  id: 'granite-magma-blast',
  name: 'Magma Blast',
  type: 'psynergy',
  element: 'Venus',
  manaCost: 4,
  basePower: 72,
  targets: 'single-enemy',
  unlockLevel: 2,
  description: 'Unleash a concentrated blast of molten magma.',
});

export const GRANITE_VOLCANIC_ARMOR = makeAbility({
  id: 'granite-volcanic-armor',
  name: 'Volcanic Armor',
  type: 'buff',
  element: 'Venus',
  manaCost: 4,
  basePower: 0,
  targets: 'self',
  unlockLevel: 2,
  description: 'Envelop yourself in hardened volcanic rock, reducing damage.',
  buffEffect: { def: 7 },
  duration: 3,
  damageReductionPercent: 0.25,
});

export const GRANITE_GROUND_WAVE = makeAbility({
  id: 'granite-ground-wave',
  name: 'Ground Wave',
  type: 'psynergy',
  element: 'Venus',
  manaCost: 3,
  basePower: 42,
  targets: 'all-enemies',
  unlockLevel: 2,
  description: 'Send a powerful shockwave through the ground.',
});

export const GRANITE_ROCK_SHIELD = makeAbility({
  id: 'granite-rock-shield',
  name: 'Rock Shield',
  type: 'buff',
  element: 'Venus',
  manaCost: 3,
  basePower: 0,
  targets: 'self',
  unlockLevel: 2,
  description: 'Form a protective barrier of solid rock with Venus resistance.',
  buffEffect: { def: 5 },
  duration: 3,
  elementalResistance: { element: 'Venus', modifier: 0.25 },
});

export const GRANITE_TERRA_HEAL = makeAbility({
  id: 'granite-terra-heal',
  name: 'Terra Heal',
  type: 'healing',
  element: 'Venus',
  manaCost: 4,
  basePower: 60,
  targets: 'single-ally',
  unlockLevel: 2,
  description: 'Draw upon earth\'s deep healing power.',
});

export const GRANITE_STONE_SLOW = makeAbility({
  id: 'granite-stone-slow',
  name: 'Stone Slow',
  type: 'debuff',
  element: 'Venus',
  manaCost: 3,
  basePower: 0,
  targets: 'single-enemy',
  unlockLevel: 2,
  description: 'Encase the foe\'s feet in stone, freezing them in place.',
  statusEffect: { type: 'freeze', duration: 1 },
});

export const GRANITE_EARTH_REVIVAL = makeAbility({
  id: 'granite-earth-revival',
  name: 'Earth Revival',
  type: 'healing',
  element: 'Venus',
  manaCost: 5,
  basePower: 80,
  targets: 'single-ally',
  unlockLevel: 2,
  description: 'Revive a fallen ally with earth\'s life-giving energy.',
  revivesFallen: true,
});

// ============================================================================ 
// BANE - Additional Abilities 
// ============================================================================

export const BANE_TERRA_BREAKER = makeAbility({
  id: 'bane-terra-breaker',
  name: 'Terra Breaker',
  type: 'physical',
  element: 'Venus',
  manaCost: 4,
  basePower: 75,
  targets: 'single-enemy',
  unlockLevel: 3,
  description: 'Shatter the earth with devastating force.',
});

export const BANE_EARTHQUAKE_RAGE = makeAbility({
  id: 'bane-earthquake-rage',
  name: 'Earthquake Rage',
  type: 'psynergy',
  element: 'Venus',
  manaCost: 5,
  basePower: 85,
  targets: 'all-enemies',
  unlockLevel: 3,
  description: 'Unleash a cataclysmic earthquake that shakes everything.',
});

export const BANE_STONE_TITAN = makeAbility({
  id: 'bane-stone-titan',
  name: 'Stone Titan',
  type: 'buff',
  element: 'Venus',
  manaCost: 5,
  basePower: 0,
  targets: 'self',
  unlockLevel: 3,
  description: 'Transform into a titan of stone with layered defenses.',
  buffEffect: { def: 12 },
  duration: 3,
  shieldCharges: 2,
  damageReductionPercent: 0.3,
});

export const BANE_MOLTEN_TORRENT = makeAbility({
  id: 'bane-molten-torrent',
  name: 'Molten Torrent',
  type: 'psynergy',
  element: 'Venus',
  manaCost: 5,
  basePower: 80,
  targets: 'all-enemies',
  unlockLevel: 3,
  description: 'Unleash a torrent of molten earth upon all enemies.',
});

export const BANE_VOLCANIC_RAGE = makeAbility({
  id: 'bane-volcanic-rage',
  name: 'Volcanic Rage',
  type: 'physical',
  element: 'Venus',
  manaCost: 5,
  basePower: 78,
  targets: 'single-enemy',
  unlockLevel: 3,
  description: 'Strike with the fury of a volcano.',
});

export const BANE_ROCK_STORM = makeAbility({
  id: 'bane-rock-storm',
  name: 'Rock Storm',
  type: 'psynergy',
  element: 'Venus',
  manaCost: 4,
  basePower: 65,
  targets: 'all-enemies',
  unlockLevel: 3,
  description: 'Summon a storm of boulders from the sky.',
});

export const BANE_TERRA_PULSE = makeAbility({
  id: 'bane-terra-pulse',
  name: 'Terra Pulse',
  type: 'psynergy',
  element: 'Venus',
  manaCost: 4,
  basePower: 70,
  targets: 'single-enemy',
  unlockLevel: 3,
  description: 'Release a concentrated pulse that bypasses armor.',
  ignoreDefensePercent: 0.5,
});

export const BANE_EARTH_REVIVAL = makeAbility({
  id: 'bane-earth-revival',
  name: 'Earth Revival',
  type: 'healing',
  element: 'Venus',
  manaCost: 5,
  basePower: 100,
  targets: 'single-ally',
  unlockLevel: 3,
  description: 'Revive a fallen ally with the full power of earth.',
  revivesFallen: true,
});

export const BANE_STONE_STUN = makeAbility({
  id: 'bane-stone-stun',
  name: 'Stone Stun',
  type: 'debuff',
  element: 'Venus',
  manaCost: 4,
  basePower: 0,
  targets: 'single-enemy',
  unlockLevel: 3,
  description: 'Crush the foe under stone, stunning them completely.',
  statusEffect: { type: 'paralyze', duration: 2 },
});

export const BANE_TERRA_BLESSING = makeAbility({
  id: 'bane-terra-blessing',
  name: 'Terra Blessing',
  type: 'healing',
  element: 'Venus',
  manaCost: 5,
  basePower: 70,
  targets: 'all-allies',
  unlockLevel: 3,
  description: 'Bless all allies with healing, cleansing, and brief immunity.',
  removeStatusEffects: { type: 'negative' },
  grantImmunity: { all: true, duration: 1 },
});

export const FIZZ_ICE_SHARD = makeAbility({
  id: 'fizz-ice-shard',
  name: 'Ice Shard',
  type: 'physical',
  element: 'Mercury',
  manaCost: 2,
  basePower: 45,
  targets: 'single-enemy',
  unlockLevel: 1,
  description: 'Pierce foes with chilled shards.',
});

export const FIZZ_WAVE_SHIELD = makeAbility({
  id: 'fizz-wave-shield',
  name: 'Wave Shield',
  type: 'buff',
  element: 'Mercury',
  manaCost: 3,
  basePower: 0,
  targets: 'self',
  unlockLevel: 1,
  description: 'Shape a protective tide.',
  buffEffect: { def: 6 },
  duration: 3,
});

export const FIZZ_GALE_FREEZE = makeAbility({
  id: 'fizz-gale-freeze',
  name: 'Gale Freeze',
  type: 'psynergy',
  element: 'Mercury',
  manaCost: 3,
  basePower: 60,
  targets: 'single-enemy',
  unlockLevel: 1,
  description: 'Freeze targets with wind-sprayed ice.',
});

export const FIZZ_STORM_CHILL = makeAbility({
  id: 'fizz-storm-chill',
  name: 'Storm Chill',
  type: 'debuff',
  element: 'Mercury',
  manaCost: 3,
  basePower: 0,
  targets: 'single-enemy',
  unlockLevel: 1,
  description: 'Chill enemy, reducing speed.',
  statusEffect: { type: 'freeze', duration: 1 },
});

export const FIZZ_AQUA_PULSE = makeAbility({
  id: 'fizz-aqua-pulse',
  name: 'Aqua Pulse',
  type: 'psynergy',
  element: 'Mercury',
  manaCost: 2,
  basePower: 50,
  targets: 'single-enemy',
  unlockLevel: 1,
  description: 'Send a wave of aqua at a single foe.',
});

export const TONIC_FROST_BITE = makeAbility({
  id: 'tonic-frost-bite',
  name: 'Frost Bite',
  type: 'physical',
  element: 'Mercury',
  manaCost: 3,
  basePower: 55,
  targets: 'single-enemy',
  unlockLevel: 2,
  description: 'Bite foes with chilling fangs.',
});

export const TONIC_AQUA_VEIL = makeAbility({
  id: 'tonic-aqua-veil',
  name: 'Aqua Veil',
  type: 'buff',
  element: 'Mercury',
  manaCost: 3,
  basePower: 0,
  targets: 'self',
  unlockLevel: 2,
  description: 'Wrap in cascading water.',
  buffEffect: { def: 7 },
  duration: 3,
});

export const TONIC_WIND_FREEZE = makeAbility({
  id: 'tonic-wind-freeze',
  name: 'Wind Freeze',
  type: 'psynergy',
  element: 'Mercury',
  manaCost: 3,
  basePower: 55,
  targets: 'single-enemy',
  unlockLevel: 2,
  description: 'Freeze foes with wind-blown ice.',
});

export const TONIC_GALE_BARRIER = makeAbility({
  id: 'tonic-gale-barrier',
  name: 'Gale Barrier',
  type: 'buff',
  element: 'Mercury',
  manaCost: 4,
  basePower: 0,
  targets: 'self',
  unlockLevel: 2,
  description: 'Form a gale-and-mist barrier.',
  buffEffect: { def: 6 },
  duration: 3,
});

export const TONIC_SOOTHING_WAVE = makeAbility({
  id: 'tonic-soothing-wave',
  name: 'Soothing Wave',
  type: 'healing',
  element: 'Mercury',
  manaCost: 3,
  basePower: 40,
  targets: 'single-ally',
  unlockLevel: 2,
  description: 'Heal an ally with calm waters.',
});

export const CRYSTAL_CRYSTAL_RAY = makeAbility({
  id: 'crystal-crystal-ray',
  name: 'Crystal Ray',
  type: 'psynergy',
  element: 'Mercury',
  manaCost: 3,
  basePower: 65,
  targets: 'single-enemy',
  unlockLevel: 3,
  description: 'Pierce enemies with crystalline light.',
});

export const CRYSTAL_AQUA_ARMOR = makeAbility({
  id: 'crystal-aqua-armor',
  name: 'Aqua Armor',
  type: 'buff',
  element: 'Mercury',
  manaCost: 3,
  basePower: 0,
  targets: 'self',
  unlockLevel: 3,
  description: 'Envelop in spectral aqua.',
  buffEffect: { def: 8 },
  duration: 3,
});

export const CRYSTAL_STORM_CRYSTAL = makeAbility({
  id: 'crystal-storm-crystal',
  name: 'Storm Crystal',
  type: 'psynergy',
  element: 'Mercury',
  manaCost: 4,
  basePower: 70,
  targets: 'all-enemies',
  unlockLevel: 3,
  description: 'Shatter a crystal storm.',
});

export const CRYSTAL_GALE_GLAZE = makeAbility({
  id: 'crystal-gale-glaze',
  name: 'Gale Glaze',
  type: 'buff',
  element: 'Mercury',
  manaCost: 4,
  basePower: 0,
  targets: 'self',
  unlockLevel: 3,
  description: 'Coat self in gale glaze.',
  buffEffect: { def: 9 },
  duration: 3,
});

export const CRYSTAL_MIST_VEIL = makeAbility({
  id: 'crystal-mist-veil',
  name: 'Mist Veil',
  type: 'psynergy',
  element: 'Mercury',
  manaCost: 2,
  basePower: 45,
  targets: 'single-enemy',
  unlockLevel: 3,
  description: 'Drench foe in mist veil.',
});

// ============================================
// FIZZ - NEW ABILITIES (10 total)
// ============================================

export const FIZZ_ICE_BLAST = makeAbility({
  id: 'fizz-ice-blast',
  name: 'Ice Blast',
  type: 'psynergy',
  element: 'Mercury',
  manaCost: 2,
  basePower: 48,
  targets: 'single-enemy',
  unlockLevel: 1,
  description: 'Unleash a concentrated blast of ice.',
});

export const FIZZ_AQUA_BARRIER = makeAbility({
  id: 'fizz-aqua-barrier',
  name: 'Aqua Barrier',
  type: 'buff',
  element: 'Mercury',
  manaCost: 3,
  basePower: 0,
  targets: 'self',
  unlockLevel: 1,
  description: 'Create a protective barrier of flowing water that resists Mars psynergy.',
  buffEffect: { def: 6 },
  duration: 3,
  elementalResistance: { element: 'Mars', modifier: 0.25 },
});

export const FIZZ_FROST_STORM = makeAbility({
  id: 'fizz-frost-storm',
  name: 'Frost Storm',
  type: 'psynergy',
  element: 'Mercury',
  manaCost: 4,
  basePower: 35,
  targets: 'all-enemies',
  unlockLevel: 1,
  description: 'Unleash a storm of frost on all enemies.',
});

export const FIZZ_STORM_FREEZE = makeAbility({
  id: 'fizz-storm-freeze',
  name: 'Storm Freeze',
  type: 'psynergy',
  element: 'Mercury',
  manaCost: 3,
  basePower: 50,
  targets: 'single-enemy',
  unlockLevel: 1,
  description: 'Freeze enemy with storm-driven ice.',
});

export const FIZZ_HEALING_WAVE = makeAbility({
  id: 'fizz-healing-wave',
  name: 'Healing Wave',
  type: 'healing',
  element: 'Mercury',
  manaCost: 4,
  basePower: 42,
  targets: 'all-allies',
  unlockLevel: 1,
  description: 'Restore health to all allies, cleanse negatives, and grant short burn/poison immunity.',
  removeStatusEffects: { type: 'negative' },
  grantImmunity: { all: false, types: ['burn', 'poison'], duration: 1 },
});

export const FIZZ_AQUA_HEAL = makeAbility({
  id: 'fizz-aqua-heal',
  name: 'Aqua Heal',
  type: 'healing',
  element: 'Mercury',
  manaCost: 3,
  basePower: 45,
  targets: 'single-ally',
  unlockLevel: 1,
  description: 'Heal an ally with pure aqua energy.',
});

export const FIZZ_FROST_BITE = makeAbility({
  id: 'fizz-frost-bite',
  name: 'Frost Bite',
  type: 'debuff',
  element: 'Mercury',
  manaCost: 2,
  basePower: 0,
  targets: 'single-enemy',
  unlockLevel: 1,
  description: 'Chill enemy, reducing their attack power.',
  statusEffect: { type: 'freeze', duration: 1 },
});

export const FIZZ_ICE_ARMOR = makeAbility({
  id: 'fizz-ice-armor',
  name: 'Ice Armor',
  type: 'buff',
  element: 'Mercury',
  manaCost: 3,
  basePower: 0,
  targets: 'self',
  unlockLevel: 1,
  description: 'Encase yourself in protective ice.',
  buffEffect: { def: 5 },
  duration: 3,
});

export const FIZZ_ICE_SHIELD = makeAbility({
  id: 'fizz-ice-shield',
  name: 'Ice Shield',
  type: 'buff',
  element: 'Mercury',
  manaCost: 3,
  basePower: 0,
  targets: 'self',
  unlockLevel: 1,
  description: 'Form a sharper ice shield.',
  buffEffect: { def: 5 },
  duration: 3,
});

export const FIZZ_ICE_TORNADO = makeAbility({
  id: 'fizz-ice-tornado',
  name: 'Ice Tornado',
  type: 'psynergy',
  element: 'Mercury',
  manaCost: 4,
  basePower: 40,
  targets: 'all-enemies',
  unlockLevel: 1,
  description: 'Sweeps enemies with a spiraling ice tornado.',
});

// ============================================
// TONIC - NEW ABILITIES (10 total)
// ============================================

export const TONIC_ICE_HORN = makeAbility({
  id: 'tonic-ice-horn',
  name: 'Ice Horn',
  type: 'psynergy',
  element: 'Mercury',
  manaCost: 4,
  basePower: 52,
  targets: 'all-enemies',
  unlockLevel: 2,
  description: 'Pierce all enemies with crystalline horns.',
});

export const TONIC_AQUA_FORTRESS = makeAbility({
  id: 'tonic-aqua-fortress',
  name: 'Aqua Fortress',
  type: 'buff',
  element: 'Mercury',
  manaCost: 4,
  basePower: 0,
  targets: 'self',
  unlockLevel: 2,
  description: 'Erect an aqua fortress that reduces damage and grants a single-use shield.',
  buffEffect: { def: 8 },
  duration: 3,
  damageReductionPercent: 0.25,
  shieldCharges: 1,
});

export const TONIC_FROST_BLAST = makeAbility({
  id: 'tonic-frost-blast',
  name: 'Frost Blast',
  type: 'psynergy',
  element: 'Mercury',
  manaCost: 3,
  basePower: 58,
  targets: 'single-enemy',
  unlockLevel: 2,
  description: 'Blast enemy with concentrated frost.',
});

export const TONIC_STORM_FREEZE = makeAbility({
  id: 'tonic-storm-freeze',
  name: 'Storm Freeze',
  type: 'psynergy',
  element: 'Mercury',
  manaCost: 4,
  basePower: 60,
  targets: 'single-enemy',
  unlockLevel: 2,
  description: 'Freeze enemy with powerful storm ice.',
});

export const TONIC_SOOTHING_MIST = makeAbility({
  id: 'tonic-soothing-mist',
  name: 'Soothing Mist',
  type: 'healing',
  element: 'Mercury',
  manaCost: 4,
  basePower: 60,
  targets: 'single-ally',
  unlockLevel: 2,
  description: 'Restore health with calming mist.',
});

export const TONIC_AQUA_RESTORE = makeAbility({
  id: 'tonic-aqua-restore',
  name: 'Aqua Restore',
  type: 'healing',
  element: 'Mercury',
  manaCost: 5,
  basePower: 55,
  targets: 'all-allies',
  unlockLevel: 2,
  description: 'Restore health to all allies while granting burn immunity for 2 turns.',
  grantImmunity: { all: false, types: ['burn'], duration: 2 },
});

export const TONIC_ICE_SHIELD = makeAbility({
  id: 'tonic-ice-shield',
  name: 'Ice Shield',
  type: 'buff',
  element: 'Mercury',
  manaCost: 3,
  basePower: 0,
  targets: 'self',
  unlockLevel: 2,
  description: 'Protect yourself with a crystalline ice shield.',
  buffEffect: { def: 7 },
  duration: 3,
});

export const TONIC_FROST_BARRIER = makeAbility({
  id: 'tonic-frost-barrier',
  name: 'Frost Barrier',
  type: 'buff',
  element: 'Mercury',
  manaCost: 4,
  basePower: 0,
  targets: 'self',
  unlockLevel: 2,
  description: 'Create a barrier of frozen mist.',
  buffEffect: { def: 9 },
  duration: 3,
});

export const TONIC_ICE_RENEWAL = makeAbility({
  id: 'tonic-ice-renewal',
  name: 'Ice Renewal',
  type: 'healing',
  element: 'Mercury',
  manaCost: 3,
  basePower: 50,
  targets: 'single-ally',
  unlockLevel: 2,
  description: 'Renew an ally with restorative ice.',
});

export const TONIC_CRYSTAL_MIST = makeAbility({
  id: 'tonic-crystal-mist',
  name: 'Crystal Mist',
  type: 'healing',
  element: 'Mercury',
  manaCost: 4,
  basePower: 45,
  targets: 'all-allies',
  unlockLevel: 2,
  description: 'Shroud the party in crystal mist for slow healing.',
});

// ============================================
// CRYSTAL - NEW ABILITIES (10 total)
// ============================================

export const CRYSTAL_GLACIAL_LANCE = makeAbility({
  id: 'crystal-glacial-lance',
  name: 'Glacial Lance',
  type: 'psynergy',
  element: 'Mercury',
  manaCost: 4,
  basePower: 85,
  targets: 'single-enemy',
  unlockLevel: 3,
  description: 'Impale enemy with a massive glacial lance.',
});

export const CRYSTAL_AQUA_TITAN = makeAbility({
  id: 'crystal-aqua-titan',
  name: 'Aqua Titan',
  type: 'buff',
  element: 'Mercury',
  manaCost: 5,
  basePower: 0,
  targets: 'self',
  unlockLevel: 3,
  description: 'Become an aqua titan, massively boosting defense while adding shields and damage reduction.',
  buffEffect: { def: 12 },
  duration: 3,
  damageReductionPercent: 0.25,
  shieldCharges: 2,
});

export const CRYSTAL_ICE_APOCALYPSE = makeAbility({
  id: 'crystal-ice-apocalypse',
  name: 'Ice Apocalypse',
  type: 'psynergy',
  element: 'Mercury',
  manaCost: 5,
  basePower: 70,
  targets: 'all-enemies',
  unlockLevel: 3,
  description: 'Unleash an apocalyptic ice storm on all enemies.',
});

export const CRYSTAL_STORM_FREEZE = makeAbility({
  id: 'crystal-storm-freeze',
  name: 'Storm Freeze',
  type: 'psynergy',
  element: 'Mercury',
  manaCost: 4,
  basePower: 75,
  targets: 'single-enemy',
  unlockLevel: 3,
  description: 'Freeze enemy with devastating storm ice.',
});

export const CRYSTAL_GALE_GLACIER = makeAbility({
  id: 'crystal-gale-glacier',
  name: 'Gale Glacier',
  type: 'psynergy',
  element: 'Mercury',
  manaCost: 5,
  basePower: 80,
  targets: 'single-enemy',
  unlockLevel: 3,
  description: 'Crush enemy with a gale-driven glacier.',
});

export const CRYSTAL_AQUA_REVIVAL = makeAbility({
  id: 'crystal-aqua-revival',
  name: 'Aqua Revival',
  type: 'healing',
  element: 'Mercury',
  manaCost: 5,
  basePower: 100,
  targets: 'single-ally',
  unlockLevel: 3,
  description: 'Revive a fallen ally with pure aqua energy.',
  revivesFallen: true,
});

export const CRYSTAL_MIST_BLESSING = makeAbility({
  id: 'crystal-mist-blessing',
  name: 'Mist Blessing',
  type: 'healing',
  element: 'Mercury',
  manaCost: 5,
  basePower: 70,
  targets: 'all-allies',
  unlockLevel: 3,
  description: 'Bless all allies with restorative mist, cleansing negatives and granting short immunity to burn/poison/freeze.',
  removeStatusEffects: { type: 'negative' },
  grantImmunity: { all: false, types: ['burn', 'poison', 'freeze'], duration: 1 },
});

export const CRYSTAL_ICE_TITAN = makeAbility({
  id: 'crystal-ice-titan',
  name: 'Ice Titan',
  type: 'buff',
  element: 'Mercury',
  manaCost: 4,
  basePower: 0,
  targets: 'self',
  unlockLevel: 3,
  description: 'Transform into an ice titan, boosting all defenses.',
  buffEffect: { def: 10 },
  duration: 3,
});

export const CRYSTAL_FROST_BARRIER = makeAbility({
  id: 'crystal-frost-barrier',
  name: 'Frost Barrier',
  type: 'buff',
  element: 'Mercury',
  manaCost: 5,
  basePower: 0,
  targets: 'self',
  unlockLevel: 3,
  description: 'Create an impenetrable frost barrier.',
  buffEffect: { def: 11 },
  duration: 3,
});

export const BREEZE_GALE_FORCE = makeAbility({
  id: 'breeze-gale-force',
  name: 'Gale Force',
  type: 'physical',
  element: 'Jupiter',
  manaCost: 2,
  basePower: 45,
  targets: 'single-enemy',
  unlockLevel: 1,
  description: 'Strike with gusting wind.',
});

export const BREEZE_WIND_VEIL = makeAbility({
  id: 'breeze-wind-veil',
  name: 'Wind Veil',
  type: 'buff',
  element: 'Jupiter',
  manaCost: 3,
  basePower: 0,
  targets: 'self',
  unlockLevel: 1,
  description: 'Wrap yourself in wind that also reduces incoming damage.',
  buffEffect: { def: 5 },
  duration: 3,
  damageReductionPercent: 0.15,
});

export const BREEZE_ICE_BURST = makeAbility({
  id: 'breeze-ice-burst',
  name: 'Ice Burst',
  type: 'psynergy',
  element: 'Jupiter',
  manaCost: 3,
  basePower: 55,
  targets: 'single-enemy',
  unlockLevel: 1,
  description: 'Blast cold winds adjusted for ice.',
});

export const BREEZE_AERO_SHIELD = makeAbility({
  id: 'breeze-aero-shield',
  name: 'Aero Shield',
  type: 'buff',
  element: 'Jupiter',
  manaCost: 4,
  basePower: 0,
  targets: 'self',
  unlockLevel: 1,
  description: 'Summon a protective breeze shield that can absorb a hit.',
  buffEffect: { def: 6 },
  duration: 3,
  shieldCharges: 1,
});

export const BREEZE_EDDY_PULSE = makeAbility({
  id: 'breeze-eddy-pulse',
  name: 'Eddy Pulse',
  type: 'psynergy',
  element: 'Jupiter',
  manaCost: 2,
  basePower: 45,
  targets: 'single-enemy',
  unlockLevel: 1,
  description: 'Strike with swirling eddies.',
});

export const SQUALL_STORM_BURST = makeAbility({
  id: 'squall-storm-burst',
  name: 'Storm Burst',
  type: 'psynergy',
  element: 'Jupiter',
  manaCost: 3,
  basePower: 60,
  targets: 'all-enemies',
  unlockLevel: 2,
  description: 'Unleash a burst of storm energy.',
});

export const SQUALL_HURRICANE_GUARD = makeAbility({
  id: 'squall-hurricane-guard',
  name: 'Hurricane Guard',
  type: 'buff',
  element: 'Jupiter',
  manaCost: 4,
  basePower: 0,
  targets: 'self',
  unlockLevel: 2,
  description: 'Create a hurricane that bolsters defense and reduces incoming damage.',
  buffEffect: { def: 8 },
  duration: 3,
  damageReductionPercent: 0.2,
});

export const SQUALL_WAVE_BLAST = makeAbility({
  id: 'squall-wave-blast',
  name: 'Wave Blast',
  type: 'psynergy',
  element: 'Jupiter',
  manaCost: 3,
  basePower: 55,
  targets: 'single-enemy',
  unlockLevel: 2,
  description: 'Blast foes with water-laden wind.',
});

export const SQUALL_FROST_SURGE = makeAbility({
  id: 'squall-frost-surge',
  name: 'Frost Surge',
  type: 'psynergy',
  element: 'Jupiter',
  manaCost: 3,
  basePower: 50,
  targets: 'single-enemy',
  unlockLevel: 2,
  description: 'Surge of icy wind.',
});

export const SQUALL_CLOUD_STRIKE = makeAbility({
  id: 'squall-cloud-strike',
  name: 'Cloud Strike',
  type: 'physical',
  element: 'Jupiter',
  manaCost: 2,
  basePower: 50,
  targets: 'single-enemy',
  unlockLevel: 2,
  description: 'Strike with charged cloud energy.',
});

export const STORM_CHAIN_GALE = makeAbility({
  id: 'storm-chain-gale',
  name: 'Chain Gale',
  type: 'physical',
  element: 'Jupiter',
  manaCost: 3,
  basePower: 55,
  targets: 'all-enemies',
  unlockLevel: 3,
  description: 'Chain gale strikes fall on foes.',
});

export const STORM_TEMPEST_SHIELD = makeAbility({
  id: 'storm-tempest-shield',
  name: 'Tempest Shield',
  type: 'buff',
  element: 'Jupiter',
  manaCost: 4,
  basePower: 0,
  targets: 'self',
  unlockLevel: 3,
  description: 'Shield with raging tempest while building resistance to Mercury psynergy.',
  buffEffect: { def: 10 },
  duration: 3,
  elementalResistance: { element: 'Mercury', modifier: 0.3 },
});

export const STORM_COLD_HAIL = makeAbility({
  id: 'storm-cold-hail',
  name: 'Cold Hail',
  type: 'psynergy',
  element: 'Jupiter',
  manaCost: 4,
  basePower: 70,
  targets: 'all-enemies',
  unlockLevel: 3,
  description: 'Pummel foes with icy hail.',
});

export const STORM_ICY_BARRIER = makeAbility({
  id: 'storm-icy-barrier',
  name: 'Icy Barrier',
  type: 'buff',
  element: 'Jupiter',
  manaCost: 4,
  basePower: 0,
  targets: 'self',
  unlockLevel: 3,
  description: 'Encase self in icy winds, reducing damage and gaining freeze immunity.',
  buffEffect: { def: 9 },
  duration: 3,
  damageReductionPercent: 0.15,
  grantImmunity: { all: false, types: ['freeze'], duration: 2 },
});

export const STORM_BREEZE_PULSE = makeAbility({
  id: 'storm-breeze-pulse',
  name: 'Breeze Pulse',
  type: 'psynergy',
  element: 'Jupiter',
  manaCost: 3,
  basePower: 55,
  targets: 'single-enemy',
  unlockLevel: 3,
  description: 'Pulse of concentrated breeze that splashes to nearby foes.',
  splashDamagePercent: 0.3,
});

export const DJINN_ABILITIES: Record<string, Ability> = {
  // Flint
  'flint-stone-fist': FLINT_STONE_FIST,
  'flint-granite-guard': FLINT_GRANITE_GUARD,
  'flint-lava-stone': FLINT_LAVA_STONE,
  'flint-magma-shield': FLINT_MAGMA_SHIELD,
  'flint-earth-pulse': FLINT_EARTH_PULSE,
  // Granite
  'granite-earth-wall': GRANITE_EARTH_WALL,
  'granite-terra-break': GRANITE_TERRA_BREAK,
  'granite-magma-barrier': GRANITE_MAGMA_BARRIER,
  'granite-volcanic-spike': GRANITE_VOLCANIC_SPIKE,
  'granite-ground-pulse': GRANITE_GROUND_PULSE,
  // Bane
  'bane-earthquake': BANE_EARTHQUAKE,
  'bane-terra-guard': BANE_TERRA_GUARD,
  'bane-lava-fist': BANE_LAVA_FIST,
  'bane-molten-armor': BANE_MOLTEN_ARMOR,
  'bane-rock-pulse': BANE_ROCK_PULSE,
  // Forge
  'forge-flame-strike': FORGE_FLAME_STRIKE,
  'forge-inferno-blaze': FORGE_INFERNO_BLAZE,
  'forge-stone-slam': FORGE_STONE_SLAM,
  'forge-granite-shield': FORGE_GRANITE_SHIELD,
  'forge-ember-wave': FORGE_EMBER_WAVE,
  'forge-flame-burst': FORGE_FLAME_BURST,
  'forge-inferno-shield': FORGE_INFERNO_SHIELD,
  'forge-fire-storm': FORGE_FIRE_STORM,
  'forge-stone-melt': FORGE_STONE_MELT,
  'forge-granite-burn': FORGE_GRANITE_BURN,
  'forge-ember-shield': FORGE_EMBER_SHIELD,
  'forge-heat-wave': FORGE_HEAT_WAVE,
  'forge-warmth': FORGE_WARMTH,
  'forge-flame-heal': FORGE_FLAME_HEAL,
  // Corona
  'corona-scorch': CORONA_SCORCH,
  'corona-ember-veil': CORONA_EMBER_VEIL,
  'corona-earthbreaker': CORONA_EARTHBREAKER,
  'corona-mountain-wall': CORONA_MOUNTAIN_WALL,
  'corona-solar-spin': CORONA_SOLAR_SPIN,
  'corona-solar-blast': CORONA_SOLAR_BLAST,
  'corona-flame-barrier': CORONA_FLAME_BARRIER,
  'corona-fire-nova': CORONA_FIRE_NOVA,
  'corona-earth-melt': CORONA_EARTH_MELT,
  'corona-stone-scorch': CORONA_STONE_SCORCH,
  'corona-solar-guard': CORONA_SOLAR_GUARD,
  'corona-heat-pulse': CORONA_HEAT_PULSE,
  'corona-solar-heal': CORONA_SOLAR_HEAL,
  'corona-scorch-burn': CORONA_SCORCH_BURN,
  'corona-flare-revival': CORONA_FLAME_REVIVAL,
  // Fury
  'fury-heat-rush': FURY_HEAT_RUSH,
  'fury-flare-guard': FURY_FLARE_GUARD,
  'fury-stone-barrage': FURY_STONE_BARRAGE,
  'fury-terra-gate': FURY_TERRA_GATE,
  'fury-wind-flare': FURY_WIND_FLARE,
  'fury-inferno-rage': FURY_INFERNO_RAGE,
  'fury-flame-titan': FURY_FLAME_TITAN,
  'fury-fire-apocalypse': FURY_FIRE_APOCALYPSE,
  'fury-terra-burn': FURY_TERRA_BURN,
  'fury-heat-storm': FURY_HEAT_STORM,
  'fury-flare-pulse': FURY_FLARE_PULSE,
  'fury-flame-revival': FURY_FLAME_REVIVAL,
  'fury-burn-venom': FURY_BURN_VENOM,
  'fury-inferno-blessing': FURY_INFERNO_BLESSING,
  'fury-molten-torrent': FURY_MOLTEN_TORRENT,
  // Fizz
  'fizz-ice-shard': FIZZ_ICE_SHARD,
  'fizz-wave-shield': FIZZ_WAVE_SHIELD,
  'fizz-gale-freeze': FIZZ_GALE_FREEZE,
  'fizz-storm-chill': FIZZ_STORM_CHILL,
  'fizz-aqua-pulse': FIZZ_AQUA_PULSE,
  'fizz-ice-blast': FIZZ_ICE_BLAST,
  'fizz-aqua-barrier': FIZZ_AQUA_BARRIER,
  'fizz-frost-storm': FIZZ_FROST_STORM,
  'fizz-storm-freeze': FIZZ_STORM_FREEZE,
  'fizz-healing-wave': FIZZ_HEALING_WAVE,
  'fizz-aqua-heal': FIZZ_AQUA_HEAL,
  'fizz-frost-bite': FIZZ_FROST_BITE,
  'fizz-ice-armor': FIZZ_ICE_ARMOR,
  'fizz-ice-shield': FIZZ_ICE_SHIELD,
  'fizz-ice-tornado': FIZZ_ICE_TORNADO,
  // Tonic
  'tonic-frost-bite': TONIC_FROST_BITE,
  'tonic-aqua-veil': TONIC_AQUA_VEIL,
  'tonic-wind-freeze': TONIC_WIND_FREEZE,
  'tonic-gale-barrier': TONIC_GALE_BARRIER,
  'tonic-soothing-wave': TONIC_SOOTHING_WAVE,
  'tonic-ice-horn': TONIC_ICE_HORN,
  'tonic-aqua-fortress': TONIC_AQUA_FORTRESS,
  'tonic-frost-blast': TONIC_FROST_BLAST,
  'tonic-storm-freeze': TONIC_STORM_FREEZE,
  'tonic-soothing-mist': TONIC_SOOTHING_MIST,
  'tonic-aqua-restore': TONIC_AQUA_RESTORE,
  'tonic-ice-shield': TONIC_ICE_SHIELD,
  'tonic-frost-barrier': TONIC_FROST_BARRIER,
  'tonic-ice-renewal': TONIC_ICE_RENEWAL,
  'tonic-crystal-mist': TONIC_CRYSTAL_MIST,
  // Crystal
  'crystal-crystal-ray': CRYSTAL_CRYSTAL_RAY,
  'crystal-aqua-armor': CRYSTAL_AQUA_ARMOR,
  'crystal-storm-crystal': CRYSTAL_STORM_CRYSTAL,
  'crystal-gale-glaze': CRYSTAL_GALE_GLAZE,
  'crystal-mist-veil': CRYSTAL_MIST_VEIL,
  'crystal-glacial-lance': CRYSTAL_GLACIAL_LANCE,
  'crystal-aqua-titan': CRYSTAL_AQUA_TITAN,
  'crystal-ice-apocalypse': CRYSTAL_ICE_APOCALYPSE,
  'crystal-storm-freeze': CRYSTAL_STORM_FREEZE,
  'crystal-gale-glacier': CRYSTAL_GALE_GLACIER,
  'crystal-aqua-revival': CRYSTAL_AQUA_REVIVAL,
  'crystal-mist-blessing': CRYSTAL_MIST_BLESSING,
  'crystal-ice-titan': CRYSTAL_ICE_TITAN,
  'crystal-frost-barrier': CRYSTAL_FROST_BARRIER,
  // Breeze
  'breeze-gale-force': BREEZE_GALE_FORCE,
  'breeze-wind-veil': BREEZE_WIND_VEIL,
  'breeze-ice-burst': BREEZE_ICE_BURST,
  'breeze-aero-shield': BREEZE_AERO_SHIELD,
  'breeze-eddy-pulse': BREEZE_EDDY_PULSE,
  // Squall
  'squall-storm-burst': SQUALL_STORM_BURST,
  'squall-hurricane-guard': SQUALL_HURRICANE_GUARD,
  'squall-wave-blast': SQUALL_WAVE_BLAST,
  'squall-frost-surge': SQUALL_FROST_SURGE,
  'squall-cloud-strike': SQUALL_CLOUD_STRIKE,
  // Storm
  'storm-chain-gale': STORM_CHAIN_GALE,
  'storm-tempest-shield': STORM_TEMPEST_SHIELD,
  'storm-cold-hail': STORM_COLD_HAIL,
  'storm-icy-barrier': STORM_ICY_BARRIER,
  'storm-breeze-pulse': STORM_BREEZE_PULSE,
  // Flint - new
  'flint-stone-spike': FLINT_STONE_SPIKE,
  'flint-terra-armor': FLINT_TERRA_ARMOR,
  'flint-earthquake-punch': FLINT_EARTHQUAKE_PUNCH,
  'flint-molten-burst': FLINT_MOLTEN_BURST,
  'flint-volcanic-guard': FLINT_VOLCANIC_GUARD,
  'flint-ground-shield': FLINT_GROUND_SHIELD,
  'flint-rock-barrage': FLINT_ROCK_BARRAGE,
  'flint-soothing-earth': FLINT_SOOTHING_EARTH,
  'flint-stone-bind': FLINT_STONE_BIND,
  'flint-terra-heal': FLINT_TERRA_HEAL,
  // Granite - new
  'granite-stone-spike': GRANITE_STONE_SPIKE,
  'granite-earthquake': GRANITE_EARTHQUAKE,
  'granite-stone-fortress': GRANITE_STONE_FORTRESS,
  'granite-magma-blast': GRANITE_MAGMA_BLAST,
  'granite-volcanic-armor': GRANITE_VOLCANIC_ARMOR,
  'granite-ground-wave': GRANITE_GROUND_WAVE,
  'granite-rock-shield': GRANITE_ROCK_SHIELD,
  'granite-terra-heal': GRANITE_TERRA_HEAL,
  'granite-stone-slow': GRANITE_STONE_SLOW,
  'granite-earth-revival': GRANITE_EARTH_REVIVAL,
  // Bane - new
  'bane-terra-breaker': BANE_TERRA_BREAKER,
  'bane-earthquake-rage': BANE_EARTHQUAKE_RAGE,
  'bane-stone-titan': BANE_STONE_TITAN,
  'bane-molten-torrent': BANE_MOLTEN_TORRENT,
  'bane-volcanic-rage': BANE_VOLCANIC_RAGE,
  'bane-rock-storm': BANE_ROCK_STORM,
  'bane-terra-pulse': BANE_TERRA_PULSE,
  'bane-earth-revival': BANE_EARTH_REVIVAL,
  'bane-stone-stun': BANE_STONE_STUN,
  'bane-terra-blessing': BANE_TERRA_BLESSING,
  // Core ability references needed by Djinn definitions
  'earth-spike': ABILITIES['earth-spike']!,
  'fire-burst': ABILITIES['fire-burst']!,
  'flame-wall': ABILITIES['flame-wall']!,
  'inferno-slash': ABILITIES['inferno-slash']!,
  'phoenix-flames': ABILITIES['phoenix-flames']!,
  'flame-blade': ABILITIES['flame-blade']!,
  'inferno-strike': ABILITIES['inferno-strike']!,
  'phoenix-aura': ABILITIES['phoenix-aura']!,
  'flame-jab': ABILITIES['flame-jab']!,
  'inferno-assault': ABILITIES['inferno-assault']!,
  'flame-tornado': ABILITIES['flame-tornado']!,
};
