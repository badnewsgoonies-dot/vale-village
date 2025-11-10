import type { Djinn, DjinnState } from './Djinn';
import type { Unit } from './Unit';
import { Ok, Err, type Result } from '@/utils/Result';

/**
 * Tracks Djinn state and timing for proper recovery
 */
export interface DjinnTracker {
  state: DjinnState;
  turnActivated: number;  // When this Djinn was last activated
}

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

  /** State and timing of each equipped Djinn (Set/Standby/Recovery) */
  djinnTrackers: Map<string, DjinnTracker>;

  /** Party members (4 units) */
  units: Unit[];

  /** Collected Djinn (up to 12 total) */
  collectedDjinn: Djinn[];

  /** Current turn in battle (for recovery tracking) */
  currentTurn: number;

  /** Track which units activated Djinn this turn (unitId → count) */
  activationsThisTurn: Map<string, number>;

  /** DEPRECATED: Old state tracking (for backward compatibility) */
  djinnStates: Map<string, DjinnState>;
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
    djinnTrackers: new Map(),
    units,
    collectedDjinn: [],
    currentTurn: 0,
    activationsThisTurn: new Map(),
    // Backward compatibility
    djinnStates: new Map(),
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

  // Update team (deep copy)
  const newTeam = {
    ...team,
    equippedDjinn: [...djinn],
    units: [...team.units],
    collectedDjinn: [...team.collectedDjinn],
    activationsThisTurn: new Map(team.activationsThisTurn),
  };
  newTeam.djinnTrackers = new Map();
  newTeam.djinnStates = new Map();

  // Initialize all as Set
  for (const d of djinn) {
    newTeam.djinnTrackers.set(d.id, {
      state: 'Set',
      turnActivated: -999,  // Never activated
    });
    // Backward compatibility
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
 * - Unit must have dealt/taken 30+ damage
 * - Unit can only activate 1 Djinn per turn
 * - Maximum 3 activations per turn across team
 */
export function activateDjinn(
  team: Team,
  djinnId: string,
  activatingUnit: Unit
): Result<Team, string> {
  // Check Djinn is equipped
  const djinn = team.equippedDjinn.find(d => d.id === djinnId);
  if (!djinn) {
    return Err(`Djinn ${djinnId} is not equipped to team`);
  }

  // Check Djinn is in Set state
  const tracker = team.djinnTrackers.get(djinnId);
  if (!tracker || tracker.state !== 'Set') {
    return Err(`Djinn ${djinnId} is not in Set state (current: ${tracker?.state || 'unknown'})`);
  }

  // Check damage threshold (30+ total damage)
  const totalDamage = activatingUnit.battleStats.damageDealt + activatingUnit.battleStats.damageTaken;
  if (totalDamage < 30) {
    return Err(`Unit must deal/take 30+ total damage to activate Djinn (current: ${totalDamage})`);
  }

  // Check per-unit limit (1 Djinn per unit per turn)
  const unitActivations = team.activationsThisTurn.get(activatingUnit.id) || 0;
  if (unitActivations >= 1) {
    return Err('Unit can only activate 1 Djinn per turn');
  }

  // Check team limit (3 activations per turn)
  const totalActivations = Array.from(team.activationsThisTurn.values())
    .reduce((sum, count) => sum + count, 0);
  if (totalActivations >= 3) {
    return Err('Maximum 3 Djinn activations per turn reached');
  }

  // Move to Standby (deep copy)
  const newTeam = {
    ...team,
    equippedDjinn: [...team.equippedDjinn],
    units: [...team.units],
    collectedDjinn: [...team.collectedDjinn],
    djinnTrackers: new Map(team.djinnTrackers),
    activationsThisTurn: new Map(team.activationsThisTurn),
    djinnStates: new Map(team.djinnStates),
  };

  // Update tracker
  newTeam.djinnTrackers.set(djinnId, {
    state: 'Standby',
    turnActivated: team.currentTurn,
  });

  // Update activation count
  newTeam.activationsThisTurn.set(activatingUnit.id, unitActivations + 1);

  // Backward compatibility
  newTeam.djinnStates.set(djinnId, 'Standby');

  return Ok(newTeam);
}

/**
 * Update Djinn recovery based on current turn
 * From GAME_MECHANICS.md Section 2.2
 *
 * Recovery timing (from when activated):
 * - Standby → Set after 2 turns
 * - Recovery → Set after 3 turns (after summon)
 *
 * @param team - Current team state
 * @param currentTurn - Current turn number
 */
export function updateDjinnRecovery(team: Team, currentTurn: number): Team {
  const newTeam = {
    ...team,
    equippedDjinn: [...team.equippedDjinn],
    units: [...team.units],
    collectedDjinn: [...team.collectedDjinn],
    djinnTrackers: new Map(team.djinnTrackers),
    activationsThisTurn: new Map(team.activationsThisTurn),
    djinnStates: new Map(team.djinnStates),
  };

  // Check each Djinn individually
  for (const [djinnId, tracker] of newTeam.djinnTrackers) {
    if (tracker.state === 'Standby') {
      const turnsInStandby = currentTurn - tracker.turnActivated;
      if (turnsInStandby >= 2) {
        tracker.state = 'Set';
        // Backward compatibility
        newTeam.djinnStates.set(djinnId, 'Set');
      }
    } else if (tracker.state === 'Recovery') {
      const turnsInRecovery = currentTurn - tracker.turnActivated;
      if (turnsInRecovery >= 3) {
        tracker.state = 'Set';
        // Backward compatibility
        newTeam.djinnStates.set(djinnId, 'Set');
      }
    }
  }

  return newTeam;
}

/**
 * Advance to next turn (resets activation limits)
 */
export function advanceTurn(team: Team): Team {
  const newTeam = {
    ...team,
    currentTurn: team.currentTurn + 1,
    activationsThisTurn: new Map(),  // Reset activation counts
  };

  // Update Djinn recovery states
  return updateDjinnRecovery(newTeam, newTeam.currentTurn);
}

/**
 * Get Djinn in Set state (for synergy calculation)
 */
export function getSetDjinn(team: Team): Djinn[] {
  return team.equippedDjinn.filter(d => {
    const tracker = team.djinnTrackers.get(d.id);
    return tracker?.state === 'Set';
  });
}

/**
 * Get Djinn in Standby state (for summon checking)
 */
export function getStandbyDjinn(team: Team): Djinn[] {
  return team.equippedDjinn.filter(d => {
    const tracker = team.djinnTrackers.get(d.id);
    return tracker?.state === 'Standby';
  });
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

/**
 * Summon types and their element requirements
 */
export type SummonType = 'Titan' | 'Phoenix' | 'Kraken' | 'Thunderbird';

/**
 * Result of executing a summon
 */
export interface SummonResult {
  team: Team;
  damage: number;
  summonName: SummonType;
}

/**
 * Execute a summon (requires 3 Standby Djinn of same element)
 * From GAME_MECHANICS.md Section 2.4
 *
 * Damage calculation:
 * - Base damage (varies by summon)
 * - +20 per Djinn tier level
 * - +50% of caster's MAG stat
 *
 * After summon: All 3 Djinn → Recovery state (3 turns to Set)
 */
export function executeSummon(
  team: Team,
  summonType: SummonType,
  casterMAG: number
): Result<SummonResult, string> {
  const standbyDjinn = getStandbyDjinn(team);

  if (standbyDjinn.length < 3) {
    return Err(`Need 3 Standby Djinn to summon (currently have ${standbyDjinn.length})`);
  }

  // Get summon element
  const summonElement = getSummonElement(summonType);

  // Check all 3 Djinn are same element
  const allSameElement = standbyDjinn.every(d => d.element === summonElement);
  if (!allSameElement) {
    return Err(`${summonType} requires 3 ${summonElement} Djinn in Standby`);
  }

  // Calculate damage
  const baseDamage = getSummonBaseDamage(summonType);
  const tierBonus = standbyDjinn.reduce((sum, d) => sum + (d.tier * 20), 0);
  const magBonus = Math.floor(casterMAG * 0.5);
  const totalDamage = baseDamage + tierBonus + magBonus;

  // Move all 3 Standby → Recovery (deep copy)
  const newTeam = {
    ...team,
    equippedDjinn: [...team.equippedDjinn],
    units: [...team.units],
    collectedDjinn: [...team.collectedDjinn],
    djinnTrackers: new Map(team.djinnTrackers),
    activationsThisTurn: new Map(team.activationsThisTurn),
    djinnStates: new Map(team.djinnStates),
  };

  for (const d of standbyDjinn) {
    newTeam.djinnTrackers.set(d.id, {
      state: 'Recovery',
      turnActivated: team.currentTurn,
    });
    // Backward compatibility
    newTeam.djinnStates.set(d.id, 'Recovery');
  }

  return Ok({
    team: newTeam,
    damage: totalDamage,
    summonName: summonType,
  });
}

/**
 * Get element for summon type
 */
function getSummonElement(type: SummonType): string {
  const SUMMON_ELEMENTS: Record<SummonType, string> = {
    'Titan': 'Venus',
    'Phoenix': 'Mars',
    'Kraken': 'Mercury',
    'Thunderbird': 'Jupiter',
  };
  return SUMMON_ELEMENTS[type];
}

/**
 * Get base damage for summon type
 */
function getSummonBaseDamage(type: SummonType): number {
  const BASE_DAMAGES: Record<SummonType, number> = {
    'Titan': 250,
    'Phoenix': 280,
    'Kraken': 220,
    'Thunderbird': 260,
  };
  return BASE_DAMAGES[type];
}
