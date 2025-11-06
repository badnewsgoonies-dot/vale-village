import React from 'react';
import { TerrainType, getTerrainSprite } from '@/types/terrain';
import './TerrainTile.css';

interface TerrainTileProps {
  type: TerrainType;
  x: number;
  y: number;
  variant?: number;
}

const TILE_SIZE = 32; // pixels

export const TerrainTile: React.FC<TerrainTileProps> = ({ type, x, y }) => {
  const sprite = getTerrainSprite(type);

  return (
    <div
      className="terrain-tile"
      style={{
        left: `${x * TILE_SIZE}px`,
        top: `${y * TILE_SIZE}px`,
        width: `${TILE_SIZE}px`,
        height: `${TILE_SIZE}px`,
      }}
    >
      <img
        src={sprite}
        alt={type}
        className="terrain-sprite"
        style={{
          width: '100%',
          height: '100%',
          imageRendering: 'pixelated',
        }}
      />
    </div>
  );
};
