/**
 * Queue-Based Battle Service
 * PR-QUEUE-BATTLE: Manages planning and execution phases
 * Pure functions, deterministic with PRNG
 */

import type { BattleState, QueuedAction } from '../models/BattleState';
import type { Team } from '../models/Team';
import type { Unit } from '../models/Unit';
import type { Stats } from '../models/types';
import type { Ability } from '../../data/schemas/AbilitySchema';
import type { PRNG } from '../random/prng';
import type { BattleEvent } from './types';
import { updateBattleState } from '../models/BattleState';
import { updateTeam } from '../models/Team';
import { isUnitKO } from '../models/Unit';
import { createEmptyQueue } from '../constants';
import { getAbilityManaCost, canAffordAction, isQueueComplete, validateQueuedActions } from '../algorithms/mana';
import { Result, Ok, Err } from '../utils/result';
import { calculateSummonDamage, canActivateDjinn } from '../algorithms/djinn';
import { getEffectiveSPD } from '../algorithms/stats';
import { performAction } from './BattleService';
import { makeAIDecision } from './AIService';
import {
  mergeDjinnAbilitiesIntoUnit,
  calculateDjinnBonusesForUnit,
} from '../algorithms/djinnAbilities';

type PerformActionResult = ReturnType<typeof performAction>;

function isBasicAttack(action: QueuedAction): boolean {
  return action.abilityId === null;
}

function shouldGenerateMana(
  action: QueuedAction,
  actionResult: PerformActionResult
): boolean {
  return isBasicAttack(action) && actionResult.hit;
}

/**
 * Queue an action for a unit
 * PR-QUEUE-BATTLE: Adds action to queue and deducts mana
 * 
 * @param state - Current battle state
 * @param unitId - Unit ID to queue action for
 * @param abilityId - Ability ID (null for basic attack)
 * @param targetIds - Target unit IDs
 * @param ability - Ability definition (if not basic attack)
 * @returns Result with updated battle state or error message
 */
export function queueAction(
  state: BattleState,
  unitId: string,
  abilityId: string | null,
  targetIds: readonly string[],
  ability?: Ability
): Result<BattleState, string> {
  if (state.phase !== 'planning') {
    return Err('Can only queue actions during planning phase');
  }

  // Find unit index in team
  const unitIndex = state.playerTeam.units.findIndex(u => u.id === unitId);
  if (unitIndex === -1) {
    return Err(`Unit ${unitId} not found in player team`);
  }

  // Calculate mana cost
  try {
    const manaCost = getAbilityManaCost(abilityId, ability);

    // Check if affordable
    if (!canAffordAction(state.remainingMana, manaCost)) {
      return Err(`Cannot afford action: need ${manaCost} mana, have ${state.remainingMana}`);
    }

    // Create queued action
    const action: QueuedAction = {
      unitId,
      abilityId,
      targetIds,
      manaCost,
    };

    // Update queue
    const newQueuedActions = [...state.queuedActions];
    newQueuedActions[unitIndex] = action;

    return Ok(updateBattleState(state, {
      queuedActions: newQueuedActions,
      remainingMana: state.remainingMana - manaCost,
    }));
  } catch (error) {
    // Handle errors from getAbilityManaCost (e.g., missing ability)
    return Err(error instanceof Error ? error.message : `Failed to queue action: ${String(error)}`);
  }
}

/**
 * Clear a queued action (refund mana)
 * PR-QUEUE-BATTLE: Removes action from queue and refunds mana
 *
 * @param state - Current battle state
 * @param unitIndex - Index of unit (0-3)
 * @returns Result with updated battle state or error message
 */
export function clearQueuedAction(state: BattleState, unitIndex: number): Result<BattleState, string> {
  if (state.phase !== 'planning') {
    return Err('Can only clear actions during planning phase');
  }

  const action = state.queuedActions[unitIndex];
  if (!action) {
    return Ok(state); // Nothing to clear
  }

  // Refund mana
  const newQueuedActions = [...state.queuedActions];
  newQueuedActions[unitIndex] = null;

  return Ok(updateBattleState(state, {
    queuedActions: newQueuedActions,
    remainingMana: state.remainingMana + action.manaCost,
  }));
}

/**
 * Queue Djinn activation
 * PR-DJINN-CORE: Adds Djinn to activation queue
 *
 * @param state - Current battle state
 * @param djinnId - Djinn ID to activate
 * @returns Result with updated battle state or error message
 */
export function queueDjinn(state: BattleState, djinnId: string): Result<BattleState, string> {
  if (state.phase !== 'planning') {
    return Err('Can only queue Djinn during planning phase');
  }

  if (!canActivateDjinn(state.playerTeam, djinnId)) {
    return Err(`Djinn ${djinnId} cannot be activated (not Set)`);
  }

  if (state.queuedDjinn.includes(djinnId)) {
    return Ok(state); // Already queued
  }

  return Ok(updateBattleState(state, {
    queuedDjinn: [...state.queuedDjinn, djinnId],
  }));
}

/**
 * Unqueue Djinn activation
 * PR-DJINN-CORE: Removes Djinn from activation queue
 *
 * @param state - Current battle state
 * @param djinnId - Djinn ID to unqueue
 * @returns Result with updated battle state or error message
 */
export function unqueueDjinn(state: BattleState, djinnId: string): Result<BattleState, string> {
  if (state.phase !== 'planning') {
    return Err('Can only unqueue Djinn during planning phase');
  }

  return Ok(updateBattleState(state, {
    queuedDjinn: state.queuedDjinn.filter(id => id !== djinnId),
  }));
}

/**
 * Refresh mana pool at start of planning phase
 * PR-MANA-QUEUE: Resets mana to max
 *
 * @param state - Current battle state
 * @returns Updated battle state
 */
export function refreshMana(state: BattleState): BattleState {
  return updateBattleState(state, {
    remainingMana: state.maxMana,
  });
}

/**
 * Validate queue is ready for execution
 * Throws if validation fails
 */
function validateQueueForExecution(state: BattleState): void {
  if (state.phase !== 'planning') {
    throw new Error('Can only execute round from planning phase');
  }
  if (!isQueueComplete(state.queuedActions)) {
    throw new Error('Cannot execute: queue is not complete');
  }
  if (!validateQueuedActions(state.remainingMana, state.queuedActions)) {
    throw new Error('Cannot execute: actions exceed mana budget');
  }
}

/**
 * Transition battle state to executing phase
 */
function transitionToExecutingPhase(state: BattleState): BattleState {
  return updateBattleState(state, {
    phase: 'executing',
    executionIndex: 0,
  });
}

/**
 * Execute player actions phase
 * Processes all queued player actions in SPD order
 */
function executePlayerActionsPhase(
  state: BattleState,
  rng: PRNG
): { state: BattleState; events: readonly BattleEvent[] } {
  const playerActions = state.queuedActions.filter((a): a is QueuedAction => a !== null);
  const sortedPlayerActions = sortActionsBySPD(playerActions, state.playerTeam, state.enemies);

  let currentState = state;
  const events: BattleEvent[] = [];

  for (const action of sortedPlayerActions) {
    const actor = currentState.playerTeam.units.find(u => u.id === action.unitId);
    if (!actor || isUnitKO(actor)) {
      events.push({
        type: 'ability',
        casterId: action.unitId,
        abilityId: action.abilityId || 'strike',
        targets: action.targetIds,
      });
    continue;
    }

    const validTargets = resolveValidTargets(action, currentState);
    if (validTargets.length === 0) {
      continue;
    }

    const actionResult = performAction(
      currentState,
      action.unitId,
      action.abilityId || 'strike',
      validTargets,
      rng
    );

    currentState = actionResult.state;
    events.push(...actionResult.events);

    if (shouldGenerateMana(action, actionResult)) {
      const manaGained = 1;
      const newMana = Math.min(currentState.remainingMana + manaGained, currentState.maxMana);
      currentState = updateBattleState(currentState, {
        remainingMana: newMana,
      });

      events.push({
        type: 'mana-generated',
        amount: manaGained,
        source: action.unitId,
        newTotal: newMana,
      });
    }
  }

  return { state: currentState, events };
}

/**
 * Execute enemy actions phase
 * Generates and processes all enemy actions in SPD order
 */
function executeEnemyActionsPhase(
  state: BattleState,
  rng: PRNG
): { state: BattleState; events: readonly BattleEvent[] } {
  const enemyActions = generateEnemyActions(state, rng);
  const sortedEnemyActions = sortActionsBySPD(enemyActions, state.playerTeam, state.enemies);

  let currentState = state;
  const events: BattleEvent[] = [];

  for (const action of sortedEnemyActions) {
    const actor = currentState.enemies.find(u => u.id === action.unitId);
    if (!actor || isUnitKO(actor)) {
      continue;
    }

    const validTargets = resolveValidTargets(action, currentState);
    if (validTargets.length === 0) {
      continue;
    }

    const actionResult = performAction(
      currentState,
      action.unitId,
      action.abilityId || 'strike',
      validTargets,
      rng
    );

    currentState = actionResult.state;
    events.push(...actionResult.events);
  }

  return { state: currentState, events };
}

/**
 * Check if battle has ended (victory or defeat)
 * Returns battle result or null if battle continues
 */
function checkBattleEndPhase(state: BattleState): 'PLAYER_VICTORY' | 'PLAYER_DEFEAT' | null {
  return checkBattleEnd(state);
}

/**
 * Transition to victory or defeat phase
 */
function transitionToVictoryOrDefeat(
  state: BattleState,
  result: 'PLAYER_VICTORY' | 'PLAYER_DEFEAT'
): BattleState {
  return updateBattleState(state, {
    phase: result === 'PLAYER_VICTORY' ? 'victory' : 'defeat',
    status: result,
  });
}

/**
 * Transition back to planning phase for next round
 */
function transitionToPlanningPhase(state: BattleState): BattleState {
  const updatedTimers = { ...state.djinnRecoveryTimers };
  const updatedTrackers = { ...state.playerTeam.djinnTrackers };

  for (const [djinnId, timer] of Object.entries(updatedTimers)) {
    if (timer > 0) {
      updatedTimers[djinnId] = timer - 1;
      if (updatedTimers[djinnId] === 0) {
        delete updatedTimers[djinnId];
        const tracker = updatedTrackers[djinnId];
        if (tracker) {
          updatedTrackers[djinnId] = {
            ...tracker,
            state: 'Set',
          };
        }
      }
    } else {
      delete updatedTimers[djinnId];
    }
  }

  let updatedTeam = updateTeam(state.playerTeam, {
    djinnTrackers: updatedTrackers,
  });

  const unitsWithUpdatedAbilities = updatedTeam.units.map(unit =>
    mergeDjinnAbilitiesIntoUnit(unit, updatedTeam)
  );

  updatedTeam = updateTeam(updatedTeam, {
    units: unitsWithUpdatedAbilities,
  });

  const nextState = updateBattleState(state, {
    phase: 'planning',
    roundNumber: state.roundNumber + 1,
    currentQueueIndex: 0,
    queuedActions: createEmptyQueue(),
    queuedDjinn: [],
    executionIndex: 0,
    playerTeam: updatedTeam,
    djinnRecoveryTimers: updatedTimers,
  });
  return refreshMana(nextState);
}

/**
 * Execute a complete round
 * PR-QUEUE-BATTLE: Executes Djinn → player actions (SPD order) → enemy actions
 *
 * @param state - Current battle state
 * @param rng - PRNG instance
 * @returns Updated battle state and events
 */
export function executeRound(
  state: BattleState,
  rng: PRNG
): { state: BattleState; events: readonly BattleEvent[] } {
  validateQueueForExecution(state);

  let currentState = transitionToExecutingPhase(state);
  const allEvents: BattleEvent[] = [];

  if (currentState.queuedDjinn.length > 0) {
    const djinnResult = executeDjinnSummons(currentState, rng);
    currentState = djinnResult.state;
    allEvents.push(...djinnResult.events);
  }

  const playerResult = executePlayerActionsPhase(currentState, rng);
  currentState = playerResult.state;
  allEvents.push(...playerResult.events);

  const enemyResult = executeEnemyActionsPhase(currentState, rng);
  currentState = enemyResult.state;
  allEvents.push(...enemyResult.events);

  const battleEnd = checkBattleEndPhase(currentState);
  if (battleEnd) {
    currentState = transitionToVictoryOrDefeat(currentState, battleEnd);
    allEvents.push({
      type: 'battle-end',
      result: battleEnd,
    });
  } else {
    const prePlanningState = currentState;
    currentState = transitionToPlanningPhase(currentState);
    const recoveredDjinnIds = getRecoveredDjinnIds(
      prePlanningState.playerTeam,
      currentState.playerTeam
    );
    if (recoveredDjinnIds.length > 0) {
      const preBonuses = snapshotDjinnBonuses(prePlanningState.playerTeam);
      const postBonuses = snapshotDjinnBonuses(currentState.playerTeam);
      const recoveryEvents = buildDjinnStateChangeEvents(
        preBonuses,
        postBonuses,
        currentState.playerTeam.units,
        'djinn-recovered',
        recoveredDjinnIds
      );
      allEvents.push(...recoveryEvents);
    }
  }

  return {
    state: currentState,
    events: allEvents,
  };
}

/**
 * Execute Djinn summons
 * PR-DJINN-CORE: Handles Djinn activation and damage
 */
function executeDjinnSummons(
  state: BattleState,
  rng: PRNG
): { state: BattleState; events: readonly BattleEvent[] } {
  const events: BattleEvent[] = [];
  let currentState = state;
  let updatedTeam = state.playerTeam;

  if (state.queuedDjinn.length === 0) {
    return { state, events };
  }

  const djinnCount = state.queuedDjinn.length as 1 | 2 | 3;
  const damage = calculateSummonDamage(djinnCount);
  const preBonuses = snapshotDjinnBonuses(state.playerTeam);

  const activationCount = state.queuedDjinn.length;
  const recoveryTime = activationCount + 1;

  // Update Djinn states to Standby
  const updatedTrackers = { ...updatedTeam.djinnTrackers };
  for (const djinnId of state.queuedDjinn) {
    const tracker = updatedTrackers[djinnId];
    if (tracker) {
      updatedTrackers[djinnId] = {
        ...tracker,
        state: 'Standby',
        lastActivatedTurn: state.roundNumber,
      };
    }
  }

  updatedTeam = updateTeam(updatedTeam, {
    djinnTrackers: updatedTrackers,
  });

  const unitsWithUpdatedAbilities = updatedTeam.units.map(unit =>
    mergeDjinnAbilitiesIntoUnit(unit, updatedTeam)
  );

  updatedTeam = updateTeam(updatedTeam, {
    units: unitsWithUpdatedAbilities,
  });

  const postBonuses = snapshotDjinnBonuses(updatedTeam);
  const standbyEvents = buildDjinnStateChangeEvents(
    preBonuses,
    postBonuses,
    updatedTeam.units,
    'djinn-standby',
    state.queuedDjinn
  );

  events.push(...standbyEvents);

  const newRecoveryTimers = { ...state.djinnRecoveryTimers };
  for (const djinnId of state.queuedDjinn) {
    newRecoveryTimers[djinnId] = recoveryTime;
  }

  currentState = updateBattleState(currentState, {
    playerTeam: updatedTeam,
    djinnRecoveryTimers: newRecoveryTimers,
  });

  // Apply damage to enemies and track targets hit
  const targetsHit: string[] = [];

  if (djinnCount === 3) {
    // Mega summon hits all enemies
    const updatedEnemies = currentState.enemies.map(enemy => {
      if (isUnitKO(enemy)) return enemy;
      const newHp = Math.max(0, enemy.currentHp - damage);
      events.push({
        type: 'hit',
        targetId: enemy.id,
        amount: damage,
      });
      targetsHit.push(enemy.id);
      return { ...enemy, currentHp: newHp };
    });
    currentState = updateBattleState(currentState, {
      enemies: updatedEnemies,
    });
  } else {
    // Single or double summon hits single target (pick random enemy)
    const aliveEnemies = currentState.enemies.filter(e => !isUnitKO(e));
    if (aliveEnemies.length > 0) {
      const targetIndex = Math.floor(rng.next() * aliveEnemies.length);
      // Index is guaranteed valid since 0 <= targetIndex < length
      const target = aliveEnemies[targetIndex]!;
      const newHp = Math.max(0, target.currentHp - damage);
      events.push({
        type: 'hit',
        targetId: target.id,
        amount: damage,
      });
      targetsHit.push(target.id);
      const updatedEnemies = currentState.enemies.map(e =>
        e.id === target.id ? { ...e, currentHp: newHp } : e
      );
      currentState = updateBattleState(currentState, {
        enemies: updatedEnemies,
      });
    }
  }

  // Only emit ability event if targets were actually hit
  if (targetsHit.length > 0) {
    events.push({
      type: 'ability',
      casterId: 'djinn-summon',
      abilityId: `djinn-summon-${djinnCount}`,
      targets: targetsHit,
    });
  }

  return { state: currentState, events };
}

/**
 * Sort actions by SPD (fastest first)
 * PR-QUEUE-BATTLE: Orders actions by effective SPD
 */
function sortActionsBySPD(
  actions: readonly QueuedAction[],
  playerTeam: Team,
  enemies: readonly Unit[]
): QueuedAction[] {
  const allUnits = [...playerTeam.units, ...enemies];
  
  return [...actions].sort((a, b) => {
    const unitA = allUnits.find(u => u.id === a.unitId);
    const unitB = allUnits.find(u => u.id === b.unitId);
    
    if (!unitA || !unitB) return 0;
    
    const spdA = getEffectiveSPD(unitA, playerTeam);
    const spdB = getEffectiveSPD(unitB, playerTeam);
    
    if (spdB !== spdA) {
      return spdB - spdA; // Descending (fastest first)
    }
    
    // Tie-breaker: player units before enemies, then by ID
    const isPlayerA = playerTeam.units.some(u => u.id === a.unitId);
    const isPlayerB = playerTeam.units.some(u => u.id === b.unitId);
    
    if (isPlayerA !== isPlayerB) {
      return isPlayerA ? -1 : 1;
    }
    
    return a.unitId.localeCompare(b.unitId);
  });
}

/**
 * Resolve valid targets for an action
 * PR-QUEUE-BATTLE: Retargets if original target is KO'd, preserving ability target type
 */
function resolveValidTargets(
  action: QueuedAction,
  state: BattleState
): readonly string[] {
  const allUnits = [...state.playerTeam.units, ...state.enemies];
  const actor = allUnits.find(u => u.id === action.unitId);
  
  // Filter out KO'd targets
  const validTargets = action.targetIds.filter(id => {
    const unit = allUnits.find(u => u.id === id);
    return unit && !isUnitKO(unit);
  });

  // If we have valid targets, return them
  if (validTargets.length > 0) {
    return validTargets;
  }

  // No valid targets - need to retarget
  // First, determine the ability's target type to preserve it
  let targetType: 'single' | 'all' = 'single'; // Default to single-target
  
  if (actor && action.abilityId) {
    const ability = actor.abilities.find(a => a.id === action.abilityId);
    if (ability) {
      // Determine if ability is single-target or multi-target
      if (ability.targets === 'all-enemies' || ability.targets === 'all-allies') {
        targetType = 'all';
      } else {
        targetType = 'single';
      }
    }
  } else if (action.abilityId === null) {
    // Basic attack is always single-target
    targetType = 'single';
  }

  // Retarget based on action side and target type
  const isPlayerAction = state.playerTeam.units.some(u => u.id === action.unitId);
  
  if (isPlayerAction) {
    // Player action: retarget to alive enemies
    const aliveEnemies = state.enemies.filter(e => !isUnitKO(e));
    if (targetType === 'single' && aliveEnemies.length > 0) {
      // Single-target: return first alive enemy
      return [aliveEnemies[0]!.id];
    } else {
      // Multi-target: return all alive enemies
      return aliveEnemies.map(e => e.id);
    }
  } else {
    // Enemy action: retarget to alive player units
    const alivePlayers = state.playerTeam.units.filter(u => !isUnitKO(u));
    if (targetType === 'single' && alivePlayers.length > 0) {
      // Single-target: return first alive player
      return [alivePlayers[0]!.id];
    } else {
      // Multi-target: return all alive players
      return alivePlayers.map(u => u.id);
    }
  }
}

/**
 * Generate enemy actions using AI
 * PR-QUEUE-BATTLE: Creates queued actions for all enemies
 */
function generateEnemyActions(
  state: BattleState,
  rng: PRNG
): readonly QueuedAction[] {
  const actions: QueuedAction[] = [];

  for (const enemy of state.enemies) {
    if (isUnitKO(enemy)) continue;

    try {
      const decision = makeAIDecision(state, enemy.id, rng);
      if (decision) {
        actions.push({
          unitId: enemy.id,
          abilityId: decision.abilityId,
          targetIds: decision.targetIds,
          manaCost: 0, // Enemies don't use mana
        });
      }
    } catch (error) {
      // Fallback to basic attack if AI decision fails (e.g., no usable abilities)
      console.warn(`AI decision failed for enemy ${enemy.id}, using basic attack:`, error);
      const alivePlayers = state.playerTeam.units.filter(u => !isUnitKO(u));
      if (alivePlayers.length > 0) {
        actions.push({
          unitId: enemy.id,
          abilityId: null,
          targetIds: [alivePlayers[0]!.id],
          manaCost: 0,
        });
      }
    }
  }

  return actions;
}

/**
 * Check if battle has ended
 * PR-QUEUE-BATTLE: Determines victory/defeat
 */
function checkBattleEnd(state: BattleState): 'PLAYER_VICTORY' | 'PLAYER_DEFEAT' | null {
  const allEnemiesKO = state.enemies.every(e => isUnitKO(e));
  const allPlayersKO = state.playerTeam.units.every(u => isUnitKO(u));

  // Check for simultaneous wipe-out (rare but possible)
  if (allEnemiesKO && allPlayersKO) {
    return 'PLAYER_DEFEAT'; // Treat simultaneous wipe-out as defeat
  }

  if (allEnemiesKO) {
    return 'PLAYER_VICTORY';
  }
  if (allPlayersKO) {
    return 'PLAYER_DEFEAT';
  }
  return null;
}

type DjinnStateChange = 'djinn-standby' | 'djinn-recovered';

function snapshotDjinnBonuses(team: Team): Record<string, Partial<Stats>> {
  const snapshot: Record<string, Partial<Stats>> = {};
  for (const unit of team.units) {
    snapshot[unit.id] = calculateDjinnBonusesForUnit(unit, team);
  }
  return snapshot;
}

function buildDjinnStateChangeEvents(
  before: Record<string, Partial<Stats>>,
  after: Record<string, Partial<Stats>>,
  units: readonly Unit[],
  type: DjinnStateChange,
  djinnIds: readonly string[]
): BattleEvent[] {
  if (djinnIds.length === 0) {
    return [];
  }

  const events: BattleEvent[] = [];
  for (const unit of units) {
    const prev = before[unit.id];
    const next = after[unit.id];
    const atkDelta = (next?.atk ?? 0) - (prev?.atk ?? 0);
    const defDelta = (next?.def ?? 0) - (prev?.def ?? 0);
    if (atkDelta === 0 && defDelta === 0) {
      continue;
    }

    events.push({
      type,
      unitId: unit.id,
      djinnIds,
      atkDelta,
      defDelta,
    });
  }

  return events;
}

function getRecoveredDjinnIds(before: Team, after: Team): string[] {
  const recovered: string[] = [];
  for (const [djinnId, tracker] of Object.entries(after.djinnTrackers)) {
    const previousState = before.djinnTrackers[djinnId]?.state;
    if (previousState && previousState !== 'Set' && tracker.state === 'Set') {
      recovered.push(djinnId);
    }
  }
  return recovered;
}

export const queueBattleServiceInternals = {
  validateQueueForExecution,
  transitionToExecutingPhase,
  executePlayerActionsPhase,
  executeEnemyActionsPhase,
  checkBattleEndPhase,
  transitionToVictoryOrDefeat,
  transitionToPlanningPhase,
};
