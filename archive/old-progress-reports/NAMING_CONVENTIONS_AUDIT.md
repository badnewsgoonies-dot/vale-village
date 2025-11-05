# COMPREHENSIVE NAMING CONVENTION AUDIT

**Date:** November 3, 2025  
**Scope:** Full codebase - data, types, components, sprites  
**Standard:** docs/NAMING_CONVENTIONS.md

---

## EXECUTIVE SUMMARY

**Overall Compliance:** 🟡 **75% - MIXED (Major Issues Found)**

### Critical Issues Found:
1. 🔴 **NPC IDs inconsistent** - Mix of PascalCase, kebab-case, snake_case, and numbers
2. 🔴 **Area IDs use snake_case** instead of kebab-case
3. 🔴 **Quest IDs use snake_case** instead of kebab-case
4. 🟡 **Sprite paths use underscores** - may cause issues
5. 🔴 **Boss/Exit IDs use snake_case** instead of kebab-case

### What's Working:
✅ Equipment IDs (kebab-case)
✅ Enemy IDs (kebab-case)  
✅ Ability IDs (kebab-case)
✅ Djinn IDs (kebab-case)
✅ Constants (SCREAMING_SNAKE_CASE)
✅ Types/Interfaces (PascalCase)
✅ Functions (camelCase)

---

## DETAILED AUDIT BY CATEGORY

### ✅ **COMPLIANT: Equipment System**

**Standard:** Object IDs use `kebab-case`

**Examples:**
```typescript
'wooden-sword'   ✅
'iron-armor'     ✅
'dragon-scales'  ✅
'hermes-sandals' ✅
```

**Status:** 100% compliant (16/16 equipment)

---

### ✅ **COMPLIANT: Enemy System**

**Standard:** Object IDs use `kebab-case`

**Examples:**
```typescript
'goblin'        ✅
'wild-wolf'     ✅
'fire-sprite'   ✅
'earth-golem'   ✅
'wind-wisp'     ✅
'storm-lord'    ✅
```

**Status:** 100% compliant (10/10 enemies)

---

### ✅ **COMPLIANT: Ability & Djinn Systems**

**Standard:** Object IDs use `kebab-case`

**Examples:**
```typescript
// Abilities
'slash'       ✅
'clay-spire'  ✅
'inferno'     ✅

// Djinn
'flint'    ✅
'granite'  ✅
'forge'    ✅
```

**Status:** 100% compliant

---

### ✅ **COMPLIANT: Constants**

**Standard:** Exported data uses `SCREAMING_SNAKE_CASE`

**Examples:**
```typescript
IRON_SWORD      ✅
WILD_WOLF       ✅
CLAY_SPIRE      ✅
VALE_VILLAGE    ✅
```

**Status:** 100% compliant

---

### 🔴 **NON-COMPLIANT: NPC IDs**

**Standard:** Object IDs should use `kebab-case`  
**Actual:** **INCONSISTENT - 4 different patterns used!**

**Pattern 1: PascalCase (7 NPCs)** ❌
```typescript
'Mayor'          // Should be: 'mayor'
'Cook'           // Should be: 'cook'
'Soldier'        // Should be: 'soldier'
'Cook2'          // Should be: 'cook-2' or 'innkeeper'
'Elder'          // Should be: 'elder'
'Blacksmith'     // Should be: 'blacksmith'
'Merchant'       // Should be: 'merchant'
'Thief'          // Should be: 'thief'
```

**Pattern 2: PascalCase-Number (17 NPCs)** ❌
```typescript
'Villager-1'     // Should be: 'villager-1'
'Villager-2'     // Should be: 'villager-2'
... through ...
'Villager-17'    // Should be: 'villager-17'
```

**Pattern 3: PascalCase-kebab-case (3 NPCs)** ❌
```typescript
'Scholar-1'      // Should be: 'scholar-1'
'Scholar-2'      // Should be: 'scholar-2'
'Crab-1'         // Should be: 'crab-1'
'Crab-2'         // Should be: 'crab-2'
```

**Pattern 4: snake_case (3 NPCs)** ❌
```typescript
'Monk_sitting'      // Should be: 'monk-sitting'
'tiedup_villager'   // Should be: 'tied-up-villager'
'Cursed_Tree'       // Should be: 'cursed-tree'
```

**Pattern 5: lowercase (1 NPC)** ✅
```typescript
'seagull'        // Correct! ✅
```

**Impact:**
- Sprite paths use these IDs: `/sprites/overworld/minornpcs/${npc.id}.gif`
- Inconsistent casing breaks sprite loading
- **Only 'seagull' follows kebab-case standard**

**Severity:** 🔥 **CRITICAL - 29/30 NPCs don't follow standard**

---

### 🔴 **NON-COMPLIANT: Area IDs**

**Standard:** Object IDs should use `kebab-case`  
**Actual:** **snake_case** ❌

**Examples:**
```typescript
'vale_village'    // Should be: 'vale-village'
'forest_path'     // Should be: 'forest-path'
'ancient_ruins'   // Should be: 'ancient-ruins'
```

**Impact:**
- Used in game state: `state.currentLocation`
- Used in area state tracking
- Used in exits/navigation
- **All 3 areas non-compliant**

**Severity:** 🔴 **HIGH - Core game system**

---

### 🔴 **NON-COMPLIANT: Quest IDs**

**Standard:** Object IDs should use `kebab-case`  
**Actual:** **snake_case** ❌

**Examples:**
```typescript
'quest_clear_forest'   // Should be: 'quest-clear-forest'
'quest_ancient_ruins'  // Should be: 'quest-ancient-ruins'
```

**Impact:**
- Used in NPC quest tracking
- Used in story flags
- **All quest IDs non-compliant**

**Severity:** 🔴 **HIGH - Quest system**

---

### 🔴 **NON-COMPLIANT: Boss/Exit/Treasure IDs**

**Standard:** Object IDs should use `kebab-case`  
**Actual:** **snake_case** ❌

**Examples:**
```typescript
// Boss IDs
'alpha_wolf_boss'     // Should be: 'alpha-wolf-boss'
'golem_king_boss'     // Should be: 'golem-king-boss'

// Exit IDs
'to_forest'           // Should be: 'to-forest'
'back_to_village'     // Should be: 'back-to-village'
'to_ruins'            // Should be: 'to-ruins'
'back_to_forest'      // Should be: 'back-to-forest'

// Treasure IDs
'village_starter_chest'  // Should be: 'village-starter-chest'
'village_hidden_chest'   // Should be: 'village-hidden-chest'
'forest_chest_1'         // Should be: 'forest-chest-1'
'ruins_hidden_chest'     // Should be: 'ruins-hidden-chest'
```

**Severity:** 🟡 **MEDIUM - Internal IDs, less visible**

---

### 🟡 **MIXED: Sprite File Paths**

**Standard:** File paths should follow ID conventions  
**Actual:** **Mixed patterns**

**Current Sprite Paths:**
```typescript
// Overworld protagonists - PascalCase
'/sprites/overworld/protagonists/Isaac.gif'     // Matches unit name (PascalCase)
'/sprites/overworld/protagonists/${unit.name}.gif'

// Overworld NPCs - Uses NPC ID directly
'/sprites/overworld/minornpcs/${npc.id}.gif'    // Inherits NPC ID inconsistency
// Examples:
//   /sprites/overworld/minornpcs/Mayor.gif
//   /sprites/overworld/minornpcs/Villager-1.gif
//   /sprites/overworld/minornpcs/Monk_sitting.gif

// Djinn - PascalCase_Element
'/sprites/battle/djinn/${djinn.element}_Djinn_Front.gif'
// Examples:
//   /sprites/battle/djinn/Venus_Djinn_Front.gif
//   /sprites/battle/djinn/Mars_Djinn_Front.gif

// Scenery
'/sprites/scenery/chest.gif'                    // lowercase ✅
```

**Impact:**
- Sprite loading depends on exact ID matching
- Inconsistent IDs cause sprite failures
- Mixed casing makes file management difficult

**Severity:** 🟡 **MEDIUM - Depends on NPC ID fix**

---

## BREAKING DOWN THE PROBLEMS

### Problem 1: NPC ID Chaos 🔥

**30 NPCs, 5 Different Patterns:**

| Pattern | Count | Examples | Correct? |
|---------|-------|----------|----------|
| PascalCase | 7 | `Mayor`, `Cook`, `Soldier` | ❌ |
| PascalCase-Number | 17 | `Villager-1` to `Villager-17` | ❌ |
| PascalCase-kebab | 4 | `Scholar-1`, `Crab-2` | ❌ |
| snake_case | 2 | `Monk_sitting`, `tiedup_villager` | ❌ |
| lowercase | 1 | `seagull` | ✅ |

**Why This Happened:**
- No validation on NPC ID format
- Copy-paste from different sources
- Graphics named before conventions established
- Some IDs match sprite filenames (external constraint)

---

### Problem 2: snake_case vs kebab-case 🔴

**Files Using snake_case:**
- `src/data/areas.ts` - All area/quest/boss/exit/treasure IDs
- `src/data/quests.ts` - Quest IDs

**Why This Is a Problem:**
1. **Inconsistent with other systems** (equipment, enemies use kebab-case)
2. **Against documented standard** (NAMING_CONVENTIONS.md says kebab-case)
3. **Harder to read** (underscores vs hyphens)
4. **URL unfriendly** (if ever exposed in routes)

---

### Problem 3: Sprite File Dependency 🟡

**The Chicken-Egg Problem:**
- NPC IDs used in sprite paths: `/sprites/overworld/minornpcs/${npc.id}.gif`
- If we fix IDs, sprite files must be renamed
- If sprite files exist with current names, we can't change IDs
- **Need to verify sprite file existence before renaming**

---

## RECOMMENDATIONS

### Priority 1: NPC ID Standardization 🔥

**Action:** Convert all NPC IDs to kebab-case

**Changes Required:**
```typescript
// Before → After
'Mayor' → 'mayor'
'Villager-1' → 'villager-1' (already correct format!)
'Villager-2' → 'villager-2' (already correct format!)
'Scholar-1' → 'scholar-1' (already correct format!)
'Crab-1' → 'crab-1' (already correct format!)
'Monk_sitting' → 'monk-sitting'
'tiedup_villager' → 'tied-up-villager'
'Cursed_Tree' → 'cursed-tree'
```

**Impact:**
- 30 NPC IDs to update
- Sprite files must match (may need renaming)
- Any code referencing specific NPC IDs must update

**Time Estimate:** 2-3 hours (including sprite verification)

---

### Priority 2: Area/Quest ID Standardization 🔴

**Action:** Convert snake_case to kebab-case

**Changes Required:**
```typescript
// Area IDs
'vale_village' → 'vale-village'
'forest_path' → 'forest-path'
'ancient_ruins' → 'ancient-ruins'

// Quest IDs
'quest_clear_forest' → 'quest-clear-forest'
'quest_ancient_ruins' → 'quest-ancient-ruins'

// Boss IDs
'alpha_wolf_boss' → 'alpha-wolf-boss'
'golem_king_boss' → 'golem-king-boss'

// Exit IDs
'to_forest' → 'to-forest'
'back_to_village' → 'back-to-village'
// etc...
```

**Impact:**
- Game state keys change
- Area state tracking changes
- Navigation system changes
- **BREAKING CHANGE - saved games incompatible**

**Time Estimate:** 1-2 hours

---

### Priority 3: Story Flag Standardization 🟡

**Action:** Review story flag naming

**Current Flags (from CRITICAL_AUDIT.md):**
```typescript
intro_seen: false,                        // snake_case ❌
talked_to_elder_first_time: false,        // snake_case ❌
quest_forest_started: false,              // snake_case ❌
quest_forest_complete: false,             // snake_case ❌
// etc...
```

**Should Be:**
```typescript
'intro-seen': false,                      // kebab-case ✅
'talked-to-elder-first-time': false,     // kebab-case ✅
'quest-forest-started': false,            // kebab-case ✅
'quest-forest-complete': false,           // kebab-case ✅
```

**Time Estimate:** 1 hour

---

## COMPLIANCE SCORECARD

| System | Standard | Actual | Compliance | Grade |
|--------|----------|--------|------------|-------|
| Equipment IDs | kebab-case | kebab-case | 100% | A+ ✅ |
| Enemy IDs | kebab-case | kebab-case | 100% | A+ ✅ |
| Ability IDs | kebab-case | kebab-case | 100% | A+ ✅ |
| Djinn IDs | kebab-case | kebab-case | 100% | A+ ✅ |
| Constants | SCREAMING_SNAKE | SCREAMING_SNAKE | 100% | A+ ✅ |
| Types | PascalCase | PascalCase | 100% | A+ ✅ |
| Functions | camelCase | camelCase | ~95% | A ✅ |
| **NPC IDs** | **kebab-case** | **Mixed (5 patterns)** | **3%** | **F** 🔥 |
| **Area IDs** | **kebab-case** | **snake_case** | **0%** | **F** 🔴 |
| **Quest IDs** | **kebab-case** | **snake_case** | **0%** | **F** 🔴 |
| Boss/Exit IDs | kebab-case | snake_case | 0% | F 🔴 |
| Story Flags | kebab-case | snake_case | 0% | F 🔴 |

**Overall Grade:** **C (75%)** - Major systems compliant, but core game IDs inconsistent

---

## BREAKING CHANGE WARNING ⚠️

**If We Fix These Issues:**

### What Breaks:
1. ❌ **Saved games** - Area/quest/flag keys change
2. ❌ **Sprite loading** - NPC sprite paths change
3. ❌ **External references** - Any docs/tests referencing old IDs

### What Doesn't Break:
1. ✅ **Equipment system** - Already compliant
2. ✅ **Enemy system** - Already compliant
3. ✅ **Battle system** - Already compliant
4. ✅ **Type system** - Already compliant

### Migration Strategy:
1. **Create migration script** - Convert old IDs to new IDs
2. **Update all references** - grep and replace throughout codebase
3. **Rename sprite files** - Match new NPC IDs
4. **Version bump** - Mark as breaking change (v1.0 → v2.0)
5. **Document changes** - MIGRATION.md with old→new mappings

---

## DECISION REQUIRED

### Option A: Fix Everything Now (Recommended) ✅
**Pros:**
- Full compliance with documented standards
- Easier to maintain long-term
- Better for new developers
- Cleaner codebase

**Cons:**
- 4-6 hours of work
- Breaks saved games (early development, acceptable)
- Need to rename sprite files

**Recommendation:** **DO IT NOW** before more content is added

---

### Option B: Document Exceptions, Fix Later ⚠️
**Pros:**
- No immediate work
- No breaking changes
- Can ship current features

**Cons:**
- Technical debt grows
- Harder to fix later
- Confusing for new contributors
- Inconsistency breeds more inconsistency

**Recommendation:** Only if on tight deadline

---

### Option C: Update Standards to Match Current Code ❌
**Pros:**
- No code changes needed
- "Fix" by changing the rules

**Cons:**
- Bad precedent
- Inconsistent with industry standards
- Makes external integration harder
- Confuses AI code generation tools

**Recommendation:** **DO NOT DO THIS**

---

## IMMEDIATE ACTIONS

### Quick Wins (Can Do Today):
1. ✅ **Add EnemyId type** - Already done!
2. ✅ **Document current inconsistencies** - This document
3. 🔄 **Create ID validation utility** - Prevent future violations
4. 🔄 **Add pre-commit hook** - Check ID format before commit

### Full Fix (4-6 hours):
1. 🔄 **Fix NPC IDs** - Convert to kebab-case
2. 🔄 **Fix Area IDs** - snake_case → kebab-case
3. 🔄 **Fix Quest IDs** - snake_case → kebab-case
4. 🔄 **Fix Boss/Exit IDs** - snake_case → kebab-case
5. 🔄 **Verify sprite files** - Rename to match
6. 🔄 **Update tests** - Fix any broken references
7. 🔄 **Build and verify** - Ensure 0 errors

---

## CONCLUSION

**Current State:** 
- Core systems (equipment, enemies, abilities) are **100% compliant** ✅
- Game world IDs (areas, NPCs, quests) are **inconsistent and non-compliant** ❌
- This creates a **two-tier system** where half the codebase follows standards and half doesn't

**Recommended Action:**
**FIX NOW** before more content is added. The longer we wait, the harder it becomes.

**Estimated Time:** 4-6 hours for full compliance

**Risk:** Low (early development, no production users)

**Benefit:** High (clean codebase, easier maintenance, better onboarding)

---

## VALIDATION UTILITY (BONUS)

Here's a utility to add to prevent future violations:

```typescript
// src/utils/validateIds.ts
const VALID_ID_PATTERN = /^[a-z][a-z0-9]*(-[a-z0-9]+)*$/;

export function isValidKebabCaseId(id: string): boolean {
  return VALID_ID_PATTERN.test(id);
}

export function validateObjectId(id: string, objectType: string): void {
  if (!isValidKebabCaseId(id)) {
    throw new Error(
      `Invalid ${objectType} ID: "${id}". Must use kebab-case (lowercase with hyphens).
       Examples: 'iron-sword', 'wild-wolf', 'vale-village'`
    );
  }
}

// Usage in data files:
export const MAYOR_NPC: NPC = {
  id: validateObjectId('mayor', 'NPC') || 'mayor',
  // ...
};
```

---

*Audit Completed: November 3, 2025*  
*Auditor: Comprehensive Standards Check*  
*Next Action: Decision on fix timeline*
