import type { GameMap } from '../../core/models/overworld';

type TileType = GameMap['tiles'][number][number]['type'];

const createTile = (type: TileType, walkableOverride?: boolean): { type: TileType; walkable: boolean } => ({
  type,
  walkable: typeof walkableOverride === 'boolean' ? walkableOverride : type !== 'wall' && type !== 'water',
});

const VALLE_VILLAGE_WIDTH = 84;
const VALLE_VILLAGE_HEIGHT = 5;
// Single horizontal road row; houses and any building entrances sit one tile above this
const ROAD_ROW = 2;
const HOUSE_COUNT = 20;
const HOUSE_WIDTH = 11;
const HOUSE_HEIGHT = 9;
const HOUSE_CENTER_X = Math.floor(HOUSE_WIDTH / 2);
const HOUSE_ENEMY_Y = 3;
const HOUSE_EXIT_Y = HOUSE_HEIGHT - 2;

const HOUSE_IDS = Array.from({ length: HOUSE_COUNT }, (_, index) => String(index + 1).padStart(2, '0'));
const HOUSE_POSITIONS = HOUSE_IDS.map((houseNum, index) => ({
  houseNum,
  overworldX: 7 + index * 4,
}));

const HOUSE_SPRITES = [
  '/sprites/buildings/Vale/Vale_Building1.gif',
  '/sprites/buildings/Vale/Vale_Building2.gif',
  '/sprites/buildings/Vale/Vale_Building3.gif',
  '/sprites/buildings/Vale/Vale_Building4.gif',
];

// Overworld house entrances sit one tile above the road row
const HOUSE_ENTRANCE_ROW = ROAD_ROW - 1;
const HOUSE_FACE_ROW = HOUSE_ENTRANCE_ROW - 1;

// Precompute doorway columns for houses
const HOUSE_DOOR_COLUMNS = new Set(HOUSE_POSITIONS.map(({ overworldX }) => overworldX));

const buildValeVillageTiles = (): GameMap['tiles'] => {
  const tiles: GameMap['tiles'] = [];
  for (let y = 0; y < VALLE_VILLAGE_HEIGHT; y++) {
    const row: GameMap['tiles'][number] = [];
    for (let x = 0; x < VALLE_VILLAGE_WIDTH; x++) {
      if (y === ROAD_ROW) {
        // Main road through the village
        row.push(createTile('path'));
      } else if (y === HOUSE_ENTRANCE_ROW && HOUSE_DOOR_COLUMNS.has(x)) {
        // Walkable doorway tiles for houses, one row above the road
        row.push({ ...createTile('door'), spriteId: 'house-door' });
      } else if (y === HOUSE_FACE_ROW && HOUSE_DOOR_COLUMNS.has(x)) {
        // Simple house facade visuals above each doorway
        const houseIndex = HOUSE_POSITIONS.findIndex((pos) => pos.overworldX === x);
        const spriteId = HOUSE_SPRITES[houseIndex % HOUSE_SPRITES.length];
        row.push({ ...createTile('wall', false), spriteId });
      } else if (y === HOUSE_FACE_ROW && HOUSE_DOOR_COLUMNS.has(x - 1)) {
        const houseIndex = HOUSE_POSITIONS.findIndex((pos) => pos.overworldX === x - 1);
        const spriteId = HOUSE_SPRITES[houseIndex % HOUSE_SPRITES.length];
        row.push({ ...createTile('wall', false), spriteId });
      } else if (y === HOUSE_FACE_ROW && HOUSE_DOOR_COLUMNS.has(x + 1)) {
        const houseIndex = HOUSE_POSITIONS.findIndex((pos) => pos.overworldX === x + 1);
        const spriteId = HOUSE_SPRITES[houseIndex % HOUSE_SPRITES.length];
        row.push({ ...createTile('wall', false), spriteId });
      } else {
        // Non-walkable background (prevents wandering off the road/door tiles)
        row.push(createTile('grass', false));
      }
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

const TOWER_ENTRANCE_COLUMN = 76;

const buildValeVillageNPCs = (): GameMap['npcs'] => [
  createNPC('tower-attendant', TOWER_ENTRANCE_COLUMN, ROAD_ROW),
];

const buildValeVillageTriggers = (): GameMap['triggers'] => {
  const houseTriggers = HOUSE_POSITIONS.map(({ houseNum, overworldX }, index) => ({
    id: `house-${houseNum}-door`,
    type: 'transition' as const,
    position: { x: overworldX, y: HOUSE_ENTRANCE_ROW },
    data: {
      targetMap: `house-${houseNum}-interior`,
      targetPos: { x: HOUSE_CENTER_X, y: HOUSE_EXIT_Y },
      requiredFlags: index === 0 ? undefined : [`house-${HOUSE_IDS[index - 1]}`],
    },
  }));

  return [
    ...houseTriggers,
    {
      id: 'tower-entrance',
      type: 'tower' as const,
      position: { x: TOWER_ENTRANCE_COLUMN, y: ROAD_ROW },
      data: {
        sourceMapId: 'vale-village',
        returnPos: { x: TOWER_ENTRANCE_COLUMN, y: ROAD_ROW },
      },
    },
  ];
};

const createHouseInteriorTiles = (): GameMap['tiles'] => {
  const tiles: GameMap['tiles'] = [];
  for (let y = 0; y < HOUSE_HEIGHT; y++) {
    const row: GameMap['tiles'][number] = [];
    for (let x = 0; x < HOUSE_WIDTH; x++) {
      if (y === 0 || y === HOUSE_HEIGHT - 1 || x === 0 || x === HOUSE_WIDTH - 1) {
        row.push(createTile('wall'));
      } else if (y === HOUSE_EXIT_Y && x === HOUSE_CENTER_X) {
        row.push(createTile('door'));
      } else {
        row.push(createTile('path'));
      }
    }
    tiles.push(row);
  }
  return tiles;
};

const createHouseInterior = (
  houseId: string,
  houseNum: string,
  overworldEntranceX: number,
): GameMap => ({
  id: houseId,
  name: `House ${parseInt(houseNum, 10)}`,
  width: HOUSE_WIDTH,
  height: HOUSE_HEIGHT,
  tiles: createHouseInteriorTiles(),
  npcs: [createNPC(`house-${houseNum}-enemy`, HOUSE_CENTER_X, HOUSE_ENEMY_Y)],
  triggers: [
    {
      id: `house-${houseNum}-enemy`,
      type: 'npc',
      position: { x: HOUSE_CENTER_X, y: HOUSE_ENEMY_Y },
      data: { npcId: `house-${houseNum}-enemy` },
    },
    {
      id: `house-${houseNum}-exit`,
      type: 'transition',
      position: { x: HOUSE_CENTER_X, y: HOUSE_EXIT_Y },
      data: { targetMap: 'vale-village', targetPos: { x: overworldEntranceX, y: ROAD_ROW } },
    },
  ],
  spawnPoint: { x: HOUSE_CENTER_X, y: HOUSE_EXIT_Y },
});

const HOUSE_MAPS = HOUSE_POSITIONS.reduce<Record<string, GameMap>>((maps, { houseNum, overworldX }) => {
  const houseId = `house-${houseNum}-interior`;
  maps[houseId] = createHouseInterior(houseId, houseNum, overworldX);
  return maps;
}, {});

export const MAPS: Record<string, GameMap> = {
  'vale-village': {
    id: 'vale-village',
    name: 'Vale Village',
    width: VALLE_VILLAGE_WIDTH,
    height: VALLE_VILLAGE_HEIGHT,
    tiles: buildValeVillageTiles(),
    npcs: buildValeVillageNPCs(),
    triggers: buildValeVillageTriggers(),
    spawnPoint: { x: 7, y: ROAD_ROW },
  },
  ...HOUSE_MAPS,
};
