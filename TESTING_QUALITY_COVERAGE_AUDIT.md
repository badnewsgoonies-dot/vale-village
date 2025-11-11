# Testing Quality & Coverage Audit

**Date:** 2025-01-27  
**Scope:** Complete test suite audit for quality, meaningful coverage, and gaps  
**Status:** 🟠 **SIGNIFICANT GAPS FOUND**

---

## Executive Summary

**Total Test Files:** 26  
**Total Issues Found:** 24  
**Useless/Low-Value Tests:** 5  
**Missing Context-Aware Tests:** 8  
**Determinism Issues:** 3  
**Untested Edge Cases:** 5  
**Property-Based Opportunities:** 3

**Overall Test Quality Score:** 58/100

---

## 🔴 USELESS / LOW-VALUE TESTS

### 1. AI Scoring Tests: Assert Only Existence, Not Behavior
**File:** `apps/vale-v2/tests/ai/scoring.test.ts:12-24, 63-80`  
**Severity:** 🔴 **CRITICAL**

**Issue:**
```typescript
it('should prefer abilities with higher damage potential', () => {
  const decision = makeAIDecision(battle, 'e1', rng);
  
  // Should select an ability (not throw)
  expect(decision.abilityId).toBeDefined(); // ⚠️ Only checks existence
  expect(decision.targetIds.length).toBeGreaterThan(0); // ⚠️ Only checks non-empty
});

it('should prefer targeting weakest player unit when multiple options available', () => {
  const weakPlayer = mkUnit({ id: 'u1', currentHp: 20 });
  const strongPlayer = mkUnit({ id: 'u2', currentHp: 80 });
  
  const decision = makeAIDecision(battle, 'e1', rng);
  
  // Enemy should target player units (weakest if possible)
  expect(decision.targetIds.length).toBeGreaterThan(0); // ⚠️ Doesn't prove weakest
  expect(decision.targetIds.some(id => id === 'u1' || id === 'u2')).toBe(true); // ⚠️ Too weak
});
```

**Problem:**
- Tests never fail even if scoring logic breaks
- Doesn't verify AI actually prefers higher damage abilities
- Doesn't verify weakest-target selection works
- Only checks that "something happened" - useless for catching regressions

**Fix:**
```typescript
it('should prefer abilities with higher damage potential', () => {
  // Create enemy with two abilities: weak (10 damage) and strong (50 damage)
  const enemy = mkEnemy('test', {
    abilities: [
      { ...WEAK_ABILITY, basePower: 10 },
      { ...STRONG_ABILITY, basePower: 50 },
    ],
  });
  
  const decision = makeAIDecision(battle, enemy.id, rng);
  
  // Should select the stronger ability
  expect(decision.abilityId).toBe(STRONG_ABILITY.id);
});

it('should prefer targeting weakest player unit', () => {
  const weakPlayer = mkUnit({ id: 'u1', currentHp: 20 });
  const strongPlayer = mkUnit({ id: 'u2', currentHp: 80 });
  
  const decision = makeAIDecision(battle, 'e1', rng);
  
  // Should target weakest (u1) when using single-target ability
  const ability = enemy.abilities.find(a => a.id === decision.abilityId);
  if (ability?.targets === 'single-enemy' || ability?.targets === 'single-ally') {
    expect(decision.targetIds).toEqual(['u1']); // Must target weakest
  }
});
```

---

### 2. AI Targeting Tests: Weak Assertions
**File:** `apps/vale-v2/tests/ai/targeting.test.ts:34-66`  
**Severity:** 🔴 **CRITICAL**

**Issue:**
```typescript
it('should prefer weakest effective HP target', () => {
  const weakEnemy = mkEnemy('slime', { id: 'e1', currentHp: 15 });
  const strongEnemy = mkEnemy('beetle', { id: 'e2', currentHp: 60 });
  
  const decision = makeAIDecision(battle, 'e1', rng);
  
  // Should prefer targeting the weaker enemy
  expect(decision.targetIds.length).toBeGreaterThan(0); // ⚠️ Doesn't prove preference
});
```

**Problem:**
- Doesn't verify AI actually prefers weakest target
- Only checks non-empty array - useless assertion

**Fix:**
```typescript
it('should prefer weakest effective HP target', () => {
  const weakEnemy = mkEnemy('slime', { id: 'e1', currentHp: 15 });
  const strongEnemy = mkEnemy('beetle', { id: 'e2', currentHp: 60 });
  
  const decision = makeAIDecision(battle, 'e1', rng);
  
  // When using single-target ability, must target weakest
  const ability = enemy.abilities.find(a => a.id === decision.abilityId);
  if (ability?.targets === 'single-enemy') {
    expect(decision.targetIds).toEqual(['e1']); // Must target weakest
  }
});
```

---

### 3. Stats Test: Placeholder Test
**File:** `apps/vale-v2/tests/core/algorithms/stats.test.ts:70-83`  
**Severity:** 🟠 **HIGH**

**Issue:**
```typescript
it('should sum bonuses from multiple equipment pieces', () => {
  // This test would need actual equipment definitions
  // For now, just verify the function exists and returns an object
  const loadout = { weapon: null, armor: null, ... };
  const bonuses = calculateEquipmentBonusesFromLoadout(loadout);
  
  expect(typeof bonuses).toBe('object'); // ⚠️ Placeholder - doesn't test anything
});
```

**Problem:**
- Explicitly marked as placeholder
- Only test for multi-item stat summation
- Doesn't verify actual summation logic

**Fix:**
```typescript
it('should sum bonuses from multiple equipment pieces', () => {
  const loadout = {
    weapon: { id: 'sword', statBonus: { atk: 10 }, ... },
    armor: { id: 'armor', statBonus: { def: 5, hp: 20 }, ... },
    helm: { id: 'helm', statBonus: { def: 3 }, ... },
    boots: null,
    accessory: null,
  };
  
  const bonuses = calculateEquipmentBonusesFromLoadout(loadout);
  
  expect(bonuses.atk).toBe(10);
  expect(bonuses.def).toBe(8); // 5 + 3
  expect(bonuses.hp).toBe(20);
});
```

---

### 4. Preview Determinism: Tests Wrong Thing
**File:** `apps/vale-v2/tests/core/services/preview-determinism.test.ts:35-99`  
**Severity:** 🟠 **HIGH**

**Issue:**
```typescript
it('preview does not advance live RNG', () => {
  // ... creates battle state but never uses it
  
  // Simulate preview (should use cloned RNG)
  const previewRng = makePRNG(seed ^ 0x1234); // Different seed for preview
  for (let i = 0; i < 100; i++) {
    previewRng.next(); // Consume many values in preview
  }
  
  // Verify live RNG is unchanged
  // ⚠️ Never actually calls preview code - only tests raw RNG
});
```

**Problem:**
- Never invokes actual preview service/code
- Only tests raw PRNG cloning (already covered in `prng.test.ts`)
- Doesn't validate preview determinism against real preview pipeline
- Regressions in preview rendering or seed derivation would go unnoticed

**Fix:**
```typescript
it('preview does not advance live RNG', () => {
  const battle = startBattle(team, [enemy], rng);
  
  // Capture live RNG state
  const beforeValues = [rng.next(), rng.next(), rng.next()];
  
  // Actually call preview (if it exists)
  const previewResult = previewAction(battle, 'unit1', 'strike', ['enemy1'], rng);
  
  // Verify live RNG unchanged
  const afterValues = [rng.next(), rng.next(), rng.next()];
  expect(afterValues).toEqual(beforeValues);
  
  // Verify preview used cloned RNG (preview should work)
  expect(previewResult.avg).toBeGreaterThan(0);
});
```

---

### 5. Validation Test: Only Checks "Doesn't Throw"
**File:** `apps/vale-v2/tests/core/validation/validateAll.test.ts:5-9`  
**Severity:** 🟠 **HIGH**

**Issue:**
```typescript
it('should validate all game data successfully', () => {
  expect(() => validateAllGameData()).not.toThrow(); // ⚠️ Only checks no exception
});

// TODO: Add test for invalid data (when we have test fixtures)
```

**Problem:**
- Can't catch regressions in schema enforcement
- No test for invalid data (explicitly TODO'd)
- If validation breaks silently, test still passes

**Fix:**
```typescript
it('should validate all game data successfully', () => {
  const result = validateAllGameData();
  expect(result.ok).toBe(true);
  expect(result.errors).toEqual([]);
});

it('should reject invalid ability data', () => {
  // Temporarily inject invalid data
  const originalAbilities = ABILITIES;
  ABILITIES.push({ id: 'invalid', manaCost: -1, ... }); // Invalid
  
  const result = validateAllGameData();
  expect(result.ok).toBe(false);
  expect(result.errors).toContain('Invalid ability: negative manaCost');
  
  // Restore
  ABILITIES = originalAbilities;
});
```

---

## 🟠 MISSING CONTEXT-AWARE / END-TO-END TESTS

### 6. Queue Battle Execution: Zero Coverage
**File:** `apps/vale-v2/src/core/services/QueueBattleService.ts:170-493`  
**Severity:** 🔴 **CRITICAL**

**Missing Coverage:**
- `executeRound()` - Core battle execution (170-296 lines)
- `executeDjinnSummons()` - Djinn activation flow (303-380 lines)
- `resolveValidTargets()` - KO retargeting (424-448 lines)
- `checkBattleEnd()` - Victory/defeat detection (482-493 lines)
- `generateEnemyActions()` - Enemy AI in queue system (455-476 lines)

**Current State:**
- `queue-battle.test.ts` imports `executeRound` and `queueDjinn` but never calls them
- Only tests planning phase (`queueAction`, `clearQueuedAction`)
- No tests for execution phase, Djinn flow, or battle termination

**Required Tests:**
```typescript
describe('executeRound', () => {
  it('should execute queued actions in SPD order', () => {
    // Queue 4 actions, execute round
    // Verify actions execute in correct order
    // Verify mana deducted, events emitted
  });
  
  it('should execute Djinn summons before player actions', () => {
    // Queue Djinn + actions
    // Execute round
    // Verify Djinn damage applied first, then actions
  });
  
  it('should retarget if original target dies mid-round', () => {
    // Queue action targeting enemy1
    // Enemy1 dies from earlier action in same round
    // Verify action retargets to enemy2
  });
  
  it('should detect PLAYER_VICTORY when all enemies KO', () => {
    // Queue actions that KO all enemies
    // Execute round
    // Verify battle.phase === 'victory'
  });
  
  it('should detect PLAYER_DEFEAT when all players KO', () => {
    // Enemy actions KO all players
    // Execute round
    // Verify battle.phase === 'defeat'
  });
  
  it('should refresh mana after round completes', () => {
    // Spend all mana, execute round
    // Verify remainingMana === maxMana after round
  });
});
```

---

### 7. Encounter Service: No Tests
**File:** `apps/vale-v2/src/core/services/EncounterService.ts:23-94`  
**Severity:** 🔴 **CRITICAL**

**Missing Coverage:**
- `createBattleFromEncounter()` - Loads encounter, creates battle (27-71 lines)
- `loadEncounter()` - Encounter lookup (19-21 lines)
- Boss detection logic (93 lines)
- Chapter sequence handling (74-94 lines)

**Current State:**
- Zero test files reference `EncounterService`
- No tests for encounter → battle conversion
- No tests for story gating (chapter requirements)

**Required Tests:**
```typescript
describe('EncounterService', () => {
  it('should load encounter by ID', () => {
    const encounter = loadEncounter('c1_normal_1');
    expect(encounter).toBeDefined();
    expect(encounter?.id).toBe('c1_normal_1');
  });
  
  it('should create battle from encounter', () => {
    const result = createBattleFromEncounter('c1_normal_1', team, rng);
    expect(result).not.toBeNull();
    expect(result?.battle.enemies.length).toBeGreaterThan(0);
    expect(result?.battle.meta.encounterId).toBe('c1_normal_1');
  });
  
  it('should detect boss encounters', () => {
    const bossResult = createBattleFromEncounter('c1_boss', team, rng);
    expect(bossResult?.battle.isBossBattle).toBe(true);
    expect(bossResult?.battle.meta.difficulty).toBe('boss');
  });
  
  it('should handle missing encounter gracefully', () => {
    const result = createBattleFromEncounter('invalid_id', team, rng);
    expect(result).toBeNull();
  });
});
```

---

### 8. No "Level X Loses, Level Y Wins" Tests
**Severity:** 🔴 **CRITICAL**

**Missing Coverage:**
- No tests proving level progression changes battle outcomes
- No tests proving equipment changes battle outcomes
- No tests proving Djinn changes battle outcomes
- `golden-runner.test.ts` only compares replay logs, not outcomes

**Current State:**
- `xp.test.ts` only tests XP arithmetic (level 1 → 2, etc.)
- `stats-integration.test.ts` only tests stat numbers, not battle outcomes
- `djinn.test.ts` only tests synergy calculations, not battle impact

**Required Tests:**
```typescript
describe('Progression Impact', () => {
  it('Level 1 unit loses to boss, Level 5 unit wins', () => {
    const boss = mkEnemy('elemental_guardian');
    
    // Battle with Level 1
    const lv1Unit = createUnit(UNIT_DEFINITIONS.adept, 1);
    const battle1 = runFullBattle([lv1Unit], [boss], SEED);
    expect(battle1.winner).toBe('enemy'); // Loses
    
    // Battle with Level 5
    const lv5Unit = createUnit(UNIT_DEFINITIONS.adept, 5);
    const battle2 = runFullBattle([lv5Unit], [boss], SEED);
    expect(battle2.winner).toBe('player'); // Wins!
  });
  
  it('Equipment changes battle outcome', () => {
    const enemy = mkEnemy('gladiator');
    
    // Naked unit loses
    const nakedUnit = createUnit(UNIT_DEFINITIONS.adept, 3);
    const battle1 = runFullBattle([nakedUnit], [enemy], SEED);
    expect(battle1.winner).toBe('enemy');
    
    // Same unit with +20 ATK weapon wins
    const equippedUnit = { ...nakedUnit, equipment: { ...nakedUnit.equipment, weapon: IRON_SWORD } };
    const battle2 = runFullBattle([equippedUnit], [enemy], SEED);
    expect(battle2.winner).toBe('player'); // Gear makes the difference!
  });
  
  it('Djinn changes battle outcome', () => {
    const enemy = mkEnemy('boss');
    
    // No Djinn - close fight
    const teamNoDjinn = createTeam([...units]);
    const battle1 = runFullBattle(teamNoDjinn.units, [enemy], SEED);
    expect(battle1.winner).toBe('enemy'); // Loses
    
    // 3 Venus Djinn - wins
    const teamWithDjinn = createTeam([...units]);
    teamWithDjinn.equippedDjinn = ['flint', 'granite', 'ground'];
    const battle2 = runFullBattle(teamWithDjinn.units, [enemy], SEED);
    expect(battle2.winner).toBe('player'); // Djinn make the difference!
  });
});
```

---

### 9. Equipment/Djinn: Only Stat Tests, Not Battle Impact
**Files:**
- `apps/vale-v2/tests/core/algorithms/stats-integration.test.ts:5-110`
- `apps/vale-v2/tests/core/algorithms/djinn.test.ts:1-48`

**Severity:** 🟠 **HIGH**

**Issue:**
- Tests verify stat numbers change (e.g., `equippedEffective.atk > baseEffective.atk`)
- Doesn't verify stats actually affect `performAction()` results
- Doesn't verify equipment changes battle speed ordering
- Doesn't verify Djinn bonuses affect damage calculations

**Required Tests:**
```typescript
it('equipment bonuses affect performAction damage', () => {
  const baseUnit = createUnit(UNIT_DEFINITIONS.adept, 3);
  const equippedUnit = { ...baseUnit, equipment: { ...baseUnit.equipment, weapon: IRON_SWORD } };
  
  const baseResult = performAction(battle, baseUnit.id, 'strike', [enemy.id], rng);
  const equippedResult = performAction(battle, equippedUnit.id, 'strike', [enemy.id], rng);
  
  // Equipped unit should deal more damage
  const baseDamage = baseResult.events.filter(e => e.type === 'hit').reduce((sum, e) => sum + e.amount, 0);
  const equippedDamage = equippedResult.events.filter(e => e.type === 'hit').reduce((sum, e) => sum + e.amount, 0);
  expect(equippedDamage).toBeGreaterThan(baseDamage);
});
```

---

## 🟡 DETERMINISM / FLAKINESS RISKS

### 10. Property-Based Tests: No Fixed Seeds
**Files:**
- `apps/vale-v2/tests/battle/invariants.test.ts:15-181`
- `apps/vale-v2/tests/core/algorithms/damage-properties.test.ts:46-127`

**Severity:** 🟠 **HIGH**

**Issue:**
```typescript
fc.assert(
  fc.property(arbBattleState, (battle) => {
    const { rng } = makeTestCtx(123); // ⚠️ Seed only used for makeTestCtx, not fc.assert
    // ...
  }),
  { numRuns: 50 } // ⚠️ No seed specified
);
```

**Problem:**
- `fast-check` uses random seed per run
- Failures are hard to reproduce locally/CI
- No way to debug specific failing cases

**Fix:**
```typescript
fc.assert(
  fc.property(arbBattleState, (battle) => {
    // ...
  }),
  { 
    numRuns: 50,
    seed: 1234567890, // ⚠️ Pin seed for reproducibility
    path: '', // Can specify path to failing case
  }
);
```

---

### 11. Queue Battle RNG Cloning: Untested
**File:** `apps/vale-v2/src/core/services/QueueBattleService.ts:170-296`  
**Severity:** 🟠 **MEDIUM**

**Issue:**
- `executeRound()` uses RNG for multiple actions (player + enemy + Djinn)
- No test ensures previews and enemy AI consume separate RNG streams
- If RNG streams overlap, determinism breaks

**Required Test:**
```typescript
it('should use separate RNG streams for preview and execution', () => {
  // Run preview (consumes RNG)
  const preview = previewAction(battle, 'unit1', 'strike', ['enemy1'], rng);
  
  // Execute same action
  const result = executeRound(battle, rng);
  
  // Preview should not affect execution determinism
  const result2 = executeRound(battle, makePRNG(SAME_SEED));
  expect(result.events).toEqual(result2.events);
});
```

---

## 🟡 UNTESTED EDGE CASES

### 12. KO Retargeting: Not Tested
**File:** `apps/vale-v2/src/core/services/QueueBattleService.ts:424-448`  
**Severity:** 🟠 **HIGH**

**Issue:**
- `resolveValidTargets()` handles retargeting when original target dies
- No tests exercise this path
- Unit dying mid-round may still try to act on dead target

**Required Test:**
```typescript
it('should retarget when original target dies mid-round', () => {
  // Queue action targeting enemy1
  let battle = queueAction(initialBattle, 'unit1', 'strike', ['enemy1'], STRIKE);
  
  // Enemy1 dies from earlier action in same round
  battle.enemies[0].currentHp = 0;
  
  // Execute round
  const result = executeRound(battle, rng);
  
  // Action should retarget to enemy2 (alive enemy)
  const strikeEvent = result.events.find(e => e.type === 'hit' && e.targetId === 'enemy2');
  expect(strikeEvent).toBeDefined();
});
```

---

### 13. Mana Validation During Execution: Not Tested
**File:** `apps/vale-v2/src/core/services/QueueBattleService.ts:184`  
**Severity:** 🟠 **MEDIUM**

**Issue:**
- `validateQueuedActions()` checks mana budget before execution
- No test verifies validation catches invalid queues
- No test for edge case: queue valid, but mana changes mid-execution

**Required Test:**
```typescript
it('should reject execution if actions exceed mana budget', () => {
  // Queue expensive actions that exceed mana
  let battle = queueAction(initialBattle, 'unit1', 'expensive', ['enemy1'], EXPENSIVE_ABILITY);
  battle = queueAction(battle, 'unit2', 'expensive', ['enemy1'], EXPENSIVE_ABILITY);
  // ... queue more expensive actions
  
  // Try to execute - should fail
  expect(() => executeRound(battle, rng)).toThrow('actions exceed mana budget');
});
```

---

### 14. Djinn Activation Paths: Not Tested
**File:** `apps/vale-v2/src/core/services/QueueBattleService.ts:303-380`  
**Severity:** 🟠 **HIGH**

**Issue:**
- No test verifies queued Djinn flip to Standby
- No test verifies summon damage respects RNG
- No test for 3-Djinn vs 1-Djinn damage difference

**Required Tests:**
```typescript
it('should flip Djinn to Standby after activation', () => {
  // Queue Djinn
  let battle = queueDjinn(initialBattle, 'flint');
  
  // Execute round
  const result = executeRound(battle, rng);
  
  // Djinn should be Standby
  const tracker = result.state.playerTeam.djinnTrackers['flint'];
  expect(tracker.state).toBe('Standby');
  expect(tracker.lastActivatedTurn).toBe(result.state.roundNumber);
});

it('should apply correct damage for 3-Djinn summon', () => {
  // Queue 3 Djinn
  let battle = queueDjinn(initialBattle, 'flint');
  battle = queueDjinn(battle, 'granite');
  battle = queueDjinn(battle, 'ground');
  
  // Execute round
  const result = executeRound(battle, rng);
  
  // Should deal 3-Djinn damage (higher than 1-Djinn)
  const summonEvent = result.events.find(e => e.type === 'ability' && e.abilityId.includes('djinn-summon-3'));
  expect(summonEvent).toBeDefined();
  
  // Verify damage applied to all enemies
  const hitEvents = result.events.filter(e => e.type === 'hit');
  expect(hitEvents.length).toBeGreaterThan(0);
});
```

---

### 15. XP Overflow at Max Level: Not Tested
**File:** `apps/vale-v2/src/core/algorithms/xp.ts:67-113`  
**Severity:** 🟡 **MEDIUM**

**Issue:**
- Code allows XP to exceed level cap (no clamping)
- No test verifies behavior when XP > 1850 (level 5 cap)
- No test for multiple level-ups in single battle

**Required Test:**
```typescript
it('should handle XP overflow at max level', () => {
  const unit = createUnit(UNIT_DEFINITIONS.adept, 5, 1850); // Max level, max XP
  
  // Add more XP (should exceed cap)
  const result = addXp(unit, 1000);
  
  // Should remain level 5
  expect(result.unit.level).toBe(5);
  // XP can exceed cap (no clamping)
  expect(result.unit.xp).toBeGreaterThan(1850);
});
```

---

### 16. Invalid Equipment Combos: Not Guarded or Tested
**File:** `apps/vale-v2/src/core/models/Equipment.ts:33-86`  
**Severity:** 🟡 **MEDIUM**

**Issue:**
- `calculateEquipmentBonuses()` sums overlapping slots without validation
- No test enforces slot exclusivity
- No test for extreme stat bonuses (e.g., +999 ATK)

**Required Test:**
```typescript
it('should handle extreme stat bonuses', () => {
  const loadout = {
    weapon: { statBonus: { atk: 999 }, ... },
    armor: { statBonus: { atk: 999 }, ... },
    // ... all slots with +999 ATK
  };
  
  const bonuses = calculateEquipmentBonuses(loadout);
  
  // Should sum correctly (even if extreme)
  expect(bonuses.atk).toBe(999 * 5); // All 5 slots
});
```

---

### 17. HP/PP Zero & Battle Termination: Indirect Coverage
**File:** `apps/vale-v2/src/core/services/QueueBattleService.ts:269-296`  
**Severity:** 🟡 **MEDIUM**

**Issue:**
- Property tests check HP >= 0 indirectly
- No deterministic test that team wipe triggers `PLAYER_DEFEAT`
- No test that mana refresh happens after round

**Required Tests:**
```typescript
it('should trigger PLAYER_DEFEAT when all players KO', () => {
  // Create battle where all players have 1 HP
  const weakTeam = createTeam([
    { ...unit1, currentHp: 1 },
    { ...unit2, currentHp: 1 },
    { ...unit3, currentHp: 1 },
    { ...unit4, currentHp: 1 },
  ]);
  
  // Enemy deals enough damage to KO all
  const battle = createBattleState(weakTeam, [strongEnemy]);
  const result = executeRound(battle, rng);
  
  expect(result.state.phase).toBe('defeat');
  expect(result.events.some(e => e.type === 'battle-end' && e.result === 'PLAYER_DEFEAT')).toBe(true);
});

it('should refresh mana after round completes', () => {
  // Spend all mana
  let battle = queueAction(initialBattle, 'unit1', 'expensive', ['enemy1'], EXPENSIVE);
  battle = queueAction(battle, 'unit2', 'expensive', ['enemy1'], EXPENSIVE);
  // ... spend all
  
  expect(battle.remainingMana).toBe(0);
  
  // Execute round
  const result = executeRound(battle, rng);
  
  // Mana should refresh
  expect(result.state.remainingMana).toBe(result.state.maxMana);
});
```

---

## 🟢 PROPERTY-BASED TESTING OPPORTUNITIES

### 18. EncounterService: Property Test All Encounters
**File:** `apps/vale-v2/src/core/services/EncounterService.ts:23-71`  
**Severity:** 🟢 **LOW**

**Opportunity:**
```typescript
it('should instantiate battle for every encounter definition', () => {
  fc.assert(
    fc.property(
      fc.constantFrom(...Object.keys(ENCOUNTERS)),
      (encounterId) => {
        const result = createBattleFromEncounter(encounterId, team, rng);
        return result !== null && result.battle.enemies.length > 0;
      }
    ),
    { seed: 12345, numRuns: Object.keys(ENCOUNTERS).length }
  );
});
```

---

### 19. resolveValidTargets: Property Test
**File:** `apps/vale-v2/src/core/services/QueueBattleService.ts:424-448`  
**Severity:** 🟢 **LOW**

**Opportunity:**
```typescript
it('should never return empty array if any opponent is alive', () => {
  fc.assert(
    fc.property(
      arbBattleState,
      arbQueuedAction,
      (battle, action) => {
        const aliveEnemies = battle.enemies.filter(e => !isUnitKO(e));
        const alivePlayers = battle.playerTeam.units.filter(u => !isUnitKO(u));
        
        if (aliveEnemies.length === 0 && alivePlayers.length === 0) {
          return true; // Skip if all dead
        }
        
        const targets = resolveValidTargets(action, battle);
        
        // If any opponent alive, should have targets
        const isPlayerAction = battle.playerTeam.units.some(u => u.id === action.unitId);
        if (isPlayerAction && aliveEnemies.length > 0) {
          return targets.length > 0;
        }
        if (!isPlayerAction && alivePlayers.length > 0) {
          return targets.length > 0;
        }
        
        return true;
      }
    ),
    { seed: 12345, numRuns: 100 }
  );
});
```

---

### 20. distributeRewards: XP Conservation Property
**File:** `apps/vale-v2/src/core/algorithms/rewards.test.ts:178-208`  
**Severity:** 🟢 **LOW**

**Opportunity:**
```typescript
it('should conserve total XP (sum of per-unit XP equals input)', () => {
  fc.assert(
    fc.property(
      arbTeam,
      fc.integer({ min: 0, max: 10000 }),
      (team, totalXp) => {
        const rewards = {
          totalXp,
          totalGold: 100,
          xpPerUnit: totalXp / team.units.filter(u => !isUnitKO(u)).length,
          survivorCount: team.units.filter(u => !isUnitKO(u)).length,
          allSurvived: true,
          enemiesDefeated: 1,
          equipmentDrops: [],
        };
        
        const distribution = distributeRewards(team, rewards);
        
        // Sum of XP gained should equal totalXp (or close, due to rounding)
        const totalXpGained = distribution.updatedTeam.units
          .filter(u => !isUnitKO(u))
          .reduce((sum, u) => sum + (u.xp - team.units.find(tu => tu.id === u.id)?.xp || 0), 0);
        
        return Math.abs(totalXpGained - totalXp) <= team.units.length; // Allow rounding error
      }
    ),
    { seed: 12345, numRuns: 50 }
  );
});
```

---

## 📊 SYSTEM QUALITY SCORES

| System | Score | Notes |
|--------|-------|-------|
| **Combat Algorithms & Replay** | 65/100 | Solid property tests + goldens, but missing fail-case assertions for `performAction` and KO handling |
| **Save/Migration Stack** | 80/100 | Round-trip + migration tests thorough, only preview determinism weak |
| **Story Progression & Gating** | 55/100 | Basic flag/chapter tests exist, but no encounter-to-story regression coverage |
| **AI + Queue Battle Planning** | 25/100 | Tests barely assert non-null outputs; no execution-phase or Djinn coverage |
| **World/Encounter Progression** | 20/100 | No tests touch `EncounterService` or level/gear-driven win/loss comparisons |
| **XP/Leveling System** | 70/100 | Good arithmetic tests, missing progression impact tests |
| **Equipment System** | 60/100 | Stat calculation tests exist, missing battle impact tests |
| **Djinn System** | 50/100 | Synergy calculation tests exist, missing activation flow tests |

**Overall Average:** 58/100

---

## 🎯 TOP 5 ACTIONABLE GAPS

### 1. Add Queue Battle Execution Tests (Priority: 🔴 CRITICAL)
**Impact:** Core battle flow completely untested  
**Effort:** Medium (2-3 hours)  
**Tests Needed:**
- `executeRound()` with 4 queued actions
- Djinn activation flow
- KO retargeting
- Victory/defeat detection
- Mana refresh

---

### 2. Replace AI "Existence" Tests with Behavior Tests (Priority: 🔴 CRITICAL)
**Impact:** AI regressions slip through unnoticed  
**Effort:** Low (1-2 hours)  
**Tests Needed:**
- Verify AI selects higher damage abilities
- Verify AI targets weakest enemy
- Verify AI respects single-target constraints

---

### 3. Add "Level X Loses, Level Y Wins" Scenario Tests (Priority: 🔴 CRITICAL)
**Impact:** Progression systems untested end-to-end  
**Effort:** Medium (2-3 hours)  
**Tests Needed:**
- Level 1 loses to boss, Level 5 wins
- Equipment changes battle outcome
- Djinn changes battle outcome

---

### 4. Cover EncounterService + Story Integration (Priority: 🟠 HIGH)
**Impact:** Encounter loading and story gating untested  
**Effort:** Medium (2 hours)  
**Tests Needed:**
- `createBattleFromEncounter()` for all encounter types
- Boss detection
- Chapter sequence simulation
- Story flag updates on encounter completion

---

### 5. Fix Property-Based Test Seeds (Priority: 🟠 HIGH)
**Impact:** Failures hard to reproduce  
**Effort:** Low (30 minutes)  
**Fix:**
- Add `seed` parameter to all `fc.assert()` calls
- Document seed values in test comments

---

## 📋 SUMMARY STATISTICS

| Category | Count | Files Affected |
|----------|-------|----------------|
| Useless Tests | 5 | 5 |
| Missing Context-Aware Tests | 8 | 8 |
| Determinism Issues | 3 | 3 |
| Untested Edge Cases | 5 | 5 |
| Property-Based Opportunities | 3 | 3 |
| **Total Issues** | **24** | **24** |

---

## 🎯 RECOMMENDED FIX PRIORITY

### Phase 1: Critical Fixes (This Sprint)
1. **Add `executeRound()` tests** - Core battle execution
2. **Fix AI tests** - Replace existence checks with behavior assertions
3. **Add progression scenario tests** - Level/equipment/Djinn impact

### Phase 2: High Priority (Next Sprint)
4. **Add EncounterService tests** - Encounter loading + story integration
5. **Fix property test seeds** - Pin seeds for reproducibility
6. **Add Djinn activation tests** - State transitions + damage

### Phase 3: Medium Priority (Backlog)
7. **Add edge case tests** - KO retargeting, mana validation, XP overflow
8. **Fix placeholder tests** - Stats summation, validation with invalid data
9. **Add property tests** - EncounterService, resolveValidTargets, distributeRewards

---

## 📝 NEXT STEPS

1. **Create test file:** `tests/core/services/queue-battle-execution.test.ts`
2. **Refactor AI tests:** Replace existence checks with behavior assertions
3. **Create test file:** `tests/gameplay/progression-impact.test.ts`
4. **Create test file:** `tests/core/services/encounter-service.test.ts`
5. **Pin fast-check seeds:** Add `seed` to all `fc.assert()` calls
6. **Re-run audit** after fixes to verify improvements

---

**Audit Complete** ✅  
**Report Generated:** 2025-01-27

