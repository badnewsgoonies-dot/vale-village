# 💻 CODER ROLE - BUG FIXES (EDGE CASES)

**Mission:** Fix remaining edge case bugs revealed by testing

**Time Estimate:** 2-3 hours

---

## 🎯 YOUR ROLE

You are the **CODER** - responsible for implementing bug fixes.

The testing revealed several edge case bugs that need fixing. These are production bugs that affect gameplay.

---

## 🐛 BUGS TO FIX

### **BUG #1: Healing Abilities Execute on Dead Units** 🔴 CRITICAL

**Test:** `tests/critical/AbilityValidation.test.ts`

**Issue:**
```typescript
test('❌ EDGE: Non-revival healing on dead unit', () => {
  const isaac = new Unit(ISAAC, 5);
  const mia = new Unit(MIA, 5);

  isaac.currentHp = 0; // Dead
  isaac.isKO = true;

  // Try to heal dead unit (should fail!)
  const result = executeAbility(mia, PLY, [isaac]);

  expect(result.healing).toBe(0);  // ← FAILS (returns positive number)
});
```

**Current Behavior:**
- PLY heals dead units (broken!)
- Dead units come back to life without revival abilities

**Expected Behavior:**
- Only revival abilities can heal dead units
- Regular healing should return 0 if target is dead

**Fix:**

```typescript
// File: src/types/Battle.ts

// FIND THIS FUNCTION:
function calculateHealAmount(
  caster: Unit,
  target: Unit,
  ability: Ability
): number {
  // ... existing code ...
}

// ADD THIS CHECK AT THE START:
function calculateHealAmount(
  caster: Unit,
  target: Unit,
  ability: Ability
): number {
  // ✅ FIX: Dead units can't be healed (only revived)
  if (target.isKO && ability.effect !== 'revive') {
    return 0;
  }

  // ... rest of existing code ...
}
```

**Verification:**
```bash
npm test -- AbilityValidation.test.ts
```

Expected: "Non-revival healing on dead unit" → PASS

---

### **BUG #2: Buff Duration 0 Persists Forever** 🟠 HIGH

**Test:** `tests/critical/AbilityValidation.test.ts`

**Issue:**
```typescript
test('❌ EDGE: Buff with 0 duration (persists forever?)', () => {
  const isaac = new Unit(ISAAC, 5);

  // Apply buff with 0 duration
  executeAbility(isaac, {
    ...BLESSING,
    duration: 0  // ← Should expire immediately!
  }, [isaac]);

  // Advance 10 turns
  for (let i = 0; i < 10; i++) {
    isaac.advanceTurn();
  }

  // Buff should be gone
  expect(isaac.statusEffects.length).toBe(0);  // ← FAILS (buff still active)
});
```

**Current Behavior:**
- Buffs with duration 0 never expire (exploit!)
- Infinite buffs = game-breaking

**Expected Behavior:**
- Duration 0 should expire immediately (or not apply)

**Fix:**

```typescript
// File: src/types/Unit.ts

// FIND THIS FUNCTION:
applyStatusEffect(effect: StatusEffect): void {
  this.statusEffects.push(effect);
}

// CHANGE TO:
applyStatusEffect(effect: StatusEffect): void {
  // ✅ FIX: Don't apply effects with 0 or negative duration
  if (effect.duration <= 0) {
    return; // Don't add to statusEffects array
  }

  this.statusEffects.push(effect);
}

// ALSO FIND:
advanceTurn(): void {
  // Update status effects
  this.statusEffects = this.statusEffects.map(effect => ({
    ...effect,
    duration: effect.duration - 1
  }));

  // Remove expired effects
  this.statusEffects = this.statusEffects.filter(effect => effect.duration > 0);
}

// VERIFY IT FILTERS CORRECTLY (should already work, but double-check)
```

**Verification:**
```bash
npm test -- AbilityValidation.test.ts
```

Expected: "Buff with 0 duration" → PASS

---

### **BUG #3: AOE Damage Variance Too High** 🟡 MEDIUM

**Test:** `tests/verification/SpecExamples.test.ts`

**Issue:**
```typescript
test('📋 Quake deals FULL damage to EACH enemy (not split)', () => {
  const isaac = new Unit(ISAAC, 5);
  const enemy1 = new Unit(KYLE, 5);
  const enemy2 = new Unit(KYLE, 5);
  const enemy3 = new Unit(KYLE, 5);

  const result = executeAbility(isaac, QUAKE, [enemy1, enemy2, enemy3]);

  const enemy1Damage = result.damageDealt[0];
  const enemy2Damage = result.damageDealt[1];
  const enemy3Damage = result.damageDealt[2];

  // All enemies should take SIMILAR damage (within ±20%)
  expect(Math.abs(enemy1Damage - enemy2Damage) / enemy1Damage).toBeLessThan(0.2);
  // ← FAILS (0.214 = 21.4% variance)
});
```

**Current Behavior:**
- AOE damage variance is too high (21%+)
- RNG multiplier (0.9-1.1) applied separately to each target
- Results in wildly different damage per enemy

**Expected Behavior:**
- Variance should be ±20% max
- RNG multiplier should be consistent per cast (not per target)

**Root Cause:**
```typescript
// Current (BROKEN):
for (const target of targets) {
  const multiplier = getRandomMultiplier();  // ← DIFFERENT for each target
  const damage = baseDamage * multiplier;
  // ...
}

// Expected (FIXED):
const multiplier = getRandomMultiplier();  // ← SAME for all targets
for (const target of targets) {
  const damage = baseDamage * multiplier;
  // ...
}
```

**Fix:**

```typescript
// File: src/types/Battle.ts

// FIND THIS FUNCTION:
export function executeAbility(
  caster: Unit,
  ability: Ability,
  targets: Unit[]
): AbilityResult {
  // ... existing code ...

  if (ability.targetType === 'all-enemies') {
    // ❌ CURRENT (BROKEN):
    for (const target of targets) {
      const multiplier = getRandomMultiplier();  // Different each time
      // ...
    }
  }
}

// CHANGE TO:
export function executeAbility(
  caster: Unit,
  ability: Ability,
  targets: Unit[]
): AbilityResult {
  // ... existing code ...

  if (ability.targetType === 'all-enemies') {
    // ✅ FIX: Calculate multiplier ONCE for all targets
    const multiplier = getRandomMultiplier();

    for (const target of targets) {
      // Use same multiplier for all
      const damage = calculateDamage(caster, target, ability, multiplier);
      // ...
    }
  }
}
```

**Verification:**
```bash
npm test -- SpecExamples.test.ts
```

Expected: "Quake deals FULL damage" → PASS

---

### **BUG #4: Valid Ability Types Failing** 🟠 HIGH

**Test:** `tests/critical/AbilityValidation.test.ts`

**Issue:**
```typescript
test('✅ Valid ability types execute correctly', () => {
  const isaac = new Unit(ISAAC, 5);
  const enemy = new Unit(KYLE, 5);

  const validAbilities = [
    { ability: SLASH, expectedEffect: 'physical' },
    { ability: QUAKE, expectedEffect: 'psynergy' },
    { ability: PLY, expectedEffect: 'heal' },
  ];

  for (const { ability, expectedEffect } of validAbilities) {
    const result = executeAbility(isaac, ability, [enemy]);

    if (expectedEffect === 'physical' || expectedEffect === 'psynergy') {
      expect(result.damageDealt).toBeGreaterThan(0);  // ← FAILS (returns 0)
    }
  }
});
```

**Current Behavior:**
- Valid abilities return 0 damage
- Abilities not executing properly

**Root Cause:**
Likely missing implementation in `executeAbility` for certain ability types.

**Fix:**

```typescript
// File: src/types/Battle.ts

export function executeAbility(
  caster: Unit,
  ability: Ability,
  targets: Unit[]
): AbilityResult {
  const result: AbilityResult = {
    success: false,
    damageDealt: [],
    healing: 0,
    statusApplied: [],
  };

  // ✅ FIX: Handle all ability types
  switch (ability.effect) {
    case 'physical':
    case 'psynergy':
      for (const target of targets) {
        const damage = ability.effect === 'physical'
          ? calculatePhysicalDamage(caster, target, ability)
          : calculatePsynergyDamage(caster, target, ability);

        target.takeDamage(damage);
        result.damageDealt.push(damage);
      }
      result.success = true;
      break;

    case 'heal':
      for (const target of targets) {
        const healing = calculateHealAmount(caster, target, ability);
        target.heal(healing);
        result.healing += healing;
      }
      result.success = true;
      break;

    case 'buff':
    case 'debuff':
      // ... existing buff/debuff code ...
      result.success = true;
      break;

    default:
      console.warn(`Unhandled ability effect: ${ability.effect}`);
      result.success = false;
  }

  return result;
}
```

**Verification:**
```bash
npm test -- AbilityValidation.test.ts
```

Expected: "Valid ability types execute correctly" → PASS

---

### **BUG #5: Negative PP Cost Not Validated** 🟡 MEDIUM

**Test:** `tests/critical/AbilityValidation.test.ts`

**Issue:**
```typescript
test('❌ BUG: Ability with negative PP cost', () => {
  const isaac = new Unit(ISAAC, 5);
  isaac.currentPp = 50;

  const exploitAbility = {
    ...SLASH,
    ppCost: -10  // ← EXPLOIT: Restores PP instead of costing!
  };

  executeAbility(isaac, exploitAbility, [enemy]);

  // Should not GAIN PP from using abilities
  expect(isaac.currentPp).toBeLessThanOrEqual(50);  // ← FAILS (PP increased!)
});
```

**Current Behavior:**
- Negative PP costs restore PP (exploit!)
- Can create infinite PP abilities

**Expected Behavior:**
- Negative PP costs should be clamped to 0
- Or reject ability execution

**Fix:**

```typescript
// File: src/types/Battle.ts

export function executeAbility(
  caster: Unit,
  ability: Ability,
  targets: Unit[]
): AbilityResult {
  // ✅ FIX: Validate PP cost at start
  const ppCost = Math.max(0, ability.ppCost);  // Clamp to 0 minimum

  // Check if caster has enough PP
  if (caster.currentPp < ppCost) {
    return {
      success: false,
      damageDealt: [],
      healing: 0,
      statusApplied: [],
    };
  }

  // Deduct PP
  caster.currentPp -= ppCost;

  // ... rest of execution ...
}
```

**Verification:**
```bash
npm test -- AbilityValidation.test.ts
```

Expected: "Ability with negative PP cost" → PASS

---

## ✅ ACCEPTANCE CRITERIA

### After All Fixes:

**Test Results:**
```bash
npm test
```

**Expected Passing Tests:**
- ✅ AbilityValidation.test.ts - "Non-revival healing on dead unit" → PASS
- ✅ AbilityValidation.test.ts - "Buff with 0 duration" → PASS
- ✅ AbilityValidation.test.ts - "Ability with negative PP cost" → PASS
- ✅ AbilityValidation.test.ts - "Valid ability types execute correctly" → PASS
- ✅ SpecExamples.test.ts - "Quake deals FULL damage" → PASS

**Test Count:**
- Before: 409/437 passing (93.6%)
- After: ~420/437 passing (96%+)

---

## 📋 IMPLEMENTATION CHECKLIST

- [ ] Open `src/types/Battle.ts`
- [ ] Fix Bug #1: Dead unit healing (add isKO check)
- [ ] Fix Bug #2: AOE damage variance (single multiplier per cast)
- [ ] Fix Bug #4: Valid ability type execution
- [ ] Fix Bug #5: Negative PP cost validation
- [ ] Open `src/types/Unit.ts`
- [ ] Fix Bug #2: Buff duration 0 (reject in applyStatusEffect)
- [ ] Run `npm test`
- [ ] Verify 5+ tests now pass
- [ ] Create completion report

---

## 🎯 COMPLETION REPORT TEMPLATE

```markdown
## ✅ CODER - BUG FIXES COMPLETE

### Bugs Fixed:

1. **Dead Unit Healing** (CRITICAL)
   - File: src/types/Battle.ts
   - Fix: Added `isKO` check in `calculateHealAmount`
   - Test: AbilityValidation.test.ts → PASS

2. **Buff Duration 0** (HIGH)
   - File: src/types/Unit.ts
   - Fix: Reject buffs with duration ≤ 0 in `applyStatusEffect`
   - Test: AbilityValidation.test.ts → PASS

3. **AOE Damage Variance** (MEDIUM)
   - File: src/types/Battle.ts
   - Fix: Calculate RNG multiplier once per cast, not per target
   - Test: SpecExamples.test.ts → PASS

4. **Valid Ability Execution** (HIGH)
   - File: src/types/Battle.ts
   - Fix: Implemented missing ability type handlers
   - Test: AbilityValidation.test.ts → PASS

5. **Negative PP Cost** (MEDIUM)
   - File: src/types/Battle.ts
   - Fix: Clamp PP cost to 0 minimum
   - Test: AbilityValidation.test.ts → PASS

### Test Results:

Before: 409/437 passing (93.6%)
After: XXX/437 passing (XX.X%)

**Tests Fixed:**
- ✅ 5 AbilityValidation tests: PASS
- ✅ 1 SpecExamples test: PASS

### Files Modified:
- src/types/Battle.ts (4 bug fixes)
- src/types/Unit.ts (1 bug fix)

**Status:** ✅ All edge case bugs fixed
**Next:** Ready for final testing sprint
```

---

## 🚀 READY TO EXECUTE

**Time Estimate:** 2-3 hours

**Files to Modify:**
1. `src/types/Battle.ts` (4 fixes)
2. `src/types/Unit.ts` (1 fix)

**Success Metric:**
- 5+ AbilityValidation failures → passes
- Pass rate: 93.6% → 96%+

**GO!** 💻
