/**
 * Global Test Setup
 * Runs before all test suites
 */

import { beforeAll, afterEach, afterAll } from 'vitest';
import { TestDataCache } from '@/test/shared-mocks';

// Global test setup
beforeAll(() => {
  // Set consistent timezone for all tests
  process.env.TZ = 'UTC';

  // Suppress console output in tests (unless debugging)
  if (!process.env.DEBUG_TESTS) {
    global.console = {
      ...console,
      log: () => {},
      info: () => {},
      warn: () => {},
      // Keep error for debugging test failures
      error: console.error,
    };
  }
});

// Clean up after each test
afterEach(() => {
  // Clear any test data cache between tests
  TestDataCache.clear();

  // Clear all mocks
  vi.clearAllMocks();

  // Clear all timers
  vi.clearAllTimers();
});

// Global cleanup
afterAll(() => {
  // Final cache clear
  TestDataCache.clear();

  // Restore console if it was mocked
  if (!process.env.DEBUG_TESTS) {
    global.console = console;
  }
});

// Performance monitoring for slow tests
if (process.env.MONITOR_TEST_PERFORMANCE) {
  let testStartTime: number;

  beforeEach(() => {
    testStartTime = performance.now();
  });

  afterEach((context) => {
    const duration = performance.now() - testStartTime;
    if (duration > 100) { // Log tests slower than 100ms
      console.warn(`Slow test detected: ${context.task.name} (${duration.toFixed(2)}ms)`);
    }
  });
}

// Extend expect matchers for better assertions
expect.extend({
  toBeWithinRange(received: number, floor: number, ceiling: number) {
    const pass = received >= floor && received <= ceiling;
    if (pass) {
      return {
        message: () => `expected ${received} not to be within range ${floor} - ${ceiling}`,
        pass: true,
      };
    } else {
      return {
        message: () => `expected ${received} to be within range ${floor} - ${ceiling}`,
        pass: false,
      };
    }
  },

  toHaveStatusEffect(unit: any, effectType: string) {
    const hasEffect = unit.statusEffects?.some((e: any) => e.type === effectType);
    return {
      message: () =>
        hasEffect
          ? `expected unit not to have status effect ${effectType}`
          : `expected unit to have status effect ${effectType}`,
      pass: hasEffect,
    };
  },

  toBeDeterministic(fn: () => any, seed: number, iterations = 10) {
    const results = [];
    for (let i = 0; i < iterations; i++) {
      results.push(JSON.stringify(fn()));
    }
    const allSame = results.every(r => r === results[0]);
    return {
      message: () =>
        allSame
          ? `expected function not to be deterministic with seed ${seed}`
          : `expected function to be deterministic with seed ${seed}`,
      pass: allSame,
    };
  },
});

// Type augmentation for custom matchers
declare global {
  namespace Vi {
    interface Assertion {
      toBeWithinRange(floor: number, ceiling: number): void;
      toHaveStatusEffect(effectType: string): void;
      toBeDeterministic(seed: number, iterations?: number): void;
    }
    interface AsymmetricMatchersContaining {
      toBeWithinRange(floor: number, ceiling: number): void;
      toHaveStatusEffect(effectType: string): void;
      toBeDeterministic(seed: number, iterations?: number): void;
    }
  }
}