# E2E Test Debugging Plan - Iterate Until Fixed

## Mission
Convert fake smoke test into real integration test that validates actual gameplay.

## Current Problems (In Priority Order)

### 1. **processVictory() Clears Roster** (CRITICAL)
**Location:** `src/core/services/RewardsService.ts` or wherever processVictory is
**Symptom:** After victory, roster size = 0
**Need to:** Find and fix why roster gets wiped

### 2. **Fake Battle Simulation** (HIGH)
**Location:** Test lines 78-100
**Current:** Manually sets enemies to 0 HP
**Need to:** Real battle actions (click attack buttons, select abilities)

### 3. **Manual State Injection** (MEDIUM)
**Location:** Test lines 148-195
**Current:** Manually grants War Mage and Forge
**Need to:** Let reward system do this naturally

---

## Iteration 1: Find processVictory Bug

**Step 1.1:** Locate processVictory function
```bash
cd root
grep -rn "processVictory" src/ --include="*.ts" --include="*.tsx"
```

**Step 1.2:** Read the code
- Check what it does with roster
- Check what it does with gold/XP
- Find the bug

**Step 1.3:** Fix the bug
- Preserve roster through victory flow
- Ensure gold accumulates
- Ensure XP applies to units

**Step 1.4:** Test fix
```bash
# Run unit tests
pnpm test tests/core/services/RewardsService.test.ts

# Or manual test in browser
# 1. Win a battle
# 2. Check roster still has units
# 3. Check gold increased
```

**Success Criteria:** Roster size > 0 after processVictory()

---

## Iteration 2: Real Battle Actions

**Step 2.1:** Study battle UI in browser
- What buttons exist? (Attack, Ability, Defend?)
- What's the selector? (data-testid, role, text?)
- How does turn order work?

**Step 2.2:** Replace fake victory (lines 78-100) with:
```typescript
// Perform actual battle actions
const attackButton = page.getByRole('button', { name: /attack/i });
await attackButton.click();
await page.waitForTimeout(500);

// Wait for enemy turn
await page.waitForTimeout(1000);

// Keep attacking until victory
let battleOver = false;
let attempts = 0;
while (!battleOver && attempts < 20) {
  const state = await getGameState(page);
  battleOver = state?.battle?.battleOver ?? false;
  
  if (!battleOver) {
    const attackBtn = page.getByRole('button', { name: /attack/i });
    const isVisible = await attackBtn.isVisible().catch(() => false);
    if (isVisible) {
      await attackBtn.click();
      await page.waitForTimeout(1000);
    }
  }
  attempts++;
}
```

**Step 2.3:** Test in isolation
- Can we complete one battle with real clicks?
- Does victory trigger naturally?

**Success Criteria:** Battle ends with victory without store manipulation

---

## Iteration 3: Natural Reward Distribution

**Step 3.1:** Remove manual unit injection (lines 148-195)

**Step 3.2:** Update encounter definitions
```typescript
// Check src/data/definitions/encounters.ts
// Ensure house-01 or house-02 gives:
// - War Mage unit reward
// - Forge Djinn reward
```

**Step 3.3:** Let reward system work
- Victory → Rewards screen
- Claim rewards
- Verify roster updated naturally

**Success Criteria:** War Mage and Forge appear without manual injection

---

## Iteration 4: Real Assertions

**Step 4.1:** Add meaningful checks
```typescript
// After second battle
const finalState = await page.evaluate(() => {
  const store = (window as any).__VALE_STORE__;
  const state = store.getState();
  return {
    rosterSize: state.roster?.length ?? 0,
    gold: state.gold ?? 0,
    isaacLevel: state.roster?.[0]?.level ?? 1,
    isaacXp: state.roster?.[0]?.xp ?? 0,
  };
});

// REAL assertions (not relaxed)
expect(finalState.rosterSize).toBeGreaterThan(1); // At least Isaac + War Mage
expect(finalState.gold).toBeGreaterThan(0); // Should have earned gold
expect(finalState.isaacXp).toBeGreaterThan(0); // Isaac should have XP
```

**Step 4.2:** Remove cop-out comment
```typescript
// DELETE THIS:
// Note: roster/gold/XP may be 0 due to test simulation limitations
```

**Success Criteria:** Test fails if data is wrong (not passes with zeros)

---

## Iteration 5: Djinn Equipment Flow

**Step 5.1:** Real party management interaction
- Click actual UI buttons
- Navigate to War Mage
- Click Forge Djinn slot
- Select Forge from list

**Step 5.2:** Verify Djinn equipped naturally
- No store.setState() manipulation
- Use actual UI interactions

**Success Criteria:** Djinn equips through UI, not code injection

---

## Debugging Tools

### Check State at Any Point
```typescript
const debug = await page.evaluate(() => {
  const store = (window as any).__VALE_STORE__;
  return {
    mode: store.getState().mode,
    rosterSize: store.getState().roster?.length,
    teamSize: store.getState().team?.units?.length,
    gold: store.getState().gold,
    battle: store.getState().battle ? 'active' : 'null',
  };
});
console.log('DEBUG STATE:', debug);
```

### Take Screenshot When Stuck
```typescript
await page.screenshot({ path: '/tmp/e2e-debug.png' });
```

### Log Battle State
```typescript
const battleInfo = await page.evaluate(() => {
  const store = (window as any).__VALE_STORE__;
  const battle = store.getState().battle;
  return {
    playerUnits: battle?.playerUnits?.length,
    enemies: battle?.enemies?.map((e: any) => ({
      name: e.name,
      hp: e.currentHp,
    })),
    phase: battle?.phase,
    turnNumber: battle?.turnNumber,
  };
});
console.log('BATTLE:', battleInfo);
```

---

## Expected Timeline

- **Iteration 1:** 15 min (find + fix processVictory bug)
- **Iteration 2:** 10 min (real battle actions)
- **Iteration 3:** 10 min (natural rewards)
- **Iteration 4:** 5 min (real assertions)
- **Iteration 5:** 10 min (Djinn UI flow)

**Total:** ~50 minutes (but we iterate until it works)

---

## Success Definition

**Test passes AND:**
- ✅ No store manipulation (no setState, no manual injection)
- ✅ Real button clicks (attack, confirm, claim)
- ✅ Real assertions (roster > 1, gold > 0, XP > 0)
- ✅ Validates actual gameplay loop
- ✅ Would catch real bugs

**NOT success:**
- ❌ Test passes but data is zeros
- ❌ Test uses store manipulation
- ❌ Test has relaxed assertions

---

## First Step: START HERE

```bash
# Find processVictory
cd root
grep -rn "processVictory" src/ --include="*.ts" --include="*.tsx"
```

Let's see what we're dealing with.
