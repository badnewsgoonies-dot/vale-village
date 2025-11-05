# DEEP ASSESSMENT: Code Architecture & Rules

**Date**: 2025-11-03
**Role**: Coder (assuming all 6 roles)
**Purpose**: Comprehensive understanding before fixing 76 failing tests

---

## EXECUTIVE SUMMARY

After reviewing GAME_MECHANICS.md, TECHNICAL_SESSION_PLAN.md, and the codebase, I have a clear understanding of:

1. **Game Mechanics**: All formulas, stat calculations, and system interactions
2. **Code Architecture**: TypeScript patterns, Result types, class structure
3. **Test Philosophy**: Context-aware testing (scenario-based, not isolated unit tests)
4. **Balance Changes**: 6 units modified, affecting 76 tests (expected)

**Current State**: 385/461 tests passing after balance changes (83.5% pass rate)
**Goal**: Fix all 76 failures, achieve 100% pass rate

---

## 1. GAME MECHANICS SPECIFICATIONS

### 1.1 Core Formulas

**Stat Growth**:
```typescript
newStat = baseStat + (growthRate × (level - 1))
```

**Physical Damage**:
```typescript
damage = Math.floor(
  (basePower + ATK - (DEF * 0.5)) * randomMultiplier
)
minimum = 1 damage
randomMultiplier = 0.9 to 1.1 (±10% variance)
```

**Psynergy Damage**:
```typescript
damage = Math.floor(
  (basePower + MAG - (DEF * 0.3)) * elementModifier * randomMultiplier
)
elementModifier = 1.5 (advantage), 0.67 (disadvantage), 1.0 (neutral)
```

**Healing**:
```typescript
healing = Math.floor(
  basePower + (caster.MAG * 0.5) * randomMultiplier
)
```

### 1.2 Djinn Synergy System

**CRITICAL**: Djinn bonuses are TEAM-WIDE, not per-unit!

**Synergy Formulas**:
- 3 Same Element: +12 ATK, +8 DEF (to ALL 4 units)
- 2 Same + 1 Different: +8 ATK, +6 DEF
- All Different: +4 ATK, +4 DEF, +4 SPD

**Activation**:
- Requirement: 30+ cumulative damage dealt/taken in battle
- Effect: Powerful attack/heal/buff
- Consequence: Lose passive bonus for 2 turns
- Recovery: Returns to Set state after 2 turns

### 1.3 Equipment System

**Tier Bonuses**:
- Common: +3 ATK (weapon), +5 DEF (armor)
- Rare: +8 ATK, +12 DEF
- Legendary: +30 ATK, +35 DEF

**Equipment Slots**: 4 slots per unit (weapon, armor, accessory1, accessory2)

**Stat Calculation**: `finalStat = baseStats + equipmentBonuses + djinnSynergy`

### 1.4 XP Curve

```typescript
Level 1→2: 100 XP
Level 2→3: 250 XP (cumulative: 350)
Level 3→4: 500 XP (cumulative: 850)
Level 4→5: 1000 XP (cumulative: 1850)
```

### 1.5 AOE Damage Rule

**CRITICAL**: AOE abilities deal FULL damage to EACH target, NOT divided!

Example: Quake deals 47 damage → 47 to EACH of 3 enemies (141 total)

Reason: Higher PP cost balances full damage

---

## 2. BALANCE CHANGES APPLIED

### 2.1 Summary of Changes

| Unit | Changes | Rationale |
|------|---------|-----------|
| **Isaac** | ATK 15→14 | Unit identity vs Garet |
| **Garet** | ATK 18→19, DEF 8→7, SPD 10→8, ATK growth 4→3 | Glass cannon archetype |
| **Felix** | ATK growth 4→3 | Reduce power gap |
| **Jenna** | ATK 9→11, MAG 20→28 | Glass cannon damage boost |
| **Piers** | ATK 14→10, MAG 13→9, ATK growth 2→1 | Tank trades damage for survivability |
| **Kraden** | ATK growth 1→2 | Improve scholar viability |

### 2.2 Impact on Tests

**76 test failures** are primarily due to:
1. Hardcoded old stat values (e.g., `expect(isaac.atk).toBe(15)` now fails, should be 14)
2. Stat-dependent calculations (damage, equipment bonuses)
3. Level-by-level stat checks

**Categories of Failures**:
- Leveling tests: 7 failures (stat checks at each level)
- Equipment tests: 9 failures (stat calculations)
- Djinn Team tests: 8 failures (team-wide bonuses)
- Unit tests: 3 failures (base stat checks)
- Integration tests: 1 failure (stat stacking)
- DjinnTeamAdvanced: 4 failures (unrelated to balance, existing bugs)
- GameBalance: 1 failure (leveling power gain now exactly 2.0×, test expects >2.0×)

---

## 3. CODE ARCHITECTURE PATTERNS

### 3.1 TypeScript Patterns

**Strict Typing**:
```typescript
// All types explicitly defined
interface UnitDefinition { ... }
class Unit { ... }
type Result<T, E> = Ok<T> | Err<E>
```

**Result Type for Error Handling**:
```typescript
// NO throwing exceptions in game logic
// Use Result<T, E> pattern from utils/Result.ts

// Good ✅
function equipDjinn(djinn: Djinn): Result<void, string> {
  if (alreadyEquipped) {
    return Err("Djinn already equipped");
  }
  return Ok(undefined);
}

// Bad ❌
function equipDjinn(djinn: Djinn): void {
  if (alreadyEquipped) {
    throw new Error("Djinn already equipped");
  }
}
```

**Immutability Where Possible**:
```typescript
// Use readonly for definition data
class Unit {
  readonly id: string;
  readonly name: string;
  readonly baseStats: Stats;

  // Mutable for game state
  level: number;
  xp: number;
}
```

### 3.2 Class Structure

**Unit Class** (`src/types/Unit.ts`):
- Private fields for HP/PP with validated setters
- Public getters for calculated stats (equipment + djinn bonuses)
- Methods: `gainXp()`, `heal()`, `takeDamage()`, `equipDjinn()`

**Battle Class** (`src/types/Battle.ts`):
- Manages turn order, battle state
- Functions: `executeAbility()`, `calculateDamage()`, `checkVictory()`

**Team Class** (`src/types/Team.ts`):
- Manages 4-unit party
- Handles team-wide Djinn bonuses
- Methods: `addUnit()`, `removeUnit()`, `getDjinnSynergy()`

### 3.3 Deterministic RNG

**CRITICAL**: Use SeededRNG, NOT Math.random()!

```typescript
// Good ✅
import { SeededRNG } from '@/utils/SeededRNG';
const rng = new SeededRNG(12345);
const multiplier = rng.nextFloat() * 0.2 + 0.9; // 0.9 to 1.1

// Bad ❌
const multiplier = Math.random() * 0.2 + 0.9;
```

**Purpose**: Reproducible test results, fairness, debugging

---

## 4. TEST PHILOSOPHY

### 4.1 Context-Aware Testing

**Core Principle**: Tests prove the GAME WORKS, not that functions return numbers

```typescript
// Bad ❌ - Tests nothing meaningful
test('calculateDamage returns number', () => {
  expect(typeof calculateDamage(10, 5)).toBe('number');
});

// Good ✅ - Tests game scenario
test('Level 1 loses to boss, Level 5 wins', () => {
  const lv1Party = [createUnit('Isaac', 1)];
  const lv5Party = [createUnit('Isaac', 5)];
  const boss = createNPC('Final Boss', 5);

  expect(runBattle(lv1Party, [boss], SEED).winner).toBe('enemy');
  expect(runBattle(lv5Party, [boss], SEED).winner).toBe('player');
});
```

### 4.2 Test Categories

1. **Unit Tests**: Core system functionality (leveling, equipment, djinn)
2. **Integration Tests**: Systems working together (battle + stats + equipment)
3. **Critical Tests**: Edge cases, bug discovery, uncovered code
4. **Gameplay Tests**: Balance, fun factor, progression
5. **Story Tests**: Narrative validation
6. **Verification Tests**: Spec compliance

### 4.3 Test Naming Convention

- Use emojis for readability: `✅`, `❌`, `⚠️`, `🎯`, `🔥`
- Descriptive names: `"✅ Level 1 loses to boss, Level 5 wins"`
- Context in test body: Explain WHY this matters

---

## 5. FILE STRUCTURE

### 5.1 Source Code Organization

```
src/
├── data/
│   ├── abilities.ts          # All ability definitions
│   ├── djinn.ts              # All Djinn definitions
│   ├── equipment.ts          # All equipment definitions
│   ├── enemies.ts            # NPC/enemy definitions
│   └── unitDefinitions.ts    # All 10 unit definitions
├── types/
│   ├── Unit.ts               # Unit class + interface
│   ├── Battle.ts             # Battle logic
│   ├── Team.ts               # Party management
│   ├── Stats.ts              # Stats types + utilities
│   ├── Equipment.ts          # Equipment types
│   ├── Djinn.ts              # Djinn types + synergy
│   ├── Ability.ts            # Ability types
│   └── Element.ts            # Element type
├── utils/
│   ├── Result.ts             # Ok/Err result type
│   ├── SeededRNG.ts          # Deterministic RNG
│   └── rng.ts                # RNG utilities
├── App.tsx                   # Main React app (mockup launcher)
└── main.tsx                  # Entry point
```

### 5.2 Test Organization

```
tests/
├── unit/                     # Core system tests
│   ├── Unit.test.ts
│   ├── Battle.test.ts
│   ├── Equipment.test.ts
│   ├── Leveling.test.ts
│   ├── DjinnTeam.test.ts
│   └── ...
├── integration/              # System integration
│   ├── GameLoopIntegration.test.ts
│   └── SystemIntegration.test.ts
├── critical/                 # Edge cases + bugs
│   ├── AbilityValidation.test.ts
│   ├── UncoveredCode.test.ts
│   └── SummonSystem.test.ts
├── gameplay/                 # Balance + fun
│   ├── GameBalance.test.ts
│   └── EpicBattles.test.ts
├── story/                    # Narrative validation
│   └── StoryValidation.test.ts
├── quality/                  # Code quality
│   └── NoMagicNumbers.test.ts
└── verification/             # Spec compliance
    └── SpecExamples.test.ts
```

---

## 6. CODING RULES & GUIDELINES

### 6.1 Mandatory Rules

1. **Use TypeScript strict mode** - All types must be explicit
2. **Use Result<T, E> for errors** - No throwing exceptions in game logic
3. **Use SeededRNG** - Never use Math.random()
4. **Validate inputs** - Check for negative HP, overflow, invalid ranges
5. **Immutable where possible** - Use `readonly` for definition data
6. **Pure functions** - No side effects in calculation functions
7. **Comment balance changes** - Mark all stat modifications with `// BALANCE: ...`

### 6.2 Best Practices

1. **Calculate stats dynamically** - Don't cache stats, recalculate from base + equipment + djinn
2. **Minimum damage = 1** - All damage formulas have Math.max(1, damage)
3. **Floor for damage, round for stats** - Use Math.floor() for consistency
4. **Team-wide Djinn bonuses** - Apply synergy to ALL units in party
5. **Test edge cases** - Negative values, zero, max values, null/undefined
6. **Context-aware tests** - Prove the game works, not just functions

### 6.3 Common Pitfalls to Avoid

❌ **Don't hardcode stat values in tests** - Use calculated values
❌ **Don't use Math.random()** - Use SeededRNG
❌ **Don't throw exceptions** - Use Result types
❌ **Don't mutate readonly data** - Create new objects
❌ **Don't forget minimum damage** - Always Math.max(1, damage)
❌ **Don't divide AOE damage** - Full damage to each target

---

## 7. BUG FIX STRATEGY

### 7.1 Test Failure Categories

**Category A: Balance-Related (Expected)**
- 52 failures due to stat changes
- Fix: Update test expectations to match new stats

**Category B: Existing Bugs (Real Issues)**
- 24 failures from pre-existing bugs
- Examples: Healing dead units, negative HP, Djinn duplication
- Fix: Implement proper validation and edge case handling

### 7.2 Fix Priority

**Phase 1: Balance-Related Tests** (Quick wins)
1. Update Isaac stat checks (15→14)
2. Update Garet stat checks (multiple changes)
3. Update Felix level 5 stats
4. Update Jenna MAG checks (20→28)
5. Update Piers damage calculations
6. Update equipment bonus calculations

**Phase 2: Real Bugs** (Critical fixes)
1. HP/PP validation (no negative, no overflow)
2. Healing dead units (KO check)
3. Djinn duplication prevention
4. Ability validation (negative PP cost, negative healing)
5. Buff duration edge cases
6. Missing character data (PIERS, JENNA exports)

**Phase 3: Test Improvements** (Polish)
1. Fix flaky RNG tests
2. Add missing imports
3. Adjust balance test thresholds

---

## 8. NEXT STEPS

### 8.1 Immediate Actions

1. **Fix balance-related test failures** (52 tests) - Update expected values
2. **Fix real bugs** (24 tests) - Implement validation and edge case handling
3. **Run full test suite** - Verify 461/461 passing
4. **Commit changes** - Document fixes in commit message

### 8.2 After Tests Pass

1. **Role 5: Graphics Integration** - Convert mockups to React components
2. **Role 6: QA** - Manual playthrough, final verification
3. **Ship decision** - Create QA report with SHIP/FIX verdict

---

## 9. KEY INSIGHTS

### 9.1 Architecture Strengths

✅ **Well-structured** - Clear separation of data, types, and logic
✅ **Type-safe** - TypeScript strict mode prevents many bugs
✅ **Testable** - Deterministic RNG enables reproducible tests
✅ **Documented** - GAME_MECHANICS.md is comprehensive

### 9.2 Areas of Concern

⚠️ **Missing character exports** - PIERS and JENNA not exported in some files
⚠️ **Input validation** - Many edge cases not handled (negative HP, etc.)
⚠️ **Test brittleness** - Some tests hardcode values instead of calculating

### 9.3 Lessons Learned

1. **Balance changes break tests** - Expected and healthy
2. **Context-aware testing works** - Found 16 real bugs that 90% coverage missed
3. **Specifications matter** - GAME_MECHANICS.md is the source of truth
4. **Result types are powerful** - Explicit error handling prevents crashes

---

**Assessment Complete**: Ready to fix 76 failing tests systematically

**Next Action**: Begin Phase 1 (balance-related fixes), then Phase 2 (real bugs)

---

**Document Author**: Coder (AI assuming all 6 roles)
**Date**: 2025-11-03
**Status**: ✅ COMPLETE - Proceeding to bug fixes
