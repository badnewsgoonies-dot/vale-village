import { beforeEach, describe, expect, it } from 'vitest';
import { createStore } from '@/ui/state/store';
import type { Store } from '@/ui/state/store';
import { createBattleState, buildUnitIndex } from '@/core/models/BattleState';
import type { BattleState } from '@/core/models/BattleState';
import type { Team } from '@/core/models/Team';

describe('towerSlice integration', () => {
  let store: Store;

  beforeEach(() => {
    store = createStore();
    store.getState().openTowerFromMainMenu();
    store.getState().startTowerRun({ difficulty: 'normal', seed: 99 });
  });

  it('advances floors and records victories', () => {
    const firstFloor = store.getState().getCurrentTowerFloor();
    expect(firstFloor?.encounterId).toBeDefined();

    store.setState({ activeTowerEncounterId: firstFloor?.encounterId ?? null });
    store
      .getState()
      .handleTowerBattleCompleted({ battle: makeTowerBattleState(store.getState().team!, firstFloor!.encounterId), events: [] });

    const run = store.getState().towerRun;
    expect(run).not.toBeNull();
    expect(run?.stats.victories).toBe(1);
    expect(run?.history[0]?.outcome).toBe('victory');
    expect(run?.floorIndex).toBe(1);
  });

  it('awards milestone rewards for equipment, djinn, and recruits', () => {
    completeThroughFloor(store, 6);
    expect(store.getState().equipment.some((item) => item.id === 'eclipse-blade')).toBe(true);

    completeThroughFloor(store, 7);
    expect(store.getState().team?.collectedDjinn).toContain('nova');

    completeThroughFloor(store, 10);
    expect(store.getState().roster.some((unit) => unit.id === 'tower-champion')).toBe(true);
  });

  it('persists tower rewards when exiting tower mode', () => {
    store = createStore();
    store.setState({ gold: 321 });
    const baselineGold = store.getState().gold;
    store.getState().openTowerFromMainMenu();
    store.getState().startTowerRun({ difficulty: 'normal', seed: 123 });

    completeThroughFloor(store, 10);
    store.getState().exitTowerMode();

    const finalState = store.getState();
    expect(finalState.gold).toBe(baselineGold);
    expect(finalState.equipment.some((item) => item.id === 'eclipse-blade')).toBe(true);
    expect(finalState.team?.collectedDjinn).toContain('nova');
    expect(finalState.roster.some((unit) => unit.id === 'tower-champion')).toBe(true);
  });

  it('updates tower record metrics when a run ends', () => {
    const initialRecord = store.getState().towerRecord;
    expect(initialRecord.totalRuns).toBe(0);

    const firstFloor = store.getState().getCurrentTowerFloor();
    store.setState({ activeTowerEncounterId: firstFloor?.encounterId ?? null });
    store
      .getState()
      .handleTowerBattleCompleted({
        battle: makeTowerBattleState(store.getState().team!, firstFloor!.encounterId),
        events: [],
      });
    store.getState().quitTowerRun();

    const updatedRecord = store.getState().towerRecord;
    expect(updatedRecord.totalRuns).toBe(1);
    expect(updatedRecord.highestFloorEver).toBeGreaterThanOrEqual(1);
  });

  it('hydrates tower record state from external data', () => {
    store.getState().setTowerRecord({
      highestFloorEver: 12,
      totalRuns: 4,
      bestRunTurns: 55,
      bestRunDamageDealt: 3200,
    });

    const record = store.getState().towerRecord;
    expect(record.highestFloorEver).toBe(12);
    expect(record.totalRuns).toBe(4);
    expect(record.bestRunTurns).toBe(55);
    expect(record.bestRunDamageDealt).toBe(3200);
  });
});

function makeTowerBattleState(team: Team, encounterId: string): BattleState {
  const base = createBattleState(team, []);
  return {
    ...base,
    playerTeam: team,
    enemies: [],
    unitById: buildUnitIndex(team.units, []),
    phase: 'victory',
    status: 'PLAYER_VICTORY',
    roundNumber: base.roundNumber + 1,
    encounterId,
    meta: { encounterId, difficulty: 'normal' },
  };
}

function completeThroughFloor(store: Store, targetFloor: number) {
  while (true) {
    const floor = store.getState().getCurrentTowerFloor();
    if (!floor) {
      break;
    }
    if (floor.type === 'rest') {
      store.getState().applyTowerRest();
      continue;
    }

    store.setState({ activeTowerEncounterId: floor.encounterId });
    store
      .getState()
      .handleTowerBattleCompleted({ battle: makeTowerBattleState(store.getState().team!, floor.encounterId), events: [] });

    if (floor.floorNumber >= targetFloor) {
      break;
    }
  }
}

