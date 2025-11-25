/**
 * Encounter Service
 * Handles loading encounters and converting them to battle state
 */

import type { Encounter } from '../../data/schemas/EncounterSchema';
import type { BattleState } from '../models/BattleState';
import type { Team } from '../models/Team';
import type { PRNG } from '../random/prng';
import { ENEMIES } from '../../data/definitions/enemies';
import { ENCOUNTERS } from '../../data/definitions/encounters';
import { enemyToUnit } from '../utils/enemyToUnit';
import { startBattle } from './BattleService';

/**
 * Load an encounter by ID
 * Returns the encounter definition or null if not found
 */
export function loadEncounter(encounterId: string): Encounter | null {
  return ENCOUNTERS[encounterId] || null;
}

/**
 * Create battle state from an encounter
 * Converts encounter enemy IDs to Unit instances and initializes battle
 */
export function createBattleFromEncounter(
  encounterId: string,
  playerTeam: Team,
  rng: PRNG
): { battle: BattleState; encounter: Encounter } | null {
  const encounter = loadEncounter(encounterId);
  if (!encounter) {
    return null;
  }

  // Convert enemy IDs to Unit instances with unique IDs
  const enemyUnits = encounter.enemies
    .map((enemyId, index) => {
      const enemyDef = ENEMIES[enemyId];
      if (!enemyDef) {
        console.error(`Enemy not found: ${enemyId}`);
        return null;
      }
      const enemy = enemyToUnit(enemyDef);
      // Give each enemy a unique ID (e.g., wolf_0, wolf_1)
      return { ...enemy, id: `${enemy.id}_${index}` };
    })
    .filter((u): u is ReturnType<typeof enemyToUnit> => u !== null);

  if (enemyUnits.length === 0) {
    console.error(`No valid enemies found for encounter: ${encounterId}`);
    return null;
  }

  // Create battle state with encounter metadata
  const battleResult = startBattle(playerTeam, enemyUnits, rng);

  if (!battleResult.ok) {
    console.error(`Failed to start battle: ${battleResult.error}`);
    return null;
  }

  // Add encounter metadata
  const battleWithMeta: BattleState = {
    ...battleResult.value,
    encounterId: encounter.id, // Legacy field
    meta: {
      encounterId: encounter.id,
      difficulty: encounter.difficulty === 'boss' ? 'boss' : 'normal',
    },
    isBossBattle: encounter.difficulty === 'boss',
  };

  return { battle: battleWithMeta, encounter };
}

/**
 * Get the next encounter in a chapter sequence
 * For now, returns hardcoded Chapter 1 sequence
 */
export function getChapter1Encounters(): readonly string[] {
  const baseOrder = [
    'c1_normal_1',
    'c1_normal_2',
    'c1_normal_3',
    'c1_mini_boss',
    'c1_boss',
  ] as const;

  // Include any additional Chapter 1 encounters declared in ENCOUNTERS (c1_ prefix),
  // preserving the preferred base order and appending any extras in sorted order.
  const discovered = Object.keys(ENCOUNTERS)
    .filter((id) => id.startsWith('c1_'))
    .sort();

  const merged = [
    ...baseOrder,
    ...discovered.filter((id) => !baseOrder.includes(id as typeof baseOrder[number])),
  ];

  return merged;
}

/**
 * Check if an encounter is a boss encounter
 */
export function isBossEncounter(encounterId: string): boolean {
  const encounter = loadEncounter(encounterId);
  return encounter?.id.includes('boss') ?? false;
}

/**
 * Roll for a random encounter based on map encounter rate
 * Returns true if an encounter should trigger
 */
export function rollForRandomEncounter(encounterRate: number, rng: PRNG): boolean {
  if (encounterRate <= 0) return false;
  const roll = rng.next();
  return roll < encounterRate;
}

/**
 * Select a random encounter from a pool of encounter IDs
 * Returns null if pool is empty or invalid
 */
export function selectRandomEncounter(
  encounterPool: readonly string[],
  rng: PRNG
): string | null {
  if (!encounterPool || encounterPool.length === 0) {
    return null;
  }

  const index = Math.floor(rng.next() * encounterPool.length);
  const encounterId = encounterPool[index];
  return encounterId ?? null;
}

/**
 * Process random encounter logic for a map
 * Returns encounter ID if one triggers, null otherwise
 */
export function processRandomEncounter(
  mapEncounterRate: number | undefined,
  mapEncounterPool: readonly string[] | undefined,
  rng: PRNG
): string | null {
  if (!mapEncounterRate || !mapEncounterPool) {
    return null;
  }

  if (!rollForRandomEncounter(mapEncounterRate, rng)) {
    return null;
  }

  return selectRandomEncounter(mapEncounterPool, rng);
}

