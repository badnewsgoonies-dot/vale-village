/**
 * Queue Battle Service Tests
 * Tests the queue-based battle execution system
 */

import { describe, test, expect } from 'vitest';
import {
  queueAction,
  clearQueuedAction,
  executeRound,
} from '../../../src/core/services/QueueBattleService';
import { startBattle } from '../../../src/core/services/BattleService';
import { createTeam } from '../../../src/core/models/Team';
import { makePRNG } from '../../../src/core/random/prng';
import { ABILITIES } from '../../../src/data/definitions/abilities';
import { mkUnit, mkEnemy } from '../../../src/test/factories';

describe('QueueBattleService - Queue Execution', () => {
  test('initializeBattle creates valid queue battle state', () => {
    const playerTeam = createTeam([
      mkUnit({ id: 'isaac', name: 'Isaac', level: 1 }),
      mkUnit({ id: 'garet', name: 'Garet', level: 1 }),
      mkUnit({ id: 'ivan', name: 'Ivan', level: 1 }),
      mkUnit({ id: 'mia', name: 'Mia', level: 1 }),
    ]);

    const enemies = [
      mkEnemy('slime', { id: 'enemy1', name: 'Goblin', level: 1 }),
      mkEnemy('slime', { id: 'enemy2', name: 'Orc', level: 1 }),
    ];

    const rng = makePRNG(42);
    const battle = startBattle(playerTeam, enemies, rng);

    expect(battle.phase).toBe('planning');
    expect(battle.queuedActions).toHaveLength(4);
    expect(battle.queuedActions.every(a => a === null)).toBe(true);
    expect(battle.remainingMana).toBeGreaterThan(0);
    expect(battle.maxMana).toBeGreaterThan(0);
    expect(battle.roundNumber).toBe(1);
  });

  test('queueAction adds action and deducts mana', () => {
    const playerTeam = createTeam([
      mkUnit({ id: 'isaac', name: 'Isaac', level: 1 }),
      mkUnit({ id: 'garet', name: 'Garet', level: 1 }),
      mkUnit({ id: 'ivan', name: 'Ivan', level: 1 }),
      mkUnit({ id: 'mia', name: 'Mia', level: 1 }),
    ]);

    const enemies = [mkEnemy('slime', { id: 'enemy1', name: 'Goblin', level: 1 })];
    const rng = makePRNG(42);
    let battle = startBattle(playerTeam, enemies, rng);

    const initialMana = battle.remainingMana;

    // Queue a basic attack (0 mana cost)
    const queueResult = queueAction(battle, 'isaac', null, ['enemy1']);
    if (!queueResult.ok) throw new Error(queueResult.error);
    battle = queueResult.value;

    expect(battle.queuedActions[0]).not.toBeNull();
    expect(battle.queuedActions[0]?.unitId).toBe('isaac');
    expect(battle.queuedActions[0]?.targetIds).toEqual(['enemy1']);
    expect(battle.remainingMana).toBe(initialMana); // Basic attack costs 0
  });

  test('queueAction validates mana cost', () => {
    const chainLightning = ABILITIES['chain-lightning'];
    const attack = ABILITIES.attack;
    if (!chainLightning) {
      throw new Error('Chain Lightning ability not found');
    }

    if (!attack) {
      throw new Error('Attack ability not found');
    }

    const unit = mkUnit({ 
      id: 'isaac', 
      name: 'Isaac', 
      level: 5,
      abilities: [attack, chainLightning],
      unlockedAbilityIds: [attack.id, chainLightning.id],
    });

    // Fill team to 4 units
    const unit2 = mkUnit({ id: 'unit2' });
    const unit3 = mkUnit({ id: 'unit3' });
    const unit4 = mkUnit({ id: 'unit4' });
    const playerTeam = createTeam([unit, unit2, unit3, unit4]);
    const enemies = [mkEnemy('slime', { id: 'enemy1', name: 'Goblin', level: 1 })];
    const rng = makePRNG(42);
    let battle = startBattle(playerTeam, enemies, rng);

    // Set mana to 0 so the heavy attack cannot be queued
    battle = { ...battle, remainingMana: 0 };

    // Should return error Result - not enough mana
    const result = queueAction(battle, 'isaac', 'chain-lightning', ['enemy1'], chainLightning);
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error).toMatch(/cannot afford/i);
    }
  });

  test('clearQueuedAction refunds mana', () => {
    const earthquake = ABILITIES.quake;
    const attack = ABILITIES.attack;
    if (!earthquake) {
      throw new Error('Quake ability not found');
    }

    if (!attack) {
      throw new Error('Attack ability not found');
    }

    const unit = mkUnit({ 
      id: 'isaac', 
      name: 'Isaac', 
      level: 3,
      abilities: [attack, earthquake],
      unlockedAbilityIds: [attack.id, earthquake.id],
    });

    // Fill team to 4 units
    const unit2 = mkUnit({ id: 'unit2' });
    const unit3 = mkUnit({ id: 'unit3' });
    const unit4 = mkUnit({ id: 'unit4' });
    const playerTeam = createTeam([unit, unit2, unit3, unit4]);
    const enemies = [mkEnemy('slime', { id: 'enemy1', name: 'Goblin', level: 1 })];
    const rng = makePRNG(42);
    let battle = startBattle(playerTeam, enemies, rng);

    const initialMana = battle.remainingMana;

    // Queue an ability
    const queueResult = queueAction(battle, 'isaac', 'quake', ['enemy1'], earthquake);
    if (!queueResult.ok) throw new Error(queueResult.error);
    battle = queueResult.value;
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
      mkUnit({ id: 'isaac', name: 'Isaac', level: 5 }),
      mkUnit({ id: 'garet', name: 'Garet', level: 5 }),
      mkUnit({ id: 'ivan', name: 'Ivan', level: 5 }),
      mkUnit({ id: 'mia', name: 'Mia', level: 5 }),
    ]);

    const enemies = [
      mkEnemy('slime', { id: 'enemy1', name: 'Goblin', level: 1, currentHp: 50 }),
    ];

    const rng = makePRNG(42);
    let battle = startBattle(playerTeam, enemies, rng);

    // Queue all 4 units to attack the goblin
    let queueResult = queueAction(battle, 'isaac', null, ['enemy1']);
    if (!queueResult.ok) throw new Error(queueResult.error);
    battle = queueResult.value;
    queueResult = queueAction(battle, 'garet', null, ['enemy1']);
    if (!queueResult.ok) throw new Error(queueResult.error);
    battle = queueResult.value;
    queueResult = queueAction(battle, 'ivan', null, ['enemy1']);
    if (!queueResult.ok) throw new Error(queueResult.error);
    battle = queueResult.value;
    queueResult = queueAction(battle, 'mia', null, ['enemy1']);
    if (!queueResult.ok) throw new Error(queueResult.error);
    battle = queueResult.value;

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
      mkUnit({ id: 'isaac', name: 'Isaac', level: 10, baseStats: { atk: 50 } }),
      mkUnit({ id: 'garet', name: 'Garet', level: 10, baseStats: { atk: 50 } }),
      mkUnit({ id: 'ivan', name: 'Ivan', level: 10, baseStats: { atk: 50 } }),
      mkUnit({ id: 'mia', name: 'Mia', level: 10, baseStats: { atk: 50 } }),
    ]);

    const enemies = [
      mkEnemy('slime', { id: 'enemy1', name: 'Weak Goblin', level: 1, currentHp: 5 }),
    ];

    const rng = makePRNG(42);
    let battle = startBattle(playerTeam, enemies, rng);

    // Queue attacks
    let queueResult = queueAction(battle, 'isaac', null, ['enemy1']);
    if (!queueResult.ok) throw new Error(queueResult.error);
    battle = queueResult.value;
    queueResult = queueAction(battle, 'garet', null, ['enemy1']);
    if (!queueResult.ok) throw new Error(queueResult.error);
    battle = queueResult.value;
    queueResult = queueAction(battle, 'ivan', null, ['enemy1']);
    if (!queueResult.ok) throw new Error(queueResult.error);
    battle = queueResult.value;
    queueResult = queueAction(battle, 'mia', null, ['enemy1']);
    if (!queueResult.ok) throw new Error(queueResult.error);
    battle = queueResult.value;

    const result = executeRound(battle, rng);

    // Battle should end in victory
    expect(result.state.phase).toBe('victory');
    expect(result.state.enemies[0]?.currentHp).toBe(0);
  });

  test('executeRound retargets when original target dies mid-round', () => {
    const playerTeam = createTeam([
      mkUnit({ id: 'isaac', name: 'Isaac', level: 10, baseStats: { atk: 100 } }),
      mkUnit({ id: 'garet', name: 'Garet', level: 10, baseStats: { atk: 100 } }),
      mkUnit({ id: 'ivan', name: 'Ivan', level: 10, baseStats: { atk: 100 } }),
      mkUnit({ id: 'mia', name: 'Mia', level: 10, baseStats: { atk: 100 } }),
    ]);

    const enemies = [
      mkEnemy('slime', { id: 'enemy1', name: 'Weak Goblin', level: 1, currentHp: 10 }),
      mkEnemy('wolf', { id: 'enemy2', name: 'Orc', level: 5, currentHp: 100 }),
    ];

    const rng = makePRNG(42);
    let battle = startBattle(playerTeam, enemies, rng);

    // All units target enemy1 (will die after first hit)
    let queueResult = queueAction(battle, 'isaac', null, ['enemy1']);
    if (!queueResult.ok) throw new Error(queueResult.error);
    battle = queueResult.value;
    queueResult = queueAction(battle, 'garet', null, ['enemy1']);
    if (!queueResult.ok) throw new Error(queueResult.error);
    battle = queueResult.value;
    queueResult = queueAction(battle, 'ivan', null, ['enemy1']);
    if (!queueResult.ok) throw new Error(queueResult.error);
    battle = queueResult.value;
    queueResult = queueAction(battle, 'mia', null, ['enemy1']);
    if (!queueResult.ok) throw new Error(queueResult.error);
    battle = queueResult.value;

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
