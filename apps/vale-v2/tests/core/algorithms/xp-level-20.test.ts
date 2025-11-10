/**
 * Tests for XP curve extended to level 20
 * PR-SCHEMA-20
 */

import { describe, it, expect } from 'vitest';
import { getXpForLevel, calculateLevelFromXp, getXpProgress } from '../../../src/core/algorithms/xp';

describe('XP Level 20 Support', () => {
  it('should return correct XP for all levels 1-20', () => {
    const expectedXp: Record<number, number> = {
      1: 0,
      2: 100,
      3: 350,
      4: 850,
      5: 1850,
      6: 3100,
      7: 4700,
      8: 6700,
      9: 9200,
      10: 12300,
      11: 16000,
      12: 20400,
      13: 25600,
      14: 31700,
      15: 38800,
      16: 47000,
      17: 56400,
      18: 67100,
      19: 79200,
      20: 92800,
    };

    for (let level = 1; level <= 20; level++) {
      expect(getXpForLevel(level)).toBe(expectedXp[level]);
    }
  });

  it('should clamp getXpForLevel below 1', () => {
    expect(getXpForLevel(0)).toBe(0);
    expect(getXpForLevel(-1)).toBe(0);
  });

  it('should clamp getXpForLevel above 20', () => {
    expect(getXpForLevel(21)).toBe(92800); // Level 20 XP
    expect(getXpForLevel(100)).toBe(92800);
  });

  it('should calculate correct level from XP for all levels', () => {
    // Test boundary values
    expect(calculateLevelFromXp(0)).toBe(1);
    expect(calculateLevelFromXp(99)).toBe(1);
    expect(calculateLevelFromXp(100)).toBe(2);
    expect(calculateLevelFromXp(349)).toBe(2);
    expect(calculateLevelFromXp(350)).toBe(3);
    expect(calculateLevelFromXp(1849)).toBe(4);
    expect(calculateLevelFromXp(1850)).toBe(5);
    expect(calculateLevelFromXp(92799)).toBe(19);
    expect(calculateLevelFromXp(92800)).toBe(20);
    expect(calculateLevelFromXp(100000)).toBe(20); // Clamped to 20
  });

  it('should clamp calculateLevelFromXp below 0', () => {
    expect(calculateLevelFromXp(-1)).toBe(1);
    expect(calculateLevelFromXp(-100)).toBe(1);
  });

  it('should clamp calculateLevelFromXp above level 20', () => {
    expect(calculateLevelFromXp(100000)).toBe(20);
    expect(calculateLevelFromXp(1000000)).toBe(20);
  });

  it('should return correct XP progress for all levels', () => {
    // Test level 1
    const progress1 = getXpProgress(50);
    expect(progress1.level).toBe(1);
    expect(progress1.current).toBe(50);
    expect(progress1.needed).toBe(100);
    expect(progress1.progress).toBeCloseTo(0.5);

    // Test level 20 (max level)
    const progress20 = getXpProgress(92800);
    expect(progress20.level).toBe(20);
    expect(progress20.progress).toBe(1.0); // Max level, progress is 100%
  });

  it('should be monotonic: higher XP always gives higher or equal level', () => {
    const testXps = [0, 50, 100, 200, 500, 1000, 2000, 5000, 10000, 50000, 100000];
    let prevLevel = 0;
    
    for (const xp of testXps) {
      const level = calculateLevelFromXp(xp);
      expect(level).toBeGreaterThanOrEqual(prevLevel);
      prevLevel = level;
    }
  });
});

