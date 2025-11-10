/**
 * BattleUnitSprite Component
 * Wrapper around Sprite component for unit display
 */

import { Sprite } from '../sprites/Sprite';
import { getUnitSpriteId } from '../sprites/utils';
import { hasSprite } from '../sprites/manifest';

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
 * BattleUnitSprite component
 * Displays a unit sprite with fallback rendering
 */
export function BattleUnitSprite({
  unitId,
  state = 'idle',
  size = 'medium',
  className,
  style,
}: BattleUnitSpriteProps) {
  // Map unit ID to sprite ID
  // Handle test units (test-warrior-1, etc.) by mapping to a default unit sprite
  let spriteId: string;
  if (unitId.startsWith('test-warrior')) {
    // Test units use adept sprite as fallback
    spriteId = 'unit:adept';
  } else {
    spriteId = getUnitSpriteId(unitId);
  }

  // Check if sprite exists
  const spriteExists = hasSprite(spriteId);

  // Map state to sprite animation state
  const spriteState = state === 'damage' ? 'hurt' : state;

  // Fallback rendering if sprite doesn't exist
  if (!spriteExists) {
    const sizeStyles = SIZE_MAP[size];
    const firstLetter = unitId.charAt(0).toUpperCase();
    
    return (
      <div
        className={className}
        style={{
          ...sizeStyles,
          backgroundColor: '#4a5568',
          color: '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '4px',
          fontSize: size === 'small' ? '14px' : size === 'medium' ? '18px' : '24px',
          fontWeight: 'bold',
          border: '2px solid #2d3748',
          ...style,
        }}
        title={unitId}
      >
        {firstLetter}
      </div>
    );
  }

  // Render sprite
  return (
    <Sprite
      id={spriteId}
      state={spriteState}
      className={className}
      style={{
        ...SIZE_MAP[size],
        ...style,
      }}
    />
  );
}

