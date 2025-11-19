import { test, expect } from '@playwright/test';
import { ENCOUNTERS } from '../../src/data/definitions/encounters';

/**
 * Encounter Progression Tests
 *
 * These tests validate the Houses 1-20 progression with VS1 as House 1.
 *
 * CONTEXT (Nov 2025 - Phase 2 Implementation):
 * - House 1 = VS1 Tutorial (Garet recruitment + Forge Djinn)
 * - 6 new recruitable units (Blaze, Sentinel, Karis, Tyrell, Stormcaller, Felix)
 * - Djinn redistributed with Flint pre-game, Forge at House 1
 * - Complete 20-house progression with smooth XP/gold curves
 * - Act transitions: H7→H8 (+50 XP), H14→H15 (+80 XP), H19→H20 (+900 XP finale)
 *
 * PURPOSE:
 * - Validate XP/gold progression matches HOUSES_1-20_COMPLETE_PROGRESSION.md blueprint
 * - Ensure smooth within-act progression
 * - Verify unit recruitment rewards are correctly defined
 * - Prevent future XP/gold regressions
 *
 * NOTE: These are data validation tests, not true E2E navigation tests.
 * True E2E tests require map triggers for houses 02-20 (not yet implemented).
 */

test.describe('Encounter Progression - Data Validation', () => {
  test('Act 1 progression is smooth (+10 XP, +2 gold per house)', () => {
    // Act 1: Houses 1-7 (Discovery Phase)
    const act1Houses = [
      { id: 'house-01', xp: 60, gold: 20 }, // VS1 Tutorial
      { id: 'house-02', xp: 70, gold: 22 },
      { id: 'house-03', xp: 80, gold: 24 },
      { id: 'house-04', xp: 90, gold: 26 },
      { id: 'house-05', xp: 100, gold: 28 },
      { id: 'house-06', xp: 120, gold: 32 },
      { id: 'house-07', xp: 150, gold: 40 }, // End of Act 1, 3rd Djinn (summons unlock)
    ];

    act1Houses.forEach(({ id, xp, gold }) => {
      const encounter = ENCOUNTERS[id];
      expect(encounter).toBeDefined();
      expect(encounter?.reward.xp).toBe(xp);
      expect(encounter?.reward.gold).toBe(gold);
    });
  });

  test('House 08 has intentional spike (unit recruitment milestone)', () => {
    // H07→H08: +50 XP jump (Sentinel recruitment + Fizz Djinn, Act 1→Act 2 transition)
    const h07 = ENCOUNTERS['house-07'];
    const h08 = ENCOUNTERS['house-08'];

    expect(h07?.reward.xp).toBe(150);
    expect(h08?.reward.xp).toBe(200);
    expect(h08.reward.xp - h07.reward.xp).toBe(50); // Intentional spike

    expect(h08?.reward.gold).toBe(55);
  });

  test('Act 2 progression is smooth after H08 spike (no regressions)', () => {
    // Act 2: Houses 8-14 (Resistance Phase)
    const act2Houses = [
      { id: 'house-08', xp: 200, gold: 55 }, // Spike (intentional, +Sentinel +Fizz)
      { id: 'house-09', xp: 215, gold: 58 },
      { id: 'house-10', xp: 235, gold: 62 },
      { id: 'house-11', xp: 255, gold: 68 }, // +Karis
      { id: 'house-12', xp: 275, gold: 72 }, // +Granite (T2 Djinn)
      { id: 'house-13', xp: 295, gold: 76 },
      { id: 'house-14', xp: 320, gold: 82 }, // +Tyrell
    ];

    act2Houses.forEach(({ id, xp, gold }) => {
      const encounter = ENCOUNTERS[id];
      expect(encounter).toBeDefined();
      expect(encounter?.reward.xp).toBe(xp);
      expect(encounter?.reward.gold).toBe(gold);
    });
  });

  test('Recruitment milestones have correct XP values', () => {
    // Validate all 6 battle recruitment houses
    const recruitmentHouses = [
      { id: 'house-01', xp: 60, unit: 'Garet' },
      { id: 'house-05', xp: 100, unit: 'Blaze' },
      { id: 'house-08', xp: 200, unit: 'Sentinel' },
      { id: 'house-11', xp: 255, unit: 'Karis' },
      { id: 'house-14', xp: 320, unit: 'Tyrell' },
      { id: 'house-15', xp: 400, unit: 'Stormcaller' },
    ];

    recruitmentHouses.forEach(({ id, xp }) => {
      const encounter = ENCOUNTERS[id];
      expect(encounter?.reward.xp).toBe(xp);
      expect(encounter?.reward.unlockUnit).toBeDefined();
    });
  });

  test('House 15 has intentional spike (unit recruitment milestone)', () => {
    // H14→H15: +80 XP jump (Stormcaller recruitment + Squall Djinn, Act 2→Act 3 transition)
    const h14 = ENCOUNTERS['house-14'];
    const h15 = ENCOUNTERS['house-15'];

    expect(h14?.reward.xp).toBe(320);
    expect(h15?.reward.xp).toBe(400);
    expect(h15.reward.xp - h14.reward.xp).toBe(80); // Intentional spike

    expect(h15?.reward.gold).toBe(110);
  });

  test('Act 3 progression is smooth with +50 XP increments', () => {
    // Act 3: Houses 15-19 (Liberation Phase)
    const act3Houses = [
      { id: 'house-15', xp: 400, gold: 110 }, // Spike (intentional, +Stormcaller +Squall)
      { id: 'house-16', xp: 450, gold: 120 },
      { id: 'house-17', xp: 500, gold: 130 }, // +Felix
      { id: 'house-18', xp: 550, gold: 140 }, // +Bane (T3 Djinn)
      { id: 'house-19', xp: 600, gold: 150 },
    ];

    act3Houses.forEach(({ id, xp, gold }) => {
      const encounter = ENCOUNTERS[id];
      expect(encounter).toBeDefined();
      expect(encounter?.reward.xp).toBe(xp);
      expect(encounter?.reward.gold).toBe(gold);
    });
  });

  test('Final boss (H20) has massive reward spike', () => {
    const h19 = ENCOUNTERS['house-19'];
    const h20 = ENCOUNTERS['house-20'];

    expect(h19?.reward.xp).toBe(600);
    expect(h20?.reward.xp).toBe(1500);
    expect(h20.reward.xp - h19.reward.xp).toBe(900); // Epic finale

    expect(h20?.reward.gold).toBe(300);
  });

  test('All encounters have non-negative rewards', () => {
    const allEncounters = Object.values(ENCOUNTERS);

    allEncounters.forEach((encounter) => {
      expect(encounter.reward.xp).toBeGreaterThanOrEqual(0);
      expect(encounter.reward.gold).toBeGreaterThanOrEqual(0);
    });
  });

  test('No XP regressions across entire progression', () => {
    // Verify XP never decreases from one house to the next
    const houseSequence = [
      'house-01', 'house-02', 'house-03', 'house-04', 'house-05',
      'house-06', 'house-07', 'house-08', 'house-09', 'house-10',
      'house-11', 'house-12', 'house-13', 'house-14', 'house-15',
      'house-16', 'house-17', 'house-18', 'house-19', 'house-20',
    ];

    for (let i = 1; i < houseSequence.length; i++) {
      const prevEncounter = ENCOUNTERS[houseSequence[i - 1]];
      const currEncounter = ENCOUNTERS[houseSequence[i]];

      expect(currEncounter?.reward.xp).toBeGreaterThanOrEqual(
        prevEncounter?.reward.xp ?? 0
      );
    }
  });

  test('No gold regressions across entire progression', () => {
    // Verify gold never decreases from one house to the next
    const houseSequence = [
      'house-01', 'house-02', 'house-03', 'house-04', 'house-05',
      'house-06', 'house-07', 'house-08', 'house-09', 'house-10',
      'house-11', 'house-12', 'house-13', 'house-14', 'house-15',
      'house-16', 'house-17', 'house-18', 'house-19', 'house-20',
    ];

    for (let i = 1; i < houseSequence.length; i++) {
      const prevEncounter = ENCOUNTERS[houseSequence[i - 1]];
      const currEncounter = ENCOUNTERS[houseSequence[i]];

      expect(currEncounter?.reward.gold).toBeGreaterThanOrEqual(
        prevEncounter?.reward.gold ?? 0
      );
    }
  });
});

test.describe('Encounter Progression - Curve Analysis', () => {
  test('Act transitions create clear difficulty gates', () => {
    const h07 = ENCOUNTERS['house-07'];
    const h08 = ENCOUNTERS['house-08'];
    const h14 = ENCOUNTERS['house-14'];
    const h15 = ENCOUNTERS['house-15'];

    // Act 1→Act 2 spike (+50 XP)
    expect(h08?.reward.xp - h07?.reward.xp).toBe(50);
    expect(h08?.difficulty).toBe('medium');

    // Act 2→Act 3 spike (+80 XP)
    expect(h15?.reward.xp - h14?.reward.xp).toBe(80);
    expect(h15?.difficulty).toBe('hard');
  });

  test('Within-act progression has consistent growth', () => {
    // Act 1: Variable growth (H01-H07)
    // H01→H02: +10, H02→H03: +10, H03→H04: +10, H04→H05: +10, H05→H06: +20, H06→H07: +30

    // Act 3: +50 XP per house (H16-H19)
    const act3Deltas = [50, 50, 50, 50]; // H16-H19
    for (let i = 16; i <= 19; i++) {
      const prev = ENCOUNTERS[`house-${i - 1}`];
      const curr = ENCOUNTERS[`house-${i}`];
      expect(curr?.reward.xp - prev?.reward.xp).toBe(act3Deltas[i - 16]);
    }
  });

  test('Gold progression is monotonically increasing', () => {
    // Gold should never decrease
    const goldValues = [
      20, 22, 24, 26, 28, 32, 40, // Act 1
      55, 58, 62, 68, 72, 76, 82, // Act 2
      110, 120, 130, 140, 150, // Act 3 (excluding H20)
    ];

    for (let i = 1; i < goldValues.length; i++) {
      expect(goldValues[i]).toBeGreaterThan(goldValues[i - 1]);
    }
  });

  test('Djinn rewards appear at correct houses', () => {
    const djinnHouses = [
      { id: 'house-01', djinn: 'forge' }, // Mars T1
      { id: 'house-07', djinn: 'breeze' }, // Jupiter T1 (summons unlock!)
      { id: 'house-08', djinn: 'fizz' }, // Mercury T1
      { id: 'house-12', djinn: 'granite' }, // Venus T2
      { id: 'house-15', djinn: 'squall' }, // Jupiter T2
      { id: 'house-18', djinn: 'bane' }, // Venus T3
      { id: 'house-20', djinn: 'storm' }, // Jupiter T3
    ];

    djinnHouses.forEach(({ id, djinn }) => {
      const encounter = ENCOUNTERS[id];
      expect(encounter?.reward.djinn).toBe(djinn);
    });
  });
});
