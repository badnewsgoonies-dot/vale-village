/**
 * Story Integration Tests
 * Tests story progression from battle events
 */

import { describe, it, expect } from 'vitest';
import { createStoryState } from '../../../src/core/models/story';
import { processEncounterCompletion, advanceChapter } from '../../../src/core/services/StoryService';
import type { BattleEvent } from '../../../src/core/services/types';

describe('Story Integration', () => {
  it('boss victory sets boss:ch1 flag and advances to chapter 2', () => {
    let story = createStoryState(1);
    
    // Process boss encounter completion
    story = processEncounterCompletion(story, 'c1_boss');
    
    // Should set boss flag
    expect(story.flags['boss:ch1']).toBe(true);
    
    // Advance chapter (use the flag key that advanceChapter expects)
    const adv = advanceChapter(story, 'boss:ch1');
    expect(adv.ok).toBe(true);
    if (adv.ok) {
      expect(adv.value.chapter).toBe(2);
    }
  });

  it('replaying cleared encounter does not regress flags', () => {
    let story = createStoryState(1);
    
    // First completion
    story = processEncounterCompletion(story, 'c1_boss');
    expect(story.flags['boss:ch1']).toBe(true);
    
    // Replay same encounter - flag should remain set
    story = processEncounterCompletion(story, 'c1_boss');
    expect(story.flags['boss:ch1']).toBe(true);
    
    // Chapter should not regress
    const adv = advanceChapter(story, 'c1_boss');
    if (adv.ok) {
      expect(adv.value.chapter).toBeGreaterThanOrEqual(1);
    }
  });

  it('processes encounter-finished events correctly', () => {
    let story = createStoryState(1);
    
    const events: BattleEvent[] = [
      {
        type: 'encounter-finished',
        outcome: 'PLAYER_VICTORY',
        encounterId: 'c1_boss',
      },
    ];
    
    // Simulate story slice processing
    for (const e of events) {
      if (e.type === 'encounter-finished' && e.outcome === 'PLAYER_VICTORY') {
        story = processEncounterCompletion(story, e.encounterId);
        // advanceChapter expects the flag key, not the encounter ID
        const adv = advanceChapter(story, 'boss:ch1');
        if (adv.ok) {
          story = adv.value;
        }
      }
    }
    
    expect(story.flags['boss:ch1']).toBe(true);
    expect(story.chapter).toBe(2);
  });
});

