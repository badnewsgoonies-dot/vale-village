# Gameplay Integration Test Assessment

**Date:** 2025-11-26
**Agent:** Testing Agent #5 (Gameplay Integration)
**Mission:** Analyze gameplay test coverage and identify missing integration/scenario tests

---

## Executive Summary

The current gameplay test suite provides **good coverage** of core battle mechanics and deterministic systems but has **significant gaps** in:
1. End-to-end mode transitions (overworld → battle → rewards → dialogue)
2. Post-battle reward flows (equipment choices, XP distribution)
3. Djinn collection and synergy scenarios
4. Element advantage/weakness combat scenarios
5. Full progression paths (leveling up mid-battle, ability unlocking)

**Overall Coverage:** ~45% of gameplay scenarios tested
**Priority:** High - Missing tests for critical mode transitions documented in GAME_MECHANICS_FLOW.md

---

## Current Test Coverage Analysis

### ✅ Well-Covered Areas

#### 1. Battle Integration (battle-integration.test.ts)
- ✓ Basic battle creation from encounters
- ✓ Victory conditions
- ✓ Enemy team composition validation

**Strengths:**
- Uses real encounter data
- Tests deterministic battle setup
- Validates enemy configuration

**Gaps:**
- Only tests 2 specific encounters (house-01, house-03)
- No defeat scenarios
- No retargeting or mid-battle state changes

#### 2. Comprehensive Battle Flows (battle-integration-comprehensive.test.ts)
- ✓ Complete queue → execute → victory flow
- ✓ Multi-round battles with state transitions
- ✓ Mana management (costs, regeneration, generation on hit)
- ✓ Djinn activation → standby → recovery
- ✓ Retargeting on KO'd targets
- ✓ Player defeat detection
- ✓ Determinism verification (replay tests)
- ✓ Turn order with SPD stats
- ✓ Elemental damage with psynergy

**Strengths:**
- Excellent determinism testing
- Comprehensive edge case coverage
- Tests cross-system integration
- No Math.random() detection test

**Gaps:**
- Djinn summon damage test skipped (legacy timing issues)
- Limited element advantage testing (only checks fireball damage, not advantage modifiers)
- No status effect scenarios
- No multi-target abilities tested

#### 3. Progression Tests (Progression.test.ts)
- ✓ Level-based victory/defeat scenarios (Level 1 loses, Level 5 wins)
- ✓ Equipment impact on outcomes (naked loses, equipped wins)
- ✓ Weapon tier effectiveness (basic vs legendary)
- ✓ Ability power comparison (basic attack vs powerful abilities)

**Strengths:**
- Context-aware "meaningful scenario" testing
- Proves that progression systems matter
- Uses realistic stat differentials

**Gaps:**
- No leveling up during battle
- No ability unlocking scenarios
- No equipment swapping between battles
- No multi-unit progression scenarios

---

## Missing Test Scenarios by Category

### 🔴 Priority 1: Critical Mode Transitions (GAME_MECHANICS_FLOW.md)

**Missing Coverage:** 0% - No tests exist

1. **Overworld → Team Select → Battle Flow**
   - Trigger: `setPendingBattle(encounterId)`
   - Expected: Mode transitions to `'team-select'`
   - Expected: `pendingBattleEncounterId` stored
   - Verify: Auto-sort by SPD on team selection

2. **Battle → Rewards → Dialogue Flow**
   - Trigger: Victory detected
   - Expected: `processVictory()` sets mode to `'rewards'`
   - Expected: `lastBattleEncounterId` preserved
   - Expected: Equipment choices handled if present
   - Trigger: Continue clicked → `handleRewardsContinue()`
   - Expected: Dialogue triggered for recruitment encounters (house-01, 05, 08, 11, 14, 15, 17)
   - Expected: Direct to overworld for non-recruitment

3. **Dialogue → Overworld Flow**
   - Expected: Recruitment dialogue effects processed (`recruitUnit`, `grantDjinn`)
   - Expected: Mode transitions to `'overworld'` after dialogue completes
   - Expected: New unit in roster, Djinn in collected list

4. **Equipment Choice Flow**
   - Scenario: Battle rewards offer 1-of-3 equipment choice
   - Expected: Continue button disabled until choice selected
   - Expected: Choice persisted correctly
   - Expected: Equipment added to inventory after continue

**Why Critical:** These are the core game loops. Players experience this flow in every battle.

---

### 🟡 Priority 2: Post-Battle Reward Processing

**Missing Coverage:** 15% - Only basic victory flow tested

5. **XP Distribution & Level-Up**
   - Scenario: Units gain XP and level up post-battle
   - Expected: XP distributed to survivors only
   - Expected: Level-up triggers stat recalculation
   - Expected: New abilities unlocked at level threshold
   - Expected: HP restored to new max on level-up

6. **Gold Rewards**
   - Scenario: Gold earned from battle
   - Expected: Gold added to team pool
   - Expected: Correct amount based on encounter definition

7. **Equipment Rewards (Fixed)**
   - Scenario: Battle drops fixed equipment
   - Expected: Equipment added to inventory
   - Expected: Correct item based on encounter definition

8. **Djinn Rewards (via Dialogue)**
   - Scenario: Post-battle dialogue grants Djinn (house-08 → Fizz, house-15 → Squall)
   - Expected: Djinn added to `collectedDjinn` array
   - Expected: Cannot collect duplicates
   - Expected: Max 12 Djinn limit enforced

9. **Unit Recruitment (via Dialogue)**
   - Scenario: Post-battle dialogue recruits unit
   - Expected: Unit added to roster at party average level
   - Expected: New unit available for next battle

**Why Important:** Rewards are player motivation. Bugs here break progression.

---

### 🟡 Priority 3: Djinn System Integration

**Missing Coverage:** 40% - Basic activation tested, but not collection/synergy

10. **Djinn Collection Scenarios**
    - Scenario: Collect first Djinn (Flint - starting)
    - Expected: Djinn in `collectedDjinn` array
    - Scenario: Collect via dialogue effect (`grantDjinn`)
    - Expected: Djinn added, no duplicates allowed
    - Scenario: Try to collect duplicate
    - Expected: Error returned
    - Scenario: Try to collect 13th Djinn
    - Expected: Error, max 12 enforced

11. **Djinn Equipping Scenarios**
    - Scenario: Equip collected Djinn to team slot
    - Expected: Djinn in `equippedDjinn` array (max 3)
    - Expected: Tracker created in `Set` state
    - Scenario: Unequip Djinn
    - Expected: Djinn removed from `equippedDjinn`, tracker deleted

12. **Djinn Synergy Bonuses**
    - Scenario: 3 same-element Djinn equipped (Venus/Venus/Venus)
    - Expected: +12 ATK, +8 DEF bonus applied to all units
    - Scenario: Mixed elements equipped (Venus/Mars/Mercury)
    - Expected: Balanced bonuses applied
    - Scenario: No Djinn equipped
    - Expected: No bonuses

13. **Djinn Activation & Recovery**
    - ✅ Partially tested in battle-integration-comprehensive.test.ts
    - Missing: Test full recovery cycle (3 turns)
    - Missing: Test multiple Djinn activation in same round
    - Missing: Test Djinn reset to Set after battle victory

**Why Important:** Djinn are a core progression mechanic. Synergy bonuses are critical for late-game.

---

### 🟢 Priority 4: Element Advantage System

**Missing Coverage:** 10% - Only basic elemental damage tested

14. **Element Advantage in Combat**
    - Scenario: Venus attacks Mars enemy (advantage)
    - Expected: 1.5× damage multiplier
    - Scenario: Venus attacks Jupiter enemy (disadvantage)
    - Expected: 0.67× damage multiplier
    - Scenario: Same element (Venus vs Venus)
    - Expected: 1.0× damage (no modifier)

15. **Element Advantage with Psynergy**
    - Scenario: Mars unit casts Fireball on Venus enemy
    - Expected: 1.5× damage
    - Scenario: Mars unit casts Fireball on Mercury enemy
    - Expected: 0.67× damage

16. **Element Wheel Validation**
    - Verify: Venus > Mars > Jupiter > Mercury > Venus

**Why Important:** Element strategy is key to tactical combat. Players need to see clear damage differences.

---

### 🟢 Priority 5: Combat Edge Cases

**Missing Coverage:** 60% - Some edge cases tested, many missing

17. **Multi-Target Abilities**
    - Scenario: AoE ability (e.g., Quake) targets all enemies
    - Expected: All alive enemies take damage
    - Expected: Dead enemies not targeted

18. **Healing Abilities**
    - Scenario: Unit casts healing ability on ally
    - Expected: HP restored (capped at maxHp)
    - Expected: Healing events logged

19. **Status Effects**
    - Scenario: Unit inflicts buff/debuff
    - Expected: Status tracked on unit
    - Expected: Duration decremented each round
    - Expected: Effect removed when duration = 0

20. **Speed Buff/Debuff Timing**
    - Scenario: Speed buff cast in Round 1
    - Expected: Takes effect at end of Round 1
    - Expected: Turn order adjusted for Round 2

21. **Critical Hits**
    - Scenario: High-level, high-luck unit attacks
    - Expected: Critical hits occur (RNG-based but deterministic)
    - Expected: Damage multiplied

22. **Dodge/Miss**
    - Scenario: Low-accuracy attacker vs high-SPD defender
    - Expected: Misses occur (deterministic with PRNG)
    - Expected: No damage dealt on miss

**Why Important:** These edge cases make combat feel deep and tactical.

---

### 🟢 Priority 6: Full Progression Paths

**Missing Coverage:** 30% - Basic progression tested, but not full paths

23. **Multi-Battle Progression**
    - Scenario: Play house-01 → house-02 → house-03
    - Expected: XP accumulates across battles
    - Expected: Equipment persists between battles
    - Expected: Roster grows with each recruitment

24. **Leveling Up Unlocks Abilities**
    - Scenario: Unit at level 4 with 95% XP
    - Expected: Battle victory gives enough XP to reach level 5
    - Expected: Level 5 ability unlocked immediately
    - Expected: New ability usable in next battle

25. **Equipment Swapping Between Battles**
    - Scenario: Win battle with equipment drop
    - Expected: Equipment added to inventory
    - Scenario: Equip new item to unit before next battle
    - Expected: Stat bonuses applied in next battle

**Why Important:** This is the core progression loop. Players need to feel growth.

---

## Priority Ranking Summary

| Priority | Category | Missing Tests | Impact | Effort |
|----------|----------|--------------|--------|--------|
| 🔴 P1 | Mode Transitions | 4 scenarios | CRITICAL | Medium |
| 🟡 P2 | Reward Processing | 5 scenarios | HIGH | Low |
| 🟡 P3 | Djinn System | 4 scenarios | HIGH | Low |
| 🟢 P4 | Element Advantages | 3 scenarios | MEDIUM | Low |
| 🟢 P5 | Combat Edge Cases | 6 scenarios | MEDIUM | Medium |
| 🟢 P6 | Progression Paths | 3 scenarios | MEDIUM | High |

**Total Missing Tests:** 25 scenarios
**Total New Test Files Needed:** 4-5

---

## Recommended Test Files to Create

### 1. `tests/gameplay/mode-transitions.test.ts` (P1)
- Full flow: overworld → team-select → battle → rewards → dialogue → overworld
- Equipment choice handling
- Recruitment dialogue triggering
- EncounterId preservation across mode changes

### 2. `tests/gameplay/reward-processing.test.ts` (P2)
- XP distribution to survivors
- Level-up and ability unlocking
- Gold rewards
- Fixed equipment rewards
- Equipment choice rewards

### 3. `tests/gameplay/djinn-integration.test.ts` (P3)
- Collection (via dialogue, story flags, pre-game)
- Equipping/unequipping
- Synergy bonuses (same element vs mixed)
- Activation and recovery (full cycle)
- Post-battle reset to Set state

### 4. `tests/gameplay/element-advantage.test.ts` (P4)
- Full element wheel testing (Venus → Mars → Jupiter → Mercury → Venus)
- Advantage multipliers (1.5×, 0.67×, 1.0×)
- Psynergy element advantages
- Same-element neutral damage

### 5. `tests/gameplay/combat-edge-cases.test.ts` (P5)
- Multi-target abilities
- Healing abilities
- Status effects (buffs/debuffs, duration)
- Speed changes (end-of-round application)
- Critical hits (deterministic)
- Dodge/miss mechanics

---

## Next Steps

1. **Write Priority 1 tests first** - Mode transitions are critical and completely untested
2. **Write Priority 2-3 tests** - Reward and Djinn flows are high-impact
3. **Write Priority 4-5 tests** - Element and edge cases add depth
4. **Consider Priority 6 later** - Full progression paths are integration tests (expensive to maintain)

---

## Notes on Testing Strategy

### Use Deterministic Seeds
- All tests should use `makePRNG(seed)` for reproducibility
- Different seeds for different test cases to avoid false positives

### Follow Existing Patterns
- Use `mkUnit()`, `mkEnemy()`, `mkTeam()` from `src/test/factories.ts`
- Use `test()` not `it()`
- Focus on meaningful scenarios, not isolated unit tests

### Test Against Real Data
- Use `ENCOUNTERS`, `ABILITIES`, `EQUIPMENT`, `DJINN` from definitions
- Don't mock data unless necessary for edge case isolation

### Avoid Brittleness
- Don't test exact damage numbers (RNG variance)
- Test ranges and comparisons instead (e.g., "more damage than...")
- Use timeouts for multi-round battles (max 20 rounds)

---

## Coverage Gaps That Remain

Even after writing the recommended tests, these areas will still need coverage:
- Shop system integration
- Save/load game state
- Tower mode (if implemented)
- Dev mode utilities
- UI-specific behavior (requires E2E tests, not unit tests)

These are out of scope for gameplay integration tests and should be covered by:
- E2E tests (Playwright/Puppeteer) for UI flows
- Service tests for shop/save/tower logic
- Manual QA for dev mode utilities
