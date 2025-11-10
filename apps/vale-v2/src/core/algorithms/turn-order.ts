/**
 * Turn order calculation algorithms
 * Pure functions, deterministic with PRNG
 */

import type { Unit } from '../models/Unit';
import type { Team } from '../models/Team';
import type { PRNG } from '../random/prng';
import { isUnitKO } from '../models/Unit';
import { getEffectiveSPD } from './stats';

/**
 * Calculate turn order based on effective SPD stat
 * From GAME_MECHANICS.md Section 6.1
 * Orders by: priority tier (Hermes) > effective SPD > tiebreaker
 * Deterministic tiebreaker using turn number for stability
 * Returns array of unit IDs in turn order
 * 
 * @param units - All units (player + enemies)
 * @param team - Player team (for Djinn bonuses)
 * @param rng - PRNG for deterministic tie-breaking
 * @param turnNumber - Current turn number for stable tie-breaking
 */
export function calculateTurnOrder(
  units: readonly Unit[],
  team: Team,
  rng: PRNG,
  turnNumber: number = 0
): readonly string[] {
  // Filter out KO'd units
  const aliveUnits = units.filter(u => !isUnitKO(u));

  // Separate by priority tier (Hermes' Sandals = priority 1, others = priority 0)
  const priorityUnits = aliveUnits.filter(u =>
    u.equipment.boots?.alwaysFirstTurn === true
  );

  const regularUnits = aliveUnits.filter(u =>
    u.equipment.boots?.alwaysFirstTurn !== true
  );

  // Create deterministic tiebreaker RNG using turn number
  // Consume turnNumber values from RNG to create stable tiebreaker
  const tieRng = rng.clone();
  for (let i = 0; i < turnNumber; i++) {
    tieRng.next(); // Advance for determinism
  }

  // Sort priority units: priority desc → effective SPD desc → stable tiebreak (ID sort then RNG)
  // Stable ID sort ensures deterministic tiebreaker order
  // Deterministic comparator: higher SPD → player before enemy → lexicographic unitId
  const sortedPriority = [...priorityUnits]
    .sort((a, b) => a.id.localeCompare(b.id)) // Stable sort by ID first
    .sort((a, b) => {
      const aSpd = getEffectiveSPD(a, team);
      const bSpd = getEffectiveSPD(b, team);
      const spdDiff = bSpd - aSpd;
      
      if (spdDiff === 0) {
        // Same effective SPD: player units before enemies, then lexicographic ID
        const aIsPlayer = team.units.some(u => u.id === a.id);
        const bIsPlayer = team.units.some(u => u.id === b.id);
        
        if (aIsPlayer !== bIsPlayer) {
          return aIsPlayer ? -1 : 1; // Player before enemy
        }
        
        // Both same side: stable tiebreaker using deterministic RNG
        return tieRng.next() - 0.5;
      }
      return spdDiff;
    });

  // Sort regular units: effective SPD desc → stable tiebreak (ID sort then RNG)
  const sortedRegular = [...regularUnits]
    .sort((a, b) => a.id.localeCompare(b.id)) // Stable sort by ID first
    .sort((a, b) => {
      const aSpd = getEffectiveSPD(a, team);
      const bSpd = getEffectiveSPD(b, team);
      const spdDiff = bSpd - aSpd;
      
      if (spdDiff === 0) {
        // Same effective SPD: player units before enemies, then lexicographic ID
        const aIsPlayer = team.units.some(u => u.id === a.id);
        const bIsPlayer = team.units.some(u => u.id === b.id);
        
        if (aIsPlayer !== bIsPlayer) {
          return aIsPlayer ? -1 : 1; // Player before enemy
        }
        
        // Both same side: stable tiebreaker using deterministic RNG
        return tieRng.next() - 0.5;
      }
      return spdDiff;
    });

  // Priority units first, then regular units
  const allOrdered = [...sortedPriority, ...sortedRegular];
  return allOrdered.map(u => u.id);
}

