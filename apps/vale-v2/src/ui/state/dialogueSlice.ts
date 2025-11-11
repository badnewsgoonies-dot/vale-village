import type { StateCreator } from 'zustand';
import type { DialogueSlice as DialogueSliceModel, DialogueTree, DialogueState } from '@/core/models/dialogue';
import {
  startDialogue,
  selectChoice,
  advanceDialogue,
  isDialogueComplete,
} from '@/core/services/DialogueService';
import type { GameFlowSlice } from './gameFlowSlice';

export interface DialogueSlice {
  currentDialogueTree: DialogueTree | null;
  currentDialogueState: DialogueState | null;
  startDialogueTree: (tree: DialogueTree) => void;
  makeChoice: (choiceId: string) => void;
  advanceCurrentDialogue: () => void;
  endDialogue: () => void;
}

export const createDialogueSlice: StateCreator<DialogueSlice & GameFlowSlice> = (set, get) => ({
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
