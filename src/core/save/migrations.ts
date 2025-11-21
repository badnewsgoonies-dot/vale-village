/**
 * Save Migration System
 * Handles version upgrades for save data
 */

/* eslint-disable @typescript-eslint/no-explicit-any */

import type { SaveEnvelope, SaveVersion } from './types';

/**
 * Migrator function type
 */
export type Migrator = (old: any) => any;

/**
 * Migration registry
 * Key format: "major.minor->major.minor"
 */
const migrations: Record<string, Migrator> = {
  // Migration from old chapter/flags structure to story object
  '1.0->1.1': (old: any) => {
    // If state has chapter/flags at top level, migrate to story object
    if (old.state && (old.state.chapter || old.state.flags) && !old.state.story) {
      return {
        ...old,
        state: {
          ...old.state,
          story: {
            chapter: typeof old.state.chapter === 'number' ? old.state.chapter : 1,
            flags: old.state.flags || {},
          },
          // Remove old fields
          chapter: undefined,
          flags: undefined,
        },
        version: { major: 1, minor: 1 },
      };
    }
    return old;
  },
  
  // Migration 1.1->1.2: Level cap 20, equipment.accessory field
  // Note: migrator receives the state object (not the full envelope)
  '1.1->1.2': (oldState: any) => {
    const migratedState = { ...oldState };
    
    // Clamp levels > 20 to 20 and ensure equipment.accessory exists
    // Process team units
    if (migratedState.team && migratedState.team.units) {
      migratedState.team = {
        ...migratedState.team,
        units: migratedState.team.units.map((unit: any) => {
          const updatedUnit: any = { ...unit };
          
          // Clamp level
          if (updatedUnit.level && updatedUnit.level > 20) {
            updatedUnit.level = 20;
          }
          
          // Ensure equipment.accessory exists
          if (updatedUnit.equipment) {
            updatedUnit.equipment = {
              ...updatedUnit.equipment,
              accessory: updatedUnit.equipment.accessory ?? null,
            };
          } else {
            updatedUnit.equipment = {
              weapon: null,
              armor: null,
              helm: null,
              boots: null,
              accessory: null,
            };
          }
          
          return updatedUnit;
        }),
      };
    }
    
    // Process battle enemies (if enemies are serialized)
    if (migratedState.battle && migratedState.battle.enemies) {
      migratedState.battle = {
        ...migratedState.battle,
        enemies: migratedState.battle.enemies.map((enemy: any) => {
          const updatedEnemy: any = { ...enemy };
          
          // Clamp level
          if (updatedEnemy.level && updatedEnemy.level > 20) {
            updatedEnemy.level = 20;
          }
          
          return updatedEnemy;
        }),
      };
    }
    
    return migratedState;
  },
};

/**
 * Current save version
 */
export const CURRENT_SAVE_VERSION: SaveVersion = { major: 1, minor: 2 };

/**
 * Compare two versions
 * Returns: -1 if v1 < v2, 0 if equal, 1 if v1 > v2
 */
function compareVersions(v1: SaveVersion, v2: SaveVersion): number {
  if (v1.major !== v2.major) {
    return v1.major - v2.major;
  }
  return v1.minor - v2.minor;
}

/**
 * Get migration key
 */
function getMigrationKey(from: SaveVersion, to: SaveVersion): string {
  return `${from.major}.${from.minor}->${to.major}.${to.minor}`;
}

/**
 * Migrate save envelope to current version
 */
export function migrateSave(envelope: SaveEnvelope): SaveEnvelope {
  const current = CURRENT_SAVE_VERSION;
  const saved = envelope.version;

  // Already current version
  if (compareVersions(saved, current) === 0) {
    return envelope;
  }

  // Future version (shouldn't happen, but handle gracefully)
  if (compareVersions(saved, current) > 0) {
    console.warn(`Save version ${saved.major}.${saved.minor} is newer than current ${current.major}.${current.minor}`);
    return envelope; // Return as-is, may break but better than crashing
  }

  // Need to migrate forward
  let migrated = envelope;
  let currentVersion = saved;

  // Apply migrations step by step
  while (compareVersions(currentVersion, current) < 0) {
    const nextVersion: SaveVersion = {
      major: currentVersion.major,
      minor: currentVersion.minor + 1,
    };

    // Check if we need to jump major version
    if (nextVersion.minor > 9) {
      nextVersion.major = currentVersion.major + 1;
      nextVersion.minor = 0;
    }

    const migrationKey = getMigrationKey(currentVersion, nextVersion);
    const migrator = migrations[migrationKey];

    if (migrator) {
      migrated = {
        ...migrated,
        version: nextVersion,
        state: migrator(migrated.state),
      };
      currentVersion = nextVersion;
    } else {
      // No migration found - try to jump to current version
      // This is a fallback for missing migrations
      console.warn(`No migration found for ${migrationKey}, attempting direct upgrade`);
      migrated = {
        ...migrated,
        version: current,
      };
      break;
    }
  }

  return migrated;
}

