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
import { getAbilityManaCost, canAffordAction, isQueueComplete, validateQueuedActions } from '../algorithms/mana';
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
 * @returns Updated battle state
 */
export function queueAction(
  state: BattleState,
  unitId: string,
  abilityId: string | null,
  targetIds: readonly string[],
  ability?: Ability
): BattleState {
  if (state.phase !== 'planning') {
    throw new Error('Can only queue actions during planning phase');
  }

  // Find unit index in team
  const unitIndex = state.playerTeam.units.findIndex(u => u.id === unitId);
  if (unitIndex === -1) {
    throw new Error(`Unit ${unitId} not found in player team`);
  }

  // Calculate mana cost
  const manaCost = getAbilityManaCost(abilityId, ability);

  // Check if affordable
  if (!canAffordAction(state.remainingMana, manaCost)) {
    throw new Error(`Cannot afford action: need ${manaCost} mana, have ${state.remainingMana}`);
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

  return updateBattleState(state, {
    queuedActions: newQueuedActions,
    remainingMana: state.remainingMana - manaCost,
  });
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
      queuedActions: [null, null, null, null],
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

  // Apply damage to enemies
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
      const target = aliveEnemies[targetIndex];
      const newHp = Math.max(0, target.currentHp - damage);
      events.push({
        type: 'hit',
        targetId: target.id,
        amount: damage,
        crit: false,
      });
      const updatedEnemies = currentState.enemies.map(e =>
        e.id === target.id ? { ...e, currentHp: newHp } : e
      );
      currentState = updateBattleState(currentState, {
        enemies: updatedEnemies,
      });
    }
  }

  events.push({
    type: 'ability',
    casterId: 'djinn-summon',
    abilityId: `djinn-summon-${djinnCount}`,
    targets: djinnCount === 3 ? currentState.enemies.map(e => e.id) : [currentState.enemies[0]?.id || ''],
  });

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
 * PR-QUEUE-BATTLE: Retargets if original target is KO'd
 */
function resolveValidTargets(
  action: QueuedAction,
  state: BattleState
): readonly string[] {
  const allUnits = [...state.playerTeam.units, ...state.enemies];
  const validTargets = action.targetIds.filter(id => {
    const unit = allUnits.find(u => u.id === id);
    return unit && !isUnitKO(unit);
  });

  // If no valid targets, try to retarget
  if (validTargets.length === 0) {
    const isPlayerAction = state.playerTeam.units.some(u => u.id === action.unitId);
    if (isPlayerAction) {
      // Player action: retarget to alive enemies
      const aliveEnemies = state.enemies.filter(e => !isUnitKO(e));
      return aliveEnemies.map(e => e.id);
    } else {
      // Enemy action: retarget to alive player units
      const alivePlayers = state.playerTeam.units.filter(u => !isUnitKO(u));
      return alivePlayers.map(u => u.id);
    }
  }

  return validTargets;
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

    const decision = makeAIDecision(state, enemy.id, rng);
    if (decision) {
      actions.push({
        unitId: enemy.id,
        abilityId: decision.abilityId,
        targetIds: decision.targetIds,
        manaCost: 0, // Enemies don't use mana
      });
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

