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
  const battle = startBattle(playerTeam, enemyUnits, rng);
  
  // Add encounter metadata
  const battleWithMeta: BattleState = {
    ...battle,
    encounterId: encounter.id, // Legacy field
    meta: {
      encounterId: encounter.id,
      difficulty: encounter.rules?.fleeDisabled 
        ? (encounter.id.includes('boss') ? 'boss' : 'elite')
        : 'normal',
    },
    isBossBattle: encounter.rules?.fleeDisabled ?? false,
  };

  return { battle: battleWithMeta, encounter };
}

/**
 * Get the next encounter in a chapter sequence
 * For now, returns hardcoded Chapter 1 sequence
 * TODO: Make this data-driven via chapter definitions
 */
export function getChapter1Encounters(): readonly string[] {
  return [
    'c1_normal_1',
    'c1_normal_2',
    'c1_normal_3',
    'c1_mini_boss',
    'c1_boss',
  ] as const;
}

/**
 * Check if an encounter is a boss encounter
 */
export function isBossEncounter(encounterId: string): boolean {
  const encounter = loadEncounter(encounterId);
  return encounter?.id.includes('boss') ?? false;
}

