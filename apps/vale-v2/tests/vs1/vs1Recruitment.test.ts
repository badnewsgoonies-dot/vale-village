/**
 * VS1 Recruitment Flow Tests (dialogue-driven)
 *
 * These tests validate that the VS1 demo path uses the narrative system to
 * recruit Garet (war-mage) and grant the Forge Djinn via the VS1 post-scene
 * dialogue, rather than relying on RewardsService.processVictory to return
 * recruitment payloads.
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { createStore } from '@/ui/state/store';
import { VS1_ENCOUNTER_ID, VS1_SCENE_POST } from '@/story/vs1Constants';
import { DIALOGUES } from '@/data/definitions/dialogues';
import { createBattleFromEncounter } from '@/core/services/EncounterService';
import type { BattleState } from '@/core/models/BattleState';
import { makePRNG } from '@/core/random/prng';
import { createVs1IsaacTeam } from '@/utils/teamSetup';

describe('VS1 Recruitment Flow (dialogue-driven)', () => {
  let store: ReturnType<typeof createStore>;

  beforeEach(() => {
    store = createStore();

    const { isaac, team } = createVs1IsaacTeam();
    store.getState().setTeam(team);
    store.getState().setRoster([isaac]);
  });

  function createDefeatedVs1Battle(seed: number): BattleState {
    const team = store.getState().team;
    expect(team).toBeTruthy();
    if (!team) throw new Error('Team not initialized');

    const rng = makePRNG(seed);
    const battleResult = createBattleFromEncounter(VS1_ENCOUNTER_ID, team, rng);

    expect(battleResult).toBeTruthy();
    if (!battleResult) throw new Error('Failed to create VS1 battle');

    const { battle } = battleResult;
    return {
      ...battle,
      enemies: battle.enemies.map((enemy) => ({ ...enemy, currentHp: 0 })),
      phase: 'victory',
    } as BattleState;
  }

  function playDialogue(treeId: string, maxSteps = 10) {
    const tree = DIALOGUES[treeId];
    if (!tree) throw new Error(`Dialogue ${treeId} not found`);

    store.getState().startDialogueTree(tree);

    for (let step = 0; step < maxSteps; step += 1) {
      const state = store.getState();
      if (!state.currentDialogueTree || !state.currentDialogueState) {
        break;
      }
      state.advanceCurrentDialogue();
    }
  }

  it('recruits Garet and grants Forge after VS1 victory via post-scene dialogue', () => {
    const defeatedBattle = createDefeatedVs1Battle(42);

    // Process victory through the rewards slice to populate lastBattleRewards
    // and lastBattleEncounterId, mirroring the in-game flow.
    store.getState().processVictory(defeatedBattle);

    // Rewards should now be present and tied to the VS1 encounter.
    const afterVictory = store.getState();
    expect(afterVictory.lastBattleRewards).toBeTruthy();
    expect(afterVictory.lastBattleEncounterId).toBe(VS1_ENCOUNTER_ID);

    const rosterBefore = afterVictory.roster.map((u) => u.id);
    expect(rosterBefore).toEqual(['adept']);

    // Simulate clicking Continue on the rewards screen: claim loot and
    // transition into the VS1 post-scene dialogue. In the real app this is
    // wired via App.handleRewardsContinue; here we mirror that logic.
    store.getState().claimRewards();
    playDialogue(VS1_SCENE_POST);

    const finalState = store.getState();
    const finalRosterIds = finalState.roster.map((u) => u.id);
    const finalTeam = finalState.team;

    // Garet (war-mage) should have joined the roster alongside Isaac.
    expect(finalRosterIds).toContain('adept');
    expect(finalRosterIds).toContain('war-mage');

    // Forge Djinn should be granted to the team via dialogue effect.
    expect(finalTeam).toBeTruthy();
    if (!finalTeam) return;
    expect(finalTeam.collectedDjinn.includes('forge')).toBe(true);
  });
});


