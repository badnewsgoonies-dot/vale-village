/**
 * XP and leveling algorithms
 * Pure functions, deterministic
 */

import type { Unit } from '../models/Unit';

/**
 * XP curve from GAME_MECHANICS.md Section 1.1
 * Maps level → cumulative XP needed to reach that level
 */
const XP_CURVE: Readonly<Record<number, number>> = {
  1: 0,      // Starting XP
  2: 100,    // Level 1 → 2
  3: 350,    // Level 1 → 3  (100 + 250)
  4: 850,    // Level 1 → 4  (100 + 250 + 500)
  5: 1850,   // Level 1 → 5  (100 + 250 + 500 + 1000)
};

/**
 * Get XP required for a specific level
 */
export function getXpForLevel(level: number): number {
  if (level < 1 || level > 5) {
    return 0;
  }
  return XP_CURVE[level] || 0;
}

/**
 * Calculate level from XP
 * Returns the highest level achievable with given XP
 */
export function calculateLevelFromXp(xp: number): number {
  if (xp < 0) return 1;
  const level5Xp = XP_CURVE[5];
  const level4Xp = XP_CURVE[4];
  const level3Xp = XP_CURVE[3];
  const level2Xp = XP_CURVE[2];
  
  if (level5Xp !== undefined && xp >= level5Xp) return 5;
  if (level4Xp !== undefined && xp >= level4Xp) return 4;
  if (level3Xp !== undefined && xp >= level3Xp) return 3;
  if (level2Xp !== undefined && xp >= level2Xp) return 2;
  return 1;
}

/**
 * Add XP to unit and check for level up
 * Returns new unit with updated XP and level, plus level-up info
 */
export function addXp(
  unit: Unit,
  xpGain: number
): {
  unit: Unit;
  leveledUp: boolean;
  newLevel: number;
  unlockedAbilities: readonly string[];
} {
  const newXp = unit.xp + xpGain;
  const oldLevel = unit.level;
  const newLevel = calculateLevelFromXp(newXp);
  const leveledUp = newLevel > oldLevel;

  // Find abilities that should be unlocked at new level
  const unlockedAbilities: string[] = [];
  if (leveledUp) {
    for (let level = oldLevel + 1; level <= newLevel; level++) {
      const abilitiesAtLevel = unit.abilities.filter(
        a => a.unlockLevel === level
      );
      unlockedAbilities.push(...abilitiesAtLevel.map(a => a.id));
    }
  }

  const updatedUnit: Unit = {
    ...unit,
    xp: newXp,
    level: newLevel,
    unlockedAbilityIds: leveledUp
      ? [...unit.unlockedAbilityIds, ...unlockedAbilities]
      : unit.unlockedAbilityIds,
  };

  return {
    unit: updatedUnit,
    leveledUp,
    newLevel,
    unlockedAbilities,
  };
}

/**
 * Calculate max HP for a unit at a given level
 */
export function calculateMaxHpAtLevel(
  baseHp: number,
  growthRate: number,
  level: number
): number {
  return baseHp + (level - 1) * growthRate;
}

