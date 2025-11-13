/**
 * Save Service (Enhanced)
 * Handles save/load with checksums, backups, and validation
 *
 * Features:
 * - Checksum validation (detect corruption)
 * - Auto-backup on save
 * - Backup restoration on corruption
 * - Battle state save/load
 * - Progress save/load (full game state)
 * - Auto-save functionality
 */

import type { Result } from '../utils/result';
import { Ok, Err } from '../utils/result';
import { SaveV1Schema, type SaveV1 } from '../../data/schemas/SaveV1Schema';
import { BattleStateSchema, type BattleState } from '../../data/schemas/BattleStateSchema';
import { migrateSaveData } from '../migrations';
import {
  calculateChecksum,
  verifyChecksum,
  type SaveFileValidationError,
} from '../validation/saveFileValidation';

const SAVE_KEY = 'vale_chronicles_v2_save';
const SAVE_SLOT_PREFIX = 'vale_chronicles_v2_save_slot_';
const BACKUP_SUFFIX = '_backup';
const BATTLE_SAVE_KEY = 'vale_chronicles_v2_battle';
const AUTO_SAVE_SLOT = 0;

/**
 * Save file wrapper with checksum
 */
interface SaveFileWrapper {
  version: string;
  timestamp: number;
  checksum: string;
  data: SaveV1 | BattleState;
}

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
 * Get backup key for a save slot
 */
function getBackupKey(key: string): string {
  return `${key}${BACKUP_SUFFIX}`;
}

/**
 * Create backup of existing save before overwriting
 */
function createBackup(key: string): void {
  try {
    const existing = localStorage.getItem(key);
    if (existing) {
      localStorage.setItem(getBackupKey(key), existing);
    }
  } catch (error) {
    // Backup failure shouldn't block save
    console.warn('Failed to create backup:', error);
  }
}

/**
 * Wrap data with checksum for integrity validation
 */
function wrapWithChecksum(data: SaveV1 | BattleState, version: string): SaveFileWrapper {
  const checksum = calculateChecksum(data);
  return {
    version,
    timestamp: Date.now(),
    checksum,
    data,
  };
}

/**
 * Validate and unwrap save file
 */
function unwrapAndValidate<T>(
  wrapper: unknown,
  expectedVersion: string
): Result<T, SaveFileValidationError> {
  // Basic structure validation
  if (!wrapper || typeof wrapper !== 'object') {
    return Err({
      type: 'INVALID_FORMAT',
      message: 'Save file is not a valid object',
    });
  }

  const file = wrapper as Partial<SaveFileWrapper>;

  // Check required fields
  if (!file.version || !file.timestamp || !file.checksum || !file.data) {
    return Err({
      type: 'MISSING_DATA',
      missingFields: [
        !file.version ? 'version' : null,
        !file.timestamp ? 'timestamp' : null,
        !file.checksum ? 'checksum' : null,
        !file.data ? 'data' : null,
      ].filter((f): f is string => f !== null),
    });
  }

  // Version check
  if (file.version !== expectedVersion) {
    return Err({
      type: 'VERSION_MISMATCH',
      saveVersion: file.version,
      currentVersion: expectedVersion,
      canMigrate: false, // TODO: Implement migration
    });
  }

  // Checksum verification
  if (!verifyChecksum(file.data, file.checksum)) {
    return Err({
      type: 'CHECKSUM_FAILED',
      expected: file.checksum,
      actual: calculateChecksum(file.data),
    });
  }

  return Ok(file.data as T);
}

// ============================================================================
// Progress Save/Load (Full Game State)
// ============================================================================

/**
 * Save full game progress to slot with checksum and backup
 */
export function saveProgress(slot: number, data: SaveV1): Result<void, string> {
  try {
    if (slot < 0 || slot >= 3) {
      return Err(`Invalid save slot: ${slot}. Must be 0-2.`);
    }

    // Validate data matches SaveV1 schema
    const validationResult = SaveV1Schema.safeParse(data);
    if (!validationResult.success) {
      return Err(`Invalid save data: ${validationResult.error.message}`);
    }

    const key = getSaveSlotKey(slot);

    // Create backup of existing save
    createBackup(key);

    // Wrap with checksum
    const wrapped = wrapWithChecksum(validationResult.data, '1.0.0');
    const serialized = JSON.stringify(wrapped);

    // Save to localStorage
    localStorage.setItem(key, serialized);

    return Ok(undefined);
  } catch (error) {
    return Err(`Failed to save progress: ${error instanceof Error ? error.message : String(error)}`);
  }
}

/**
 * Load game progress from slot with validation and backup fallback
 */
export function loadProgress(slot: number): Result<SaveV1, string> {
  try {
    if (slot < 0 || slot >= 3) {
      return Err(`Invalid save slot: ${slot}. Must be 0-2.`);
    }

    const key = getSaveSlotKey(slot);
    const serialized = localStorage.getItem(key);

    if (!serialized) {
      return Err('No save file found in this slot');
    }

    // Parse JSON
    let wrapper: unknown;
    try {
      wrapper = JSON.parse(serialized);
    } catch {
      // Try backup
      return loadProgressFromBackup(slot);
    }

    // Validate and unwrap
    const unwrapResult = unwrapAndValidate<SaveV1>(wrapper, '1.0.0');
    if (!unwrapResult.ok) {
      // Try backup
      return loadProgressFromBackup(slot);
    }

    // Final schema validation
    const schemaResult = SaveV1Schema.safeParse(unwrapResult.value);
    if (!schemaResult.success) {
      return Err(`Save file validation failed: ${schemaResult.error.message}`);
    }

    return Ok(schemaResult.data);
  } catch (error) {
    return Err(`Failed to load progress: ${error instanceof Error ? error.message : String(error)}`);
  }
}

/**
 * Load progress from backup (fallback)
 */
function loadProgressFromBackup(slot: number): Result<SaveV1, string> {
  try {
    const key = getSaveSlotKey(slot);
    const backupKey = getBackupKey(key);
    const serialized = localStorage.getItem(backupKey);

    if (!serialized) {
      return Err('Save file corrupted and no backup found');
    }

    const wrapper = JSON.parse(serialized);
    const unwrapResult = unwrapAndValidate<SaveV1>(wrapper, '1.0.0');

    if (!unwrapResult.ok) {
      return Err('Both main save and backup are corrupted');
    }

    const schemaResult = SaveV1Schema.safeParse(unwrapResult.value);
    if (!schemaResult.success) {
      return Err('Backup validation failed');
    }

    // Restore backup to main slot
    localStorage.setItem(key, serialized);

    return Ok(schemaResult.data);
  } catch (error) {
    return Err(`Failed to load backup: ${error instanceof Error ? error.message : String(error)}`);
  }
}

// ============================================================================
// Battle State Save/Load (Quick Save)
// ============================================================================

/**
 * Save battle state (quick save during battle)
 */
export function saveBattle(state: BattleState): Result<void, string> {
  try {
    // Validate battle state
    const validationResult = BattleStateSchema.safeParse(state);
    if (!validationResult.success) {
      return Err(`Invalid battle state: ${validationResult.error.message}`);
    }

    // Create backup
    createBackup(BATTLE_SAVE_KEY);

    // Wrap with checksum
    const wrapped = wrapWithChecksum(validationResult.data, '1.0.0');
    const serialized = JSON.stringify(wrapped);

    localStorage.setItem(BATTLE_SAVE_KEY, serialized);

    return Ok(undefined);
  } catch (error) {
    return Err(`Failed to save battle: ${error instanceof Error ? error.message : String(error)}`);
  }
}

/**
 * Load battle state with validation
 */
export function loadBattle(): Result<BattleState, string> {
  try {
    const serialized = localStorage.getItem(BATTLE_SAVE_KEY);

    if (!serialized) {
      return Err('No battle save found');
    }

    // Parse JSON
    let wrapper: unknown;
    try {
      wrapper = JSON.parse(serialized);
    } catch {
      return Err('Battle save corrupted (invalid JSON)');
    }

    // Validate and unwrap
    const unwrapResult = unwrapAndValidate<BattleState>(wrapper, '1.0.0');
    if (!unwrapResult.ok) {
      return Err('Battle save validation failed');
    }

    // Final schema validation
    const schemaResult = BattleStateSchema.safeParse(unwrapResult.value);
    if (!schemaResult.success) {
      return Err(`Battle state validation failed: ${schemaResult.error.message}`);
    }

    return Ok(schemaResult.data as unknown as BattleState);
  } catch (error) {
    return Err(`Failed to load battle: ${error instanceof Error ? error.message : String(error)}`);
  }
}

/**
 * Delete battle save
 */
export function deleteBattleSave(): Result<void, string> {
  try {
    localStorage.removeItem(BATTLE_SAVE_KEY);
    localStorage.removeItem(getBackupKey(BATTLE_SAVE_KEY));
    return Ok(undefined);
  } catch (error) {
    return Err(`Failed to delete battle save: ${error instanceof Error ? error.message : String(error)}`);
  }
}

// ============================================================================
// Auto-Save
// ============================================================================

/**
 * Auto-save to slot 0
 */
export function autoSave(data: SaveV1): Result<void, string> {
  return saveProgress(AUTO_SAVE_SLOT, data);
}

/**
 * Load auto-save from slot 0
 */
export function loadAutoSave(): Result<SaveV1, string> {
  return loadProgress(AUTO_SAVE_SLOT);
}

/**
 * Check if auto-save exists
 */
export function hasAutoSave(): boolean {
  return hasSaveSlot(AUTO_SAVE_SLOT);
}

// ============================================================================
// Slot Management
// ============================================================================

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

    const key = getSaveSlotKey(slot);
    localStorage.removeItem(key);
    localStorage.removeItem(getBackupKey(key));

    return Ok(undefined);
  } catch (error) {
    return Err(`Failed to delete save: ${error instanceof Error ? error.message : String(error)}`);
  }
}

// ============================================================================
// Slot Metadata (for save/load UI)
// ============================================================================

export interface SaveSlotMetadata {
  exists: boolean;
  timestamp?: number;
  playtime?: number;
  teamLevel?: number;
  gold?: number;
  chapter?: number;
  corrupted?: boolean;
}

/**
 * Get metadata for a save slot (without loading full save)
 */
export function getSaveSlotMetadata(slot: number): SaveSlotMetadata {
  if (slot < 0 || slot >= 3) {
    return { exists: false };
  }

  const serialized = localStorage.getItem(getSaveSlotKey(slot));
  if (!serialized) {
    return { exists: false };
  }

  try {
    const wrapper = JSON.parse(serialized) as SaveFileWrapper;

    // Quick validation
    if (!wrapper.data || !wrapper.checksum) {
      return { exists: true, corrupted: true };
    }

    const data = wrapper.data as SaveV1;

    const avgLevel = data.playerData.unitsCollected.length > 0
      ? Math.round(
          data.playerData.unitsCollected.reduce((sum, u) => sum + u.level, 0) /
          data.playerData.unitsCollected.length
        )
      : 1;

    return {
      exists: true,
      timestamp: wrapper.timestamp,
      playtime: data.stats.playtime,
      teamLevel: avgLevel,
      gold: data.playerData.gold,
      chapter: 1, // TODO: Add chapter to SaveV1Schema
      corrupted: false,
    };
  } catch {
    return { exists: true, corrupted: true };
  }
}

/**
 * Get metadata for all save slots
 */
export function listSaveSlots(): SaveSlotMetadata[] {
  return [0, 1, 2].map(slot => getSaveSlotMetadata(slot));
}

// ============================================================================
// Legacy Compatibility (keep existing functions working)
// ============================================================================

/**
 * @deprecated Use saveProgress(0, data) instead
 */
export function saveGame(data: SaveV1): Result<void, string> {
  return saveProgress(0, data);
}

/**
 * @deprecated Use loadProgress(0) instead
 */
export function loadGame(): Result<SaveV1, string> {
  return loadProgress(0);
}

/**
 * @deprecated Use hasSaveSlot(0) instead
 */
export function hasSave(): boolean {
  return hasSaveSlot(0);
}

/**
 * @deprecated Use deleteSaveSlot(0) instead
 */
export function deleteSave(): Result<void, string> {
  return deleteSaveSlot(0);
}

/**
 * @deprecated Use saveProgress(slot, data) instead
 */
export function saveGameSlot(slot: number, data: SaveV1): Result<void, string> {
  return saveProgress(slot, data);
}

/**
 * @deprecated Use loadProgress(slot) instead
 */
export function loadGameSlot(slot: number): Result<SaveV1, string> {
  return loadProgress(slot);
}
