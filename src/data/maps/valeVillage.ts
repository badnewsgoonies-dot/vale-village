import { TileMap, TerrainType } from '@/types/terrain';

/**
 * Vale Village Terrain Map
 *
 * Layout Design:
 * - Central stone path (main thoroughfare)
 * - Grass areas for buildings and gardens
 * - Stream with bridge crossing (east-west)
 * - Dirt paths toward forest edges
 * - Varied grass (light/dark) for visual interest
 *
 * Grid: 30 columns × 25 rows (960px × 800px at 32px tiles)
 */

const T = TerrainType;

// Helper function to create repeated terrain
const row = (...tiles: TerrainType[]): TerrainType[] => tiles;

export const VALE_VILLAGE_MAP: TileMap = {
  width: 30,
  height: 25,

  layers: {
    ground: [
      // Row 0: Northern forest edge
      row(T.GRASS_DARK, T.GRASS_DARK, T.GRASS_DARK, T.DIRT_PATH, T.DIRT_PATH, T.DIRT_PATH, T.GRASS_DARK, T.GRASS_DARK, T.GRASS_LIGHT, T.GRASS_LIGHT, T.GRASS_LIGHT, T.GRASS_LIGHT, T.GRASS_LIGHT, T.GRASS_LIGHT, T.GRASS_LIGHT, T.GRASS_LIGHT, T.GRASS_LIGHT, T.GRASS_LIGHT, T.GRASS_LIGHT, T.GRASS_LIGHT, T.GRASS_LIGHT, T.GRASS_LIGHT, T.GRASS_DARK, T.GRASS_DARK, T.DIRT_PATH, T.DIRT_PATH, T.DIRT_PATH, T.GRASS_DARK, T.GRASS_DARK, T.GRASS_DARK),

      // Row 1: Transition to town
      row(T.GRASS_DARK, T.GRASS_DARK, T.DIRT_PATH, T.DIRT_PATH, T.STONE_PATH, T.STONE_PATH, T.DIRT_PATH, T.GRASS_LIGHT, T.GRASS_LIGHT, T.GRASS_LIGHT, T.GRASS_LIGHT, T.GRASS_LIGHT, T.GRASS_LIGHT, T.GRASS_LIGHT, T.GRASS_LIGHT, T.GRASS_LIGHT, T.GRASS_LIGHT, T.GRASS_LIGHT, T.GRASS_LIGHT, T.GRASS_LIGHT, T.GRASS_LIGHT, T.GRASS_LIGHT, T.GRASS_LIGHT, T.GRASS_LIGHT, T.DIRT_PATH, T.STONE_PATH, T.STONE_PATH, T.DIRT_PATH, T.GRASS_DARK, T.GRASS_DARK),

      // Row 2: Northern buildings area
      row(T.GRASS_DARK, T.DIRT_PATH, T.DIRT_PATH, T.STONE_PATH, T.STONE_PATH, T.STONE_PATH, T.STONE_PATH, T.GRASS_LIGHT, T.GRASS_LIGHT, T.GRASS_LIGHT, T.GRASS_DARK, T.GRASS_DARK, T.GRASS_DARK, T.GRASS_LIGHT, T.STONE_PATH, T.STONE_PATH, T.GRASS_LIGHT, T.GRASS_DARK, T.GRASS_DARK, T.GRASS_DARK, T.GRASS_LIGHT, T.GRASS_LIGHT, T.GRASS_LIGHT, T.STONE_PATH, T.STONE_PATH, T.STONE_PATH, T.STONE_PATH, T.DIRT_PATH, T.DIRT_PATH, T.GRASS_DARK),

      // Row 3: Sanctum area
      row(T.GRASS_DARK, T.DIRT_PATH, T.STONE_PATH, T.STONE_PATH, T.STONE_PATH, T.STONE_PATH, T.STONE_PATH, T.STONE_PATH, T.GRASS_LIGHT, T.GRASS_LIGHT, T.GRASS_LIGHT, T.GRASS_LIGHT, T.GRASS_LIGHT, T.GRASS_LIGHT, T.STONE_PATH, T.STONE_PATH, T.GRASS_LIGHT, T.GRASS_LIGHT, T.GRASS_LIGHT, T.GRASS_LIGHT, T.GRASS_LIGHT, T.GRASS_LIGHT, T.STONE_PATH, T.STONE_PATH, T.STONE_PATH, T.STONE_PATH, T.STONE_PATH, T.STONE_PATH, T.DIRT_PATH, T.GRASS_DARK),

      // Row 4: Central plaza approach
      row(T.GRASS_DARK, T.STONE_PATH, T.STONE_PATH, T.STONE_PATH, T.GRASS_LIGHT, T.GRASS_LIGHT, T.GRASS_LIGHT, T.STONE_PATH, T.STONE_PATH, T.GRASS_LIGHT, T.GRASS_LIGHT, T.GRASS_LIGHT, T.GRASS_LIGHT, T.GRASS_LIGHT, T.STONE_PATH, T.STONE_PATH, T.GRASS_LIGHT, T.GRASS_LIGHT, T.GRASS_LIGHT, T.GRASS_LIGHT, T.GRASS_LIGHT, T.STONE_PATH, T.STONE_PATH, T.GRASS_LIGHT, T.GRASS_LIGHT, T.GRASS_LIGHT, T.STONE_PATH, T.STONE_PATH, T.STONE_PATH, T.GRASS_DARK),

      // Row 5: Plaza
      row(T.GRASS_LIGHT, T.STONE_PATH, T.STONE_PATH, T.GRASS_LIGHT, T.GRASS_LIGHT, T.GRASS_DARK, T.GRASS_LIGHT, T.STONE_PATH, T.STONE_PATH, T.STONE_PATH, T.GRASS_LIGHT, T.GRASS_LIGHT, T.GRASS_LIGHT, T.STONE_PATH, T.STONE_PATH, T.STONE_PATH, T.STONE_PATH, T.GRASS_LIGHT, T.GRASS_LIGHT, T.GRASS_LIGHT, T.STONE_PATH, T.STONE_PATH, T.STONE_PATH, T.GRASS_LIGHT, T.GRASS_DARK, T.GRASS_LIGHT, T.GRASS_LIGHT, T.STONE_PATH, T.STONE_PATH, T.GRASS_LIGHT),

      // Row 6: Residential west
      row(T.GRASS_LIGHT, T.STONE_PATH, T.GRASS_LIGHT, T.GRASS_LIGHT, T.GRASS_DARK, T.GRASS_DARK, T.GRASS_LIGHT, T.GRASS_LIGHT, T.STONE_PATH, T.STONE_PATH, T.STONE_PATH, T.STONE_PATH, T.STONE_PATH, T.STONE_PATH, T.STONE_PATH, T.STONE_PATH, T.STONE_PATH, T.STONE_PATH, T.STONE_PATH, T.STONE_PATH, T.STONE_PATH, T.STONE_PATH, T.STONE_PATH, T.GRASS_LIGHT, T.GRASS_DARK, T.GRASS_DARK, T.GRASS_LIGHT, T.GRASS_LIGHT, T.STONE_PATH, T.GRASS_LIGHT),

      // Row 7: Residential west buildings
      row(T.GRASS_LIGHT, T.STONE_PATH, T.GRASS_LIGHT, T.GRASS_DARK, T.GRASS_DARK, T.GRASS_DARK, T.GRASS_LIGHT, T.GRASS_LIGHT, T.GRASS_LIGHT, T.STONE_PATH, T.STONE_PATH, T.STONE_PATH, T.STONE_PATH, T.STONE_PATH, T.STONE_PATH, T.STONE_PATH, T.STONE_PATH, T.STONE_PATH, T.STONE_PATH, T.STONE_PATH, T.STONE_PATH, T.STONE_PATH, T.GRASS_LIGHT, T.GRASS_LIGHT, T.GRASS_LIGHT, T.GRASS_DARK, T.GRASS_DARK, T.GRASS_DARK, T.GRASS_LIGHT, T.STONE_PATH),

      // Row 8: Stream approach
      row(T.GRASS_LIGHT, T.STONE_PATH, T.GRASS_LIGHT, T.GRASS_LIGHT, T.GRASS_LIGHT, T.GRASS_LIGHT, T.GRASS_LIGHT, T.GRASS_LIGHT, T.GRASS_LIGHT, T.GRASS_LIGHT, T.STONE_PATH, T.STONE_PATH, T.STONE_PATH, T.STONE_PATH, T.STONE_PATH, T.STONE_PATH, T.STONE_PATH, T.STONE_PATH, T.STONE_PATH, T.STONE_PATH, T.STONE_PATH, T.GRASS_LIGHT, T.GRASS_LIGHT, T.GRASS_LIGHT, T.GRASS_LIGHT, T.GRASS_LIGHT, T.GRASS_LIGHT, T.GRASS_LIGHT, T.GRASS_LIGHT, T.STONE_PATH),

      // Row 9: Stream north bank
      row(T.GRASS_LIGHT, T.STONE_PATH, T.STONE_PATH, T.GRASS_LIGHT, T.GRASS_LIGHT, T.GRASS_LIGHT, T.SAND, T.SAND, T.SAND, T.GRASS_LIGHT, T.GRASS_LIGHT, T.STONE_PATH, T.STONE_PATH, T.STONE_PATH, T.STONE_PATH, T.STONE_PATH, T.STONE_PATH, T.STONE_PATH, T.STONE_PATH, T.GRASS_LIGHT, T.GRASS_LIGHT, T.GRASS_LIGHT, T.SAND, T.SAND, T.SAND, T.GRASS_LIGHT, T.GRASS_LIGHT, T.GRASS_LIGHT, T.STONE_PATH, T.STONE_PATH),

      // Row 10: Stream water
      row(T.GRASS_LIGHT, T.STONE_PATH, T.STONE_PATH, T.SAND, T.SAND, T.WATER, T.WATER, T.WATER, T.WATER, T.WATER, T.SAND, T.SAND, T.STONE_PATH, T.STONE_PATH, T.BRIDGE, T.BRIDGE, T.STONE_PATH, T.STONE_PATH, T.SAND, T.SAND, T.WATER, T.WATER, T.WATER, T.WATER, T.WATER, T.SAND, T.SAND, T.STONE_PATH, T.STONE_PATH, T.GRASS_LIGHT),

      // Row 11: Stream water
      row(T.GRASS_LIGHT, T.STONE_PATH, T.STONE_PATH, T.SAND, T.WATER, T.WATER, T.WATER, T.WATER, T.WATER, T.WATER, T.WATER, T.SAND, T.SAND, T.STONE_PATH, T.BRIDGE, T.BRIDGE, T.STONE_PATH, T.SAND, T.SAND, T.WATER, T.WATER, T.WATER, T.WATER, T.WATER, T.WATER, T.WATER, T.SAND, T.STONE_PATH, T.STONE_PATH, T.GRASS_LIGHT),

      // Row 12: Stream south bank
      row(T.GRASS_LIGHT, T.STONE_PATH, T.STONE_PATH, T.GRASS_LIGHT, T.SAND, T.SAND, T.SAND, T.WATER, T.WATER, T.WATER, T.WATER, T.WATER, T.SAND, T.STONE_PATH, T.BRIDGE, T.BRIDGE, T.STONE_PATH, T.SAND, T.WATER, T.WATER, T.WATER, T.WATER, T.WATER, T.SAND, T.SAND, T.SAND, T.GRASS_LIGHT, T.STONE_PATH, T.STONE_PATH, T.GRASS_LIGHT),

      // Row 13: South of stream
      row(T.GRASS_LIGHT, T.STONE_PATH, T.STONE_PATH, T.GRASS_LIGHT, T.GRASS_LIGHT, T.GRASS_LIGHT, T.SAND, T.SAND, T.SAND, T.WATER, T.WATER, T.WATER, T.SAND, T.STONE_PATH, T.STONE_PATH, T.STONE_PATH, T.SAND, T.WATER, T.WATER, T.WATER, T.SAND, T.SAND, T.SAND, T.GRASS_LIGHT, T.GRASS_LIGHT, T.GRASS_LIGHT, T.STONE_PATH, T.STONE_PATH, T.STONE_PATH, T.GRASS_LIGHT),

      // Row 14: Southern plaza
      row(T.GRASS_LIGHT, T.STONE_PATH, T.STONE_PATH, T.STONE_PATH, T.GRASS_LIGHT, T.GRASS_LIGHT, T.GRASS_LIGHT, T.GRASS_LIGHT, T.SAND, T.SAND, T.SAND, T.SAND, T.GRASS_LIGHT, T.STONE_PATH, T.STONE_PATH, T.STONE_PATH, T.GRASS_LIGHT, T.SAND, T.SAND, T.SAND, T.SAND, T.GRASS_LIGHT, T.GRASS_LIGHT, T.GRASS_LIGHT, T.GRASS_LIGHT, T.STONE_PATH, T.STONE_PATH, T.STONE_PATH, T.STONE_PATH, T.GRASS_LIGHT),

      // Row 15: Shop/Inn area
      row(T.GRASS_LIGHT, T.GRASS_LIGHT, T.STONE_PATH, T.STONE_PATH, T.STONE_PATH, T.GRASS_LIGHT, T.GRASS_LIGHT, T.GRASS_LIGHT, T.GRASS_LIGHT, T.GRASS_LIGHT, T.GRASS_LIGHT, T.GRASS_LIGHT, T.GRASS_LIGHT, T.STONE_PATH, T.STONE_PATH, T.STONE_PATH, T.GRASS_LIGHT, T.GRASS_LIGHT, T.GRASS_LIGHT, T.GRASS_LIGHT, T.GRASS_LIGHT, T.GRASS_LIGHT, T.GRASS_LIGHT, T.GRASS_LIGHT, T.STONE_PATH, T.STONE_PATH, T.STONE_PATH, T.STONE_PATH, T.GRASS_LIGHT, T.GRASS_LIGHT),

      // Row 16: Eastern buildings
      row(T.GRASS_LIGHT, T.GRASS_LIGHT, T.GRASS_LIGHT, T.STONE_PATH, T.STONE_PATH, T.STONE_PATH, T.GRASS_LIGHT, T.GRASS_DARK, T.GRASS_DARK, T.GRASS_LIGHT, T.GRASS_LIGHT, T.GRASS_LIGHT, T.GRASS_LIGHT, T.STONE_PATH, T.STONE_PATH, T.STONE_PATH, T.GRASS_LIGHT, T.GRASS_LIGHT, T.GRASS_LIGHT, T.GRASS_LIGHT, T.GRASS_DARK, T.GRASS_DARK, T.GRASS_LIGHT, T.STONE_PATH, T.STONE_PATH, T.STONE_PATH, T.GRASS_LIGHT, T.GRASS_LIGHT, T.GRASS_LIGHT, T.GRASS_LIGHT),

      // Row 17: Kraden's area
      row(T.GRASS_LIGHT, T.GRASS_LIGHT, T.GRASS_LIGHT, T.GRASS_LIGHT, T.STONE_PATH, T.STONE_PATH, T.STONE_PATH, T.GRASS_LIGHT, T.GRASS_DARK, T.GRASS_DARK, T.GRASS_LIGHT, T.GRASS_LIGHT, T.STONE_PATH, T.STONE_PATH, T.STONE_PATH, T.STONE_PATH, T.STONE_PATH, T.GRASS_LIGHT, T.GRASS_LIGHT, T.GRASS_DARK, T.GRASS_DARK, T.GRASS_LIGHT, T.STONE_PATH, T.STONE_PATH, T.STONE_PATH, T.GRASS_LIGHT, T.GRASS_LIGHT, T.GRASS_LIGHT, T.GRASS_LIGHT, T.GRASS_LIGHT),

      // Row 18: Southern paths
      row(T.GRASS_LIGHT, T.GRASS_LIGHT, T.GRASS_LIGHT, T.GRASS_LIGHT, T.GRASS_LIGHT, T.STONE_PATH, T.STONE_PATH, T.STONE_PATH, T.GRASS_LIGHT, T.GRASS_LIGHT, T.GRASS_LIGHT, T.STONE_PATH, T.STONE_PATH, T.STONE_PATH, T.STONE_PATH, T.STONE_PATH, T.STONE_PATH, T.STONE_PATH, T.GRASS_LIGHT, T.GRASS_LIGHT, T.GRASS_LIGHT, T.STONE_PATH, T.STONE_PATH, T.STONE_PATH, T.GRASS_LIGHT, T.GRASS_LIGHT, T.GRASS_LIGHT, T.GRASS_LIGHT, T.GRASS_LIGHT, T.GRASS_LIGHT),

      // Row 19: Inn approach
      row(T.GRASS_LIGHT, T.GRASS_LIGHT, T.GRASS_LIGHT, T.GRASS_LIGHT, T.GRASS_LIGHT, T.GRASS_LIGHT, T.STONE_PATH, T.STONE_PATH, T.STONE_PATH, T.GRASS_LIGHT, T.STONE_PATH, T.STONE_PATH, T.STONE_PATH, T.GRASS_LIGHT, T.GRASS_LIGHT, T.GRASS_LIGHT, T.STONE_PATH, T.STONE_PATH, T.STONE_PATH, T.GRASS_LIGHT, T.STONE_PATH, T.STONE_PATH, T.STONE_PATH, T.GRASS_LIGHT, T.GRASS_LIGHT, T.GRASS_LIGHT, T.GRASS_LIGHT, T.GRASS_LIGHT, T.GRASS_LIGHT, T.GRASS_LIGHT),

      // Row 20: Gate approach
      row(T.GRASS_LIGHT, T.GRASS_LIGHT, T.GRASS_LIGHT, T.GRASS_LIGHT, T.GRASS_LIGHT, T.GRASS_LIGHT, T.GRASS_LIGHT, T.STONE_PATH, T.STONE_PATH, T.STONE_PATH, T.STONE_PATH, T.STONE_PATH, T.GRASS_LIGHT, T.GRASS_LIGHT, T.GRASS_LIGHT, T.GRASS_LIGHT, T.GRASS_LIGHT, T.STONE_PATH, T.STONE_PATH, T.STONE_PATH, T.STONE_PATH, T.STONE_PATH, T.GRASS_LIGHT, T.GRASS_LIGHT, T.GRASS_LIGHT, T.GRASS_LIGHT, T.GRASS_LIGHT, T.GRASS_LIGHT, T.GRASS_LIGHT, T.GRASS_LIGHT),

      // Row 21: Southern edge
      row(T.GRASS_LIGHT, T.GRASS_LIGHT, T.GRASS_DARK, T.GRASS_DARK, T.GRASS_LIGHT, T.GRASS_LIGHT, T.GRASS_LIGHT, T.GRASS_LIGHT, T.STONE_PATH, T.STONE_PATH, T.STONE_PATH, T.GRASS_LIGHT, T.GRASS_LIGHT, T.GRASS_LIGHT, T.GRASS_LIGHT, T.GRASS_LIGHT, T.GRASS_LIGHT, T.GRASS_LIGHT, T.STONE_PATH, T.STONE_PATH, T.STONE_PATH, T.GRASS_LIGHT, T.GRASS_LIGHT, T.GRASS_LIGHT, T.GRASS_LIGHT, T.GRASS_DARK, T.GRASS_DARK, T.GRASS_LIGHT, T.GRASS_LIGHT, T.GRASS_LIGHT),

      // Row 22: Gate area
      row(T.GRASS_DARK, T.GRASS_DARK, T.GRASS_DARK, T.GRASS_DARK, T.GRASS_LIGHT, T.GRASS_LIGHT, T.GRASS_LIGHT, T.GRASS_LIGHT, T.GRASS_LIGHT, T.STONE_PATH, T.STONE_PATH, T.STONE_PATH, T.GRASS_LIGHT, T.GRASS_LIGHT, T.GRASS_LIGHT, T.GRASS_LIGHT, T.GRASS_LIGHT, T.STONE_PATH, T.STONE_PATH, T.STONE_PATH, T.GRASS_LIGHT, T.GRASS_LIGHT, T.GRASS_LIGHT, T.GRASS_LIGHT, T.GRASS_LIGHT, T.GRASS_DARK, T.GRASS_DARK, T.GRASS_DARK, T.GRASS_DARK, T.GRASS_DARK),

      // Row 23: Exit to world
      row(T.GRASS_DARK, T.GRASS_DARK, T.GRASS_DARK, T.DIRT_PATH, T.DIRT_PATH, T.GRASS_LIGHT, T.GRASS_LIGHT, T.GRASS_LIGHT, T.GRASS_LIGHT, T.GRASS_LIGHT, T.STONE_PATH, T.STONE_PATH, T.STONE_PATH, T.STONE_PATH, T.STONE_PATH, T.STONE_PATH, T.STONE_PATH, T.STONE_PATH, T.STONE_PATH, T.GRASS_LIGHT, T.GRASS_LIGHT, T.GRASS_LIGHT, T.GRASS_LIGHT, T.GRASS_LIGHT, T.DIRT_PATH, T.DIRT_PATH, T.GRASS_DARK, T.GRASS_DARK, T.GRASS_DARK, T.GRASS_DARK),

      // Row 24: Southern forest
      row(T.GRASS_DARK, T.GRASS_DARK, T.DIRT_PATH, T.DIRT_PATH, T.DIRT_PATH, T.DIRT_PATH, T.GRASS_LIGHT, T.GRASS_LIGHT, T.GRASS_LIGHT, T.GRASS_LIGHT, T.GRASS_LIGHT, T.STONE_PATH, T.STONE_PATH, T.STONE_PATH, T.STONE_PATH, T.STONE_PATH, T.STONE_PATH, T.STONE_PATH, T.GRASS_LIGHT, T.GRASS_LIGHT, T.GRASS_LIGHT, T.GRASS_LIGHT, T.DIRT_PATH, T.DIRT_PATH, T.DIRT_PATH, T.DIRT_PATH, T.GRASS_DARK, T.GRASS_DARK, T.GRASS_DARK, T.GRASS_DARK),
    ],
  },

  collisionMap: [
    // Generate collision map from terrain walkability
    // Water and cliffs are not walkable (false), everything else is walkable (true)
    // Each row corresponds to the ground layer row above

    // Row 0
    [true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true],
    // Row 1
    [true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true],
    // Row 2
    [true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true],
    // Row 3
    [true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true],
    // Row 4
    [true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true],
    // Row 5
    [true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true],
    // Row 6
    [true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true],
    // Row 7
    [true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true],
    // Row 8
    [true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true],
    // Row 9: Sand is walkable
    [true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true],
    // Row 10: Water is NOT walkable (false), Bridge IS walkable
    [true, true, true, true, true, false, false, false, false, false, true, true, true, true, true, true, true, true, true, true, false, false, false, false, false, true, true, true, true, true],
    // Row 11: Water is NOT walkable, Bridge IS walkable
    [true, true, true, true, false, false, false, false, false, false, false, true, true, true, true, true, true, true, true, false, false, false, false, false, false, false, true, true, true, true],
    // Row 12: Water is NOT walkable, Bridge IS walkable
    [true, true, true, true, true, true, true, false, false, false, false, false, true, true, true, true, true, true, false, false, false, false, false, true, true, true, true, true, true, true],
    // Row 13: Water is NOT walkable
    [true, true, true, true, true, true, true, true, true, false, false, false, true, true, true, true, true, false, false, false, true, true, true, true, true, true, true, true, true, true],
    // Row 14
    [true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true],
    // Row 15
    [true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true],
    // Row 16
    [true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true],
    // Row 17
    [true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true],
    // Row 18
    [true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true],
    // Row 19
    [true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true],
    // Row 20
    [true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true],
    // Row 21
    [true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true],
    // Row 22
    [true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true],
    // Row 23
    [true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true],
    // Row 24
    [true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true],
  ],
};
