import type {
  DialogueTree,
  DialogueNode,
  DialogueChoice,
  DialogueCondition,
  DialogueState,
} from '../models/dialogue';

export function startDialogue(tree: DialogueTree): DialogueState {
  return {
    treeId: tree.id,
    currentNodeId: tree.startNodeId,
    history: [tree.startNodeId],
    variables: {},
  };
}

export function getCurrentNode(tree: DialogueTree, state: DialogueState): DialogueNode | undefined {
  return tree.nodes.find(node => node.id === state.currentNodeId);
}

type DialogueContext = {
  flags: Record<string, boolean>;
  inventory: { items: string[] };
  gold: number;
  level: number;
};

export function evaluateCondition(condition: DialogueCondition, context: DialogueContext): boolean {
  switch (condition.type) {
    case 'flag':
      return context.flags[condition.key] === condition.value;
    case 'item':
      return context.inventory.items.includes(condition.key);
    case 'gold':
      if (condition.operator === 'greaterThan') return context.gold > (condition.value as number);
      if (condition.operator === 'lessThan') return context.gold < (condition.value as number);
      return context.gold === condition.value;
    case 'level':
      if (condition.operator === 'greaterThan') return context.level > (condition.value as number);
      if (condition.operator === 'lessThan') return context.level < (condition.value as number);
      return context.level === condition.value;
    default:
      return false;
  }
}

export function getAvailableChoices(node: DialogueNode, context: DialogueContext): DialogueChoice[] {
  if (!node.choices) return [];
  return node.choices.filter(choice => {
    if (!choice.condition) return true;
    return evaluateCondition(choice.condition, context);
  });
}

export function selectChoice(tree: DialogueTree, state: DialogueState, choiceId: string): DialogueState {
  const currentNode = getCurrentNode(tree, state);
  if (!currentNode) return state;

  const choice = currentNode.choices?.find(c => c.id === choiceId);
  if (!choice) return state;

  return {
    ...state,
    currentNodeId: choice.nextNodeId,
    history: [...state.history, choice.nextNodeId],
    variables: choice.effects ? { ...state.variables, ...choice.effects } : state.variables,
  };
}

export function advanceDialogue(tree: DialogueTree, state: DialogueState): DialogueState | null {
  const currentNode = getCurrentNode(tree, state);
  if (!currentNode) return null;
  if (currentNode.choices && currentNode.choices.length > 0) return null;
  if (currentNode.nextNodeId) {
    return {
      ...state,
      currentNodeId: currentNode.nextNodeId,
      history: [...state.history, currentNode.nextNodeId],
      // Copy effects from current node to state variables so they get processed
      variables: currentNode.effects ? { ...state.variables, ...currentNode.effects } : state.variables,
    };
  }
  return null;
}

export function isDialogueComplete(tree: DialogueTree, state: DialogueState): boolean {
  const currentNode = getCurrentNode(tree, state);
  if (!currentNode) return true;
  return !currentNode.choices && !currentNode.nextNodeId;
}
