import { test, expect } from '@playwright/test';
import { getGameState, waitForMode, completeBattle, claimRewardsAndReturnToOverworld } from './helpers';

/**
 * Progressive House Unlock System E2E Tests
 *
 * Tests the progressive unlock mechanic where defeating House N unlocks House N+1.
 *
 * System Requirements:
 * - House 01 always unlocked at start
 * - House N unlocked only if House N-1 defeated
 * - Defeated encounters don't re-trigger
 * - Unlock state persists across save/load
 *
 * Test Coverage:
 * - Initial unlock state (H01 unlocked)
 * - Progressive unlock flow (H01 → H02 → H03)
 * - Locked house prevention (can't trigger H02 before H01)
 * - Defeated house de-duplication (H01 doesn't re-trigger)
 * - Save/load roundtrip (unlock state persists)
 */

test.describe('Progressive House Unlock System', () => {
  test('house-01 is unlocked at game start', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Navigate to house-01 trigger (x:7, y:10)
    const startState = await getGameState(page);
    expect(startState?.playerPosition.x).toBe(15); // Spawn at (15, 10)
    expect(startState?.playerPosition.y).toBe(10);

    console.log('→ Navigating to house-01 (x:7)...');
    for (let i = 0; i < 8; i++) {
      await page.keyboard.press('ArrowLeft');
      await page.waitForTimeout(150);
    }

    // Verify battle triggered
    await waitForMode(page, 'team-select', 5000);
    const state = await getGameState(page);
    expect(state?.mode).toBe('team-select');
    expect(state?.pendingBattleEncounterId).toBe('house-01');

    console.log('✅ House-01 triggered successfully (unlocked at start)');
  });

  test('house-02 is locked until house-01 defeated', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    console.log('→ Attempting to trigger house-02 before defeating house-01...');

    // Navigate to house-02 trigger (x:10, y:10)
    for (let i = 0; i < 5; i++) {
      await page.keyboard.press('ArrowLeft');
      await page.waitForTimeout(150);
    }

    // Verify NO battle trigger (house-02 locked)
    await page.waitForTimeout(500);
    const stateAfterH02 = await getGameState(page);
    expect(stateAfterH02?.mode).toBe('overworld'); // Still in overworld
    expect(stateAfterH02?.pendingBattleEncounterId).toBeNull();

    console.log('✅ House-02 correctly locked (no trigger)');

    // Now defeat house-01
    console.log('→ Defeating house-01...');
    for (let i = 0; i < 3; i++) {
      await page.keyboard.press('ArrowLeft');
      await page.waitForTimeout(150);
    }

    await waitForMode(page, 'team-select', 5000);
    const confirmButton = page.getByRole('button', { name: /confirm|start|begin/i });
    await confirmButton.waitFor({ state: 'visible', timeout: 5000 });
    await confirmButton.click();

    await waitForMode(page, 'battle', 10000);
    await completeBattle(page, { logDetails: true });
    await claimRewardsAndReturnToOverworld(page);

    console.log('→ House-01 defeated, now trying house-02 again...');

    // Navigate back to house-02
    for (let i = 0; i < 3; i++) {
      await page.keyboard.press('ArrowRight');
      await page.waitForTimeout(150);
    }

    // Verify house-02 now triggers
    await waitForMode(page, 'team-select', 5000);
    const finalState = await getGameState(page);
    expect(finalState?.mode).toBe('team-select');
    expect(finalState?.pendingBattleEncounterId).toBe('house-02');

    console.log('✅ House-02 unlocked after defeating house-01');
  });

  test('defeated houses do not re-trigger', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    console.log('→ Defeating house-01...');

    // Navigate to house-01
    for (let i = 0; i < 8; i++) {
      await page.keyboard.press('ArrowLeft');
      await page.waitForTimeout(150);
    }

    await waitForMode(page, 'team-select', 5000);
    const confirmButton = page.getByRole('button', { name: /confirm|start|begin/i });
    await confirmButton.click();

    await waitForMode(page, 'battle', 10000);
    await completeBattle(page, { logDetails: true });
    await claimRewardsAndReturnToOverworld(page);

    console.log('→ Returning to house-01 position...');

    // Move away and back to house-01 position
    await page.keyboard.press('ArrowRight');
    await page.waitForTimeout(200);
    await page.keyboard.press('ArrowLeft');
    await page.waitForTimeout(500);

    // Verify NO battle trigger (house-01 already defeated)
    const state = await getGameState(page);
    expect(state?.mode).toBe('overworld');
    expect(state?.pendingBattleEncounterId).toBeNull();

    console.log('✅ Defeated house-01 does not re-trigger');
  });

  test('sequential unlock: H01 → H02 → H03', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    console.log('→ Testing sequential unlock chain...');

    // Defeat H01
    console.log('→ Defeating H01...');
    for (let i = 0; i < 8; i++) {
      await page.keyboard.press('ArrowLeft');
      await page.waitForTimeout(100);
    }
    await waitForMode(page, 'team-select', 5000);
    await page.getByRole('button', { name: /confirm|start|begin/i }).click();
    await waitForMode(page, 'battle', 10000);
    await completeBattle(page);
    await claimRewardsAndReturnToOverworld(page);
    console.log('   ✓ H01 defeated');

    // Verify H02 unlocked, H03 still locked
    console.log('→ Verifying H02 unlocked, H03 locked...');

    // First verify H02 is unlocked by navigating to it (x:10, 3 steps right from x:7)
    for (let i = 0; i < 3; i++) {
      await page.keyboard.press('ArrowRight');
      await page.waitForTimeout(100);
    }
    await waitForMode(page, 'team-select', 5000);
    let state = await getGameState(page);
    expect(state?.pendingBattleEncounterId).toBe('house-02');
    console.log('   ✓ H02 correctly unlocked');
    
    // Cancel H02 battle and navigate back
    await page.keyboard.press('Escape');
    await page.waitForTimeout(200);
    await waitForMode(page, 'overworld', 5000);
    
    // Now check H03 (x:13) - should be locked (3 more steps right from x:10)
    for (let i = 0; i < 3; i++) {
      await page.keyboard.press('ArrowRight');
      await page.waitForTimeout(100);
    }
    await page.waitForTimeout(300);
    state = await getGameState(page);
    expect(state?.mode).toBe('overworld'); // H03 locked
    console.log('   ✓ H03 correctly locked');

    // Navigate back to H02 (x:10) - we're already at H03 position, so go back 3 steps
    for (let i = 0; i < 3; i++) {
      await page.keyboard.press('ArrowLeft');
      await page.waitForTimeout(100);
    }

    // H02 should trigger
    await waitForMode(page, 'team-select', 5000);
    state = await getGameState(page);
    expect(state?.pendingBattleEncounterId).toBe('house-02');
    console.log('   ✓ H02 confirmed unlocked (already verified above)');

    // Defeat H02
    console.log('→ Defeating H02...');
    await page.getByRole('button', { name: /confirm|start|begin/i }).click();
    await waitForMode(page, 'battle', 10000);
    await completeBattle(page);
    await claimRewardsAndReturnToOverworld(page);
    console.log('   ✓ H02 defeated');

    // Verify H03 now unlocked
    console.log('→ Verifying H03 now unlocked...');
    for (let i = 0; i < 3; i++) {
      await page.keyboard.press('ArrowRight');
      await page.waitForTimeout(100);
    }

    await waitForMode(page, 'team-select', 5000);
    state = await getGameState(page);
    expect(state?.pendingBattleEncounterId).toBe('house-03');
    console.log('   ✓ H03 correctly unlocked after H02 defeated');

    console.log('✅ Sequential unlock verified: H01 → H02 → H03');
  });

  test('all 7 Act 1 houses unlock in sequence', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    console.log('→ Testing full Act 1 unlock chain (H01-H07)...');

    const houses = [
      { id: 'house-01', position: 7 },
      { id: 'house-02', position: 10 },
      { id: 'house-03', position: 13 },
      { id: 'house-04', position: 16 },
      { id: 'house-05', position: 19 },
      { id: 'house-06', position: 22 },
      { id: 'house-07', position: 24 },
    ];

    let currentX = 15; // Start position

    for (const house of houses) {
      console.log(`→ Unlocking and defeating ${house.id}...`);

      // Navigate to house position
      const delta = house.position - currentX;
      const direction = delta > 0 ? 'ArrowRight' : 'ArrowLeft';
      for (let i = 0; i < Math.abs(delta); i++) {
        await page.keyboard.press(direction);
        await page.waitForTimeout(100);
      }
      currentX = house.position;

      // Trigger battle
      await waitForMode(page, 'team-select', 5000);
      const state = await getGameState(page);
      expect(state?.pendingBattleEncounterId).toBe(house.id);

      // Defeat battle
      await page.getByRole('button', { name: /confirm|start|begin/i }).click();
      await waitForMode(page, 'battle', 10000);
      await completeBattle(page);
      await claimRewardsAndReturnToOverworld(page);

      console.log(`   ✓ ${house.id} defeated`);
    }

    console.log('✅ All 7 Act 1 houses unlocked and defeated sequentially');
  });

  test('save/load preserves unlock state', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    console.log('→ Defeating H01 and H02...');

    // Defeat H01
    for (let i = 0; i < 8; i++) {
      await page.keyboard.press('ArrowLeft');
      await page.waitForTimeout(100);
    }
    await waitForMode(page, 'team-select', 5000);
    await page.getByRole('button', { name: /confirm|start|begin/i }).click();
    await waitForMode(page, 'battle', 10000);
    await completeBattle(page);
    await claimRewardsAndReturnToOverworld(page);

    // Defeat H02
    for (let i = 0; i < 3; i++) {
      await page.keyboard.press('ArrowRight');
      await page.waitForTimeout(100);
    }
    await waitForMode(page, 'team-select', 5000);
    await page.getByRole('button', { name: /confirm|start|begin/i }).click();
    await waitForMode(page, 'battle', 10000);
    await completeBattle(page);
    await claimRewardsAndReturnToOverworld(page);
    
    // Wait a bit to ensure story flags are set before saving
    await page.waitForTimeout(500);

    console.log('→ Saving game...');

    // Save game
    await page.evaluate(() => {
      const store = (window as any).__VALE_STORE__;
      store.getState().saveGame();
    });
    
    // Verify story flags were saved
    const savedFlags = await page.evaluate(() => {
      const store = (window as any).__VALE_STORE__;
      return store.getState().story.flags;
    });
    console.log(`   Saved story flags: ${Object.keys(savedFlags).filter(k => savedFlags[k]).join(', ')}`);

    console.log('→ Reloading page...');

    // Reload page
    await page.reload();
    await page.waitForLoadState('networkidle');
    
    // Wait for store to be initialized
    await page.waitForFunction(() => {
      const store = (window as any).__VALE_STORE__;
      return store && store.getState && typeof store.getState === 'function';
    }, { timeout: 10000 });

    console.log('→ Loading save...');

    // Load game
    await page.evaluate(() => {
      const store = (window as any).__VALE_STORE__;
      store.getState().loadGame();
    });

    await page.waitForTimeout(1000);
    await waitForMode(page, 'overworld', 5000);
    
    // Verify story flags were loaded
    const loadedFlags = await page.evaluate(() => {
      const store = (window as any).__VALE_STORE__;
      return store.getState().story.flags;
    });
    console.log(`   Loaded story flags: ${Object.keys(loadedFlags).filter(k => loadedFlags[k]).join(', ')}`);

    console.log('→ Verifying unlock state after load...');

    // Verify H01 defeated (no trigger)
    for (let i = 0; i < 8; i++) {
      await page.keyboard.press('ArrowLeft');
      await page.waitForTimeout(100);
    }
    await page.waitForTimeout(300);
    let state = await getGameState(page);
    expect(state?.mode).toBe('overworld'); // H01 defeated, no trigger
    console.log('   ✓ H01 still defeated');

    // Verify H02 defeated (no trigger)
    for (let i = 0; i < 3; i++) {
      await page.keyboard.press('ArrowRight');
      await page.waitForTimeout(100);
    }
    await page.waitForTimeout(300);
    state = await getGameState(page);
    expect(state?.mode).toBe('overworld'); // H02 defeated, no trigger
    console.log('   ✓ H02 still defeated');

    // Verify H03 unlocked (should trigger)
    for (let i = 0; i < 3; i++) {
      await page.keyboard.press('ArrowRight');
      await page.waitForTimeout(100);
    }
    await waitForMode(page, 'team-select', 5000);
    state = await getGameState(page);
    expect(state?.pendingBattleEncounterId).toBe('house-03');
    console.log('   ✓ H03 unlocked');

    // Verify H04 locked (no trigger)
    // Cancel H03 battle first
    await page.keyboard.press('Escape');
    await page.waitForTimeout(200);

    for (let i = 0; i < 3; i++) {
      await page.keyboard.press('ArrowRight');
      await page.waitForTimeout(100);
    }
    await page.waitForTimeout(300);
    state = await getGameState(page);
    expect(state?.mode).toBe('overworld'); // H04 locked
    console.log('   ✓ H04 still locked');

    console.log('✅ Save/load correctly preserves unlock state');
  });
});
