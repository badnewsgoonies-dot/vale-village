/**
 * Queue Battle Service Tests
 * Tests the queue-based battle execution system
 */

import { describe, test, expect } from 'vitest';
import {
  initializeBattle,
  queueAction,
  clearQueuedAction,
  executeRound,
} from '../../../src/core/services/QueueBattleService';
import { createUnit } from '../../../src/core/models/Unit';
import { createTeam } from '../../../src/core/models/Team';
import { makePRNG } from '../../../src/core/random/prng';
import { ABILITIES } from '../../../src/data/definitions/abilities';

describe('QueueBattleService - Queue Execution', () => {
  test('initializeBattle creates valid queue battle state', () => {
    const playerTeam = createTeam([
      createUnit({ id: 'isaac', name: 'Isaac', level: 1 }),
      createUnit({ id: 'garet', name: 'Garet', level: 1 }),
      createUnit({ id: 'ivan', name: 'Ivan', level: 1 }),
      createUnit({ id: 'mia', name: 'Mia', level: 1 }),
    ]);

    const enemies = [
      createUnit({ id: 'enemy1', name: 'Goblin', level: 1 }),
      createUnit({ id: 'enemy2', name: 'Orc', level: 1 }),
    ];

    const rng = makePRNG(42);
    const battle = initializeBattle(playerTeam, enemies, rng);

    expect(battle.phase).toBe('planning');
    expect(battle.queuedActions).toHaveLength(4);
    expect(battle.queuedActions.every(a => a === null)).toBe(true);
    expect(battle.remainingMana).toBeGreaterThan(0);
    expect(battle.maxMana).toBeGreaterThan(0);
    expect(battle.roundNumber).toBe(1);
  });

  test('queueAction adds action and deducts mana', () => {
    const playerTeam = createTeam([
      createUnit({ id: 'isaac', name: 'Isaac', level: 1 }),
      createUnit({ id: 'garet', name: 'Garet', level: 1 }),
      createUnit({ id: 'ivan', name: 'Ivan', level: 1 }),
      createUnit({ id: 'mia', name: 'Mia', level: 1 }),
    ]);

    const enemies = [createUnit({ id: 'enemy1', name: 'Goblin', level: 1 })];
    const rng = makePRNG(42);
    let battle = initializeBattle(playerTeam, enemies, rng);

    const initialMana = battle.remainingMana;

    // Queue a basic attack (0 mana cost)
    battle = queueAction(battle, 'isaac', null, ['enemy1']);

    expect(battle.queuedActions[0]).not.toBeNull();
    expect(battle.queuedActions[0]?.unitId).toBe('isaac');
    expect(battle.queuedActions[0]?.targetIds).toEqual(['enemy1']);
    expect(battle.remainingMana).toBe(initialMana); // Basic attack costs 0
  });

  test('queueAction validates mana cost', () => {
    const unit = createUnit({ id: 'isaac', name: 'Isaac', level: 5 });
    const ragnarok = ABILITIES.find(a => a.id === 'ragnarok');

    if (!ragnarok) {
      throw new Error('Ragnarok ability not found');
    }

    unit.abilities.push(ragnarok);

    const playerTeam = createTeam([unit]);
    const enemies = [createUnit({ id: 'enemy1', name: 'Goblin', level: 1 })];
    const rng = makePRNG(42);
    let battle = initializeBattle(playerTeam, enemies, rng);

    // Set mana to less than Ragnarok costs
    battle = { ...battle, remainingMana: 5 };

    // Should throw error - not enough mana
    expect(() => {
      queueAction(battle, 'isaac', 'ragnarok', ['enemy1'], ragnarok);
    }).toThrow(/cannot afford/i);
  });

  test('clearQueuedAction refunds mana', () => {
    const unit = createUnit({ id: 'isaac', name: 'Isaac', level: 3 });
    const earthquake = ABILITIES.find(a => a.id === 'earthquake');

    if (!earthquake) {
      throw new Error('Earthquake ability not found');
    }

    unit.abilities.push(earthquake);

    const playerTeam = createTeam([unit]);
    const enemies = [createUnit({ id: 'enemy1', name: 'Goblin', level: 1 })];
    const rng = makePRNG(42);
    let battle = initializeBattle(playerTeam, enemies, rng);

    const initialMana = battle.remainingMana;

    // Queue an ability
    battle = queueAction(battle, 'isaac', 'earthquake', ['enemy1'], earthquake);
    const manaAfterQueue = battle.remainingMana;

    expect(manaAfterQueue).toBeLessThan(initialMana);

    // Clear it
    battle = clearQueuedAction(battle, 0);

    // Mana should be refunded
    expect(battle.remainingMana).toBe(initialMana);
    expect(battle.queuedActions[0]).toBeNull();
  });

  test('executeRound processes all queued actions', () => {
    const playerTeam = createTeam([
      createUnit({ id: 'isaac', name: 'Isaac', level: 5 }),
      createUnit({ id: 'garet', name: 'Garet', level: 5 }),
      createUnit({ id: 'ivan', name: 'Ivan', level: 5 }),
      createUnit({ id: 'mia', name: 'Mia', level: 5 }),
    ]);

    const enemies = [
      createUnit({ id: 'enemy1', name: 'Goblin', level: 1, currentHp: 50 }),
    ];

    const rng = makePRNG(42);
    let battle = initializeBattle(playerTeam, enemies, rng);

    // Queue all 4 units to attack the goblin
    battle = queueAction(battle, 'isaac', null, ['enemy1']);
    battle = queueAction(battle, 'garet', null, ['enemy1']);
    battle = queueAction(battle, 'ivan', null, ['enemy1']);
    battle = queueAction(battle, 'mia', null, ['enemy1']);

    expect(battle.queuedActions.every(a => a !== null)).toBe(true);

    // Execute the round
    const result = executeRound(battle, rng);

    // Battle should progress
    expect(result.state.roundNumber).toBe(2);
    expect(result.state.phase).toBe('planning');

    // Queue should be cleared
    expect(result.state.queuedActions.every(a => a === null)).toBe(true);

    // Mana should be refreshed
    expect(result.state.remainingMana).toBe(result.state.maxMana);

    // Enemy should have taken damage
    const enemy = result.state.enemies[0];
    expect(enemy?.currentHp).toBeLessThan(50);
  });

  test('executeRound detects victory when all enemies KO', () => {
    const playerTeam = createTeam([
      createUnit({ id: 'isaac', name: 'Isaac', level: 10, baseStats: { atk: 50 } }),
      createUnit({ id: 'garet', name: 'Garet', level: 10, baseStats: { atk: 50 } }),
      createUnit({ id: 'ivan', name: 'Ivan', level: 10, baseStats: { atk: 50 } }),
      createUnit({ id: 'mia', name: 'Mia', level: 10, baseStats: { atk: 50 } }),
    ]);

    const enemies = [
      createUnit({ id: 'enemy1', name: 'Weak Goblin', level: 1, currentHp: 5 }),
    ];

    const rng = makePRNG(42);
    let battle = initializeBattle(playerTeam, enemies, rng);

    // Queue attacks
    battle = queueAction(battle, 'isaac', null, ['enemy1']);
    battle = queueAction(battle, 'garet', null, ['enemy1']);
    battle = queueAction(battle, 'ivan', null, ['enemy1']);
    battle = queueAction(battle, 'mia', null, ['enemy1']);

    const result = executeRound(battle, rng);

    // Battle should end in victory
    expect(result.state.phase).toBe('victory');
    expect(result.state.enemies[0]?.currentHp).toBe(0);
  });

  test('executeRound retargets when original target dies mid-round', () => {
    const playerTeam = createTeam([
      createUnit({ id: 'isaac', name: 'Isaac', level: 10, baseStats: { atk: 100 } }),
      createUnit({ id: 'garet', name: 'Garet', level: 10, baseStats: { atk: 100 } }),
      createUnit({ id: 'ivan', name: 'Ivan', level: 10, baseStats: { atk: 100 } }),
      createUnit({ id: 'mia', name: 'Mia', level: 10, baseStats: { atk: 100 } }),
    ]);

    const enemies = [
      createUnit({ id: 'enemy1', name: 'Weak Goblin', level: 1, currentHp: 10 }),
      createUnit({ id: 'enemy2', name: 'Orc', level: 5, currentHp: 100 }),
    ];

    const rng = makePRNG(42);
    let battle = initializeBattle(playerTeam, enemies, rng);

    // All units target enemy1 (will die after first hit)
    battle = queueAction(battle, 'isaac', null, ['enemy1']);
    battle = queueAction(battle, 'garet', null, ['enemy1']);
    battle = queueAction(battle, 'ivan', null, ['enemy1']);
    battle = queueAction(battle, 'mia', null, ['enemy1']);

    const result = executeRound(battle, rng);

    // Enemy1 should be dead
    const enemy1 = result.state.enemies.find(e => e.id === 'enemy1');
    expect(enemy1?.currentHp).toBe(0);

    // Enemy2 should have taken damage from retargeted attacks
    const enemy2 = result.state.enemies.find(e => e.id === 'enemy2');
    expect(enemy2?.currentHp).toBeLessThan(100);

    // Battle should still be ongoing
    expect(result.state.phase).toBe('planning');
  });
});
