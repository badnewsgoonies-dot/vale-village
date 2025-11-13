import type { Equipment } from '../../data/schemas/EquipmentSchema';
import type { Unit } from '../models/Unit';

/**
 * Determine whether a unit can equip the specified item.
 * Pure helper used by UI/service layers before applying equipment.
 */
export function canEquipItem(unit: Unit, equipment: Equipment): boolean {
  return equipment.allowedUnits.includes(unit.id);
}

/**
 * Filter the provided equipment list by unit ID.
 */
export function getEquippableItems(
  equipmentList: readonly Equipment[],
  unitId: string
): Equipment[] {
  return equipmentList.filter(eq => eq.allowedUnits.includes(unitId));
}
