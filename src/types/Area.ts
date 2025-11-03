import type { Equipment } from './Equipment';
import type { Item } from './Item';

/**
 * Area/Location system for Vale Chronicles
 * Defines maps, encounters, treasures, and NPCs
 */

export type AreaType = 'town' | 'dungeon' | 'overworld';

export interface Position {
  x: number;
  y: number;
}

export interface EnemyPool {
  weight: number; // Probability weight
  enemyIds: string[]; // Enemy IDs to spawn
}

export interface BossEncounter {
  id: string;
  position: Position;
  enemyIds: string[];
  dialogue?: {
    before?: string;
    after?: string;
  };
  defeated: boolean; // Track if boss has been defeated
  questId?: string; // Quest associated with this boss
}

export interface TreasureChest {
  id: string;
  position: Position;
  contents: {
    gold?: number;
    items?: Item[];
    equipment?: Equipment[];
  };
  opened: boolean;
}

export interface NPC {
  id: string;
  name: string;
  position: Position;
  sprite?: string;
  blocking: boolean; // Can player walk through?
  dialogue: string | Record<string, string>; // Simple string or keyed by story flags
  questId?: string; // Quest giver
  shopType?: 'item' | 'equipment' | 'inn'; // Opens shop when talked to
}

export interface AreaExit {
  id: string;
  position: Position;
  width: number; // Exit zone width
  height: number; // Exit zone height
  targetArea: string; // Area ID to transition to
  targetPosition: Position; // Where player spawns in target area
  requiredFlag?: string; // Story flag required to use this exit
}

export interface Area {
  id: string;
  name: string;
  type: AreaType;
  width: number; // Map width in tiles
  height: number; // Map height in tiles

  // Encounters (only for dungeons)
  hasRandomEncounters: boolean;
  encounterRate?: number; // Steps between encounters (e.g., 15 = battle every ~15 steps)
  enemyPools?: EnemyPool[];

  // Bosses
  bosses: BossEncounter[];

  // Treasures
  treasures: TreasureChest[];

  // NPCs
  npcs: NPC[];

  // Area transitions
  exits: AreaExit[];

  // Visual
  backgroundColor?: string;
  tilesetId?: string;
}

/**
 * Check if position is in exit zone
 */
export function isInExitZone(position: Position, exit: AreaExit): boolean {
  return (
    position.x >= exit.position.x &&
    position.x < exit.position.x + exit.width &&
    position.y >= exit.position.y &&
    position.y < exit.position.y + exit.height
  );
}

/**
 * Check if position overlaps with NPC
 */
export function isNPCAtPosition(position: Position, npc: NPC): boolean {
  return position.x === npc.position.x && position.y === npc.position.y;
}

/**
 * Check if position has treasure chest
 */
export function isTreasureAtPosition(position: Position, treasure: TreasureChest): boolean {
  return (
    !treasure.opened &&
    position.x === treasure.position.x &&
    position.y === treasure.position.y
  );
}

/**
 * Check if position triggers boss encounter
 */
export function isBossAtPosition(position: Position, boss: BossEncounter): boolean {
  return (
    !boss.defeated &&
    position.x === boss.position.x &&
    position.y === boss.position.y
  );
}

/**
 * Get random enemy group from pools
 */
export function getRandomEnemyGroup(pools: EnemyPool[]): string[] {
  const totalWeight = pools.reduce((sum, pool) => sum + pool.weight, 0);
  let random = Math.random() * totalWeight;

  for (const pool of pools) {
    random -= pool.weight;
    if (random <= 0) {
      return pool.enemyIds;
    }
  }

  // Fallback to first pool
  return pools[0]?.enemyIds || [];
}
