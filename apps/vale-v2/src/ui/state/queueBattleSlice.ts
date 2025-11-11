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
} from '../../core/services/QueueBattleService';
import { makePRNG } from '../../core/random/prng';
import { getEncounterId } from '../../core/models/BattleState';
import { createRNGStream, RNG_STREAMS } from '../../core/constants';

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
  QueueBattleSlice & import('./rewardsSlice').RewardsSlice & import('./teamSlice').TeamSlice & import('./storySlice').StorySlice & import('./gameFlowSlice').GameFlowSlice,
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

    const result = queueAction(battle, unit.id, abilityId, targetIds, ability);
    if (!result.ok) {
      // Throw error for UI to handle (e.g., show alert)
      throw new Error(result.error);
    }
    
    set({ battle: result.value });
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

    const rng = makePRNG(createRNGStream(rngSeed, battle.roundNumber, RNG_STREAMS.QUEUE_ROUND));
    const result = executeRound(battle, rng);

    // Update battle state
    set({ battle: result.state, events: [...get().events, ...result.events] });

    const { processVictory, onBattleEvents, setMode, setShowRewards } = get();
    const rngVictory = makePRNG(createRNGStream(rngSeed, battle.roundNumber, RNG_STREAMS.VICTORY));

    if (result.state.phase === 'victory') {
      processVictory(result.state, rngVictory);
      setMode('rewards');
      setShowRewards(true);
      const encounterId = getEncounterId(result.state);
      if (encounterId && onBattleEvents) {
        onBattleEvents([
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

    if (result.state.phase === 'defeat') {
      console.log('Battle lost - returning to overworld');
      setMode('overworld');
    }
  },

  dequeueEvent: () => {
    const { events } = get();
    if (events.length === 0) return;

    // Use snapshot-based processing to avoid race conditions
    set({ events: events.slice(1) });
  },
});

