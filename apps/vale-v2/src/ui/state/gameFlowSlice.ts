import type { StateCreator } from 'zustand';
import type { MapTrigger } from '@/core/models/overworld';
import type { Encounter } from '@/data/schemas/EncounterSchema';
import { ENCOUNTERS } from '@/data/definitions/encounters';
import { createBattleFromEncounter } from '@/core/services/EncounterService';
import { makePRNG } from '@/core/random/prng';
import { DIALOGUES } from '@/data/definitions/dialogues';
import type { QueueBattleSlice } from './queueBattleSlice';
import type { TeamSlice } from './teamSlice';
import type { DialogueSlice } from './dialogueSlice';
import type { OverworldSlice } from './overworldSlice';

export interface GameFlowSlice {
  mode: 'overworld' | 'battle' | 'rewards' | 'dialogue' | 'shop';
  lastTrigger: MapTrigger | null;
  currentEncounter: Encounter | null;
  currentShopId: string | null;
  preBattlePosition: { mapId: string; position: { x: number; y: number } } | null;
  setMode: (mode: GameFlowSlice['mode']) => void;
  handleTrigger: (trigger: MapTrigger | null) => void;
  resetLastTrigger: () => void;
  returnToOverworld: () => void;
}

export const createGameFlowSlice: StateCreator<
  GameFlowSlice & QueueBattleSlice & TeamSlice & DialogueSlice & OverworldSlice,
  [['zustand/devtools', never]],
  [],
  GameFlowSlice
> = (set, get) => ({
  mode: 'overworld',
  lastTrigger: null,
  currentEncounter: null,
  currentShopId: null,
  preBattlePosition: null,
  setMode: (mode) => set({ mode }),
  handleTrigger: (trigger) => {
    if (!trigger) {
      set({ lastTrigger: null });
      return;
    }

    // ========================================
    // BATTLE TRIGGERS
    // ========================================
    if (trigger.type === 'battle') {
      const encounterId = (trigger.data as { encounterId?: string }).encounterId;
      if (!encounterId) {
        console.error('Battle trigger missing encounterId');
        return;
      }

      const encounter = ENCOUNTERS[encounterId];
      if (!encounter) {
        console.error(`Encounter ${encounterId} not found in ENCOUNTERS`);
        return;
      }

      const team = get().team;
      if (!team) {
        console.error('No team available for battle');
        return;
      }

      // Save current overworld position before entering battle
      const { currentMapId, playerPosition } = get();
      const preBattlePosition = {
        mapId: currentMapId,
        position: { x: playerPosition.x, y: playerPosition.y },
      };

      const seed = Date.now();
      const rng = makePRNG(seed);

      try {
        const result = createBattleFromEncounter(encounterId, team, rng);
        if (!result || !result.battle) {
          console.error(`Failed to create battle from encounter ${encounterId}`);
          return;
        }

        get().setBattle(result.battle, seed);

        set({
          currentEncounter: encounter,
          lastTrigger: trigger,
          mode: 'battle',
          preBattlePosition,
        });

      } catch (error) {
        console.error('Error creating battle:', error);
        return;
      }

      return;
    }

    // ========================================
    // NPC TRIGGERS
    // ========================================
    if (trigger.type === 'npc') {
      const npcId = (trigger.data as { npcId?: string }).npcId;
      if (npcId && DIALOGUES[npcId]) {
        get().startDialogueTree(DIALOGUES[npcId]);
      } else if (npcId) {
        console.warn(`Dialogue ${npcId} not found`);
      }

      set({ lastTrigger: trigger });
      return;
    }

    // ========================================
    // STORY TRIGGERS
    // ========================================
    if (trigger.type === 'story') {
      const storyId = (trigger.data as { storyId?: string }).storyId;
      if (storyId && DIALOGUES[storyId]) {
        get().startDialogueTree(DIALOGUES[storyId]);
      } else if (storyId) {
        console.warn(`Story dialogue ${storyId} not found`);
      }

      set({ lastTrigger: trigger });
      return;
    }

    // ========================================
    // SHOP TRIGGERS
    // ========================================
    if (trigger.type === 'shop') {
      const shopId = (trigger.data as { shopId?: string }).shopId;
      if (!shopId) {
        console.error('Shop trigger missing shopId');
        return;
      }

      set({
        lastTrigger: trigger,
        currentShopId: shopId,
        mode: 'shop',
      });
      return;
    }

    // ========================================
    // TRANSITION TRIGGERS
    // ========================================
    if (trigger.type === 'transition') {
      set({ lastTrigger: trigger });
      return;
    }

    // Default: just track trigger
    set({ lastTrigger: trigger });
  },
  resetLastTrigger: () => set({ lastTrigger: null }),

  returnToOverworld: () => {
    const { preBattlePosition, teleportPlayer } = get();

    // Restore to pre-battle position if available
    if (preBattlePosition) {
      teleportPlayer(preBattlePosition.mapId, preBattlePosition.position);
    }

    // Clear battle state and return to overworld
    set({
      mode: 'overworld',
      preBattlePosition: null,
      currentEncounter: null,
      lastTrigger: null,
    });
  },
});
