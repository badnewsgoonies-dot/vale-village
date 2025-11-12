# GAME MECHANICS OVERHAUL - Align Codebase with Instruction Booklet

**Date:** November 12, 2025  
**Priority:** CRITICAL  
**Estimated Effort:** 2-3 weeks  
**Model:** Claude 3.5 Sonnet (200k+ context)

---

## CONTEXT

The **VALE_CHRONICLES_INSTRUCTION_BOOKLET.md** defines the final game design. The codebase currently implements an older design with different mechanics. This prompt guides the complete overhaul to align code with the booklet.

**Reference Documents:**
- `VALE_CHRONICLES_INSTRUCTION_BOOKLET.md` - Source of truth for all mechanics
- `docs/architect/GAME_MECHANICS.md` - Updated technical specs
- `CLAUDE.md` - Architecture principles (must maintain)

---

## PHASE 1: REMOVE DEPRECATED SYSTEMS (Week 1, Days 1-3)

### Task 1.1: Remove Critical Hit System

**Files to Modify:**
- `apps/vale-v2/src/core/algorithms/damage.ts`
- `apps/vale-v2/src/core/services/BattleService.ts`
- `apps/vale-v2/src/core/constants.ts`
- `apps/vale-v2/tests/core/algorithms/damage.test.ts`

**Actions:**

1. **Remove `checkCriticalHit()` function** from `damage.ts`
2. **Remove crit check** from `BattleService.executeAbility()`:
   ```typescript
   // REMOVE THIS:
   const isCritical = (ability.type === 'physical' || ability.type === 'psynergy')
     && checkCriticalHit(caster, team, rng);
   
   // REMOVE THIS:
   if (isCritical) {
     damage = Math.floor(damage * BATTLE_CONSTANTS.CRITICAL_HIT_MULTIPLIER);
   }
   ```

3. **Remove constants** from `constants.ts`:
   - `BASE_CRIT_CHANCE`
   - `MAX_CRIT_CHANCE`
   - `CRIT_SPD_SCALING`
   - `CRITICAL_HIT_MULTIPLIER`

4. **Remove crit tests** from `damage.test.ts`

**Success Criteria:**
- No references to "crit" or "critical" in core/
- Damage is consistent (no 2× multiplier)
- All tests pass

---

### Task 1.2: Remove Evasion/Dodge System

**Files to Modify:**
- `apps/vale-v2/src/core/algorithms/damage.ts`
- `apps/vale-v2/src/core/services/BattleService.ts`
- `apps/vale-v2/src/core/constants.ts`
- `apps/vale-v2/src/data/schemas/EquipmentSchema.ts`
- `apps/vale-v2/src/core/models/Equipment.ts`

**Actions:**

1. **Remove `checkDodge()` function** from `damage.ts`

2. **Remove dodge check** from `BattleService.executeAbility()`:
   ```typescript
   // REMOVE THIS ENTIRE BLOCK:
   const dodged = checkDodge(caster, currentTarget, team, abilityAccuracy, rng);
   if (dodged) {
     anyDodged = true;
     // ... dodge handling ...
     continue;
   }
   ```

3. **Remove evasion property** from `EquipmentSchema.ts`:
   ```typescript
   // REMOVE THIS LINE:
   evasion: z.number().min(0).max(100).optional(),
   ```

4. **Remove evasion property** from `Equipment` interface in `Equipment.ts`

5. **Remove constants** from `constants.ts`:
   - `BASE_EVASION`
   - `MAX_EVASION`
   - `SPD_TO_EVASION_RATE`
   - `MIN_HIT_CHANCE`
   - `MAX_HIT_CHANCE`
   - `DEFAULT_ABILITY_ACCURACY`

**Success Criteria:**
- All attacks always hit (no dodge mechanic)
- No evasion references in schemas
- All tests pass

---

### Task 1.3: Remove Equipment Selling

**Files to Modify:**
- `apps/vale-v2/src/ui/components/ShopScreen.tsx`
- `apps/vale-v2/src/ui/state/inventorySlice.ts`

**Actions:**

1. **Remove 'sell' tab** from `ShopScreen.tsx`:
   ```typescript
   // CHANGE:
   type Tab = 'buy' | 'sell';
   // TO:
   type Tab = 'buy';
   
   // REMOVE all selling UI/logic
   ```

2. **Remove `removeEquipment()`** from `inventorySlice.ts`

3. **Update UI terminology**:
   - "Buy" → "Unlock"
   - "Purchase" → "Unlock Equipment"
   - Remove all selling price displays

**Success Criteria:**
- No sell tab in shop UI
- Equipment is permanent once unlocked
- UI shows "Unlock" terminology

---

### Task 1.4: Remove Random Damage Variance

**Files to Modify:**
- `apps/vale-v2/src/core/algorithms/damage.ts`
- `apps/vale-v2/src/core/constants.ts`

**Actions:**

1. **Remove `getRandomMultiplier()` calls** from damage calculations:
   ```typescript
   // BEFORE:
   const rawDamage = (baseDamage + attackPower - (defense * 0.5)) * getRandomMultiplier(rng);
   
   // AFTER:
   const rawDamage = baseDamage + attackPower - (defense * 0.5);
   ```

2. **Remove variance constants**:
   - `DAMAGE_VARIANCE_MIN`
   - `DAMAGE_VARIANCE_RANGE`

3. **Update tests** to expect consistent damage

**Success Criteria:**
- Same inputs = same damage every time
- No randomness in damage (deterministic)

---

## PHASE 2: IMPLEMENT AUTO-HEAL (Week 1, Day 4)

### Task 2.1: Add Post-Battle Auto-Heal

**Files to Modify:**
- `apps/vale-v2/src/ui/state/queueBattleSlice.ts`
- `apps/vale-v2/src/ui/state/battleSlice.ts`
- `apps/vale-v2/src/core/services/QueueBattleService.ts` (optional helper)

**Actions:**

1. **Add auto-heal after victory** in `queueBattleSlice.ts`:
   ```typescript
   if (result.state.phase === 'victory') {
     // Auto-heal all units
     const healedUnits = result.state.playerTeam.units.map(unit => ({
       ...unit,
       currentHp: calculateMaxHp(unit),
       statusEffects: [],
     }));
     
     const healedTeam = updateTeam(result.state.playerTeam, { units: healedUnits });
     const healedState = updateBattleState(result.state, { playerTeam: healedTeam });
     
     processVictory(healedState, rngVictory);
     // ... rest of victory flow
   }
   ```

2. **Add auto-heal after defeat**:
   ```typescript
   if (result.state.phase === 'defeat') {
     // Auto-heal all units (even after losing)
     const healedUnits = result.state.playerTeam.units.map(unit => ({
       ...unit,
       currentHp: calculateMaxHp(unit),
       statusEffects: [],
     }));
     
     const healedTeam = updateTeam(result.state.playerTeam, { units: healedUnits });
     const healedState = updateBattleState(result.state, { playerTeam: healedTeam });
     
     set({ battle: healedState });
     returnToOverworld();
   }
   ```

3. **Update team slice** to persist healed units

**Success Criteria:**
- After battle (win or lose): All units full HP, no status
- No need for inns or manual healing
- Units ready for next battle immediately

---

## PHASE 3: IMPLEMENT MANA GENERATION (Week 1, Day 5 - Week 2, Day 1)

### Task 3.1: Basic Attack Mana Generation

**Files to Modify:**
- `apps/vale-v2/src/core/services/QueueBattleService.ts`
- `apps/vale-v2/src/core/models/BattleState.ts`

**Actions:**

1. **Track mana during execution** (not just planning):
   ```typescript
   // Update executePlayerActionsPhase() to track mana gains
   function executePlayerActionsPhase(
     state: BattleState,
     rng: PRNG
   ): { state: BattleState; events: readonly BattleEvent[] } {
     let currentState = state;
     let allEvents: BattleEvent[] = [];
     
     for (const action of validActions) {
       const result = performAction(currentState, action, rng);
       currentState = result.state;
       allEvents = [...allEvents, ...result.events];
       
       // If basic attack hit, gain +1 mana
       if (action.abilityId === null && result.hit) {
         currentState = updateBattleState(currentState, {
           remainingMana: Math.min(currentState.remainingMana + 1, currentState.maxMana)
         });
         
         allEvents.push({
           type: 'mana-gained',
           amount: 1,
           source: 'basic-attack-hit'
         });
       }
     }
     
     return { state: currentState, events: allEvents };
   }
   ```

2. **Update `performAction()` return** to include hit/miss:
   ```typescript
   return {
     state: updatedState,
     result,
     events,
     hit: !dodged && damage > 0  // Track if attack connected
   };
   ```

3. **Add mana gain event type** to BattleEvent schema

**Success Criteria:**
- Basic attack hit → +1 mana immediately
- Mana gained during execution (visible in battle log)
- Slower units can use the generated mana same round
- Miss/dodge → no mana generated

**Test Scenario:**
```typescript
test('basic attack hit generates +1 mana for later units', () => {
  // Setup: 8 mana pool, queue expensive abilities
  // Unit 1 (SPD 20): Basic Attack (0 mana)
  // Unit 2 (SPD 15): 4-mana spell (4 left)
  // Unit 3 (SPD 12): 2-mana spell (2 left)
  // Unit 4 (SPD 10): Can only afford 2-mana spell
  
  // Execute round
  // Unit 1 hits → +1 mana (now 3)
  // Unit 4 can now afford 3-mana spell!
  
  expect(finalState.remainingMana).toBe(0);
  // Verify Unit 4 used 3-mana spell
});
```

---

## PHASE 4: IMPLEMENT PREDETERMINED REWARDS (Week 2, Days 2-3)

### Task 4.1: Replace RNG Drops with Fixed Rewards

**Files to Modify:**
- `apps/vale-v2/src/core/algorithms/rewards.ts`
- `apps/vale-v2/src/data/definitions/encounters.ts`
- `apps/vale-v2/src/data/schemas/EncounterSchema.ts`

**Actions:**

1. **Add rewards to Encounter schema**:
   ```typescript
   export const EncounterSchema = z.object({
     id: z.string(),
     enemies: z.array(z.string()),
     difficulty: z.enum(['easy', 'medium', 'hard', 'boss']),
     rewards: z.object({
       xp: z.number().int().min(0),
       gold: z.number().int().min(0),
       equipment: z.union([
         z.object({ type: 'fixed', itemId: z.string() }),
         z.object({ type: 'choice', options: z.array(z.string()).length(3) }),
         z.object({ type: 'none' }),
       ]),
     }),
   });
   ```

2. **Remove `calculateEquipmentDrops()`** from `rewards.ts`

3. **Create `getEncounterRewards()` function**:
   ```typescript
   export function getEncounterRewards(encounterId: string): EncounterRewards {
     const encounter = ENCOUNTERS[encounterId];
     if (!encounter) {
       throw new Error(`Encounter ${encounterId} not found`);
     }
     
     return encounter.rewards;
   }
   ```

4. **Update all encounter definitions** with fixed rewards:
   ```typescript
   export const TUTORIAL_BATTLE: Encounter = {
     id: 'c1_tutorial_1',
     enemies: ['goblin'],
     difficulty: 'easy',
     rewards: {
       xp: 60,
       gold: 40,
       equipment: { type: 'fixed', itemId: 'wooden-sword' },
     },
   };
   
   export const FIRST_BOSS: Encounter = {
     id: 'c1_boss_1',
     enemies: ['earth-golem'],
     difficulty: 'boss',
     rewards: {
       xp: 200,
       gold: 150,
       equipment: {
         type: 'choice',
         options: ['steel-sword', 'steel-armor', 'steel-helm'],
       },
     },
   };
   ```

5. **Update rewards UI** to show choice picker if type='choice'

**Success Criteria:**
- No RNG in reward calculation
- Each encounter has predetermined rewards
- Choice system works (pick 1 of 3)
- All encounters have rewards defined

---

## PHASE 5: DJINN RECOVERY TIMING (Week 2, Day 4)

### Task 5.1: Variable Recovery Based on Activation Count

**Files to Modify:**
- `apps/vale-v2/src/core/services/QueueBattleService.ts`
- `apps/vale-v2/src/core/models/BattleState.ts`

**Actions:**

1. **Track activation count** in BattleState:
   ```typescript
   export interface BattleState {
     // ... existing fields
     djinnActivationCounts: Record<string, number>;  // How many Djinn activated together
   }
   ```

2. **Update `executeDjinnSummons()`** to record activation count:
   ```typescript
   function executeDjinnSummons(state: BattleState, rng: PRNG) {
     const activationCount = state.queuedDjinn.length;
     const recoveryTime = activationCount + 1;  // 1→2, 2→3, 3→4
     
     const newRecoveryTimers = { ...state.djinnRecoveryTimers };
     
     for (const djinnId of state.queuedDjinn) {
       newRecoveryTimers[djinnId] = recoveryTime;
     }
     
     return updateBattleState(state, {
       djinnRecoveryTimers: newRecoveryTimers,
       queuedDjinn: [],
     });
   }
   ```

3. **Update recovery tick logic** in `transitionToPlanningPhase()`:
   ```typescript
   // Tick Djinn recovery timers
   const updatedTimers = { ...state.djinnRecoveryTimers };
   for (const [djinnId, timer] of Object.entries(updatedTimers)) {
     if (timer > 0) {
       updatedTimers[djinnId] = timer - 1;
       if (updatedTimers[djinnId] === 0) {
         delete updatedTimers[djinnId];  // Recovered!
       }
     }
   }
   ```

**Success Criteria:**
- 1 Djinn activated → 2 rounds to recover
- 2 Djinn activated → 3 rounds each
- 3 Djinn activated → 4 rounds each
- Recovery is independent (can activate others while some recover)

**Test Scenario:**
```typescript
test('Djinn recovery timing based on activation count', () => {
  // Activate 1 Djinn
  let state = activateDjinn(battle, ['flint']);
  expect(state.djinnRecoveryTimers['flint']).toBe(2);
  
  // Advance 1 round
  state = transitionToPlanningPhase(state);
  expect(state.djinnRecoveryTimers['flint']).toBe(1);
  
  // Advance 1 round
  state = transitionToPlanningPhase(state);
  expect(state.djinnRecoveryTimers['flint']).toBeUndefined(); // Recovered!
  
  // Activate 2 Djinn
  state = activateDjinn(state, ['flint', 'granite']);
  expect(state.djinnRecoveryTimers['flint']).toBe(3);
  expect(state.djinnRecoveryTimers['granite']).toBe(3);
});
```

---

## PHASE 6: UNIT-LOCKED EQUIPMENT (Week 2, Days 5-7 + Week 3, Days 1-2)

### Task 6.1: Add Unit Restrictions to Equipment

**Files to Modify:**
- `apps/vale-v2/src/data/schemas/EquipmentSchema.ts`
- `apps/vale-v2/src/core/models/Equipment.ts`
- `apps/vale-v2/src/data/definitions/equipment.ts`

**Actions:**

1. **Add `allowedUnits` to Equipment schema**:
   ```typescript
   export const EquipmentSchema = z.object({
     id: z.string().min(1),
     name: z.string().min(1),
     slot: EquipmentSlotSchema,
     tier: EquipmentTierSchema,
     cost: z.number().int().min(0),
     statBonus: EquipmentStatBonusSchema.default({}),
     allowedUnits: z.array(z.string()).min(1),  // NEW: List of unit IDs
     unlocksAbility: z.string().optional(),
     // ... other fields
   });
   ```

2. **Update all equipment definitions** with unit restrictions:
   ```typescript
   export const GAIA_BLADE: Equipment = {
     id: 'gaia-blade',
     name: 'Gaia Blade',
     slot: 'weapon',
     tier: 'legendary',
     cost: 7500,
     statBonus: { atk: 58 },
     allowedUnits: ['isaac', 'felix'],  // Only Venus warriors
   };
   
   export const INFERNO_AXE: Equipment = {
     id: 'inferno-axe',
     name: 'Inferno Axe',
     slot: 'weapon',
     tier: 'legendary',
     cost: 7500,
     statBonus: { atk: 60, mag: 10 },
     allowedUnits: ['garet', 'jenna', 'kyle'],  // Only Mars units
   };
   ```

3. **Create validation function**:
   ```typescript
   export function canEquipItem(unit: Unit, equipment: Equipment): boolean {
     return equipment.allowedUnits.includes(unit.id);
   }
   ```

4. **Update equipment UI** to filter by unit

**Success Criteria:**
- Each equipment has allowedUnits list
- Units can only equip their designated items
- UI shows only compatible equipment
- Validation prevents equipping wrong items

---

### Task 6.2: Implement Starter Kit System

**Files to Create:**
- `apps/vale-v2/src/data/definitions/starterKits.ts`
- `apps/vale-v2/src/ui/components/StarterKitPurchase.tsx`

**Files to Modify:**
- `apps/vale-v2/src/ui/components/ShopScreen.tsx`
- `apps/vale-v2/src/ui/state/inventorySlice.ts`

**Actions:**

1. **Create Starter Kit definitions**:
   ```typescript
   // starterKits.ts
   export interface StarterKit {
     unitId: string;
     name: string;
     cost: number;
     equipment: {
       weapon: string;
       armor: string;
       helm: string;
       boots: string;
       accessory: string;
     };
   }
   
   export const STARTER_KITS: Record<string, StarterKit> = {
     'isaac': {
       unitId: 'isaac',
       name: "Isaac's Starter Kit",
       cost: 350,
       equipment: {
         weapon: 'wooden-sword',
         armor: 'leather-vest',
         helm: 'cloth-cap',
         boots: 'leather-boots',
         accessory: 'power-ring',
       },
     },
     // ... all 10 units
   };
   ```

2. **Add `storeUnlocked` to unit data**:
   ```typescript
   export interface Unit {
     // ... existing fields
     storeUnlocked: boolean;  // NEW
   }
   ```

3. **Implement unlock flow**:
   ```typescript
   export function purchaseStarterKit(unitId: string, gold: number): Result<{
     newGold: number;
     equipment: Equipment[];
     unitStoreUnlocked: true;
   }, string> {
     const kit = STARTER_KITS[unitId];
     if (!kit) return Err('Kit not found');
     if (gold < kit.cost) return Err('Insufficient gold');
     
     // ... purchase logic
   }
   ```

4. **Create UI component** for Starter Kit purchase

**Success Criteria:**
- Recruit unit → Starter Kit available in shop
- Buy kit → Unit's full store unlocks
- Cannot access unit store without buying kit first
- Kit provides full 5-piece equipment set

---

## PHASE 7: DJINN ABILITY UNLOCKING SYSTEM (Week 3, Days 3-7 + Week 4+)

### Task 7.1: Implement Element Compatibility Logic

**Files to Create:**
- `apps/vale-v2/src/core/algorithms/djinnAbilities.ts`

**Files to Modify:**
- `apps/vale-v2/src/core/algorithms/djinn.ts`
- `apps/vale-v2/src/core/algorithms/stats.ts`

**Actions:**

1. **Define element compatibility**:
   ```typescript
   // djinnAbilities.ts
   export type ElementCompatibility = 'same' | 'counter' | 'neutral';
   
   const COUNTER_PAIRS: Record<Element, Element> = {
     'Venus': 'Mars',
     'Mars': 'Venus',
     'Jupiter': 'Mercury',
     'Mercury': 'Jupiter',
     'Neutral': 'Neutral',  // Neutral has no counter
   };
   
   export function getElementCompatibility(
     unitElement: Element,
     djinnElement: Element
   ): ElementCompatibility {
     if (unitElement === djinnElement) return 'same';
     if (COUNTER_PAIRS[unitElement] === djinnElement) return 'counter';
     return 'neutral';
   }
   ```

2. **Calculate per-unit Djinn bonuses**:
   ```typescript
   export function calculateDjinnBonusesForUnit(
     unit: Unit,
     equippedDjinn: readonly Djinn[]
   ): Partial<Stats> {
     let totalBonus: Partial<Stats> = { atk: 0, def: 0, spd: 0 };
     
     for (const djinn of equippedDjinn) {
       const compatibility = getElementCompatibility(unit.element, djinn.element);
       
       switch (compatibility) {
         case 'same':
           totalBonus.atk! += 4;
           totalBonus.def! += 3;
           break;
         case 'counter':
           totalBonus.atk! -= 3;  // PENALTY
           totalBonus.def! -= 2;
           break;
         case 'neutral':
           totalBonus.atk! += 2;
           totalBonus.def! += 2;
           break;
       }
     }
     
     return totalBonus;
   }
   ```

3. **Update `calculateEffectiveStats()`** to use per-unit bonuses

**Success Criteria:**
- Same element: +4 ATK, +3 DEF per Djinn
- Counter element: -3 ATK, -2 DEF per Djinn (PENALTY)
- Neutral: +2 ATK, +2 DEF per Djinn
- Bonuses stack with multiple Djinn

---

### Task 7.2: Create Djinn-Granted Abilities Data

**Files to Create:**
- `apps/vale-v2/src/data/definitions/djinnAbilities.ts`
- `apps/vale-v2/src/data/definitions/djinn.ts` (12 Djinn)

**Actions:**

1. **Define Djinn**:
   ```typescript
   // djinn.ts
   export interface Djinn {
     id: string;
     name: string;
     element: Element;
     tier: 1 | 2 | 3;
     summonEffect: {
       type: 'damage' | 'heal' | 'buff' | 'debuff' | 'special';
       description: string;
       // Specific effect data
     };
     grantedAbilities: {
       [unitId: string]: {
         same: string[];      // 2 abilities for same element
         counter: string[];   // 2 abilities for counter element
         neutral: string[];   // 1 ability for neutral
       };
     };
   }
   
   export const FLINT: Djinn = {
     id: 'flint',
     name: 'Flint',
     element: 'Venus',
     tier: 1,
     summonEffect: {
       type: 'damage',
       description: 'Stone Barrage - Earth damage to all enemies',
     },
     grantedAbilities: {
       'isaac': {
         same: ['stone-fist', 'granite-guard'],
         counter: [],  // Isaac is Venus, no counter
         neutral: ['earth-pulse'],
       },
       'garet': {
         same: [],  // Garet is Mars, no same
         counter: ['lava-stone', 'magma-shield'],
         neutral: [],
       },
       // ... all 10 units
     },
   };
   ```

2. **Create ability definitions** (~180 total, start with 20-40):
   ```typescript
   // Start with foundational abilities (3-5 per Djinn)
   // Expand to full 15 per Djinn later
   
   export const STONE_FIST: Ability = {
     id: 'stone-fist',
     name: 'Stone Fist',
     type: 'physical',
     element: 'Venus',
     manaCost: 2,
     basePower: 45,
     targets: 'single-enemy',
     description: 'Strike with earth-hardened fists',
     source: 'djinn',  // NEW: Track ability source
   };
   ```

3. **Implement ability unlocking**:
   ```typescript
   export function getDjinnGrantedAbilities(
     unit: Unit,
     equippedDjinn: readonly Djinn[]
   ): string[] {
     const abilities: string[] = [];
     
     for (const djinn of equippedDjinn) {
       const compatibility = getElementCompatibility(unit.element, djinn.element);
       const grantedForUnit = djinn.grantedAbilities[unit.id];
       
       if (!grantedForUnit) continue;
       
       switch (compatibility) {
         case 'same':
           abilities.push(...grantedForUnit.same);
           break;
         case 'counter':
           abilities.push(...grantedForUnit.counter);
           break;
         case 'neutral':
           abilities.push(...grantedForUnit.neutral);
           break;
       }
     }
     
     return abilities;
   }
   ```

4. **Update ability availability checking** to include Djinn abilities

**Success Criteria:**
- 12 Djinn defined with summon effects
- Each Djinn grants 3-15 abilities across 10 units
- Element compatibility determines which abilities unlock
- Same/Counter get 2 abilities, Neutral gets 1
- Abilities appear in battle UI when Djinn equipped

**Phased Approach:**
- **Week 3:** Create 12 Djinn with 3-5 abilities each (~50 total)
- **Week 4+:** Expand to full ~15 abilities per Djinn (~180 total)

---

## PHASE 8: UPDATE DJINN MECHANICS (Week 3, Days 3-4)

### Task 8.1: Djinn Standby Removes Abilities

**Files to Modify:**
- `apps/vale-v2/src/core/algorithms/djinn.ts`
- `apps/vale-v2/src/core/services/QueueBattleService.ts`

**Actions:**

1. **When Djinn enters Standby, remove its abilities**:
   ```typescript
   export function getAvailableDjinnAbilities(
     unit: Unit,
     equippedDjinn: readonly Djinn[],
     djinnStates: Record<string, 'Set' | 'Standby' | 'Recovery'>
   ): string[] {
     const abilities: string[] = [];
     
     for (const djinn of equippedDjinn) {
       // Only grant abilities if Djinn is Set
       if (djinnStates[djinn.id] !== 'Set') continue;
       
       const compatibility = getElementCompatibility(unit.element, djinn.element);
       const granted = djinn.grantedAbilities[unit.id];
       
       // ... add abilities based on compatibility
     }
     
     return abilities;
   }
   ```

2. **Update stat bonuses** to exclude Standby/Recovery Djinn:
   ```typescript
   export function calculateDjinnBonusesForUnit(
     unit: Unit,
     equippedDjinn: readonly Djinn[],
     djinnStates: Record<string, 'Set' | 'Standby' | 'Recovery'>
   ): Partial<Stats> {
     const setDjinn = equippedDjinn.filter(d => djinnStates[d.id] === 'Set');
     // Calculate bonuses only from Set Djinn
   }
   ```

**Success Criteria:**
- Djinn in Set state: Grants stats + abilities
- Djinn in Standby/Recovery: No stats, no abilities
- When Djinn recovers: Stats and abilities return
- Counter units temporarily lose penalty when Djinn in Standby

---

## TESTING REQUIREMENTS

### New Tests Needed:

1. **Mana Generation Tests**:
   - `tests/core/services/manaGeneration.test.ts`
   - Verify +1 mana on hit
   - Verify no mana on miss/dodge
   - Verify timing (slow units benefit)

2. **Djinn Recovery Tests**:
   - `tests/core/algorithms/djinnRecovery.test.ts`
   - Test 1/2/3 Djinn activation timing
   - Test recovery countdown
   - Test independent recovery

3. **Element Compatibility Tests**:
   - `tests/core/algorithms/djinnCompatibility.test.ts`
   - Test same/counter/neutral calculations
   - Test stat bonuses per compatibility
   - Test ability unlocking per compatibility

4. **Unit-Locked Equipment Tests**:
   - `tests/core/models/equipmentRestrictions.test.ts`
   - Test equip validation
   - Test cross-unit equipment rejection

5. **Auto-Heal Tests**:
   - `tests/ui/state/autoHeal.test.ts`
   - Test victory auto-heal
   - Test defeat auto-heal

### Tests to Update:

- All damage tests (remove crit/dodge expectations)
- All battle tests (update for auto-heal)
- Reward tests (predetermined, not RNG)

---

## VALIDATION CHECKLIST

Before marking complete, verify:

- [ ] No `Math.random()` in core/ (use PRNG only)
- [ ] No critical hit references
- [ ] No evasion references
- [ ] No selling functionality
- [ ] No inn system
- [ ] Auto-heal works after every battle
- [ ] Basic attack mana generation works
- [ ] Djinn recovery timing varies by count
- [ ] Equipment is unit-locked
- [ ] Rewards are predetermined
- [ ] All tests pass
- [ ] `pnpm validate:data` passes
- [ ] `pnpm typecheck` passes
- [ ] No ESLint errors

---

## PHASED ROLLOUT RECOMMENDATION

### **Minimum Viable Overhaul** (1 week):
- Phase 1: Remove deprecated systems (3 days)
- Phase 2: Auto-heal (1 day)
- Phase 3: Mana generation (2 days)
- Phase 4: Predetermined rewards (1 day)

**Result:** Core mechanics align with booklet, Djinn simplified

### **Full Overhaul** (3 weeks):
- Above + Phase 5-8
- Complete Djinn ability system (simplified, 50 abilities)
- Unit-locked equipment
- Starter Kit system

**Result:** All booklet mechanics implemented

---

## ARCHITECTURE COMPLIANCE

**MUST MAINTAIN:**
- ✅ Pure functions in core/
- ✅ No React in core/
- ✅ Seeded PRNG only (no Math.random())
- ✅ Immutable updates
- ✅ Zod validation for all data
- ✅ Result types for error handling

**CANNOT BREAK:**
- Existing test suite (update, don't delete)
- Save/load system (update schema version if needed)
- State management architecture (Zustand slices)

---

## SUCCESS METRICS

**Code Metrics:**
- 0 uses of Math.random() in core/
- 0 critical hit references
- 0 evasion references
- 0 selling functionality
- 100% test pass rate

**Gameplay Metrics:**
- Basic attack hit → +1 mana (visible in log)
- Battle end → Auto-heal (no manual healing needed)
- Djinn activation → Lose abilities until recovery
- Equipment locked per unit (no cross-unit equipping)

---

## IMPLEMENTATION ROADMAP

Delivering the eight phases listed above (removal of deprecated systems, auto-heal, mana generation, predetermined rewards, djinn recovery, unit-locked equipment, djinn abilities, and djinn mechanics update) completes the full overhaul in ~21 days (3 weeks).

| Phase | Days | Priority |
|-------|------|----------|
| 1. Remove Deprecated | 3 | CRITICAL |
| 2. Auto-Heal | 1 | HIGH |
| 3. Mana Generation | 2 | HIGH |
| 4. Predetermined Rewards | 2 | MEDIUM |
| 5. Djinn Recovery | 1 | MEDIUM |
| 6. Unit-Locked Equipment | 5 | MEDIUM |
| 7. Djinn Abilities (Simplified) | 5 | HIGH |
| 8. Djinn Mechanics Update | 2 | MEDIUM |
| **Total** | **21 days** | **(3 weeks)** |

---

**Ready to start? Begin with Phase 1 (Remove Deprecated Systems) - highest value, lowest risk!**
