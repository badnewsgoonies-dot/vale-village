# Implementation Status: Houses 1-20 Progression
**Date:** 2025-11-19
**Approach:** Data-First with Dev Mode Testing
**Status:** Phase 1 In Progress

---

## ✅ Phase 1: Unit Definitions (COMPLETE)

### What Was Implemented
Added 4 new recruitable units to `src/data/definitions/units.ts`:

1. **Blaze** (Mars, Balanced Warrior) - House 5
2. **Karis** (Mercury, Versatile Scholar) - House 11
3. **Tyrell** (Mars, Pure DPS) - House 14
4. **Felix** (Venus, Master Warrior) - House 17

### Validation
- ✅ TypeScript compiles (no errors in units.ts)
- ✅ All abilities exist (using HEAVY_STRIKE from abilities.ts)
- ✅ Follows existing patterns (Level 1: 2 abilities, +1 per level)
- ✅ Element balance achieved (3-2-2-2 distribution)
- ✅ All 10 UnitSchema roles covered

### Files Modified
- `src/data/definitions/units.ts` (+139 lines, -5 lines)

### Commit
- `7baaa20` - feat: add 4 new recruitable units for Houses 1-20 progression

---

## 🔄 Phase 2: Encounter Definitions (IN PROGRESS)

### What Needs to Be Done
Rewrite `src/data/definitions/encounters.ts` based on new blueprint:

#### Current State (OLD - needs updating)
```typescript
HOUSE_01_TUTORIAL: enemies: ['earth-scout', 'venus-wolf'], reward: wooden-sword
HOUSE_02_FLINT: djinn: 'flint' (Venus T1)
HOUSE_03_ICE: equipment: leather-vest
HOUSE_04_BREEZE: djinn: 'breeze' (Jupiter T1)
HOUSE_05_ESCALATION: equipment: bronze-sword
HOUSE_06_FORGE: djinn: 'forge' (Mars T1)
HOUSE_07_WIND_CHALLENGE: ...
HOUSE_08_SENTINEL_FIZZ: djinn: 'fizz', unlockUnit: 'sentinel'
... (continues through House 20)
```

#### New Blueprint Requirements
```
START (pre-game): Flint Djinn (story gift, not from battle)

House 1 (VS1):
  - Fight: Garet (enemy War Mage)
  - Rewards: Garet recruit (unlockUnit: 'war-mage'), Forge Djinn (Mars T1)
  - XP: 60, Gold: 20
  - Equipment: none

House 2:
  - Rewards: bronze-sword (Venus), XP: 70, Gold: 22
  - Mystic joins (story event, not battle reward)

House 3:
  - Rewards: iron-armor (Venus/Mars), XP: 80, Gold: 24
  - Ranger joins (story event, not battle reward)

House 4:
  - Rewards: magic-rod (Mercury/Jupiter), XP: 90, Gold: 26

House 5:
  - Rewards: Blaze recruit (unlockUnit: 'blaze'), XP: 100, Gold: 28

House 6:
  - Rewards: steel-helm (Venus), XP: 120, Gold: 32

House 7:
  - Rewards: Breeze Djinn (Jupiter T1), equipment choice, XP: 150, Gold: 40
  - MILESTONE: 3rd Djinn = Summons Unlocked!

House 8:
  - Rewards: Fizz Djinn (Mercury T1), Sentinel recruit (unlockUnit: 'sentinel'), XP: 200, Gold: 55

House 9:
  - Rewards: battle-axe (Mars), XP: 215, Gold: 58

House 10:
  - Rewards: XP: 235, Gold: 62

House 11:
  - Rewards: silver-armor (Venus), Karis recruit (unlockUnit: 'karis'), XP: 255, Gold: 68

House 12:
  - Rewards: Granite Djinn (Venus T2), XP: 275, Gold: 72
  - MILESTONE: First T2 Djinn

House 13:
  - Rewards: equipment choice, XP: 295, Gold: 76

House 14:
  - Rewards: hyper-boots (Jupiter), Tyrell recruit (unlockUnit: 'tyrell'), XP: 320, Gold: 82

House 15:
  - Rewards: Squall Djinn (Jupiter T2), Stormcaller recruit (unlockUnit: 'stormcaller'), equipment choice, XP: 400, Gold: 110
  - MILESTONE: 8 mana/round unlocked!

House 16:
  - Rewards: mythril-blade (Venus), XP: 450, Gold: 120

House 17:
  - Rewards: dragon-scales (Venus), Felix recruit (unlockUnit: 'felix'), XP: 500, Gold: 130
  - MILESTONE: Full roster (10 units)

House 18:
  - Rewards: Bane Djinn (Venus T3), XP: 550, Gold: 140

House 19:
  - Rewards: equipment choice, XP: 600, Gold: 150

House 20:
  - Rewards: Storm Djinn (Jupiter T3), 4 equipment choices, XP: 1500, Gold: 300
  - MILESTONE: Finale!
```

### Implementation Approach
1. **Create Garet enemy** (enemy version of War Mage for VS1)
2. **Update all 20 house encounters** with new rewards
3. **Add unlockUnit fields** for 6 recruitments (Houses 1, 5, 8, 11, 14, 15, 17)
4. **Adjust equipment rewards** to match blueprint
5. **Validate enemy definitions** exist for all encounters

---

## ⏳ Phase 3: Story Join System (PENDING)

### What Needs to Be Done
Implement story-triggered recruitment for Mystic and Ranger (non-battle recruits):

#### Option A: Dialogue-Triggered Joins
```typescript
// In dialogues.ts or storySlice
export const HOUSE_02_POST_DIALOGUE = {
  // ... existing dialogue
  onComplete: () => {
    // Trigger Mystic recruitment
    teamSlice.addUnitToRoster(createUnit(UNIT_DEFINITIONS.mystic, 2, 0));
  }
};
```

#### Option B: Automatic Join After Battle
```typescript
// In RewardsService or rewardsSlice
if (encounterId === 'house-02') {
  // Auto-recruit Mystic after House 2
  const mystic = createUnit(UNIT_DEFINITIONS.mystic, 2, 0);
  addUnitToRoster(mystic);
}
```

**Recommendation:** Option B (simpler, faster to test)

---

## ⏳ Phase 4: Initial Game State (PENDING)

### What Needs to Be Done
Update `App.tsx` or initial state to start with Isaac + Flint only:

#### Current State (4 units)
```typescript
// Creates test battle with 4 units
const team = createTeam({ units: [adept, warMage, mystic, ranger] });
```

#### New State (1 unit)
```typescript
// Start with Isaac (Adept) only
const isaac = createUnit(UNIT_DEFINITIONS.adept, 1, 0);

// Create team with Isaac + Flint Djinn
const initialTeam = createTeam({
  units: [isaac],
  djinnTrackers: {},
  collectedDjinn: ['flint'], // Pre-game story gift
});

// Flint is already "collected" (Set state)
const teamWithFlint = collectDjinn(initialTeam, 'flint');
```

### Files to Modify
- `src/App.tsx` - Update initial team creation
- OR `src/ui/state/teamSlice.ts` - Update default state

---

## ⏳ Phase 5: Dev Mode House Selection (PENDING)

### What Needs to Be Done
Create temporary dev mode menu to access any house for E2E testing:

#### Implementation Options

**Option A: Dev Button in UI**
```typescript
// In App.tsx or DevModePanel component
{import.meta.env.DEV && (
  <div className="dev-mode-panel">
    <h3>Dev Mode: Select House</h3>
    <select onChange={(e) => startHouseEncounter(e.target.value)}>
      <option value="">-- Select House --</option>
      {Array.from({length: 20}, (_, i) => (
        <option key={i+1} value={`house-${String(i+1).padStart(2, '0')}`}>
          House {i+1}
        </option>
      ))}
    </select>
  </div>
)}
```

**Option B: Keyboard Shortcut**
```typescript
// Global keyboard listener
useEffect(() => {
  const handleKeyPress = (e: KeyboardEvent) => {
    if (e.key === 'h' && e.ctrlKey && import.meta.env.DEV) {
      // Show house selection modal
      setShowDevHouseSelector(true);
    }
  };
  window.addEventListener('keydown', handleKeyPress);
  return () => window.removeEventListener('keydown', handleKeyPress);
}, []);
```

**Option C: URL Parameter**
```typescript
// Read from URL: ?house=5
const urlParams = new URLSearchParams(window.location.search);
const startHouse = urlParams.get('house');
if (startHouse && import.meta.env.DEV) {
  startEncounter(`house-${String(startHouse).padStart(2, '0')}`);
}
```

**Recommendation:** Option A + Option C combined (button + URL parameter)

---

## ⏳ Phase 6: E2E Test Scenarios (PENDING)

### What Needs to Be Done
Create E2E tests for key progression milestones:

#### Test Scenarios

**1. Tutorial Flow (House 1)**
```typescript
test('House 1 (VS1): Recruit Garet + Earn Forge Djinn', async ({ page }) => {
  await page.goto('/?house=1'); // Dev mode URL

  // Start with Isaac only
  const roster = await getRosterSize(page);
  expect(roster).toBe(1);

  // Complete House 1 battle
  await completeBattle(page);

  // Verify Garet recruited
  const newRoster = await getRosterSize(page);
  expect(newRoster).toBe(2);

  // Verify Forge Djinn collected
  const djinn = await getCollectedDjinn(page);
  expect(djinn).toContain('forge');
});
```

**2. Story Joins (Houses 2-3)**
```typescript
test('Houses 2-3: Mystic and Ranger join automatically', async ({ page }) => {
  // Complete House 2
  await page.goto('/?house=2');
  await completeBattle(page);
  expect(await getRosterSize(page)).toBe(3); // Isaac + Garet + Mystic

  // Complete House 3
  await page.goto('/?house=3');
  await completeBattle(page);
  expect(await getRosterSize(page)).toBe(4); // + Ranger
});
```

**3. Summons Unlock (House 7)**
```typescript
test('House 7: Summons unlock with 3rd Djinn', async ({ page }) => {
  await page.goto('/?house=7');

  // Verify 2 Djinn already collected (Flint, Forge)
  let djinn = await getCollectedDjinn(page);
  expect(djinn.length).toBe(2);

  // Complete House 7
  await completeBattle(page);

  // Verify 3 Djinn collected (+ Breeze)
  djinn = await getCollectedDjinn(page);
  expect(djinn.length).toBe(3);
  expect(djinn).toContain('breeze');

  // Verify summons available
  const canSummon = await checkSummonsAvailable(page);
  expect(canSummon).toBe(true);
});
```

**4. All Recruits (Houses 1-17)**
```typescript
test('Full Progression: All 10 units recruited by House 17', async ({ page }) => {
  const houses = [1, 2, 3, 5, 8, 11, 14, 15, 17];

  for (const house of houses) {
    await page.goto(`/?house=${house}`);
    await completeBattle(page);
  }

  const finalRoster = await getRosterSize(page);
  expect(finalRoster).toBe(10);
});
```

**5. Balance Testing (XP/Gold)**
```typescript
test('Progression Curve: XP and Gold match blueprint', async ({ page }) => {
  const expectedProgression = [
    { house: 1, xp: 60, gold: 20 },
    { house: 7, xp: 150, gold: 40 },
    { house: 12, xp: 275, gold: 72 },
    { house: 15, xp: 400, gold: 110 },
    { house: 20, xp: 1500, gold: 300 },
  ];

  for (const { house, xp, gold } of expectedProgression) {
    await page.goto(`/?house=${house}`);
    await completeBattle(page);

    const rewards = await getBattleRewards(page);
    expect(rewards.xp).toBe(xp);
    expect(rewards.gold).toBe(gold);
  }
});
```

---

## 📊 Implementation Checklist

### Phase 1: Units ✅
- [x] Add Blaze unit definition
- [x] Add Karis unit definition
- [x] Add Tyrell unit definition
- [x] Add Felix unit definition
- [x] Update UNIT_DEFINITIONS export
- [x] Validate TypeScript compilation
- [x] Commit and push

### Phase 2: Encounters 🔄
- [ ] Create Garet enemy definition
- [ ] Update House 1 (VS1) encounter
- [ ] Update Houses 2-20 rewards
- [ ] Add unlockUnit fields (6 houses)
- [ ] Validate all enemies exist
- [ ] Test data validation
- [ ] Commit and push

### Phase 3: Story Joins ⏳
- [ ] Implement Mystic auto-join (House 2)
- [ ] Implement Ranger auto-join (House 3)
- [ ] Test recruitment flow
- [ ] Commit and push

### Phase 4: Initial State ⏳
- [ ] Update App.tsx initial team
- [ ] Start with Isaac + Flint only
- [ ] Remove War Mage, Mystic, Ranger from start
- [ ] Test game loads correctly
- [ ] Commit and push

### Phase 5: Dev Mode ⏳
- [ ] Add dev mode house selector (UI button)
- [ ] Add URL parameter support (?house=N)
- [ ] Test all 20 houses accessible
- [ ] Commit and push

### Phase 6: E2E Tests ⏳
- [ ] Write House 1 tutorial test
- [ ] Write story join tests
- [ ] Write summons unlock test
- [ ] Write full progression test
- [ ] Write balance testing test
- [ ] Run all tests
- [ ] Commit and push

### Phase 7: Validation ⏳
- [ ] Run `pnpm validate:data`
- [ ] Run `pnpm typecheck`
- [ ] Run `pnpm test` (unit tests)
- [ ] Run `pnpm test:e2e` (E2E tests)
- [ ] Fix any failures
- [ ] Final commit

---

## 🎯 Next Immediate Steps

**Ready to proceed with Phase 2 (Encounters)?**

This involves:
1. Creating Garet enemy definition in `enemies.ts`
2. Completely rewriting all 20 house encounters in `encounters.ts`
3. Validating enemy definitions exist

**Estimated time:** 30-45 minutes
**Files modified:** 2 (enemies.ts, encounters.ts)
**Lines changed:** ~400-500 lines

**Alternative:** We can implement Phases 2-6 in parallel batches for faster iteration.

**Your call!** 🚀
