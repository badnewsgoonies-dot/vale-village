import type { Equipment } from '../../data/schemas/EquipmentSchema';
import type { Unit } from '../models/Unit';

/**
 * Determine whether a unit can equip the specified item.
 * REFACTORED: Element-based restrictions (not unit-specific)
 * Pure helper used by UI/service layers before applying equipment.
 */
export function canEquipItem(unit: Unit, equipment: Equipment): boolean {
  return equipment.allowedElements.includes(unit.element);
}

/**
 * Filter the provided equipment list by unit element.
 * REFACTORED: Uses element instead of unit ID
 */
export function getEquippableItems(
  equipmentList: readonly Equipment[],
  unit: Unit
): Equipment[] {
  return equipmentList.filter(eq => eq.allowedElements.includes(unit.element));
}
