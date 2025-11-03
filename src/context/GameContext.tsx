import { createContext, useContext } from 'react';
import type { GameState, Screen } from './types';
import type { Equipment } from '@/types/Equipment';
import type { Djinn } from '@/types/Djinn';

export interface GameActions {
  // Navigation
  navigate: (screen: Screen) => void;
  goBack: () => void;

  // Unit management
  setActiveParty: (unitIds: string[]) => void;

  // Equipment
  equipItem: (unitId: string, slot: string, equipment: Equipment) => void;
  unequipItem: (unitId: string, slot: string) => void;

  // Djinn
  equipDjinn: (unitId: string, djinn: Djinn) => void;
  unequipDjinn: (djinnId: string) => void;

  // Battle
  startBattle: (enemyIds: string[]) => void;
  executeTurn: (abilityId: string, targetId: string) => void;
  endBattle: () => void;
}

export interface GameContextValue {
  state: GameState;
  actions: GameActions;
}

export const GameContext = createContext<GameContextValue | null>(null);

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within GameProvider');
  }
  return context;
};
