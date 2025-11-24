/**
 * Battle Service
 * Coordinates battle algorithms and state management
 * Pure functions, deterministic with PRNG
 */

import type { Unit } from '../models/Unit';
import type { BattleState } from '../models/BattleState';
import type { Team } from '../models/Team';
import type { Ability } from '../../data/schemas/AbilitySchema';
import type { StatusEffect } from '../../data/schemas/UnitSchema';
import type { PRNG } from '../random/prng';
import { createBattleState, updateBattleState } from '../models/BattleState';
import { isUnitKO } from '../models/Unit';
import {
  calculatePhysicalDamage,
  calculatePsynergyDamage,
  calculateHealAmount,
  applyDamageWithShields,
  applyHealing,
} from '../algorithms/damage';
import { calculateTurnOrder } from '../algorithms/turn-order';
import {
  processStatusEffectTick,
  checkParalyzeFailure,
  isFrozen,
  isNegativeStatus,
  applyStatusToUnit,
} from '../algorithms/status';
import { resolveTargets, filterValidTargets } from '../algorithms/targeting';
import { BATTLE_CONSTANTS } from '../constants';
import type { BattleEvent } from './types';
import { Ok, Err, type Result } from '../utils/result';
import { BattleTransaction } from './BattleTransaction';

const REMOVABLE_STATUS_TYPES = ['poison', 'burn', 'freeze', 'paralyze', 'stun', 'debuff'] as const;
type RemovableStatusType = (typeof REMOVABLE_STATUS_TYPES)[number];

const isRemovableStatusType = (type: StatusEffect['type']): type is RemovableStatusType =>
  (REMOVABLE_STATUS_TYPES as readonly string[]).includes(type);

/**
 * Action result for executing abilities
 */
export interface ActionResult {
  damage?: number;
  healing?: number;
  message: string;
  targetIds: readonly string[];
  updatedUnits: readonly Unit[];
  hit?: boolean;
}

/**
 * Start a new battle
 * Creates initial battle state with turn order
 */
export function startBattle(
  playerTeam: Team,
  enemies: readonly Unit[],
  rng: PRNG
): Result<BattleState, string> {
  if (!playerTeam.units || playerTeam.units.length === 0) {
    return Err('Player team must contain at least one unit');
  }

  if (!enemies || enemies.length === 0) {
    return Err('Battle requires at least one enemy');
  }

  const allUnits = [...playerTeam.units, ...enemies];
  const turnOrder = calculateTurnOrder(allUnits, playerTeam, rng, 0); // Start at turn 0

  return Ok(createBattleState(playerTeam, enemies, turnOrder));
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
): Result<{ state: BattleState; result: ActionResult; events: readonly BattleEvent[] }, string> {
  const transaction = new BattleTransaction();
  transaction.begin(state);

  // Find actor using index (O(1) instead of O(n))
  const actorEntry = state.unitById.get(actorId);
  if (!actorEntry || isUnitKO(actorEntry.unit)) {
    transaction.rollback();
    return Err(`Invalid actor: ${actorId}`);
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
    transaction.commit();
    return Ok({
      state,
      result: {
        message: `${actor.name} is frozen and cannot act!`,
        targetIds: [],
        updatedUnits: [...state.playerTeam.units, ...state.enemies],
      },
      events,
    });
  }

  // Check paralyze failure
  if (checkParalyzeFailure(actor, rng)) {
    const paralyzeStatus = actor.statusEffects.find((e): e is Extract<typeof e, { type: 'paralyze' }> => e.type === 'paralyze');
    const events: BattleEvent[] = paralyzeStatus ? [{
      type: 'status-applied',
      targetId: actorId,
      status: paralyzeStatus,
    }] : [];
    transaction.commit();
    return Ok({
      state,
      result: {
        message: `${actor.name} is paralyzed and cannot act!`,
        targetIds: [],
        updatedUnits: [...state.playerTeam.units, ...state.enemies],
      },
      events,
    });
  }

  // Find ability
  const ability = actor.abilities.find(a => a.id === abilityId);
  if (!ability) {
    transaction.rollback();
    return Err(`Ability ${abilityId} not found for unit ${actorId}`);
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
    transaction.rollback();
    return Err(`No valid targets for ability ${abilityId}`);
  }

  // Re-validate targets exist and are alive (defensive check)
  const aliveTargets = targets.filter(t => {
    const exists = state.playerTeam.units.some(u => u.id === t.id) ||
                   state.enemies.some(u => u.id === t.id);
    return exists && !isUnitKO(t);
  });

  if (aliveTargets.length === 0) {
    transaction.rollback();
    return Err(`All targets are KO'd or invalid`);
  }

  // Store status effects before execution (for status-applied event detection)
  const statusEffectsBefore = new Map<string, typeof aliveTargets[number]['statusEffects']>();
  aliveTargets.forEach(target => {
    statusEffectsBefore.set(target.id, target.statusEffects);
  });

  // Execute ability with validated alive targets
  // Pass team for effective stats calculation and RNG for status chance rolls
  const allUnits = [...state.playerTeam.units, ...state.enemies];
  const abilityResult = executeAbility(actor, ability, aliveTargets, allUnits, state.playerTeam, state.enemies, rng);
  if (!abilityResult.ok) {
    transaction.rollback();
    return Err(abilityResult.error);
  }
  const result = abilityResult.value;

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

  // Add hit/heal events
  if (result.damage !== undefined) {
    targetIds.forEach(targetId => {
      const target = targets.find(t => t.id === targetId);
      if (target) {
        events.push({
          type: 'hit',
          targetId,
          amount: result.damage || 0,
          element: ability.element,
        });
      }
    });
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

  // Emit status-applied events for newly added status effects (on-hit statuses)
  if (ability.statusEffect) {
    targetIds.forEach(targetId => {
      const beforeStatuses = statusEffectsBefore.get(targetId) || [];
      const afterUnit = result.updatedUnits.find(u => u.id === targetId);
      if (afterUnit) {
        const afterStatuses = afterUnit.statusEffects;
        
        // Find newly added statuses (compare by type)
        const beforeTypes = new Set(beforeStatuses.map(s => s.type));
        const newStatuses = afterStatuses.filter(s => !beforeTypes.has(s.type));
        
        // Emit event for each newly applied status
        newStatuses.forEach(status => {
          events.push({
            type: 'status-applied',
            targetId,
            status,
          });
        });
      }
    });
  }

  transaction.commit();
  return Ok({ state: updatedState, result, events });
}

/**
 * Phase 2: Apply shield granting and status cleanse to targets
 * This processes optional Phase 2 ability effects after main ability execution
 */
function applyPhase2Effects(
  ability: Ability,
  targets: Unit[]
): Unit[] {
  return targets.map(target => {
    let modifiedTarget = target;

    // 1. Shield granting
    if (ability.shieldCharges) {
      const shieldStatus: Extract<typeof target.statusEffects[number], { type: 'shield' }> = {
        type: 'shield',
        remainingCharges: ability.shieldCharges,
        duration: ability.duration || 3, // Default 3 turns if not specified
      };

      modifiedTarget = {
        ...modifiedTarget,
        statusEffects: [...modifiedTarget.statusEffects, shieldStatus],
      };
    }

    // 2. Damage reduction granting
    if (ability.damageReductionPercent !== undefined) {
      const damageReductionStatus: Extract<typeof target.statusEffects[number], { type: 'damageReduction' }> = {
        type: 'damageReduction',
        percent: ability.damageReductionPercent,
        duration: ability.duration || 3,
      };

      modifiedTarget = {
        ...modifiedTarget,
        statusEffects: [...modifiedTarget.statusEffects, damageReductionStatus],
      };
    }

    // 3. Elemental resistance granting
    if (ability.elementalResistance) {
      const elementalResistanceStatus: Extract<typeof target.statusEffects[number], { type: 'elementalResistance' }> = {
        type: 'elementalResistance',
        element: ability.elementalResistance.element,
        modifier: ability.elementalResistance.modifier,
        duration: ability.duration || 3,
      };

      modifiedTarget = {
        ...modifiedTarget,
        statusEffects: [...modifiedTarget.statusEffects, elementalResistanceStatus],
      };
    }

    // 4. Immunity granting
    if (ability.grantImmunity) {
      const immunityStatus: Extract<typeof target.statusEffects[number], { type: 'immunity' }> = {
        type: 'immunity',
        all: ability.grantImmunity.all,
        types: ability.grantImmunity.types,
        duration: ability.grantImmunity.duration,
      };

      modifiedTarget = {
        ...modifiedTarget,
        statusEffects: [...modifiedTarget.statusEffects, immunityStatus],
      };
    }

    // 5. Status cleanse
    if (ability.removeStatusEffects) {
      const removeSpec = ability.removeStatusEffects;
      let filteredStatuses = modifiedTarget.statusEffects;

      if (removeSpec.type === 'all') {
        // Remove all status effects
        filteredStatuses = [];
      } else if (removeSpec.type === 'negative') {
        // Remove only negative status effects
        filteredStatuses = filteredStatuses.filter(s => !isNegativeStatus(s));
      } else if (removeSpec.type === 'byType') {
        // Remove specific status types
        const typesToRemove = new Set<RemovableStatusType>(removeSpec.statuses);
        filteredStatuses = filteredStatuses.filter(status => {
          if (!isRemovableStatusType(status.type)) {
            return true;
          }

          return !typesToRemove.has(status.type);
        });
      }

      modifiedTarget = {
        ...modifiedTarget,
        statusEffects: filteredStatuses,
      };
    }

    return modifiedTarget;
  });
}

/**
 * Execute an ability in battle (internal helper)
 * Phase 2: Added enemies parameter for splash damage targeting, added rng for status chance rolls
 */
export function executeAbility(
  caster: Unit,
  ability: Ability,
  targets: readonly Unit[],
  allUnits: readonly Unit[],
  team: Team,
  enemies: readonly Unit[],
  rng: PRNG
): Result<ActionResult, string> {
  const targetIds = targets.map(t => t.id);
  let message = `${caster.name} uses ${ability.name}!`;
  const updatedUnits: Unit[] = [];

  // Execute based on ability type
  switch (ability.type) {
    case 'physical':
    case 'psynergy': {
      let totalDamage = 0;
      const hitCount = ability.hitCount || 1; // Multi-hit support

      for (const target of targets) {
        // Re-validate target exists and is alive (may have been KO'd by previous hits)
        let currentTarget = updatedUnits.find(u => u.id === target.id) ||
                             allUnits.find(u => u.id === target.id);
        if (!currentTarget || isUnitKO(currentTarget)) {
          continue;
        }

        let targetDamage = 0;

        // Multi-hit logic
        for (let hit = 0; hit < hitCount; hit++) {
          if (isUnitKO(currentTarget)) break; // Stop hitting if target is KO'd

          const damage = ability.type === 'physical'
            ? calculatePhysicalDamage(caster, currentTarget, team, ability)
            : calculatePsynergyDamage(caster, currentTarget, team, ability);

          // Phase 2: Apply damage with shield/invulnerability checks
          const { updatedUnit, actualDamage } = applyDamageWithShields(currentTarget, damage);
          currentTarget = updatedUnit;
          targetDamage += actualDamage;

          // Update in the working set
          const existingIndex = updatedUnits.findIndex(u => u.id === currentTarget!.id);
          if (existingIndex >= 0) {
            updatedUnits[existingIndex] = currentTarget;
          } else {
            updatedUnits.push(currentTarget);
          }
        }

        totalDamage += targetDamage;

        // Apply status effect (if any)
        if (ability.statusEffect) {
          const statusType = ability.statusEffect.type;
          const statusDuration = ability.statusEffect.duration;
          const statusChance = ability.statusEffect.chance ?? 1.0; // Default 100% chance

          // Phase 2: Use RNG for status chance roll
          const roll = rng.next(); // Returns [0, 1)
          if (roll < statusChance) {
            // First, remove existing status of the same type
            const filteredStatuses = currentTarget.statusEffects.filter(
              s => s.type !== statusType
            );
            currentTarget = {
              ...currentTarget,
              statusEffects: filteredStatuses,
            };

            // Create new status
            let newStatus: typeof currentTarget.statusEffects[number];
            if (statusType === 'poison') {
              newStatus = {
                type: 'poison',
                damagePerTurn: 8,
                duration: statusDuration,
              };
            } else if (statusType === 'burn') {
              newStatus = {
                type: 'burn',
                damagePerTurn: 10,
                duration: statusDuration,
              };
            } else if (statusType === 'freeze') {
              newStatus = {
                type: 'freeze',
                duration: statusDuration,
              };
            } else if (statusType === 'stun') {
              newStatus = {
                type: 'stun',
                duration: statusDuration,
              };
            } else {
              newStatus = {
                type: 'paralyze',
                duration: statusDuration,
              };
            }

            // Phase 2: Apply status with immunity check
            currentTarget = applyStatusToUnit(currentTarget, newStatus);

            const existingIndex = updatedUnits.findIndex(u => u.id === currentTarget!.id);
            if (existingIndex >= 0) {
              updatedUnits[existingIndex] = currentTarget;
            } else {
              updatedUnits.push(currentTarget);
            }
          }
        }

        // Apply debuff effect (if any)
        if (ability.debuffEffect) {
          const newDebuffs: Array<typeof currentTarget.statusEffects[number]> = [];
          const validStats: Array<keyof typeof caster.baseStats> = ['hp', 'pp', 'atk', 'def', 'mag', 'spd'];

          for (const [stat, modifier] of Object.entries(ability.debuffEffect)) {
            if (typeof modifier === 'number' && validStats.includes(stat as keyof typeof caster.baseStats)) {
              newDebuffs.push({
                type: 'debuff',
                stat: stat as keyof typeof caster.baseStats,
                modifier: -Math.abs(modifier), // Ensure negative for debuff
                duration: ability.duration || 3,
              });
            }
          }

          // Phase 2: Apply each debuff with immunity check
          if (newDebuffs.length > 0) {
            for (const debuff of newDebuffs) {
              currentTarget = applyStatusToUnit(currentTarget, debuff);
            }

            const existingIndex = updatedUnits.findIndex(u => u.id === currentTarget!.id);
            if (existingIndex >= 0) {
              updatedUnits[existingIndex] = currentTarget;
            } else {
              updatedUnits.push(currentTarget);
            }
          }
        }
      }

      // Phase 2: Splash damage for single-target abilities
      if (ability.splashDamagePercent && ability.targets === 'single-enemy' && targets.length === 1) {
        const primaryTargetId = targets[0]?.id;
        const splashPercent = ability.splashDamagePercent;

        // Find all alive enemies excluding primary target
        const secondaryTargets = enemies.filter(enemy =>
          enemy.id !== primaryTargetId && !isUnitKO(enemy)
        );

        for (const secondaryTarget of secondaryTargets) {
          // Get current state of secondary target
          let currentSecondary = updatedUnits.find(u => u.id === secondaryTarget.id) ||
                                   allUnits.find(u => u.id === secondaryTarget.id);

          if (!currentSecondary || isUnitKO(currentSecondary)) {
            continue;
          }

          // Calculate splash damage (reduced by splashPercent)
          const baseDamage = ability.type === 'physical'
            ? calculatePhysicalDamage(caster, currentSecondary, team, ability)
            : calculatePsynergyDamage(caster, currentSecondary, team, ability);

          const splashDamage = Math.floor(baseDamage * splashPercent);

          // Apply splash damage with shields/invulnerability
          const { updatedUnit, actualDamage } = applyDamageWithShields(currentSecondary, splashDamage);
          currentSecondary = updatedUnit;
          totalDamage += actualDamage;

          // Update in the working set
          const existingIndex = updatedUnits.findIndex(u => u.id === currentSecondary.id);
          if (existingIndex >= 0) {
            updatedUnits[existingIndex] = currentSecondary;
          } else {
            updatedUnits.push(currentSecondary);
          }
        }
      }

      // Phase 2: Apply shield granting and status cleanse to affected units
      const unitsWithPhase2Effects = applyPhase2Effects(ability, updatedUnits);
      updatedUnits.splice(0, updatedUnits.length, ...unitsWithPhase2Effects);

      message += ` Deals ${totalDamage} damage!`;

      const finalUnits = allUnits.map(u => {
        const updated = updatedUnits.find(up => up.id === u.id);
        return updated || u;
      });

      return Ok({
        damage: totalDamage,
        message,
        targetIds,
        updatedUnits: finalUnits,
        hit: totalDamage > 0,
      });
    }

    case 'healing': {
      let totalHealing = 0;

      for (const target of targets) {
        let currentTarget = target;

        // Handle revive
        if ((ability.revivesFallen || ability.revive) && isUnitKO(target)) {
          const maxHp = target.baseStats.hp + (target.level - 1) * target.growthRates.hp;
          const reviveHPPercent = ability.reviveHPPercent ?? BATTLE_CONSTANTS.REVIVE_HP_PERCENTAGE;
          currentTarget = {
            ...target,
            currentHp: Math.floor(maxHp * reviveHPPercent),
          };
          totalHealing += currentTarget.currentHp;
        } else if (!isUnitKO(target)) {
          // Use effective MAG for healing calculation
          const healAmount = calculateHealAmount(caster, team, ability);
          currentTarget = applyHealing(target, healAmount, ability.revivesFallen || ability.revive || false);
          totalHealing += currentTarget.currentHp - target.currentHp;
        }

        // Apply heal-over-time effect (if any)
        if (ability.healOverTime && !isUnitKO(currentTarget)) {
          const hotEffect: Extract<typeof currentTarget.statusEffects[number], { type: 'healOverTime' }> = {
            type: 'healOverTime',
            healPerTurn: ability.healOverTime.amount,
            duration: ability.healOverTime.duration,
          };

          // Remove existing heal-over-time effects
          const filteredStatuses = currentTarget.statusEffects.filter(s => s.type !== 'healOverTime');

          currentTarget = {
            ...currentTarget,
            statusEffects: [...filteredStatuses, hotEffect],
          };
        }

        updatedUnits.push(currentTarget);
      }

      // Phase 2: Apply shield granting and status cleanse
      const unitsWithPhase2Effects = applyPhase2Effects(ability, updatedUnits);
      updatedUnits.splice(0, updatedUnits.length, ...unitsWithPhase2Effects);

      message += ` Restores ${totalHealing} HP!`;

      const finalUnits = allUnits.map(u => {
        const updated = updatedUnits.find(up => up.id === u.id);
        return updated || u;
      });

      return Ok({
        healing: totalHealing,
        message,
        targetIds,
        updatedUnits: finalUnits,
        hit: false,
      });
    }

    case 'buff':
    case 'debuff': {
      for (const target of targets) {
        if (ability.buffEffect) {
          let modifiedTarget = target;

          const validStats: Array<keyof typeof target.baseStats> = ['hp', 'pp', 'atk', 'def', 'mag', 'spd'];
          for (const [stat, modifier] of Object.entries(ability.buffEffect)) {
            if (typeof modifier === 'number' && validStats.includes(stat as keyof typeof target.baseStats)) {
              const newStatus: typeof target.statusEffects[number] = {
                type: ability.type === 'buff' ? 'buff' : 'debuff',
                stat: stat as keyof typeof target.baseStats,
                modifier: modifier as number,
                duration: ability.duration || 3,
              };

              // Phase 2: Apply status with immunity check
              modifiedTarget = applyStatusToUnit(modifiedTarget, newStatus);
            }
          }

          updatedUnits.push(modifiedTarget);
        } else {
          updatedUnits.push(target);
        }
      }

      // Phase 2: Apply shield granting and status cleanse
      const unitsWithPhase2Effects = applyPhase2Effects(ability, updatedUnits);
      updatedUnits.splice(0, updatedUnits.length, ...unitsWithPhase2Effects);

      message += ` Applied ${ability.type}!`;

      const finalUnits = allUnits.map(u => {
        const updated = updatedUnits.find(up => up.id === u.id);
        return updated || u;
      });

      return Ok({
        message,
        targetIds,
        updatedUnits: finalUnits,
        hit: false,
      });
    }

    case 'summon': {
      // Summon abilities are handled separately by the Djinn system
      // This case exists for type safety but shouldn't be called directly
      return Ok({
        message: `${caster.name} summons ${ability.name}!`,
        targetIds,
        updatedUnits: [...allUnits],
        hit: false,
      });
    }

    default: {
      // Exhaustive check - ensures all ability types are handled
      const _exhaustive: never = ability.type;
      return Err(`Unhandled ability type: ${String(_exhaustive)}`);
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
): Result<BattleState, string> {
  const transaction = new BattleTransaction();
  transaction.begin(state);
  let workingState = state;
  // Process status effects for current actor
  const currentActorId = workingState.turnOrder[workingState.currentActorIndex];
  if (!currentActorId) {
    // No current actor, just advance
    let nextIndex = workingState.currentActorIndex + 1;
    if (nextIndex >= workingState.turnOrder.length) {
      nextIndex = 0;
    }
    const updated = updateBattleState(workingState, { currentActorIndex: nextIndex });
    transaction.commit();
    return Ok(updated);
  }

  const currentActorEntry = workingState.unitById.get(currentActorId);
  const currentActor = currentActorEntry?.unit;

  if (currentActor) {
    const statusResult = processStatusEffectTick(currentActor, rng);

    // Update actor in the appropriate array (player or enemy)
    const isPlayer = currentActorEntry!.isPlayer;

    if (isPlayer) {
      const updatedPlayerUnits = workingState.playerTeam.units.map(u =>
        u.id === currentActorId ? statusResult.updatedUnit : u
      );
      workingState = updateBattleState(workingState, {
        playerTeam: { ...workingState.playerTeam, units: updatedPlayerUnits },
        log: statusResult.messages.length > 0
          ? [...workingState.log, ...statusResult.messages]
          : workingState.log,
      });
    } else {
      const updatedEnemies = workingState.enemies.map(u =>
        u.id === currentActorId ? statusResult.updatedUnit : u
      );
      workingState = updateBattleState(workingState, {
        enemies: updatedEnemies,
        log: statusResult.messages.length > 0
          ? [...workingState.log, ...statusResult.messages]
          : workingState.log,
      });
    }
  }

  // Advance to next actor
  let nextIndex = workingState.currentActorIndex + 1;

  // If we've gone through all units, start new round
  if (nextIndex >= workingState.turnOrder.length) {
    nextIndex = 0;
    const newTurn = workingState.currentTurn + 1;
    const newTurnOrder = calculateTurnOrder(
      [...workingState.playerTeam.units, ...workingState.enemies],
      workingState.playerTeam,
      rng,
      newTurn
    );

    const updated = updateBattleState(workingState, {
      currentTurn: newTurn,
      turnOrder: newTurnOrder,
      currentActorIndex: 0,
    });
    transaction.commit();
    return Ok(updated);
  }

  const updated = updateBattleState(workingState, {
    currentActorIndex: nextIndex,
  });
  transaction.commit();
  return Ok(updated);
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
    });
  }

  // Check for expired statuses by comparing old and new status effects
  const makeStatusKey = (s: typeof currentActor.statusEffects[number]) =>
    `${s.type}-${'duration' in s ? s.duration : 'usesRemaining' in s ? s.usesRemaining : 'permanent'}`;
  const oldStatusIds = new Set(currentActor.statusEffects.map(makeStatusKey));
  const newStatusIds = new Set(statusResult.updatedUnit.statusEffects.map(makeStatusKey));

  currentActor.statusEffects.forEach(status => {
    const statusKey = makeStatusKey(status);
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
