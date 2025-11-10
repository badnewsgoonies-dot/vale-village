import { Result, Ok, Err } from '@/utils/Result';
import type { Unit } from '@/types/Unit';

/**
 * Progression Service - Pure business logic for leveling and XP
 */
export class ProgressionService {
  /**
   * Add XP to a unit and check for level up
   */
  static addXP(
    unit: Unit,
    xpGained: number
  ): Result<{ unit: Unit; leveledUp: boolean; newLevel?: number }, string> {
    if (xpGained < 0) {
      return Err('XP gained cannot be negative');
    }
    
    // Clone unit and add XP
    const updatedUnit = unit.clone();
    updatedUnit.xp += xpGained;
    
    // Check for level up
    const oldLevel = unit.level;
    const newLevel = this.calculateLevel(updatedUnit.xp);
    const leveledUp = newLevel > oldLevel;
    
    if (leveledUp && newLevel <= 5) {
      updatedUnit.level = newLevel;
      updatedUnit.updateUnlockedAbilities();
      // Recalculate HP when leveling up
      const stats = updatedUnit.calculateStats();
      updatedUnit.currentHp = stats.hp; // Restore to full HP on level up
      
      return Ok({ unit: updatedUnit, leveledUp: true, newLevel });
    }
    
    return Ok({ unit: updatedUnit, leveledUp: false });
  }
  
  /**
   * Calculate level from cumulative XP
   * XP curve: 1→2: 100, 2→3: 250, 3→4: 500, 4→5: 1000
   */
  static calculateLevel(cumulativeXP: number): number {
    if (cumulativeXP < 100) return 1;
    if (cumulativeXP < 350) return 2;
    if (cumulativeXP < 850) return 3;
    if (cumulativeXP < 1850) return 4;
    return 5;
  }
  
  /**
   * Get XP needed for next level
   */
  static getXPForNextLevel(currentLevel: number, currentXP: number): number {
    const levelThresholds = [0, 100, 350, 850, 1850];
    if (currentLevel >= 5) return 0;
    
    const nextThreshold = levelThresholds[currentLevel];
    return Math.max(0, nextThreshold - currentXP);
  }
}


