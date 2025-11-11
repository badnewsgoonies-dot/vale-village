/**
 * Mana circle system algorithms
 * PR-MANA-QUEUE: Team-wide mana pool management
 */

import type { Team } from '../models/Team';
import type { Ability } from '../../data/schemas/AbilitySchema';
import { calculateTeamManaPool } from '../models/BattleState';

/**
 * Calculate total team mana pool from unit contributions
 * 
 * @param team - Player's team
 * @returns Total mana circles available
 */
export function getTeamManaPool(team: Team): number {
  return calculateTeamManaPool(team);
}

/**
 * Get mana cost for an ability
 * Basic attacks (null abilityId) cost 0
 * 
 * @param abilityId - Ability ID or null for basic attack
 * @param ability - Ability definition (if not basic attack)
 * @returns Mana cost (0-10)
 */
export function getAbilityManaCost(
  abilityId: string | null,
  ability?: Ability
): number {
  if (abilityId === null) {
    // Basic attack is always free
    return 0;
  }
  
  if (!ability) {
    throw new Error(`Ability ${abilityId} not found`);
  }
  
  return ability.manaCost ?? 0;
}

/**
 * Check if action can be afforded with remaining mana
 * 
 * @param remainingMana - Current mana pool
 * @param manaCost - Cost of the action
 * @returns True if affordable
 */
export function canAffordAction(remainingMana: number, manaCost: number): boolean {
  return remainingMana >= manaCost;
}

/**
 * Calculate total mana cost of all queued actions
 * 
 * @param queuedActions - Array of queued actions (null if not queued)
 * @returns Total mana cost
 */
export function calculateTotalQueuedManaCost(
  queuedActions: readonly (import('../models/BattleState').QueuedAction | null)[]
): number {
  return queuedActions.reduce((total, action) => {
    if (!action) return total;
    return total + action.manaCost;
  }, 0);
}

/**
 * Validate that all queued actions are affordable
 * 
 * @param remainingMana - Current mana pool
 * @param queuedActions - Array of queued actions
 * @returns True if all actions are affordable
 */
export function validateQueuedActions(
  remainingMana: number,
  queuedActions: readonly (import('../models/BattleState').QueuedAction | null)[]
): boolean {
  const totalCost = calculateTotalQueuedManaCost(queuedActions);
  return canAffordAction(remainingMana, totalCost);
}

/**
 * Check if all 4 unit actions are queued
 * 
 * @param queuedActions - Array of queued actions
 * @returns True if all 4 actions are queued
 */
export function isQueueComplete(
  queuedActions: readonly (import('../models/BattleState').QueuedAction | null)[]
): boolean {
  return queuedActions.length === 4 && queuedActions.every(action => action !== null);
}

