import type { GameMap, MapTrigger, Position, Tile } from '../models/overworld';

function getTile(map: GameMap, position: Position): Tile | undefined {
  const withinX = position.x >= 0 && position.x < map.width;
  const withinY = position.y >= 0 && position.y < map.height;
  if (!withinX || !withinY) return undefined;
  const row = map.tiles[position.y];
  if (!row) return undefined;
  return row[position.x];
}

export function canMoveTo(map: GameMap, position: Position): boolean {
  const tile = getTile(map, position);
  if (!tile) return false;
  if (!tile.walkable) return false;
  const npcCollision = map.npcs.find(npc => npc.position.x === position.x && npc.position.y === position.y);
  if (npcCollision) {
    const hasNpcTrigger = map.triggers.some(trigger =>
      trigger.type === 'npc' && trigger.position.x === position.x && trigger.position.y === position.y
    );
    if (!hasNpcTrigger) {
      return false;
    }
  }
  return true;
}

export function getTriggerAt(map: GameMap, position: Position): MapTrigger | undefined {
  return map.triggers.find(trigger => trigger.position.x === position.x && trigger.position.y === position.y);
}

export function processMovement(
  currentMap: GameMap,
  currentPos: Position,
  direction: 'up' | 'down' | 'left' | 'right'
): { newPos: Position; blocked: boolean; trigger?: MapTrigger } {
  const delta: Record<'up' | 'down' | 'left' | 'right', Position> = {
    up: { x: 0, y: -1 },
    down: { x: 0, y: 1 },
    left: { x: -1, y: 0 },
    right: { x: 1, y: 0 },
  };
  const nextPos: Position = {
    x: currentPos.x + delta[direction].x,
    y: currentPos.y + delta[direction].y,
  };

  if (!canMoveTo(currentMap, nextPos)) {
    return { newPos: currentPos, blocked: true };
  }

  const trigger = getTriggerAt(currentMap, nextPos);
  return { newPos: nextPos, blocked: false, trigger };
}
