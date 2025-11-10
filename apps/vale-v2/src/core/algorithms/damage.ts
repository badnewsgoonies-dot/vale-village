/**
 * Damage calculation algorithms
 * Pure functions, deterministic with PRNG
 */

import type { Unit } from '../models/Unit';
import type { Ability } from '../../data/schemas/AbilitySchema';
import type { PRNG } from '../random/prng';
import { getElementModifier } from './element';
import { calculateMaxHp } from '../models/Unit';

/**
 * Get random damage multiplier (±10% variance)
 * From GAME_MECHANICS.md Section 5.2
 * Returns value in [0.9, 1.1)
 */
export function getRandomMultiplier(rng: PRNG): number {
  return 0.9 + (rng.next() * 0.2);
}

/**
 * Calculate physical damage
 * From GAME_MECHANICS.md Section 5.2
 * Formula: (basePower + ATK - (DEF × 0.5)) × randomMultiplier
 */
export function calculatePhysicalDamage(
  attacker: Unit,
  defender: Unit,
  ability: Ability,
  rng: PRNG
): number {
  const baseDamage = ability.basePower > 0 ? ability.basePower : attacker.baseStats.atk;
  const attackPower = attacker.baseStats.atk;
  const defense = defender.baseStats.def;

  const damage = Math.floor(
    (baseDamage + attackPower - (defense * 0.5)) * getRandomMultiplier(rng)
  );

  return Math.max(1, damage);
}

/**
 * Calculate Psynergy (magic) damage
 * From GAME_MECHANICS.md Section 5.2
 * Formula: (basePower + MAG - (DEF × 0.3)) × elementModifier × randomMultiplier
 */
export function calculatePsynergyDamage(
  attacker: Unit,
  defender: Unit,
  ability: Ability,
  rng: PRNG
): number {
  const basePower = ability.basePower || 0;
  const magicPower = attacker.baseStats.mag;
  const magicDefense = defender.baseStats.def * 0.3;

  // Element advantage/disadvantage (1.5x / 0.67x / 1.0x)
  const elementModifier = ability.element
    ? getElementModifier(ability.element, defender.element)
    : 1.0;

  let damage = Math.floor(
    (basePower + magicPower - magicDefense) * elementModifier * getRandomMultiplier(rng)
  );

  // Apply elemental resist from armor (e.g., Dragon Scales)
  const resist = defender.equipment.armor?.elementalResist || 0;
  if (ability.element && resist > 0) {
    damage = Math.floor(damage * (1 - resist));
  }

  return Math.max(1, damage);
}

/**
 * Calculate healing amount
 * From GAME_MECHANICS.md Section 5.2
 * Formula: (basePower + MAG) × randomMultiplier
 */
export function calculateHealAmount(
  caster: Unit,
  ability: Ability,
  rng: PRNG
): number {
  const baseHeal = ability.basePower || 0;

  // Validate healing abilities have non-negative power
  if (baseHeal < 0) {
    return 0; // Clamp to 0
  }

  const magicPower = caster.baseStats.mag;

  const healAmount = Math.floor(
    (baseHeal + magicPower) * getRandomMultiplier(rng)
  );

  // Always clamp final result to minimum 0
  return Math.max(0, healAmount);
}

/**
 * Apply damage to unit (returns new unit with updated HP)
 * Clamps HP to [0, maxHp]
 */
export function applyDamage(unit: Unit, damage: number): Unit {
  const maxHp = calculateMaxHp(unit);
  const newHp = Math.max(0, Math.min(maxHp, unit.currentHp - damage));
  
  return {
    ...unit,
    currentHp: newHp,
    battleStats: {
      ...unit.battleStats,
      damageTaken: unit.battleStats.damageTaken + damage,
    },
  };
}

/**
 * Apply healing to unit (returns new unit with updated HP)
 * Clamps HP to [0, maxHp]
 */
export function applyHealing(unit: Unit, healing: number): Unit {
  const maxHp = calculateMaxHp(unit);
  const newHp = Math.max(0, Math.min(maxHp, unit.currentHp + healing));
  
  return {
    ...unit,
    currentHp: newHp,
  };
}

