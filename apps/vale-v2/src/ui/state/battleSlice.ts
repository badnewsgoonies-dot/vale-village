/**
 * Battle state slice for Zustand
 * Manages battle state, events, and turn progression
 */

import type { StateCreator } from 'zustand';
import type { BattleState } from '../../core/models/BattleState';
import { getEncounterId } from '../../core/models/BattleState';
import type { BattleEvent } from '../../core/services/types';
import { performAction, endTurn, checkBattleEnd } from '../../core/services/BattleService';
import { makeAIDecision } from '../../core/services/AIService';
import { processStatusEffectTick } from '../../core/algorithms/status';
import { makePRNG } from '../../core/random/prng';

export interface BattleSlice {
  battle: BattleState | null;
  events: BattleEvent[];
  rngSeed: number;
  turnNumber: number;
  
  setBattle: (battle: BattleState, seed: number) => void;
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
  BattleSlice,
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
    const rng = makePRNG(rngSeed + turnNumber * 1_000_000);
    const currentActorId = battle.turnOrder[battle.currentActorIndex];
    const allUnits = [...battle.playerTeam.units, ...battle.enemies];
    const currentActor = allUnits.find(u => u.id === currentActorId);

    if (currentActor && currentActorId) {
      const statusResult = processStatusEffectTick(currentActor, rng);
      // Update actor with status effects
      const updatedAllUnits = allUnits.map(u =>
        u.id === currentActorId ? statusResult.updatedUnit : u
      );

      const updatedPlayerUnits = updatedAllUnits.filter(u =>
        battle.playerTeam.units.some(pu => pu.id === u.id)
      );
      const updatedEnemies = updatedAllUnits.filter(u =>
        battle.enemies.some(e => e.id === u.id)
      );

      const updatedBattle: BattleState = {
        ...battle,
        playerTeam: {
          ...battle.playerTeam,
          units: updatedPlayerUnits,
        },
        enemies: updatedEnemies,
      };

      // Generate events for status effects
      const newEvents: BattleEvent[] = [];
      if (statusResult.damage > 0) {
        newEvents.push({
          type: 'hit',
          targetId: currentActorId,
          amount: statusResult.damage,
          crit: false,
        });
      }
      // Check for expired statuses by comparing old and new status effects
      const oldStatusIds = new Set(currentActor.statusEffects.map(s => `${s.type}-${s.duration}`));
      const newStatusIds = new Set(statusResult.updatedUnit.statusEffects.map(s => `${s.type}-${s.duration}`));
      currentActor.statusEffects.forEach(status => {
        const statusKey = `${status.type}-${status.duration}`;
        if (oldStatusIds.has(statusKey) && !newStatusIds.has(statusKey)) {
          // StatusEffect is already compatible with BattleEvent status field
          newEvents.push({
            type: 'status-expired',
            targetId: currentActorId,
            status: status as any, // Type assertion needed due to discriminated union complexity
          });
        }
      });

      set({ battle: updatedBattle, events: [...events, ...newEvents] });
    }
  },

  perform: (casterId, abilityId, targetIds) => {
    const { battle, rngSeed, turnNumber, events } = get();
    if (!battle) return;

    // Separate substream for actions
    const rng = makePRNG(rngSeed + turnNumber * 1_000_000 + 7);
    const result = performAction(battle, casterId, abilityId, targetIds, rng);

    // Check for battle end
    const battleEnd = checkBattleEnd(result.state);
    const newEvents: BattleEvent[] = [...result.events];
    if (battleEnd) {
      newEvents.push({
        type: 'battle-end',
        result: battleEnd,
      });
      
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
    }

    set({ battle: result.state, events: [...events, ...newEvents] });
  },

  endTurn: () => {
    const { battle, rngSeed, turnNumber } = get();
    if (!battle) return;

    const rng = makePRNG(rngSeed + turnNumber * 1_000_000);
    const nextState = endTurn(battle, rng);
    set({ battle: nextState, turnNumber: turnNumber + 1 });
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
    const rng = makePRNG(rngSeed + turnNumber * 1_000_000 + 7);
    try {
      const decision = makeAIDecision(battle, currentActorId, rng);
      
      // Execute the decision
      const result = performAction(battle, currentActorId, decision.abilityId, decision.targetIds, rng);

      // Check for battle end
      const battleEnd = checkBattleEnd(result.state);
      const newEvents: BattleEvent[] = [...result.events];
      if (battleEnd) {
        newEvents.push({
          type: 'battle-end',
          result: battleEnd,
        });
      }

      set({ battle: result.state, events: [...events, ...newEvents] });
      
      // Notify story slice of encounter completion
      // Also emit encounter-finished event for story progression
      const encounterId = getEncounterId(battle);
      if (battleEnd && encounterId) {
        newEvents.push({
          type: 'encounter-finished',
          outcome: battleEnd,
          encounterId,
        });
        const store = get() as any;
        if (store.onBattleEvents) {
          store.onBattleEvents(newEvents);
        }
      }
    } catch (error) {
      console.error('AI decision failed:', error);
      // Fallback: end turn
      const rngFallback = makePRNG(rngSeed + turnNumber * 1_000_000);
      const nextState = endTurn(battle, rngFallback);
      set({ battle: nextState, turnNumber: turnNumber + 1 });
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
      const totalDamage = result.events
        .filter((e): e is Extract<BattleEvent, { type: 'hit' }> => e.type === 'hit')
        .reduce((acc, ev) => acc + ev.amount, 0);

      sum += totalDamage;
      min = Math.min(min, totalDamage);
      max = Math.max(max, totalDamage);
    }

    return { avg: Math.round(sum / N), min, max };
  },
});

