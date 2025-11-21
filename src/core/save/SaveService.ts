/**
 * Save Service
 * High-level save/load operations using SavePort
 */

import type { SaveEnvelope, GameStateSnapshot, ReplayTape } from './types';
import type { SavePort } from './SavePort';
import type { Result } from '../utils/result';
import { migrateSave, CURRENT_SAVE_VERSION } from './migrations';
import { SaveEnvelopeSchema, ReplayTapeSchema } from '../../data/schemas/ReplaySchema';

/**
 * Create a save envelope from current game state
 */
export function createSaveEnvelope(
  state: GameStateSnapshot,
  seed: number,
  notes?: string
): SaveEnvelope {
  return {
    version: CURRENT_SAVE_VERSION,
    seed,
    timestamp: Date.now(), // Written by adapter
    state,
    notes,
  };
}

/**
 * Save game state
 */
export async function saveGame(
  port: SavePort,
  state: GameStateSnapshot,
  seed: number,
  notes?: string
): Promise<Result<void, string>> {
  try {
    const envelope = createSaveEnvelope(state, seed, notes);
    await port.write(envelope);
    return { ok: true, value: undefined };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

/**
 * Load game state
 */
export async function loadGame(port: SavePort): Promise<Result<SaveEnvelope, string>> {
  try {
    const envelope = await port.read();
    if (!envelope) {
      return { ok: false, error: 'No save data found' };
    }

    // Migrate if needed
    const migrated = migrateSave(envelope);

    // Validate migrated save envelope
    const validationResult = SaveEnvelopeSchema.safeParse(migrated);
    if (!validationResult.success) {
      return {
        ok: false,
        error: `Save file validation failed: ${validationResult.error.message}`,
      };
    }

    return { ok: true, value: validationResult.data as SaveEnvelope };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

/**
 * Save replay tape
 */
export async function saveReplay(
  port: SavePort,
  tape: ReplayTape
): Promise<Result<void, string>> {
  try {
    // Wrap replay tape in save envelope format
    const envelope: SaveEnvelope = {
      version: CURRENT_SAVE_VERSION,
      seed: tape.seed,
      timestamp: Date.now(),
      state: tape.initial, // Store initial state
      notes: `Replay: ${tape.inputs.length} inputs`,
    };

    // Store tape separately (could use a different key or structure)
    // For now, we'll store it as JSON in notes or a separate field
    // In a real implementation, you might want a separate ReplayPort
    await port.write(envelope);
    
    // Also store tape data in a separate key (hack for now)
    // TODO: Create separate ReplayPort interface
    const tapeJson = JSON.stringify(tape);
    localStorage.setItem('vale:replay:tape', tapeJson);
    
    return { ok: true, value: undefined };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

/**
 * Load replay tape
 */
export async function loadReplay(_port: SavePort): Promise<Result<ReplayTape, string>> {
  void _port;
  try {
    // Load tape from separate storage
    const tapeJson = localStorage.getItem('vale:replay:tape');
    if (!tapeJson) {
      return { ok: false, error: 'No replay data found' };
    }

    const tapeData = JSON.parse(tapeJson);

    // Validate replay tape
    const validationResult = ReplayTapeSchema.safeParse(tapeData);
    if (!validationResult.success) {
      return {
        ok: false,
        error: `Replay tape validation failed: ${validationResult.error.message}`,
      };
    }

    return { ok: true, value: validationResult.data as ReplayTape };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

