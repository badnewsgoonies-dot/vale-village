import { create } from 'zustand';
import type { GameState } from '@/context/types';
import type { PlayerData } from '@/types/PlayerData';

/**
 * Central game store using Zustand
 * This will gradually replace GameProvider
 */
interface GameStore {
  // Game state
  state: GameState;
  
  // Actions
  setState: (state: GameState) => void;
  updatePlayerData: (updater: (prev: PlayerData) => PlayerData) => void;
}

export const useGameStore = create<GameStore>((set) => ({
  // Initial state will be set by GameProvider for now
  state: {} as GameState,
  
  setState: (newState) => set({ state: newState }),
  
  updatePlayerData: (updater) => set((store) => ({
    state: {
      ...store.state,
      playerData: updater(store.state.playerData),
    },
  })),
}));


