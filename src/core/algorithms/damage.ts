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
 * Phase 2: Apply damage modifiers from status effects
 * - Elemental resistance/weakness (from status effects)
 * - Damage reduction (global, from status effects)
 *
 * Applied AFTER elemental advantage but BEFORE minimum damage clamping
 *
 * @param baseDamage - Damage before modifiers
 * @param abilityElement - Element of the attack (undefined for physical/neutral)
 * @param defender - Target unit with status effects
 * @returns Modified damage
 */
export function applyDamageModifiers(
  baseDamage: number,
  abilityElement: Element | undefined,
  defender: Unit
): number {
  let modifiedDamage = baseDamage;

  // 1. Apply elemental resistance/weakness from status effects
  if (abilityElement && abilityElement !== 'Neutral') {
    const resistanceEffects = defender.statusEffects.filter(
      effect => effect.type === 'elementalResistance' && effect.element === abilityElement
    ) as Array<Extract<typeof defender.statusEffects[number], { type: 'elementalResistance' }>>;

    const resistanceModifiers = resistanceEffects.map(effect => effect.modifier);

    const totalResistModifier = resistanceModifiers.reduce((sum, mod) => sum + mod, 0);

    // Convention: factor = 1 - modifier
    // modifier > 0 = resistance (reduces damage)
    // modifier < 0 = weakness (increases damage)
    // Example: 0.4 resist → factor 0.6 → damage × 0.6
    // Example: -0.2 weakness → factor 1.2 → damage × 1.2
    const resistanceFactor = 1 - totalResistModifier;
    modifiedDamage *= resistanceFactor;
  }

  // 2. Apply damage reduction from status effects
  const damageReductionEffects = defender.statusEffects.filter(
    effect => effect.type === 'damageReduction'
  ) as Array<Extract<typeof defender.statusEffects[number], { type: 'damageReduction' }>>;

  const damageReductionPercents = damageReductionEffects.map(effect => effect.percent);

  const totalDamageReduction = damageReductionPercents.reduce((sum, pct) => sum + pct, 0);
  // Clamp to [0, 1] to prevent negative damage or > 100% reduction
  const clampedReduction = Math.min(1, Math.max(0, totalDamageReduction));

  // Damage reduction: reduce by percentage (e.g., 0.3 = 30% reduction → × 0.7)
  modifiedDamage *= (1 - clampedReduction);

  return modifiedDamage;
}

/**
 * Calculate physical damage
 * From GAME_MECHANICS.md Section 5.2
 * Formula: basePower + effective ATK - (effective DEF × 0.5)
 * Always returns at least 1 damage
 * Uses effective stats (base + level + equipment + Djinn + status)
 *
 * Phase 2: Supports ignore defense percentage
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

  // Phase 2: Apply ignore defense percentage (clamp to [0, 1] for safety)
  const ignoreDefensePercent = Math.min(1, Math.max(0, ability.ignoreDefensePercent || 0));
  const effectiveDefense = defenderEffective.def * (1 - ignoreDefensePercent);

  const rawDamage = baseDamage + attackPower - (effectiveDefense * BATTLE_CONSTANTS.DEFENSE_MULTIPLIER);

  // Phase 2: Apply damage modifiers from status effects (elemental resist, damage reduction)
  const modifiedDamage = applyDamageModifiers(rawDamage, ability.element, defender);

  const damage = Math.max(BATTLE_CONSTANTS.MINIMUM_DAMAGE, Math.floor(modifiedDamage));

  return damage;
}

/**
 * Calculate Psynergy (magic) damage
 * From GAME_MECHANICS.md Section 5.2
 * Formula: (basePower + effective MAG - (effective DEF × 0.3)) × elementModifier
 * Always returns at least 1 damage
 * Uses effective stats (base + level + equipment + Djinn + status)
 *
 * Phase 2: Supports ignore defense percentage, applies damage modifiers from status effects
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

  // Phase 2: Apply ignore defense percentage (clamp to [0, 1] for safety)
  const ignoreDefensePercent = Math.min(1, Math.max(0, ability.ignoreDefensePercent || 0));
  const effectiveDefense = defenderEffective.def * (1 - ignoreDefensePercent);
  const magicDefense = effectiveDefense * BATTLE_CONSTANTS.PSYNERGY_DEFENSE_MULTIPLIER;

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

  // Phase 2: Apply damage modifiers from status effects (elemental resist, damage reduction)
  const modifiedDamage = applyDamageModifiers(rawDamage, ability.element, defender);

  const damage = Math.max(BATTLE_CONSTANTS.MINIMUM_DAMAGE, Math.floor(modifiedDamage));

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
 * Phase 2: Check if unit is invulnerable (blocks ALL damage)
 */
export function isInvulnerable(unit: Unit): boolean {
  return unit.statusEffects.some(effect => effect.type === 'invulnerable');
}

/**
 * Phase 2: Check if unit has active shield charges
 */
export function hasShieldCharges(unit: Unit): boolean {
  return unit.statusEffects.some(
    effect => effect.type === 'shield' && effect.remainingCharges > 0
  );
}

/**
 * Phase 2: Consume one shield charge from unit
 * Returns updated unit with ONE shield charge consumed (from first available shield)
 * Removes shield status if charges reach 0
 */
export function consumeShieldCharge(unit: Unit): Unit {
  let chargeConsumed = false;

  const updatedStatusEffects = unit.statusEffects
    .map(effect => {
      // Only consume from the FIRST shield with charges remaining
      if (effect.type === 'shield' && effect.remainingCharges > 0 && !chargeConsumed) {
        chargeConsumed = true;
        return { ...effect, remainingCharges: effect.remainingCharges - 1 };
      }
      return effect;
    })
    .filter(effect => {
      // Remove shield if charges depleted OR already at 0 (cleanup)
      return !(effect.type === 'shield' && effect.remainingCharges === 0);
    });

  return {
    ...unit,
    statusEffects: updatedStatusEffects,
  };
}

/**
 * Apply damage to unit (returns new unit with updated HP)
 * Clamps HP to [0, maxHp]
 *
 * Phase 2: Supports invulnerability and shield blocking
 * NOTE: Shield/invuln logic should be checked BEFORE calling this function
 * This function always applies the damage amount passed to it
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
 * Phase 2: Apply damage with shield/invulnerability checks and auto-revive
 * This is the main entry point for damage application in battle
 *
 * Ordering:
 * 1. Check invulnerability (blocks damage, does NOT consume shield)
 * 2. Check shield (blocks damage, consumes 1 charge)
 * 3. Apply damage if not blocked
 * 4. Check for auto-revive if unit is KO'd
 *
 * @returns Object with updated unit, actual damage dealt (0 if blocked), and whether auto-revive triggered
 */
export function applyDamageWithShields(
  unit: Unit,
  damage: number
): { updatedUnit: Unit; actualDamage: number; autoRevived?: boolean } {
  // 0. Zero damage doesn't consume shields or trigger any mechanics
  if (damage <= 0) {
    return { updatedUnit: unit, actualDamage: 0 };
  }

  // 1. Invulnerability blocks all damage (no shield consumption)
  if (isInvulnerable(unit)) {
    return { updatedUnit: unit, actualDamage: 0 };
  }

  // 2. Shield blocks damage and consumes 1 charge
  if (hasShieldCharges(unit)) {
    const updatedUnit = consumeShieldCharge(unit);
    return { updatedUnit, actualDamage: 0 };
  }

  // 3. No blocking - apply damage normally
  let updatedUnit = applyDamage(unit, damage);

  // Clean up any shields with 0 charges
  updatedUnit = {
    ...updatedUnit,
    statusEffects: updatedUnit.statusEffects.filter(
      effect => !(effect.type === 'shield' && effect.remainingCharges === 0)
    ),
  };

  // 4. Check for auto-revive if unit is KO'd
  const { updatedUnit: finalUnit, revived } = checkAutoRevive(updatedUnit);

  return revived
    ? { updatedUnit: finalUnit, actualDamage: damage, autoRevived: true }
    : { updatedUnit: finalUnit, actualDamage: damage };
}

/**
 * Phase 2: Check for and trigger auto-revive if unit is KO'd
 * Returns updated unit with auto-revive triggered (if applicable)
 *
 * @param unit - Unit to check for auto-revive
 * @returns Object with updated unit and whether auto-revive was triggered
 */
export function checkAutoRevive(unit: Unit): { updatedUnit: Unit; revived: boolean } {
  // Only trigger if unit is KO'd
  if (unit.currentHp > 0) {
    // Clean up exhausted auto-revive statuses even if unit isn't KO'd
    const hasExhaustedAutoRevive = unit.statusEffects.some(
      effect => effect.type === 'autoRevive' && effect.usesRemaining === 0
    );
    if (hasExhaustedAutoRevive) {
      const cleanedStatusEffects = unit.statusEffects.filter(
        effect => !(effect.type === 'autoRevive' && effect.usesRemaining === 0)
      );
      return { updatedUnit: { ...unit, statusEffects: cleanedStatusEffects }, revived: false };
    }
    return { updatedUnit: unit, revived: false };
  }

  // Find auto-revive status with uses remaining
  const autoReviveEffects = unit.statusEffects.filter(
    effect => effect.type === 'autoRevive' && effect.usesRemaining > 0
  ) as Array<Extract<typeof unit.statusEffects[number], { type: 'autoRevive' }>>;

  const autoReviveStatus = autoReviveEffects[0];

  if (!autoReviveStatus) {
    // Clean up exhausted auto-revive statuses even if none can trigger
    const hasExhaustedAutoRevive = unit.statusEffects.some(
      effect => effect.type === 'autoRevive' && effect.usesRemaining === 0
    );
    if (hasExhaustedAutoRevive) {
      const cleanedStatusEffects = unit.statusEffects.filter(
        effect => !(effect.type === 'autoRevive' && effect.usesRemaining === 0)
      );
      return { updatedUnit: { ...unit, statusEffects: cleanedStatusEffects }, revived: false };
    }
    return { updatedUnit: unit, revived: false };
  }

  // Calculate revive HP
  const maxHp = calculateMaxHp(unit);
  const reviveHp = Math.floor(maxHp * autoReviveStatus.hpPercent);

  // Decrement uses only for the first auto-revive status that triggered
  // Other auto-revive statuses remain unchanged
  let foundFirst = false;
  const updatedStatusEffects = unit.statusEffects
    .map(effect => {
      // Only decrement the first auto-revive status with uses remaining
      if (effect.type === 'autoRevive' && effect.usesRemaining > 0 && !foundFirst) {
        foundFirst = true;
        return { ...effect, usesRemaining: effect.usesRemaining - 1 };
      }
      return effect;
    })
    .filter(effect => {
      // Remove auto-revive if uses depleted (only the one we decremented)
      return !(effect.type === 'autoRevive' && effect.usesRemaining === 0);
    });

  const revivedUnit: Unit = {
    ...unit,
    currentHp: reviveHp,
    statusEffects: updatedStatusEffects,
  };

  return { updatedUnit: revivedUnit, revived: true };
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
