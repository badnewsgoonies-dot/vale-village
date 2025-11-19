import type { StateCreator } from 'zustand';
import type { MapTrigger } from '@/core/models/overworld';
import type { Encounter } from '@/data/schemas/EncounterSchema';
import type { Team } from '@/core/models/Team';
import { ENCOUNTERS } from '@/data/definitions/encounters';
import { createBattleFromEncounter } from '@/core/services/EncounterService';
import { makePRNG } from '@/core/random/prng';
import { DIALOGUES } from '@/data/definitions/dialogues';
import { getPreBattleDialogue } from '@/data/definitions/preBattleDialogues';
import type { QueueBattleSlice } from './queueBattleSlice';
import type { TeamSlice } from './teamSlice';
import type { DialogueSlice } from './dialogueSlice';
import type { OverworldSlice } from './overworldSlice';

export interface GameFlowSlice {
  mode: 'title-screen' | 'main-menu' | 'intro' | 'overworld' | 'battle' | 'rewards' | 'dialogue' | 'shop' | 'team-select';
  lastTrigger: MapTrigger | null;
  currentEncounter: Encounter | null;
  currentShopId: string | null;
  preBattlePosition: { mapId: string; position: { x: number; y: number } } | null;
  pendingBattleEncounterId: string | null;
  setMode: (mode: GameFlowSlice['mode']) => void;
  setPendingBattle: (encounterId: string | null) => void;
  handleTrigger: (trigger: MapTrigger | null, skipPreBattleDialogue?: boolean) => void;
  confirmBattleTeam: (team: Team) => void;
  resetLastTrigger: () => void;
  returnToOverworld: () => void;
}

export const createGameFlowSlice: StateCreator<
  GameFlowSlice & QueueBattleSlice & TeamSlice & DialogueSlice & OverworldSlice,
  [['zustand/devtools', never]],
  [],
  GameFlowSlice
> = (set, get) => ({
  mode: 'title-screen',
  lastTrigger: null,
  currentEncounter: null,
  currentShopId: null,
  preBattlePosition: null,
  pendingBattleEncounterId: null,
  setMode: (mode) => set({ mode }),
  setPendingBattle: (encounterId) => {
    // When setting a pending battle, automatically transition to team-select mode
    // This matches the behavior of handleTrigger when a battle trigger is encountered
    set({ 
      pendingBattleEncounterId: encounterId,
      mode: encounterId ? 'team-select' : 'overworld'
    });
  },
  handleTrigger: (trigger, skipPreBattleDialogue = false) => {
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

      // Check for pre-battle dialogue (unless skipped - e.g., when triggered from dialogue)
      if (!skipPreBattleDialogue) {
        const preBattleDialogue = getPreBattleDialogue(encounterId);
        if (preBattleDialogue) {
          // Show pre-battle dialogue first
          // The dialogue will trigger the battle via effects.startBattle
          get().startDialogueTree(preBattleDialogue);
          set({ lastTrigger: trigger });
          return;
        }
      }

      // No pre-battle dialogue (or skipped): go straight to team-select
      set({
        mode: 'team-select',
        pendingBattleEncounterId: encounterId,
        lastTrigger: trigger,
      });
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

  confirmBattleTeam: (team: Team) => {
    const { pendingBattleEncounterId } = get();
    if (!pendingBattleEncounterId) {
      console.error('No pending battle encounter');
      return;
    }

    const encounter = ENCOUNTERS[pendingBattleEncounterId];
    if (!encounter) {
      console.error(`Encounter ${pendingBattleEncounterId} not found`);
      return;
    }

    // Save current overworld position before entering battle
    const { currentMapId, playerPosition } = get();
    const preBattlePosition = {
      mapId: currentMapId,
      position: { x: playerPosition.x, y: playerPosition.y },
    };

    // Create battle with selected team
    const seed = Date.now();
    const rng = makePRNG(seed);

    try {
      const result = createBattleFromEncounter(pendingBattleEncounterId, team, rng);
      if (!result || !result.battle) {
        console.error(`Failed to create battle from encounter ${pendingBattleEncounterId}`);
        return;
      }

      get().setBattle(result.battle, seed);
      get().setTeam(team);

      set({
        currentEncounter: encounter,
        mode: 'battle',
        preBattlePosition,
        pendingBattleEncounterId: null,
      });
    } catch (error) {
      console.error('Error creating battle:', error);
    }
  },

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
