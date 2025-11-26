/**
 * Tests for targeting algorithms
 * Resolve target sets for abilities
 */

import { describe, test, expect } from 'vitest';
import {
  resolveTargets,
  filterValidTargets,
  getValidTargets,
} from '../../../src/core/algorithms/targeting';
import { mkUnit, mkEnemy, mkTeam } from '../../../src/test/factories';
import type { Ability } from '../../../src/data/schemas/AbilitySchema';

describe('Targeting Algorithms', () => {
  describe('resolveTargets', () => {
    test('should target single enemy from player unit', () => {
      const playerUnits = [
        mkUnit({ id: 'player1' }),
        mkUnit({ id: 'player2' }),
      ];
      const enemyUnits = [
        mkEnemy('mercury-slime', { id: 'enemy1' }),
        mkEnemy('mercury-slime', { id: 'enemy2' }),
      ];

      const ability: Ability = {
        id: 'test-ability',
        name: 'Test Ability',
        type: 'physical',
        basePower: 10,
        targets: 'single-enemy',
        manaCost: 0,
        element: 'Neutral',
      };

      const targets = resolveTargets(ability, playerUnits[0]!, playerUnits, enemyUnits);

      expect(targets.length).toBe(2); // All alive enemies
      expect(targets.every(t => enemyUnits.some(e => e.id === t.id))).toBe(true);
    });

    test('should target all enemies from player unit', () => {
      const playerUnits = [mkUnit({ id: 'player1' })];
      const enemyUnits = [
        mkEnemy('mercury-slime', { id: 'enemy1' }),
        mkEnemy('mercury-slime', { id: 'enemy2' }),
        mkEnemy('mercury-slime', { id: 'enemy3' }),
      ];

      const ability: Ability = {
        id: 'test-ability',
        name: 'Test Ability',
        type: 'physical',
        basePower: 10,
        targets: 'all-enemies',
        manaCost: 0,
        element: 'Neutral',
      };

      const targets = resolveTargets(ability, playerUnits[0]!, playerUnits, enemyUnits);

      expect(targets.length).toBe(3);
      expect(targets.every(t => enemyUnits.some(e => e.id === t.id))).toBe(true);
    });

    test('should target single ally (exclude self)', () => {
      const playerUnits = [
        mkUnit({ id: 'player1' }),
        mkUnit({ id: 'player2' }),
        mkUnit({ id: 'player3' }),
      ];
      const enemyUnits = [mkEnemy('mercury-slime', { id: 'enemy1' })];

      const ability: Ability = {
        id: 'test-ability',
        name: 'Test Ability',
        type: 'healing',
        basePower: 10,
        targets: 'single-ally',
        manaCost: 0,
        element: 'Neutral',
      };

      const targets = resolveTargets(ability, playerUnits[0]!, playerUnits, enemyUnits);

      expect(targets.length).toBe(2); // All allies except self
      expect(targets.every(t => t.id !== 'player1')).toBe(true);
      expect(targets.every(t => playerUnits.some(p => p.id === t.id))).toBe(true);
    });

    test('should target all allies (include self)', () => {
      const playerUnits = [
        mkUnit({ id: 'player1' }),
        mkUnit({ id: 'player2' }),
        mkUnit({ id: 'player3' }),
      ];
      const enemyUnits = [mkEnemy('mercury-slime', { id: 'enemy1' })];

      const ability: Ability = {
        id: 'test-ability',
        name: 'Test Ability',
        type: 'healing',
        basePower: 10,
        targets: 'all-allies',
        manaCost: 0,
        element: 'Neutral',
      };

      const targets = resolveTargets(ability, playerUnits[0]!, playerUnits, enemyUnits);

      expect(targets.length).toBe(3); // All allies including self
      expect(targets.every(t => playerUnits.some(p => p.id === t.id))).toBe(true);
    });

    test('should target self only', () => {
      const playerUnits = [
        mkUnit({ id: 'player1' }),
        mkUnit({ id: 'player2' }),
      ];
      const enemyUnits = [mkEnemy('mercury-slime', { id: 'enemy1' })];

      const ability: Ability = {
        id: 'test-ability',
        name: 'Test Ability',
        type: 'healing',
        basePower: 10,
        targets: 'self',
        manaCost: 0,
        element: 'Neutral',
      };

      const targets = resolveTargets(ability, playerUnits[0]!, playerUnits, enemyUnits);

      expect(targets.length).toBe(1);
      expect(targets[0]!.id).toBe('player1');
    });

    test('should handle enemy caster targeting players', () => {
      const playerUnits = [
        mkUnit({ id: 'player1' }),
        mkUnit({ id: 'player2' }),
      ];
      const enemyUnits = [
        mkEnemy('mercury-slime', { id: 'enemy1' }),
        mkEnemy('mercury-slime', { id: 'enemy2' }),
      ];

      const ability: Ability = {
        id: 'test-ability',
        name: 'Test Ability',
        type: 'physical',
        basePower: 10,
        targets: 'single-enemy',
        manaCost: 0,
        element: 'Neutral',
      };

      // Enemy casts at player
      const targets = resolveTargets(ability, enemyUnits[0]!, playerUnits, enemyUnits);

      expect(targets.length).toBe(2); // All alive players
      expect(targets.every(t => playerUnits.some(p => p.id === t.id))).toBe(true);
    });

    test('should filter out KO\'d units from targets', () => {
      const playerUnits = [mkUnit({ id: 'player1' })];
      const enemyUnits = [
        mkEnemy('mercury-slime', { id: 'enemy1', currentHp: 100 }),
        mkEnemy('mercury-slime', { id: 'enemy2', currentHp: 0 }), // KO'd
        mkEnemy('mercury-slime', { id: 'enemy3', currentHp: 50 }),
      ];

      const ability: Ability = {
        id: 'test-ability',
        name: 'Test Ability',
        type: 'physical',
        basePower: 10,
        targets: 'all-enemies',
        manaCost: 0,
        element: 'Neutral',
      };

      const targets = resolveTargets(ability, playerUnits[0]!, playerUnits, enemyUnits);

      expect(targets.length).toBe(2); // Only alive enemies
      expect(targets.every(t => t.currentHp > 0)).toBe(true);
    });

    test('should return empty array for unknown target type', () => {
      const playerUnits = [mkUnit({ id: 'player1' })];
      const enemyUnits = [mkEnemy('mercury-slime', { id: 'enemy1' })];

      const ability: Ability = {
        id: 'test-ability',
        name: 'Test Ability',
        type: 'physical',
        basePower: 10,
        // @ts-expect-error - Testing invalid target type
        targets: 'invalid-target-type',
        manaCost: 0,
        element: 'Neutral',
      };

      const targets = resolveTargets(ability, playerUnits[0]!, playerUnits, enemyUnits);

      expect(targets).toEqual([]);
    });
  });

  describe('filterValidTargets', () => {
    test('should filter KO\'d units for non-revival healing', () => {
      const targets = [
        mkUnit({ id: 'unit1', currentHp: 100 }),
        mkUnit({ id: 'unit2', currentHp: 0 }), // KO'd
        mkUnit({ id: 'unit3', currentHp: 50 }),
      ];

      const ability: Ability = {
        id: 'test-ability',
        name: 'Test Ability',
        type: 'healing',
        basePower: 10,
        targets: 'all-allies',
        manaCost: 0,
        element: 'Neutral',
        revivesFallen: false,
      };

      const validTargets = filterValidTargets(targets, ability);

      expect(validTargets.length).toBe(2);
      expect(validTargets.every(t => t.currentHp > 0)).toBe(true);
    });

    test('should allow KO\'d units for revival abilities', () => {
      const targets = [
        mkUnit({ id: 'unit1', currentHp: 100 }),
        mkUnit({ id: 'unit2', currentHp: 0 }), // KO'd
        mkUnit({ id: 'unit3', currentHp: 50 }),
      ];

      const ability: Ability = {
        id: 'test-ability',
        name: 'Test Ability',
        type: 'healing',
        basePower: 10,
        targets: 'all-allies',
        manaCost: 0,
        element: 'Neutral',
        revivesFallen: true,
      };

      const validTargets = filterValidTargets(targets, ability);

      expect(validTargets.length).toBe(3); // All targets including KO'd
    });

    test('should allow KO\'d units for non-healing abilities', () => {
      const targets = [
        mkUnit({ id: 'unit1', currentHp: 100 }),
        mkUnit({ id: 'unit2', currentHp: 0 }), // KO'd
      ];

      const ability: Ability = {
        id: 'test-ability',
        name: 'Test Ability',
        type: 'physical',
        basePower: 10,
        targets: 'all-enemies',
        manaCost: 0,
        element: 'Neutral',
      };

      const validTargets = filterValidTargets(targets, ability);

      expect(validTargets.length).toBe(2); // All targets
    });
  });

  describe('getValidTargets', () => {
    test('should return enemies for basic attack (null ability)', () => {
      const playerUnits = [mkUnit({ id: 'player1' })];
      const playerTeam = mkTeam(playerUnits);
      const enemies = [
        mkEnemy('mercury-slime', { id: 'enemy1' }),
        mkEnemy('mercury-slime', { id: 'enemy2' }),
      ];

      const targets = getValidTargets(null, playerUnits[0]!, playerTeam, enemies);

      expect(targets.length).toBe(2);
      expect(targets.every(t => enemies.some(e => e.id === t.id))).toBe(true);
    });

    test('should filter KO\'d enemies for basic attack', () => {
      const playerUnits = [mkUnit({ id: 'player1' })];
      const playerTeam = mkTeam(playerUnits);
      const enemies = [
        mkEnemy('mercury-slime', { id: 'enemy1', currentHp: 100 }),
        mkEnemy('mercury-slime', { id: 'enemy2', currentHp: 0 }), // KO'd
      ];

      const targets = getValidTargets(null, playerUnits[0]!, playerTeam, enemies);

      expect(targets.length).toBe(1);
      expect(targets[0]!.id).toBe('enemy1');
    });

    test('should return enemies for single-enemy ability', () => {
      const playerUnits = [mkUnit({ id: 'player1' })];
      const playerTeam = mkTeam(playerUnits);
      const enemies = [
        mkEnemy('mercury-slime', { id: 'enemy1' }),
        mkEnemy('mercury-slime', { id: 'enemy2' }),
      ];

      const ability: Ability = {
        id: 'test-ability',
        name: 'Test Ability',
        type: 'physical',
        basePower: 10,
        targets: 'single-enemy',
        manaCost: 0,
        element: 'Neutral',
      };

      const targets = getValidTargets(ability, playerUnits[0]!, playerTeam, enemies);

      expect(targets.length).toBe(2);
      expect(targets.every(t => enemies.some(e => e.id === t.id))).toBe(true);
    });

    test('should return allies for single-ally ability (exclude caster)', () => {
      const playerUnits = [
        mkUnit({ id: 'player1' }),
        mkUnit({ id: 'player2' }),
        mkUnit({ id: 'player3' }),
      ];
      const playerTeam = mkTeam(playerUnits);
      const enemies = [mkEnemy('mercury-slime', { id: 'enemy1' })];

      const ability: Ability = {
        id: 'test-ability',
        name: 'Test Ability',
        type: 'healing',
        basePower: 10,
        targets: 'single-ally',
        manaCost: 0,
        element: 'Neutral',
      };

      const targets = getValidTargets(ability, playerUnits[0]!, playerTeam, enemies);

      expect(targets.length).toBe(2);
      expect(targets.every(t => t.id !== 'player1')).toBe(true);
    });

    test('should return caster for self-targeting ability', () => {
      const playerUnits = [
        mkUnit({ id: 'player1' }),
        mkUnit({ id: 'player2' }),
      ];
      const playerTeam = mkTeam(playerUnits);
      const enemies = [mkEnemy('mercury-slime', { id: 'enemy1' })];

      const ability: Ability = {
        id: 'test-ability',
        name: 'Test Ability',
        type: 'healing',
        basePower: 10,
        targets: 'self',
        manaCost: 0,
        element: 'Neutral',
      };

      const targets = getValidTargets(ability, playerUnits[0]!, playerTeam, enemies);

      expect(targets.length).toBe(1);
      expect(targets[0]!.id).toBe('player1');
    });

    test('should filter KO\'d allies for single-ally targeting abilities', () => {
      const playerUnits = [
        mkUnit({ id: 'player1', currentHp: 100 }),
        mkUnit({ id: 'player2', currentHp: 0 }), // KO'd
        mkUnit({ id: 'player3', currentHp: 50 }),
      ];
      const playerTeam = mkTeam(playerUnits);
      const enemies = [mkEnemy('mercury-slime', { id: 'enemy1' })];

      const ability: Ability = {
        id: 'test-ability',
        name: 'Test Ability',
        type: 'healing',
        basePower: 10,
        targets: 'single-ally',
        manaCost: 0,
        element: 'Neutral',
      };

      const targets = getValidTargets(ability, playerUnits[0]!, playerTeam, enemies);

      expect(targets.length).toBe(1); // Only alive allies excluding self (player3)
      expect(targets.every(t => t.currentHp > 0)).toBe(true);
      expect(targets.every(t => t.id !== 'player1')).toBe(true);
    });

    test('should return empty array for unknown target type', () => {
      const playerUnits = [mkUnit({ id: 'player1' })];
      const playerTeam = mkTeam(playerUnits);
      const enemies = [mkEnemy('mercury-slime', { id: 'enemy1' })];

      const ability: Ability = {
        id: 'test-ability',
        name: 'Test Ability',
        type: 'physical',
        basePower: 10,
        // @ts-expect-error - Testing invalid target type
        targets: 'invalid-target-type',
        manaCost: 0,
        element: 'Neutral',
      };

      const targets = getValidTargets(ability, playerUnits[0]!, playerTeam, enemies);

      expect(targets).toEqual([]);
    });
  });
});
