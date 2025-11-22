/**
 * Liberation Dialogues - Vale Village Liberation Arc
 *
 * Pre-battle dialogues for all 20 houses
 * Each dialogue ends with a startBattle effect to trigger combat
 * Tone: Balanced (hopeful + serious) with good humor mixed in
 *
 * Character: Isaac (player character, Golden Sun protagonist)
 */
import type { DialogueTree } from '@/core/models/dialogue';

// ============================================================================
// ACT 1: DISCOVERY (Houses 1-7)
// ============================================================================

export const HOUSE_01_DIALOGUE: DialogueTree = {
  id: 'house-01-liberation',
  name: 'House 1: The First Cage',
  startNodeId: 'pre-battle',
  nodes: [
    {
      id: 'pre-battle',
      speaker: 'Earth Scout',
      text: '*laughs* Another fool thinking they can stop us? This wolf here has more bite than you, kid.',
      portrait: 'enemy-scout',
      nextNodeId: 'isaac-response',
    },
    {
      id: 'isaac-response',
      speaker: 'Isaac',
      text: 'Let\'s see how confident you are after I free that wolf from your control.',
      portrait: 'isaac',
      effects: { startBattle: 'house-01' }, // Dialogue ends here - battle starts
    },
  ],
};

export const HOUSE_02_DIALOGUE: DialogueTree = {
  id: 'house-02-flint',
  name: 'House 2: Flames of Oppression',
  startNodeId: 'pre-battle',
  nodes: [
    {
      id: 'pre-battle',
      speaker: 'Flame Scout',
      text: 'You freed House 1? Pfft. Beginner\'s luck. Try facing FIRE next time!',
      portrait: 'enemy-scout',
      nextNodeId: 'isaac-quip',
    },
    {
      id: 'isaac-quip',
      speaker: 'Isaac',
      text: '*smirks* Fire, huh? Good thing I brought earth magic. Rock beats flame scout, right?',
      portrait: 'isaac',
      effects: { startBattle: 'house-02' }, // Dialogue ends here - battle starts
    },
  ],
};

export const HOUSE_03_DIALOGUE: DialogueTree = {
  id: 'house-03-ice',
  name: 'House 3: Frozen Chains',
  startNodeId: 'pre-battle',
  nodes: [
    {
      id: 'pre-battle',
      speaker: 'Frost Scout',
      text: 'The boss said you\'d come. But you\'ll find my icy grip... *chilling*. Get it? Chilling?',
      portrait: 'enemy-scout',
      nextNodeId: 'isaac-groan',
    },
    {
      id: 'isaac-groan',
      speaker: 'Isaac',
      text: '*groans* Did you really just make an ice pun? That\'s it, you\'re going down.',
      portrait: 'isaac',
      effects: { startBattle: 'house-03' }, // Dialogue ends here - battle starts
    },
  ],
};

export const HOUSE_04_DIALOGUE: DialogueTree = {
  id: 'house-04-breeze',
  name: 'House 4: Winds of Change',
  startNodeId: 'pre-battle',
  nodes: [
    {
      id: 'pre-battle',
      speaker: 'Gale Scout',
      text: 'You freed three houses? Impressive. But you haven\'t faced the WIND yet! I\'m like... super fast.',
      portrait: 'enemy-scout',
      nextNodeId: 'isaac-ready',
    },
    {
      id: 'isaac-ready',
      speaker: 'Isaac',
      text: 'Fast doesn\'t matter if I can predict where you\'ll be. Let\'s go!',
      portrait: 'isaac',
      effects: { startBattle: 'house-04' }, // Dialogue ends here - battle starts
    },
  ],
};

export const HOUSE_05_DIALOGUE: DialogueTree = {
  id: 'house-05-escalation',
  name: 'House 5: Double Trouble',
  startNodeId: 'pre-battle',
  nodes: [
    {
      id: 'pre-battle',
      speaker: 'Earth Scout',
      text: 'Two scouts this time! You thought it would stay easy? Think again!',
      portrait: 'enemy-scout',
      nextNodeId: 'flame-scout',
    },
    {
      id: 'flame-scout',
      speaker: 'Flame Scout',
      text: 'Yeah! We\'ve been training SPECIFICALLY to counter you! We even practiced our teamwork!',
      portrait: 'enemy-scout',
      nextNodeId: 'isaac-unimpressed',
    },
    {
      id: 'isaac-unimpressed',
      speaker: 'Isaac',
      text: '*sigh* Great, the slavers have a training program now. Let\'s see how well that works.',
      portrait: 'isaac',
      effects: { startBattle: 'house-05' }, // Dialogue ends here - battle starts
    },
  ],
};

export const HOUSE_06_DIALOGUE: DialogueTree = {
  id: 'house-06-forge',
  name: 'House 6: Terra\'s Wrath',
  startNodeId: 'pre-battle',
  nodes: [
    {
      id: 'pre-battle',
      speaker: 'Terra Soldier',
      text: 'You\'ve been fighting scouts. Cute. But I\'m a SOLDIER. Trained in actual combat. This will be your last house, boy.',
      portrait: 'enemy-soldier',
      nextNodeId: 'isaac-notices-bear',
    },
    {
      id: 'isaac-notices-bear',
      speaker: 'Isaac',
      text: 'A Mountain Bear under your control? That\'s a powerful creature. I\'ll have to be careful here.',
      portrait: 'isaac',
      effects: { startBattle: 'house-06' }, // Dialogue ends here - battle starts
    },
  ],
};

export const HOUSE_07_DIALOGUE: DialogueTree = {
  id: 'house-07-wind',
  name: 'House 7: The Storm Rises',
  startNodeId: 'pre-battle',
  nodes: [
    {
      id: 'pre-battle',
      speaker: 'Wind Soldier',
      text: 'Six houses liberated. The commander is getting nervous. But not me! I\'ll blow you away!',
      portrait: 'enemy-soldier',
      nextNodeId: 'isaac-confident',
    },
    {
      id: 'isaac-confident',
      speaker: 'Isaac',
      text: 'Your commander SHOULD be nervous. This ends today.',
      portrait: 'isaac',
      effects: { startBattle: 'house-07' }, // Dialogue ends here - battle starts
    },
  ],
};

// ============================================================================
// ACT 2: RESISTANCE (Houses 8-14)
// ============================================================================

export const HOUSE_08_DIALOGUE: DialogueTree = {
  id: 'house-08-sentinel-fizz',
  name: 'House 8: A Frozen Ally',
  startNodeId: 'pre-battle',
  nodes: [
    {
      id: 'pre-battle',
      speaker: 'Tide Soldier',
      text: 'This house is special. We\'ve captured one of YOUR kind, Isaac. A Venus Adept named Sentinel. He\'s strong... but he\'ll break eventually.',
      portrait: 'enemy-soldier',
      nextNodeId: 'isaac-angry',
    },
    {
      id: 'isaac-angry',
      speaker: 'Isaac',
      text: 'You enslaved an ADEPT? That\'s it. I\'m ending this NOW.',
      portrait: 'isaac-angry',
      effects: { startBattle: 'house-08' }, // Dialogue ends here - battle starts
    },
  ],
};

export const HOUSE_09_DIALOGUE: DialogueTree = {
  id: 'house-09-inferno',
  name: 'House 9: Inferno\'s Fury',
  startNodeId: 'pre-battle',
  nodes: [
    {
      id: 'pre-battle',
      speaker: 'Blaze Soldier',
      text: 'Two Adepts now? Doesn\'t matter. I\'ve got a Flame Elemental AND a Mars Bear. You\'re outmatched!',
      portrait: 'enemy-soldier',
      nextNodeId: 'sentinel-backup',
    },
    {
      id: 'sentinel-backup',
      speaker: 'Sentinel',
      text: 'Isaac, let me take the lead. My earth magic counters fire well.',
      portrait: 'sentinel',
      nextNodeId: 'isaac-agrees',
    },
    {
      id: 'isaac-agrees',
      speaker: 'Isaac',
      text: 'Good plan. Let\'s show them what REAL teamwork looks like.',
      portrait: 'isaac',
      effects: { startBattle: 'house-09' }, // Dialogue ends here - battle starts
    },
  ],
};

export const HOUSE_10_DIALOGUE: DialogueTree = {
  id: 'house-10-granite',
  name: 'House 10: The Stone Captain',
  startNodeId: 'pre-battle',
  nodes: [
    {
      id: 'pre-battle',
      speaker: 'Stone Captain',
      text: 'A captain at last. You\'ve fought soldiers and scouts. But captains... we\'re ELITE. This is where your liberation ends.',
      portrait: 'enemy-captain',
      nextNodeId: 'isaac-ready',
    },
    {
      id: 'isaac-ready',
      speaker: 'Isaac',
      text: '*grips sword* Elite or not, you\'re standing between me and freedom. Let\'s go!',
      portrait: 'isaac',
      effects: { startBattle: 'house-10' }, // Dialogue ends here - battle starts
    },
  ],
};

export const HOUSE_11_DIALOGUE: DialogueTree = {
  id: 'house-11-phoenix',
  name: 'House 11: Rise of the Phoenix',
  startNodeId: 'pre-battle',
  nodes: [
    {
      id: 'pre-battle',
      speaker: 'Inferno Captain',
      text: 'You defeated the Stone Captain? Impressive. But I have something he didn\'t - a PHOENIX. You know, the legendary bird of rebirth? Yeah, that Phoenix.',
      portrait: 'enemy-captain',
      nextNodeId: 'isaac-worried',
    },
    {
      id: 'isaac-worried',
      speaker: 'Isaac',
      text: 'A Phoenix?! Those are supposed to be extinct! How did you...?',
      portrait: 'isaac',
      nextNodeId: 'captain-laughs',
    },
    {
      id: 'captain-laughs',
      speaker: 'Inferno Captain',
      text: '*laughs* Extinct? Not if you know where to look! Now, face the flames of rebirth!',
      portrait: 'enemy-captain',
      effects: { startBattle: 'house-11' }, // Dialogue ends here - battle starts
    },
  ],
};

export const HOUSE_12_DIALOGUE: DialogueTree = {
  id: 'house-12-squall',
  name: 'House 12: Leviathan\'s Depths',
  startNodeId: 'pre-battle',
  nodes: [
    {
      id: 'pre-battle',
      speaker: 'Glacier Captain',
      text: 'Phoenix, you say? Try fighting a LEVIATHAN. The sea serpent of legend. This will be your coldest battle yet.',
      portrait: 'enemy-captain',
      nextNodeId: 'isaac-undeterred',
    },
    {
      id: 'isaac-undeterred',
      speaker: 'Isaac',
      text: 'Legend or not, it deserves freedom. Let\'s break those chains!',
      portrait: 'isaac',
      effects: { startBattle: 'house-12' }, // Dialogue ends here - battle starts
    },
  ],
};

export const HOUSE_13_DIALOGUE: DialogueTree = {
  id: 'house-13-thunderbird',
  name: 'House 13: Lightning\'s Call',
  startNodeId: 'pre-battle',
  nodes: [
    {
      id: 'pre-battle',
      speaker: 'Thunder Captain',
      text: 'Phoenix. Leviathan. Now meet the Thunderbird! The sky itself trembles at its power!',
      portrait: 'enemy-captain',
      nextNodeId: 'sentinel-concerned',
    },
    {
      id: 'sentinel-concerned',
      speaker: 'Sentinel',
      text: 'Isaac, these aren\'t random beasts. They\'re collecting LEGENDARY creatures. What\'s their endgame?',
      portrait: 'sentinel',
      nextNodeId: 'isaac-focused',
    },
    {
      id: 'isaac-focused',
      speaker: 'Isaac',
      text: 'We\'ll find out soon enough. For now, let\'s free this Thunderbird.',
      portrait: 'isaac',
      effects: { startBattle: 'house-13' }, // Dialogue ends here - battle starts
    },
  ],
};

export const HOUSE_14_DIALOGUE: DialogueTree = {
  id: 'house-14-corona',
  name: 'House 14: Multi-Front Assault',
  startNodeId: 'pre-battle',
  nodes: [
    {
      id: 'pre-battle',
      speaker: 'Terra Soldier',
      text: 'The commanders sent us! Three soldiers, one from each element! You can\'t handle all of us!',
      portrait: 'enemy-soldier',
      nextNodeId: 'blaze-taunts',
    },
    {
      id: 'blaze-taunts',
      speaker: 'Blaze Soldier',
      text: 'Yeah! We trained specifically for multi-front combat! You\'re doomed!',
      portrait: 'enemy-soldier',
      nextNodeId: 'wind-chimes-in',
    },
    {
      id: 'wind-chimes-in',
      speaker: 'Wind Soldier',
      text: 'Stop talking and let\'s just win already!',
      portrait: 'enemy-soldier',
      nextNodeId: 'isaac-smirks',
    },
    {
      id: 'isaac-smirks',
      speaker: 'Isaac',
      text: '*smirks at Sentinel* They trained for multi-front combat. How cute.',
      portrait: 'isaac',
      nextNodeId: 'sentinel-ready',
    },
    {
      id: 'sentinel-ready',
      speaker: 'Sentinel',
      text: 'We\'ve been doing multi-front combat since House 8. Let\'s show them how it\'s REALLY done.',
      portrait: 'sentinel',
      effects: { startBattle: 'house-14' }, // Dialogue ends here - battle starts
    },
  ],
};

// ============================================================================
// ACT 3: LIBERATION (Houses 15-20)
// ============================================================================

export const HOUSE_15_DIALOGUE: DialogueTree = {
  id: 'house-15-stormcaller',
  name: 'House 15: The Lightning Commander',
  startNodeId: 'pre-battle',
  nodes: [
    {
      id: 'pre-battle',
      speaker: 'Lightning Commander',
      text: 'Fourteen houses. Fourteen failures. But I am no mere soldier or captain. I am a COMMANDER. The Overseer\'s right hand.',
      portrait: 'enemy-commander',
      nextNodeId: 'voice-calls-out',
    },
    {
      id: 'voice-calls-out',
      speaker: '???',
      text: '*from inside the house* Isaac! Is that you?! Help!',
      
      nextNodeId: 'isaac-recognizes',
    },
    {
      id: 'isaac-recognizes',
      speaker: 'Isaac',
      text: 'That voice... Stormcaller?! The Jupiter Adept from the north! You were captured too?',
      portrait: 'isaac',
      nextNodeId: 'commander-laughs',
    },
    {
      id: 'commander-laughs',
      speaker: 'Lightning Commander',
      text: '*laughs* Oh yes. The Stormcaller. Powerful. Defiant. But ultimately... MINE. If you want them, come and take them!',
      portrait: 'enemy-commander',
      effects: { startBattle: 'house-15' }, // Dialogue ends here - battle starts
    },
  ],
};

export const HOUSE_16_DIALOGUE: DialogueTree = {
  id: 'house-16-tonic',
  name: 'House 16: The Mountain\'s Shadow',
  startNodeId: 'pre-battle',
  nodes: [
    {
      id: 'pre-battle',
      speaker: 'Mountain Commander',
      text: 'The Lightning Commander fell. Pathetic. But I am EARTH. Immovable. Unbreakable. You will not pass.',
      portrait: 'enemy-commander',
      nextNodeId: 'stormcaller-notices',
    },
    {
      id: 'stormcaller-notices',
      speaker: 'Stormcaller',
      text: 'Isaac, that Basilisk behind him... it\'s MASSIVE. And the Rock Elemental looks ancient. This won\'t be easy.',
      portrait: 'stormcaller',
      nextNodeId: 'isaac-confident',
    },
    {
      id: 'isaac-confident',
      speaker: 'Isaac',
      text: 'Good thing we have THREE Adepts now. Sentinel, take the Basilisk. Stormcaller, focus the elemental. I\'ll handle the commander.',
      portrait: 'isaac',
      effects: { startBattle: 'house-16' }, // Dialogue ends here - battle starts
    },
  ],
};

export const HOUSE_17_DIALOGUE: DialogueTree = {
  id: 'house-17-warlords',
  name: 'House 17: Warlord Duo',
  startNodeId: 'pre-battle',
  nodes: [
    {
      id: 'pre-battle',
      speaker: 'Fire Commander',
      text: 'Two commanders fell. But now you face WARLORDS. The Volcano Warlord and I will reduce you to ash!',
      portrait: 'enemy-commander',
      nextNodeId: 'warlord-entrance',
    },
    {
      id: 'warlord-entrance',
      speaker: 'Volcano Warlord',
      text: '*steps forward* The Overseer grows desperate. Good. That means we\'re WINNING. But first, you burn.',
      portrait: 'enemy-warlord',
      nextNodeId: 'sentinel-warns',
    },
    {
      id: 'sentinel-warns',
      speaker: 'Sentinel',
      text: 'Isaac, I sense immense power from that warlord. This is the Overseer\'s elite force. We need full focus here!',
      portrait: 'sentinel',
      nextNodeId: 'isaac-rallies',
    },
    {
      id: 'isaac-rallies',
      speaker: 'Isaac',
      text: 'Then we give them full focus. Team, stick to the plan! We\'ve come too far to fall now!',
      portrait: 'isaac',
      effects: { startBattle: 'house-17' }, // Dialogue ends here - battle starts
    },
  ],
};

export const HOUSE_18_DIALOGUE: DialogueTree = {
  id: 'house-18-bane',
  name: 'House 18: Hydra\'s Lair',
  startNodeId: 'pre-battle',
  nodes: [
    {
      id: 'pre-battle',
      speaker: 'Storm Commander',
      text: 'Seventeen houses liberated. You\'ve proven yourself formidable. But this house holds the Hydra. The multi-headed serpent of legend.',
      portrait: 'enemy-commander',
      nextNodeId: 'sentinel-lore',
    },
    {
      id: 'sentinel-lore',
      speaker: 'Sentinel',
      text: 'The Hydra... legends say it regenerates. Cut off one head, two grow back. How do we fight that?',
      portrait: 'sentinel',
      nextNodeId: 'isaac-strategy',
    },
    {
      id: 'isaac-strategy',
      speaker: 'Isaac',
      text: 'We don\'t cut the heads. We free the HEART. The Hydra is enslaved, just like everything else. Let\'s break its chains!',
      portrait: 'isaac',
      effects: { startBattle: 'house-18' }, // Dialogue ends here - battle starts
    },
  ],
};

export const HOUSE_19_DIALOGUE: DialogueTree = {
  id: 'house-19-fury',
  name: 'House 19: Warlords\' Last Stand',
  startNodeId: 'pre-battle',
  nodes: [
    {
      id: 'pre-battle',
      speaker: 'Granite Warlord',
      text: 'House 19. The penultimate battle. The Overseer waits in House 20. But first... you face US.',
      portrait: 'enemy-warlord',
      nextNodeId: 'blizzard-warlord',
    },
    {
      id: 'blizzard-warlord',
      speaker: 'Blizzard Warlord',
      text: 'Two Warlords. Earth and Ice. The immovable and the unmelting. This is your final test before the Overseer.',
      portrait: 'enemy-warlord',
      nextNodeId: 'stormcaller-ready',
    },
    {
      id: 'stormcaller-ready',
      speaker: 'Stormcaller',
      text: 'Isaac, Sentinel - this is it. One more fight, then we face the Overseer. Let\'s give this everything we\'ve got!',
      portrait: 'stormcaller',
      nextNodeId: 'sentinel-determined',
    },
    {
      id: 'sentinel-determined',
      speaker: 'Sentinel',
      text: 'For all the enslaved. For Vale. For FREEDOM!',
      portrait: 'sentinel',
      nextNodeId: 'isaac-leads',
    },
    {
      id: 'isaac-leads',
      speaker: 'Isaac',
      text: 'Together! NOW!',
      portrait: 'isaac',
      effects: { startBattle: 'house-19' }, // Dialogue ends here - battle starts
    },
  ],
};

export const HOUSE_20_DIALOGUE: DialogueTree = {
  id: 'house-20-overseer',
  name: 'House 20: The Overseer Falls',
  startNodeId: 'pre-battle',
  nodes: [
    {
      id: 'pre-battle',
      speaker: 'The Overseer',
      text: '*stands atop a throne* Nineteen houses. Nineteen defeats. But it ends here, Isaac of Vale. You think you\'re a hero? I AM THE POWER!',
      portrait: 'overseer',
      nextNodeId: 'isaac-stands-firm',
    },
    {
      id: 'isaac-stands-firm',
      speaker: 'Isaac',
      text: 'You enslaved an entire village. Beasts, people, even legendary creatures. Your "power" is built on suffering. That ends TODAY.',
      portrait: 'isaac',
      nextNodeId: 'overseer-summons',
    },
    {
      id: 'overseer-summons',
      speaker: 'The Overseer',
      text: '*summons the Chimera and Tempest Warlord* You want to free them? Then face my ULTIMATE FORCE! The Chimera! The Tempest Warlord! And ME!',
      portrait: 'overseer',
      nextNodeId: 'sentinel-ready',
    },
    {
      id: 'sentinel-ready',
      speaker: 'Sentinel',
      text: 'Isaac, this is it. The final battle. Everyone ready?',
      portrait: 'sentinel',
      nextNodeId: 'stormcaller-charges',
    },
    {
      id: 'stormcaller-charges',
      speaker: 'Stormcaller',
      text: 'My lightning is READY. Let\'s END this tyranny!',
      portrait: 'stormcaller',
      nextNodeId: 'isaac-final-words',
    },
    {
      id: 'isaac-final-words',
      speaker: 'Isaac',
      text: '*draws sword* For Vale. For freedom. FOR EVERYONE YOU\'VE ENSLAVED!',
      portrait: 'isaac',
      effects: { startBattle: 'house-20' }, // Dialogue ends here - battle starts
    },
  ],
};

// ============================================================================
// Export all dialogues
// ============================================================================

export const LIBERATION_DIALOGUES: Record<string, DialogueTree> = {
  'house-01': HOUSE_01_DIALOGUE,
  'house-02': HOUSE_02_DIALOGUE,
  'house-03': HOUSE_03_DIALOGUE,
  'house-04': HOUSE_04_DIALOGUE,
  'house-05': HOUSE_05_DIALOGUE,
  'house-06': HOUSE_06_DIALOGUE,
  'house-07': HOUSE_07_DIALOGUE,
  'house-08': HOUSE_08_DIALOGUE,
  'house-09': HOUSE_09_DIALOGUE,
  'house-10': HOUSE_10_DIALOGUE,
  'house-11': HOUSE_11_DIALOGUE,
  'house-12': HOUSE_12_DIALOGUE,
  'house-13': HOUSE_13_DIALOGUE,
  'house-14': HOUSE_14_DIALOGUE,
  'house-15': HOUSE_15_DIALOGUE,
  'house-16': HOUSE_16_DIALOGUE,
  'house-17': HOUSE_17_DIALOGUE,
  'house-18': HOUSE_18_DIALOGUE,
  'house-19': HOUSE_19_DIALOGUE,
  'house-20': HOUSE_20_DIALOGUE,
};
