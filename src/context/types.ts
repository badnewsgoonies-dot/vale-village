import type { PlayerData } from '@/types/PlayerData';
import type { BattleState } from '@/types/Battle';

export type Screen =
  | { type: 'TITLE' }
  | { type: 'UNIT_COLLECTION' }
  | { type: 'EQUIPMENT'; unitId: string }
  | { type: 'BATTLE' }
  | { type: 'REWARDS' }
  | { type: 'DJINN_MENU' }
  | { type: 'OVERWORLD' };

export interface GameState {
  playerData: PlayerData;
  currentBattle: BattleState | null;
  currentScreen: Screen;
  screenHistory: Screen[];
  loading: boolean;
  error: string | null;
}
