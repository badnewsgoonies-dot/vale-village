/**
 * PRIORITY 2: Story Join Validation E2E Tests
 *
 * Tests the narrative-driven story join system where units auto-recruit after battle.
 * Houses 2 and 3 grant Mystic and Ranger via post-battle recruitment dialogues.
 *
 * This validates:
 * - Story join dialogue triggers after battle
 * - Units are added to roster via dialogue effects
 * - Story flags are set correctly
 */

import { test, expect } from '@playwright/test';
import {
  getRoster,
  waitForMode,
  jumpToHouse,
  completeBattleFlow,
  getDebugState,
} from './helpers';

test.describe('Story Joins: Narrative-Driven Auto-Recruitment', () => {
  test('House 2: Mystic auto-recruits via dialogue after victory', async ({ page }) => {
    console.log('\n🎮 STARTING: House 2 Mystic Story Join');

    // Start game
    await page.goto('/');
    await waitForMode(page, 'overworld', 5000);

    // Jump to House 2 (grants H1 rewards: War Mage)
    console.log('📍 Jumping to House 2 via Dev Mode...');
    await jumpToHouse(page, 2);

    // Verify pre-battle roster (should have Isaac + War Mage from H1)
    const preBattleRoster = await getRoster(page);
    console.log(`Pre-battle roster: ${preBattleRoster.length} units`);
    preBattleRoster.forEach(u => console.log(`  - ${u.name} (${u.id})`));

    expect(preBattleRoster.length).toBeGreaterThanOrEqual(2); // Isaac + War Mage
    expect(preBattleRoster.some(u => u.id === 'adept')).toBe(true);
    expect(preBattleRoster.some(u => u.id === 'war-mage')).toBe(true);
    console.log('✓ Pre-battle roster includes Isaac + War Mage');

    // Complete House 2 battle (with recruitment dialogue)
    console.log('\n⚔️  Completing House 2 battle...');
    await completeBattleFlow(page, {
      expectDialogue: true, // Mystic recruitment dialogue
      logDetails: true,
    });

    // ✅ CRITICAL: Verify Mystic was added to roster
    const postBattleRoster = await getRoster(page);
    console.log(`\nPost-battle roster: ${postBattleRoster.length} units`);
    postBattleRoster.forEach(u => console.log(`  - ${u.name} (${u.id})`));

    expect(postBattleRoster.length).toBeGreaterThanOrEqual(3); // Isaac + War Mage + Mystic
    expect(postBattleRoster.some(u => u.id === 'mystic')).toBe(true);
    expect(postBattleRoster.some(u => u.name === 'Mystic')).toBe(true);

    console.log('✅ PROOF: Mystic auto-recruited after House 2 (story join via dialogue)!');

    // Verify story flag
    const debugState = await getDebugState(page);
    expect(debugState.storyFlags['house-02']).toBe(true);
    console.log('✅ Story flag set: house-02 = true');
  });

  test('House 3: Ranger auto-recruits via dialogue after victory', async ({ page }) => {
    console.log('\n🎮 STARTING: House 3 Ranger Story Join');

    await page.goto('/');
    await waitForMode(page, 'overworld', 5000);

    // Jump to House 3 (grants H1-H2 rewards: War Mage, Mystic)
    console.log('📍 Jumping to House 3 via Dev Mode...');
    await jumpToHouse(page, 3);

    // Verify pre-battle roster
    const preBattleRoster = await getRoster(page);
    console.log(`Pre-battle roster: ${preBattleRoster.length} units`);
    preBattleRoster.forEach(u => console.log(`  - ${u.name} (${u.id})`));

    expect(preBattleRoster.length).toBeGreaterThanOrEqual(3); // Isaac + War Mage + Mystic
    expect(preBattleRoster.some(u => u.id === 'mystic')).toBe(true);
    console.log('✓ Pre-battle roster includes Mystic from H2');

    // Complete House 3 battle (with Ranger recruitment dialogue)
    console.log('\n⚔️  Completing House 3 battle...');
    await completeBattleFlow(page, {
      expectDialogue: true, // Ranger recruitment dialogue
      logDetails: true,
    });

    // ✅ CRITICAL: Verify Ranger was added to roster
    const postBattleRoster = await getRoster(page);
    console.log(`\nPost-battle roster: ${postBattleRoster.length} units`);
    postBattleRoster.forEach(u => console.log(`  - ${u.name} (${u.id})`));

    expect(postBattleRoster.length).toBeGreaterThanOrEqual(4); // Isaac + War Mage + Mystic + Ranger
    expect(postBattleRoster.some(u => u.id === 'ranger')).toBe(true);
    expect(postBattleRoster.some(u => u.name === 'Ranger')).toBe(true);

    console.log('✅ PROOF: Ranger auto-recruited after House 3 (story join via dialogue)!');

    // Verify story flag
    const debugState = await getDebugState(page);
    expect(debugState.storyFlags['house-03']).toBe(true);
    console.log('✅ Story flag set: house-03 = true');
  });

  test('Story joins: Units recruit at appropriate level', async ({ page }) => {
    console.log('\n🎮 STARTING: Story Join Level Scaling Test');

    await page.goto('/');
    await waitForMode(page, 'overworld', 5000);

    // Jump to House 3
    await jumpToHouse(page, 3);
    await completeBattleFlow(page, { expectDialogue: true });

    // Get recruited units
    const roster = await getRoster(page);
    const mystic = roster.find(u => u.id === 'mystic');
    const ranger = roster.find(u => u.id === 'ranger');

    console.log(`Mystic level: ${mystic?.level ?? 'NOT FOUND'}`);
    console.log(`Ranger level: ${ranger?.level ?? 'NOT FOUND'}`);

    // Units should recruit at average team level (at least level 1)
    expect(mystic?.level).toBeGreaterThanOrEqual(1);
    expect(ranger?.level).toBeGreaterThanOrEqual(1);

    console.log('✅ Story join units have appropriate levels');
  });
});
