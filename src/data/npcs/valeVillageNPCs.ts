/**
 * Vale Village NPCs Data
 *
 * Comprehensive NPC placement and dialogue for Vale Village.
 * Based on Vale Chronicles story structure with 50 total NPCs:
 * - 10 major battle NPCs (party members, key characters)
 * - 40 dialogue NPCs (villagers, merchants, elders)
 */

export interface NPCData {
  id: string;
  name: string;
  sprite: string;
  x: number;
  y: number;
  blocking: boolean;
  interactable: boolean;
  type: 'major' | 'minor' | 'merchant' | 'elder';
  dialogue: string[];
  location?: string;
}

export const VALE_VILLAGE_NPCS: NPCData[] = [
  // ===== MAJOR NPCs (Story Characters) =====

  {
    id: 'isaac',
    name: 'Isaac',
    sprite: '/sprites/overworld/protagonists/Isaac.gif',
    x: 9,
    y: 8,
    blocking: false,
    interactable: false,
    type: 'major',
    dialogue: [],
    location: "Isaac's House",
  },

  {
    id: 'jenna',
    name: 'Jenna',
    sprite: '/sprites/overworld/majornpcs/Jenna.gif',
    x: 11,
    y: 5,
    blocking: true,
    interactable: true,
    type: 'major',
    dialogue: [
      "Isaac! Are you ready for today's training?",
      "The elders say something important is happening at Sol Sanctum.",
      "Be careful out there, okay?",
    ],
    location: "Jenna's House",
  },

  {
    id: 'garet',
    name: 'Garet',
    sprite: '/sprites/overworld/majornpcs/Garet.gif',
    x: 24,
    y: 18,
    blocking: true,
    interactable: true,
    type: 'major',
    dialogue: [
      "Hey Isaac! Ready to check out Sol Sanctum?",
      "I've been training with my Mars Psynergy all morning!",
      "Let's show everyone what we can do!",
    ],
    location: "Garet's House",
  },

  {
    id: 'kraden',
    name: 'Kraden',
    sprite: '/sprites/overworld/majornpcs/Kraden.gif',
    x: 19,
    y: 18,
    blocking: true,
    interactable: true,
    type: 'major',
    dialogue: [
      "Ah, Isaac! Perfect timing. I've been studying ancient Alchemy texts.",
      "The Elemental Stars hold the power of the four elements. Fascinating!",
      "We must approach Sol Sanctum with great care and respect.",
    ],
    location: "Kraden's House",
  },

  {
    id: 'dora',
    name: 'Dora',
    sprite: '/sprites/overworld/majornpcs/Dora.gif',
    x: 21,
    y: 7,
    blocking: true,
    interactable: true,
    type: 'merchant',
    dialogue: [
      "Welcome to my shop! We have the finest weapons and armor in Vale.",
      "I just received a new shipment of Herbs. They'll heal you in battle!",
      "Stay safe on your adventures, young warrior.",
    ],
    location: 'Weapon Shop',
  },

  // ===== ELDER NPCs =====

  {
    id: 'elder-1',
    name: 'Village Elder',
    sprite: '/sprites/overworld/majornpcs/Elder.gif',
    x: 15,
    y: 4,
    blocking: true,
    interactable: true,
    type: 'elder',
    dialogue: [
      "Welcome, young one. Vale Village has stood for generations.",
      "The power of Alchemy flows through our sacred grounds.",
      "Sol Sanctum holds ancient secrets. Approach with wisdom.",
    ],
    location: 'Sanctum Plaza',
  },

  {
    id: 'elder-2',
    name: 'Elder Marcus',
    sprite: '/sprites/overworld/minornpcs/Villager-Elder-1.gif',
    x: 13,
    y: 6,
    blocking: true,
    interactable: true,
    type: 'elder',
    dialogue: [
      "The stars shine brightly tonight. Something stirs in the world.",
      "Your destiny is tied to the Elemental Stars, young Isaac.",
      "Train well. The world will need heroes soon.",
    ],
    location: 'Central Plaza',
  },

  // ===== INN & MERCHANTS =====

  {
    id: 'innkeeper',
    name: 'Inn Keeper',
    sprite: '/sprites/overworld/minornpcs/Villager-3.gif',
    x: 9,
    y: 17,
    blocking: true,
    interactable: true,
    type: 'merchant',
    dialogue: [
      "Welcome to Vale Inn! Rest here for 10 coins.",
      "A good night's sleep restores HP and PP. You'll need it!",
      "I've heard travelers speak of strange happenings to the north.",
    ],
    location: 'Vale Inn',
  },

  {
    id: 'shopkeeper',
    name: 'Shop Assistant',
    sprite: '/sprites/overworld/minornpcs/Villager-4.gif',
    x: 22,
    y: 7,
    blocking: true,
    interactable: true,
    type: 'merchant',
    dialogue: [
      "Dora's shop has the best prices in all of Weyard!",
      "Don't forget to stock up on Antidotes. Poison is nasty in battle.",
      "We just got new Bronze equipment. Very sturdy!",
    ],
    location: 'Weapon Shop',
  },

  // ===== RESIDENTIAL AREA NPCs (North) =====

  {
    id: 'villager-n-1',
    name: 'Young Woman',
    sprite: '/sprites/overworld/minornpcs/Villager-2.gif',
    x: 12,
    y: 4,
    blocking: true,
    interactable: true,
    type: 'minor',
    dialogue: [
      "I love living near the Sanctum. It's so peaceful here.",
      "Have you seen the Psynergy Stone? It glows when you use Psynergy!",
    ],
    location: 'North Residential',
  },

  {
    id: 'villager-n-2',
    name: 'Farmer',
    sprite: '/sprites/overworld/minornpcs/Villager-1.gif',
    x: 18,
    y: 5,
    blocking: true,
    interactable: true,
    type: 'minor',
    dialogue: [
      "The harvest this year has been bountiful, thanks to Alchemy.",
      "My crops grow twice as fast near the Psynergy Stone!",
    ],
    location: 'North Residential',
  },

  {
    id: 'villager-n-3',
    name: 'Child',
    sprite: '/sprites/overworld/minornpcs/Child-1.gif',
    x: 10,
    y: 6,
    blocking: true,
    interactable: true,
    type: 'minor',
    dialogue: [
      "I want to be an Adept like Isaac when I grow up!",
      "Can you teach me Psynergy? Please?",
    ],
    location: 'North Residential',
  },

  {
    id: 'villager-n-4',
    name: 'Elderly Man',
    sprite: '/sprites/overworld/minornpcs/Villager-Elder-2.gif',
    x: 16,
    y: 6,
    blocking: true,
    interactable: true,
    type: 'minor',
    dialogue: [
      "I remember when Isaac was just a baby. How time flies!",
      "This village has stayed hidden and safe for so long...",
    ],
    location: 'North Residential',
  },

  // ===== CENTRAL PLAZA NPCs =====

  {
    id: 'villager-c-1',
    name: 'Town Guard',
    sprite: '/sprites/overworld/minornpcs/Guard-1.gif',
    x: 14,
    y: 8,
    blocking: true,
    interactable: true,
    type: 'minor',
    dialogue: [
      "I patrol the plaza to keep everyone safe.",
      "Haven't seen any monsters inside the village, thankfully!",
    ],
    location: 'Central Plaza',
  },

  {
    id: 'villager-c-2',
    name: 'Merchant',
    sprite: '/sprites/overworld/minornpcs/Merchant-1.gif',
    x: 17,
    y: 8,
    blocking: true,
    interactable: true,
    type: 'minor',
    dialogue: [
      "I travel between towns selling rare goods.",
      "Vale Village is the safest place I've visited in years!",
    ],
    location: 'Central Plaza',
  },

  {
    id: 'villager-c-3',
    name: 'Young Boy',
    sprite: '/sprites/overworld/minornpcs/Child-2.gif',
    x: 11,
    y: 9,
    blocking: true,
    interactable: true,
    type: 'minor',
    dialogue: [
      "I saw a shooting star last night! Did you make a wish?",
      "My dad says stars are connected to Alchemy magic.",
    ],
    location: 'Central Plaza',
  },

  {
    id: 'villager-c-4',
    name: 'Herbalist',
    sprite: '/sprites/overworld/minornpcs/Villager-5.gif',
    x: 20,
    y: 9,
    blocking: true,
    interactable: true,
    type: 'minor',
    dialogue: [
      "I gather herbs from the forest. They have healing properties!",
      "Mix Mint with Weasel Weed for a powerful antidote.",
    ],
    location: 'Central Plaza',
  },

  // ===== WESTERN RESIDENTIAL NPCs =====

  {
    id: 'villager-w-1',
    name: 'Mother',
    sprite: '/sprites/overworld/minornpcs/Villager-6.gif',
    x: 5,
    y: 7,
    blocking: true,
    interactable: true,
    type: 'minor',
    dialogue: [
      "Keep your voice down! The baby is sleeping.",
      "It's nice having such helpful young Adepts in the village.",
    ],
    location: 'West Residential',
  },

  {
    id: 'villager-w-2',
    name: 'Woodworker',
    sprite: '/sprites/overworld/minornpcs/Villager-7.gif',
    x: 5,
    y: 9,
    blocking: true,
    interactable: true,
    type: 'minor',
    dialogue: [
      "I craft all the wooden furniture for Vale Village.",
      "The trees near here are perfect for carpentry!",
    ],
    location: 'West Residential',
  },

  {
    id: 'villager-w-3',
    name: 'Baker',
    sprite: '/sprites/overworld/minornpcs/Villager-8.gif',
    x: 3,
    y: 7,
    blocking: true,
    interactable: true,
    type: 'minor',
    dialogue: [
      "Fresh bread! Get your fresh bread here!",
      "I bake every morning before sunrise. Hard work but rewarding!",
    ],
    location: 'West Residential',
  },

  // ===== EASTERN RESIDENTIAL NPCs =====

  {
    id: 'villager-e-1',
    name: 'Blacksmith',
    sprite: '/sprites/overworld/minornpcs/Villager-9.gif',
    x: 25,
    y: 7,
    blocking: true,
    interactable: true,
    type: 'minor',
    dialogue: [
      "I forge weapons and armor for Dora's shop.",
      "Infusing metal with Psynergy makes it incredibly strong!",
    ],
    location: 'East Residential',
  },

  {
    id: 'villager-e-2',
    name: 'Fisherman',
    sprite: '/sprites/overworld/minornpcs/Villager-10.gif',
    x: 27,
    y: 9,
    blocking: true,
    interactable: true,
    type: 'minor',
    dialogue: [
      "The stream here has the best fish in Weyard!",
      "I caught a huge salmon this morning. Want to see?",
    ],
    location: 'East Residential',
  },

  {
    id: 'villager-e-3',
    name: 'Teenage Girl',
    sprite: '/sprites/overworld/minornpcs/Villager-11.gif',
    x: 26,
    y: 8,
    blocking: true,
    interactable: true,
    type: 'minor',
    dialogue: [
      "Isaac is so cool! I wish I could use Psynergy like him.",
      "Maybe one day I'll discover I'm an Adept too!",
    ],
    location: 'East Residential',
  },

  // ===== STREAM AREA NPCs =====

  {
    id: 'villager-s-1',
    name: 'Angler',
    sprite: '/sprites/overworld/minornpcs/Villager-12.gif',
    x: 8,
    y: 11,
    blocking: true,
    interactable: true,
    type: 'minor',
    dialogue: [
      "The bridge here is perfect for fishing!",
      "Sometimes I see strange lights from Sol Sanctum at night...",
    ],
    location: 'Stream Bridge',
  },

  {
    id: 'villager-s-2',
    name: 'Water Carrier',
    sprite: '/sprites/overworld/minornpcs/Villager-13.gif',
    x: 22,
    y: 11,
    blocking: true,
    interactable: true,
    type: 'minor',
    dialogue: [
      "I fetch water from the stream every day.",
      "The water here is blessed by Mercury Psynergy. Very pure!",
    ],
    location: 'Stream Bridge',
  },

  {
    id: 'villager-s-3',
    name: 'Child Playing',
    sprite: '/sprites/overworld/minornpcs/Child-3.gif',
    x: 15,
    y: 13,
    blocking: true,
    interactable: true,
    type: 'minor',
    dialogue: [
      "Wheee! I love playing by the water!",
      "Mom says I can't swim here because it's too deep.",
    ],
    location: 'Stream Bank',
  },

  // ===== SOUTHERN RESIDENTIAL NPCs =====

  {
    id: 'villager-sr-1',
    name: 'Librarian',
    sprite: '/sprites/overworld/minornpcs/Villager-14.gif',
    x: 11,
    y: 16,
    blocking: true,
    interactable: true,
    type: 'minor',
    dialogue: [
      "Kraden has an impressive collection of Alchemy books!",
      "I help him organize his research. Fascinating stuff!",
    ],
    location: 'Kraden Area',
  },

  {
    id: 'villager-sr-2',
    name: 'Apprentice',
    sprite: '/sprites/overworld/minornpcs/Villager-15.gif',
    x: 13,
    y: 17,
    blocking: true,
    interactable: true,
    type: 'minor',
    dialogue: [
      "I'm studying under Kraden. He knows so much!",
      "Did you know the Elemental Stars can control weather?",
    ],
    location: 'Kraden Area',
  },

  {
    id: 'villager-sr-3',
    name: 'Gardener',
    sprite: '/sprites/overworld/minornpcs/Villager-16.gif',
    x: 17,
    y: 17,
    blocking: true,
    interactable: true,
    type: 'minor',
    dialogue: [
      "I tend the gardens around the village. Beautiful, aren't they?",
      "Plants grow wonderfully when you talk to them!",
    ],
    location: 'South Gardens',
  },

  {
    id: 'villager-sr-4',
    name: 'Storyteller',
    sprite: '/sprites/overworld/minornpcs/Villager-Elder-3.gif',
    x: 22,
    y: 18,
    blocking: true,
    interactable: true,
    type: 'minor',
    dialogue: [
      "Gather 'round! Let me tell you tales of ancient Alchemy!",
      "Long ago, Alchemy nearly destroyed the world...",
      "But heroes sealed it away. Will history repeat itself?",
    ],
    location: 'South Residential',
  },

  {
    id: 'villager-sr-5',
    name: 'Musician',
    sprite: '/sprites/overworld/minornpcs/Villager-17.gif',
    x: 25,
    y: 17,
    blocking: true,
    interactable: true,
    type: 'minor',
    dialogue: [
      "♪ La la la! Music fills the heart with joy!",
      "I'm composing a song about the Elemental Stars.",
    ],
    location: 'South Residential',
  },

  // ===== FIELD/FARM AREA NPCs =====

  {
    id: 'villager-f-1',
    name: 'Farmer Joe',
    sprite: '/sprites/overworld/minornpcs/Villager-18.gif',
    x: 6,
    y: 20,
    blocking: true,
    interactable: true,
    type: 'minor',
    dialogue: [
      "These fields feed the entire village!",
      "Growth Psynergy makes crops grow in half the time. Amazing!",
    ],
    location: 'South Fields',
  },

  {
    id: 'villager-f-2',
    name: 'Rancher',
    sprite: '/sprites/overworld/minornpcs/Villager-19.gif',
    x: 11,
    y: 21,
    blocking: true,
    interactable: true,
    type: 'minor',
    dialogue: [
      "I raise cattle and chickens. Honest work!",
      "Animals are sensitive to Psynergy. They get spooked sometimes.",
    ],
    location: 'South Fields',
  },

  {
    id: 'villager-f-3',
    name: 'Stable Hand',
    sprite: '/sprites/overworld/minornpcs/Villager-20.gif',
    x: 20,
    y: 21,
    blocking: true,
    interactable: true,
    type: 'minor',
    dialogue: [
      "The horses are restless today. Something's in the air...",
      "I brush them every morning. They love it!",
    ],
    location: 'South Fields',
  },

  // ===== GATE AREA NPCs =====

  {
    id: 'gate-guard-1',
    name: 'Gate Guardian',
    sprite: '/sprites/overworld/minornpcs/Guard-2.gif',
    x: 13,
    y: 23,
    blocking: true,
    interactable: true,
    type: 'minor',
    dialogue: [
      "I guard the southern gate. No monsters get past me!",
      "Be careful if you leave Vale. The world is dangerous.",
    ],
    location: 'South Gate',
  },

  {
    id: 'gate-guard-2',
    name: 'Gate Watcher',
    sprite: '/sprites/overworld/minornpcs/Guard-3.gif',
    x: 16,
    y: 23,
    blocking: true,
    interactable: true,
    type: 'minor',
    dialogue: [
      "Welcome to Vale Village! Please stay safe.",
      "If you're heading out, stock up on supplies first!",
    ],
    location: 'South Gate',
  },

  {
    id: 'traveler-1',
    name: 'Weary Traveler',
    sprite: '/sprites/overworld/minornpcs/Merchant-2.gif',
    x: 11,
    y: 22,
    blocking: true,
    interactable: true,
    type: 'minor',
    dialogue: [
      "*huff* *puff* Finally made it to Vale...",
      "The roads are crawling with monsters. Be prepared!",
    ],
    location: 'South Gate',
  },

  {
    id: 'traveler-2',
    name: 'Wandering Monk',
    sprite: '/sprites/overworld/minornpcs/Villager-Elder-4.gif',
    x: 18,
    y: 22,
    blocking: true,
    interactable: true,
    type: 'minor',
    dialogue: [
      "I travel the world seeking enlightenment.",
      "Vale Village has a strong aura of Alchemy. Fascinating!",
    ],
    location: 'South Gate',
  },

  // ===== ADDITIONAL MINOR NPCs (Roaming) =====

  {
    id: 'child-4',
    name: 'Playful Child',
    sprite: '/sprites/overworld/minornpcs/Child-4.gif',
    x: 7,
    y: 15,
    blocking: true,
    interactable: true,
    type: 'minor',
    dialogue: [
      "Tag! You're it!",
      "Do you want to play hide and seek?",
    ],
    location: 'Wandering',
  },

  {
    id: 'villager-misc-1',
    name: 'Elderly Woman',
    sprite: '/sprites/overworld/minornpcs/Villager-21.gif',
    x: 12,
    y: 14,
    blocking: true,
    interactable: true,
    type: 'minor',
    dialogue: [
      "These old bones aren't what they used to be!",
      "Back in my day, we didn't have fancy Psynergy...",
    ],
    location: 'Wandering',
  },

  {
    id: 'villager-misc-2',
    name: 'Messenger',
    sprite: '/sprites/overworld/minornpcs/Villager-22.gif',
    x: 19,
    y: 14,
    blocking: true,
    interactable: true,
    type: 'minor',
    dialogue: [
      "I deliver messages between villages.",
      "Vale is the most peaceful place on my route!",
    ],
    location: 'Wandering',
  },

  {
    id: 'villager-misc-3',
    name: 'Poet',
    sprite: '/sprites/overworld/minornpcs/Villager-23.gif',
    x: 8,
    y: 19,
    blocking: true,
    interactable: true,
    type: 'minor',
    dialogue: [
      "Roses are red, violets are blue...",
      "Alchemy is magic, and so are you!",
    ],
    location: 'Wandering',
  },

  {
    id: 'villager-misc-4',
    name: 'Fortune Teller',
    sprite: '/sprites/overworld/minornpcs/Villager-24.gif',
    x: 21,
    y: 19,
    blocking: true,
    interactable: true,
    type: 'minor',
    dialogue: [
      "I sense a great destiny ahead of you...",
      "The stars align in your favor, young Adept!",
    ],
    location: 'Wandering',
  },

  {
    id: 'villager-misc-5',
    name: 'Cook',
    sprite: '/sprites/overworld/minornpcs/Villager-25.gif',
    x: 10,
    y: 18,
    blocking: true,
    interactable: true,
    type: 'minor',
    dialogue: [
      "I'm preparing a feast for tonight's festival!",
      "Would you like to try my special mushroom soup?",
    ],
    location: 'Inn Area',
  },

  {
    id: 'villager-misc-6',
    name: 'Scholar',
    sprite: '/sprites/overworld/minornpcs/Villager-26.gif',
    x: 20,
    y: 15,
    blocking: true,
    interactable: true,
    type: 'minor',
    dialogue: [
      "I'm researching the connection between Psynergy and emotions.",
      "Fascinating how willpower affects elemental magic!",
    ],
    location: 'Central',
  },
];

/**
 * Get dialogue for an NPC by ID
 */
export function getNPCDialogue(npcId: string): string[] {
  const npc = VALE_VILLAGE_NPCS.find(n => n.id === npcId);
  return npc?.dialogue || ['...'];
}

/**
 * Get random dialogue line for an NPC
 */
export function getRandomNPCDialogue(npcId: string): string {
  const dialogues = getNPCDialogue(npcId);
  return dialogues[Math.floor(Math.random() * dialogues.length)];
}
