/**
 * Test Factories
 * Domain object builders for tests
 */

import { createUnit } from '../core/models/Unit';
import { createTeam } from '../core/models/Team';
import { createBattleState } from '../core/models/BattleState';
import { enemyToUnit } from '../core/utils/enemyToUnit';
import { UNIT_DEFINITIONS } from '../data/definitions/units';
import { ENEMIES } from '../data/definitions/enemies';
import type { Unit } from '../core/models/Unit';
import type { Team } from '../core/models/Team';
import type { BattleState } from '../core/models/BattleState';

/**
 * Create a unit for testing
 */
export function mkUnit(overrides?: Partial<Unit>): Unit {
  const baseDef = UNIT_DEFINITIONS.adept;
  if (!baseDef) {
    throw new Error('UNIT_DEFINITIONS.adept not found');
  }
  
  // Extract level and xp from overrides if provided
  const level = overrides?.level ?? 1;
  const xp = overrides?.xp ?? 0;
  
  // Create base unit at specified level
  const base = createUnit(baseDef, level, xp);
  if (!overrides) return base;
  
  // Apply overrides, but exclude level/xp since they're already applied
  const { level: omitLevel, xp: omitXp, ...restOverrides } = overrides;
  void omitLevel;
  void omitXp;

  return {
    ...base,
    ...restOverrides,
    // Deep merge for nested objects
    baseStats: restOverrides.baseStats ? { ...base.baseStats, ...restOverrides.baseStats } : base.baseStats,
    equipment: restOverrides.equipment ?? base.equipment,
    statusEffects: restOverrides.statusEffects ?? base.statusEffects,
    abilities: restOverrides.abilities ?? base.abilities, // Preserve abilities if not overridden
    unlockedAbilityIds: restOverrides.unlockedAbilityIds ?? base.unlockedAbilityIds, // Preserve unlocked abilities
    // Preserve level/xp from createUnit call
    level: base.level,
    xp: base.xp,
  };
}

/**
 * Create an enemy unit for testing
 */
export function mkEnemy(enemyId: keyof typeof ENEMIES = 'slime', overrides?: Partial<Unit>): Unit {
  const enemyDef = ENEMIES[enemyId];
  if (!enemyDef) {
    throw new Error(`Enemy ${enemyId} not found`);
  }
  const base = enemyToUnit(enemyDef);
  if (!overrides) return base;
  
  return {
    ...base,
    ...overrides,
    baseStats: overrides.baseStats ? { ...base.baseStats, ...overrides.baseStats } : base.baseStats,
    equipment: overrides.equipment ?? base.equipment,
    statusEffects: overrides.statusEffects ?? base.statusEffects,
  };
}

/**
 * Create a team for testing (fills to 4 units if needed)
 */
export function mkTeam(units: Unit[]): Team {
  // Ensure exactly 4 units
  const teamUnits = [...units];
  while (teamUnits.length < 4) {
    // Create placeholder units with 9999 HP so they survive but don't contribute damage
    teamUnits.push(mkUnit({
      id: `placeholder_${teamUnits.length}`,
      name: `Placeholder ${teamUnits.length}`,
      baseStats: { hp: 9999, pp: 0, atk: 0, def: 0, mag: 0, spd: 1 }, // 0 ATK = no damage
      currentHp: 9999,
      currentPp: 0,
    }));
  }
  return createTeam(teamUnits.slice(0, 4));
}

/**
 * Create a battle state for testing
 */
export function mkBattle(options: {
  party?: Unit[];
  enemies?: Unit[];
  turnOrder?: string[];
}): BattleState {
  const party = options.party ? mkTeam(options.party) : mkTeam([mkUnit()]);
  const enemies = options.enemies ?? [mkEnemy()];
  const turnOrder = options.turnOrder ?? [
    ...party.units.map(u => u.id),
    ...enemies.map(e => e.id),
  ];
  
  return createBattleState(party, enemies, turnOrder);
}

