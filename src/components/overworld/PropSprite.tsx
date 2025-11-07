import React from 'react';
import { Shadow } from './Shadow';
import './PropSprite.css';

export type PropType =
  // Trees
  | 'tree-1' | 'tree-2' | 'tree-3' | 'tree-4' | 'tree-5'
  | 'tree-6' | 'tree-7' | 'tree-8' | 'tree-9' | 'tree-10'
  // Bushes and Shrubs
  | 'bush' | 'bush-2' | 'bush-3'
  | 'shrub-1' | 'shrub-2' | 'shrub-3' | 'shrub-4' | 'shrub-5'
  // Plants and Flowers
  | 'flowers' | 'leaf'
  // Statues (selection of common types)
  | 'statue-venus' | 'statue-mars' | 'statue-mercury' | 'statue-jupiter'
  | 'statue-guardian' | 'statue-column' | 'statue-pillar';

export interface PropSpriteProps {
  type: PropType;
  x: number;  // Grid position
  y: number;  // Grid position
  blocking?: boolean;  // Whether this prop blocks movement
}

const TILE_SIZE = 32;  // pixels

/**
 * Maps prop types to their sprite file paths
 */
function getPropSprite(type: PropType): string {
  const outdoor = '/sprites/scenery/outdoor/sm';
  const outdoorLg = '/sprites/scenery/outdoor/lg';

  switch (type) {
    // Trees
    case 'tree-1': return `${outdoorLg}/Tree1.gif`;
    case 'tree-2': return `${outdoorLg}/Tree2.gif`;
    case 'tree-3': return `${outdoorLg}/Tree3.gif`;
    case 'tree-4': return `${outdoorLg}/Tree4.gif`;
    case 'tree-5': return `${outdoorLg}/Tree5.gif`;
    case 'tree-6': return `${outdoorLg}/Tree6.gif`;
    case 'tree-7': return `${outdoorLg}/Tree7.gif`;
    case 'tree-8': return `${outdoorLg}/Tree8.gif`;
    case 'tree-9': return `${outdoorLg}/Tree9.gif`;
    case 'tree-10': return `${outdoorLg}/Tree10.gif`;

    // Bushes
    case 'bush': return `${outdoor}/Bush.gif`;
    case 'bush-2': return `${outdoor}/Bush2.gif`;
    case 'bush-3': return `${outdoor}/Bush3.gif`;

    // Shrubs
    case 'shrub-1': return `${outdoor}/Shrub1.gif`;
    case 'shrub-2': return `${outdoor}/Shrub2.gif`;
    case 'shrub-3': return `${outdoor}/Shrub3.gif`;
    case 'shrub-4': return `${outdoor}/Shrub4.gif`;
    case 'shrub-5': return `${outdoor}/Shrub5.gif`;

    // Plants
    case 'flowers': return `${outdoor}/Flowers.gif`;
    case 'leaf': return `${outdoor}/Leaf.gif`;

    // Statues (using available statue sprites)
    case 'statue-venus': return `${outdoor}/Statue_Venus.gif`;
    case 'statue-mars': return `${outdoor}/Statue_Mars.gif`;
    case 'statue-mercury': return `${outdoor}/Statue_Mercury.gif`;
    case 'statue-jupiter': return `${outdoor}/Statue_Jupiter.gif`;
    case 'statue-guardian': return `${outdoor}/Statue_Guardian.gif`;
    case 'statue-column': return `${outdoor}/Statue_Column.gif`;
    case 'statue-pillar': return `${outdoor}/Statue_Pillar.gif`;

    default:
      return `${outdoor}/Bush.gif`;
  }
}

/**
 * Determines if a prop should use large size rendering
 * Trees and large statues are 2×2 tiles, others are 1×1
 */
function getPropSize(type: PropType): { width: number; height: number } {
  if (type.startsWith('tree-')) {
    return { width: 2, height: 2 };  // Trees are large
  }
  if (type.startsWith('statue-')) {
    return { width: 1, height: 2 };  // Statues are tall
  }
  return { width: 1, height: 1 };  // Bushes, shrubs, flowers are small
}

/**
 * Renders a decorative prop (vegetation, statues) on the overworld map
 */
export const PropSprite: React.FC<PropSpriteProps> = ({
  type,
  x,
  y,
  blocking = false,
}) => {
  const sprite = getPropSprite(type);
  const size = getPropSize(type);

  // Determine if this prop should cast a shadow
  const isTree = type.startsWith('tree-');
  const isStatue = type.startsWith('statue-');
  const shouldCastShadow = isTree || isStatue;

  // Shadow size based on prop type
  const shadowSize = isTree ? 'large' : isStatue ? 'medium' : 'small';

  return (
    <>
      {/* Shadow layer (only for trees and statues) */}
      {shouldCastShadow && (
        <Shadow
          x={x}
          y={y + size.height - 1}
          size={shadowSize}
          direction="southeast"
          opacity={isTree ? 0.3 : 0.2}
        />
      )}

      {/* Prop sprite */}
      <div
        className={`prop-sprite ${blocking ? 'prop-blocking' : ''}`}
        style={{
          left: `${x * TILE_SIZE}px`,
          top: `${y * TILE_SIZE}px`,
          width: `${size.width * TILE_SIZE}px`,
          height: `${size.height * TILE_SIZE}px`,
        }}
        data-prop-type={type}
      >
        <img
          src={sprite}
          alt={type}
          className="prop-image"
          style={{
            width: '100%',
            height: '100%',
            imageRendering: 'pixelated',
          }}
        />
      </div>
    </>
  );
};
