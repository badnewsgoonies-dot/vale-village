import type {
  DialogueCondition as SchemaDialogueCondition,
  DialogueChoice as SchemaDialogueChoice,
  DialogueTree as SchemaDialogueTree,
  DialogueNode as SchemaDialogueNode,
  DialogueEffects as SchemaDialogueEffects,
} from '@/data/schemas/DialogueSchema';

export type DialogueCondition = SchemaDialogueCondition;
export type DialogueChoice = SchemaDialogueChoice;
export type DialogueNode = SchemaDialogueNode;
export type DialogueTree = SchemaDialogueTree;
export type DialogueEffects = SchemaDialogueEffects;

export interface DialogueState {
  treeId: string;
  currentNodeId: string;
  history: string[];
  // Aggregated effects from choices/nodes, typed via DialogueEffects
  variables: DialogueEffects;
}
