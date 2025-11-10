/**
 * Validates all game data at startup
 * Should be called before game starts
 */
import { AbilitySchema } from '../../data/schemas/AbilitySchema';
import { EquipmentSchema } from '../../data/schemas/EquipmentSchema';
import { UnitDefinitionSchema } from '../../data/schemas/UnitSchema';
import { EnemySchema } from '../../data/schemas/EnemySchema';
import { ABILITIES } from '../../data/definitions/abilities';
import { EQUIPMENT } from '../../data/definitions/equipment';
import { UNIT_DEFINITIONS } from '../../data/definitions/units';
import { ENEMIES } from '../../data/definitions/enemies';

export function validateAllGameData(): void {
  const errors: string[] = [];
  
  // Validate abilities
  Object.entries(ABILITIES).forEach(([id, ability]) => {
    const result = AbilitySchema.safeParse(ability);
    if (!result.success) {
      const errorMessages = result.error.errors.map(e => 
        `${e.path.join('.')}: ${e.message}`
      ).join(', ');
      errors.push(`Ability ${id}: ${errorMessages}`);
    }
  });
  
  // Validate equipment
  Object.entries(EQUIPMENT).forEach(([id, equipment]) => {
    const result = EquipmentSchema.safeParse(equipment);
    if (!result.success) {
      const errorMessages = result.error.errors.map(e => 
        `${e.path.join('.')}: ${e.message}`
      ).join(', ');
      errors.push(`Equipment ${id}: ${errorMessages}`);
    }
  });
  
  // Validate unit definitions
  Object.entries(UNIT_DEFINITIONS).forEach(([id, unit]) => {
    const result = UnitDefinitionSchema.safeParse(unit);
    if (!result.success) {
      const errorMessages = result.error.errors.map(e => 
        `${e.path.join('.')}: ${e.message}`
      ).join(', ');
      errors.push(`Unit ${id}: ${errorMessages}`);
    }
  });
  
  // Validate enemies
  Object.entries(ENEMIES).forEach(([id, enemy]) => {
    const result = EnemySchema.safeParse(enemy);
    if (!result.success) {
      const errorMessages = result.error.errors.map(e => 
        `${e.path.join('.')}: ${e.message}`
      ).join(', ');
      errors.push(`Enemy ${id}: ${errorMessages}`);
    }
  });
  
  if (errors.length > 0) {
    throw new Error(`Data validation failed:\n${errors.join('\n')}`);
  }
  
  // Use console.warn instead of console.log (allowed in validation)
  console.warn('✅ All game data validated successfully');
}

