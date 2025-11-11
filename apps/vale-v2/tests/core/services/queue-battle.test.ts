/**
 * Queue Battle Service Tests
 * PR-QUEUE-BATTLE: Tests for queue-based battle system
 */

import { describe, it, expect } from 'vitest';
import { makePRNG } from '../../../src/core/random/prng';
import { createUnit } from '../../../src/core/models/Unit';
import { createTeam } from '../../../src/core/models/Team';
import { createBattleState } from '../../../src/core/models/BattleState';
import {
  queueAction,
  clearQueuedAction,
  queueDjinn,
  executeRound,
  refreshMana,
} from '../../../src/core/services/QueueBattleService';
import { isQueueComplete, validateQueuedActions } from '../../../src/core/algorithms/mana';
import { STRIKE, FIREBALL } from '../../../src/data/definitions/abilities';

describe('QueueBattleService', () => {
  const createTestBattle = () => {
    const unit1 = createUnit({
      id: 'unit1',
      name: 'Unit 1',
      element: 'Venus',
      role: 'Warrior',
      baseStats: { hp: 100, pp: 20, atk: 10, def: 10, mag: 5, spd: 10 },
      growthRates: { hp: 10, pp: 2, atk: 2, def: 2, mag: 1, spd: 1 },
      abilities: [STRIKE, FIREBALL],
      manaContribution: 2,
      description: 'Test unit',
    }, 1, 0);

    const unit2 = createUnit({
      id: 'unit2',
      name: 'Unit 2',
      element: 'Mars',
      role: 'Mage',
      baseStats: { hp: 80, pp: 30, atk: 5, def: 5, mag: 15, spd: 12 },
      growthRates: { hp: 8, pp: 3, atk: 1, def: 1, mag: 3, spd: 2 },
      abilities: [STRIKE, FIREBALL],
      manaContribution: 3,
      description: 'Test unit',
    }, 1, 0);

    const unit3 = createUnit({
      id: 'unit3',
      name: 'Unit 3',
      element: 'Mercury',
      role: 'Healer',
      baseStats: { hp: 90, pp: 25, atk: 6, def: 8, mag: 12, spd: 11 },
      growthRates: { hp: 9, pp: 2, atk: 1, def: 2, mag: 2, spd: 1 },
      abilities: [STRIKE],
      manaContribution: 2,
      description: 'Test unit',
    }, 1, 0);

    const unit4 = createUnit({
      id: 'unit4',
      name: 'Unit 4',
      element: 'Jupiter',
      role: 'Ranger',
      baseStats: { hp: 85, pp: 22, atk: 12, def: 7, mag: 8, spd: 14 },
      growthRates: { hp: 8, pp: 2, atk: 3, def: 1, mag: 1, spd: 3 },
      abilities: [STRIKE],
      manaContribution: 1,
      description: 'Test unit',
    }, 1, 0);

    const enemy = createUnit({
      id: 'enemy1',
      name: 'Enemy',
      element: 'Neutral',
      role: 'Warrior',
      baseStats: { hp: 50, pp: 10, atk: 8, def: 5, mag: 2, spd: 8 },
      growthRates: { hp: 5, pp: 1, atk: 1, def: 1, mag: 1, spd: 1 },
      abilities: [STRIKE],
      manaContribution: 0,
      description: 'Test enemy',
    }, 1, 0);

    const team = createTeam([unit1, unit2, unit3, unit4]);
    const battle = createBattleState(team, [enemy]);

    return { battle, team, enemy };
  };

  describe('queueAction', () => {
    it('should queue an action and deduct mana', () => {
      const { battle } = createTestBattle();
      const initialMana = battle.remainingMana;

      const updated = queueAction(battle, 'unit1', STRIKE.id, ['enemy1'], STRIKE);

      expect(updated.queuedActions[0]).toBeDefined();
      expect(updated.queuedActions[0]?.unitId).toBe('unit1');
      expect(updated.remainingMana).toBe(initialMana - STRIKE.manaCost);
    });

    it('should throw if not enough mana', () => {
      const { battle } = createTestBattle();
      // Set remaining mana to 0
      const lowManaBattle = { ...battle, remainingMana: 0 };

      expect(() => {
        queueAction(lowManaBattle, 'unit1', STRIKE.id, ['enemy1'], STRIKE);
      }).toThrow();
    });
  });

  describe('clearQueuedAction', () => {
    it('should clear action and refund mana', () => {
      const { battle } = createTestBattle();
      const initialMana = battle.remainingMana;

      const queued = queueAction(battle, 'unit1', STRIKE.id, ['enemy1'], STRIKE);
      const cleared = clearQueuedAction(queued, 0);

      expect(cleared.queuedActions[0]).toBeNull();
      expect(cleared.remainingMana).toBe(initialMana);
    });
  });

  describe('refreshMana', () => {
    it('should reset mana to max', () => {
      const { battle } = createTestBattle();
      const spent = queueAction(battle, 'unit1', STRIKE.id, ['enemy1'], STRIKE);
      const refreshed = refreshMana(spent);

      expect(refreshed.remainingMana).toBe(refreshed.maxMana);
    });
  });

  describe('isQueueComplete', () => {
    it('should return false when queue is incomplete', () => {
      const { battle } = createTestBattle();
      const queued = queueAction(battle, 'unit1', STRIKE.id, ['enemy1'], STRIKE);

      expect(isQueueComplete(queued.queuedActions)).toBe(false);
    });

    it('should return true when all 4 actions are queued', () => {
      const { battle } = createTestBattle();
      let state = battle;

      // Queue all 4 actions
      state = queueAction(state, 'unit1', null, ['enemy1']); // Basic attack
      state = queueAction(state, 'unit2', null, ['enemy1']);
      state = queueAction(state, 'unit3', null, ['enemy1']);
      state = queueAction(state, 'unit4', null, ['enemy1']);

      expect(isQueueComplete(state.queuedActions)).toBe(true);
    });
  });
});

