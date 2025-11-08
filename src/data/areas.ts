import type { Area } from '@/types/Area';
import {
  LEATHER_VEST, CLOTH_CAP, IRON_SWORD, LEATHER_BOOTS, IRON_ARMOR, IRON_HELM, STEEL_SWORD, STEEL_HELM, HYPER_BOOTS,
  WOODEN_SWORD, BRONZE_SWORD, SILVER_BLADE, MYTHRIL_BLADE, GAIA_BLADE, SOL_BLADE,
  WOODEN_AXE, BATTLE_AXE, GREAT_AXE, TITANS_AXE,
  MACE, HEAVY_MACE, DEMON_MACE,
  WOODEN_STAFF, MAGIC_ROD, SHAMAN_ROD, CRYSTAL_ROD,
  COTTON_SHIRT, BRONZE_ARMOR, STEEL_ARMOR, SILVER_ARMOR, MYTHRIL_ARMOR, DRAGON_SCALES,
  LEATHER_CAP, BRONZE_HELM, SILVER_CIRCLET, MYTHRIL_CROWN,
} from './equipment';

/**
 * Area Definitions - Vale Chronicles
 * 
 * NOTE: Area IDs use snake_case (e.g., 'vale_village') for technical reasons:
 * - Used as object keys in GameState.areaStates
 * - Used in CSS attribute selectors [data-area="..."]
 * - Strongly typed via AreaId type (see types/Area.ts)
 * 
 * This differs from battle system IDs (equipment, enemies) which use kebab-case.
 * See docs/NAMING_CONVENTIONS.md "Game World Naming Exception" for full explanation.
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
        equipment: [LEATHER_VEST], // Starting armor
      },
      opened: false,
    },
    {
      id: 'village_hidden_chest',
      position: { x: 18, y: 13 },
      contents: {
        gold: 50,
        equipment: [CLOTH_CAP], // Starting helm
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
      dialogue: 'I found some cute critters! Let\'s battle with them!',
      battleOnInteract: ['grub', 'worm'], // NEW: Nature critters
      battleOnlyOnce: true,
    },
    {
      id: 'Villager-12',
      name: 'Lucy',
      position: { x: 13, y: 11 },
      blocking: false,
      dialogue: 'My pet monsters escaped! Can you catch them?',
      battleOnInteract: ['mini-goblin', 'kobold'], // NEW: Small humanoids
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
      battleOnInteract: ['rat', 'spider', 'bat'], // NEW: Critter enemies
      battleOnlyOnce: true,
    },
    {
      id: 'Crab-2',
      name: 'Angry Crab',
      position: { x: 2, y: 14 },
      blocking: false,
      dialogue: '*aggressive clicking*',
      battleOnInteract: ['roach', 'vermin'], // NEW: Pest enemies
      battleOnlyOnce: true,
    },
    {
      id: 'seagull',
      name: 'Possessed Seagull',
      position: { x: 19, y: 1 },
      blocking: false,
      dialogue: '*demonic squawk* (Dark energy radiates from it!)',
      battleOnInteract: ['seabird', 'seafowl', 'bat'], // NEW: Bird enemies
      battleOnlyOnce: true,
    },

    // === RECRUITABLE CHARACTERS (Battle Trainers) ===
    // Venus (Earth) Adepts
    {
      id: 'isaac-trainer',
      name: 'Isaac',
      position: { x: 5, y: 4 },
      blocking: true,
      dialogue: {
        default: 'I am Isaac, Earth Adept. Test your strength against my earth summons!',
        quest_forest_complete: 'You\'ve proven yourself capable. Join me in the Ancient Ruins!',
      },
      battleOnInteract: ['rock-golem', 'stone-golem'], // Level 4-5 earth enemies
      battleOnlyOnce: false, // Can battle multiple times for training
    },
    {
      id: 'felix-trainer',
      name: 'Felix',
      position: { x: 3, y: 12 },
      blocking: true,
      dialogue: 'Felix here. An honor duel awaits those who seek true power!',
      battleOnInteract: ['gargoyle', 'earth-lizard', 'gnome'], // Level 4 earth/stone mix
      battleOnlyOnce: false,
    },

    // Mars (Fire) Adepts
    {
      id: 'garet-trainer',
      name: 'Garet',
      position: { x: 15, y: 4 },
      blocking: true,
      dialogue: 'Garet\'s the name, flames are my game! Ready to feel the heat?',
      battleOnInteract: ['salamander', 'fire-worm', 'imp'], // Level 3-4 fire enemies
      battleOnlyOnce: false,
    },
    {
      id: 'jenna-trainer',
      name: 'Jenna',
      position: { x: 7, y: 13 },
      blocking: true,
      dialogue: 'I need rescuing from these fire spirits I accidentally summoned! Help!',
      battleOnInteract: ['fire-worm', 'salamander'], // Level 3 fire enemies
      battleOnlyOnce: true, // Rescue quest - one time only
    },
    {
      id: 'kyle-trainer',
      name: 'Kyle',
      position: { x: 10, y: 2 },
      blocking: true,
      dialogue: {
        default: 'I am Kyle, master of the blade. Only the worthy may face my warrior\'s trial!',
        quest_ruins_complete: 'You have conquered the ruins. Perhaps you are ready for my trial...',
      },
      battleOnInteract: ['wyvern', 'demon-imp', 'orc-warrior'], // Level 5-6 elite enemies
      battleOnlyOnce: false,
    },

    // Mercury (Water) Adepts
    {
      id: 'mia-trainer',
      name: 'Mia',
      position: { x: 17, y: 11 },
      blocking: true,
      dialogue: 'Mia, healer and ice mage. Let\'s have a friendly spar with my water spirits!',
      battleOnInteract: ['ooze', 'slime-beast', 'merman'], // Level 3-4 water enemies
      battleOnlyOnce: false,
    },
    {
      id: 'piers-trainer',
      name: 'Piers',
      position: { x: 1, y: 3 },
      blocking: true,
      dialogue: 'As guardian of the harbor, I command the tides! Face my aquatic allies!',
      battleOnInteract: ['gillman', 'merman', 'king-cobra'], // Level 4-5 aquatic enemies
      battleOnlyOnce: false,
    },

    // Jupiter (Wind) Adepts
    {
      id: 'ivan-trainer',
      name: 'Ivan',
      position: { x: 17, y: 13 },
      blocking: true,
      dialogue: 'Ivan at your service! My wind magic calls forth these aerial creatures!',
      battleOnInteract: ['drone-bee', 'fighter-bee', 'pixie'], // Level 3 wind/flying enemies
      battleOnlyOnce: false,
    },
    {
      id: 'sheba-trainer',
      name: 'Sheba',
      position: { x: 12, y: 13 },
      blocking: true,
      dialogue: 'I was found in the forest among these wind spirits. Can you calm them?',
      battleOnInteract: ['pixie', 'faery', 'willowisp'], // Level 3-4 fairy/wind enemies
      battleOnlyOnce: true, // Found in forest - rescue scenario
    },

    // Neutral (Versatile)
    {
      id: 'kraden-trainer',
      name: 'Kraden',
      position: { x: 2, y: 8 },
      blocking: true,
      dialogue: {
        default: 'Ah, a student! I am Kraden, alchemist and researcher. Let me test your knowledge of all elements!',
        quest_forest_active: 'Fascinating creatures in that forest! Collect data for me, won\'t you?',
      },
      battleOnInteract: ['gnome-wizard', 'demon-imp', 'willowisp', 'merman'], // Level 4 mixed elements
      battleOnlyOnce: false,
    },

    // === UNIQUE CHARACTERS (Special NPCs) ===
    {
      id: 'Monk_sitting',
      name: 'Zen Master',
      position: { x: 11, y: 6 },
      blocking: true,
      dialogue: {
        default: 'Meditation has given me power over spirits. Face my inner demons!',
        quest_ruins_complete: 'You have achieved enlightenment through battle. Well done.',
      },
      battleOnInteract: ['ghost', 'spirit', 'will-head', 'wraith'], // Level 3-6 spiritual enemies
      battleOnlyOnce: false,
    },
    {
      id: 'tiedup_villager',
      name: 'Captured Villager',
      position: { x: 19, y: 12 },
      blocking: true,
      dialogue: {
        default: 'Help! Bandits left these monsters to guard me! Free me!',
        quest_forest_complete: 'Thank you for saving me! Those bandits won\'t get away with this!',
      },
      battleOnInteract: ['brigand', 'thief', 'ruffian'], // Level 4 bandit-themed enemies
      battleOnlyOnce: true, // Rescue mission - one time only
    },
    {
      id: 'Cursed_Tree',
      name: 'Cursed Ancient Tree',
      position: { x: 4, y: 14 },
      blocking: true,
      dialogue: '*The tree groans with dark energy* A curse binds nature spirits here!',
      battleOnInteract: ['creeper', 'vine', 'brambler', 'wild-mushroom'], // Level 2-5 plant enemies
      battleOnlyOnce: true, // Breaking the curse
    },

    // === ADDITIONAL VILLAGERS (Generic Townsfolk) ===
    {
      id: 'Villager-18',
      name: 'Beast Tamer',
      position: { x: 14, y: 9 },
      blocking: true,
      dialogue: 'I train wild beasts for the village guard! Want to test them?',
      battleOnInteract: ['dire-wolf', 'wild-cat', 'lynx'], // Level 2-3 beast enemies
      battleOnlyOnce: false,
    },
    {
      id: 'Villager-19',
      name: 'Insect Collector',
      position: { x: 8, y: 7 },
      blocking: false,
      dialogue: 'Check out my rare bug collection! They\'re quite fierce!',
      battleOnInteract: ['ant-lion', 'flash-ant', 'hornet'], // Level 3 insect enemies
      battleOnlyOnce: false,
    },
    {
      id: 'Villager-20',
      name: 'Undead Hunter',
      position: { x: 16, y: 9 },
      blocking: true,
      dialogue: 'I hunt the undead for a living. Let me show you what I\'ve captured!',
      battleOnInteract: ['skeleton', 'zombie', 'ghoul'], // Level 3-4 undead enemies
      battleOnlyOnce: false,
    },
    {
      id: 'Villager-21',
      name: 'Slime Rancher',
      position: { x: 6, y: 12 },
      blocking: false,
      dialogue: 'My slime ranch has the strongest slimes in Vale! Prove me wrong!',
      battleOnInteract: ['ooze', 'slime-beast'], // Level 3 slime variants
      battleOnlyOnce: false,
    },
    {
      id: 'Villager-22',
      name: 'Lizard Keeper',
      position: { x: 13, y: 5 },
      blocking: true,
      dialogue: 'These lizards are my pets! They\'ve been trained for combat!',
      battleOnInteract: ['lizard-man', 'lizard-fighter', 'thunder-lizard'], // Level 4 lizard enemies
      battleOnlyOnce: false,
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
    {
      id: 'to_battle_row',
      position: { x: 9, y: 0 },
      width: 2,
      height: 1,
      targetArea: 'battle_row',
      targetPosition: { x: 1, y: 7 },
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
    { weight: 30, enemyIds: ['wild-wolf'] },
    { weight: 25, enemyIds: ['goblin', 'goblin'] },
    { weight: 15, enemyIds: ['slime', 'wild-wolf'] },
    { weight: 10, enemyIds: ['rat', 'rat', 'rat'] }, // NEW: Rat swarm
    { weight: 8, enemyIds: ['bat', 'bat'] }, // NEW: Flying enemies
    { weight: 7, enemyIds: ['spider', 'grub'] }, // NEW: Critter mix
    { weight: 5, enemyIds: ['poison-toad', 'mole'] }, // NEW: Nature enemies
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
        gold: 75,
        equipment: [IRON_SWORD], // Better weapon
      },
      opened: false,
    },
    {
      id: 'forest_chest_2',
      position: { x: 15, y: 18 },
      contents: {
        gold: 50,
        equipment: [LEATHER_BOOTS], // Speed boost
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
        gold: 150,
        equipment: [IRON_ARMOR], // Better defense
      },
      opened: false,
    },
    {
      id: 'ruins_chest_2',
      position: { x: 18, y: 20 },
      contents: {
        gold: 100,
        equipment: [IRON_HELM, STEEL_SWORD], // Good helm + weapon
      },
      opened: false,
    },
    {
      id: 'ruins_chest_3',
      position: { x: 12, y: 28 },
      contents: {
        gold: 200,
        equipment: [HYPER_BOOTS], // Best speed boots
      },
      opened: false,
    },
    {
      id: 'ruins_chest_4',
      position: { x: 5, y: 8 },
      contents: {
        gold: 80,
        equipment: [STEEL_HELM], // Best helm
      },
      opened: false,
    },
    {
      id: 'ruins_chest_5',
      position: { x: 20, y: 15 },
      contents: {
        gold: 120,
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
 * BATTLE ROW - Linear Progression Area
 *
 * Narrative Context:
 * A village that enslaves monsters for battle entertainment. The player (Isaac)
 * refuses to participate in monster exploitation and fights to free them.
 * Player fights WITH Djinn (spiritual beings opposing slavery), not monsters.
 *
 * Design:
 * - 10 houses in a straight horizontal line (left to right progression)
 * - All houses at y=7 (middle row only)
 * - Evenly spaced: x=4, 8, 12, 16, 20, 24, 28, 32, 36, 40
 * - Each house contains an NPC battle encounter
 * - Recruitable NPCs fight WITH their monsters, then join after defeat
 * - Non-recruitable NPCs just send monsters to fight
 */
export const BATTLE_ROW: Area = {
  id: 'battle_row',
  name: 'Battle Row',
  type: 'town',
  width: 50, // Wide enough for horizontal layout
  height: 15,
  hasRandomEncounters: false,
  bosses: [],
  treasures: [
    {
      id: 'village_starter_chest',
      position: { x: 1, y: 7 },
      contents: {
        gold: 200,
        equipment: [STEEL_SWORD, IRON_ARMOR],
      },
      opened: false,
    },
  ],
  npcs: [
    // === HOUSE 1 (x=4, y=7) - Regular NPC ===
    {
      id: 'house1-beast-tamer',
      name: 'Beast Tamer',
      position: { x: 4, y: 7 },
      blocking: true,
      dialogue: {
        default: 'Welcome to Battle Row! I train wild beasts for combat. Face them if you dare!',
        quest_forest_complete: 'You look strong... but can you handle my beasts?',
      },
      battleOnInteract: ['dire-wolf', 'wild-cat', 'lynx'], // Level 2-3 beasts
      battleOnlyOnce: false,
    },

    // === HOUSE 2 (x=8, y=7) - Regular NPC ===
    {
      id: 'house2-undead-hunter',
      name: 'Undead Hunter',
      position: { x: 8, y: 7 },
      blocking: true,
      dialogue: 'I capture undead creatures for the arena. Let me show you my collection!',
      battleOnInteract: ['skeleton', 'zombie', 'ghoul'], // Level 3-4 undead
      battleOnlyOnce: false,
    },

    // === HOUSE 3 (x=12, y=7) - RECRUITABLE: Garet ===
    {
      id: 'house3-garet',
      sprite: '/sprites/overworld/protagonists/Garet.gif',
      name: 'Garet',
      position: { x: 12, y: 7 },
      blocking: true,
      dialogue: {
        default: 'Garet here! My fire spirits fight for me. Show me what you\'ve got!',
        quest_forest_complete: 'You\'ve freed those monsters? Maybe... you\'re right. I\'ll join you!',
      },
      battleOnInteract: ['salamander', 'fire-worm', 'imp', 'demon-imp'], // Fire enemies commanded by Garet
      battleOnlyOnce: true, // Recruitable - join after defeat
    },

    // === HOUSE 4 (x=16, y=7) - Regular NPC ===
    {
      id: 'house4-insect-collector',
      sprite: '/sprites/overworld/minornpcs/Villager-3.gif',
      name: 'Insect Collector',
      position: { x: 16, y: 7 },
      blocking: true,
      dialogue: 'My rare bug collection fights in the arena! Witness their power!',
      battleOnInteract: ['ant-lion', 'flash-ant', 'hornet', 'drone-bee'], // Level 3 insects
      battleOnlyOnce: false,
    },

    // === HOUSE 5 (x=20, y=7) - Regular NPC ===
    {
      id: 'house5-slime-rancher',
      sprite: '/sprites/overworld/minornpcs/Villager-4.gif',
      name: 'Slime Rancher',
      position: { x: 20, y: 7 },
      blocking: true,
      dialogue: 'These are the strongest slimes in all the land! Prove me wrong!',
      battleOnInteract: ['ooze', 'slime-beast', 'slime'], // Level 3 slimes
      battleOnlyOnce: false,
    },

    // === HOUSE 6 (x=24, y=7) - Regular NPC ===
    {
      id: 'house6-lizard-keeper',
      sprite: '/sprites/overworld/minornpcs/Villager-5.gif',
      name: 'Lizard Keeper',
      position: { x: 24, y: 7 },
      blocking: true,
      dialogue: 'My combat-trained lizards are unbeatable! Take them on!',
      battleOnInteract: ['lizard-man', 'lizard-fighter', 'thunder-lizard', 'earth-lizard'], // Level 4 lizards
      battleOnlyOnce: false,
    },

    // === HOUSE 7 (x=28, y=7) - RECRUITABLE: Mia ===
    {
      id: 'house7-mia',
      sprite: '/sprites/overworld/protagonists/Mia.gif',
      name: 'Mia',
      position: { x: 28, y: 7 },
      blocking: true,
      dialogue: {
        default: 'I am Mia, healer and ice mage. My water spirits will test your resolve!',
        quest_forest_complete: 'Your compassion for the monsters... I understand now. Let me join your cause!',
      },
      battleOnInteract: ['ooze', 'slime-beast', 'merman', 'gillman'], // Water enemies commanded by Mia
      battleOnlyOnce: true, // Recruitable - join after defeat
    },

    // === HOUSE 8 (x=32, y=7) - Unique NPC (Zen Master) ===
    {
      id: 'house8-zen-master',
      sprite: '/sprites/overworld/minornpcs/Monk_sitting.gif',
      name: 'Zen Master',
      position: { x: 32, y: 7 },
      blocking: true,
      dialogue: 'Through meditation, I command spirits. Face my inner demons!',
      battleOnInteract: ['ghost', 'spirit', 'will-head', 'wraith'], // Level 3-6 spiritual
      battleOnlyOnce: false,
    },

    // === HOUSE 9 (x=36, y=7) - Regular NPC ===
    {
      id: 'house9-elemental-summoner',
      sprite: '/sprites/overworld/minornpcs/Villager-6.gif',
      name: 'Elemental Summoner',
      position: { x: 36, y: 7 },
      blocking: true,
      dialogue: 'I summon elementals from all realms! Can you withstand their power?',
      battleOnInteract: ['gnome-wizard', 'demon-imp', 'willowisp', 'pixie'], // Level 4 mixed elementals
      battleOnlyOnce: false,
    },

    // === HOUSE 10 (x=40, y=7) - RECRUITABLE: Kraden ===
    {
      id: 'house10-kraden',
      sprite: '/sprites/overworld/protagonists/Kraden.gif',
      name: 'Kraden',
      position: { x: 40, y: 7 },
      blocking: true,
      dialogue: {
        default: 'Ah, a visitor! I am Kraden, alchemist and researcher. My elemental test awaits you!',
        quest_forest_complete: 'Fascinating! Your Djinn philosophy aligns with ancient alchemy. I shall join you!',
      },
      battleOnInteract: ['gnome-wizard', 'demon-imp', 'willowisp', 'merman'], // Mixed elementals commanded by Kraden
      battleOnlyOnce: true, // Recruitable - join after defeat
    },

    // === HOUSE 11 (x=44, y=7) - Rat Breeder ===
    {
      id: 'house11-rat-breeder',
      name: 'Rat Breeder',
      position: { x: 44, y: 7 },
      sprite: '/sprites/overworld/minornpcs/Villager-7.gif',
      blocking: true,
      dialogue: 'My trained rats are fierce fighters! Face them!',
      battleOnInteract: ['rat', 'armored-rat', 'rat-fighter'], // Level 1-3 rats
      battleOnlyOnce: false,
    },

    // === HOUSE 12 (x=48, y=7) - Bat Handler ===
    {
      id: 'house12-bat-handler',
      name: 'Bat Handler',
      position: { x: 48, y: 7 },
      sprite: '/sprites/overworld/minornpcs/Villager-8.gif',
      blocking: true,
      dialogue: 'My trained rats are fierce fighters! Face them!',
      battleOnInteract: ['bat', 'rabid-bat', 'bat'], // Level 1-3 bats
      battleOnlyOnce: false,
    },

    // === HOUSE 13 (x=52, y=7) - Spider Tamer ===
    {
      id: 'house13-spider-tamer',
      name: 'Spider Tamer',
      position: { x: 52, y: 7 },
      sprite: '/sprites/overworld/minornpcs/Villager-9.gif',
      blocking: true,
      dialogue: 'My trained rats are fierce fighters! Face them!',
      battleOnInteract: ['spider', 'tarantula', 'recluse'], // Level 1-3 spiders
      battleOnlyOnce: false,
    },

    // === HOUSE 14 (x=56, y=7) - Goblin Wrangler ===
    {
      id: 'house14-goblin-wrangler',
      name: 'Goblin Wrangler',
      position: { x: 56, y: 7 },
      sprite: '/sprites/overworld/minornpcs/Villager-10.gif',
      blocking: true,
      dialogue: 'My trained rats are fierce fighters! Face them!',
      battleOnInteract: ['goblin', 'hobgoblin', 'alec-goblin'], // Level 1-3 goblins
      battleOnlyOnce: false,
    },

    // === HOUSE 15 (x=60, y=7) - Vermin Trainer ===
    {
      id: 'house15-vermin-trainer',
      name: 'Vermin Trainer',
      position: { x: 60, y: 7 },
      sprite: '/sprites/overworld/minornpcs/Villager-11.gif',
      blocking: true,
      dialogue: 'My trained rats are fierce fighters! Face them!',
      battleOnInteract: ['vermin', 'mad-vermin', 'grub'], // Level 1-2 vermin
      battleOnlyOnce: false,
    },

    // === HOUSE 16 (x=64, y=7) - Hound Master ===
    {
      id: 'house16-hound-master',
      name: 'Hound Master',
      position: { x: 64, y: 7 },
      sprite: '/sprites/overworld/minornpcs/Villager-12.gif',
      blocking: true,
      dialogue: 'My trained rats are fierce fighters! Face them!',
      battleOnInteract: ['dread-hound', 'wolfkin', 'wolfkin-cub'], // Level 3-4 canines
      battleOnlyOnce: false,
    },

    // === HOUSE 17 (x=68, y=7) - Bee Keeper ===
    {
      id: 'house17-bee-keeper',
      name: 'Bee Keeper',
      position: { x: 68, y: 7 },
      sprite: '/sprites/overworld/minornpcs/Villager-13.gif',
      blocking: true,
      dialogue: 'My trained rats are fierce fighters! Face them!',
      battleOnInteract: ['drone-bee', 'fighter-bee', 'hornet'], // Level 3-4 bees
      battleOnlyOnce: false,
    },

    // === HOUSE 18 (x=72, y=7) - Ant Farmer ===
    {
      id: 'house18-ant-farmer',
      name: 'Ant Farmer',
      position: { x: 72, y: 7 },
      sprite: '/sprites/overworld/minornpcs/Villager-14.gif',
      blocking: true,
      dialogue: 'My trained rats are fierce fighters! Face them!',
      battleOnInteract: ['flash-ant', 'numb-ant', 'punch-ant'], // Level 3 ants
      battleOnlyOnce: false,
    },

    // === HOUSE 19 (x=76, y=7) - Toad Collector ===
    {
      id: 'house19-toad-collector',
      name: 'Toad Collector',
      position: { x: 76, y: 7 },
      sprite: '/sprites/overworld/minornpcs/Villager-15.gif',
      blocking: true,
      dialogue: 'My trained rats are fierce fighters! Face them!',
      battleOnInteract: ['poison-toad', 'devil-frog', 'poison-toad'], // Level 2-3 amphibians
      battleOnlyOnce: false,
    },

    // === HOUSE 20 (x=80, y=7) - Mole Wrangler ===
    {
      id: 'house20-mole-wrangler',
      name: 'Mole Wrangler',
      position: { x: 80, y: 7 },
      sprite: '/sprites/overworld/minornpcs/Villager-16.gif',
      blocking: true,
      dialogue: 'My trained rats are fierce fighters! Face them!',
      battleOnInteract: ['mole', 'mad-mole', 'mole'], // Level 2-3 moles
      battleOnlyOnce: false,
    },

    // === HOUSE 21 (x=84, y=7) - Aqua Specialist ===
    {
      id: 'house21-aqua-specialist',
      name: 'Aqua Specialist',
      position: { x: 84, y: 7 },
      sprite: '/sprites/overworld/minornpcs/Villager-17.gif',
      blocking: true,
      dialogue: 'My trained rats are fierce fighters! Face them!',
      battleOnInteract: ['merman', 'gillman', 'water-beast'], // Level 4-6 aquatic
      battleOnlyOnce: false,
    },

    // === HOUSE 22 (x=88, y=7) - Fire Trainer ===
    {
      id: 'house22-fire-trainer',
      name: 'Fire Trainer',
      position: { x: 88, y: 7 },
      sprite: '/sprites/overworld/minornpcs/Villager-18.gif',
      blocking: true,
      dialogue: 'My trained rats are fierce fighters! Face them!',
      battleOnInteract: ['salamander', 'fire-worm', 'molten-worm'], // Level 4-6 fire
      battleOnlyOnce: false,
    },

    // === HOUSE 23 (x=92, y=7) - Earth Defender ===
    {
      id: 'house23-earth-defender',
      name: 'Earth Defender',
      position: { x: 92, y: 7 },
      sprite: '/sprites/overworld/minornpcs/Villager-19.gif',
      blocking: true,
      dialogue: 'My trained rats are fierce fighters! Face them!',
      battleOnInteract: ['rock-hog', 'stone-beast', 'earth-golem'], // Level 5-7 earth
      battleOnlyOnce: false,
    },

    // === HOUSE 24 (x=96, y=7) - Wind Caller ===
    {
      id: 'house24-wind-caller',
      name: 'Wind Caller',
      position: { x: 96, y: 7 },
      sprite: '/sprites/overworld/minornpcs/Villager-20.gif',
      blocking: true,
      dialogue: 'My trained rats are fierce fighters! Face them!',
      battleOnInteract: ['willowisp', 'harpy', 'pixie'], // Level 4-6 wind
      battleOnlyOnce: false,
    },

    // === HOUSE 25 (x=100, y=7) - Ghost Hunter ===
    {
      id: 'house25-ghost-hunter',
      name: 'Ghost Hunter',
      position: { x: 100, y: 7 },
      sprite: '/sprites/overworld/minornpcs/Villager21.gif',
      blocking: true,
      dialogue: 'My trained rats are fierce fighters! Face them!',
      battleOnInteract: ['ghost', 'spirit', 'wraith'], // Level 4-6 undead
      battleOnlyOnce: false,
    },

    // === HOUSE 26 (x=104, y=7) - Beast Master ===
    {
      id: 'house26-beast-master',
      name: 'Beast Master',
      position: { x: 104, y: 7 },
      sprite: '/sprites/overworld/minornpcs/Villager22.gif',
      blocking: true,
      dialogue: 'I command the legendary beasts! Face them!',
      battleOnInteract: ['chimera', 'phoenix', 'fenrir'], // Level 7 legendary beasts (all have sprites)
      battleOnlyOnce: false,
    },

    // === HOUSE 27 (x=108, y=7) - Elite Summoner ===
    {
      id: 'house27-elite-summoner',
      name: 'Elite Summoner',
      position: { x: 108, y: 7 },
      sprite: '/sprites/overworld/minornpcs/Scholar-1.gif',
      blocking: true,
      dialogue: 'My elite monsters will test your strength!',
      battleOnInteract: ['grand-chimera', 'hydra', 'grand-golem'], // Level 8 elite monsters (all have sprites)
      battleOnlyOnce: false,
    },

    // === HOUSE 28 (x=112, y=7) - Undead Master ===
    {
      id: 'house28-undead-master',
      name: 'Undead Master',
      position: { x: 112, y: 7 },
      sprite: '/sprites/overworld/minornpcs/Scholar-2.gif',
      blocking: true,
      dialogue: 'Rise, my undead servants! Crush them!',
      battleOnInteract: ['lich', 'orc-lord', 'minotaur'], // Level 5-8 powerful enemies (all have sprites)
      battleOnlyOnce: false,
    },

    // === HOUSE 29 (x=116, y=7) - Legendary Trainer ===
    {
      id: 'house29-legendary-trainer',
      name: 'Legendary Trainer',
      position: { x: 116, y: 7 },
      sprite: '/sprites/overworld/minornpcs/MartialArtist1.gif',
      blocking: true,
      dialogue: 'Face the ultimate challenge!',
      battleOnInteract: ['grand-chimera', 'hydra', 'lich'], // Level 8 legendary team (all have sprites)
      battleOnlyOnce: false,
    },

    // === HOUSE 30 (x=120, y=7) - Final Boss Trainer ===
    {
      id: 'house30-champion',
      name: 'Champion Trainer',
      position: { x: 120, y: 7 },
      sprite: '/sprites/overworld/minornpcs/MartialArtist2.gif',
      blocking: true,
      dialogue: 'You\'ve come far. Face my ultimate team!',
      battleOnInteract: ['grand-golem', 'grand-chimera', 'hydra'], // Level 8 final boss team (all have sprites)
      battleOnlyOnce: false,
    },
  ],

  // === BUILDINGS (30 houses with unique Vale sprites) ===
  buildings: [
    {
      id: 'house1',
      label: 'Beast Tamer\'s House',
      position: { x: 4, y: 7 },
      sprite: '/sprites/scenery/buildings/Vale/Vale_Building1.gif',
      blocking: true,
    },
    {
      id: 'house2',
      label: 'Undead Hunter\'s House',
      position: { x: 8, y: 7 },
      sprite: '/sprites/scenery/buildings/Vale/Vale_Building2.gif',
      blocking: true,
    },
    {
      id: 'house3',
      label: 'Garet\'s House',
      position: { x: 12, y: 7 },
      sprite: '/sprites/scenery/buildings/Vale/Vale_Garets_House.gif',
      blocking: true,
    },
    {
      id: 'house4',
      label: 'Insect Collector\'s House',
      position: { x: 16, y: 7 },
      sprite: '/sprites/scenery/buildings/Vale/Vale_Building3.gif',
      blocking: true,
    },
    {
      id: 'house5',
      label: 'Slime Rancher\'s House',
      position: { x: 20, y: 7 },
      sprite: '/sprites/scenery/buildings/Vale/Vale_Building4.gif',
      blocking: true,
    },
    {
      id: 'house6',
      label: 'Lizard Keeper\'s House',
      position: { x: 24, y: 7 },
      sprite: '/sprites/scenery/buildings/Vale/Vale_Building5.gif',
      blocking: true,
    },
    {
      id: 'house7',
      label: 'Mia\'s House',
      position: { x: 28, y: 7 },
      sprite: '/sprites/scenery/buildings/Vale/Vale_Isaacs_House.gif',
      blocking: true,
    },
    {
      id: 'house8',
      label: 'Zen Master\'s House',
      position: { x: 32, y: 7 },
      sprite: '/sprites/scenery/buildings/Vale/Vale_Building6.gif',
      blocking: true,
    },
    {
      id: 'house9',
      label: 'Elemental Summoner\'s House',
      position: { x: 36, y: 7 },
      sprite: '/sprites/scenery/buildings/Vale/Vale_Building7.gif',
      blocking: true,
    },
    {
      id: 'house10',
      label: 'Kraden\'s House',
      position: { x: 40, y: 7 },
      sprite: '/sprites/scenery/buildings/Vale/Vale_Kradens_House.gif',
      blocking: true,
    },
    // Houses 11-30
    { id: 'house11', label: 'Rat Breeder\'s House', position: { x: 44, y: 7 }, sprite: '/sprites/scenery/buildings/Vale/Vale_Building8.gif', blocking: true },
    { id: 'house12', label: 'Bat Handler\'s House', position: { x: 48, y: 7 }, sprite: '/sprites/scenery/buildings/Vale/Vale_Building1.gif', blocking: true },
    { id: 'house13', label: 'Spider Tamer\'s House', position: { x: 52, y: 7 }, sprite: '/sprites/scenery/buildings/Vale/Vale_Building2.gif', blocking: true },
    { id: 'house14', label: 'Goblin Wrangler\'s House', position: { x: 56, y: 7 }, sprite: '/sprites/scenery/buildings/Vale/Vale_Building3.gif', blocking: true },
    { id: 'house15', label: 'Vermin Trainer\'s House', position: { x: 60, y: 7 }, sprite: '/sprites/scenery/buildings/Vale/Vale_Building4.gif', blocking: true },
    { id: 'house16', label: 'Hound Master\'s House', position: { x: 64, y: 7 }, sprite: '/sprites/scenery/buildings/Vale/Vale_Building5.gif', blocking: true },
    { id: 'house17', label: 'Bee Keeper\'s House', position: { x: 68, y: 7 }, sprite: '/sprites/scenery/buildings/Vale/Vale_Building6.gif', blocking: true },
    { id: 'house18', label: 'Ant Farmer\'s House', position: { x: 72, y: 7 }, sprite: '/sprites/scenery/buildings/Vale/Vale_Building7.gif', blocking: true },
    { id: 'house19', label: 'Toad Collector\'s House', position: { x: 76, y: 7 }, sprite: '/sprites/scenery/buildings/Vale/Vale_Building8.gif', blocking: true },
    { id: 'house20', label: 'Mole Wrangler\'s House', position: { x: 80, y: 7 }, sprite: '/sprites/scenery/buildings/Vale/Vale_Jennas_House.gif', blocking: true },
    { id: 'house21', label: 'Aqua Specialist\'s House', position: { x: 84, y: 7 }, sprite: '/sprites/scenery/buildings/Vale/Vale_Inn.gif', blocking: true },
    { id: 'house22', label: 'Fire Trainer\'s House', position: { x: 88, y: 7 }, sprite: '/sprites/scenery/buildings/Vale/Vale_WepArm_Shop.gif', blocking: true },
    { id: 'house23', label: 'Earth Defender\'s House', position: { x: 92, y: 7 }, sprite: '/sprites/scenery/buildings/Vale/Vale_Building1.gif', blocking: true },
    { id: 'house24', label: 'Wind Caller\'s House', position: { x: 96, y: 7 }, sprite: '/sprites/scenery/buildings/Vale/Vale_Building2.gif', blocking: true },
    { id: 'house25', label: 'Ghost Hunter\'s House', position: { x: 100, y: 7 }, sprite: '/sprites/scenery/buildings/Vale/Vale_Building3.gif', blocking: true },
    { id: 'house26', label: 'Demon Summoner\'s House', position: { x: 104, y: 7 }, sprite: '/sprites/scenery/buildings/Vale/Vale_Building4.gif', blocking: true },
    { id: 'house27', label: 'Dragon Tamer\'s House', position: { x: 108, y: 7 }, sprite: '/sprites/scenery/buildings/Vale/Vale_Building5.gif', blocking: true },
    { id: 'house28', label: 'Golem Master\'s House', position: { x: 112, y: 7 }, sprite: '/sprites/scenery/buildings/Vale/Vale_Building6.gif', blocking: true },
    { id: 'house29', label: 'Titan Summoner\'s House', position: { x: 116, y: 7 }, sprite: '/sprites/scenery/buildings/Vale/Vale_Building7.gif', blocking: true },
    { id: 'house30', label: 'Champion\'s House', position: { x: 120, y: 7 }, sprite: '/sprites/scenery/buildings/Vale/Vale_Sanctum.gif', blocking: true },
  ],

  // === SCENERY (trees, bushes, decorations) ===
  scenery: [
    // Trees on left edge
    { id: 'tree1', position: { x: 2, y: 4 }, sprite: '/sprites/scenery/plants/Tree.gif', blocking: true },
    { id: 'tree2', position: { x: 2, y: 10 }, sprite: '/sprites/scenery/plants/Tree.gif', blocking: true },

    // Trees between houses
    { id: 'tree3', position: { x: 6, y: 5 }, sprite: '/sprites/scenery/plants/Small_Tree1.gif', blocking: true },
    { id: 'tree4', position: { x: 10, y: 9 }, sprite: '/sprites/scenery/plants/Small_Tree2.gif', blocking: true },
    { id: 'tree5', position: { x: 14, y: 4 }, sprite: '/sprites/scenery/plants/Tree1.gif', blocking: true },
    { id: 'tree6', position: { x: 18, y: 10 }, sprite: '/sprites/scenery/plants/Small_Tree3.gif', blocking: true },
    { id: 'tree7', position: { x: 22, y: 5 }, sprite: '/sprites/scenery/plants/Tree5.gif', blocking: true },
    { id: 'tree8', position: { x: 26, y: 9 }, sprite: '/sprites/scenery/plants/Small_Tree4.gif', blocking: true },
    { id: 'tree9', position: { x: 30, y: 4 }, sprite: '/sprites/scenery/plants/Tree6.gif', blocking: true },
    { id: 'tree10', position: { x: 34, y: 10 }, sprite: '/sprites/scenery/plants/Small_Tree5.gif', blocking: true },
    { id: 'tree11', position: { x: 38, y: 5 }, sprite: '/sprites/scenery/plants/Tree7.gif', blocking: true },

    // Trees on right edge
    { id: 'tree12', position: { x: 42, y: 3 }, sprite: '/sprites/scenery/plants/Tree9.gif', blocking: true },
    { id: 'tree13', position: { x: 44, y: 11 }, sprite: '/sprites/scenery/plants/Tree11.gif', blocking: true },

    // Bushes for variety
    { id: 'bush1', position: { x: 3, y: 7 }, sprite: '/sprites/scenery/plants/Bush.gif', blocking: false },
    { id: 'bush2', position: { x: 7, y: 7 }, sprite: '/sprites/scenery/plants/Bush3.gif', blocking: false },
    { id: 'bush3', position: { x: 11, y: 7 }, sprite: '/sprites/scenery/plants/Shrub1.gif', blocking: false },
    { id: 'bush4', position: { x: 15, y: 7 }, sprite: '/sprites/scenery/plants/Shrub3.gif', blocking: false },
    { id: 'bush5', position: { x: 19, y: 7 }, sprite: '/sprites/scenery/plants/Bush.gif', blocking: false },
    { id: 'bush6', position: { x: 23, y: 7 }, sprite: '/sprites/scenery/plants/Shrub5.gif', blocking: false },
    { id: 'bush7', position: { x: 27, y: 7 }, sprite: '/sprites/scenery/plants/Bush3.gif', blocking: false },
    { id: 'bush8', position: { x: 31, y: 7 }, sprite: '/sprites/scenery/plants/Shrub1.gif', blocking: false },
    { id: 'bush9', position: { x: 35, y: 7 }, sprite: '/sprites/scenery/plants/Shrub3.gif', blocking: false },
    { id: 'bush10', position: { x: 39, y: 7 }, sprite: '/sprites/scenery/plants/Bush.gif', blocking: false },

    // Flowers for decoration (non-blocking)
    { id: 'flowers1', position: { x: 5, y: 6 }, sprite: '/sprites/scenery/plants/Flowers.gif', blocking: false, layer: 'background' },
    { id: 'flowers2', position: { x: 9, y: 8 }, sprite: '/sprites/scenery/plants/Flowers.gif', blocking: false, layer: 'background' },
    { id: 'flowers3', position: { x: 13, y: 6 }, sprite: '/sprites/scenery/plants/Flowers.gif', blocking: false, layer: 'background' },
    { id: 'flowers4', position: { x: 17, y: 8 }, sprite: '/sprites/scenery/plants/Flowers.gif', blocking: false, layer: 'background' },
    { id: 'flowers5', position: { x: 21, y: 6 }, sprite: '/sprites/scenery/plants/Flowers.gif', blocking: false, layer: 'background' },
    { id: 'flowers6', position: { x: 25, y: 8 }, sprite: '/sprites/scenery/plants/Flowers.gif', blocking: false, layer: 'background' },
    { id: 'flowers7', position: { x: 29, y: 6 }, sprite: '/sprites/scenery/plants/Flowers.gif', blocking: false, layer: 'background' },
    { id: 'flowers8', position: { x: 33, y: 8 }, sprite: '/sprites/scenery/plants/Flowers.gif', blocking: false, layer: 'background' },
    { id: 'flowers9', position: { x: 37, y: 6 }, sprite: '/sprites/scenery/plants/Flowers.gif', blocking: false, layer: 'background' },
    { id: 'flowers10', position: { x: 41, y: 8 }, sprite: '/sprites/scenery/plants/Flowers.gif', blocking: false, layer: 'background' },

    // Extended scenery for houses 11-30
    // Trees between houses 11-20
    { id: 'tree14', position: { x: 46, y: 5 }, sprite: '/sprites/scenery/plants/Tree.gif', blocking: true },
    { id: 'tree15', position: { x: 50, y: 9 }, sprite: '/sprites/scenery/plants/Small_Tree1.gif', blocking: true },
    { id: 'tree16', position: { x: 54, y: 4 }, sprite: '/sprites/scenery/plants/Tree1.gif', blocking: true },
    { id: 'tree17', position: { x: 58, y: 10 }, sprite: '/sprites/scenery/plants/Small_Tree2.gif', blocking: true },
    { id: 'tree18', position: { x: 62, y: 5 }, sprite: '/sprites/scenery/plants/Tree5.gif', blocking: true },
    { id: 'tree19', position: { x: 66, y: 9 }, sprite: '/sprites/scenery/plants/Small_Tree3.gif', blocking: true },
    { id: 'tree20', position: { x: 70, y: 4 }, sprite: '/sprites/scenery/plants/Tree6.gif', blocking: true },
    { id: 'tree21', position: { x: 74, y: 10 }, sprite: '/sprites/scenery/plants/Small_Tree4.gif', blocking: true },
    { id: 'tree22', position: { x: 78, y: 5 }, sprite: '/sprites/scenery/plants/Tree7.gif', blocking: true },
    { id: 'tree23', position: { x: 82, y: 9 }, sprite: '/sprites/scenery/plants/Small_Tree5.gif', blocking: true },

    // Trees between houses 21-30
    { id: 'tree24', position: { x: 86, y: 4 }, sprite: '/sprites/scenery/plants/Tree9.gif', blocking: true },
    { id: 'tree25', position: { x: 90, y: 10 }, sprite: '/sprites/scenery/plants/Tree11.gif', blocking: true },
    { id: 'tree26', position: { x: 94, y: 5 }, sprite: '/sprites/scenery/plants/Tree.gif', blocking: true },
    { id: 'tree27', position: { x: 98, y: 9 }, sprite: '/sprites/scenery/plants/Tree1.gif', blocking: true },
    { id: 'tree28', position: { x: 102, y: 4 }, sprite: '/sprites/scenery/plants/Tree5.gif', blocking: true },
    { id: 'tree29', position: { x: 106, y: 10 }, sprite: '/sprites/scenery/plants/Tree6.gif', blocking: true },
    { id: 'tree30', position: { x: 110, y: 5 }, sprite: '/sprites/scenery/plants/Tree7.gif', blocking: true },
    { id: 'tree31', position: { x: 114, y: 9 }, sprite: '/sprites/scenery/plants/Tree9.gif', blocking: true },
    { id: 'tree32', position: { x: 118, y: 4 }, sprite: '/sprites/scenery/plants/Tree11.gif', blocking: true },
    { id: 'tree33', position: { x: 122, y: 10 }, sprite: '/sprites/scenery/plants/Tree.gif', blocking: true },

    // Bushes for houses 11-30
    { id: 'bush11', position: { x: 43, y: 7 }, sprite: '/sprites/scenery/plants/Bush.gif', blocking: false },
    { id: 'bush12', position: { x: 47, y: 7 }, sprite: '/sprites/scenery/plants/Bush3.gif', blocking: false },
    { id: 'bush13', position: { x: 51, y: 7 }, sprite: '/sprites/scenery/plants/Shrub1.gif', blocking: false },
    { id: 'bush14', position: { x: 55, y: 7 }, sprite: '/sprites/scenery/plants/Shrub3.gif', blocking: false },
    { id: 'bush15', position: { x: 59, y: 7 }, sprite: '/sprites/scenery/plants/Bush.gif', blocking: false },
    { id: 'bush16', position: { x: 63, y: 7 }, sprite: '/sprites/scenery/plants/Shrub5.gif', blocking: false },
    { id: 'bush17', position: { x: 67, y: 7 }, sprite: '/sprites/scenery/plants/Bush3.gif', blocking: false },
    { id: 'bush18', position: { x: 71, y: 7 }, sprite: '/sprites/scenery/plants/Shrub1.gif', blocking: false },
    { id: 'bush19', position: { x: 75, y: 7 }, sprite: '/sprites/scenery/plants/Shrub3.gif', blocking: false },
    { id: 'bush20', position: { x: 79, y: 7 }, sprite: '/sprites/scenery/plants/Bush.gif', blocking: false },
    { id: 'bush21', position: { x: 83, y: 7 }, sprite: '/sprites/scenery/plants/Bush3.gif', blocking: false },
    { id: 'bush22', position: { x: 87, y: 7 }, sprite: '/sprites/scenery/plants/Shrub1.gif', blocking: false },
    { id: 'bush23', position: { x: 91, y: 7 }, sprite: '/sprites/scenery/plants/Shrub3.gif', blocking: false },
    { id: 'bush24', position: { x: 95, y: 7 }, sprite: '/sprites/scenery/plants/Bush.gif', blocking: false },
    { id: 'bush25', position: { x: 99, y: 7 }, sprite: '/sprites/scenery/plants/Shrub5.gif', blocking: false },
    { id: 'bush26', position: { x: 103, y: 7 }, sprite: '/sprites/scenery/plants/Bush3.gif', blocking: false },
    { id: 'bush27', position: { x: 107, y: 7 }, sprite: '/sprites/scenery/plants/Shrub1.gif', blocking: false },
    { id: 'bush28', position: { x: 111, y: 7 }, sprite: '/sprites/scenery/plants/Shrub3.gif', blocking: false },
    { id: 'bush29', position: { x: 115, y: 7 }, sprite: '/sprites/scenery/plants/Bush.gif', blocking: false },
    { id: 'bush30', position: { x: 119, y: 7 }, sprite: '/sprites/scenery/plants/Shrub5.gif', blocking: false },

    // Flowers for houses 11-30
    { id: 'flowers11', position: { x: 45, y: 6 }, sprite: '/sprites/scenery/plants/Flowers.gif', blocking: false, layer: 'background' },
    { id: 'flowers12', position: { x: 49, y: 8 }, sprite: '/sprites/scenery/plants/Flowers.gif', blocking: false, layer: 'background' },
    { id: 'flowers13', position: { x: 53, y: 6 }, sprite: '/sprites/scenery/plants/Flowers.gif', blocking: false, layer: 'background' },
    { id: 'flowers14', position: { x: 57, y: 8 }, sprite: '/sprites/scenery/plants/Flowers.gif', blocking: false, layer: 'background' },
    { id: 'flowers15', position: { x: 61, y: 6 }, sprite: '/sprites/scenery/plants/Flowers.gif', blocking: false, layer: 'background' },
    { id: 'flowers16', position: { x: 65, y: 8 }, sprite: '/sprites/scenery/plants/Flowers.gif', blocking: false, layer: 'background' },
    { id: 'flowers17', position: { x: 69, y: 6 }, sprite: '/sprites/scenery/plants/Flowers.gif', blocking: false, layer: 'background' },
    { id: 'flowers18', position: { x: 73, y: 8 }, sprite: '/sprites/scenery/plants/Flowers.gif', blocking: false, layer: 'background' },
    { id: 'flowers19', position: { x: 77, y: 6 }, sprite: '/sprites/scenery/plants/Flowers.gif', blocking: false, layer: 'background' },
    { id: 'flowers20', position: { x: 81, y: 8 }, sprite: '/sprites/scenery/plants/Flowers.gif', blocking: false, layer: 'background' },
    { id: 'flowers21', position: { x: 85, y: 6 }, sprite: '/sprites/scenery/plants/Flowers.gif', blocking: false, layer: 'background' },
    { id: 'flowers22', position: { x: 89, y: 8 }, sprite: '/sprites/scenery/plants/Flowers.gif', blocking: false, layer: 'background' },
    { id: 'flowers23', position: { x: 93, y: 6 }, sprite: '/sprites/scenery/plants/Flowers.gif', blocking: false, layer: 'background' },
    { id: 'flowers24', position: { x: 97, y: 8 }, sprite: '/sprites/scenery/plants/Flowers.gif', blocking: false, layer: 'background' },
    { id: 'flowers25', position: { x: 101, y: 6 }, sprite: '/sprites/scenery/plants/Flowers.gif', blocking: false, layer: 'background' },
    { id: 'flowers26', position: { x: 105, y: 8 }, sprite: '/sprites/scenery/plants/Flowers.gif', blocking: false, layer: 'background' },
    { id: 'flowers27', position: { x: 109, y: 6 }, sprite: '/sprites/scenery/plants/Flowers.gif', blocking: false, layer: 'background' },
    { id: 'flowers28', position: { x: 113, y: 8 }, sprite: '/sprites/scenery/plants/Flowers.gif', blocking: false, layer: 'background' },
    { id: 'flowers29', position: { x: 117, y: 6 }, sprite: '/sprites/scenery/plants/Flowers.gif', blocking: false, layer: 'background' },
    { id: 'flowers30', position: { x: 121, y: 8 }, sprite: '/sprites/scenery/plants/Flowers.gif', blocking: false, layer: 'background' },
  ],

  exits: [
    // Exit back to Vale Village on the left
    {
      id: 'to_vale_village',
      position: { x: 0, y: 6 },
      width: 1,
      height: 3,
      targetArea: 'vale_village',
      targetPosition: { x: 18, y: 7 },
    },
    // Victory exit on the right (after completing all 30 houses)
    {
      id: 'to_victory',
      position: { x: 49, y: 6 },
      width: 1,
      height: 3,
      targetArea: 'vale_village',
      targetPosition: { x: 2, y: 7 },
      requiredFlag: 'battle_row_complete',
    },
    // House entrances (30 houses)
    { id: 'enter_house1', position: { x: 4, y: 7 }, width: 1, height: 1, targetArea: 'house1_interior', targetPosition: { x: 5, y: 6 } },
    { id: 'enter_house2', position: { x: 8, y: 7 }, width: 1, height: 1, targetArea: 'house2_interior', targetPosition: { x: 5, y: 6 } },
    { id: 'enter_house3', position: { x: 12, y: 7 }, width: 1, height: 1, targetArea: 'house3_interior', targetPosition: { x: 5, y: 6 } },
    { id: 'enter_house4', position: { x: 16, y: 7 }, width: 1, height: 1, targetArea: 'house4_interior', targetPosition: { x: 5, y: 6 } },
    { id: 'enter_house5', position: { x: 20, y: 7 }, width: 1, height: 1, targetArea: 'house5_interior', targetPosition: { x: 5, y: 6 } },
    { id: 'enter_house6', position: { x: 24, y: 7 }, width: 1, height: 1, targetArea: 'house6_interior', targetPosition: { x: 5, y: 6 } },
    { id: 'enter_house7', position: { x: 28, y: 7 }, width: 1, height: 1, targetArea: 'house7_interior', targetPosition: { x: 5, y: 6 } },
    { id: 'enter_house8', position: { x: 32, y: 7 }, width: 1, height: 1, targetArea: 'house8_interior', targetPosition: { x: 5, y: 6 } },
    { id: 'enter_house9', position: { x: 36, y: 7 }, width: 1, height: 1, targetArea: 'house9_interior', targetPosition: { x: 5, y: 6 } },
    { id: 'enter_house10', position: { x: 40, y: 7 }, width: 1, height: 1, targetArea: 'house10_interior', targetPosition: { x: 5, y: 6 } },
    { id: 'enter_house11', position: { x: 44, y: 7 }, width: 1, height: 1, targetArea: 'house11_interior', targetPosition: { x: 5, y: 6 } },
    { id: 'enter_house12', position: { x: 48, y: 7 }, width: 1, height: 1, targetArea: 'house12_interior', targetPosition: { x: 5, y: 6 } },
    { id: 'enter_house13', position: { x: 52, y: 7 }, width: 1, height: 1, targetArea: 'house13_interior', targetPosition: { x: 5, y: 6 } },
    { id: 'enter_house14', position: { x: 56, y: 7 }, width: 1, height: 1, targetArea: 'house14_interior', targetPosition: { x: 5, y: 6 } },
    { id: 'enter_house15', position: { x: 60, y: 7 }, width: 1, height: 1, targetArea: 'house15_interior', targetPosition: { x: 5, y: 6 } },
    { id: 'enter_house16', position: { x: 64, y: 7 }, width: 1, height: 1, targetArea: 'house16_interior', targetPosition: { x: 5, y: 6 } },
    { id: 'enter_house17', position: { x: 68, y: 7 }, width: 1, height: 1, targetArea: 'house17_interior', targetPosition: { x: 5, y: 6 } },
    { id: 'enter_house18', position: { x: 72, y: 7 }, width: 1, height: 1, targetArea: 'house18_interior', targetPosition: { x: 5, y: 6 } },
    { id: 'enter_house19', position: { x: 76, y: 7 }, width: 1, height: 1, targetArea: 'house19_interior', targetPosition: { x: 5, y: 6 } },
    { id: 'enter_house20', position: { x: 80, y: 7 }, width: 1, height: 1, targetArea: 'house20_interior', targetPosition: { x: 5, y: 6 } },
    { id: 'enter_house21', position: { x: 84, y: 7 }, width: 1, height: 1, targetArea: 'house21_interior', targetPosition: { x: 5, y: 6 } },
    { id: 'enter_house22', position: { x: 88, y: 7 }, width: 1, height: 1, targetArea: 'house22_interior', targetPosition: { x: 5, y: 6 } },
    { id: 'enter_house23', position: { x: 92, y: 7 }, width: 1, height: 1, targetArea: 'house23_interior', targetPosition: { x: 5, y: 6 } },
    { id: 'enter_house24', position: { x: 96, y: 7 }, width: 1, height: 1, targetArea: 'house24_interior', targetPosition: { x: 5, y: 6 } },
    { id: 'enter_house25', position: { x: 100, y: 7 }, width: 1, height: 1, targetArea: 'house25_interior', targetPosition: { x: 5, y: 6 } },
    { id: 'enter_house26', position: { x: 104, y: 7 }, width: 1, height: 1, targetArea: 'house26_interior', targetPosition: { x: 5, y: 6 } },
    { id: 'enter_house27', position: { x: 108, y: 7 }, width: 1, height: 1, targetArea: 'house27_interior', targetPosition: { x: 5, y: 6 } },
    { id: 'enter_house28', position: { x: 112, y: 7 }, width: 1, height: 1, targetArea: 'house28_interior', targetPosition: { x: 5, y: 6 } },
    { id: 'enter_house29', position: { x: 116, y: 7 }, width: 1, height: 1, targetArea: 'house29_interior', targetPosition: { x: 5, y: 6 } },
    { id: 'enter_house30', position: { x: 120, y: 7 }, width: 1, height: 1, targetArea: 'house30_interior', targetPosition: { x: 5, y: 6 } },
  ],
  backgroundColor: '#2a2a1a', // Dark ground for battle arena
};

// ========================================
// BATTLE ROW HOUSE INTERIORS (30 houses)
// ========================================

/**
 * House Interior Configuration
 * Maps house number to rewards (equipment + djinn)
 */
const HOUSE_REWARDS = {
  1: { equipment: [WOODEN_SWORD, CLOTH_CAP], gold: 50, djinn: null },
  2: { equipment: [BRONZE_SWORD, LEATHER_VEST], gold: 75, djinn: 'flint' },
  3: { equipment: [IRON_SWORD, BRONZE_ARMOR], gold: 100, djinn: null },
  4: { equipment: [STEEL_SWORD, IRON_ARMOR], gold: 150, djinn: 'granite' },
  5: { equipment: [SILVER_BLADE, STEEL_ARMOR], gold: 200, djinn: null },
  6: { equipment: [MACE, IRON_HELM], gold: 125, djinn: 'bane' },
  7: { equipment: [HEAVY_MACE, STEEL_HELM], gold: 175, djinn: null },
  8: { equipment: [WOODEN_AXE, SILVER_CIRCLET], gold: 225, djinn: 'forge' },
  9: { equipment: [BATTLE_AXE, MYTHRIL_CROWN], gold: 250, djinn: null },
  10: { equipment: [GREAT_AXE, LEATHER_BOOTS], gold: 300, djinn: 'corona' },
  11: { equipment: [WOODEN_STAFF, HYPER_BOOTS], gold: 100, djinn: null },
  12: { equipment: [MAGIC_ROD, COTTON_SHIRT], gold: 125, djinn: 'fury' },
  13: { equipment: [SHAMAN_ROD, BRONZE_HELM], gold: 150, djinn: null },
  14: { equipment: [CRYSTAL_ROD, SILVER_ARMOR], gold: 200, djinn: 'fizz' },
  15: { equipment: [DEMON_MACE, MYTHRIL_ARMOR], gold: 250, djinn: null },
  16: { equipment: [TITANS_AXE, DRAGON_SCALES], gold: 350, djinn: 'tonic' },
  17: { equipment: [MYTHRIL_BLADE, LEATHER_CAP], gold: 300, djinn: null },
  18: { equipment: [GAIA_BLADE, BRONZE_ARMOR], gold: 400, djinn: 'crystal' },
  19: { equipment: [SOL_BLADE, STEEL_ARMOR], gold: 500, djinn: null },
  20: { equipment: [IRON_SWORD, SILVER_ARMOR], gold: 200, djinn: 'breeze' },
  21: { equipment: [STEEL_SWORD, MYTHRIL_ARMOR], gold: 275, djinn: null },
  22: { equipment: [SILVER_BLADE, IRON_HELM], gold: 325, djinn: 'squall' },
  23: { equipment: [MACE, STEEL_HELM], gold: 175, djinn: null },
  24: { equipment: [HEAVY_MACE, SILVER_CIRCLET], gold: 225, djinn: 'storm' },
  25: { equipment: [WOODEN_AXE, MYTHRIL_CROWN], gold: 250, djinn: null },
  26: { equipment: [BATTLE_AXE, LEATHER_BOOTS], gold: 300, djinn: null },
  27: { equipment: [GREAT_AXE, HYPER_BOOTS], gold: 350, djinn: null },
  28: { equipment: [TITANS_AXE, COTTON_SHIRT], gold: 400, djinn: null },
  29: { equipment: [DEMON_MACE, BRONZE_HELM], gold: 450, djinn: null },
  30: { equipment: [SOL_BLADE, DRAGON_SCALES], gold: 600, djinn: null },
};

/**
 * Generate house interior area
 */
function createHouseInterior(
  houseNum: number,
  npcData: { id: string; name: string; sprite: string; dialogue: string; battleEnemies: string[] }
): Area {
  const rewards = HOUSE_REWARDS[houseNum as keyof typeof HOUSE_REWARDS];

  return {
    id: `house${houseNum}_interior` as any,
    name: `${npcData.name}'s House`,
    type: 'town',
    width: 10,
    height: 8,
    hasRandomEncounters: false,
    bosses: [],
    treasures: [],
    npcs: [
      {
        id: `${npcData.id}-interior`,
        name: npcData.name,
        position: { x: 5, y: 3 },
        sprite: npcData.sprite,
        blocking: true,
        dialogue: npcData.dialogue,
        battleOnInteract: npcData.battleEnemies as any,
        battleOnlyOnce: false,
        battleRewards: rewards
          ? {
              gold: rewards.gold,
              equipment: rewards.equipment,
              djinnId: rewards.djinn || undefined,
            }
          : undefined,
      },
    ],
    buildings: [],
    scenery: rewards.equipment.map((_equip, idx) => ({
      id: `reward-display-${idx}`,
      position: { x: 3 + idx * 2, y: 2 },
      sprite: '/sprites/icons/items/treasure-chest.gif', // Placeholder for equipment display
      blocking: false,
      layer: 'foreground' as const,
    })).concat(
      rewards.djinn
        ? [{
            id: 'djinn-display',
            position: { x: 5, y: 1 },
            sprite: `/sprites/battle/djinn/${rewards.djinn === 'flint' || rewards.djinn === 'granite' || rewards.djinn === 'bane' ? 'Venus' : rewards.djinn === 'forge' || rewards.djinn === 'corona' || rewards.djinn === 'fury' ? 'Mars' : rewards.djinn === 'fizz' || rewards.djinn === 'tonic' || rewards.djinn === 'crystal' ? 'Mercury' : 'Jupiter'}_Djinn_Front.gif`,
            blocking: false,
            layer: 'foreground' as const,
          }]
        : []
    ),
    exits: [
      {
        id: 'exit',
        position: { x: 4, y: 7 },
        width: 2,
        height: 1,
        targetArea: 'battle_row',
        targetPosition: { x: houseNum * 4, y: 7 }, // Return to house position
      },
    ],
    backgroundColor: '#4a3020', // Wood interior
  };
}

// Generate all 30 house interiors
const HOUSE1_INTERIOR = createHouseInterior(1, {
  id: 'house1-skeleton-tamer',
  name: 'Skeleton Tamer',
  sprite: '/sprites/overworld/minornpcs/Villager-1.gif',
  dialogue: 'I raise undead warriors for battle! Test your skills!',
  battleEnemies: ['skeleton', 'zombie'],
});

const HOUSE2_INTERIOR = createHouseInterior(2, {
  id: 'house2-zombie-keeper',
  name: 'Zombie Keeper',
  sprite: '/sprites/overworld/minornpcs/Villager-2.gif',
  dialogue: 'I capture undead creatures for the arena. Let me show you my collection!',
  battleEnemies: ['skeleton', 'zombie', 'ghoul'],
});

const HOUSE3_INTERIOR = createHouseInterior(3, {
  id: 'house3-garet',
  name: 'Garet',
  sprite: '/sprites/overworld/protagonists/Garet.gif',
  dialogue: 'Garet here! My fire spirits fight for me. Show me what you\'ve got!',
  battleEnemies: ['salamander', 'fire-worm', 'imp', 'demon-imp'],
});

const HOUSE4_INTERIOR = createHouseInterior(4, {
  id: 'house4-insect-collector',
  name: 'Insect Collector',
  sprite: '/sprites/overworld/minornpcs/Villager-3.gif',
  dialogue: 'My rare bug collection fights in the arena! Witness their power!',
  battleEnemies: ['ant-lion', 'flash-ant', 'hornet', 'drone-bee'],
});

const HOUSE5_INTERIOR = createHouseInterior(5, {
  id: 'house5-slime-rancher',
  name: 'Slime Rancher',
  sprite: '/sprites/overworld/minornpcs/Villager-4.gif',
  dialogue: 'These are the strongest slimes in all the land! Prove me wrong!',
  battleEnemies: ['ooze', 'slime-beast', 'slime'],
});

const HOUSE6_INTERIOR = createHouseInterior(6, {
  id: 'house6-lizard-keeper',
  name: 'Lizard Keeper',
  sprite: '/sprites/overworld/minornpcs/Villager-5.gif',
  dialogue: 'My combat-trained lizards are unbeatable! Take them on!',
  battleEnemies: ['lizard-man', 'lizard-fighter', 'thunder-lizard', 'earth-lizard'],
});

const HOUSE7_INTERIOR = createHouseInterior(7, {
  id: 'house7-mia',
  name: 'Mia',
  sprite: '/sprites/overworld/protagonists/Mia.gif',
  dialogue: 'I am Mia, healer and ice mage. My water spirits will test your resolve!',
  battleEnemies: ['ooze', 'slime-beast', 'merman', 'gillman'],
});

const HOUSE8_INTERIOR = createHouseInterior(8, {
  id: 'house8-zen-master',
  name: 'Zen Master',
  sprite: '/sprites/overworld/minornpcs/Monk_sitting.gif',
  dialogue: 'Through meditation, I command spirits. Face my inner demons!',
  battleEnemies: ['ghost', 'spirit', 'will-head', 'wraith'],
});

const HOUSE9_INTERIOR = createHouseInterior(9, {
  id: 'house9-elemental-summoner',
  name: 'Elemental Summoner',
  sprite: '/sprites/overworld/minornpcs/Villager-6.gif',
  dialogue: 'I summon elementals from all realms! Can you withstand their power?',
  battleEnemies: ['gnome-wizard', 'demon-imp', 'willowisp', 'pixie'],
});

const HOUSE10_INTERIOR = createHouseInterior(10, {
  id: 'house10-kraden',
  name: 'Kraden',
  sprite: '/sprites/overworld/protagonists/Kraden.gif',
  dialogue: 'Ah, a visitor! I am Kraden, alchemist and researcher. My elemental test awaits you!',
  battleEnemies: ['gnome-wizard', 'demon-imp', 'willowisp', 'merman'],
});

const HOUSE11_INTERIOR = createHouseInterior(11, {
  id: 'house11-rat-breeder',
  name: 'Rat Breeder',
  sprite: '/sprites/overworld/minornpcs/Villager-7.gif',
  dialogue: 'My trained rats are fierce fighters! Face them!',
  battleEnemies: ['rat', 'armored-rat', 'rat-fighter'],
});

const HOUSE12_INTERIOR = createHouseInterior(12, {
  id: 'house12-bat-handler',
  name: 'Bat Handler',
  sprite: '/sprites/overworld/minornpcs/Villager-8.gif',
  dialogue: 'My bats will overwhelm you!',
  battleEnemies: ['bat', 'rabid-bat', 'bat'],
});

const HOUSE13_INTERIOR = createHouseInterior(13, {
  id: 'house13-spider-tamer',
  name: 'Spider Tamer',
  sprite: '/sprites/overworld/minornpcs/Villager-9.gif',
  dialogue: 'Spiders are the ultimate predators!',
  battleEnemies: ['spider', 'tarantula', 'recluse'],
});

const HOUSE14_INTERIOR = createHouseInterior(14, {
  id: 'house14-goblin-wrangler',
  name: 'Goblin Wrangler',
  sprite: '/sprites/overworld/minornpcs/Villager-10.gif',
  dialogue: 'Goblins may be small, but they fight dirty!',
  battleEnemies: ['goblin', 'hobgoblin', 'mini-goblin'],
});

const HOUSE15_INTERIOR = createHouseInterior(15, {
  id: 'house15-pest-exterminator',
  name: 'Pest Exterminator',
  sprite: '/sprites/overworld/minornpcs/Villager-11.gif',
  dialogue: 'I know all the pests! Let me introduce you!',
  battleEnemies: ['vermin', 'roach', 'grub'],
});

const HOUSE16_INTERIOR = createHouseInterior(16, {
  id: 'house16-hound-trainer',
  name: 'Hound Trainer',
  sprite: '/sprites/overworld/minornpcs/Villager-12.gif',
  dialogue: 'My war hounds are unstoppable!',
  battleEnemies: ['wild-wolf', 'wild-dog', 'hell-hound'],
});

const HOUSE17_INTERIOR = createHouseInterior(17, {
  id: 'house17-bee-keeper',
  name: 'Bee Keeper',
  sprite: '/sprites/overworld/minornpcs/Villager-13.gif',
  dialogue: 'Beware the swarm!',
  battleEnemies: ['drone-bee', 'warrior-bee', 'hornet'],
});

const HOUSE18_INTERIOR = createHouseInterior(18, {
  id: 'house18-ant-farmer',
  name: 'Ant Farmer',
  sprite: '/sprites/overworld/minornpcs/Villager-14.gif',
  dialogue: 'My ant colony will bury you!',
  battleEnemies: ['flash-ant', 'ant-lion', 'flash-ant'],
});

const HOUSE19_INTERIOR = createHouseInterior(19, {
  id: 'house19-toad-collector',
  name: 'Toad Collector',
  sprite: '/sprites/overworld/minornpcs/Villager-15.gif',
  dialogue: 'Toxic toads are my specialty!',
  battleEnemies: ['toad', 'poison-toad', 'toad'],
});

const HOUSE20_INTERIOR = createHouseInterior(20, {
  id: 'house20-mole-handler',
  name: 'Mole Handler',
  sprite: '/sprites/overworld/minornpcs/Villager-16.gif',
  dialogue: 'Underground warriors attack!',
  battleEnemies: ['giant-mole', 'giant-mole', 'grub'],
});

const HOUSE21_INTERIOR = createHouseInterior(21, {
  id: 'house21-aqua-specialist',
  name: 'Aqua Specialist',
  sprite: '/sprites/overworld/minornpcs/Villager-17.gif',
  dialogue: 'Water creatures are the strongest!',
  battleEnemies: ['merman', 'gillman', 'ooze'],
});

const HOUSE22_INTERIOR = createHouseInterior(22, {
  id: 'house22-fire-trainer',
  name: 'Fire Trainer',
  sprite: '/sprites/overworld/minornpcs/Villager-18.gif',
  dialogue: 'Feel the burn!',
  battleEnemies: ['salamander', 'fire-worm', 'imp'],
});

const HOUSE23_INTERIOR = createHouseInterior(23, {
  id: 'house23-earth-defender',
  name: 'Earth Defender',
  sprite: '/sprites/overworld/minornpcs/Villager-19.gif',
  dialogue: 'Earth creatures are impenetrable!',
  battleEnemies: ['gnome', 'earth-golem', 'gargoyle'],
});

const HOUSE24_INTERIOR = createHouseInterior(24, {
  id: 'house24-wind-caller',
  name: 'Wind Caller',
  sprite: '/sprites/overworld/minornpcs/Villager-20.gif',
  dialogue: 'The wind obeys my command!',
  battleEnemies: ['willowisp', 'pixie', 'wind-wisp'],
});

const HOUSE25_INTERIOR = createHouseInterior(25, {
  id: 'house25-ghost-hunter',
  name: 'Ghost Hunter',
  sprite: '/sprites/overworld/minornpcs/Villager-21.gif',
  dialogue: 'I hunt ghosts, but I also command them!',
  battleEnemies: ['ghost', 'spirit', 'wraith'],
});

const HOUSE26_INTERIOR = createHouseInterior(26, {
  id: 'house26-beast-master',
  name: 'Beast Master',
  sprite: '/sprites/overworld/minornpcs/Villager22.gif',
  dialogue: 'I command the legendary beasts! Face them!',
  battleEnemies: ['chimera', 'phoenix', 'fenrir'],
});

const HOUSE27_INTERIOR = createHouseInterior(27, {
  id: 'house27-elite-summoner',
  name: 'Elite Summoner',
  sprite: '/sprites/overworld/minornpcs/Scholar-1.gif',
  dialogue: 'My elite monsters will test your strength!',
  battleEnemies: ['grand-chimera', 'hydra', 'grand-golem'],
});

const HOUSE28_INTERIOR = createHouseInterior(28, {
  id: 'house28-undead-master',
  name: 'Undead Master',
  sprite: '/sprites/overworld/minornpcs/Scholar-2.gif',
  dialogue: 'Rise, my undead servants! Crush them!',
  battleEnemies: ['lich', 'orc-lord', 'minotaur'],
});

const HOUSE29_INTERIOR = createHouseInterior(29, {
  id: 'house29-legendary-trainer',
  name: 'Legendary Trainer',
  sprite: '/sprites/overworld/minornpcs/MartialArtist1.gif',
  dialogue: 'Face the ultimate challenge!',
  battleEnemies: ['grand-chimera', 'hydra', 'lich'],
});

const HOUSE30_INTERIOR = createHouseInterior(30, {
  id: 'house30-champion',
  name: 'Champion Trainer',
  sprite: '/sprites/overworld/minornpcs/MartialArtist2.gif',
  dialogue: 'You\'ve come far. Face my ultimate team!',
  battleEnemies: ['grand-golem', 'grand-chimera', 'hydra'],
});

/**
 * All areas indexed by ID
 */
export const ALL_AREAS: Record<string, Area> = {
  vale_village: VALE_VILLAGE,
  forest_path: FOREST_PATH,
  ancient_ruins: ANCIENT_RUINS,
  battle_row: BATTLE_ROW,
  house1_interior: HOUSE1_INTERIOR,
  house2_interior: HOUSE2_INTERIOR,
  house3_interior: HOUSE3_INTERIOR,
  house4_interior: HOUSE4_INTERIOR,
  house5_interior: HOUSE5_INTERIOR,
  house6_interior: HOUSE6_INTERIOR,
  house7_interior: HOUSE7_INTERIOR,
  house8_interior: HOUSE8_INTERIOR,
  house9_interior: HOUSE9_INTERIOR,
  house10_interior: HOUSE10_INTERIOR,
  house11_interior: HOUSE11_INTERIOR,
  house12_interior: HOUSE12_INTERIOR,
  house13_interior: HOUSE13_INTERIOR,
  house14_interior: HOUSE14_INTERIOR,
  house15_interior: HOUSE15_INTERIOR,
  house16_interior: HOUSE16_INTERIOR,
  house17_interior: HOUSE17_INTERIOR,
  house18_interior: HOUSE18_INTERIOR,
  house19_interior: HOUSE19_INTERIOR,
  house20_interior: HOUSE20_INTERIOR,
  house21_interior: HOUSE21_INTERIOR,
  house22_interior: HOUSE22_INTERIOR,
  house23_interior: HOUSE23_INTERIOR,
  house24_interior: HOUSE24_INTERIOR,
  house25_interior: HOUSE25_INTERIOR,
  house26_interior: HOUSE26_INTERIOR,
  house27_interior: HOUSE27_INTERIOR,
  house28_interior: HOUSE28_INTERIOR,
  house29_interior: HOUSE29_INTERIOR,
  house30_interior: HOUSE30_INTERIOR,
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
