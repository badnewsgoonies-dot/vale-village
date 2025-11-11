/**
 * Targeting algorithms
 * Resolve target sets for abilities
 * Pure functions, deterministic
 */

import type { Unit } from '../models/Unit';
import type { Ability } from '../../data/schemas/AbilitySchema';
import { isUnitKO } from '../models/Unit';

/**
 * Resolve targets for an ability
 * Returns array of units matching the ability's target type
 */
export function resolveTargets(
  ability: Ability,
  caster: Unit,
  playerUnits: readonly Unit[],
  enemyUnits: readonly Unit[]
): readonly Unit[] {
  const isPlayerUnit = playerUnits.some(u => u.id === caster.id);

  switch (ability.targets) {
    case 'single-enemy':
      return isPlayerUnit
        ? enemyUnits.filter(u => !isUnitKO(u))
        : playerUnits.filter(u => !isUnitKO(u));

    case 'all-enemies':
      return isPlayerUnit
        ? enemyUnits.filter(u => !isUnitKO(u))
        : playerUnits.filter(u => !isUnitKO(u));

    case 'single-ally':
      return isPlayerUnit
        ? playerUnits.filter(u => !isUnitKO(u) && u.id !== caster.id)
        : enemyUnits.filter(u => !isUnitKO(u) && u.id !== caster.id);

    case 'all-allies':
      return isPlayerUnit
        ? playerUnits.filter(u => !isUnitKO(u))
        : enemyUnits.filter(u => !isUnitKO(u));

    case 'self':
      return [caster];

    default:
      return [];
  }
}

/**
 * Filter targets by validity (e.g., healing only works on alive units)
 */
export function filterValidTargets(
  targets: readonly Unit[],
  ability: Ability
): readonly Unit[] {
  if (ability.type === 'healing' && !ability.revivesFallen) {
    // Healing only works on alive units (unless it revives)
    return targets.filter(u => !isUnitKO(u));
  }

  // Other abilities can target KO'd units (for revival)
  return targets;
}

/**
 * Get valid targets for UI selection
 * Simplified version for UI components that need to show selectable targets
 * @param ability - Ability (null for basic attack)
 * @param caster - Unit casting the ability
 * @param playerTeam - Player team
 * @param enemies - Enemy units
 * @returns Array of valid target units for selection
 */
export function getValidTargets(
  ability: Ability | null,
  caster: Unit,
  playerTeam: { units: readonly Unit[] },
  enemies: readonly Unit[]
): readonly Unit[] {
  if (!ability) {
    // Basic attack targets enemies
    return enemies.filter(e => !isUnitKO(e));
  }

  switch (ability.targets) {
    case 'single-enemy':
    case 'all-enemies':
      return enemies.filter(e => !isUnitKO(e));
    case 'single-ally':
    case 'all-allies':
      return playerTeam.units.filter(u => !isUnitKO(u) && u.id !== caster.id);
    case 'self':
      return [caster];
    default:
      return [];
  }
}

