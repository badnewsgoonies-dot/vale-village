import { test, expect } from '@playwright/test';
import {
  getGameState,
  waitForMode,
  navigateToPosition,
  triggerNPCDialogue,
  getDialogueState,
  advanceDialogue,
  selectDialogueChoice,
  endDialogue,
} from './helpers';
import { ELDER_DIALOGUE } from '../../src/data/definitions/dialogues';

/**
 * NPC Dialogue E2E Tests
 * 
 * Tests dialogue system:
 * - NPC trigger detection
 * - Dialogue screen opens
 * - Dialogue text displays
 * - Advance dialogue
 * - Dialogue choices work
 * - Story flags set from dialogue
 * - Exit dialogue returns to overworld
 */

test.describe('NPC Dialogue', () => {
  test('triggers dialogue when walking to NPC', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Initial state
    let state = await getGameState(page);
    expect(state?.mode).toBe('overworld');
    expect(state?.currentMapId).toBe('vale-village');

    // Navigate to elder NPC at (15, 5)
    // From spawn (15, 10), move up 5 steps
    console.log('→ Navigating to elder NPC (15, 5)...');
    for (let i = 0; i < 5; i++) {
      await page.keyboard.press('ArrowUp');
      await page.waitForTimeout(150);
    }

    // Wait for dialogue mode
    await waitForMode(page, 'dialogue', 5000);

    // Verify mode changed
    state = await getGameState(page);
    expect(state?.mode).toBe('dialogue');

    console.log('✅ Dialogue triggered successfully');
  });

  test('dialogue screen opens and displays text', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Navigate to elder NPC
    await triggerNPCDialogue(page, 'vale-village', 15, 5);
    await waitForMode(page, 'dialogue', 5000);

    // Get dialogue state
    const dialogueState = await getDialogueState(page);
    expect(dialogueState).not.toBeNull();
    expect(dialogueState?.currentDialogueTree).toBe('elder-vale');
    expect(dialogueState?.currentNodeId).toBe('greeting');
    expect(dialogueState?.speaker).toBe('Elder Vale');
    expect(dialogueState?.text).toContain('Welcome');

    console.log(`→ Dialogue text: "${dialogueState?.text}"`);
    console.log('✅ Dialogue screen displays correctly');
  });

  test('advances dialogue to next node', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Trigger dialogue
    await triggerNPCDialogue(page, 'vale-village', 15, 5);
    await waitForMode(page, 'dialogue', 5000);

    // Get initial node
    let dialogueState = await getDialogueState(page);
    expect(dialogueState?.currentNodeId).toBe('greeting');

    // Advance dialogue
    await advanceDialogue(page);

    // Verify advanced to next node
    dialogueState = await getDialogueState(page);
    expect(dialogueState?.currentNodeId).toBe('ask-quest');
    expect(dialogueState?.text).toContain('forest');

    console.log('✅ Dialogue advanced to next node');
  });

  test('dialogue choices work', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Trigger dialogue
    await triggerNPCDialogue(page, 'vale-village', 15, 5);
    await waitForMode(page, 'dialogue', 5000);

    // Advance to choice node
    await advanceDialogue(page);
    await page.waitForTimeout(300);

    // Verify we're at choice node
    let dialogueState = await getDialogueState(page);
    expect(dialogueState?.currentNodeId).toBe('ask-quest');

    // Select "accept" choice
    await selectDialogueChoice(page, 'accept');
    await page.waitForTimeout(300);

    // Verify advanced to quest-accepted node
    dialogueState = await getDialogueState(page);
    expect(dialogueState?.currentNodeId).toBe('quest-accepted');
    expect(dialogueState?.text).toContain('Thank you');

    console.log('✅ Dialogue choice selected correctly');
  });

  test('story flag set from dialogue choice', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Verify flag not set initially
    let storyFlag = await page.evaluate(() => {
      const store = (window as any).__VALE_STORE__;
      return store.getState().story.flags['questAccepted'] ?? false;
    });
    expect(storyFlag).toBe(false);

    // Trigger dialogue and select accept choice
    await triggerNPCDialogue(page, 'vale-village', 15, 5);
    await waitForMode(page, 'dialogue', 5000);
    await advanceDialogue(page);
    await page.waitForTimeout(300);
    await selectDialogueChoice(page, 'accept');
    await page.waitForTimeout(300);

    // Verify flag set
    storyFlag = await page.evaluate(() => {
      const store = (window as any).__VALE_STORE__;
      return store.getState().story.flags['questAccepted'] ?? false;
    });
    expect(storyFlag).toBe(true);

    console.log('✅ Story flag set from dialogue choice');
  });

  test('exit dialogue returns to overworld', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Trigger dialogue
    await triggerNPCDialogue(page, 'vale-village', 15, 5);
    await waitForMode(page, 'dialogue', 5000);

    // Verify in dialogue mode
    let state = await getGameState(page);
    expect(state?.mode).toBe('dialogue');

    // End dialogue
    await endDialogue(page);

    // Verify returned to overworld
    state = await getGameState(page);
    expect(state?.mode).toBe('overworld');

    // Verify dialogue state cleared
    const dialogueState = await getDialogueState(page);
    expect(dialogueState?.currentDialogueTree).toBeNull();

    console.log('✅ Dialogue closed, returned to overworld');
  });

  test('player position preserved after dialogue', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Get position before dialogue
    const beforePos = await page.evaluate(() => {
      const store = (window as any).__VALE_STORE__;
      return store.getState().playerPosition;
    });

    // Trigger dialogue
    await triggerNPCDialogue(page, 'vale-village', 15, 5);
    await waitForMode(page, 'dialogue', 5000);

    // End dialogue
    await endDialogue(page);

    // Verify position preserved
    const afterPos = await page.evaluate(() => {
      const store = (window as any).__VALE_STORE__;
      return store.getState().playerPosition;
    });

    expect(afterPos).toEqual(beforePos);

    console.log('✅ Player position preserved after dialogue');
  });
});

