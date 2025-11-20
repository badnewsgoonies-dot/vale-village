import type { GameMap } from '../../core/models/overworld';

type TileType = GameMap['tiles'][number][number]['type'];

const createTile = (type: TileType): { type: TileType; walkable: boolean } => ({
  type,
  walkable: type !== 'wall' && type !== 'water',
});

const buildRow = (type: TileType): ReturnType<typeof createTile>[] =>
  Array.from({ length: VALLE_VILLAGE_WIDTH }, () => createTile(type));

// Expanded width to accommodate all 20 houses along horizontal road
const VALLE_VILLAGE_WIDTH = 80;
const VALLE_VILLAGE_HEIGHT = 20;

const buildTiles = (): GameMap['tiles'] => {
  const tiles: ReturnType<typeof createTile>[][] = [];
  for (let y = 0; y < VALLE_VILLAGE_HEIGHT; y++) {
    const row = buildRow('grass');
    // Horizontal road at y=10, extending across most of the map
    const pathX = y === 10;
    if (pathX) {
      for (let x = 5; x < VALLE_VILLAGE_WIDTH - 5; x++) {
        row[x] = createTile('path');
      }
    }
    // Entrance paths connecting houses to road (vertical paths from y=5-9 to road at y=10)
    // Houses positioned above road, with entrance paths every 3-4 tiles
    if (y >= 5 && y < 10) {
      // Create entrance paths for houses 1-20
      // Houses spaced every 3-4 tiles starting at x=7
      const housePositions = [7, 10, 13, 16, 19, 22, 25, 28, 31, 34, 37, 40, 43, 46, 49, 52, 55, 58, 61, 64];
      for (const houseX of housePositions) {
        if (houseX < VALLE_VILLAGE_WIDTH) {
          row[houseX] = createTile('path');
        }
      }
    }
    // Keep some original features
    if (y >= 3 && y <= 8) {
      row[5] = createTile('wall');
    }
    if (y === 3) {
      row[6] = createTile('door');
    }
    if (y === 15) {
      row[12] = createTile('water');
      row[13] = createTile('water');
    }
    tiles.push(row);
  }
  return tiles;
};

const createNPC = (id: string, x: number, y: number): GameMap['npcs'][number] => ({
  id,
  name: id.replace('-', ' '),
  position: { x, y },
  spriteId: 'npc-default',
});

const NPC_COUNT = 50;
const buildNPCs = (): GameMap['npcs'] => 
  Array.from({ length: NPC_COUNT }, (_, idx) =>
    createNPC(`villager-${idx + 1}`, (idx % VALLE_VILLAGE_WIDTH), 2 + Math.floor(idx / VALLE_VILLAGE_WIDTH))
  );

const buildTriggers = (): GameMap['triggers'] => {
  // House positions along the road - houses positioned above road, entrances at road level
  const housePositions = [
    { x: 7, houseNum: '01' },
    { x: 10, houseNum: '02' },
    { x: 13, houseNum: '03' },
    { x: 16, houseNum: '04' },
    { x: 19, houseNum: '05' },
    { x: 22, houseNum: '06' },
    { x: 25, houseNum: '07' },
    { x: 28, houseNum: '08' },
    { x: 31, houseNum: '09' },
    { x: 34, houseNum: '10' },
    { x: 37, houseNum: '11' },
    { x: 40, houseNum: '12' },
    { x: 43, houseNum: '13' },
    { x: 46, houseNum: '14' },
    { x: 49, houseNum: '15' },
    { x: 52, houseNum: '16' },
    { x: 55, houseNum: '17' },
    { x: 58, houseNum: '18' },
    { x: 61, houseNum: '19' },
    { x: 64, houseNum: '20' },
  ];

  const houseTriggers = housePositions.map(({ x, houseNum }) => ({
    id: `house-${houseNum}-trigger`,
    type: 'transition' as const,
    position: { x, y: 10 }, // Entrance at road level
    data: { 
      targetMap: `house-${houseNum}-interior`, 
      targetPos: { x: 5, y: 7 } // Spawn position inside house
    },
  }));

  return [
    ...houseTriggers,
    { id: 'npc-elder', type: 'npc', position: { x: 15, y: 5 }, data: { npcId: 'elder-vale' } },
    { id: 'shop-vale-armory', type: 'shop', position: { x: 12, y: 5 }, data: { shopId: 'vale-armory' } },
    {
      id: 'shop-weapons',
      type: 'transition',
      position: { x: 8, y: 6 },
      data: { targetMap: 'weapon-shop-interior', targetPos: { x: 5, y: 7 } },
    },
    {
      id: 'shop-weapons-exit',
      type: 'transition',
      position: { x: 5, y: 7 },
      data: { targetMap: 'vale-village', targetPos: { x: 8, y: 6 } },
    },
  ];
};

// Helper function to create house interior maps
const createHouseInterior = (
  houseId: string,
  houseNum: string,
  overworldEntranceX: number,
  npcX: number = 5,
  npcY: number = 3
): GameMap => {
  const tiles: GameMap['tiles'] = Array.from({ length: 8 }, () => 
    Array.from({ length: 10 }, () => createTile('path'))
  );
  
  // Add some variety: occasional walls for different layouts
  if (parseInt(houseNum) % 3 === 0) {
    // Add a wall on the left side for some houses
    for (let y = 2; y < 6; y++) {
      tiles[y]![1] = createTile('wall');
    }
  }
  
  return {
    id: houseId,
    name: `House ${houseNum}`,
    width: 10,
    height: 8,
    tiles,
    npcs: [createNPC(`house-${houseNum}-enemy`, npcX, npcY)],
    triggers: [
      {
        id: `house-${houseNum}-enemy-trigger`,
        type: 'npc',
        position: { x: npcX, y: npcY },
        data: { npcId: `house-${houseNum}-enemy` },
      },
      {
        id: `house-${houseNum}-exit`,
        type: 'transition',
        position: { x: 5, y: 7 },
        data: { targetMap: 'vale-village', targetPos: { x: overworldEntranceX, y: 10 } },
      },
    ],
    spawnPoint: { x: 5, y: 7 },
  };
};

export const MAPS: Record<string, GameMap> = {
  'vale-village': {
    id: 'vale-village',
    name: 'Vale Village',
    width: VALLE_VILLAGE_WIDTH,
    height: VALLE_VILLAGE_HEIGHT,
    tiles: buildTiles(),
    npcs: buildNPCs(),
    triggers: buildTriggers(),
    spawnPoint: { x: 15, y: 10 },
  },
  'weapon-shop-interior': {
    id: 'weapon-shop-interior',
    name: 'Weapon Shop',
    width: 10,
    height: 8,
    tiles: Array.from({ length: 8 }, () => Array.from({ length: 10 }, () => createTile('path'))),
    npcs: [createNPC('shopkeeper-weapons', 5, 3)],
    triggers: [
      { id: 'exit-shop', type: 'transition', position: { x: 5, y: 7 }, data: { targetMap: 'vale-village', targetPos: { x: 8, y: 6 } } },
    ],
    spawnPoint: { x: 5, y: 7 },
  },
  // House interiors for all 20 houses
  'house-01-interior': createHouseInterior('house-01-interior', '01', 7),
  'house-02-interior': createHouseInterior('house-02-interior', '02', 10),
  'house-03-interior': createHouseInterior('house-03-interior', '03', 13, 4, 3), // Varied NPC position
  'house-04-interior': createHouseInterior('house-04-interior', '04', 16),
  'house-05-interior': createHouseInterior('house-05-interior', '05', 19, 6, 3), // Varied NPC position
  'house-06-interior': createHouseInterior('house-06-interior', '06', 22),
  'house-07-interior': createHouseInterior('house-07-interior', '07', 25),
  'house-08-interior': createHouseInterior('house-08-interior', '08', 28, 4, 2), // Varied NPC position
  'house-09-interior': createHouseInterior('house-09-interior', '09', 31),
  'house-10-interior': createHouseInterior('house-10-interior', '10', 34, 6, 4), // Varied NPC position
  'house-11-interior': createHouseInterior('house-11-interior', '11', 37),
  'house-12-interior': createHouseInterior('house-12-interior', '12', 40),
  'house-13-interior': createHouseInterior('house-13-interior', '13', 43, 4, 2), // Varied NPC position
  'house-14-interior': createHouseInterior('house-14-interior', '14', 46),
  'house-15-interior': createHouseInterior('house-15-interior', '15', 49, 6, 3), // Varied NPC position
  'house-16-interior': createHouseInterior('house-16-interior', '16', 52),
  'house-17-interior': createHouseInterior('house-17-interior', '17', 55),
  'house-18-interior': createHouseInterior('house-18-interior', '18', 58, 4, 4), // Varied NPC position
  'house-19-interior': createHouseInterior('house-19-interior', '19', 61),
  'house-20-interior': createHouseInterior('house-20-interior', '20', 64, 5, 2), // Varied NPC position for final house
};
