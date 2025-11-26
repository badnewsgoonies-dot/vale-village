# Algorithm Test Coverage Assessment

**Date:** 2025-11-26
**Assessed by:** Testing Agent #1 (Algorithms)

---

## Executive Summary

The algorithms directory has **strong test coverage** for core systems (damage, stats, xp, turn-order, djinn) but has **gaps in newer features and edge cases**. Approximately **70% coverage** with some critical algorithms missing tests entirely.

**Priority:** Address missing tests for `healing.ts`, `rewards.ts`, `targeting.ts`, `equipment.ts`, `mana.ts` first.

---

## Coverage Status by File

### ✅ Well Tested (8 files)

| File | Test Files | Coverage Level | Notes |
|------|-----------|----------------|-------|
| `damage.ts` | 10 test files | **Excellent** | Comprehensive coverage: basic damage, elemental, shields, auto-revive, splash, ignore defense, damage reduction |
| `stats.ts` | 2 test files | **Good** | Covers level bonuses, status modifiers, effective stats, Djinn integration |
| `xp.ts` | 2 test files | **Good** | XP curve, level calculation, multi-level gains, level 20 cap |
| `turn-order.ts` | 1 test file | **Good** | Properties tested: determinism, Hermes priority, tiebreaking |
| `djinn.ts` | 3 test files | **Good** | Synergy bonuses, activation, recovery, Mercury/Jupiter integrations |
| `djinnAbilities.ts` | 1 test file | **Good** | Element compatibility, stat bonuses, ability grants |
| `status.ts` | 3 test files | **Good** | Status ticks, immunity, cleanse, poison/burn/freeze/paralyze |
| `equipment.ts` | 1 test file | **Adequate** | Element-based restrictions tested |

### ⚠️ Partially Tested (1 file)

| File | Test Files | Coverage Level | Missing Coverage |
|------|-----------|----------------|------------------|
| `index.ts` | 0 test files | N/A | Export-only file (no logic to test) |

### ❌ Missing Tests (4 files - PRIORITY)

| File | Test Files | Coverage Level | Impact | Priority |
|------|-----------|----------------|--------|----------|
| `healing.ts` | **0 test files** | **0%** | High | **P0** |
| `rewards.ts` | **0 test files** | **0%** | High | **P0** |
| `targeting.ts` | **0 test files** | **0%** | Medium | **P1** |
| `mana.ts` | **0 test files** | **0%** | Medium | **P1** |

---

## Missing Test Scenarios

### P0: Critical Gaps (Must Fix)

#### 1. `healing.ts` - Auto-Heal After Battle
**Functions:**
- `autoHealUnits(units)` - Restores HP to max and clears status effects

**Missing Tests:**
- [ ] Auto-heal restores all units to max HP
- [ ] Auto-heal clears all status effects (poison, burn, buffs, debuffs)
- [ ] Auto-heal works with mixed HP levels
- [ ] Auto-heal handles empty unit arrays
- [ ] Auto-heal is pure (doesn't mutate input)

**Impact:** Post-battle healing is critical for game flow. Bugs could leave units wounded or with lingering debuffs.

---

#### 2. `rewards.ts` - Battle Rewards & XP Distribution
**Functions:**
- `calculateBattleRewards(encounterId, survivorCount)` - Get predetermined rewards
- `calculateStatGains(unit, oldLevel, newLevel)` - Calculate stat increases
- `distributeRewards(team, rewards)` - Give XP, track level-ups

**Missing Tests:**
- [ ] Calculate correct XP/gold from encounter data
- [ ] XP split among survivors (divide by survivorCount)
- [ ] Skip KO'd units when distributing XP
- [ ] Skip max-level units (level 20 cap)
- [ ] Track multiple level-ups in one battle
- [ ] Calculate stat gains correctly (growthRates × levelDiff)
- [ ] Unlock abilities on level-up
- [ ] Handle 0 survivors (should not divide by zero)
- [ ] Handle invalid encounterId (should throw)
- [ ] Equipment rewards passed through correctly
- [ ] `allSurvived` flag set correctly (4 survivors)

**Impact:** Rewards are the primary progression mechanic. Incorrect XP/gold could break game balance.

---

### P1: Important Gaps (Should Fix)

#### 3. `targeting.ts` - Target Resolution
**Functions:**
- `resolveTargets(ability, caster, playerUnits, enemyUnits)` - Get valid targets
- `filterValidTargets(targets, ability)` - Filter by ability rules
- `getValidTargets(ability, caster, playerTeam, enemies)` - UI helper

**Missing Tests:**
- [ ] Single-enemy targeting (player → enemy)
- [ ] All-enemies targeting (player → all enemies)
- [ ] Single-ally targeting (exclude self)
- [ ] All-allies targeting (include self)
- [ ] Self-targeting
- [ ] Enemy caster targeting players
- [ ] Filter KO'd units from targets
- [ ] Healing cannot target KO'd units (unless revivesFallen)
- [ ] Revival abilities can target KO'd units
- [ ] Empty target lists handled gracefully
- [ ] UI helper returns same results as core function

**Impact:** Incorrect targeting could allow invalid actions or soft-lock battles.

---

#### 4. `mana.ts` - Mana Pool Management
**Functions:**
- `canAffordAction(remainingMana, manaCost)` - Check affordability
- `getAbilityManaCost(abilityId, ability)` - Get ability cost
- `calculateTotalQueuedManaCost(queuedActions)` - Sum queued costs
- `validateQueuedActions(remainingMana, queuedActions)` - Validate full queue
- `isQueueComplete(queuedActions, teamSize)` - Check if all actions queued

**Missing Tests:**
- [ ] Basic attacks cost 0 mana
- [ ] Abilities cost correct mana (from data)
- [ ] Cannot afford action when mana < cost
- [ ] Can afford when mana >= cost
- [ ] Calculate total cost of multiple actions
- [ ] Validate queue with sufficient mana
- [ ] Reject queue with insufficient mana
- [ ] Null actions don't contribute to cost
- [ ] Queue complete when all slots filled (1-4 units)
- [ ] Queue incomplete when null actions remain
- [ ] Throw error for invalid team size (<1 or >4)

**Impact:** Mana system is core to queue-based battle. Bugs could allow free abilities or lock players out.

---

### P2: Nice to Have (Edge Cases)

#### 5. `equipment.ts` - Expanded Edge Cases
**Current Coverage:** Element-based restrictions tested
**Missing:**
- [ ] Multiple equipment pieces for same slot (should not happen in practice)
- [ ] Equipment with missing/null allowedElements (defensive coding)
- [ ] Empty equipment list (getEquippableItems with no items)

**Impact:** Low - current tests cover main use cases.

---

#### 6. `damage.ts` - Additional Edge Cases
**Current Coverage:** Excellent
**Missing:**
- [ ] Elemental advantage/disadvantage with Neutral element
- [ ] Damage with 0 ATK attacker (should return minimum damage)
- [ ] Damage with 0 DEF defender (should work normally)
- [ ] Negative damage (should clamp to 0)
- [ ] Multiple damage modifiers stacking (e.g., resistance + reduction)
- [ ] Shield with 0 charges (should be cleaned up)

**Impact:** Low - edge cases unlikely to occur in gameplay.

---

## Property-Based Testing Opportunities

### Invariants to Test

1. **Damage is always non-negative** (all damage functions)
2. **Healing never exceeds max HP** (applyHealing)
3. **XP curve is monotonically increasing** (getXpForLevel)
4. **Turn order is deterministic for same seed** (calculateTurnOrder) ✅ Already tested
5. **Effective stats >= 1 for core stats (HP, ATK, MAG, SPD)** (calculateEffectiveStats)
6. **Mana cost is always non-negative** (getAbilityManaCost)
7. **Stat gains are proportional to level difference** (calculateStatGains)

### Fuzzing Candidates

- **XP system**: Random XP values (0 to 999999) → calculateLevelFromXp → should never crash
- **Damage system**: Random ATK/DEF/MAG values → calculateDamage → should return valid number
- **Mana system**: Random team sizes (1-4), random action counts → isQueueComplete → should validate correctly

---

## Test Pattern Recommendations

### Standard Test Structure

```typescript
import { describe, test, expect } from 'vitest';
import { mkUnit, mkTeam, mkEnemy } from '../../../src/test/factories';
import { makePRNG } from '../../../src/core/random/prng';
import { functionToTest } from '../../../src/core/algorithms/file';

describe('Algorithm Name', () => {
  describe('functionName', () => {
    test('should handle typical case', () => {
      // Arrange
      const unit = mkUnit({ level: 5 });

      // Act
      const result = functionToTest(unit);

      // Assert
      expect(result).toBe(expectedValue);
    });

    test('should handle edge case', () => {
      // Test boundary conditions
    });

    test('should be deterministic (property)', () => {
      // Call multiple times with same inputs
      // Verify same output
    });
  });
});
```

### Use Factories

- `mkUnit(overrides)` - Create test units
- `mkEnemy(enemyId, overrides)` - Create test enemies
- `mkTeam(units)` - Create test teams
- `makePRNG(seed)` - Deterministic RNG

### Test Naming

- **Positive cases:** "should calculate correct damage for level 1 vs level 1"
- **Negative cases:** "should return 0 when healing KO'd unit without revive"
- **Edge cases:** "should handle empty team array"
- **Properties:** "should be deterministic for same inputs"

---

## Next Steps

1. **Write missing tests** for P0 files (healing, rewards, targeting, mana)
2. **Run tests** with `pnpm test` to verify coverage
3. **Add property tests** for invariants listed above
4. **Update this assessment** with coverage percentages after test creation

---

## Test Execution Plan

### Phase 1: P0 Critical Tests (2-3 hours)
- [ ] `healing.test.ts` - 5 test cases
- [ ] `rewards.test.ts` - 11 test cases
- [ ] `targeting.test.ts` - 11 test cases
- [ ] `mana.test.ts` - 11 test cases

### Phase 2: P1 Edge Cases (1 hour)
- [ ] Expand `equipment.test.ts` - 3 additional cases
- [ ] Expand `damage.test.ts` - 6 additional cases

### Phase 3: Property Tests (1 hour)
- [ ] Add property-based tests for invariants
- [ ] Add fuzzing tests for XP/damage/mana systems

**Total Estimated Time:** 4-5 hours

---

## Conclusion

The algorithms directory has **solid foundation coverage** but **critical gaps in newer features** (healing, rewards, targeting, mana). Addressing P0 gaps will bring coverage to **~90%** and significantly reduce risk of progression/battle bugs.

**Recommendation:** Write P0 tests immediately, P1 tests in next sprint, P2 tests as time permits.
