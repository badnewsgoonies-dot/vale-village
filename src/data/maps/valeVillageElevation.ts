import { ElevationLevel, ElevationEntity, TransitionZone } from '@/types/elevation';

/**
 * Vale Village - Multi-Elevation Map Data
 * World Size: 1200x1500px (compact, focused design)
 */

// Transition zones (stairs and ladders)
export const VALE_TRANSITIONS: TransitionZone[] = [
  // Main Village → Sacred Heights (Stairs)
  {
    id: 'stairs-main-to-upper',
    type: 'stairs',
    x: 500,
    y: 280,
    width: 64,
    height: 32,
    fromLevel: ElevationLevel.MAIN,
    toLevel: ElevationLevel.UPPER,
    sprite: '/sprites/scenery/outdoor/lg/stairs.gif',
    interactionRange: 50,
  },

  // Main Village ↔ Sacred Heights (Ladder)
  {
    id: 'ladder-main-upper',
    type: 'ladder',
    x: 600,
    y: 250,
    width: 32,
    height: 64,
    fromLevel: ElevationLevel.MAIN,
    toLevel: ElevationLevel.UPPER,
    sprite: '/sprites/scenery/outdoor/lg/ladder1.gif',
    interactionRange: 40,
  },

  // Main Village ↔ Lower Plaza (Ladder)
  {
    id: 'ladder-main-lower',
    type: 'ladder',
    x: 600,
    y: 850,
    width: 32,
    height: 64,
    fromLevel: ElevationLevel.MAIN,
    toLevel: ElevationLevel.LOWER,
    sprite: '/sprites/scenery/outdoor/lg/ladder2.gif',
    interactionRange: 40,
  },
];

// All map entities with elevation data
export const VALE_ENTITIES: ElevationEntity[] = [
  // ===== LEVEL 2: SACRED HEIGHTS =====

  // Sol Sanctum
  {
    id: 'sol-sanctum',
    x: 700,
    y: 100,
    elevation: ElevationLevel.UPPER,
    sprite: '/sprites/scenery/buildings/Vale/Vale_Sanctum.gif',
    type: 'building',
    blocking: true,
    label: 'Sol Sanctum',
    onInteract: () => {
      // Navigate to dungeon
      console.log('Entering Sol Sanctum...');
    },
  },

  // Elder's House
  {
    id: 'elders-house',
    x: 450,
    y: 220,
    elevation: ElevationLevel.UPPER,
    sprite: '/sprites/scenery/buildings/Vale/Vale_Building1.gif',
    type: 'building',
    blocking: true,
    label: "Elder's House",
  },

  // Elder NPC
  {
    id: 'elder',
    x: 480,
    y: 270,
    elevation: ElevationLevel.UPPER,
    sprite: '/sprites/overworld/majornpcs/Elder.gif',
    type: 'npc',
    blocking: true,
  },

  // Trees (Upper)
  {
    id: 'tree-upper-1',
    x: 350,
    y: 150,
    elevation: ElevationLevel.UPPER,
    sprite: '/sprites/scenery/plants/Tree.gif',
    type: 'scenery',
    blocking: true,
  },
  {
    id: 'tree-upper-2',
    x: 900,
    y: 180,
    elevation: ElevationLevel.UPPER,
    sprite: '/sprites/scenery/plants/Tree.gif',
    type: 'scenery',
    blocking: true,
  },

  // ===== LEVEL 1: MAIN VILLAGE =====

  // Isaac's House
  {
    id: 'isaacs-house',
    x: 350,
    y: 380,
    elevation: ElevationLevel.MAIN,
    sprite: '/sprites/scenery/buildings/Vale/Vale_Isaacs_House.gif',
    type: 'building',
    blocking: true,
    label: "Isaac's House",
  },

  // Isaac's Mom
  {
    id: 'isaacs-mom',
    x: 330,
    y: 430,
    elevation: ElevationLevel.MAIN,
    sprite: '/sprites/overworld/minornpcs/Villager-1.gif',
    type: 'npc',
    blocking: true,
  },

  // Garet's House
  {
    id: 'garets-house',
    x: 650,
    y: 380,
    elevation: ElevationLevel.MAIN,
    sprite: '/sprites/scenery/buildings/Vale/Vale_Garets_House.gif',
    type: 'building',
    blocking: true,
    label: "Garet's House",
  },

  // Garet's Family
  {
    id: 'garets-family',
    x: 680,
    y: 430,
    elevation: ElevationLevel.MAIN,
    sprite: '/sprites/overworld/minornpcs/Villager-2.gif',
    type: 'npc',
    blocking: true,
  },

  // Training Grounds Building
  {
    id: 'training-grounds',
    x: 250,
    y: 550,
    elevation: ElevationLevel.MAIN,
    sprite: '/sprites/scenery/buildings/Vale/Vale_Building2.gif',
    type: 'building',
    blocking: true,
    label: 'Training Grounds',
  },

  // Soren (Guard Captain)
  {
    id: 'soren',
    x: 280,
    y: 600,
    elevation: ElevationLevel.MAIN,
    sprite: '/sprites/overworld/majornpcs/Weaponshop_Owner.gif',
    type: 'npc',
    blocking: true,
  },

  // Equipment Shop
  {
    id: 'equipment-shop',
    x: 750,
    y: 550,
    elevation: ElevationLevel.MAIN,
    sprite: '/sprites/scenery/buildings/Vale/Vale_WepArm_Shop.gif',
    type: 'building',
    blocking: true,
    label: 'Equipment Shop',
  },

  // Garth (Shopkeeper)
  {
    id: 'garth',
    x: 800,
    y: 600,
    elevation: ElevationLevel.MAIN,
    sprite: '/sprites/overworld/majornpcs/Weaponshop_Owner.gif',
    type: 'npc',
    blocking: true,
  },

  // Psynergy Stone (Plaza)
  {
    id: 'psynergy-stone-plaza',
    x: 550,
    y: 520,
    elevation: ElevationLevel.MAIN,
    sprite: '/sprites/scenery/buildings/Vale/Vale_Psynergy_Stone.gif',
    type: 'interactive',
    blocking: true,
  },

  // Jenna's House
  {
    id: 'jennas-house',
    x: 300,
    y: 700,
    elevation: ElevationLevel.MAIN,
    sprite: '/sprites/scenery/buildings/Vale/Vale_Jennas_House.gif',
    type: 'building',
    blocking: true,
    label: "Jenna's House",
  },

  // Jenna's Family
  {
    id: 'jennas-family',
    x: 330,
    y: 750,
    elevation: ElevationLevel.MAIN,
    sprite: '/sprites/overworld/protagonists/Jenna.gif',
    type: 'npc',
    blocking: true,
  },

  // Generic House 1
  {
    id: 'house-main-1',
    x: 550,
    y: 700,
    elevation: ElevationLevel.MAIN,
    sprite: '/sprites/scenery/buildings/Vale/Vale_Building3.gif',
    type: 'building',
    blocking: true,
  },

  // Villager 1
  {
    id: 'villager-main-1',
    x: 580,
    y: 750,
    elevation: ElevationLevel.MAIN,
    sprite: '/sprites/overworld/minornpcs/Villager-3.gif',
    type: 'npc',
    blocking: true,
  },

  // Generic House 2
  {
    id: 'house-main-2',
    x: 750,
    y: 700,
    elevation: ElevationLevel.MAIN,
    sprite: '/sprites/scenery/buildings/Vale/Vale_Building4.gif',
    type: 'building',
    blocking: true,
  },

  // Villager 2
  {
    id: 'villager-main-2',
    x: 780,
    y: 750,
    elevation: ElevationLevel.MAIN,
    sprite: '/sprites/overworld/minornpcs/Villager-4.gif',
    type: 'npc',
    blocking: true,
  },

  // Trees (Main)
  {
    id: 'tree-main-1',
    x: 200,
    y: 400,
    elevation: ElevationLevel.MAIN,
    sprite: '/sprites/scenery/plants/Tree.gif',
    type: 'scenery',
    blocking: true,
  },
  {
    id: 'tree-main-2',
    x: 950,
    y: 550,
    elevation: ElevationLevel.MAIN,
    sprite: '/sprites/scenery/plants/Tree.gif',
    type: 'scenery',
    blocking: true,
  },
  {
    id: 'tree-main-3',
    x: 200,
    y: 750,
    elevation: ElevationLevel.MAIN,
    sprite: '/sprites/scenery/plants/Tree.gif',
    type: 'scenery',
    blocking: true,
  },

  // ===== LEVEL 0: LOWER PLAZA =====

  // Generic House (Lower) 1
  {
    id: 'house-lower-1',
    x: 500,
    y: 1000,
    elevation: ElevationLevel.LOWER,
    sprite: '/sprites/scenery/buildings/Vale/Vale_Building5.gif',
    type: 'building',
    blocking: true,
  },

  // Villager (Lower) 1
  {
    id: 'villager-lower-1',
    x: 530,
    y: 1050,
    elevation: ElevationLevel.LOWER,
    sprite: '/sprites/overworld/minornpcs/Villager-5.gif',
    type: 'npc',
    blocking: true,
  },

  // Generic House (Lower) 2
  {
    id: 'house-lower-2',
    x: 700,
    y: 1000,
    elevation: ElevationLevel.LOWER,
    sprite: '/sprites/scenery/buildings/Vale/Vale_Building6.gif',
    type: 'building',
    blocking: true,
  },

  // Villager (Lower) 2
  {
    id: 'villager-lower-2',
    x: 730,
    y: 1050,
    elevation: ElevationLevel.LOWER,
    sprite: '/sprites/overworld/minornpcs/Villager-1.gif',
    type: 'npc',
    blocking: true,
  },

  // Market NPCs (Gathering Plaza)
  {
    id: 'market-npc-1',
    x: 400,
    y: 1100,
    elevation: ElevationLevel.LOWER,
    sprite: '/sprites/overworld/minornpcs/Villager-2.gif',
    type: 'npc',
    blocking: true,
  },
  {
    id: 'market-npc-2',
    x: 500,
    y: 1120,
    elevation: ElevationLevel.LOWER,
    sprite: '/sprites/overworld/minornpcs/Villager-3.gif',
    type: 'npc',
    blocking: true,
  },
  {
    id: 'market-npc-3',
    x: 600,
    y: 1100,
    elevation: ElevationLevel.LOWER,
    sprite: '/sprites/overworld/minornpcs/Villager-4.gif',
    type: 'npc',
    blocking: true,
  },
  {
    id: 'market-npc-4',
    x: 700,
    y: 1120,
    elevation: ElevationLevel.LOWER,
    sprite: '/sprites/overworld/minornpcs/Villager-5.gif',
    type: 'npc',
    blocking: true,
  },

  // Harbor Gate (Locked)
  {
    id: 'harbor-gate',
    x: 550,
    y: 1250,
    elevation: ElevationLevel.LOWER,
    sprite: '/sprites/scenery/outdoor/lg/Vale_Gate.gif',
    type: 'interactive',
    blocking: true,
    label: 'Vale Harbor (Locked)',
  },

  // Trees (Lower)
  {
    id: 'tree-lower-1',
    x: 350,
    y: 1050,
    elevation: ElevationLevel.LOWER,
    sprite: '/sprites/scenery/plants/Tree.gif',
    type: 'scenery',
    blocking: true,
  },
  {
    id: 'tree-lower-2',
    x: 850,
    y: 1100,
    elevation: ElevationLevel.LOWER,
    sprite: '/sprites/scenery/plants/Tree.gif',
    type: 'scenery',
    blocking: true,
  },
];

// Cliff edges (impassable barriers between levels)
export const CLIFF_EDGES = [
  // Between Upper and Main (y=300)
  { y: 300, xStart: 0, xEnd: 1200, blocksFrom: ElevationLevel.MAIN, blocksTo: ElevationLevel.UPPER },
  // Between Main and Lower (y=900)
  { y: 900, xStart: 0, xEnd: 1200, blocksFrom: ElevationLevel.LOWER, blocksTo: ElevationLevel.MAIN },
];
