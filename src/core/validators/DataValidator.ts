import { validateAbilities } from '@/data/schemas/AbilitySchema';
import { EquipmentSchema } from '@/data/schemas/EquipmentSchema';
import { EnemySchema } from '@/data/schemas/EnemySchema';
import { ABILITIES } from '@/data/abilities';
import type { Ability } from '@/types/Ability';
import type { Equipment } from '@/types/Equipment';
import type { Enemy } from '@/data/enemies';
import { z } from 'zod';

/**
 * Data Validator - Validates all game data at startup
 * Part of Phase 1: Foundation
 */

export interface ValidationResult {
  success: boolean;
  errors: ValidationError[];
  warnings: string[];
}

export interface ValidationError {
  category: 'ability' | 'equipment' | 'enemy' | 'unit';
  id: string;
  field: string;
  message: string;
  value?: unknown;
}

/**
 * Validate all abilities
 */
export function validateAllAbilities(): ValidationResult {
  const abilityList = Object.values(ABILITIES) as Ability[];
  const result = validateAbilities(abilityList);
  
  const errors: ValidationError[] = [];
  const warnings: string[] = [];

  // Process validation errors
  result.errors.forEach(({ ability, error }) => {
    const abilityData = ability as Ability;
    error.errors.forEach((zodError: z.ZodIssue) => {
      errors.push({
        category: 'ability',
        id: abilityData.id || 'unknown',
        field: zodError.path.join('.'),
        message: zodError.message,
        value: zodError.path.length > 0 
          ? (abilityData as any)[zodError.path[0]] 
          : undefined,
      });
    });
  });

  // Check for common issues (warnings)
  result.valid.forEach((ability) => {
    // Warn if physical attack has manaCost > 0
    if (ability.type === 'physical' && ability.manaCost > 0) {
      warnings.push(
        `Ability "${ability.name}" (${ability.id}): Physical attacks typically have manaCost = 0`
      );
    }

    // Warn if healing ability has basePower = 0
    if (ability.type === 'healing' && ability.basePower === 0) {
      warnings.push(
        `Ability "${ability.name}" (${ability.id}): Healing abilities should have basePower > 0`
      );
    }

    // Warn if psynergy has no element
    if (ability.type === 'psynergy' && !ability.element) {
      warnings.push(
        `Ability "${ability.name}" (${ability.id}): Psynergy abilities should have an element`
      );
    }
  });

  return {
    success: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Validate all equipment
 */
export function validateAllEquipment(equipmentList: Equipment[]): ValidationResult {
  const errors: ValidationError[] = [];
  const warnings: string[] = [];

  equipmentList.forEach((item) => {
    const result = EquipmentSchema.safeParse(item);
    
    if (!result.success) {
      result.error.errors.forEach((zodError: z.ZodIssue) => {
        errors.push({
          category: 'equipment',
          id: item.id || 'unknown',
          field: zodError.path.join('.'),
          message: zodError.message,
          value: zodError.path.length > 0 
            ? (item as any)[zodError.path[0]] 
            : undefined,
        });
      });
    }

    // Warnings for equipment
    if (item.cost === 0) {
      warnings.push(
        `Equipment "${item.name}" (${item.id}): Cost is 0, should this be free?`
      );
    }

    if (Object.keys(item.statBonus).length === 0) {
      warnings.push(
        `Equipment "${item.name}" (${item.id}): No stat bonuses defined`
      );
    }
  });

  return {
    success: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Validate all enemies
 */
export function validateAllEnemies(enemies: Enemy[]): ValidationResult {
  const errors: ValidationError[] = [];
  const warnings: string[] = [];

  enemies.forEach((enemy) => {
    const result = EnemySchema.safeParse(enemy);
    
    if (!result.success) {
      result.error.errors.forEach((zodError: z.ZodIssue) => {
        errors.push({
          category: 'enemy',
          id: enemy.id || 'unknown',
          field: zodError.path.join('.'),
          message: zodError.message,
          value: zodError.path.length > 0 
            ? (enemy as any)[zodError.path[0]] 
            : undefined,
        });
      });
    }

    // Warnings for enemies
    if (enemy.baseXp === 0) {
      warnings.push(
        `Enemy "${enemy.name}" (${enemy.id}): Base XP is 0, gives no experience`
      );
    }

    if (enemy.abilities.length === 0) {
      warnings.push(
        `Enemy "${enemy.name}" (${enemy.id}): No abilities defined`
      );
    }

    if (enemy.stats.hp > 9999) {
      warnings.push(
        `Enemy "${enemy.name}" (${enemy.id}): HP exceeds 9999, may be too high`
      );
    }
  });

  return {
    success: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Validate all game data
 * Call this at app startup before rendering anything
 */
export function validateAllGameData(
  equipment?: Equipment[],
  enemies?: Enemy[]
): ValidationResult {
  const results: ValidationResult[] = [];

  // Validate abilities
  results.push(validateAllAbilities());

  // Validate equipment (if provided)
  if (equipment) {
    results.push(validateAllEquipment(equipment));
  }

  // Validate enemies (if provided)
  if (enemies) {
    results.push(validateAllEnemies(enemies));
  }

  // Combine all results
  const combinedErrors = results.flatMap((r) => r.errors);
  const combinedWarnings = results.flatMap((r) => r.warnings);

  return {
    success: combinedErrors.length === 0,
    errors: combinedErrors,
    warnings: combinedWarnings,
  };
}

/**
 * Format validation results for console logging
 */
export function formatValidationReport(result: ValidationResult): string {
  const lines: string[] = [];

  lines.push('=== Game Data Validation Report ===');
  lines.push('');

  if (result.success) {
    lines.push('✅ All data valid!');
  } else {
    lines.push(`❌ ${result.errors.length} error(s) found`);
  }

  if (result.warnings.length > 0) {
    lines.push(`⚠️  ${result.warnings.length} warning(s)`);
  }

  lines.push('');

  // Errors
  if (result.errors.length > 0) {
    lines.push('ERRORS:');
    result.errors.forEach((error) => {
      lines.push(
        `  [${error.category}] ${error.id}.${error.field}: ${error.message}`
      );
      if (error.value !== undefined) {
        lines.push(`    Current value: ${JSON.stringify(error.value)}`);
      }
    });
    lines.push('');
  }

  // Warnings
  if (result.warnings.length > 0) {
    lines.push('WARNINGS:');
    result.warnings.forEach((warning) => {
      lines.push(`  ${warning}`);
    });
  }

  lines.push('');
  lines.push('===================================');

  return lines.join('\n');
}
