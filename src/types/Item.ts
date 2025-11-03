/**
 * Consumable items like healing herbs, antidotes, etc.
 */

export type ItemType = 'healing' | 'pp_restore' | 'revive' | 'status_cure' | 'battle';

export interface Item {
  id: string;
  name: string;
  type: ItemType;
  description: string;
  cost: number;
  sellPrice: number; // Usually half of cost

  // Effects
  healAmount?: number; // HP restored
  ppAmount?: number; // PP restored
  revive?: boolean; // Can revive KO'd units
  revivePercent?: number; // % of HP restored on revive (0.5 = 50%)
  curesStatus?: string[]; // Status effects cured (e.g., ['poison', 'burn'])

  // Usability
  usableInBattle: boolean;
  usableOutOfBattle: boolean;
  targetType: 'single-ally' | 'all-allies' | 'self';
}

/**
 * Helper to create a basic healing item
 */
export function createHealingItem(
  id: string,
  name: string,
  healAmount: number,
  cost: number,
  description: string
): Item {
  return {
    id,
    name,
    type: 'healing',
    description,
    cost,
    sellPrice: Math.floor(cost / 2),
    healAmount,
    usableInBattle: true,
    usableOutOfBattle: true,
    targetType: 'single-ally',
  };
}

/**
 * Helper to create a PP restore item
 */
export function createPPItem(
  id: string,
  name: string,
  ppAmount: number,
  cost: number,
  description: string
): Item {
  return {
    id,
    name,
    type: 'pp_restore',
    description,
    cost,
    sellPrice: Math.floor(cost / 2),
    ppAmount,
    usableInBattle: true,
    usableOutOfBattle: true,
    targetType: 'single-ally',
  };
}

/**
 * Helper to create a status cure item
 */
export function createStatusCureItem(
  id: string,
  name: string,
  curesStatus: string[],
  cost: number,
  description: string
): Item {
  return {
    id,
    name,
    type: 'status_cure',
    description,
    cost,
    sellPrice: Math.floor(cost / 2),
    curesStatus,
    usableInBattle: true,
    usableOutOfBattle: true,
    targetType: 'single-ally',
  };
}
