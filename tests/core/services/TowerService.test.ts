/**
 * Tower Service Tests
 * Tests Battle Tower run state management and floor progression
 */

import { describe, test, expect } from 'vitest';
import {
  createTowerRun,
  getCurrentFloor,
  isRestFloor,
  advanceToNextFloor,
  recordBattleResult,
  completeRestFloor,
  clearPendingRewards,
  calculateEnemyScaling,
} from '@/core/services/TowerService';
import type { TowerFloor } from '@/data/schemas/TowerFloorSchema';
import type { TowerRewardEntry } from '@/data/schemas/TowerRewardSchema';

// Test fixtures
const mockFloors: TowerFloor[] = [
  {
    id: 'floor-1',
    floorNumber: 1,
    type: 'battle',
    encounterId: 'tower-battle-1',
  },
  {
    id: 'floor-2',
    floorNumber: 2,
    type: 'battle',
    encounterId: 'tower-battle-2',
  },
  {
    id: 'floor-3',
    floorNumber: 3,
    type: 'rest',
  },
  {
    id: 'floor-4',
    floorNumber: 4,
    type: 'battle',
    encounterId: 'tower-battle-3',
  },
];

const mockRewards: TowerRewardEntry[] = [
  { type: 'gold', amount: 100 },
  { type: 'item', itemId: 'bronze-sword' },
];

describe('TowerService - Tower Run Creation', () => {
  test('createTowerRun initializes tower state correctly', () => {
    const run = createTowerRun(42, 'normal', mockFloors);

    expect(run.seed).toBe(42);
    expect(run.difficulty).toBe('normal');
    expect(run.floorIndex).toBe(0);
    expect(run.floorIds.length).toBe(4);
    expect(run.isCompleted).toBe(false);
    expect(run.isFailed).toBe(false);
    expect(run.stats.highestFloor).toBe(0);
    expect(run.history.length).toBe(4);
  });

  test('createTowerRun sorts floors by floorNumber', () => {
    const unsortedFloors: TowerFloor[] = [
      { id: 'floor-3', floorNumber: 3, type: 'rest' },
      { id: 'floor-1', floorNumber: 1, type: 'battle', encounterId: 'tower-1' },
      { id: 'floor-2', floorNumber: 2, type: 'battle', encounterId: 'tower-2' },
    ];

    const run = createTowerRun(42, 'normal', unsortedFloors);

    expect(run.floorIds[0]).toBe('floor-1');
    expect(run.floorIds[1]).toBe('floor-2');
    expect(run.floorIds[2]).toBe('floor-3');
  });

  test('createTowerRun throws error for empty floors', () => {
    expect(() => {
      createTowerRun(42, 'normal', []);
    }).toThrow(/must contain at least one/i);
  });

  test('createTowerRun initializes stats to zero', () => {
    const run = createTowerRun(42, 'normal', mockFloors);

    expect(run.stats).toEqual({
      highestFloor: 0,
      totalBattles: 0,
      victories: 0,
      defeats: 0,
      retreats: 0,
      turnsTaken: 0,
      totalDamageDealt: 0,
      totalDamageTaken: 0,
    });
  });

  test('createTowerRun initializes all floors as pending', () => {
    const run = createTowerRun(42, 'normal', mockFloors);

    expect(run.history.every(h => h.outcome === 'pending')).toBe(true);
    expect(run.history.every(h => h.rewardsGranted.length === 0)).toBe(true);
  });
});

describe('TowerService - Floor Navigation', () => {
  test('getCurrentFloor returns first floor initially', () => {
    const run = createTowerRun(42, 'normal', mockFloors);
    const floor = getCurrentFloor(run, mockFloors);

    expect(floor).not.toBeNull();
    expect(floor?.id).toBe('floor-1');
    expect(floor?.floorNumber).toBe(1);
  });

  test('getCurrentFloor returns null at end of run', () => {
    const run = createTowerRun(42, 'normal', mockFloors);
    const completedRun = { ...run, floorIndex: 4 }; // Beyond last floor

    const floor = getCurrentFloor(completedRun, mockFloors);

    expect(floor).toBeNull();
  });

  test('isRestFloor detects rest floors', () => {
    const restFloor: TowerFloor = { id: 'rest-1', floorNumber: 3, type: 'rest' };
    const battleFloor: TowerFloor = {
      id: 'battle-1',
      floorNumber: 1,
      type: 'battle',
      encounterId: 'tower-1',
    };

    expect(isRestFloor(restFloor)).toBe(true);
    expect(isRestFloor(battleFloor)).toBe(false);
    expect(isRestFloor(null)).toBe(false);
  });

  test('advanceToNextFloor increments floor index', () => {
    const run = createTowerRun(42, 'normal', mockFloors);

    const advanced = advanceToNextFloor(run);

    expect(advanced.floorIndex).toBe(1);
    expect(advanced.isCompleted).toBe(false);
  });

  test('advanceToNextFloor sets completion flag at end', () => {
    const run = createTowerRun(42, 'normal', mockFloors);
    const nearEnd = { ...run, floorIndex: 3 }; // Last floor

    const advanced = advanceToNextFloor(nearEnd);

    expect(advanced.floorIndex).toBe(4);
    expect(advanced.isCompleted).toBe(true);
  });

  test('advanceToNextFloor does not advance completed runs', () => {
    const run = createTowerRun(42, 'normal', mockFloors);
    const completed = { ...run, isCompleted: true, floorIndex: 4 };

    const advanced = advanceToNextFloor(completed);

    expect(advanced.floorIndex).toBe(4);
    expect(advanced).toEqual(completed);
  });
});

describe('TowerService - Battle Results', () => {
  test('recordBattleResult updates stats on victory', () => {
    const run = createTowerRun(42, 'normal', mockFloors);

    const result = recordBattleResult({
      run,
      floors: mockFloors,
      outcome: 'victory',
      summary: {
        turnsTaken: 5,
        damageDealt: 100,
        damageTaken: 20,
        manaSpent: 10,
      },
    });

    expect(result.stats.victories).toBe(1);
    expect(result.stats.totalBattles).toBe(1);
    expect(result.stats.turnsTaken).toBe(5);
    expect(result.stats.totalDamageDealt).toBe(100);
    expect(result.stats.totalDamageTaken).toBe(20);
    expect(result.stats.highestFloor).toBe(1);
  });

  test('recordBattleResult advances floor on victory', () => {
    const run = createTowerRun(42, 'normal', mockFloors);

    const result = recordBattleResult({
      run,
      floors: mockFloors,
      outcome: 'victory',
      summary: {
        turnsTaken: 5,
        damageDealt: 100,
        damageTaken: 20,
        manaSpent: 10,
      },
    });

    expect(result.floorIndex).toBe(1);
  });

  test('recordBattleResult does not advance floor on defeat', () => {
    const run = createTowerRun(42, 'normal', mockFloors);

    const result = recordBattleResult({
      run,
      floors: mockFloors,
      outcome: 'defeat',
      summary: {
        turnsTaken: 3,
        damageDealt: 50,
        damageTaken: 200,
        manaSpent: 5,
      },
    });

    expect(result.floorIndex).toBe(0);
    expect(result.stats.defeats).toBe(1);
    expect(result.isFailed).toBe(true);
    expect(result.isCompleted).toBe(true);
  });

  test('recordBattleResult accumulates pending rewards', () => {
    const run = createTowerRun(42, 'normal', mockFloors);

    const result = recordBattleResult({
      run,
      floors: mockFloors,
      outcome: 'victory',
      summary: {
        turnsTaken: 5,
        damageDealt: 100,
        damageTaken: 20,
        manaSpent: 10,
      },
      rewards: mockRewards,
    });

    expect(result.pendingRewards.length).toBe(2);
    expect(result.pendingRewards).toEqual(mockRewards);
  });

  test('recordBattleResult updates history with outcome', () => {
    const run = createTowerRun(42, 'normal', mockFloors);

    const result = recordBattleResult({
      run,
      floors: mockFloors,
      outcome: 'victory',
      summary: {
        turnsTaken: 5,
        damageDealt: 100,
        damageTaken: 20,
        manaSpent: 10,
      },
      rewards: mockRewards,
    });

    const floor1History = result.history.find(h => h.floorId === 'floor-1');
    expect(floor1History?.outcome).toBe('victory');
    expect(floor1History?.rewardsGranted).toEqual(mockRewards);
  });

  test('recordBattleResult sets completion on final floor victory', () => {
    const run = createTowerRun(42, 'normal', mockFloors);
    const finalFloor = { ...run, floorIndex: 3 }; // Floor 4 (last)

    const result = recordBattleResult({
      run: finalFloor,
      floors: mockFloors,
      outcome: 'victory',
      summary: {
        turnsTaken: 5,
        damageDealt: 100,
        damageTaken: 20,
        manaSpent: 10,
      },
    });

    expect(result.isCompleted).toBe(true);
    expect(result.isFailed).toBe(false);
  });

  test('recordBattleResult handles retreat', () => {
    const run = createTowerRun(42, 'normal', mockFloors);

    const result = recordBattleResult({
      run,
      floors: mockFloors,
      outcome: 'retreat',
      summary: {
        turnsTaken: 2,
        damageDealt: 10,
        damageTaken: 5,
        manaSpent: 1,
      },
    });

    expect(result.stats.retreats).toBe(1);
    expect(result.isCompleted).toBe(true);
    expect(result.isFailed).toBe(false);
  });

  test('recordBattleResult throws on rest floor', () => {
    const run = createTowerRun(42, 'normal', mockFloors);
    const restFloorRun = { ...run, floorIndex: 2 }; // Floor 3 is rest

    expect(() => {
      recordBattleResult({
        run: restFloorRun,
        floors: mockFloors,
        outcome: 'victory',
        summary: {
          turnsTaken: 5,
          damageDealt: 100,
          damageTaken: 20,
          manaSpent: 10,
        },
      });
    }).toThrow(/cannot record battle result for rest floor/i);
  });
});

describe('TowerService - Rest Floors', () => {
  test('completeRestFloor updates history', () => {
    const run = createTowerRun(42, 'normal', mockFloors);
    const restFloorRun = { ...run, floorIndex: 2 }; // Floor 3 is rest

    const result = completeRestFloor(restFloorRun, mockFloors, {
      healedFraction: 0.5,
      loadoutAdjusted: true,
    });

    const restHistory = result.history.find(h => h.floorId === 'floor-3');
    expect(restHistory?.outcome).toBe('rested');
    expect(restHistory?.restSummary?.healedFraction).toBe(0.5);
    expect(restHistory?.restSummary?.loadoutAdjusted).toBe(true);
  });

  test('completeRestFloor advances floor', () => {
    const run = createTowerRun(42, 'normal', mockFloors);
    const restFloorRun = { ...run, floorIndex: 2 }; // Floor 3 is rest

    const result = completeRestFloor(restFloorRun, mockFloors, {
      healedFraction: 1.0,
      loadoutAdjusted: false,
    });

    expect(result.floorIndex).toBe(3);
  });

  test('completeRestFloor updates highest floor', () => {
    const run = createTowerRun(42, 'normal', mockFloors);
    const restFloorRun = { ...run, floorIndex: 2, stats: { ...run.stats, highestFloor: 2 } };

    const result = completeRestFloor(restFloorRun, mockFloors, {
      healedFraction: 1.0,
      loadoutAdjusted: false,
    });

    expect(result.stats.highestFloor).toBe(3);
  });

  test('completeRestFloor throws on battle floor', () => {
    const run = createTowerRun(42, 'normal', mockFloors);

    expect(() => {
      completeRestFloor(run, mockFloors, {
        healedFraction: 0.5,
        loadoutAdjusted: false,
      });
    }).toThrow(/called for non-rest floor/i);
  });
});

describe('TowerService - Rewards Management', () => {
  test('clearPendingRewards clears rewards list', () => {
    const run = createTowerRun(42, 'normal', mockFloors);
    const runWithRewards = { ...run, pendingRewards: mockRewards };

    const cleared = clearPendingRewards(runWithRewards);

    expect(cleared.pendingRewards.length).toBe(0);
  });

  test('clearPendingRewards returns same run if no rewards', () => {
    const run = createTowerRun(42, 'normal', mockFloors);

    const cleared = clearPendingRewards(run);

    expect(cleared).toEqual(run);
  });
});

describe('TowerService - Enemy Scaling', () => {
  test('calculateEnemyScaling applies floor multiplier', () => {
    const scaling = calculateEnemyScaling(1, 'normal');

    expect(scaling.statMultiplier).toBe(1.0); // Floor 1 baseline
    expect(scaling.levelDelta).toBe(0);
  });

  test('calculateEnemyScaling scales with floor number', () => {
    const scaling5 = calculateEnemyScaling(5, 'normal');
    const scaling10 = calculateEnemyScaling(10, 'normal');

    // Higher floors = higher multiplier
    expect(scaling10.statMultiplier).toBeGreaterThan(scaling5.statMultiplier);
    expect(scaling10.levelDelta).toBeGreaterThan(scaling5.levelDelta);
  });

  test('calculateEnemyScaling applies difficulty bonus', () => {
    const normalScaling = calculateEnemyScaling(5, 'normal');
    const hardScaling = calculateEnemyScaling(5, 'hard');

    // Hard mode = higher multiplier
    expect(hardScaling.statMultiplier).toBeGreaterThan(normalScaling.statMultiplier);
    expect(hardScaling.levelDelta).toBeGreaterThan(normalScaling.levelDelta);
  });

  test('calculateEnemyScaling uses custom config', () => {
    const customConfig = {
      maxFloors: 20,
      baseMaxMana: 8,
      enemyScalingPerFloor: 0.5, // Much higher than default
    };

    const scaling = calculateEnemyScaling(5, 'normal', customConfig);

    // With 0.5 scaling per floor, floor 5 should be: 1 + (5-1) * 0.5 = 3.0
    expect(scaling.statMultiplier).toBe(3.0);
  });
});

describe('TowerService - Run Completion', () => {
  test('full tower run progression', () => {
    let run = createTowerRun(42, 'normal', mockFloors);

    // Floor 1 - Victory
    run = recordBattleResult({
      run,
      floors: mockFloors,
      outcome: 'victory',
      summary: { turnsTaken: 5, damageDealt: 100, damageTaken: 20, manaSpent: 10 },
      rewards: [{ type: 'gold', amount: 50 }],
    });
    expect(run.floorIndex).toBe(1);
    expect(run.stats.victories).toBe(1);

    // Floor 2 - Victory
    run = recordBattleResult({
      run,
      floors: mockFloors,
      outcome: 'victory',
      summary: { turnsTaken: 6, damageDealt: 120, damageTaken: 30, manaSpent: 12 },
      rewards: [{ type: 'gold', amount: 60 }],
    });
    expect(run.floorIndex).toBe(2);
    expect(run.stats.victories).toBe(2);
    expect(run.pendingRewards.length).toBe(2);

    // Floor 3 - Rest
    run = completeRestFloor(run, mockFloors, {
      healedFraction: 1.0,
      loadoutAdjusted: false,
    });
    expect(run.floorIndex).toBe(3);

    // Floor 4 - Final Battle Victory
    run = recordBattleResult({
      run,
      floors: mockFloors,
      outcome: 'victory',
      summary: { turnsTaken: 8, damageDealt: 150, damageTaken: 40, manaSpent: 15 },
    });

    expect(run.isCompleted).toBe(true);
    expect(run.isFailed).toBe(false);
    expect(run.stats.victories).toBe(3);
    expect(run.stats.highestFloor).toBe(4);
  });
});
