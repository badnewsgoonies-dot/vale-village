import type {
  DialogueCondition as SchemaDialogueCondition,
  DialogueChoice as SchemaDialogueChoice,
  DialogueTree as SchemaDialogueTree,
  DialogueNode as SchemaDialogueNode,
} from '@/data/schemas/DialogueSchema';

export type DialogueCondition = SchemaDialogueCondition;
export type DialogueChoice = SchemaDialogueChoice;
export type DialogueNode = SchemaDialogueNode;
export type DialogueTree = SchemaDialogueTree;

export interface DialogueState {
  treeId: string;
  currentNodeId: string;
  history: string[];
  variables: Record<string, unknown>;
}
