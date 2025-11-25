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
import type { TowerSlice } from './towerSlice';
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
  activePortraitIndex: number | null;
  isActionMenuOpen: boolean;
  isSummonScreenOpen: boolean;
  tutorialMessage: string | null;
  currentMana: number;
  maxMana: number;
  pendingManaThisRound: number;
  pendingManaNextRound: number;
  critCounters: Record<string, number>;
  critThresholds: Record<string, number>;
  critFlash: Record<string, boolean>;

  setBattle: (battle: BattleState | null, seed: number) => void;
  setActivePortrait: (index: number | null) => void;
  setActionMenuOpen: (open: boolean) => void;
  setSummonScreenOpen: (open: boolean) => void;
  showTutorialMessage: (message: string | null) => void;
  updateManaState: (current: number, pending: number, pendingNext: number) => void;
  incrementCritCounter: (unitId: string) => void;
  resetCritCounter: (unitId: string) => void;
  triggerCritFlash: (unitId: string) => void;
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
  QueueBattleSlice & GameFlowSlice & RewardsSlice & StorySlice & TeamSlice & SaveSlice & DialogueSlice & TowerSlice,
  [['zustand/devtools', never]],
  [],
  QueueBattleSlice
> = (set, get) => ({
  battle: null,
  events: [],
  rngSeed: 1337,
  activePortraitIndex: null,
  isActionMenuOpen: true,
  isSummonScreenOpen: false,
  tutorialMessage: null,
  currentMana: 0,
  maxMana: 0,
  pendingManaThisRound: 0,
  pendingManaNextRound: 0,
  critCounters: {},
  critThresholds: {},
  critFlash: {},

  setBattle: (battle, seed) => {
    const critThresholds: Record<string, number> = {};
    const critCounters: Record<string, number> = {};
    if (battle) {
      battle.playerTeam.units.forEach((unit) => {
        critThresholds[unit.id] = critThresholds[unit.id] ?? 10;
        critCounters[unit.id] = 0;
      });
    }

    set({
      battle,
      rngSeed: seed,
      events: [],
      activePortraitIndex: null, // allow speed-based auto-selection in view
      currentMana: battle?.remainingMana ?? 0,
      maxMana: battle?.maxMana ?? 0,
      pendingManaThisRound: 0,
      pendingManaNextRound: 0,
      critCounters,
      critThresholds,
      critFlash: {},
    });
  },

  setActivePortrait: (index) => {
    set({ activePortraitIndex: index });
  },

  setActionMenuOpen: (open) => set({ isActionMenuOpen: open }),
  setSummonScreenOpen: (open) => set({ isSummonScreenOpen: open }),
  showTutorialMessage: (message) => set({ tutorialMessage: message }),

  updateManaState: (current, pending, pendingNext) => {
    set({
      currentMana: current,
      pendingManaThisRound: pending,
      pendingManaNextRound: pendingNext,
    });
  },

  incrementCritCounter: (unitId) => {
    set((state) => ({
      critCounters: {
        ...state.critCounters,
        [unitId]: (state.critCounters[unitId] ?? 0) + 1,
      },
    }));
  },

  resetCritCounter: (unitId) => {
    set((state) => ({
      critCounters: {
        ...state.critCounters,
        [unitId]: 0,
      },
    }));
  },

  triggerCritFlash: (unitId) => {
    set((state) => ({
      critFlash: { ...state.critFlash, [unitId]: true },
    }));
    setTimeout(() => {
      set((state) => {
        const { [unitId]: _, ...rest } = state.critFlash;
        return { critFlash: rest };
      });
    }, 200);
  },

  queueUnitAction: (unitIndex, abilityId, targetIds, ability) => {
    const { battle } = get();
    if (!battle || battle.phase !== 'planning') {
      // TODO: Add proper validation error handling
      // console.warn('Cannot queue action: not in planning phase');
      return;
    }

    const unit = battle.playerTeam.units[unitIndex];
    if (!unit) {
      // TODO: Add proper validation error handling
      // console.warn(`Cannot queue action: invalid unit index ${unitIndex}`);
      return;
    }

    const result = queueAction(battle, unit.id, abilityId, targetIds, ability);
    if (!result.ok) {
      // Log error for UI feedback (could be enhanced with toast notifications)
      console.warn(`Failed to queue action: ${result.error}`);
      return;
    }

    const pendingThisRound = result.value.queuedActions.filter((a) => a?.abilityId === null).length;

    set({
      battle: result.value,
      currentMana: result.value.remainingMana,
      maxMana: result.value.maxMana,
      pendingManaThisRound: pendingThisRound,
      // Next-round pending will be set when we differentiate generators; default 0 for now.
      pendingManaNextRound: 0,
    });
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

    const pendingThisRound = result.value.queuedActions.filter((a) => a?.abilityId === null).length;

    set({
      battle: result.value,
      currentMana: result.value.remainingMana,
      maxMana: result.value.maxMana,
      pendingManaThisRound: pendingThisRound,
      pendingManaNextRound: 0,
    });
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

    const pendingThisRound = result.state.queuedActions.filter((a) => a?.abilityId === null).length;

    set({
      battle: result.state,
      events: battleEvents,
      currentMana: result.state.remainingMana,
      maxMana: result.state.maxMana,
      pendingManaThisRound: pendingThisRound,
      pendingManaNextRound: 0,
    });

    const encounterId = getEncounterId(result.state);
    const towerEncounterId = get().activeTowerEncounterId;
    const isTowerBattle =
      get().towerStatus === 'in-run' &&
      towerEncounterId !== null &&
      encounterId === towerEncounterId;

    if (isTowerBattle && (result.state.phase === 'victory' || result.state.phase === 'defeat')) {
      get().handleTowerBattleCompleted({ battle: result.state, events: battleEvents });
      return;
    }

    // Sync Djinn trackers to team state (after round execution)
    if (result.state.playerTeam.djinnTrackers) {
      const { updateTeam: updateTeamState } = get();
      updateTeamState({
        djinnTrackers: result.state.playerTeam.djinnTrackers,
      });
    }

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
