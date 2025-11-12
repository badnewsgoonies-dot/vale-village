/**
 * Shop Service
 * Handles buying equipment
 */

import type { Result } from '../utils/result';
import { Ok, Err } from '../utils/result';
import type { Equipment } from '../models/Equipment';
import { EQUIPMENT } from '../../data/definitions/equipment';

/**
 * Check if player can afford an item
 */
export function canAffordItem(gold: number, itemId: string): boolean {
  const item = EQUIPMENT[itemId];
  if (!item) {
    return false;
  }
  return gold >= item.cost;
}

/**
 * Buy an item
 * Returns new gold amount and success status
 */
export function buyItem(gold: number, itemId: string): Result<{ success: boolean; newGold: number; item: Equipment }, string> {
  const item = EQUIPMENT[itemId];
  if (!item) {
    return Err(`Item ${itemId} not found`);
  }

  if (gold < item.cost) {
    return Err(`Cannot afford ${item.name}. Need ${item.cost}g, have ${gold}g`);
  }

  return Ok({
    success: true,
    newGold: gold - item.cost,
    item,
  });
}

/**
 * Get price for an item by tier (for reference)
 * Tier 1 = 100g, Tier 2 = 300g, Tier 3 = 800g, Tier 4 = 2000g
 */
export function getPriceByTier(tier: Equipment['tier']): number {
  const tierPrices: Record<Equipment['tier'], number> = {
    basic: 100,
    bronze: 300,
    iron: 800,
    steel: 2000,
    silver: 2000, // Same as steel
    mythril: 2000, // Same as steel
    legendary: 2000, // Same as steel
    artifact: 2000, // Same as steel
  };
  return tierPrices[tier] ?? 100;
}
