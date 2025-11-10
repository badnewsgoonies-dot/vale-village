import { AbilityValidator } from './AbilityValidator';
import { EquipmentValidator } from './EquipmentValidator';
import { ABILITIES } from '@/data/abilities';
import { EQUIPMENT } from '@/data/equipment';
import { Ok, Err, type Result } from '@/utils/Result';

/**
 * Main data validator - validates all game data at startup
 */
export class DataValidator {
  /**
   * Validate all game data files
   * Should be called at application startup
   */
  static validateAll(): Result<void, string[]> {
    const errors: string[] = [];
    
    // Validate abilities
    const abilitiesResult = AbilityValidator.validateAll(ABILITIES);
    if (!abilitiesResult.ok) {
      errors.push(...abilitiesResult.error);
    }
    
    // Validate equipment
    const equipmentResult = EquipmentValidator.validateAll(EQUIPMENT);
    if (!equipmentResult.ok) {
      errors.push(...equipmentResult.error);
    }
    
    // TODO: Add validation for enemies, units, djinn, etc.
    
    if (errors.length > 0) {
      console.error('Data validation errors:', errors);
      return Err(errors);
    }
    
    return Ok(undefined);
  }
  
  /**
   * Validate and log warnings (non-fatal)
   */
  static validateAndWarn(): void {
    const result = this.validateAll();
    if (!result.ok) {
      console.warn('Data validation warnings (non-fatal):', result.error);
    }
  }
}


