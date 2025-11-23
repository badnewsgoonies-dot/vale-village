import { describe, expect, it } from 'vitest';
import { ENCOUNTERS } from '@/data/definitions/encounters';
import { getRecruitmentInfo } from '@/data/definitions/recruitmentData';

type EquipmentExpectation =
  | { type: 'none' }
  | { type: 'fixed'; itemId: string }
  | { type: 'choice'; options: readonly string[] };

describe('House progression snapshot (locked blueprint)', () => {
  const snapshot: Record<
    string,
    {
      xp: number;
      gold: number;
      equipment: EquipmentExpectation;
      djinn?: string;
      unlockUnit?: string;
    }
  > = {
    'house-01': {
      xp: 60,
      gold: 20,
      equipment: { type: 'none' },
      djinn: 'forge',
      unlockUnit: 'war-mage',
    },
    'house-05': {
      xp: 100,
      gold: 28,
      equipment: { type: 'none' },
      unlockUnit: 'blaze',
    },
    'house-07': {
      xp: 150,
      gold: 40,
      equipment: { type: 'choice', options: ['steel-sword', 'battle-axe', 'crystal-rod'] },
      djinn: 'breeze',
    },
    'house-08': {
      xp: 200,
      gold: 55,
      equipment: { type: 'none' },
      djinn: 'fizz',
      unlockUnit: 'sentinel',
    },
    'house-11': {
      xp: 255,
      gold: 68,
      equipment: { type: 'fixed', itemId: 'silver-armor' },
      unlockUnit: 'karis',
    },
    'house-12': {
      xp: 275,
      gold: 72,
      equipment: { type: 'none' },
      djinn: 'granite',
    },
    'house-15': {
      xp: 400,
      gold: 110,
      equipment: { type: 'choice', options: ['mythril-armor', 'zodiac-wand', 'elemental-star'] },
      djinn: 'squall',
      unlockUnit: 'stormcaller',
    },
    'house-17': {
      xp: 500,
      gold: 130,
      equipment: { type: 'fixed', itemId: 'dragon-scales' },
      unlockUnit: 'felix',
    },
    'house-18': {
      xp: 550,
      gold: 140,
      equipment: { type: 'none' },
      djinn: 'bane',
    },
    'house-20': {
      xp: 1500,
      gold: 300,
      equipment: { type: 'choice', options: ['sol-blade', 'titans-axe', 'staff-of-ages', 'cosmos-shield'] },
      djinn: 'storm',
    },
  };

  for (const [encounterId, expectation] of Object.entries(snapshot)) {
    it(`ensures ${encounterId} matches the locked blueprint`, () => {
      const encounter = ENCOUNTERS[encounterId];
      expect(encounter).toBeDefined();
      expect(encounter.reward.xp).toBe(expectation.xp);
      expect(encounter.reward.gold).toBe(expectation.gold);

      const equipment = encounter.reward.equipment;
      expect(equipment?.type).toBe(expectation.equipment.type);
      if (expectation.equipment.type === 'fixed') {
        expect(equipment).toHaveProperty('itemId', expectation.equipment.itemId);
      }
      if (expectation.equipment.type === 'choice') {
        expect(Array.isArray(equipment?.options)).toBe(true);
        expect(equipment?.options).toEqual(expectation.equipment.options);
      }

      if (expectation.djinn) {
        expect(encounter.reward.djinn).toBe(expectation.djinn);
      } else {
        expect(encounter.reward.djinn).toBeUndefined();
      }

      if (expectation.unlockUnit) {
        expect(encounter.reward.unlockUnit).toBe(expectation.unlockUnit);
      } else {
        expect(encounter.reward.unlockUnit).toBeUndefined();
      }
    });
  }
});

describe('Recruitment info helpers', () => {
  it('returns the correct grants for house-01 and house-07', () => {
    expect(getRecruitmentInfo('house-01')).toEqual({
      recruitsUnit: 'war-mage',
      grantsDjinn: 'forge',
    });

    expect(getRecruitmentInfo('house-07')).toEqual({
      recruitsUnit: null,
      grantsDjinn: 'breeze',
    });

    expect(getRecruitmentInfo('house-14')).toEqual({
      recruitsUnit: 'tyrell',
      grantsDjinn: null,
    });
  });

  it('returns null for encounters without recruitment dialogues', () => {
    expect(getRecruitmentInfo('house-09')).toBeNull();
  });
});
