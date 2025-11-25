/**
 * Ability Icon Mapping
 * Maps ability IDs to sprite icon IDs from Psynergy icon collection
 * Complete mappings for all 209 abilities
 */

/**
 * Maps ability IDs to sprite IDs
 * Uses available icons from /sprites/icons/psynergy/ (214 icons available)
 */
export const ABILITY_ICON_MAP: Record<string, string> = {
  // === BASIC ATTACK ABILITIES ===
  'strike': 'arrow',
  'heavy-strike': 'blast1',
  'guard-break': 'break',
  'precise-jab': 'backstab',

  // === FIRE/MARS ABILITIES ===
  'fireball': 'fire-ball',
  'fire-burst': 'burst',
  'flare': 'flare-wall',
  'burn-touch': 'fire-bomb',
  'flame-burst-damage': 'burst',
  'fire-ward-utility': 'fire-shield',
  'ignite': 'fire',
  'flame-wall': 'flare-wall',
  'inferno-slash': 'inferno',
  'blazing-fury': 'flare-storm',
  'pyroclasm': 'volcano',
  'fire-aura': 'cool-aura',
  'meteor-strike': 'meteor',
  'phoenix-flames': 'phoenix',
  'magma-burst': 'molten',
  'flame-shield': 'fire-shield',
  'supernova': 'supernova',
  'infernal-rage': 'dire-inferno',
  'dragon-breath': 'dragon-fire',
  'ragnarok-flames': 'ragnarok',
  'flame-blade': 'fire',
  'battle-cry': 'ward',
  'inferno-strike': 'inferno',
  'pyroblast': 'volcano',
  'warrior-flame': 'fire',
  'molten-slash': 'molten',
  'fire-nova': 'nova',
  'blazing-assault': 'flare-storm',
  'magma-wave': 'molten',
  'berserker-rage': 'dire-inferno',
  'crimson-fury': 'fire',
  'meteor-crash': 'meteor',
  'phoenix-aura': 'phoenix',
  'solar-flare': 'flare',
  'ultimate-warrior': 'ragnarok',
  'inferno-barrage': 'inferno',
  'supernova-strike': 'supernova',
  'flame-jab': 'fire',
  'inferno-assault': 'inferno',
  'flame-tornado': 'fire-bomb',

  // === WATER/MERCURY ABILITIES ===
  'ice-shard': 'frost',
  'freeze-blast': 'ice-horn',
  'heal': 'cure',
  'party-heal': 'cure-well',
  'cure': 'pure-ply',
  'ice-lance-damage': 'ice-missile',
  'aqua-heal-utility': 'ply',
  'cleanse': 'cure-poison',
  'frost-wave': 'icicle',
  'regen': 'healing-aura',
  'diamond-dust': 'diamond-dust',
  'mass-regen': 'wish-well',
  'glacial-shield': 'ice-shield',
  'deep-freeze': 'freeze-prism',
  'sanctuary': 'sanctuary',
  'blizzard': 'ice-horn',
  'restoration': 'restore',
  'frozen-tomb': 'ice',
  'aqua-barrier': 'water-shield',
  'absolute-zero': 'tundra',
  'leviathan-grace': 'wish-well',
  'frost-shield': 'ice-shield',
  'purify': 'cure-poison',
  'ice-spear': 'ice-missile',
  'scholar-wisdom': 'reveal',
  'glacial-wave': 'tundra',
  'renewal': 'wish',
  'frozen-spikes': 'icicle',
  'crystal-barrier': 'ice-shield',
  'ice-storm': 'hail-prism',
  'mass-restoration': 'restore',
  'frozen-tomb-karis': 'ice',
  'scholar-sanctuary': 'sanctuary',
  'blizzard-cascade': 'diamond-berg',
  'divine-renewal': 'wish-well',
  'absolute-zero-karis': 'tundra',
  'aqua-resurrection': 'revive',

  // === EARTH/VENUS ABILITIES ===
  'quake': 'quake',
  'earth-spike': 'spire',
  'earth-spike-damage': 'spire',
  'stone-skin-utility': 'guard',
  'fortify': 'guard',
  'tremor': 'tremor',
  'guardian-stance': 'ward',
  'rock-breaker': 'quake-sphere',
  'earthquake': 'earthquake',
  'stone-wall': 'stone-spire',
  'unbreakable': 'guard',
  'titan-grip': 'titan-blade',
  'gaia-shield': 'gaia',
  'petrify-strike': 'petra',
  'mountain-endurance': 'ward',
  'landslide': 'avalanche',
  'earth-blessing': 'gaia',
  'gaia-rebirth': 'revive',
  'taunt': 'taunt',
  'shield-bash': 'impact',
  'iron-wall': 'guard',
  'counter-stance': 'ward',
  'tremor-strike': 'tremor',
  'fortified-guard': 'gaurdian',
  'bulwark': 'guard',
  'crushing-blow': 'impact',
  'earthen-armor': 'guard',
  'shockwave': 'earthquake',
  'guardian-resolve': 'gaurdian',
  'titan-grip-sentinel': 'titan-blade',
  'stone-fortress': 'guard',
  'avalanche': 'avalanche',
  'immortal-bulwark': 'guard',
  'earth-splitter': 'quake-sphere',
  'atlas-stand': 'ward',
  'earth-strike': 'spire',
  'warrior-resolve': 'ward',
  'sunder-armor': 'break',
  'stone-fist': 'clay',
  'earth-shaker': 'earthquake',
  'battle-master': 'ward',
  'crushing-impact': 'impact',
  'mountain-strength': 'ward',
  'ragnarok-strike': 'ragnarok',
  'terra-shield': 'gaia',
  'grand-impact': 'impact',
  'legendary-warrior': 'ragnarok',
  'titan-fall': 'titan-blade',
  'earth-judgment': 'judgment',
  'master-aura': 'cool-aura',
  'gaia-blade': 'gaia',

  // === WIND/JUPITER ABILITIES ===
  'gust': 'gust',
  'chain-lightning': 'spark-plasma',
  'paralyze-shock': 'thunder-mine',
  'gale-force-damage': 'whirlwind',
  'wind-barrier-utility': 'wind-shield',
  'swift-strike': 'quick-strike',
  'shock-bolt': 'bolt',
  'tempest': 'tempest',
  'hurricane-slash': 'hurricane',
  'plasma-shot': 'plasma',
  'cyclone': 'cyclone',
  'thunder-god-fury': 'judgement-bolt',
  'storm-blessing': 'wish',
  'judgment-bolt': 'judgement-bolt',
  'static-field': 'lightning-bomb',
  'wind-walker': 'quick-strike',
  'maelstrom': 'tornado',
  'zeus-wrath': 'thoron',
  'storm-sovereign': 'thor',
  'thunder-clap': 'thunderclap',
  'storm-call': 'storm-ray',
  'static-charge': 'spark-plasma',
  'lightning-arc': 'slash',
  'shock-pulse': 'shock',
  'wind-mastery': 'whirlwind',
  'thunder-storm': 'thunderstorm',
  'electric-overload': 'plasma',
  'storm-shield': 'wind-shield',
  'bolt-barrage': 'thoron',
  'hurricane-force': 'hurricane',
  'thor-hammer': 'thor',
  'lightning-sanctuary': 'sanctuary',
  'apocalyptic-storm': 'tempest',
  'god-thunder': 'thor',
  'world-storm': 'storm-ray',
  'tempest-tyrant': 'tempest',

  // === STATUS/DEBUFF ABILITIES ===
  'blind': 'baffle-card',
  'poison-strike': 'venom-fang',
  'weaken-def': 'debilitate',

  // === BUFF/UTILITY ABILITIES ===
  'boost-atk': 'boost',
  'boost-def': 'resist',
  'guard': 'ward',
  'focus-strike-neutral': 'quick-strike',

  // === WEAPON-BASED ABILITIES ===
  'wooden-strike': 'arrow',
  'bronze-slash': 'slash',
  'iron-bulwark': 'guard',
  'arcane-bolt': 'bolt',
  'iron-thrust': 'arrow',
  'steel-focus': 'quick-strike',
  'steel-ward': 'ward',
  'axe-cleave': 'slash',
  'iron-mind': 'ward',
  'silver-shield': 'guard',
  'mythril-wisdom': 'reveal',
  'hyper-speed': 'quick-strike',
  'mythril-edge': 'slash',
  'dragon-ward': 'ward',
  'oracle-vision': 'reveal',
  'steel-slash': 'slash',
  'crystal-blast': 'blast1',
  'silver-strike': 'slash',
  'great-cleave': 'slash',
  'zodiac-bolt': 'bolt',

  // === COMBAT ABILITIES ===
  'rapid-strikes': 'quick-strike',
  'assassinate': 'backstab',
  'combat-focus': 'quick-strike',
  'flurry': 'quick-strike',
  'precision-strike': 'backstab',
  'blood-rush': 'quick-strike',
  'death-strike': 'backstab',
  'perfect-form': 'ward',
  'obliterate': 'blast2',
  'unstoppable-force': 'impact',
  'supreme-focus': 'quick-strike',
  'annihilation': 'blast2',
  'one-thousand-cuts': 'quick-strike',
};

/**
 * Get sprite ID for an ability
 * Returns fallback icon if ability not recognized
 */
export function getAbilityIconSprite(abilityId: string): string {
  return ABILITY_ICON_MAP[abilityId] || 'psynergy';  // Default to generic Psynergy icon
}

/**
 * Check if an ability has a mapped icon
 */
export function hasAbilityIcon(abilityId: string): boolean {
  return abilityId in ABILITY_ICON_MAP;
}

/**
 * Convert an ability icon ID to a psynergy FX sprite path (GIF)
 * Returns null if no icon is mapped.
 */
export function getAbilityEffectSprite(abilityId: string): string | null {
  const iconId = ABILITY_ICON_MAP[abilityId];
  if (!iconId) return null;

  // Convert kebab/slug to Title_Case used by GIF filenames
  const parts = iconId.split(/[^a-zA-Z0-9]+/).filter(Boolean);
  if (parts.length === 0) return null;
  const fileName = parts.map(p => p.charAt(0).toUpperCase() + p.slice(1)).join('_');
  return `/sprites/psynergy/${fileName}.gif`;
}

/**
 * Get all mapped ability IDs
 */
export function getMappedAbilities(): string[] {
  return Object.keys(ABILITY_ICON_MAP);
}
