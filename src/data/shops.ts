import type { Equipment } from '@/types/Equipment';
import { EQUIPMENT } from './equipment';

/**
 * Shop inventory definitions
 * 
 * DESIGN NOTE: No consumable items in this game.
 * Healing/buffs are handled by abilities (Ply, Wish, etc.).
 * Shops sell equipment only (Weapons, Armor, Helms, Boots).
 */

export interface ShopInventory {
  id: string;
  name: string;
  type: 'equipment';
  items: string[]; // Equipment IDs
  buybackRate: number; // Percentage of original price (0.5 = 50%)
}

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
  buybackRate: 0.5,
};

/**
 * Get equipment by ID
 */
export function getEquipmentById(equipmentId: string): Equipment | undefined {
  return EQUIPMENT[equipmentId];
}

/**
 * Get shop inventory items (equipment only)
 */
export function getShopItems(shop: ShopInventory): Equipment[] {
  return shop.items
    .map((id) => EQUIPMENT[id])
    .filter((equipment): equipment is Equipment => !!equipment);
}

/**
 * Inn prices - Fixed at 10 gold per rest
 */
export const INN_BASE_PRICE = 10; // Fixed price: full HP/PP restore + status cure

/**
 * Calculate inn price (always 10 gold)
 */
export function calculateInnPrice(): number {
  return INN_BASE_PRICE;
}
