/**
 * Dev Mode Service
 * Pure functions for development mode features (house jumping, state manipulation)
 *
 * IMPORTANT: This service is for DEVELOPMENT ONLY and should not be used in production gameplay
 */

import type { StoryState } from '../models/story';
import type { Team } from '../models/Team';
import type { Unit } from '../models/Unit';
import { setFlag } from '../models/story';
import { collectDjinn } from './DjinnService';
import { createUnit } from '../models/Unit';
import { ENCOUNTERS } from '../../data/definitions/encounters';
import { STORY_FLAG_TO_UNIT } from '../../data/definitions/storyFlags';
import { UNIT_DEFINITIONS } from '../../data/definitions/units';

/**
 * House metadata for dev mode UI
 */
export interface HouseMetadata {
  id: string;
  displayName: string;
  act: 1 | 2 | 3;
  rewards: {
    unit?: string; // Unit ID for battle recruit
    storyJoinUnit?: string; // Unit ID for story join
    djinn?: string; // Djinn ID
    xp: number;
    gold: number;
  };
  isSpike: boolean; // True for H08, H15 (intentional XP spikes)
  isFinalBoss: boolean; // True for H20
}

/**
 * Get metadata for all 20 houses
 */
export function getAllHousesMetadata(): HouseMetadata[] {
  const houses: HouseMetadata[] = [];

  for (let i = 1; i <= 20; i++) {
    const houseId = `house-${String(i).padStart(2, '0')}`;
    const encounter = ENCOUNTERS[houseId];

    if (!encounter) {
      console.warn(`House ${houseId} not found in ENCOUNTERS`);
      continue;
    }

    // Determine act
    let act: 1 | 2 | 3;
    if (i <= 7) act = 1;
    else if (i <= 14) act = 2;
    else act = 3;

    // Check for story join unit
    const storyJoinUnit = STORY_FLAG_TO_UNIT[houseId];

    houses.push({
      id: houseId,
      displayName: `House ${String(i).padStart(2, '0')}`,
      act,
      rewards: {
        unit: encounter.reward.unlockUnit,
        storyJoinUnit,
        djinn: encounter.reward.djinn,
        xp: encounter.reward.xp,
        gold: encounter.reward.gold,
      },
      isSpike: i === 8 || i === 15,
      isFinalBoss: i === 20,
    });
  }

  return houses;
}

/**
 * Jump to a specific house by granting all previous rewards
 * Pure function - returns new state objects
 *
 * @param story - Current story state
 * @param team - Current team
 * @param roster - Current roster
 * @param targetHouseId - House to jump to (e.g., 'house-05')
 * @returns Updated story, team, and roster with all previous houses completed
 */
export function jumpToHouse(
  story: StoryState,
  team: Team,
  roster: Unit[],
  targetHouseId: string
): {
  story: StoryState;
  team: Team;
  roster: Unit[];
} {
  // Extract house number
  const match = targetHouseId.match(/^house-(\d+)$/);
  if (!match || !match[1]) {
    console.error(`Invalid house ID: ${targetHouseId}`);
    return { story, team, roster };
  }

  const targetHouseNum = parseInt(match[1], 10);

  // Start with fresh state
  let updatedStory = story;
  let updatedTeam = team;
  const updatedRoster = [...roster];

  // Collect Djinn IDs that should be granted
  const djinnToCollect: string[] = [];

  // Units to recruit (both battle and story join)
  const unitsToRecruit: Unit[] = [];

  // Loop through all houses before the target house
  for (let i = 1; i < targetHouseNum; i++) {
    const houseId = `house-${String(i).padStart(2, '0')}`;
    const encounter = ENCOUNTERS[houseId];

    if (!encounter) continue;

    // Set house completion flag
    updatedStory = setFlag(updatedStory, houseId, true);

    // Collect Djinn reward (if any)
    if (encounter.reward.djinn) {
      djinnToCollect.push(encounter.reward.djinn);
    }

    // Recruit battle reward unit (if any)
    if (encounter.reward.unlockUnit) {
      const unitDef = UNIT_DEFINITIONS[encounter.reward.unlockUnit];
      if (unitDef) {
        // Create unit at appropriate level (level 1 for now, can adjust later)
        const unit = createUnit(unitDef, 1, 0);
        unitsToRecruit.push(unit);
      }
    }

    // Recruit story join unit (if any)
    const storyJoinUnitId = STORY_FLAG_TO_UNIT[houseId];
    if (storyJoinUnitId) {
      const unitDef = UNIT_DEFINITIONS[storyJoinUnitId];
      if (unitDef) {
        const unit = createUnit(unitDef, 1, 0);
        unitsToRecruit.push(unit);
      }
    }
  }

  // Apply Djinn collection
  for (const djinnId of djinnToCollect) {
    const collectResult = collectDjinn(updatedTeam, djinnId);
    if (collectResult.ok) {
      updatedTeam = collectResult.value;
    }
  }

  // Add units to roster (deduplicate by ID)
  const rosterIds = new Set(updatedRoster.map(u => u.id));
  for (const unit of unitsToRecruit) {
    if (!rosterIds.has(unit.id)) {
      updatedRoster.push(unit);
      rosterIds.add(unit.id);
    }
  }

  return {
    story: updatedStory,
    team: updatedTeam,
    roster: updatedRoster,
  };
}
