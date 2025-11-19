/**
 * Golden Battle Tests
 * Tests that canonical battles produce identical event logs on replay
 */

import { describe, test, expect } from 'vitest';
import { playReplay } from '../../../src/core/save/ReplayService';
import type { ReplayTape } from '../../../src/core/save/types';
import { CURRENT_SAVE_VERSION } from '../../../src/core/save/migrations';
import { mkBattle, mkUnit, mkEnemy } from '../../../src/test/factories';
import { createBattleState } from '../../../src/core/models/BattleState';
import { createTeam } from '../../../src/core/models/Team';
import { createUnit } from '../../../src/core/models/Unit';
import { UNIT_DEFINITIONS } from '../../../src/data/definitions/units';
import { enemyToUnit } from '../../../src/core/utils/enemyToUnit';
import { ENEMIES } from '../../../src/data/definitions/enemies';
import { createStoryState } from '../../../src/core/models/story';

/**
 * Helper to create a minimal event log from battle events
 * Filters to essential events for comparison
 */
function createEventLog(events: readonly ReturnType<typeof playReplay>['events']): Array<{
  type: string;
  actorId?: string;
  targetId?: string;
  amount?: number;
  abilityId?: string;
}> {
  return events.map(e => {
    if (e.type === 'hit') {
      return { type: 'hit', targetId: e.targetId, amount: e.amount };
    }
    if (e.type === 'heal') {
      return { type: 'heal', targetId: e.targetId, amount: e.amount };
    }
    if (e.type === 'ability') {
      return { type: 'ability', actorId: e.casterId, abilityId: e.abilityId, targets: e.targets };
    }
    if (e.type === 'ko') {
      return { type: 'ko', targetId: e.unitId };
    }
    if (e.type === 'battle-end') {
      return { type: 'battle-end', result: e.result };
    }
    return { type: e.type };
  });
}

describe('Golden Battles', () => {
  test('Chapter 1 normal encounter (Slime) produces stable log', () => {
    const seed = 1001;
    
    // Create battle: 4 player units vs 2 slimes
    const player1 = createUnit(UNIT_DEFINITIONS.adept, 1, 0);
    const player2 = createUnit(UNIT_DEFINITIONS['war-mage'], 1, 0);
    const player3 = createUnit(UNIT_DEFINITIONS.mystic, 1, 0);
    const player4 = createUnit(UNIT_DEFINITIONS.ranger, 1, 0);
    const team = createTeam([player1, player2, player3, player4]);
    
    const enemy1 = enemyToUnit(ENEMIES['mercury-slime']);
    const enemy2 = enemyToUnit(ENEMIES['mercury-slime']);
    
    const battle = createBattleState(team, [enemy1, enemy2], [
      player1.id, enemy1.id, player2.id, enemy2.id,
    ]);
    
    const tape: ReplayTape = {
      seed,
      initial: {
        battle,
        team,
        story: createStoryState(1),
        gold: 0,
        unitsCollected: ['adept', 'war-mage', 'mystic', 'ranger'],
      },
      inputs: [
        {
          type: 'ability',
          turn: 0,
          actorId: player1.id,
          abilityId: 'strike',
          targetIds: [enemy1.id],
        },
      ],
      engineVersion: CURRENT_SAVE_VERSION,
      dataVersion: CURRENT_SAVE_VERSION,
    };

    // Run replay twice
    const result1 = playReplay(tape);
    const result2 = playReplay(tape);
    
    expect(result1.success).toBe(true);
    expect(result2.success).toBe(true);
    
    // Event logs should be identical
    const log1 = createEventLog(result1.events);
    const log2 = createEventLog(result2.events);
    
    expect(log1).toEqual(log2);
  });

  test('Mini-boss (Gladiator) produces stable log', () => {
    const seed = 2002;

    const player1 = createUnit(UNIT_DEFINITIONS.adept, 2, 0);
    const player2 = createUnit(UNIT_DEFINITIONS['war-mage'], 2, 0);
    const player3 = createUnit(UNIT_DEFINITIONS.mystic, 2, 0);
    const player4 = createUnit(UNIT_DEFINITIONS.ranger, 2, 0);
    const team = createTeam([player1, player2, player3, player4]);
    
    const gladiator = enemyToUnit(ENEMIES['granite-warlord']);
    
    const battle = createBattleState(team, [gladiator], [
      player1.id, gladiator.id, player2.id,
    ]);
    
    const tape: ReplayTape = {
      seed,
      initial: {
        battle,
        team,
        story: createStoryState(1),
        gold: 0,
        unitsCollected: ['adept', 'war-mage', 'mystic', 'ranger'],
      },
      inputs: [
        {
          type: 'ability',
          turn: 0,
          actorId: player1.id,
          abilityId: 'strike',
          targetIds: [gladiator.id],
        },
        {
          type: 'end-turn',
          turn: 0,
          actorId: player1.id,
        },
      ],
      engineVersion: CURRENT_SAVE_VERSION,
      dataVersion: CURRENT_SAVE_VERSION,
    };

    const result1 = playReplay(tape);
    const result2 = playReplay(tape);
    
    expect(result1.success).toBe(true);
    expect(result2.success).toBe(true);
    
    const log1 = createEventLog(result1.events);
    const log2 = createEventLog(result2.events);
    
    expect(log1).toEqual(log2);
  });

  test('Boss (Elemental Guardian) produces stable log', () => {
    const seed = 3003;

    const player1 = createUnit(UNIT_DEFINITIONS.adept, 3, 0);
    const player2 = createUnit(UNIT_DEFINITIONS['war-mage'], 3, 0);
    const player3 = createUnit(UNIT_DEFINITIONS.mystic, 3, 0);
    const player4 = createUnit(UNIT_DEFINITIONS.ranger, 3, 0);
    const team = createTeam([player1, player2, player3, player4]);

    const boss = enemyToUnit(ENEMIES['volcano-warlord']);

    const battle = createBattleState(team, [boss], [
      player1.id, boss.id, player2.id,
    ]);
    
    const tape: ReplayTape = {
      seed,
      initial: {
        battle,
        team,
        story: createStoryState(1),
        gold: 0,
        unitsCollected: ['adept', 'war-mage', 'mystic', 'ranger'],
      },
      inputs: [
        {
          type: 'ability',
          turn: 0,
          actorId: player1.id,
          abilityId: 'strike',
          targetIds: [boss.id],
        },
      ],
      engineVersion: CURRENT_SAVE_VERSION,
      dataVersion: CURRENT_SAVE_VERSION,
    };

    const result1 = playReplay(tape);
    const result2 = playReplay(tape);
    
    expect(result1.success).toBe(true);
    expect(result2.success).toBe(true);
    
    const log1 = createEventLog(result1.events);
    const log2 = createEventLog(result2.events);
    
    expect(log1).toEqual(log2);
  });
});

