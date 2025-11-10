/**
 * Save Port Interface
 * Abstraction for save/load operations
 */

import type { SaveEnvelope, SaveVersion } from './types';

/**
 * Save port interface
 * Implementations: LocalStorage, IndexedDB, FileSystem, etc.
 */
export interface SavePort {
  /**
   * Read save data
   * Returns null if no save exists
   */
  read(): Promise<SaveEnvelope | null>;

  /**
   * Write save data
   */
  write(data: SaveEnvelope): Promise<void>;

  /**
   * List available saves (optional)
   */
  list?(): Promise<Array<{ id: string; version: SaveVersion; timestamp: number }>>;

  /**
   * Delete save data (optional)
   */
  delete?(): Promise<void>;
}

