/**
 * Damage calculation algorithms
 * Pure functions, deterministic with PRNG
 */

import type { Unit } from '../models/Unit';
import type { Team } from '../models/Team';
import type { Ability } from '../../data/schemas/AbilitySchema';
import type { PRNG } from '../random/prng';
import type { Element } from '../models/types';
import { calculateMaxHp, isUnitKO } from '../models/Unit';
import { calculateEffectiveStats } from './stats';
import { BATTLE_CONSTANTS } from '../constants';

/**
 * Element advantage triangle (from GAME_MECHANICS.md Section 5.2)
 * - Venus → Jupiter (Earth strong vs Wind)
 * - Mars → Venus (Fire strong vs Earth)
 * - Mercury → Mars (Water strong vs Fire)
 * - Jupiter → Mercury (Wind strong vs Water)
 */
const ELEMENT_ADVANTAGE: Record<string, boolean> = {
  'Venus→Jupiter': true,
  'Mars→Venus': true,
  'Mercury→Mars': true,
  'Jupiter→Mercury': true,
};

/**
 * Get element modifier for attack
 * Returns 1.5 for advantage, 0.67 for disadvantage, 1.0 for neutral
 */
export function getElementModifier(attackElement: Element, defenseElement: Element): number {
  const key = `${attackElement}→${defenseElement}`;
  if (ELEMENT_ADVANTAGE[key]) {
    return BATTLE_CONSTANTS.ELEMENT_ADVANTAGE_MULTIPLIER; // +50% damage
  }

  const reverseKey = `${defenseElement}→${attackElement}`;
  if (ELEMENT_ADVANTAGE[reverseKey]) {
    return BATTLE_CONSTANTS.ELEMENT_DISADVANTAGE_MULTIPLIER; // -33% damage
  }

  return 1.0; // Neutral
}

/**
 * Get random damage multiplier (±10% variance)
 * From GAME_MECHANICS.md Section 5.2
 * Returns value in [0.9, 1.1)
 */
export function getRandomMultiplier(rng: PRNG): number {
  return BATTLE_CONSTANTS.DAMAGE_VARIANCE_MIN + (rng.next() * BATTLE_CONSTANTS.DAMAGE_VARIANCE_RANGE);
}

/**
 * Check for critical hit
 * From GAME_MECHANICS.md Section 6.2
 * Base 5% + sqrt(effective SPD) scaling (sublinear growth)
 * Capped at 35% to prevent crit explosion at high SPD
 * Critical hits deal 2.0x damage
 * Uses effective SPD (base + level + equipment + Djinn + status)
 */
export function checkCriticalHit(attacker: Unit, team: Team, rng: PRNG): boolean {
  const effectiveStats = calculateEffectiveStats(attacker, team);
  const spdBonus = Math.sqrt(effectiveStats.spd) / BATTLE_CONSTANTS.CRIT_SPD_SCALING; // ~0.07 at SPD=200

  const totalChance = Math.min(
    BATTLE_CONSTANTS.BASE_CRIT_CHANCE + spdBonus,
    BATTLE_CONSTANTS.MAX_CRIT_CHANCE
  ); // Hard cap at 35%

  return rng.next() < totalChance;
}

/**
 * Check if defender dodges attacker's ability
 * From GAME_MECHANICS.md Section 5.1.4
 * Separates accuracy (ability property) from evasion (defender property)
 * Multiplicative combination with hard cap evasion at 40%
 * Minimum hit chance floor of 5%
 * Uses effective stats for both attacker and defender
 */
export function checkDodge(
  attacker: Unit,
  defender: Unit,
  team: Team,
  abilityAccuracy: number = BATTLE_CONSTANTS.DEFAULT_ABILITY_ACCURACY,
  rng: PRNG
): boolean {
  const attackerEffective = calculateEffectiveStats(attacker, team);
  const defenderEffective = calculateEffectiveStats(defender, team);

  const equipmentEvasion = defender.equipment.boots?.evasion || 0;
  const speedBonus = (defenderEffective.spd - attackerEffective.spd) * BATTLE_CONSTANTS.SPD_TO_EVASION_RATE;

  // Hard cap evasion at 40%
  const evasion = Math.min(
    BATTLE_CONSTANTS.MAX_EVASION,
    BATTLE_CONSTANTS.BASE_EVASION + (equipmentEvasion / 100) + speedBonus
  );

  // Multiplicative: hitChance = accuracy * (1 - evasion)
  // Clamp between 5% and 95%
  const hitChance = Math.max(
    BATTLE_CONSTANTS.MIN_HIT_CHANCE,
    Math.min(BATTLE_CONSTANTS.MAX_HIT_CHANCE, abilityAccuracy * (1 - evasion))
  );

  return rng.next() >= hitChance; // Returns true if dodged (missed)
}

/**
 * Calculate physical damage
 * From GAME_MECHANICS.md Section 5.2
 * Formula: (basePower + effective ATK - (effective DEF × 0.5)) × randomMultiplier
 * Always returns at least 1 damage
 * Uses effective stats (base + level + equipment + Djinn + status)
 */
export function calculatePhysicalDamage(
  attacker: Unit,
  defender: Unit,
  team: Team,
  ability: Ability,
  rng: PRNG
): number {
  const attackerEffective = calculateEffectiveStats(attacker, team);
  const defenderEffective = calculateEffectiveStats(defender, team);

  const baseDamage = ability.basePower > 0 ? ability.basePower : attackerEffective.atk;
  const attackPower = attackerEffective.atk;
  const defense = defenderEffective.def;

  const rawDamage = (baseDamage + attackPower - (defense * BATTLE_CONSTANTS.DEFENSE_MULTIPLIER)) * getRandomMultiplier(rng);
  const damage = Math.max(BATTLE_CONSTANTS.MINIMUM_DAMAGE, Math.floor(rawDamage));

  return damage;
}

/**
 * Calculate Psynergy (magic) damage
 * From GAME_MECHANICS.md Section 5.2
 * Formula: (basePower + effective MAG - (effective DEF × 0.3)) × elementModifier × randomMultiplier
 * Always returns at least 1 damage
 * Uses effective stats (base + level + equipment + Djinn + status)
 */
export function calculatePsynergyDamage(
  attacker: Unit,
  defender: Unit,
  team: Team,
  ability: Ability,
  rng: PRNG
): number {
  const attackerEffective = calculateEffectiveStats(attacker, team);
  const defenderEffective = calculateEffectiveStats(defender, team);

  const basePower = ability.basePower || 0;
  const magicPower = attackerEffective.mag;
  const magicDefense = defenderEffective.def * BATTLE_CONSTANTS.PSYNERGY_DEFENSE_MULTIPLIER;

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

  const damage = Math.max(BATTLE_CONSTANTS.MINIMUM_DAMAGE, Math.floor(rawDamage));

  return damage;
}

/**
 * Calculate healing amount
 * From GAME_MECHANICS.md Section 5.2
 * Formula: (basePower + effective MAG) × randomMultiplier
 * Always returns at least 1 healing (if basePower > 0)
 * Uses effective MAG (base + level + equipment + Djinn + status)
 */
export function calculateHealAmount(
  caster: Unit,
  team: Team,
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

  const casterEffective = calculateEffectiveStats(caster, team);
  const magicPower = casterEffective.mag;

  const rawHeal = (baseHeal + magicPower) * getRandomMultiplier(rng);
  const healAmount = Math.max(BATTLE_CONSTANTS.MINIMUM_HEALING, Math.floor(rawHeal));

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
 * 
 * @param unit - Unit to heal
 * @param healing - Amount to heal (must be non-negative)
 * @param abilityRevivesFallen - Whether the ability can revive fallen units (default: false)
 * @returns New unit with updated HP, or throws error if invalid
 * @throws Error if healing is negative or unit is KO'd without revivesFallen
 */
export function applyHealing(unit: Unit, healing: number, abilityRevivesFallen: boolean = false): Unit {
  // Validate healing amount is non-negative
  if (healing < 0) {
    throw new Error(`Cannot apply negative healing: ${healing}`);
  }

  // Check if unit is KO'd and ability cannot revive
  if (isUnitKO(unit) && !abilityRevivesFallen) {
    throw new Error(`Cannot heal KO'd unit without revivesFallen ability`);
  }

  const maxHp = calculateMaxHp(unit);
  const newHp = Math.min(maxHp, Math.max(0, unit.currentHp + healing)); // Clamp to [0, maxHp]
  
  return {
    ...unit,
    currentHp: newHp,
  };
}
