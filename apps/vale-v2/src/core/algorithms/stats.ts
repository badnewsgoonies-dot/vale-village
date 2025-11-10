/**
 * Effective Stats Pipeline
 * PR-STATS-EFFECTIVE: Calculate effective stats combining base + level + equipment + Djinn + status
 * 
 * All functions are pure and deterministic (no RNG, no side effects)
 */

import type { Unit } from '../models/Unit';
import type { Team } from '../models/Team';
import type { Stats } from '../models/types';
import type { EquipmentLoadout } from '../models/Equipment';
import { calculateEquipmentBonuses } from '../models/Equipment';
import { calculateDjinnSynergy } from './djinn';

/**
 * Calculate level-based stat bonuses
 * Stats increase by growthRates per level above 1
 * 
 * @param unit - Unit to calculate bonuses for
 * @returns Partial stats with level bonuses
 */
export function calculateLevelBonuses(unit: Unit): Partial<Stats> {
  const levelBonus = unit.level - 1; // Level 1 = 0 bonus, Level 20 = 19 bonuses
  
  return {
    hp: levelBonus * unit.growthRates.hp,
    pp: levelBonus * unit.growthRates.pp,
    atk: levelBonus * unit.growthRates.atk,
    def: levelBonus * unit.growthRates.def,
    mag: levelBonus * unit.growthRates.mag,
    spd: levelBonus * unit.growthRates.spd,
  };
}

/**
 * Calculate equipment stat bonuses
 * Reuses existing function from Equipment.ts
 * 
 * @param loadout - Equipment loadout
 * @returns Partial stats with equipment bonuses
 */
export function calculateEquipmentBonusesFromLoadout(loadout: EquipmentLoadout): Partial<Stats> {
  return calculateEquipmentBonuses(loadout);
}

/**
 * Simple Djinn element lookup by ID
 * Maps common Djinn IDs to their elements
 * TODO: Replace with proper Djinn registry when available
 */
function getDjinnElement(djinnId: string): 'Venus' | 'Mars' | 'Mercury' | 'Jupiter' | null {
  // Venus Djinn
  if (djinnId.includes('flint') || djinnId.includes('granite') || djinnId.includes('bane')) {
    return 'Venus';
  }
  // Mars Djinn
  if (djinnId.includes('forge') || djinnId.includes('corona') || djinnId.includes('fury')) {
    return 'Mars';
  }
  // Mercury Djinn
  if (djinnId.includes('fizz') || djinnId.includes('tonic') || djinnId.includes('crystal')) {
    return 'Mercury';
  }
  // Jupiter Djinn
  if (djinnId.includes('breeze') || djinnId.includes('squall') || djinnId.includes('storm')) {
    return 'Jupiter';
  }
  return null;
}

/**
 * Calculate Djinn synergy bonuses
 * Only applies when Djinn state is 'Set'
 * Computed once per team (team-wide bonuses)
 * 
 * @param team - Team with Djinn trackers
 * @returns Partial stats with Djinn bonuses
 */
export function calculateDjinnBonuses(team: Team): Partial<Stats> {
  // Get all Set Djinn elements
  const setDjinnElements: Array<'Venus' | 'Mars' | 'Mercury' | 'Jupiter'> = [];
  
  for (const djinnId of team.equippedDjinn) {
    const tracker = team.djinnTrackers[djinnId];
    if (tracker && tracker.state === 'Set') {
      const element = getDjinnElement(djinnId);
      if (element) {
        setDjinnElements.push(element);
      }
    }
  }
  
  // If no Set Djinn, return empty bonuses
  if (setDjinnElements.length === 0) {
    return {};
  }
  
  // Calculate synergy
  const synergy = calculateDjinnSynergy(setDjinnElements);
  
  return {
    atk: synergy.atk,
    def: synergy.def,
    spd: synergy.spd,
  };
}

/**
 * Calculate status effect stat modifiers
 * Sums all buff/debuff stat deltas
 * Clamps to prevent negative stats
 * 
 * @param unit - Unit with status effects
 * @returns Partial stats with status modifiers
 */
export function calculateStatusModifiers(unit: Unit): Partial<Stats> {
  const modifiers: Partial<Stats> = {};
  
  for (const status of unit.statusEffects) {
    if (status.type === 'buff' || status.type === 'debuff') {
      const statKey = status.stat;
      const modifier = status.modifier;
      
      // Only process if stat and modifier are defined
      if (statKey && modifier !== undefined) {
        // Sum modifiers (buffs are positive, debuffs are negative)
        const current = modifiers[statKey] ?? 0;
        modifiers[statKey] = current + modifier;
      }
    }
  }
  
  return modifiers;
}

/**
 * Calculate effective stats for a unit
 * Combines: base + level + equipment + Djinn + status
 * Rounds to integers to avoid floating-point differences
 * 
 * @param unit - Unit to calculate effective stats for
 * @param team - Team (for Djinn bonuses)
 * @returns Complete effective stats
 */
export function calculateEffectiveStats(unit: Unit, team: Team): Stats {
  const base = unit.baseStats;
  const level = calculateLevelBonuses(unit);
  const equipment = calculateEquipmentBonusesFromLoadout(unit.equipment);
  const djinn = calculateDjinnBonuses(team);
  const status = calculateStatusModifiers(unit);
  
  // Combine all bonuses
  const effective: Stats = {
    hp: Math.max(1, Math.floor(base.hp + (level.hp ?? 0) + (equipment.hp ?? 0) + (status.hp ?? 0))),
    pp: Math.max(0, Math.floor(base.pp + (level.pp ?? 0) + (equipment.pp ?? 0) + (status.pp ?? 0))),
    atk: Math.max(1, Math.floor(base.atk + (level.atk ?? 0) + (equipment.atk ?? 0) + (djinn.atk ?? 0) + (status.atk ?? 0))),
    def: Math.max(0, Math.floor(base.def + (level.def ?? 0) + (equipment.def ?? 0) + (djinn.def ?? 0) + (status.def ?? 0))),
    mag: Math.max(1, Math.floor(base.mag + (level.mag ?? 0) + (equipment.mag ?? 0) + (djinn.mag ?? 0) + (status.mag ?? 0))),
    spd: Math.max(1, Math.floor(base.spd + (level.spd ?? 0) + (equipment.spd ?? 0) + (djinn.spd ?? 0) + (status.spd ?? 0))),
  };
  
  return effective;
}

/**
 * Get effective SPD for a unit
 * Convenience wrapper for turn order calculations
 * 
 * @param unit - Unit to get effective SPD for
 * @param team - Team (for Djinn bonuses)
 * @returns Effective SPD value
 */
export function getEffectiveSPD(unit: Unit, team: Team): number {
  const effective = calculateEffectiveStats(unit, team);
  return effective.spd;
}

