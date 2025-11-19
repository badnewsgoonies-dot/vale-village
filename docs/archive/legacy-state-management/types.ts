// src/state/types.ts
// GameState type definitions

import type { PlayerData } from '@/types/PlayerData';
import type { Team } from '@/types/Team';
import type { BattleState } from '@/types/Battle';
import type { Element } from '@/types/Element';

export interface GameState {
  // Core game data
  playerData: PlayerData;
  team: Team;
  
  // Current scene/screen
  currentScreen: 'equipment' | 'collection' | 'battle' | 'rewards' | 'overworld';
  
  // Battle state (null when not in battle)
  currentBattle: BattleState | null;
  
  // UI state
  ui: {
    selectedUnitId: string | null;
    hoveredItemId: string | null;
    modalOpen: boolean;
    modalType: 'confirm' | 'info' | null;
  };
  
  // Animation state
  transition: {
    active: boolean;
    stage: 'hold' | 'swirl' | 'fade' | 'complete';
    element: Element | null;
  };
}

export type GameAction =
  // PlayerData actions
  | { type: 'RECRUIT_UNIT'; unit: Unit }
  | { type: 'SET_ACTIVE_PARTY'; unitIds: string[] }
  | { type: 'ADD_GOLD'; amount: number }
  | { type: 'ADD_TO_INVENTORY'; item: Equipment }
  | { type: 'REMOVE_FROM_INVENTORY'; itemId: string }
  
  // Equipment actions
  | { type: 'EQUIP_ITEM'; unitId: string; slot: keyof EquipmentLoadout; item: Equipment }
  | { type: 'UNEQUIP_ITEM'; unitId: string; slot: keyof EquipmentLoadout }
  
  // Team/Djinn actions
  | { type: 'EQUIP_DJINN'; djinn: Djinn[] }
  | { type: 'ACTIVATE_DJINN'; djinnId: string; unitId: string }
  
  // Battle actions
  | { type: 'START_BATTLE'; enemies: Unit[] }
  | { type: 'BATTLE_TURN_COMPLETE'; result: ActionResult }
  | { type: 'BATTLE_END'; result: BattleResult }
  
  // Screen navigation
  | { type: 'NAVIGATE_TO'; screen: GameState['currentScreen'] }
  | { type: 'SELECT_UNIT'; unitId: string }
  
  // UI actions
  | { type: 'OPEN_MODAL'; modalType: 'confirm' | 'info' }
  | { type: 'CLOSE_MODAL' }
  
  // Transition actions
  | { type: 'START_TRANSITION'; element: Element }
  | { type: 'TRANSITION_STAGE'; stage: GameState['transition']['stage'] }
  | { type: 'COMPLETE_TRANSITION' };

