/**
 * Story Flag-Based Djinn Acquisition Tests
 * Tests that story flags correctly grant Djinn
 */

import { describe, test, expect } from 'vitest';
import { createStoryState } from '../../../src/core/models/story';
import { processStoryFlagForDjinn } from '../../../src/core/services/StoryService';
import { mkTeam, mkUnit } from '../../../src/test/factories';
import { STORY_FLAG_TO_DJINN } from '../../../src/data/definitions/storyFlags';

describe('Story Flag-Based Djinn Acquisition', () => {
  test('should grant Flint when house:liberated:02 flag is set', () => {
    const story = createStoryState(1);
    const team = mkTeam([mkUnit()]);

    const result = processStoryFlagForDjinn(story, team, 'house:liberated:02', true);

    expect(result.djinnGranted).toBe('flint');
    expect(result.team.collectedDjinn).toContain('flint');
    expect(result.story.flags['house:liberated:02']).toBe(true);
  });

  test('should grant Granite when boss:ch1 flag is set', () => {
    const story = createStoryState(1);
    const team = mkTeam([mkUnit()]);

    const result = processStoryFlagForDjinn(story, team, 'boss:ch1', true);

    expect(result.djinnGranted).toBe('granite');
    expect(result.team.collectedDjinn).toContain('granite');
    expect(result.story.flags['boss:ch1']).toBe(true);
  });

  test('should grant all 12 Djinn from their respective flags', () => {
    const story = createStoryState(1);
    let team = mkTeam([mkUnit()]);
    const grantedDjinn: string[] = [];

    // Test all flags in STORY_FLAG_TO_DJINN
    for (const [flagId, djinnId] of Object.entries(STORY_FLAG_TO_DJINN)) {
      const result = processStoryFlagForDjinn(story, team, flagId, true);
      
      expect(result.djinnGranted).toBe(djinnId);
      expect(result.team.collectedDjinn).toContain(djinnId);
      grantedDjinn.push(djinnId);
      
      // Update team for next iteration
      team = result.team;
    }

    // Verify all 12 Djinn were granted
    expect(grantedDjinn.length).toBe(12);
    expect(new Set(grantedDjinn).size).toBe(12); // All unique
  });

  test('should not grant Djinn when flag is set to false', () => {
    const story = createStoryState(1);
    const team = mkTeam([mkUnit()]);

    const result = processStoryFlagForDjinn(story, team, 'house:liberated:02', false);

    expect(result.djinnGranted).toBeNull();
    expect(result.team.collectedDjinn).not.toContain('flint');
    expect(result.story.flags['house:liberated:02']).toBe(false);
  });

  test('should not grant Djinn when flag is set to a number', () => {
    const story = createStoryState(1);
    const team = mkTeam([mkUnit()]);

    const result = processStoryFlagForDjinn(story, team, 'house:liberated:02', 5);

    expect(result.djinnGranted).toBeNull();
    expect(result.team.collectedDjinn).not.toContain('flint');
    expect(result.story.flags['house:liberated:02']).toBe(5);
  });

  test('should not grant Djinn for flags not in mapping', () => {
    const story = createStoryState(1);
    const team = mkTeam([mkUnit()]);

    const result = processStoryFlagForDjinn(story, team, 'random:flag', true);

    expect(result.djinnGranted).toBeNull();
    expect(result.team.collectedDjinn.length).toBe(team.collectedDjinn.length);
    expect(result.story.flags['random:flag']).toBe(true);
  });

  test('should prevent duplicate Djinn grants (idempotency)', () => {
    const story = createStoryState(1);
    let team = mkTeam([mkUnit()]);

    // First grant
    const firstResult = processStoryFlagForDjinn(story, team, 'house:liberated:02', true);
    expect(firstResult.djinnGranted).toBe('flint');
    expect(firstResult.team.collectedDjinn).toContain('flint');
    
    team = firstResult.team;

    // Try to grant again (should fail silently)
    const secondResult = processStoryFlagForDjinn(firstResult.story, team, 'house:liberated:02', true);
    expect(secondResult.djinnGranted).toBeNull(); // No duplicate grant
    expect(secondResult.team.collectedDjinn.length).toBe(team.collectedDjinn.length); // Same count
    expect(secondResult.team.collectedDjinn).toContain('flint'); // Still has flint
  });

  test('should update story flag even if Djinn already collected', () => {
    const story = createStoryState(1);
    let team = mkTeam([mkUnit()]);

    // Grant Djinn first time
    const firstResult = processStoryFlagForDjinn(story, team, 'boss:ch1', true);
    team = firstResult.team;

    // Set flag again (already has Djinn)
    const secondResult = processStoryFlagForDjinn(firstResult.story, team, 'boss:ch1', true);
    
    // Story flag should still be updated
    expect(secondResult.story.flags['boss:ch1']).toBe(true);
    // But no duplicate Djinn grant
    expect(secondResult.djinnGranted).toBeNull();
  });

  test('should grant multiple Djinn from different flags', () => {
    const story = createStoryState(1);
    let team = mkTeam([mkUnit()]);

    // Grant Flint
    const flintResult = processStoryFlagForDjinn(story, team, 'house:liberated:02', true);
    expect(flintResult.djinnGranted).toBe('flint');
    team = flintResult.team;

    // Grant Granite
    const graniteResult = processStoryFlagForDjinn(flintResult.story, team, 'boss:ch1', true);
    expect(graniteResult.djinnGranted).toBe('granite');
    team = graniteResult.team;

    // Grant Forge
    const forgeResult = processStoryFlagForDjinn(graniteResult.story, team, 'house:liberated:04', true);
    expect(forgeResult.djinnGranted).toBe('forge');
    team = forgeResult.team;

    // Verify all three are collected
    expect(team.collectedDjinn).toContain('flint');
    expect(team.collectedDjinn).toContain('granite');
    expect(team.collectedDjinn).toContain('forge');
    expect(team.collectedDjinn.length).toBe(3);
  });

  test('should preserve existing collected Djinn when granting new ones', () => {
    const story = createStoryState(1);
    // Start with a team that already has some Djinn
    const baseTeam = mkTeam([mkUnit()]);
    const team = {
      ...baseTeam,
      collectedDjinn: ['flint', 'granite'] as readonly string[],
    };

    const result = processStoryFlagForDjinn(story, team, 'house:liberated:04', true);

    expect(result.djinnGranted).toBe('forge');
    expect(result.team.collectedDjinn).toContain('flint');
    expect(result.team.collectedDjinn).toContain('granite');
    expect(result.team.collectedDjinn).toContain('forge');
    expect(result.team.collectedDjinn.length).toBe(3);
  });

  test('should handle max Djinn limit gracefully', () => {
    const story = createStoryState(1);
    // Create team with 12 Djinn already collected
    const allDjinnIds = Object.values(STORY_FLAG_TO_DJINN);
    const baseTeam = mkTeam([mkUnit()]);
    const team = {
      ...baseTeam,
      collectedDjinn: allDjinnIds as readonly string[],
    };

    // Try to grant one more (should fail)
    const result = processStoryFlagForDjinn(story, team, 'house:liberated:02', true);

    // Should not grant (already at max or already collected)
    expect(result.djinnGranted).toBeNull();
    expect(result.team.collectedDjinn.length).toBe(12);
  });

  test('should be pure function (no side effects)', () => {
    const story = createStoryState(1);
    const team = mkTeam([mkUnit()]);

    // Call function multiple times with same inputs
    const result1 = processStoryFlagForDjinn(story, team, 'house:liberated:02', true);
    const result2 = processStoryFlagForDjinn(story, team, 'house:liberated:02', true);

    // Results should be identical (pure function)
    expect(result1.djinnGranted).toBe(result2.djinnGranted);
    expect(result1.team.collectedDjinn.length).toBe(result2.team.collectedDjinn.length);
    expect(result1.story.flags).toEqual(result2.story.flags);
  });
});

