/**
 * Shop Definitions
 * Shops unlock as story progresses
 */

export interface Shop {
  id: string;
  name: string;
  availableItems: string[]; // equipment IDs
  unlockCondition?: (flags: Record<string, boolean>) => boolean;
}

export const SHOPS: Record<string, Shop> = {
  'vale-armory': {
    id: 'vale-armory',
    name: 'Vale Armory',
    availableItems: [
      'wooden-sword',
      'iron-sword',
      'leather-armor',
      'iron-armor',
      'cloth-cap',
      'iron-helm',
      'cloth-boots',
      'iron-boots',
    ],
  },
  'kolima-shop': {
    id: 'kolima-shop',
    name: 'Kolima General Store',
    availableItems: [
      'bronze-sword',
      'iron-sword',
      'bronze-armor',
      'iron-armor',
      'bronze-helm',
      'iron-helm',
      'leather-boots',
      'iron-boots',
    ],
    unlockCondition: (flags) => flags['kolimaUnlocked'] === true,
  },
};


