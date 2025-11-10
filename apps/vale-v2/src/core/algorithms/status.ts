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
 * Poison: 8% max HP damage per turn
 * Burn: 10% max HP damage per turn
 * Freeze: Skip turn, 30% break chance per turn
 * Paralyze: Checked separately before action execution
 */
export function processStatusEffectTick(
  unit: Unit,
  rng: PRNG
): { updatedUnit: Unit; damage: number; messages: readonly string[] } {
  let totalDamage = 0;
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
    } else if (effect.type === 'freeze') {
      const breakChance = 0.3; // 30% chance to break free
      if (rng.next() < breakChance) {
        messages.push(`${unit.name} broke free from freeze!`);
        return { ...effect, duration: 0 }; // Mark for removal
      } else {
        messages.push(`${unit.name} is frozen and cannot act!`);
        return { ...effect, duration: effect.duration - 1 };
      }
    }
    // Buff/debuff/paralyze just decrement duration
    return { ...effect, duration: effect.duration - 1 };
  }).filter(effect => effect.duration > 0);

  const damagedUnit = totalDamage > 0
    ? applyDamage(unit, totalDamage)
    : unit;

  const updatedUnit: Unit = {
    ...damagedUnit,
    statusEffects: updatedStatusEffects,
  };

  return {
    updatedUnit,
    damage: totalDamage,
    messages,
  };
}

/**
 * Check if unit's action fails due to paralyze
 * From GAME_MECHANICS.md Section 5.3
 * Paralyze: 50% chance action fails
 */
export function checkParalyzeFailure(
  unit: Unit,
  rng: PRNG
): boolean {
  const paralyzed = unit.statusEffects.find(e => e.type === 'paralyze');
  if (paralyzed && rng.next() < 0.5) {
    return true; // Action fails (50% chance)
  }
  return false;
}

/**
 * Check if unit is frozen (cannot act)
 */
export function isFrozen(unit: Unit): boolean {
  return unit.statusEffects.some(e => e.type === 'freeze');
}

