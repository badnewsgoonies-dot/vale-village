/**
 * NPC Dialogue Trees
 *
 * Contains all dialogue data for NPCs in Vale Village and beyond.
 * Also includes story scenes (intro, chapters, battle contexts).
 */

import type { DialogueTree } from '@/types/Dialogue';
import { storyScenes } from '../../story';

/**
 * Elder - Introduces the game, provides tutorial guidance
 */
const elderDialogue: DialogueTree = {
  npcId: 'elder',
  startNode: 'greeting',
  nodes: {
    greeting: {
      id: 'greeting',
      speaker: 'Elder',
      text: 'Welcome to Vale Village, young warrior. I am the village Elder. The Sol Sanctum behind me holds ancient secrets of Alchemy.',
      portrait: '/sprites/overworld/majornpcs/Elder.gif',
      choices: [
        { text: 'Tell me about Alchemy.', nextNode: 'about_alchemy' },
        { text: 'What should I do?', nextNode: 'what_to_do' },
        { text: 'Goodbye.', nextNode: 'goodbye', action: { type: 'END_DIALOGUE' } },
      ],
    },
    about_alchemy: {
      id: 'about_alchemy',
      speaker: 'Elder',
      text: 'Alchemy is the ancient art of wielding the four elements: Venus, Mars, Mercury, and Jupiter. Adepts like yourself can channel this power through Psynergy.',
      portrait: '/sprites/overworld/majornpcs/Elder.gif',
      choices: [
        { text: 'How do I use Psynergy?', nextNode: 'psynergy_tutorial' },
        { text: 'Tell me more.', nextNode: 'djinn_info' },
        { text: 'I understand.', nextNode: 'greeting' },
      ],
    },
    psynergy_tutorial: {
      id: 'psynergy_tutorial',
      speaker: 'Elder',
      text: 'Each unit has unique Psynergy abilities that unlock as they level up. In battle, select an ability from your command menu to unleash its power!',
      portrait: '/sprites/overworld/majornpcs/Elder.gif',
      nextNode: 'greeting',
    },
    djinn_info: {
      id: 'djinn_info',
      speaker: 'Elder',
      text: 'Seek out the mystical Djinn! These elemental beings grant incredible power. Equip them to your team to boost stats and unlock ultimate abilities.',
      portrait: '/sprites/overworld/majornpcs/Elder.gif',
      nextNode: 'greeting',
    },
    what_to_do: {
      id: 'what_to_do',
      speaker: 'Elder',
      text: 'Vale Village is peaceful now, but you should prepare yourself. Train with the other villagers, equip yourself at the shop, and explore the sanctum when ready.',
      portrait: '/sprites/overworld/majornpcs/Elder.gif',
      action: { type: 'SET_FLAG', flag: 'talked_to_elder_first_time', value: true },
      nextNode: 'greeting',
    },
    goodbye: {
      id: 'goodbye',
      speaker: 'Elder',
      text: 'May the elements guide you, young warrior.',
      portrait: '/sprites/overworld/majornpcs/Elder.gif',
      action: { type: 'END_DIALOGUE' },
    },
  },
};

/**
 * Garet - Recruitable party member, offers training battle
 */
const garetDialogue: DialogueTree = {
  npcId: 'garet',
  startNode: 'first_meeting',
  nodes: {
    first_meeting: {
      id: 'first_meeting',
      speaker: 'Garet',
      text: 'Hey there! I\'m Garet, Venus Adept and master of Mars Psynergy. Want to test your skills in a friendly battle?',
      portrait: '/sprites/overworld/protagonists/Garet.gif',
      choices: [
        { text: 'Let\'s battle!', nextNode: 'accept_battle' },
        { text: 'Not right now.', nextNode: 'decline_battle' },
        { text: 'Who are you?', nextNode: 'about_garet' },
      ],
    },
    about_garet: {
      id: 'about_garet',
      speaker: 'Garet',
      text: 'I\'m one of Vale\'s strongest warriors! I specialize in fire-based Psynergy and physical attacks. If you beat me, I\'ll join your party!',
      portrait: '/sprites/overworld/protagonists/Garet.gif',
      nextNode: 'first_meeting',
    },
    accept_battle: {
      id: 'accept_battle',
      speaker: 'Garet',
      text: 'Alright! Show me what you\'ve got!',
      portrait: '/sprites/overworld/protagonists/Garet.gif',
      action: {
        type: 'START_BATTLE',
        enemyUnitIds: ['garet'],
        onVictory: 'battle_won',
      },
    },
    battle_won: {
      id: 'battle_won',
      speaker: 'Garet',
      text: 'Wow! You\'re stronger than I thought! Alright, I\'ll join you on your adventure!',
      portrait: '/sprites/overworld/protagonists/Garet.gif',
      action: { type: 'RECRUIT_UNIT', unitId: 'garet' },
      nextNode: 'already_recruited',
    },
    decline_battle: {
      id: 'decline_battle',
      speaker: 'Garet',
      text: 'No problem! Come find me when you\'re ready to battle!',
      portrait: '/sprites/overworld/protagonists/Garet.gif',
      action: { type: 'END_DIALOGUE' },
    },
    already_recruited: {
      id: 'already_recruited',
      speaker: 'Garet',
      text: 'Ready to explore Sol Sanctum? Let\'s go when you are!',
      portrait: '/sprites/overworld/protagonists/Garet.gif',
      condition: (flags) => flags.talked_to_elder_first_time,
      choices: [
        { text: 'Let\'s go!', nextNode: 'goodbye', action: { type: 'END_DIALOGUE' } },
        { text: 'Not yet.', nextNode: 'goodbye', action: { type: 'END_DIALOGUE' } },
      ],
    },
    goodbye: {
      id: 'goodbye',
      speaker: 'Garet',
      text: 'See you around!',
      portrait: '/sprites/overworld/protagonists/Garet.gif',
      action: { type: 'END_DIALOGUE' },
    },
  },
};

/**
 * Jenna - Friendly villager, provides lore
 */
const jennaDialogue: DialogueTree = {
  npcId: 'jenna',
  startNode: 'greeting',
  nodes: {
    greeting: {
      id: 'greeting',
      speaker: 'Jenna',
      text: 'Hi there! I\'m Jenna. Be careful out there - the world beyond Vale can be dangerous!',
      portrait: '/sprites/overworld/protagonists/Jenna.gif',
      choices: [
        { text: 'What dangers?', nextNode: 'about_dangers' },
        { text: 'Thanks for the warning.', nextNode: 'goodbye', action: { type: 'END_DIALOGUE' } },
      ],
    },
    about_dangers: {
      id: 'about_dangers',
      speaker: 'Jenna',
      text: 'I\'ve heard there are monsters in the forest paths and ancient ruins nearby. Make sure you\'re well equipped before venturing out!',
      portrait: '/sprites/overworld/protagonists/Jenna.gif',
      nextNode: 'greeting',
    },
    goodbye: {
      id: 'goodbye',
      speaker: 'Jenna',
      text: 'Stay safe!',
      portrait: '/sprites/overworld/protagonists/Jenna.gif',
      action: { type: 'END_DIALOGUE' },
    },
  },
};

/**
 * Kraden - Scholar, provides Djinn information
 */
const kradenDialogue: DialogueTree = {
  npcId: 'kraden',
  startNode: 'greeting',
  nodes: {
    greeting: {
      id: 'greeting',
      speaker: 'Kraden',
      text: 'Ah, hello! I am Kraden, scholar of ancient Alchemy. The Psynergy Stones you see around Vale are fascinating relics!',
      portrait: '/sprites/overworld/protagonists/Kraden.gif',
      choices: [
        { text: 'Tell me about Psynergy Stones.', nextNode: 'about_stones' },
        { text: 'What are Djinn?', nextNode: 'about_djinn' },
        { text: 'Goodbye.', nextNode: 'goodbye', action: { type: 'END_DIALOGUE' } },
      ],
    },
    about_stones: {
      id: 'about_stones',
      speaker: 'Kraden',
      text: 'Psynergy Stones can restore your PP - the energy needed to cast Psynergy abilities. Simply interact with one to refill your power!',
      portrait: '/sprites/overworld/protagonists/Kraden.gif',
      nextNode: 'greeting',
    },
    about_djinn: {
      id: 'about_djinn',
      speaker: 'Kraden',
      text: 'Djinn are elemental spirits that bond with Adepts. Equip them to your team for stat bonuses! Three Djinn of the same element grant immense power!',
      portrait: '/sprites/overworld/protagonists/Kraden.gif',
      nextNode: 'greeting',
    },
    goodbye: {
      id: 'goodbye',
      speaker: 'Kraden',
      text: 'Happy researching!',
      portrait: '/sprites/overworld/protagonists/Kraden.gif',
      action: { type: 'END_DIALOGUE' },
    },
  },
};

/**
 * Weaponshop Owner - Shop access, optional battle
 */
const weaponshopOwnerDialogue: DialogueTree = {
  npcId: 'weaponshop-owner',
  startNode: 'greeting',
  nodes: {
    greeting: {
      id: 'greeting',
      speaker: 'Shopkeeper',
      text: 'Welcome to Vale\'s finest weapon and armor shop! Need some gear?',
      portrait: '/sprites/overworld/majornpcs/Weaponshop_Owner.gif',
      choices: [
        { text: 'Show me your wares.', nextNode: 'open_shop' },
        { text: 'Can I test equipment first?', nextNode: 'test_offer' },
        { text: 'Just browsing.', nextNode: 'goodbye', action: { type: 'END_DIALOGUE' } },
      ],
    },
    open_shop: {
      id: 'open_shop',
      speaker: 'Shopkeeper',
      text: 'Here\'s what I have in stock!',
      portrait: '/sprites/overworld/majornpcs/Weaponshop_Owner.gif',
      action: { type: 'OPEN_SHOP', shopType: 'equipment' },
    },
    test_offer: {
      id: 'test_offer',
      speaker: 'Shopkeeper',
      text: 'Hah! A warrior who wants to test before buying. I like that! Battle me and if you win, I\'ll give you a discount!',
      portrait: '/sprites/overworld/majornpcs/Weaponshop_Owner.gif',
      choices: [
        { text: 'Let\'s battle!', nextNode: 'accept_battle' },
        { text: 'Maybe later.', nextNode: 'greeting' },
      ],
    },
    accept_battle: {
      id: 'accept_battle',
      speaker: 'Shopkeeper',
      text: 'Alright! Let me show you the power of a well-equipped warrior!',
      portrait: '/sprites/overworld/majornpcs/Weaponshop_Owner.gif',
      action: {
        type: 'START_BATTLE',
        enemyUnitIds: ['kyle'], // Kyle is defined in unitDefinitions
        onVictory: 'battle_won',
      },
    },
    battle_won: {
      id: 'battle_won',
      speaker: 'Shopkeeper',
      text: 'Impressive! You\'ve earned my respect. Here, take 50 gold as a reward!',
      portrait: '/sprites/overworld/majornpcs/Weaponshop_Owner.gif',
      action: { type: 'GIVE_GOLD', amount: 50 },
      nextNode: 'greeting',
    },
    goodbye: {
      id: 'goodbye',
      speaker: 'Shopkeeper',
      text: 'Come back anytime!',
      portrait: '/sprites/overworld/majornpcs/Weaponshop_Owner.gif',
      action: { type: 'END_DIALOGUE' },
    },
  },
};

/**
 * Innkeeper - Inn services
 */
const innkeeperDialogue: DialogueTree = {
  npcId: 'innkeeper',
  startNode: 'greeting',
  nodes: {
    greeting: {
      id: 'greeting',
      speaker: 'Innkeeper',
      text: 'Welcome to the Vale Inn! A good night\'s rest costs 10 gold. Would you like to stay?',
      portrait: '/sprites/overworld/majornpcs/Innkeeper.gif',
      choices: [
        { text: 'Yes, I\'ll rest.', nextNode: 'rest' },
        { text: 'Not right now.', nextNode: 'goodbye', action: { type: 'END_DIALOGUE' } },
      ],
    },
    rest: {
      id: 'rest',
      speaker: 'Innkeeper',
      text: 'Have a good rest! Your HP and PP have been restored.',
      portrait: '/sprites/overworld/majornpcs/Innkeeper.gif',
      action: { type: 'OPEN_SHOP', shopType: 'inn' },
      nextNode: 'goodbye',
    },
    goodbye: {
      id: 'goodbye',
      speaker: 'Innkeeper',
      text: 'Come back anytime!',
      portrait: '/sprites/overworld/majornpcs/Innkeeper.gif',
      action: { type: 'END_DIALOGUE' },
    },
  },
};

/**
 * Minor villagers - Simple greetings
 */
const villager1Dialogue: DialogueTree = {
  npcId: 'villager-1',
  startNode: 'greeting',
  nodes: {
    greeting: {
      id: 'greeting',
      speaker: 'Villager',
      text: 'Beautiful day in Vale, isn\'t it? The weather has been perfect lately!',
      choices: [
        { text: 'Indeed it is!', nextNode: 'goodbye', action: { type: 'END_DIALOGUE' } },
        { text: 'Goodbye.', nextNode: 'goodbye', action: { type: 'END_DIALOGUE' } },
      ],
    },
    goodbye: {
      id: 'goodbye',
      speaker: 'Villager',
      text: 'Have a great day!',
      action: { type: 'END_DIALOGUE' },
    },
  },
};

const villager2Dialogue: DialogueTree = {
  npcId: 'villager-2',
  startNode: 'greeting',
  nodes: {
    greeting: {
      id: 'greeting',
      speaker: 'Villager',
      text: 'I heard there are monsters near the forest paths. Be careful if you venture out there!',
      choices: [
        { text: 'Thanks for the warning!', nextNode: 'goodbye', action: { type: 'END_DIALOGUE' } },
        { text: 'I can handle it.', nextNode: 'brave', },
      ],
    },
    brave: {
      id: 'brave',
      speaker: 'Villager',
      text: 'That\'s the spirit! Just make sure you\'re well equipped.',
      action: { type: 'END_DIALOGUE' },
    },
    goodbye: {
      id: 'goodbye',
      speaker: 'Villager',
      text: 'Stay safe!',
      action: { type: 'END_DIALOGUE' },
    },
  },
};

/**
 * Isaac - Protagonist's internal monologue on arriving in town
 */
const isaacArrivalDialogue: DialogueTree = {
  npcId: 'isaac_arrival',
  startNode: 'arrival',
  nodes: {
    arrival: {
      id: 'arrival',
      speaker: 'Isaac',
      text: 'Wow, this place is big. I wonder what\'s happening around town...',
      portrait: '/sprites/overworld/protagonists/Isaac.gif',
      action: { type: 'END_DIALOGUE' },
    },
  },
};

/**
 * First Djinn - The mystical being who reveals the truth
 */
const firstDjinnDialogue: DialogueTree = {
  npcId: 'first_djinn',
  startNode: 'appear',
  nodes: {
    appear: {
      id: 'appear',
      speaker: 'Djinn',
      text: 'My God, I\'ve been waiting forever for you to come!',
      // Camera: Auto shake + 2.0x zoom (Djinn speaker)
      portrait: '/sprites/djinn/Venus/Flint.gif',
      nextNode: 'isaac_confused',
    },
    isaac_confused: {
      id: 'isaac_confused',
      speaker: 'Isaac',
      text: 'Sorry, what did you say? And what the heck even are you?',
      portrait: '/sprites/overworld/protagonists/Isaac.gif',
      nextNode: 'urgency',
    },
    urgency: {
      id: 'urgency',
      speaker: 'Djinn',
      text: 'There\'s no time! You are the hero that we need, and your moment has come. Let me explain...',
      // Camera: Still 2.0x zoom (Djinn speaker)
      portrait: '/sprites/djinn/Venus/Flint.gif',
      nextNode: 'actually_time',
    },
    actually_time: {
      id: 'actually_time',
      speaker: 'Djinn',
      text: 'Actually, there is time. This world is full of injustice. These so-called "monsters" - or so they have become - are enslaved to work and do battle.',
      // Camera: 2.0x zoom (keywords: "injustice" + "enslaved")
      portrait: '/sprites/djinn/Venus/Flint.gif',
      nextNode: 'the_master',
    },
    the_master: {
      id: 'the_master',
      speaker: 'Djinn',
      text: 'They all serve the master in the castle, and nobody has been able to stop this. The only way to reach him is through a near-impossible trial of battles to your right.',
      // Camera: 1.5x zoom (keyword: "master")
      portrait: '/sprites/djinn/Venus/Flint.gif',
      nextNode: 'the_legend',
    },
    the_legend: {
      id: 'the_legend',
      speaker: 'Djinn',
      text: 'But the legend has foretold - you are the chosen one! I shall join your team, and together we will be the saviors.',
      // Camera: 2.0x zoom (Djinn speaker)
      portrait: '/sprites/djinn/Venus/Flint.gif',
      nextNode: 'lets_begin',
    },
    lets_begin: {
      id: 'lets_begin',
      speaker: 'Djinn',
      text: 'Let\'s enter the first challenge together and get this journey started!',
      // Camera: Still zoomed
      portrait: '/sprites/djinn/Venus/Flint.gif',
      action: { type: 'SET_FLAG', flag: 'obtained_djinn_flint', value: true },
      nextNode: 'isaac_response',
    },
    isaac_response: {
      id: 'isaac_response',
      speaker: 'Isaac',
      text: 'I ain\'t got nothing better to do today.',
      portrait: '/sprites/overworld/protagonists/Isaac.gif',
      nextNode: 'djinn_merge',
    },
    djinn_merge: {
      id: 'djinn_merge',
      speaker: 'Djinn',
      text: '*The Djinn glows brightly and leaps into Isaac\'s body, merging with his spirit!*',
      // Camera: Shake + zoom for the merge
      portrait: '/sprites/djinn/Venus/Flint.gif',
      action: { type: 'SET_FLAG', flag: 'obtained_djinn_flint', value: true },
      nextNode: 'merge_complete',
    },
    merge_complete: {
      id: 'merge_complete',
      speaker: 'Isaac',
      text: 'Whoa! I can feel its power flowing through me!',
      portrait: '/sprites/overworld/protagonists/Isaac.gif',
      action: { type: 'NAVIGATE', screen: 'OVERWORLD' },
    },
  },
};

/**
 * Game Tutorial - Comprehensive introduction to game systems
 */
const gameTutorialDialogue: DialogueTree = {
  npcId: 'game_tutorial',
  startNode: 'welcome',
  nodes: {
    welcome: {
      id: 'welcome',
      speaker: 'Tutorial',
      text: 'Hello! Welcome to this epic battle. In this game, you have units to start with, but there are many others to be recruited - each with intricate abilities and ready to be geared up with the best weapons and armor.',
      nextNode: 'menu_intro',
    },
    menu_intro: {
      id: 'menu_intro',
      speaker: 'Tutorial',
      text: 'Let me show you the main menu options available to you. You can access these from the overworld at any time.',
      nextNode: 'party_menu',
    },
    party_menu: {
      id: 'party_menu',
      speaker: 'Tutorial',
      text: 'PARTY MANAGEMENT: Here you can view all your recruited units and swap between your active party (max 4) and bench units. Choose your team wisely!',
      nextNode: 'equipment_menu',
    },
    equipment_menu: {
      id: 'equipment_menu',
      speaker: 'Tutorial',
      text: 'EQUIPMENT: Equip your units with weapons, armor, helms, boots, and accessories. Better gear means stronger stats and better chances in battle!',
      nextNode: 'abilities_menu',
    },
    abilities_menu: {
      id: 'abilities_menu',
      speaker: 'Tutorial',
      text: 'ABILITIES: Each unit unlocks unique abilities as they level up. Review your team\'s abilities here and plan your battle strategies.',
      nextNode: 'djinn_menu',
    },
    djinn_menu: {
      id: 'djinn_menu',
      speaker: 'Tutorial',
      text: 'DJINN: These mystical beings grant powerful bonuses and abilities. Equip Djinn to your units to boost their stats and unlock devastating summon attacks!',
      nextNode: 'battle_system_intro',
    },
    battle_system_intro: {
      id: 'battle_system_intro',
      speaker: 'Tutorial',
      text: 'Now, let me explain how battles work. When you enter combat, you\'ll have several commands available each turn.',
      nextNode: 'attack_command',
    },
    attack_command: {
      id: 'attack_command',
      speaker: 'Tutorial',
      text: 'ATTACK: Execute a basic physical attack on an enemy. Quick and reliable, but not the most powerful option.',
      nextNode: 'ability_command',
    },
    ability_command: {
      id: 'ability_command',
      speaker: 'Tutorial',
      text: 'ABILITY (PSYNERGY): Unleash powerful elemental abilities! These cost PP (Psynergy Points) but deal massive damage or provide helpful effects. Choose wisely based on enemy weaknesses!',
      nextNode: 'djinn_command',
    },
    djinn_command: {
      id: 'djinn_command',
      speaker: 'Tutorial',
      text: 'DJINN: Summon the power of your equipped Djinn for devastating effects! Use multiple Djinn to unleash even more powerful summon attacks.',
      nextNode: 'defend_command',
    },
    defend_command: {
      id: 'defend_command',
      speaker: 'Tutorial',
      text: 'DEFEND: Take a defensive stance to reduce incoming damage. Use this when you need to survive a powerful enemy attack or buy time to heal.',
      nextNode: 'ready_prompt',
    },
    ready_prompt: {
      id: 'ready_prompt',
      speaker: 'Tutorial',
      text: 'You now know the basics! Are you ready to proceed into the first house and begin your journey to free the enslaved monsters?',
      choices: [
        { text: 'Yes, let\'s do this!', nextNode: 'encourage' },
        { text: 'Tell me again about the menus.', nextNode: 'menu_intro' },
        { text: 'Tell me again about battles.', nextNode: 'battle_system_intro' },
      ],
    },
    encourage: {
      id: 'encourage',
      speaker: 'Tutorial',
      text: 'Excellent! Head to the house on your right to face your first challenge. Remember - fight with courage, and you\'ll convince others to join your cause. Good luck, hero!',
      action: {
        type: 'SET_FLAG',
        flag: 'tutorial_battle_complete',
        value: true
      },
      nextNode: 'end',
    },
    end: {
      id: 'end',
      speaker: 'Tutorial',
      text: 'Lead the way, Isaac!',
      action: { type: 'END_DIALOGUE' },
    },
  },
};

/**
 * Main dialogue registry
 * Maps NPC IDs to their dialogue trees
 * Also includes story scenes for narrator-driven content
 */
export const dialogueRegistry: Record<string, DialogueTree> = {
  // NPCs
  elder: elderDialogue,
  garet: garetDialogue,
  jenna: jennaDialogue,
  kraden: kradenDialogue,
  'weaponshop-owner': weaponshopOwnerDialogue,
  innkeeper: innkeeperDialogue,
  'villager-1': villager1Dialogue,
  'villager-2': villager2Dialogue,

  // Story NPCs
  'isaac_arrival': isaacArrivalDialogue,
  'first_djinn': firstDjinnDialogue,
  'game_tutorial': gameTutorialDialogue,

  // Story scenes (imported from story/ directory)
  ...storyScenes,
};

/**
 * Get dialogue tree for an NPC
 */
export function getDialogueTree(npcId: string): DialogueTree | null {
  return dialogueRegistry[npcId] || null;
}
