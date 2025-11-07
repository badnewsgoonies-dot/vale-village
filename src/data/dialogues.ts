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

  // Story scenes (imported from story/ directory)
  ...storyScenes,
};

/**
 * Get dialogue tree for an NPC
 */
export function getDialogueTree(npcId: string): DialogueTree | null {
  return dialogueRegistry[npcId] || null;
}
