/**
 * Tests for migration 1.1 -> 1.2
 * PR-SCHEMA-20: Level cap 20, equipment.accessory field
 */

import { describe, test, expect } from 'vitest';
import { migrateSave } from '../../../src/core/save/migrations';
import type { SaveEnvelope } from '../../../src/core/save/types';

describe('Migration 1.1 -> 1.2', () => {
  test('should clamp unit levels > 20 to 20', () => {
    const oldSave: SaveEnvelope = {
      version: { major: 1, minor: 1 },
      state: {
        team: {
          units: [
            {
              id: 'test-unit-1',
              name: 'Test Unit',
              level: 25, // Should be clamped to 20
              xp: 100000,
              currentHp: 100,
              baseStats: { hp: 100, pp: 20, atk: 10, def: 10, mag: 10, spd: 10 },
              growthRates: { hp: 10, pp: 2, atk: 1, def: 1, mag: 1, spd: 1 },
              equipment: {
                weapon: null,
                armor: null,
                helm: null,
                boots: null,
                accessory: null,
              },
              djinn: [],
              djinnStates: {},
              abilities: [],
              unlockedAbilityIds: [],
              statusEffects: [],
              actionsTaken: 0,
              battleStats: { damageDealt: 0, damageTaken: 0 },
              element: 'Venus',
              role: 'Balanced Warrior',
              description: 'Test',
              manaContribution: 1,
            },
          ],
          equippedDjinn: [],
          djinnTrackers: {},
          collectedDjinn: [],
          currentTurn: 0,
          activationsThisTurn: {},
        },
      },
    };

    const migrated = migrateSave(oldSave);
    
    expect(migrated.version).toEqual({ major: 1, minor: 2 });
    expect(migrated.state.team.units[0]?.level).toBe(20);
  });

  test('should clamp enemy levels > 20 to 20', () => {
    const oldSave: SaveEnvelope = {
      version: { major: 1, minor: 1 },
      state: {
        battle: {
          enemies: [
            {
              id: 'test-enemy-1',
              name: 'Test Enemy',
              level: 30, // Should be clamped to 20
              xp: 0,
              currentHp: 100,
              baseStats: { hp: 100, pp: 20, atk: 10, def: 10, mag: 10, spd: 10 },
              growthRates: { hp: 0, pp: 0, atk: 0, def: 0, mag: 0, spd: 0 },
              equipment: {
                weapon: null,
                armor: null,
                helm: null,
                boots: null,
                accessory: null,
              },
              djinn: [],
              djinnStates: {},
              abilities: [],
              unlockedAbilityIds: [],
              statusEffects: [],
              actionsTaken: 0,
              battleStats: { damageDealt: 0, damageTaken: 0 },
              element: 'Neutral',
              role: 'Pure DPS',
              description: 'Test',
              manaContribution: 0,
            },
          ],
          playerTeam: {
            units: [],
            equippedDjinn: [],
            djinnTrackers: {},
            collectedDjinn: [],
            currentTurn: 0,
            activationsThisTurn: {},
          },
          currentTurn: 0,
          turnOrder: [],
          currentActorIndex: 0,
          status: 'ongoing',
          log: [],
        },
      },
    };

    const migrated = migrateSave(oldSave);
    
    expect(migrated.version).toEqual({ major: 1, minor: 2 });
    expect(migrated.state.battle?.enemies[0]?.level).toBe(20);
  });

  test('should add equipment.accessory field if missing', () => {
    const oldSave: SaveEnvelope = {
      version: { major: 1, minor: 1 },
      state: {
        team: {
          units: [
            {
              id: 'test-unit-1',
              name: 'Test Unit',
              level: 5,
              xp: 1000,
              currentHp: 100,
              baseStats: { hp: 100, pp: 20, atk: 10, def: 10, mag: 10, spd: 10 },
              growthRates: { hp: 10, pp: 2, atk: 1, def: 1, mag: 1, spd: 1 },
              equipment: {
                weapon: null,
                armor: null,
                helm: null,
                boots: null,
                // accessory missing
              } as any,
              djinn: [],
              djinnStates: {},
              abilities: [],
              unlockedAbilityIds: [],
              statusEffects: [],
              actionsTaken: 0,
              battleStats: { damageDealt: 0, damageTaken: 0 },
              element: 'Venus',
              role: 'Balanced Warrior',
              description: 'Test',
              manaContribution: 1,
            },
          ],
          equippedDjinn: [],
          djinnTrackers: {},
          collectedDjinn: [],
          currentTurn: 0,
          activationsThisTurn: {},
        },
      },
    };

    const migrated = migrateSave(oldSave);
    
    expect(migrated.version).toEqual({ major: 1, minor: 2 });
    expect(migrated.state.team.units[0]?.equipment.accessory).toBeDefined();
    expect(migrated.state.team.units[0]?.equipment.accessory).toBeNull();
  });

  test('should leave levels <= 20 unchanged', () => {
    const oldSave: SaveEnvelope = {
      version: { major: 1, minor: 1 },
      state: {
        team: {
          units: [
            {
              id: 'test-unit-1',
              name: 'Test Unit',
              level: 5, // Should remain 5
              xp: 1000,
              currentHp: 100,
              baseStats: { hp: 100, pp: 20, atk: 10, def: 10, mag: 10, spd: 10 },
              growthRates: { hp: 10, pp: 2, atk: 1, def: 1, mag: 1, spd: 1 },
              equipment: {
                weapon: null,
                armor: null,
                helm: null,
                boots: null,
                accessory: null,
              },
              djinn: [],
              djinnStates: {},
              abilities: [],
              unlockedAbilityIds: [],
              statusEffects: [],
              actionsTaken: 0,
              battleStats: { damageDealt: 0, damageTaken: 0 },
              element: 'Venus',
              role: 'Balanced Warrior',
              description: 'Test',
              manaContribution: 1,
            },
          ],
          equippedDjinn: [],
          djinnTrackers: {},
          collectedDjinn: [],
          currentTurn: 0,
          activationsThisTurn: {},
        },
      },
    };

    const migrated = migrateSave(oldSave);
    
    expect(migrated.version).toEqual({ major: 1, minor: 2 });
    expect(migrated.state.team.units[0]?.level).toBe(5);
  });
});

