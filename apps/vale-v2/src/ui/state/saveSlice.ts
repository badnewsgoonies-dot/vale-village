/**
 * Save state slice for Zustand
 * Handles save/load operations
 */

import type { StateCreator } from 'zustand';
import { 
  saveGame, 
  loadGame, 
  hasSave, 
  deleteSave,
  saveGameSlot,
  loadGameSlot,
  hasSaveSlot,
  deleteSaveSlot,
  getSaveSlotMetadata,
  type SaveSlotMetadata,
} from '../../core/services/SaveService';
import type { SaveV1 } from '../../data/schemas/SaveV1Schema';
import type { BattleSlice } from './battleSlice';
import type { TeamSlice } from './teamSlice';
import type { InventorySlice } from './inventorySlice';
import type { StorySlice } from './storySlice';
import type { OverworldSlice } from './overworldSlice';

export interface SaveSlice {
  hasSave: () => boolean;
  loadGame: () => void;
  saveGame: () => void;
  deleteSave: () => void;
  
  // Slot-based operations
  saveGameSlot: (slot: number) => void;
  loadGameSlot: (slot: number) => void;
  hasSaveSlot: (slot: number) => boolean;
  deleteSaveSlot: (slot: number) => void;
  getSaveSlotMetadata: (slot: number) => SaveSlotMetadata;
  autoSave: () => void;
}

/**
 * Create SaveV1 data from current game state
 */
function createSaveData(
  team: TeamSlice['team'],
  inventory: Pick<InventorySlice, 'gold' | 'equipment'>,
  story: StorySlice['story'],
  overworld: Pick<OverworldSlice, 'playerPosition' | 'currentMapId'> | null
): SaveV1 | null {
  // Ensure we have units to save
  if (!team || !team.units || team.units.length === 0) {
    return null;
  }

  // Build activeParty with exactly 4 elements (pad with empty strings if needed)
  const partyIds = team.units.map(u => u.id).slice(0, 4);
  while (partyIds.length < 4) {
    partyIds.push(''); // Pad to meet schema requirement of length(4)
  }
  const activeParty = partyIds as [string, string, string, string];

  // Collect all Djinn from units
  const djinnCollected: string[] = [];
  team.units.forEach(u => {
    u.djinn.forEach(djinnId => {
      if (!djinnCollected.includes(djinnId)) {
        djinnCollected.push(djinnId);
      }
    });
  });

  // Convert story flags to boolean-only (SaveV1Schema expects boolean)
  const storyFlags: Record<string, boolean> = {};
  Object.entries(story.flags).forEach(([key, value]) => {
    storyFlags[key] = Boolean(value);
  });

  // Get overworld position or default
  const playerPosition = overworld?.playerPosition ?? { x: 0, y: 0 };
  const currentScene = overworld?.currentMapId ?? 'vale-village';

  return {
    version: '1.0.0' as const,
    timestamp: Date.now(),
    playerData: {
      unitsCollected: team.units.map(u => ({
        ...u,
        djinn: [...u.djinn],
        abilities: [...u.abilities],
        unlockedAbilityIds: [...u.unlockedAbilityIds],
        statusEffects: [...u.statusEffects],
      })),
      activeParty,
      inventory: inventory.equipment,
      gold: inventory.gold,
      djinnCollected,
      recruitmentFlags: {}, // TODO: Track recruitment flags
      storyFlags,
    },
    overworldState: {
      playerPosition,
      currentScene,
      npcStates: {}, // TODO: Track NPC states
    },
    stats: {
      battlesWon: 0, // TODO: Track battle stats
      battlesLost: 0,
      totalDamageDealt: 0,
      totalHealingDone: 0,
      playtime: 0, // TODO: Track playtime
    },
  };
}

export const createSaveSlice: StateCreator<
  SaveSlice & BattleSlice & TeamSlice & InventorySlice & StorySlice & OverworldSlice,
  [['zustand/devtools', never]],
  [],
  SaveSlice
> = (_set, get) => ({
  hasSave: () => hasSave(),

  loadGame: () => {
    const result = loadGame();
    if (!result.ok) {
      console.error('Failed to load game:', result.error);
      return;
    }

    // TODO: Hydrate team and battle from save data
    const saveData = result.value;
    void saveData;
    void saveData;
    void saveData;
    void saveData;
  },

  saveGame: () => {
    const { team, story, currentMapId, playerPosition, gold, equipment } = get();
    const overworldSnapshot: Pick<OverworldSlice, 'playerPosition' | 'currentMapId'> = {
      currentMapId,
      playerPosition,
    };
    const saveData = createSaveData(team, { gold, equipment }, story, overworldSnapshot);
    
    if (!saveData) {
      console.error('Cannot save: no team data');
      return;
    }

    // Store battle state separately for now
    const { battle, rngSeed } = get();
    const battleState = {
      battle,
      rngSeed,
      turnNumber: get().turnNumber,
    };
    localStorage.setItem('vale-v2/battle-state', JSON.stringify(battleState));

    const result = saveGame(saveData);
    if (!result.ok) {
      console.error('Failed to save game:', result.error);
    }
  },

  deleteSave: () => {
    const result = deleteSave();
    if (!result.ok) {
      console.error('Failed to delete save:', result.error);
    }
    localStorage.removeItem('vale-v2/battle-state');
  },

  // Slot-based operations
  saveGameSlot: (slot: number) => {
    const { team, story, currentMapId, playerPosition, gold, equipment } = get();
    const overworldSnapshot: Pick<OverworldSlice, 'playerPosition' | 'currentMapId'> = {
      currentMapId,
      playerPosition,
    };
    const saveData = createSaveData(team, { gold, equipment }, story, overworldSnapshot);
    
    if (!saveData) {
      console.error('Cannot save: no team data');
      return;
    }

    // Store battle state separately
    const { battle, rngSeed } = get();
    const battleState = {
      battle,
      rngSeed,
      turnNumber: get().turnNumber,
    };
    localStorage.setItem(`vale-v2/battle-state-slot-${slot}`, JSON.stringify(battleState));

    const result = saveGameSlot(slot, saveData);
    if (!result.ok) {
      console.error(`Failed to save game to slot ${slot}:`, result.error);
    }
  },

  loadGameSlot: (slot: number) => {
    const result = loadGameSlot(slot);
    if (!result.ok) {
      console.error(`Failed to load game from slot ${slot}:`, result.error);
      return;
    }

    // TODO: Hydrate all state from save data
    const saveData = result.value;
    void saveData;
  },

  hasSaveSlot: (slot: number) => hasSaveSlot(slot),

  deleteSaveSlot: (slot: number) => {
    const result = deleteSaveSlot(slot);
    if (!result.ok) {
      console.error(`Failed to delete save slot ${slot}:`, result.error);
    }
    localStorage.removeItem(`vale-v2/battle-state-slot-${slot}`);
  },

  getSaveSlotMetadata: (slot: number) => getSaveSlotMetadata(slot),

  autoSave: () => {
    // Auto-save to slot 0 (quick save)
    get().saveGameSlot(0);
  },
});
