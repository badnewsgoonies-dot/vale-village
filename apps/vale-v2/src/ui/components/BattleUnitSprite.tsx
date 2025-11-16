/**
 * BattleUnitSprite Component
 * Wrapper around SimpleSprite component for unit display with real sprite assets
 */

import { SimpleSprite } from '../sprites/SimpleSprite';

interface BattleUnitSpriteProps {
  /** Unit ID (e.g., 'adept', 'test-warrior-1') */
  unitId: string;
  
  /** Animation state */
  state?: 'idle' | 'attack' | 'damage';
  
  /** Size variant */
  size?: 'small' | 'medium' | 'large';
  
  /** Custom className */
  className?: string;
  
  /** Custom style */
  style?: React.CSSProperties;
}

const SIZE_MAP = {
  small: { width: 32, height: 32 },
  medium: { width: 48, height: 48 },
  large: { width: 64, height: 64 },
};

/**
 * Map unit IDs to character sprite names
 * Uses Golden Sun character names from the sprite catalog
 */
const UNIT_TO_SPRITE_MAP: Record<string, string> = {
  'adept': 'isaac',
  'war-mage': 'garet',
  'mystic': 'mia',
  'ranger': 'ivan',
  'sentinel': 'felix',
  'stormcaller': 'jenna',
  'test-warrior-1': 'isaac',
  'test-warrior-2': 'garet',
  'test-warrior-3': 'mia',
  'test-warrior-4': 'ivan',
};

/**
 * Map enemy IDs to enemy sprite names
 * Maps 50 game enemies to 173 available Golden Sun enemy sprites
 */
const ENEMY_TO_SPRITE_MAP: Record<string, string> = {
  // Enslaved Beasts - Tier 1
  'mercury-slime': 'slime',
  'venus-wolf': 'wild-wolf',
  'mars-bandit': 'brigand',
  'jupiter-sprite': 'pixie',
  'venus-beetle': 'doodle-bug',
  'mars-wolf': 'dire-wolf',
  'mercury-wolf': 'wolfkin',
  'jupiter-wolf': 'wolfkin-cub',
  'venus-bear': 'grizzly',
  'mars-bear': 'wild-ape',
  'mercury-bear': 'ape',
  'jupiter-bear': 'dirty-ape',

  // Slavers - Elemental Soldiers
  'earth-scout': 'goblin',
  'flame-scout': 'hobgoblin',
  'frost-scout': 'mini-goblin',
  'gale-scout': 'alec-goblin',
  'terra-soldier': 'stone-soldier',
  'blaze-soldier': 'rat-soldier',
  'tide-soldier': 'rat-fighter',
  'wind-soldier': 'rat-warrior',
  'stone-captain': 'orc-captain',
  'inferno-captain': 'orc',
  'glacier-captain': 'orc-lord',
  'thunder-captain': 'kobold',
  'mountain-commander': 'minos-warrior',
  'fire-commander': 'minotaurus',
  'storm-commander': 'lizard-man',
  'lightning-commander': 'lizard-fighter',
  'granite-warlord': 'earth-golem',
  'volcano-warlord': 'golem',
  'tempest-warlord': 'grand-golem',
  'blizzard-warlord': 'living-armor',

  // Legendary Enslaved - Elite Beasts
  'basilisk': 'earth-lizard',
  'chimera': 'chimera',
  'hydra': 'hydra',
  'phoenix': 'phoenix',
  'thunderbird': 'roc',
  'leviathan': 'turtle-dragon',

  // Boss Enemies
  'overseer': 'mad-demon',
  'bandit-captain': 'ruffian',
  'bandit-minion': 'thief',

  // Elementals
  'flame-elemental': 'magicore',
  'ice-elemental': 'ghost',
  'rock-elemental': 'boulder-beast',
  'storm-elemental': 'harpy',

  // Enemy Units (for testing)
  'garet-enemy': 'brigand',
  'sentinel-enemy': 'living-armor',
  'stormcaller-enemy': 'ghost-mage',
  'mars-sprite': 'faery',
  'mercury-sprite': 'pixie',
  'venus-sprite': 'gnome',
};

/**
 * Map animation states to sprite pose suffixes
 */
const STATE_TO_POSE_MAP: Record<string, string> = {
  'idle': 'front',
  'attack': 'attack1',
  'damage': 'hitfront',
};

/**
 * BattleUnitSprite component
 * Displays a unit sprite using real Golden Sun sprite assets
 * Handles both player units and enemies
 */
export function BattleUnitSprite({
  unitId,
  state = 'idle',
  size = 'medium',
  className,
  style,
}: BattleUnitSpriteProps) {
  const sizeStyles = SIZE_MAP[size];

  // Check if this is an enemy (enemies have specific patterns in their IDs)
  const isEnemy = ENEMY_TO_SPRITE_MAP[unitId] !== undefined;

  let spriteId: string;

  if (isEnemy) {
    // Enemy sprite - use direct sprite name from catalog
    const enemySpriteName = ENEMY_TO_SPRITE_MAP[unitId] || 'goblin';
    spriteId = enemySpriteName;
  } else {
    // Player unit sprite - use character name + weapon + pose
    const characterName = UNIT_TO_SPRITE_MAP[unitId] || 'isaac';
    const pose = STATE_TO_POSE_MAP[state] || 'front';

    // Build sprite ID (e.g., "isaac-lblade-front")
    // Default to using long blade (lblade) weapon for consistency
    spriteId = `${characterName}-lblade-${pose}`;
  }

  // Render sprite using SimpleSprite with catalog lookup
  return (
    <SimpleSprite
      id={spriteId}
      width={sizeStyles.width}
      height={sizeStyles.height}
      className={className}
      style={style}
      alt={`${unitId} sprite`}
    />
  );
}

