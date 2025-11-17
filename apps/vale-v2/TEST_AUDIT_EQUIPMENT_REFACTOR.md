# Equipment Refactor Test Audit

**Date:** 2025-01-16  
**Status:** ⚠️ **3 TEST FILES NEED FIXES**

---

## Executive Summary

After the element-based equipment refactor, **3 test files have validity issues** that will cause test failures:

1. ❌ `tests/e2e/save-load.spec.ts` - Uses `allowedUnits` (old schema)
2. ❌ `tests/core/services/starterKit.test.ts` - Uses old API signature
3. ⚠️ `tests/core/models/Equipment.test.ts` - Missing `allowedElements` in test data

**1 test file is correct:**
- ✅ `tests/core/algorithms/equipment.test.ts` - Already updated correctly

---

## Critical Issues

### Issue 1: Save/Load Test Uses Old Schema ❌

**File:** `tests/e2e/save-load.spec.ts`  
**Lines:** 12, 158, 185, 194  
**Severity:** 🔴 **HIGH** - Test will fail schema validation

**Problem:**
```typescript
// Line 12 - Type definition
allowedUnits: string[];  // ❌ Old property

// Lines 158, 185, 194 - Test data
{
  id: 'test-sword',
  allowedUnits: ['adept'],  // ❌ Old property
}
```

**Impact:**
- Equipment objects will fail Zod validation (`EquipmentSchema.safeParse()`)
- Save/load tests will fail when validating equipment
- Save file compatibility tests broken

**Fix Required:**
```typescript
// Change type definition (line 12)
allowedElements: Element[];  // ✅ New property

// Change test data (lines 158, 185, 194)
{
  id: 'test-sword',
  allowedElements: ['Venus'],  // ✅ New property (adept is Venus element)
}
```

---

### Issue 2: Starter Kit Test Uses Old API ❌

**File:** `tests/core/services/starterKit.test.ts`  
**Lines:** 8, 11, 18, 26  
**Severity:** 🔴 **HIGH** - Test will fail at runtime

**Problem:**
```typescript
// Line 8 - Old API signature
purchaseStarterKit('adept', 500);  // ❌ String unit ID

// Line 11 - Old property access
STARTER_KITS.adept  // ❌ No longer exists (now STARTER_KITS.Venus)
```

**Current API:**
```typescript
// New signature requires unit object with element
purchaseStarterKit(
  unit: { id: string; element: Element },
  currentGold: number
)

// New structure
STARTER_KITS: Record<Element, StarterKit>
// Access: STARTER_KITS.Venus (not STARTER_KITS.adept)
```

**Impact:**
- TypeScript compilation errors
- Runtime errors when tests run
- All 4 starter kit tests will fail

**Fix Required:**
```typescript
// Line 8 - Update to new API
const unit = mkUnit({ id: 'adept' }); // Adept is Venus element
const result = purchaseStarterKit(unit, 500);  // ✅ New API

// Line 11 - Update property access
STARTER_KITS.Venus  // ✅ New structure (adept uses Venus kit)
```

**All Tests Need Updates:**
- `purchases starter kit when affordable` - Use `mkUnit()` + `STARTER_KITS.Venus`
- `fails when insufficient gold` - Use `mkUnit()` + `STARTER_KITS.Venus`
- `fails when unit has no kit` - Test with invalid element instead

---

### Issue 3: Equipment Model Test Missing Required Field ⚠️

**File:** `tests/core/models/Equipment.test.ts`  
**Lines:** 18-34  
**Severity:** 🟡 **MEDIUM** - Test will fail schema validation

**Problem:**
```typescript
// Lines 18-34 - Test equipment missing allowedElements
const weapon: Equipment = {
  id: 'test-sword',
  name: 'Test Sword',
  slot: 'weapon',
  tier: 'basic',
  cost: 100,
  statBonus: { atk: 10 },
  // ❌ Missing: allowedElements: ['Venus']
};

const armor: Equipment = {
  id: 'test-armor',
  name: 'Test Armor',
  slot: 'armor',
  tier: 'basic',
  cost: 150,
  statBonus: { def: 8, hp: 20 },
  // ❌ Missing: allowedElements: ['Venus']
};
```

**Impact:**
- Schema validation test (line 62) will fail
- Equipment bonus calculation test (line 44) may work but equipment is invalid

**Fix Required:**
```typescript
const weapon: Equipment = {
  id: 'test-sword',
  name: 'Test Sword',
  slot: 'weapon',
  tier: 'basic',
  cost: 100,
  statBonus: { atk: 10 },
  allowedElements: ['Venus'],  // ✅ Add required field
};

const armor: Equipment = {
  id: 'test-armor',
  name: 'Test Armor',
  slot: 'armor',
  tier: 'basic',
  cost: 150,
  statBonus: { def: 8, hp: 20 },
  allowedElements: ['Venus'],  // ✅ Add required field
};
```

---

## Valid Tests ✅

### `tests/core/algorithms/equipment.test.ts` ✅

**Status:** ✅ **CORRECT** - Already updated for element-based system

**Verified:**
- ✅ Uses `allowedElements: ['Venus']` and `['Mercury']`
- ✅ Tests `canEquipItem()` with element matching
- ✅ Tests `getEquippableItems()` filtering by element
- ✅ All assertions are valid

**No changes needed.**

---

## Test Coverage Analysis

### Equipment Algorithm Tests ✅
- `canEquipItem()` - ✅ Tests element matching
- `getEquippableItems()` - ✅ Tests element filtering
- **Coverage:** Complete for core logic

### Equipment Model Tests ⚠️
- `createEmptyLoadout()` - ✅ Valid (no equipment needed)
- `calculateEquipmentBonuses()` - ⚠️ Needs `allowedElements` fix
- `EquipmentSchema validation` - ⚠️ Needs `allowedElements` fix
- `EquipmentLoadoutSchema validation` - ✅ Valid

### Starter Kit Tests ❌
- `purchaseStarterKit()` - ❌ Needs API update
- `purchaseUnitEquipment()` - ✅ Valid (uses `canEquipItem()`)
- **Coverage:** Incomplete (starter kit tests broken)

### Save/Load Tests ❌
- Equipment serialization - ❌ Uses old schema
- Equipment deserialization - ❌ Uses old schema
- **Coverage:** Broken (will fail validation)

---

## Fix Priority

### Priority 1: Save/Load Test (Critical) 🔴
**Why:** Blocks save/load functionality testing  
**Time:** 5 minutes  
**Impact:** High - Save system validation broken

### Priority 2: Starter Kit Test (Critical) 🔴
**Why:** Blocks starter kit functionality testing  
**Time:** 10 minutes  
**Impact:** High - Shop system validation broken

### Priority 3: Equipment Model Test (Medium) 🟡
**Why:** Schema validation test will fail  
**Time:** 2 minutes  
**Impact:** Medium - Test data invalid but logic may work

---

## Recommended Fixes

### Fix 1: Update Save/Load Test

```typescript
// File: tests/e2e/save-load.spec.ts

// Line 12 - Update type
type SaveConfig = {
  // ... other fields
  equipment: Array<{
    // ... other fields
    allowedElements: Element[];  // ✅ Changed from allowedUnits
  }>;
};

// Lines 158, 185, 194 - Update test data
{
  id: 'test-sword',
  name: 'Test Sword',
  slot: 'weapon',
  tier: 'basic',
  cost: 10,
  statBonus: { atk: 3 },
  allowedElements: ['Venus'],  // ✅ Changed from allowedUnits: ['adept']
}
```

### Fix 2: Update Starter Kit Test

```typescript
// File: tests/core/services/starterKit.test.ts

import { mkUnit } from '@/test/factories';
import { STARTER_KITS } from '../../../src/data/definitions/starterKits';

describe('Starter Kit Service', () => {
  test('purchases starter kit when affordable', () => {
    const unit = mkUnit({ id: 'adept' }); // Adept is Venus element
    const result = purchaseStarterKit(unit, 500);
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.newGold).toBe(500 - STARTER_KITS.Venus.cost);  // ✅ Changed
      expect(result.value.equipment).toHaveLength(5);
      expect(result.value.equipment[0].id).toBe(STARTER_KITS.Venus.equipment.weapon);  // ✅ Changed
    }
  });

  test('fails when insufficient gold', () => {
    const unit = mkUnit({ id: 'adept' });
    const result = purchaseStarterKit(unit, 100);
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error).toContain('Insufficient gold');
    }
  });

  test('fails when unit has invalid element', () => {
    // Test with a unit that has an element not in STARTER_KITS
    // Actually, all elements have kits now, so this test may need rethinking
    // Or test with Neutral element if that's not supported
    const unit = mkUnit({ element: 'Neutral' }); // If Neutral kit exists, this will pass
    const result = purchaseStarterKit(unit, 500);
    // This test may need to be removed or changed
  });
});
```

### Fix 3: Update Equipment Model Test

```typescript
// File: tests/core/models/Equipment.test.ts

// Lines 18-34 - Add allowedElements
const weapon: Equipment = {
  id: 'test-sword',
  name: 'Test Sword',
  slot: 'weapon',
  tier: 'basic',
  cost: 100,
  statBonus: { atk: 10 },
  allowedElements: ['Venus'],  // ✅ Add required field
};

const armor: Equipment = {
  id: 'test-armor',
  name: 'Test Armor',
  slot: 'armor',
  tier: 'basic',
  cost: 150,
  statBonus: { def: 8, hp: 20 },
  allowedElements: ['Venus'],  // ✅ Add required field
};
```

---

## Validation Checklist

After fixes, verify:

- [ ] `pnpm test -- tests/core/algorithms/equipment.test.ts` - Should pass
- [ ] `pnpm test -- tests/core/models/Equipment.test.ts` - Should pass
- [ ] `pnpm test -- tests/core/services/starterKit.test.ts` - Should pass
- [ ] `pnpm test:e2e -- tests/e2e/save-load.spec.ts` - Should pass
- [ ] `pnpm validate:data` - Should pass (equipment validation)
- [ ] `pnpm typecheck` - Should pass (no type errors)

---

## Summary

**Test Files Status:**
- ✅ 1 file correct (`equipment.test.ts`)
- ❌ 2 files broken (`save-load.spec.ts`, `starterKit.test.ts`)
- ⚠️ 1 file needs minor fix (`Equipment.test.ts`)

**Estimated Fix Time:** 15-20 minutes

**Impact:** Medium - Core logic tests pass, but integration tests broken

**Recommendation:** Fix all 3 files before running full test suite to avoid false failures.

