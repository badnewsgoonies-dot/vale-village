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
import { ENCOUNTERS } from '../../data/definitions/encounters';
import { collectDjinn } from './DjinnService';
import { UNIT_DEFINITIONS } from '../../data/definitions/units';
import { ENEMIES } from '../../data/definitions/enemies';
import { createUnit } from '../models/Unit';
import type { Unit } from '../models/Unit';

type EquipmentResolution =
  | { type: 'none' }
  | { type: 'fixed'; equipment: typeof EQUIPMENT[keyof typeof EQUIPMENT] }
  | { type: 'choice'; options: (typeof EQUIPMENT[keyof typeof EQUIPMENT])[] };

export function processVictory(
  battle: BattleState
): { distribution: RewardDistribution; updatedTeam: Team; recruitedUnit?: Unit } {
  const encounterId = getEncounterId(battle);
  if (!encounterId) {
    throw new Error('Cannot process victory without encounter ID');
  }

  const survivors = battle.playerTeam.units.filter(u => !isUnitKO(u));
  const rewards = calculateBattleRewards(encounterId, survivors.length);

  const distribution = distributeRewards(battle.playerTeam, rewards);
  const equipmentResolution = resolveEquipmentReward(rewards.equipmentReward);

  // Check for Djinn reward
  const encounter = ENCOUNTERS[encounterId];
  let updatedTeam = distribution.updatedTeam;
  if (encounter?.reward.djinn) {
    const djinnResult = collectDjinn(updatedTeam, encounter.reward.djinn);
    if (djinnResult.ok) {
      updatedTeam = djinnResult.value;
    }
    // Note: If collection fails (e.g., already collected), we silently continue
    // The player already has the Djinn, so no error is needed
  }

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

  // Check for unit recruitment
  let recruitedUnit: Unit | undefined;
  if (encounter?.reward.unlockUnit) {
    const unitDef = UNIT_DEFINITIONS[encounter.reward.unlockUnit];
    if (!unitDef) {
      console.error(`Unit definition ${encounter.reward.unlockUnit} not found`);
    } else {
      // Get level from first enemy (should be the recruitable unit enemy)
      const firstEnemyId = encounter.enemies[0];
      const enemy = firstEnemyId ? ENEMIES[firstEnemyId] : null;
      const enemyLevel = enemy?.level ?? 1; // Default to level 1 if not found
      
      recruitedUnit = createUnit(unitDef, enemyLevel, 0);
      
      // Note: Don't add to active party automatically - add to roster, let player choose
    }
  }

  const resolvedDistribution: RewardDistribution = {
    ...distribution,
    fixedEquipment: equipmentResolution.type === 'fixed' ? equipmentResolution.equipment : undefined,
    equipmentChoice: equipmentResolution.type === 'choice' ? equipmentResolution.options : undefined,
  };

  return {
    distribution: resolvedDistribution,
    updatedTeam,
    recruitedUnit, // New: return recruited unit
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
