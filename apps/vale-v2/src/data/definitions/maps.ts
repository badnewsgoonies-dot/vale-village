import type { GameMap, TileType } from '../../core/models/overworld';

const createTile = (type: TileType): { type: TileType; walkable: boolean } => ({
  type,
  walkable: type !== 'wall' && type !== 'water',
});

const buildRow = (type: TileType): ReturnType<typeof createTile>[] =>
  Array.from({ length: 30 }, () => createTile(type));

const VALLE_VILLAGE_WIDTH = 30;
const VALLE_VILLAGE_HEIGHT = 20;

const buildTiles = (): GameMap['tiles'] => {
  const tiles: ReturnType<typeof createTile>[][] = [];
  for (let y = 0; y < VALLE_VILLAGE_HEIGHT; y++) {
    const row = buildRow('grass');
    const pathX = y === 10;
    if (pathX) {
      for (let x = 5; x < 25; x++) {
        row[x] = createTile('path');
      }
    }
    if (y >= 3 && y <= 8) {
      row[5] = createTile('wall');
      row[24] = createTile('wall');
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

const buildTriggers = (): GameMap['triggers'] => [
  { id: 'battle-1', type: 'battle', position: { x: 7, y: 10 }, data: { encounterId: 'bandit-ambush' } },
  { id: 'battle-2', type: 'battle', position: { x: 10, y: 10 }, data: { encounterId: 'beetle-patrol' } },
  { id: 'npc-elder', type: 'npc', position: { x: 15, y: 5 }, data: { npcId: 'elder-vale' } },
  { id: 'shop-weapons', type: 'transition', position: { x: 8, y: 6 }, data: { targetMap: 'weapon-shop-interior', targetPos: { x: 5, y: 7 } } },
  { id: 'shop-weapons-exit', type: 'transition', position: { x: 5, y: 7 }, data: { targetMap: 'vale-village', targetPos: { x: 8, y: 6 } } },
];

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
};
