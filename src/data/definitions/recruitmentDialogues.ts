/**
 * Recruitment Dialogue Scenes
 * Post-battle narratives for all 9 unit recruitments
 *
 * IMPORTANT: These dialogues trigger after battle victory and grant units via dialogue effects
 */

import type { DialogueTree } from '@/core/models/dialogue';

// HOUSE 01: War Mage + Forge Djinn
export const HOUSE_01_RECRUIT: DialogueTree = {
  id: 'house-01-recruit',
  name: 'House 01: War Mage Joins',
  startNodeId: 'victory',
  nodes: [
    {
      id: 'victory',
      speaker: 'Isaac',
      text: 'The first house is ours. But who is that approaching?',
      portrait: 'isaac',
      nextNodeId: 'garet-intro',
    },
    {
      id: 'garet-intro',
      speaker: 'War Mage',
      text: "That was impressive! I'm a War Mage, skilled in Mars Psynergy. Mind if I join you?",
      portrait: 'garet',
      nextNodeId: 'isaac-response',
    },
    {
      id: 'isaac-response',
      speaker: 'Isaac',
      text: "We could use your strength. Welcome to the team!",
      portrait: 'isaac',
      nextNodeId: 'forge-djinn',
    },
    {
      id: 'forge-djinn',
      speaker: 'War Mage',
      text: "And take this Forge Djinn I found - it'll boost our Mars power!",
      portrait: 'garet',
      effects: {
        recruitUnit: "war-mage",
        grantDjinn: "forge",
      },
    },
  ],
};

// HOUSE 02: Mystic (Story Join)
export const HOUSE_02_RECRUIT: DialogueTree = {
  id: 'house-02-recruit',
  name: 'House 02: Mystic Joins',
  startNodeId: 'arrival',
  nodes: [
    {
      id: 'arrival',
      speaker: 'Mystic',
      text: "I've been watching your progress. You fight for the people - I respect that.",
      portrait: 'mystic',
      nextNodeId: 'isaac-response',
    },
    {
      id: 'isaac-response',
      speaker: 'Isaac',
      text: "We need all the help we can get to liberate these houses.",
      portrait: 'isaac',
      nextNodeId: 'mystic-joins',
    },
    {
      id: 'mystic-joins',
      speaker: 'Mystic',
      text: "Then I'll lend you my Mercury Psynergy. Together, we'll restore balance.",
      portrait: 'mystic',
      effects: { recruitUnit: "mystic" },
    },
  ],
};

// HOUSE 03: Ranger (Story Join)
export const HOUSE_03_RECRUIT: DialogueTree = {
  id: 'house-03-recruit',
  name: 'House 03: Ranger Joins',
  startNodeId: 'scouting',
  nodes: [
    {
      id: 'scouting',
      speaker: 'Ranger',
      text: "I've been scouting the area. The corruption runs deep, but you're making progress.",
      portrait: 'ranger',
      nextNodeId: 'isaac-question',
    },
    {
      id: 'isaac-question',
      speaker: 'Isaac',
      text: "Will you help us push forward?",
      portrait: 'isaac',
      nextNodeId: 'ranger-joins',
    },
    {
      id: 'ranger-joins',
      speaker: 'Ranger',
      text: "My arrows are yours. Let's clear the path ahead.",
      portrait: 'ranger',
      effects: { recruitUnit: "ranger" },
    },
  ],
};

// HOUSE 04: Post-Battle (no unit recruitment, just victory dialogue)
export const HOUSE_04_POST_BATTLE: DialogueTree = {
  id: 'house-04-post',
  name: 'House 04: Victory',
  startNodeId: 'victory',
  nodes: [
    {
      id: 'victory',
      speaker: 'Isaac',
      text: 'Another house freed. The villagers are grateful for our help.',
      portrait: 'isaac',
    },
  ],
};

// HOUSE 05: Blaze
export const HOUSE_05_RECRUIT: DialogueTree = {
  id: 'house-05-recruit',
  name: 'House 05: Blaze Joins',
  startNodeId: 'flames',
  nodes: [
    {
      id: 'flames',
      speaker: 'Blaze',
      text: "Fire answers to those with conviction. You've proven yours!",
      portrait: 'blaze',
      nextNodeId: 'isaac-response',
    },
    {
      id: 'isaac-response',
      speaker: 'Isaac',
      text: "We need your flames to burn through the resistance ahead.",
      portrait: 'isaac',
      nextNodeId: 'blaze-joins',
    },
    {
      id: 'blaze-joins',
      speaker: 'Blaze',
      text: "Then let my fire light the way! I'm with you.",
      portrait: 'blaze',
      effects: { recruitUnit: "blaze" },
    },
  ],
};

// HOUSE 07: Breeze Djinn (no unit recruitment, just Djinn grant)
export const HOUSE_07_DJINN: DialogueTree = {
  id: 'house-07-djinn',
  name: 'House 07: Breeze Djinn',
  startNodeId: 'wind',
  nodes: [
    {
      id: 'wind',
      speaker: 'Isaac',
      text: 'Do you feel that? The wind carries something... a Djinn!',
      portrait: 'isaac',
      nextNodeId: 'breeze-appears',
    },
    {
      id: 'breeze-appears',
      speaker: 'Breeze',
      text: 'I am Breeze, spirit of Jupiter. You have proven worthy!',
      portrait: 'djinn',
      nextNodeId: 'summon-unlock',
    },
    {
      id: 'summon-unlock',
      speaker: 'Isaac',
      text: 'With three Djinn, we can now unleash Summon abilities!',
      portrait: 'isaac',
      effects: { grantDjinn: "breeze" },
    },
  ],
};

// HOUSE 08: Sentinel + Fizz Djinn
export const HOUSE_08_RECRUIT: DialogueTree = {
  id: 'house-08-recruit',
  name: 'House 08: Sentinel Joins',
  startNodeId: 'defender',
  nodes: [
    {
      id: 'defender',
      speaker: 'Sentinel',
      text: "I've defended this house for years, but corruption has spread too far. I need your help.",
      portrait: 'sentinel',
      nextNodeId: 'isaac-response',
    },
    {
      id: 'isaac-response',
      speaker: 'Isaac',
      text: "Join us. Together we're stronger.",
      portrait: 'isaac',
      nextNodeId: 'fizz-djinn',
    },
    {
      id: 'fizz-djinn',
      speaker: 'Sentinel',
      text: "I found this Fizz Djinn while guarding the waters. It's yours now.",
      portrait: 'sentinel',
      effects: {
        recruitUnit: "war-mage",
        grantDjinn: "fizz",
      },
    },
  ],
};

// HOUSE 11: Karis
export const HOUSE_11_RECRUIT: DialogueTree = {
  id: 'house-11-recruit',
  name: 'House 11: Karis Joins',
  startNodeId: 'windcaller',
  nodes: [
    {
      id: 'windcaller',
      speaker: 'Karis',
      text: "The winds speak of your deeds. You're bringing hope back to these lands.",
      portrait: 'karis',
      nextNodeId: 'isaac-response',
    },
    {
      id: 'isaac-response',
      speaker: 'Isaac',
      text: "Hope alone won't be enough. We need warriors like you.",
      portrait: 'isaac',
      nextNodeId: 'karis-joins',
    },
    {
      id: 'karis-joins',
      speaker: 'Karis',
      text: "Then I'll fight alongside you. My wind magic is yours!",
      portrait: 'karis',
      effects: { recruitUnit: "karis" },
    },
  ],
};

// HOUSE 12: Granite Djinn (no unit recruitment)
export const HOUSE_12_DJINN: DialogueTree = {
  id: 'house-12-djinn',
  name: 'House 12: Granite Djinn',
  startNodeId: 'earth',
  nodes: [
    {
      id: 'earth',
      speaker: 'Isaac',
      text: 'The earth trembles... another Djinn!',
      portrait: 'isaac',
      nextNodeId: 'granite-appears',
    },
    {
      id: 'granite-appears',
      speaker: 'Granite',
      text: 'I am Granite, Tier 2 Venus Djinn. Your strength has called me!',
      portrait: 'djinn',
      effects: { grantDjinn: "granite" },
    },
  ],
};

// HOUSE 14: Tyrell
export const HOUSE_14_RECRUIT: DialogueTree = {
  id: 'house-14-recruit',
  name: 'House 14: Tyrell Joins',
  startNodeId: 'earthshaker',
  nodes: [
    {
      id: 'earthshaker',
      speaker: 'Tyrell',
      text: "You've got guts taking on these houses! I like that.",
      portrait: 'tyrell',
      nextNodeId: 'isaac-response',
    },
    {
      id: 'isaac-response',
      speaker: 'Isaac',
      text: "We could use someone who isn't afraid to shake things up.",
      portrait: 'isaac',
      nextNodeId: 'tyrell-joins',
    },
    {
      id: 'tyrell-joins',
      speaker: 'Tyrell',
      text: "Ha! Then let's make some noise together!",
      portrait: 'tyrell',
      effects: { recruitUnit: "tyrell" },
    },
  ],
};

// HOUSE 15: Stormcaller + Squall Djinn
export const HOUSE_15_RECRUIT: DialogueTree = {
  id: 'house-15-recruit',
  name: 'House 15: Stormcaller Joins',
  startNodeId: 'thunder',
  nodes: [
    {
      id: 'thunder',
      speaker: 'Stormcaller',
      text: "The storm is gathering. You stand at the eye of destiny.",
      portrait: 'stormcaller',
      nextNodeId: 'isaac-response',
    },
    {
      id: 'isaac-response',
      speaker: 'Isaac',
      text: "Then help us ride the storm to victory.",
      portrait: 'isaac',
      nextNodeId: 'squall-djinn',
    },
    {
      id: 'squall-djinn',
      speaker: 'Stormcaller',
      text: "I bring both myself and Squall Djinn. Together, we'll unleash the tempest!",
      portrait: 'stormcaller',
      effects: {
        recruitUnit: "war-mage",
        grantDjinn: "squall",
      },
    },
  ],
};

// HOUSE 17: Felix
export const HOUSE_17_RECRUIT: DialogueTree = {
  id: 'house-17-recruit',
  name: 'House 17: Felix Joins',
  startNodeId: 'reunion',
  nodes: [
    {
      id: 'reunion',
      speaker: 'Felix',
      text: "Isaac... I've been searching for you. The darkness has spread too far.",
      portrait: 'felix',
      nextNodeId: 'isaac-response',
    },
    {
      id: 'isaac-response',
      speaker: 'Isaac',
      text: "Felix! Together we can push it back!",
      portrait: 'isaac',
      nextNodeId: 'felix-joins',
    },
    {
      id: 'felix-joins',
      speaker: 'Felix',
      text: "Like old times. Let's finish this fight.",
      portrait: 'felix',
      effects: { recruitUnit: "felix" },
    },
  ],
};

// HOUSE 18: Bane Djinn (no unit recruitment)
export const HOUSE_18_DJINN: DialogueTree = {
  id: 'house-18-djinn',
  name: 'House 18: Bane Djinn',
  startNodeId: 'shadow',
  nodes: [
    {
      id: 'shadow',
      speaker: 'Isaac',
      text: 'A powerful presence... a Tier 3 Djinn!',
      portrait: 'isaac',
      nextNodeId: 'bane-appears',
    },
    {
      id: 'bane-appears',
      speaker: 'Bane',
      text: 'I am Bane, Tier 3 Venus Djinn. The final battle approaches - take my power!',
      portrait: 'djinn',
      effects: { grantDjinn: "bane" },
    },
  ],
};

// HOUSE 20: Storm Djinn (final boss, no unit recruitment)
export const HOUSE_20_DJINN: DialogueTree = {
  id: 'house-20-djinn',
  name: 'House 20: Storm Djinn (Victory)',
  startNodeId: 'final-victory',
  nodes: [
    {
      id: 'final-victory',
      speaker: 'Isaac',
      text: "We did it! The corruption is finally lifted from Vale!",
      portrait: 'isaac',
      nextNodeId: 'storm-appears',
    },
    {
      id: 'storm-appears',
      speaker: 'Storm',
      text: 'I am Storm, the final Tier 3 Jupiter Djinn. You have proven yourself worthy!',
      portrait: 'djinn',
      nextNodeId: 'ending',
    },
    {
      id: 'ending',
      speaker: 'Isaac',
      text: 'With all 8 Djinn and our complete party, Vale is safe at last!',
      portrait: 'isaac',
      effects: { grantDjinn: "gust" },
    },
  ],
};

// Export all recruitment dialogues
export const RECRUITMENT_DIALOGUES: Record<string, DialogueTree> = {
  'house-01-recruit': HOUSE_01_RECRUIT,
  'house-02-recruit': HOUSE_02_RECRUIT,
  'house-03-recruit': HOUSE_03_RECRUIT,
  'house-04-post': HOUSE_04_POST_BATTLE,
  'house-05-recruit': HOUSE_05_RECRUIT,
  'house-07-djinn': HOUSE_07_DJINN,
  'house-08-recruit': HOUSE_08_RECRUIT,
  'house-11-recruit': HOUSE_11_RECRUIT,
  'house-12-djinn': HOUSE_12_DJINN,
  'house-14-recruit': HOUSE_14_RECRUIT,
  'house-15-recruit': HOUSE_15_RECRUIT,
  'house-17-recruit': HOUSE_17_RECRUIT,
  'house-18-djinn': HOUSE_18_DJINN,
  'house-20-djinn': HOUSE_20_DJINN,
};
