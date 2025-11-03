import type { Equipment } from './Equipment';
import type { Djinn } from './Djinn';

export type QuestStatus = 'locked' | 'active' | 'completed' | 'failed';

export interface QuestObjective {
  id: string;
  text: string;
  current: number;
  target: number;
  completed: boolean;
  type: 'defeat_enemy' | 'collect_item' | 'talk_to_npc' | 'visit_location' | 'custom';
  // For tracking specific enemies, items, or NPCs
  targetId?: string;
}

export interface QuestReward {
  xp: number;
  gold: number;
  items: Equipment[];
  djinn?: Djinn;
}

export interface Quest {
  id: string;
  title: string;
  description: string;
  status: QuestStatus;
  objectives: QuestObjective[];
  rewards: QuestReward;
  // Quest chaining
  prerequisiteQuestIds?: string[];
  unlocksQuestIds?: string[];
  // Story integration
  startsInLocation?: string;
  completesInLocation?: string;
  // Display
  isMainQuest: boolean;
  questGiver?: string; // NPC name
}

/**
 * Helper to check if all objectives are completed
 */
export function areAllObjectivesComplete(quest: Quest): boolean {
  return quest.objectives.every((obj) => obj.completed);
}

/**
 * Helper to update objective progress
 */
export function updateObjectiveProgress(
  objective: QuestObjective,
  increment: number = 1
): QuestObjective {
  const newCurrent = Math.min(objective.current + increment, objective.target);
  return {
    ...objective,
    current: newCurrent,
    completed: newCurrent >= objective.target,
  };
}

/**
 * Helper to create a quest objective
 */
export function createObjective(
  id: string,
  text: string,
  target: number,
  type: QuestObjective['type'] = 'custom',
  targetId?: string
): QuestObjective {
  return {
    id,
    text,
    current: 0,
    target,
    completed: false,
    type,
    targetId,
  };
}
