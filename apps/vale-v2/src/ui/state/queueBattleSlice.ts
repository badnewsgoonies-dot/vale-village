/**
 * Queue-based battle state slice for Zustand
 * PR-QUEUE-BATTLE: Manages planning and execution phases
 */

import type { StateCreator } from 'zustand';
import type { BattleState } from '../../core/models/BattleState';
import type { BattleEvent } from '../../core/services/types';
import type { Ability } from '../../data/schemas/AbilitySchema';
import {
  queueAction,
  clearQueuedAction,
  queueDjinn,
  unqueueDjinn,
  executeRound,
  refreshMana,
} from '../../core/services/QueueBattleService';
import { makePRNG } from '../../core/random/prng';
import { getEncounterId } from '../../core/models/BattleState';

export interface QueueBattleSlice {
  battle: BattleState | null;
  events: BattleEvent[];
  rngSeed: number;

  setBattle: (battle: BattleState, seed: number) => void;
  queueUnitAction: (
    unitIndex: number,
    abilityId: string | null,
    targetIds: readonly string[],
    ability?: Ability
  ) => void;
  clearUnitAction: (unitIndex: number) => void;
  queueDjinnActivation: (djinnId: string) => void;
  unqueueDjinnActivation: (djinnId: string) => void;
  executeQueuedRound: () => void;
  dequeueEvent: () => void;
}

export const createQueueBattleSlice: StateCreator<
  QueueBattleSlice & import('./rewardsSlice').RewardsSlice & import('./teamSlice').TeamSlice & import('./storySlice').StorySlice,
  [['zustand/devtools', never]],
  [],
  QueueBattleSlice
> = (set, get) => ({
  battle: null,
  events: [],
  rngSeed: 1337,

  setBattle: (battle, seed) => {
    set({ battle, rngSeed: seed, events: [] });
  },

  queueUnitAction: (unitIndex, abilityId, targetIds, ability) => {
    const { battle } = get();
    if (!battle || battle.phase !== 'planning') {
      throw new Error('Can only queue actions during planning phase');
    }

    const unit = battle.playerTeam.units[unitIndex];
    if (!unit) {
      throw new Error(`Invalid unit index: ${unitIndex}`);
    }

    try {
      const updatedBattle = queueAction(battle, unit.id, abilityId, targetIds, ability);
      set({ battle: updatedBattle });
    } catch (error) {
      console.error('Failed to queue action:', error);
      throw error;
    }
  },

  clearUnitAction: (unitIndex) => {
    const { battle } = get();
    if (!battle || battle.phase !== 'planning') {
      return;
    }

    const updatedBattle = clearQueuedAction(battle, unitIndex);
    set({ battle: updatedBattle });
  },

  queueDjinnActivation: (djinnId) => {
    const { battle } = get();
    if (!battle || battle.phase !== 'planning') {
      return;
    }

    try {
      const updatedBattle = queueDjinn(battle, djinnId);
      set({ battle: updatedBattle });
    } catch (error) {
      console.error('Failed to queue Djinn:', error);
    }
  },

  unqueueDjinnActivation: (djinnId) => {
    const { battle } = get();
    if (!battle || battle.phase !== 'planning') {
      return;
    }

    const updatedBattle = unqueueDjinn(battle, djinnId);
    set({ battle: updatedBattle });
  },

  executeQueuedRound: () => {
    const { battle, rngSeed } = get();
    if (!battle || battle.phase !== 'planning') {
      return;
    }

    const rng = makePRNG(rngSeed + battle.roundNumber * 1000);
    const result = executeRound(battle, rng);

    // Update battle state
    set({ battle: result.state, events: [...get().events, ...result.events] });

    // If player victory, process rewards
    if (result.state.phase === 'victory') {
      const store = get() as any;
      if (store.processVictory) {
        const rngVictory = makePRNG(rngSeed + battle.roundNumber * 1_000_000 + 999);
        store.processVictory(result.state, rngVictory);
      }

      // Notify story slice
      const encounterId = getEncounterId(result.state);
      if (encounterId && store.onBattleEvents) {
        store.onBattleEvents([
          {
            type: 'battle-end',
            result: 'PLAYER_VICTORY',
          },
          {
            type: 'encounter-finished',
            outcome: 'PLAYER_VICTORY',
            encounterId,
          },
        ]);
      }
    }
  },

  dequeueEvent: () => {
    const { events } = get();
    if (events.length === 0) return;

    // Use snapshot-based processing to avoid race conditions
    set({ events: events.slice(1) });
  },
});

