/**
 * Replay Service
 * Deterministic replay of battles from ReplayTape
 */

import type { ReplayTape, PlayerCommand, SystemTick, GameStateSnapshot } from './types';
import type { BattleState } from '../models/BattleState';
import { getEncounterId } from '../models/BattleState';
import type { PRNG } from '../random/prng';
import { makePRNG } from '../random/prng';
import { performAction, endTurn, checkBattleEnd } from '../services/BattleService';
import { processStatusEffectTick } from '../algorithms/status';
import type { BattleEvent } from '../services/types';

/**
 * Replay result
 */
export interface ReplayResult {
  finalState: BattleState | null;
  events: readonly BattleEvent[];
  success: boolean;
  error?: string;
}

/**
 * Create initial battle state from snapshot
 */
function createBattleFromSnapshot(
  snapshot: GameStateSnapshot
): BattleState | null {
  if (!snapshot.battle) {
    return null;
  }

  // Recreate battle state from snapshot
  // Note: This assumes battle state is fully serializable
  // In a real implementation, you might need to reconstruct units from IDs
  return snapshot.battle;
}

/**
 * Apply a player command to battle state
 */
function applyPlayerCommand(
  state: BattleState,
  command: PlayerCommand,
  rng: PRNG
): { state: BattleState; events: BattleEvent[] } {
  if (command.type === 'ability' && command.abilityId && command.targetIds) {
    const result = performAction(state, command.actorId, command.abilityId, command.targetIds, rng);

    if (!result.ok) {
      throw new Error(`Action failed: ${result.error}`);
    }

    const battleEnd = checkBattleEnd(result.value.state);
    const events: BattleEvent[] = [...result.value.events];
    if (battleEnd) {
      events.push({
        type: 'battle-end',
        result: battleEnd,
      });

      // Emit encounter-finished if we have encounterId
      const encounterId = getEncounterId(result.value.state);
      if (encounterId) {
        events.push({
          type: 'encounter-finished',
          outcome: battleEnd,
          encounterId,
        });
      }
    }

    return { state: result.value.state, events };
  } else if (command.type === 'end-turn') {
    const endResult = endTurn(state, rng);
    if (!endResult.ok) {
      throw new Error(`End turn failed: ${endResult.error}`);
    }
    return { state: endResult.value, events: [] };
  }

  throw new Error(`Unknown command type: ${command.type}`);
}

/**
 * Apply a system tick to battle state
 */
function applySystemTick(
  state: BattleState,
  tick: SystemTick,
  rng: PRNG
): { state: BattleState; events: BattleEvent[] } {
  if (tick.type === 'status-tick') {
    const allUnits = [...state.playerTeam.units, ...state.enemies];
    const actor = allUnits.find(u => u.id === tick.actorId);
    
    if (!actor) {
      return { state, events: [] };
    }

    const statusResult = processStatusEffectTick(actor, rng);
    const updatedAllUnits = allUnits.map(u =>
      u.id === tick.actorId ? statusResult.updatedUnit : u
    );

    const updatedPlayerUnits = updatedAllUnits.filter(u =>
      state.playerTeam.units.some(pu => pu.id === u.id)
    );
    const updatedEnemies = updatedAllUnits.filter(u =>
      state.enemies.some(e => e.id === u.id)
    );

    const updatedState: BattleState = {
      ...state,
      playerTeam: {
        ...state.playerTeam,
        units: updatedPlayerUnits,
      },
      enemies: updatedEnemies,
    };

    const events: BattleEvent[] = [];
    if (statusResult.damage > 0) {
      events.push({
        type: 'hit',
        targetId: tick.actorId,
        amount: statusResult.damage,
      });
    }

    return { state: updatedState, events };
  } else if (tick.type === 'ai-action' && tick.abilityId && tick.targetIds) {
    const result = performAction(state, tick.actorId, tick.abilityId, tick.targetIds, rng);

    if (!result.ok) {
      throw new Error(`AI action failed: ${result.error}`);
    }

    const battleEnd = checkBattleEnd(result.value.state);
    const events: BattleEvent[] = [...result.value.events];
    if (battleEnd) {
      events.push({
        type: 'battle-end',
        result: battleEnd,
      });

      // Emit encounter-finished if we have encounterId
      const encounterId = getEncounterId(result.value.state);
      if (encounterId) {
        events.push({
          type: 'encounter-finished',
          outcome: battleEnd,
          encounterId,
        });
      }
    }

    return { state: result.value.state, events };
  }

  return { state, events: [] };
}

/**
 * Play a replay tape deterministically
 */
export function playReplay(tape: ReplayTape): ReplayResult {
  try {
    // Create initial battle state
    let battleState = createBattleFromSnapshot(tape.initial);
    if (!battleState) {
      return {
        finalState: null,
        events: [],
        success: false,
        error: 'No battle state in snapshot',
      };
    }

    const allEvents: BattleEvent[] = [];

    // Process each input
    for (const input of tape.inputs) {
      // Use deterministic per-turn RNG substream
      const turnRng = makePRNG(tape.seed + input.turn * 1_000_000);

      if (input.type === 'ability' || input.type === 'end-turn') {
        const result = applyPlayerCommand(battleState, input as PlayerCommand, turnRng);
        battleState = result.state;
        allEvents.push(...result.events);

        // Check if battle ended
        if (battleState.status !== 'ongoing') {
          break;
        }
      } else {
        const result = applySystemTick(battleState, input as SystemTick, turnRng);
        battleState = result.state;
        allEvents.push(...result.events);

        // Check if battle ended
        if (battleState.status !== 'ongoing') {
          break;
        }
      }
    }

    return {
      finalState: battleState,
      events: allEvents,
      success: true,
    };
  } catch (error) {
    return {
      finalState: null,
      events: [],
      success: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}
