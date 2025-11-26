import { describe, test, expect } from 'vitest';
import {
  createStoryState,
  setFlag,
  getFlag,
  hasFlag,
  incrementFlag,
} from '../../../src/core/models/story';

describe('Story Model', () => {
  describe('createStoryState', () => {
    test('should create initial story state with default chapter', () => {
      const state = createStoryState();

      expect(state.chapter).toBe(1);
      expect(state.flags).toEqual({});
    });

    test('should create story state with custom chapter', () => {
      const state = createStoryState(5);

      expect(state.chapter).toBe(5);
      expect(state.flags).toEqual({});
    });
  });

  describe('setFlag', () => {
    test('should set boolean flag', () => {
      const state = createStoryState();
      const updated = setFlag(state, 'test-flag', true);

      expect(updated.flags['test-flag']).toBe(true);
    });

    test('should set boolean flag with default value (true)', () => {
      const state = createStoryState();
      const updated = setFlag(state, 'test-flag');

      expect(updated.flags['test-flag']).toBe(true);
    });

    test('should set numeric flag', () => {
      const state = createStoryState();
      const updated = setFlag(state, 'test-counter', 42);

      expect(updated.flags['test-counter']).toBe(42);
    });

    test('should update existing flag', () => {
      const state = createStoryState();
      const withFlag = setFlag(state, 'test-flag', true);
      const updated = setFlag(withFlag, 'test-flag', false);

      expect(updated.flags['test-flag']).toBe(false);
    });

    test('should not mutate original state', () => {
      const state = createStoryState();
      const updated = setFlag(state, 'test-flag', true);

      expect(state.flags).toEqual({}); // Original unchanged
      expect(updated.flags['test-flag']).toBe(true); // New object updated
    });

    test('should preserve existing flags', () => {
      const state = createStoryState();
      const withFlag1 = setFlag(state, 'flag1', true);
      const withFlag2 = setFlag(withFlag1, 'flag2', 'test-value' as never);

      expect(withFlag2.flags['flag1']).toBe(true);
      expect(withFlag2.flags['flag2']).toBe('test-value');
    });

    test('should preserve chapter when setting flag', () => {
      const state = createStoryState(3);
      const updated = setFlag(state, 'test-flag', true);

      expect(updated.chapter).toBe(3);
    });
  });

  describe('getFlag', () => {
    test('should return flag value if exists', () => {
      const state = createStoryState();
      const withFlag = setFlag(state, 'test-flag', true);

      expect(getFlag(withFlag, 'test-flag')).toBe(true);
    });

    test('should return numeric flag value', () => {
      const state = createStoryState();
      const withFlag = setFlag(state, 'test-counter', 42);

      expect(getFlag(withFlag, 'test-counter')).toBe(42);
    });

    test('should return undefined for missing flag', () => {
      const state = createStoryState();

      expect(getFlag(state, 'non-existent')).toBeUndefined();
    });

    test('should return false as valid value', () => {
      const state = createStoryState();
      const withFlag = setFlag(state, 'test-flag', false);

      expect(getFlag(withFlag, 'test-flag')).toBe(false);
    });

    test('should return 0 as valid value', () => {
      const state = createStoryState();
      const withFlag = setFlag(state, 'test-counter', 0);

      expect(getFlag(withFlag, 'test-counter')).toBe(0);
    });
  });

  describe('hasFlag', () => {
    test('should return true for set boolean flag', () => {
      const state = createStoryState();
      const withFlag = setFlag(state, 'test-flag', true);

      expect(hasFlag(withFlag, 'test-flag')).toBe(true);
    });

    test('should return false for unset flag', () => {
      const state = createStoryState();

      expect(hasFlag(state, 'non-existent')).toBe(false);
    });

    test('should return false for false flag', () => {
      const state = createStoryState();
      const withFlag = setFlag(state, 'test-flag', false);

      expect(hasFlag(withFlag, 'test-flag')).toBe(false);
    });

    test('should return true for non-zero numeric flag', () => {
      const state = createStoryState();
      const withFlag = setFlag(state, 'test-counter', 42);

      expect(hasFlag(withFlag, 'test-counter')).toBe(true);
    });

    test('should return false for zero numeric flag', () => {
      const state = createStoryState();
      const withFlag = setFlag(state, 'test-counter', 0);

      expect(hasFlag(withFlag, 'test-counter')).toBe(false);
    });

    test('should return true for negative numeric flag', () => {
      const state = createStoryState();
      const withFlag = setFlag(state, 'test-counter', -5);

      expect(hasFlag(withFlag, 'test-counter')).toBe(true);
    });
  });

  describe('incrementFlag', () => {
    test('should increment existing numeric flag', () => {
      const state = createStoryState();
      const withFlag = setFlag(state, 'test-counter', 10);
      const updated = incrementFlag(withFlag, 'test-counter', 5);

      expect(updated.flags['test-counter']).toBe(15);
    });

    test('should increment by 1 by default', () => {
      const state = createStoryState();
      const withFlag = setFlag(state, 'test-counter', 10);
      const updated = incrementFlag(withFlag, 'test-counter');

      expect(updated.flags['test-counter']).toBe(11);
    });

    test('should initialize missing flag to 0 then increment', () => {
      const state = createStoryState();
      const updated = incrementFlag(state, 'new-counter', 5);

      expect(updated.flags['new-counter']).toBe(5);
    });

    test('should initialize missing flag to 1 with default increment', () => {
      const state = createStoryState();
      const updated = incrementFlag(state, 'new-counter');

      expect(updated.flags['new-counter']).toBe(1);
    });

    test('should handle negative increment (decrement)', () => {
      const state = createStoryState();
      const withFlag = setFlag(state, 'test-counter', 10);
      const updated = incrementFlag(withFlag, 'test-counter', -3);

      expect(updated.flags['test-counter']).toBe(7);
    });

    test('should not mutate original state', () => {
      const state = createStoryState();
      const withFlag = setFlag(state, 'test-counter', 10);
      const updated = incrementFlag(withFlag, 'test-counter', 5);

      expect(withFlag.flags['test-counter']).toBe(10); // Original unchanged
      expect(updated.flags['test-counter']).toBe(15); // New object updated
    });

    test('should treat boolean flag as 0 when incrementing', () => {
      const state = createStoryState();
      const withFlag = setFlag(state, 'test-flag', true);
      const updated = incrementFlag(withFlag, 'test-flag', 5);

      // Boolean true is not a number, so it defaults to 0 + 5 = 5
      expect(updated.flags['test-flag']).toBe(5);
    });

    test('should preserve chapter when incrementing flag', () => {
      const state = createStoryState(3);
      const withFlag = setFlag(state, 'test-counter', 10);
      const updated = incrementFlag(withFlag, 'test-counter', 5);

      expect(updated.chapter).toBe(3);
    });

    test('should preserve other flags when incrementing', () => {
      const state = createStoryState();
      const withFlags = setFlag(setFlag(state, 'flag1', true), 'counter1', 10);
      const updated = incrementFlag(withFlags, 'counter1', 5);

      expect(updated.flags['flag1']).toBe(true);
      expect(updated.flags['counter1']).toBe(15);
    });
  });

  describe('complex scenarios', () => {
    test('should handle multiple flag operations in sequence', () => {
      const state = createStoryState(1);
      const step1 = setFlag(state, 'intro-complete', true);
      const step2 = setFlag(step1, 'battles-won', 0);
      const step3 = incrementFlag(step2, 'battles-won', 1);
      const step4 = incrementFlag(step3, 'battles-won', 1);
      const step5 = setFlag(step4, 'chapter-1-complete', true);

      expect(step5.chapter).toBe(1);
      expect(step5.flags['intro-complete']).toBe(true);
      expect(step5.flags['battles-won']).toBe(2);
      expect(step5.flags['chapter-1-complete']).toBe(true);
    });

    test('should maintain immutability through chain of operations', () => {
      const state = createStoryState(1);
      const step1 = setFlag(state, 'flag1', true);
      const step2 = setFlag(step1, 'flag2', true);
      const step3 = incrementFlag(step2, 'counter', 5);

      // Each step should be independent
      expect(Object.keys(state.flags)).toHaveLength(0);
      expect(Object.keys(step1.flags)).toHaveLength(1);
      expect(Object.keys(step2.flags)).toHaveLength(2);
      expect(Object.keys(step3.flags)).toHaveLength(3);
    });

    test('should handle story progression simulation', () => {
      let story = createStoryState(1);

      // Chapter 1: Intro
      story = setFlag(story, 'intro-seen', true);
      story = incrementFlag(story, 'battles-won');

      expect(hasFlag(story, 'intro-seen')).toBe(true);
      expect(getFlag(story, 'battles-won')).toBe(1);

      // Progress through battles
      story = incrementFlag(story, 'battles-won');
      story = incrementFlag(story, 'battles-won');

      expect(getFlag(story, 'battles-won')).toBe(3);

      // Complete chapter
      story = setFlag(story, 'chapter-1-complete', true);
      story = { ...story, chapter: 2 };

      expect(story.chapter).toBe(2);
      expect(hasFlag(story, 'chapter-1-complete')).toBe(true);
    });
  });
});
