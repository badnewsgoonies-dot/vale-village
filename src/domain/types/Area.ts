import type { Equipment } from './Equipment';
import type { Item } from './Item';
import { ENEMIES } from '@/data/enemies';

/**
 * Area/Location system for Vale Chronicles
 * Defines maps, encounters, treasures, and NPCs
 */

/**
 * Valid enemy IDs - auto-generated from enemies.ts ENEMIES registry
 * This ensures type safety and prevents runtime errors from invalid enemy IDs
 */
export type EnemyId = keyof typeof ENEMIES;

/**
 * Game World IDs - Use snake_case for technical reasons
 * 
 * Note: Game world identifiers use snake_case (not kebab-case) because:
 * 1. Used as JavaScript object keys (areaStates, AREAS lookup)
 * 2. Story flags are interface properties (can't use hyphens without bracket notation)
 * 3. CSS attribute selectors depend on exact string matching
 * 
 * See docs/NAMING_CONVENTIONS.md "Game World Naming Exception" section
 */

/** Valid area IDs - matches areas.ts AREAS registry */
export type AreaId =
  | 'vale_village'
  | 'forest_path'
  | 'ancient_ruins'
  | 'battle_row'
  // Battle Row house interiors (30 houses)
  | 'house1_interior' | 'house2_interior' | 'house3_interior' | 'house4_interior' | 'house5_interior'
  | 'house6_interior' | 'house7_interior' | 'house8_interior' | 'house9_interior' | 'house10_interior'
  | 'house11_interior' | 'house12_interior' | 'house13_interior' | 'house14_interior' | 'house15_interior'
  | 'house16_interior' | 'house17_interior' | 'house18_interior' | 'house19_interior' | 'house20_interior'
  | 'house21_interior' | 'house22_interior' | 'house23_interior' | 'house24_interior' | 'house25_interior'
  | 'house26_interior' | 'house27_interior' | 'house28_interior' | 'house29_interior' | 'house30_interior';

/** Valid quest IDs - matches quests.ts quest registry */
export type QuestId =
  | 'tutorial_welcome'
  | 'quest_clear_forest'
  | 'quest_ancient_ruins'
  | 'quest_defeat_wolves'
  | 'quest_find_djinn'
  | 'quest_explore_ruins'
  | 'quest_mysterious_stranger'
  | 'side_buy_equipment'
  | 'side_find_treasure'
  | 'side_level_up';

/** Valid boss IDs - matches boss encounters in areas.ts */
export type BossId = 'alpha_wolf_boss' | 'stone_titan_boss' | 'golem_king_boss';

/** Valid chest IDs - template literal type for forest/ruins chests */
export type ChestId =
  | `forest_chest_${1 | 2 | 3 | 4 | 5 | 6}`
  | `ruins_chest_${1 | 2 | 3 | 4 | 5 | 6 | 7}`
  | 'village_starter_chest'
  | 'village_hidden_chest'
  | 'ruins_hidden_chest';

export type AreaType = 'town' | 'dungeon' | 'overworld';

export interface Position {
  x: number;
  y: number;
}

export interface EnemyPool {
  weight: number; // Probability weight
  enemyIds: EnemyId[]; // Enemy IDs to spawn (now type-safe!)
}

export interface BossEncounter {
  id: BossId;
  position: Position;
  enemyIds: EnemyId[]; // Enemy IDs (now type-safe!)
  dialogue?: {
    before?: string;
    after?: string;
  };
  defeated: boolean; // Track if boss has been defeated
  questId?: QuestId; // Quest associated with this boss (now type-safe!)
}

export interface TreasureChest {
  id: ChestId;
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
  questId?: QuestId; // Quest giver (now type-safe!)
  shopType?: 'item' | 'equipment' | 'inn'; // Opens shop when talked to
  battleOnInteract?: EnemyId[]; // Enemy IDs to battle when interacting with this NPC (now type-safe!)
  battleOnlyOnce?: boolean; // If true, only battle once then show dialogue
  battleRewards?: {
    gold?: number; // Bonus gold reward (added to normal battle gold)
    equipment?: Equipment[]; // Guaranteed equipment drops (added to RNG drops)
    djinnId?: string; // Djinn reward (ID from ALL_DJINN registry)
  };
}

export interface Building {
  id: string;
  label: string;
  position: Position; // Grid position (in tiles)
  sprite: string; // Path to building sprite
  blocking: boolean; // Can player walk through?
  interactable?: boolean; // Can player interact with it?
  onInteract?: () => void; // What happens when interacted with
}

export interface Scenery {
  id: string;
  position: Position; // Grid position (in tiles)
  sprite: string; // Path to scenery sprite (tree, bush, grass, etc.)
  blocking: boolean; // Can player walk through?
  layer?: 'background' | 'foreground'; // Render layer (default: foreground)
}

export interface AreaExit {
  id: string;
  position: Position;
  width: number; // Exit zone width
  height: number; // Exit zone height
  targetArea: AreaId; // Area ID to transition to (now type-safe!)
  targetPosition: Position; // Where player spawns in target area
  requiredFlag?: string; // Story flag required to use this exit
}

export interface Area {
  id: AreaId; // Area ID (now type-safe!)
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

  // Buildings
  buildings?: Building[];

  // Scenery (trees, plants, decorations)
  scenery?: Scenery[];

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
