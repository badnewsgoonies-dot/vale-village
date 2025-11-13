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
 * Note: Freeze, Stun, Blind, and Paralyze are checked separately before action execution
 * (freeze/stun in isFrozen(), paralyze in checkParalyzeFailure(), blind in damage calculation)
 *
 * Poison: 8% max HP damage per turn
 * Burn: 10% max HP damage per turn
 * HealOverTime: Fixed HP heal per turn (specified in effect)
 * Freeze: Skip turn, 30% break chance per turn (checked in isFrozen())
 * Stun: Skip turn completely
 * Blind: Reduces hit chance (checked in damage calculation)
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
    } else if (effect.type === 'blind') {
      // Blind just decrements - effect is handled in damage calculation
      return { ...effect, duration: effect.duration - 1 };
    }
    // Buff/debuff/paralyze just decrement duration
    return { ...effect, duration: effect.duration - 1 };
  }).filter(effect => effect.duration > 0);

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
  const paralyzed = unit.statusEffects.find(e => e.type === 'paralyze');
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
 * Check if unit is blinded (reduced hit chance)
 */
export function isBlind(unit: Unit): boolean {
  return unit.statusEffects.some(e => e.type === 'blind');
}

