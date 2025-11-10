/**
 * Save Service
 * Handles save/load with migration and validation
 */

import type { Result } from '../utils/result';
import { Ok, Err } from '../utils/result';
import { SaveV1Schema } from '../../data/schemas/SaveV1Schema';
import { migrateSaveData } from '../migrations';

const SAVE_KEY = 'vale_chronicles_v2_save';

/**
 * Save game state to localStorage
 */
export function saveGame(data: unknown): Result<void, string> {
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
 */
export function loadGame(): Result<unknown, string> {
  try {
    const serialized = localStorage.getItem(SAVE_KEY);
    if (!serialized) {
      return Err('No save file found');
    }

    const data = JSON.parse(serialized);
    
    // Migrate to current version
    const migrationResult = migrateSaveData(data);
    if (!migrationResult.ok) {
      return Err(migrationResult.error);
    }

    return Ok(migrationResult.value);
  } catch (error) {
    return Err(`Failed to load game: ${error instanceof Error ? error.message : String(error)}`);
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

