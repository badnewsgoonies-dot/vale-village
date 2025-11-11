/**
 * Save Service
 * Handles save/load with migration and validation
 */

import type { Result } from '../utils/result';
import { Ok, Err } from '../utils/result';
import { SaveV1Schema, type SaveV1 } from '../../data/schemas/SaveV1Schema';
import { migrateSaveData } from '../migrations';

const SAVE_KEY = 'vale_chronicles_v2_save';

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

