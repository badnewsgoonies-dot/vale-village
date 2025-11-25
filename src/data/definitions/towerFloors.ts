// [BT-DATA][BT-01] Battle Tower floor definitions
import type { TowerFloor } from '../schemas/TowerFloorSchema';

/**
 * Curated prototype floors for Battle Tower v1
 * - Reuse existing Liberation encounters to showcase queue battle sandbox
 * - Rest floors inserted at configured cadence (see towerConfig)
 */
export const TOWER_FLOORS: TowerFloor[] = [
  {
    id: 'tower-floor-001',
    floorNumber: 1,
    type: 'normal',
    encounterId: 'vs1-garet',
    difficultyTier: 1,
    tags: ['tutorial'],
  },
  {
    id: 'tower-floor-002',
    floorNumber: 2,
    type: 'normal',
    encounterId: 'house-02',
    difficultyTier: 1,
    tags: [],
  },
  {
    id: 'tower-floor-003',
    floorNumber: 3,
    type: 'normal',
    encounterId: 'house-03',
    difficultyTier: 1,
    tags: [],
  },
  {
    id: 'tower-floor-004',
    floorNumber: 4,
    type: 'rest',
    difficultyTier: 1,
    tags: [],
    rest: {
      allowLoadoutChange: true,
    },
  },
  {
    id: 'tower-floor-005',
    floorNumber: 5,
    type: 'normal',
    encounterId: 'house-04',
    difficultyTier: 2,
    tags: [],
  },
  {
    id: 'tower-floor-006',
    floorNumber: 6,
    type: 'boss',
    encounterId: 'house-05',
    difficultyTier: 2,
    tags: ['blaze'],
  },
  {
    id: 'tower-floor-007',
    floorNumber: 7,
    type: 'normal',
    encounterId: 'house-06',
    difficultyTier: 2,
    tags: [],
  },
  {
    id: 'tower-floor-008',
    floorNumber: 8,
    type: 'rest',
    difficultyTier: 2,
    tags: [],
    rest: {
      allowLoadoutChange: true,
    },
  },
  {
    id: 'tower-floor-009',
    floorNumber: 9,
    type: 'normal',
    encounterId: 'house-07',
    difficultyTier: 3,
    tags: [],
  },
  {
    id: 'tower-floor-010',
    floorNumber: 10,
    type: 'boss',
    encounterId: 'house-08',
    difficultyTier: 3,
    tags: ['sentinel', 'djinn'],
  },
] as const;

