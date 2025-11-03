import type { Unit } from './Unit';
import type { Team } from './Team';
import type { RNG } from '@/utils/SeededRNG';
import { globalRNG } from '@/utils/SeededRNG';

/**
 * Battle Rewards System
 * From GAME_MECHANICS.md Section 6.0
 *
 * Handles XP and Gold distribution after battle victories.
 * Integrates with Unit leveling system and Battle system.
 */

/**
 * Reward data for a single enemy defeated
 */
export interface EnemyReward {
  baseXp: number;
  baseGold: number;
  level: number;
}

/**
 * Calculated rewards from a battle victory
 */
export interface BattleRewards {
  /** Total XP before distribution */
  totalXp: number;

  /** Total Gold earned */
  totalGold: number;

  /** XP per surviving unit (split equally) */
  xpPerUnit: number;

  /** Number of surviving party members */
  survivorCount: number;

  /** True if all party members survived (triggers 1.5× XP bonus) */
  allSurvived: boolean;

  /** Number of enemies defeated */
  enemiesDefeated: number;
}

/**
 * Stat gains from a level up
 */
export interface StatGains {
  hp: number;
  pp: number;
  atk: number;
  def: number;
  mag: number;
  spd: number;
}

/**
 * Level-up event during reward distribution
 */
export interface LevelUpEvent {
  unitId: string;
  unitName: string;
  oldLevel: number;
  newLevel: number;
  statGains: StatGains;
  newAbilitiesUnlocked: string[]; // Ability IDs
}

/**
 * Complete reward distribution result
 */
export interface RewardDistribution {
  rewards: BattleRewards;
  levelUps: LevelUpEvent[];
  goldEarned: number;
}

/**
 * Calculate total rewards from defeated enemies
 *
 * Formulas (Golden Sun-inspired):
 * - XP per enemy: baseXp × level × survivalBonus
 * - Gold per enemy: baseGold × level × random(1.0, 1.2)
 * - Survival bonus: 1.5× if all party members survive
 *
 * @param enemies - Array of defeated enemies with reward data
 * @param allSurvived - True if all party members survived
 * @param survivorCount - Number of surviving party members
 * @param rng - RNG instance for deterministic testing
 * @returns Calculated battle rewards
 */
export function calculateBattleRewards(
  enemies: EnemyReward[],
  allSurvived: boolean,
  survivorCount: number,
  rng: RNG = globalRNG
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
    };
  }

  // Survival bonus: 1.5× XP if all survived
  const survivalBonus = allSurvived ? 1.5 : 1.0;

  // Calculate total XP
  let totalXp = 0;
  for (const enemy of enemies) {
    const enemyXp = enemy.baseXp * enemy.level;
    totalXp += enemyXp;
  }
  totalXp = Math.floor(totalXp * survivalBonus);

  // Calculate total Gold with random variance (1.0× to 1.2×)
  let totalGold = 0;
  for (const enemy of enemies) {
    const baseGoldReward = enemy.baseGold * enemy.level;
    const variance = 1.0 + (rng.next() * 0.2); // Random 1.0 to 1.2
    totalGold += Math.floor(baseGoldReward * variance);
  }

  // Split XP equally among survivors
  const xpPerUnit = Math.floor(totalXp / survivorCount);

  return {
    totalXp,
    totalGold,
    xpPerUnit,
    survivorCount,
    allSurvived,
    enemiesDefeated: enemies.length,
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
 * 1. Give XP to each surviving unit
 * 2. Track level-up events with stat gains
 * 3. Track newly unlocked abilities
 * 4. Return complete distribution report
 *
 * @param team - Player's team
 * @param rewards - Calculated battle rewards
 * @returns Distribution result with level-up events
 */
export function distributeRewards(
  team: Team,
  rewards: BattleRewards
): RewardDistribution {
  const levelUps: LevelUpEvent[] = [];

  // Distribute XP to surviving units
  for (const unit of team.units) {
    // Skip KO'd units
    if (unit.isKO) {
      continue;
    }

    // Skip max level units
    if (unit.level >= 5) {
      continue;
    }

    // Track before state
    const oldLevel = unit.level;
    const oldAbilities = new Set(unit.unlockedAbilityIds);

    // Give XP (this handles level-ups automatically)
    unit.gainXP(rewards.xpPerUnit);

    // Check if leveled up
    if (unit.level > oldLevel) {
      // Calculate stat gains
      const statGains = calculateStatGains(unit, oldLevel, unit.level);

      // Find newly unlocked abilities
      const newAbilities: string[] = [];
      for (const abilityId of unit.unlockedAbilityIds) {
        if (!oldAbilities.has(abilityId)) {
          newAbilities.push(abilityId);
        }
      }

      // Record level-up event
      levelUps.push({
        unitId: unit.id,
        unitName: unit.name,
        oldLevel,
        newLevel: unit.level,
        statGains,
        newAbilitiesUnlocked: newAbilities,
      });
    }
  }

  return {
    rewards,
    levelUps,
    goldEarned: rewards.totalGold,
  };
}
