import type { Stats } from './Stats';

/**
 * Equipment slots (from GAME_MECHANICS.md Section 3)
 */
export type EquipmentSlot = 'weapon' | 'armor' | 'helm' | 'boots';

/**
 * Equipment tiers
 */
export type EquipmentTier = 'basic' | 'iron' | 'steel' | 'legendary';

/**
 * Equipment item definition
 */
export interface Equipment {
  id: string;
  name: string;
  slot: EquipmentSlot;
  tier: EquipmentTier;
  cost: number;

  // Stat bonuses
  statBonus: Partial<Stats>;

  // Special properties
  unlocksAbility?: string;      // Legendary equipment unlocks abilities
  elementalResist?: number;     // e.g., 0.2 = 20% reduction
  evasion?: number;             // Dodge chance bonus (percentage)
  alwaysFirstTurn?: boolean;    // Hermes' Sandals property
}

/**
 * Equipment loadout for a unit (4 slots)
 */
export interface EquipmentLoadout {
  weapon: Equipment | null;
  armor: Equipment | null;
  helm: Equipment | null;
  boots: Equipment | null;
}

/**
 * Create empty equipment loadout
 */
export function emptyLoadout(): EquipmentLoadout {
  return {
    weapon: null,
    armor: null,
    helm: null,
    boots: null,
  };
}

/**
 * Calculate total stat bonuses from equipment
 */
export function calculateEquipmentBonuses(loadout: EquipmentLoadout): Partial<Stats> {
  const totals: Partial<Stats> = {};

  for (const item of Object.values(loadout)) {
    if (!item) continue;

    for (const [stat, value] of Object.entries(item.statBonus)) {
      if (value !== undefined && value !== null && typeof value === 'number') {
        const key = stat as keyof Stats;
        const currentValue = totals[key] as number | undefined;
        (totals as any)[key] = (currentValue || 0) + value;
      }
    }
  }

  return totals;
}
