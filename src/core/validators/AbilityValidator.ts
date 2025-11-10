import { AbilitySchema, type ValidatedAbility } from '@/data/schemas/AbilitySchema';
import { Ok, Err, type Result } from '@/utils/Result';
import type { Ability } from '@/types/Ability';

/**
 * Validates ability data at runtime
 */
export class AbilityValidator {
  /**
   * Validate a single ability
   */
  static validate(ability: unknown): Result<ValidatedAbility, string[]> {
    const result = AbilitySchema.safeParse(ability);
    
    if (result.success) {
      return Ok(result.data);
    } else {
      const errors = result.error.errors.map(e => `${e.path.join('.')}: ${e.message}`);
      return Err(errors);
    }
  }
  
  /**
   * Validate all abilities in a record
   */
  static validateAll(abilities: Record<string, Ability>): Result<Record<string, ValidatedAbility>, string[]> {
    const errors: string[] = [];
    const validated: Record<string, ValidatedAbility> = {};
    
    for (const [id, ability] of Object.entries(abilities)) {
      const result = this.validate(ability);
      if (result.ok) {
        validated[id] = result.value;
      } else {
        errors.push(`Ability ${id}: ${result.error.join(', ')}`);
      }
    }
    
    return errors.length === 0 ? Ok(validated) : Err(errors);
  }
  
  /**
   * Validate and fix common issues (like negative values)
   */
  static validateAndFix(ability: Ability): Result<ValidatedAbility, string[]> {
    // Fix negative values
    const fixed: Ability = {
      ...ability,
      manaCost: Math.max(0, ability.manaCost),
      basePower: Math.max(0, ability.basePower),
    };
    
    return this.validate(fixed);
  }
}


