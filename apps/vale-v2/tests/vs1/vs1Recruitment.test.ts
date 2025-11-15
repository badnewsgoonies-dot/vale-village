/**
 * VS1 Recruitment Flow Tests
 * Tests the complete flow: battle → victory → recruitment → roster update
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { createStore } from '@/ui/state/store';
import { VS1_ENCOUNTER_ID } from '@/story/vs1Constants';
import { createBattleFromEncounter } from '@/core/services/EncounterService';
import { makePRNG } from '@/core/random/prng';
import { UNIT_DEFINITIONS } from '@/data/definitions/units';
import { createUnit } from '@/core/models/Unit';
import { createTeam } from '@/core/models/Team';
import { collectDjinn, equipDjinn } from '@/core/services/DjinnService';
import { processVictory } from '@/core/services/RewardsService';

describe('VS1 Recruitment Flow', () => {
  let store: ReturnType<typeof createStore>;

  beforeEach(() => {
    store = createStore();

    // Initialize team: Isaac (adept) at level 1 with Flint equipped (mirrors App.tsx)
    const adeptDef = UNIT_DEFINITIONS['adept'];
    if (!adeptDef) {
      throw new Error('Adept unit definition not found');
    }

    const isaac = createUnit(adeptDef, 1, 0);
    let team = createTeam([isaac]);

    const flintCollectResult = collectDjinn(team, 'flint');
    if (!flintCollectResult.ok) {
      throw new Error(`Failed to collect Flint: ${flintCollectResult.error}`);
    }

    const flintEquipResult = equipDjinn(flintCollectResult.value, 'flint', 0);
    if (!flintEquipResult.ok) {
      throw new Error(`Failed to equip Flint: ${flintEquipResult.error}`);
    }

    team = flintEquipResult.value;
    store.getState().setTeam(team);
    store.getState().setRoster([isaac]);
  });

  it('recruits Garet after VS1 victory', () => {
    const team = store.getState().team;
    expect(team).toBeTruthy();
    if (!team) return;

    const rng = makePRNG(42);
    const battleResult = createBattleFromEncounter(VS1_ENCOUNTER_ID, team, rng);

    expect(battleResult).toBeTruthy();
    if (!battleResult) return;

    const { battle } = battleResult;
    const defeatedBattle = {
      ...battle,
      enemies: battle.enemies.map(enemy => ({ ...enemy, currentHp: 0 })),
      phase: 'victory' as const,
    };

    const result = processVictory(defeatedBattle);

    expect(result.recruitedUnit).toBeTruthy();
    expect(result.recruitedUnit?.id).toBe('war-mage');
    expect(result.recruitedUnit?.level).toBe(2);

    store.getState().processVictory(defeatedBattle);
    const roster = store.getState().roster;

    expect(roster.length).toBe(2);
    expect(roster.some(unit => unit.id === 'adept')).toBe(true);
    expect(roster.some(unit => unit.id === 'war-mage')).toBe(true);
  });

  it('grants Forge Djinn after VS1 victory', () => {
    const team = store.getState().team;
    expect(team).toBeTruthy();
    if (!team) return;

    const rng = makePRNG(99);
    const battleResult = createBattleFromEncounter(VS1_ENCOUNTER_ID, team, rng);

    expect(battleResult).toBeTruthy();
    if (!battleResult) return;

    const { battle } = battleResult;
    const defeatedBattle = {
      ...battle,
      enemies: battle.enemies.map(enemy => ({ ...enemy, currentHp: 0 })),
      phase: 'victory' as const,
    };

    store.getState().processVictory(defeatedBattle);
    const updatedTeam = store.getState().team;

    expect(updatedTeam).toBeTruthy();
    if (!updatedTeam) return;

    expect(updatedTeam.collectedDjinn.includes('forge')).toBe(true);
  });
});

