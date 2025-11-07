import React from 'react';
import './Shadow.css';

export type ShadowSize = 'small' | 'medium' | 'large' | 'xlarge';
export type ShadowDirection = 'south' | 'southeast' | 'east';

interface ShadowProps {
  x: number;  // Grid position
  y: number;  // Grid position
  size: ShadowSize;
  direction?: ShadowDirection;
  opacity?: number;  // 0-1, default 0.3
}

const TILE_SIZE = 32;  // pixels

/**
 * Get shadow dimensions based on size
 */
function getShadowDimensions(size: ShadowSize): { width: number; height: number } {
  switch (size) {
    case 'small':
      return { width: 1, height: 1 };
    case 'medium':
      return { width: 2, height: 1 };
    case 'large':
      return { width: 2, height: 2 };
    case 'xlarge':
      return { width: 3, height: 2 };
  }
}

/**
 * Get shadow offset based on direction (simulating sun position)
 */
function getShadowOffset(direction: ShadowDirection): { dx: number; dy: number } {
  switch (direction) {
    case 'south':
      return { dx: 0, dy: 0.5 };
    case 'southeast':
      return { dx: 0.3, dy: 0.5 };
    case 'east':
      return { dx: 0.5, dy: 0.2 };
  }
}

/**
 * Renders a shadow for buildings, props, or entities
 * Creates depth perception through subtle shadow effects
 */
export const Shadow: React.FC<ShadowProps> = ({
  x,
  y,
  size,
  direction = 'southeast',
  opacity = 0.3,
}) => {
  const dimensions = getShadowDimensions(size);
  const offset = getShadowOffset(direction);

  return (
    <div
      className="shadow"
      style={{
        left: `${(x + offset.dx) * TILE_SIZE}px`,
        top: `${(y + offset.dy) * TILE_SIZE}px`,
        width: `${dimensions.width * TILE_SIZE}px`,
        height: `${dimensions.height * TILE_SIZE}px`,
        opacity,
      }}
    />
  );
};
