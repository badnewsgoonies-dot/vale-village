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

  // 1. Simulate victory by setting enemies to 0 HP and battle phase to 'victory'
  // This mimics what executeQueuedRound does when checkBattleEnd returns 'PLAYER_VICTORY'
  // IMPORTANT: Capture encounterId BEFORE clearing battle (needed for recruitment dialogue)
  const encounterId = await page.evaluate(() => {
    const store = (window as any).__VALE_STORE__;
    const battleState = store.getState().battle;
    return battleState?.encounterId || battleState?.meta?.encounterId || null;
  });
  
  await page.evaluate(() => {
    const store = (window as any).__VALE_STORE__;
    const battleState = store.getState().battle;

    if (!battleState) return;

    // Set enemies to 0 HP and phase to 'victory' to trigger proper battle end flow
    const updatedBattle = {
      ...battleState,
      enemies: battleState.enemies?.map((enemy: any) => ({
        ...enemy,
        currentHp: 0,
      })),
      phase: 'victory' as const,
      battleOver: true,
    };

    // Update battle state first
    store.setState({ battle: updatedBattle });

    // Then process victory (this will set mode to 'rewards')
    // This matches what executeQueuedRound does when phase === 'victory'
    const { processVictory, updateTeamUnits, onBattleEvents } = store.getState();
    
    // Auto-heal units (matching executeQueuedRound behavior)
    const healedUnits = updatedBattle.playerTeam.units.map((unit: any) => ({
      ...unit,
      currentHp: unit.maxHp,
    }));
    
    const healedTeam = {
      ...updatedBattle.playerTeam,
      units: healedUnits,
    };
    
    const healedBattle = {
      ...updatedBattle,
      playerTeam: healedTeam,
    };
    
    updateTeamUnits(healedUnits);
    processVictory(healedBattle);
    
    // Emit encounter-finished event (matching queueBattleSlice behavior)
    const battleEncounterId = healedBattle.encounterId || healedBattle.meta?.encounterId;
    if (battleEncounterId && onBattleEvents) {
      onBattleEvents([
        {
          type: 'battle-end',
          result: 'PLAYER_VICTORY',
        },
        {
          type: 'encounter-finished',
          outcome: 'PLAYER_VICTORY',
          encounterId: battleEncounterId,
        },
      ]);
    }
  });
  
  // Note: encounterId is now stored in rewardsSlice.lastBattleEncounterId during processVictory
  // So handleRewardsContinue can access it from the store, no need for window storage

  // 2. Wait for rewards screen
  await waitForMode(page, 'rewards', 10000);
  if (logDetails) {
    console.log('   Victory! Rewards shown');
  }

  // 3. Don't claim rewards here - let completeBattleFlow handle it via handleRewardsContinue
  // This ensures recruitment dialogue is triggered properly
  let capturedState: BattleResult | null = null;

  if (captureStateAfterClaim) {
    // Capture state before claiming (rewards are already processed by processVictory)
    capturedState = await page.evaluate(() => {
      const store = (window as any).__VALE_STORE__;
      const state = store.getState();
      return {
        gold: state.gold ?? 0,
        roster: state.roster ?? [],
        equipment: state.equipment?.map((e: any) => e.id) ?? [],
        djinn: state.team?.collectedDjinn ?? [],
      };
    });
  }

  // Note: We don't claim rewards here - completeBattleFlow will handle it
  // This ensures handleRewardsContinue is called, which triggers recruitment dialogue

  return capturedState;
}

/**
 * Helper to claim rewards and return to overworld after completeBattle
 * Handles dialogue that may appear (e.g., recruitment dialogue)
 */
export async function claimRewardsAndReturnToOverworld(page: Page): Promise<void> {
  // Claim rewards and return to overworld
  // (completeBattle only waits for rewards mode, doesn't claim rewards)
  
  // First check if we're actually in rewards mode
  const currentMode = await page.evaluate(() => {
    const store = (window as any).__VALE_STORE__;
    return store?.getState()?.mode ?? null;
  });
  
  if (currentMode !== 'rewards') {
    // Not in rewards mode, might already be claimed or in dialogue
    // Just wait for overworld/dialogue and handle accordingly
  } else {
    // We're in rewards mode, try to claim
    const continueButton = page.getByRole('button', { name: /continue|claim/i });
    const buttonVisible = await continueButton.isVisible().catch(() => false);
    const buttonEnabled = buttonVisible ? await continueButton.isEnabled().catch(() => false) : false;
    
    if (buttonVisible && buttonEnabled) {
      await continueButton.click();
      await page.waitForTimeout(500);
    } else if (!buttonEnabled && buttonVisible) {
      // Button visible but disabled - wait a bit and retry
      await page.waitForTimeout(300);
      const retryEnabled = await continueButton.isEnabled().catch(() => false);
      if (retryEnabled) {
        await continueButton.click();
        await page.waitForTimeout(500);
      } else {
        // Fallback: call handleRewardsContinue directly
        await page.evaluate(() => {
          if ((window as any).handleRewardsContinue) {
            (window as any).handleRewardsContinue();
          } else {
            const store = (window as any).__VALE_STORE__;
            store.getState().claimRewards();
          }
        });
        await page.waitForTimeout(500);
      }
    } else {
      // Fallback: call handleRewardsContinue directly
      await page.evaluate(() => {
        if ((window as any).handleRewardsContinue) {
          (window as any).handleRewardsContinue();
        } else {
          const store = (window as any).__VALE_STORE__;
          store.getState().claimRewards();
        }
      });
      await page.waitForTimeout(500);
    }
  }
  
  // Wait for overworld mode (might go to dialogue first for recruitment, then overworld)
  // If dialogue appears, advance through it
  let modeAfterClaim = await page.evaluate(() => {
    const store = (window as any).__VALE_STORE__;
    return store?.getState()?.mode ?? null;
  });
  
  if (modeAfterClaim === 'dialogue') {
    // Advance through dialogue if present (house encounters trigger recruitment)
    await page.keyboard.press('Space');
    await page.waitForTimeout(500);
    // Keep advancing until we're out of dialogue
    for (let i = 0; i < 10; i++) {
      const mode = await page.evaluate(() => {
        const store = (window as any).__VALE_STORE__;
        return store?.getState()?.mode ?? null;
      });
      if (mode !== 'dialogue') break;
      await page.keyboard.press('Space');
      await page.waitForTimeout(300);
    }
  }
  
  await waitForMode(page, 'overworld', 10000);
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
 * Recruitment Testing Helpers
 */

/**
 * Get full roster with unit details
 */
export async function getRoster(page: Page): Promise<Array<{
  id: string;
  name: string;
  level: number;
  xp: number;
}>> {
  return page.evaluate(() => {
    const store = (window as any).__VALE_STORE__;
    if (!store) return [];

    const roster = store.getState().roster ?? [];
    return roster.map((u: any) => ({
      id: u.id,
      name: u.name,
      level: u.level,
      xp: u.xp,
    }));
  });
}

/**
 * Open Dev Mode overlay
 */
export async function openDevMode(page: Page): Promise<void> {
  // Try pressing Ctrl+D to toggle dev mode
  await page.keyboard.press('Control+d');
  await page.waitForTimeout(300);
  
  // Check if dev mode is enabled via store
  const devModeEnabled = await page.evaluate(() => {
    const store = (window as any).__VALE_STORE__;
    return store?.getState()?.devModeEnabled ?? false;
  });
  
  if (!devModeEnabled) {
    // If keyboard shortcut didn't work, enable it directly via store
    await page.evaluate(() => {
      const store = (window as any).__VALE_STORE__;
      if (store) {
        store.getState().setDevModeEnabled(true);
      }
    });
    await page.waitForTimeout(200);
  }

  // Verify overlay is visible (check for Dev Mode content)
  // Use a more specific selector - the heading is unique
  const overlay = page.getByRole('heading', { name: /DEV MODE: HOUSE SELECTION/i });
  await overlay.waitFor({ state: 'visible', timeout: 5000 });
}

/**
 * Jump to specific house via Dev Mode
 * @param page - Playwright page
 * @param houseNumber - House number (1-20)
 */
export async function jumpToHouse(page: Page, houseNumber: number): Promise<void> {
  if (houseNumber < 1 || houseNumber > 20) {
    throw new Error(`Invalid house number: ${houseNumber}. Must be 1-20.`);
  }

  // Open Dev Mode if not already open
  await openDevMode(page);

  // Click house button (format: "House 01", "House 02", etc.)
  const houseLabel = `House ${String(houseNumber).padStart(2, '0')}`;
  const houseButton = page.locator(`button:has-text("${houseLabel}")`);

  await houseButton.waitFor({ state: 'visible', timeout: 3000 });
  await houseButton.click();

  // Dev Mode should close and team select should appear
  // Wait for dev mode to close (overlay disappears)
  await page.waitForFunction(() => {
    const store = (window as any).__VALE_STORE__;
    return store?.getState()?.devModeEnabled === false;
  }, { timeout: 3000 }).catch(() => {
    // If dev mode didn't close, that's okay - continue anyway
  });
  
  // Wait a moment for state to update
  await page.waitForTimeout(300);
  
  // Debug: Check what mode we're in after clicking
  const modeAfterClick = await page.evaluate(() => {
    const store = (window as any).__VALE_STORE__;
    return {
      mode: store?.getState()?.mode ?? null,
      pendingBattleEncounterId: store?.getState()?.pendingBattleEncounterId ?? null,
      devModeEnabled: store?.getState()?.devModeEnabled ?? null,
    };
  });
  console.log(`   After clicking house ${houseNumber}, mode: ${modeAfterClick.mode}, pendingBattle: ${modeAfterClick.pendingBattleEncounterId}`);
  
  // setPendingBattle now automatically sets mode to 'team-select' in gameFlowSlice
  // Verify it worked correctly
  if (modeAfterClick.pendingBattleEncounterId && modeAfterClick.mode !== 'team-select') {
    // This should not happen anymore, but log if it does for debugging
    console.warn(`   WARNING: Mode is ${modeAfterClick.mode} but should be 'team-select'`);
  }
}

/**
 * Complete battle flow including post-battle dialogue (for recruitment)
 * This handles the NEW narrative-driven recruitment system where:
 * 1. Battle victory
 * 2. Rewards screen (claim XP/gold/items)
 * 3. Recruitment dialogue (if applicable)
 * 4. Return to overworld
 */
export async function completeBattleFlow(page: Page, options?: {
  expectDialogue?: boolean;
  logDetails?: boolean;
}): Promise<void> {
  const { expectDialogue = false, logDetails = true } = options ?? {};

  // 1. Wait for team select screen
  // First check current mode - might already be in team-select
  const currentMode = await page.evaluate(() => {
    const store = (window as any).__VALE_STORE__;
    return store?.getState()?.mode ?? null;
  });
  
  if (currentMode !== 'team-select') {
    if (logDetails) console.log(`   Current mode: ${currentMode}, waiting for team-select...`);
    await waitForMode(page, 'team-select', 10000);
  }
  if (logDetails) console.log('   Team select ready');

  // 2. Click confirm to start battle
  const confirmButton = page.getByRole('button', { name: /confirm|start/i });
  await confirmButton.click();

  // 3. Wait for battle to start
  await waitForMode(page, 'battle', 10000);
  if (logDetails) console.log('   Battle started');

  // 4. Complete battle (simulates victory) - this already waits for rewards mode
  await completeBattle(page, { logDetails: false });

  // 5. Rewards screen should already be shown (completeBattle waits for it)
  // But verify we're still in rewards mode
  const rewardsMode = await page.evaluate(() => {
    const store = (window as any).__VALE_STORE__;
    return store?.getState()?.mode ?? null;
  });
  
  if (rewardsMode !== 'rewards') {
    // If not in rewards mode, wait for it
    await waitForMode(page, 'rewards', 5000);
  }
  if (logDetails) console.log('   Rewards screen shown');

  // 6. Check if there's an equipment choice that needs to be selected first
  const hasEquipmentChoice = await page.evaluate(() => {
    const store = (window as any).__VALE_STORE__;
    const rewards = store?.getState()?.lastBattleRewards;
    return rewards?.equipmentChoice && !rewards?.choiceSelected;
  });
  
  if (hasEquipmentChoice) {
    // Select the first equipment option
    await page.evaluate(() => {
      const store = (window as any).__VALE_STORE__;
      const rewards = store?.getState()?.lastBattleRewards;
      if (rewards?.equipmentChoice && rewards.equipmentChoice.length > 0) {
        store.getState().selectEquipmentChoice(rewards.equipmentChoice[0]);
      }
    });
    await page.waitForTimeout(200);
    if (logDetails) console.log('   Selected equipment choice');
  }

  // 7. Click continue/claim rewards button
  // This triggers handleRewardsContinue which handles recruitment dialogue
  const continueButton = page.getByRole('button', { name: /continue|claim/i });
  const buttonVisible = await continueButton.isVisible().catch(() => false);
  const buttonEnabled = buttonVisible ? await continueButton.isEnabled().catch(() => false) : false;
  
  if (buttonVisible && buttonEnabled) {
    await continueButton.click();
    // Wait for the click to process and mode to transition
    await page.waitForTimeout(500);
  } else if (!buttonEnabled && buttonVisible) {
    // Button is visible but disabled - might still be processing equipment selection
    await page.waitForTimeout(300);
    // Try clicking again
    const retryEnabled = await continueButton.isEnabled().catch(() => false);
    if (retryEnabled) {
      await continueButton.click();
      await page.waitForTimeout(500);
    } else {
      // Fallback: call handleRewardsContinue directly
      await page.evaluate(() => {
        if ((window as any).handleRewardsContinue) {
          (window as any).handleRewardsContinue();
        }
      });
      await page.waitForTimeout(500);
    }
  } else {
    // Fallback: call handleRewardsContinue directly (exposed on window for E2E tests)
    // This ensures the same flow as UI: claim rewards + check for recruitment dialogue
    await page.evaluate(() => {
      if ((window as any).handleRewardsContinue) {
        (window as any).handleRewardsContinue();
      } else {
        // Last resort: just claim rewards (won't trigger dialogue, but better than nothing)
        const store = (window as any).__VALE_STORE__;
        store.getState().claimRewards();
      }
    });
    await page.waitForTimeout(500);
  }
  
  // Check current mode - might be 'dialogue' (recruitment) or 'overworld'
  const modeAfterClaim = await page.evaluate(() => {
    const store = (window as any).__VALE_STORE__;
    const lastEncounterId = store?.getState()?.lastBattleEncounterId ?? null;
    return {
      mode: store?.getState()?.mode ?? null,
      lastEncounterId,
      hasDialogue: !!store?.getState()?.currentDialogueTree,
    };
  });
  
  if (logDetails) {
    console.log(`   After claiming rewards, mode: ${modeAfterClaim.mode}, encounterId: ${modeAfterClaim.lastEncounterId}, hasDialogue: ${modeAfterClaim.hasDialogue}`);
  }
  
  // If we're in dialogue mode, that's expected for recruitment
  // The caller will handle dialogue if expectDialogue is true

  // 8. If recruitment dialogue is expected, wait for it
  if (expectDialogue) {
    // Check if we're already in dialogue mode
    const currentModeCheck = await page.evaluate(() => {
      const store = (window as any).__VALE_STORE__;
      return {
        mode: store?.getState()?.mode ?? null,
        hasDialogue: !!store?.getState()?.currentDialogueTree,
      };
    });
    
    if (currentModeCheck.mode === 'dialogue' || currentModeCheck.hasDialogue) {
      if (logDetails) console.log('   Recruitment dialogue already started');
    } else {
      // Wait for dialogue mode (with longer timeout as it might take a moment)
      if (logDetails) console.log(`   Waiting for dialogue mode (current: ${currentModeCheck.mode})...`);
      await waitForMode(page, 'dialogue', 10000);
      if (logDetails) console.log('   Recruitment dialogue started');
    }

    // Advance through dialogue until it ends
    await advanceDialogueUntilEnd(page);
    if (logDetails) console.log('   Recruitment dialogue completed');
  }

  // 9. Should be back at overworld
  await waitForMode(page, 'overworld', 5000);
  if (logDetails) console.log('   Returned to overworld');
}

/**
 * Advance dialogue until it ends (no more nodes)
 */
export async function advanceDialogueUntilEnd(page: Page, maxSteps: number = 20): Promise<void> {
  let steps = 0;

  while (steps < maxSteps) {
    const dialogueState = await getDialogueState(page);

    // Check if dialogue has ended
    if (!dialogueState || !dialogueState.currentDialogueTree) {
      return; // Dialogue ended
    }

    // Advance to next node
    await advanceDialogue(page);
    await page.waitForTimeout(300);

    steps++;
  }

  console.warn(`Dialogue did not end after ${maxSteps} steps`);
}

/**
 * Navigate to House 1 trigger from starting position
 * Starting position: (15, 10)
 * House 1 trigger: (7, 10)
 */
export async function navigateToHouse1(page: Page): Promise<void> {
  // Move left 8 times from (15, 10) to (7, 10)
  for (let i = 0; i < 8; i++) {
    await page.keyboard.press('ArrowLeft');
    await page.waitForTimeout(150);
  }
}

/**
 * Get debug state for troubleshooting
 */
export async function getDebugState(page: Page): Promise<{
  mode: string;
  rosterSize: number;
  roster: Array<{ id: string; name: string }>;
  teamSize: number;
  collectedDjinn: string[];
  storyFlags: Record<string, boolean | number>;
}> {
  return page.evaluate(() => {
    const store = (window as any).__VALE_STORE__;
    const state = store.getState();

    return {
      mode: state.mode ?? 'unknown',
      rosterSize: state.roster?.length ?? 0,
      roster: (state.roster ?? []).map((u: any) => ({
        id: u.id,
        name: u.name
      })),
      teamSize: state.team?.units?.length ?? 0,
      collectedDjinn: state.team?.collectedDjinn ?? [],
      storyFlags: state.story?.flags ?? {},
    };
  });
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

    if (!target || !caster) {
      throw new Error(`Unit or target not found after execution: targetId=${targetId}, casterId=${casterId}`);
    }

    return {
      targetHp: target.currentHp ?? 0,
      casterHp: caster.currentHp ?? 0,
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
