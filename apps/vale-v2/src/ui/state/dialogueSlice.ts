import type { StateCreator } from 'zustand';
import type { DialogueTree, DialogueState } from '@/core/models/dialogue';
import {
  startDialogue,
  selectChoice,
  advanceDialogue,
  isDialogueComplete,
} from '@/core/services/DialogueService';
import type { GameFlowSlice } from './gameFlowSlice';
import type { StorySlice } from './storySlice';

export interface DialogueSlice {
  currentDialogueTree: DialogueTree | null;
  currentDialogueState: DialogueState | null;
  startDialogueTree: (tree: DialogueTree) => void;
  makeChoice: (choiceId: string) => void;
  advanceCurrentDialogue: () => void;
  endDialogue: () => void;
}

export const createDialogueSlice: StateCreator<DialogueSlice & GameFlowSlice & StorySlice> = (set, get) => ({
  currentDialogueTree: null,
  currentDialogueState: null,

  startDialogueTree: (tree) => {
    const state = startDialogue(tree);
    set({
      currentDialogueTree: tree,
      currentDialogueState: state,
      mode: 'dialogue',
    });
  },

  makeChoice: (choiceId) => {
    const { currentDialogueTree, currentDialogueState } = get();
    if (!currentDialogueTree || !currentDialogueState) return;

    const newState = selectChoice(currentDialogueTree, currentDialogueState, choiceId);
    set({ currentDialogueState: newState });

    if (newState.variables && Object.keys(newState.variables).length > 0) {
      processDialogueEffects(newState.variables, get);
    }

    if (isDialogueComplete(currentDialogueTree, newState)) {
      get().endDialogue();
    }
  },

  advanceCurrentDialogue: () => {
    const { currentDialogueTree, currentDialogueState } = get();
    if (!currentDialogueTree || !currentDialogueState) return;

    const newState = advanceDialogue(currentDialogueTree, currentDialogueState);
    if (newState) {
      set({ currentDialogueState: newState });
    } else {
      get().endDialogue();
    }
  },

  endDialogue: () => {
    set({
      currentDialogueTree: null,
      currentDialogueState: null,
      mode: 'overworld',
    });
  },
});

/**
 * Process dialogue effects (quest flags, shop openings, battle triggers)
 * Called after a choice updates dialogue state
 */
function processDialogueEffects(effects: Record<string, unknown>, get: () => any) {
  const store = get();
  const canSetStoryFlag = typeof store.setStoryFlag === 'function';

  if (effects.questAccepted === true) {
    if (canSetStoryFlag) {
      store.setStoryFlag('questAccepted', true);
      console.log('Quest accepted!');
    } else {
      console.warn('setStoryFlag not available - quest flag not saved');
    }
  }

  if (effects.openShop === true) {
    console.log('Shop opened via dialogue (UI not implemented yet)');
  }

  if (typeof effects.startBattle === 'string') {
    const encounterId = effects.startBattle;
    console.log(`Starting battle from dialogue: ${encounterId}`);
    store.handleTrigger({
      id: 'dialogue-battle',
      type: 'battle',
      position: { x: 0, y: 0 },
      data: { encounterId },
    });
  }

  Object.entries(effects).forEach(([key, value]) => {
    if (
      typeof value === 'boolean' &&
      key !== 'questAccepted' &&
      key !== 'openShop' &&
      canSetStoryFlag
    ) {
      store.setStoryFlag(key, value);
      console.log(`Story flag set via dialogue: ${key} = ${value}`);
    }
  });
}
