import { Result, Ok, Err } from '@/utils/Result';
import type { Unit } from '@/types/Unit';
import type { Equipment, EquipmentSlot } from '@/types/Equipment';
import type { Stats } from '@/types/Stats';
import { calculateEquipmentBonuses } from '@/types/Equipment';
import type { UnitModel } from '@/core/models/Unit';
import { cloneUnitModel } from '@/core/models/Unit';
import { ABILITIES } from '@/data/abilities';

/**
 * Equipment Service - Pure business logic for equipment operations
 * No React dependencies, fully testable
 * Works with both Unit class and UnitModel
 */
export class EquipmentService {
  /**
   * Equip an item to a unit
   * Returns a new unit instance (immutable)
   */
  static equipItem(
    unit: Unit | UnitModel,
    slot: EquipmentSlot,
    item: Equipment
  ): Result<Unit | UnitModel, string> {
    // Validation
    if (!this.isValidSlot(item, slot)) {
      return Err(`${item.name} cannot be equipped in ${slot} slot`);
    }
    
    if (!this.canEquip(unit, item)) {
      const levelReq = item.statBonus?.atk ? ' (level requirement check)' : '';
      return Err(`${unit.name} cannot equip ${item.name}${levelReq}`);
    }
    
    // Handle Unit class (legacy)
    if ('clone' in unit && typeof unit.clone === 'function') {
      const updatedUnit = (unit as Unit).clone();
      updatedUnit.equipItem(slot, item);
      return Ok(updatedUnit);
    }
    
    // Handle UnitModel (new plain object)
    const updatedUnit = cloneUnitModel(unit as UnitModel);
    updatedUnit.equipment[slot] = item;
    
    // Update unlocked abilities
    const equipmentAbilities: string[] = [];
    for (const equipmentItem of Object.values(updatedUnit.equipment)) {
      if (equipmentItem?.unlocksAbility) {
        equipmentAbilities.push(equipmentItem.unlocksAbility);
      }
    }
    
    // Combine level-based abilities with equipment abilities
    const levelAbilities = updatedUnit.abilities
      .filter(a => a.unlockLevel <= updatedUnit.level)
      .map(a => a.id);
    
    updatedUnit.unlockedAbilityIds = Array.from(new Set([...levelAbilities, ...equipmentAbilities]));
    
    return Ok(updatedUnit);
  }
  
  /**
   * Unequip an item from a unit
   */
  static unequipItem(
    unit: Unit | UnitModel,
    slot: EquipmentSlot
  ): Result<{ unit: Unit | UnitModel; item: Equipment | null }, string> {
    if (!unit.equipment[slot]) {
      return Err(`No item equipped in ${slot} slot`);
    }
    
    const unequippedItem = unit.equipment[slot];
    
    // Handle Unit class (legacy)
    if ('clone' in unit && typeof unit.clone === 'function') {
      const updatedUnit = (unit as Unit).clone();
      updatedUnit.unequipItem(slot);
      return Ok({ unit: updatedUnit, item: unequippedItem });
    }
    
    // Handle UnitModel (new plain object)
    const updatedUnit = cloneUnitModel(unit as UnitModel);
    updatedUnit.equipment[slot] = null;
    
    // Update unlocked abilities (remove equipment ability if it was from this item)
    if (unequippedItem?.unlocksAbility) {
      updatedUnit.unlockedAbilityIds = updatedUnit.unlockedAbilityIds.filter(
        id => id !== unequippedItem.unlocksAbility
      );
    }
    
    return Ok({ unit: updatedUnit, item: unequippedItem });
  }
  
  /**
   * Calculate total stats from equipped items
   */
  static calculateEquippedStats(unit: Unit | UnitModel): Partial<Stats> {
    return calculateEquipmentBonuses(unit.equipment);
  }
  
  /**
   * Get abilities granted by equipped items
   */
  static getEquippedAbilities(unit: Unit | UnitModel): string[] {
    const abilities: string[] = [];
    
    for (const item of Object.values(unit.equipment)) {
      if (item?.unlocksAbility) {
        abilities.push(item.unlocksAbility);
      }
    }
    
    return abilities;
  }
  
  /**
   * Check if item can be equipped in slot
   */
  private static isValidSlot(item: Equipment, slot: EquipmentSlot): boolean {
    return item.slot === slot;
  }
  
  /**
   * Check if unit can equip item (level, class restrictions, etc.)
   */
  private static canEquip(unit: Unit | UnitModel, item: Equipment): boolean {
    // TODO: Add level requirements when equipment has them
    // TODO: Add class restrictions if needed
    return true;
  }
}
