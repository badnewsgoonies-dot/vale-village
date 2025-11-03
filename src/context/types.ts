import type { PlayerData } from '@/types/PlayerData';
import type { BattleState } from '@/types/Battle';
import type { Quest } from '@/types/Quest';

export type Screen =
  | { type: 'TITLE' }
  | { type: 'INTRO' }
  | { type: 'UNIT_COLLECTION' }
  | { type: 'EQUIPMENT'; unitId: string }
  | { type: 'BATTLE' }
  | { type: 'REWARDS' }
  | { type: 'DJINN_MENU' }
  | { type: 'MAIN_MENU' }
  | { type: 'OVERWORLD'; location?: string }
  | { type: 'SHOP'; shopType: 'item' | 'equipment' | 'inn' }
  | { type: 'DIALOGUE'; npcId: string; dialogueKey?: string }
  | { type: 'QUEST_LOG' };

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
  openedChests: Set<string>; // Chest IDs that have been opened
  defeatedBosses: Set<string>; // Boss IDs that have been defeated
  stepCounter: number; // Steps taken in this area (for random encounters)
}

export interface GameState {
  playerData: PlayerData;
  currentBattle: BattleState | null;
  currentScreen: Screen;
  screenHistory: Screen[];
  loading: boolean;
  error: string | null;

  // New systems
  quests: Quest[];
  storyFlags: StoryFlags;
  currentLocation: string; // 'vale_village', 'forest_path', 'ancient_ruins'
  playerPosition: { x: number; y: number }; // Player position on current map
  areaStates: Record<string, AreaState>; // Track state per area
}
