# System 2 Refactoring - Quick Reference Guide

**Project:** Vale Chronicles V2
**Status:** Ready to implement
**Total Effort:** 11-15 hours

---

## Quick Start

```bash
# 1. Create feature branch
git checkout -b refactor/system-02-code-quality

# 2. Run baseline tests
pnpm test

# 3. Start with Task 3 or Task 4 (foundation)
# See detailed plan in SYSTEM_02_REFACTORING_PLAN.md
```

---

## Task Overview

| # | Task | Files | Lines | Risk | Time |
|---|------|-------|-------|------|------|
| 3 | Extract Magic Numbers | 1-5 | ~50 | 🟢 Low | 1-2h |
| 4 | AbilityId Union Type | 19 | ~100 | 🟡 Med | 2-3h |
| 1 | Refactor executeRound() | 1 | ~200 | 🟡 Med | 3-4h |
| 2 | Split BattleState | 29 | ~300 | 🟠 High | 4-5h |

**Legend:**
- 🟢 Low Risk - Easy rollback, localized changes
- 🟡 Medium Risk - Multiple files, but TypeScript catches errors
- 🟠 High Risk (mechanical) - Widespread but mechanical changes

---

## Execution Order

### Recommended (Sequential)

```
Day 1: Foundation
  ├─ Task 3: Extract Magic Numbers (1-2h)
  └─ Task 4: AbilityId Type (2-3h)
       ↓
Day 2: Core Refactor Part 1
  └─ Task 1: Refactor executeRound() (3-4h)
       ↓
Day 3: Core Refactor Part 2
  └─ Task 2: Split BattleState (4-5h)
       ↓
Day 4: Validation
  └─ Testing & Documentation (1h)
```

### Alternative (Parallel)

```
Developer A                Developer B
    ↓                          ↓
Task 3 (1-2h)             Task 4 (2-3h)
    ↓                          ↓
    └──────────┬───────────────┘
               ↓
         Merge Both
               ↓
    ┌──────────┴───────────┐
    ↓                      ↓
Task 1 (3-4h)         Task 2 (4-5h)
executeRound()        BattleState
    ↓                      ↓
    └──────────┬───────────┘
               ↓
           Merge & Test
```

---

## Dependency Graph (Visual)

```
┌─────────────────────────────────────────────────────────────────┐
│                          Start Here                              │
└─────────────────────────────────────────────────────────────────┘
                              ↓
                    ┌─────────┴─────────┐
                    ↓                   ↓
              ┌─────────┐         ┌─────────┐
              │ Task 3  │         │ Task 4  │
              │ Magic   │         │ Ability │
              │ Numbers │         │   ID    │
              │  1-2h   │         │  2-3h   │
              │ 🟢 Low  │         │ 🟡 Med  │
              └─────────┘         └─────────┘
                    ↓                   ↓
                    │    (Optional)     │
                    │    Improves DX    │
                    └─────────┬─────────┘
                              ↓
                    ┌─────────┴─────────┐
                    │                   │
                    ↓                   ↓
              ┌─────────┐         ┌─────────┐
              │ Task 1  │         │ Task 2  │
              │execute  │         │ Battle  │
              │ Round() │         │ State   │
              │  3-4h   │         │  4-5h   │
              │ 🟡 Med  │         │ 🟠 High │
              └─────────┘         └─────────┘
                    ↓                   ↓
                    └─────────┬─────────┘
                              ↓
                    ┌─────────────────┐
                    │   Merge & Test  │
                    │      1h         │
                    └─────────────────┘
                              ↓
                    ┌─────────────────┐
                    │      Done!      │
                    └─────────────────┘
```

---

## Files by Impact

### 🔴 Heavy Changes (3 files)
```
src/core/services/QueueBattleService.ts  (Task 1, 2, 4)
  ├─ Extract phases from executeRound()
  ├─ Update BattleState field access
  └─ Update abilityId types

src/core/models/BattleState.ts  (Task 2)
  ├─ Define 6 sub-interfaces
  ├─ Update createBattleState()
  └─ Update updateBattleState()

tests/core/services/queue-battle.test.ts  (Task 1, 2, 4)
  ├─ Add phase unit tests
  ├─ Update BattleState construction
  └─ Update abilityId types
```

### 🟡 Medium Changes (5 files)
```
src/core/services/BattleService.ts  (Task 2, 4)
src/ui/state/queueBattleSlice.ts  (Task 2, 4)
src/ui/state/battleSlice.ts  (Task 2, 4)
src/ui/components/QueueBattleView.tsx  (Task 2, 4)
tests/core/models/BattleState.test.ts  (Task 2)
```

### 🟢 Light Changes (20 files)
```
Core: AIService.ts, EncounterService.ts, RewardsService.ts,
      ReplayService.ts, mana.ts, constants.ts
UI: ActionBar.tsx, ActionQueuePanel.tsx, TurnOrderStrip.tsx,
    rewardsSlice.ts
Tests: invariants.test.ts, golden-runner.test.ts, replay.test.ts,
       Progression.test.ts
Other: factories.ts, ReplaySchema.ts
```

### ➕ New Files (1 file)
```
src/data/types/AbilityId.ts  (Task 4)
  └─ Define ability ID union type
```

---

## Risk Matrix

| Task | Risk | Why? | Mitigation | Rollback |
|------|------|------|------------|----------|
| **Task 3** | 🟢 Low | Additive change | Tests verify values | Easy revert |
| **Task 4** | 🟡 Med | 19 files | TypeScript catches all | Revert 1 file |
| **Task 1** | 🟡 Med | Complex logic | High test coverage | Revert 1 file |
| **Task 2** | 🟠 High | 29 files | Mechanical + TS | Incremental |

**Overall Risk: MEDIUM** (mitigated by tests + TypeScript)

---

## Test Strategy

### After Each Sub-Step
```bash
vitest run tests/core/services/queue-battle.test.ts
```

### After Each Task
```bash
vitest run tests/core/
vitest run tests/battle/
```

### Before Commit
```bash
pnpm test
pnpm typecheck
pnpm lint
```

### Before PR
```bash
pnpm precommit
pnpm validate:data
pnpm dev  # Manual smoke test
```

---

## Success Metrics

### Code Quality
- ✅ `executeRound()`: 130 → <60 lines
- ✅ Complexity: 12-15 → <8
- ✅ `BattleState`: 1 interface → 6 focused interfaces
- ✅ Magic numbers: → 100% extracted
- ✅ `abilityId`: `string` → union type

### Behavior
- ✅ All tests pass (zero regressions)
- ✅ Determinism preserved
- ✅ Performance unchanged

---

## Command Cheat Sheet

```bash
# Setup
git checkout -b refactor/system-02-code-quality
pnpm test  # Baseline

# Development
vitest run tests/core/services/queue-battle.test.ts  # Quick feedback
pnpm test  # Full suite
pnpm typecheck  # Type check

# Commit
git add .
git commit -m "Task X: [description]"

# Before PR
pnpm precommit
pnpm validate:data
pnpm dev

# If issues
git revert HEAD  # Undo last commit
git checkout main && git branch -D refactor/system-02-code-quality  # Abandon
```

---

## Task-Specific Quick References

### Task 1: executeRound() Decomposition

**Extract These Functions:**
1. `validateQueueForExecution()` - Lines 180-192
2. `transitionToExecutingPhase()` - Lines 194-198
3. `executePlayerActionsPhase()` - Lines 208-246
4. `executeEnemyActionsPhase()` - Lines 248-273
5. `transitionToPlanningPhase()` - Lines 288-296

**Result:** Main function goes from 130 → ~50 lines

### Task 2: BattleState Decomposition

**Create These Interfaces:**
1. `BattleTurnOrder` (2 fields) - turnOrder, currentActorIndex
2. `BattleQueue` (4 fields) - currentQueueIndex, queuedActions, queuedDjinn, executionIndex
3. `BattleStatus` (4 fields) - phase, status, currentTurn, roundNumber
4. `BattleMana` (2 fields) - remainingMana, maxMana
5. `BattleDjinnRecovery` (1 field) - djinnRecoveryTimers
6. `BattleMetadata` (4 fields) - isBossBattle, npcId, encounterId, meta

**Update Pattern:**
```typescript
// Before
state.queuedActions

// After
state.queue.queuedActions
```

### Task 3: Magic Numbers

**Already Extracted (✅):**
- `PARTY_SIZE = 4`
- `DEFAULT_ABILITY_ACCURACY = 0.95`
- `CRITICAL_HIT_MULTIPLIER = 2.0`
- `REVIVE_HP_PERCENTAGE = 0.5`

**To Audit:**
```bash
grep -rn '\b[0-9]\+\(\.[0-9]\+\)\?\b' src/core/ \
  --include='*.ts' | grep -v '\.test\.ts'
```

### Task 4: AbilityId Type

**18 Abilities to Include:**
```typescript
type AbilityId =
  | 'strike' | 'heavy-strike' | 'guard-break'
  | 'precise-jab' | 'poison-strike'
  | 'fireball' | 'ice-shard' | 'quake' | 'gust'
  | 'chain-lightning' | 'burn-touch'
  | 'freeze-blast' | 'paralyze-shock'
  | 'heal' | 'party-heal'
  | 'boost-atk' | 'boost-def'
  | 'weaken-def' | 'blind';
```

**Update Pattern:**
```typescript
// Before
abilityId: string | null

// After
abilityId: AbilityIdOrNull
```

---

## Common Pitfalls

### ❌ Don't
- Change behavior (must be 100% backward compatible)
- Skip tests (run after every sub-step)
- Batch commits (commit after each task)
- Guess at types (let TypeScript guide you)

### ✅ Do
- Run tests frequently
- Use TypeScript errors as checklist
- Commit after each task
- Document as you go
- Ask for help if stuck

---

## When to Stop and Ask

**Stop if:**
- Tests fail and you don't know why
- TypeScript errors you don't understand
- Uncertain about architecture decision
- Refactor scope creeping beyond plan

**Who to Ask:**
- Architecture questions → Review ADRs (docs/adr/)
- Battle system questions → Read CLAUDE.md
- Test failures → Check git log for similar fixes
- Type errors → Check existing patterns in codebase

---

## Useful Grep Commands

```bash
# Find all uses of abilityId
grep -rn 'abilityId' src --include='*.ts'

# Find magic numbers in core
grep -rn '\b[0-9]\+\(\.[0-9]\+\)\?\b' src/core/ --include='*.ts'

# Find BattleState imports
grep -rn 'import.*BattleState' src --include='*.ts'

# Find executeRound calls
grep -rn 'executeRound' root --include='*.ts'

# Find test files for a module
find tests -name '*queue-battle*'
```

---

## Resources

- 📄 Full Plan: `prompts/SYSTEM_02_REFACTORING_PLAN.md`
- 📄 Requirements: `prompts/02-code-quality-refactoring.md`
- 📄 Architecture: `VALE_CHRONICLES_ARCHITECTURE.md`
- 📄 Dev Guide: `CLAUDE.md`
- 📄 ADRs: `docs/adr/`

---

**Ready to start? Pick Task 3 or Task 4 and follow the detailed plan!**
