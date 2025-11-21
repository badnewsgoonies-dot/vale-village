# System 2: Code Quality Refactoring - Executive Summary

**Project:** Vale Chronicles V2
**Created:** 2025-11-11
**Status:** ✅ Ready to Implement

---

## What We're Doing

Refactoring the battle system to improve code quality without changing behavior.

### The 4 Tasks

| # | Task | Goal | Impact |
|---|------|------|--------|
| **3** | Extract Magic Numbers | Centralize hardcoded values | Better maintainability |
| **4** | AbilityId Union Type | Replace `string` with union | Compile-time safety |
| **1** | Decompose executeRound() | Break 130-line function into phases | Easier to test & understand |
| **2** | Split BattleState | Break god object into 6 interfaces | Clear responsibilities |

---

## Why Now?

**Current Pain Points:**
- 🔴 `executeRound()` is 130 lines with complexity ~15 (hard to understand)
- 🔴 `BattleState` mixes 7 different concerns (god object)
- 🟡 Magic numbers scattered throughout code (hard to update)
- 🟡 Ability IDs are strings (no autocomplete, easy typos)

**After Refactor:**
- ✅ Functions < 60 lines each
- ✅ Clear separation of concerns
- ✅ Named constants for all values
- ✅ TypeScript autocomplete for abilities

---

## Timeline

```
Week View:
┌─────────────┬─────────────┬─────────────┬─────────────┐
│   Day 1     │   Day 2     │   Day 3     │   Day 4     │
│  (3-5h)     │  (3-4h)     │  (4-5h)     │   (1h)      │
├─────────────┼─────────────┼─────────────┼─────────────┤
│ Task 3: ☐   │ Task 1: ☐   │ Task 2: ☐   │ Testing ☐   │
│ Magic #s    │ execute     │ Battle      │ Docs    ☐   │
│ (1-2h)      │ Round()     │ State       │ PR      ☐   │
│             │ (3-4h)      │ (4-5h)      │             │
│ Task 4: ☐   │             │             │             │
│ AbilityId   │             │             │             │
│ (2-3h)      │             │             │             │
└─────────────┴─────────────┴─────────────┴─────────────┘

Total: 11-15 hours over 4 days
```

---

## Risk Assessment

| Category | Level | Mitigation |
|----------|-------|------------|
| **Overall** | 🟡 MEDIUM | High test coverage + TypeScript |
| Behavioral Regressions | 🟢 Low | Golden tests, determinism tests |
| BattleState Migration | 🟠 High (mech.) | TypeScript catches all issues |
| AbilityId Type Safety | 🟢 Low-Med | Compile-time validation |
| Performance | 🟢 Very Low | No algorithm changes |
| Scope Creep | 🟡 Medium | Stick to 4 tasks only |

**Confidence:** ✅ HIGH (95%+ test coverage, TypeScript safety, clear rollback path)

---

## Success Metrics

### Before
```typescript
// 130 lines, complexity ~15
export function executeRound(state, rng) {
  // Validation
  if (!isQueueComplete(state.queuedActions)) { /* ... */ }

  // 120+ lines of interleaved logic
  // - Djinn execution
  // - Player actions
  // - Enemy actions
  // - Battle end check
}

// God object with 25+ fields
interface BattleState {
  playerTeam: Team;
  enemies: Unit[];
  queuedActions: QueuedAction[];
  remainingMana: number;
  phase: BattlePhase;
  // ... 20+ more fields mixing concerns
}
```

### After
```typescript
// ~50 lines, complexity < 8
export function executeRound(state, rng) {
  validateQueueForExecution(state);
  let currentState = transitionToExecutingPhase(state);
  const allEvents = [];

  // Phase 1: Djinn
  const djinnResult = executeDjinnSummons(currentState, rng);
  currentState = djinnResult.state;
  allEvents.push(...djinnResult.events);

  // Phase 2: Player actions
  const playerResult = executePlayerActionsPhase(currentState, rng);
  // ... clear phase progression

  return { state: currentState, events: allEvents };
}

// 6 focused interfaces
interface BattleState {
  playerTeam: Team;
  enemies: Unit[];
  unitById: Map<string, UnitIndex>;

  queue: BattleQueue;      // 4 queue-related fields
  status: BattleStatus;    // 4 status-related fields
  mana: BattleMana;        // 2 mana-related fields
  // ... clear grouping by concern
}
```

---

## Value Delivered

### For Developers
- ✅ Easier to understand battle system
- ✅ Easier to test individual phases
- ✅ Better IDE autocomplete (AbilityId)
- ✅ Clearer code organization

### For Maintenance
- ✅ Reduced cyclomatic complexity
- ✅ Easier to modify one concern without touching others
- ✅ Named constants make value changes safer
- ✅ Type safety prevents typos

### For Testing
- ✅ Can test phases in isolation
- ✅ Clearer test organization
- ✅ Better error messages
- ✅ Easier to add new test cases

### For Future Features
- ✅ Clear where to add new battle phases
- ✅ Clear where to extend BattleState
- ✅ Clear where to add new abilities
- ✅ Reduced cognitive load

---

## Implementation Approach

### Incremental & Safe

```
┌─────────────────────────────────────────┐
│  Foundation (Low Risk, High Value)      │
│  ├─ Task 3: Magic Numbers               │
│  └─ Task 4: AbilityId Type              │
│         ↓                                │
│  Can ship independently!                 │
│         ↓                                │
│  Core Refactor (Medium Risk)            │
│  ├─ Task 1: executeRound()              │
│  └─ Task 2: BattleState                 │
│         ↓                                │
│  Can run in parallel!                    │
│         ↓                                │
│  Validate & Ship                         │
└─────────────────────────────────────────┘
```

### Rollback Strategy

| Scenario | Action | Recovery Time |
|----------|--------|---------------|
| Task 3 issues | Revert 1 file | < 5 min |
| Task 4 issues | Revert type file | < 10 min |
| Task 1 issues | Revert QueueBattleService.ts | < 5 min |
| Task 2 issues | Revert incrementally | 10-30 min |
| Major issues | Revert merge commit | < 10 min |

---

## Files Affected

### Heavy Changes (3 files)
- `QueueBattleService.ts` - Extract phases, update types
- `BattleState.ts` - Define sub-interfaces
- `queue-battle.test.ts` - Add phase tests

### Medium Changes (5 files)
- `BattleService.ts`, `queueBattleSlice.ts`, `battleSlice.ts`
- `QueueBattleView.tsx`, `BattleState.test.ts`

### Light Changes (20 files)
- Services, UI components, tests, factories

### New Files (1)
- `AbilityId.ts` - Union type definition

**Total: 29 files**

---

## Testing Strategy

### After Each Sub-Step (< 30 sec)
```bash
vitest run tests/core/services/queue-battle.test.ts
```

### After Each Task (< 2 min)
```bash
vitest run tests/core/
vitest run tests/battle/
```

### Before Commit (< 5 min)
```bash
pnpm test
pnpm typecheck
```

### Before PR (< 10 min)
```bash
pnpm precommit
pnpm dev  # Manual smoke test
```

---

## Decision Framework

### ✅ Proceed If:
- High test coverage (✅ 95%+)
- TypeScript catches errors (✅ Yes)
- Clear rollback path (✅ Yes)
- Team capacity available (✅ Yes)
- No blocking dependencies (✅ None)

### ⚠️ Reconsider If:
- Test coverage < 80%
- TypeScript not strictly enforced
- Unclear requirements
- Major features in flight
- Production issues ongoing

### ❌ Don't Proceed If:
- Tests currently failing
- TypeScript errors present
- Code freeze in effect
- Critical bugs unfixed
- No capacity for 11-15 hours

---

## Communication Plan

### Before Starting
- [ ] Share plan with team
- [ ] Schedule code review
- [ ] Announce feature branch

### During Work
- [ ] Daily standup updates
- [ ] Commit after each task
- [ ] Share blockers immediately

### Before Merging
- [ ] Create PR with summary
- [ ] Request code review
- [ ] Demo changes (if needed)

### After Merging
- [ ] Announce completion
- [ ] Update documentation
- [ ] Share lessons learned

---

## Next Steps

1. **Review Documents**
   - [ ] Read full plan: `SYSTEM_02_REFACTORING_PLAN.md`
   - [ ] Read risk assessment: `SYSTEM_02_RISK_ASSESSMENT.md`
   - [ ] Read quick reference: `SYSTEM_02_QUICK_REFERENCE.md`

2. **Setup**
   - [ ] Create branch: `git checkout -b refactor/system-02-code-quality`
   - [ ] Run baseline tests: `pnpm test`
   - [ ] Commit baseline: `git commit -m "Baseline before refactor"`

3. **Execute**
   - [ ] Day 1: Tasks 3 & 4 (Foundation)
   - [ ] Day 2: Task 1 (executeRound)
   - [ ] Day 3: Task 2 (BattleState)
   - [ ] Day 4: Testing & PR

4. **Ship**
   - [ ] Create PR
   - [ ] Code review
   - [ ] Merge to main
   - [ ] Update project docs

---

## Questions?

**Architecture:** See `VALE_CHRONICLES_ARCHITECTURE.md`
**Development:** See `CLAUDE.md`
**Full Plan:** See `SYSTEM_02_REFACTORING_PLAN.md`
**Risk Details:** See `SYSTEM_02_RISK_ASSESSMENT.md`
**Quick Ref:** See `SYSTEM_02_QUICK_REFERENCE.md`

---

## Recommendation

### ✅ **APPROVE & PROCEED**

**Rationale:**
- Well-defined scope (4 clear tasks)
- High confidence (95%+ test coverage, TypeScript safety)
- Clear value (improved code quality, maintainability)
- Manageable risk (low-medium with strong mitigation)
- Incremental approach (can ship parts independently)
- Clear rollback path (< 30 min recovery)

**Go/No-Go:** ✅ **GO**

---

**Created:** 2025-11-11
**Version:** 1.0
**Status:** Ready for Execution
