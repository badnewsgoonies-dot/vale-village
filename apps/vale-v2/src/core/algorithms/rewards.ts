/**
 * Reward calculation algorithms
 * Ported from original Vale Chronicles, adapted for vale-v2
 * Uses PRNG for deterministic rewards, addXp() for XP distribution
 */

import type { Unit } from '../models/Unit';
import type { Team } from '../models/Team';
import type { Equipment } from '../models/Equipment';
import type { PRNG } from '../random/prng';
import { addXp } from './xp';
import { isUnitKO } from '../models/Unit';
import { ENEMIES } from '../../data/definitions/enemies';
import type { BattleRewards, LevelUpEvent, RewardDistribution, StatGains } from '../models/Rewards';

/**
 * Calculate equipment drops from defeated enemies
 * 
 * @param enemies - Array of defeated enemy units (need to look up Enemy definitions)
 * @param rng - PRNG instance for deterministic drop rolls
 * @returns Array of dropped equipment
 */
export function calculateEquipmentDrops(
  enemies: readonly Unit[],
  rng: PRNG
): readonly Equipment[] {
  const drops: Equipment[] = [];

  for (const enemyUnit of enemies) {
    // Look up enemy definition to get drops table
    const enemyDef = ENEMIES[enemyUnit.id];
    if (!enemyDef || !enemyDef.drops) {
      continue;
    }

    // Roll for each drop
    for (const drop of enemyDef.drops) {
      if (rng.next() < drop.chance) {
        drops.push(drop.equipment);
      }
    }
  }

  return drops;
}

/**
 * Calculate total rewards from defeated enemies
 * 
 * Formulas (Golden Sun-inspired):
 * - XP per enemy: baseXp × level × survivalBonus
 * - Gold per enemy: baseGold × level × random(1.0, 1.2)
 * - Survival bonus: 1.5× if all party members survive
 * - Equipment drops: Based on enemy drops table and RNG
 * 
 * @param enemies - Array of defeated enemy units
 * @param allSurvived - True if all party members survived
 * @param survivorCount - Number of surviving party members
 * @param rng - PRNG instance for deterministic testing
 * @returns Calculated battle rewards
 */
export function calculateBattleRewards(
  enemies: readonly Unit[],
  allSurvived: boolean,
  survivorCount: number,
  rng: PRNG
): BattleRewards {
  // Edge case: No enemies
  if (enemies.length === 0) {
    return {
      totalXp: 0,
      totalGold: 0,
      xpPerUnit: 0,
      survivorCount,
      allSurvived,
      enemiesDefeated: 0,
      equipmentDrops: [],
    };
  }

  // Edge case: No survivors
  if (survivorCount === 0) {
    return {
      totalXp: 0,
      totalGold: 0,
      xpPerUnit: 0,
      survivorCount: 0,
      allSurvived: false,
      enemiesDefeated: enemies.length,
      equipmentDrops: [],
    };
  }

  // Survival bonus: 1.5× XP if all survived
  const survivalBonus = allSurvived ? 1.5 : 1.0;

  // Calculate total XP
  let totalXp = 0;
  for (const enemyUnit of enemies) {
    // Look up enemy definition to get baseXp
    const enemyDef = ENEMIES[enemyUnit.id];
    if (!enemyDef) {
      // Fallback: use default XP if enemy not found
      console.warn(`Unknown enemy ID: ${enemyUnit.id}, using default XP`);
      totalXp += 10 * enemyUnit.level;
      continue;
    }
    
    const enemyXp = enemyDef.baseXp * enemyUnit.level;
    totalXp += enemyXp;
  }
  totalXp = Math.floor(totalXp * survivalBonus);

  // Calculate total Gold with random variance (1.0× to 1.2×)
  let totalGold = 0;
  for (const enemyUnit of enemies) {
    // Look up enemy definition to get baseGold
    const enemyDef = ENEMIES[enemyUnit.id];
    if (!enemyDef) {
      // Fallback: use default gold if enemy not found
      console.warn(`Unknown enemy ID: ${enemyUnit.id}, using default gold`);
      totalGold += Math.floor(5 * enemyUnit.level * (1.0 + rng.next() * 0.2));
      continue;
    }
    
    const baseGoldReward = enemyDef.baseGold * enemyUnit.level;
    const variance = 1.0 + (rng.next() * 0.2); // Random 1.0 to 1.2
    totalGold += Math.floor(baseGoldReward * variance);
  }

  // Calculate equipment drops
  const equipmentDrops = calculateEquipmentDrops(enemies, rng);

  // Split XP equally among survivors
  const xpPerUnit = Math.floor(totalXp / survivorCount);

  return {
    totalXp,
    totalGold,
    xpPerUnit,
    survivorCount,
    allSurvived,
    enemiesDefeated: enemies.length,
    equipmentDrops,
  };
}

/**
 * Calculate stat gains from leveling up
 * 
 * Used to populate LevelUpEvent.statGains by comparing
 * stats before and after level-up.
 * 
 * @param unit - Unit that leveled up
 * @param oldLevel - Level before gaining XP
 * @param newLevel - Level after gaining XP
 * @returns Stat gains per level
 */
export function calculateStatGains(
  unit: Unit,
  oldLevel: number,
  newLevel: number
): StatGains {
  // Calculate total stat gains across all level-ups
  const levelDiff = newLevel - oldLevel;

  return {
    hp: unit.growthRates.hp * levelDiff,
    pp: unit.growthRates.pp * levelDiff,
    atk: unit.growthRates.atk * levelDiff,
    def: unit.growthRates.def * levelDiff,
    mag: unit.growthRates.mag * levelDiff,
    spd: unit.growthRates.spd * levelDiff,
  };
}

/**
 * Distribute rewards to team and handle level-ups
 * 
 * Process:
 * 1. Give XP to each surviving unit using addXp()
 * 2. Track level-up events with stat gains
 * 3. Track newly unlocked abilities
 * 4. Return complete distribution report with updated team
 * 
 * @param team - Player's team
 * @param rewards - Calculated battle rewards
 * @returns Distribution result with level-up events and updated team
 */
export function distributeRewards(
  team: Team,
  rewards: BattleRewards
): RewardDistribution & { updatedTeam: Team } {
  const levelUps: LevelUpEvent[] = [];
  const updatedUnits: Unit[] = [];

  // Distribute XP to surviving units
  for (const unit of team.units) {
    // Skip KO'd units
    if (isUnitKO(unit)) {
      updatedUnits.push(unit);
      continue;
    }

    // Skip max level units (level 20 cap)
    if (unit.level >= 20) {
      updatedUnits.push(unit);
      continue;
    }

    // Track before state
    const oldLevel = unit.level;

    // Give XP using addXp() function (returns new unit)
    const xpResult = addXp(unit, rewards.xpPerUnit);
    const updatedUnit = xpResult.unit;
    updatedUnits.push(updatedUnit);

    // Check if leveled up
    if (xpResult.leveledUp) {
      // Calculate stat gains
      const statGains = calculateStatGains(updatedUnit, oldLevel, xpResult.newLevel);

      // Record level-up event
      levelUps.push({
        unitId: updatedUnit.id,
        unitName: updatedUnit.name,
        oldLevel,
        newLevel: xpResult.newLevel,
        statGains,
        newAbilitiesUnlocked: xpResult.unlockedAbilities,
      });
    }
  }

  // Create updated team with new unit states
  const updatedTeam: Team = {
    ...team,
    units: updatedUnits,
  };

  return {
    rewards,
    levelUps,
    goldEarned: rewards.totalGold,
    updatedTeam,
  };
}

