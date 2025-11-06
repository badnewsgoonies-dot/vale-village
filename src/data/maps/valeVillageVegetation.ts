import type { PropType } from '@/components/overworld/PropSprite';

export interface PropPlacement {
  id: string;
  type: PropType;
  x: number;  // Grid position
  y: number;  // Grid position
  blocking: boolean;  // Whether this prop blocks movement
}

/**
 * Vale Village Vegetation & Props Layout
 *
 * Strategic placement based on terrain features:
 * - Trees: Forest borders (north/south edges)
 * - Bushes/Shrubs: Near buildings, along paths
 * - Flowers: Gardens near houses
 * - Statues: Sacred area near Sanctum
 */
export const VALE_VILLAGE_PROPS: PropPlacement[] = [
  // Northern Forest Border (Row 0-1)
  { id: 'tree-n-1', type: 'tree-1', x: 0, y: 0, blocking: true },
  { id: 'tree-n-2', type: 'tree-2', x: 2, y: 0, blocking: true },
  { id: 'tree-n-3', type: 'tree-3', x: 6, y: 0, blocking: true },
  { id: 'tree-n-4', type: 'tree-4', x: 22, y: 0, blocking: true },
  { id: 'tree-n-5', type: 'tree-5', x: 26, y: 0, blocking: true },
  { id: 'tree-n-6', type: 'tree-6', x: 28, y: 0, blocking: true },

  // Sanctum Sacred Area (Row 1-3) - Statues and decorative plants
  { id: 'statue-sanctum-1', type: 'statue-venus', x: 12, y: 2, blocking: true },
  { id: 'statue-sanctum-2', type: 'statue-mercury', x: 18, y: 2, blocking: true },
  { id: 'flowers-sanctum-1', type: 'flowers', x: 13, y: 4, blocking: false },
  { id: 'flowers-sanctum-2', type: 'flowers', x: 17, y: 4, blocking: false },

  // Northern Residential Gardens (Row 3-5)
  { id: 'bush-nr-1', type: 'bush', x: 9, y: 3, blocking: false },
  { id: 'shrub-nr-1', type: 'shrub-1', x: 13, y: 3, blocking: false },
  { id: 'flowers-nr-1', type: 'flowers', x: 16, y: 4, blocking: false },
  { id: 'bush-nr-2', type: 'bush-2', x: 19, y: 3, blocking: false },

  // Central Plaza Gardens (Row 5-8)
  { id: 'shrub-cp-1', type: 'shrub-2', x: 5, y: 5, blocking: false },
  { id: 'bush-cp-1', type: 'bush', x: 7, y: 6, blocking: false },
  { id: 'flowers-cp-1', type: 'flowers', x: 11, y: 6, blocking: false },
  { id: 'bush-cp-2', type: 'bush-3', x: 23, y: 6, blocking: false },
  { id: 'shrub-cp-2', type: 'shrub-3', x: 25, y: 7, blocking: false },

  // Western Residential (Row 6-9)
  { id: 'bush-wr-1', type: 'bush', x: 3, y: 6, blocking: false },
  { id: 'bush-wr-2', type: 'bush-2', x: 3, y: 8, blocking: false },
  { id: 'shrub-wr-1', type: 'shrub-1', x: 6, y: 7, blocking: false },

  // Eastern Residential (Row 6-9)
  { id: 'bush-er-1', type: 'bush', x: 26, y: 6, blocking: false },
  { id: 'bush-er-2', type: 'bush-3', x: 27, y: 8, blocking: false },

  // Stream Banks (Row 9-13) - Natural vegetation
  { id: 'shrub-stream-1', type: 'shrub-4', x: 6, y: 9, blocking: false },
  { id: 'bush-stream-1', type: 'bush', x: 22, y: 9, blocking: false },
  { id: 'shrub-stream-2', type: 'shrub-5', x: 4, y: 12, blocking: false },
  { id: 'bush-stream-2', type: 'bush-2', x: 25, y: 12, blocking: false },
  { id: 'leaf-stream-1', type: 'leaf', x: 10, y: 13, blocking: false },
  { id: 'leaf-stream-2', type: 'leaf', x: 20, y: 13, blocking: false },

  // Southern Residential Gardens (Row 15-20)
  { id: 'bush-sr-1', type: 'bush', x: 7, y: 15, blocking: false },
  { id: 'flowers-sr-1', type: 'flowers', x: 11, y: 16, blocking: false },
  { id: 'shrub-sr-1', type: 'shrub-1', x: 13, y: 16, blocking: false },
  { id: 'bush-sr-2', type: 'bush-2', x: 17, y: 16, blocking: false },
  { id: 'flowers-sr-2', type: 'flowers', x: 22, y: 17, blocking: false },
  { id: 'bush-sr-3', type: 'bush-3', x: 26, y: 17, blocking: false },

  // Southern Field Area (Row 19-21)
  { id: 'shrub-sf-1', type: 'shrub-2', x: 4, y: 19, blocking: false },
  { id: 'bush-sf-1', type: 'bush', x: 10, y: 20, blocking: false },
  { id: 'bush-sf-2', type: 'bush-2', x: 21, y: 20, blocking: false },
  { id: 'shrub-sf-2', type: 'shrub-3', x: 25, y: 21, blocking: false },

  // Southern Forest Border (Row 22-24)
  { id: 'tree-s-1', type: 'tree-7', x: 0, y: 22, blocking: true },
  { id: 'tree-s-2', type: 'tree-8', x: 2, y: 23, blocking: true },
  { id: 'tree-s-3', type: 'tree-9', x: 5, y: 23, blocking: true },
  { id: 'tree-s-4', type: 'tree-10', x: 21, y: 23, blocking: true },
  { id: 'tree-s-5', type: 'tree-1', x: 25, y: 23, blocking: true },
  { id: 'tree-s-6', type: 'tree-2', x: 27, y: 22, blocking: true },

  // Gate Area Decoration (Row 22-23)
  { id: 'statue-gate-1', type: 'statue-guardian', x: 12, y: 22, blocking: true },
  { id: 'statue-gate-2', type: 'statue-guardian', x: 17, y: 22, blocking: true },
];

/**
 * Get all tiles occupied by blocking props for collision detection
 */
export function getPropCollisionTiles(): Set<string> {
  const tiles = new Set<string>();

  for (const prop of VALE_VILLAGE_PROPS) {
    if (prop.blocking) {
      // Trees are 2×2, statues are 1×2, bushes are 1×1
      const isTree = prop.type.startsWith('tree-');
      const isStatue = prop.type.startsWith('statue-');

      if (isTree) {
        // 2×2 tree
        tiles.add(`${prop.x},${prop.y}`);
        tiles.add(`${prop.x + 1},${prop.y}`);
        tiles.add(`${prop.x},${prop.y + 1}`);
        tiles.add(`${prop.x + 1},${prop.y + 1}`);
      } else if (isStatue) {
        // 1×2 statue
        tiles.add(`${prop.x},${prop.y}`);
        tiles.add(`${prop.x},${prop.y + 1}`);
      } else {
        // 1×1 prop
        tiles.add(`${prop.x},${prop.y}`);
      }
    }
  }

  return tiles;
}
