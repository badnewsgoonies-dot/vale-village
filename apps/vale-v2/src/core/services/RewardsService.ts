/**
 * Rewards Service
 * Handles post-battle reward processing (no RNG)
 */

import type { BattleState } from '../models/BattleState';
import type { RewardDistribution } from '../models/Rewards';
import type { Team } from '../models/Team';
import { isUnitKO } from '../models/Unit';
import { calculateBattleRewards, distributeRewards } from '../algorithms/rewards';
import { getEncounterId } from '../models/BattleState';
import { EQUIPMENT } from '../../data/definitions/equipment';
import type { EquipmentReward } from '../../data/schemas/EncounterSchema';

type EquipmentResolution =
  | { type: 'none' }
  | { type: 'fixed'; equipment: typeof EQUIPMENT[keyof typeof EQUIPMENT] }
  | { type: 'choice'; options: (typeof EQUIPMENT[keyof typeof EQUIPMENT])[] };

export function processVictory(
  battle: BattleState
): { distribution: RewardDistribution; updatedTeam: Team } {
  const encounterId = getEncounterId(battle);
  if (!encounterId) {
    throw new Error('Cannot process victory without encounter ID');
  }

  const survivors = battle.playerTeam.units.filter(u => !isUnitKO(u));
  const rewards = calculateBattleRewards(encounterId, survivors.length);

  const distribution = distributeRewards(battle.playerTeam, rewards);
  const equipmentResolution = resolveEquipmentReward(rewards.equipmentReward);

  const resolvedDistribution: RewardDistribution = {
    ...distribution,
    fixedEquipment: equipmentResolution.type === 'fixed' ? equipmentResolution.equipment : undefined,
    equipmentChoice: equipmentResolution.type === 'choice' ? equipmentResolution.options : undefined,
  };

  return {
    distribution: resolvedDistribution,
    updatedTeam: distribution.updatedTeam,
  };
}

export function resolveEquipmentReward(reward: EquipmentReward): EquipmentResolution {
  switch (reward.type) {
    case 'none':
      return { type: 'none' };
    case 'fixed': {
      const equipment = EQUIPMENT[reward.itemId];
      if (!equipment) {
        throw new Error(`Equipment ${reward.itemId} not found`);
      }
      return { type: 'fixed', equipment };
    }
    case 'choice': {
      const options = reward.options.map(id => {
        const equipment = EQUIPMENT[id];
        if (!equipment) {
          throw new Error(`Equipment ${id} not found`);
        }
        return equipment;
      });
      return { type: 'choice', options };
    }
  }
}
