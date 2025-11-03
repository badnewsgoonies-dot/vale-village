import { describe, test, expect } from 'vitest';
import { Unit } from '@/types/Unit';
import {
  createPlayerData,
  recruitUnit,
  setActiveParty,
  getActiveParty,
  getBenchUnits,
  canRecruitMore,
  selectStarter,
  swapPartyMember,
  removeFromActiveParty,
  addToActiveParty,
} from '@/types/PlayerData';
import { ISAAC, GARET, MIA, IVAN, FELIX, JENNA, SHEBA, PIERS, KRADEN, KYLE } from '@/data/unitDefinitions';
import { isOk, isErr } from '@/utils/Result';

describe('TASK 6: Party Management - Collection Limits', () => {

  test('✅ Can recruit units up to 10 total', () => {
    const isaac = new Unit(ISAAC, 1);
    let playerData = createPlayerData(isaac);

    // Recruit 9 more units (total = 10)
    const recruits = [
      new Unit(GARET, 1),
      new Unit(MIA, 2),
      new Unit(IVAN, 1),
      new Unit(FELIX, 3),
      new Unit(JENNA, 3),
      new Unit(SHEBA, 3),
      new Unit(PIERS, 4),
      new Unit(KRADEN, 4),
      new Unit(KYLE, 5),
    ];

    for (const unit of recruits) {
      const result = recruitUnit(playerData, unit);
      expect(isOk(result)).toBe(true);
      if (isOk(result)) {
        playerData = result.value;
      }
    }

    expect(playerData.unitsCollected.length).toBe(10);
  });

  test('✅ Cannot recruit more than 10 units', () => {
    const isaac = new Unit(ISAAC, 1);
    let playerData = createPlayerData(isaac);

    // Recruit 9 more units (total = 10)
    const recruits = [
      new Unit(GARET, 1),
      new Unit(MIA, 2),
      new Unit(IVAN, 1),
      new Unit(FELIX, 3),
      new Unit(JENNA, 3),
      new Unit(SHEBA, 3),
      new Unit(PIERS, 4),
      new Unit(KRADEN, 4),
      new Unit(KYLE, 5),
    ];

    for (const unit of recruits) {
      const result = recruitUnit(playerData, unit);
      if (isOk(result)) {
        playerData = result.value;
      }
    }

    // Try to recruit 11th unit
    const extraUnit = new Unit(ISAAC, 1); // Use Isaac again (different instance)
    extraUnit.id = 'isaac-clone'; // Change ID to avoid duplicate check

    const result = recruitUnit(playerData, extraUnit);
    expect(isErr(result)).toBe(true);
    if (isErr(result)) {
      expect(result.error).toContain('Cannot recruit more than 10 units');
    }
  });

  test('✅ Cannot recruit duplicate unit', () => {
    const isaac = new Unit(ISAAC, 1);
    let playerData = createPlayerData(isaac);

    // Try to recruit Isaac again
    const isaac2 = new Unit(ISAAC, 1);
    const result = recruitUnit(playerData, isaac2);

    expect(isErr(result)).toBe(true);
    if (isErr(result)) {
      expect(result.error).toContain('already recruited');
    }
  });

  test('✅ canRecruitMore returns correct status', () => {
    const isaac = new Unit(ISAAC, 1);
    let playerData = createPlayerData(isaac);

    expect(canRecruitMore(playerData)).toBe(true);

    // Recruit 9 more units
    const recruits = [
      new Unit(GARET, 1),
      new Unit(MIA, 2),
      new Unit(IVAN, 1),
      new Unit(FELIX, 3),
      new Unit(JENNA, 3),
      new Unit(SHEBA, 3),
      new Unit(PIERS, 4),
      new Unit(KRADEN, 4),
      new Unit(KYLE, 5),
    ];

    for (const unit of recruits) {
      const result = recruitUnit(playerData, unit);
      if (isOk(result)) {
        playerData = result.value;
      }
    }

    expect(canRecruitMore(playerData)).toBe(false);
  });
});

describe('TASK 6: Active Party Selection', () => {

  test('✅ Active party can have 1-4 units', () => {
    const isaac = new Unit(ISAAC, 1);
    let playerData = createPlayerData(isaac);

    // Recruit 3 more units
    playerData = recruitUnit(playerData, new Unit(GARET, 1)).value as typeof playerData;
    playerData = recruitUnit(playerData, new Unit(MIA, 2)).value as typeof playerData;
    playerData = recruitUnit(playerData, new Unit(IVAN, 1)).value as typeof playerData;

    // Test 1 unit
    const result1 = setActiveParty(playerData, [isaac.id]);
    expect(isOk(result1)).toBe(true);

    // Test 2 units
    const result2 = setActiveParty(playerData, [isaac.id, 'garet']);
    expect(isOk(result2)).toBe(true);

    // Test 3 units
    const result3 = setActiveParty(playerData, [isaac.id, 'garet', 'mia']);
    expect(isOk(result3)).toBe(true);

    // Test 4 units
    const result4 = setActiveParty(playerData, [isaac.id, 'garet', 'mia', 'ivan']);
    expect(isOk(result4)).toBe(true);
  });

  test('✅ Active party cannot have 0 units', () => {
    const isaac = new Unit(ISAAC, 1);
    const playerData = createPlayerData(isaac);

    const result = setActiveParty(playerData, []);
    expect(isErr(result)).toBe(true);
    if (isErr(result)) {
      expect(result.error).toContain('at least 1 unit');
    }
  });

  test('✅ Active party cannot have more than 4 units', () => {
    const isaac = new Unit(ISAAC, 1);
    let playerData = createPlayerData(isaac);

    // Recruit 4 more units
    playerData = recruitUnit(playerData, new Unit(GARET, 1)).value as typeof playerData;
    playerData = recruitUnit(playerData, new Unit(MIA, 2)).value as typeof playerData;
    playerData = recruitUnit(playerData, new Unit(IVAN, 1)).value as typeof playerData;
    playerData = recruitUnit(playerData, new Unit(FELIX, 3)).value as typeof playerData;

    const result = setActiveParty(playerData, [isaac.id, 'garet', 'mia', 'ivan', 'felix']);
    expect(isErr(result)).toBe(true);
    if (isErr(result)) {
      expect(result.error).toContain('cannot have more than 4 units');
    }
  });

  test('✅ Cannot add unrecruited unit to active party', () => {
    const isaac = new Unit(ISAAC, 1);
    const playerData = createPlayerData(isaac);

    const result = setActiveParty(playerData, [isaac.id, 'garet']); // Garet not recruited
    expect(isErr(result)).toBe(true);
    if (isErr(result)) {
      expect(result.error).toContain('not in collection');
    }
  });

  test('✅ Cannot have duplicate units in active party', () => {
    const isaac = new Unit(ISAAC, 1);
    let playerData = createPlayerData(isaac);
    playerData = recruitUnit(playerData, new Unit(GARET, 1)).value as typeof playerData;

    const result = setActiveParty(playerData, [isaac.id, isaac.id, 'garet']); // Isaac twice
    expect(isErr(result)).toBe(true);
    if (isErr(result)) {
      expect(result.error).toContain('duplicate');
    }
  });

<<<<<<< HEAD
=======
  test('✅ getActiveParty returns correct units', () => {
    const isaac = new Unit(ISAAC, 1);
    let playerData = createPlayerData(isaac);
    playerData = recruitUnit(playerData, new Unit(GARET, 1)).value as typeof playerData;
    playerData = recruitUnit(playerData, new Unit(MIA, 2)).value as typeof playerData;

    playerData = setActiveParty(playerData, [isaac.id, 'garet']).value as typeof playerData;

    const activeParty = getActiveParty(playerData);
    expect(activeParty.length).toBe(2);
    expect(activeParty[0].id).toBe(isaac.id);
    expect(activeParty[1].id).toBe('garet');
  });

  test('✅ getBenchUnits returns units not in active party', () => {
    const isaac = new Unit(ISAAC, 1);
    let playerData = createPlayerData(isaac);
    playerData = recruitUnit(playerData, new Unit(GARET, 1)).value as typeof playerData;
    playerData = recruitUnit(playerData, new Unit(MIA, 2)).value as typeof playerData;
    playerData = recruitUnit(playerData, new Unit(IVAN, 1)).value as typeof playerData;

    playerData = setActiveParty(playerData, [isaac.id, 'garet']).value as typeof playerData;

    const benchUnits = getBenchUnits(playerData);
    expect(benchUnits.length).toBe(2);
    expect(benchUnits.some(u => u.id === 'mia')).toBe(true);
    expect(benchUnits.some(u => u.id === 'ivan')).toBe(true);
  });
>>>>>>> da011dae5a42c00b1fdb0e0f62b8f00e0a566dcf
});

describe('TASK 6: Starter Selection', () => {

  test('✅ Can select 1 of 3 starters', () => {
    const starters = [
      new Unit(ISAAC, 1),
      new Unit(GARET, 1),
      new Unit(IVAN, 1),
    ];

    const result = selectStarter(starters, ISAAC.id);
    expect(isOk(result)).toBe(true);

    if (isOk(result)) {
      const playerData = result.value;
      expect(playerData.unitsCollected.length).toBe(1);
      expect(playerData.unitsCollected[0].id).toBe(ISAAC.id);
      expect(playerData.activePartyIds).toEqual([ISAAC.id]);
      expect(playerData.recruitmentFlags[`starter_selected_${ISAAC.id}`]).toBe(true);
    }
  });

  test('✅ Starter selection requires exactly 3 choices', () => {
    const twoStarters = [new Unit(ISAAC, 1), new Unit(GARET, 1)];

    const result = selectStarter(twoStarters, ISAAC.id);
    expect(isErr(result)).toBe(true);
    if (isErr(result)) {
      expect(result.error).toContain('exactly 3 starter choices');
    }
  });

  test('✅ Cannot select invalid starter ID', () => {
    const starters = [
      new Unit(ISAAC, 1),
      new Unit(GARET, 1),
      new Unit(IVAN, 1),
    ];

    const result = selectStarter(starters, 'felix'); // Not a starter
    expect(isErr(result)).toBe(true);
    if (isErr(result)) {
      expect(result.error).toContain('Invalid starter ID');
    }
  });
});

describe('TASK 6: Party Swapping', () => {

  test('✅ Can swap active party member with bench unit', () => {
    const isaac = new Unit(ISAAC, 1);
    let playerData = createPlayerData(isaac);
    playerData = recruitUnit(playerData, new Unit(GARET, 1)).value as typeof playerData;
    playerData = recruitUnit(playerData, new Unit(MIA, 2)).value as typeof playerData;

    // Active: [Isaac, Garet], Bench: [Mia]
    playerData = setActiveParty(playerData, [isaac.id, 'garet']).value as typeof playerData;

    // Swap Garet for Mia
    const result = swapPartyMember(playerData, 'garet', 'mia');
    expect(isOk(result)).toBe(true);

    if (isOk(result)) {
      const newData = result.value;
      expect(newData.activePartyIds).toEqual([isaac.id, 'mia']);
      expect(getBenchUnits(newData).some(u => u.id === 'garet')).toBe(true);
    }
  });

  test('✅ Cannot swap unit not in active party', () => {
    const isaac = new Unit(ISAAC, 1);
    let playerData = createPlayerData(isaac);
    playerData = recruitUnit(playerData, new Unit(GARET, 1)).value as typeof playerData;
    playerData = recruitUnit(playerData, new Unit(MIA, 2)).value as typeof playerData;

    // Active: [Isaac, Garet], Bench: [Mia]
    playerData = setActiveParty(playerData, [isaac.id, 'garet']).value as typeof playerData;

    // Try to swap Mia (not in active party)
    const result = swapPartyMember(playerData, 'mia', isaac.id);
    expect(isErr(result)).toBe(true);
    if (isErr(result)) {
      expect(result.error).toContain('not in active party');
    }
  });

  test('✅ Cannot swap with unit not in collection', () => {
    const isaac = new Unit(ISAAC, 1);
    let playerData = createPlayerData(isaac);
    playerData = recruitUnit(playerData, new Unit(GARET, 1)).value as typeof playerData;

    // Active: [Isaac, Garet]
    playerData = setActiveParty(playerData, [isaac.id, 'garet']).value as typeof playerData;

    // Try to swap with Felix (not recruited)
    const result = swapPartyMember(playerData, 'garet', 'felix');
    expect(isErr(result)).toBe(true);
    if (isErr(result)) {
      expect(result.error).toContain('not in collection');
    }
  });

  test('✅ Cannot swap with unit already in active party', () => {
    const isaac = new Unit(ISAAC, 1);
    let playerData = createPlayerData(isaac);
    playerData = recruitUnit(playerData, new Unit(GARET, 1)).value as typeof playerData;
    playerData = recruitUnit(playerData, new Unit(MIA, 2)).value as typeof playerData;

    // Active: [Isaac, Garet, Mia]
    playerData = setActiveParty(playerData, [isaac.id, 'garet', 'mia']).value as typeof playerData;

    // Try to swap Isaac with Garet (both in active party)
    const result = swapPartyMember(playerData, isaac.id, 'garet');
    expect(isErr(result)).toBe(true);
    if (isErr(result)) {
      expect(result.error).toContain('already in active party');
    }
  });

  test('✅ Cannot remove last unit from active party', () => {
    const isaac = new Unit(ISAAC, 1);
    let playerData = createPlayerData(isaac);
    playerData = recruitUnit(playerData, new Unit(GARET, 1)).value as typeof playerData;

    // Active: [Isaac], Bench: [Garet]
    playerData = setActiveParty(playerData, [isaac.id]).value as typeof playerData;

    // Try to swap Isaac (would leave party empty)
    const result = swapPartyMember(playerData, isaac.id, 'garet');
    expect(isErr(result)).toBe(true);
    if (isErr(result)) {
      expect(result.error).toContain('Cannot remove last unit');
    }
  });
});

describe('TASK 6: Add/Remove Party Members', () => {

  test('✅ Can add bench unit to active party', () => {
    const isaac = new Unit(ISAAC, 1);
    let playerData = createPlayerData(isaac);
    playerData = recruitUnit(playerData, new Unit(GARET, 1)).value as typeof playerData;
    playerData = recruitUnit(playerData, new Unit(MIA, 2)).value as typeof playerData;

    // Garet auto-added, so remove him to put on bench
    // Active: [Isaac, Garet, Mia]
    playerData = setActiveParty(playerData, [isaac.id]).value as typeof playerData;

    // Now Active: [Isaac], Bench: [Garet, Mia]
    const result = addToActiveParty(playerData, 'garet');
    expect(isOk(result)).toBe(true);

    if (isOk(result)) {
      const newData = result.value;
      expect(newData.activePartyIds).toEqual([isaac.id, 'garet']);
    }
  });

  test('✅ Cannot add unit already in active party', () => {
    const isaac = new Unit(ISAAC, 1);
    let playerData = createPlayerData(isaac);
    playerData = recruitUnit(playerData, new Unit(GARET, 1)).value as typeof playerData;

    // Active: [Isaac, Garet]
    playerData = setActiveParty(playerData, [isaac.id, 'garet']).value as typeof playerData;

    const result = addToActiveParty(playerData, isaac.id);
    expect(isErr(result)).toBe(true);
    if (isErr(result)) {
      expect(result.error).toContain('already in active party');
    }
  });

  test('✅ Cannot add unit not in collection', () => {
    const isaac = new Unit(ISAAC, 1);
    const playerData = createPlayerData(isaac);

    const result = addToActiveParty(playerData, 'garet'); // Not recruited
    expect(isErr(result)).toBe(true);
    if (isErr(result)) {
      expect(result.error).toContain('not in collection');
    }
  });

  test('✅ Cannot add to full party (4 units)', () => {
    const isaac = new Unit(ISAAC, 1);
    let playerData = createPlayerData(isaac);
    playerData = recruitUnit(playerData, new Unit(GARET, 1)).value as typeof playerData;
    playerData = recruitUnit(playerData, new Unit(MIA, 2)).value as typeof playerData;
    playerData = recruitUnit(playerData, new Unit(IVAN, 1)).value as typeof playerData;
    playerData = recruitUnit(playerData, new Unit(FELIX, 3)).value as typeof playerData;

    // Active: [Isaac, Garet, Mia, Ivan] (full), Bench: [Felix]
    playerData = setActiveParty(playerData, [isaac.id, 'garet', 'mia', 'ivan']).value as typeof playerData;

    const result = addToActiveParty(playerData, 'felix');
    expect(isErr(result)).toBe(true);
    if (isErr(result)) {
      expect(result.error).toContain('Active party is full');
    }
  });

  test('✅ Can remove unit from active party', () => {
    const isaac = new Unit(ISAAC, 1);
    let playerData = createPlayerData(isaac);
    playerData = recruitUnit(playerData, new Unit(GARET, 1)).value as typeof playerData;

    // Active: [Isaac, Garet]
    playerData = setActiveParty(playerData, [isaac.id, 'garet']).value as typeof playerData;

    const result = removeFromActiveParty(playerData, 'garet');
    expect(isOk(result)).toBe(true);

    if (isOk(result)) {
      const newData = result.value;
      expect(newData.activePartyIds).toEqual([isaac.id]);
      expect(getBenchUnits(newData).some(u => u.id === 'garet')).toBe(true);
    }
  });

  test('✅ Cannot remove unit not in active party', () => {
    const isaac = new Unit(ISAAC, 1);
    let playerData = createPlayerData(isaac);
    playerData = recruitUnit(playerData, new Unit(GARET, 1)).value as typeof playerData;

    // Garet auto-added, so manually set party to only Isaac
    playerData = setActiveParty(playerData, [isaac.id]).value as typeof playerData;

    // Now Active: [Isaac], Bench: [Garet]
    const result = removeFromActiveParty(playerData, 'garet');
    expect(isErr(result)).toBe(true);
    if (isErr(result)) {
      expect(result.error).toContain('not in active party');
    }
  });

  test('✅ Cannot remove last unit from active party', () => {
    const isaac = new Unit(ISAAC, 1);
    let playerData = createPlayerData(isaac);

    // Active: [Isaac] (only unit)
    const result = removeFromActiveParty(playerData, isaac.id);
    expect(isErr(result)).toBe(true);
    if (isErr(result)) {
      expect(result.error).toContain('Cannot remove last unit');
    }
  });
});

describe('CONTEXT-AWARE: Recruitment System', () => {

  test('🎯 Auto-add to active party if less than 4 units', () => {
    const isaac = new Unit(ISAAC, 1);
    let playerData = createPlayerData(isaac);

    // Recruit Garet - should auto-add to active party
    const result1 = recruitUnit(playerData, new Unit(GARET, 1));
    expect(isOk(result1)).toBe(true);
    if (isOk(result1)) {
      playerData = result1.value;
      expect(playerData.activePartyIds).toEqual([isaac.id, 'garet']);
    }

    // Recruit Mia - should auto-add
    const result2 = recruitUnit(playerData, new Unit(MIA, 2));
    expect(isOk(result2)).toBe(true);
    if (isOk(result2)) {
      playerData = result2.value;
      expect(playerData.activePartyIds).toEqual([isaac.id, 'garet', 'mia']);
    }

    // Recruit Ivan - should auto-add (4th unit)
    const result3 = recruitUnit(playerData, new Unit(IVAN, 1));
    expect(isOk(result3)).toBe(true);
    if (isOk(result3)) {
      playerData = result3.value;
      expect(playerData.activePartyIds).toEqual([isaac.id, 'garet', 'mia', 'ivan']);
    }

    // Recruit Felix - should NOT auto-add (party full)
    const result4 = recruitUnit(playerData, new Unit(FELIX, 3));
    expect(isOk(result4)).toBe(true);
    if (isOk(result4)) {
      playerData = result4.value;
      expect(playerData.activePartyIds).toEqual([isaac.id, 'garet', 'mia', 'ivan']);
      expect(getBenchUnits(playerData).some(u => u.id === 'felix')).toBe(true);
    }

    // ← PROVES auto-add works until party is full!
  });

  test('🎯 Recruitment flags are set correctly', () => {
    const isaac = new Unit(ISAAC, 1);
    let playerData = createPlayerData(isaac);

    const result = recruitUnit(playerData, new Unit(MIA, 2), 'defeated_mia_friendly_spar');
    expect(isOk(result)).toBe(true);

    if (isOk(result)) {
      playerData = result.value;
      expect(playerData.recruitmentFlags['defeated_mia_friendly_spar']).toBe(true);
    }

    // ← PROVES recruitment flags track story progress!
  });
});

describe('CONTEXT-AWARE: Party Composition Strategy', () => {

  test('🎯 Can build balanced party (Physical + Magical + Healer)', () => {
    const isaac = new Unit(ISAAC, 5);    // Balanced Warrior
    let playerData = createPlayerData(isaac);

    playerData = recruitUnit(playerData, new Unit(GARET, 5)).value as typeof playerData;  // Pure DPS
    playerData = recruitUnit(playerData, new Unit(MIA, 5)).value as typeof playerData;    // Healer
    playerData = recruitUnit(playerData, new Unit(IVAN, 5)).value as typeof playerData;   // Elemental Mage

    // Active: Balanced party
    playerData = setActiveParty(playerData, [isaac.id, 'garet', 'mia', 'ivan']).value as typeof playerData;

    const activeParty = getActiveParty(playerData);
    const roles = activeParty.map(u => u.role);

    expect(roles).toContain('Balanced Warrior');
    expect(roles).toContain('Pure DPS');
    expect(roles).toContain('Healer');
    expect(roles).toContain('Elemental Mage');

    // ← PROVES player can build diverse team compositions!
  });

  test('🎯 Can build specialized party (All Physical DPS)', () => {
    const isaac = new Unit(ISAAC, 5);
    let playerData = createPlayerData(isaac);

    playerData = recruitUnit(playerData, new Unit(GARET, 5)).value as typeof playerData;
    playerData = recruitUnit(playerData, new Unit(FELIX, 5)).value as typeof playerData;
    playerData = recruitUnit(playerData, new Unit(KYLE, 5)).value as typeof playerData;

    // Active: All physical attackers
    playerData = setActiveParty(playerData, [isaac.id, 'garet', 'felix', 'kyle']).value as typeof playerData;

    const activeParty = getActiveParty(playerData);
    const avgAtk = activeParty.reduce((sum, u) => sum + u.stats.atk, 0) / activeParty.length;

    // Physical party has high average ATK
    expect(avgAtk).toBeGreaterThan(25);

    // ← PROVES specialized party composition is viable!
  });

  test('🎯 Bench units available for situational swaps', () => {
    const isaac = new Unit(ISAAC, 5);
    let playerData = createPlayerData(isaac);

    // Recruit diverse roster
    playerData = recruitUnit(playerData, new Unit(GARET, 5)).value as typeof playerData;
    playerData = recruitUnit(playerData, new Unit(MIA, 5)).value as typeof playerData;
    playerData = recruitUnit(playerData, new Unit(IVAN, 5)).value as typeof playerData;
    playerData = recruitUnit(playerData, new Unit(FELIX, 5)).value as typeof playerData;
    playerData = recruitUnit(playerData, new Unit(JENNA, 5)).value as typeof playerData;

    // Start with balanced party
    playerData = setActiveParty(playerData, [isaac.id, 'garet', 'mia', 'ivan']).value as typeof playerData;

    // Bench has 2 units available
    const benchUnits = getBenchUnits(playerData);
    expect(benchUnits.length).toBe(2);
    expect(benchUnits.some(u => u.id === 'felix')).toBe(true);
    expect(benchUnits.some(u => u.id === 'jenna')).toBe(true);

    // Swap Ivan for Jenna (trade speed for AoE damage)
    playerData = swapPartyMember(playerData, 'ivan', 'jenna').value as typeof playerData;

    const newActiveParty = getActiveParty(playerData);
    expect(newActiveParty.some(u => u.id === 'jenna')).toBe(true);

    // ← PROVES bench system enables tactical flexibility!
  });
});

describe('EDGE CASES: Party Management', () => {

  test('Empty bench (all units in active party)', () => {
    const isaac = new Unit(ISAAC, 1);
    let playerData = createPlayerData(isaac);
    playerData = recruitUnit(playerData, new Unit(GARET, 1)).value as typeof playerData;

    // Active: [Isaac, Garet], Bench: empty
    playerData = setActiveParty(playerData, [isaac.id, 'garet']).value as typeof playerData;

    const benchUnits = getBenchUnits(playerData);
    expect(benchUnits.length).toBe(0);
  });

  test('Single unit in collection', () => {
    const isaac = new Unit(ISAAC, 1);
    const playerData = createPlayerData(isaac);

    expect(playerData.unitsCollected.length).toBe(1);
    expect(playerData.activePartyIds).toEqual([isaac.id]);
    expect(getBenchUnits(playerData).length).toBe(0);
  });

  test('Party order is preserved', () => {
    const isaac = new Unit(ISAAC, 1);
    let playerData = createPlayerData(isaac);
    playerData = recruitUnit(playerData, new Unit(GARET, 1)).value as typeof playerData;
    playerData = recruitUnit(playerData, new Unit(MIA, 2)).value as typeof playerData;

    // Set specific order
    playerData = setActiveParty(playerData, ['mia', isaac.id, 'garet']).value as typeof playerData;

    expect(playerData.activePartyIds).toEqual(['mia', isaac.id, 'garet']);

    const activeParty = getActiveParty(playerData);
    expect(activeParty[0].id).toBe('mia');
    expect(activeParty[1].id).toBe(isaac.id);
    expect(activeParty[2].id).toBe('garet');
  });

  test('getActiveParty handles missing units gracefully', () => {
    const isaac = new Unit(ISAAC, 1);
    const playerData = createPlayerData(isaac);

    // Manually set invalid ID
    playerData.activePartyIds = [isaac.id, 'nonexistent'];

    const activeParty = getActiveParty(playerData);
    // Should filter out nonexistent unit
    expect(activeParty.length).toBe(1);
    expect(activeParty[0].id).toBe(isaac.id);
  });
});

describe('DATA INTEGRITY: Party Management', () => {

  test('✅ Active party IDs match recruited units', () => {
    const isaac = new Unit(ISAAC, 1);
    let playerData = createPlayerData(isaac);
    playerData = recruitUnit(playerData, new Unit(GARET, 1)).value as typeof playerData;

    // All active party IDs should exist in unitsCollected
    for (const id of playerData.activePartyIds) {
      const unitExists = playerData.unitsCollected.some(u => u.id === id);
      expect(unitExists).toBe(true);
    }
  });

  test('✅ Active party + bench = total collection', () => {
    const isaac = new Unit(ISAAC, 1);
    let playerData = createPlayerData(isaac);
    playerData = recruitUnit(playerData, new Unit(GARET, 1)).value as typeof playerData;
    playerData = recruitUnit(playerData, new Unit(MIA, 2)).value as typeof playerData;
    playerData = recruitUnit(playerData, new Unit(IVAN, 1)).value as typeof playerData;
    playerData = recruitUnit(playerData, new Unit(FELIX, 3)).value as typeof playerData;

    // Active: [Isaac, Garet], Bench: [Mia, Ivan, Felix]
    playerData = setActiveParty(playerData, [isaac.id, 'garet']).value as typeof playerData;

    const activeCount = getActiveParty(playerData).length;
    const benchCount = getBenchUnits(playerData).length;
    const totalCount = playerData.unitsCollected.length;

    expect(activeCount + benchCount).toBe(totalCount);
  });

  test('✅ No unit appears in both active and bench', () => {
    const isaac = new Unit(ISAAC, 1);
    let playerData = createPlayerData(isaac);
    playerData = recruitUnit(playerData, new Unit(GARET, 1)).value as typeof playerData;
    playerData = recruitUnit(playerData, new Unit(MIA, 2)).value as typeof playerData;

    playerData = setActiveParty(playerData, [isaac.id, 'garet']).value as typeof playerData;

    const activeParty = getActiveParty(playerData);
    const benchUnits = getBenchUnits(playerData);

    // No overlap
    for (const activeUnit of activeParty) {
      expect(benchUnits.some(u => u.id === activeUnit.id)).toBe(false);
    }
  });
});
