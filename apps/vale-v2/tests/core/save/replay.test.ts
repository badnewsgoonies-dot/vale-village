/**
 * Replay System Tests
 * Tests for deterministic replay functionality
 */

import { describe, it, expect } from 'vitest';
import { playReplay } from '../../../src/core/save/ReplayService';
import type { ReplayTape, GameStateSnapshot, PlayerCommand } from '../../../src/core/save/types';
import { createBattleState } from '../../../src/core/models/BattleState';
import { createTeam } from '../../../src/core/models/Team';
import { createUnit } from '../../../src/core/models/Unit';
import { UNIT_DEFINITIONS } from '../../../src/data/definitions/units';
import { enemyToUnit } from '../../../src/core/utils/enemyToUnit';
import { ENEMIES } from '../../../src/data/definitions/enemies';
import { CURRENT_SAVE_VERSION } from '../../../src/core/save/migrations';

describe('ReplayService', () => {
  it('should replay a simple battle deterministically', () => {
    const seed = 1337;
    
    // Create initial state
    const playerUnit1 = createUnit(UNIT_DEFINITIONS.adept, 1, 0);
    const playerUnit2 = createUnit(UNIT_DEFINITIONS.war_mage, 1, 0);
    const playerUnit3 = createUnit(UNIT_DEFINITIONS.mystic, 1, 0);
    const playerUnit4 = createUnit(UNIT_DEFINITIONS.ranger, 1, 0);
    const enemyUnit = enemyToUnit(ENEMIES.slime);
    
    const team = createTeam([playerUnit1, playerUnit2, playerUnit3, playerUnit4]);
    const battleState = createBattleState(team, [enemyUnit], [playerUnit1.id, enemyUnit.id]);
    
    const initial: GameStateSnapshot = {
      battle: battleState,
      team,
      chapter: 'c1',
      flags: {},
      gold: 0,
      unitsCollected: ['adept'],
    };

    // Create replay tape with player commands
    const tape: ReplayTape = {
      seed,
      initial,
      inputs: [
        {
          type: 'ability',
          turn: 0,
          actorId: playerUnit1.id,
          abilityId: 'strike',
          targetIds: [enemyUnit.id],
        } as PlayerCommand,
      ],
      engineVersion: CURRENT_SAVE_VERSION,
      dataVersion: CURRENT_SAVE_VERSION,
    };

    // Play replay
    const result1 = playReplay(tape);
    expect(result1.success).toBe(true);
    expect(result1.finalState).toBeDefined();
    expect(result1.events.length).toBeGreaterThan(0);

    // Play again - should be identical
    const result2 = playReplay(tape);
    expect(result2.success).toBe(true);
    
    // Compare final states (deep equality)
    expect(result2.finalState).toEqual(result1.finalState);
    expect(result2.events).toEqual(result1.events);
  });

  it('should handle empty replay tape', () => {
    const seed = 1337;
    
    // Create a minimal team with 4 units
    const unit1 = createUnit(UNIT_DEFINITIONS.adept, 1, 0);
    const unit2 = createUnit(UNIT_DEFINITIONS.war_mage, 1, 0);
    const unit3 = createUnit(UNIT_DEFINITIONS.mystic, 1, 0);
    const unit4 = createUnit(UNIT_DEFINITIONS.ranger, 1, 0);
    
    const initial: GameStateSnapshot = {
      battle: null,
      team: createTeam([unit1, unit2, unit3, unit4]),
      chapter: 'c1',
      flags: {},
      gold: 0,
      unitsCollected: [],
    };

    const tape: ReplayTape = {
      seed,
      initial,
      inputs: [],
      engineVersion: CURRENT_SAVE_VERSION,
      dataVersion: CURRENT_SAVE_VERSION,
    };

    const result = playReplay(tape);
    expect(result.success).toBe(false);
    expect(result.error).toContain('No battle state');
  });

  it('should handle end-turn command', () => {
    const seed = 1337;
    
    const playerUnit1 = createUnit(UNIT_DEFINITIONS.adept, 1, 0);
    const playerUnit2 = createUnit(UNIT_DEFINITIONS.war_mage, 1, 0);
    const playerUnit3 = createUnit(UNIT_DEFINITIONS.mystic, 1, 0);
    const playerUnit4 = createUnit(UNIT_DEFINITIONS.ranger, 1, 0);
    const enemyUnit = enemyToUnit(ENEMIES.slime);
    
    const team = createTeam([playerUnit1, playerUnit2, playerUnit3, playerUnit4]);
    const battleState = createBattleState(team, [enemyUnit], [playerUnit1.id, enemyUnit.id]);
    
    const initial: GameStateSnapshot = {
      battle: battleState,
      team,
      chapter: 'c1',
      flags: {},
      gold: 0,
      unitsCollected: ['adept'],
    };

    const tape: ReplayTape = {
      seed,
      initial,
      inputs: [
        {
          type: 'end-turn',
          turn: 0,
          actorId: playerUnit1.id,
        } as PlayerCommand,
      ],
      engineVersion: CURRENT_SAVE_VERSION,
      dataVersion: CURRENT_SAVE_VERSION,
    };

    const result = playReplay(tape);
    expect(result.success).toBe(true);
    expect(result.finalState).toBeDefined();
  });
});

