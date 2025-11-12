import type { StateCreator } from 'zustand';
import type { MapTrigger, Position } from '../../core/models/overworld';
import { MAPS } from '../../data/definitions/maps';
import { processMovement } from '../../core/services/OverworldService';
import { DIALOGUES } from '@/data/definitions/dialogues';
import type { GameFlowSlice } from './gameFlowSlice';
import type { DialogueSlice } from './dialogueSlice';

export interface CompanionSprite {
  unitId: string;
  position: Position;
  facing: 'up' | 'down' | 'left' | 'right';
}

export interface OverworldSlice {
  currentMapId: string;
  playerPosition: Position;
  facing: 'up' | 'down' | 'left' | 'right';
  companions: CompanionSprite[];
  currentTrigger: MapTrigger | null;
  setFacing: (direction: OverworldSlice['facing']) => void;
  movePlayer: (direction: 'up' | 'down' | 'left' | 'right') => void;
  teleportPlayer: (mapId: string, position: Position) => void;
  clearTrigger: () => void;
  updateCompanions: (companions: CompanionSprite[]) => void;
}

export type OverworldStore = OverworldSlice;

const startMap = MAPS['vale-village'];
if (!startMap) {
  throw new Error('Starting map "vale-village" not found');
}
const STARTING_MAP = startMap;

export const createOverworldSlice: StateCreator<OverworldSlice> = (set, get) => {
  const getStore = () => get() as OverworldSlice & GameFlowSlice & DialogueSlice;

  return {
    currentMapId: 'vale-village',
    playerPosition: STARTING_MAP.spawnPoint,
    facing: 'down',
    companions: [],
    currentTrigger: null,

    setFacing: (direction) => set({ facing: direction }),

    movePlayer: (direction) => {
      const store = getStore();
      const map = MAPS[store.currentMapId];
      if (!map) return;

      const result = processMovement(map, store.playerPosition, direction);
      if (!result.blocked) {
        // Store old player position for companion follow logic
        const oldPlayerPos = store.playerPosition;
        const oldFacing = store.facing;
        
        // Update companions in follow-the-leader pattern
        const updatedCompanions = store.companions.map((companion, index) => {
          if (index === 0) {
            // First companion follows player
            return {
              ...companion,
              position: oldPlayerPos,
              facing: oldFacing,
            };
          } else {
            // Other companions follow the previous companion
            const prevCompanion = store.companions[index - 1];
            return {
              ...companion,
              position: prevCompanion.position,
              facing: prevCompanion.facing,
            };
          }
        });
        
        set({ 
          playerPosition: result.newPos, 
          facing: direction, 
          companions: updatedCompanions,
          currentTrigger: result.trigger ?? null 
        });
        
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
      // Teleport companions to player position
      const updatedCompanions = get().companions.map(companion => ({
        ...companion,
        position,
      }));
      set({ 
        currentMapId: mapId, 
        playerPosition: position, 
        facing: 'down',
        companions: updatedCompanions,
      });
    },

    clearTrigger: () => set({ currentTrigger: null }),
    
    updateCompanions: (companions) => set({ companions }),
  };
};
