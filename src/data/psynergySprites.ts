/**
 * Psynergy Sprite Mapping for Vale Chronicles
 *
 * Maps Vale Village ability IDs to Golden Sun psynergy sprite assets.
 * Sprite files are located in: /public/sprites/psynergy/
 * These are animated GIFs from Golden Sun that play once.
 *
 * Available sprites (19 total):
 * - Blue_Bolt.gif, Deluge.gif, Destruct_Ray.gif, Dragon_Fire.gif
 * - Fiery_Blast.gif, Freeze_Prism.gif, Froth_Spiral.gif, Fume.gif
 * - Glacier.gif, Grand_Gaia.gif, Heat_Wave.gif, Ice_Missile.gif
 * - Inferno.gif, Nettle.gif, Pyroclasm.gif, Sonic_Slash.gif
 * - Spark_Plasma.gif, Supernova.gif, Tempest.gif
 *
 * Mapping strategy:
 * - Direct matches where possible (pyroclasm → Pyroclasm.gif)
 * - Thematic matches for similar spells (quake → Grand_Gaia.gif)
 * - Reuse sprites for buff/heal spells (use defensive-looking effects)
 */

// ============================================
// Ability ID to Sprite Mapping
// ============================================

export const ABILITY_TO_SPRITE: Record<string, string> = {
  // =====================
  // PHYSICAL ATTACKS (No animation - use AttackAnimation component)
  // =====================
  slash: '', // Will use AttackAnimation instead
  cleave: '', // Will use AttackAnimation instead

  // =====================
  // VENUS (Earth) Abilities
  // =====================
  quake: '/sprites/psynergy/Grand_Gaia.gif', // Earth eruption AOE
  'clay-spire': '/sprites/psynergy/Nettle.gif', // Earth spikes
  ragnarok: '/sprites/psynergy/Dragon_Fire.gif', // Legendary earth blade
  judgment: '/sprites/psynergy/Supernova.gif', // Ultimate earth judgment
  megiddo: '/sprites/psynergy/Destruct_Ray.gif', // Legendary sword beam

  // =====================
  // MARS (Fire) Abilities
  // =====================
  fireball: '/sprites/psynergy/Fiery_Blast.gif', // Basic fire
  volcano: '/sprites/psynergy/Inferno.gif', // Fiery eruption AOE
  'meteor-strike': '/sprites/psynergy/Pyroclasm.gif', // Meteor impact
  pyroclasm: '/sprites/psynergy/Pyroclasm.gif', // Ultimate fire explosion (same as meteor)

  // =====================
  // MERCURY (Water/Ice) Abilities
  // =====================
  ply: '/sprites/psynergy/Froth_Spiral.gif', // Healing water waves
  frost: '/sprites/psynergy/Ice_Missile.gif', // Ice attack
  'ice-horn': '/sprites/psynergy/Glacier.gif', // Powerful ice spear
  wish: '/sprites/psynergy/Deluge.gif', // Party heal (water cascade)
  'glacial-blessing': '/sprites/psynergy/Freeze_Prism.gif', // Ultimate healing with shimmer

  // =====================
  // JUPITER (Wind/Lightning) Abilities
  // =====================
  gust: '/sprites/psynergy/Sonic_Slash.gif', // Wind slash
  plasma: '/sprites/psynergy/Spark_Plasma.gif', // Chaining lightning
  thunderclap: '/sprites/psynergy/Blue_Bolt.gif', // Thunder strike
  tempest: '/sprites/psynergy/Tempest.gif', // Ultimate wind storm

  // =====================
  // BUFF/SUPPORT Abilities
  // =====================
  blessing: '/sprites/psynergy/Heat_Wave.gif', // ATK/DEF buff (golden aura)
  'guardians-stance': '/sprites/psynergy/Nettle.gif', // DEF buff (earth barrier)
  'winds-favor': '/sprites/psynergy/Sonic_Slash.gif', // SPD/Evasion buff (wind movement)
};

// ============================================
// Fallback Sprite
// ============================================

/**
 * Default sprite if ability ID not found in map
 */
export const DEFAULT_PSYNERGY_SPRITE = '/sprites/psynergy/Nettle.gif';

// ============================================
// Helper Functions
// ============================================

/**
 * Get psynergy sprite URL for an ability ID
 *
 * Returns empty string for physical attacks (should use AttackAnimation instead).
 * Returns mapped sprite for psynergy/healing/buff abilities.
 * Returns default sprite if ability not found.
 *
 * @param abilityId - The ability ID from abilities.ts
 * @returns URL path to sprite GIF, or empty string for physical attacks
 */
export function getPsynergySprite(abilityId: string): string {
  const sprite = ABILITY_TO_SPRITE[abilityId];

  // Return empty string for physical attacks (signals to use AttackAnimation)
  if (sprite === '') {
    return '';
  }

  // Return mapped sprite or fallback
  return sprite || DEFAULT_PSYNERGY_SPRITE;
}

/**
 * Check if an ability should use psynergy animation
 *
 * Physical attacks return false (use AttackAnimation instead).
 * All psynergy, healing, and buff abilities return true.
 *
 * @param abilityId - The ability ID from abilities.ts
 * @returns true if ability should show psynergy animation
 */
export function shouldShowPsynergyAnimation(abilityId: string): boolean {
  const sprite = getPsynergySprite(abilityId);
  return sprite !== '';
}
