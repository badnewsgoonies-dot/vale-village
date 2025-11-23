/**
 * BattleUnitSprite Component
 * Wrapper around SimpleSprite component for unit display with real sprite assets
 */

import { SimpleSprite } from '../sprites/SimpleSprite';
import {
  getEnemyBattleSprite,
  getPlayerBattleSprite,
  type BattleSpriteState,
} from '../sprites/mappings';
import { warnIfPlaceholderSprite } from '../sprites/utils/warnIfPlaceholderSprite';

interface BattleUnitSpriteProps {
  /** Unit ID (e.g., 'adept', 'test-warrior-1') */
  unitId: string;
  
  /** Animation state */
  state?: 'idle' | 'attack' | 'hit' | 'damage';
  
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

const STATE_PROP_TO_BATTLE_STATE: Record<NonNullable<BattleUnitSpriteProps['state']>, BattleSpriteState> = {
  idle: 'idle',
  attack: 'attack',
  hit: 'hit',
  damage: 'hit',
};

/**
 * BattleUnitSprite component
 * Delegates sprite selection to the battle sprite mapping layer so that
 * production screens do not need to know concrete asset IDs.
 */
export function BattleUnitSprite({
  unitId,
  state = 'idle',
  size = 'medium',
  className,
  style,
}: BattleUnitSpriteProps) {
  const sizeStyles = SIZE_MAP[size];

  const mappedState = STATE_PROP_TO_BATTLE_STATE[state] ?? 'idle';
  const spriteId =
    getPlayerBattleSprite(unitId, mappedState) ??
    getEnemyBattleSprite(unitId, mappedState) ??
    null;
  const resolvedSpriteId = spriteId ?? `missing-battle-sprite-${unitId}-${mappedState}`;
  warnIfPlaceholderSprite('BattleUnitSprite', resolvedSpriteId);

  // Render sprite using SimpleSprite with catalog lookup
  return (
    <SimpleSprite
      id={resolvedSpriteId}
      width={sizeStyles.width}
      height={sizeStyles.height}
      className={className}
      style={style}
      alt={spriteId ? `${unitId} sprite` : `Missing battle sprite for ${unitId}`}
    />
  );
}

