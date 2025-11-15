/**
 * Reward types for post-battle flow
 * Ported from original Vale Chronicles, adapted for vale-v2
 */

import type { Equipment } from '../../data/schemas/EquipmentSchema';
import type { EquipmentReward } from '../../data/schemas/EncounterSchema';
import type { Unit } from './Unit';

/**
 * Stat gains from a level up
 */
export interface StatGains {
  readonly hp: number;
  readonly pp: number;
  readonly atk: number;
  readonly def: number;
  readonly mag: number;
  readonly spd: number;
}

/**
 * Calculated rewards from a battle victory
 */
export interface BattleRewards {
  /** Total XP before distribution */
  readonly totalXp: number;

  /** Total Gold earned */
  readonly totalGold: number;

  /** XP per surviving unit (split equally) */
  readonly xpPerUnit: number;

  /** Number of surviving party members */
  readonly survivorCount: number;

  /** True if all party members survived (triggers 1.5× XP bonus) */
  readonly allSurvived: boolean;

  /** Number of enemies defeated */
  readonly enemiesDefeated: number;

  /** Predetermined equipment reward definition */
  readonly equipmentReward: EquipmentReward;
}

/**
 * Level-up event during reward distribution
 */
export interface LevelUpEvent {
  readonly unitId: string;
  readonly unitName: string;
  readonly oldLevel: number;
  readonly newLevel: number;
  readonly statGains: StatGains;
  readonly newAbilitiesUnlocked: readonly string[]; // Ability IDs
}

/**
 * Complete reward distribution result
 */
export interface RewardDistribution {
  readonly rewards: BattleRewards;
  readonly levelUps: readonly LevelUpEvent[];
  readonly goldEarned: number;
  readonly fixedEquipment?: Equipment;
  readonly equipmentChoice?: Equipment[];
  readonly choiceSelected?: Equipment;
  readonly recruitedUnit?: Unit; // New: recruited unit (if any)
}
