/**
 * Battle Service
 * Coordinates battle algorithms and state management
 * Pure functions, deterministic with PRNG
 */

import type { Unit } from '../models/Unit';
import type { BattleState } from '../models/BattleState';
import type { Team } from '../models/Team';
import type { Ability } from '../../data/schemas/AbilitySchema';
import type { PRNG } from '../random/prng';
import { createBattleState, updateBattleState } from '../models/BattleState';
import { isUnitKO } from '../models/Unit';
import {
  calculatePhysicalDamage,
  calculatePsynergyDamage,
  calculateHealAmount,
  applyDamage,
  applyHealing,
  checkCriticalHit,
  checkDodge,
} from '../algorithms/damage';
import { calculateTurnOrder } from '../algorithms/turn-order';
import {
  processStatusEffectTick,
  checkParalyzeFailure,
  isFrozen,
} from '../algorithms/status';
import { resolveTargets, filterValidTargets } from '../algorithms/targeting';
import { BATTLE_CONSTANTS } from '../constants';
import type { BattleEvent } from './types';

/**
 * Action result for executing abilities
 */
export interface ActionResult {
  damage?: number;
  healing?: number;
  critical?: boolean;
  dodged?: boolean;
  message: string;
  targetIds: readonly string[];
  updatedUnits: readonly Unit[];
}

/**
 * Start a new battle
 * Creates initial battle state with turn order
 */
export function startBattle(
  playerTeam: Team,
  enemies: readonly Unit[],
  rng: PRNG
): BattleState {
  const allUnits = [...playerTeam.units, ...enemies];
  const turnOrder = calculateTurnOrder(allUnits, playerTeam, rng, 0); // Start at turn 0

  return createBattleState(playerTeam, enemies, turnOrder);
}

/**
 * Perform an action in battle
 * Executes ability and returns updated state and events
 * PERFORMANCE: Uses unitById index for O(1) lookups
 */
export function performAction(
  state: BattleState,
  actorId: string,
  abilityId: string,
  targetIds: readonly string[],
  rng: PRNG
): { state: BattleState; result: ActionResult; events: readonly BattleEvent[] } {
  // Find actor using index (O(1) instead of O(n))
  const actorEntry = state.unitById.get(actorId);
  if (!actorEntry || isUnitKO(actorEntry.unit)) {
    throw new Error(`Invalid actor: ${actorId}`);
  }
  const actor = actorEntry.unit;

  // Check if frozen
  if (isFrozen(actor)) {
    const freezeStatus = actor.statusEffects.find((e): e is Extract<typeof e, { type: 'freeze' }> => e.type === 'freeze');
    const events: BattleEvent[] = freezeStatus ? [{
      type: 'status-applied',
      targetId: actorId,
      status: freezeStatus,
    }] : [];
    return {
      state,
      result: {
        message: `${actor.name} is frozen and cannot act!`,
        targetIds: [],
        updatedUnits: [...state.playerTeam.units, ...state.enemies],
      },
      events,
    };
  }

  // Check paralyze failure
  if (checkParalyzeFailure(actor, rng)) {
    const paralyzeStatus = actor.statusEffects.find((e): e is Extract<typeof e, { type: 'paralyze' }> => e.type === 'paralyze');
    const events: BattleEvent[] = paralyzeStatus ? [{
      type: 'status-applied',
      targetId: actorId,
      status: paralyzeStatus,
    }] : [];
    return {
      state,
      result: {
        message: `${actor.name} is paralyzed and cannot act!`,
        targetIds: [],
        updatedUnits: [...state.playerTeam.units, ...state.enemies],
      },
      events,
    };
  }

  // Find ability
  const ability = actor.abilities.find(a => a.id === abilityId);
  if (!ability) {
    throw new Error(`Ability ${abilityId} not found for unit ${actorId}`);
  }

  // Resolve targets
  const potentialTargets = resolveTargets(
    ability,
    actor,
    state.playerTeam.units,
    state.enemies
  );
  const validTargets = filterValidTargets(potentialTargets, ability);
  const targets = validTargets.filter(t => targetIds.includes(t.id));

  if (targets.length === 0) {
    throw new Error(`No valid targets for ability ${abilityId}`);
  }

  // Re-validate targets exist and are alive (defensive check)
  const aliveTargets = targets.filter(t => {
    const exists = state.playerTeam.units.some(u => u.id === t.id) ||
                   state.enemies.some(u => u.id === t.id);
    return exists && !isUnitKO(t);
  });

  if (aliveTargets.length === 0) {
    throw new Error(`All targets are KO'd or invalid`);
  }

  // Execute ability with validated alive targets
  // Pass team for effective stats calculation
  const allUnits = [...state.playerTeam.units, ...state.enemies];
  const result = executeAbility(actor, ability, aliveTargets, allUnits, state.playerTeam, rng);

  // Update battle state with new units
  const updatedPlayerUnits = state.playerTeam.units.map(u => {
    const updated = result.updatedUnits.find(up => up.id === u.id);
    return updated || u;
  });
  const updatedEnemies = state.enemies.map(u => {
    const updated = result.updatedUnits.find(up => up.id === u.id);
    return updated || u;
  });

  const updatedTeam: Team = {
    ...state.playerTeam,
    units: updatedPlayerUnits,
  };

  const updatedState = updateBattleState(state, {
    playerTeam: updatedTeam,
    enemies: updatedEnemies,
    log: [...state.log, result.message],
  });

  // Build events from result
  const events: BattleEvent[] = [{
    type: 'ability',
    casterId: actorId,
    abilityId,
    targets: targetIds,
  }];

  // Add hit/miss/heal events
  if (result.damage !== undefined) {
    if (result.dodged) {
      events.push({
        type: 'miss',
        targetId: targetIds[0] || '',
      });
    } else {
      targetIds.forEach(targetId => {
        const target = targets.find(t => t.id === targetId);
        if (target) {
          events.push({
            type: 'hit',
            targetId,
            amount: result.damage || 0,
            crit: result.critical || false,
            element: ability.element,
          });
        }
      });
    }
  }

  if (result.healing !== undefined) {
    targetIds.forEach(targetId => {
      events.push({
        type: 'heal',
        targetId,
        amount: result.healing || 0,
      });
    });
  }

  return { state: updatedState, result, events };
}

/**
 * Execute an ability in battle (internal helper)
 */
function executeAbility(
  caster: Unit,
  ability: Ability,
  targets: readonly Unit[],
  allUnits: readonly Unit[],
  team: Team,
  rng: PRNG
): ActionResult {
  const targetIds = targets.map(t => t.id);
  let message = `${caster.name} uses ${ability.name}!`;
  const updatedUnits: Unit[] = [];

  // Check for critical hit (physical and psynergy only)
  // Uses effective SPD for crit chance calculation
  const isCritical = (ability.type === 'physical' || ability.type === 'psynergy')
    && checkCriticalHit(caster, team, rng);

  // Execute based on ability type
  switch (ability.type) {
    case 'physical':
    case 'psynergy': {
      let totalDamage = 0;
      let anyDodged = false;

      for (const target of targets) {
        // Re-validate target exists and is alive (may have been KO'd by previous hits)
        const currentTarget = updatedUnits.find(u => u.id === target.id) || 
                             allUnits.find(u => u.id === target.id);
        if (!currentTarget || isUnitKO(currentTarget)) {
          // Target already KO'd, skip
          continue;
        }

        // Check for dodge BEFORE calculating damage
        // Default accuracy (abilities can override this in the future)
        // Uses effective stats for both attacker and defender
        const abilityAccuracy = BATTLE_CONSTANTS.DEFAULT_ABILITY_ACCURACY; // TODO: Add accuracy property to Ability schema
        const dodged = checkDodge(caster, currentTarget, team, abilityAccuracy, rng);
        
        if (dodged) {
          anyDodged = true;
          // Keep current state (may have been updated by previous hits)
          const existingUnit = updatedUnits.find(u => u.id === currentTarget.id) || currentTarget;
          if (existingUnit) {
            updatedUnits.push(existingUnit);
          }
          continue;
        }

        // Use effective stats for damage calculation
        let damage = ability.type === 'physical'
          ? calculatePhysicalDamage(caster, currentTarget, team, ability, rng)
          : calculatePsynergyDamage(caster, currentTarget, team, ability, rng);

        // Apply critical hit multiplier
        if (isCritical) {
          damage = Math.floor(damage * BATTLE_CONSTANTS.CRITICAL_HIT_MULTIPLIER);
        }

        const damagedUnit = applyDamage(currentTarget, damage);
        // Update or add to updatedUnits
        const existingIndex = updatedUnits.findIndex(u => u.id === damagedUnit.id);
        if (existingIndex >= 0) {
          updatedUnits[existingIndex] = damagedUnit;
        } else {
          updatedUnits.push(damagedUnit);
        }
        totalDamage += damage;
      }

      // Build message
      if (anyDodged && totalDamage === 0) {
        message += ' Miss!';
        return {
          message,
          targetIds,
          dodged: true,
          damage: 0,
          updatedUnits: updatedUnits.length > 0 ? updatedUnits : [...allUnits],
        };
      }

      if (anyDodged && totalDamage > 0) {
        message += isCritical ? ' Critical hit!' : '';
        message += ` Deals ${totalDamage} damage! (Some attacks missed)`;
      } else {
        message += isCritical ? ' Critical hit!' : '';
        message += ` Deals ${totalDamage} damage!`;
      }

      const finalUnits = allUnits.map(u => {
        const updated = updatedUnits.find(up => up.id === u.id);
        return updated || u;
      });

      return {
        damage: totalDamage,
        critical: isCritical,
        message,
        targetIds,
        updatedUnits: finalUnits,
      };
    }

    case 'healing': {
      let totalHealing = 0;

      for (const target of targets) {
        if (ability.revivesFallen && isUnitKO(target)) {
          const maxHp = target.baseStats.hp + (target.level - 1) * target.growthRates.hp;
          const revivedUnit: Unit = {
            ...target,
            currentHp: Math.floor(maxHp * BATTLE_CONSTANTS.REVIVE_HP_PERCENTAGE),
          };
          updatedUnits.push(revivedUnit);
          totalHealing += revivedUnit.currentHp;
        } else if (!isUnitKO(target)) {
          // Use effective MAG for healing calculation
          const healAmount = calculateHealAmount(caster, team, ability, rng);
          const healedUnit = applyHealing(target, healAmount);
          updatedUnits.push(healedUnit);
          totalHealing += healedUnit.currentHp - target.currentHp;
        } else {
          updatedUnits.push(target);
        }
      }

      message += ` Restores ${totalHealing} HP!`;

      const finalUnits = allUnits.map(u => {
        const updated = updatedUnits.find(up => up.id === u.id);
        return updated || u;
      });

      return {
        healing: totalHealing,
        message,
        targetIds,
        updatedUnits: finalUnits,
      };
    }

    case 'buff':
    case 'debuff': {
      for (const target of targets) {
        if (ability.buffEffect) {
          const statusEffects = [...target.statusEffects];
          
          const validStats: Array<keyof typeof target.baseStats> = ['hp', 'pp', 'atk', 'def', 'mag', 'spd'];
          for (const [stat, modifier] of Object.entries(ability.buffEffect)) {
            if (typeof modifier === 'number' && validStats.includes(stat as keyof typeof target.baseStats)) {
              statusEffects.push({
                type: ability.type === 'buff' ? 'buff' : 'debuff',
                stat: stat as keyof typeof target.baseStats,
                modifier: modifier as number,
                duration: ability.duration || 3,
              });
            }
          }

          const buffedUnit: Unit = {
            ...target,
            statusEffects,
          };
          updatedUnits.push(buffedUnit);
        } else {
          updatedUnits.push(target);
        }
      }

      message += ` Applied ${ability.type}!`;

      const finalUnits = allUnits.map(u => {
        const updated = updatedUnits.find(up => up.id === u.id);
        return updated || u;
      });

      return {
        message,
        targetIds,
        updatedUnits: finalUnits,
      };
    }

    case 'summon': {
      // Summon abilities are handled separately by the Djinn system
      // This case exists for type safety but shouldn't be called directly
      return {
        message: `${caster.name} summons ${ability.name}!`,
        targetIds,
        updatedUnits: [...allUnits],
      };
    }

    default: {
      // Exhaustive check - ensures all ability types are handled
      const _exhaustive: never = ability.type;
      throw new Error(`Unhandled ability type: ${_exhaustive}`);
    }
  }
}

/**
 * End turn and advance to next actor
 * Processes status effects and recalculates turn order if needed
 * PERFORMANCE: Uses unitById index for O(1) lookup
 */
export function endTurn(
  state: BattleState,
  rng: PRNG
): BattleState {
  // Process status effects for current actor
  const currentActorId = state.turnOrder[state.currentActorIndex];
  if (!currentActorId) {
    // No current actor, just advance
    let nextIndex = state.currentActorIndex + 1;
    if (nextIndex >= state.turnOrder.length) {
      nextIndex = 0;
    }
    return updateBattleState(state, { currentActorIndex: nextIndex });
  }

  const currentActorEntry = state.unitById.get(currentActorId);
  const currentActor = currentActorEntry?.unit;

  if (currentActor) {
    const statusResult = processStatusEffectTick(currentActor, rng);

    // Update actor in the appropriate array (player or enemy)
    const isPlayer = currentActorEntry!.isPlayer;

    if (isPlayer) {
      const updatedPlayerUnits = state.playerTeam.units.map(u =>
        u.id === currentActorId ? statusResult.updatedUnit : u
      );
      state = updateBattleState(state, {
        playerTeam: { ...state.playerTeam, units: updatedPlayerUnits },
        log: statusResult.messages.length > 0
          ? [...state.log, ...statusResult.messages]
          : state.log,
      });
    } else {
      const updatedEnemies = state.enemies.map(u =>
        u.id === currentActorId ? statusResult.updatedUnit : u
      );
      state = updateBattleState(state, {
        enemies: updatedEnemies,
        log: statusResult.messages.length > 0
          ? [...state.log, ...statusResult.messages]
          : state.log,
      });
    }
  }

  // Advance to next actor
  let nextIndex = state.currentActorIndex + 1;

  // If we've gone through all units, start new round
  if (nextIndex >= state.turnOrder.length) {
    nextIndex = 0;
    const newTurn = state.currentTurn + 1;
    const newTurnOrder = calculateTurnOrder(
      [...state.playerTeam.units, ...state.enemies],
      state.playerTeam,
      rng,
      newTurn // Pass turn number for deterministic tiebreaker
    );

    return updateBattleState(state, {
      currentTurn: newTurn,
      turnOrder: newTurnOrder,
      currentActorIndex: 0,
    });
  }

  return updateBattleState(state, {
    currentActorIndex: nextIndex,
  });
}

/**
 * Check if battle has ended
 */
export function checkBattleEnd(
  state: BattleState
): 'PLAYER_VICTORY' | 'PLAYER_DEFEAT' | null {
  const allPlayerKO = state.playerTeam.units.every(u => isUnitKO(u));
  const allEnemiesKO = state.enemies.every(u => isUnitKO(u));

  // If both teams are KO'd simultaneously, treat as defeat (player loses ties)
  if (allEnemiesKO && allPlayerKO) {
    return 'PLAYER_DEFEAT';
  }

  if (allEnemiesKO) return 'PLAYER_VICTORY';
  if (allPlayerKO) return 'PLAYER_DEFEAT';

  return null;
}

/**
 * Process status effects for current actor at turn start
 * Returns updated battle state and events generated
 */
export function startTurnTick(
  state: BattleState,
  rng: PRNG
): { updatedState: BattleState; events: readonly BattleEvent[] } {
  const currentActorId = state.turnOrder[state.currentActorIndex];
  if (!currentActorId) {
    return { updatedState: state, events: [] };
  }

  const allUnits = [...state.playerTeam.units, ...state.enemies];
  const currentActor = allUnits.find(u => u.id === currentActorId);

  if (!currentActor) {
    return { updatedState: state, events: [] };
  }

  // Process status effects
  const statusResult = processStatusEffectTick(currentActor, rng);

  // Update actor with status effects
  const updatedAllUnits = allUnits.map(u =>
    u.id === currentActorId ? statusResult.updatedUnit : u
  );

  const updatedPlayerUnits = updatedAllUnits.filter(u =>
    state.playerTeam.units.some(pu => pu.id === u.id)
  );
  const updatedEnemies = updatedAllUnits.filter(u =>
    state.enemies.some(e => e.id === u.id)
  );

  const updatedBattle: BattleState = {
    ...state,
    playerTeam: {
      ...state.playerTeam,
      units: updatedPlayerUnits,
    },
    enemies: updatedEnemies,
  };

  // Generate events for status effects
  const newEvents: BattleEvent[] = [];

  if (statusResult.damage > 0) {
    newEvents.push({
      type: 'hit',
      targetId: currentActorId,
      amount: statusResult.damage,
      crit: false,
    });
  }

  // Check for expired statuses by comparing old and new status effects
  const oldStatusIds = new Set(currentActor.statusEffects.map(s => `${s.type}-${s.duration}`));
  const newStatusIds = new Set(statusResult.updatedUnit.statusEffects.map(s => `${s.type}-${s.duration}`));

  currentActor.statusEffects.forEach(status => {
    const statusKey = `${status.type}-${status.duration}`;
    if (oldStatusIds.has(statusKey) && !newStatusIds.has(statusKey)) {
      newEvents.push({
        type: 'status-expired',
        targetId: currentActorId,
        status,
      });
    }
  });

  return { updatedState: updatedBattle, events: newEvents };
}

