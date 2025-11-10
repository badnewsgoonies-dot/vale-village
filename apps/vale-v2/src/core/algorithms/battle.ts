/**
 * Battle algorithms (turn order, critical hits, dodge, etc.)
 * Pure functions, deterministic with PRNG
 */

import type { Unit } from '../models/Unit';
import type { PRNG } from '../random/prng';
import { isUnitKO } from '../models/Unit';

/**
 * Check for critical hit
 * From GAME_MECHANICS.md Section 6.2
 * Base 5% + 0.2% per SPD point
 * Critical hits deal 2.0x damage
 */
export function checkCriticalHit(attacker: Unit, rng: PRNG): boolean {
  const BASE_CRIT_CHANCE = 0.05;
  const SPEED_BONUS = attacker.baseStats.spd * 0.002;

  const totalChance = BASE_CRIT_CHANCE + SPEED_BONUS;

  return rng.next() < totalChance;
}

/**
 * Check if defender dodges attacker's ability
 * From GAME_MECHANICS.md Section 5.1.4
 * Formula: baseEvasion (5%) + equipmentEvasion + speedBonus
 * Speed bonus = 1% per SPD difference in defender's favor
 * Final evasion capped at 75%
 */
export function checkDodge(
  attacker: Unit,
  defender: Unit,
  rng: PRNG
): boolean {
  const BASE_EVASION = 0.05; // 5% base
  const equipmentEvasion = defender.equipment.boots?.evasion || 0;
  const speedBonus = (defender.baseStats.spd - attacker.baseStats.spd) * 0.01; // 1% per SPD point
  
  const totalEvasion = BASE_EVASION + (equipmentEvasion / 100) + speedBonus;
  const finalEvasion = Math.max(0, Math.min(0.75, totalEvasion)); // Clamp to 0-75%
  
  return rng.next() < finalEvasion;
}

/**
 * Calculate turn order based on SPD stat
 * From GAME_MECHANICS.md Section 6.1
 * Highest SPD goes first, with tiebreaker randomization
 * Special case: Hermes' Sandals always go first
 * Returns array of unit IDs in turn order
 */
export function calculateTurnOrder(
  units: readonly Unit[],
  rng: PRNG
): readonly string[] {
  // Filter out KO'd units
  const aliveUnits = units.filter(u => !isUnitKO(u));

  // Check for Hermes' Sandals (always first)
  const hermesUnits = aliveUnits.filter(u =>
    u.equipment.boots?.alwaysFirstTurn === true
  );

  const regularUnits = aliveUnits.filter(u =>
    u.equipment.boots?.alwaysFirstTurn !== true
  );

  // Sort by SPD (descending) with tiebreaker randomization
  const sortedRegular = [...regularUnits].sort((a, b) => {
    const spdDiff = b.baseStats.spd - a.baseStats.spd;
    // Tiebreaker: random
    if (spdDiff === 0) {
      return rng.next() - 0.5;
    }
    return spdDiff;
  });

  // Hermes' Sandals first, then regular units
  const allOrdered = [...hermesUnits, ...sortedRegular];
  return allOrdered.map(u => u.id);
}

/**
 * Check if battle has ended
 * From GAME_MECHANICS.md Section 6.3
 */
export function checkBattleEnd(
  playerUnits: readonly Unit[],
  enemyUnits: readonly Unit[]
): 'PLAYER_VICTORY' | 'PLAYER_DEFEAT' | null {
  const allPlayerKO = playerUnits.every(u => isUnitKO(u));
  const allEnemiesKO = enemyUnits.every(u => isUnitKO(u));

  if (allEnemiesKO) return 'PLAYER_VICTORY';
  if (allPlayerKO) return 'PLAYER_DEFEAT';

  return null;
}

/**
 * Attempt to flee from battle
 * From GAME_MECHANICS.md Section 6.4
 * Base 50% chance, modified by speed ratio
 * Clamped between 10% and 90%
 */
export function attemptFlee(
  playerUnits: readonly Unit[],
  enemyUnits: readonly Unit[],
  isBossBattle: boolean,
  rng: PRNG
): { success: boolean; message: string } {
  // Cannot flee from boss battles
  if (isBossBattle) {
    return { success: false, message: 'Cannot flee from boss battle!' };
  }

  // Calculate average speed
  const alivePlayerUnits = playerUnits.filter(u => !isUnitKO(u));
  const aliveEnemyUnits = enemyUnits.filter(u => !isUnitKO(u));

  if (alivePlayerUnits.length === 0) {
    return { success: false, message: 'No units alive to flee!' };
  }

  const playerAvgSpeed = alivePlayerUnits.reduce((sum, u) => sum + u.baseStats.spd, 0) / alivePlayerUnits.length;
  const enemyAvgSpeed = aliveEnemyUnits.reduce((sum, u) => sum + u.baseStats.spd, 0) / aliveEnemyUnits.length;

  const BASE_FLEE_CHANCE = 0.5;
  const speedRatio = playerAvgSpeed / enemyAvgSpeed;
  const fleeChance = BASE_FLEE_CHANCE * speedRatio;

  // Clamp between 10% and 90%
  const finalChance = Math.max(0.1, Math.min(0.9, fleeChance));

  const success = rng.next() < finalChance;

  return {
    success,
    message: success ? 'Successfully fled!' : 'Failed to flee!',
  };
}

