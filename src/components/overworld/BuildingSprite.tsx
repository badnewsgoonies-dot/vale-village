import React from 'react';
import './BuildingSprite.css';

export type BuildingType =
  | 'isaacs-house'
  | 'jennas-house'
  | 'garets-house'
  | 'kradens-house'
  | 'vale-inn'
  | 'weparm-shop'
  | 'sanctum'
  | 'bridge'
  | 'psynergy-stone'
  | 'gate'
  | 'vale-building-1'
  | 'vale-building-2'
  | 'vale-building-3'
  | 'vale-building-4'
  | 'vale-building-5'
  | 'vale-building-6'
  | 'vale-building-7'
  | 'vale-building-8';

interface BuildingSpriteProps {
  type: BuildingType;
  x: number;  // Grid position (left tile)
  y: number;  // Grid position (top tile)
  width?: number;  // Width in tiles (default: 2)
  height?: number;  // Height in tiles (default: 2)
}

const TILE_SIZE = 32;  // pixels

/**
 * Maps building types to their sprite file paths
 */
function getBuildingSprite(type: BuildingType): string {
  const basePath = '/sprites/scenery/buildings';

  switch (type) {
    case 'isaacs-house':
      return `${basePath}/Vale_Isaacs_House.gif`;
    case 'jennas-house':
      return `${basePath}/Vale_Jennas_House.gif`;
    case 'garets-house':
      return `${basePath}/Vale_Garets_House.gif`;
    case 'kradens-house':
      return `${basePath}/Vale_Kradens_House.gif`;
    case 'vale-inn':
      return `${basePath}/Vale_Inn.gif`;
    case 'weparm-shop':
      return `${basePath}/Vale_WepArm_Shop.gif`;
    case 'sanctum':
      return `${basePath}/Vale_Sanctum.gif`;
    case 'bridge':
      return `${basePath}/Vale_Bridge.gif`;
    case 'psynergy-stone':
      return `${basePath}/Vale_Psynergy_Stone.gif`;
    case 'gate':
      return `${basePath}/Vale_Gate.gif`;
    case 'vale-building-1':
      return `${basePath}/Vale_Building1.gif`;
    case 'vale-building-2':
      return `${basePath}/Vale_Building2.gif`;
    case 'vale-building-3':
      return `${basePath}/Vale_Building3.gif`;
    case 'vale-building-4':
      return `${basePath}/Vale_Building4.gif`;
    case 'vale-building-5':
      return `${basePath}/Vale_Building5.gif`;
    case 'vale-building-6':
      return `${basePath}/Vale_Building6.gif`;
    case 'vale-building-7':
      return `${basePath}/Vale_Building7.gif`;
    case 'vale-building-8':
      return `${basePath}/Vale_Building8.gif`;
    default:
      return `${basePath}/Vale_Building1.gif`;
  }
}

/**
 * Renders a building sprite on the overworld map.
 * Buildings are multi-tile structures that span across the grid.
 */
export const BuildingSprite: React.FC<BuildingSpriteProps> = ({
  type,
  x,
  y,
  width = 2,
  height = 2,
}) => {
  const sprite = getBuildingSprite(type);

  return (
    <div
      className="building-sprite"
      style={{
        left: `${x * TILE_SIZE}px`,
        top: `${y * TILE_SIZE}px`,
        width: `${width * TILE_SIZE}px`,
        height: `${height * TILE_SIZE}px`,
      }}
    >
      <img
        src={sprite}
        alt={type}
        className="building-image"
        style={{
          width: '100%',
          height: '100%',
          imageRendering: 'pixelated',
        }}
      />
    </div>
  );
};
