import type { Quest } from '../types/Quest';
import { createObjective } from '../types/Quest';
import { ALL_DJINN } from './djinn';

/**
 * Quest catalog for Vale Chronicles
 * Follows the realistic game flow from the design document
 */

export const QUESTS: Record<string, Quest> = {
  // ========================================
  // ACT 1: THE HOOK
  // ========================================

  tutorial_welcome: {
    id: 'tutorial_welcome',
    title: 'Welcome to Vale Village',
    description: 'Speak with the Elder to learn about the troubles facing the village.',
    status: 'active',
    objectives: [
      createObjective(
        'talk_to_elder',
        'Speak with the Village Elder',
        1,
        'talk_to_npc',
        'elder'
      ),
    ],
    rewards: {
      xp: 0,
      gold: 0,
      items: [],
    },
    unlocksQuestIds: ['quest_clear_forest'],
    isMainQuest: true,
    startsInLocation: 'vale_village',
    completesInLocation: 'vale_village',
    questGiver: 'Elder',
  },

  quest_clear_forest: {
    id: 'quest_clear_forest',
    title: 'Clear the Forest Path',
    description:
      'Monsters have been spotted near the forest path south of Vale Village. Investigate and clear the threat.',
    status: 'locked',
    objectives: [
      createObjective('enter_forest', 'Enter the Forest Path', 1, 'visit_location', 'forest_path'),
      createObjective('defeat_wolves', 'Defeat Wild Wolves', 5, 'defeat_enemy', 'wild_wolf'),
      createObjective(
        'defeat_alpha_wolf',
        'Defeat the Alpha Wolf',
        1,
        'defeat_enemy',
        'alpha_wolf'
      ),
    ],
    rewards: {
      xp: 100,
      gold: 50,
      items: [], // Wolf Pelt would go here if we had item drops
    },
    prerequisiteQuestIds: ['tutorial_welcome'],
    unlocksQuestIds: ['quest_ancient_ruins'],
    isMainQuest: true,
    startsInLocation: 'vale_village',
    completesInLocation: 'vale_village',
    questGiver: 'Elder',
  },

  quest_ancient_ruins: {
    id: 'quest_ancient_ruins',
    title: 'Investigate the Ancient Ruins',
    description:
      'Strange energy readings are coming from the ancient ruins beyond the forest. The Elder has asked you to investigate.',
    status: 'locked',
    objectives: [
      createObjective(
        'enter_ruins',
        'Enter the Ancient Ruins',
        1,
        'visit_location',
        'ancient_ruins'
      ),
      createObjective('explore_ruins', 'Explore the ruins', 3, 'custom'),
      createObjective('defeat_golem_king', 'Defeat the Golem King', 1, 'defeat_enemy', 'golem_king'),
      createObjective('obtain_djinn_flint', 'Obtain the Venus Djinn', 1, 'collect_item', 'flint'),
    ],
    rewards: {
      xp: 200,
      gold: 100,
      items: [],
      djinn: ALL_DJINN.flint,
    },
    prerequisiteQuestIds: ['quest_clear_forest'],
    unlocksQuestIds: ['quest_mysterious_stranger'],
    isMainQuest: true,
    startsInLocation: 'vale_village',
    completesInLocation: 'ancient_ruins',
    questGiver: 'Elder',
  },

  quest_mysterious_stranger: {
    id: 'quest_mysterious_stranger',
    title: 'The Mysterious Stranger',
    description:
      'A mysterious traveler has been seen near the village. Find out what they want.',
    status: 'locked',
    objectives: [
      createObjective(
        'find_stranger',
        'Find the mysterious stranger',
        1,
        'talk_to_npc',
        'mysterious_stranger'
      ),
      createObjective('learn_truth', 'Learn about the ancient threat', 1, 'custom'),
    ],
    rewards: {
      xp: 50,
      gold: 0,
      items: [],
    },
    prerequisiteQuestIds: ['quest_ancient_ruins'],
    isMainQuest: true,
    startsInLocation: 'vale_village',
    completesInLocation: 'vale_village',
    questGiver: 'Elder',
  },

  // ========================================
  // SIDE QUESTS
  // ========================================

  side_buy_equipment: {
    id: 'side_buy_equipment',
    title: 'Gear Up',
    description: 'Visit the shop and purchase better equipment for your journey.',
    status: 'active',
    objectives: [
      createObjective(
        'talk_to_shopkeeper',
        'Talk to the Shopkeeper',
        1,
        'talk_to_npc',
        'shopkeeper'
      ),
      createObjective('buy_equipment', 'Purchase any equipment', 1, 'custom'),
    ],
    rewards: {
      xp: 25,
      gold: 50,
      items: [],
    },
    isMainQuest: false,
    startsInLocation: 'vale_village',
    completesInLocation: 'vale_village',
    questGiver: 'Shopkeeper',
  },

  side_find_treasure: {
    id: 'side_find_treasure',
    title: 'Treasure Hunter',
    description: 'Search the Forest Path for hidden treasure chests.',
    status: 'locked',
    objectives: [
      createObjective('find_chests', 'Open treasure chests', 3, 'collect_item'),
    ],
    rewards: {
      xp: 50,
      gold: 100,
      items: [],
    },
    prerequisiteQuestIds: ['quest_clear_forest'],
    isMainQuest: false,
    startsInLocation: 'forest_path',
    completesInLocation: 'forest_path',
  },

  side_level_up: {
    id: 'side_level_up',
    title: 'Growing Stronger',
    description: 'Train your party by defeating monsters and gaining experience.',
    status: 'active',
    objectives: [
      createObjective('reach_level_3', 'Reach Level 3 with any character', 1, 'custom'),
    ],
    rewards: {
      xp: 0,
      gold: 100,
      items: [],
    },
    isMainQuest: false,
  },
};

/**
 * Get all quests as an array
 */
export function getAllQuests(): Quest[] {
  return Object.values(QUESTS);
}

/**
 * Get active quests only
 */
export function getActiveQuests(quests: Quest[]): Quest[] {
  return quests.filter((q) => q.status === 'active');
}

/**
 * Get main quests only
 */
export function getMainQuests(quests: Quest[]): Quest[] {
  return quests.filter((q) => q.isMainQuest);
}

/**
 * Get side quests only
 */
export function getSideQuests(quests: Quest[]): Quest[] {
  return quests.filter((q) => !q.isMainQuest);
}

/**
 * Find quest by ID
 */
export function getQuestById(questId: string): Quest | undefined {
  return QUESTS[questId];
}
