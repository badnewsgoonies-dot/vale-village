import type { Item } from '@/types/Item';
import { createHealingItem, createPPItem, createStatusCureItem } from '@/types/Item';
import type { Equipment } from '@/types/Equipment';
import { EQUIPMENT } from './equipment';

/**
 * All consumable items available in the game
 */

export const ITEMS: Record<string, Item> = {
  healing_herb: createHealingItem(
    'healing_herb',
    'Healing Herb',
    50,
    10,
    'Restores 50 HP to one ally'
  ),

  herb: createHealingItem('herb', 'Herb', 80, 30, 'Restores 80 HP to one ally'),

  nut: createHealingItem('nut', 'Nut', 150, 60, 'Restores 150 HP to one ally'),

  mist_potion: createHealingItem(
    'mist_potion',
    'Mist Potion',
    300,
    150,
    'Restores all HP to one ally'
  ),

  antidote: createStatusCureItem(
    'antidote',
    'Antidote',
    ['poison'],
    20,
    'Cures poison from one ally'
  ),

  elixir: createStatusCureItem(
    'elixir',
    'Elixir',
    ['poison', 'burn', 'stun', 'sleep'],
    50,
    'Cures all status ailments from one ally'
  ),

  crystal_powder: createPPItem(
    'crystal_powder',
    'Crystal Powder',
    30,
    50,
    'Restores 30 PP to one ally'
  ),

  sacred_crystal: createPPItem(
    'sacred_crystal',
    'Sacred Crystal',
    100,
    200,
    'Restores 100 PP to one ally'
  ),

  revive: {
    id: 'revive',
    name: 'Revive',
    type: 'revive',
    description: 'Revives a fallen ally with 50% HP',
    cost: 100,
    sellPrice: 50,
    revive: true,
    revivePercent: 0.5,
    healAmount: 0,
    usableInBattle: true,
    usableOutOfBattle: true,
    targetType: 'single-ally',
  },
};

/**
 * Shop inventory definitions
 */

export interface ShopInventory {
  id: string;
  name: string;
  type: 'item' | 'equipment';
  items: string[]; // Item/Equipment IDs
  sellsEquipment?: boolean; // If equipment shop
  buybackRate: number; // Percentage of original price (0.5 = 50%)
}

export const VALE_VILLAGE_ITEM_SHOP: ShopInventory = {
  id: 'vale_item_shop',
  name: "Dora's Item Shop",
  type: 'item',
  items: ['healing_herb', 'herb', 'nut', 'antidote', 'crystal_powder', 'revive'],
  buybackRate: 0.5,
};

export const VALE_VILLAGE_EQUIPMENT_SHOP: ShopInventory = {
  id: 'vale_equipment_shop',
  name: "Brock's Armory",
  type: 'equipment',
  items: [
    // Weapons
    'bronze_sword',
    'iron_sword',
    'steel_sword',
    // Armor
    'padded_armor',
    'iron_armor',
    'steel_armor',
    // Helms
    'bronze_helm',
    'iron_helm',
    'steel_helm',
    // Boots
    'leather_boots',
    'iron_boots',
    'steel_boots',
  ],
  sellsEquipment: true,
  buybackRate: 0.5,
};

/**
 * Get item by ID
 */
export function getItemById(itemId: string): Item | undefined {
  return ITEMS[itemId];
}

/**
 * Get equipment by ID
 */
export function getEquipmentById(equipmentId: string): Equipment | undefined {
  return EQUIPMENT[equipmentId];
}

/**
 * Get shop inventory items
 */
export function getShopItems(shop: ShopInventory): (Item | Equipment)[] {
  if (shop.type === 'item') {
    return shop.items.map((id) => ITEMS[id]).filter((item): item is Item => !!item);
  } else {
    return shop.items
      .map((id) => EQUIPMENT[id])
      .filter((equipment): equipment is Equipment => !!equipment);
  }
}

/**
 * Inn prices
 */
export const INN_BASE_PRICE = 50; // Base price to heal all party members

/**
 * Calculate inn price based on party size and level
 */
export function calculateInnPrice(partySize: number, averageLevel: number): number {
  return INN_BASE_PRICE + Math.floor(averageLevel * 5) * partySize;
}
