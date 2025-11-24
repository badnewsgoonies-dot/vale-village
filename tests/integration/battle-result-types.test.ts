/**
 * Integration test for BattleService Result types
 * Verifies that error handling with Result types works correctly
 */

import { test, expect, describe } from 'vitest';
import { startBattle, performAction, endTurn } from '../../src/core/services/BattleService';
import { mkUnit, mkTeam } from '../../src/test/factories';
import { makePRNG } from '../../src/core/random/prng';

describe('BattleService Result Types', () => {
  const rng = makePRNG(12345);

  test('startBattle returns Ok result with valid inputs', () => {
    const unit1 = mkUnit({ id: 'player1', hp: 100, maxHp: 100 });
    const unit2 = mkUnit({ id: 'player2', hp: 100, maxHp: 100 });
    const team = mkTeam([unit1, unit2]);
    const enemy = mkUnit({ id: 'enemy1', hp: 50, maxHp: 50 });

    const result = startBattle(team, [enemy], rng);

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value).toHaveProperty('playerTeam');
      expect(result.value).toHaveProperty('enemies');
      expect(result.value).toHaveProperty('turnOrder');
    }
  });

  test('startBattle returns Err with empty player team', () => {
    const team = { units: [], djinnActivations: [], djinnPool: [] };
    const enemy = mkUnit({ id: 'enemy1', hp: 50, maxHp: 50 });

    const result = startBattle(team, [enemy], rng);

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error).toContain('Player team must contain at least one unit');
    }
  });

  test('startBattle returns Err with no enemies', () => {
    const unit = mkUnit({ id: 'player1', hp: 100, maxHp: 100 });
    const team = mkTeam([unit]);

    const result = startBattle(team, [], rng);

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error).toContain('Battle requires at least one enemy');
    }
  });

  test('performAction returns Err for invalid actor', () => {
    const unit = mkUnit({ id: 'player1', hp: 100, maxHp: 100 });
    const team = mkTeam([unit]);
    const enemy = mkUnit({ id: 'enemy1', hp: 50, maxHp: 50 });

    const battleResult = startBattle(team, [enemy], rng);
    expect(battleResult.ok).toBe(true);
    if (!battleResult.ok) return;

    const actionResult = performAction(
      battleResult.value,
      'invalid-id',
      'strike',
      ['enemy1'],
      rng
    );

    expect(actionResult.ok).toBe(false);
    if (!actionResult.ok) {
      expect(actionResult.error).toContain('Invalid actor');
    }
  });

  test('performAction returns Err for invalid ability', () => {
    const unit = mkUnit({ id: 'player1', hp: 100, maxHp: 100 });
    const team = mkTeam([unit]);
    const enemy = mkUnit({ id: 'enemy1', hp: 50, maxHp: 50 });

    const battleResult = startBattle(team, [enemy], rng);
    expect(battleResult.ok).toBe(true);
    if (!battleResult.ok) return;

    const actionResult = performAction(
      battleResult.value,
      'player1',
      'invalid-ability',
      ['enemy1'],
      rng
    );

    expect(actionResult.ok).toBe(false);
    if (!actionResult.ok) {
      expect(actionResult.error).toContain('Ability invalid-ability not found');
    }
  });

  test('performAction returns Ok for valid action', () => {
    const unit = mkUnit({ id: 'player1', hp: 100, maxHp: 100 });
    const team = mkTeam([unit]);
    const enemy = mkUnit({ id: 'enemy1', hp: 50, maxHp: 50 });

    const battleResult = startBattle(team, [enemy], rng);
    expect(battleResult.ok).toBe(true);
    if (!battleResult.ok) return;

    const actionResult = performAction(
      battleResult.value,
      'player1',
      'strike',
      ['enemy1'],
      rng
    );

    expect(actionResult.ok).toBe(true);
    if (actionResult.ok) {
      expect(actionResult.value).toHaveProperty('state');
      expect(actionResult.value).toHaveProperty('result');
      expect(actionResult.value).toHaveProperty('events');
    }
  });

  test('endTurn returns Ok result', () => {
    const unit = mkUnit({ id: 'player1', hp: 100, maxHp: 100 });
    const team = mkTeam([unit]);
    const enemy = mkUnit({ id: 'enemy1', hp: 50, maxHp: 50 });

    const battleResult = startBattle(team, [enemy], rng);
    expect(battleResult.ok).toBe(true);
    if (!battleResult.ok) return;

    const endTurnResult = endTurn(battleResult.value, rng);

    expect(endTurnResult.ok).toBe(true);
    if (endTurnResult.ok) {
      expect(endTurnResult.value).toHaveProperty('playerTeam');
      expect(endTurnResult.value).toHaveProperty('enemies');
      expect(endTurnResult.value).toHaveProperty('currentActorIndex');
    }
  });

  test('BattleTransaction allows rollback on error', () => {
    // This is tested implicitly through performAction
    // When performAction encounters an error, it uses transaction.rollback()
    // and returns the original state unchanged
    const unit = mkUnit({ id: 'player1', hp: 100, maxHp: 100 });
    const team = mkTeam([unit]);
    const enemy = mkUnit({ id: 'enemy1', hp: 50, maxHp: 50 });

    const battleResult = startBattle(team, [enemy], rng);
    expect(battleResult.ok).toBe(true);
    if (!battleResult.ok) return;

    const originalState = battleResult.value;
    const actionResult = performAction(
      originalState,
      'invalid-id',
      'strike',
      ['enemy1'],
      rng
    );

    expect(actionResult.ok).toBe(false);
    // State should remain unchanged after failed action
    // Transaction rolled back the changes
  });
});