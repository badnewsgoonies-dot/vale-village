/**
 * EquipmentIcon Component
 * Displays equipment sprites with fallback icons
 */

import { Sprite } from '../sprites/Sprite';
import { hasSprite } from '../sprites/manifest';
import type { Equipment } from '../../core/models/Equipment';

interface EquipmentIconProps {
  /** Equipment item */
  equipment: Equipment;
  
  /** Size variant */
  size?: 'small' | 'medium' | 'large';
  
  /** Custom className */
  className?: string;
  
  /** Custom style */
  style?: React.CSSProperties;
}

const SIZE_MAP = {
  small: { width: 24, height: 24 },
  medium: { width: 32, height: 32 },
  large: { width: 48, height: 48 },
};

/**
 * Get emoji icon for equipment slot
 */
function getSlotIcon(slot: Equipment['slot']): string {
  switch (slot) {
    case 'weapon':
      return '⚔️';
    case 'armor':
      return '🛡️';
    case 'helm':
      return '⛑️';
    case 'boots':
      return '👢';
    case 'accessory':
      return '💍';
    default:
      return '📦';
  }
}

/**
 * Get color for equipment tier
 */
function getTierColor(tier: Equipment['tier']): string {
  switch (tier) {
    case 'basic':
      return '#9ca3af';
    case 'bronze':
      return '#cd7f32';
    case 'iron':
      return '#4a5568';
    case 'steel':
      return '#718096';
    case 'silver':
      return '#c0c0c0';
    case 'mythril':
      return '#a0a0ff';
    case 'legendary':
      return '#ffd700';
    case 'artifact':
      return '#ff00ff';
    default:
      return '#9ca3af';
  }
}

/**
 * EquipmentIcon component
 * Displays equipment sprite or fallback icon
 */
export function EquipmentIcon({
  equipment,
  size = 'medium',
  className,
  style,
}: EquipmentIconProps) {
  // Try to find equipment sprite (equipment:equipmentId)
  const spriteId = `equipment:${equipment.id}`;
  const spriteExists = hasSprite(spriteId);

  // Fallback rendering if sprite doesn't exist
  if (!spriteExists) {
    const sizeStyles = SIZE_MAP[size];
    const icon = getSlotIcon(equipment.slot);
    const tierColor = getTierColor(equipment.tier);
    
    return (
      <div
        className={className}
        style={{
          ...sizeStyles,
          backgroundColor: tierColor,
          color: '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '4px',
          fontSize: size === 'small' ? '12px' : size === 'medium' ? '16px' : '24px',
          border: '2px solid rgba(0,0,0,0.2)',
          ...style,
        }}
        title={`${equipment.name} (${equipment.tier})`}
      >
        {icon}
      </div>
    );
  }

  // Render sprite
  return (
    <Sprite
      id={spriteId}
      state="idle"
      className={className}
      style={{
        ...SIZE_MAP[size],
        ...style,
      }}
    />
  );
}

