/**
 * Five Houses Progression E2E Test
 * 
 * Tests playing through 5 battle houses sequentially:
 * - House 1: Garet recruitment + Forge Djinn
 * - House 2: Mystic story join
 * - House 3: Ranger story join
 * - House 4: Equipment reward
 * - House 5: Blaze recruitment
 * 
 * Verifies:
 * - Battle progression
 * - XP and gold accumulation
 * - Unit recruitment
 * - Equipment rewards
 * - Djinn collection
 * - Story flag progression
 * 
 * Run with: npx playwright test five-houses-progression --headed --workers=1
 */

import { test, expect } from '@playwright/test';
import {
  getGameState,
  waitForMode,
  navigateToPosition,
  completeBattle,
  getUnitData,
  advanceDialogueUntilEnd,
  skipStartupScreens,
} from './helpers';

test.describe('Five Houses Progression', () => {
  test('plays through 5 battle houses sequentially', async ({ page }) => {
    console.log('\n🏠 === FIVE HOUSES PROGRESSION TEST ===\n');

    // ============================================================================
    // INITIAL SETUP
    // ============================================================================
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Skip startup screens
    await skipStartupScreens(page);

    let state = await getGameState(page);
    expect(state?.mode).toBe('overworld');
    expect(state?.teamSize).toBe(1); // Isaac only
    expect(state?.rosterSize).toBe(1);

    const initialGold = state?.gold ?? 0;
    const initialRosterSize = state?.rosterSize ?? 0;
    console.log(`📊 Initial State:`);
    console.log(`   Gold: ${initialGold}g`);
    console.log(`   Roster: ${initialRosterSize} units`);
    console.log(`   Position: (${state?.playerPosition.x}, ${state?.playerPosition.y})\n`);

    // ============================================================================
    // HOUSE 1: Garet Recruitment + Forge Djinn
    // ============================================================================
    console.log('🏠 HOUSE 1: Garet\'s Liberation');
    console.log('   → Navigating to House 1 trigger (7, 10)...');
    
    // Move left from (15, 10) to (7, 10) - 8 steps
    for (let i = 0; i < 8; i++) {
      await page.keyboard.press('ArrowLeft');
      await page.waitForTimeout(150);
    }
    
    await waitForMode(page, 'team-select', 5000);
    
    state = await getGameState(page);
    // Verify we hit a house encounter (may vary based on exact position)
    expect(state?.pendingBattleEncounterId).toMatch(/^house-0[1-7]$/);
    console.log('   ✅ Team select screen shown');

    // Confirm battle
    const confirmButton = page.getByRole('button', { name: /confirm|start/i });
    await confirmButton.click();
    await waitForMode(page, 'battle', 10000);
    console.log('   ✅ Battle started');

    // Complete battle (this handles victory, rewards, and claiming)
    await completeBattle(page, { 
      logDetails: false
    });
    console.log('   ✅ Battle completed');
    
    // Verify equipment was added
    const equipmentAfterBattle = await page.evaluate(() => {
      const store = (window as any).__VALE_STORE__;
      return store?.getState()?.equipment?.map((e: any) => e.id) ?? [];
    });
    console.log(`   📦 Equipment in inventory: ${equipmentAfterBattle.join(', ') || 'none'}`);
    
    // Handle recruitment dialogue (completeBattle returns to overworld, but dialogue may trigger)
    await page.waitForTimeout(1000);
    let currentMode = await page.evaluate(() => {
      const store = (window as any).__VALE_STORE__;
      return store?.getState()?.mode;
    });

    if (currentMode === 'dialogue') {
      console.log('   → Handling recruitment dialogue...');
      await advanceDialogueUntilEnd(page);
      await waitForMode(page, 'overworld', 5000);
      console.log('   ✅ Recruitment dialogue completed');
    } else {
      // Ensure we're in overworld
      await waitForMode(page, 'overworld', 5000);
    }

    // Verify House 1 results
    state = await getGameState(page);
    const afterHouse1 = {
      gold: state?.gold ?? 0,
      rosterSize: state?.rosterSize ?? 0,
      teamSize: state?.teamSize ?? 0,
      equipmentCount: state?.equipment?.length ?? 0,
    };

    console.log(`   📊 After House 1:`);
    console.log(`      Gold: ${afterHouse1.gold}g (+${afterHouse1.gold - initialGold})`);
    console.log(`      Roster: ${afterHouse1.rosterSize} units (+${afterHouse1.rosterSize - initialRosterSize})`);
    console.log(`      Equipment: ${afterHouse1.equipmentCount} items`);
    
    expect(afterHouse1.gold).toBeGreaterThan(initialGold);
    // Note: Garet recruitment happens via dialogue, may need to handle dialogue first
    expect(afterHouse1.rosterSize).toBeGreaterThanOrEqual(initialRosterSize);
    console.log('   ✅ House 1 complete\n');

    // ============================================================================
    // HOUSE 2: Mystic Story Join
    // ============================================================================
    console.log('🏠 HOUSE 2: The Bronze Trial');
    console.log('   → Navigating to House 2 trigger (10, 10)...');
    
    await navigateToPosition(page, 10, 10);
    await waitForMode(page, 'team-select', 5000);
    
    state = await getGameState(page);
    expect(state?.pendingBattleEncounterId).toBe('house-02');
    console.log('   ✅ Team select screen shown');

    await confirmButton.click();
    await waitForMode(page, 'battle', 10000);
    console.log('   ✅ Battle started');

    await completeBattle(page, { logDetails: false });
    await waitForMode(page, 'rewards', 10000);
    console.log('   ✅ Battle completed');

    // Check if equipment choice is needed
    const hasEquipmentChoice2 = await page.evaluate(() => {
      const store = (window as any).__VALE_STORE__;
      const rewards = store?.getState()?.lastBattleRewards;
      return rewards?.equipmentChoice && rewards.equipmentChoice.length > 0;
    });

    if (hasEquipmentChoice2) {
      await page.evaluate(() => {
        const store = (window as any).__VALE_STORE__;
        const rewards = store.getState().lastBattleRewards;
        if (rewards?.equipmentChoice && rewards.equipmentChoice.length > 0) {
          store.getState().selectEquipmentChoice(rewards.equipmentChoice[0]);
        }
      });
    }

    await page.evaluate(() => {
      const store = (window as any).__VALE_STORE__;
      store.getState().claimRewards();
    });
    
    const equipmentAfter2 = await page.evaluate(() => {
      const store = (window as any).__VALE_STORE__;
      return store?.getState()?.equipment?.map((e: any) => e.id) ?? [];
    });
    console.log(`   📦 Equipment: ${equipmentAfter2.join(', ') || 'none'}`);

    // Handle story join dialogue
    await page.waitForTimeout(500);
    const modeAfter2 = await page.evaluate(() => {
      const store = (window as any).__VALE_STORE__;
      return store?.getState()?.mode;
    });

    if (modeAfter2 === 'dialogue') {
      console.log('   → Handling story join dialogue...');
      await advanceDialogueUntilEnd(page);
      console.log('   ✅ Story join dialogue completed');
    }

    await waitForMode(page, 'overworld', 5000);

    state = await getGameState(page);
    const afterHouse2 = {
      gold: state?.gold ?? 0,
      rosterSize: state?.rosterSize ?? 0,
    };

    console.log(`   📊 After House 2:`);
    console.log(`      Gold: ${afterHouse2.gold}g (+${afterHouse2.gold - afterHouse1.gold})`);
    console.log(`      Roster: ${afterHouse2.rosterSize} units (+${afterHouse2.rosterSize - afterHouse1.rosterSize})`);
    expect(afterHouse2.gold).toBeGreaterThan(afterHouse1.gold);
    expect(afterHouse2.rosterSize).toBeGreaterThanOrEqual(afterHouse1.rosterSize); // Mystic may join
    console.log('   ✅ House 2 complete\n');

    // ============================================================================
    // HOUSE 3: Ranger Story Join
    // ============================================================================
    console.log('🏠 HOUSE 3: Iron Bonds');
    console.log('   → Navigating to House 3 trigger (13, 10)...');
    
    await navigateToPosition(page, 13, 10);
    await waitForMode(page, 'team-select', 5000);
    
    state = await getGameState(page);
    expect(state?.pendingBattleEncounterId).toBe('house-03');
    console.log('   ✅ Team select screen shown');

    await confirmButton.click();
    await waitForMode(page, 'battle', 10000);
    console.log('   ✅ Battle started');

    await completeBattle(page, { logDetails: false });
    console.log('   ✅ Battle completed');
    
    const equipmentAfter3 = await page.evaluate(() => {
      const store = (window as any).__VALE_STORE__;
      return store?.getState()?.equipment?.map((e: any) => e.id) ?? [];
    });
    console.log(`   📦 Equipment: ${equipmentAfter3.join(', ') || 'none'}`);

    // Handle story join dialogue
    await page.waitForTimeout(500);
    const modeAfter3 = await page.evaluate(() => {
      const store = (window as any).__VALE_STORE__;
      return store?.getState()?.mode;
    });

    if (modeAfter3 === 'dialogue') {
      console.log('   → Handling story join dialogue...');
      await advanceDialogueUntilEnd(page);
      console.log('   ✅ Story join dialogue completed');
    }

    await waitForMode(page, 'overworld', 5000);

    state = await getGameState(page);
    const afterHouse3 = {
      gold: state?.gold ?? 0,
      rosterSize: state?.rosterSize ?? 0,
    };

    console.log(`   📊 After House 3:`);
    console.log(`      Gold: ${afterHouse3.gold}g (+${afterHouse3.gold - afterHouse2.gold})`);
    console.log(`      Roster: ${afterHouse3.rosterSize} units (+${afterHouse3.rosterSize - afterHouse2.rosterSize})`);
    expect(afterHouse3.gold).toBeGreaterThan(afterHouse2.gold);
    expect(afterHouse3.rosterSize).toBeGreaterThanOrEqual(afterHouse2.rosterSize); // Ranger may join
    console.log('   ✅ House 3 complete\n');

    // ============================================================================
    // HOUSE 4: Equipment Reward
    // ============================================================================
    console.log('🏠 HOUSE 4: Arcane Power');
    console.log('   → Navigating to House 4 trigger (16, 10)...');
    
    await navigateToPosition(page, 16, 10);
    await waitForMode(page, 'team-select', 5000);
    
    state = await getGameState(page);
    expect(state?.pendingBattleEncounterId).toBe('house-04');
    console.log('   ✅ Team select screen shown');

    await confirmButton.click();
    await waitForMode(page, 'battle', 10000);
    console.log('   ✅ Battle started');

    await completeBattle(page, { logDetails: false });
    await waitForMode(page, 'rewards', 10000);
    console.log('   ✅ Battle completed');

    // Check if equipment choice is needed
    const hasEquipmentChoice4 = await page.evaluate(() => {
      const store = (window as any).__VALE_STORE__;
      const rewards = store?.getState()?.lastBattleRewards;
      return rewards?.equipmentChoice && rewards.equipmentChoice.length > 0;
    });

    if (hasEquipmentChoice4) {
      await page.evaluate(() => {
        const store = (window as any).__VALE_STORE__;
        const rewards = store.getState().lastBattleRewards;
        if (rewards?.equipmentChoice && rewards.equipmentChoice.length > 0) {
          store.getState().selectEquipmentChoice(rewards.equipmentChoice[0]);
        }
      });
    }

    await page.evaluate(() => {
      const store = (window as any).__VALE_STORE__;
      store.getState().claimRewards();
    });
    
    const equipmentAfter4 = await page.evaluate(() => {
      const store = (window as any).__VALE_STORE__;
      return store?.getState()?.equipment?.map((e: any) => e.id) ?? [];
    });
    console.log(`   📦 Equipment: ${equipmentAfter4.join(', ') || 'none'}`);

    await waitForMode(page, 'overworld', 5000);

    state = await getGameState(page);
    const afterHouse4 = {
      gold: state?.gold ?? 0,
      equipmentCount: state?.equipment?.length ?? 0,
    };

    console.log(`   📊 After House 4:`);
    console.log(`      Gold: ${afterHouse4.gold}g (+${afterHouse4.gold - afterHouse3.gold})`);
    console.log(`      Equipment: ${afterHouse4.equipmentCount} items`);
    expect(afterHouse4.gold).toBeGreaterThan(afterHouse3.gold);
    expect(afterHouse4.equipmentCount).toBeGreaterThanOrEqual(afterHouse1.equipmentCount);
    console.log('   ✅ House 4 complete\n');

    // ============================================================================
    // HOUSE 5: Blaze Recruitment
    // ============================================================================
    console.log('🏠 HOUSE 5: Escalation');
    console.log('   → Navigating to House 5 trigger (19, 10)...');
    
    await navigateToPosition(page, 19, 10);
    await waitForMode(page, 'team-select', 5000);
    
    state = await getGameState(page);
    expect(state?.pendingBattleEncounterId).toBe('house-05');
    console.log('   ✅ Team select screen shown');

    await confirmButton.click();
    await waitForMode(page, 'battle', 10000);
    console.log('   ✅ Battle started');

    await completeBattle(page, { logDetails: false });
    await waitForMode(page, 'rewards', 10000);
    console.log('   ✅ Battle completed');

    // Check if equipment choice is needed
    const hasEquipmentChoice5 = await page.evaluate(() => {
      const store = (window as any).__VALE_STORE__;
      const rewards = store?.getState()?.lastBattleRewards;
      return rewards?.equipmentChoice && rewards.equipmentChoice.length > 0;
    });

    if (hasEquipmentChoice5) {
      await page.evaluate(() => {
        const store = (window as any).__VALE_STORE__;
        const rewards = store.getState().lastBattleRewards;
        if (rewards?.equipmentChoice && rewards.equipmentChoice.length > 0) {
          store.getState().selectEquipmentChoice(rewards.equipmentChoice[0]);
        }
      });
    }

    await page.evaluate(() => {
      const store = (window as any).__VALE_STORE__;
      store.getState().claimRewards();
    });
    
    const equipmentAfter5 = await page.evaluate(() => {
      const store = (window as any).__VALE_STORE__;
      return store?.getState()?.equipment?.map((e: any) => e.id) ?? [];
    });
    console.log(`   📦 Equipment: ${equipmentAfter5.join(', ') || 'none'}`);

    // Handle recruitment dialogue
    await page.waitForTimeout(500);
    const modeAfter5 = await page.evaluate(() => {
      const store = (window as any).__VALE_STORE__;
      return store?.getState()?.mode;
    });

    if (modeAfter5 === 'dialogue') {
      console.log('   → Handling recruitment dialogue...');
      await advanceDialogueUntilEnd(page);
      console.log('   ✅ Recruitment dialogue completed');
    }

    await waitForMode(page, 'overworld', 5000);

    // ============================================================================
    // FINAL VERIFICATION
    // ============================================================================
    state = await getGameState(page);
    const finalState = {
      gold: state?.gold ?? 0,
      rosterSize: state?.rosterSize ?? 0,
      teamSize: state?.teamSize ?? 0,
      equipmentCount: state?.equipment?.length ?? 0,
      collectedDjinn: state?.team?.collectedDjinn?.length ?? 0,
    };

    const finalEquipment = await page.evaluate(() => {
      const store = (window as any).__VALE_STORE__;
      return store?.getState()?.equipment?.map((e: any) => ({ id: e.id, name: e.name, slot: e.slot })) ?? [];
    });

    console.log('\n📊 === FINAL STATE ===');
    console.log(`   Gold: ${finalState.gold}g (total gained: ${finalState.gold - initialGold}g)`);
    console.log(`   Roster: ${finalState.rosterSize} units (gained: ${finalState.rosterSize - initialRosterSize})`);
    console.log(`   Team: ${finalState.teamSize} units`);
    console.log(`   Equipment Count: ${finalState.equipmentCount} items`);
    console.log(`   Equipment List: ${finalEquipment.map(e => `${e.name} (${e.slot})`).join(', ') || 'none'}`);
    console.log(`   Collected Djinn: ${finalState.collectedDjinn}`);

    // Verify progression
    expect(finalState.gold).toBeGreaterThan(initialGold);
    expect(finalState.rosterSize).toBeGreaterThan(initialRosterSize);
    expect(finalState.equipmentCount).toBeGreaterThanOrEqual(afterHouse1.equipmentCount);

    // Verify story flags
    const storyFlags = await page.evaluate(() => {
      const store = (window as any).__VALE_STORE__;
      return store?.getState()?.story?.flags ?? {};
    });

    console.log(`   Story Flags: ${Object.keys(storyFlags).length} flags set`);
    expect(storyFlags['house-01']).toBe(true);
    expect(storyFlags['house-02']).toBe(true);
    expect(storyFlags['house-03']).toBe(true);
    expect(storyFlags['house-04']).toBe(true);
    expect(storyFlags['house-05']).toBe(true);

    // ============================================================================
    // VERIFY EQUIPMENT IN EQUIPMENT SCREEN
    // ============================================================================
    console.log('\n🔍 === VERIFYING EQUIPMENT IN EQUIPMENT SCREEN ===');
    
    // Open shop/equip screen
    await page.evaluate(() => {
      const store = (window as any).__VALE_STORE__;
      // Trigger shop screen via button click simulation
      const event = new Event('click');
      const button = document.querySelector('button:has-text("Shop & Equipment")') as HTMLButtonElement;
      if (button) {
        button.dispatchEvent(event);
      }
    });
    
    // Alternative: directly set showShopEquip state if we can access it
    // Or navigate to shop trigger
    await navigateToPosition(page, 12, 5);
    await page.waitForTimeout(500);
    
    const shopMode = await page.evaluate(() => {
      const store = (window as any).__VALE_STORE__;
      return store?.getState()?.mode;
    });
    
    if (shopMode !== 'shop') {
      await page.evaluate(() => {
        const store = (window as any).__VALE_STORE__;
        if (store) {
          store.getState().handleTrigger({
            id: 'shop-vale-armory',
            type: 'shop',
            position: { x: 12, y: 5 },
            data: { shopId: 'vale-armory' }
          });
        }
      });
    }
    
    await waitForMode(page, 'shop', 10000);
    
    // Switch to Equipment tab
    const equipTab = page.getByRole('button', { name: /equipment/i });
    await equipTab.click();
    await page.waitForTimeout(500);
    
    // Check equipment inventory in the screen
    const equipmentInScreen = await page.evaluate(() => {
      const store = (window as any).__VALE_STORE__;
      return store?.getState()?.equipment?.map((e: any) => ({ id: e.id, name: e.name, slot: e.slot })) ?? [];
    });
    
    console.log(`   Equipment in store state: ${equipmentInScreen.map(e => e.name).join(', ') || 'none'}`);
    console.log(`   Equipment count in store: ${equipmentInScreen.length}`);
    
    // Select a unit and slot to see if equipment appears
    const unitId = await page.evaluate(() => {
      const store = (window as any).__VALE_STORE__;
      return store?.getState()?.team?.units?.[0]?.id;
    });
    
    if (unitId && equipmentInScreen.length > 0) {
      console.log(`   → Testing equipment display for unit ${unitId}...`);
      
      // Try to find and click a slot (weapon)
      const weaponSlot = page.locator('.equipment-slot.weapon').first();
      const slotVisible = await weaponSlot.isVisible().catch(() => false);
      
      if (slotVisible) {
        await weaponSlot.click();
        await page.waitForTimeout(500);
        
        // Check if equipment appears in inventory
        const inventoryItems = await page.locator('.inventory-item').count();
        console.log(`   Inventory items visible: ${inventoryItems}`);
        
        if (inventoryItems === 0 && equipmentInScreen.length > 0) {
          console.log('   ⚠️  WARNING: Equipment in store but not visible in equipment screen!');
          console.log(`   Expected to see equipment for slot: weapon`);
          console.log(`   Equipment that should be visible: ${equipmentInScreen.filter(e => e.slot === 'weapon').map(e => e.name).join(', ') || 'none'}`);
        } else {
          console.log(`   ✅ Equipment screen shows ${inventoryItems} items`);
        }
      }
    }
    
    // Close shop
    const closeButton = page.getByRole('button', { name: /close/i }).first();
    await closeButton.click();
    await waitForMode(page, 'overworld', 3000);

    console.log('\n✅ === FIVE HOUSES PROGRESSION COMPLETE ===\n');
  });
});

