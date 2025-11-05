import type { Unit } from './Unit';
import type { Team } from './Team';
import type { Ability } from './Ability';
import { getElementModifier } from './Element';
import { Ok, Err, type Result } from '@/utils/Result';
import type { RNG } from '@/utils/SeededRNG';
import { globalRNG } from '@/utils/SeededRNG';
import {
  calculateBattleRewards,
  distributeRewards,
  type EnemyReward,
  type RewardDistribution,
} from './BattleRewards';

/**
 * Battle result types
 * From GAME_MECHANICS.md Section 6.3
 */
export enum BattleResult {
  PLAYER_VICTORY = 'PLAYER_VICTORY',
  PLAYER_DEFEAT = 'PLAYER_DEFEAT',
  PLAYER_FLEE = 'PLAYER_FLEE',
}

/**
 * Battle status (ongoing or ended)
 */
export type BattleStatus = 'ongoing' | BattleResult;

/**
 * Action result for executing abilities
 */
export interface ActionResult {
  damage?: number;
  healing?: number;
  critical?: boolean;
  message: string;
  targetIds: string[];
}

/**
 * Battle state
 * Tracks current battle state including units, turn order, and battle status
 */
export interface BattleState {
  /** Player's team */
  playerTeam: Team;

  /** Enemy units */
  enemies: Unit[];

  /** Current turn number (for Djinn recovery tracking) */
  currentTurn: number;

  /** Turn order (SPD-sorted) */
  turnOrder: Unit[];

  /** Index of current acting unit in turnOrder */
  currentActorIndex: number;

  /** Battle status */
  status: BattleStatus;

  /** Battle log (for UI display) */
  log: string[];
}

/**
 * Create initial battle state
 */
export function createBattleState(playerTeam: Team, enemies: Unit[], rng: RNG = globalRNG): BattleState {
  const allUnits = [...playerTeam.units, ...enemies];
  const turnOrder = calculateTurnOrder(allUnits, rng);

  return {
    playerTeam,
    enemies,
    currentTurn: 0,
    turnOrder,
    currentActorIndex: 0,
    status: 'ongoing',
    log: [],
  };
}

/**
 * Calculate turn order based on SPD stat
 * From GAME_MECHANICS.md Section 6.1
 *
 * Highest SPD goes first, with tiebreaker randomization
 * Special case: Hermes' Sandals always go first
 */
export function calculateTurnOrder(units: Unit[], rng: RNG = globalRNG): Unit[] {
  // Filter out KO'd units
  const aliveUnits = units.filter(u => !u.isKO);

  // Check for Hermes' Sandals (always first)
  const hermesUnits = aliveUnits.filter(u =>
    u.equipment.boots?.alwaysFirstTurn === true
  );

  const regularUnits = aliveUnits.filter(u =>
    u.equipment.boots?.alwaysFirstTurn !== true
  );

  // Sort by SPD (descending)
  regularUnits.sort((a, b) => {
    const spdDiff = b.stats.spd - a.stats.spd;
    // Tiebreaker: random
    if (spdDiff === 0) {
      return rng.next() - 0.5;
    }
    return spdDiff;
  });

  // Hermes' Sandals first, then regular units
  return [...hermesUnits, ...regularUnits];
}

/**
 * Get random damage multiplier (±10% variance)
 * From GAME_MECHANICS.md Section 5.2
 */
export function getRandomMultiplier(rng: RNG = globalRNG): number {
  return 0.9 + (rng.next() * 0.2);
}

/**
 * Check for critical hit
 * From GAME_MECHANICS.md Section 6.2
 *
 * Base 5% + 0.2% per SPD point
 * Critical hits deal 2.0x damage
 */
export function checkCriticalHit(attacker: Unit, rng: RNG = globalRNG): boolean {
  const BASE_CRIT_CHANCE = 0.05;
  const SPEED_BONUS = attacker.stats.spd * 0.002;

  const totalChance = BASE_CRIT_CHANCE + SPEED_BONUS;

  return rng.next() < totalChance;
}

/**
 * Calculate physical damage
 * From GAME_MECHANICS.md Section 5.2
 *
 * Formula: (basePower + ATK - (DEF × 0.5)) × randomMultiplier
 */
export function calculatePhysicalDamage(
  attacker: Unit,
  defender: Unit,
  ability: Ability,
  rng: RNG = globalRNG
): number {
  const baseDamage = ability.basePower || attacker.stats.atk;
  const attackPower = attacker.stats.atk;
  const defense = defender.stats.def;

  const damage = Math.floor(
    (baseDamage + attackPower - (defense * 0.5)) * getRandomMultiplier(rng)
  );

  return Math.max(1, damage);
}

/**
 * Calculate Psynergy (magic) damage
 * From GAME_MECHANICS.md Section 5.2
 *
 * Formula: (basePower + MAG - (DEF × 0.3)) × elementModifier × randomMultiplier
 * Includes element advantage system
 */
export function calculatePsynergyDamage(
  attacker: Unit,
  defender: Unit,
  ability: Ability,
  rng: RNG = globalRNG
): number {
  const basePower = ability.basePower || 0;
  const magicPower = attacker.stats.mag;
  const magicDefense = defender.stats.def * 0.3;

  // Element advantage/disadvantage (1.5x / 0.67x / 1.0x)
  const elementModifier = ability.element
    ? getElementModifier(ability.element, defender.element)
    : 1.0;

  const damage = Math.floor(
    (basePower + magicPower - magicDefense) * elementModifier * getRandomMultiplier(rng)
  );

  return Math.max(1, damage);
}

/**
 * Calculate healing amount (Bug #13 fix)
 * From GAME_MECHANICS.md Section 5.2
 *
 * Formula: (basePower + MAG) × randomMultiplier
 */
export function calculateHealAmount(
  caster: Unit,
  ability: Ability,
  rng: RNG = globalRNG
): number {
  const baseHeal = ability.basePower || 0;

  // CRITICAL: Validate healing abilities have non-negative power
  if (baseHeal < 0) {
    console.error(`Healing ability ${ability.name} has negative basePower: ${baseHeal}`);
    return 0; // Clamp to 0 (safer than throwing error)
  }

  const magicPower = caster.stats.mag;

  const healAmount = Math.floor(
    (baseHeal + magicPower) * getRandomMultiplier(rng)
  );

  // ALWAYS clamp final result to minimum 0
  return Math.max(0, healAmount);
}

/**
 * Execute an ability in battle
 * Handles damage, healing, buffs, and debuffs
 *
 * NOTE: AOE abilities deal FULL damage to each target (not split)
 * From GAME_MECHANICS.md Section 5.2.5
 */
export function executeAbility(
  caster: Unit,
  ability: Ability,
  targets: Unit[],
  rng: RNG = globalRNG
): ActionResult {
  const targetIds = targets.map(t => t.id);
  let message = `${caster.name} uses ${ability.name}!`;

  // CRITICAL: Validate PP cost is non-negative (Bug #12 fix)
  if (ability.ppCost < 0) {
    return {
      message: `Invalid ability: ${ability.name} has negative PP cost ${ability.ppCost}`,
      targetIds: [],
    };
  }

  // Check PP cost
  if (ability.ppCost > caster.currentPp) {
    return {
      message: `${caster.name} doesn't have enough PP!`,
      targetIds: [],
    };
  }

  // Deduct PP cost (safe now - we validated ppCost >= 0)
  caster.currentPp -= ability.ppCost;

  // Check for critical hit (physical and psynergy only)
  const isCritical = (ability.type === 'physical' || ability.type === 'psynergy')
    && checkCriticalHit(caster, rng);

  // Execute based on ability type
  switch (ability.type) {
    case 'physical':
    case 'psynergy': {
      let totalDamage = 0;

      for (const target of targets) {
        let damage = ability.type === 'physical'
          ? calculatePhysicalDamage(caster, target, ability, rng)
          : calculatePsynergyDamage(caster, target, ability, rng);

        // Apply critical hit multiplier
        if (isCritical) {
          damage = Math.floor(damage * 2.0);
        }

        const actualDamage = target.takeDamage(damage);
        caster.recordDamageDealt(actualDamage);
        totalDamage += actualDamage;
      }

      message += isCritical ? ' Critical hit!' : '';
      message += ` Deals ${totalDamage} damage!`;

      return {
        damage: totalDamage,
        critical: isCritical,
        message,
        targetIds,
      };
    }

    case 'healing': {
      let totalHealing = 0;

      for (const target of targets) {
        // CRITICAL: Handle revival separately (Bug #16 fix)
        if (ability.revivesFallen && target.isKO) {
          // Revival ONLY sets to 50% HP (doesn't add healing on top)
          target.currentHp = Math.floor(target.maxHp * 0.5);
          totalHealing += target.currentHp; // Count revival healing
        } else {
          // Normal healing (only works on alive units after Bug #6 fix)
          const healAmount = calculateHealAmount(caster, ability, rng);
          const actualHealing = target.heal(healAmount);
          totalHealing += actualHealing;
        }
      }

      message += ` Restores ${totalHealing} HP!`;

      return {
        healing: totalHealing,
        message,
        targetIds,
      };
    }

    case 'buff':
    case 'debuff': {
      // Apply status effects to targets
      for (const target of targets) {
        if (ability.buffEffect) {
          // Add status effect for each stat modifier
          for (const [stat, modifier] of Object.entries(ability.buffEffect)) {
            if (typeof modifier === 'number') {
              // Skip evasion as it's not part of core Stats type (handled separately)
              if (stat === 'evasion') continue;

              target.statusEffects.push({
                type: ability.type === 'buff' ? 'buff' : 'debuff',
                stat: stat as 'atk' | 'def' | 'mag' | 'spd',
                modifier,
                duration: ability.duration || 3,
              });
            }
          }
        }
      }

      message += ` Applied ${ability.type}!`;

      return {
        message,
        targetIds,
      };
    }

    default:
      return {
        message: `${caster.name} uses ${ability.name}! (Effect not implemented)`,
        targetIds,
      };
  }
}

/**
 * Check if battle has ended
 * From GAME_MECHANICS.md Section 6.3
 */
export function checkBattleEnd(playerUnits: Unit[], enemyUnits: Unit[]): BattleResult | null {
  const allPlayerKO = playerUnits.every(u => u.isKO);
  const allEnemiesKO = enemyUnits.every(u => u.isKO);

  if (allEnemiesKO) return BattleResult.PLAYER_VICTORY;
  if (allPlayerKO) return BattleResult.PLAYER_DEFEAT;

  return null;
}

/**
 * Attempt to flee from battle
 * From GAME_MECHANICS.md Section 6.4
 *
 * Base 50% chance, modified by speed ratio
 * Clamped between 10% and 90%
 */
export function attemptFlee(
  playerUnits: Unit[],
  enemyUnits: Unit[],
  isBossBattle: boolean = false,
  rng: RNG = globalRNG
): Result<boolean, string> {
  // Cannot flee from boss battles
  if (isBossBattle) {
    return Err('Cannot flee from boss battle!');
  }

  // Calculate average speed
  const alivePlayerUnits = playerUnits.filter(u => !u.isKO);
  const aliveEnemyUnits = enemyUnits.filter(u => !u.isKO);

  if (alivePlayerUnits.length === 0) {
    return Err('No units alive to flee!');
  }

  const playerAvgSpeed = alivePlayerUnits.reduce((sum, u) => sum + u.stats.spd, 0) / alivePlayerUnits.length;
  const enemyAvgSpeed = aliveEnemyUnits.reduce((sum, u) => sum + u.stats.spd, 0) / aliveEnemyUnits.length;

  const BASE_FLEE_CHANCE = 0.5;
  const speedRatio = playerAvgSpeed / enemyAvgSpeed;
  const fleeChance = BASE_FLEE_CHANCE * speedRatio;

  // Clamp between 10% and 90%
  const finalChance = Math.max(0.1, Math.min(0.9, fleeChance));

  const success = rng.next() < finalChance;

  return Ok(success);
}

/**
 * Advance to next turn
 * Updates turn order, processes status effects, and checks for battle end
 */
export function advanceBattleTurn(state: BattleState, rng: RNG = globalRNG): BattleState {
  // Move to next actor
  let nextIndex = state.currentActorIndex + 1;

  // If we've gone through all units, start new round
  if (nextIndex >= state.turnOrder.length) {
    nextIndex = 0;

    // Recalculate turn order (some units may be KO'd)
    const allUnits = [...state.playerTeam.units, ...state.enemies];
    const newTurnOrder = calculateTurnOrder(allUnits, rng);

    // Increment turn counter
    const newTurn = state.currentTurn + 1;

    // Process status effect durations
    for (const unit of allUnits) {
      unit.statusEffects = unit.statusEffects
        .map(effect => ({ ...effect, duration: effect.duration - 1 }))
        .filter(effect => effect.duration > 0);
    }

    return {
      ...state,
      currentTurn: newTurn,
      turnOrder: newTurnOrder,
      currentActorIndex: 0,
    };
  }

  return {
    ...state,
    currentActorIndex: nextIndex,
  };
}

/**
 * Get current acting unit
 */
export function getCurrentActor(state: BattleState): Unit | null {
  return state.turnOrder[state.currentActorIndex] || null;
}

/**
 * Check if unit belongs to player team
 */
export function isPlayerUnit(state: BattleState, unit: Unit): boolean {
  return state.playerTeam.units.some(u => u.id === unit.id);
}

/**
 * Restore PP after battle victory
 * From GAME_MECHANICS.md Section 5.2.6
 */
export function restorePPAfterBattle(units: Unit[]): void {
  for (const unit of units) {
    unit.currentPp = unit.maxPp;
  }
}

/**
 * Process battle victory and calculate rewards
 *
 * Called when battle ends with PLAYER_VICTORY result.
 * This function integrates the Battle system with the Battle Rewards system.
 *
 * Process:
 * 1. Convert defeated enemies to EnemyReward data
 * 2. Check if all party members survived
 * 3. Calculate XP and Gold rewards
 * 4. Distribute rewards to party
 * 5. Restore PP after battle
 *
 * @param battle - Current battle state (must have ended with victory)
 * @param rng - RNG instance for deterministic testing
 * @returns Distribution result with level-up events and rewards
 */
export function processBattleVictory(
  battle: BattleState,
  rng: RNG = globalRNG
): RewardDistribution {
  // Verify battle is actually won
  if (battle.status !== BattleResult.PLAYER_VICTORY && battle.status !== 'ongoing') {
    throw new Error('Can only process rewards for player victory');
  }

  // Convert enemies to reward data
  const enemyRewards: EnemyReward[] = battle.enemies.map(enemy => ({
    baseXp: 20, // Default values - in real game, would come from enemy definition
    baseGold: 15,
    level: enemy.level,
  }));

  // Check survival status
  const alivePlayerUnits = battle.playerTeam.units.filter(u => !u.isKO);
  const allSurvived = alivePlayerUnits.length === battle.playerTeam.units.length;
  const survivorCount = alivePlayerUnits.length;

  // Calculate rewards
  const rewards = calculateBattleRewards(
    enemyRewards,
    allSurvived,
    survivorCount,
    rng
  );

  // Distribute rewards
  const distribution = distributeRewards(battle.playerTeam, rewards);

  // Restore PP after battle
  restorePPAfterBattle(battle.playerTeam.units);

  return distribution;
}
