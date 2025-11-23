import type { StateCreator } from 'zustand';
import type { MapTrigger } from '@/core/models/overworld';
import type { Encounter } from '@/data/schemas/EncounterSchema';
import type { Unit } from '@/core/models/Unit';
import { createTeam, updateTeam, type Team } from '@/core/models/Team';
import { updateUnit } from '@/core/models/Unit';
import type { EquipmentSlot, Equipment } from '@/core/models/Equipment';
import { createEmptyLoadout } from '@/core/models/Equipment';
import { ENCOUNTERS } from '@/data/definitions/encounters';
import { createBattleFromEncounter } from '@/core/services/EncounterService';
import { makePRNG } from '@/core/random/prng';
import { DIALOGUES } from '@/data/definitions/dialogues';
import { getPreBattleDialogue } from '@/data/definitions/preBattleDialogues';
import type { QueueBattleSlice } from './queueBattleSlice';
import type { TeamSlice } from './teamSlice';
import type { DialogueSlice } from './dialogueSlice';
import type { OverworldSlice } from './overworldSlice';
import type { InventorySlice } from './inventorySlice';
import type { TowerSlice } from './towerSlice';
import { MIN_PARTY_SIZE } from '@/core/constants';
import type { BattleConfig } from './battleConfig';
import { buildBattleConfigForNextBattle, cloneEquipmentLoadout, updateDjinnSlots, validateBattleConfig } from './battleConfig';

export interface GameFlowSlice {
  mode:
    | 'title-screen'
    | 'main-menu'
    | 'intro'
    | 'overworld'
    | 'battle'
    | 'rewards'
    | 'dialogue'
    | 'shop'
    | 'team-select'
    | 'compendium'
    | 'tower';
  lastTrigger: MapTrigger | null;
  currentEncounter: Encounter | null;
  currentShopId: string | null;
  preBattlePosition: { mapId: string; position: { x: number; y: number } } | null;
  currentBattleConfig: BattleConfig | null;
  pendingBattleEncounterId: string | null;
  setMode: (mode: GameFlowSlice['mode']) => void;
  setPendingBattle: (encounterId: string | null) => void;
  handleTrigger: (trigger: MapTrigger | null, skipPreBattleDialogue?: boolean) => void;
  confirmBattleTeam: () => void;
  updateBattleConfigSlot: (slotIndex: number, unitId: string | null) => void;
  updateBattleSlotEquipment: (slotIndex: number, equipmentSlot: EquipmentSlot, equipment: Equipment | null) => void;
  setBattleConfigDjinnSlot: (slotIndex: number, djinnId: string | null) => void;
  clearBattleConfig: () => void;
  resetLastTrigger: () => void;
  returnToOverworld: () => void;
}

export const createGameFlowSlice: StateCreator<
  GameFlowSlice & QueueBattleSlice & TeamSlice & DialogueSlice & OverworldSlice & InventorySlice & TowerSlice,
  [['zustand/devtools', never]],
  [],
  GameFlowSlice
> = (set, get) => {
  const buildTeamFromBattleConfig = (): Team | null => {
    const store = get();
    const { currentBattleConfig, team: existingTeam } = store;

    if (!currentBattleConfig) {
      console.error('No battle configuration available when building team');
      return null;
    }

    const units: Unit[] = [];
    for (const slot of currentBattleConfig.slots) {
      if (!slot.unitId) {
        continue;
      }

      let unit = store.getUnitFromRoster(slot.unitId);
      if (!unit && existingTeam) {
        unit = existingTeam.units.find((candidate) => candidate.id === slot.unitId);
      }

      if (!unit) {
        console.error(`Unit ${slot.unitId} missing from roster/team when building battle team`);
        return null;
      }

      const equipmentLoadout = slot.equipmentLoadout ?? createEmptyLoadout();
      const unitWithEquipment = updateUnit(unit, { equipment: cloneEquipmentLoadout(equipmentLoadout) });
      units.push(unitWithEquipment);
    }

    if (units.length < MIN_PARTY_SIZE) {
      console.error(`Battle requires at least ${MIN_PARTY_SIZE} units, found ${units.length}`);
      return null;
    }

    const baseTeam = existingTeam ? updateTeam(existingTeam, { units }) : createTeam(units);

    const selectedDjinn = currentBattleConfig.djinnSlots.filter((djinnId): djinnId is string => Boolean(djinnId));
    if (selectedDjinn.length > 0) {
      try {
        return updateTeam(baseTeam, { equippedDjinn: selectedDjinn });
      } catch (error) {
        console.error('Failed to apply Djinn selection from BattleConfig', error);
        return null;
      }
    }

    return baseTeam;
  };

  const initializeBattleConfig = () => buildBattleConfigForNextBattle(get().team, get().roster);

  return {
    mode: 'title-screen',
    lastTrigger: null,
    currentEncounter: null,
    currentShopId: null,
    preBattlePosition: null,
    currentBattleConfig: null,
    pendingBattleEncounterId: null,
    setMode: (mode) => set({ mode }),
    setPendingBattle: (encounterId) => {
    // When setting a pending battle, automatically transition to team-select mode
    // This matches the behavior of handleTrigger when a battle trigger is encountered
    const battleConfig = encounterId ? initializeBattleConfig() : null;
    set({ 
      pendingBattleEncounterId: encounterId,
      mode: encounterId ? 'team-select' : 'overworld',
      currentBattleConfig: battleConfig,
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
        currentBattleConfig: initializeBattleConfig(),
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
    // TOWER TRIGGERS
    // ========================================
    if (trigger.type === 'tower') {
      const { enterTowerFromOverworld } = get();
      const mapId = get().currentMapId;
      if (mapId) {
        enterTowerFromOverworld({ mapId, position: trigger.position });
      }
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

  confirmBattleTeam: () => {
    const store = get();
    const {
      pendingBattleEncounterId,
      currentBattleConfig,
      equipment,
      roster,
      team,
      currentMapId,
      playerPosition,
    } = store;

    if (!pendingBattleEncounterId) {
      console.error('No pending battle encounter');
      return;
    }

    if (!currentBattleConfig) {
      console.error('Missing battle configuration when confirming battle');
      return;
    }

    const validation = validateBattleConfig(currentBattleConfig, equipment, roster, team);
    if (!validation.valid) {
      console.error('Battle configuration validation failed', validation.message);
      return;
    }

    const encounter = ENCOUNTERS[pendingBattleEncounterId];
    if (!encounter) {
      console.error(`Encounter ${pendingBattleEncounterId} not found`);
      return;
    }

    const selectedTeam = buildTeamFromBattleConfig();
    if (!selectedTeam) {
      console.error('Could not resolve team for battle');
      return;
    }

    const preBattlePosition = {
      mapId: currentMapId,
      position: { x: playerPosition.x, y: playerPosition.y },
    };

    // Create battle with selected team
    const seed = Date.now();
    const rng = makePRNG(seed);

    try {
      const result = createBattleFromEncounter(pendingBattleEncounterId, selectedTeam, rng);
      if (!result || !result.battle) {
        console.error(`Failed to create battle from encounter ${pendingBattleEncounterId}`);
        return;
      }

      get().setBattle(result.battle, seed);
      get().setTeam(selectedTeam);

      set({
        currentEncounter: encounter,
        mode: 'battle',
        preBattlePosition,
        pendingBattleEncounterId: null,
        currentBattleConfig: null,
      });
    } catch (error) {
      console.error('Error creating battle:', error);
    }
  },

  updateBattleConfigSlot: (slotIndex, unitId) =>
    set((state) => {
      const { currentBattleConfig } = state;
      if (!currentBattleConfig) return state;

      const slots = currentBattleConfig.slots.map((slot) =>
        slot.slotIndex === slotIndex ? { ...slot, unitId } : slot
      );

      return {
        currentBattleConfig: { ...currentBattleConfig, slots },
      };
    }),

  updateBattleSlotEquipment: (slotIndex, equipmentSlot, equipment) =>
    set((state) => {
      const { currentBattleConfig } = state;
      if (!currentBattleConfig) return state;

      const slots = currentBattleConfig.slots.map((slot) =>
        slot.slotIndex === slotIndex
          ? {
              ...slot,
              equipmentLoadout: {
                ...slot.equipmentLoadout,
                [equipmentSlot]: equipment,
              },
            }
          : slot
      );

      return {
        currentBattleConfig: { ...currentBattleConfig, slots },
      };
    }),

  setBattleConfigDjinnSlot: (slotIndex, djinnId) =>
    set((state) => {
      const { currentBattleConfig } = state;
      if (!currentBattleConfig) return state;

      const normalizedDjinnId = djinnId ?? null;
      if (
        normalizedDjinnId &&
        currentBattleConfig.djinnSlots.some((existingId, index) =>
          index !== slotIndex && existingId === normalizedDjinnId
        )
      ) {
        console.warn('Cannot equip the same Djinn more than once', normalizedDjinnId);
        return state;
      }

      const djinnSlots = updateDjinnSlots(currentBattleConfig.djinnSlots, slotIndex, normalizedDjinnId);
      return {
        currentBattleConfig: { ...currentBattleConfig, djinnSlots },
      };
    }),

  clearBattleConfig: () => {
    set({ currentBattleConfig: null });
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
      currentBattleConfig: null,
    });
  },
};
};
