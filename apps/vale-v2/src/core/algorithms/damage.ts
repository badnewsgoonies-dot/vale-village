/**
 * Damage calculation algorithms
 * Pure functions, deterministic with PRNG
 */

import type { Unit } from '../models/Unit';
import type { Ability } from '../../data/schemas/AbilitySchema';
import type { PRNG } from '../random/prng';
import type { Element } from '../models/types';
import { calculateMaxHp } from '../models/Unit';

/**
 * Element advantage triangle (from GAME_MECHANICS.md Section 5.2)
 * - Venus → Jupiter (Earth strong vs Wind)
 * - Mars → Venus (Fire strong vs Earth)
 * - Mercury → Mars (Water strong vs Fire)
 * - Jupiter → Mercury (Wind strong vs Water)
 */
const ELEMENT_ADVANTAGE: Record<string, number> = {
  'Venus→Jupiter': 1.5,
  'Mars→Venus': 1.5,
  'Mercury→Mars': 1.5,
  'Jupiter→Mercury': 1.5,
};

/**
 * Get element modifier for attack
 * Returns 1.5 for advantage, 0.67 for disadvantage, 1.0 for neutral
 */
export function getElementModifier(attackElement: Element, defenseElement: Element): number {
  const key = `${attackElement}→${defenseElement}`;
  if (ELEMENT_ADVANTAGE[key]) {
    return 1.5; // +50% damage
  }

  const reverseKey = `${defenseElement}→${attackElement}`;
  if (ELEMENT_ADVANTAGE[reverseKey]) {
    return 0.67; // -33% damage
  }

  return 1.0; // Neutral
}

/**
 * Get random damage multiplier (±10% variance)
 * From GAME_MECHANICS.md Section 5.2
 * Returns value in [0.9, 1.1)
 */
export function getRandomMultiplier(rng: PRNG): number {
  return 0.9 + (rng.next() * 0.2);
}

/**
 * Check for critical hit
 * From GAME_MECHANICS.md Section 6.2
 * Base 5% + sqrt(SPD) scaling (sublinear growth)
 * Capped at 35% to prevent crit explosion at high SPD
 * Critical hits deal 2.0x damage
 */
export function checkCriticalHit(attacker: Unit, rng: PRNG): boolean {
  const BASE_CRIT_CHANCE = 0.05; // 5%
  const spdBonus = Math.sqrt(attacker.baseStats.spd) / 200; // ~0.07 at SPD=200
  
  const totalChance = Math.min(BASE_CRIT_CHANCE + spdBonus, 0.35); // Hard cap at 35%

  return rng.next() < totalChance;
}

/**
 * Check if defender dodges attacker's ability
 * From GAME_MECHANICS.md Section 5.1.4
 * Separates accuracy (ability property) from evasion (defender property)
 * Multiplicative combination with hard cap evasion at 40%
 * Minimum hit chance floor of 5%
 */
export function checkDodge(
  attacker: Unit,
  defender: Unit,
  abilityAccuracy: number = 0.95, // Default 95% accuracy
  rng: PRNG
): boolean {
  const BASE_EVASION = 0.05; // 5% base
  const equipmentEvasion = defender.equipment.boots?.evasion || 0;
  const speedBonus = (defender.baseStats.spd - attacker.baseStats.spd) * 0.01; // 1% per SPD point
  
  // Hard cap evasion at 40%
  const evasion = Math.min(0.40, BASE_EVASION + (equipmentEvasion / 100) + speedBonus);
  
  // Multiplicative: hitChance = accuracy * (1 - evasion)
  // Clamp between 5% and 95%
  const hitChance = Math.max(0.05, Math.min(0.95, abilityAccuracy * (1 - evasion)));
  
  return rng.next() >= hitChance; // Returns true if dodged (missed)
}

/**
 * Calculate physical damage
 * From GAME_MECHANICS.md Section 5.2
 * Formula: (basePower + ATK - (DEF × 0.5)) × randomMultiplier
 * Always returns at least 1 damage
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

  const rawDamage = (baseDamage + attackPower - (defense * 0.5)) * getRandomMultiplier(rng);
  const damage = Math.max(1, Math.floor(rawDamage)); // Floor at 1

  return damage;
}

/**
 * Calculate Psynergy (magic) damage
 * From GAME_MECHANICS.md Section 5.2
 * Formula: (basePower + MAG - (DEF × 0.3)) × elementModifier × randomMultiplier
 * Always returns at least 1 damage
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

  let rawDamage = (basePower + magicPower - magicDefense) * elementModifier * getRandomMultiplier(rng);

  // Apply elemental resist from armor (e.g., Dragon Scales)
  const resist = defender.equipment.armor?.elementalResist || 0;
  if (ability.element && resist > 0) {
    rawDamage = rawDamage * (1 - resist);
  }

  const damage = Math.max(1, Math.floor(rawDamage)); // Floor at 1

  return damage;
}

/**
 * Calculate healing amount
 * From GAME_MECHANICS.md Section 5.2
 * Formula: (basePower + MAG) × randomMultiplier
 * Always returns at least 1 healing (if basePower > 0)
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

  if (baseHeal === 0) {
    return 0; // No healing if base power is 0
  }

  const magicPower = caster.baseStats.mag;

  const rawHeal = (baseHeal + magicPower) * getRandomMultiplier(rng);
  const healAmount = Math.max(1, Math.floor(rawHeal)); // Floor at 1 if healing

  return healAmount;
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
 * Never exceeds max HP
 */
export function applyHealing(unit: Unit, healing: number): Unit {
  const maxHp = calculateMaxHp(unit);
  const newHp = Math.min(maxHp, Math.max(0, unit.currentHp + healing)); // Clamp to [0, maxHp]
  
  return {
    ...unit,
    currentHp: newHp,
  };
}
