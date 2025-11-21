/**
 * Status Effect Icon Mapping
 * Maps status effect types to sprite icon IDs
 */

export type StatusEffectType =
  | 'poison'
  | 'burn'
  | 'freeze'
  | 'paralyze'
  | 'stun'
  | 'sleep'
  | 'confuse'
  | 'weaken'
  | 'strengthen';

/**
 * Maps status effect types to sprite IDs
 * Uses available icons from /sprites/icons/psynergy/ and /sprites/icons/misc/
 */
export const STATUS_ICON_MAP: Record<StatusEffectType, string> = {
  // Direct matches from available sprites
  'poison': 'poison-flow',      // Poison_Flow.gif
  'freeze': 'freeze-prism',     // Freeze_Prism.gif
  'sleep': 'sleep',             // Sleep.gif
  'weaken': 'weaken',           // Weaken.gif

  // Inferred from Psynergy icons (need verification)
  'burn': 'fire',               // Use fire icon as placeholder
  'paralyze': 'lightning',      // Use lightning icon
  'stun': 'dizzy',              // Use dizzy/sweatdrop as fallback
  'confuse': 'sweatdrop',       // Sweatdrop.gif
  'strengthen': 'status',       // Status.gif for buff indication
};

/**
 * Get sprite ID for a status effect
 * Returns fallback if status type not recognized
 */
export function getStatusIconSprite(status: string): string {
  const statusType = status.toLowerCase() as StatusEffectType;
  return STATUS_ICON_MAP[statusType] || 'status';
}

/**
 * Check if a status effect has an icon
 */
export function hasStatusIcon(status: string): boolean {
  const statusType = status.toLowerCase() as StatusEffectType;
  return statusType in STATUS_ICON_MAP;
}
