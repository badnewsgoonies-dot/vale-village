import type { Area } from '@/types/Area';

/**
 * All areas/locations in Vale Chronicles
 * Based on the realistic game flow design document
 */

export const VALE_VILLAGE: Area = {
  id: 'vale_village',
  name: 'Vale Village',
  type: 'town',
  width: 20,
  height: 15,
  hasRandomEncounters: false,
  bosses: [],
  treasures: [],
  npcs: [
    {
      id: 'elder',
      name: 'Elder',
      position: { x: 10, y: 5 },
      blocking: true,
      dialogue: {
        default: 'Welcome to Vale Village, traveler.',
        intro: 'Monsters have been spotted near the forest. Can you investigate?',
        quest_forest_active: 'Have you cleared the forest yet?',
        quest_forest_complete: 'Thank you! But there\'s more trouble ahead...',
        quest_ruins_active: 'The ancient ruins hold secrets. Please investigate them.',
        quest_ruins_complete: 'You have saved us all. Vale Village is in your debt.',
      },
      questId: 'quest_clear_forest',
    },
    {
      id: 'shopkeeper',
      name: 'Dora',
      position: { x: 15, y: 8 },
      blocking: true,
      dialogue: 'Welcome to my shop! Buy items before you go adventuring.',
      shopType: 'item',
    },
    {
      id: 'blacksmith',
      name: 'Brock',
      position: { x: 5, y: 8 },
      blocking: true,
      dialogue: 'Need equipment? I have the finest weapons and armor!',
      shopType: 'equipment',
    },
    {
      id: 'innkeeper',
      name: 'Martha',
      position: { x: 10, y: 12 },
      blocking: true,
      dialogue: 'Rest at my inn to restore your health and energy.',
      shopType: 'inn',
    },
    {
      id: 'villager_1',
      name: 'Villager',
      position: { x: 3, y: 10 },
      blocking: true,
      dialogue: {
        default: 'Beautiful day, isn\'t it?',
        quest_forest_active:
          'Those monsters appeared after that earthquake... Be careful out there!',
        quest_forest_complete: 'The forest is safe again. Thank you, brave warrior!',
      },
    },
    {
      id: 'villager_2',
      name: 'Child',
      position: { x: 17, y: 6 },
      blocking: true,
      dialogue: {
        default: 'I want to be an adventurer like you when I grow up!',
        quest_ruins_complete: 'Wow! You defeated the Golem King! You\'re amazing!',
      },
    },
  ],
  exits: [
    {
      id: 'to_forest',
      position: { x: 9, y: 14 },
      width: 2,
      height: 1,
      targetArea: 'forest_path',
      targetPosition: { x: 10, y: 2 },
    },
  ],
  backgroundColor: '#4a7c4e',
};

export const FOREST_PATH: Area = {
  id: 'forest_path',
  name: 'Forest Path',
  type: 'dungeon',
  width: 20,
  height: 30,
  hasRandomEncounters: true,
  encounterRate: 15, // Battle every ~15 steps
  enemyPools: [
    { weight: 50, enemyIds: ['wild_wolf'] },
    { weight: 30, enemyIds: ['goblin', 'goblin'] },
    { weight: 20, enemyIds: ['slime', 'wild_wolf'] },
  ],
  bosses: [
    {
      id: 'alpha_wolf_boss',
      position: { x: 10, y: 28 },
      enemyIds: ['wild_wolf', 'wild_wolf', 'wild_wolf'], // 3 wolves for a tougher fight
      dialogue: {
        before: 'A pack of fierce wolves blocks your path! Their alpha leader growls menacingly...',
        after: 'The wolves whimper and flee into the forest...',
      },
      defeated: false,
      questId: 'quest_clear_forest',
    },
  ],
  treasures: [
    {
      id: 'forest_chest_1',
      position: { x: 5, y: 10 },
      contents: {
        items: [
          // Healing Herbs would go here
        ],
        gold: 20,
      },
      opened: false,
    },
    {
      id: 'forest_chest_2',
      position: { x: 15, y: 18 },
      contents: {
        gold: 50,
      },
      opened: false,
    },
    {
      id: 'forest_chest_3',
      position: { x: 8, y: 25 },
      contents: {
        equipment: [
          // Bronze Helm would go here
        ],
        gold: 30,
      },
      opened: false,
    },
  ],
  npcs: [
    {
      id: 'lost_traveler',
      name: 'Lost Traveler',
      position: { x: 10, y: 15 },
      blocking: true,
      dialogue: {
        default: 'I got lost in these woods... Can you help me find my way out?',
        quest_forest_complete: 'Thank you for clearing the path! I can finally go home.',
      },
    },
  ],
  exits: [
    {
      id: 'back_to_village',
      position: { x: 9, y: 1 },
      width: 2,
      height: 1,
      targetArea: 'vale_village',
      targetPosition: { x: 10, y: 13 },
    },
    {
      id: 'to_ruins',
      position: { x: 9, y: 29 },
      width: 2,
      height: 1,
      targetArea: 'ancient_ruins',
      targetPosition: { x: 10, y: 2 },
      requiredFlag: 'quest_forest_complete', // Can only access after clearing forest
    },
  ],
  backgroundColor: '#2d5016',
};

export const ANCIENT_RUINS: Area = {
  id: 'ancient_ruins',
  name: 'Ancient Ruins',
  type: 'dungeon',
  width: 25,
  height: 35,
  hasRandomEncounters: true,
  encounterRate: 12, // More frequent encounters
  enemyPools: [
    { weight: 40, enemyIds: ['goblin', 'goblin'] },
    { weight: 35, enemyIds: ['wild_wolf', 'goblin'] },
    { weight: 25, enemyIds: ['slime', 'slime', 'goblin'] },
  ],
  bosses: [
    {
      id: 'golem_king_boss',
      position: { x: 12, y: 32 },
      enemyIds: ['goblin', 'wild_wolf', 'goblin'], // Multi-enemy boss fight
      dialogue: {
        before:
          'The ancient Golem King awakens! Stone begins to crumble as it rises to face you...',
        after:
          'The Golem King crumbles to dust. In the rubble, you notice a glowing stone... It\'s a Djinn!',
      },
      defeated: false,
      questId: 'quest_ancient_ruins',
    },
  ],
  treasures: [
    {
      id: 'ruins_chest_1',
      position: { x: 8, y: 12 },
      contents: {
        gold: 100,
      },
      opened: false,
    },
    {
      id: 'ruins_chest_2',
      position: { x: 18, y: 20 },
      contents: {
        equipment: [
          // Silver equipment would go here
        ],
        gold: 75,
      },
      opened: false,
    },
    {
      id: 'ruins_chest_3',
      position: { x: 12, y: 28 },
      contents: {
        items: [
          // Rare items
        ],
        gold: 150,
      },
      opened: false,
    },
  ],
  npcs: [
    {
      id: 'mysterious_stranger',
      name: '???',
      position: { x: 12, y: 10 },
      blocking: true,
      dialogue: {
        default:
          'So you\'ve made it this far... Impressive. But the real challenge lies ahead.',
        quest_ruins_complete:
          'You have proven yourself worthy. The power of the Djinn is yours.',
      },
      questId: 'quest_mysterious_stranger',
    },
  ],
  exits: [
    {
      id: 'back_to_forest',
      position: { x: 11, y: 1 },
      width: 3,
      height: 1,
      targetArea: 'forest_path',
      targetPosition: { x: 10, y: 28 },
    },
  ],
  backgroundColor: '#3d3d3d',
};

/**
 * All areas indexed by ID
 */
export const ALL_AREAS: Record<string, Area> = {
  vale_village: VALE_VILLAGE,
  forest_path: FOREST_PATH,
  ancient_ruins: ANCIENT_RUINS,
};

/**
 * Get area by ID
 */
export function getAreaById(areaId: string): Area | undefined {
  return ALL_AREAS[areaId];
}

/**
 * Get starting area
 */
export function getStartingArea(): Area {
  return VALE_VILLAGE;
}
