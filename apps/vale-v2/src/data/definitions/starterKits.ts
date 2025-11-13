export interface StarterKit {
  /** Unit ID this kit belongs to */
  readonly unitId: string;
  /** Display name shown in the shop */
  readonly name: string;
  /** Gold cost to unlock the kit */
  readonly cost: number;
  /** Equipment bundle granted when purchasing the kit */
  readonly equipment: {
    readonly weapon: string;
    readonly armor: string;
    readonly helm: string;
    readonly boots: string;
    readonly accessory: string;
  };
}

export const STARTER_KITS: Record<string, StarterKit> = {
  adept: {
    unitId: 'adept',
    name: "Adept's Starter Kit",
    cost: 350,
    equipment: {
      weapon: 'wooden-sword',
      armor: 'leather-vest',
      helm: 'cloth-cap',
      boots: 'leather-boots',
      accessory: 'power-ring',
    },
  },
  'war-mage': {
    unitId: 'war-mage',
    name: "War Mage's Starter Kit",
    cost: 350,
    equipment: {
      weapon: 'wooden-axe',
      armor: 'leather-vest',
      helm: 'leather-cap',
      boots: 'leather-boots',
      accessory: 'war-gloves',
    },
  },
  mystic: {
    unitId: 'mystic',
    name: "Mystic's Starter Kit",
    cost: 350,
    equipment: {
      weapon: 'wooden-staff',
      armor: 'cotton-shirt',
      helm: 'cloth-cap',
      boots: 'leather-boots',
      accessory: 'spirit-gloves',
    },
  },
  ranger: {
    unitId: 'ranger',
    name: "Ranger's Starter Kit",
    cost: 350,
    equipment: {
      weapon: 'wooden-sword',
      armor: 'leather-vest',
      helm: 'leather-cap',
      boots: 'leather-boots',
      accessory: 'lucky-medal',
    },
  },
  sentinel: {
    unitId: 'sentinel',
    name: "Sentinel's Starter Kit",
    cost: 350,
    equipment: {
      weapon: 'wooden-sword',
      armor: 'bronze-armor',
      helm: 'leather-cap',
      boots: 'iron-boots',
      accessory: 'guardian-ring',
    },
  },
  stormcaller: {
    unitId: 'stormcaller',
    name: "Stormcaller's Starter Kit",
    cost: 350,
    equipment: {
      weapon: 'magic-rod',
      armor: 'cotton-shirt',
      helm: 'cloth-cap',
      boots: 'hyper-boots',
      accessory: 'elemental-star',
    },
  },
};

export function getStarterKit(unitId: string): StarterKit | undefined {
  return STARTER_KITS[unitId];
}

export function getAvailableStarterKits(recruitedUnitIds: readonly string[]): StarterKit[] {
  return recruitedUnitIds
    .map((id) => STARTER_KITS[id])
    .filter((kit): kit is StarterKit => Boolean(kit));
}
