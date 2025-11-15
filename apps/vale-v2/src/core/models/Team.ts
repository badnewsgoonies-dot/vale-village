/**
 * Team model (POJO)
 * Following ADR 003: Plain objects with readonly properties where possible
 */

import type { Unit } from './Unit';
import { MIN_PARTY_SIZE, MAX_PARTY_SIZE } from '../constants';

/**
 * Djinn tracker for team-wide Djinn system
 */
export interface DjinnTracker {
  readonly djinnId: string;
  state: 'Set' | 'Standby' | 'Recovery';
  lastActivatedTurn: number;  // When this Djinn was last activated
}

/**
 * Team manages party-wide Djinn system
 * From GAME_MECHANICS.md Section 2.0
 *
 * 🚨 CRITICAL: Djinn are TEAM-WIDE, not per-unit!
 * - Team has exactly 3 Djinn slots (global)
 * - Bonuses apply to ALL party members
 * - Activating affects entire team
 */
export interface Team {
  /** 3 Djinn equipped to team slots (affects ALL units) */
  readonly equippedDjinn: readonly string[];  // Djinn IDs

  /** State and timing of each equipped Djinn (Set/Standby/Recovery) */
  djinnTrackers: Record<string, DjinnTracker>;  // Plain object instead of Map

  /** Party members (1-4 units) */
  readonly units: readonly Unit[];

  /** Collected Djinn (up to 12 total) */
  readonly collectedDjinn: readonly string[];  // Djinn IDs

  /** Current turn in battle (for recovery tracking) */
  currentTurn: number;

  /** Track which units activated Djinn this turn (unitId → count) */
  activationsThisTurn: Record<string, number>;  // Plain object instead of Map

  /** DEPRECATED: Old state tracking (for backward compatibility) */
  djinnStates: Record<string, 'Set' | 'Standby' | 'Recovery'>;  // Plain object instead of Map
}

/**
 * Create a new team
 */
export function createTeam(units: readonly Unit[]): Team {
  if (units.length < MIN_PARTY_SIZE || units.length > MAX_PARTY_SIZE) {
    throw new Error(`Team must have between ${MIN_PARTY_SIZE} and ${MAX_PARTY_SIZE} units, got ${units.length}`);
  }

  return {
    equippedDjinn: [],
    djinnTrackers: {},
    units,
    collectedDjinn: [],
    currentTurn: 0,
    activationsThisTurn: {},
    djinnStates: {},
  };
}

/**
 * Update team (returns new object - immutability)
 * Handles nested objects properly
 * Validates Djinn equipments for duplicates
 * 
 * @throws Error if equippedDjinn contains duplicates or exceeds 3 slots
 */
export function updateTeam(team: Team, updates: Partial<Team>): Team {
  // Validate equippedDjinn if being updated
  if (updates.equippedDjinn !== undefined) {
    // Check for duplicates
    const djinnSet = new Set(updates.equippedDjinn);
    if (djinnSet.size !== updates.equippedDjinn.length) {
      throw new Error(`Cannot equip duplicate Djinn. Equipped: ${updates.equippedDjinn.join(', ')}`);
    }
    
    // Check max slots (3)
    if (updates.equippedDjinn.length > 3) {
      throw new Error(`Cannot equip more than 3 Djinn. Attempted: ${updates.equippedDjinn.length}`);
    }
  }

  return {
    ...team,
    ...updates,
    djinnTrackers: updates.djinnTrackers ? { ...team.djinnTrackers, ...updates.djinnTrackers } : team.djinnTrackers,
    activationsThisTurn: updates.activationsThisTurn ? { ...team.activationsThisTurn, ...updates.activationsThisTurn } : team.activationsThisTurn,
    djinnStates: updates.djinnStates ? { ...team.djinnStates, ...updates.djinnStates } : team.djinnStates,
  };
}

