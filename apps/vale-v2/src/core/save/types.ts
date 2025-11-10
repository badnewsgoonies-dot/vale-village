/**
 * Save and Replay System Types
 * Foundation for deterministic replay and save/load
 */

import type { BattleState } from '../models/BattleState';
import type { Team } from '../models/Team';

/**
 * Save version for migration tracking
 */
export interface SaveVersion {
  major: number;
  minor: number;
}

/**
 * Game state snapshot (normalized, serializable)
 * Contains all domain state needed to resume play
 */
export interface GameStateSnapshot {
  /** Current battle state (if in battle) */
  battle: BattleState | null;
  
  /** Player team */
  team: Team;
  
  /** Current chapter/area */
  chapter: string;
  
  /** Story flags */
  flags: Record<string, boolean | number>;
  
  /** Gold */
  gold: number;
  
  /** Collected units (for post-credit unlocks) */
  unitsCollected: string[];
}

/**
 * Save envelope - wrapper with metadata
 */
export interface SaveEnvelope {
  version: SaveVersion;
  seed: number;
  timestamp: number; // Written by adapter, not domain
  state: GameStateSnapshot;
  notes?: string; // Optional debug notes
}

/**
 * Player command - input from player
 */
export interface PlayerCommand {
  type: 'ability' | 'end-turn' | 'flee';
  turn: number;
  actorId: string;
  abilityId?: string;
  targetIds?: readonly string[];
}

/**
 * System tick - automatic system actions (status effects, AI decisions)
 */
export interface SystemTick {
  type: 'status-tick' | 'ai-action';
  turn: number;
  actorId: string;
  abilityId?: string;
  targetIds?: readonly string[];
}

/**
 * Replay tape - captures deterministic replay
 */
export interface ReplayTape {
  seed: number;
  initial: GameStateSnapshot;
  inputs: Array<PlayerCommand | SystemTick>;
  engineVersion: SaveVersion; // Version of engine that created this replay
  dataVersion: SaveVersion; // Version of content data
}

