import { EquipmentSchema, type ValidatedEquipment } from '@/data/schemas/EquipmentSchema';
import { Ok, Err, type Result } from '@/utils/Result';
import type { Equipment } from '@/types/Equipment';

/**
 * Validates equipment data at runtime
 */
export class EquipmentValidator {
  /**
   * Validate a single equipment item
   */
  static validate(equipment: unknown): Result<ValidatedEquipment, string[]> {
    const result = EquipmentSchema.safeParse(equipment);
    
    if (result.success) {
      return Ok(result.data);
    } else {
      const errors = result.error.errors.map(e => `${e.path.join('.')}: ${e.message}`);
      return Err(errors);
    }
  }
  
  /**
   * Validate all equipment in a record
   */
  static validateAll(equipment: Record<string, Equipment>): Result<Record<string, ValidatedEquipment>, string[]> {
    const errors: string[] = [];
    const validated: Record<string, ValidatedEquipment> = {};
    
    for (const [id, item] of Object.entries(equipment)) {
      const result = this.validate(item);
      if (result.ok) {
        validated[id] = result.value;
      } else {
        errors.push(`Equipment ${id}: ${result.error.join(', ')}`);
      }
    }
    
    return errors.length === 0 ? Ok(validated) : Err(errors);
  }
}


