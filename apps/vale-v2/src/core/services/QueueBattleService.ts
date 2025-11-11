/**
 * Queue-Based Battle Service
 * PR-QUEUE-BATTLE: Manages planning and execution phases
 * Pure functions, deterministic with PRNG
 */

import type { BattleState, QueuedAction } from '../models/BattleState';
import type { Team } from '../models/Team';
import type { Unit } from '../models/Unit';
import type { Ability } from '../../data/schemas/AbilitySchema';
import type { PRNG } from '../random/prng';
import type { BattleEvent } from './types';
import { updateBattleState } from '../models/BattleState';
import { updateTeam } from '../models/Team';
import { isUnitKO } from '../models/Unit';
import { createEmptyQueue } from '../constants';
import { getAbilityManaCost, canAffordAction, isQueueComplete, validateQueuedActions } from '../algorithms/mana';
import { Result, Ok, Err } from '../utils/result';
import { calculateSummonDamage, canActivateDjinn, getSetDjinnIds } from '../algorithms/djinn';
import { calculateTurnOrder } from '../algorithms/turn-order';
import { getEffectiveSPD } from '../algorithms/stats';
import { performAction } from './BattleService';
import { makeAIDecision } from './AIService';

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
 * @returns Updated battle state
 */
export function clearQueuedAction(state: BattleState, unitIndex: number): BattleState {
  if (state.phase !== 'planning') {
    throw new Error('Can only clear actions during planning phase');
  }

  const action = state.queuedActions[unitIndex];
  if (!action) {
    return state; // Nothing to clear
  }

  // Refund mana
  const newQueuedActions = [...state.queuedActions];
  newQueuedActions[unitIndex] = null;

  return updateBattleState(state, {
    queuedActions: newQueuedActions,
    remainingMana: state.remainingMana + action.manaCost,
  });
}

/**
 * Queue Djinn activation
 * PR-DJINN-CORE: Adds Djinn to activation queue
 * 
 * @param state - Current battle state
 * @param djinnId - Djinn ID to activate
 * @returns Updated battle state
 */
export function queueDjinn(state: BattleState, djinnId: string): BattleState {
  if (state.phase !== 'planning') {
    throw new Error('Can only queue Djinn during planning phase');
  }

  if (!canActivateDjinn(state.playerTeam, djinnId)) {
    throw new Error(`Djinn ${djinnId} cannot be activated (not Set)`);
  }

  if (state.queuedDjinn.includes(djinnId)) {
    return state; // Already queued
  }

  return updateBattleState(state, {
    queuedDjinn: [...state.queuedDjinn, djinnId],
  });
}

/**
 * Unqueue Djinn activation
 * PR-DJINN-CORE: Removes Djinn from activation queue
 * 
 * @param state - Current battle state
 * @param djinnId - Djinn ID to unqueue
 * @returns Updated battle state
 */
export function unqueueDjinn(state: BattleState, djinnId: string): BattleState {
  if (state.phase !== 'planning') {
    throw new Error('Can only unqueue Djinn during planning phase');
  }

  return updateBattleState(state, {
    queuedDjinn: state.queuedDjinn.filter(id => id !== djinnId),
  });
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
  if (state.phase !== 'planning') {
    throw new Error('Can only execute round from planning phase');
  }

  // Validate queue is complete
  if (!isQueueComplete(state.queuedActions)) {
    throw new Error('Cannot execute: queue is not complete');
  }

  // Validate mana budget
  if (!validateQueuedActions(state.remainingMana, state.queuedActions)) {
    throw new Error('Cannot execute: actions exceed mana budget');
  }

  let currentState = updateBattleState(state, {
    phase: 'executing',
    executionIndex: 0,
  });

  const allEvents: BattleEvent[] = [];

  // 1. Execute Djinn summons (if any)
  if (currentState.queuedDjinn.length > 0) {
    const djinnResult = executeDjinnSummons(currentState, rng);
    currentState = djinnResult.state;
    allEvents.push(...djinnResult.events);
  }

  // 2. Execute player actions in SPD order
  const playerActions = state.queuedActions.filter((a): a is QueuedAction => a !== null);
  const sortedPlayerActions = sortActionsBySPD(playerActions, currentState.playerTeam, currentState.enemies);
  
  for (const action of sortedPlayerActions) {
    // Check if unit is still alive
    const actor = currentState.playerTeam.units.find(u => u.id === action.unitId);
    if (!actor || isUnitKO(actor)) {
      allEvents.push({
        type: 'ability',
        casterId: action.unitId,
        abilityId: action.abilityId || 'attack',
        targets: action.targetIds,
      });
      allEvents.push({
        type: 'miss',
        targetId: action.targetIds[0] || '',
      });
      continue;
    }

    // Resolve targets (may need retargeting if original target is KO'd)
    const validTargets = resolveValidTargets(action, currentState);
    if (validTargets.length === 0) {
      continue; // Skip if no valid targets
    }

    // Execute action
    const actionResult = performAction(
      currentState,
      action.unitId,
      action.abilityId || 'attack',
      validTargets,
      rng
    );

    currentState = actionResult.state;
    allEvents.push(...actionResult.events);
  }

  // 3. Execute enemy actions (SPD order)
  const enemyActions = generateEnemyActions(currentState, rng);
  const sortedEnemyActions = sortActionsBySPD(enemyActions, currentState.playerTeam, currentState.enemies);

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
      action.abilityId || 'attack',
      validTargets,
      rng
    );

    currentState = actionResult.state;
    allEvents.push(...actionResult.events);
  }

  // 4. Check victory/defeat
  const battleEnd = checkBattleEnd(currentState);
  if (battleEnd) {
    currentState = updateBattleState(currentState, {
      phase: battleEnd === 'PLAYER_VICTORY' ? 'victory' : 'defeat',
      status: battleEnd,
    });
    allEvents.push({
      type: 'battle-end',
      result: battleEnd,
    });
  } else {
    // Return to planning phase
    currentState = updateBattleState(currentState, {
      phase: 'planning',
      roundNumber: currentState.roundNumber + 1,
      currentQueueIndex: 0,
      queuedActions: createEmptyQueue(),
      queuedDjinn: [],
      executionIndex: 0,
    });
    currentState = refreshMana(currentState);
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

  const djinnCount = state.queuedDjinn.length as 1 | 2 | 3;
  const damage = calculateSummonDamage(djinnCount);

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

  currentState = updateBattleState(currentState, {
    playerTeam: updatedTeam,
  });

  // Apply damage to enemies and track targets hit
  let targetsHit: string[] = [];

  if (djinnCount === 3) {
    // Mega summon hits all enemies
    const updatedEnemies = currentState.enemies.map(enemy => {
      if (isUnitKO(enemy)) return enemy;
      const newHp = Math.max(0, enemy.currentHp - damage);
      events.push({
        type: 'hit',
        targetId: enemy.id,
        amount: damage,
        crit: false,
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
        crit: false,
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

  if (allEnemiesKO) {
    return 'PLAYER_VICTORY';
  }
  if (allPlayersKO) {
    return 'PLAYER_DEFEAT';
  }
  return null;
}

