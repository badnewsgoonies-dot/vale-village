/**
 * Migration types
 * For handling save file version migrations
 */

import type { Result } from '../utils/result';

/**
 * Migration function signature
 * Takes data of unknown version and returns data of target version
 */
export type MigrationFunction = (data: unknown) => Result<unknown, string>;

/**
 * Migration definition
 */
export interface Migration {
  readonly fromVersion: string;
  readonly toVersion: string;
  readonly migrate: MigrationFunction;
}

/**
 * Migration registry
 */
export interface MigrationRegistry {
  readonly migrations: readonly Migration[];
  readonly currentVersion: string;
}

