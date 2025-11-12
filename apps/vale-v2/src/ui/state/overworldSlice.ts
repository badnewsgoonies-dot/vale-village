import type { StateCreator } from 'zustand';
import type { MapTrigger, Position } from '../../core/models/overworld';
import { MAPS } from '../../data/definitions/maps';
import { processMovement } from '../../core/services/OverworldService';
import { DIALOGUES } from '@/data/definitions/dialogues';
import type { GameFlowSlice } from './gameFlowSlice';
import type { DialogueSlice } from './dialogueSlice';

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

export const createOverworldSlice: StateCreator<OverworldSlice> = (set, get) => {
  const getStore = () => get() as OverworldSlice & GameFlowSlice & DialogueSlice;

  return {
    currentMapId: 'vale-village',
    playerPosition: MAPS['vale-village'].spawnPoint,
    facing: 'down',
    currentTrigger: null,

  setFacing: (direction) => set({ facing: direction }),

  movePlayer: (direction) => {
    const store = getStore();
    const map = MAPS[store.currentMapId];
    if (!map) return;

    const result = processMovement(map, store.playerPosition, direction);
    if (!result.blocked) {
      set({ playerPosition: result.newPos, facing: direction, currentTrigger: result.trigger ?? null });
      const trigger = result.trigger ?? null;
      if (trigger?.type === 'npc') {
        const npcId = (trigger.data as { npcId?: string }).npcId;
        if (npcId && DIALOGUES[npcId]) {
          store.startDialogueTree(DIALOGUES[npcId]);
        }
      }
      store.handleTrigger(trigger);
    }
  },

  teleportPlayer: (mapId, position) => {
    if (!MAPS[mapId]) return;
    set({ currentMapId: mapId, playerPosition: position, facing: 'down' });
  },

  clearTrigger: () => set({ currentTrigger: null }),
  };
};
