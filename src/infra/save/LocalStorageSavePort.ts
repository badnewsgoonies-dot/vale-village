/**
 * LocalStorage Save Port Implementation
 * Simple browser-based save/load
 */

import { z } from 'zod';
import type { SaveEnvelope } from '../../core/save/types';
import type { SavePort } from '../../core/save/SavePort';

/**
 * Zod schema for SaveEnvelope validation
 * Ensures data integrity when reading from localStorage
 */
const SaveVersionSchema = z.object({
  major: z.number().int().min(0),
  minor: z.number().int().min(0),
});

const SaveEnvelopeSchema = z.object({
  version: SaveVersionSchema,
  seed: z.number().int(),
  timestamp: z.number().int().positive(),
  state: z.any(), // GameStateSnapshot - validated elsewhere
  notes: z.string().optional(),
});

/**
 * Create a LocalStorage-based save port
 */
export function createLocalStorageSavePort(key: string = 'vale:save'): SavePort {
  return {
    async read(): Promise<SaveEnvelope | null> {
      try {
        const raw = localStorage.getItem(key);
        if (!raw) return null;

        // Parse JSON
        let parsed: unknown;
        try {
          parsed = JSON.parse(raw);
        } catch (parseError) {
          console.error('Failed to parse save JSON:', parseError);
          return null;
        }

        // Validate with Zod
        const result = SaveEnvelopeSchema.safeParse(parsed);
        if (!result.success) {
          console.error('Invalid save envelope:', result.error);
          return null;
        }

        // Safe cast - schema validates structure matches SaveEnvelope
        return result.data as SaveEnvelope;
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

