/**
 * Story Service Tests
 * Tests for story progression and unit recruitment
 */

import { describe, it, expect } from 'vitest';
import { processStoryFlagForUnit } from '../../../src/core/services/StoryService';
import { createStoryState } from '../../../src/core/models/story';

describe('StoryService - Unit Recruitment', () => {
  describe('processStoryFlagForUnit', () => {
    it('should recruit Mystic when house-02 flag is set', () => {
      const story = createStoryState(1);
      const result = processStoryFlagForUnit(story, 'house-02', true, 1);

      expect(result.recruitedUnit).toBeDefined();
      expect(result.recruitedUnit?.id).toBe('mystic');
      expect(result.recruitedUnit?.name).toBe('Mystic');
      expect(result.recruitedUnit?.element).toBe('Mercury');
      expect(result.recruitedUnit?.level).toBe(1);
      expect(result.story.flags['house-02']).toBe(true);
    });

    it('should recruit Ranger when house-03 flag is set', () => {
      const story = createStoryState(1);
      const result = processStoryFlagForUnit(story, 'house-03', true, 1);

      expect(result.recruitedUnit).toBeDefined();
      expect(result.recruitedUnit?.id).toBe('ranger');
      expect(result.recruitedUnit?.name).toBe('Ranger');
      expect(result.recruitedUnit?.element).toBe('Jupiter');
      expect(result.recruitedUnit?.level).toBe(1);
      expect(result.story.flags['house-03']).toBe(true);
    });

    it('should not recruit unit when flag is set to false', () => {
      const story = createStoryState(1);
      const result = processStoryFlagForUnit(story, 'house-02', false, 1);

      expect(result.recruitedUnit).toBeNull();
      expect(result.story.flags['house-02']).toBe(false);
    });

    it('should not recruit unit for non-recruitment flags', () => {
      const story = createStoryState(1);
      const result = processStoryFlagForUnit(story, 'house-01', true, 1);

      expect(result.recruitedUnit).toBeNull();
      expect(result.story.flags['house-01']).toBe(true);
    });

    it('should create unit at specified level', () => {
      const story = createStoryState(1);
      const result = processStoryFlagForUnit(story, 'house-02', true, 3);

      expect(result.recruitedUnit).toBeDefined();
      expect(result.recruitedUnit?.level).toBe(3);
      // Check that abilities are unlocked based on level
      expect(result.recruitedUnit?.unlockedAbilityIds.length).toBeGreaterThan(0);
    });

    it('should handle numeric flag values (not recruit)', () => {
      const story = createStoryState(1);
      const result = processStoryFlagForUnit(story, 'house-02', 5, 1);

      expect(result.recruitedUnit).toBeNull();
      expect(result.story.flags['house-02']).toBe(5);
    });
  });
});
