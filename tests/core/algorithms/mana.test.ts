/**
 * Tests for mana circle system algorithms
 * Team-wide mana pool management
 */

import { describe, test, expect } from 'vitest';
import {
  canAffordAction,
  getAbilityManaCost,
  calculateTotalQueuedManaCost,
  validateQueuedActions,
  isQueueComplete,
} from '../../../src/core/algorithms/mana';
import type { QueuedAction } from '../../../src/core/models/BattleState';
import type { Ability } from '../../../src/data/schemas/AbilitySchema';

describe('Mana Algorithms', () => {
  describe('canAffordAction', () => {
    test('should return true when mana >= cost', () => {
      expect(canAffordAction(10, 5)).toBe(true);
      expect(canAffordAction(10, 10)).toBe(true);
      expect(canAffordAction(100, 0)).toBe(true);
    });

    test('should return false when mana < cost', () => {
      expect(canAffordAction(5, 10)).toBe(false);
      expect(canAffordAction(0, 1)).toBe(false);
    });

    test('should handle edge case of 0 mana and 0 cost', () => {
      expect(canAffordAction(0, 0)).toBe(true);
    });
  });

  describe('getAbilityManaCost', () => {
    test('should return 0 for basic attack (null abilityId)', () => {
      const cost = getAbilityManaCost(null);

      expect(cost).toBe(0);
    });

    test('should return ability mana cost from data', () => {
      const ability: Ability = {
        id: 'test-ability',
        name: 'Test Ability',
        type: 'physical',
        basePower: 10,
        targets: 'single-enemy',
        manaCost: 5,
        element: 'Neutral',
      };

      const cost = getAbilityManaCost('test-ability', ability);

      expect(cost).toBe(5);
    });

    test('should return 0 when ability has no manaCost field', () => {
      const ability: Ability = {
        id: 'test-ability',
        name: 'Test Ability',
        type: 'physical',
        basePower: 10,
        targets: 'single-enemy',
        manaCost: 0,
        element: 'Neutral',
      };

      const cost = getAbilityManaCost('test-ability', ability);

      expect(cost).toBe(0);
    });

    test('should throw when abilityId provided but ability is undefined', () => {
      expect(() => {
        getAbilityManaCost('invalid-ability', undefined);
      }).toThrow();
    });

    test('should handle high mana cost abilities', () => {
      const ability: Ability = {
        id: 'test-ability',
        name: 'Test Ability',
        type: 'physical',
        basePower: 10,
        targets: 'single-enemy',
        manaCost: 10,
        element: 'Neutral',
      };

      const cost = getAbilityManaCost('test-ability', ability);

      expect(cost).toBe(10);
    });
  });

  describe('calculateTotalQueuedManaCost', () => {
    test('should sum mana costs of all queued actions', () => {
      const queuedActions: (QueuedAction | null)[] = [
        { unitId: 'unit1', abilityId: null, targetIds: ['enemy1'], manaCost: 0 },
        { unitId: 'unit2', abilityId: 'ability1', targetIds: ['enemy1'], manaCost: 5 },
        { unitId: 'unit3', abilityId: 'ability2', targetIds: ['enemy2'], manaCost: 3 },
      ];

      const totalCost = calculateTotalQueuedManaCost(queuedActions);

      expect(totalCost).toBe(8); // 0 + 5 + 3
    });

    test('should ignore null actions (not yet queued)', () => {
      const queuedActions: (QueuedAction | null)[] = [
        { unitId: 'unit1', abilityId: null, targetIds: ['enemy1'], manaCost: 0 },
        null, // Not queued yet
        { unitId: 'unit3', abilityId: 'ability2', targetIds: ['enemy2'], manaCost: 3 },
      ];

      const totalCost = calculateTotalQueuedManaCost(queuedActions);

      expect(totalCost).toBe(3); // Only unit1 (0) + unit3 (3)
    });

    test('should return 0 for empty queue', () => {
      const queuedActions: (QueuedAction | null)[] = [];

      const totalCost = calculateTotalQueuedManaCost(queuedActions);

      expect(totalCost).toBe(0);
    });

    test('should return 0 when all actions are null', () => {
      const queuedActions: (QueuedAction | null)[] = [null, null, null, null];

      const totalCost = calculateTotalQueuedManaCost(queuedActions);

      expect(totalCost).toBe(0);
    });

    test('should handle all basic attacks (0 cost)', () => {
      const queuedActions: (QueuedAction | null)[] = [
        { unitId: 'unit1', abilityId: null, targetIds: ['enemy1'], manaCost: 0 },
        { unitId: 'unit2', abilityId: null, targetIds: ['enemy1'], manaCost: 0 },
        { unitId: 'unit3', abilityId: null, targetIds: ['enemy2'], manaCost: 0 },
      ];

      const totalCost = calculateTotalQueuedManaCost(queuedActions);

      expect(totalCost).toBe(0);
    });
  });

  describe('validateQueuedActions', () => {
    test('should return true when total cost <= remaining mana', () => {
      const queuedActions: (QueuedAction | null)[] = [
        { unitId: 'unit1', abilityId: null, targetIds: ['enemy1'], manaCost: 0 },
        { unitId: 'unit2', abilityId: 'ability1', targetIds: ['enemy1'], manaCost: 5 },
      ];

      const valid = validateQueuedActions(10, queuedActions);

      expect(valid).toBe(true);
    });

    test('should return false when total cost > remaining mana', () => {
      const queuedActions: (QueuedAction | null)[] = [
        { unitId: 'unit1', abilityId: 'ability1', targetIds: ['enemy1'], manaCost: 5 },
        { unitId: 'unit2', abilityId: 'ability2', targetIds: ['enemy1'], manaCost: 5 },
      ];

      const valid = validateQueuedActions(8, queuedActions);

      expect(valid).toBe(false); // 10 > 8
    });

    test('should handle edge case of exact mana match', () => {
      const queuedActions: (QueuedAction | null)[] = [
        { unitId: 'unit1', abilityId: 'ability1', targetIds: ['enemy1'], manaCost: 5 },
        { unitId: 'unit2', abilityId: 'ability2', targetIds: ['enemy1'], manaCost: 5 },
      ];

      const valid = validateQueuedActions(10, queuedActions);

      expect(valid).toBe(true); // Exact match
    });

    test('should ignore null actions in validation', () => {
      const queuedActions: (QueuedAction | null)[] = [
        { unitId: 'unit1', abilityId: 'ability1', targetIds: ['enemy1'], manaCost: 5 },
        null,
        null,
      ];

      const valid = validateQueuedActions(10, queuedActions);

      expect(valid).toBe(true); // Only 5 mana needed
    });
  });

  describe('isQueueComplete', () => {
    test('should return true when all actions are queued (4 units)', () => {
      const queuedActions: (QueuedAction | null)[] = [
        { unitId: 'unit1', abilityId: null, targetIds: ['enemy1'], manaCost: 0 },
        { unitId: 'unit2', abilityId: null, targetIds: ['enemy1'], manaCost: 0 },
        { unitId: 'unit3', abilityId: null, targetIds: ['enemy2'], manaCost: 0 },
        { unitId: 'unit4', abilityId: null, targetIds: ['enemy2'], manaCost: 0 },
      ];

      const complete = isQueueComplete(queuedActions, 4);

      expect(complete).toBe(true);
    });

    test('should return false when some actions are null', () => {
      const queuedActions: (QueuedAction | null)[] = [
        { unitId: 'unit1', abilityId: null, targetIds: ['enemy1'], manaCost: 0 },
        null,
        { unitId: 'unit3', abilityId: null, targetIds: ['enemy2'], manaCost: 0 },
        null,
      ];

      const complete = isQueueComplete(queuedActions, 4);

      expect(complete).toBe(false);
    });

    test('should return true for smaller teams (1-3 units)', () => {
      const queuedActions1: (QueuedAction | null)[] = [
        { unitId: 'unit1', abilityId: null, targetIds: ['enemy1'], manaCost: 0 },
      ];
      expect(isQueueComplete(queuedActions1, 1)).toBe(true);

      const queuedActions2: (QueuedAction | null)[] = [
        { unitId: 'unit1', abilityId: null, targetIds: ['enemy1'], manaCost: 0 },
        { unitId: 'unit2', abilityId: null, targetIds: ['enemy1'], manaCost: 0 },
      ];
      expect(isQueueComplete(queuedActions2, 2)).toBe(true);

      const queuedActions3: (QueuedAction | null)[] = [
        { unitId: 'unit1', abilityId: null, targetIds: ['enemy1'], manaCost: 0 },
        { unitId: 'unit2', abilityId: null, targetIds: ['enemy1'], manaCost: 0 },
        { unitId: 'unit3', abilityId: null, targetIds: ['enemy2'], manaCost: 0 },
      ];
      expect(isQueueComplete(queuedActions3, 3)).toBe(true);
    });

    test('should use array length as teamSize when not provided', () => {
      const queuedActions: (QueuedAction | null)[] = [
        { unitId: 'unit1', abilityId: null, targetIds: ['enemy1'], manaCost: 0 },
        { unitId: 'unit2', abilityId: null, targetIds: ['enemy1'], manaCost: 0 },
      ];

      const complete = isQueueComplete(queuedActions);

      expect(complete).toBe(true);
    });

    test('should throw for invalid team size (<1)', () => {
      const queuedActions: (QueuedAction | null)[] = [];

      expect(() => {
        isQueueComplete(queuedActions, 0);
      }).toThrow();
    });

    test('should throw for invalid team size (>4)', () => {
      const queuedActions: (QueuedAction | null)[] = [];

      expect(() => {
        isQueueComplete(queuedActions, 5);
      }).toThrow();
    });

    test('should return false when queue length does not match team size', () => {
      const queuedActions: (QueuedAction | null)[] = [
        { unitId: 'unit1', abilityId: null, targetIds: ['enemy1'], manaCost: 0 },
        { unitId: 'unit2', abilityId: null, targetIds: ['enemy1'], manaCost: 0 },
      ];

      const complete = isQueueComplete(queuedActions, 4);

      expect(complete).toBe(false); // Expected 4, got 2
    });
  });
});
