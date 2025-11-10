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
  const turnOrder = calculateTurnOrder(allUnits, rng, 0); // Start at turn 0

  return createBattleState(playerTeam, enemies, turnOrder);
}

/**
 * Perform an action in battle
 * Executes ability and returns updated state and events
 */
export function performAction(
  state: BattleState,
  actorId: string,
  abilityId: string,
  targetIds: readonly string[],
  rng: PRNG
): { state: BattleState; result: ActionResult; events: readonly BattleEvent[] } {
  // Find actor
  const allUnits = [...state.playerTeam.units, ...state.enemies];
  const actor = allUnits.find(u => u.id === actorId);
  if (!actor || isUnitKO(actor)) {
    throw new Error(`Invalid actor: ${actorId}`);
  }

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
        updatedUnits: allUnits,
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
        updatedUnits: allUnits,
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
  const result = executeAbility(actor, ability, aliveTargets, allUnits, rng);

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
  rng: PRNG
): ActionResult {
  const targetIds = targets.map(t => t.id);
  let message = `${caster.name} uses ${ability.name}!`;
  const updatedUnits: Unit[] = [];

  // Check for critical hit (physical and psynergy only)
  const isCritical = (ability.type === 'physical' || ability.type === 'psynergy')
    && checkCriticalHit(caster, rng);

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
        // Default accuracy is 95% (abilities can override this in the future)
        const abilityAccuracy = 0.95; // TODO: Add accuracy property to Ability schema
        const dodged = checkDodge(caster, currentTarget, abilityAccuracy, rng);
        
        if (dodged) {
          anyDodged = true;
          // Keep current state (may have been updated by previous hits)
          const existingUnit = updatedUnits.find(u => u.id === currentTarget.id) || currentTarget;
          if (existingUnit) {
            updatedUnits.push(existingUnit);
          }
          continue;
        }

        let damage = ability.type === 'physical'
          ? calculatePhysicalDamage(caster, currentTarget, ability, rng)
          : calculatePsynergyDamage(caster, currentTarget, ability, rng);

        // Apply critical hit multiplier
        if (isCritical) {
          damage = Math.floor(damage * 2.0);
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
            currentHp: Math.floor(maxHp * 0.5),
          };
          updatedUnits.push(revivedUnit);
          totalHealing += revivedUnit.currentHp;
        } else if (!isUnitKO(target)) {
          const healAmount = calculateHealAmount(caster, ability, rng);
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

    default:
      return {
        message: `${caster.name} uses ${ability.name}! (Effect not implemented)`,
        targetIds,
        updatedUnits: [...allUnits],
      };
  }
}

/**
 * End turn and advance to next actor
 * Processes status effects and recalculates turn order if needed
 */
export function endTurn(
  state: BattleState,
  rng: PRNG
): BattleState {
  // Process status effects for current actor
  const currentActorId = state.turnOrder[state.currentActorIndex];
  const allUnits = [...state.playerTeam.units, ...state.enemies];
  const currentActor = allUnits.find(u => u.id === currentActorId);

  if (currentActor) {
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

    const updatedTeam: Team = {
      ...state.playerTeam,
      units: updatedPlayerUnits,
    };

    state = updateBattleState(state, {
      playerTeam: updatedTeam,
      enemies: updatedEnemies,
      log: statusResult.messages.length > 0
        ? [...state.log, ...statusResult.messages]
        : state.log,
    });
  }

  // Advance to next actor
  let nextIndex = state.currentActorIndex + 1;

  // If we've gone through all units, start new round
  if (nextIndex >= state.turnOrder.length) {
    nextIndex = 0;
    const newTurn = state.currentTurn + 1;
    const newTurnOrder = calculateTurnOrder(
      [...state.playerTeam.units, ...state.enemies],
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

  if (allEnemiesKO) return 'PLAYER_VICTORY';
  if (allPlayerKO) return 'PLAYER_DEFEAT';

  return null;
}

