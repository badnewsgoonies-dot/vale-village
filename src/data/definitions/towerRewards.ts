// [BT-DATA][BT-01] Battle Tower reward milestones
import type { TowerReward } from '../schemas/TowerRewardSchema';

/**
 * Tower rewards are milestone-based and reference existing content IDs.
 * These entries prove out tower-exclusive unlocks while keeping data-driven flow.
 */
export const TOWER_REWARDS: readonly TowerReward[] = [
  {
    floorNumber: 6,
    rewards: [
      {
        type: 'equipment',
        ids: ['eclipse-blade'],
        notes: 'Tower-exclusive artifact sword',
      },
    ],
  },
  {
    floorNumber: 7,
    rewards: [
      {
        type: 'djinn',
        ids: ['nova'],
        notes: 'Tower-exclusive Mars Djinn',
      },
    ],
  },
  {
    floorNumber: 10,
    rewards: [
      {
        type: 'recruit',
        ids: ['tower-champion'],
        notes: 'Tower-exclusive recruit unlocked after boss floor',
      },
    ],
  },
] as const;

