// [BT-STATE][BT-01] Battle Tower UI state slice
import type { StateCreator, SetState } from 'zustand';
import type { TowerFloor } from '@/data/schemas/TowerFloorSchema';
import type { TowerRewardEntry } from '@/data/schemas/TowerRewardSchema';
import type { TowerRunState, TowerBattleOutcome, TowerBattleSummary } from '@/core/services/TowerService';
import type { TowerConfig, TowerDifficulty } from '@/core/config/towerConfig';
import type { BattleState } from '@/core/models/BattleState';
import type { Position } from '@/core/models/overworld';
import type { Equipment } from '@/data/schemas/EquipmentSchema';
import type { Unit } from '@/core/models/Unit';
import type { Team } from '@/core/models/Team';
import type { QueueBattleSlice } from './queueBattleSlice';
import type { GameFlowSlice } from './gameFlowSlice';
import type { TeamSlice } from './teamSlice';
import type { InventorySlice } from './inventorySlice';
import type { OverworldStore } from './overworldSlice';
import { DEFAULT_TOWER_CONFIG } from '@/core/config/towerConfig';
import { TOWER_FLOORS } from '@/data/definitions/towerFloors';
import { TOWER_REWARDS } from '@/data/definitions/towerRewards';
import {
  createTowerRun,
  getCurrentFloor as towerGetCurrentFloor,
  recordBattleResult,
  completeRestFloor,
  clearPendingRewards,
} from '@/core/services/TowerService';
import { UNIT_DEFINITIONS } from '@/data/definitions/units';
import { DJINN } from '@/data/definitions/djinn';
import { EQUIPMENT } from '@/data/definitions/equipment';
import { createUnit, updateUnit } from '@/core/models/Unit';
import { createTeam, updateTeam } from '@/core/models/Team';
import { collectDjinn } from '@/core/services/DjinnService';
import { calculateEffectiveStats } from '@/core/algorithms/stats';
import type { BattleEvent } from '@/core/services/types';
import { isAvailableInCampaign } from '../utils/contentAvailability';

const TOWER_START_GOLD = 5000;
const DEFAULT_DIFFICULTY: TowerDifficulty = 'normal';

export interface TowerRecord {
  readonly highestFloorEver: number;
  readonly totalRuns: number;
  readonly bestRunTurns: number | null;
  readonly bestRunDamageDealt: number | null;
}

export const DEFAULT_TOWER_RECORD: TowerRecord = Object.freeze({
  highestFloorEver: 0,
  totalRuns: 0,
  bestRunTurns: null,
  bestRunDamageDealt: null,
});

type TowerEntryContext =
  | { type: 'main-menu' }
  | { type: 'overworld'; mapId: string; position: Position };

interface SnapshotState {
  team: Team | null;
  roster: Unit[];
  gold: number;
  equipment: Equipment[];
}

interface TowerRewardLedger {
  equipmentIds: string[];
  djinnIds: string[];
  recruitIds: string[];
}

interface TowerBattlePayload {
  battle: BattleState;
  events: readonly BattleEvent[];
}

export interface TowerSlice {
  towerRun: TowerRunState | null;
  towerStatus: 'idle' | 'in-run' | 'completed';
  towerRecord: TowerRecord;
  towerEntryContext: TowerEntryContext | null;
  towerSnapshots: SnapshotState | null;
  activeTowerEncounterId: string | null;
  towerRewardsEarned: TowerRewardLedger;

  getCurrentTowerFloor: () => TowerFloor | null;
  startTowerRun: (opts?: { difficulty?: TowerDifficulty; seed?: number }) => void;
  beginTowerFloorBattle: () => void;
  handleTowerBattleCompleted: (payload: TowerBattlePayload) => void;
  applyTowerRest: () => void;
  quitTowerRun: () => void;
  enterTowerFromOverworld: (context: { mapId: string; position: Position }) => void;
  openTowerFromMainMenu: () => void;
  exitTowerMode: () => void;
  setTowerRecord: (record: TowerRecord) => void;
}

type TowerSliceDeps = TowerSlice &
  QueueBattleSlice &
  GameFlowSlice &
  TeamSlice &
  InventorySlice &
  OverworldStore;

export const createTowerSlice: StateCreator<
  TowerSliceDeps,
  [['zustand/devtools', never]],
  [],
  TowerSlice
> = (set, get) => ({
  towerRun: null,
  towerStatus: 'idle',
  towerRecord: { ...DEFAULT_TOWER_RECORD },
  towerEntryContext: null,
  towerSnapshots: null,
  activeTowerEncounterId: null,
  towerRewardsEarned: createEmptyRewardLedger(),

  getCurrentTowerFloor: () => {
    const run = get().towerRun;
    if (!run) {
      return null;
    }
    return towerGetCurrentFloor(run, TOWER_FLOORS);
  },

  startTowerRun: (opts) => {
    if (get().towerStatus === 'in-run') {
      return;
    }

    const difficulty = opts?.difficulty ?? DEFAULT_DIFFICULTY;
    const seed = opts?.seed ?? Date.now();

    const snapshots = captureSnapshot(get());
    const { towerTeam, towerRoster } = buildTowerRoster();

    get().setTeam(towerTeam);
    get().setRoster(towerRoster);
    get().setGold(TOWER_START_GOLD);
    const campaignEquipment = Object.values(EQUIPMENT)
      .filter(isAvailableInCampaign)
      .map((item) => ({ ...item }));
    get().setEquipment(campaignEquipment);

    const run = createTowerRun(seed, difficulty, TOWER_FLOORS, DEFAULT_TOWER_CONFIG);

    if (!get().towerEntryContext) {
      set({ towerEntryContext: { type: 'main-menu' } });
    }

    set({
      towerRun: run,
      towerStatus: 'in-run',
      towerSnapshots: snapshots,
      activeTowerEncounterId: null,
      towerRewardsEarned: createEmptyRewardLedger(),
    });

    get().setMode('tower');
  },

  beginTowerFloorBattle: () => {
    const run = get().towerRun;
    if (!run || get().towerStatus !== 'in-run') {
      return;
    }

    const floor = towerGetCurrentFloor(run, TOWER_FLOORS);
    if (!floor || floor.type === 'rest') {
      return;
    }

    set({ activeTowerEncounterId: floor.encounterId });
    get().setPendingBattle(floor.encounterId);
  },

  handleTowerBattleCompleted: ({ battle }: TowerBattlePayload) => {
    const run = get().towerRun;
    if (!run || !run.floorIds.length) {
      return;
    }

    const encounterId = battle.encounterId || battle.meta?.encounterId || null;
    const wasTowerBattle =
      get().activeTowerEncounterId && encounterId === get().activeTowerEncounterId;

    if (!wasTowerBattle) {
      return;
    }

    const currentFloor = towerGetCurrentFloor(run, TOWER_FLOORS);
    if (!currentFloor) {
      return;
    }

    const outcome: TowerBattleOutcome =
      battle.status === 'PLAYER_DEFEAT' ? 'defeat' : 'victory';

    const summary: TowerBattleSummary = {
      turnsTaken: battle.roundNumber,
      damageDealt: sumUnitStat(battle.playerTeam.units, 'damageDealt'),
      damageTaken: sumUnitStat(battle.playerTeam.units, 'damageTaken'),
      manaSpent: 0,
    };

    const rewardEntries = getRewardsForFloor(currentFloor.floorNumber);
    const recordedRun = recordBattleResult({
      run,
      floors: TOWER_FLOORS,
      outcome,
      summary,
      rewards: rewardEntries,
    });
    const clearedRun = clearPendingRewards(recordedRun);

    get().setBattle(null, 0);
    get().updateTeamUnits(battle.playerTeam.units);
    set({
      activeTowerEncounterId: null,
      towerRun: clearedRun,
      towerStatus: clearedRun.isCompleted ? 'completed' : 'in-run',
    });

    processTowerRewards(rewardEntries, get(), set);

    if (clearedRun.isCompleted || outcome === 'defeat') {
      set((state) => ({
        towerRun: {
          ...clearedRun,
          isCompleted: true,
          isFailed: outcome === 'defeat',
        },
        towerStatus: 'completed',
        towerRecord: updateTowerRecordFromRun(state.towerRecord, clearedRun),
      }));
    }

    get().setMode('tower');
  },

  applyTowerRest: () => {
    const run = get().towerRun;
    if (!run || get().towerStatus !== 'in-run') {
      return;
    }

    const floor = towerGetCurrentFloor(run, TOWER_FLOORS);
    if (!floor || floor.type !== 'rest') {
      return;
    }

    const config = run.config ?? DEFAULT_TOWER_CONFIG;
    const healedTeam = healTeamAtRest(get().team, config);
    if (healedTeam) {
      get().updateTeam(healedTeam);
      get().updateTeamUnits(healedTeam.units);
    }

    const restedRun = completeRestFloor(run, TOWER_FLOORS, {
      healedFraction: config.healFractionAtRest,
      loadoutAdjusted: true,
    });

    set({ towerRun: restedRun });
  },

  quitTowerRun: () => {
    const run = get().towerRun;
    if (!run) {
      get().exitTowerMode();
      return;
    }

    set((state) => ({
      towerRun: {
        ...run,
        isCompleted: true,
      },
      towerStatus: 'completed',
      towerRecord: updateTowerRecordFromRun(state.towerRecord, run),
    }));
  },

  enterTowerFromOverworld: ({ mapId, position }) => {
    set({
      towerEntryContext: { type: 'overworld', mapId, position },
    });
    get().setMode('tower');
  },

  openTowerFromMainMenu: () => {
    set({
      towerEntryContext: { type: 'main-menu' },
    });
    get().setMode('tower');
  },

  exitTowerMode: () => {
    const context = get().towerEntryContext;
    const rewardsLedger = get().towerRewardsEarned;
    restoreSnapshot(get());
    commitTowerRewardsToCampaign(get(), rewardsLedger);

    set({
      towerRun: null,
      towerStatus: 'idle',
      towerEntryContext: null,
      towerSnapshots: null,
      activeTowerEncounterId: null,
      towerRewardsEarned: createEmptyRewardLedger(),
    });

    if (context?.type === 'overworld') {
      get().teleportPlayer(context.mapId, context.position);
      get().setMode('overworld');
    } else {
      get().setMode('main-menu');
    }
  },

  setTowerRecord: (record) => {
    set({
      towerRecord: {
        highestFloorEver: record.highestFloorEver ?? 0,
        totalRuns: record.totalRuns ?? 0,
        bestRunTurns: record.bestRunTurns ?? null,
        bestRunDamageDealt: record.bestRunDamageDealt ?? null,
      },
    });
  },
});

function captureSnapshot(state: TowerSliceDeps): SnapshotState {
  return {
    team: state.team ? cloneTeam(state.team) : null,
    roster: state.roster ? state.roster.map((unit) => cloneUnit(unit)) : [],
    gold: state.gold,
    equipment: state.equipment.map((item) => ({ ...item })),
  };
}

function restoreSnapshot(state: TowerSliceDeps) {
  const snapshot = state.towerSnapshots;
  if (!snapshot) return;

  if (snapshot.team) {
    state.setTeam(snapshot.team);
  }
  state.setRoster(snapshot.roster);
  state.setGold(snapshot.gold);
  state.setEquipment(snapshot.equipment);
}

function buildTowerRoster(): { towerTeam: Team; towerRoster: Unit[] } {
  const roster = Object.values(UNIT_DEFINITIONS)
    .filter(isAvailableInCampaign)
    .map((def) => updateUnit(createUnit(def, 20, 0), { storeUnlocked: true }));
  const party = roster.slice(0, 4);
  let team = createTeam(party);

  const campaignDjinnIds = Object.entries(DJINN)
    .filter(([, def]) => isAvailableInCampaign(def))
    .map(([id]) => id);

  for (const djinnId of campaignDjinnIds) {
    const result = collectDjinn(team, djinnId);
    if (result.ok) {
      team = result.value;
    }
  }

  const equippedDjinn = campaignDjinnIds.slice(0, 3);
  team = updateTeam(team, { equippedDjinn });

  return {
    towerTeam: team,
    towerRoster: roster,
  };
}

function createEmptyRewardLedger(): TowerRewardLedger {
  return {
    equipmentIds: [],
    djinnIds: [],
    recruitIds: [],
  };
}

function getRewardsForFloor(floorNumber: number): TowerRewardEntry[] {
  const entry = TOWER_REWARDS.find((reward) => reward.floorNumber === floorNumber);
  return entry ? entry.rewards : [];
}

function sumUnitStat(units: readonly Unit[], key: 'damageDealt' | 'damageTaken'): number {
  return units.reduce((sum, unit) => sum + (unit.battleStats?.[key] ?? 0), 0);
}

function processTowerRewards(
  entries: TowerRewardEntry[],
  state: TowerSliceDeps,
  setState: SetState<TowerSliceDeps>
) {
  if (entries.length === 0) {
    return;
  }

  const baseLedger = state.towerRewardsEarned ?? createEmptyRewardLedger();
  const updatedLedger: TowerRewardLedger = {
    equipmentIds: [...baseLedger.equipmentIds],
    djinnIds: [...baseLedger.djinnIds],
    recruitIds: [...baseLedger.recruitIds],
  };
  let recorded = false;

  for (const reward of entries) {
    switch (reward.type) {
      case 'equipment': {
        const items = reward.ids
          .map((id) => EQUIPMENT[id])
          .filter((item): item is Equipment => Boolean(item));
        if (items.length > 0) {
          state.addEquipment(items);
          updatedLedger.equipmentIds.push(...items.map((item) => item.id));
          recorded = true;
        }
        break;
      }
      case 'djinn': {
        for (const djinnId of reward.ids) {
          if (!state.team) continue;
          const updatedTeam = grantDjinnReward(state.team, djinnId);
          state.setTeam(updatedTeam);
          updatedLedger.djinnIds.push(djinnId);
          recorded = true;
        }
        break;
      }
      case 'recruit': {
        for (const unitId of reward.ids) {
          const def = UNIT_DEFINITIONS[unitId];
          if (!def) continue;
          const existing = state.roster.find((unit) => unit.id === unitId);
          if (existing) continue;
          const newUnit = createUnit(def, 20, 0);
          appendUnitToRoster(state, newUnit);
          updatedLedger.recruitIds.push(unitId);
          recorded = true;
        }
        break;
      }
    }
  }

  if (recorded) {
    setState({
      towerRewardsEarned: updatedLedger,
    });
  }
}

function commitTowerRewardsToCampaign(state: TowerSliceDeps, rewards: TowerRewardLedger) {
  if (!rewards) {
    return;
  }

  if (rewards.equipmentIds.length) {
    const items = rewards.equipmentIds
      .map((id) => EQUIPMENT[id])
      .filter((item): item is Equipment => Boolean(item))
      .map((item) => ({ ...item }));
    if (items.length > 0) {
      state.addEquipment(items);
    }
  }

  if (state.team && rewards.djinnIds.length) {
    let team = state.team;
    for (const djinnId of rewards.djinnIds) {
      team = grantDjinnReward(team, djinnId);
    }
    state.setTeam(team);
  }

  if (rewards.recruitIds.length) {
    const existingIds = new Set(state.roster?.map((unit) => unit.id) ?? []);
    for (const unitId of rewards.recruitIds) {
      if (existingIds.has(unitId)) {
        continue;
      }
      const def = UNIT_DEFINITIONS[unitId];
      if (!def) {
        continue;
      }
      const newUnit = createUnit(def, 20, 0);
      appendUnitToRoster(state, newUnit);
      existingIds.add(unitId);
    }
  }
}

function healTeamAtRest(team: Team | null, config: TowerConfig): Team | null {
  if (!team) return null;
  const fraction = config.healFractionAtRest;
  const healedUnits = team.units.map((unit) => {
    const stats = calculateEffectiveStats(unit, team);
    const healAmount = Math.floor(stats.hp * fraction);
    const nextHp = Math.min(stats.hp, unit.currentHp + healAmount);
    return updateUnit(unit, { currentHp: nextHp });
  });

  const resetTrackers = Object.fromEntries(
    Object.entries(team.djinnTrackers).map(([djinnId, tracker]) => [
      djinnId,
      { ...tracker, state: 'Set' as const },
    ])
  );

  return updateTeam(team, {
    units: healedUnits,
    djinnTrackers: resetTrackers,
  });
}

function updateTowerRecordFromRun(current: TowerRecord, run: TowerRunState): TowerRecord {
  const nextHighest = Math.max(current.highestFloorEver, run.stats.highestFloor);
  const nextTotalRuns = current.totalRuns + 1;
  const turnsThisRun = run.stats.turnsTaken;
  const damageThisRun = run.stats.totalDamageDealt;

  const nextBestTurns =
    turnsThisRun > 0
      ? current.bestRunTurns === null
        ? turnsThisRun
        : Math.min(current.bestRunTurns, turnsThisRun)
      : current.bestRunTurns;

  const nextBestDamage =
    current.bestRunDamageDealt === null
      ? damageThisRun
      : Math.max(current.bestRunDamageDealt, damageThisRun);

  return {
    highestFloorEver: nextHighest,
    totalRuns: nextTotalRuns,
    bestRunTurns: nextBestTurns,
    bestRunDamageDealt: nextBestDamage,
  };
}

function cloneTeam(team: Team): Team {
  return {
    ...team,
    equippedDjinn: [...team.equippedDjinn],
    djinnTrackers: Object.fromEntries(
      Object.entries(team.djinnTrackers).map(([id, tracker]) => [id, { ...tracker }])
    ),
    units: team.units.map((unit) => cloneUnit(unit)),
    collectedDjinn: [...team.collectedDjinn],
    activationsThisTurn: { ...team.activationsThisTurn },
    djinnStates: { ...team.djinnStates },
  };
}

function cloneUnit(unit: Unit): Unit {
  return {
    ...unit,
    equipment: {
      weapon: unit.equipment.weapon ? { ...unit.equipment.weapon } : null,
      armor: unit.equipment.armor ? { ...unit.equipment.armor } : null,
      helm: unit.equipment.helm ? { ...unit.equipment.helm } : null,
      boots: unit.equipment.boots ? { ...unit.equipment.boots } : null,
      accessory: unit.equipment.accessory ? { ...unit.equipment.accessory } : null,
    },
    djinn: [...unit.djinn],
    djinnStates: { ...unit.djinnStates },
    abilities: unit.abilities.map((ability) => ({ ...ability })),
    unlockedAbilityIds: [...unit.unlockedAbilityIds],
    statusEffects: [...unit.statusEffects],
    battleStats: { ...unit.battleStats },
  };
}

function grantDjinnReward(team: Team, djinnId: string): Team {
  const result = collectDjinn(team, djinnId);
  if (result.ok) {
    return result.value;
  }

  if (result.error.includes('Cannot collect more than 12 Djinn') && !team.collectedDjinn.includes(djinnId)) {
    return updateTeam(team, {
      collectedDjinn: [...team.collectedDjinn, djinnId],
    });
  }

  return team;
}

function appendUnitToRoster(state: TowerSliceDeps, unit: Unit) {
  const roster = state.roster ?? [];
  state.setRoster([...roster, unit]);
}

