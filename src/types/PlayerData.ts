import type { Unit } from './Unit';
import type { Djinn } from './Djinn';
import type { Equipment } from './Equipment';
import { Ok, Err, type Result } from '@/utils/Result';

/**
 * PlayerData manages the player's collection and party composition
 * From GAME_MECHANICS.md Section 7
 */
export interface PlayerData {
  /** All recruited units (max 10) */
  unitsCollected: Unit[];

  /** IDs of units in active party (max 4) */
  activePartyIds: string[];

  /** Recruitment flags for each unit */
  recruitmentFlags: Record<string, boolean>;

  /** Collected Djinn (max 12) */
  djinnCollected: Djinn[];

  /** Inventory items */
  inventory: Equipment[];

  /** Gold currency */
  gold: number;

  /** Story progression flags */
  storyFlags: Record<string, boolean>;
}

/**
 * Create new player data with a starter unit
 */
export function createPlayerData(starterUnit: Unit): PlayerData {
  return {
    unitsCollected: [starterUnit],
    activePartyIds: [starterUnit.id],
    recruitmentFlags: {},
    djinnCollected: [],
    inventory: [],
    gold: 0,
    storyFlags: {},
  };
}

/**
 * Recruit a new unit to the collection
 * From GAME_MECHANICS.md Section 7.1 - Max 10 units
 */
export function recruitUnit(
  playerData: PlayerData,
  unit: Unit,
  recruitmentFlag?: string
): Result<PlayerData, string> {
  // Check max collection size
  if (playerData.unitsCollected.length >= 10) {
    return Err('Cannot recruit more than 10 units');
  }

  // Check if already recruited
  if (playerData.unitsCollected.some(u => u.id === unit.id)) {
    return Err(`Unit ${unit.name} is already recruited`);
  }

  // Create new PlayerData
  const newData = { ...playerData };
  newData.unitsCollected = [...playerData.unitsCollected, unit];

  // Set recruitment flag if provided
  if (recruitmentFlag) {
    newData.recruitmentFlags = {
      ...playerData.recruitmentFlags,
      [recruitmentFlag]: true,
    };
  }

  // Auto-add to active party if less than 4 units
  if (newData.activePartyIds.length < 4) {
    newData.activePartyIds = [...newData.activePartyIds, unit.id];
  }

  return Ok(newData);
}

/**
 * Set the active party (pick 4 from collection)
 * From GAME_MECHANICS.md Section 7.1 - Active party must be 1-4 units
 */
export function setActiveParty(
  playerData: PlayerData,
  unitIds: string[]
): Result<PlayerData, string> {
  // Validate party size
  if (unitIds.length < 1) {
    return Err('Active party must have at least 1 unit');
  }

  if (unitIds.length > 4) {
    return Err('Active party cannot have more than 4 units');
  }

  // Check all IDs are valid
  for (const id of unitIds) {
    if (!playerData.unitsCollected.some(u => u.id === id)) {
      return Err(`Unit ${id} is not in collection`);
    }
  }

  // Check for duplicate IDs
  const uniqueIds = new Set(unitIds);
  if (uniqueIds.size !== unitIds.length) {
    return Err('Cannot have duplicate units in active party');
  }

  // Update active party
  const newData = { ...playerData };
  newData.activePartyIds = [...unitIds];

  return Ok(newData);
}

/**
 * Get active party units
 */
export function getActiveParty(playerData: PlayerData): Unit[] {
  return playerData.activePartyIds
    .map(id => playerData.unitsCollected.find(u => u.id === id))
    .filter((u): u is Unit => u !== undefined);
}

/**
 * Get bench units (not in active party)
 * From GAME_MECHANICS.md Section 7.1 - Bench units don't get Djinn bonuses
 */
export function getBenchUnits(playerData: PlayerData): Unit[] {
  return playerData.unitsCollected.filter(
    unit => !playerData.activePartyIds.includes(unit.id)
  );
}

/**
 * Check if can recruit more units
 */
export function canRecruitMore(playerData: PlayerData): boolean {
  return playerData.unitsCollected.length < 10;
}

/**
 * Select starter unit (pick 1 of 3)
 * From GAME_MECHANICS.md Section 7.2 - STARTER_CHOICE recruitment method
 */
export function selectStarter(
  starterChoices: Unit[],
  selectedId: string
): Result<PlayerData, string> {
  if (starterChoices.length !== 3) {
    return Err('Must provide exactly 3 starter choices');
  }

  const starter = starterChoices.find(u => u.id === selectedId);
  if (!starter) {
    return Err(`Invalid starter ID: ${selectedId}`);
  }

  const playerData = createPlayerData(starter);

  // Set recruitment flag for starter
  playerData.recruitmentFlags[`starter_selected_${starter.id}`] = true;

  return Ok(playerData);
}

/**
 * Swap a unit from active party to bench
 */
export function swapPartyMember(
  playerData: PlayerData,
  removeUnitId: string,
  addUnitId: string
): Result<PlayerData, string> {
  // Check removeUnit is in active party
  if (!playerData.activePartyIds.includes(removeUnitId)) {
    return Err(`Unit ${removeUnitId} is not in active party`);
  }

  // Check addUnit is in collection
  if (!playerData.unitsCollected.some(u => u.id === addUnitId)) {
    return Err(`Unit ${addUnitId} is not in collection`);
  }

  // Check addUnit is not already in active party
  if (playerData.activePartyIds.includes(addUnitId)) {
    return Err(`Unit ${addUnitId} is already in active party`);
  }

  // Check minimum party size (must keep at least 1 unit)
  if (playerData.activePartyIds.length === 1) {
    return Err('Cannot remove last unit from active party');
  }

  // Swap units
  const newData = { ...playerData };
  newData.activePartyIds = playerData.activePartyIds.map(id =>
    id === removeUnitId ? addUnitId : id
  );

  return Ok(newData);
}

/**
 * Remove a unit from active party (move to bench)
 */
export function removeFromActiveParty(
  playerData: PlayerData,
  unitId: string
): Result<PlayerData, string> {
  // Check unit is in active party
  if (!playerData.activePartyIds.includes(unitId)) {
    return Err(`Unit ${unitId} is not in active party`);
  }

  // Check minimum party size
  if (playerData.activePartyIds.length === 1) {
    return Err('Cannot remove last unit from active party');
  }

  // Remove unit
  const newData = { ...playerData };
  newData.activePartyIds = playerData.activePartyIds.filter(id => id !== unitId);

  return Ok(newData);
}

/**
 * Add a unit from bench to active party
 */
export function addToActiveParty(
  playerData: PlayerData,
  unitId: string
): Result<PlayerData, string> {
  // Check unit is in collection
  if (!playerData.unitsCollected.some(u => u.id === unitId)) {
    return Err(`Unit ${unitId} is not in collection`);
  }

  // Check unit is not already in active party
  if (playerData.activePartyIds.includes(unitId)) {
    return Err(`Unit ${unitId} is already in active party`);
  }

  // Check max party size
  if (playerData.activePartyIds.length >= 4) {
    return Err('Active party is full (maximum 4 units)');
  }

  // Add unit
  const newData = { ...playerData };
  newData.activePartyIds = [...playerData.activePartyIds, unitId];

  return Ok(newData);
}
