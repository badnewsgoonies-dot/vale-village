import type { PlayerData } from '@/types/PlayerData';
import type { BattleState } from '@/types/Battle';
import type { Quest } from '@/types/Quest';
import type { AreaId, BossId, ChestId } from '@/types/Area';
import type { RewardDistribution } from '@/types/BattleRewards';

export type Screen =
  | { type: 'TITLE' }
  | { type: 'INTRO' }
  | { type: 'UNIT_COLLECTION' }
  | { type: 'PARTY_MANAGEMENT' }
  | { type: 'EQUIPMENT'; unitId: string }
  | { type: 'BATTLE' }
  | { type: 'REWARDS' }
  | { type: 'DJINN_MENU' }
  | { type: 'MAIN_MENU' }
  | { type: 'OVERWORLD'; location?: AreaId }
  | { type: 'SHOP'; shopType: 'item' | 'equipment' | 'inn' }
  | { type: 'DIALOGUE'; npcId: string; dialogueKey?: string }
  | { type: 'DEMO' };

/**
 * Story flags use snake_case as they are interface properties.
 * JavaScript property names cannot contain hyphens without bracket notation.
 * 
 * Example: storyFlags.intro_seen ✅  vs  storyFlags['intro-seen'] ⚠️
 * 
 * See docs/NAMING_CONVENTIONS.md "Game World Naming Exception" section
 */
export interface StoryFlags {
  // Tutorial
  intro_seen: boolean;
  talked_to_elder_first_time: boolean;

  // Quest progression
  quest_forest_started: boolean;
  quest_forest_complete: boolean;
  quest_ruins_started: boolean;
  quest_ruins_complete: boolean;

  // Boss defeats
  defeated_alpha_wolf: boolean;
  defeated_golem_king: boolean;

  // NPCs
  met_mysterious_stranger: boolean;
  talked_to_shopkeeper: boolean;
  used_inn: boolean;

  // Djinn
  obtained_djinn_flint: boolean;
  obtained_djinn_forge: boolean;

  // Areas unlocked
  forest_path_unlocked: boolean;
  ancient_ruins_unlocked: boolean;

  // Tutorial flags
  tutorial_battle_complete: boolean;
  tutorial_shop_complete: boolean;
}

export interface AreaState {
  openedChests: Set<ChestId>; // Chest IDs that have been opened (now type-safe!)
  defeatedBosses: Set<BossId>; // Boss IDs that have been defeated (now type-safe!)
  stepCounter: number; // Steps taken in this area (for random encounters)
}

export interface GameState {
  playerData: PlayerData;
  currentBattle: BattleState | null;
  lastBattleRewards: RewardDistribution | null;
  currentScreen: Screen;
  screenHistory: Screen[];
  loading: boolean;
  error: string | null;

  // New systems
  quests: Quest[];
  storyFlags: StoryFlags;
  currentLocation: AreaId; // Now type-safe! 'vale_village', 'forest_path', 'ancient_ruins'
  playerPosition: { x: number; y: number }; // Player position on current map
  areaStates: Record<AreaId, AreaState>; // Track state per area (now type-safe!)
}
