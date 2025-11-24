/**
 * Status effect algorithms
 * Pure functions, deterministic with PRNG
 */

import type { Unit } from '../models/Unit';
import type { PRNG } from '../random/prng';
import { applyDamage } from './damage';

/**
 * Process status effect tick at start of unit's turn
 * From GAME_MECHANICS.md Section 5.3
 *
 * Status tick ordering (executed in this order):
 * 1. Duration decay (all effects)
 * 2. Damage-over-time (poison, burn) - applied after decay
 * 3. Heal-over-time - applied after decay
 * 4. Status expiration events emitted for effects that reached duration 0
 *
 * Note: Freeze, Stun, and Paralyze are checked separately before action execution
 * (freeze/stun in isFrozen(), paralyze in checkParalyzeFailure())
 *
 * Poison: 8% max HP damage per turn
 * Burn: 10% max HP damage per turn
 * HealOverTime: Fixed HP heal per turn (specified in effect)
 * Freeze: Skip turn, 30% break chance per turn (checked in isFrozen())
 * Stun: Skip turn completely
 * Paralyze: 25% failure chance (checked in checkParalyzeFailure())
 */
export function processStatusEffectTick(
  unit: Unit,
  rng: PRNG
): { updatedUnit: Unit; damage: number; healing: number; messages: readonly string[] } {
  let totalDamage = 0;
  let totalHealing = 0;
  const messages: string[] = [];
  const maxHp = unit.baseStats.hp + (unit.level - 1) * unit.growthRates.hp;

  const updatedStatusEffects = unit.statusEffects.map(effect => {
    if (effect.type === 'poison') {
      const damage = Math.floor(maxHp * 0.08);
      totalDamage += damage;
      messages.push(`${unit.name} takes ${damage} poison damage!`);
      return { ...effect, duration: effect.duration - 1 };
    } else if (effect.type === 'burn') {
      const damage = Math.floor(maxHp * 0.10);
      totalDamage += damage;
      messages.push(`${unit.name} takes ${damage} burn damage!`);
      return { ...effect, duration: effect.duration - 1 };
    } else if (effect.type === 'healOverTime') {
      const healing = effect.healPerTurn;
      totalHealing += healing;
      messages.push(`${unit.name} recovers ${healing} HP!`);
      return { ...effect, duration: effect.duration - 1 };
    } else if (effect.type === 'freeze') {
      const breakChance = 0.3; // 30% chance to break free
      if (rng.next() < breakChance) {
        messages.push(`${unit.name} broke free from freeze!`);
        return { ...effect, duration: 0 }; // Mark for removal
      } else {
        messages.push(`${unit.name} is frozen and cannot act!`);
        return { ...effect, duration: effect.duration - 1 };
      }
    } else if (effect.type === 'stun') {
      messages.push(`${unit.name} is stunned and cannot act!`);
      return { ...effect, duration: effect.duration - 1 };
    } else if (effect.type === 'autoRevive') {
      // Auto-revive is uses-based, not time-based - keep as-is
      return effect;
    }
    // Buff/debuff/paralyze/other duration-based effects - decrement duration
    if ('duration' in effect) {
      return { ...effect, duration: effect.duration - 1 };
    }
    return effect;
  }).filter(effect => {
    // Remove effects with duration <= 0 (skip autoRevive which doesn't have duration)
    if ('duration' in effect) {
      return effect.duration > 0;
    }
    return true;
  });

  let modifiedUnit = unit;
  if (totalDamage > 0) {
    modifiedUnit = applyDamage(modifiedUnit, totalDamage);
  }
  if (totalHealing > 0) {
    const newHp = Math.min(modifiedUnit.currentHp + totalHealing, maxHp);
    modifiedUnit = { ...modifiedUnit, currentHp: newHp };
  }

  const updatedUnit: Unit = {
    ...modifiedUnit,
    statusEffects: updatedStatusEffects,
  };

  return {
    updatedUnit,
    damage: totalDamage,
    healing: totalHealing,
    messages,
  };
}

/**
 * Check if unit's action fails due to paralyze
 * From GAME_MECHANICS.md Section 5.3
 * Paralyze: 25% chance action fails
 */
export function checkParalyzeFailure(
  unit: Unit,
  rng: PRNG
): boolean {
  const paralyzeEffects = unit.statusEffects.filter(
    e => e.type === 'paralyze'
  ) as Array<Extract<typeof unit.statusEffects[number], { type: 'paralyze' }>>;

  const paralyzed = paralyzeEffects[0];
  if (paralyzed && rng.next() < 0.25) {
    return true; // Action fails (25% chance)
  }
  return false;
}

/**
 * Check if unit is frozen or stunned (cannot act)
 */
export function isFrozen(unit: Unit): boolean {
  return unit.statusEffects.some(e => e.type === 'freeze' || e.type === 'stun');
}

/**
 * Phase 2: Check if unit is immune to a specific status type
 */
export function isImmuneToStatus(unit: Unit, statusType: string): boolean {
  const immunities = unit.statusEffects.filter(s => s.type === 'immunity');

  // Check if any immunity grants "all" protection
  if (immunities.some(s => s.all)) {
    return true;
  }

  // Check if any immunity specifically lists this status type
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return immunities.some(s => s.types?.includes(statusType as any));
}

/**
 * Phase 2: Check if a status effect is negative (can be cleansed)
 * Negative statuses: poison, burn, freeze, paralyze, stun, debuffs
 * NOT negative: buffs, healOverTime, shields, resistance buffs
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isNegativeStatus(status: { type: string; [key: string]: any }): boolean {
  // Damage-over-time and action-preventing statuses
  if (['poison', 'burn', 'freeze', 'paralyze', 'stun'].includes(status.type)) {
    return true;
  }

  // Debuffs (negative stat modifiers)
  if (status.type === 'debuff') {
    return true;
  }

  return false;
}

/**
 * Phase 2: Apply a status to a unit (with immunity check)
 * This is the canonical way to add statuses; centralizes immunity logic
 */
export function applyStatusToUnit(
  unit: Unit,
  newStatus: typeof unit.statusEffects[number]
): Unit {
  // Check immunity (immunity statuses themselves always replace existing ones)
  if (newStatus.type !== 'immunity' && isImmuneToStatus(unit, newStatus.type)) {
    return unit; // No change
  }

  // Phase 2: Immunity replacement - if applying a new immunity, remove old immunities
  let updatedStatusEffects = unit.statusEffects;
  if (newStatus.type === 'immunity') {
    // Remove all existing immunity statuses (replacement behavior)
    updatedStatusEffects = unit.statusEffects.filter(s => s.type !== 'immunity');
  }

  // Add status to unit
  return {
    ...unit,
    statusEffects: [...updatedStatusEffects, newStatus],
  };
}

