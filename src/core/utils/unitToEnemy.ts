/**
 * Utility to convert UnitDefinition to Enemy definition
 * Calculates stats at a given level: baseStats + (level - 1) * growthRates
 * 
 * This ensures enemy stats match what the unit would have at that level
 * when recruited (for consistency).
 */

import type { UnitDefinition } from '../../data/schemas/UnitSchema';
import type { Enemy } from '../../data/schemas/EnemySchema';
import type { Stats } from '../models/types';

/**
 * Calculate unit stats at a specific level
 * Formula: baseStats + (level - 1) * growthRates
 * 
 * @param unitDef - Unit definition
 * @param level - Target level (1-20)
 * @returns Stats at that level
 */
function calculateStatsAtLevel(unitDef: UnitDefinition, level: number): Stats {
  const levelBonus = level - 1; // Level 1 = 0 bonus, Level 2 = 1 bonus, etc.
  
  return {
    hp: unitDef.baseStats.hp + (levelBonus * unitDef.growthRates.hp),
    pp: unitDef.baseStats.pp + (levelBonus * unitDef.growthRates.pp),
    atk: unitDef.baseStats.atk + (levelBonus * unitDef.growthRates.atk),
    def: unitDef.baseStats.def + (levelBonus * unitDef.growthRates.def),
    mag: unitDef.baseStats.mag + (levelBonus * unitDef.growthRates.mag),
    spd: unitDef.baseStats.spd + (levelBonus * unitDef.growthRates.spd),
  };
}

/**
 * Convert a UnitDefinition to an Enemy definition
 * 
 * @param unitDef - Unit definition to convert
 * @param level - Enemy level (defaults to 2 for VS1, can be customized per encounter)
 * @param baseXp - Base XP reward (defaults to 60)
 * @param baseGold - Base gold reward (defaults to 19)
 * @returns Enemy definition with stats calculated at the given level
 */
interface UnitToEnemyOptions {
  id?: string;
  stats?: Partial<Stats>;
}

export function unitDefinitionToEnemy(
  unitDef: UnitDefinition,
  level: number = 2,
  baseXp: number = 60,
  baseGold: number = 19,
  options: UnitToEnemyOptions = {}
): Enemy {
  // Calculate stats at target level
  const statsAtLevel = calculateStatsAtLevel(unitDef, level);
  
  // Apply stat overrides if provided
  const finalStats = options.stats 
    ? { ...statsAtLevel, ...options.stats }
    : statsAtLevel;
  
  // Get abilities unlocked at this level
  const abilitiesAtLevel = unitDef.abilities.filter(
    ability => level >= (ability.unlockLevel ?? 1)
  );
  
  // Ensure at least 1 ability (fallback to first ability if none unlocked)
  const enemyAbilities = abilitiesAtLevel.length > 0 
    ? abilitiesAtLevel 
    : [unitDef.abilities[0]!];
  
  return {
    id: options.id ?? `${unitDef.id}-enemy`,
    name: unitDef.name, // Use same name (e.g., "Garet" not "Garet Enemy")
    level,
    element: unitDef.element,
    stats: finalStats,
    abilities: enemyAbilities,
    baseXp,
    baseGold,
  };
}

