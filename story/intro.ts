/**
 * Game Introduction Scene
 *
 * Sets the context for Vale Village as a battle simulator / training ground.
 * This establishes why the player will be fighting battles - it's about
 * training, tournaments, and testing one's skills as an Adept.
 */

import type { DialogueTree } from '@/types/Dialogue';

export const introScene: DialogueTree = {
  npcId: 'intro-narrator',
  startNode: 'opening',
  nodes: {
    opening: {
      id: 'opening',
      speaker: '',
      text: 'Long ago, the ancient art of Alchemy shaped the world of Weyard. Those who could wield the power of the four elements became known as Adepts.',
      nextNode: 'vale_introduction',
    },

    vale_introduction: {
      id: 'vale_introduction',
      speaker: '',
      text: 'In the peaceful village of Vale, nestled at the foot of Mt. Aleph, young Adepts train in the sacred art of Psynergy - the manifestation of elemental power.',
      nextNode: 'sanctum',
    },

    sanctum: {
      id: 'sanctum',
      speaker: '',
      text: 'Above the village stands Sol Sanctum, an ancient temple where warriors test their skills in ritual combat, honing their abilities through friendly duels and tournaments.',
      nextNode: 'player_intro',
    },

    player_intro: {
      id: 'player_intro',
      speaker: '',
      text: 'You are an aspiring Adept, here to prove your worth through battle. Train with fellow warriors, challenge powerful opponents, and master the elemental forces.',
      nextNode: 'purpose',
    },

    purpose: {
      id: 'purpose',
      speaker: '',
      text: 'This is not a journey of quests and errands - this is a proving ground. Every battle sharpens your skills. Every victory brings honor. Every defeat teaches wisdom.',
      nextNode: 'begin',
    },

    begin: {
      id: 'begin',
      speaker: '',
      text: 'Welcome to Vale Village, young warrior. Your training begins now.',
      action: {
        type: 'SET_FLAG',
        flag: 'intro_seen',
        value: true,
      },
      nextNode: 'end',
    },

    end: {
      id: 'end',
      speaker: '',
      text: '',
      action: {
        type: 'NAVIGATE',
        screen: 'OVERWORLD',
      },
    },
  },
};
