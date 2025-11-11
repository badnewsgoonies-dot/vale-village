/**
 * XP and leveling algorithms
 * Pure functions, deterministic
 */

import type { Unit } from '../models/Unit';

/**
 * XP curve from GAME_MECHANICS.md Section 1.1
 * Maps level → cumulative XP needed to reach that level
 * Extended to level 20 for PR-SCHEMA-20
 */
const XP_CURVE: Readonly<Record<number, number>> = {
  1: 0,      // Starting XP
  2: 100,    // Level 1 → 2
  3: 350,    // Level 1 → 3  (100 + 250)
  4: 850,    // Level 1 → 4  (100 + 250 + 500)
  5: 1850,   // Level 1 → 5  (100 + 250 + 500 + 1000)
  6: 3100,   // Level 1 → 6
  7: 4700,   // Level 1 → 7
  8: 6700,   // Level 1 → 8
  9: 9200,   // Level 1 → 9
  10: 12300, // Level 1 → 10
  11: 16000, // Level 1 → 11
  12: 20400, // Level 1 → 12
  13: 25600, // Level 1 → 13
  14: 31700, // Level 1 → 14
  15: 38800, // Level 1 → 15
  16: 47000, // Level 1 → 16
  17: 56400, // Level 1 → 17
  18: 67100, // Level 1 → 18
  19: 79200, // Level 1 → 19
  20: 92800, // Level 1 → 20
};

/**
 * Get XP required for a specific level
 * Monotonic: returns clamped values for out-of-range levels
 */
export function getXpForLevel(level: number): number {
  if (level < 1) {
    return 0; // Below level 1
  }
  if (level > 20) {
    return XP_CURVE[20] || 0; // Clamp to level 20 max
  }
  return XP_CURVE[level] || 0;
}

/**
 * Calculate level from XP
 * Returns the highest level achievable with given XP
 * Uses binary search for efficiency with extended level cap
 * Clamps below level 1 and above level 20
 */
export function calculateLevelFromXp(xp: number): number {
  if (xp < 0) return 1; // Clamp below level 1
  
  // Binary search for level
  let low = 1;
  let high = 20;
  let result = 1;
  
  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    const midXp = XP_CURVE[mid];
    
    if (midXp === undefined) {
      // Shouldn't happen, but handle gracefully
      break;
    }
    
    if (xp >= midXp) {
      result = mid;
      low = mid + 1;
    } else {
      high = mid - 1;
    }
  }
  
  return result; // Already clamped to 1-20 by binary search bounds
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
  // Clamp XP to minimum 0 to prevent negative values
  const newXp = Math.max(0, unit.xp + xpGain);
  const oldLevel = unit.level;
  const newLevel = calculateLevelFromXp(newXp);
  const leveledUp = newLevel > oldLevel;
  
  // If XP loss causes level down, recalculate unlocked abilities
  const leveledDown = newLevel < oldLevel;

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

  // If level decreased, remove abilities unlocked at higher levels
  let finalUnlockedAbilities = unit.unlockedAbilityIds;
  if (leveledDown) {
    // Keep only abilities unlocked at or below the new level
    finalUnlockedAbilities = unit.abilities
      .filter(a => a.unlockLevel <= newLevel)
      .map(a => a.id);
  } else if (leveledUp) {
    // Add newly unlocked abilities
    finalUnlockedAbilities = [...unit.unlockedAbilityIds, ...unlockedAbilities];
  }

  const updatedUnit: Unit = {
    ...unit,
    xp: newXp,
    level: newLevel,
    unlockedAbilityIds: finalUnlockedAbilities,
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

/**
 * Get XP progress to next level
 * Returns current level, XP progress, and XP needed for next level
 * Useful for UI progress bars
 */
export function getXpProgress(xp: number): {
  level: number;
  current: number;
  needed: number;
  progress: number; // 0.0 to 1.0
} {
  const level = calculateLevelFromXp(xp);
  const currentLevelXp = getXpForLevel(level);
  const nextLevelXp = getXpForLevel(level + 1);
  
  const current = xp - currentLevelXp;
  const needed = nextLevelXp > currentLevelXp ? nextLevelXp - currentLevelXp : 0;
  const progress = needed > 0 ? current / needed : 1.0;
  
  return {
    level,
    current,
    needed,
    progress: Math.max(0, Math.min(1, progress)), // Clamp to [0, 1]
  };
}

