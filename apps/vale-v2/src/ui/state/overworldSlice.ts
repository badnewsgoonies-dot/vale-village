import type { StateCreator } from 'zustand';
import type { MapTrigger, Position } from '../../core/models/overworld';
import { MAPS } from '../../data/definitions/maps';
import { processMovement } from '../../core/services/OverworldService';
import { processRandomEncounter } from '../../core/services/EncounterService';
import { makePRNG } from '../../core/random/prng';
import { DIALOGUES } from '@/data/definitions/dialogues';
import type { GameFlowSlice } from './gameFlowSlice';
import type { DialogueSlice } from './dialogueSlice';

export interface OverworldSlice {
  currentMapId: string;
  playerPosition: Position;
  facing: 'up' | 'down' | 'left' | 'right';
  currentTrigger: MapTrigger | null;
  stepCount: number; // Track steps for random encounters
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
  const getStore = () => get() as OverworldSlice & GameFlowSlice & DialogueSlice;

  return {
    currentMapId: 'vale-village',
    playerPosition: STARTING_MAP.spawnPoint,
    facing: 'down',
    currentTrigger: null,
    stepCount: 0,

    setFacing: (direction) => set({ facing: direction }),

    movePlayer: (direction) => {
      const store = getStore();
      const map = MAPS[store.currentMapId];
      if (!map) return;

      const result = processMovement(map, store.playerPosition, direction);
      if (!result.blocked) {
        // Increment step count
        const newStepCount = store.stepCount + 1;

        // Check for random encounter (only if no fixed trigger)
        let trigger = result.trigger ?? null;
        if (!trigger && map.encounterRate && map.encounterPool) {
          // Use step count as seed for deterministic-ish encounters
          const rng = makePRNG(Date.now() + newStepCount);
          const randomEncounterId = processRandomEncounter(
            map.encounterRate,
            map.encounterPool,
            rng
          );

          if (randomEncounterId) {
            // Create a synthetic battle trigger for random encounter
            trigger = {
              id: `random-encounter-${newStepCount}`,
              type: 'battle' as const,
              position: result.newPos,
              data: { encounterId: randomEncounterId },
            };
          }
        }

        set({
          playerPosition: result.newPos,
          facing: direction,
          currentTrigger: trigger,
          stepCount: newStepCount,
        });

        // Handle NPC dialogue
        if (trigger?.type === 'npc') {
          const npcId = (trigger.data as { npcId?: string }).npcId;
          if (npcId && DIALOGUES[npcId]) {
            store.startDialogueTree(DIALOGUES[npcId]);
          }
        }

        // Process trigger
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
