/**
 * Pre-Battle Dialogue System
 * Maps encounter IDs to pre-battle dialogue trees
 */

import type { DialogueTree } from '@/core/models/dialogue';
import {
  HOUSE_01_DIALOGUE,
  HOUSE_02_DIALOGUE,
  HOUSE_03_DIALOGUE,
  HOUSE_04_DIALOGUE,
  HOUSE_05_DIALOGUE,
} from './liberationDialogues';

/**
 * Map encounter IDs to pre-battle dialogue IDs
 */
export const ENCOUNTER_TO_PRE_BATTLE_DIALOGUE: Record<string, string> = {
  'house-01': 'house-01-liberation',
  'house-02': 'house-02-flint',
  'house-03': 'house-03-ice',
  'house-04': 'house-04-breeze',
  'house-05': 'house-05-escalation',
};

/**
 * Map dialogue IDs to actual dialogue trees
 */
const PRE_BATTLE_DIALOGUE_MAP: Record<string, DialogueTree> = {
  'house-01-liberation': HOUSE_01_DIALOGUE,
  'house-02-flint': HOUSE_02_DIALOGUE,
  'house-03-ice': HOUSE_03_DIALOGUE,
  'house-04-breeze': HOUSE_04_DIALOGUE,
  'house-05-escalation': HOUSE_05_DIALOGUE,
};

const PRE_BATTLE_DIALOGUE_IDS = new Set<string>(Object.values(ENCOUNTER_TO_PRE_BATTLE_DIALOGUE));

/**
 * Get pre-battle dialogue for an encounter ID
 * Returns null if encounter doesn't have a pre-battle dialogue
 */
export function getPreBattleDialogue(encounterId: string): DialogueTree | null {
  const dialogueId = ENCOUNTER_TO_PRE_BATTLE_DIALOGUE[encounterId];
  if (!dialogueId) return null;
  
  return PRE_BATTLE_DIALOGUE_MAP[dialogueId] || null;
}

/**
 * Check if an encounter has a pre-battle dialogue
 */
export function hasPreBattleDialogue(encounterId: string): boolean {
  return encounterId in ENCOUNTER_TO_PRE_BATTLE_DIALOGUE;
}

export function isPreBattleDialogueTree(dialogueId?: string): boolean {
  return Boolean(dialogueId && PRE_BATTLE_DIALOGUE_IDS.has(dialogueId));
}
