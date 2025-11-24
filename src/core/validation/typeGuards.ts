/**
 * Runtime Type Guards
 * Validates data at system boundaries (save files, external data, etc.)
 *
 * Uses existing Zod schemas to provide runtime validation where TypeScript can't help.
 *
 * Usage:
 * - Validate save files before loading
 * - Validate external data (network, localStorage, etc.)
 * - Protect against data corruption
 */

import type { BattleState } from '../models/BattleState';
import type { Team } from '../models/Team';
import type { Unit } from '../models/Unit';
import { BattleStateSchema } from '../../data/schemas/BattleStateSchema';
import { TeamSchema } from '../../data/schemas/TeamSchema';
import { UnitSchema } from '../../data/schemas/UnitSchema';
import { Result, Ok, Err } from '../utils/result';

/**
 * Type guard validation result
 */
export interface ValidationError {
  path: (string | number)[];
  message: string;
}

/**
 * Validate unknown data against BattleState schema
 * Returns validated BattleState or array of validation errors
 */
export function validateBattleStateData(data: unknown): Result<BattleState, ValidationError[]> {
  const result = BattleStateSchema.safeParse(data);

  if (result.success) {
    // Zod schema doesn't include unitById index, so we need to reconstruct it
    const validatedData = result.data as unknown as BattleState;

    // Build unitById index
    const unitById = new Map();
    for (const unit of validatedData.playerTeam.units) {
      unitById.set(unit.id, { unit, isPlayer: true });
    }
    for (const unit of validatedData.enemies) {
      unitById.set(unit.id, { unit, isPlayer: false });
    }

    return Ok({
      ...validatedData,
      unitById,
    });
  }

  const errors: ValidationError[] = result.error.errors.map(err => ({
    path: err.path,
    message: err.message,
  }));

  return Err(errors);
}

/**
 * Validate unknown data against Team schema
 */
export function validateTeam(data: unknown): Result<Team, ValidationError[]> {
  const result = TeamSchema.safeParse(data);

  if (result.success) {
    return Ok(result.data as Team);
  }

  const errors: ValidationError[] = result.error.errors.map(err => ({
    path: err.path,
    message: err.message,
  }));

  return Err(errors);
}

/**
 * Validate unknown data against Unit schema
 */
export function validateUnit(data: unknown): Result<Unit, ValidationError[]> {
  const result = UnitSchema.safeParse(data);

  if (result.success) {
    return Ok(result.data as Unit);
  }

  const errors: ValidationError[] = result.error.errors.map(err => ({
    path: err.path,
    message: err.message,
  }));

  return Err(errors);
}

/**
 * Type guard: Check if value is a string
 */
export function isString(value: unknown): value is string {
  return typeof value === 'string';
}

/**
 * Type guard: Check if value is a non-empty string
 */
export function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.length > 0;
}

/**
 * Type guard: Check if value is a number
 */
export function isNumber(value: unknown): value is number {
  return typeof value === 'number' && !Number.isNaN(value);
}

/**
 * Type guard: Check if value is a positive integer
 */
export function isPositiveInteger(value: unknown): value is number {
  return isNumber(value) && Number.isInteger(value) && value > 0;
}

/**
 * Type guard: Check if value is a non-negative integer
 */
export function isNonNegativeInteger(value: unknown): value is number {
  return isNumber(value) && Number.isInteger(value) && value >= 0;
}

/**
 * Type guard: Check if value is an array
 */
export function isArray<T = unknown>(value: unknown): value is T[] {
  return Array.isArray(value);
}

/**
 * Type guard: Check if value is a non-empty array
 */
export function isNonEmptyArray<T = unknown>(value: unknown): value is [T, ...T[]] {
  return Array.isArray(value) && value.length > 0;
}

/**
 * Type guard: Check if value is an object
 */
export function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/**
 * Type guard: Check if object has a specific property
 */
export function hasProperty<K extends string>(
  value: unknown,
  property: K
): value is Record<K, unknown> {
  return isObject(value) && property in value;
}

/**
 * Type guard: Check if object has required properties
 */
export function hasProperties<K extends string>(
  value: unknown,
  properties: readonly K[]
): value is Record<K, unknown> {
  if (!isObject(value)) return false;
  return properties.every(prop => prop in value);
}

/**
 * Validate and extract property from object
 * Useful for safely accessing nested data
 */
export function getProperty<T>(
  obj: unknown,
  path: string[],
  validator: (value: unknown) => value is T
): Result<T, string> {
  let current: unknown = obj;

  for (const key of path) {
    if (!isObject(current) || !(key in current)) {
      return Err(`Property ${path.join('.')} not found`);
    }
    current = current[key];
  }

  if (!validator(current)) {
    return Err(`Property ${path.join('.')} has invalid type`);
  }

  return Ok(current);
}

/**
 * Validate localStorage data
 * Returns parsed data or null if invalid/missing
 */
export function validateLocalStorageData<T>(
  key: string,
  validator: (data: unknown) => Result<T, unknown>
): T | null {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;

    const parsed = JSON.parse(raw);
    const result = validator(parsed);

    if (result.ok) {
      return result.value;
    }

    console.warn(`Invalid localStorage data for key "${key}":`, result.error);
    return null;
  } catch (error) {
    console.warn(`Failed to load localStorage data for key "${key}":`, error);
    return null;
  }
}

/**
 * Format validation errors for display
 */
export function formatValidationErrors(errors: ValidationError[]): string {
  return errors
    .map(err => {
      const path = err.path.length > 0 ? `${err.path.join('.')}: ` : '';
      return `  - ${path}${err.message}`;
    })
    .join('\n');
}
