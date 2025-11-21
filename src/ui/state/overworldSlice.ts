import type { StateCreator } from 'zustand';
import type { MapTrigger, Position } from '../../core/models/overworld';
import { MAPS } from '../../data/definitions/maps';
import { processMovement } from '../../core/services/OverworldService';
import { isHouseUnlocked } from '../../core/services/StoryService';
import { DIALOGUES } from '@/data/definitions/dialogues';
import type { GameFlowSlice } from './gameFlowSlice';
import type { DialogueSlice } from './dialogueSlice';
import type { StorySlice } from './storySlice';

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

const startMap = MAPS['vale-village'];
if (!startMap) {
  throw new Error('Starting map "vale-village" not found');
}
const STARTING_MAP = startMap;

export const createOverworldSlice: StateCreator<OverworldSlice> = (set, get) => {
  const getStore = () => get() as OverworldSlice & GameFlowSlice & DialogueSlice & StorySlice;

  return {
    currentMapId: 'vale-village',
    playerPosition: STARTING_MAP.spawnPoint,
    facing: 'down',
    currentTrigger: null,

    setFacing: (direction) => set({ facing: direction }),

    movePlayer: (direction) => {
      const store = getStore();
      const map = MAPS[store.currentMapId];
      if (!map) return;

      const result = processMovement(map, store.playerPosition, direction);
      if (!result.blocked) {
        const trigger = result.trigger ?? null;

        // Filter out locked/defeated battle triggers
        let filteredTrigger = trigger;
        if (trigger?.type === 'battle') {
          const encounterId = (trigger.data as { encounterId?: string }).encounterId;
          if (encounterId) {
            const story = store.story;

            // Skip defeated encounters (liberation encounters are one-time only)
            if (story.flags[encounterId] === true) {
              filteredTrigger = null;
            }
            // Skip locked encounters (progressive unlock system)
            else if (!isHouseUnlocked(story, encounterId)) {
              filteredTrigger = null;
            }
          }
        }

        // First Djinn intro: intercept House 1 door before the first battle
        if (trigger?.type === 'transition' && trigger.id === 'house-01-door') {
          const hasSeenDjinnIntro = Boolean(store.story.flags['first_djinn_intro_completed']);
          if (!hasSeenDjinnIntro) {
            const djinnIntro = DIALOGUES['tutorial:djinn-intro'];
            if (djinnIntro) {
              store.startDialogueTree(djinnIntro);
              // Prevent immediate transition into the house until the intro is complete
              filteredTrigger = null;
            }
          }
        }

        set({
          playerPosition: result.newPos,
          facing: direction,
          currentTrigger: filteredTrigger,
        });

        // Handle NPC dialogue (use original trigger for NPCs)
        if (trigger?.type === 'npc') {
          const npcId = (trigger.data as { npcId?: string }).npcId;
          if (npcId && DIALOGUES[npcId]) {
            store.startDialogueTree(DIALOGUES[npcId]);
          }
        }

        // Process filtered trigger (respects unlock status and defeated state)
        store.handleTrigger(filteredTrigger);
      }
    },

    teleportPlayer: (mapId, position) => {
      if (!MAPS[mapId]) return;
      set({ currentMapId: mapId, playerPosition: position, facing: 'down' });
    },

    clearTrigger: () => set({ currentTrigger: null }),
  };
};
