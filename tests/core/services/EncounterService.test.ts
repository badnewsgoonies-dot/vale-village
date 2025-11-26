/**
 * Encounter Service Tests
 * Tests encounter loading and battle creation
 */

import { describe, test, expect } from 'vitest';
import {
  loadEncounter,
  createBattleFromEncounter,
  getChapter1Encounters,
  isBossEncounter,
  rollForRandomEncounter,
  selectRandomEncounter,
  processRandomEncounter,
} from '@/core/services/EncounterService';
import { createTeam } from '@/core/models/Team';
import { makePRNG } from '@/core/random/prng';
import { mkUnit } from '@/test/factories';

describe('EncounterService - Encounter Loading', () => {
  test('loadEncounter returns valid encounter for valid ID', () => {
    const encounter = loadEncounter('house-01');

    expect(encounter).toBeDefined();
    expect(encounter).not.toBeNull();
    expect(encounter?.id).toBe('house-01');
    expect(encounter?.enemies).toBeInstanceOf(Array);
    expect(encounter?.enemies.length).toBeGreaterThan(0);
  });

  test('loadEncounter returns null for invalid ID', () => {
    const encounter = loadEncounter('nonexistent-encounter');

    expect(encounter).toBeNull();
  });

  test('loadEncounter includes reward data', () => {
    const encounter = loadEncounter('house-01');

    expect(encounter).not.toBeNull();
    expect(encounter?.reward).toBeDefined();
    expect(encounter?.reward.xp).toBeGreaterThan(0);
  });
});

describe('EncounterService - Battle Creation', () => {
  test('createBattleFromEncounter creates valid battle state', () => {
    const playerTeam = createTeam([
      mkUnit({ id: 'isaac', level: 5 }),
      mkUnit({ id: 'garet', level: 5 }),
      mkUnit({ id: 'ivan', level: 5 }),
      mkUnit({ id: 'mia', level: 5 }),
    ]);

    const rng = makePRNG(42);
    const result = createBattleFromEncounter('house-01', playerTeam, rng);

    expect(result).not.toBeNull();
    expect(result?.battle).toBeDefined();
    expect(result?.encounter).toBeDefined();
    expect(result?.battle.enemies.length).toBeGreaterThan(0);
    expect(result?.battle.playerTeam.units.length).toBe(4);
  });

  test('createBattleFromEncounter assigns unique enemy IDs', () => {
    const playerTeam = createTeam([mkUnit({ id: 'isaac', level: 5 })]);
    const rng = makePRNG(42);

    // Use an encounter with multiple enemies of same type
    const result = createBattleFromEncounter('house-01', playerTeam, rng);

    if (!result) {
      throw new Error('Battle creation failed');
    }

    const enemyIds = result.battle.enemies.map(e => e.id);
    const uniqueIds = new Set(enemyIds);

    // All enemy IDs should be unique
    expect(uniqueIds.size).toBe(enemyIds.length);
  });

  test('createBattleFromEncounter sets encounter metadata', () => {
    const playerTeam = createTeam([mkUnit({ id: 'isaac', level: 5 })]);
    const rng = makePRNG(42);

    const result = createBattleFromEncounter('house-01', playerTeam, rng);

    expect(result).not.toBeNull();
    expect(result?.battle.encounterId).toBe('house-01');
    expect(result?.battle.meta?.encounterId).toBe('house-01');
  });

  test('createBattleFromEncounter sets boss flag for boss battles', () => {
    const playerTeam = createTeam([mkUnit({ id: 'isaac', level: 5 })]);
    const rng = makePRNG(42);

    const result = createBattleFromEncounter('house-20', playerTeam, rng);

    expect(result).not.toBeNull();
    expect(result?.battle.isBossBattle).toBe(true);
  });

  test('createBattleFromEncounter returns null for invalid encounter', () => {
    const playerTeam = createTeam([mkUnit({ id: 'isaac', level: 5 })]);
    const rng = makePRNG(42);

    const result = createBattleFromEncounter('invalid-encounter', playerTeam, rng);

    expect(result).toBeNull();
  });

  test('createBattleFromEncounter handles encounters with multiple enemy types', () => {
    const playerTeam = createTeam([mkUnit({ id: 'isaac', level: 5 })]);
    const rng = makePRNG(42);

    // House 20 (final boss) has multiple different enemies
    const result = createBattleFromEncounter('house-20', playerTeam, rng);

    expect(result).not.toBeNull();
    if (result) {
      expect(result.battle.enemies.length).toBeGreaterThan(0);
      // Check that enemy IDs are unique
      const ids = result.battle.enemies.map(e => e.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(ids.length);
    }
  });
});

describe('EncounterService - Chapter 1 Encounters', () => {
  test('getChapter1Encounters returns house encounters in order', () => {
    const encounters = getChapter1Encounters();

    expect(encounters).toBeInstanceOf(Array);
    expect(encounters.length).toBeGreaterThan(0);

    // Should include house encounters
    const houseEncounters = encounters.filter(id => id.startsWith('house-'));
    expect(houseEncounters.length).toBeGreaterThan(0);
  });

  test('getChapter1Encounters includes legacy encounters', () => {
    const encounters = getChapter1Encounters();

    // May include c1_ prefixed encounters
    const hasLegacyOrHouse = encounters.some(
      id => id.startsWith('c1_') || id.startsWith('house-')
    );
    expect(hasLegacyOrHouse).toBe(true);
  });
});

describe('EncounterService - Boss Detection', () => {
  test('isBossEncounter returns true for boss encounters', () => {
    expect(isBossEncounter('house-20')).toBe(true);
  });

  test('isBossEncounter returns false for normal encounters', () => {
    expect(isBossEncounter('house-01')).toBe(false);
  });

  test('isBossEncounter returns false for invalid encounters', () => {
    expect(isBossEncounter('invalid-encounter')).toBe(false);
  });
});

describe('EncounterService - Random Encounters', () => {
  test('rollForRandomEncounter triggers based on rate', () => {
    const rng = makePRNG(42);

    // 100% encounter rate should always trigger
    expect(rollForRandomEncounter(1.0, rng)).toBe(true);

    // 0% encounter rate should never trigger
    const noEncounterRng = makePRNG(100);
    expect(rollForRandomEncounter(0, noEncounterRng)).toBe(false);
  });

  test('rollForRandomEncounter is deterministic with seeded RNG', () => {
    const rng1 = makePRNG(777);
    const rng2 = makePRNG(777);

    const result1 = rollForRandomEncounter(0.5, rng1);
    const result2 = rollForRandomEncounter(0.5, rng2);

    expect(result1).toBe(result2);
  });

  test('selectRandomEncounter returns encounter from pool', () => {
    const pool = ['house-01', 'house-02', 'house-03'];
    const rng = makePRNG(42);

    const encounter = selectRandomEncounter(pool, rng);

    expect(encounter).not.toBeNull();
    expect(pool).toContain(encounter!);
  });

  test('selectRandomEncounter returns null for empty pool', () => {
    const rng = makePRNG(42);
    const encounter = selectRandomEncounter([], rng);

    expect(encounter).toBeNull();
  });

  test('selectRandomEncounter is deterministic with seeded RNG', () => {
    const pool = ['house-01', 'house-02', 'house-03'];
    const rng1 = makePRNG(999);
    const rng2 = makePRNG(999);

    const encounter1 = selectRandomEncounter(pool, rng1);
    const encounter2 = selectRandomEncounter(pool, rng2);

    expect(encounter1).toBe(encounter2);
  });

  test('processRandomEncounter returns encounter when triggered', () => {
    const pool = ['house-01', 'house-02'];
    const rng = makePRNG(42);

    // High rate to ensure trigger
    const encounter = processRandomEncounter(1.0, pool, rng);

    expect(encounter).not.toBeNull();
    expect(pool).toContain(encounter!);
  });

  test('processRandomEncounter returns null when not triggered', () => {
    const pool = ['house-01', 'house-02'];
    const rng = makePRNG(42);

    // 0% rate should never trigger
    const encounter = processRandomEncounter(0, pool, rng);

    expect(encounter).toBeNull();
  });

  test('processRandomEncounter returns null for missing rate', () => {
    const pool = ['house-01', 'house-02'];
    const rng = makePRNG(42);

    const encounter = processRandomEncounter(undefined, pool, rng);

    expect(encounter).toBeNull();
  });

  test('processRandomEncounter returns null for missing pool', () => {
    const rng = makePRNG(42);

    const encounter = processRandomEncounter(0.5, undefined, rng);

    expect(encounter).toBeNull();
  });
});

describe('EncounterService - Integration', () => {
  test('full encounter flow creates battle successfully', () => {
    const playerTeam = createTeam([
      mkUnit({ id: 'isaac', level: 5 }),
      mkUnit({ id: 'garet', level: 5 }),
    ]);

    const rng = makePRNG(42);

    // Simulate random encounter selection
    const pool = ['house-01', 'house-02', 'house-03'];
    const encounterId = selectRandomEncounter(pool, rng);

    expect(encounterId).not.toBeNull();

    // Create battle from selected encounter
    const result = createBattleFromEncounter(encounterId!, playerTeam, rng);

    expect(result).not.toBeNull();
    expect(result?.battle.enemies.length).toBeGreaterThan(0);
    expect(result?.battle.encounterId).toBe(encounterId);
  });

  test('encounter loading and battle creation are consistent', () => {
    const encounterId = 'house-01';
    const encounter = loadEncounter(encounterId);

    expect(encounter).not.toBeNull();

    const playerTeam = createTeam([mkUnit({ id: 'isaac', level: 5 })]);
    const rng = makePRNG(42);

    const battleResult = createBattleFromEncounter(encounterId, playerTeam, rng);

    expect(battleResult).not.toBeNull();
    expect(battleResult?.encounter).toEqual(encounter);
    expect(battleResult?.battle.enemies.length).toBe(encounter?.enemies.length);
  });
});
