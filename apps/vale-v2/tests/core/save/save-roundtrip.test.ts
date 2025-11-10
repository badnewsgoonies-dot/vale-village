/**
 * Save Round-trip Tests
 * Tests for save/load determinism and data integrity
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { createLocalStorageSavePort } from '../../../src/infra/save/LocalStorageSavePort';
import { saveGame, loadGame, createSaveEnvelope } from '../../../src/core/save/SaveService';
import type { GameStateSnapshot } from '../../../src/core/save/types';
import { createTeam } from '../../../src/core/models/Team';
import { createUnit } from '../../../src/core/models/Unit';
import { UNIT_DEFINITIONS } from '../../../src/data/definitions/units';
import { createStoryState } from '../../../src/core/models/story';

describe('Save Round-trip', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
  });

  it('should round-trip save data correctly', async () => {
    const port = createLocalStorageSavePort('test:save');
    const seed = 1337;

    const team = createTeam([
      createUnit(UNIT_DEFINITIONS.adept, 1, 0),
      createUnit(UNIT_DEFINITIONS.war_mage, 1, 0),
      createUnit(UNIT_DEFINITIONS.mystic, 1, 0),
      createUnit(UNIT_DEFINITIONS.ranger, 1, 0),
    ]);

    const snapshot: GameStateSnapshot = {
      battle: null,
      team,
      story: createStoryState(1),
      gold: 100,
      unitsCollected: ['adept', 'war_mage'],
    };
    
    // Set some flags
    snapshot.story.flags['test-flag'] = true;
    snapshot.story.flags['counter'] = 5;

    // Save
    const saveResult = await saveGame(port, snapshot, seed, 'Test save');
    expect(saveResult.ok).toBe(true);

    // Load
    const loadResult = await loadGame(port);
    expect(loadResult.ok).toBe(true);
    
    if (loadResult.ok) {
      const loaded = loadResult.value;
      
      // Verify data integrity
      expect(loaded.seed).toBe(seed);
      expect(loaded.state.story.chapter).toBe(snapshot.story.chapter);
      expect(loaded.state.gold).toBe(snapshot.gold);
      expect(loaded.state.story.flags).toEqual(snapshot.story.flags);
      expect(loaded.state.unitsCollected).toEqual(snapshot.unitsCollected);
      expect(loaded.state.team.units.length).toBe(snapshot.team.units.length);
      
      // Deep compare team units
      for (let i = 0; i < snapshot.team.units.length; i++) {
        const original = snapshot.team.units[i];
        const loadedUnit = loaded.state.team.units[i];
        expect(loadedUnit.id).toBe(original.id);
        expect(loadedUnit.name).toBe(original.name);
        expect(loadedUnit.level).toBe(original.level);
        expect(loadedUnit.currentHp).toBe(original.currentHp);
      }
    }
  });

  it('should handle missing save gracefully', async () => {
    const port = createLocalStorageSavePort('nonexistent:save');
    
    const loadResult = await loadGame(port);
    expect(loadResult.ok).toBe(false);
    if (!loadResult.ok) {
      expect(loadResult.error).toContain('No save data');
    }
  });

  it('should save and load with notes', async () => {
    const port = createLocalStorageSavePort('test:save:notes');
    const seed = 42;
    const notes = 'Test notes for debugging';

    const unit1 = createUnit(UNIT_DEFINITIONS.adept, 1, 0);
    const unit2 = createUnit(UNIT_DEFINITIONS.war_mage, 1, 0);
    const unit3 = createUnit(UNIT_DEFINITIONS.mystic, 1, 0);
    const unit4 = createUnit(UNIT_DEFINITIONS.ranger, 1, 0);
    
    const snapshot: GameStateSnapshot = {
      battle: null,
      team: createTeam([unit1, unit2, unit3, unit4]),
      story: createStoryState(1),
      gold: 0,
      unitsCollected: [],
    };

    await saveGame(port, snapshot, seed, notes);
    
    const loadResult = await loadGame(port);
    expect(loadResult.ok).toBe(true);
    if (loadResult.ok) {
      expect(loadResult.value.notes).toBe(notes);
    }
  });
});

