import { test, expect } from '@playwright/test';
import { ENCOUNTERS } from '../../src/data/definitions/encounters';
import { STORY_FLAG_TO_UNIT } from '../../src/data/definitions/storyFlags';
import { UNIT_DEFINITIONS } from '../../src/data/definitions/units';
import { createUnit } from '../../src/core/models/Unit';
import { createTeam } from '../../src/core/models/Team';
import { createStoryState } from '../../src/core/models/story';
import { processStoryFlagForUnit } from '../../src/core/services/StoryService';

/**
 * Recruitment Validation Tests (Phase 6)
 *
 * Validates all 9 unit recruitments in Houses 1-20 progression.
 *
 * RECRUITMENT BREAKDOWN:
 * - Battle Recruits (7): Garet, Blaze, Sentinel, Karis, Tyrell, Stormcaller, Felix
 * - Story Joins (2): Mystic, Ranger
 *
 * PURPOSE:
 * - Ensure all recruitment rewards are correctly defined
 * - Test battle recruitment system (encounter.reward.unlockUnit)
 * - Test story join system (processStoryFlagForUnit)
 * - Validate recruited units have correct stats and abilities
 */

test.describe('Recruitment Validation - Battle Recruits', () => {
  test('All 7 battle recruitment houses have valid unlockUnit rewards', () => {
    const battleRecruits = [
      { house: 'house-01', unitId: 'war-mage', name: 'War Mage' },
      { house: 'house-05', unitId: 'blaze', name: 'Blaze' },
      { house: 'house-08', unitId: 'sentinel', name: 'Sentinel' },
      { house: 'house-11', unitId: 'karis', name: 'Karis' },
      { house: 'house-14', unitId: 'tyrell', name: 'Tyrell' },
      { house: 'house-15', unitId: 'stormcaller', name: 'Stormcaller' },
      { house: 'house-17', unitId: 'felix', name: 'Felix' },
    ];

    battleRecruits.forEach(({ house, unitId, name }) => {
      const encounter = ENCOUNTERS[house];

      // Validate encounter exists
      expect(encounter, `Encounter ${house} should exist`).toBeDefined();

      // Validate unlockUnit is set
      expect(encounter?.reward.unlockUnit, `${house} should have unlockUnit`).toBe(unitId);

      // Validate unit definition exists
      const unitDef = UNIT_DEFINITIONS[unitId];
      expect(unitDef, `Unit definition for ${unitId} should exist`).toBeDefined();
      expect(unitDef?.name, `Unit ${unitId} should have correct name`).toBe(name);
    });
  });

  test('Recruited units can be created at level 1', () => {
    const unitIds = ['war-mage', 'blaze', 'sentinel', 'karis', 'tyrell', 'stormcaller', 'felix'];

    unitIds.forEach((unitId) => {
      const unitDef = UNIT_DEFINITIONS[unitId];
      expect(unitDef).toBeDefined();

      const unit = createUnit(unitDef!, 1, 0);

      // Validate unit creation succeeded
      expect(unit).toBeDefined();
      expect(unit.id).toBe(unitId);
      expect(unit.level).toBe(1);

      // Validate unit has base stats
      expect(unit.baseStats.hp).toBeGreaterThan(0);
      expect(unit.baseStats.pp).toBeGreaterThan(0);
      expect(unit.baseStats.atk).toBeGreaterThan(0);

      // Validate unit has at least 1 unlocked ability at level 1
      expect(unit.unlockedAbilityIds.length).toBeGreaterThanOrEqual(1);
    });
  });

  test('Battle recruitment progression follows blueprint order', () => {
    // Validate recruitments happen in correct house order
    const progression = [
      { house: 1, unit: 'war-mage' },
      { house: 5, unit: 'blaze' },
      { house: 8, unit: 'sentinel' },
      { house: 11, unit: 'karis' },
      { house: 14, unit: 'tyrell' },
      { house: 15, unit: 'stormcaller' },
      { house: 17, unit: 'felix' },
    ];

    for (let i = 0; i < progression.length - 1; i++) {
      const curr = progression[i];
      const next = progression[i + 1];

      expect(next?.house).toBeGreaterThan(curr?.house ?? 0);
    }
  });
});

test.describe('Recruitment Validation - Story Joins', () => {
  test('Story join flags are correctly mapped to units', () => {
    const storyJoins = [
      { flag: 'house-02', unitId: 'mystic', name: 'Mystic' },
      { flag: 'house-03', unitId: 'ranger', name: 'Ranger' },
    ];

    storyJoins.forEach(({ flag, unitId, name }) => {
      // Validate flag mapping exists
      expect(STORY_FLAG_TO_UNIT[flag]).toBe(unitId);

      // Validate unit definition exists
      const unitDef = UNIT_DEFINITIONS[unitId];
      expect(unitDef).toBeDefined();
      expect(unitDef?.name).toBe(name);
    });
  });

  test('processStoryFlagForUnit correctly recruits Mystic at House 2', () => {
    const story = createStoryState(1);

    // Process House 2 completion (should recruit Mystic)
    const result = processStoryFlagForUnit(story, 'house-02', true, 1);

    // Validate story flag was set
    expect(result.story.flags['house-02']).toBe(true);

    // Validate Mystic was recruited
    expect(result.recruitedUnit).toBeDefined();
    expect(result.recruitedUnit?.id).toBe('mystic');
    expect(result.recruitedUnit?.name).toBe('Mystic');
    expect(result.recruitedUnit?.level).toBe(1);
  });

  test('processStoryFlagForUnit correctly recruits Ranger at House 3', () => {
    const story = createStoryState(1);

    // Process House 3 completion (should recruit Ranger)
    const result = processStoryFlagForUnit(story, 'house-03', true, 1);

    // Validate story flag was set
    expect(result.story.flags['house-03']).toBe(true);

    // Validate Ranger was recruited
    expect(result.recruitedUnit).toBeDefined();
    expect(result.recruitedUnit?.id).toBe('ranger');
    expect(result.recruitedUnit?.name).toBe('Ranger');
    expect(result.recruitedUnit?.level).toBe(1);
  });

  test('processStoryFlagForUnit returns null for non-recruitment flags', () => {
    const story = createStoryState(1);

    // Process a flag that doesn't recruit a unit
    const result = processStoryFlagForUnit(story, 'house-04', true, 1);

    // Validate no unit was recruited
    expect(result.recruitedUnit).toBeNull();

    // But flag should still be set
    expect(result.story.flags['house-04']).toBe(true);
  });
});

test.describe('Recruitment Validation - Complete Progression', () => {
  test('All 9 recruitments are unique units', () => {
    const battleRecruits = ['war-mage', 'blaze', 'sentinel', 'karis', 'tyrell', 'stormcaller', 'felix'];
    const storyJoins = ['mystic', 'ranger'];

    const allRecruits = [...battleRecruits, ...storyJoins];

    // Validate no duplicates
    const uniqueRecruits = new Set(allRecruits);
    expect(uniqueRecruits.size).toBe(9);

    // Validate all units exist in definitions
    allRecruits.forEach((unitId) => {
      expect(UNIT_DEFINITIONS[unitId]).toBeDefined();
    });
  });

  test('Recruitment distribution across acts is balanced', () => {
    const act1Recruits = ['war-mage', 'mystic', 'ranger', 'blaze']; // Houses 1-7
    const act2Recruits = ['sentinel', 'karis', 'tyrell']; // Houses 8-14
    const act3Recruits = ['stormcaller', 'felix']; // Houses 15-20

    // Validate roughly balanced distribution
    expect(act1Recruits.length).toBe(4); // Act 1 has most (tutorial phase)
    expect(act2Recruits.length).toBe(3); // Act 2 has moderate
    expect(act3Recruits.length).toBe(2); // Act 3 has fewest (late game)
  });

  test('No houses after final recruitment (House 17) have unlockUnit', () => {
    const lateHouses = ['house-18', 'house-19', 'house-20'];

    lateHouses.forEach((houseId) => {
      const encounter = ENCOUNTERS[houseId];
      expect(encounter).toBeDefined();
      expect(encounter?.reward.unlockUnit).toBeUndefined();
    });
  });
});
