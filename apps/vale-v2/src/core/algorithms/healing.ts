/**
 * Healing algorithms
 * Pure utilities for restoring unit HP/status
 */

import type { Unit } from '../models/Unit';
import { calculateMaxHp } from '../models/Unit';

/**
 * Auto-heal all units after battle
 * Restores HP to max and clears status effects (pure)
 */
export function autoHealUnits(units: readonly Unit[]): readonly Unit[] {
  return units.map(unit => {
    const maxHp = calculateMaxHp(unit);
    return {
      ...unit,
      currentHp: maxHp,
      statusEffects: [],
    };
  });
}
