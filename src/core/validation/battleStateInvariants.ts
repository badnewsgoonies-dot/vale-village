/**
 * Battle State Invariant Validation
 * Runtime validation to catch impossible states during development
 *
 * Validates:
 * - Mana never exceeds max
 * - HP never exceeds maxHp or goes negative
 * - Queue consistency (all queued units exist)
 * - Valid phase transitions
 * - Djinn state consistency
 *
 * Only runs in development mode (process.env.NODE_ENV !== 'production')
 */

import type { BattleState } from '../models/BattleState';
import { isUnitKO } from '../models/Unit';
import type { DjinnState } from '../models/types';

/**
 * Validation error with context
 */
export class BattleStateInvariantError extends Error {
  constructor(
    message: string,
    public readonly invariant: string,
    public readonly context?: Record<string, unknown>
  ) {
    super(`Battle State Invariant Violated [${invariant}]: ${message}`);
    this.name = 'BattleStateInvariantError';
  }
}

/**
 * Validate all battle state invariants
 * Throws BattleStateInvariantError if any invariant is violated
 */
export function validateBattleState(state: BattleState): void {
  validateManaInvariants(state);
  validateHPInvariants(state);
  validateQueueInvariants(state);
  validatePhaseInvariants(state);
  validateDjinnInvariants(state);
  validateUnitIndexInvariants(state);
}

/**
 * Validate mana invariants
 */
function validateManaInvariants(state: BattleState): void {
  // Mana never exceeds max
  if (state.remainingMana > state.maxMana) {
    throw new BattleStateInvariantError(
      `Remaining mana (${state.remainingMana}) exceeds max mana (${state.maxMana})`,
      'MANA_EXCEEDS_MAX',
      { remainingMana: state.remainingMana, maxMana: state.maxMana }
    );
  }

  // Mana is never negative
  if (state.remainingMana < 0) {
    throw new BattleStateInvariantError(
      `Remaining mana is negative (${state.remainingMana})`,
      'MANA_NEGATIVE',
      { remainingMana: state.remainingMana }
    );
  }

  // Max mana is never negative
  if (state.maxMana < 0) {
    throw new BattleStateInvariantError(
      `Max mana is negative (${state.maxMana})`,
      'MAX_MANA_NEGATIVE',
      { maxMana: state.maxMana }
    );
  }
}

/**
 * Validate HP invariants for all units
 */
function validateHPInvariants(state: BattleState): void {
  const allUnits = [...state.playerTeam.units, ...state.enemies];

  for (const unit of allUnits) {
    // HP never goes negative
    if (unit.currentHp < 0) {
      throw new BattleStateInvariantError(
        `Unit ${unit.id} has negative HP (${unit.currentHp})`,
        'HP_NEGATIVE',
        { unitId: unit.id, currentHp: unit.currentHp }
      );
    }

    // Calculate max HP (base + level scaling)
    const maxHp = unit.baseStats.hp + (unit.level - 1) * unit.growthRates.hp;

    // HP never exceeds max
    if (unit.currentHp > maxHp) {
      throw new BattleStateInvariantError(
        `Unit ${unit.id} HP (${unit.currentHp}) exceeds max HP (${maxHp})`,
        'HP_EXCEEDS_MAX',
        { unitId: unit.id, currentHp: unit.currentHp, maxHp }
      );
    }
  }
}

/**
 * Validate queue invariants
 */
function validateQueueInvariants(state: BattleState): void {
  // Queue length must match team size (1-4 units)
  const teamSize = state.playerTeam.units.length;
  if (state.queuedActions.length !== teamSize) {
    throw new BattleStateInvariantError(
      `Queue length (${state.queuedActions.length}) doesn't match team size (${teamSize})`,
      'QUEUE_LENGTH_INVALID',
      { queueLength: state.queuedActions.length, teamSize }
    );
  }

  // All queued actions reference existing units
  for (let i = 0; i < state.queuedActions.length; i++) {
    const action = state.queuedActions[i];
    if (action) {
      const unit = state.playerTeam.units.find(u => u.id === action.unitId);
      if (!unit) {
        throw new BattleStateInvariantError(
          `Queued action at index ${i} references non-existent unit ${action.unitId}`,
          'QUEUE_INVALID_UNIT',
          { index: i, unitId: action.unitId }
        );
      }

      // Mana cost is never negative
      if (action.manaCost < 0) {
        throw new BattleStateInvariantError(
          `Queued action at index ${i} has negative mana cost (${action.manaCost})`,
          'QUEUE_NEGATIVE_COST',
          { index: i, manaCost: action.manaCost }
        );
      }

      // Target IDs reference existing units
      for (const targetId of action.targetIds) {
        const targetUnit = [...state.playerTeam.units, ...state.enemies].find(
          u => u.id === targetId
        );
        if (!targetUnit) {
          throw new BattleStateInvariantError(
            `Queued action at index ${i} targets non-existent unit ${targetId}`,
            'QUEUE_INVALID_TARGET',
            { index: i, targetId }
          );
        }
      }
    }
  }

  // All queued Djinn exist in team trackers
  for (const djinnId of state.queuedDjinn) {
    const tracker = state.playerTeam.djinnTrackers[djinnId];
    if (!tracker) {
      throw new BattleStateInvariantError(
        `Queued Djinn ${djinnId} not found in team trackers`,
        'QUEUE_INVALID_DJINN',
        { djinnId }
      );
    }

    // Queued Djinn must be in Set state
    if (tracker.state !== 'Set') {
      throw new BattleStateInvariantError(
        `Queued Djinn ${djinnId} is not in Set state (current: ${tracker.state})`,
        'QUEUE_DJINN_NOT_SET',
        { djinnId, state: tracker.state }
      );
    }
  }
}

/**
 * Validate phase transition invariants
 */
function validatePhaseInvariants(state: BattleState): void {
  // Valid phase values
  const validPhases = ['planning', 'executing', 'victory', 'defeat'] as const;
  if (!validPhases.includes(state.phase)) {
    throw new BattleStateInvariantError(
      `Invalid phase value: ${state.phase}`,
      'PHASE_INVALID',
      { phase: state.phase }
    );
  }

  // Planning phase: queue should be empty or partial
  if (state.phase === 'planning') {
    // Round number must be >= 1
    if (state.roundNumber < 1) {
      throw new BattleStateInvariantError(
        `Planning phase with invalid round number (${state.roundNumber})`,
        'PHASE_PLANNING_INVALID_ROUND',
        { roundNumber: state.roundNumber }
      );
    }
  }

  // Executing phase: queue must be complete
  if (state.phase === 'executing') {
    const isComplete = state.queuedActions.every(a => a !== null);
    if (!isComplete) {
      throw new BattleStateInvariantError(
        'Executing phase with incomplete queue',
        'PHASE_EXECUTING_INCOMPLETE_QUEUE',
        { queuedActions: state.queuedActions.map(a => (a ? a.unitId : null)) }
      );
    }
  }

  // Victory phase: all enemies must be KO
  if (state.phase === 'victory') {
    const allEnemiesKO = state.enemies.every(e => isUnitKO(e));
    if (!allEnemiesKO) {
      throw new BattleStateInvariantError(
        'Victory phase but not all enemies are KO',
        'PHASE_VICTORY_ENEMIES_ALIVE',
        { aliveEnemies: state.enemies.filter(e => !isUnitKO(e)).map(e => e.id) }
      );
    }
  }

  // Defeat phase: all players must be KO
  if (state.phase === 'defeat') {
    const allPlayersKO = state.playerTeam.units.every(u => isUnitKO(u));
    if (!allPlayersKO) {
      throw new BattleStateInvariantError(
        'Defeat phase but not all players are KO',
        'PHASE_DEFEAT_PLAYERS_ALIVE',
        { alivePlayers: state.playerTeam.units.filter(u => !isUnitKO(u)).map(u => u.id) }
      );
    }
  }

  // Status matches phase
  if (state.phase === 'victory' && state.status !== 'PLAYER_VICTORY') {
    throw new BattleStateInvariantError(
      `Victory phase but status is ${state.status}`,
      'PHASE_STATUS_MISMATCH',
      { phase: state.phase, status: state.status }
    );
  }

  if (state.phase === 'defeat' && state.status !== 'PLAYER_DEFEAT') {
    throw new BattleStateInvariantError(
      `Defeat phase but status is ${state.status}`,
      'PHASE_STATUS_MISMATCH',
      { phase: state.phase, status: state.status }
    );
  }
}

/**
 * Validate Djinn state invariants
 */
function validateDjinnInvariants(state: BattleState): void {
  // All Djinn trackers reference valid states
  const validDjinnStates = ['Set', 'Standby', 'Recovery'] as const;

  for (const [djinnId, tracker] of Object.entries(state.playerTeam.djinnTrackers)) {
    if (!validDjinnStates.includes(tracker.state as DjinnState)) {
      throw new BattleStateInvariantError(
        `Djinn ${djinnId} has invalid state: ${tracker.state}`,
        'DJINN_INVALID_STATE',
        { djinnId, state: tracker.state }
      );
    }

    // Note: Djinn are now team-wide, not assigned to specific units
    // Old per-unit assignment validation removed
  }

  // Recovery timers are non-negative
  for (const [djinnId, timer] of Object.entries(state.djinnRecoveryTimers)) {
    if (timer < 0) {
      throw new BattleStateInvariantError(
        `Djinn ${djinnId} has negative recovery timer (${timer})`,
        'DJINN_NEGATIVE_TIMER',
        { djinnId, timer }
      );
    }

    // Djinn with recovery timer must exist in trackers
    const tracker = state.playerTeam.djinnTrackers[djinnId];
    if (!tracker) {
      throw new BattleStateInvariantError(
        `Recovery timer for non-existent Djinn ${djinnId}`,
        'DJINN_TIMER_NO_TRACKER',
        { djinnId, timer }
      );
    }

    // Djinn with recovery timer should be in Standby state
    if (timer > 0 && tracker.state !== 'Standby') {
      throw new BattleStateInvariantError(
        `Djinn ${djinnId} has recovery timer (${timer}) but is not in Standby (current: ${tracker.state})`,
        'DJINN_TIMER_STATE_MISMATCH',
        { djinnId, timer, state: tracker.state }
      );
    }
  }
}

/**
 * Validate unit index invariants
 */
function validateUnitIndexInvariants(state: BattleState): void {
  // Index contains all player units
  for (const unit of state.playerTeam.units) {
    const indexed = state.unitById.get(unit.id);
    if (!indexed) {
      throw new BattleStateInvariantError(
        `Player unit ${unit.id} not found in unitById index`,
        'INDEX_MISSING_PLAYER',
        { unitId: unit.id }
      );
    }

    if (!indexed.isPlayer) {
      throw new BattleStateInvariantError(
        `Player unit ${unit.id} marked as enemy in unitById index`,
        'INDEX_WRONG_SIDE_PLAYER',
        { unitId: unit.id }
      );
    }
  }

  // Index contains all enemy units
  for (const unit of state.enemies) {
    const indexed = state.unitById.get(unit.id);
    if (!indexed) {
      throw new BattleStateInvariantError(
        `Enemy unit ${unit.id} not found in unitById index`,
        'INDEX_MISSING_ENEMY',
        { unitId: unit.id }
      );
    }

    if (indexed.isPlayer) {
      throw new BattleStateInvariantError(
        `Enemy unit ${unit.id} marked as player in unitById index`,
        'INDEX_WRONG_SIDE_ENEMY',
        { unitId: unit.id }
      );
    }
  }

  // Index doesn't contain extra units
  const expectedSize = state.playerTeam.units.length + state.enemies.length;
  if (state.unitById.size !== expectedSize) {
    throw new BattleStateInvariantError(
      `Unit index size (${state.unitById.size}) doesn't match expected size (${expectedSize})`,
      'INDEX_SIZE_MISMATCH',
      { indexSize: state.unitById.size, expectedSize }
    );
  }
}
