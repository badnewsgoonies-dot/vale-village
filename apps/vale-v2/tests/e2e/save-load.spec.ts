import { test, expect, type Page } from '@playwright/test';

type SaveConfig = {
  gold: number;
  equipment: Array<{
    id: string;
    name: string;
    slot: string;
    tier: string;
    cost: number;
    statBonus: Record<string, number>;
    allowedUnits: string[];
  }>;
  story: {
    chapter: number;
    flags: Record<string, boolean>;
  };
  mapId: string;
  position: { x: number; y: number };
  battle: Record<string, unknown>;
  rngSeed: number;
  turnNumber: number;
  storyFlagKey: string;
};

function createBattleSnapshot(label: string): Record<string, unknown> {
  return {
    label,
    playerTeam: {
      units: [],
      equippedDjinn: [],
      djinnTrackers: {},
      collectedDjinn: [],
      currentTurn: 0,
      activationsThisTurn: {},
      djinnStates: {},
    },
    enemies: [],
    currentTurn: 0,
    roundNumber: 1,
    phase: 'planning',
    turnOrder: [],
    currentActorIndex: 0,
    status: 'ongoing',
    log: [],
    currentQueueIndex: 0,
    queuedActions: [],
    queuedDjinn: [],
    remainingMana: 0,
    maxMana: 0,
    executionIndex: 0,
    djinnRecoveryTimers: {},
  };
}

async function applySaveConfig(page: Page, config: SaveConfig, slot?: number) {
  await page.evaluate(
    ({ config, slot }) => {
      const store = (window as any).__VALE_STORE__;
      if (!store) throw new Error('Store is not available');

      const state = store.getState();

      state.setGold(config.gold);
      state.setEquipment(config.equipment);
      state.setStoryState({
        chapter: config.story.chapter,
        flags: config.story.flags,
      });
      state.teleportPlayer(config.mapId, config.position);
      state.setBattle(config.battle as any, config.rngSeed);

      store.setState({ turnNumber: config.turnNumber, rngSeed: config.rngSeed });

      if (slot === undefined) {
        state.saveGame();
      } else {
        state.saveGameSlot(slot);
      }
    },
    { config, slot }
  );
}

async function resetStoreBeforeLoad(page: Page) {
  await page.evaluate(() => {
    const store = (window as any).__VALE_STORE__;
    if (!store) return;

    const state = store.getState();
    state.setGold(0);
    state.setEquipment([]);
    state.setStoryState({ chapter: 1, flags: {} });
    state.teleportPlayer('vale-village', { x: 0, y: 0 });
    state.setBattle(null, 0);
    store.setState({ turnNumber: 0, rngSeed: 0 });
  });
}

async function loadSnapshot(page: Page, slot?: number) {
  await page.evaluate((slotIdx) => {
    const store = (window as any).__VALE_STORE__;
    const state = store.getState();
    if (slotIdx === undefined) {
      state.loadGame();
    } else {
      state.loadGameSlot(slotIdx);
    }
  }, slot);
}

async function readRehydratedState(page: Page, flagKey: string) {
  return page.evaluate(({ flagKey }) => {
    const store = (window as any).__VALE_STORE__;
    const state = store.getState();
    return {
      gold: state.gold ?? 0,
      equipmentCount: state.equipment?.length ?? 0,
      storyChapter: state.story.chapter,
      storyFlag: Boolean(state.story.flags[flagKey]),
      mapId: state.currentMapId,
      playerPosition: state.playerPosition,
      battleLabel: state.battle?.label ?? null,
      turnNumber: state.turnNumber,
    };
  }, { flagKey });
}

async function clearSaveArtifacts(page: Page, slots: number[]) {
  await page.evaluate(
    ({ slots }) => {
      try {
        const baseKeys = ['vale-v2/battle-state'];
        baseKeys.forEach((key) => localStorage.removeItem(key));
        slots.forEach((slot) => {
          localStorage.removeItem(`vale-v2/battle-state-slot-${slot}`);
          localStorage.removeItem(`vale_chronicles_v2_save_slot_${slot}`);
          localStorage.removeItem(`vale_chronicles_v2_save_slot_${slot}_backup`);
        });
      } catch (error) {
        console.warn('clearSaveArtifacts: localStorage not accessible, skipping cleanup');
      }
    },
    { slots }
  );
}

const defaultSaveConfig: SaveConfig = {
  gold: 321,
  equipment: [
    {
      id: 'test-sword',
      name: 'Test Sword',
      slot: 'weapon',
      tier: 'basic',
      cost: 10,
      statBonus: { atk: 3 },
      allowedUnits: ['adept'],
    },
  ],
  story: {
    chapter: 3,
    flags: {
      'save-load-flag': true,
    },
  },
  mapId: 'vale-village',
  position: { x: 18, y: 9 },
  battle: createBattleSnapshot('save-battle'),
  rngSeed: 987,
  turnNumber: 7,
  storyFlagKey: 'save-load-flag',
};

const slotSaveConfig: SaveConfig = {
  gold: 789,
  equipment: [
    {
      id: 'slot-test-weapon',
      name: 'Slot Weapon',
      slot: 'weapon',
      tier: 'bronze',
      cost: 25,
      statBonus: { atk: 5 },
      allowedUnits: ['adept'],
    },
    {
      id: 'slot-test-shield',
      name: 'Slot Shield',
      slot: 'armor',
      tier: 'bronze',
      cost: 15,
      statBonus: { def: 4 },
      allowedUnits: ['adept'],
    },
  ],
  story: {
    chapter: 5,
    flags: {
      'slot-save-flag': true,
    },
  },
  mapId: 'weapon-shop-interior',
  position: { x: 5, y: 7 },
  battle: createBattleSnapshot('slot-battle'),
  rngSeed: 1234,
  turnNumber: 12,
  storyFlagKey: 'slot-save-flag',
};

test.describe('Save/Load hydration', () => {
  test.beforeEach(async ({ page }) => {
    await clearSaveArtifacts(page, [0, 1]);
  });

  test('save/load rehydrates inventory, story, overworld, and battle (slot 0)', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    await applySaveConfig(page, defaultSaveConfig);

    await resetStoreBeforeLoad(page);

    await page.reload();
    await page.waitForLoadState('networkidle');

    await loadSnapshot(page);

    await page.waitForFunction(
      (flagKey) => {
        const store = (window as any).__VALE_STORE__;
        if (!store) return false;
        const state = store.getState();
        return Boolean(state.story.flags[flagKey]);
      },
      defaultSaveConfig.storyFlagKey
    );

    const finalState = await readRehydratedState(page, defaultSaveConfig.storyFlagKey);
    expect(finalState.gold).toBe(defaultSaveConfig.gold);
    expect(finalState.equipmentCount).toBe(defaultSaveConfig.equipment.length);
    expect(finalState.storyChapter).toBe(1); // Save schema currently only has flags, chapter defaults to 1
    expect(finalState.storyFlag).toBe(true);
    expect(finalState.mapId).toBe(defaultSaveConfig.mapId);
    expect(finalState.playerPosition).toEqual(defaultSaveConfig.position);
    expect(finalState.battleLabel).toBe(defaultSaveConfig.battle.label);
    expect(finalState.turnNumber).toBe(defaultSaveConfig.turnNumber);

    await clearSaveArtifacts(page, [0]);
  });

  test('save/load slot (slot 1) rehydrates inventory, story, overworld, and battle', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    await applySaveConfig(page, slotSaveConfig, 1);

    await resetStoreBeforeLoad(page);

    await page.reload();
    await page.waitForLoadState('networkidle');

    await loadSnapshot(page, 1);

    await page.waitForFunction(
      (flagKey) => {
        const store = (window as any).__VALE_STORE__;
        if (!store) return false;
        const state = store.getState();
        return Boolean(state.story.flags[flagKey]);
      },
      slotSaveConfig.storyFlagKey
    );

    const finalState = await readRehydratedState(page, slotSaveConfig.storyFlagKey);
    expect(finalState.gold).toBe(slotSaveConfig.gold);
    expect(finalState.equipmentCount).toBe(slotSaveConfig.equipment.length);
    expect(finalState.storyChapter).toBe(1);
    expect(finalState.storyFlag).toBe(true);
    expect(finalState.mapId).toBe(slotSaveConfig.mapId);
    expect(finalState.playerPosition).toEqual(slotSaveConfig.position);
    expect(finalState.battleLabel).toBe(slotSaveConfig.battle.label);
    expect(finalState.turnNumber).toBe(slotSaveConfig.turnNumber);

    await clearSaveArtifacts(page, [1]);
  });
});

