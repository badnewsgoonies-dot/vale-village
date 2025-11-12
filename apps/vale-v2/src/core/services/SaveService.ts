/**
 * Save Service
 * Handles save/load with migration and validation
 */

import type { Result } from '../utils/result';
import { Ok, Err } from '../utils/result';
import { SaveV1Schema, type SaveV1 } from '../../data/schemas/SaveV1Schema';
import { migrateSaveData } from '../migrations';

const SAVE_KEY = 'vale_chronicles_v2_save';
const SAVE_SLOT_PREFIX = 'vale_chronicles_v2_save_slot_';

/**
 * Get localStorage key for a specific save slot
 */
function getSaveSlotKey(slot: number): string {
  if (slot < 0 || slot >= 3) {
    throw new Error(`Invalid save slot: ${slot}. Must be 0-2.`);
  }
  return `${SAVE_SLOT_PREFIX}${slot}`;
}

/**
 * Save game state to localStorage
 */
export function saveGame(data: SaveV1): Result<void, string> {
  try {
    // Validate data matches SaveV1 schema
    const result = SaveV1Schema.safeParse(data);
    if (!result.success) {
      return Err(`Invalid save data: ${result.error.message}`);
    }

    const serialized = JSON.stringify(result.data);
    localStorage.setItem(SAVE_KEY, serialized);
    return Ok(undefined);
  } catch (error) {
    return Err(`Failed to save game: ${error instanceof Error ? error.message : String(error)}`);
  }
}

/**
 * Load game state from localStorage
 * Includes safety checks and validation with error recovery
 */
export function loadGame(): Result<SaveV1, string> {
  try {
    const serialized = localStorage.getItem(SAVE_KEY);
    if (!serialized) {
      return Err('No save file found');
    }

    let data: unknown;
    try {
      data = JSON.parse(serialized);
    } catch (parseError) {
      // Invalid JSON - clear corrupted save
      localStorage.removeItem(SAVE_KEY);
      return Err('Save file corrupted (invalid JSON). Save cleared.');
    }
    
    // Migrate to current version
    const migrationResult = migrateSaveData(data);
    if (!migrationResult.ok) {
      // Migration failed - clear incompatible save
      localStorage.removeItem(SAVE_KEY);
      return Err(`Save file incompatible: ${migrationResult.error}. Save cleared.`);
    }

    // Validate migrated data matches current schema
    const validationResult = SaveV1Schema.safeParse(migrationResult.value);
    if (!validationResult.success) {
      // Validation failed - clear invalid save
      localStorage.removeItem(SAVE_KEY);
      return Err(`Save file validation failed: ${validationResult.error.message}. Save cleared.`);
    }

    return Ok(validationResult.data);
  } catch (error) {
    // Unexpected error - clear save to prevent corruption
    try {
      localStorage.removeItem(SAVE_KEY);
    } catch {
      // Ignore errors during cleanup
    }
    return Err(`Failed to load game: ${error instanceof Error ? error.message : String(error)}. Save cleared.`);
  }
}

/**
 * Check if save file exists
 */
export function hasSave(): boolean {
  return localStorage.getItem(SAVE_KEY) !== null;
}

/**
 * Delete save file
 */
export function deleteSave(): Result<void, string> {
  try {
    localStorage.removeItem(SAVE_KEY);
    return Ok(undefined);
  } catch (error) {
    return Err(`Failed to delete save: ${error instanceof Error ? error.message : String(error)}`);
  }
}

/**
 * Save game state to a specific slot (0-2)
 */
export function saveGameSlot(slot: number, data: SaveV1): Result<void, string> {
  try {
    if (slot < 0 || slot >= 3) {
      return Err(`Invalid save slot: ${slot}. Must be 0-2.`);
    }

    // Validate data matches SaveV1 schema
    const result = SaveV1Schema.safeParse(data);
    if (!result.success) {
      return Err(`Invalid save data: ${result.error.message}`);
    }

    const serialized = JSON.stringify(result.data);
    localStorage.setItem(getSaveSlotKey(slot), serialized);
    return Ok(undefined);
  } catch (error) {
    return Err(`Failed to save game: ${error instanceof Error ? error.message : String(error)}`);
  }
}

/**
 * Load game state from a specific slot (0-2)
 */
export function loadGameSlot(slot: number): Result<SaveV1, string> {
  try {
    if (slot < 0 || slot >= 3) {
      return Err(`Invalid save slot: ${slot}. Must be 0-2.`);
    }

    const serialized = localStorage.getItem(getSaveSlotKey(slot));
    if (!serialized) {
      return Err('No save file found in this slot');
    }

    let data: unknown;
    try {
      data = JSON.parse(serialized);
    } catch (parseError) {
      // Invalid JSON - clear corrupted save
      localStorage.removeItem(getSaveSlotKey(slot));
      return Err('Save file corrupted (invalid JSON). Save cleared.');
    }
    
    // Migrate to current version
    const migrationResult = migrateSaveData(data);
    if (!migrationResult.ok) {
      // Migration failed - clear incompatible save
      localStorage.removeItem(getSaveSlotKey(slot));
      return Err(`Save file incompatible: ${migrationResult.error}. Save cleared.`);
    }

    // Validate migrated data matches current schema
    const validationResult = SaveV1Schema.safeParse(migrationResult.value);
    if (!validationResult.success) {
      // Validation failed - clear invalid save
      localStorage.removeItem(getSaveSlotKey(slot));
      return Err(`Save file validation failed: ${validationResult.error.message}. Save cleared.`);
    }

    return Ok(validationResult.data);
  } catch (error) {
    // Unexpected error - clear save to prevent corruption
    try {
      localStorage.removeItem(getSaveSlotKey(slot));
    } catch {
      // Ignore errors during cleanup
    }
    return Err(`Failed to load game: ${error instanceof Error ? error.message : String(error)}. Save cleared.`);
  }
}

/**
 * Check if save file exists in a specific slot
 */
export function hasSaveSlot(slot: number): boolean {
  if (slot < 0 || slot >= 3) {
    return false;
  }
  return localStorage.getItem(getSaveSlotKey(slot)) !== null;
}

/**
 * Delete save file from a specific slot
 */
export function deleteSaveSlot(slot: number): Result<void, string> {
  try {
    if (slot < 0 || slot >= 3) {
      return Err(`Invalid save slot: ${slot}. Must be 0-2.`);
    }
    localStorage.removeItem(getSaveSlotKey(slot));
    return Ok(undefined);
  } catch (error) {
    return Err(`Failed to delete save: ${error instanceof Error ? error.message : String(error)}`);
  }
}

/**
 * Get metadata for a save slot (without loading full save)
 */
export interface SaveSlotMetadata {
  exists: boolean;
  timestamp?: number;
  playtime?: number;
  teamLevel?: number;
  gold?: number;
  chapter?: number;
}

export function getSaveSlotMetadata(slot: number): SaveSlotMetadata {
  if (slot < 0 || slot >= 3) {
    return { exists: false };
  }

  const serialized = localStorage.getItem(getSaveSlotKey(slot));
  if (!serialized) {
    return { exists: false };
  }

  try {
    const data = JSON.parse(serialized) as SaveV1;
    const avgLevel = data.playerData.unitsCollected.length > 0
      ? Math.round(
          data.playerData.unitsCollected.reduce((sum, u) => sum + u.level, 0) /
          data.playerData.unitsCollected.length
        )
      : 1;

    return {
      exists: true,
      timestamp: data.timestamp,
      playtime: data.stats.playtime,
      teamLevel: avgLevel,
      gold: data.playerData.gold,
      chapter: 1, // TODO: Add chapter to SaveV1Schema
    };
  } catch {
    return { exists: false };
  }
}

