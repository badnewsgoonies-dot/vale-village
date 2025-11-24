/**
 * Shared Test Mocks and Utilities
 * Centralized mocks to reduce duplication across test files
 */

import { vi, beforeEach, afterEach, afterAll } from 'vitest';

/**
 * Create a mocked localStorage for testing
 * Automatically tracks all operations
 */
export function createMockLocalStorage() {
  const store = new Map<string, string>();

  const mockLocalStorage = {
    getItem: vi.fn((key: string) => store.get(key) ?? null),
    setItem: vi.fn((key: string, value: string) => {
      store.set(key, value);
    }),
    removeItem: vi.fn((key: string) => {
      store.delete(key);
    }),
    clear: vi.fn(() => {
      store.clear();
    }),
    get length() {
      return store.size;
    },
    key: vi.fn((index: number) => {
      const keys = Array.from(store.keys());
      return keys[index] ?? null;
    }),
    // Test helper methods
    __getStore: () => store,
    __setStore: (data: Record<string, string>) => {
      store.clear();
      Object.entries(data).forEach(([k, v]) => store.set(k, v));
    },
    __reset: () => {
      store.clear();
      mockLocalStorage.getItem.mockClear();
      mockLocalStorage.setItem.mockClear();
      mockLocalStorage.removeItem.mockClear();
      mockLocalStorage.clear.mockClear();
      mockLocalStorage.key.mockClear();
    },
  };

  return mockLocalStorage;
}

/**
 * Setup localStorage mock for a test suite
 * Automatically restores original after tests
 */
export function setupLocalStorageMock() {
  const originalLocalStorage = global.localStorage;
  const mockLocalStorage = createMockLocalStorage();

  beforeEach(() => {
    Object.defineProperty(global, 'localStorage', {
      value: mockLocalStorage,
      writable: true,
      configurable: true,
    });
  });

  afterEach(() => {
    mockLocalStorage.__reset();
  });

  afterAll(() => {
    Object.defineProperty(global, 'localStorage', {
      value: originalLocalStorage,
      writable: true,
      configurable: true,
    });
  });

  return mockLocalStorage;
}

/**
 * Create a mock for console methods
 * Useful for testing error handling and logging
 */
export function createConsoleMock() {
  const mocks = {
    log: vi.spyOn(console, 'log').mockImplementation(() => {}),
    warn: vi.spyOn(console, 'warn').mockImplementation(() => {}),
    error: vi.spyOn(console, 'error').mockImplementation(() => {}),
    info: vi.spyOn(console, 'info').mockImplementation(() => {}),
    debug: vi.spyOn(console, 'debug').mockImplementation(() => {}),
  };

  const restore = () => {
    Object.values(mocks).forEach(mock => mock.mockRestore());
  };

  const clear = () => {
    Object.values(mocks).forEach(mock => mock.mockClear());
  };

  return { mocks, restore, clear };
}

/**
 * Mock timer utilities for testing time-based operations
 */
export function setupTimerMocks() {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.clearAllTimers();
    vi.useRealTimers();
  });

  return {
    advance: (ms: number) => vi.advanceTimersByTime(ms),
    runAll: () => vi.runAllTimers(),
    runPending: () => vi.runOnlyPendingTimers(),
    getTimerCount: () => vi.getTimerCount(),
  };
}

/**
 * Create a mock RNG that always returns predictable values
 * Useful for testing random-dependent logic
 */
export function createPredictableRNG(sequence: number[] = [0.5, 0.2, 0.8, 0.3, 0.7]) {
  let index = 0;

  return {
    random: () => {
      const value = sequence[index % sequence.length];
      index++;
      return value;
    },
    reset: () => {
      index = 0;
    },
    setSequence: (newSequence: number[]) => {
      sequence = newSequence;
      index = 0;
    },
  };
}

/**
 * Mock for async operations with controllable resolution
 */
export function createAsyncMock<T>() {
  let resolver: ((value: T) => void) | null = null;
  let rejecter: ((error: Error) => void) | null = null;

  const promise = new Promise<T>((resolve, reject) => {
    resolver = resolve;
    rejecter = reject;
  });

  return {
    promise,
    resolve: (value: T) => resolver?.(value),
    reject: (error: Error) => rejecter?.(error),
  };
}

/**
 * Performance timer for measuring test execution
 */
export class TestPerformanceTimer {
  private marks = new Map<string, number>();
  private measures: Array<{ name: string; duration: number }> = [];

  mark(name: string) {
    this.marks.set(name, performance.now());
  }

  measure(name: string, startMark: string, endMark?: string) {
    const start = this.marks.get(startMark);
    const end = endMark ? this.marks.get(endMark) : performance.now();

    if (start === undefined || (endMark && end === undefined)) {
      throw new Error(`Mark not found: ${!start ? startMark : endMark}`);
    }

    const duration = (end ?? performance.now()) - start;
    this.measures.push({ name, duration });
    return duration;
  }

  getMeasures() {
    return [...this.measures];
  }

  clear() {
    this.marks.clear();
    this.measures = [];
  }

  report() {
    const total = this.measures.reduce((sum, m) => sum + m.duration, 0);
    return {
      measures: this.measures,
      total,
      average: this.measures.length > 0 ? total / this.measures.length : 0,
    };
  }
}

/**
 * Test data cache to avoid recreating common test objects
 */
export class TestDataCache {
  private static cache = new Map<string, any>();

  static get<T>(key: string, factory: () => T): T {
    if (!this.cache.has(key)) {
      this.cache.set(key, factory());
    }
    return this.cache.get(key) as T;
  }

  static clear(key?: string) {
    if (key) {
      this.cache.delete(key);
    } else {
      this.cache.clear();
    }
  }

  static has(key: string): boolean {
    return this.cache.has(key);
  }
}