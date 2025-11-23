/**
 * PRIORITY 1: House 1 Natural Flow E2E Test
 *
 * This test proves the base recruitment system works end-to-end:
 * 1. Start game with Isaac only
 * 2. Navigate to House 1 trigger naturally (no Dev Mode)
 * 3. Fight battle and win
 * 4. Verify recruitment dialogue appears
 * 5. Verify War Mage is added to roster
 * 6. Verify Forge Djinn is granted
 *
 * If this test passes, it proves:
 * - Map triggers work
 * - Battle system works
 * - Narrative-driven recruitment works
 * - Djinn granting works
 *
 * This is the MOST IMPORTANT test in the suite.
 */

import { test, expect } from '@playwright/test';
import {
  getRoster,
  waitForMode,
  navigateToHouse1,
  completeBattleFlow,
  getDebugState,
  getGameState,
  completeFlintIntro,
} from './helpers';

test.describe('House 1: Natural Recruitment Flow (NO Dev Mode)', () => {
  test('Fight House 1, recruit War Mage, verify roster and Djinn', async ({ page }) => {
    console.log('\n🎮 STARTING: House 1 Natural Flow Test');

    // ===== STEP 1: Start game - verify initial state =====
    await page.goto('/');
    await waitForMode(page, 'overworld', 5000);
    console.log('✓ Game started');

    const initialRoster = await getRoster(page);
    console.log(`Initial roster: ${initialRoster.length} units`);
    initialRoster.forEach(u => console.log(`  - ${u.name} (${u.id})`));

    expect(initialRoster).toHaveLength(1);
    expect(initialRoster[0]?.id).toBe('adept');
    expect(initialRoster[0]?.name).toBe('Adept');
    console.log('✅ Initial state verified: Isaac (Adept) only');

    await completeFlintIntro(page);

    // ===== STEP 2: Navigate to House 1 trigger =====
    console.log('\n🚶 Navigating to House 1...');
    const startPosition = await page.evaluate(() => {
      const store = (window as any).__VALE_STORE__;
      return store.getState().playerPosition;
    });
    console.log(`Starting position: (${startPosition.x}, ${startPosition.y})`);

    await navigateToHouse1(page);

    const finalPosition = await page.evaluate(() => {
      const store = (window as any).__VALE_STORE__;
      return store.getState().playerPosition;
    });
    console.log(`Final position: (${finalPosition.x}, ${finalPosition.y})`);

    const stateAfterDoor = await page.evaluate(() => {
      const store = (window as any).__VALE_STORE__;
      const state = store.getState();
      return {
        mode: state.mode,
        pendingBattleEncounterId: state.pendingBattleEncounterId,
        dialogueTree: state.currentDialogueTree?.id ?? null,
        dialogueNode: state.currentDialogueState?.currentNodeId ?? null,
      };
    });
    console.log('State after stepping onto door:', stateAfterDoor);

    // ===== STEP 3: Battle should trigger automatically =====
    console.log('\n⚔️  Waiting for battle to trigger...');

    // Wait for team-select or battle mode (trigger should activate)
    try {
      await waitForMode(page, 'team-select', 5000);
      console.log('✓ Team select triggered');
    } catch (e) {
      // If team-select doesn't trigger, check if we're already in battle
      const currentMode = await page.evaluate(() => {
        const store = (window as any).__VALE_STORE__;
        return store.getState().mode;
      });
      console.log(`Current mode: ${currentMode}`);

      if (currentMode !== 'team-select' && currentMode !== 'battle') {
        throw new Error(`Battle did not trigger. Current mode: ${currentMode}`);
      }
    }

    // ===== STEP 4: Complete battle flow (includes recruitment dialogue) =====
    console.log('\n⚔️  Completing battle...');

    await completeBattleFlow(page, {
      expectDialogue: true, // House 1 has recruitment dialogue
      logDetails: true,
    });

    console.log('✅ Battle and recruitment dialogue completed');

    // ===== STEP 5: Verify War Mage recruited =====
    console.log('\n📋 Verifying recruitment...');

    const finalRoster = await getRoster(page);
    console.log(`Final roster: ${finalRoster.length} units`);
    finalRoster.forEach(u => console.log(`  - ${u.name} (${u.id}, Level ${u.level})`));

    expect(finalRoster).toHaveLength(2); // Isaac + War Mage
    expect(finalRoster.some(u => u.id === 'war-mage')).toBe(true);
    expect(finalRoster.some(u => u.name === 'War Mage')).toBe(true);

    console.log('✅ PROOF: War Mage recruited after House 1 battle!');

    // ===== STEP 6: Verify Forge Djinn granted =====
    const debugState = await getDebugState(page);
    console.log(`\nCollected Djinn: ${debugState.collectedDjinn.join(', ')}`);

    expect(debugState.collectedDjinn).toContain('flint'); // Granted by the Flint intro tutorial
    expect(debugState.collectedDjinn).toContain('forge'); // House 1 reward

    console.log('✅ PROOF: Forge Djinn granted after House 1!');

    // ===== STEP 7: Verify story flags set =====
    expect(debugState.storyFlags['house-01']).toBe(true);
    console.log('✅ Story flag set: house-01 = true');

    console.log('\n🎉 SUCCESS: House 1 natural flow WORKS!');
  });

  test('House 1: Verify recruited War Mage has correct stats', async ({ page }) => {
    console.log('\n🎮 STARTING: War Mage Stats Validation');

    await page.goto('/');
    await waitForMode(page, 'overworld', 5000);

    // Navigate and complete House 1
    await navigateToHouse1(page);
    await completeBattleFlow(page, { expectDialogue: true });

    // Get War Mage from roster
    const roster = await getRoster(page);
    const warMage = roster.find(u => u.id === 'war-mage');

    expect(warMage).toBeDefined();
    expect(warMage?.level).toBeGreaterThanOrEqual(1);
    expect(warMage?.xp).toBeGreaterThanOrEqual(0);

    console.log(`War Mage stats: Level ${warMage?.level}, XP ${warMage?.xp}`);
    console.log('✅ War Mage has valid stats');
  });
});
