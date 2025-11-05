# ⚖️ ARCHITECT ROLE - BALANCE FIXES

**Mission:** Fix 5 balance issues revealed by story-driven tests

**Time Estimate:** 2-3 hours

---

## 🎯 YOUR ROLE

You are the **ARCHITECT** - responsible for game balance and design.

The Tester's story-driven tests revealed **5 CRITICAL balance problems** that make the game less fun. Your job is to fix them.

---

## 🚨 BALANCE PROBLEMS TO FIX

### **PROBLEM 1: Power Gap Too Extreme** 🔴 CRITICAL

**Issue:**
```
Garet deals 62 damage
Kraden deals 16 damage
Ratio: 3.875× (should be < 3×)
```

**Why It's Bad:**
- Garet becomes mandatory meta
- Kraden is useless
- No reason to use weak units

**Fix:**
```typescript
// File: src/data/unitDefinitions.ts

// BEFORE:
export const GARET = {
  stats: {
    hp: 180,
    pp: 42,
    atk: 34,  // ← TOO HIGH
    def: 12,
    mag: 14,
    spd: 14,
  }
};

export const KRADEN = {
  stats: {
    hp: 110,
    pp: 70,
    atk: 10,  // ← TOO LOW
    def: 9,
    mag: 36,
    spd: 12,
  }
};

// AFTER:
export const GARET = {
  stats: {
    hp: 180,
    pp: 42,
    atk: 30,  // ← Reduced from 34 to 30 (-4 ATK)
    def: 12,
    mag: 14,
    spd: 14,
  }
};

export const KRADEN = {
  stats: {
    hp: 110,
    pp: 70,
    atk: 16,  // ← Increased from 10 to 16 (+6 ATK)
    def: 9,
    mag: 36,
    spd: 12,
  }
};
```

**Verify:**
- New damage gap: ~2.5× (within 3× limit)
- Kraden still weaker but usable

---

### **PROBLEM 2: Jenna's Glass Cannon Not "Cannony" Enough** 🟠 HIGH

**Issue:**
```
Jenna damage: 1.39× compared to Piers
Expected: 1.5×+ (glass cannon = high damage)
```

**Why It's Bad:**
- Jenna's archetype (glass cannon) doesn't deliver
- High risk, low reward = unfun

**Fix:**
```typescript
// File: src/data/unitDefinitions.ts

// BEFORE:
export const JENNA = {
  stats: {
    hp: 123,
    pp: 56,
    atk: 18,
    def: 9,
    mag: 40,  // ← Not high enough
    spd: 20,
  }
};

// AFTER:
export const JENNA = {
  stats: {
    hp: 123,
    pp: 56,
    atk: 18,
    def: 9,
    mag: 46,  // ← Increased from 40 to 46 (+6 MAG)
    spd: 20,
  }
};
```

**Verify:**
- New damage ratio: ~1.6× vs Piers
- Jenna is now highest MAG in game

---

### **PROBLEM 3: Tank Deals More Damage Than Glass Cannon** 🟠 HIGH

**Issue:**
```
Piers (tank) physical damage: 34
Jenna (glass cannon) physical damage: 18
Result: Tank outdamages glass cannon!
```

**Why It's Bad:**
- Archetypes are inverted
- Piers becomes "better Jenna" (more damage + more defense)

**Fix:**
```typescript
// File: src/data/unitDefinitions.ts

// BEFORE:
export const PIERS = {
  stats: {
    hp: 212,
    pp: 42,
    atk: 24,  // ← Too high for tank
    def: 28,
    mag: 24,  // ← Too high for tank
    spd: 8,
  }
};

// AFTER:
export const PIERS = {
  stats: {
    hp: 212,  // Keep high (tank identity)
    pp: 42,
    atk: 20,  // ← Reduced from 24 to 20 (-4 ATK)
    def: 28,  // Keep high (tank identity)
    mag: 18,  // ← Reduced from 24 to 18 (-6 MAG)
    spd: 8,   // Keep low (tank identity)
  }
};
```

**Verify:**
- Piers still tankiest (highest HP/DEF)
- Jenna now outdamages Piers
- Tank trades damage for survivability

---

### **PROBLEM 4: Units Too Similar (No Identity)** 🟡 MEDIUM

**Issue:**
```
Isaac vs Garet: Only 2 stats differ by >10%
Result: Characters feel the same
```

**Why It's Bad:**
- Boring
- No strategic choices
- All units feel generic

**Fix:**
```typescript
// File: src/data/unitDefinitions.ts

// Strategy: Emphasize archetypes more

export const ISAAC = {
  stats: {
    hp: 180,   // BALANCED
    pp: 42,
    atk: 27,   // BALANCED
    def: 18,   // BALANCED
    mag: 20,   // BALANCED
    spd: 16,   // BALANCED
  }
};

export const GARET = {
  stats: {
    hp: 180,
    pp: 42,
    atk: 30,   // ← HIGH (glass cannon)
    def: 12,   // ← LOW (glass cannon) - reduce from 14
    mag: 14,
    spd: 14,
  }
};

export const IVAN = {
  stats: {
    hp: 134,
    pp: 56,
    atk: 12,   // ← LOW (mage)
    def: 10,   // ← LOW (mage)
    mag: 32,   // ← HIGH (mage)
    spd: 23,   // ← HIGH (speed mage)
  }
};

export const MIA = {
  stats: {
    hp: 150,
    pp: 56,
    atk: 14,   // ← LOW (healer)
    def: 16,   // ← MEDIUM (healer)
    mag: 28,   // ← HIGH (healer)
    spd: 18,
  }
};
```

**Verify:**
- Each unit now has 3+ distinctive stats
- Clear archetypes:
  - Isaac: Balanced
  - Garet: Glass cannon (high ATK, low DEF)
  - Ivan: Speed mage (high MAG/SPD, low HP)
  - Mia: Healer (high MAG, moderate defense)

---

### **PROBLEM 5: Ability Unlock Progression Broken** 🟡 MEDIUM

**Issue:**
```
Level 1 Isaac: 5 abilities unlocked
Level 2 Isaac: Still 5 abilities
Level 3 Isaac: Still 5 abilities

Expected: 1 ability per level (gradual unlock)
```

**Why It's Bad:**
- Leveling doesn't feel rewarding
- No sense of progression

**Fix:**
```typescript
// File: src/data/abilities.ts

// BEFORE: All abilities unlocked at level 1
export const SLASH: Ability = {
  id: 'slash',
  name: 'Slash',
  unlockLevel: 1,  // ← Everyone gets all abilities at start
  // ...
};

export const QUAKE: Ability = {
  id: 'quake',
  name: 'Quake',
  unlockLevel: 1,  // ← No progression
  // ...
};

// AFTER: Progressive unlock
export const SLASH: Ability = {
  id: 'slash',
  name: 'Slash',
  unlockLevel: 1,  // Level 1: Basic attack
  // ...
};

export const QUAKE: Ability = {
  id: 'quake',
  name: 'Quake',
  unlockLevel: 2,  // Level 2: First Psynergy
  // ...
};

export const RAGNAROK: Ability = {
  id: 'ragnarok',
  name: 'Ragnarok',
  unlockLevel: 3,  // Level 3: Stronger Psynergy
  // ...
};

export const ODYSSEY: Ability = {
  id: 'odyssey',
  name: 'Odyssey',
  unlockLevel: 4,  // Level 4: Advanced ability
  // ...
};

export const JUDGMENT: Ability = {
  id: 'judgment',
  name: 'Judgment',
  unlockLevel: 5,  // Level 5: Ultimate ability
  // ...
};
```

**Unlock Progression Table:**

| Level | Isaac Abilities | Garet Abilities | Ivan Abilities | Mia Abilities |
|-------|----------------|-----------------|----------------|---------------|
| 1     | Slash          | Slash           | Slash          | Slash         |
| 2     | +Quake         | +Inferno        | +Gust          | +Ply          |
| 3     | +Ragnarok      | +Eruption       | +Gale          | +Wish         |
| 4     | +Odyssey       | +Flare Wall     | +Tornado       | +Glacial Blessing |
| 5     | +Judgment      | +Apocalypse     | +Tempest       | +Pure Wish    |

**Implementation:**

```typescript
// For each unit, assign abilities to levels 1-5
// Ensure progression: Basic → Intermediate → Ultimate

// Isaac (Venus - Earth)
SLASH.unlockLevel = 1;
QUAKE.unlockLevel = 2;
RAGNAROK.unlockLevel = 3;
ODYSSEY.unlockLevel = 4;
JUDGMENT.unlockLevel = 5;

// Garet (Mars - Fire)
SLASH.unlockLevel = 1;
INFERNO.unlockLevel = 2;
ERUPTION.unlockLevel = 3;
FLARE_WALL.unlockLevel = 4;
APOCALYPSE.unlockLevel = 5;

// Ivan (Jupiter - Wind)
SLASH.unlockLevel = 1;
GUST.unlockLevel = 2;
GALE.unlockLevel = 3;
TORNADO.unlockLevel = 4;
TEMPEST.unlockLevel = 5;

// Mia (Mercury - Water)
SLASH.unlockLevel = 1;
PLY.unlockLevel = 2;
WISH.unlockLevel = 3;
GLACIAL_BLESSING.unlockLevel = 4;
PURE_WISH.unlockLevel = 5;
```

---

## ✅ ACCEPTANCE CRITERIA

### After All Fixes:

**Test Results:**
```bash
npm test
```

**Expected Passing Tests:**
- ✅ GameBalance.test.ts - "No unit 3× stronger" → PASS
- ✅ GameBalance.test.ts - "Jenna is glass cannon" → PASS
- ✅ GameBalance.test.ts - "Piers is tank" → PASS
- ✅ GameBalance.test.ts - "Units have identity" → PASS
- ✅ GameBalance.test.ts - "Level progression meaningful" → PASS

**Test Count:**
- Before: 409/437 passing (93.6%)
- After: ~425/437 passing (97%+)

---

## 📋 IMPLEMENTATION CHECKLIST

- [ ] Open `src/data/unitDefinitions.ts`
- [ ] Fix Garet stats (ATK: 34 → 30)
- [ ] Fix Kraden stats (ATK: 10 → 16)
- [ ] Fix Jenna stats (MAG: 40 → 46)
- [ ] Fix Piers stats (ATK: 24 → 20, MAG: 24 → 18)
- [ ] Emphasize archetype differences (Garet DEF: 14 → 12)
- [ ] Open `src/data/abilities.ts`
- [ ] Set progressive unlock levels (1 ability per level)
- [ ] Run `npm test`
- [ ] Verify 5 GameBalance tests now pass
- [ ] Create completion report

---

## 🎯 COMPLETION REPORT TEMPLATE

```markdown
## ✅ ARCHITECT - BALANCE FIXES COMPLETE

### Changes Made:

**Unit Stat Changes:**
1. Garet: ATK 34 → 30 (reduce power gap)
2. Kraden: ATK 10 → 16 (boost weak unit)
3. Jenna: MAG 40 → 46 (glass cannon boost)
4. Piers: ATK 24 → 20, MAG 24 → 18 (tank adjustment)
5. Garet: DEF 14 → 12 (emphasize glass cannon)

**Ability Unlock Changes:**
- All abilities now unlock progressively (1 per level)
- Level 1: Basic attack
- Level 2-4: Intermediate abilities
- Level 5: Ultimate ability

### Test Results:

Before: 409/437 passing (93.6%)
After: XXX/437 passing (XX.X%)

**Balance Tests:**
- ✅ Power gap test: PASS (ratio now 2.5×)
- ✅ Jenna glass cannon: PASS (damage 1.6×)
- ✅ Piers tank: PASS (lower damage, high survivability)
- ✅ Unit identity: PASS (3+ stat differences)
- ✅ Level progression: PASS (1 ability per level)

### Files Modified:
- src/data/unitDefinitions.ts
- src/data/abilities.ts

**Status:** ✅ All balance issues fixed
**Next:** Ready for story-driven test implementation
```

---

## 🚀 READY TO EXECUTE

**Time Estimate:** 2-3 hours

**Files to Modify:**
1. `src/data/unitDefinitions.ts` (stat changes)
2. `src/data/abilities.ts` (unlock progression)

**Success Metric:**
- 5 GameBalance.test.ts failures → 5 passes
- Pass rate: 93.6% → 97%+

**GO!** 🎯
