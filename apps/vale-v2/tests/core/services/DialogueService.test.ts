import { describe, it, expect } from 'vitest';
import {
  startDialogue,
  getCurrentNode,
  selectChoice,
  advanceDialogue,
  isDialogueComplete,
  evaluateCondition,
} from '@/core/services/DialogueService';
import { ELDER_DIALOGUE } from '@/data/definitions/dialogues';

describe('DialogueService', () => {
  it('starts dialogue at the start node', () => {
    const state = startDialogue(ELDER_DIALOGUE);
    expect(state.currentNodeId).toBe('greeting');
  });

  it('advances linear dialogues', () => {
    const state = startDialogue(ELDER_DIALOGUE);
    const next = advanceDialogue(ELDER_DIALOGUE, state);
    expect(next?.currentNodeId).toBe('ask-quest');
  });

  it('handles branching choices', () => {
    let state = startDialogue(ELDER_DIALOGUE);
    state = advanceDialogue(ELDER_DIALOGUE, state)!;
    state = selectChoice(ELDER_DIALOGUE, state, 'accept');
    expect(state.currentNodeId).toBe('quest-accepted');
    expect(state.variables.questAccepted).toBe(true);
  });

  it('evaluates flag conditions', () => {
    const condition = { type: 'flag', key: 'tutorial', value: true } as const;
    const context = { flags: { tutorial: true }, inventory: { items: [] }, gold: 0, level: 1 };
    expect(evaluateCondition(condition, context)).toBe(true);
  });

  it('detects completion after choice path', () => {
    let state = startDialogue(ELDER_DIALOGUE);
    state = advanceDialogue(ELDER_DIALOGUE, state)!;
    state = selectChoice(ELDER_DIALOGUE, state, 'accept');
    expect(isDialogueComplete(ELDER_DIALOGUE, state)).toBe(true);
  });
});
