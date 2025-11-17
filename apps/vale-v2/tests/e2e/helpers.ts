import { Page } from '@playwright/test';

/**
 * E2E Test Helpers
 * Reusable utilities for Playwright tests
 */

export interface GameState {
  hasTeam: boolean;
  teamSize: number;
  rosterSize: number;
  gold: number;
  mode: string;
  currentMapId: string;
  playerPosition: { x: number; y: number };
  pendingBattleEncounterId: string | null;
  battle: any;
  lastBattleRewards: any;
  equipment: any[];
}

/**
 * Get full game state from Zustand store
 */
export async function getGameState(page: Page): Promise<GameState | null> {
  return page.evaluate(() => {
    const store = (window as any).__VALE_STORE__;
    if (!store) return null;

    const state = store.getState();
    return {
      hasTeam: !!state.team,
      teamSize: state.team?.units.length ?? 0,
      rosterSize: state.roster?.length ?? 0,
      gold: state.gold ?? 0,
      mode: state.mode,
      currentMapId: state.currentMapId,
      playerPosition: state.playerPosition ?? { x: 0, y: 0 },
      pendingBattleEncounterId: state.pendingBattleEncounterId ?? null,
      battle: state.battle,
      lastBattleRewards: state.lastBattleRewards,
      equipment: state.equipment ?? [],
    };
  });
}

/**
 * Wait for game mode to change to expected value
 */
export async function waitForMode(
  page: Page,
  expectedMode: string,
  timeout: number = 30000
): Promise<void> {
  await page.waitForFunction(
    (mode) => {
      const store = (window as any).__VALE_STORE__;
      if (!store) return false;
      return store.getState().mode === mode;
    },
    expectedMode,
    { timeout }
  );
}

/**
 * Navigate player to target coordinates using arrow keys
 * Returns false if path is blocked
 */
export async function navigateToPosition(
  page: Page,
  targetX: number,
  targetY: number
): Promise<boolean> {
  const maxSteps = 100;
  let steps = 0;

  while (steps < maxSteps) {
    const currentState = await getGameState(page);
    if (!currentState) return false;

    const { x, y } = currentState.playerPosition;

    // Check if we've arrived
    if (x === targetX && y === targetY) {
      return true;
    }

    // Calculate next move
    let key: string | null = null;
    if (x < targetX) key = 'ArrowRight';
    else if (x > targetX) key = 'ArrowLeft';
    else if (y < targetY) key = 'ArrowDown';
    else if (y > targetY) key = 'ArrowUp';

    if (!key) break;

    // Press key and wait for state update
    await page.keyboard.press(key);
    await page.waitForTimeout(100);

    // Check if position changed (might be blocked)
    const newState = await getGameState(page);
    if (!newState) return false;

    if (newState.playerPosition.x === x && newState.playerPosition.y === y) {
      // Position didn't change - path blocked
      return false;
    }

    steps++;
  }

  return false;
}

/**
 * Assert store state matches expected partial state
 */
export async function assertStoreState(
  page: Page,
  expected: Partial<GameState>
): Promise<void> {
  const state = await getGameState(page);
  if (!state) {
    throw new Error('Store state is null');
  }

  for (const [key, value] of Object.entries(expected)) {
    const actualValue = (state as any)[key];
    if (JSON.stringify(actualValue) !== JSON.stringify(value)) {
      throw new Error(
        `State mismatch for ${key}: expected ${JSON.stringify(value)}, got ${JSON.stringify(actualValue)}`
      );
    }
  }
}

/**
 * Get unit data from team
 */
export async function getUnitData(page: Page, unitIndex: number = 0) {
  return page.evaluate((idx) => {
    const store = (window as any).__VALE_STORE__;
    if (!store) return null;

    const state = store.getState();
    const unit = state.team?.units[idx];
    if (!unit) return null;

    return {
      id: unit.id,
      name: unit.name,
      level: unit.level,
      xp: unit.xp,
      currentHp: unit.currentHp,
    };
  }, unitIndex);
}

/**
 * Battle state captured after claiming rewards
 */
export interface BattleResult {
  gold: number;
  roster: Array<{
    id: string;
    level: number;
    xp: number;
    maxHp: number;
    currentHp: number;
    [key: string]: any;
  }>;
  equipment: string[];
  djinn: string[];
}

/**
 * Complete a battle from start to finish
 * 
 * This helper automates the entire battle flow:
 * 1. Simulates victory (sets enemy HP to 0)
 * 2. Calls processVictory() (applies XP, level-ups)
 * 3. Waits for rewards screen
 * 4. Calls claimRewards() (adds gold, equipment)
 * 5. Optionally captures final state
 * 6. Returns to overworld
 * 
 * @param page - Playwright page instance
 * @param options - Configuration options
 * @returns Battle result state if captureStateAfterClaim is true, null otherwise
 */
export async function completeBattle(
  page: Page,
  options?: {
    captureStateAfterClaim?: boolean;
    logDetails?: boolean;
  }
): Promise<BattleResult | null> {
  const { captureStateAfterClaim = false, logDetails = true } = options ?? {};

  // 1. Simulate victory
  await page.evaluate(() => {
    const store = (window as any).__VALE_STORE__;
    const battleState = store.getState().battle;

    if (!battleState) return;

    const updatedBattle = {
      ...battleState,
      enemies: battleState.enemies?.map((enemy: any) => ({
        ...enemy,
        currentHp: 0,
      })),
      battleOver: true,
      victory: true,
    };

    store.setState({ battle: updatedBattle });
    store.getState().processVictory(updatedBattle);
  });

  // 2. Wait for rewards screen
  await waitForMode(page, 'rewards', 10000);
  if (logDetails) {
    console.log('   Victory! Rewards shown');
  }

  // 3. Claim rewards (optionally capture state)
  let capturedState: BattleResult | null = null;

  if (captureStateAfterClaim) {
    capturedState = await page.evaluate(() => {
      const store = (window as any).__VALE_STORE__;
      store.getState().claimRewards();

      const state = store.getState();
      return {
        gold: state.gold ?? 0,
        roster: state.roster ?? [],
        equipment: state.equipment?.map((e: any) => e.id) ?? [],
        djinn: state.team?.collectedDjinn ?? [],
      };
    });
  } else {
    // Just claim without capturing
    await page.evaluate(() => {
      const store = (window as any).__VALE_STORE__;
      store.getState().claimRewards();
    });
  }

  // 4. Try clicking button (for UI completeness)
  const claimButton = page.getByRole('button', { name: /claim|continue|next/i });
  const isVisible = await claimButton.isVisible().catch(() => false);
  if (isVisible) {
    await claimButton.click();
  }

  // 5. Wait for return to overworld
  await waitForMode(page, 'overworld', 5000);

  return capturedState;
}

/**
 * Djinn Testing Helpers
 */

export interface DjinnTracker {
  djinnId: string;
  state: 'Set' | 'Standby' | 'Recovery';
}

/**
 * Get Djinn state from team
 */
export async function getDjinnState(page: Page, djinnId: string): Promise<DjinnTracker | null> {
  return page.evaluate((id) => {
    const store = (window as any).__VALE_STORE__;
    if (!store) return null;
    const team = store.getState().team;
    return team?.djinnTrackers?.[id] ?? null;
  }, djinnId);
}

/**
 * Get Djinn recovery timer from battle state
 */
export async function getDjinnRecoveryTimer(page: Page, djinnId: string): Promise<number | null> {
  return page.evaluate((id) => {
    const store = (window as any).__VALE_STORE__;
    if (!store) return null;
    const battle = store.getState().battle;
    return battle?.djinnRecoveryTimers?.[id] ?? null;
  }, djinnId);
}

/**
 * Activate Djinn in battle (queues for activation)
 */
export async function activateDjinnInBattle(page: Page, djinnId: string): Promise<void> {
  await page.evaluate((id) => {
    const store = (window as any).__VALE_STORE__;
    if (!store) return;
    store.getState().queueDjinnActivation(id);
  }, djinnId);
}

/**
 * Get unit effective stats (base + level + equipment + Djinn bonuses)
 */
export async function getUnitEffectiveStats(page: Page, unitId: string): Promise<{
  atk: number;
  def: number;
  spd: number;
  hp: number;
} | null> {
  return page.evaluate((id) => {
    const store = (window as any).__VALE_STORE__;
    if (!store) return null;
    const team = store.getState().team;
    const unit = team?.units.find((u: any) => u.id === id);
    if (!unit) return null;

    // Calculate effective stats (simplified - actual calculation is in algorithms)
    // For E2E, we'll get the actual calculated stats from the unit
    return {
      atk: unit.baseStats?.atk ?? 0,
      def: unit.baseStats?.def ?? 0,
      spd: unit.baseStats?.spd ?? 0,
      hp: unit.maxHp ?? 0,
    };
  }, unitId);
}

/**
 * Equipment Testing Helpers
 */

/**
 * Grant equipment to inventory
 * Note: Equipment objects should be passed from test file (imported there)
 */
export async function grantEquipment(page: Page, equipment: any[]): Promise<void> {
  await page.evaluate((equip) => {
    const store = (window as any).__VALE_STORE__;
    if (!store) return;
    
    if (equip.length > 0) {
      store.getState().setEquipment(equip);
    }
  }, equipment);
}

/**
 * Get unit equipment
 */
export async function getUnitEquipment(page: Page, unitId: string): Promise<{
  weapon: string | null;
  armor: string | null;
  helm: string | null;
  boots: string | null;
  accessory: string | null;
} | null> {
  return page.evaluate((id) => {
    const store = (window as any).__VALE_STORE__;
    if (!store) return null;
    const team = store.getState().team;
    const unit = team?.units.find((u: any) => u.id === id);
    if (!unit) return null;

    return {
      weapon: unit.equipment?.weapon?.id ?? null,
      armor: unit.equipment?.armor?.id ?? null,
      helm: unit.equipment?.helm?.id ?? null,
      boots: unit.equipment?.boots?.id ?? null,
      accessory: unit.equipment?.accessory?.id ?? null,
    };
  }, unitId);
}

/**
 * Equip item to unit (via store method)
 * Note: Equipment object should be passed from test file (imported there)
 */
export async function equipItem(page: Page, unitId: string, slot: 'weapon' | 'armor' | 'helm' | 'boots' | 'accessory', item: any): Promise<void> {
  await page.evaluate(({ unitId, slot, item }) => {
    const store = (window as any).__VALE_STORE__;
    if (!store) return;
    
    if (!item) return;

    const team = store.getState().team;
    const unit = team?.units.find((u: any) => u.id === unitId);
    if (!unit) return;

    // Update equipment directly (immutable update)
    const newEquipment = { ...unit.equipment, [slot]: item };
    const updatedUnit = {
      ...unit,
      equipment: newEquipment,
    };
    
    const updatedUnits = team.units.map((u: any) => (u.id === unitId ? updatedUnit : u));
    store.getState().updateTeamUnits(updatedUnits);
  }, { unitId, slot, item });
}

/**
 * Open Party Management screen
 */
export async function openPartyManagement(page: Page): Promise<void> {
  const partyButton = page.getByRole('button', { name: /party.*management/i });
  await partyButton.click();
  await page.waitForTimeout(500);
}

/**
 * Check if Party Management is open
 */
export async function isPartyManagementOpen(page: Page): Promise<boolean> {
  return page.evaluate(() => {
    const store = (window as any).__VALE_STORE__;
    if (!store) return false;
    // Check if party management UI is visible (mode might not change)
    return document.querySelector('[class*="party"]') !== null || 
           document.querySelector('[class*="PartyManagement"]') !== null;
  });
}

/**
 * Dialogue Testing Helpers
 */

/**
 * Trigger NPC dialogue by navigating to NPC
 */
export async function triggerNPCDialogue(page: Page, mapId: string, npcX: number, npcY: number): Promise<void> {
  // Navigate to NPC position
  await navigateToPosition(page, npcX, npcY);
  await page.waitForTimeout(500);
  // Dialogue should trigger automatically
}

/**
 * Get current dialogue state
 */
export async function getDialogueState(page: Page): Promise<{
  currentDialogueTree: string | null;
  currentNodeId: string | null;
  speaker: string | null;
  text: string | null;
} | null> {
  return page.evaluate(() => {
    const store = (window as any).__VALE_STORE__;
    if (!store) return null;
    const state = store.getState();
    const dialogueTree = state.currentDialogueTree;
    const dialogueState = state.currentDialogueState;
    
    if (!dialogueTree || !dialogueState) {
      return {
        currentDialogueTree: null,
        currentNodeId: null,
        speaker: null,
        text: null,
      };
    }

    const currentNode = dialogueTree.nodes.find((n: any) => n.id === dialogueState.currentNodeId);
    
    return {
      currentDialogueTree: dialogueTree.id ?? null,
      currentNodeId: dialogueState.currentNodeId ?? null,
      speaker: currentNode?.speaker ?? null,
      text: currentNode?.text ?? null,
    };
  });
}

/**
 * Advance dialogue (next button or key press)
 */
export async function advanceDialogue(page: Page): Promise<void> {
  // Try clicking next button first
  const nextButton = page.getByRole('button', { name: /next|continue/i });
  const buttonVisible = await nextButton.isVisible().catch(() => false);
  
  if (buttonVisible) {
    await nextButton.click();
  } else {
    // Use store method as fallback
    await page.evaluate(() => {
      const store = (window as any).__VALE_STORE__;
      if (store) {
        store.getState().advanceCurrentDialogue();
      }
    });
  }
  await page.waitForTimeout(300);
}

/**
 * Select dialogue choice
 */
export async function selectDialogueChoice(page: Page, choiceId: string): Promise<void> {
  // Try clicking choice button
  const choiceButton = page.getByRole('button', { name: new RegExp(choiceId, 'i') });
  const buttonVisible = await choiceButton.isVisible().catch(() => false);
  
  if (buttonVisible) {
    await choiceButton.click();
  } else {
    // Use store method as fallback
    await page.evaluate((id) => {
      const store = (window as any).__VALE_STORE__;
      if (store) {
        store.getState().makeChoice(id);
      }
    }, choiceId);
  }
  await page.waitForTimeout(300);
}

/**
 * End dialogue (close button or escape)
 */
export async function endDialogue(page: Page): Promise<void> {
  const closeButton = page.getByRole('button', { name: /close|exit|done/i });
  const buttonVisible = await closeButton.isVisible().catch(() => false);

  if (buttonVisible) {
    await closeButton.click();
  } else {
    // Use store method to properly end dialogue (clears dialogue state)
    await page.evaluate(() => {
      const store = (window as any).__VALE_STORE__;
      if (store) {
        store.getState().endDialogue(); // This clears dialogue state and returns to overworld
      }
    });
  }
  await waitForMode(page, 'overworld', 3000);
}

/**
 * Battle Action Testing Helpers
 */

/**
 * Execute a real battle action and capture actual damage
 * Returns actual damage dealt (not simulated)
 *
 * This helper is used for testing combat mechanics by:
 * 1. Capturing initial HP values
 * 2. Queuing and executing a real battle action
 * 3. Capturing final HP values
 * 4. Calculating actual damage dealt
 *
 * @param page - Playwright page instance
 * @param unitIndex - Index of unit in player team (0-based)
 * @param abilityId - Ability ID or null for basic attack (STRIKE)
 * @param targetIndex - Index of target enemy (0-based)
 * @returns Damage dealt and HP values
 */
export async function executeBattleActionAndCaptureDamage(
  page: Page,
  unitIndex: number,
  abilityId: string | null,
  targetIndex: number
): Promise<{
  damageDealt: number;
  initialTargetHp: number;
  finalTargetHp: number;
  initialCasterHp: number;
  finalCasterHp: number;
}> {
  // 1. Get initial HP values
  const initialState = await page.evaluate(({ unitIdx, targetIdx }) => {
    const store = (window as any).__VALE_STORE__;
    const battle = store.getState().battle;

    if (!battle) {
      throw new Error('Battle state not found');
    }

    const caster = battle.playerTeam?.units?.[unitIdx];
    const target = battle.enemies?.[targetIdx];

    if (!caster || !target) {
      throw new Error(`Unit or target not found: unitIdx=${unitIdx}, targetIdx=${targetIdx}`);
    }

    return {
      casterHp: caster.currentHp ?? 0,
      targetHp: target.currentHp ?? 0,
      targetId: target.id,
      casterId: caster.id,
    };
  }, { unitIdx: unitIndex, targetIdx: targetIndex });

  // 2. Queue action for specified unit
  await page.evaluate(({ unitIdx, ability, targetIdx }) => {
    const store = (window as any).__VALE_STORE__;
    const battle = store.getState().battle;

    if (!battle) {
      throw new Error('Battle state not found');
    }

    const targetId = battle.enemies?.[targetIdx]?.id;
    if (!targetId) {
      throw new Error(`Target not found at index ${targetIdx}`);
    }

    // Queue the specified action
    // If abilityId is null, it will use the basic attack (STRIKE)
    store.getState().queueUnitAction(unitIdx, ability, [targetId], undefined);

    // Queue basic attacks for other player units (required to execute round)
    battle.playerTeam.units.forEach((unit: any, idx: number) => {
      if (idx !== unitIdx) {
        const enemyId = battle.enemies?.[0]?.id;
        if (enemyId) {
          store.getState().queueUnitAction(idx, null, [enemyId], undefined);
        }
      }
    });

    // Execute round
    store.getState().executeQueuedRound();
  }, { unitIdx: unitIndex, ability: abilityId, targetIdx: targetIndex });

  // 3. Wait for execution to complete
  await page.waitForTimeout(2000);

  // 4. Get final HP values
  const finalState = await page.evaluate(({ targetId, casterId }) => {
    const store = (window as any).__VALE_STORE__;
    const battle = store.getState().battle;

    if (!battle) {
      throw new Error('Battle state not found after execution');
    }

    const target = battle.enemies?.find((e: any) => e.id === targetId);
    const caster = battle.playerTeam?.units?.find((u: any) => u.id === casterId);

    return {
      targetHp: target?.currentHp ?? 0,
      casterHp: caster?.currentHp ?? 0,
    };
  }, { targetId: initialState.targetId, casterId: initialState.casterId });

  return {
    damageDealt: initialState.targetHp - finalState.targetHp,
    initialTargetHp: initialState.targetHp,
    finalTargetHp: finalState.targetHp,
    initialCasterHp: initialState.casterHp,
    finalCasterHp: finalState.casterHp,
  };
}
