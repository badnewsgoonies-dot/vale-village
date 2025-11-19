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

  // NOTE: Djinn rewards and unit recruitment are now handled via post-battle recruitment dialogues
  // The encounter.reward.djinn and encounter.reward.unlockUnit fields are kept for validation
  // but not processed here. All rewards are narrative-driven via dialogue effects.

  let updatedTeam = distribution.updatedTeam;

  // Reset all Djinn to Set state after battle (like units heal to full)
  const resetDjinnTrackers = { ...updatedTeam.djinnTrackers };
  for (const djinnId in resetDjinnTrackers) {
    const tracker = resetDjinnTrackers[djinnId];
    if (tracker) {
      resetDjinnTrackers[djinnId] = {
        djinnId: tracker.djinnId,
        state: 'Set',
        lastActivatedTurn: tracker.lastActivatedTurn,
      };
    }
  }
  updatedTeam = {
    ...updatedTeam,
    djinnTrackers: resetDjinnTrackers,
  };

  // NOTE: Unit recruitment is now handled via post-battle recruitment dialogues
  // The encounter.reward.unlockUnit field is kept for validation but not processed here
  // All recruitment is narrative-driven via dialogue effects (recruitUnit)

  const resolvedDistribution: RewardDistribution = {
    ...distribution,
    fixedEquipment: equipmentResolution.type === 'fixed' ? equipmentResolution.equipment : undefined,
    equipmentChoice: equipmentResolution.type === 'choice' ? equipmentResolution.options : undefined,
  };

  return {
    distribution: resolvedDistribution,
    updatedTeam,
    // No recruitedUnit - all recruitment is narrative-driven
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
