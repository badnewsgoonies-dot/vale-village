import type { BuildingType } from '@/components/overworld/BuildingSprite';

export interface BuildingPlacement {
  id: string;
  type: BuildingType;
  x: number;  // Grid position (left tile)
  y: number;  // Grid position (top tile)
  width: number;  // Width in tiles
  height: number;  // Height in tiles
  blocking: boolean;  // Whether this building blocks movement
  entranceX?: number;  // Optional entrance tile X
  entranceY?: number;  // Optional entrance tile Y
  interactable?: boolean;
}

/**
 * Vale Village Building Layout
 *
 * Based on the terrain map (30×25 grid):
 * - Northern area: Sanctum (sacred space)
 * - Central plaza: Isaac's house, Jenna's house, Shop
 * - Stream crossing: Bridge (rows 10-12)
 * - Southern area: Kraden's house, Garet's house, Inn
 * - Southern exit: Gate
 *
 * Buildings are placed on grass/stone path areas to match Golden Sun layout
 */
export const VALE_VILLAGE_BUILDINGS: BuildingPlacement[] = [
  // Northern Sacred Area
  {
    id: 'sanctum',
    type: 'sanctum',
    x: 13,
    y: 1,
    width: 4,
    height: 3,
    blocking: true,
    entranceX: 15,
    entranceY: 4,
    interactable: true,
  },
  {
    id: 'psynergy-stone',
    type: 'psynergy-stone',
    x: 11,
    y: 2,
    width: 1,
    height: 1,
    blocking: false,
    interactable: true,
  },

  // Northern Residential
  {
    id: 'jennas-house',
    type: 'jennas-house',
    x: 10,
    y: 3,
    width: 3,
    height: 2,
    blocking: true,
    entranceX: 11,
    entranceY: 5,
    interactable: true,
  },
  {
    id: 'vale-building-1',
    type: 'vale-building-1',
    x: 17,
    y: 3,
    width: 2,
    height: 2,
    blocking: true,
    interactable: false,
  },

  // Central Plaza - Main Houses
  {
    id: 'isaacs-house',
    type: 'isaacs-house',
    x: 8,
    y: 5,
    width: 3,
    height: 3,
    blocking: true,
    entranceX: 9,
    entranceY: 8,
    interactable: true,
  },
  {
    id: 'weparm-shop',
    type: 'weparm-shop',
    x: 20,
    y: 5,
    width: 3,
    height: 2,
    blocking: true,
    entranceX: 21,
    entranceY: 7,
    interactable: true,
  },

  // Western Residential
  {
    id: 'vale-building-2',
    type: 'vale-building-2',
    x: 4,
    y: 6,
    width: 2,
    height: 2,
    blocking: true,
    interactable: false,
  },
  {
    id: 'vale-building-3',
    type: 'vale-building-3',
    x: 4,
    y: 8,
    width: 2,
    height: 2,
    blocking: true,
    interactable: false,
  },

  // Eastern Residential
  {
    id: 'vale-building-4',
    type: 'vale-building-4',
    x: 24,
    y: 6,
    width: 2,
    height: 2,
    blocking: true,
    interactable: false,
  },
  {
    id: 'vale-building-5',
    type: 'vale-building-5',
    x: 26,
    y: 8,
    width: 2,
    height: 2,
    blocking: true,
    interactable: false,
  },

  // Southern Area - Post-Stream
  {
    id: 'vale-inn',
    type: 'vale-inn',
    x: 8,
    y: 15,
    width: 3,
    height: 2,
    blocking: true,
    entranceX: 9,
    entranceY: 17,
    interactable: true,
  },
  {
    id: 'kradens-house',
    type: 'kradens-house',
    x: 18,
    y: 16,
    width: 3,
    height: 2,
    blocking: true,
    entranceX: 19,
    entranceY: 18,
    interactable: true,
  },
  {
    id: 'garets-house',
    type: 'garets-house',
    x: 23,
    y: 16,
    width: 3,
    height: 2,
    blocking: true,
    entranceX: 24,
    entranceY: 18,
    interactable: true,
  },

  // Southern Storage/Farm
  {
    id: 'vale-building-6',
    type: 'vale-building-6',
    x: 5,
    y: 19,
    width: 2,
    height: 2,
    blocking: true,
    interactable: false,
  },
  {
    id: 'vale-building-7',
    type: 'vale-building-7',
    x: 12,
    y: 20,
    width: 2,
    height: 2,
    blocking: true,
    interactable: false,
  },
  {
    id: 'vale-building-8',
    type: 'vale-building-8',
    x: 19,
    y: 20,
    width: 2,
    height: 2,
    blocking: true,
    interactable: false,
  },

  // Southern Exit
  {
    id: 'vale-gate',
    type: 'gate',
    x: 14,
    y: 23,
    width: 2,
    height: 2,
    blocking: false,  // Gate is walkable (exit point)
    interactable: true,
  },
];

/**
 * Get all tiles occupied by buildings for collision detection
 */
export function getBuildingCollisionTiles(): Set<string> {
  const tiles = new Set<string>();

  for (const building of VALE_VILLAGE_BUILDINGS) {
    if (building.blocking) {
      // Mark all tiles occupied by this building
      for (let dy = 0; dy < building.height; dy++) {
        for (let dx = 0; dx < building.width; dx++) {
          const tileX = building.x + dx;
          const tileY = building.y + dy;
          tiles.add(`${tileX},${tileY}`);
        }
      }
    }
  }

  return tiles;
}
