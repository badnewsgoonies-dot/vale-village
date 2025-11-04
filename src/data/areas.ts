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
  treasures: [
    {
      id: 'village_starter_chest',
      position: { x: 2, y: 2 },
      contents: {
        gold: 100,
      },
      opened: false,
    },
    {
      id: 'village_hidden_chest',
      position: { x: 18, y: 13 },
      contents: {
        gold: 50,
      },
      opened: false,
    },
  ],
  npcs: [
    // === KEY NPCs (Quest Givers & Shops) ===
    {
      id: 'Mayor',
      name: 'Mayor',
      position: { x: 10, y: 5 },
      blocking: true,
      dialogue: {
        default: 'Welcome to Vale Village, traveler. We are a peaceful town... for now.',
        intro: 'Monsters have been spotted near the forest. Can you investigate?',
        quest_forest_active: 'Have you cleared the forest yet?',
        quest_forest_complete: 'Thank you! But there\'s more trouble ahead...',
        quest_ruins_active: 'The ancient ruins hold secrets. Please investigate them.',
        quest_ruins_complete: 'You have saved us all. Vale Village is in your debt.',
      },
      questId: 'quest_clear_forest',
      battleOnInteract: ['earth-golem'],
      battleOnlyOnce: true,
    },
    {
      id: 'Cook',
      name: 'Dora the Shopkeeper',
      position: { x: 15, y: 8 },
      blocking: true,
      dialogue: 'Welcome to my shop! Buy items before you go adventuring.',
      shopType: 'item',
      battleOnInteract: ['slime'],
      battleOnlyOnce: true,
    },
    {
      id: 'Soldier',
      name: 'Brock the Blacksmith',
      position: { x: 5, y: 8 },
      blocking: true,
      dialogue: 'Need equipment? I have the finest weapons and armor!',
      shopType: 'equipment',
      battleOnInteract: ['goblin'],
      battleOnlyOnce: true,
    },
    {
      id: 'Cook2',
      name: 'Martha the Innkeeper',
      position: { x: 10, y: 12 },
      blocking: true,
      dialogue: 'Rest at my inn to restore your health and energy. Only 10 gold!',
      shopType: 'inn',
      battleOnInteract: ['slime'],
      battleOnlyOnce: true,
    },

    // === VILLAGERS (Town Atmosphere) ===
    {
      id: 'Villager-1',
      name: 'Tom the Farmer',
      position: { x: 3, y: 10 },
      blocking: true,
      dialogue: {
        default: 'Want to test your skills? I\'ll show you some farming strength!',
        quest_forest_active: 'Those monsters appeared after that earthquake... Be careful out there!',
        quest_forest_complete: 'The forest is safe again. Thank you, brave warrior!',
      },
      battleOnInteract: ['wild-wolf'],
      battleOnlyOnce: true,
    },
    {
      id: 'Villager-2',
      name: 'Young Sarah',
      position: { x: 17, y: 6 },
      blocking: true,
      dialogue: {
        default: 'I\'ve been practicing! Let me show you my Psynergy!',
        quest_ruins_complete: 'Wow! You defeated the Golem King! You\'re amazing!',
      },
      battleOnInteract: ['slime', 'slime'],
      battleOnlyOnce: true,
    },
    {
      id: 'Villager-3',
      name: 'Old Martha',
      position: { x: 7, y: 3 },
      blocking: true,
      dialogue: 'Back in my day, we fought REAL monsters! Let me teach you a lesson!',
      battleOnInteract: ['goblin', 'goblin'],
      battleOnlyOnce: true,
    },
    {
      id: 'Villager-4',
      name: 'Farmer Jack',
      position: { x: 12, y: 3 },
      blocking: true,
      dialogue: 'My scarecrows came to life! Help me fight them off!',
      battleOnInteract: ['wind-wisp', 'wild-wolf'],
      battleOnlyOnce: true,
    },
    {
      id: 'Villager-5',
      name: 'Young Tim',
      position: { x: 4, y: 6 },
      blocking: false,
      dialogue: 'I caught some wild creatures! Wanna battle?',
      battleOnInteract: ['slime', 'slime', 'slime'],
      battleOnlyOnce: true,
    },
    {
      id: 'Villager-6',
      name: 'Merchant',
      position: { x: 16, y: 4 },
      blocking: true,
      dialogue: 'Bandits stole my goods! These wolves are trained to guard me!',
      battleOnInteract: ['wild-wolf', 'wild-wolf'],
      battleOnlyOnce: true,
    },
    {
      id: 'Villager-7',
      name: 'Apprentice',
      position: { x: 6, y: 9 },
      blocking: false,
      dialogue: 'I forged these metal golems for practice! Fight them!',
      battleOnInteract: ['earth-golem'],
      battleOnlyOnce: true,
    },
    {
      id: 'Villager-8',
      name: 'Town Guard',
      position: { x: 9, y: 1 },
      blocking: true,
      dialogue: 'Show me your combat skills! Every adventurer must pass my test!',
      battleOnInteract: ['goblin', 'wild-wolf', 'goblin'],
      battleOnlyOnce: true,
    },
    {
      id: 'Villager-9',
      name: 'Fisherman Pete',
      position: { x: 1, y: 7 },
      blocking: true,
      dialogue: 'The wind spirits answer my call! Can you handle them?',
      battleOnInteract: ['wind-wisp', 'wind-wisp'],
      battleOnlyOnce: true,
    },
    {
      id: 'Villager-10',
      name: 'Herbalist',
      position: { x: 18, y: 10 },
      blocking: true,
      dialogue: 'These healing herbs attracted nature spirits! Battle them!',
      battleOnInteract: ['fire-sprite', 'slime'],
      battleOnlyOnce: true,
    },

    // === CHILDREN (Playing around town) ===
    {
      id: 'Villager-11',
      name: 'Billy',
      position: { x: 8, y: 11 },
      blocking: false,
      dialogue: 'I found some cute slimes! Let\'s battle with them!',
      battleOnInteract: ['slime'],
      battleOnlyOnce: true,
    },
    {
      id: 'Villager-12',
      name: 'Lucy',
      position: { x: 13, y: 11 },
      blocking: false,
      dialogue: 'My pet goblins escaped! Can you catch them?',
      battleOnInteract: ['goblin', 'goblin'],
      battleOnlyOnce: true,
    },
    {
      id: 'Villager-13',
      name: 'Tommy',
      position: { x: 14, y: 3 },
      blocking: false,
      dialogue: 'That shiny rock was actually a fire sprite! Help!',
      battleOnInteract: ['fire-sprite'],
      battleOnlyOnce: true,
    },

    // === SCHOLARS & MYSTICS ===
    {
      id: 'Scholar-1',
      name: 'Scholar Elric',
      position: { x: 2, y: 5 },
      blocking: true,
      dialogue: 'Let me test your knowledge of elemental combat! Face my summons!',
      battleOnInteract: ['fire-sprite', 'wind-wisp'],
      battleOnlyOnce: true,
    },
    {
      id: 'Scholar-2',
      name: 'Sage Aldric',
      position: { x: 18, y: 2 },
      blocking: true,
      dialogue: {
        default: 'The four elements challenge you! Prove your worth!',
        quest_ruins_active: 'The ancient ruins are protected by elemental guardians. Use their weaknesses!',
      },
      battleOnInteract: ['fire-sprite', 'earth-golem', 'wind-wisp'],
      battleOnlyOnce: true,
    },

    // === MERCHANTS & TRAVELERS ===
    {
      id: 'Villager-14',
      name: 'Traveling Merchant',
      position: { x: 11, y: 9 },
      blocking: true,
      dialogue: 'Road bandits trained these beasts! Help me fight them off!',
      battleOnInteract: ['goblin', 'wild-wolf', 'wild-wolf'],
      battleOnlyOnce: true,
    },
    {
      id: 'Villager-15',
      name: 'Bard',
      position: { x: 13, y: 7 },
      blocking: false,
      dialogue: 'My music attracts spirits! Let\'s see if you can handle them!',
      battleOnInteract: ['wind-wisp', 'fire-sprite'],
      battleOnlyOnce: true,
    },

    // === ANIMALS & AMBIANCE ===
    {
      id: 'Crab-1',
      name: 'Giant Crab',
      position: { x: 1, y: 13 },
      blocking: false,
      dialogue: '*SNAP SNAP* (It attacks!)',
      battleOnInteract: ['slime', 'wild-wolf'],
      battleOnlyOnce: true,
    },
    {
      id: 'Crab-2',
      name: 'Angry Crab',
      position: { x: 2, y: 14 },
      blocking: false,
      dialogue: '*aggressive clicking*',
      battleOnInteract: ['slime'],
      battleOnlyOnce: true,
    },
    {
      id: 'seagull',
      name: 'Possessed Seagull',
      position: { x: 19, y: 1 },
      blocking: false,
      dialogue: '*demonic squawk* (Dark energy radiates from it!)',
      battleOnInteract: ['wind-wisp', 'wind-wisp', 'wind-wisp'],
      battleOnlyOnce: true,
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
    { weight: 50, enemyIds: ['wild-wolf'] },
    { weight: 30, enemyIds: ['goblin', 'goblin'] },
    { weight: 20, enemyIds: ['slime', 'wild-wolf'] },
  ],
  bosses: [
    {
      id: 'alpha_wolf_boss',
      position: { x: 10, y: 28 },
      enemyIds: ['wild-wolf', 'wild-wolf', 'wild-wolf'], // 3 wolves for a tougher fight
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
    {
      id: 'forest_chest_4',
      position: { x: 3, y: 8 },
      contents: {
        gold: 15,
      },
      opened: false,
    },
    {
      id: 'forest_chest_5',
      position: { x: 17, y: 12 },
      contents: {
        gold: 25,
      },
      opened: false,
    },
    {
      id: 'forest_chest_6',
      position: { x: 12, y: 22 },
      contents: {
        gold: 40,
      },
      opened: false,
    },
  ],
  npcs: [
    {
      id: 'Villager-16',
      name: 'Lost Traveler',
      position: { x: 7, y: 5 },
      blocking: true,
      dialogue: {
        default: 'Monsters are chasing me! Please help fight them off!',
        quest_forest_complete: 'Thank you for clearing the monsters! I can finally go home!',
      },
      battleOnInteract: ['wild-wolf', 'goblin'],
      battleOnlyOnce: true,
    },
    {
      id: 'Villager-17',
      name: 'Injured Hunter',
      position: { x: 14, y: 15 },
      blocking: true,
      dialogue: 'The wolves that attacked me are still nearby! Finish them!',
      battleOnInteract: ['wild-wolf', 'wild-wolf', 'wild-wolf'],
      battleOnlyOnce: true,
    },
    {
      id: 'Cursed_Tree',
      name: 'Cursed Tree',
      position: { x: 10, y: 20 },
      blocking: false,
      dialogue: 'The tree pulses with dark energy... it spawns monsters!',
      battleOnInteract: ['goblin', 'slime', 'goblin', 'slime'],
      battleOnlyOnce: true,
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
    { weight: 35, enemyIds: ['wild-wolf', 'goblin'] },
    { weight: 25, enemyIds: ['slime', 'slime', 'goblin'] },
  ],
  bosses: [
    {
      id: 'golem_king_boss',
      position: { x: 12, y: 32 },
      enemyIds: ['goblin', 'wild-wolf', 'goblin'], // Multi-enemy boss fight
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
    {
      id: 'ruins_chest_4',
      position: { x: 5, y: 8 },
      contents: {
        gold: 60,
      },
      opened: false,
    },
    {
      id: 'ruins_chest_5',
      position: { x: 20, y: 15 },
      contents: {
        gold: 80,
      },
      opened: false,
    },
    {
      id: 'ruins_chest_6',
      position: { x: 10, y: 18 },
      contents: {
        gold: 120,
      },
      opened: false,
    },
    {
      id: 'ruins_chest_7',
      position: { x: 15, y: 25 },
      contents: {
        gold: 200,
      },
      opened: false,
    },
    {
      id: 'ruins_hidden_chest',
      position: { x: 22, y: 30 },
      contents: {
        gold: 300,
      },
      opened: false,
    },
  ],
  npcs: [
    {
      id: 'Thief',
      name: 'Mysterious Stranger',
      position: { x: 12, y: 10 },
      blocking: true,
      dialogue: {
        default: 'You must prove yourself worthy! Face my shadow guardians!',
        quest_ruins_complete: 'You have proven yourself worthy. The power of the Djinn is yours.',
      },
      battleOnInteract: ['earth-golem', 'fire-sprite', 'wind-wisp'],
      battleOnlyOnce: true,
    },
    {
      id: 'Monk_sitting',
      name: 'Ancient Monk',
      position: { x: 7, y: 22 },
      blocking: true,
      dialogue: 'Test your enlightenment against these ancient spirits!',
      battleOnInteract: ['storm-lord'],
      battleOnlyOnce: true,
    },
    {
      id: 'tiedup_villager',
      name: 'Captured Explorer',
      position: { x: 18, y: 12 },
      blocking: false,
      dialogue: {
        default: 'The monsters that captured me are coming back! Fight them!',
        quest_ruins_complete: 'You saved me! I can finally escape this cursed place!',
      },
      battleOnInteract: ['goblin', 'goblin', 'wild-wolf', 'wild-wolf'],
      battleOnlyOnce: true,
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
