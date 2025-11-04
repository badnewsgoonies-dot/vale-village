# NAMING STRATEGY EVALUATION 🔍

**Date:** November 3, 2025  
**Status:** 🟡 **CRITICAL DECISION REQUIRED**  
**Question:** Should we fix Area/Quest IDs or keep them as-is?

---

## EXECUTIVE SUMMARY

**Current Situation:**
- Core battle systems (equipment, enemies, abilities): **100% kebab-case ✅**
- Game world IDs (areas, quests, flags): **100% snake_case ❌**
- **106+ references** found across codebase

**The Question:**
Is changing snake_case → kebab-case the right move, or is there a better approach?

**My Recommendation:** 🎯 **OPTION 4 - Type Safety + Document Exception**

---

## COMPREHENSIVE IMPACT ANALYSIS

### What Would Need To Change

#### 1. **Area IDs** (3 IDs, 83 total references)
```typescript
// BEFORE → AFTER
'vale_village'   → 'vale-village'    (36 references)
'forest_path'    → 'forest-path'     (22 references)
'ancient_ruins'  → 'ancient-ruins'   (25 references)
```

**Locations:**
- ✅ `src/data/areas.ts` - Area definitions
- ⚠️ `src/context/GameProvider.tsx` - **areaStates object KEYS**
- ⚠️ `src/context/types.ts` - Type definitions + comments
- 🔥 **CSS files** - `[data-area="vale_village"]` selectors (6 selectors across 2 files)
- ⚠️ Components - BattleScreen.tsx, NewOverworldScreen.tsx

#### 2. **Quest IDs** (5+ IDs, 18 references)
```typescript
'quest_clear_forest'  → 'quest-clear-forest'
'quest_ancient_ruins' → 'quest-ancient-ruins'
```

**Locations:**
- `src/data/quests.ts` - Quest definitions + references
- `src/data/areas.ts` - NPC questId properties

#### 3. **Story Flags** (10+ flags, 23 references)
```typescript
intro_seen              → 'intro-seen'
quest_forest_complete   → 'quest-forest-complete'
quest_ruins_complete    → 'quest-ruins-complete'
forest_path_unlocked    → 'forest-path-unlocked'
ancient_ruins_unlocked  → 'ancient-ruins-unlocked'
```

**Locations:**
- `src/context/types.ts` - StoryFlags interface properties
- `src/context/GameProvider.tsx` - Initial state object
- `src/components/intro/IntroScreen.tsx` - Flag setting
- `src/data/areas.ts` - Conditional dialogue (6+ uses)

#### 4. **Boss/Treasure IDs** (14 IDs)
```typescript
'alpha_wolf_boss'  → 'alpha-wolf-boss'
'forest_chest_1'   → 'forest-chest-1'  (6 chests)
'ruins_chest_1'    → 'ruins-chest-1'   (7 chests)
```

---

## THE CRITICAL PROBLEM 🔥

### **Object Keys vs String Values**

The **biggest risk** is that these IDs are used as **JavaScript object keys**, not just string values:

```typescript
// In GameProvider.tsx - Line 93
areaStates: {
  vale_village: createInitialAreaState(),    // ⚠️ OBJECT KEY
  forest_path: createInitialAreaState(),     // ⚠️ OBJECT KEY
  ancient_ruins: createInitialAreaState(),   // ⚠️ OBJECT KEY
}

// In areas.ts - Line 585
export const AREAS: Record<string, Area> = {
  vale_village: VALE_VILLAGE,    // ⚠️ OBJECT KEY
  forest_path: FOREST_PATH,      // ⚠️ OBJECT KEY
  ancient_ruins: ANCIENT_RUINS,  // ⚠️ OBJECT KEY
};

// Accessed like this:
const area = AREAS[state.currentLocation];  // Must match exactly!
```

**If we miss ONE reference:** Runtime crash, area not found, game breaks.

### **CSS Selectors**

CSS uses exact string matching:

```css
/* BattleScreen.css - Lines 27-35 */
.battle-screen[data-area="vale_village"] {
  background-image: url('/sprites/backgrounds/gs1/Overworld.gif');
}

.battle-screen[data-area="forest_path"] {
  background-image: url('/sprites/backgrounds/gs1/Kolima_Forest.gif');
}

.battle-screen[data-area="ancient_ruins"] {
  background-image: url('/sprites/backgrounds/gs1/Sol_Sanctum.gif');
}

/* NewOverworldScreen.css - Lines 105, 126, 147 */
.overworld-screen[data-area="vale_village"] .map { ... }
.overworld-screen[data-area="forest_path"] .map { ... }
.overworld-screen[data-area="ancient_ruins"] .map { ... }
```

**If CSS doesn't match:** No background images, broken styling.

### **Story Flags as Interface Properties**

```typescript
// src/context/types.ts
export interface StoryFlags {
  intro_seen: boolean;              // ⚠️ PROPERTY NAME
  quest_forest_complete: boolean;   // ⚠️ PROPERTY NAME
  forest_path_unlocked: boolean;    // ⚠️ PROPERTY NAME
  // ... etc
}

// Accessed like:
if (state.storyFlags.intro_seen) { ... }  // Must match property name!
```

**If we change to kebab-case:** TypeScript error! Can't have hyphens in property names.

---

## WAIT... THERE'S A BLOCKER! 🚨

### **Story Flags CANNOT Use Kebab-Case**

JavaScript object properties **cannot contain hyphens** unless quoted:

```typescript
// ❌ INVALID - Won't compile
interface StoryFlags {
  intro-seen: boolean;  // Syntax error!
}

// ❌ INVALID - Can't use dot notation
state.storyFlags.intro-seen  // Syntax error!

// ✅ VALID but UGLY
interface StoryFlags {
  'intro-seen': boolean;  // Works but...
}
state.storyFlags['intro-seen']  // Must use bracket notation
```

**This means:**
- Story flags **MUST** stay snake_case OR use camelCase
- We can't make them kebab-case without making code uglier
- Changing to camelCase (`introSeen`) is possible but...

---

## FOUR OPTIONS ANALYZED

### 🔴 **Option 1: Full Kebab-Case Migration**

**Changes Required:**
1. All Area IDs → kebab-case
2. All Quest IDs → kebab-case  
3. All Boss/Chest IDs → kebab-case
4. All CSS selectors → update to match
5. All object keys → update to match
6. Story Flags → **camelCase** (not kebab-case!)
7. TypeScript types → update
8. 100+ references → find and replace

**Time:** 3-4 hours of careful work

**Risk:** 🔥 **HIGH**
- One missed reference = runtime crash
- CSS mismatch = broken styling
- Object key mismatch = undefined errors
- Story flag refactor = massive changes

**Benefits:**
- ✅ Consistent with equipment/enemy naming
- ✅ Professional, clean codebase
- ✅ Matches documented standards

**Drawbacks:**
- ❌ Breaks saved games (localStorage has old keys)
- ❌ Story flags forced to camelCase (still inconsistent!)
- ❌ High risk of introducing bugs
- ❌ Can't test everything without manual QA

**Verdict:** 🔴 **HIGH RISK, QUESTIONABLE BENEFIT**

---

### 🟡 **Option 2: Keep Snake_Case, Update Documentation**

**Changes Required:**
1. Update NAMING_CONVENTIONS.md
2. Add "Historical Exceptions" section
3. Explain why game world uses snake_case

**Time:** 30 minutes

**Risk:** 🟢 **ZERO RISK** (no code changes)

**Benefits:**
- ✅ Zero breaking changes
- ✅ No risk of bugs
- ✅ Fast to implement
- ✅ Saved games continue working
- ✅ Story flags work naturally

**Drawbacks:**
- ❌ Inconsistent with other systems
- ❌ Two standards in codebase
- ❌ Confusing for new developers
- ❌ Technical debt remains

**Verdict:** 🟡 **SAFE BUT INCONSISTENT**

---

### 🟢 **Option 3: Hybrid - Legacy vs New**

**Strategy:**
- Keep **existing** IDs as snake_case (legacy)
- Use **new** content with kebab-case
- Document the distinction

**Changes Required:**
1. Update documentation with "Legacy" section
2. Add note to data files
3. All NEW areas/quests use kebab-case
4. Existing content stays unchanged

**Time:** 1 hour (documentation + notes)

**Risk:** 🟢 **LOW** (no changes to existing code)

**Benefits:**
- ✅ No breaking changes
- ✅ Clear path forward
- ✅ New content follows standards
- ✅ Can migrate gradually

**Drawbacks:**
- ❌ Two standards coexist (vale_village vs new-desert-area)
- ❌ Migration never complete
- ❌ Confusing which to use when

**Verdict:** 🟢 **PRACTICAL COMPROMISE**

---

### 🎯 **Option 4: Type Safety + Document Exception (RECOMMENDED)**

**Strategy:**
1. Add **strong typing** for all IDs (prevents typos)
2. Keep snake_case IDs (no breaking changes)
3. Document as "Game World Exception"
4. Use kebab-case for future content

**Changes Required:**

```typescript
// src/types/Area.ts
export type AreaId = 'vale_village' | 'forest_path' | 'ancient_ruins';
export type QuestId = 'quest_clear_forest' | 'quest_ancient_ruins';
export type BossId = 'alpha_wolf_boss' | 'stone_titan_boss';
export type ChestId = `${'forest' | 'ruins'}_chest_${number}`;

// Update Area interface
export interface Area {
  id: AreaId;  // ✅ Now type-safe!
  // ...
}

// Update StoryFlags (already typed, no change needed)
export interface StoryFlags {
  intro_seen: boolean;  // Already type-safe ✅
  // ...
}

// Update GameState
export interface GameState {
  currentLocation: AreaId;  // ✅ Now type-safe!
  areaStates: Record<AreaId, AreaState>;  // ✅ Type-safe keys!
  // ...
}
```

**Documentation Update:**

```markdown
## Naming Exceptions

### Game World IDs (Legacy snake_case)

**Areas, Quests, Story Flags use snake_case for historical reasons:**

- Object keys cannot use kebab-case with dot notation
- Changing would break saved games
- CSS selectors depend on exact strings
- Story flags are interface properties (can't have hyphens)

**Examples:**
- Area IDs: `vale_village`, `forest_path`
- Quest IDs: `quest_clear_forest`
- Story Flags: `intro_seen`, `quest_forest_complete`

**Rationale:**
- Snake_case works naturally as object keys
- No breaking changes to existing content
- Type safety prevents typos (see types/Area.ts)

**Future Content:**
- New battle content: Use kebab-case ✅
- New game world content: Use snake_case (consistency with existing)
```

**Time:** 1-2 hours

**Risk:** 🟢 **VERY LOW**
- TypeScript catches all typos at compile time
- No breaking changes
- No CSS updates needed
- No object key changes

**Benefits:**
- ✅ **Type safety prevents bugs** (would have caught wild_wolf vs wild-wolf!)
- ✅ Zero breaking changes
- ✅ Fast to implement
- ✅ Saved games work
- ✅ Professional documentation explains why
- ✅ Clear standard for future content

**Drawbacks:**
- ❌ Still inconsistent (but documented)
- ❌ Two standards remain

**Verdict:** 🎯 **BEST BALANCE - Safe, Fast, Professional**

---

## DETAILED RISK COMPARISON

| Factor | Option 1 (Kebab) | Option 2 (Keep) | Option 3 (Hybrid) | Option 4 (Types) |
|--------|------------------|-----------------|-------------------|------------------|
| **Breaking Changes** | 🔴 Yes (major) | 🟢 None | 🟢 None | 🟢 None |
| **Time Required** | 🔴 3-4 hours | 🟢 30 min | 🟡 1 hour | 🟡 1-2 hours |
| **Bug Risk** | 🔴 High | 🟢 Zero | 🟢 Very Low | 🟢 Very Low |
| **Type Safety** | 🟢 Can add | 🔴 Current (none) | 🟡 Partial | 🟢 Full |
| **Consistency** | 🟢 Full | 🔴 Inconsistent | 🟡 Eventually | 🟡 Documented |
| **Saved Games** | 🔴 Break | 🟢 Work | 🟢 Work | 🟢 Work |
| **CSS Updates** | 🔴 Required (6+) | 🟢 None | 🟢 None | 🟢 None |
| **Future Proof** | 🟢 Yes | 🟡 Meh | 🟢 Yes | 🟢 Yes |
| **Professional** | 🟢 Very | 🟡 Acceptable | 🟢 Good | 🟢 Excellent |

---

## THE HIDDEN TRUTH: Why Snake_Case Makes Sense Here

### **1. JavaScript Object Keys**

Game world IDs are **primarily used as object keys**, not string literals:

```typescript
// Object keys work great with snake_case:
areaStates: {
  vale_village: { ... },     // ✅ Natural, clean
  forest_path: { ... },      // ✅ No quotes needed
}

// vs kebab-case:
areaStates: {
  'vale-village': { ... },   // ⚠️ Must quote
  'forest-path': { ... },    // ⚠️ Uglier
}

// Accessed naturally:
state.areaStates[state.currentLocation]  // Works with both
```

### **2. Story Flags Are Properties**

Story flags **must** be valid JavaScript identifiers:

```typescript
// snake_case works:
storyFlags.intro_seen              // ✅ Dot notation
storyFlags.quest_forest_complete   // ✅ Clean

// kebab-case breaks:
storyFlags.intro-seen              // ❌ Syntax error!
storyFlags['intro-seen']           // ⚠️ Bracket notation required
```

### **3. CSS Selectors Don't Care**

CSS works fine with either:

```css
[data-area="vale_village"] { }   /* Works */
[data-area="vale-village"] { }   /* Also works */
```

### **4. Battle Systems Are Different**

Equipment/Enemies/Abilities are:
- **Never used as object keys** (stored in arrays, passed as IDs)
- **Always string literals** in code
- **User-facing** in UI (kebab-case looks better)

Game world IDs are:
- **Primarily object keys** (areaStates, AREAS lookup)
- **Internal only** (never shown to user)
- **Interface properties** (story flags)

**Different use cases = different conventions make sense!**

---

## RECOMMENDATION 🎯

### **CHOOSE OPTION 4: Type Safety + Document Exception**

**Why This Is Best:**

1. **Prevents Future Bugs**
   - Type safety would have caught `wild_wolf` vs `wild-wolf` bug
   - Compile-time errors for typos
   - IDE autocomplete for all IDs

2. **Zero Risk**
   - No breaking changes
   - No CSS updates
   - No object restructuring
   - Saved games work

3. **Fast Implementation**
   - 1-2 hours (vs 3-4 for full migration)
   - Low complexity
   - Easy to verify

4. **Professional**
   - Documented exception with rationale
   - Clear standards for future content
   - Acknowledges different use cases

5. **Pragmatic**
   - Recognizes that object keys ≠ string IDs
   - Accepts that story flags need valid identifiers
   - Documents the reasoning

---

## IMPLEMENTATION PLAN (Option 4)

### Step 1: Add Type Safety (45 min)

**File: `src/types/Area.ts`**

```typescript
// Area IDs
export type AreaId = 'vale_village' | 'forest_path' | 'ancient_ruins';

// Quest IDs  
export type QuestId = 
  | 'quest_clear_forest'
  | 'quest_ancient_ruins'
  | 'quest_defeat_wolves'
  | 'quest_find_djinn'
  | 'quest_explore_ruins';

// Boss IDs
export type BossId = 'alpha_wolf_boss' | 'stone_titan_boss';

// Chest IDs (template literal type)
export type ChestId = 
  | `forest_chest_${1 | 2 | 3 | 4 | 5 | 6}`
  | `ruins_chest_${1 | 2 | 3 | 4 | 5 | 6 | 7}`;

// Update Area interface
export interface Area {
  id: AreaId;  // Was: string
  name: string;
  // ... rest unchanged
}

// Update Boss/Exit/Treasure interfaces
export interface Boss {
  id: BossId;  // Was: string
  // ...
}

export interface Treasure {
  id: ChestId;  // Was: string
  // ...
}
```

**File: `src/context/types.ts`**

```typescript
import type { AreaId } from '@/types/Area';

export interface GameState {
  // ...
  currentLocation: AreaId;  // Was: string
  areaStates: Record<AreaId, AreaState>;  // Was: Record<string, AreaState>
  // ...
}

// StoryFlags already typed (no changes needed)
```

**File: `src/types/Quest.ts`**

```typescript
import type { AreaId, QuestId } from '@/types/Area';

export interface Quest {
  id: QuestId;  // Was: string
  // ...
  startsInLocation?: AreaId;  // Was: string
  completesInLocation?: AreaId;  // Was: string
  // ...
}
```

### Step 2: Update Documentation (30 min)

**File: `docs/NAMING_CONVENTIONS.md`**

Add section:

```markdown
## Game World Naming Exception

### Why Game World IDs Use snake_case

Game world identifiers (areas, quests, story flags) use **snake_case** instead of kebab-case for technical reasons:

**1. Object Keys**
- Area IDs are used as JavaScript object keys
- Snake_case works without quotes: `{ vale_village: ... }`
- Kebab-case requires quotes: `{ 'vale-village': ... }`

**2. Story Flags**
- Story flags are interface properties
- Must be valid JavaScript identifiers
- Cannot contain hyphens: `storyFlags.intro_seen` ✅
- Bracket notation required with kebab: `storyFlags['intro-seen']` ⚠️

**3. Type Safety**
- All IDs are strongly typed (see `types/Area.ts`)
- Compile-time errors prevent typos
- IDE autocomplete for all IDs

**Examples:**
- ✅ Area IDs: `vale_village`, `forest_path`, `ancient_ruins`
- ✅ Quest IDs: `quest_clear_forest`, `quest_ancient_ruins`
- ✅ Story Flags: `intro_seen`, `quest_forest_complete`
- ✅ Boss IDs: `alpha_wolf_boss`, `stone_titan_boss`
- ✅ Chest IDs: `forest_chest_1`, `ruins_chest_2`

**vs Battle System IDs (kebab-case):**
- ✅ Equipment: `iron-sword`, `dragon-scales`
- ✅ Enemies: `wild-wolf`, `fire-sprite`
- ✅ Abilities: `slash`, `clay-spire`

**Rationale:**
- Battle IDs: String literals, never object keys, user-facing → kebab-case
- Game World IDs: Object keys, interface properties, internal → snake_case

**Type Safety:** All game world IDs use TypeScript string literal types to prevent typos at compile time.
```

### Step 3: Add Code Comments (15 min)

**File: `src/data/areas.ts`** (top of file)

```typescript
/**
 * Area Definitions
 * 
 * NOTE: Area IDs use snake_case (e.g., 'vale_village') for technical reasons:
 * - Used as object keys in GameState.areaStates
 * - Used in CSS attribute selectors [data-area="..."]
 * - Strongly typed via AreaId type (see types/Area.ts)
 * 
 * This differs from battle system IDs (equipment, enemies) which use kebab-case.
 * See docs/NAMING_CONVENTIONS.md for full explanation.
 */
```

**File: `src/context/types.ts`** (above StoryFlags)

```typescript
/**
 * Story flags use snake_case as they are interface properties.
 * JavaScript property names cannot contain hyphens without bracket notation.
 * 
 * Example: storyFlags.intro_seen ✅  vs  storyFlags['intro-seen'] ⚠️
 */
export interface StoryFlags {
  // ...
}
```

### Step 4: Verify Build (5 min)

```bash
npm run build
```

TypeScript will now catch any typos in area/quest IDs!

### Step 5: Test Type Safety (10 min)

Try adding a typo to verify it catches errors:

```typescript
// In areas.ts, temporarily change:
id: 'vale_vilage',  // Typo: vilage

// TypeScript error:
// Type '"vale_vilage"' is not assignable to type 'AreaId'
```

---

## TOTAL TIME: 1.5-2 hours

**Deliverables:**
- ✅ Full type safety for all game world IDs
- ✅ Documentation explaining the exception
- ✅ Code comments for future developers
- ✅ Zero breaking changes
- ✅ Zero bugs introduced
- ✅ Professional, well-reasoned codebase

---

## FINAL VERDICT

### **Option 4 is the Winner** 🏆

**Reasoning:**
1. You're asking to be "EXTREMELY THOROUGH" after the 79% NPC battle failure
2. Changing 100+ references risks introducing MORE bugs
3. Type safety gives you the BENEFITS of consistency (compile-time checks)
4. Without the RISKS (runtime crashes, CSS mismatches)
5. Story flags CAN'T use kebab-case anyway (property names)
6. Different use cases justify different conventions

**The Pattern Recognition:**
- Battle IDs: kebab-case (string literals, user-facing)
- Game World IDs: snake_case (object keys, internal)
- **Both can be type-safe!**

**This is the professional choice.**

---

## IF YOU STILL WANT FULL MIGRATION (Option 1)

If you decide to go with Option 1 anyway, I can do it, but here's what to expect:

### Pre-Flight Checklist

- [ ] Backup all files
- [ ] List every single reference (already done above)
- [ ] Create migration script
- [ ] Update 83 area references
- [ ] Update 6 CSS selectors
- [ ] Change story flags to camelCase (23 references)
- [ ] Update all object keys
- [ ] Test every area
- [ ] Test every quest
- [ ] Test all conditional dialogues
- [ ] Verify CSS styling works
- [ ] Accept that saved games will break

**Time:** 3-4 hours of extremely careful work  
**Risk:** High (one missed reference = crash)  
**Benefit:** Perfect consistency (but story flags still different)

---

## YOUR DECISION

I've presented all options. My recommendation is **Option 4** because:

1. ✅ **Safest** (zero breaking changes)
2. ✅ **Fastest** (1-2 hours vs 3-4)
3. ✅ **Effective** (type safety prevents bugs)
4. ✅ **Professional** (well-documented reasoning)
5. ✅ **Pragmatic** (recognizes different use cases)

But you know your project best. What would you like to do?

**A. Option 4 - Type Safety + Document** (Recommended)  
**B. Option 1 - Full Migration** (Risky but consistent)  
**C. Option 2 - Keep As-Is** (Safe but inconsistent)  
**D. Option 3 - Hybrid** (Gradual approach)

Let me know and I'll implement it! 🚀
