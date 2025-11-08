/**
 * Dialogue System Types
 *
 * Supports:
 * - Sequential dialogue nodes
 * - Branching dialogue choices
 * - Actions (battle triggers, flag setting, item giving)
 * - Conditional dialogue based on story flags
 * - NPC portraits and speaker names
 */

import type { StoryFlags } from '@/context/types';

/**
 * Actions that can be triggered by dialogue
 */
export type DialogueAction =
  | { type: 'START_BATTLE'; enemyUnitIds: string[]; onVictory?: string } // enemyUnitIds from unitDefinitions, onVictory is next dialogue node
  | { type: 'RECRUIT_UNIT'; unitId: string } // Add unit to player's collection
  | { type: 'SET_FLAG'; flag: keyof StoryFlags; value: boolean }
  | { type: 'GIVE_ITEM'; itemId: string; quantity: number }
  | { type: 'GIVE_GOLD'; amount: number }
  | { type: 'GIVE_DJINN'; djinnId: string } // Add Djinn to player's collection
  | { type: 'OPEN_SHOP'; shopType: 'item' | 'equipment' | 'inn' }
  | { type: 'NAVIGATE'; screen: 'OVERWORLD' | 'MAIN_MENU' }
  | { type: 'END_DIALOGUE' }; // Close dialogue and return to previous screen

/**
 * A single dialogue choice presented to the player
 */
export interface DialogueChoice {
  text: string; // What the player says/chooses
  nextNode: string; // ID of the dialogue node to go to
  condition?: (flags: StoryFlags) => boolean; // Optional condition to show this choice
  action?: DialogueAction; // Optional action to perform when selected
}

/**
 * A single dialogue node (one screen of text)
 */
export interface DialogueNode {
  id: string;
  speaker: string; // NPC name
  text: string; // What the NPC says
  portrait?: string; // Optional portrait sprite path

  // Branching options
  choices?: DialogueChoice[]; // If present, player chooses; otherwise auto-advance
  nextNode?: string; // Auto-advance to this node (if no choices)

  // Actions
  action?: DialogueAction; // Action to perform when this node is shown

  // Conditions
  condition?: (flags: StoryFlags) => boolean; // Only show this node if condition is true
}

/**
 * A complete dialogue tree for an NPC
 */
export interface DialogueTree {
  npcId: string;
  startNode: string; // ID of the first dialogue node
  nodes: Record<string, DialogueNode>; // All dialogue nodes by ID
}

/**
 * Dialogue state for the DialogueScreen
 */
export interface DialogueState {
  npcId: string;
  currentNodeId: string;
  dialogueTree: DialogueTree;
  history: string[]; // Stack of previous node IDs for back navigation (if needed)
}
