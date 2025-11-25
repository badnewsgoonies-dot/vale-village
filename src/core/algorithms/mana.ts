/**
 * Mana circle system algorithms
 * PR-MANA-QUEUE: Team-wide mana pool management
 */

import type { QueuedAction } from '../models/BattleState';
import type { Ability } from '../../data/schemas/AbilitySchema';

/**
 * Check if action can be afforded with remaining mana
 *
 * @param remainingMana - Current mana pool
 * @param manaCost - Cost of the action
 * @returns True if action can be afforded
 */
export function canAffordAction(remainingMana: number, manaCost: number): boolean {
  return remainingMana >= manaCost;
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
 * Calculate total mana cost of all queued actions
 *
 * @param queuedActions - Array of queued actions (null if not queued)
 * @returns Total mana cost
 */
export function calculateTotalQueuedManaCost(
  queuedActions: readonly (QueuedAction | null)[]
): number {
  return queuedActions
    .filter((action): action is QueuedAction => action !== null)
    .reduce((total, action) => total + action.manaCost, 0);
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
  queuedActions: readonly (QueuedAction | null)[]
): boolean {
  const totalCost = calculateTotalQueuedManaCost(queuedActions);
  return totalCost <= remainingMana;
}

/**
 * Check if all unit actions are queued
 *
 * @param queuedActions - Array of queued actions
 * @param teamSize - Expected team size (1-4). If not provided, uses queuedActions.length
 * @returns True if all actions are queued
 */
export function isQueueComplete(
  queuedActions: readonly (QueuedAction | null)[],
  teamSize?: number
): boolean {
  const expectedSize = teamSize ?? queuedActions.length;
  if (expectedSize < 1 || expectedSize > 4) {
    throw new Error(`Team size must be between 1 and 4, got ${expectedSize}`);
  }
  return queuedActions.length === expectedSize && queuedActions.every(action => action !== null);
}