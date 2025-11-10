/**
 * Battle service
 * Coordinates battle algorithms and state management
 * Pure functions, deterministic with PRNG
 */

import type { Unit } from '../models/Unit';
import type { Ability } from '../../data/schemas/AbilitySchema';
import type { PRNG } from '../random/prng';
import {
  calculatePhysicalDamage,
  calculatePsynergyDamage,
  calculateHealAmount,
  applyDamage,
  applyHealing,
} from '../algorithms/damage';
import {
  checkCriticalHit,
  checkDodge,
} from '../algorithms/battle';
import { isUnitKO } from '../models/Unit';

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
 * Execute an ability in battle
 * Handles damage, healing, buffs, and debuffs
 * Returns updated units and action result
 */
export function executeAbility(
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
        // Check for dodge BEFORE calculating damage
        const dodged = checkDodge(caster, target, rng);
        
        if (dodged) {
          anyDodged = true;
          // Keep original target in updatedUnits (no change)
          const existingUnit = allUnits.find(u => u.id === target.id);
          if (existingUnit) {
            updatedUnits.push(existingUnit);
          }
          continue;
        }

        let damage = ability.type === 'physical'
          ? calculatePhysicalDamage(caster, target, ability, rng)
          : calculatePsynergyDamage(caster, target, ability, rng);

        // Apply critical hit multiplier
        if (isCritical) {
          damage = Math.floor(damage * 2.0);
        }

        const damagedUnit = applyDamage(target, damage);
        updatedUnits.push(damagedUnit);
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

      // Merge updated units with unchanged units
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
        // Handle revival separately
        if (ability.revivesFallen && isUnitKO(target)) {
          const maxHp = target.baseStats.hp + (target.level - 1) * target.growthRates.hp;
          const revivedUnit: Unit = {
            ...target,
            currentHp: Math.floor(maxHp * 0.5), // 50% HP on revival
          };
          updatedUnits.push(revivedUnit);
          totalHealing += revivedUnit.currentHp;
        } else if (!isUnitKO(target)) {
          // Normal healing (only works on alive units)
          const healAmount = calculateHealAmount(caster, ability, rng);
          const healedUnit = applyHealing(target, healAmount);
          updatedUnits.push(healedUnit);
          totalHealing += healedUnit.currentHp - target.currentHp;
        } else {
          // KO'd unit, no healing
          updatedUnits.push(target);
        }
      }

      message += ` Restores ${totalHealing} HP!`;

      // Merge updated units with unchanged units
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
      // Apply status effects to targets
      for (const target of targets) {
        if (ability.buffEffect) {
          const statusEffects = [...target.statusEffects];
          
          // Add status effect for each stat modifier
          const validStats: Array<keyof typeof target.baseStats> = ['hp', 'pp', 'atk', 'def', 'mag', 'spd'];
          for (const [stat, modifier] of Object.entries(ability.buffEffect)) {
            if (typeof modifier === 'number' && validStats.includes(stat as keyof typeof target.baseStats)) {
              statusEffects.push({
                type: ability.type === 'buff' ? 'buff' : 'debuff',
                stat: stat as keyof typeof target.baseStats,
                modifier,
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

      // Merge updated units with unchanged units
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
 * Process status effect tick at start of unit's turn
 * From GAME_MECHANICS.md Section 5.3
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

