/**
 * Equipment model (POJO)
 * Following ADR 003: Plain objects with readonly properties
 * REFACTORED: Element-based equipment restrictions (allowedElements, not allowedUnits)
 */

import type { Stats, Element } from './types';

/**
 * Equipment slots
 */
export type EquipmentSlot = 'weapon' | 'armor' | 'helm' | 'boots' | 'accessory';

/**
 * Equipment tiers
 */
export type EquipmentTier = 'basic' | 'bronze' | 'iron' | 'steel' | 'silver' | 'mythril' | 'legendary' | 'artifact';

/**
 * Equipment item definition
 * REFACTORED: allowedUnits → allowedElements (element-based restrictions)
 */
export interface Equipment {
  readonly id: string;
  readonly name: string;
  readonly slot: EquipmentSlot;
  readonly tier: EquipmentTier;
  readonly cost: number;
  readonly allowedElements: readonly Element[]; // CHANGED: Element-based restrictions

  // Stat bonuses
  readonly statBonus: Partial<Stats>;

  // Special properties
  readonly unlocksAbility?: string;      // Legendary equipment unlocks abilities
  readonly elementalResist?: number;     // e.g., 0.2 = 20% reduction
  readonly alwaysFirstTurn?: boolean;    // Hermes' Sandals property
}

/**
 * Equipment loadout for a unit (5 slots)
 */
export interface EquipmentLoadout {
  weapon: Equipment | null;
  armor: Equipment | null;
  helm: Equipment | null;
  boots: Equipment | null;
  accessory: Equipment | null;
}

/**
 * Create empty equipment loadout
 */
export function createEmptyLoadout(): EquipmentLoadout {
  return {
    weapon: null,
    armor: null,
    helm: null,
    boots: null,
    accessory: null,
  };
}

/**
 * Calculate total stat bonuses from equipment
 */
export function calculateEquipmentBonuses(loadout: EquipmentLoadout): Partial<Stats> {
  const totals: Partial<Record<keyof Stats, number>> = {};

  for (const item of Object.values(loadout)) {
    if (!item) continue;

    for (const stat of Object.keys(item.statBonus) as Array<keyof Stats>) {
      const value = item.statBonus[stat];
      if (value !== undefined && value !== null && typeof value === 'number') {
        totals[stat] = (totals[stat] ?? 0) + value;
      }
    }
  }

  return totals;
}
