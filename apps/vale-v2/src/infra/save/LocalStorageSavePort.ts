/**
 * LocalStorage Save Port Implementation
 * Simple browser-based save/load
 */

import type { SaveEnvelope } from '../../core/save/types';
import type { SavePort } from '../../core/save/SavePort';

/**
 * Create a LocalStorage-based save port
 */
export function createLocalStorageSavePort(key: string = 'vale:save'): SavePort {
  return {
    async read(): Promise<SaveEnvelope | null> {
      try {
        const raw = localStorage.getItem(key);
        if (!raw) return null;
        
        const parsed = JSON.parse(raw) as SaveEnvelope;
        return parsed;
      } catch (error) {
        console.error('Failed to read save:', error);
        return null;
      }
    },

    async write(data: SaveEnvelope): Promise<void> {
      try {
        const serialized = JSON.stringify(data);
        localStorage.setItem(key, serialized);
      } catch (error) {
        console.error('Failed to write save:', error);
        throw new Error('Save failed: ' + (error instanceof Error ? error.message : String(error)));
      }
    },

    async delete(): Promise<void> {
      try {
        localStorage.removeItem(key);
      } catch (error) {
        console.error('Failed to delete save:', error);
        throw new Error('Delete failed: ' + (error instanceof Error ? error.message : String(error)));
      }
    },
  };
}

/**
 * Create a LocalStorage-based replay port (separate key)
 */
export function createLocalStorageReplayPort(key: string = 'vale:replay'): SavePort {
  return createLocalStorageSavePort(key);
}

