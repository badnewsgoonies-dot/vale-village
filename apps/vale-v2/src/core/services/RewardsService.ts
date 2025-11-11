/**
 * Rewards Service
 * Handles post-battle reward calculation and distribution
 * Pure functions, deterministic with PRNG
 */

import type { BattleState } from '../models/BattleState';
import type { RewardDistribution } from '../models/Rewards';
import type { Team } from '../models/Team';
import type { PRNG } from '../random/prng';
import { isUnitKO } from '../models/Unit';
import {
  calculateBattleRewards,
  calculateEquipmentDrops,
  distributeRewards,
} from '../algorithms/rewards';

/**
 * Process victory rewards after a battle
 * Calculates base rewards, equipment drops, and distributes to team
 */
export function processVictory(
  battle: BattleState,
  rng: PRNG
): { distribution: RewardDistribution; updatedTeam: Team } {
  // Calculate rewards
  const enemies = battle.enemies;
  const survivors = battle.playerTeam.units.filter(u => !isUnitKO(u));
  const allSurvived = survivors.length === battle.playerTeam.units.length;

  // Calculate base rewards
  const rewards = calculateBattleRewards(enemies, allSurvived, survivors.length, rng);

  // Calculate equipment drops
  const equipmentDrops = calculateEquipmentDrops(enemies, rng);
  const rewardsWithDrops = { ...rewards, equipmentDrops };

  // Distribute rewards to team
  const distribution = distributeRewards(battle.playerTeam, rewardsWithDrops);

  return {
    distribution,
    updatedTeam: distribution.updatedTeam,
  };
}
