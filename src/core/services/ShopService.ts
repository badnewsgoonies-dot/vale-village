/**
 * Shop Service
 * Handles buying equipment
 * REFACTORED: Element-based equipment system
 */

import type { Result } from '../utils/result';
import { Ok, Err } from '../utils/result';
import type { Equipment } from '../models/Equipment';
import type { Unit } from '../models/Unit';
import type { Element } from '../models/types';
import { EQUIPMENT } from '../../data/definitions/equipment';
import { getStarterKit } from '../../data/definitions/starterKits';
import { canEquipItem } from '../algorithms/equipment';

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
 * Purchase starter kit for a unit based on element
 * REFACTORED: Element-based kit system (not unit-specific)
 */
export function purchaseStarterKit(
  unit: { id: string; element: Element },
  currentGold: number
): Result<{ newGold: number; equipment: Equipment[] }, string> {
  const kit = getStarterKit(unit);

  if (currentGold < kit.cost) {
    return Err(`Insufficient gold. Need ${kit.cost}g, have ${currentGold}g`);
  }

  const equipmentIds = Object.values(kit.equipment);
  const equipmentList: Equipment[] = [];
  for (const id of equipmentIds) {
    const item = EQUIPMENT[id];
    if (!item) {
      return Err(`Equipment ${id} not found for ${kit.name}`);
    }
    equipmentList.push(item);
  }

  return Ok({
    newGold: currentGold - kit.cost,
    equipment: equipmentList,
  });
}

export function purchaseUnitEquipment(
  unit: Unit,
  gold: number,
  itemId: string
): Result<{ newGold: number; item: Equipment }, string> {
  const item = EQUIPMENT[itemId];
  if (!item) {
    return Err(`Item ${itemId} not found`);
  }

  if (!canEquipItem(unit, item)) {
    return Err(`${unit.name} cannot equip ${item.name}`);
  }

  if (gold < item.cost) {
    return Err(`Cannot afford ${item.name}. Need ${item.cost}g, have ${gold}g`);
  }

  return Ok({
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

