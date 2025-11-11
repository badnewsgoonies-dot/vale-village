import type { StateCreator } from 'zustand';
import type { MapTrigger, Position } from '../../core/models/overworld';
import { MAPS } from '../../data/definitions/maps';
import { processMovement } from '../../core/services/OverworldService';
import type { GameFlowSlice } from './gameFlowSlice';

export interface OverworldSlice {
  currentMapId: string;
  playerPosition: Position;
  facing: 'up' | 'down' | 'left' | 'right';
  currentTrigger: MapTrigger | null;
  setFacing: (direction: OverworldSlice['facing']) => void;
  movePlayer: (direction: 'up' | 'down' | 'left' | 'right') => void;
  teleportPlayer: (mapId: string, position: Position) => void;
  clearTrigger: () => void;
}

export type OverworldStore = OverworldSlice;

export const createOverworldSlice: StateCreator<OverworldSlice & GameFlowSlice> = (set, get) => ({
  currentMapId: 'vale-village',
  playerPosition: MAPS['vale-village'].spawnPoint,
  facing: 'down',
  currentTrigger: null,

  setFacing: (direction) => set({ facing: direction }),

  movePlayer: (direction) => {
    const map = MAPS[get().currentMapId];
    const result = processMovement(map, get().playerPosition, direction);
    if (!result.blocked) {
      set({ playerPosition: result.newPos, facing: direction, currentTrigger: result.trigger ?? null });
      get().handleTrigger(result.trigger ?? null);
    }
  },

  teleportPlayer: (mapId, position) => {
    if (!MAPS[mapId]) return;
    set({ currentMapId: mapId, playerPosition: position, facing: 'down' });
  },

  clearTrigger: () => set({ currentTrigger: null }),
});
