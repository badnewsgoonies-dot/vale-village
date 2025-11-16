/**
 * Ability Icon Mapping
 * Maps ability IDs to sprite icon IDs from Psynergy icon collection
 */

/**
 * Maps ability IDs to sprite IDs
 * Uses available icons from /sprites/icons/psynergy/ (214 icons available)
 */
export const ABILITY_ICON_MAP: Record<string, string> = {
  // Attack Abilities
  'strike': 'arrow',                  // Arrow.gif
  'heavy-strike': 'blast1',           // Blast1.gif
  'guard-break': 'break',             // Break.gif
  'precise-jab': 'backstab',          // Backstab.gif

  // Fire/Mars Abilities
  'fireball': 'fire-ball',            // Fire_Ball.gif
  'fire-burst': 'burst',              // Burst.gif
  'flare': 'flare-wall',              // Flare_Wall.gif
  'burn-touch': 'fire-bomb',          // Fire_Bomb.gif

  // Water/Mercury Abilities
  'ice-shard': 'frost',               // Frost.gif
  'freeze-blast': 'ice-horn',         // Ice_Horn.gif
  'heal': 'cure',                     // Cure.gif
  'party-heal': 'cure-well',          // Cure_Well.gif
  'cure': 'pure-ply',                 // Pure_Ply.gif

  // Earth/Venus Abilities
  'quake': 'quake',                   // Quake.gif
  'earth-spike': 'spire',             // Spire.gif

  // Wind/Jupiter Abilities
  'gust': 'gust',                     // Gust.gif
  'chain-lightning': 'spark-plasma',   // Spark_Plasma.gif
  'paralyze-shock': 'thunder-mine',   // Thunder_Mine.gif

  // Status/Debuff Abilities
  'blind': 'baffle-card',             // Baffle_Card.gif
  'poison-strike': 'venom-fang',      // Venom_Fang.gif
  'weaken-def': 'debilitate',         // Debilitate.gif

  // Buff Abilities
  'boost-atk': 'boost',               // Boost.gif
  'boost-def': 'resist',              // Resist.gif
  'guard': 'ward',                    // Ward.gif
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
 * Get all mapped ability IDs
 */
export function getMappedAbilities(): string[] {
  return Object.keys(ABILITY_ICON_MAP);
}
