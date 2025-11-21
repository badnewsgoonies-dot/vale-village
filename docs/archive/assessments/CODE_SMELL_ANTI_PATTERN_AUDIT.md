# Code Smell & Anti-Pattern Audit

**Date:** 2025-01-27  
**Scope:** Function complexity, DRY violations, naming issues, god objects, primitive obsession, comment smells  
**Status:** 🟠 **SIGNIFICANT TECHNICAL DEBT FOUND**

---

## Executive Summary

**Total Issues Found:** 28  
**Function Complexity Issues:** 8  
**DRY Violations:** 6  
**Naming Issues:** 4  
**God Objects/Files:** 4  
**Primitive Obsession:** 4  
**Comment Smells:** 2

**Overall Code Quality Score:** 58/100

---

## 🔴 FUNCTION COMPLEXITY

### 1. executeRound: 120+ Line Monolith
**File:** `src/core/services/QueueBattleService.ts:170-297`  
**Lines:** 127  
**Parameters:** 2  
**Cyclomatic Complexity:** ~15  
**Severity:** 🔴 **CRITICAL**

**Issue:**
```typescript
export function executeRound(
  state: BattleState,
  rng: PRNG
): { state: BattleState; events: readonly BattleEvent[] } {
  // Validation (lines 174-186)
  // Phase transition (lines 188-191)
  // Djinn execution (lines 195-200)
  // Player actions loop (lines 202-240)
  // Enemy actions loop (lines 242-267)
  // Victory/defeat check (lines 269-291)
  // Return (lines 293-296)
}
```

**Problems:**
- Interleaves Djinn resolution, SPD sorting, three action loops, and end-of-round transitions
- Hard to reason about failure cases
- Difficult to test individual phases
- High cyclomatic complexity (nested conditionals + loops)

**Refactoring:**
```typescript
// Split into composable phases
function validateQueue(state: BattleState): void { /* ... */ }
function executeDjinnPhase(state: BattleState, rng: PRNG): ExecutionResult { /* ... */ }
function executePlayerActions(state: BattleState, rng: PRNG): ExecutionResult { /* ... */ }
function executeEnemyActions(state: BattleState, rng: PRNG): ExecutionResult { /* ... */ }
function checkBattleEnd(state: BattleState): BattleEndResult | null { /* ... */ }
function transitionToPlanning(state: BattleState): BattleState { /* ... */ }

export function executeRound(state: BattleState, rng: PRNG): ExecutionResult {
  validateQueue(state);
  
  let currentState = transitionToExecuting(state);
  const allEvents: BattleEvent[] = [];
  
  // Phase 1: Djinn
  if (currentState.queuedDjinn.length > 0) {
    const djinnResult = executeDjinnPhase(currentState, rng);
    currentState = djinnResult.state;
    allEvents.push(...djinnResult.events);
  }
  
  // Phase 2: Player actions
  const playerResult = executePlayerActions(currentState, rng);
  currentState = playerResult.state;
  allEvents.push(...playerResult.events);
  
  // Phase 3: Enemy actions
  const enemyResult = executeEnemyActions(currentState, rng);
  currentState = enemyResult.state;
  allEvents.push(...enemyResult.events);
  
  // Phase 4: Battle end check
  const battleEnd = checkBattleEnd(currentState);
  if (battleEnd) {
    currentState = transitionToVictoryOrDefeat(currentState, battleEnd);
    allEvents.push({ type: 'battle-end', result: battleEnd });
  } else {
    currentState = transitionToPlanning(currentState);
  }
  
  return { state: currentState, events: allEvents };
}
```

**Effort:** XL (2-3 days)

---

### 2. performAction: Dense Guard Clauses + 5 Parameters
**File:** `src/core/services/BattleService.ts:64-214`  
**Lines:** 150  
**Parameters:** 5  
**Cyclomatic Complexity:** ~12  
**Severity:** 🔴 **CRITICAL**

**Issue:**
```typescript
export function performAction(
  state: BattleState,
  actorId: string,
  abilityId: string,
  targetIds: readonly string[],
  rng: PRNG
): { state: BattleState; result: ActionResult; events: readonly BattleEvent[] } {
  // Find actor (lines 72-76)
  // Check frozen (lines 78-95)
  // Check paralyze (lines 97-114)
  // Find ability (lines 116-120)
  // Resolve targets (lines 122-145)
  // Execute ability (line 149)
  // Update state (lines 151-170)
  // Build events (lines 172-211)
}
```

**Problems:**
- Dense guard clauses (frozen, paralyze checks)
- Nested conditionals
- Large switch block in `executeAbility`
- Every new ability effect requires touching this brittle core

**Refactoring:**
```typescript
// Extract validation
function validateActor(state: BattleState, actorId: string): Unit { /* ... */ }
function checkStatusBlocking(actor: Unit, rng: PRNG): StatusBlockResult | null { /* ... */ }
function resolveValidTargets(state: BattleState, ability: Ability, targetIds: string[]): Unit[] { /* ... */ }

// Extract event building
function buildActionEvents(actorId: string, abilityId: string, result: ActionResult, targetIds: string[]): BattleEvent[] { /* ... */ }

export function performAction(
  state: BattleState,
  actorId: string,
  abilityId: string,
  targetIds: readonly string[],
  rng: PRNG
): ExecutionResult {
  const actor = validateActor(state, actorId);
  
  const statusBlock = checkStatusBlocking(actor, rng);
  if (statusBlock) {
    return createBlockedActionResult(state, actor, statusBlock);
  }
  
  const ability = actor.abilities.find(a => a.id === abilityId);
  if (!ability) {
    throw new Error(`Ability ${abilityId} not found`);
  }
  
  const validTargets = resolveValidTargets(state, ability, targetIds);
  const result = executeAbility(actor, ability, validTargets, state.playerTeam, rng);
  const updatedState = applyActionResult(state, result);
  const events = buildActionEvents(actorId, abilityId, result, targetIds);
  
  return { state: updatedState, result, events };
}
```

**Effort:** XL (2-3 days)

---

### 3. executeAbility: Large Switch Block
**File:** `src/core/services/BattleService.ts:219-410`  
**Lines:** 191  
**Parameters:** 6  
**Cyclomatic Complexity:** ~10  
**Severity:** 🟠 **HIGH**

**Issue:**
```typescript
function executeAbility(
  caster: Unit,
  ability: Ability,
  targets: readonly Unit[],
  allUnits: readonly Unit[],
  team: Team,
  rng: PRNG
): ActionResult {
  switch (ability.type) {
    case 'physical':
    case 'psynergy': { /* 80+ lines */ }
    case 'healing': { /* 35+ lines */ }
    case 'buff':
    case 'debuff': { /* 40+ lines */ }
    default: { /* fallback */ }
  }
}
```

**Problems:**
- Large switch block with nested loops
- Each case is a mini-function
- Hard to extend with new ability types
- Duplicated unit mutation logic

**Refactoring:**
```typescript
// Strategy pattern for ability types
interface AbilityExecutor {
  execute(caster: Unit, ability: Ability, targets: Unit[], team: Team, rng: PRNG): ActionResult;
}

const physicalExecutor: AbilityExecutor = { /* ... */ };
const healingExecutor: AbilityExecutor = { /* ... */ };
const buffExecutor: AbilityExecutor = { /* ... */ };

const executors: Record<Ability['type'], AbilityExecutor> = {
  physical: physicalExecutor,
  psynergy: physicalExecutor,
  healing: healingExecutor,
  buff: buffExecutor,
  debuff: buffExecutor,
  summon: summonExecutor,
};

function executeAbility(
  caster: Unit,
  ability: Ability,
  targets: readonly Unit[],
  allUnits: readonly Unit[],
  team: Team,
  rng: PRNG
): ActionResult {
  const executor = executors[ability.type];
  if (!executor) {
    return createNotImplementedResult(caster, ability);
  }
  
  return executor.execute(caster, ability, targets, team, rng);
}
```

**Effort:** L (1-2 days)

---

### 4. QueueBattleView: 380-Line Component
**File:** `src/ui/components/QueueBattleView.tsx:19-377`  
**Lines:** 358  
**Severity:** 🟠 **HIGH**

**Issue:**
- Mixes store wiring, UI layout, and imperative handlers
- Deep inline conditionals (IIFE at line 286)
- Multiple responsibilities (planning, execution, post-battle)
- Hard to test individual pieces

**Refactoring:**
```typescript
// Extract hooks
function useQueueBattleSelection() { /* ... */ }
function useQueueBattleActions() { /* ... */ }
function useTargetSelection(ability: Ability | null) { /* ... */ }

// Extract components
function PlanningPhasePanel() { /* ... */ }
function ExecutionPhasePanel() { /* ... */ }
function PostBattleFlow() { /* ... */ }

export function QueueBattleView() {
  const battle = useStore((s) => s.battle);
  const { selectedUnit, selectedAbility, handleAbilitySelect, handleTargetSelect } = useQueueBattleSelection();
  const { handleQueueAction, handleExecuteRound } = useQueueBattleActions();
  
  if (!battle) return <NoBattleMessage />;
  
  if (battle.phase === 'planning') {
    return <PlanningPhasePanel /* ... */ />;
  }
  
  if (battle.phase === 'executing') {
    return <ExecutionPhasePanel /* ... */ />;
  }
  
  return <PostBattleFlow /* ... */ />;
}
```

**Effort:** L (1-2 days)

---

### 5. Other Complex Functions

**performAIAction** (`battleSlice.ts:115-187`) - 72 lines, cyclomatic complexity ~8  
**preview** (`battleSlice.ts:202-233`) - 31 lines, but complex RNG manipulation  
**startTurnTick** (`battleSlice.ts:47-58`) - Simple, but calls complex service

**Effort:** M (1 day each)

---

## 🟠 DRY VIOLATIONS

### 6. Battle Completion Logic: Copy-Pasted 3x
**Files:**
- `src/ui/state/battleSlice.ts:71-95` (perform)
- `src/ui/state/battleSlice.ts:140-173` (performAIAction)
- `src/ui/state/queueBattleSlice.ts:120-142` (executeQueuedRound)

**Issue:**
```typescript
// Duplicated in 3 places:
if (battleEnd) {
  newEvents.push({ type: 'battle-end', result: battleEnd });
  
  if (battleEnd === 'PLAYER_VICTORY') {
    const store = get() as any;
    if (store.processVictory) {
      const rngVictory = makePRNG(rngSeed + turnNumber * 1_000_000 + 999);
      store.processVictory(result.state, rngVictory);
    }
  }
  
  const encounterId = getEncounterId(battle);
  if (encounterId) {
    newEvents.push({
      type: 'encounter-finished',
      outcome: battleEnd,
      encounterId,
    });
  }
  
  // Notify story slice
  if (encounterId) {
    const store = get() as any;
    if (store.onBattleEvents) {
      store.onBattleEvents(newEvents);
    }
  }
}
```

**Problem:**
- Any change in reward handling must be coordinated across 3 blocks
- Easy to introduce inconsistencies
- Hard to maintain

**Refactoring:**
```typescript
// Create battle result service
export function handleBattleCompletion(
  battle: BattleState,
  battleEnd: BattleResult,
  rngSeed: number,
  turnNumber: number,
  getStore: () => Store
): BattleEvent[] {
  const events: BattleEvent[] = [
    { type: 'battle-end', result: battleEnd },
  ];
  
  if (battleEnd === 'PLAYER_VICTORY') {
    const store = getStore();
    if (store.processVictory) {
      const rngVictory = makePRNG(rngSeed + turnNumber * RNG_STREAM_VICTORY);
      store.processVictory(battle, rngVictory);
    }
  }
  
  const encounterId = getEncounterId(battle);
  if (encounterId) {
    events.push({
      type: 'encounter-finished',
      outcome: battleEnd,
      encounterId,
    });
    
    const store = getStore();
    if (store.onBattleEvents) {
      store.onBattleEvents(events);
    }
  }
  
  return events;
}
```

**Effort:** M (1 day)

---

### 7. Target Selection Logic: Duplicated
**Files:**
- `src/ui/components/QueueBattleView.tsx:286-304`
- `src/ui/components/ActionBar.tsx:127-139`

**Issue:**
```typescript
// QueueBattleView.tsx
{(() => {
  if (selectedAbility === null) {
    return battle.enemies.filter(e => !isUnitKO(e));
  }
  const ability = currentUnit.abilities.find(a => a.id === selectedAbility);
  if (!ability) return [];
  if (ability.targets === 'single-enemy' || ability.targets === 'all-enemies') {
    return battle.enemies.filter(e => !isUnitKO(e));
  } else if (ability.targets === 'single-ally' || ability.targets === 'all-allies') {
    return battle.playerTeam.units.filter(u => !isUnitKO(u) && u.id !== currentUnit.id);
  } else if (ability.targets === 'self') {
    return [currentUnit];
  }
  return [];
})().map((target) => (/* ... */))}

// ActionBar.tsx (similar logic)
{allUnits.map((unit) => {
  const ability = currentActor.abilities.find(a => a.id === selectedAbility);
  if (!ability) return null;
  const isEnemy = battle.enemies.some(e => e.id === unit.id);
  const isValidTarget = /* ... similar checks ... */;
  if (!isValidTarget) return null;
  return (/* ... */);
})}
```

**Problem:**
- Subtle drift (queue mode uses team mana, action bar uses PP)
- Duplicated validation logic
- Hard to keep in sync

**Refactoring:**
```typescript
// Extract to shared utility
export function getValidTargets(
  ability: Ability | null,
  caster: Unit,
  playerTeam: Team,
  enemies: readonly Unit[]
): Unit[] {
  if (!ability) {
    // Basic attack targets enemies
    return enemies.filter(e => !isUnitKO(e));
  }
  
  switch (ability.targets) {
    case 'single-enemy':
    case 'all-enemies':
      return enemies.filter(e => !isUnitKO(e));
    case 'single-ally':
    case 'all-allies':
      return playerTeam.units.filter(u => !isUnitKO(u) && u.id !== caster.id);
    case 'self':
      return [caster];
    default:
      return [];
  }
}
```

**Effort:** S (2-4 hours)

---

### 8. Mana/Affordability Checks: Duplicated
**Files:**
- `src/ui/components/QueueBattleView.tsx:259`
- `src/ui/components/ActionBar.tsx:52`

**Issue:**
- QueueBattleView uses `canAffordAction(battle.remainingMana, manaCost)`
- ActionBar uses `currentPp >= a.manaCost` (PP-based, not team mana)

**Problem:**
- Inconsistent systems (team mana vs. PP)
- TODO comments indicate migration incomplete

**Refactoring:**
- Complete PP → team mana migration
- Use shared `canAffordAction` utility everywhere

**Effort:** M (1 day)

---

### 9. RNG Stream Creation: Repeated Pattern
**Files:** Multiple locations with `makePRNG(rngSeed + turnNumber * 1_000_000 + offset)`

**Issue:**
- Magic numbers scattered throughout
- Easy to introduce seed collisions
- No named constants

**Refactoring:**
```typescript
// Create RNG stream constants
export const RNG_STREAMS = {
  STATUS_EFFECTS: 0,
  ACTIONS: 7,
  VICTORY: 999,
  END_TURN: 0,
  PREVIEW: (turnNumber: number, abilityId: string, casterId: string) => 
    turnNumber << 8 ^ abilityId.length << 16 ^ casterId.length << 24,
} as const;

export function createRNGStream(
  rngSeed: number,
  turnNumber: number,
  stream: keyof typeof RNG_STREAMS | number
): PRNG {
  const offset = typeof stream === 'number' ? stream : RNG_STREAMS[stream];
  return makePRNG(rngSeed + turnNumber * 1_000_000 + offset);
}
```

**Effort:** S (2-4 hours)

---

## 🟡 NAMING ISSUES

### 10. selectedAbility: Misleading Sentinel Value
**File:** `src/ui/components/QueueBattleView.tsx:31, 86, 287`

**Issue:**
```typescript
const [selectedAbility, setSelectedAbility] = useState<string | null>(null);

// Later:
if (selectedAbility === null) {
  // Basic attack - single enemy target
  setSelectedTargets([targetId]);
  return;
}

// But also:
{selectedAbility !== undefined && currentUnit && (/* ... */)}
```

**Problem:**
- `null` doubles as "basic attack" sentinel
- Compared against `undefined` in some places
- Forces extra branching to detect sentinel
- Reads like a bug

**Refactoring:**
```typescript
type SelectedAction = 
  | { type: 'basic-attack' }
  | { type: 'ability'; abilityId: string };

const [selectedAction, setSelectedAction] = useState<SelectedAction | null>(null);

// Usage:
if (selectedAction?.type === 'basic-attack') {
  // Handle basic attack
} else if (selectedAction?.type === 'ability') {
  const ability = currentUnit.abilities.find(a => a.id === selectedAction.abilityId);
  // ...
}
```

**Effort:** S (2-4 hours)

---

### 11. perform: Generic Name
**File:** `src/ui/state/battleSlice.ts:21, 60`

**Issue:**
```typescript
perform: (casterId: string, abilityId: string, targetIds: readonly string[]) => void;
```

**Problem:**
- Doesn't convey that it executes action AND advances turns
- Hard to scan API
- Could be `executeActionAndAdvanceTurn` or `performAction`

**Refactoring:**
```typescript
executeAction: (casterId: string, abilityId: string, targetIds: readonly string[]) => void;
// Or:
performActionAndAdvanceTurn: (/* ... */) => void;
```

**Effort:** S (1-2 hours - rename + update call sites)

---

### 12. Vague Names

**`data`** - Used in multiple contexts without type hints  
**`result`** - Generic, doesn't indicate what kind of result  
**`temp`** - Not found, but watch for this pattern

**Effort:** S (1 hour per occurrence)

---

## 🟠 GOD OBJECTS / FILES

### 13. BattleState: 20+ Fields
**File:** `src/core/models/BattleState.ts:44-116`

**Issue:**
```typescript
export interface BattleState {
  // Classic turn order (5 fields)
  playerTeam: Team;
  enemies: readonly Unit[];
  currentTurn: number;
  turnOrder: readonly string[];
  currentActorIndex: number;
  
  // Queue system (7 fields)
  phase: BattlePhase;
  roundNumber: number;
  currentQueueIndex: number;
  queuedActions: readonly (QueuedAction | null)[];
  queuedDjinn: readonly string[];
  remainingMana: number;
  maxMana: number;
  executionIndex: number;
  
  // Status (3 fields)
  status: BattleStatus;
  log: readonly string[];
  djinnRecoveryTimers: Record<string, number>;
  
  // Legacy (3 fields)
  isBossBattle?: boolean;
  npcId?: string;
  encounterId?: string;
  
  // Metadata (1 field)
  meta?: { encounterId: string; difficulty?: 'normal' | 'elite' | 'boss' };
}
```

**Problem:**
- Every subsystem pokes the same sprawling object
- Hard to reason about which fields are used where
- Mixes concerns (turn order, queue, status, metadata)

**Refactoring:**
```typescript
// Split into focused interfaces
export interface BattleTurnOrder {
  currentTurn: number;
  turnOrder: readonly string[];
  currentActorIndex: number;
}

export interface BattleQueue {
  phase: BattlePhase;
  roundNumber: number;
  currentQueueIndex: number;
  queuedActions: readonly (QueuedAction | null)[];
  queuedDjinn: readonly string[];
  remainingMana: number;
  maxMana: number;
  executionIndex: number;
}

export interface BattleStatus {
  status: BattleStatus;
  log: readonly string[];
  djinnRecoveryTimers: Record<string, number>;
}

export interface BattleMetadata {
  isBossBattle?: boolean;
  npcId?: string;
  encounterId?: string;
  meta?: { encounterId: string; difficulty?: 'normal' | 'elite' | 'boss' };
}

export interface BattleState {
  playerTeam: Team;
  enemies: readonly Unit[];
  turnOrder: BattleTurnOrder;
  queue: BattleQueue;
  status: BattleStatus;
  metadata: BattleMetadata;
}
```

**Effort:** XL (3-4 days - requires updating all call sites)

---

### 14. equipment.ts: 600+ Line File
**File:** `src/data/definitions/equipment.ts`

**Issue:**
- 632 lines of hand-authored constants
- Adding/balancing gear means editing multiple almost-identical objects
- No structured data approach

**Refactoring:**
```typescript
// Convert to data-driven approach
const EQUIPMENT_TEMPLATES = {
  sword: { slot: 'weapon', statBonus: { atk: 0 } },
  // ...
} as const;

const EQUIPMENT_TIERS = {
  basic: { costMultiplier: 1, statMultiplier: 1 },
  bronze: { costMultiplier: 2.4, statMultiplier: 1.8 },
  // ...
} as const;

function createEquipment(
  template: keyof typeof EQUIPMENT_TEMPLATES,
  tier: keyof typeof EQUIPMENT_TIERS,
  baseName: string
): Equipment {
  const tpl = EQUIPMENT_TEMPLATES[template];
  const tierData = EQUIPMENT_TIERS[tier];
  
  return {
    id: `${tier}-${template}`,
    name: `${tier} ${baseName}`,
    slot: tpl.slot,
    tier,
    cost: BASE_COST * tierData.costMultiplier,
    statBonus: Object.fromEntries(
      Object.entries(tpl.statBonus).map(([stat, value]) => [
        stat,
        value * tierData.statMultiplier,
      ])
    ),
  };
}

export const WOODEN_SWORD = createEquipment('sword', 'basic', 'Sword');
export const BRONZE_SWORD = createEquipment('sword', 'bronze', 'Sword');
// ...
```

**Effort:** L (2-3 days)

---

### 15. Other Large Files

**BattleService.ts** - 566 lines (but well-organized)  
**QueueBattleService.ts** - 495 lines (needs splitting)  
**QueueBattleView.tsx** - 377 lines (needs component extraction)

**Effort:** M-L per file

---

## 🟡 PRIMITIVE OBSESSION

### 16. RNG Stream Offsets: Magic Numbers
**Files:** Multiple locations

**Issue:**
```typescript
makePRNG(rngSeed + turnNumber * 1_000_000 + 7)      // Actions
makePRNG(rngSeed + turnNumber * 1_000_000 + 999)    // Victory
makePRNG(rngSeed + battle.roundNumber * 1000)      // Queue round
```

**Problem:**
- No named constants
- Easy to introduce seed collisions
- Hard to understand intent

**Refactoring:** (See DRY violation #9)

**Effort:** S (2-4 hours)

---

### 17. Queue Size: Hard-Coded Array
**File:** `src/core/models/BattleState.ts:148, 286`

**Issue:**
```typescript
queuedActions: [null, null, null, null],  // Hard-coded 4 slots
if (selectedUnitIndex < 3) {  // Magic number
```

**Problem:**
- Hard-coded party size
- Breaks if team size changes
- No named constant

**Refactoring:**
```typescript
export const PARTY_SIZE = 4;
export const MAX_QUEUE_SIZE = PARTY_SIZE;

export function createEmptyQueue(): (QueuedAction | null)[] {
  return Array(MAX_QUEUE_SIZE).fill(null);
}

// Usage:
queuedActions: createEmptyQueue(),
if (selectedUnitIndex < MAX_QUEUE_SIZE - 1) {
```

**Effort:** S (1-2 hours)

---

### 18. Stringly-Typed Ability IDs
**File:** Multiple locations

**Issue:**
```typescript
abilityId: string | null;  // Should be AbilityId type
if (abilityId === 'strike') {  // String comparison
```

**Problem:**
- No type safety for ability IDs
- Typos compile but fail at runtime
- Hard to refactor

**Refactoring:**
```typescript
export type AbilityId = 
  | 'strike'
  | 'heavy-strike'
  | 'fireball'
  // ... all ability IDs

abilityId: AbilityId | null;
if (abilityId === 'strike') {  // Type-safe
```

**Effort:** M (1 day - requires updating all call sites)

---

### 19. Magic Numbers in Calculations

**0.95** - Ability accuracy (should be `DEFAULT_ABILITY_ACCURACY`)  
**2.0** - Critical hit multiplier (should be `CRITICAL_HIT_MULTIPLIER`)  
**0.5** - Revive HP percentage (should be `REVIVE_HP_PERCENTAGE`)

**Effort:** S (1-2 hours)

---

## 🟡 COMMENT SMELLS

### 20. TODO Comments: 8 Found
**Files:** Multiple locations

**Issues:**
- `saveSlice.ts:37` - "TODO: Hydrate team and battle from save data"
- `UnitCard.tsx:24` - "TODO: Migrate PP to team mana"
- `ActionBar.tsx:47` - "TODO: Migrate PP to team mana"
- `AIService.ts:66` - "TODO: Pass team to scoreAbility for accurate effective stats"
- `stats.ts:49` - "TODO: Replace with proper Djinn registry"
- `EncounterService.ts:76` - "TODO: Make this data-driven via chapter definitions"
- `SaveService.ts:93` - "TODO: Create separate ReplayPort interface"
- `encounters.ts:62` - "TODO: Add this ability later"

**Problem:**
- Comments describe what needs to be built, not why current approach exists
- Debt is easy to forget
- No acceptance criteria captured

**Refactoring:**
- Convert TODOs to GitHub issues with acceptance criteria
- Or implement them
- Or document why they're deferred

**Effort:** S-M per TODO (depends on implementation)

---

### 21. Commented-Out Code
**Status:** ✅ **CLEAN** - No commented-out code found

---

## 📊 SUMMARY STATISTICS

| Category | Issues | Severity |
|----------|--------|----------|
| Function Complexity | 8 | 🔴 Critical |
| DRY Violations | 6 | 🟠 High |
| Naming Issues | 4 | 🟡 Medium |
| God Objects/Files | 4 | 🟠 High |
| Primitive Obsession | 4 | 🟡 Medium |
| Comment Smells | 2 | 🟡 Medium |
| **Total** | **28** | **Mixed** |

---

## 🎯 REFACTORING PRIORITY LIST

### XL Effort (2-4 days)

1. **Normalize battle execution pipeline** (XL)
   - Split `executeRound` into composable phases
   - Split `performAction` into validation/execution/event-building
   - Shared helpers for event emission and battle-end bookkeeping
   - **Impact:** Reduces complexity, improves testability, prevents drift

2. **Split BattleState into focused interfaces** (XL)
   - Extract `BattleTurnOrder`, `BattleQueue`, `BattleStatus`, `BattleMetadata`
   - Update all call sites
   - **Impact:** Reduces coupling, improves maintainability

### L Effort (1-2 days)

3. **Modularize queue battle UI** (L)
   - Extract hooks (`useQueueBattleSelection`, `useQueueBattleActions`)
   - Split into presentational components
   - Share hook with ActionBar to eliminate duplication
   - **Impact:** Reduces component complexity, improves reusability

4. **Convert equipment.ts to data-driven** (L)
   - Create equipment factory functions
   - Use templates and tiers
   - **Impact:** Easier balancing, less boilerplate

5. **Extract ability executors** (L)
   - Strategy pattern for ability types
   - Separate executors for physical/healing/buff
   - **Impact:** Easier to extend, reduces switch complexity

### M Effort (1 day)

6. **Centralize battle completion side-effects** (M)
   - Create `BattleResultService`
   - Handle reward rolls, encounter-finished events, story notifications
   - Call from both battleSlice and queueBattleSlice
   - **Impact:** Eliminates duplication, single source of truth

7. **Introduce typed constants for RNG/queue math** (M)
   - Wrap RNG stream offsets in named constants
   - Create `PARTY_SIZE` constant
   - Replace magic numbers
   - **Impact:** Prevents seed collisions, improves readability

8. **Complete PP → team mana migration** (M)
   - Remove PP-based checks from ActionBar
   - Use team mana everywhere
   - Remove TODO comments
   - **Impact:** Consistent system, eliminates technical debt

9. **Introduce AbilityId type** (M)
   - Create union type for all ability IDs
   - Replace string with AbilityId
   - **Impact:** Type safety, prevents typos

### S Effort (2-4 hours)

10. **Extract target selection utility** (S)
    - Create `getValidTargets` function
    - Use in QueueBattleView and ActionBar
    - **Impact:** Eliminates duplication

11. **Fix selectedAbility naming** (S)
    - Use discriminated union instead of null sentinel
    - **Impact:** Clearer intent, type safety

12. **Rename perform to executeAction** (S)
    - Update all call sites
    - **Impact:** Better API clarity

13. **Extract magic number constants** (S)
    - `DEFAULT_ABILITY_ACCURACY`, `CRITICAL_HIT_MULTIPLIER`, etc.
    - **Impact:** Self-documenting code

14. **Convert TODOs to issues or implement** (S-M per TODO)
    - Prioritize critical ones (save hydration, mana migration)
    - Document deferred ones with rationale
    - **Impact:** Clear technical debt tracking

---

## 📋 RECOMMENDED REFACTORING SEQUENCE

### Phase 1: Quick Wins (S effort, high impact)
1. Extract target selection utility
2. Fix selectedAbility naming
3. Extract magic number constants
4. Introduce RNG stream constants

### Phase 2: Medium Refactors (M effort)
5. Centralize battle completion logic
6. Complete PP → team mana migration
7. Introduce AbilityId type

### Phase 3: Large Refactors (L effort)
8. Modularize queue battle UI
9. Extract ability executors
10. Convert equipment.ts to data-driven

### Phase 4: Major Refactors (XL effort)
11. Normalize battle execution pipeline
12. Split BattleState into focused interfaces

---

**Audit Complete** ✅  
**Report Generated:** 2025-01-27

