import type { StateCreator } from 'zustand';
import type { DialogueTree, DialogueState } from '@/core/models/dialogue';
import {
  startDialogue,
  selectChoice,
  advanceDialogue,
  isDialogueComplete,
} from '@/core/services/DialogueService';
import { processStoryFlagForDjinn } from '@/core/services/StoryService';
import type { GameFlowSlice } from './gameFlowSlice';
import type { StorySlice } from './storySlice';
import type { SaveSlice } from './saveSlice';
import type { TeamSlice } from './teamSlice';

export interface DialogueSlice {
  currentDialogueTree: DialogueTree | null;
  currentDialogueState: DialogueState | null;
  startDialogueTree: (tree: DialogueTree) => void;
  makeChoice: (choiceId: string) => void;
  advanceCurrentDialogue: () => void;
  endDialogue: () => void;
}

export const createDialogueSlice: StateCreator<DialogueSlice & GameFlowSlice & StorySlice & SaveSlice & TeamSlice> = (set, get) =>
  ({
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

    const currentNode = currentDialogueTree.nodes.find(n => n.id === currentDialogueState.currentNodeId);
    if (!currentNode) {
      get().endDialogue();
      return;
    }

    // Check if this is the last node (no nextNodeId and no choices)
    const isLastNode = !currentNode.nextNodeId && (!currentNode.choices || currentNode.choices.length === 0);

    // If last node has effects, process them and end dialogue
    if (isLastNode && currentNode.effects && Object.keys(currentNode.effects).length > 0) {
      processDialogueEffects(currentNode.effects, get);
      // Effects may have changed mode (e.g., to 'team-select'), so end dialogue preserving that mode
      get().endDialogue();
      return;
    }

    // If not last node, advance to next node
    if (currentNode.nextNodeId) {
      const newState = advanceDialogue(currentDialogueTree, currentDialogueState);
      if (newState) {
        set({ currentDialogueState: newState });

        // Check if dialogue is complete after advancing
        if (isDialogueComplete(currentDialogueTree, newState)) {
          get().endDialogue();
        }
      } else {
        // No next node - end dialogue
        get().endDialogue();
      }
    } else {
      // No next node and not last node with effects - end dialogue
      get().endDialogue();
    }
  },

  endDialogue: () => {
    const prevMode = get().mode;
    set({
      currentDialogueTree: null,
      currentDialogueState: null,
      // Race guard: don't overwrite 'battle' or 'team-select' mode (set by effects)
      mode: prevMode === 'battle' || prevMode === 'team-select' ? prevMode : 'overworld',
    });
  },
} as DialogueSlice & GameFlowSlice & StorySlice & SaveSlice & TeamSlice);

/**
 * Process dialogue effects (quest flags, shop openings, battle triggers)
 * Called after a choice updates dialogue state
 */
function processDialogueEffects(
  effects: Record<string, unknown>,
  get: () => DialogueSlice & GameFlowSlice & StorySlice & SaveSlice & TeamSlice
) {
  const store = get();
  const canSetStoryFlag = typeof store.setStoryFlag === 'function';

  if (effects.questAccepted === true) {
    if (canSetStoryFlag) {
      store.setStoryFlag('questAccepted', true);
      console.warn('Quest accepted!');
    } else {
      console.warn('setStoryFlag not available - quest flag not saved');
    }
  }

  if (effects.openShop === true) {
    console.warn('Shop opened via dialogue (UI not implemented yet)');
  }

  if (typeof effects.startBattle === 'string') {
    const encounterId = effects.startBattle;
    console.warn(`Starting battle from dialogue: ${encounterId}`);
    store.handleTrigger({
      id: 'dialogue-battle',
      type: 'battle',
      position: { x: 0, y: 0 },
      data: { encounterId },
    });
  }

  let storyFlagSet = false;
  
  Object.entries(effects).forEach(([key, value]) => {
    if (
      typeof value === 'boolean' &&
      key !== 'questAccepted' &&
      key !== 'openShop' &&
      canSetStoryFlag
    ) {
      // Process story flag (includes Djinn granting)
      // setStoryFlag() will handle both story update and Djinn granting
      // So we just call it once
      store.setStoryFlag(key, value);
      console.warn(`Story flag set via dialogue: ${key} = ${value}`);
      storyFlagSet = true;
    }
  });

  // Auto-save after dialogue that sets story flags
  if (storyFlagSet || effects.questAccepted === true) {
    try {
      const saveSlice = get();
      if (typeof saveSlice.autoSave === 'function') {
        saveSlice.autoSave();
      }
    } catch (error) {
      console.warn('Auto-save failed after dialogue:', error);
    }
  }
}
