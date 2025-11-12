/**
 * Djinn synergy calculation algorithms
 * Pure functions, deterministic
 * PR-DJINN-CORE: Extended with activation, summon, and recovery logic
 */

import type { Element } from '../models/types';
import type { Team } from '../models/Team';

/**
 * Djinn synergy bonus when multiple Djinn equipped
 * From GAME_MECHANICS.md Section 2.1
 */
export interface DjinnSynergy {
  atk: number;
  def: number;
  spd?: number;
  classChange: string;
  abilitiesUnlocked: readonly string[];
}

/**
 * Summon damage values based on number of Djinn activated
 * From QUEUE_BATTLE_SYSTEM_PLAN.md
 */
export const DJINN_SUMMON_DAMAGE = {
  1: 80,   // Individual attack
  2: 150,  // Medium summon
  3: 300,  // Mega summon (to all enemies)
} as const;

/**
 * Calculate Djinn synergy based on elements
 * From GAME_MECHANICS.md Section 2.1
 * 🚨 CRITICAL: Synergy scales with Djinn COUNT!
 */
export function calculateDjinnSynergy(djinnElements: readonly Element[]): DjinnSynergy {
  if (djinnElements.length === 0) {
    return {
      atk: 0,
      def: 0,
      classChange: 'Base',
      abilitiesUnlocked: [],
    };
  }

  const elementCounts = new Map<Element, number>();

  for (const element of djinnElements) {
    elementCounts.set(element, (elementCounts.get(element) || 0) + 1);
  }

  const uniqueElements = elementCounts.size;
  const maxCount = Math.max(...Array.from(elementCounts.values()));
  const primaryElement = Array.from(elementCounts.entries())
    .find(([, count]) => count === maxCount)?.[0];

  // 1 Djinn (any element)
  if (djinnElements.length === 1) {
    return {
      atk: 4,
      def: 3,
      classChange: 'Adept',
      abilitiesUnlocked: [],
    };
  }

  // 2 Djinn - Same element
  if (djinnElements.length === 2 && uniqueElements === 1) {
    return {
      atk: 8,
      def: 5,
      classChange: `${primaryElement} Warrior`,
      abilitiesUnlocked: [],
    };
  }

  // 2 Djinn - Different elements
  if (djinnElements.length === 2 && uniqueElements === 2) {
    return {
      atk: 5,
      def: 5,
      classChange: 'Hybrid',
      abilitiesUnlocked: [],
    };
  }

  // 3 Djinn - All same element
  if (djinnElements.length === 3 && uniqueElements === 1) {
    return {
      atk: 12,
      def: 8,
      classChange: `${primaryElement} Adept`,
      abilitiesUnlocked: [`${primaryElement}-Ultimate`],
    };
  }

  // 3 Djinn - 2 same + 1 different
  if (djinnElements.length === 3 && uniqueElements === 2 && maxCount === 2) {
    return {
      atk: 8,
      def: 6,
      classChange: `${primaryElement} Knight`,
      abilitiesUnlocked: ['Hybrid-Spell'],
    };
  }

  // 3 Djinn - All different elements
  return {
    atk: 4,
    def: 4,
    spd: 4,
    classChange: 'Mystic',
    abilitiesUnlocked: ['Elemental Harmony'],
  };
}

/**
 * Get Set Djinn IDs from team (only Set Djinn contribute to bonuses)
 * PR-DJINN-CORE: Filters Djinn by state
 * 
 * @param team - Player's team
 * @returns Array of Djinn IDs that are in 'Set' state
 */
export function getSetDjinnIds(team: Team): readonly string[] {
  return team.equippedDjinn.filter(djinnId => {
    const tracker = team.djinnTrackers[djinnId];
    return tracker?.state === 'Set';
  });
}

/**
 * Calculate summon damage based on number of Djinn activated
 * PR-DJINN-CORE: Returns damage value for summon
 * 
 * @param djinnCount - Number of Djinn activated (1, 2, or 3)
 * @returns Base damage value
 */
export function calculateSummonDamage(djinnCount: 1 | 2 | 3): number {
  return DJINN_SUMMON_DAMAGE[djinnCount];
}

/**
 * Check if Djinn can be activated (must be in Set state)
 * PR-DJINN-CORE: Validates activation eligibility
 * 
 * @param team - Player's team
 * @param djinnId - Djinn ID to check
 * @returns True if Djinn can be activated
 */
export function canActivateDjinn(team: Team, djinnId: string): boolean {
  if (!team.equippedDjinn.includes(djinnId)) {
    return false; // Not equipped
  }
  
  const tracker = team.djinnTrackers[djinnId];
  return tracker?.state === 'Set';
}

/**
 * Get Djinn recovery order from team
 * PR-DJINN-CORE: Returns Djinn IDs that are ready to recover (Standby for 2+ turns)
 * 
 * @param team - Player's team
 * @param currentRound - Current round number
 * @returns Array of Djinn IDs ready for recovery
 */
export function getDjinnReadyForRecovery(
  team: Team,
  currentRound: number
): readonly string[] {
  return team.equippedDjinn.filter(djinnId => {
    const tracker = team.djinnTrackers[djinnId];
    if (!tracker || tracker.state !== 'Standby') {
      return false;
    }
    
    // Check if Djinn has been in Standby for 2+ rounds
    const roundsInStandby = currentRound - (tracker.lastActivatedTurn || 0);
    return roundsInStandby >= 2;
  });
}

