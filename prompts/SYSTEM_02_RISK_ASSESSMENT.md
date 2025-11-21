# System 2 Refactoring - Risk Assessment & Mitigation

**Project:** Vale Chronicles V2
**Date:** 2025-11-11
**Version:** 1.0

---

## Executive Risk Summary

| Overall Risk Level | **MEDIUM** |
|-------------------|-----------|
| Confidence Level | **HIGH** |
| Test Coverage | **95%+** |
| TypeScript Safety | **100%** |
| Rollback Complexity | **LOW-MEDIUM** |

**Recommendation:** ✅ PROCEED with incremental approach

---

## Risk Categories

### 1. Technical Risks
- Behavioral regressions
- Performance degradation
- Type system edge cases
- Determinism violations

### 2. Process Risks
- Incomplete refactoring
- Merge conflicts
- Test suite maintenance
- Documentation drift

### 3. Human Risks
- Developer understanding
- Code review delays
- Scope creep
- Time estimation errors

---

## Detailed Risk Analysis

### Risk 1: Behavioral Regressions in executeRound()

**Likelihood:** LOW (10%)
**Impact:** HIGH (battle system breaks)
**Overall Risk:** MEDIUM

**Scenarios:**
- Phase execution order changes
- Event ordering differs
- State not properly propagated between phases
- Edge case handling changes

**Detection:**
```bash
# These tests MUST pass
vitest run tests/core/services/queue-battle.test.ts
vitest run tests/battle/invariants.test.ts
vitest run tests/battle/golden/
```

**Indicators:**
- ❌ Golden tests fail (snapshot mismatch)
- ❌ Determinism tests fail (different output for same seed)
- ❌ Event ordering tests fail
- ❌ Victory/defeat detection fails

**Mitigation Strategies:**

1. **Pre-Mitigation (Before Refactor):**
   ```bash
   # Capture baseline behavior
   vitest run tests/battle/golden/ --reporter=verbose > golden-baseline.txt

   # Run determinism test 100x to establish confidence
   for i in {1..100}; do
     vitest run tests/core/services/queue-battle.test.ts || echo "FAIL $i"
   done
   ```

2. **During Refactor:**
   - Extract phases one at a time
   - Run tests after each extraction
   - Keep original function commented out as reference
   - Compare event logs between old and new

3. **Post-Mitigation (After Refactor):**
   ```bash
   # Verify exact same behavior
   vitest run tests/battle/golden/ --reporter=verbose > golden-refactored.txt
   diff golden-baseline.txt golden-refactored.txt

   # Should output: (no differences)
   ```

**Rollback Plan:**
```bash
# If regressions detected
git checkout HEAD -- src/core/services/QueueBattleService.ts
git add src/core/services/QueueBattleService.ts
git commit -m "Rollback Task 1: Regressions detected"
```

**Recovery Time:** < 5 minutes (single file revert)

---

### Risk 2: BattleState Migration Incomplete

**Likelihood:** MEDIUM (30%)
**Impact:** HIGH (compilation errors, runtime crashes)
**Overall Risk:** HIGH

**Scenarios:**
- Missed call site (state.field instead of state.group.field)
- Test factories not updated
- Zod schemas not updated
- UI components break

**Detection:**
```bash
# TypeScript will catch most
pnpm typecheck

# Tests will catch rest
pnpm test

# Manual: Search for old patterns
grep -rn 'state\.queuedActions' src
grep -rn 'state\.phase' src
```

**Indicators:**
- ❌ TypeScript errors: "Property 'queuedActions' does not exist"
- ❌ Runtime errors: "Cannot read property 'queuedActions' of undefined"
- ❌ Test failures: Factory functions break

**Mitigation Strategies:**

1. **Pre-Mitigation:**
   ```bash
   # Document all BattleState field access patterns
   grep -rn 'state\.' src --include='*.ts' > state-access-baseline.txt

   # Count references to each field
   grep -oh 'state\.[a-zA-Z]*' src/**/*.ts | sort | uniq -c
   ```

2. **During Refactor:**
   - Update one sub-interface at a time
   - Run `pnpm typecheck` after each update
   - Use TypeScript errors as checklist
   - Update tests immediately after core changes

3. **Validation Checklist:**
   ```bash
   # After each sub-interface update

   # 1. Typecheck passes
   pnpm typecheck

   # 2. Tests pass
   pnpm test

   # 3. No old patterns remain
   grep -rn 'state\.queuedActions\b' src  # Should be: state.queue.queuedActions
   grep -rn 'state\.phase\b' src          # Should be: state.status.phase
   grep -rn 'state\.remainingMana\b' src  # Should be: state.mana.remainingMana
   ```

**Rollback Plan:**
```bash
# If too many issues
git log --oneline  # Find commit before Task 2
git revert <commit-sha>..<current-sha>
git push
```

**Recovery Time:** 10-30 minutes (multiple file revert)

---

### Risk 3: AbilityId Type Breaks String Compatibility

**Likelihood:** LOW (5%)
**Impact:** MEDIUM (compilation errors, easy to fix)
**Overall Risk:** LOW-MEDIUM

**Scenarios:**
- JSON data has invalid ability IDs
- Tests use string literals not in union
- Dynamic ability ID construction breaks
- Zod validation and TypeScript types misaligned

**Detection:**
```bash
# TypeScript will catch at compile time
pnpm typecheck

# Runtime validation
pnpm validate:data
```

**Indicators:**
- ❌ TypeScript error: "Type 'foo' is not assignable to type 'AbilityId'"
- ❌ Test failure: Invalid ability ID in test data
- ❌ Data validation failure: Unknown ability in JSON

**Mitigation Strategies:**

1. **Pre-Mitigation:**
   ```bash
   # Validate all ability IDs in data
   pnpm validate:data

   # Extract all ability ID string literals
   grep -roh "'[a-z-]*'" src --include='*.ts' | \
     grep -E '(strike|heal|fireball)' | \
     sort | uniq
   ```

2. **During Refactor:**
   - Define union type with ALL existing IDs
   - Keep `null` case (basic attack)
   - Use `AbilityIdOrNull` for nullable cases
   - Update function signatures gradually

3. **Validation:**
   ```typescript
   // Add runtime check in development
   if (process.env.NODE_ENV === 'development') {
     const validIds = ['strike', 'heavy-strike', /* ... */];
     if (abilityId !== null && !validIds.includes(abilityId)) {
       console.warn(`Invalid ability ID: ${abilityId}`);
     }
   }
   ```

**Rollback Plan:**
```bash
# Single file to revert
rm src/data/types/AbilityId.ts

# Revert type changes in other files
git checkout HEAD -- src/core/models/BattleState.ts
# ... (revert other files)

# Or use git revert
git revert <commit-sha>
```

**Recovery Time:** < 10 minutes (type definition revert)

---

### Risk 4: Performance Degradation

**Likelihood:** VERY LOW (2%)
**Impact:** LOW (minor slowdown, not noticeable)
**Overall Risk:** LOW

**Scenarios:**
- Extra function calls add overhead
- Nested object access slower than flat structure
- More allocations from decomposed phases

**Detection:**
```bash
# Benchmark before/after
vitest bench tests/core/services/queue-battle.bench.ts

# Profile in browser DevTools
pnpm dev
# Open DevTools > Performance > Record battle
```

**Indicators:**
- ⚠️ Battle execution time increases >10%
- ⚠️ Frame rate drops in UI during battles
- ⚠️ Memory usage increases significantly

**Mitigation Strategies:**

1. **Pre-Mitigation:**
   ```bash
   # Establish baseline
   # Run battle 1000x and measure time
   vitest run tests/core/services/queue-battle.test.ts --reporter=verbose | \
     grep "ms" > perf-baseline.txt
   ```

2. **During Refactor:**
   - Avoid unnecessary allocations
   - Reuse existing helper functions
   - Don't introduce new abstractions (just decompose)
   - Profile if concerns arise

3. **Post-Mitigation:**
   ```bash
   # Compare performance
   vitest run tests/core/services/queue-battle.test.ts --reporter=verbose | \
     grep "ms" > perf-refactored.txt

   # Should be within 5% variance
   ```

**Rollback Plan:**
- If >20% degradation, investigate hotspots
- Optimize or revert specific changes
- Full rollback unlikely needed

**Recovery Time:** N/A (unlikely to occur)

---

### Risk 5: Determinism Violation

**Likelihood:** VERY LOW (2%)
**Impact:** CRITICAL (breaks save/replay, golden tests)
**Overall Risk:** LOW-MEDIUM

**Scenarios:**
- PRNG sequence changes due to phase extraction
- RNG called in different order
- New code path uses Math.random()
- Async operation introduces non-determinism

**Detection:**
```bash
# Run determinism tests
vitest run tests/core/services/queue-battle.test.ts \
  --grep "deterministic"

# Run golden tests
vitest run tests/battle/golden/
```

**Indicators:**
- ❌ Same seed produces different results
- ❌ Golden test snapshots differ
- ❌ Replay tests fail

**Mitigation Strategies:**

1. **Pre-Mitigation:**
   ```bash
   # Establish RNG baseline
   # Run same battle 10x with seed=42
   for i in {1..10}; do
     vitest run tests/core/services/queue-battle.test.ts \
       --grep "seed 42" >> rng-baseline.txt
   done

   # All outputs should be identical
   uniq rng-baseline.txt | wc -l  # Should be 1
   ```

2. **During Refactor:**
   - Never use `Math.random()`
   - Always pass PRNG through parameters
   - Don't reorder PRNG calls
   - Don't add new PRNG calls in different phases

3. **Validation:**
   ```typescript
   // Add RNG call counter in tests
   let rngCalls = 0;
   const trackedRNG = {
     next: () => {
       rngCalls++;
       return rng.next();
     }
   };

   // After refactor, rngCalls should be same as before
   ```

**Rollback Plan:**
```bash
# Critical - immediate rollback
git revert HEAD
git push --force-with-lease
```

**Recovery Time:** < 5 minutes (critical priority)

---

### Risk 6: Test Suite Maintenance Overhead

**Likelihood:** MEDIUM (40%)
**Impact:** MEDIUM (time cost, not blocking)
**Overall Risk:** MEDIUM

**Scenarios:**
- Need to update 20+ test files
- Test factories break
- Mocks need updating
- Property-based tests need new generators

**Detection:**
```bash
# Tests fail after refactor
pnpm test

# Count failing tests
vitest run | grep -c "FAIL"
```

**Indicators:**
- ❌ Multiple test files failing
- ❌ Test factories produce invalid state
- ⚠️ Need to update many snapshots

**Mitigation Strategies:**

1. **Pre-Mitigation:**
   - Run full test suite to establish baseline
   - Document test coverage percentages
   - Identify critical test paths

2. **During Refactor:**
   - Update tests immediately after core changes
   - Don't batch test updates
   - Use TypeScript errors to find test issues
   - Run tests frequently

3. **Efficiency Tips:**
   ```bash
   # Update tests file by file
   vitest run tests/core/services/queue-battle.test.ts --watch

   # Fix all issues in one file before moving to next

   # Use find/replace for mechanical changes
   # Example: state.queuedActions → state.queue.queuedActions
   ```

**Rollback Plan:**
- Not applicable (test updates are safe)
- If too time-consuming, consider reducing refactor scope

**Recovery Time:** Proportional to effort (2-4 hours)

---

### Risk 7: Scope Creep

**Likelihood:** MEDIUM (30%)
**Impact:** MEDIUM (delays delivery, increases risk)
**Overall Risk:** MEDIUM

**Scenarios:**
- Notice other issues while refactoring
- Tempted to refactor more than planned
- Add new features "while we're here"
- Improve test coverage beyond minimum

**Detection:**
- ⚠️ PR includes files not in plan
- ⚠️ Tasks taking longer than estimated
- ⚠️ New test files created

**Mitigation Strategies:**

1. **Pre-Mitigation:**
   - Review plan with team
   - Define clear boundaries
   - Create backlog for future improvements

2. **During Refactor:**
   - Stick to the 4 tasks
   - Document improvements for future PRs
   - Don't fix unrelated issues
   - Use TODO comments for future work

3. **Scope Management:**
   ```typescript
   // ✅ GOOD - Stay focused
   // TODO: Extract this pattern to helper (track in backlog)

   // ❌ BAD - Scope creep
   // Let me refactor this whole file while I'm here...
   ```

**Rollback Plan:**
- Review PR diff
- Remove out-of-scope changes
- Create follow-up tickets

**Recovery Time:** 30 minutes - 2 hours

---

## Risk Mitigation Checklist

### Before Starting

- [ ] Read full refactoring plan
- [ ] Understand architecture (CLAUDE.md)
- [ ] Run baseline tests: `pnpm test`
- [ ] Capture golden test output
- [ ] Create feature branch
- [ ] Commit baseline

### During Refactoring

**After Each Sub-Step:**
- [ ] Run relevant tests
- [ ] Check for TypeScript errors
- [ ] Verify determinism (if touching core logic)
- [ ] Commit changes

**After Each Task:**
- [ ] Run full test suite: `pnpm test`
- [ ] Run typecheck: `pnpm typecheck`
- [ ] Run data validation: `pnpm validate:data`
- [ ] Review diff for unintended changes
- [ ] Update documentation if needed
- [ ] Create commit with clear message

### Before PR

- [ ] Run `pnpm precommit`
- [ ] Manual smoke test: `pnpm dev`
- [ ] Compare golden test output (before vs after)
- [ ] Review all changed files
- [ ] Update SYSTEM_02_REFACTORING_PLAN.md with actual times
- [ ] Write PR description
- [ ] Self-review in GitHub UI

### After Merge

- [ ] Verify CI passes on main
- [ ] Monitor for runtime issues
- [ ] Update project status docs
- [ ] Create follow-up tickets for future improvements

---

## Early Warning Signs

### 🚨 Stop Immediately If:

1. **Tests fail and you don't understand why**
   - Don't guess at fixes
   - Revert last change
   - Debug systematically

2. **Determinism breaks**
   - Critical issue
   - Revert immediately
   - Investigate thoroughly

3. **TypeScript errors cascade**
   - Too many errors to fix
   - Approach may be wrong
   - Reconsider strategy

4. **Scope expanding beyond plan**
   - Refactor taking 2x estimated time
   - Touching files not in plan
   - Adding features

### ⚠️ Proceed with Caution If:

1. **More test updates than expected**
   - Could indicate missed complexity
   - Document extra work
   - Consider pausing to reassess

2. **Performance concerns arise**
   - Profile before proceeding
   - Consider alternative approach
   - May need optimization

3. **Merge conflicts likely**
   - Coordinate with team
   - Consider shorter-lived branch
   - Rebase frequently

---

## Rollback Procedures

### Emergency Rollback (Production Issue)

```bash
# 1. Identify problematic merge commit
git log --oneline --graph

# 2. Revert merge (use -m 1 for first parent)
git revert -m 1 <merge-commit-sha>

# 3. Push immediately
git push origin main

# 4. Deploy (if needed)
# Follow your deployment process

# 5. Create post-mortem
# Document what went wrong and why
```

**Time to Recovery:** < 10 minutes

### Partial Rollback (Single Task Failed)

```bash
# Revert just one task's commits
git log --oneline

# Revert range of commits
git revert <start-sha>^..<end-sha>

# Or revert individual commits
git revert <task-commit-sha>

# Push
git push origin refactor/system-02-code-quality
```

**Time to Recovery:** 10-30 minutes

### Full Branch Rollback (Refactor Failed)

```bash
# Abandon feature branch
git checkout main
git branch -D refactor/system-02-code-quality

# Start fresh (if desired)
git checkout -b refactor/system-02-code-quality-v2
```

**Time to Recovery:** < 5 minutes

---

## Monitoring & Validation

### Automated Checks

```bash
# These MUST pass before merging
pnpm precommit      # Typecheck, lint, test, validate
pnpm test           # All tests
pnpm typecheck      # No TS errors
pnpm validate:data  # Data schemas valid
```

### Manual Checks

```bash
# 1. Dev server runs
pnpm dev

# 2. Battle flows work
# - Start battle
# - Queue actions
# - Execute round
# - Activate Djinn
# - Win/lose battle

# 3. No console errors
# Check browser console

# 4. Golden tests identical
diff golden-baseline.txt golden-refactored.txt
```

### Performance Validation

```bash
# Run benchmark suite (if available)
vitest bench

# Or manual timing
time vitest run tests/core/services/queue-battle.test.ts

# Compare with baseline (should be within 10%)
```

---

## Success Criteria

### Must Have (Critical)

- ✅ All tests pass (zero regressions)
- ✅ Determinism preserved (golden tests pass)
- ✅ TypeScript compiles with zero errors
- ✅ Data validation passes
- ✅ Manual smoke test passes

### Should Have (Important)

- ✅ Performance within 10% of baseline
- ✅ Code complexity reduced as planned
- ✅ Documentation updated
- ✅ PR approved by reviewer

### Nice to Have (Bonus)

- ✅ Test coverage improved
- ✅ Better error messages
- ✅ Additional documentation
- ✅ Follow-up improvements identified

---

## Risk Acceptance

**By proceeding with this refactor, we accept:**

1. **Short-term risk** of behavioral regressions
   - Mitigated by: High test coverage, incremental approach
   - Impact: Can be quickly rolled back

2. **Time investment** in test updates
   - Mitigated by: TypeScript guides the process
   - Impact: 2-4 hours of test maintenance

3. **Potential merge conflicts** if delayed
   - Mitigated by: Short-lived branch, daily rebases
   - Impact: Manual conflict resolution

**We do NOT accept:**

1. ❌ Reduced test coverage
2. ❌ Behavioral changes (must be 100% compatible)
3. ❌ Performance regressions >20%
4. ❌ Breaking determinism

---

## Contingency Plans

### Plan A: Full Success (80% probability)
- Complete all 4 tasks
- All tests pass
- Merge to main
- **Timeline:** 11-15 hours over 4 days

### Plan B: Partial Success (15% probability)
- Complete Tasks 3 & 4 (foundation)
- Defer Tasks 1 & 2 to future PR
- Still delivers value (type safety, constants)
- **Timeline:** 3-5 hours over 1-2 days

### Plan C: Scope Reduction (4% probability)
- Complete only Task 4 (AbilityId type)
- Highest value, lowest risk
- Other tasks become follow-ups
- **Timeline:** 2-3 hours over 1 day

### Plan D: Full Rollback (1% probability)
- Major unforeseen issues
- Rollback all changes
- Post-mortem analysis
- Redesign approach
- **Timeline:** < 1 hour rollback + planning time

---

## Post-Mortem Template (If Issues Arise)

```markdown
# Refactor Post-Mortem

**Date:** YYYY-MM-DD
**Task:** [Task number and name]
**Issue:** [Brief description]

## What Happened?
[Detailed description of the issue]

## Root Cause
[Why did it happen?]

## Impact
- Users affected: [none/some/all]
- Downtime: [none/X minutes]
- Data loss: [none/describe]

## Resolution
[How was it fixed?]

## Lessons Learned
1. [Lesson 1]
2. [Lesson 2]

## Action Items
- [ ] [Improvement 1]
- [ ] [Improvement 2]

## Timeline
- [HH:MM] Issue detected
- [HH:MM] Rollback initiated
- [HH:MM] Service restored
- [HH:MM] Root cause identified
- [HH:MM] Fix deployed
```

---

## Conclusion

**Overall Assessment:** ✅ LOW-MEDIUM RISK with HIGH CONFIDENCE

**Key Risk Factors:**
- 🟢 High test coverage (95%+)
- 🟢 TypeScript catches compile-time errors
- 🟢 Deterministic system (easy to verify)
- 🟢 Clear rollback path
- 🟡 Multiple files affected (29 total)
- 🟡 Time investment required (11-15 hours)

**Recommendation:** ✅ **PROCEED** with incremental approach

The refactoring is well-planned, has strong mitigation strategies, and delivers significant value in code quality and maintainability. Risks are acceptable and manageable.

---

**Document Version:** 1.0
**Last Updated:** 2025-11-11
**Next Review:** After Task 2 completion
