/**
 * SaveService Tests
 * Tests for enhanced save/load with checksums, backups, and validation
 */

import { describe, test, expect, beforeEach, afterEach } from 'vitest';
import {
  saveProgress,
  loadProgress,
  saveBattle,
  loadBattle,
  deleteBattleSave,
  autoSave,
  loadAutoSave,
  hasAutoSave,
  hasSaveSlot,
  deleteSaveSlot,
  getSaveSlotMetadata,
  listSaveSlots,
} from '@/core/services/SaveService';
import { calculateChecksum, verifyChecksum } from '@/core/validation/saveFileValidation';
import { mkBattle, mkUnit, mkTeam } from '@/test/factories';
import type { SaveV1 } from '@/data/schemas/SaveV1Schema';

// Mock localStorage for tests
const localStorageMock = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value;
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

// Replace global localStorage with mock
Object.defineProperty(global, 'localStorage', {
  value: localStorageMock,
  writable: true,
});

/**
 * Create minimal valid SaveV1 for testing
 */
function createTestSave(): SaveV1 {
  const units = [
    mkUnit({ id: 'u1', level: 5 }),
    mkUnit({ id: 'u2', level: 5 }),
    mkUnit({ id: 'u3', level: 5 }),
    mkUnit({ id: 'u4', level: 5 }),
  ];

  return {
    version: '1.0.0',
    timestamp: Date.now(),
    playerData: {
      unitsCollected: units,
      activeParty: ['u1', 'u2', 'u3', 'u4'],
      inventory: [],
      gold: 100,
      djinnCollected: [],
      recruitmentFlags: {},
      storyFlags: {},
    },
    overworldState: {
      playerPosition: { x: 0, y: 0 },
      currentScene: 'test-scene',
      npcStates: {},
    },
    stats: {
      battlesWon: 5,
      battlesLost: 1,
      totalDamageDealt: 1000,
      totalHealingDone: 500,
      playtime: 3600,
    },
  };
}

describe('SaveService - Checksum Validation', () => {
  beforeEach(() => {
    localStorageMock.clear();
  });

  test('calculateChecksum produces consistent hashes', () => {
    const data = { foo: 'bar', baz: 123 };

    const hash1 = calculateChecksum(data);
    const hash2 = calculateChecksum(data);

    expect(hash1).toBe(hash2);
    expect(hash1).toMatch(/^[0-9a-f]{8}$/);
  });

  test('verifyChecksum detects data changes', () => {
    const original = { foo: 'bar', baz: 123 };
    const modified = { foo: 'bar', baz: 456 };

    const checksum = calculateChecksum(original);

    expect(verifyChecksum(original, checksum)).toBe(true);
    expect(verifyChecksum(modified, checksum)).toBe(false);
  });

  test('checksum is included in save file', () => {
    const saveData = createTestSave();

    const result = saveProgress(1, saveData);
    expect(result.ok).toBe(true);

    const stored = localStorage.getItem('vale_chronicles_v2_save_slot_1');
    expect(stored).toBeDefined();

    if (stored) {
      const wrapper = JSON.parse(stored);
      expect(wrapper.checksum).toBeDefined();
      expect(wrapper.checksum).toMatch(/^[0-9a-f]{8}$/);
    }
  });

  test('corrupted save fails checksum validation', () => {
    const saveData = createTestSave();

    // Save valid data
    const saveResult = saveProgress(1, saveData);
    expect(saveResult.ok).toBe(true);

    // Corrupt the save (modify data without updating checksum)
    const stored = localStorage.getItem('vale_chronicles_v2_save_slot_1');
    if (stored) {
      const wrapper = JSON.parse(stored);
      wrapper.data.playerData.gold = 99999; // Cheat!
      localStorage.setItem('vale_chronicles_v2_save_slot_1', JSON.stringify(wrapper));
    }

    // Load should detect corruption
    const loadResult = loadProgress(1);
    expect(loadResult.ok).toBe(false);
    if (!loadResult.ok) {
      expect(loadResult.error).toContain('corrupted');
    }
  });
});

describe('SaveService - Backup System', () => {
  beforeEach(() => {
    localStorageMock.clear();
  });

  test('saving creates backup of existing save', () => {
    const save1 = createTestSave();
    save1.playerData.gold = 100;

    // First save
    saveProgress(1, save1);

    const save2 = createTestSave();
    save2.playerData.gold = 200;

    // Second save (should backup first)
    saveProgress(1, save2);

    // Backup should exist
    const backup = localStorage.getItem('vale_chronicles_v2_save_slot_1_backup');
    expect(backup).toBeDefined();

    if (backup) {
      const wrapper = JSON.parse(backup);
      expect(wrapper.data.playerData.gold).toBe(100); // Old value
    }
  });

  test('corrupted save falls back to backup', () => {
    const saveData = createTestSave();
    saveData.playerData.gold = 500;

    // Save twice to create backup
    saveProgress(1, saveData);
    saveData.playerData.gold = 600;
    saveProgress(1, saveData);

    // Corrupt main save
    localStorage.setItem('vale_chronicles_v2_save_slot_1', 'corrupted{json}');

    // Load should fall back to backup
    const loadResult = loadProgress(1);
    expect(loadResult.ok).toBe(true);

    if (loadResult.ok) {
      expect(loadResult.value.playerData.gold).toBe(500); // Backup value
    }
  });

  test('both main and backup corrupted returns error', () => {
    // Corrupt both
    localStorage.setItem('vale_chronicles_v2_save_slot_1', 'corrupted');
    localStorage.setItem('vale_chronicles_v2_save_slot_1_backup', 'also_corrupted');

    const loadResult = loadProgress(1);
    expect(loadResult.ok).toBe(false);

    if (!loadResult.ok) {
      expect(loadResult.error).toContain('corrupted');
    }
  });
});

describe('SaveService - Progress Save/Load', () => {
  beforeEach(() => {
    localStorageMock.clear();
  });

  test('save and load roundtrip preserves data', () => {
    const saveData = createTestSave();
    saveData.playerData.gold = 12345;
    saveData.stats.battlesWon = 42;

    const saveResult = saveProgress(1, saveData);
    expect(saveResult.ok).toBe(true);

    const loadResult = loadProgress(1);
    expect(loadResult.ok).toBe(true);

    if (loadResult.ok) {
      expect(loadResult.value.playerData.gold).toBe(12345);
      expect(loadResult.value.stats.battlesWon).toBe(42);
    }
  });

  test('multiple slots are independent', () => {
    const save1 = createTestSave();
    save1.playerData.gold = 100;

    const save2 = createTestSave();
    save2.playerData.gold = 200;

    const save3 = createTestSave();
    save3.playerData.gold = 300;

    saveProgress(0, save1);
    saveProgress(1, save2);
    saveProgress(2, save3);

    const load1 = loadProgress(0);
    const load2 = loadProgress(1);
    const load3 = loadProgress(2);

    expect(load1.ok && load1.value.playerData.gold).toBe(100);
    expect(load2.ok && load2.value.playerData.gold).toBe(200);
    expect(load3.ok && load3.value.playerData.gold).toBe(300);
  });

  test('invalid slot returns error', () => {
    const saveData = createTestSave();

    expect(saveProgress(-1, saveData).ok).toBe(false);
    expect(saveProgress(3, saveData).ok).toBe(false);
    expect(loadProgress(-1).ok).toBe(false);
    expect(loadProgress(3).ok).toBe(false);
  });

  test('loading empty slot returns error', () => {
    const loadResult = loadProgress(1);
    expect(loadResult.ok).toBe(false);

    if (!loadResult.ok) {
      expect(loadResult.error).toContain('No save file found');
    }
  });
});

describe('SaveService - Battle Save/Load', () => {
  beforeEach(() => {
    localStorageMock.clear();
  });

  test('save and load battle state', () => {
    const battle = mkBattle({
      party: [mkUnit({ id: 'u1' })],
    });

    const saveResult = saveBattle(battle);
    expect(saveResult.ok).toBe(true);

    const loadResult = loadBattle();
    expect(loadResult.ok).toBe(true);

    if (loadResult.ok) {
      expect(loadResult.value.phase).toBe('planning');
      expect(loadResult.value.playerTeam.units.length).toBeGreaterThan(0);
    }
  });

  test('battle save has checksum', () => {
    const battle = mkBattle({});

    saveBattle(battle);

    const stored = localStorage.getItem('vale_chronicles_v2_battle');
    expect(stored).toBeDefined();

    if (stored) {
      const wrapper = JSON.parse(stored);
      expect(wrapper.checksum).toBeDefined();
    }
  });

  test('delete battle save removes main and backup', () => {
    const battle = mkBattle({});

    saveBattle(battle);
    saveBattle(battle); // Creates backup

    const result = deleteBattleSave();
    expect(result.ok).toBe(true);

    expect(localStorage.getItem('vale_chronicles_v2_battle')).toBeNull();
    expect(localStorage.getItem('vale_chronicles_v2_battle_backup')).toBeNull();
  });
});

describe('SaveService - Auto-Save', () => {
  beforeEach(() => {
    localStorageMock.clear();
  });

  test('auto-save saves to slot 0', () => {
    const saveData = createTestSave();

    const result = autoSave(saveData);
    expect(result.ok).toBe(true);

    expect(hasSaveSlot(0)).toBe(true);
    expect(hasAutoSave()).toBe(true);
  });

  test('load auto-save loads from slot 0', () => {
    const saveData = createTestSave();
    saveData.playerData.gold = 999;

    autoSave(saveData);

    const loadResult = loadAutoSave();
    expect(loadResult.ok).toBe(true);

    if (loadResult.ok) {
      expect(loadResult.value.playerData.gold).toBe(999);
    }
  });
});

describe('SaveService - Slot Management', () => {
  beforeEach(() => {
    localStorageMock.clear();
  });

  test('hasSaveSlot returns correct status', () => {
    expect(hasSaveSlot(0)).toBe(false);
    expect(hasSaveSlot(1)).toBe(false);
    expect(hasSaveSlot(2)).toBe(false);

    const saveData = createTestSave();
    saveProgress(1, saveData);

    expect(hasSaveSlot(0)).toBe(false);
    expect(hasSaveSlot(1)).toBe(true);
    expect(hasSaveSlot(2)).toBe(false);
  });

  test('deleteSaveSlot removes save and backup', () => {
    const saveData = createTestSave();

    saveProgress(1, saveData);
    saveProgress(1, saveData); // Creates backup

    expect(hasSaveSlot(1)).toBe(true);

    const result = deleteSaveSlot(1);
    expect(result.ok).toBe(true);

    expect(hasSaveSlot(1)).toBe(false);
    expect(localStorage.getItem('vale_chronicles_v2_save_slot_1')).toBeNull();
    expect(localStorage.getItem('vale_chronicles_v2_save_slot_1_backup')).toBeNull();
  });
});

describe('SaveService - Slot Metadata', () => {
  beforeEach(() => {
    localStorageMock.clear();
  });

  test('empty slot returns exists: false', () => {
    const metadata = getSaveSlotMetadata(1);

    expect(metadata.exists).toBe(false);
    expect(metadata.timestamp).toBeUndefined();
  });

  test('metadata includes save info', () => {
    const saveData = createTestSave();
    saveData.playerData.gold = 500;
    saveData.stats.playtime = 7200;

    saveProgress(1, saveData);

    const metadata = getSaveSlotMetadata(1);

    expect(metadata.exists).toBe(true);
    expect(metadata.gold).toBe(500);
    expect(metadata.playtime).toBe(7200);
    expect(metadata.timestamp).toBeDefined();
    expect(metadata.teamLevel).toBeGreaterThan(0);
    expect(metadata.corrupted).toBe(false);
  });

  test('corrupted save marked as corrupted', () => {
    localStorage.setItem('vale_chronicles_v2_save_slot_1', 'corrupted{json}');

    const metadata = getSaveSlotMetadata(1);

    expect(metadata.exists).toBe(true);
    expect(metadata.corrupted).toBe(true);
  });

  test('listSaveSlots returns all 3 slots', () => {
    const saveData = createTestSave();

    saveProgress(0, saveData);
    saveProgress(2, saveData);

    const list = listSaveSlots();

    expect(list.length).toBe(3);
    expect(list[0]?.exists).toBe(true);
    expect(list[1]?.exists).toBe(false);
    expect(list[2]?.exists).toBe(true);
  });
});

describe('SaveService - Error Handling', () => {
  beforeEach(() => {
    localStorageMock.clear();
  });

  test('invalid save data returns error', () => {
    const invalidData = { foo: 'bar' } as any;

    const result = saveProgress(1, invalidData);
    expect(result.ok).toBe(false);

    if (!result.ok) {
      expect(result.error).toContain('Invalid save data');
    }
  });

  test('localStorage quota exceeded handled gracefully', () => {
    // Mock quota exceeded
    const originalSetItem = localStorage.setItem;
    localStorage.setItem = () => {
      throw new Error('QuotaExceededError');
    };

    const saveData = createTestSave();
    const result = saveProgress(1, saveData);

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error).toContain('Failed to save');
    }

    // Restore
    localStorage.setItem = originalSetItem;
  });
});
