/**
 * Terrain System Types
 * For tile-based overworld rendering
 */

export enum TerrainType {
  // Grass variants
  GRASS_LIGHT = 'grass-light',
  GRASS_DARK = 'grass-dark',

  // Paths
  DIRT_PATH = 'dirt-path',
  STONE_PATH = 'stone-path',

  // Water
  WATER = 'water',
  BRIDGE = 'bridge',

  // Special
  SAND = 'sand',
  CLIFF = 'cliff',

  // Indoor (for Phase 2+)
  INDOOR_WOOD = 'indoor-wood',
  INDOOR_STONE = 'indoor-stone',
}

export interface TerrainTileData {
  type: TerrainType;
  x: number;
  y: number;
  walkable: boolean;
  sprite?: string; // Optional custom sprite path
}

export interface TileMap {
  width: number;
  height: number;
  layers: {
    ground: TerrainType[][];
    detail?: string[][]; // Grass tufts, flowers (Phase 3)
  };
  collisionMap: boolean[][];
}

/**
 * Check if a terrain type is walkable
 */
export function isTerrainWalkable(type: TerrainType): boolean {
  switch (type) {
    case TerrainType.WATER:
    case TerrainType.CLIFF:
      return false;

    case TerrainType.GRASS_LIGHT:
    case TerrainType.GRASS_DARK:
    case TerrainType.DIRT_PATH:
    case TerrainType.STONE_PATH:
    case TerrainType.BRIDGE:
    case TerrainType.SAND:
    case TerrainType.INDOOR_WOOD:
    case TerrainType.INDOOR_STONE:
      return true;

    default:
      return true;
  }
}

/**
 * Get sprite path for terrain type
 * Uses outdoor terrain sprite sheet
 */
export function getTerrainSprite(type: TerrainType): string {
  const basePath = '/sprites/scenery/outdoor';

  switch (type) {
    case TerrainType.GRASS_LIGHT:
      return `${basePath}/sm/Grass1.gif`;
    case TerrainType.GRASS_DARK:
      return `${basePath}/sm/Grass2.gif`;
    case TerrainType.DIRT_PATH:
      return `${basePath}/sm/Dirt_Path.gif`;
    case TerrainType.STONE_PATH:
      return `${basePath}/sm/Stone_Path.gif`;
    case TerrainType.WATER:
      return `${basePath}/sm/Water.gif`;
    case TerrainType.BRIDGE:
      return `${basePath}/lg/Bridge.gif`;
    case TerrainType.SAND:
      return `${basePath}/sm/Sand.gif`;
    case TerrainType.CLIFF:
      return `${basePath}/lg/Cliff.gif`;
    default:
      return `${basePath}/sm/Grass1.gif`;
  }
}
