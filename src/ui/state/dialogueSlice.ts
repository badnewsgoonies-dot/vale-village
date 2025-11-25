import type { StateCreator } from 'zustand';
import type { DialogueTree, DialogueState, DialogueEffects } from '@/core/models/dialogue';
import {
  startDialogue,
  selectChoice,
  advanceDialogue,
} from '@/core/services/DialogueService';
import type { GameFlowSlice } from './gameFlowSlice';
import type { StorySlice } from './storySlice';
import type { SaveSlice } from './saveSlice';
import type { TeamSlice } from './teamSlice';
import { UNIT_DEFINITIONS } from '@/data/definitions/units';
import { isPreBattleDialogueTree } from '@/data/definitions/preBattleDialogues';
import { createUnit } from '@/core/models/Unit';
import { collectDjinn, equipDjinn } from '@/core/services/DjinnService';

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

    const currentNode = currentDialogueTree.nodes.find((n) => n.id === currentDialogueState.currentNodeId);
    const choice = currentNode?.choices?.find((c) => c.id === choiceId);
    const choiceEffects = choice?.effects;

    const newState = selectChoice(currentDialogueTree, currentDialogueState, choiceId);
    set({ currentDialogueState: newState });

    if (choiceEffects && Object.keys(choiceEffects).length > 0) {
      processDialogueEffects(choiceEffects, get);
    }
  },

  advanceCurrentDialogue: () => {
    const { currentDialogueTree, currentDialogueState } = get();
    if (!currentDialogueTree || !currentDialogueState) return;

    const startingTreeId = currentDialogueTree.id;
    const startingStateTreeId = currentDialogueState.treeId;

    // Get current node so we can process its effects when leaving it
    const currentNode = currentDialogueTree.nodes.find((n) => n.id === currentDialogueState.currentNodeId);

    // If the current node has effects, process them now. This allows
    // mid-dialogue actions (e.g. starting a battle) instead of only
    // firing effects on the final node.
    if (currentNode?.effects && Object.keys(currentNode.effects).length > 0) {
      processDialogueEffects(currentNode.effects, get);

      // If processing effects changed us out of dialogue mode
      // (e.g. into team-select or battle), end the dialogue shell
      // but preserve the new mode.
      const { mode } = get();
      if (mode !== 'dialogue') {
        get().endDialogue();
        return;
      }
    }

    // Re-read dialogue state in case effects started a different dialogue tree.
    const latestState = get().currentDialogueState;
    const latestTree = get().currentDialogueTree;

    if (!latestTree || !latestState) {
      return;
    }

    // If the dialogue tree/state changed (e.g. chaining into another dialogue),
    // don't continue advancing the previous tree.
    if (latestState.treeId !== startingStateTreeId || latestTree.id !== startingTreeId) {
      return;
    }

    const newState = advanceDialogue(latestTree, latestState);

    if (newState) {
      // Advance to the next node
      set({ currentDialogueState: newState });
    } else {
      // No next node - just end the dialogue (effects already processed above)
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
 * Dialogue effect events derived from typed DialogueEffects.
 * These represent high-level game actions that can span slices.
 */
type DialogueEffectEvent =
  | { kind: 'start-battle'; encounterId: string; skipPreBattleDialogue: boolean }
  | { kind: 'recruit-unit'; unitId: string }
  | { kind: 'grant-djinn'; djinnId: string }
  | { kind: 'quest-accepted' }
  | { kind: 'open-shop' }
  | { kind: 'set-story-flag'; key: string; value: boolean }
  | { kind: 'auto-save' };

function mapEffectsToEvents(effects: DialogueEffects, currentDialogueTreeId?: string): DialogueEffectEvent[] {
  const events: DialogueEffectEvent[] = [];

  if (effects.questAccepted === true) {
    events.push({ kind: 'quest-accepted' });
    events.push({ kind: 'set-story-flag', key: 'questAccepted', value: true });
  }

  if (effects.openShop === true) {
    events.push({ kind: 'open-shop' });
  }

  if (typeof effects.startBattle === 'string') {
    const encounterId = effects.startBattle;
    const skipPreBattleDialogue = isPreBattleDialogueTree(currentDialogueTreeId);
    events.push({ kind: 'start-battle', encounterId, skipPreBattleDialogue });
  }

  if (typeof effects.recruitUnit === 'string') {
    events.push({ kind: 'recruit-unit', unitId: effects.recruitUnit });
  }

  if (typeof effects.grantDjinn === 'string') {
    events.push({ kind: 'grant-djinn', djinnId: effects.grantDjinn });
  }

  // Additional boolean keys (excluding reserved ones) are treated as story flags
  let hasStoryFlag = false;
  for (const [key, value] of Object.entries(effects)) {
    if (
      typeof value === 'boolean' &&
      key !== 'questAccepted' &&
      key !== 'openShop'
    ) {
      events.push({ kind: 'set-story-flag', key, value });
      hasStoryFlag = true;
    }
  }

  // Auto-save after any story flag change or quest acceptance
  if (hasStoryFlag || effects.questAccepted === true) {
    events.push({ kind: 'auto-save' });
  }

  return events;
}

function applyDialogueEvents(
  events: DialogueEffectEvent[],
  get: () => DialogueSlice & GameFlowSlice & StorySlice & SaveSlice & TeamSlice
) {
  const store = get();
  const canSetStoryFlag = typeof store.setStoryFlag === 'function';

  for (const event of events) {
    switch (event.kind) {
      case 'quest-accepted': {
        if (canSetStoryFlag) {
          store.setStoryFlag('questAccepted', true);
          console.warn('Quest accepted!');
        } else {
          console.warn('setStoryFlag not available - quest flag not saved');
        }
        break;
      }
      case 'open-shop': {
        const shopId = store.currentShopId || 'vale-armory';
        store.handleTrigger({
          id: 'dialogue-shop',
          type: 'shop',
          position: { x: 0, y: 0 },
          data: { shopId },
        });
        break;
      }
      case 'start-battle': {
        const { encounterId, skipPreBattleDialogue } = event;
        console.warn(`Starting battle from dialogue: ${encounterId}`);
        store.handleTrigger(
          {
            id: 'dialogue-battle',
            type: 'battle',
            position: { x: 0, y: 0 },
            data: { encounterId },
          },
          skipPreBattleDialogue,
        );
        break;
      }
      case 'recruit-unit': {
        const unitId = event.unitId;
        const unitDef = UNIT_DEFINITIONS[unitId];

        if (unitDef && store.team) {
          // Calculate average team level for new recruit
          const avgLevel = Math.max(
            1,
            Math.floor(
              store.team.units.reduce((sum, u) => sum + u.level, 0) / store.team.units.length,
            ),
          );

          const newUnit = createUnit(unitDef, avgLevel, 0);
          store.addUnitToRoster(newUnit);
          if (store.setRecruitmentFlag) {
            store.setRecruitmentFlag(unitId, true);
          }
          console.warn(`🎉 Recruited ${newUnit.name} via dialogue effect!`);
        } else {
          console.error(`Failed to recruit unit: ${unitId} (definition not found or no team)`);
        }
        break;
      }
      case 'grant-djinn': {
        const djinnId = event.djinnId;
        const team = store.team;

        if (team) {
          const collectResult = collectDjinn(team, djinnId);

          if (collectResult.ok) {
            const collectedTeam = collectResult.value;
            const equipResult = equipDjinn(collectedTeam, djinnId);
            const finalTeam = equipResult.ok ? equipResult.value : collectedTeam;

            store.updateTeam(finalTeam);
            console.warn(`🎉 Granted Djinn ${djinnId} via dialogue effect!`);

            if (!equipResult.ok) {
              console.warn(`Failed to auto-equip Djinn ${djinnId}: ${equipResult.error}`);
            }
          } else {
            console.warn(`Failed to grant Djinn ${djinnId}: ${collectResult.error}`);
          }
        } else {
          console.warn(`Cannot grant Djinn ${djinnId}: no team available`);
        }
        break;
      }
      case 'set-story-flag': {
        if (canSetStoryFlag) {
          store.setStoryFlag(event.key, event.value);
          console.warn(`Story flag set via dialogue: ${event.key} = ${event.value}`);
        }
        break;
      }
      case 'auto-save': {
        try {
          const saveSlice = get();
          if (typeof saveSlice.autoSave === 'function') {
            saveSlice.autoSave();
          }
        } catch (error) {
          console.warn('Auto-save failed after dialogue:', error);
        }
        break;
      }
    }
  }
}

/**
 * Process dialogue effects (quest flags, shop openings, battle triggers)
 * Called after a choice updates dialogue state or when advancing past a node
 */
function processDialogueEffects(
  effects: DialogueEffects,
  get: () => DialogueSlice & GameFlowSlice & StorySlice & SaveSlice & TeamSlice,
) {
  const currentDialogueTreeId = get().currentDialogueTree?.id;
  const events = mapEffectsToEvents(effects, currentDialogueTreeId);
  if (events.length === 0) return;
  applyDialogueEvents(events, get);
}
