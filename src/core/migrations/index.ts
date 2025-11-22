/**
 * Migration system scaffold
 * Ready for future migrations when save format changes
 */

import type { Result } from '../utils/result';
import { Ok, Err } from '../utils/result';
import type { Migration, MigrationRegistry } from './types';
import { SaveV1Schema } from '../../data/schemas/SaveV1Schema';

/**
 * Current save version
 */
export const CURRENT_SAVE_VERSION = '1.0.0';

/**
 * Migration registry
 * Add migrations here as new versions are introduced
 */
const migrations: readonly Migration[] = [
  // Future migrations will go here
  // Example:
  // {
  //   fromVersion: '1.0.0',
  //   toVersion: '1.1.0',
  //   migrate: (data) => {
  //     // Transform data from 1.0.0 to 1.1.0
  //     return Ok(transformedData);
  //   },
  // },
];

export const migrationRegistry: MigrationRegistry = {
  migrations,
  currentVersion: CURRENT_SAVE_VERSION,
};

/**
 * Migrate save data to current version
 * Applies all necessary migrations in sequence
 */
export function migrateSaveData(data: unknown): Result<unknown, string> {
  // For now, just validate as SaveV1
  // In the future, this will check version and apply migrations
  const result = SaveV1Schema.safeParse(data);
  
  if (!result.success) {
    return Err(`Invalid save data: ${result.error.message}`);
  }

  return Ok(result.data);
}

/**
 * Get migration path from version to target version
 */
export function getMigrationPath(
  fromVersion: string,
  toVersion: string,
  registry: MigrationRegistry
): readonly Migration[] {
  if (fromVersion === toVersion) {
    return [];
  }

  // Simple linear migration path (for now)
  // In the future, this could handle branching migration paths
  return registry.migrations.filter(
    (m) => m.fromVersion === fromVersion && m.toVersion === toVersion
  );
}

