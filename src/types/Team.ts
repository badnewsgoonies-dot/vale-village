import type { Djinn, DjinnState } from './Djinn';
import type { Unit } from './Unit';
import { Ok, Err, type Result } from '@/utils/Result';

/**
 * Team manages party-wide Djinn system
 * From GAME_MECHANICS.md Section 2.0
 *
 * 🚨 CRITICAL: Djinn are TEAM-WIDE, not per-unit!
 * - Team has exactly 3 Djinn slots (global)
 * - Bonuses apply to ALL party members
 * - Activating affects entire team
 */
export interface Team {
  /** 3 Djinn equipped to team slots (affects ALL units) */
  equippedDjinn: Djinn[];

  /** State of each equipped Djinn (Set/Standby/Recovery) */
  djinnStates: Map<string, DjinnState>;

  /** Party members (4 units) */
  units: Unit[];

  /** Collected Djinn (up to 12 total) */
  collectedDjinn: Djinn[];
}

/**
 * Create a new team
 */
export function createTeam(units: Unit[]): Team {
  if (units.length > 4) {
    throw new Error('Team can have maximum 4 units');
  }

  return {
    equippedDjinn: [],
    djinnStates: new Map(),
    units,
    collectedDjinn: [],
  };
}

/**
 * Equip Djinn to team slots (max 3)
 * From GAME_MECHANICS.md Section 2.0
 */
export function equipDjinn(team: Team, djinn: Djinn[]): Result<Team, string> {
  if (djinn.length > 3) {
    return Err('Cannot equip more than 3 Djinn to team slots');
  }

  // Check all Djinn are collected
  for (const d of djinn) {
    if (!team.collectedDjinn.some(cd => cd.id === d.id)) {
      return Err(`Djinn ${d.name} not yet collected`);
    }
  }

  // Update team
  const newTeam = { ...team };
  newTeam.equippedDjinn = djinn;
  newTeam.djinnStates = new Map();

  // Initialize all as Set
  for (const d of djinn) {
    newTeam.djinnStates.set(d.id, 'Set');
  }

  return Ok(newTeam);
}

/**
 * Activate a Djinn (unleash in battle)
 * From GAME_MECHANICS.md Section 2.2
 *
 * Requirements:
 * - Djinn must be equipped
 * - Djinn must be in 'Set' state
 * - Unit must have dealt/taken 30+ damage (checked by caller)
 */
export function activateDjinn(
  team: Team,
  djinnId: string,
  _activatingUnit: Unit
): Result<Team, string> {
  // Check Djinn is equipped
  const djinn = team.equippedDjinn.find(d => d.id === djinnId);
  if (!djinn) {
    return Err(`Djinn ${djinnId} is not equipped to team`);
  }

  // Check Djinn is in Set state
  const state = team.djinnStates.get(djinnId);
  if (state !== 'Set') {
    return Err(`Djinn ${djinnId} is not in Set state (current: ${state})`);
  }

  // Move to Standby
  const newTeam = { ...team };
  newTeam.djinnStates = new Map(team.djinnStates);
  newTeam.djinnStates.set(djinnId, 'Standby');

  return Ok(newTeam);
}

/**
 * Update Djinn recovery after turns pass
 * From GAME_MECHANICS.md Section 2.2
 *
 * Standby → Set after 2 turns
 */
export function updateDjinnRecovery(team: Team, turnsElapsed: number): Team {
  if (turnsElapsed < 2) {
    return team; // Not enough turns for recovery
  }

  const newTeam = { ...team };
  newTeam.djinnStates = new Map(team.djinnStates);

  // All Standby Djinn return to Set after 2 turns
  for (const [djinnId, state] of team.djinnStates.entries()) {
    if (state === 'Standby') {
      newTeam.djinnStates.set(djinnId, 'Set');
    }
  }

  return newTeam;
}

/**
 * Get Djinn in Set state (for synergy calculation)
 */
export function getSetDjinn(team: Team): Djinn[] {
  return team.equippedDjinn.filter(d =>
    team.djinnStates.get(d.id) === 'Set'
  );
}

/**
 * Get Djinn in Standby state (for summon checking)
 */
export function getStandbyDjinn(team: Team): Djinn[] {
  return team.equippedDjinn.filter(d =>
    team.djinnStates.get(d.id) === 'Standby'
  );
}

/**
 * Check if team can summon
 * Requires 3 Djinn in Standby state
 */
export function canSummon(team: Team, element?: string): boolean {
  const standbyDjinn = getStandbyDjinn(team);

  if (standbyDjinn.length < 3) {
    return false;
  }

  // If element specified, check all 3 are same element
  if (element) {
    return standbyDjinn.every(d => d.element === element);
  }

  return true;
}
