import type { Djinn } from '../schemas/DjinnSchema';

export const FLINT: Djinn = {
  id: 'flint',
  name: 'Flint',
  element: 'Venus',
  tier: '1',
  summonEffect: {
    type: 'damage',
    description: 'Stone Barrage scatters earth shards at all foes.',
    damage: 80,
  },
  grantedAbilities: {
    adept: {
      same: [
        'flint-stone-fist',
        'flint-granite-guard',
        'flint-stone-spike',
        'flint-terra-armor',
        'flint-earthquake-punch',
      ],
      counter: [],
      neutral: [
        'flint-earth-pulse',
        'flint-ground-shield',
        'flint-rock-barrage',
      ],
    },
    sentinel: {
      same: [
        'flint-stone-fist',
        'flint-granite-guard',
        'flint-stone-spike',
        'flint-terra-armor',
        'flint-earthquake-punch',
      ],
      counter: [],
      neutral: [
        'flint-earth-pulse',
        'flint-ground-shield',
        'flint-rock-barrage',
      ],
    },
    'war-mage': {
      same: [],
      counter: [
        'flint-lava-stone',
        'flint-magma-shield',
        'flint-molten-burst',
        'flint-volcanic-guard',
      ],
      neutral: ['flint-ground-shield', 'flint-rock-barrage'],
    },
    mystic: {
      same: [],
      counter: [],
      neutral: [
        'flint-earth-pulse',
        'flint-ground-shield',
        'flint-rock-barrage',
        'flint-soothing-earth',
        'flint-terra-heal',
      ],
    },
    ranger: {
      same: [],
      counter: [],
      neutral: [
        'flint-earth-pulse',
        'flint-ground-shield',
        'flint-rock-barrage',
        'flint-soothing-earth',
        'flint-terra-heal',
      ],
    },
    stormcaller: {
      same: [],
      counter: [],
      neutral: [
        'flint-earth-pulse',
        'flint-ground-shield',
        'flint-rock-barrage',
        'flint-soothing-earth',
        'flint-terra-heal',
      ],
    },
  },
};

export const GRANITE: Djinn = {
  id: 'granite',
  name: 'Granite',
  element: 'Venus',
  tier: '2',
  summonEffect: {
    type: 'buff',
    description: 'Terra Wall raises nearby allies’ defenses.',
    statBonus: { def: 10 },
  },
  grantedAbilities: {
    adept: {
      same: [
        'granite-earth-wall',
        'granite-terra-break',
        'granite-stone-spike',
        'granite-earthquake',
        'granite-stone-fortress',
      ],
      counter: [],
      neutral: [
        'granite-ground-pulse',
        'granite-ground-wave',
        'granite-rock-shield',
      ],
    },
    sentinel: {
      same: [
        'granite-earth-wall',
        'granite-terra-break',
        'granite-stone-spike',
        'granite-earthquake',
        'granite-stone-fortress',
      ],
      counter: [],
      neutral: [
        'granite-ground-pulse',
        'granite-ground-wave',
        'granite-rock-shield',
      ],
    },
    'war-mage': {
      same: [],
      counter: [
        'granite-magma-barrier',
        'granite-volcanic-spike',
        'granite-magma-blast',
        'granite-volcanic-armor',
      ],
      neutral: ['granite-ground-wave', 'granite-rock-shield'],
    },
    mystic: {
      same: [],
      counter: [],
      neutral: [
        'granite-ground-pulse',
        'granite-ground-wave',
        'granite-rock-shield',
        'granite-terra-heal',
        'granite-earth-revival',
      ],
    },
    ranger: {
      same: [],
      counter: [],
      neutral: [
        'granite-ground-pulse',
        'granite-ground-wave',
        'granite-rock-shield',
        'granite-terra-heal',
        'granite-earth-revival',
      ],
    },
    stormcaller: {
      same: [],
      counter: [],
      neutral: [
        'granite-ground-pulse',
        'granite-ground-wave',
        'granite-rock-shield',
        'granite-terra-heal',
        'granite-earth-revival',
      ],
    },
  },
};

export const BANE: Djinn = {
  id: 'bane',
  name: 'Bane',
  element: 'Venus',
  tier: '3',
  summonEffect: {
    type: 'damage',
    description: 'Earthquake shakes the whole battlefield.',
    damage: 300,
  },
  grantedAbilities: {
    adept: {
      same: [
        'bane-earthquake',
        'bane-terra-guard',
        'bane-terra-breaker',
        'bane-earthquake-rage',
        'bane-stone-titan',
      ],
      counter: [],
      neutral: [
        'bane-rock-pulse',
        'bane-rock-storm',
        'bane-terra-pulse',
      ],
    },
    sentinel: {
      same: [
        'bane-earthquake',
        'bane-terra-guard',
        'bane-terra-breaker',
        'bane-earthquake-rage',
        'bane-stone-titan',
      ],
      counter: [],
      neutral: [
        'bane-rock-pulse',
        'bane-rock-storm',
        'bane-terra-pulse',
      ],
    },
    'war-mage': {
      same: [],
      counter: [
        'bane-lava-fist',
        'bane-molten-armor',
        'bane-molten-torrent',
        'bane-volcanic-rage',
      ],
      neutral: ['bane-rock-storm', 'bane-terra-pulse'],
    },
    mystic: {
      same: [],
      counter: [],
      neutral: [
        'bane-rock-pulse',
        'bane-rock-storm',
        'bane-terra-pulse',
        'bane-earth-revival',
        'bane-terra-blessing',
      ],
    },
    ranger: {
      same: [],
      counter: [],
      neutral: [
        'bane-rock-pulse',
        'bane-rock-storm',
        'bane-terra-pulse',
        'bane-earth-revival',
        'bane-terra-blessing',
      ],
    },
    stormcaller: {
      same: [],
      counter: [],
      neutral: [
        'bane-rock-pulse',
        'bane-rock-storm',
        'bane-terra-pulse',
        'bane-earth-revival',
        'bane-terra-blessing',
      ],
    },
  },
};

export const FORGE: Djinn = {
  id: 'forge',
  name: 'Forge',
  element: 'Mars',
  tier: '1',
  summonEffect: {
    type: 'damage',
    description: 'Firebolt barrage burns every foe.',
    damage: 120,
  },
  grantedAbilities: {
    adept: {
      same: [],
      counter: [
        'forge-stone-slam',
        'forge-granite-shield',
        'forge-stone-melt',
        'forge-granite-burn',
      ],
      neutral: [
        'forge-ember-wave',
        'forge-ember-shield',
        'forge-heat-wave',
        'forge-flame-heal',
      ],
    },
    sentinel: {
      same: [],
      counter: [
        'forge-stone-slam',
        'forge-granite-shield',
        'forge-stone-melt',
        'forge-granite-burn',
      ],
      neutral: [
        'forge-ember-wave',
        'forge-ember-shield',
        'forge-heat-wave',
        'forge-flame-heal',
      ],
    },
    'war-mage': {
      same: [
        'forge-flame-strike',
        'forge-inferno-blaze',
        'forge-flame-burst',
        'forge-inferno-shield',
        'forge-fire-storm',
      ],
      counter: [],
      neutral: [
        'forge-ember-wave',
        'forge-ember-shield',
        'forge-heat-wave',
        'forge-flame-heal',
      ],
    },
    mystic: {
      same: [],
      counter: ['forge-stone-melt', 'forge-granite-burn'],
      neutral: [
        'forge-ember-wave',
        'forge-ember-shield',
        'forge-heat-wave',
        'forge-warmth',
        'forge-flame-heal',
      ],
    },
    ranger: {
      same: [],
      counter: [],
      neutral: [
        'forge-ember-wave',
        'forge-ember-shield',
        'forge-heat-wave',
        'forge-warmth',
        'forge-flame-heal',
      ],
    },
    stormcaller: {
      same: [],
      counter: [],
      neutral: [
        'forge-ember-wave',
        'forge-ember-shield',
        'forge-heat-wave',
        'forge-warmth',
        'forge-flame-heal',
      ],
    },
  },
};

export const CORONA: Djinn = {
  id: 'corona',
  name: 'Corona',
  element: 'Mars',
  tier: '2',
  summonEffect: {
    type: 'buff',
    description: 'Flame field heals the party.',
    statBonus: { mag: 8 },
  },
  grantedAbilities: {
    adept: {
      same: [],
      counter: [
        'corona-earthbreaker',
        'corona-mountain-wall',
        'corona-earth-melt',
        'corona-stone-scorch',
      ],
      neutral: [
        'corona-solar-spin',
        'corona-solar-guard',
        'corona-heat-pulse',
        'corona-solar-heal',
      ],
    },
    sentinel: {
      same: [],
      counter: [
        'corona-earthbreaker',
        'corona-mountain-wall',
        'corona-earth-melt',
        'corona-stone-scorch',
      ],
      neutral: [
        'corona-solar-spin',
        'corona-solar-guard',
        'corona-heat-pulse',
        'corona-solar-heal',
      ],
    },
    'war-mage': {
      same: [
        'corona-scorch',
        'corona-ember-veil',
        'corona-solar-blast',
        'corona-flame-barrier',
        'corona-fire-nova',
      ],
      counter: [],
      neutral: [
        'corona-solar-spin',
        'corona-solar-guard',
        'corona-heat-pulse',
        'corona-solar-heal',
      ],
    },
    mystic: {
      same: [],
      counter: [],
      neutral: [
        'corona-solar-spin',
        'corona-solar-guard',
        'corona-heat-pulse',
        'corona-solar-heal',
        'corona-flare-revival',
      ],
    },
    ranger: {
      same: [],
      counter: [],
      neutral: [
        'corona-solar-spin',
        'corona-solar-guard',
        'corona-heat-pulse',
        'corona-solar-heal',
        'corona-flare-revival',
      ],
    },
    stormcaller: {
      same: [],
      counter: [],
      neutral: [
        'corona-solar-spin',
        'corona-solar-guard',
        'corona-heat-pulse',
        'corona-solar-heal',
        'corona-flare-revival',
      ],
    },
  },
};

export const FURY: Djinn = {
  id: 'fury',
  name: 'Fury',
  element: 'Mars',
  tier: '3',
  summonEffect: {
    type: 'damage',
    description: 'Blazing torrent devastates enemies.',
    damage: 220,
  },
  grantedAbilities: {
    adept: {
      same: [],
      counter: [
        'fury-stone-barrage',
        'fury-terra-gate',
        'fury-molten-torrent',
        'fury-terra-burn',
      ],
      neutral: [
        'fury-wind-flare',
        'fury-heat-storm',
        'fury-flare-pulse',
        'fury-flame-revival',
      ],
    },
    sentinel: {
      same: [],
      counter: [
        'fury-stone-barrage',
        'fury-terra-gate',
        'fury-molten-torrent',
        'fury-terra-burn',
      ],
      neutral: [
        'fury-wind-flare',
        'fury-heat-storm',
        'fury-flare-pulse',
        'fury-flame-revival',
      ],
    },
    'war-mage': {
      same: [
        'fury-heat-rush',
        'fury-flare-guard',
        'fury-inferno-rage',
        'fury-flame-titan',
        'fury-fire-apocalypse',
      ],
      counter: [],
      neutral: [
        'fury-wind-flare',
        'fury-heat-storm',
        'fury-flare-pulse',
        'fury-flame-revival',
      ],
    },
    mystic: {
      same: [],
      counter: [
        'fury-molten-torrent',
        'fury-terra-burn',
        'fury-burn-venom',
      ],
      neutral: [
        'fury-wind-flare',
        'fury-heat-storm',
        'fury-flare-pulse',
        'fury-inferno-blessing',
      ],
    },
    ranger: {
      same: [
        'fury-inferno-rage',
        'fury-flame-titan',
        'fury-fire-apocalypse',
      ],
      counter: [],
      neutral: [
        'fury-wind-flare',
        'fury-heat-storm',
        'fury-flare-pulse',
        'fury-inferno-blessing',
      ],
    },
    stormcaller: {
      same: [
        'fury-inferno-rage',
        'fury-flame-titan',
        'fury-fire-apocalypse',
      ],
      counter: [],
      neutral: [
        'fury-wind-flare',
        'fury-heat-storm',
        'fury-flare-pulse',
        'fury-inferno-blessing',
      ],
    },
  },
};

export const FIZZ: Djinn = {
  id: 'fizz',
  name: 'Fizz',
  element: 'Mercury',
  tier: '1',
  summonEffect: {
    type: 'damage',
    description: 'Shards of ice sweep across enemies.',
    damage: 100,
  },
  grantedAbilities: {
    adept: {
      same: [],
      counter: [],
      neutral: ['fizz-aqua-pulse'],
    },
    sentinel: {
      same: [],
      counter: [],
      neutral: ['fizz-aqua-pulse'],
    },
    'war-mage': {
      same: [],
      counter: ['fizz-gale-freeze', 'fizz-storm-chill'],
      neutral: ['fizz-aqua-pulse'],
    },
    mystic: {
      same: ['fizz-healing-wave', 'fizz-wave-shield'],
      counter: [],
      neutral: ['fizz-aqua-pulse'],
    },
    ranger: {
      same: [],
      counter: [],
      neutral: ['fizz-aqua-pulse'],
    },
    stormcaller: {
      same: [],
      counter: [],
      neutral: ['fizz-aqua-pulse'],
    },
  },
};

export const TONIC: Djinn = {
  id: 'tonic',
  name: 'Tonic',
  element: 'Mercury',
  tier: '2',
  summonEffect: {
    type: 'heal',
    description: 'Healing mist restores allies.',
    healAmount: 80,
  },
  grantedAbilities: {
    adept: {
      same: [],
      counter: [],
      neutral: ['tonic-soothing-wave'],
    },
    sentinel: {
      same: [],
      counter: [],
      neutral: ['tonic-soothing-wave'],
    },
    'war-mage': {
      same: [],
      counter: ['tonic-wind-freeze', 'tonic-gale-barrier'],
      neutral: ['tonic-soothing-wave'],
    },
    mystic: {
      same: ['tonic-frost-bite', 'tonic-aqua-veil'],
      counter: [],
      neutral: ['tonic-soothing-wave'],
    },
    ranger: {
      same: [],
      counter: [],
      neutral: ['tonic-soothing-wave'],
    },
    stormcaller: {
      same: [],
      counter: [],
      neutral: ['tonic-soothing-wave'],
    },
  },
};

export const CRYSTAL: Djinn = {
  id: 'crystal',
  name: 'Crystal',
  element: 'Mercury',
  tier: '3',
  summonEffect: {
    type: 'buff',
    description: 'Crystal prism boosts allies’ magical power.',
    statBonus: { mag: 12 },
  },
  grantedAbilities: {
    adept: {
      same: [],
      counter: [],
      neutral: ['crystal-mist-veil'],
    },
    sentinel: {
      same: [],
      counter: [],
      neutral: ['crystal-mist-veil'],
    },
    'war-mage': {
      same: [],
      counter: ['crystal-storm-crystal', 'crystal-gale-glaze'],
      neutral: ['crystal-mist-veil'],
    },
    mystic: {
      same: ['crystal-crystal-ray', 'crystal-aqua-armor'],
      counter: [],
      neutral: ['crystal-mist-veil'],
    },
    ranger: {
      same: [],
      counter: [],
      neutral: ['crystal-mist-veil'],
    },
    stormcaller: {
      same: [],
      counter: [],
      neutral: ['crystal-mist-veil'],
    },
  },
};

export const BREEZE: Djinn = {
  id: 'breeze',
  name: 'Breeze',
  element: 'Jupiter',
  tier: '1',
  summonEffect: {
    type: 'damage',
    description: 'Gale shards sweep every enemy.',
    damage: 110,
  },
  grantedAbilities: {
    adept: {
      same: [],
      counter: [],
      neutral: ['breeze-eddy-pulse'],
    },
    sentinel: {
      same: [],
      counter: [],
      neutral: ['breeze-eddy-pulse'],
    },
    'war-mage': {
      same: [],
      counter: ['breeze-ice-burst', 'breeze-aero-shield'],
      neutral: ['breeze-eddy-pulse'],
    },
    mystic: {
      same: [],
      counter: ['breeze-ice-burst', 'breeze-aero-shield'],
      neutral: ['breeze-eddy-pulse'],
    },
    ranger: {
      same: ['breeze-gale-force', 'breeze-wind-veil'],
      counter: [],
      neutral: ['breeze-eddy-pulse'],
    },
    stormcaller: {
      same: ['breeze-gale-force', 'breeze-wind-veil'],
      counter: [],
      neutral: ['breeze-eddy-pulse'],
    },
  },
};

export const SQUALL: Djinn = {
  id: 'squall',
  name: 'Squall',
  element: 'Jupiter',
  tier: '2',
  summonEffect: {
    type: 'damage',
    description: 'Storm burst rains down on foes.',
    damage: 160,
  },
  grantedAbilities: {
    adept: {
      same: [],
      counter: ['squall-wave-blast', 'squall-frost-surge'],
      neutral: ['squall-cloud-strike'],
    },
    sentinel: {
      same: [],
      counter: ['squall-wave-blast', 'squall-frost-surge'],
      neutral: ['squall-cloud-strike'],
    },
    'war-mage': {
      same: [],
      counter: ['squall-wave-blast', 'squall-frost-surge'],
      neutral: ['squall-cloud-strike'],
    },
    mystic: {
      same: [],
      counter: ['squall-wave-blast', 'squall-frost-surge'],
      neutral: ['squall-cloud-strike'],
    },
    ranger: {
      same: ['squall-storm-burst', 'squall-hurricane-guard'],
      counter: [],
      neutral: ['squall-cloud-strike'],
    },
    stormcaller: {
      same: ['squall-storm-burst', 'squall-hurricane-guard'],
      counter: [],
      neutral: ['squall-cloud-strike'],
    },
  },
};

export const STORM: Djinn = {
  id: 'storm',
  name: 'Storm',
  element: 'Jupiter',
  tier: '3',
  summonEffect: {
    type: 'special',
    description: 'Tempest swirl inflicts chaos and lightning.',
  },
  grantedAbilities: {
    adept: {
      same: [],
      counter: ['storm-cold-hail', 'storm-icy-barrier'],
      neutral: ['storm-breeze-pulse'],
    },
    sentinel: {
      same: [],
      counter: ['storm-cold-hail', 'storm-icy-barrier'],
      neutral: ['storm-breeze-pulse'],
    },
    'war-mage': {
      same: [],
      counter: ['storm-cold-hail', 'storm-icy-barrier'],
      neutral: ['storm-breeze-pulse'],
    },
    mystic: {
      same: [],
      counter: ['storm-cold-hail', 'storm-icy-barrier'],
      neutral: ['storm-breeze-pulse'],
    },
    ranger: {
      same: ['storm-chain-gale', 'storm-tempest-shield'],
      counter: [],
      neutral: ['storm-breeze-pulse'],
    },
    stormcaller: {
      same: ['storm-chain-gale', 'storm-tempest-shield'],
      counter: [],
      neutral: ['storm-breeze-pulse'],
    },
  },
};

// VS1 Demo Djinn (simplified for demo)
export const ROCKLING: Djinn = {
  id: 'rockling',
  name: 'Rockling',
  element: 'Venus',
  tier: '1',
  summonEffect: {
    type: 'damage',
    description: 'Earth spike pierces a single foe.',
    damage: 46,
  },
  grantedAbilities: {
    adept: {
      same: ['earth-spike'],
      counter: [],
      neutral: [],
    },
    sentinel: {
      same: ['earth-spike'],
      counter: [],
      neutral: [],
    },
    'war-mage': {
      same: [],
      counter: [],
      neutral: ['earth-spike'],
    },
    mystic: {
      same: [],
      counter: [],
      neutral: [],
    },
    ranger: {
      same: [],
      counter: [],
      neutral: [],
    },
    stormcaller: {
      same: [],
      counter: [],
      neutral: [],
    },
  },
};

export const EMBER: Djinn = {
  id: 'ember',
  name: 'Ember',
  element: 'Mars',
  tier: '1',
  summonEffect: {
    type: 'damage',
    description: 'Fire burst engulfs a single foe.',
    damage: 46,
  },
  grantedAbilities: {
    adept: {
      same: ['fire-burst'],
      counter: [],
      neutral: [],
    },
    sentinel: {
      same: [],
      counter: [],
      neutral: [],
    },
    'war-mage': {
      same: ['fire-burst'],
      counter: [],
      neutral: [],
    },
    mystic: {
      same: [],
      counter: [],
      neutral: [],
    },
    ranger: {
      same: [],
      counter: [],
      neutral: [],
    },
    stormcaller: {
      same: [],
      counter: [],
      neutral: [],
    },
  },
};

export const NOVA: Djinn = {
  id: 'nova',
  name: 'Nova',
  element: 'Mars',
  tier: '3',
  summonEffect: {
    type: 'damage',
    description: 'Nova erupts with starfire, scorching every foe.',
    damage: 320,
  },
  grantedAbilities: {
    'war-mage': {
      same: ['flame-wall', 'inferno-slash', 'phoenix-flames'],
      counter: ['granite-magma-barrier', 'granite-volcanic-spike'],
      neutral: ['flint-ground-shield'],
    },
    blaze: {
      same: ['flame-blade', 'inferno-strike', 'phoenix-aura'],
      counter: ['granite-volcanic-armor'],
      neutral: ['flint-rock-barrage'],
    },
    tyrell: {
      same: ['flame-jab', 'inferno-assault', 'flame-tornado'],
      counter: ['flint-earth-pulse'],
      neutral: ['granite-ground-wave'],
    },
    adept: {
      same: ['granite-earth-wall'],
      counter: [],
      neutral: ['flint-ground-shield'],
    },
    sentinel: {
      same: ['granite-earth-wall', 'granite-terra-break'],
      counter: ['flame-wall'],
      neutral: ['flint-ground-shield'],
    },
    mystic: {
      same: ['fizz-healing-wave', 'fizz-aqua-heal'],
      counter: ['flame-wall'],
      neutral: ['fizz-wave-shield'],
    },
    ranger: {
      same: ['breeze-gale-force', 'breeze-wind-veil'],
      counter: ['flame-wall'],
      neutral: ['breeze-eddy-pulse'],
    },
    stormcaller: {
      same: ['breeze-gale-force', 'breeze-wind-veil'],
      counter: ['flame-wall'],
      neutral: ['breeze-eddy-pulse'],
    },
  },
  availableIn: ['tower'],
};

export const DJINN: Record<string, Djinn> = {
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
  // VS1 Demo
  rockling: ROCKLING,
  ember: EMBER,
  nova: NOVA,
};
