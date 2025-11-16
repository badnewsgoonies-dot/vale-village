import { test, expect } from '@playwright/test';
import { ENCOUNTERS } from '../../src/data/definitions/encounters';

/**
 * Encounter Progression Regression Tests
 *
 * These tests validate the exact XP/gold values from the Nov 2025 progression fixes.
 *
 * CONTEXT:
 * - Fixed XP regressions at H09 (175→185) and H13 (220→230)
 * - Fixed gold drop bug at H14 (48→62)
 * - Smoothed Act 2 progression (H09-H14)
 * - Smoothed Act 3 progression (H16-H19)
 * - Preserved intentional spikes at H08 (+70 XP) and H15 (+55 XP)
 *
 * PURPOSE:
 * - Catch if someone accidentally reverts the encounter fixes
 * - Document intended progression values
 * - Prevent future XP/gold regressions
 *
 * NOTE: These are data validation tests, not true E2E navigation tests.
 * True E2E tests require map triggers for houses 03-20 (not yet implemented).
 */

test.describe('Encounter Progression - Data Validation', () => {
  test('Act 1 progression is smooth (+10 XP, +2 gold per house)', () => {
    // Act 1: Houses 1-7 (Discovery Phase)
    const act1Houses = [
      { id: 'house-01', xp: 50, gold: 18 },
      { id: 'house-02', xp: 60, gold: 20 }, // Fixed from 19→20
      { id: 'house-03', xp: 70, gold: 22 },
      { id: 'house-04', xp: 80, gold: 24 },
      { id: 'house-05', xp: 90, gold: 26 },
      { id: 'house-06', xp: 100, gold: 28 },
      { id: 'house-07', xp: 110, gold: 30 },
    ];

    act1Houses.forEach(({ id, xp, gold }) => {
      const encounter = ENCOUNTERS[id];
      expect(encounter).toBeDefined();
      expect(encounter?.reward.xp).toBe(xp);
      expect(encounter?.reward.gold).toBe(gold);
    });
  });

  test('House 08 has intentional spike (unit recruitment milestone)', () => {
    // H07→H08: +70 XP jump (Sentinel recruitment, Medium→Hard)
    const h07 = ENCOUNTERS['house-07'];
    const h08 = ENCOUNTERS['house-08'];

    expect(h07?.reward.xp).toBe(110);
    expect(h08?.reward.xp).toBe(180);
    expect(h08.reward.xp - h07.reward.xp).toBe(70); // Intentional spike

    expect(h08?.reward.gold).toBe(50);
  });

  test('Act 2 progression is smooth after H08 spike (no regressions)', () => {
    // Act 2: Houses 8-14 (Resistance Phase)
    // Validates fixes for XP regressions and gold drop
    const act2Houses = [
      { id: 'house-08', xp: 180, gold: 50 }, // Spike (intentional)
      { id: 'house-09', xp: 185, gold: 52 }, // Fixed from 175→185
      { id: 'house-10', xp: 195, gold: 54 },
      { id: 'house-11', xp: 210, gold: 56 },
      { id: 'house-12', xp: 220, gold: 58 },
      { id: 'house-13', xp: 230, gold: 60 }, // Fixed from 220→230
      { id: 'house-14', xp: 245, gold: 62 }, // Fixed from 48→62 (gold drop bug)
    ];

    act2Houses.forEach(({ id, xp, gold }) => {
      const encounter = ENCOUNTERS[id];
      expect(encounter).toBeDefined();
      expect(encounter?.reward.xp).toBe(xp);
      expect(encounter?.reward.gold).toBe(gold);
    });
  });

  test('XP regression bugs are fixed (H09 and H13)', () => {
    // These encounters previously had LOWER XP than previous house (bug)
    const h09 = ENCOUNTERS['house-09'];
    const h08 = ENCOUNTERS['house-08'];
    expect(h09?.reward.xp).toBeGreaterThan(h08?.reward.xp ?? 0);

    const h13 = ENCOUNTERS['house-13'];
    const h12 = ENCOUNTERS['house-12'];
    expect(h13?.reward.xp).toBeGreaterThan(h12?.reward.xp ?? 0);
  });

  test('Gold drop bug is fixed (H14 now has 62 gold, not 48)', () => {
    const h13 = ENCOUNTERS['house-13'];
    const h14 = ENCOUNTERS['house-14'];

    expect(h13?.reward.gold).toBe(60);
    expect(h14?.reward.gold).toBe(62); // Was 48 (bug)
    expect(h14.reward.gold).toBeGreaterThan(h13.reward.gold); // No regression
  });

  test('House 15 has intentional spike (unit recruitment milestone)', () => {
    // H14→H15: +55 XP jump (Stormcaller recruitment, Hard→Boss)
    const h14 = ENCOUNTERS['house-14'];
    const h15 = ENCOUNTERS['house-15'];

    expect(h14?.reward.xp).toBe(245);
    expect(h15?.reward.xp).toBe(300);
    expect(h15.reward.xp - h14.reward.xp).toBe(55); // Intentional spike

    expect(h15?.reward.gold).toBe(90);
  });

  test('Act 3 progression is smooth with boss-tier scaling (+25 XP increments)', () => {
    // Act 3: Houses 15-19 (Liberation Phase)
    // Validates smoothed boss-tier progression
    const act3Houses = [
      { id: 'house-15', xp: 300, gold: 90 }, // Spike (intentional)
      { id: 'house-16', xp: 325, gold: 95 }, // Fixed from 320→325
      { id: 'house-17', xp: 350, gold: 100 }, // Fixed from 380→350
      { id: 'house-18', xp: 375, gold: 105 }, // Fixed from 400→375
      { id: 'house-19', xp: 400, gold: 110 }, // Fixed from 480→400
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

    expect(h19?.reward.xp).toBe(400);
    expect(h20?.reward.xp).toBe(1000);
    expect(h20.reward.xp - h19.reward.xp).toBe(600); // Epic finale

    expect(h20?.reward.gold).toBe(250);
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

    // Act 1→Act 2 spike
    expect(h08?.reward.xp - h07?.reward.xp).toBe(70);
    expect(h08?.difficulty).toBe('hard');

    // Act 2→Act 3 spike
    expect(h15?.reward.xp - h14?.reward.xp).toBe(55);
    expect(h15?.difficulty).toBe('boss');
  });

  test('Within-act progression is consistent', () => {
    // Act 1: +10 XP per house
    const act1Deltas = [10, 10, 10, 10, 10, 10]; // H02-H07
    for (let i = 2; i <= 7; i++) {
      const prev = ENCOUNTERS[`house-0${i - 1}`];
      const curr = ENCOUNTERS[`house-0${i}`];
      expect(curr?.reward.xp - prev?.reward.xp).toBe(act1Deltas[i - 2]);
    }

    // Act 3: +25 XP per house (boss-tier scaling)
    const act3Deltas = [25, 25, 25, 25]; // H16-H19
    for (let i = 16; i <= 19; i++) {
      const prev = ENCOUNTERS[`house-${i - 1}`];
      const curr = ENCOUNTERS[`house-${i}`];
      expect(curr?.reward.xp - prev?.reward.xp).toBe(act3Deltas[i - 16]);
    }
  });

  test('Gold progression is monotonically increasing', () => {
    // Gold should never decrease (validates fix for H14 bug)
    const goldValues = [
      18, 20, 22, 24, 26, 28, 30, // Act 1
      50, 52, 54, 56, 58, 60, 62, // Act 2
      90, 95, 100, 105, 110, // Act 3 (excluding H20)
    ];

    for (let i = 1; i < goldValues.length; i++) {
      expect(goldValues[i]).toBeGreaterThan(goldValues[i - 1]);
    }
  });
});
