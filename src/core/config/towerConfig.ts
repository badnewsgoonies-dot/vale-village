// [BT-CONFIG][BT-01] Battle Tower configuration

export type TowerDifficulty = 'normal' | 'hard';

export interface TowerConfig {
  restFloorInterval: number;
  targetMaxFloor: number;
  healFractionAtRest: number;
  enemyScalingPerFloor: number;
  bossFloorInterval: number;
  maxTeamSize: number;
}

export const DEFAULT_TOWER_CONFIG: TowerConfig = {
  restFloorInterval: 4,
  targetMaxFloor: 100,
  healFractionAtRest: 0.5,
  enemyScalingPerFloor: 0.04,
  bossFloorInterval: 5,
  maxTeamSize: 4,
} as const;

export const TOWER_REST_FLOOR_INTERVAL = DEFAULT_TOWER_CONFIG.restFloorInterval;
export const TOWER_TARGET_MAX_FLOOR = DEFAULT_TOWER_CONFIG.targetMaxFloor;
export const TOWER_HP_RESTORE_FRACTION_AT_REST = DEFAULT_TOWER_CONFIG.healFractionAtRest;
export const TOWER_ENEMY_SCALING_PER_FLOOR = DEFAULT_TOWER_CONFIG.enemyScalingPerFloor;
export const TOWER_BOSS_FLOOR_INTERVAL = DEFAULT_TOWER_CONFIG.bossFloorInterval;
export const TOWER_MAX_TEAM_SIZE = DEFAULT_TOWER_CONFIG.maxTeamSize;

