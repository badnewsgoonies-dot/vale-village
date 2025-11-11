/**
 * Story Service Tests
 */

import { describe, test, expect } from 'vitest';
import { createStoryState, setFlag, hasFlag } from '../../../src/core/models/story';
import { canAccess, advanceChapter, processEncounterCompletion } from '../../../src/core/services/StoryService';

describe('StoryService', () => {
  test('should check flag access correctly', () => {
    let state = createStoryState(1);
    state = setFlag(state, 'test-flag', true);
    
    expect(canAccess(state, 'test-flag')).toBe(true);
    expect(canAccess(state, 'missing-flag')).toBe(false);
  });

  test('should check multiple flag requirements', () => {
    let state = createStoryState(1);
    state = setFlag(state, 'flag1', true);
    state = setFlag(state, 'flag2', true);
    
    expect(canAccess(state, ['flag1', 'flag2'])).toBe(true);
    expect(canAccess(state, ['flag1', 'flag3'])).toBe(false);
  });

  test('should advance from Chapter 1 to Chapter 2', () => {
    const state = createStoryState(1);
    const result = advanceChapter(state, 'boss:ch1');
    
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.chapter).toBe(2);
      expect(hasFlag(result.value, 'boss:ch1')).toBe(true);
    }
  });

  test('should not advance if requirement not met', () => {
    const state = createStoryState(1);
    const result = advanceChapter(state, 'boss:ch2');
    
    expect(result.ok).toBe(false);
  });

  test('should process encounter completion and set flags', () => {
    let state = createStoryState(1);
    state = processEncounterCompletion(state, 'c1_boss');
    
    expect(hasFlag(state, 'boss:ch1')).toBe(true);
  });

  test('should track normal encounters', () => {
    let state = createStoryState(1);
    state = processEncounterCompletion(state, 'c1_normal_1');
    
    expect(hasFlag(state, 'encounter:ch1:1')).toBe(true);
  });
});

