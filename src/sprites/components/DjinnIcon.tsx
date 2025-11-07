import React, { useState, useEffect } from 'react';
import { spriteRegistry } from '../registry';
import type { Djinn } from '../../types/Djinn';

interface DjinnIconProps {
  djinn: Djinn | null;
  size?: 'tiny' | 'small' | 'medium' | 'large';
  className?: string;
  onError?: (error: Error) => void;
}

/**
 * DjinnIcon Component
 * 
 * Displays a Djinn sprite using the sprite registry.
 * Follows the same pattern as BattleUnit and EquipmentIcon components.
 * 
 * @example
 * <DjinnIcon djinn={flint} size="medium" />
 */
export const DjinnIcon: React.FC<DjinnIconProps> = ({
  djinn,
  size = 'medium',
  className = '',
  onError
}) => {
  const [spritePath, setSpritePath] = useState<string>('');
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    if (djinn) {
      const path = spriteRegistry.getDjinnIcon(djinn);
      setSpritePath(path);
      setImageError(false);
    }
  }, [djinn]);

  const handleImageError = () => {
    setImageError(true);
    if (onError && djinn) {
      onError(new Error(`Failed to load Djinn sprite: ${spritePath}`));
    }
  };

  if (!djinn) {
    return (
      <div className={`djinn-icon empty ${size} ${className}`}>
        <span>-</span>
      </div>
    );
  }

  if (imageError) {
    return (
      <div className={`djinn-icon error ${size} ${className}`} title={djinn.name}>
        <span className="djinn-fallback">{djinn.element[0]}</span>
      </div>
    );
  }

  return (
    <img
      src={spritePath}
      alt={`${djinn.name} - ${djinn.element} Djinn`}
      title={djinn.name}
      className={`djinn-icon ${size} ${className}`}
      onError={handleImageError}
      style={{ imageRendering: 'pixelated' }}
    />
  );
};
