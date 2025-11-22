/**
 * Reward calculation algorithms
 * Ported from original Vale Chronicles, adapted for vale-v2
 * Fully deterministic now — all gold/xp/equipment come from encounter data
 */

import type { Unit } from '../models/Unit';
import type { Team } from '../models/Team';
import type { BattleRewards, LevelUpEvent, RewardDistribution, StatGains } from '../models/Rewards';
import { addXp } from './xp';
import { isUnitKO } from '../models/Unit';
import { ENCOUNTERS } from '../../data/definitions/encounters';

/**
 * Calculate total rewards from a predetermined encounter
 *
 * @param encounterId - Encounter identifier
 * @param survivorCount - Number of surviving party members
 * @returns Predetermined battle rewards
 */
export function calculateBattleRewards(
  encounterId: string,
  survivorCount: number
): BattleRewards {
  const encounter = ENCOUNTERS[encounterId];
  if (!encounter) {
    throw new Error(`Encounter ${encounterId} not found`);
  }

  const allSurvived = survivorCount === 4;
  const xpPerUnit = survivorCount > 0 ? Math.floor(encounter.reward.xp / survivorCount) : 0;

  return {
    totalXp: encounter.reward.xp,
    totalGold: encounter.reward.gold,
    xpPerUnit,
    survivorCount,
    allSurvived,
    enemiesDefeated: encounter.enemies.length,
    equipmentReward: encounter.reward.equipment,
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
