import { Result, Ok, Err } from '@/utils/Result';
import type { Unit } from '@/types/Unit';
import type { UnitDefinition } from '@/types/Unit';
import { Unit as UnitClass } from '@/types/Unit';

/**
 * Party Service - Pure business logic for party management
 */
export class PartyService {
  /**
   * Set active party (1-4 units)
   */
  static setActiveParty(
    unitsCollected: Unit[],
    unitIds: string[]
  ): Result<string[], string> {
    // Validate party size
    if (unitIds.length < 1 || unitIds.length > 4) {
      return Err('Active party must have 1-4 units');
    }
    
    // Validate all unit IDs exist
    const allExist = unitIds.every(id =>
      unitsCollected.some(u => u.id === id)
    );
    
    if (!allExist) {
      return Err('One or more units not found in collection');
    }
    
    return Ok(unitIds);
  }
  
  /**
   * Recruit a new unit
   */
  static recruitUnit(
    unitsCollected: Unit[],
    unitDefinition: UnitDefinition,
    level: number = 1
  ): Result<Unit, string> {
    // Check if unit already recruited
    const alreadyRecruited = unitsCollected.some(u => u.id === unitDefinition.id);
    if (alreadyRecruited) {
      return Err(`Unit ${unitDefinition.id} already recruited`);
    }
    
    // Check if bench full (max 10 units)
    if (unitsCollected.length >= 10) {
      return Err('Maximum unit collection reached (10 units)');
    }
    
    // Create new unit instance
    const newUnit = new UnitClass(unitDefinition, level);
    
    return Ok(newUnit);
  }
  
  /**
   * Get active party units
   */
  static getActiveParty(
    unitsCollected: Unit[],
    activePartyIds: string[]
  ): Unit[] {
    return unitsCollected.filter(u => activePartyIds.includes(u.id));
  }
  
  /**
   * Get benched units (not in active party)
   */
  static getBenchedUnits(
    unitsCollected: Unit[],
    activePartyIds: string[]
  ): Unit[] {
    return unitsCollected.filter(u => !activePartyIds.includes(u.id));
  }
}


