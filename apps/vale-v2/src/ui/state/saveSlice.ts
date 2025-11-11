/**
 * Save state slice for Zustand
 * Handles save/load operations
 */

import type { StateCreator } from 'zustand';
import { saveGame, loadGame, hasSave, deleteSave } from '../../core/services/SaveService';
import type { SaveV1 } from '../../data/schemas/SaveV1Schema';
import type { BattleSlice } from './battleSlice';
import type { TeamSlice } from './teamSlice';

export interface SaveSlice {
  hasSave: () => boolean;
  loadGame: () => void;
  saveGame: () => void;
  deleteSave: () => void;
}

export const createSaveSlice: StateCreator<
  SaveSlice & BattleSlice & TeamSlice,
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

    // No cast needed - loadGame() now returns Result<SaveV1, string>
    const saveData = result.value;

    // TODO: Hydrate team and battle from save data
    // For now, this is a placeholder that will be expanded
    // when we have the full save structure including battle state

    console.log('Game loaded:', saveData);
  },

  saveGame: () => {
    const { battle, rngSeed, team } = get();

    // Ensure we have units to save
    if (!team || !team.units || team.units.length === 0) {
      console.error('Cannot save: no team data');
      return;
    }

    // Build activeParty with exactly 4 elements (pad with empty strings if needed)
    const partyIds = team.units.map(u => u.id).slice(0, 4);
    while (partyIds.length < 4) {
      partyIds.push(''); // Pad to meet schema requirement of length(4)
    }
    const activeParty = partyIds as [string, string, string, string];

    // Build properly typed SaveV1 object
    const saveData: SaveV1 = {
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
        inventory: [],
        gold: 0,
        djinnCollected: [],
        recruitmentFlags: {},
        storyFlags: {},
      },
      overworldState: {
        playerPosition: { x: 0, y: 0 },
        currentScene: 'battle',
        npcStates: {},
      },
      stats: {
        battlesWon: 0,
        battlesLost: 0,
        totalDamageDealt: 0,
        totalHealingDone: 0,
        playtime: 0,
      },
    };

    // Store battle state and RNG seed separately for now
    // This will be integrated into SaveV1Schema in a future update
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
});

