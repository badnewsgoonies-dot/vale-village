/**
 * Damage calculation algorithms
 * Pure functions, deterministic with PRNG
 */

import type { Unit } from '../models/Unit';
import type { Team } from '../models/Team';
import type { Ability } from '../../data/schemas/AbilitySchema';
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
 * Calculate physical damage
 * From GAME_MECHANICS.md Section 5.2
 * Formula: basePower + effective ATK - (effective DEF × 0.5)
 * Always returns at least 1 damage
 * Uses effective stats (base + level + equipment + Djinn + status)
 */
export function calculatePhysicalDamage(
  attacker: Unit,
  defender: Unit,
  team: Team,
  ability: Ability
): number {
  const attackerEffective = calculateEffectiveStats(attacker, team);
  const defenderEffective = calculateEffectiveStats(defender, team);

  const baseDamage = ability.basePower > 0 ? ability.basePower : attackerEffective.atk;
  const attackPower = attackerEffective.atk;
  const defense = defenderEffective.def;

  const rawDamage = baseDamage + attackPower - (defense * BATTLE_CONSTANTS.DEFENSE_MULTIPLIER);
  const damage = Math.max(BATTLE_CONSTANTS.MINIMUM_DAMAGE, Math.floor(rawDamage));

  return damage;
}

/**
 * Calculate Psynergy (magic) damage
 * From GAME_MECHANICS.md Section 5.2
 * Formula: (basePower + effective MAG - (effective DEF × 0.3)) × elementModifier
 * Always returns at least 1 damage
 * Uses effective stats (base + level + equipment + Djinn + status)
 */
export function calculatePsynergyDamage(
  attacker: Unit,
  defender: Unit,
  team: Team,
  ability: Ability
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

  let rawDamage = (basePower + magicPower - magicDefense) * elementModifier;

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
 * Formula: basePower + effective MAG
 * Always returns at least 1 healing (if basePower > 0)
 * Uses effective MAG (base + level + equipment + Djinn + status)
 */
export function calculateHealAmount(
  caster: Unit,
  team: Team,
  ability: Ability
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

  const rawHeal = baseHeal + magicPower;
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
