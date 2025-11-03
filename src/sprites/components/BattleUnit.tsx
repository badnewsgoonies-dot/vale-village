import React, { useState, useEffect } from 'react';
import { spriteRegistry } from '../registry';
import type { Unit } from '../../types/Unit';
import type { AnimationState } from '../types';

interface BattleUnitProps {
  unit: Unit;
  animation?: AnimationState;
  className?: string;
  onError?: (error: Error) => void;
}

export const BattleUnit: React.FC<BattleUnitProps> = ({
  unit,
  animation = 'Front',
  className = '',
  onError
}) => {
  const [spritePath, setSpritePath] = useState<string>('');
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    const path = spriteRegistry.getBattleSprite(unit, animation);
    setSpritePath(path);
    setImageError(false);
  }, [unit, animation]);

  const handleImageError = () => {
    setImageError(true);
    if (onError) {
      onError(new Error(`Failed to load sprite: ${spritePath}`));
    }
  };

  if (imageError) {
    return (
      <div className={`battle-unit-error ${className}`}>
        <div className="placeholder">
          {unit.name[0]}
        </div>
      </div>
    );
  }

  return (
    <img
      src={spritePath}
      alt={`${unit.name} - ${animation}`}
      className={`battle-unit ${className}`}
      onError={handleImageError}
    />
  );
};
