// [BT-CORE][BT-01] Battle Tower core service

import type { TowerFloor } from '../../data/schemas/TowerFloorSchema';
import type { TowerRewardEntry } from '../../data/schemas/TowerRewardSchema';
import {
  DEFAULT_TOWER_CONFIG,
  type TowerConfig,
  type TowerDifficulty,
  TOWER_ENEMY_SCALING_PER_FLOOR,
} from '../config/towerConfig';

export type TowerBattleOutcome = 'victory' | 'defeat' | 'retreat';

export interface TowerBattleSummary {
  turnsTaken: number;
  damageDealt: number;
  damageTaken: number;
  manaSpent: number;
}

export interface TowerRestSummary {
  healedFraction: number;
  loadoutAdjusted: boolean;
}

export interface TowerRunStats {
  highestFloor: number;
  totalBattles: number;
  victories: number;
  defeats: number;
  retreats: number;
  turnsTaken: number;
  totalDamageDealt: number;
  totalDamageTaken: number;
}

export interface TowerFloorHistoryEntry {
  floorId: string;
  floorNumber: number;
  type: TowerFloor['type'];
  outcome: 'pending' | 'victory' | 'defeat' | 'retreat' | 'rested';
  rewardsGranted: readonly TowerRewardEntry[];
  restSummary?: TowerRestSummary;
}

export interface TowerRunState {
  seed: number;
  difficulty: TowerDifficulty;
  floorIndex: number;
  floorIds: readonly string[];
  isCompleted: boolean;
  isFailed: boolean;
  stats: TowerRunStats;
  history: readonly TowerFloorHistoryEntry[];
  pendingRewards: readonly TowerRewardEntry[];
  config: TowerConfig;
}

export interface ScalingParams {
  statMultiplier: number;
  levelDelta: number;
}

export function createTowerRun(
  seed: number,
  difficulty: TowerDifficulty,
  floors: readonly TowerFloor[],
  config: TowerConfig = DEFAULT_TOWER_CONFIG
): TowerRunState {
  if (!floors.length) {
    throw new Error('TOWER_FLOORS must contain at least one entry');
  }

  const sortedFloors = [...floors].sort((a, b) => a.floorNumber - b.floorNumber);
  const floorIds = sortedFloors.map(floor => floor.id) as readonly string[];

  return {
    seed,
    difficulty,
    floorIndex: 0,
    floorIds,
    isCompleted: false,
    isFailed: false,
    stats: {
      highestFloor: 0,
      totalBattles: 0,
      victories: 0,
      defeats: 0,
      retreats: 0,
      turnsTaken: 0,
      totalDamageDealt: 0,
      totalDamageTaken: 0,
    },
    history: sortedFloors.map(floor => ({
      floorId: floor.id,
      floorNumber: floor.floorNumber,
      type: floor.type,
      outcome: 'pending',
      rewardsGranted: [],
    })),
    pendingRewards: [],
    config,
  };
}

export function getCurrentFloor(run: TowerRunState, floors: readonly TowerFloor[]): TowerFloor | null {
  if (run.floorIndex >= run.floorIds.length) {
    return null;
  }
  const currentId = run.floorIds[run.floorIndex] as string;
  return getFloorById(floors, currentId);
}

export function isRestFloor(floor: TowerFloor | null): boolean {
  return Boolean(floor && floor.type === 'rest');
}

export function advanceToNextFloor(run: TowerRunState): TowerRunState {
  if (run.isCompleted) {
    return run;
  }
  const nextIndex = Math.min(run.floorIndex + 1, run.floorIds.length);
  const completed = nextIndex >= run.floorIds.length;
  return {
    ...run,
    floorIndex: nextIndex,
    isCompleted: completed,
    isFailed: run.isFailed,
  };
}

export interface RecordBattleResultParams {
  run: TowerRunState;
  floors: readonly TowerFloor[];
  outcome: TowerBattleOutcome;
  summary: TowerBattleSummary;
  rewards?: readonly TowerRewardEntry[];
}

export function recordBattleResult({
  run,
  floors,
  outcome,
  summary,
  rewards = [],
}: RecordBattleResultParams): TowerRunState {
  const currentFloor = getCurrentFloor(run, floors);
  if (!currentFloor) {
    return run;
  }
  if (currentFloor.type === 'rest') {
    throw new Error(`Cannot record battle result for rest floor ${currentFloor.id}`);
  }

  const nextStats = updateStatsForBattle(run.stats, currentFloor.floorNumber, outcome, summary);
  const nextHistory: TowerFloorHistoryEntry[] = run.history.map(entry => {
    if (entry.floorId !== currentFloor.id) {
      return entry;
    }
    return {
      ...entry,
      outcome,
      rewardsGranted: rewards,
    };
  });

  const didWin = outcome === 'victory';
  const didRetreat = outcome === 'retreat';
  const nextFloorIndex = didWin ? Math.min(run.floorIndex + 1, run.floorIds.length) : run.floorIndex;
  const hasClearedAllFloors = nextFloorIndex >= run.floorIds.length;
  const isFailed = outcome === 'defeat';
  const isCompleted = hasClearedAllFloors || didRetreat || isFailed;

  return {
    ...run,
    stats: nextStats,
    history: nextHistory,
    floorIndex: nextFloorIndex,
    isCompleted,
    isFailed,
    pendingRewards: rewards.length ? [...run.pendingRewards, ...rewards] : run.pendingRewards,
    // Retreating ends the run but is not a failure
  };
}

export function completeRestFloor(
  run: TowerRunState,
  floors: readonly TowerFloor[],
  summary: TowerRestSummary
): TowerRunState {
  const currentFloor = getCurrentFloor(run, floors);
  if (!currentFloor) {
    return run;
  }
  if (currentFloor.type !== 'rest') {
    throw new Error(`completeRestFloor called for non-rest floor ${currentFloor.id}`);
  }

  const nextHistory = run.history.map(entry => {
    if (entry.floorId !== currentFloor.id) {
      return entry;
    }
    const updated: TowerFloorHistoryEntry = {
      ...entry,
      outcome: 'rested' as const,
      rewardsGranted: [],
      restSummary: summary,
    };
    return updated;
  });

  return {
    ...run,
    history: nextHistory,
    floorIndex: Math.min(run.floorIndex + 1, run.floorIds.length),
    stats: {
      ...run.stats,
      highestFloor: Math.max(run.stats.highestFloor, currentFloor.floorNumber),
    },
  };
}

export function clearPendingRewards(run: TowerRunState): TowerRunState {
  if (!run.pendingRewards.length) {
    return run;
  }
  return {
    ...run,
    pendingRewards: [],
  };
}

export function calculateEnemyScaling(
  floorNumber: number,
  difficulty: TowerDifficulty,
  config: TowerConfig = DEFAULT_TOWER_CONFIG
): ScalingParams {
  const baseMultiplier =
    1 + (floorNumber - 1) * (config.enemyScalingPerFloor ?? TOWER_ENEMY_SCALING_PER_FLOOR);
  const difficultyBonus = difficulty === 'hard' ? 0.25 : 0;
  const statMultiplier = baseMultiplier + difficultyBonus;
  const levelDelta = Math.max(0, Math.floor((floorNumber - 1) * (difficulty === 'hard' ? 1.5 : 1)));
  return {
    statMultiplier,
    levelDelta,
  };
}

function getFloorById(floors: readonly TowerFloor[], id: string): TowerFloor {
  const floor = floors.find(entry => entry.id === id);
  if (!floor) {
    throw new Error(`Tower floor ${id} not found`);
  }
  return floor;
}

function updateStatsForBattle(
  stats: TowerRunStats,
  floorNumber: number,
  outcome: TowerBattleOutcome,
  summary: TowerBattleSummary
): TowerRunStats {
  return {
    highestFloor: outcome === 'victory' ? Math.max(stats.highestFloor, floorNumber) : stats.highestFloor,
    totalBattles: stats.totalBattles + 1,
    victories: stats.victories + (outcome === 'victory' ? 1 : 0),
    defeats: stats.defeats + (outcome === 'defeat' ? 1 : 0),
    retreats: stats.retreats + (outcome === 'retreat' ? 1 : 0),
    turnsTaken: stats.turnsTaken + summary.turnsTaken,
    totalDamageDealt: stats.totalDamageDealt + summary.damageDealt,
    totalDamageTaken: stats.totalDamageTaken + summary.damageTaken,
  };
}

