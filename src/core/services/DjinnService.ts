/**
 * Djinn Service
 * Handles Djinn collection, equipping, and management
 */

import type { Team } from '../models/Team';
import { updateTeam } from '../models/Team';
import { DJINN } from '../../data/definitions/djinn';
import type { Result } from '../utils/result';
import { Ok, Err } from '../utils/result';

/**
 * Add a Djinn to collected list
 * @throws Error if Djinn doesn't exist or already collected
 */
export function collectDjinn(team: Team, djinnId: string): Result<Team, string> {
  // Validate Djinn exists
  if (!DJINN[djinnId]) {
    return Err(`Djinn ${djinnId} does not exist`);
  }

  // Check if already collected
  if (team.collectedDjinn.includes(djinnId)) {
    return Err(`Djinn ${djinnId} already collected`);
  }

  // Check max collection limit (12)
  if (team.collectedDjinn.length >= 12) {
    return Err('Cannot collect more than 12 Djinn');
  }

  // Add to collected list
  const newCollectedDjinn = [...team.collectedDjinn, djinnId];

  return Ok(updateTeam(team, {
    collectedDjinn: newCollectedDjinn,
  }));
}

/**
 * Equip a Djinn to team slot (max 3)
 * @throws Error if Djinn not collected, already equipped, or slots full
 */
export function equipDjinn(team: Team, djinnId: string, slotIndex: number = -1): Result<Team, string> {
  // Validate Djinn is collected
  if (!team.collectedDjinn.includes(djinnId)) {
    return Err(`Djinn ${djinnId} not collected`);
  }

  // Check if already equipped
  if (team.equippedDjinn.includes(djinnId)) {
    return Err(`Djinn ${djinnId} already equipped`);
  }

  // Check max slots (3)
  if (team.equippedDjinn.length >= 3) {
    if (slotIndex < 0 || slotIndex >= 3) {
      return Err('All 3 Djinn slots are full. Unequip one first.');
    }

    // Replace Djinn at slotIndex
    const newEquippedDjinn = [...team.equippedDjinn];
    const oldDjinnId = newEquippedDjinn[slotIndex];
    newEquippedDjinn[slotIndex] = djinnId;

    // Update trackers
    const newTrackers = { ...team.djinnTrackers };
    if (oldDjinnId) {
      delete newTrackers[oldDjinnId];
    }
    if (!newTrackers[djinnId]) {
      newTrackers[djinnId] = {
        djinnId,
        state: 'Set',
        lastActivatedTurn: -1,
      };
    }

    return Ok(updateTeam(team, {
      equippedDjinn: newEquippedDjinn,
      djinnTrackers: newTrackers,
    }));
  }

  // Add to next available slot
  const newEquippedDjinn = [...team.equippedDjinn, djinnId];
  const newTrackers = { ...team.djinnTrackers };
  if (!newTrackers[djinnId]) {
    newTrackers[djinnId] = {
      djinnId,
      state: 'Set',
      lastActivatedTurn: -1,
    };
  }

  return Ok(updateTeam(team, {
    equippedDjinn: newEquippedDjinn,
    djinnTrackers: newTrackers,
  }));
}

/**
 * Unequip a Djinn from team
 */
export function unequipDjinn(team: Team, djinnId: string): Result<Team, string> {
  if (!team.equippedDjinn.includes(djinnId)) {
    return Err(`Djinn ${djinnId} not equipped`);
  }

  const newEquippedDjinn = team.equippedDjinn.filter(id => id !== djinnId);
  const newTrackers = { ...team.djinnTrackers };
  delete newTrackers[djinnId];

  return Ok(updateTeam(team, {
    equippedDjinn: newEquippedDjinn,
    djinnTrackers: newTrackers,
  }));
}

