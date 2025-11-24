/**
 * Battle state slice for Zustand
 * Manages battle state, events, and turn progression
 */

import type { StateCreator } from 'zustand';
import type { BattleState } from '../../core/models/BattleState';
import { getEncounterId } from '../../core/models/BattleState';
import type { BattleEvent } from '../../core/services/types';
import { performAction, endTurn, checkBattleEnd, startTurnTick as battleServiceStartTurnTick } from '../../core/services/BattleService';
import { makeAIDecision } from '../../core/services/AIService';
import { makePRNG } from '../../core/random/prng';
import { createRNGStream, RNG_STREAMS } from '../../core/constants';
import type { RewardsSlice } from './rewardsSlice';
import type { StorySlice } from './storySlice';

export interface BattleSlice {
  battle: BattleState | null;
  events: BattleEvent[];
  rngSeed: number;
  turnNumber: number;
  
  setBattle: (battle: BattleState | null, seed: number) => void;
  startTurnTick: () => void;
  perform: (casterId: string, abilityId: string, targetIds: readonly string[]) => void;
  endTurn: () => void;
  dequeueEvent: () => void;
  performAIAction: () => void; // Auto-execute AI decision for enemy turns
  preview: (
    casterId: string,
    abilityId: string,
    targets: readonly string[]
  ) => { avg: number; min: number; max: number };
}

export const createBattleSlice: StateCreator<
  BattleSlice & RewardsSlice & StorySlice,
  [['zustand/devtools', never]],
  [],
  BattleSlice
> = (set, get) => ({
  battle: null,
  events: [],
  rngSeed: 1337,
  turnNumber: 0,

  setBattle: (battle, seed) =>
    set({ battle, rngSeed: seed, turnNumber: 0, events: [] }),

  startTurnTick: () => {
    const { battle, rngSeed, turnNumber, events } = get();
    if (!battle) return;

    // Stable per-turn stream for status effects
    const rng = makePRNG(createRNGStream(rngSeed, turnNumber, RNG_STREAMS.STATUS_EFFECTS));

    // Call service to process status effects
    const result = battleServiceStartTurnTick(battle, rng);

    set({ battle: result.updatedState, events: [...events, ...result.events] });
  },

  perform: (casterId, abilityId, targetIds) => {
    const { battle, rngSeed, turnNumber, events } = get();
    if (!battle) return;

    // Separate substream for actions
    const rng = makePRNG(createRNGStream(rngSeed, turnNumber, RNG_STREAMS.ACTIONS));
    const result = performAction(battle, casterId, abilityId, targetIds, rng);

    if (!result.ok) {
      console.error('performAction failed:', result.error);
      return;
    }

    // Check for battle end
    const battleEnd = checkBattleEnd(result.value.state);
    const newEvents: BattleEvent[] = [...result.value.events];
    if (battleEnd) {
      newEvents.push({
        type: 'battle-end',
        result: battleEnd,
      });

      // If player victory, process rewards
      if (battleEnd === 'PLAYER_VICTORY') {
        const { processVictory } = get();
        processVictory(result.value.state);
      }

      // Emit encounter-finished event if we have an encounterId
      // This is a story-specific event, emitted alongside battle-end for story progression
      const encounterId = getEncounterId(battle);
      if (encounterId) {
        newEvents.push({
          type: 'encounter-finished',
          outcome: battleEnd,
          encounterId,
        });
      }

      set({ battle: result.value.state, events: [...events, ...newEvents] });
    } else {
      // Battle continues - advance to next turn
      const rngEndTurn = makePRNG(createRNGStream(rngSeed, turnNumber, RNG_STREAMS.END_TURN));
      const endResult = endTurn(result.value.state, rngEndTurn);
      if (!endResult.ok) {
        console.error('endTurn failed:', endResult.error);
        return;
      }
      set({ battle: endResult.value, events: [...events, ...newEvents], turnNumber: turnNumber + 1 });
    }
  },

  endTurn: () => {
    const { battle, rngSeed, turnNumber } = get();
    if (!battle) return;

    const rng = makePRNG(createRNGStream(rngSeed, turnNumber, RNG_STREAMS.END_TURN));
    const result = endTurn(battle, rng);
    if (!result.ok) {
      console.error('endTurn failed:', result.error);
      return;
    }
    set({ battle: result.value, turnNumber: turnNumber + 1 });
  },

  performAIAction: () => {
    const { battle, rngSeed, turnNumber, events } = get();
    if (!battle) return;

    const allUnits = [...battle.playerTeam.units, ...battle.enemies];
    const currentActorId = battle.turnOrder[battle.currentActorIndex];
    const currentActor = allUnits.find(u => u.id === currentActorId);

    if (!currentActor || !currentActorId) return;

    // Check if it's an enemy turn
    const isPlayerUnit = battle.playerTeam.units.some(u => u.id === currentActorId);
    if (isPlayerUnit) return; // Player turn - don't auto-execute

    // Make AI decision
    const rng = makePRNG(createRNGStream(rngSeed, turnNumber, RNG_STREAMS.ACTIONS));
    try {
      const decision = makeAIDecision(battle, currentActorId, rng);

      // Execute the decision
      const result = performAction(battle, currentActorId, decision.abilityId, decision.targetIds, rng);

      if (!result.ok) {
        console.error('AI performAction failed:', result.error);
        return;
      }

      // Check for battle end
      const battleEnd = checkBattleEnd(result.value.state);
      const newEvents: BattleEvent[] = [...result.value.events];
      if (battleEnd) {
        newEvents.push({
          type: 'battle-end',
          result: battleEnd,
        });

        // If player victory, process rewards
        if (battleEnd === 'PLAYER_VICTORY') {
          const { processVictory } = get();
          processVictory(result.value.state);
        }

        // Emit encounter-finished event for story progression
        const encounterId = getEncounterId(battle);
        if (encounterId) {
          newEvents.push({
            type: 'encounter-finished',
            outcome: battleEnd,
            encounterId,
          });
        }

        set({ battle: result.value.state, events: [...events, ...newEvents] });

        // Notify story slice of encounter completion
        if (encounterId) {
          const { onBattleEvents } = get();
          if (onBattleEvents) {
            onBattleEvents(newEvents);
          }
        }
      } else {
        // Battle continues - advance to next turn
        const rngEndTurn = makePRNG(rngSeed + turnNumber * 1_000_000);
        const endResult = endTurn(result.value.state, rngEndTurn);
        if (!endResult.ok) {
          console.error('AI endTurn failed:', endResult.error);
          return;
        }
        set({ battle: endResult.value, events: [...events, ...newEvents], turnNumber: turnNumber + 1 });
      }
    } catch (error) {
      console.error('AI decision failed:', error);
      // Fallback: end turn
      const rngFallback = makePRNG(createRNGStream(rngSeed, turnNumber, RNG_STREAMS.END_TURN));
      const fallbackResult = endTurn(battle, rngFallback);
      if (fallbackResult.ok) {
        set({ battle: fallbackResult.value, turnNumber: turnNumber + 1 });
      }
    }
  },

  dequeueEvent: () => {
    // Snapshot-based dequeue to prevent race conditions
    // If new events arrive during processing, we consume exactly what was there at start
    set((state) => {
      if (state.events.length === 0) return state;
      
      // Remove exactly the first event (snapshot-based: slice creates new array)
      const remaining = state.events.slice(1);
      
      return { events: remaining };
    });
  },

  preview: (casterId, abilityId, targets) => {
    const { battle, rngSeed, turnNumber } = get();
    if (!battle) return { avg: 0, min: 0, max: 0 };

    // Use a cloned deterministic stream so hovers never consume the live RNG
    const previewSeed =
      rngSeed ^
      (turnNumber << 8) ^
      (abilityId.length << 16) ^
      (casterId.length << 24);
    const baseRng = makePRNG(previewSeed);

    // Run N deterministic samples
    const N = 16;
    let sum = 0;
    let min = Number.POSITIVE_INFINITY;
    let max = 0;

    for (let i = 0; i < N; i++) {
      const r = baseRng.clone();
      const result = performAction(battle, casterId, abilityId, targets, r);
      if (!result.ok) {
        continue; // Skip failed previews
      }
      const totalDamage = result.value.events
        .filter((e): e is Extract<BattleEvent, { type: 'hit' }> => e.type === 'hit')
        .reduce((acc, ev) => acc + ev.amount, 0);

      sum += totalDamage;
      min = Math.min(min, totalDamage);
      max = Math.max(max, totalDamage);
    }

    return { avg: Math.round(sum / N), min, max };
  },
});
