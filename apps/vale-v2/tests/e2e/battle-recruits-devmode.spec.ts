/**
 * PRIORITY 3: Battle Recruits via Dev Mode
 *
 * Tests all battle recruitment houses (H5, H8, H11, H14, H15, H17) using Dev Mode.
 * Since map triggers for Houses 2-20 aren't implemented yet, we use Dev Mode as a workaround.
 *
 * This validates:
 * - Dev Mode correctly grants previous rewards
 * - Recruitment dialogues trigger after battles
 * - Units are added to roster
 * - Progression through all 9 recruitments works
 */

import { test, expect } from '@playwright/test';
import {
  getRoster,
  waitForMode,
  jumpToHouse,
  completeBattleFlow,
  getDebugState,
} from './helpers';

test.describe('Battle Recruits: Dev Mode Jump Tests', () => {
  test('House 5: Blaze recruits via dialogue', async ({ page }) => {
    console.log('\n🎮 STARTING: House 5 Blaze Recruitment');

    await page.goto('/');
    await waitForMode(page, 'overworld', 5000);

    // Jump to House 5
    console.log('📍 Jumping to House 5...');
    await jumpToHouse(page, 5);

    // Pre-battle: Should have Isaac + War Mage + Mystic + Ranger (from H1-H3)
    const preBattleRoster = await getRoster(page);
    console.log(`Pre-battle roster: ${preBattleRoster.length} units`);

    expect(preBattleRoster.length).toBeGreaterThanOrEqual(4);
    console.log('✓ Pre-battle roster verified');

    // Complete battle
    await completeBattleFlow(page, { expectDialogue: true });

    // ✅ CRITICAL: Verify Blaze recruited
    const postBattleRoster = await getRoster(page);
    console.log(`Post-battle roster: ${postBattleRoster.length} units`);
    postBattleRoster.forEach(u => console.log(`  - ${u.name} (${u.id})`));

    expect(postBattleRoster.some(u => u.id === 'blaze')).toBe(true);
    expect(postBattleRoster.some(u => u.name === 'Blaze')).toBe(true);

    console.log('✅ PROOF: Blaze recruited after House 5!');
  });

  test('House 8: Sentinel recruits + Fizz Djinn granted', async ({ page }) => {
    console.log('\n🎮 STARTING: House 8 Sentinel + Fizz');

    await page.goto('/');
    await waitForMode(page, 'overworld', 5000);

    // Jump to House 8
    await jumpToHouse(page, 8);

    // Get pre-battle Djinn count
    const preBattleState = await getDebugState(page);
    const preBattleDjinnCount = preBattleState.collectedDjinn.length;
    console.log(`Pre-battle Djinn: ${preBattleState.collectedDjinn.join(', ')}`);

    await completeBattleFlow(page, { expectDialogue: true });

    // ✅ Verify Sentinel recruited
    const roster = await getRoster(page);
    expect(roster.some(u => u.id === 'sentinel')).toBe(true);
    console.log('✅ Sentinel recruited');

    // ✅ Verify Fizz Djinn granted
    const postBattleState = await getDebugState(page);
    console.log(`Post-battle Djinn: ${postBattleState.collectedDjinn.join(', ')}`);

    expect(postBattleState.collectedDjinn).toContain('fizz');
    expect(postBattleState.collectedDjinn.length).toBeGreaterThan(preBattleDjinnCount);
    console.log('✅ Fizz Djinn granted');
  });

  test('House 11: Karis recruits', async ({ page }) => {
    console.log('\n🎮 STARTING: House 11 Karis Recruitment');

    await page.goto('/');
    await waitForMode(page, 'overworld', 5000);

    await jumpToHouse(page, 11);
    await completeBattleFlow(page, { expectDialogue: true });

    const roster = await getRoster(page);
    expect(roster.some(u => u.id === 'karis')).toBe(true);
    expect(roster.some(u => u.name === 'Karis')).toBe(true);

    console.log('✅ PROOF: Karis recruited after House 11!');
  });

  test('House 14: Tyrell recruits', async ({ page }) => {
    console.log('\n🎮 STARTING: House 14 Tyrell Recruitment');

    await page.goto('/');
    await waitForMode(page, 'overworld', 5000);

    await jumpToHouse(page, 14);
    await completeBattleFlow(page, { expectDialogue: true });

    const roster = await getRoster(page);
    expect(roster.some(u => u.id === 'tyrell')).toBe(true);
    expect(roster.some(u => u.name === 'Tyrell')).toBe(true);

    console.log('✅ PROOF: Tyrell recruited after House 14!');
  });

  test('House 15: Stormcaller recruits + Squall Djinn granted', async ({ page }) => {
    console.log('\n🎮 STARTING: House 15 Stormcaller + Squall');

    await page.goto('/');
    await waitForMode(page, 'overworld', 5000);

    await jumpToHouse(page, 15);

    const preBattleState = await getDebugState(page);
    console.log(`Pre-battle Djinn: ${preBattleState.collectedDjinn.join(', ')}`);

    await completeBattleFlow(page, { expectDialogue: true });

    // ✅ Verify Stormcaller recruited
    const roster = await getRoster(page);
    expect(roster.some(u => u.id === 'stormcaller')).toBe(true);
    console.log('✅ Stormcaller recruited');

    // ✅ Verify Squall Djinn granted
    const postBattleState = await getDebugState(page);
    expect(postBattleState.collectedDjinn).toContain('squall');
    console.log('✅ Squall Djinn granted');
  });

  test('House 17: Felix recruits (final recruitment)', async ({ page }) => {
    console.log('\n🎮 STARTING: House 17 Felix Recruitment (Final Unit)');

    await page.goto('/');
    await waitForMode(page, 'overworld', 5000);

    await jumpToHouse(page, 17);

    const preBattleRoster = await getRoster(page);
    console.log(`Pre-battle roster size: ${preBattleRoster.length}`);

    await completeBattleFlow(page, { expectDialogue: true });

    // ✅ Verify Felix recruited
    const postBattleRoster = await getRoster(page);
    console.log(`Post-battle roster size: ${postBattleRoster.length}`);
    postBattleRoster.forEach(u => console.log(`  - ${u.name} (${u.id})`));

    expect(postBattleRoster.some(u => u.id === 'felix')).toBe(true);
    expect(postBattleRoster.some(u => u.name === 'Felix')).toBe(true);

    console.log('✅ PROOF: Felix recruited after House 17 (final recruitment)!');

    // Verify final roster count (9 units total: Isaac + 9 recruits = 10... wait, that's wrong)
    // Actually: Isaac (starting) + 9 recruits = 10? No wait...
    // Let me count: Isaac (pre-game), War Mage, Mystic, Ranger, Blaze, Sentinel, Karis, Tyrell, Stormcaller, Felix = 10
    // But test says 9 recruits. Let me check the docs again...
    // Oh! Isaac is NOT a recruit, he's the starting unit. So it's:
    // Starting: 1 (Isaac)
    // Recruits: 9 (War Mage, Mystic, Ranger, Blaze, Sentinel, Karis, Tyrell, Stormcaller, Felix)
    // Total: 10 units
    expect(postBattleRoster.length).toBe(10);
    console.log('✅ Final roster: 10 units (Isaac + 9 recruits)');
  });

  test('Full progression: Jump to H20, verify all units and Djinn', async ({ page }) => {
    console.log('\n🎮 STARTING: Full Progression Test (Jump to House 20)');

    await page.goto('/');
    await waitForMode(page, 'overworld', 5000);

    // Jump to House 20 (final house)
    await jumpToHouse(page, 20);

    // Complete final battle
    await completeBattleFlow(page, { expectDialogue: true });

    const finalState = await getDebugState(page);

    console.log('\n📊 FINAL STATE:');
    console.log(`Roster size: ${finalState.rosterSize}`);
    console.log(`Collected Djinn: ${finalState.collectedDjinn.length}`);
    console.log(`Djinn: ${finalState.collectedDjinn.join(', ')}`);

    // ✅ Verify all 10 units recruited
    expect(finalState.rosterSize).toBe(10);
    expect(finalState.roster.some(u => u.id === 'adept')).toBe(true);
    expect(finalState.roster.some(u => u.id === 'war-mage')).toBe(true);
    expect(finalState.roster.some(u => u.id === 'mystic')).toBe(true);
    expect(finalState.roster.some(u => u.id === 'ranger')).toBe(true);
    expect(finalState.roster.some(u => u.id === 'blaze')).toBe(true);
    expect(finalState.roster.some(u => u.id === 'sentinel')).toBe(true);
    expect(finalState.roster.some(u => u.id === 'karis')).toBe(true);
    expect(finalState.roster.some(u => u.id === 'tyrell')).toBe(true);
    expect(finalState.roster.some(u => u.id === 'stormcaller')).toBe(true);
    expect(finalState.roster.some(u => u.id === 'felix')).toBe(true);
    console.log('✅ All 10 units in roster');

    // ✅ Verify all 8 Djinn collected
    expect(finalState.collectedDjinn).toHaveLength(8);
    expect(finalState.collectedDjinn).toContain('flint'); // Pre-game
    expect(finalState.collectedDjinn).toContain('forge'); // H1
    expect(finalState.collectedDjinn).toContain('breeze'); // H7
    expect(finalState.collectedDjinn).toContain('fizz'); // H8
    expect(finalState.collectedDjinn).toContain('granite'); // H12
    expect(finalState.collectedDjinn).toContain('squall'); // H15
    expect(finalState.collectedDjinn).toContain('bane'); // H18
    expect(finalState.collectedDjinn).toContain('storm'); // H20
    console.log('✅ All 8 Djinn collected');

    console.log('\n🎉 FULL PROGRESSION SUCCESS: All units and Djinn acquired!');
  });
});
