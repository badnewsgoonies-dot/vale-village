import React, { useState, useEffect } from 'react';
import { spriteRegistry } from '../registry';
import type { Equipment } from '../../types/Equipment';

interface EquipmentIconProps {
  equipment: Equipment | null;
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

export const EquipmentIcon: React.FC<EquipmentIconProps> = ({
  equipment,
  size = 'medium',
  className = ''
}) => {
  const [iconPath, setIconPath] = useState<string>('');
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    if (equipment) {
      const path = spriteRegistry.getEquipmentIcon(equipment);
      setIconPath(path);
      setImageError(false);
    }
  }, [equipment]);

  if (!equipment) {
    return (
      <div className={`equipment-icon empty ${size} ${className}`}>
        <span>-</span>
      </div>
    );
  }

  if (imageError) {
    return (
      <div className={`equipment-icon error ${size} ${className}`}>
        <span title={equipment.name}>?</span>
      </div>
    );
  }

  return (
    <img
      src={iconPath}
      alt={equipment.name}
      title={equipment.name}
      className={`equipment-icon ${size} ${className}`}
      onError={() => setImageError(true)}
    />
  );
};
