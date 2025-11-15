/**
 * Queue-based battle state slice for Zustand
 * PR-QUEUE-BATTLE: Manages planning and execution phases
 */

import type { StateCreator } from 'zustand';
import type { BattleState } from '../../core/models/BattleState';
import type { BattleEvent } from '../../core/services/types';
import type { Ability } from '../../data/schemas/AbilitySchema';
import type { GameFlowSlice } from './gameFlowSlice';
import type { RewardsSlice } from './rewardsSlice';
import type { StorySlice } from './storySlice';
import type { TeamSlice } from './teamSlice';
import type { SaveSlice } from './saveSlice';
import type { DialogueSlice } from './dialogueSlice';
import {
  queueAction,
  clearQueuedAction,
  queueDjinn,
  unqueueDjinn,
  executeRound,
} from '../../core/services/QueueBattleService';
import { makePRNG } from '../../core/random/prng';
import { autoHealUnits } from '../../core/algorithms/healing';
import { updateTeam } from '../../core/models/Team';
import {
  getEncounterId,
  updateBattleState,
} from '../../core/models/BattleState';
import { createRNGStream, RNG_STREAMS } from '../../core/constants';
import { VS1_ENCOUNTER_ID, VS1_SCENE_PRE } from '../../story/vs1Constants';
import { DIALOGUES } from '../../data/definitions/dialogues';

export interface QueueBattleSlice {
  battle: BattleState | null;
  events: BattleEvent[];
  rngSeed: number;

  setBattle: (battle: BattleState | null, seed: number) => void;
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
  QueueBattleSlice & GameFlowSlice & RewardsSlice & StorySlice & TeamSlice & SaveSlice & DialogueSlice,
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
      console.warn('Cannot queue action: not in planning phase');
      return;
    }

    const unit = battle.playerTeam.units[unitIndex];
    if (!unit) {
      console.warn(`Cannot queue action: invalid unit index ${unitIndex}`);
      return;
    }

    const result = queueAction(battle, unit.id, abilityId, targetIds, ability);
    if (!result.ok) {
      // Log error for UI feedback (could be enhanced with toast notifications)
      console.warn(`Failed to queue action: ${result.error}`);
      return;
    }

    set({ battle: result.value });
  },

  clearUnitAction: (unitIndex) => {
    const { battle } = get();
    if (!battle || battle.phase !== 'planning') {
      return;
    }

    const result = clearQueuedAction(battle, unitIndex);
    if (!result.ok) {
      console.warn(`Failed to clear action: ${result.error}`);
      return;
    }

    set({ battle: result.value });
  },

  queueDjinnActivation: (djinnId) => {
    const { battle } = get();
    if (!battle || battle.phase !== 'planning') {
      return;
    }

    const result = queueDjinn(battle, djinnId);
    if (!result.ok) {
      console.warn(`Failed to queue Djinn: ${result.error}`);
      return;
    }

    set({ battle: result.value });
  },

  unqueueDjinnActivation: (djinnId) => {
    const { battle } = get();
    if (!battle || battle.phase !== 'planning') {
      return;
    }

    const result = unqueueDjinn(battle, djinnId);
    if (!result.ok) {
      console.warn(`Failed to unqueue Djinn: ${result.error}`);
      return;
    }

    set({ battle: result.value });
  },

  executeQueuedRound: () => {
    const { battle, rngSeed } = get();
    if (!battle || battle.phase !== 'planning') {
      return;
    }

    const rng = makePRNG(createRNGStream(rngSeed, battle.roundNumber, RNG_STREAMS.QUEUE_ROUND));
    const result = executeRound(battle, rng);
    const previousEvents = get().events;
    const battleEvents = [...previousEvents, ...result.events];

    // Update battle state with fresh events (pre-heal)
    set({ battle: result.state, events: battleEvents });

    if (result.state.phase === 'victory') {
      const {
        processVictory,
        onBattleEvents,
        updateTeamUnits,
      } = get();

      const healedUnits = autoHealUnits(result.state.playerTeam.units);
      const healedTeam = updateTeam(result.state.playerTeam, { units: healedUnits });
      const healedState = updateBattleState(result.state, { playerTeam: healedTeam });

      const healEvent: BattleEvent = {
        type: 'auto-heal',
        message: 'All units restored to full health!',
      };

      set({
        battle: healedState,
        events: [...battleEvents, healEvent],
      });

      updateTeamUnits(healedUnits);
      processVictory(healedState); // This now sets mode: 'rewards'

      // Auto-save after battle victory
      try {
        get().autoSave();
      } catch (error) {
        console.warn('Auto-save failed after battle victory:', error);
      }

      const encounterId = getEncounterId(healedState);
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

      return;
    }

    if (result.state.phase === 'defeat') {
      const { returnToOverworld, onBattleEvents, updateTeamUnits, startDialogueTree, setMode } = get();

      const healedUnits = autoHealUnits(result.state.playerTeam.units);
      const healedTeam = updateTeam(result.state.playerTeam, { units: healedUnits });
      const healedState = updateBattleState(result.state, { playerTeam: healedTeam });

      const healEvent: BattleEvent = {
        type: 'auto-heal',
        message: 'All units restored to full health!',
      };

      set({
        battle: healedState,
        events: [...battleEvents, healEvent],
      });

      updateTeamUnits(healedUnits);

      const encounterId = getEncounterId(healedState);
      if (encounterId && onBattleEvents) {
        onBattleEvents([
          {
            type: 'battle-end',
            result: 'PLAYER_DEFEAT',
          },
          {
            type: 'encounter-finished',
            outcome: 'PLAYER_DEFEAT',
            encounterId,
          },
        ]);
      }

      // VS1 specific defeat handling: retry from pre-scene
      if (encounterId === VS1_ENCOUNTER_ID) {
        const preScene = DIALOGUES[VS1_SCENE_PRE];
        if (preScene) {
          startDialogueTree(preScene);
          setMode('dialogue');
          return;
        }
      }

      // Fallback: return to overworld
      returnToOverworld();

      return;
    }
  },

  dequeueEvent: () => {
    const { events } = get();
    if (events.length === 0) return;

    // Use snapshot-based processing to avoid race conditions
    set({ events: events.slice(1) });
  },
});
