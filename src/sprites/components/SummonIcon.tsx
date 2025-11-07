import React, { useState, useEffect } from 'react';
import { spriteRegistry } from '../registry';
import type { Element } from '../../types/Element';

interface SummonIconProps {
  summonName: string;
  element: Element;
  size?: 'small' | 'medium' | 'large';
  className?: string;
  onError?: (error: Error) => void;
}

/**
 * SummonIcon Component
 * 
 * Displays a Summon sprite using the sprite registry.
 * Automatically falls back to element Djinn sprite if summon sprite doesn't exist.
 * Follows the same pattern as BattleUnit, EquipmentIcon, and DjinnIcon components.
 * 
 * @example
 * <SummonIcon summonName="Titan" element="Venus" size="medium" />
 */
export const SummonIcon: React.FC<SummonIconProps> = ({
  summonName,
  element,
  size = 'medium',
  className = '',
  onError
}) => {
  const [spritePath, setSpritePath] = useState<string>('');
  const [fallbackPath, setFallbackPath] = useState<string>('');
  const [imageError, setImageError] = useState(false);
  const [useFallback, setUseFallback] = useState(false);

  useEffect(() => {
    const path = spriteRegistry.getSummonSprite(summonName, element);
    const fallback = `/sprites/battle/djinn/${element}_Djinn_Front.gif`;
    
    setSpritePath(path);
    setFallbackPath(fallback);
    setImageError(false);
    setUseFallback(false);
  }, [summonName, element]);

  const handleImageError = () => {
    if (!useFallback) {
      // Try fallback to element Djinn sprite
      setUseFallback(true);
      setSpritePath(fallbackPath);
    } else {
      // Even fallback failed
      setImageError(true);
      if (onError) {
        onError(new Error(`Failed to load summon sprite: ${summonName} (${element})`));
      }
    }
  };

  if (imageError) {
    return (
      <div className={`summon-icon error ${size} ${className}`} title={summonName}>
        <span className="summon-fallback">{element[0]}</span>
      </div>
    );
  }

  return (
    <img
      src={spritePath}
      alt={`${summonName} - ${element} Summon`}
      title={summonName}
      className={`summon-icon ${size} ${className}`}
      onError={handleImageError}
      style={{ imageRendering: 'pixelated' }}
    />
  );
};
