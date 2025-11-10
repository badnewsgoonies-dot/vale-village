# 🏗️ DEEP ARCHITECTURAL AUDIT & OPTIMIZED BLUEPRINT
## Vale Chronicles - Complete System Reconstruction Plan

**Date:** November 10, 2025  
**Author:** Senior Architect AI  
**Purpose:** Comprehensive analysis of current architecture + optimized rebuild blueprint  
**Scope:** Full codebase audit with actionable refactoring plan

---

## 📊 EXECUTIVE SUMMARY

### Current State Assessment

**Project Status:**
- ✅ **Foundation Exists:** Core game loop partially functional
- ⚠️ **Technical Debt:** High - grew organically without central planning
- 🔴 **Architecture Issues:** Major disorganization, inconsistent patterns
- ✅ **Working Systems:** Battle, Equipment, Party Management, Djinn
- ❌ **Broken Systems:** Battle polish, Overworld animations, Transitions
- 📈 **Code Volume:** ~50+ TypeScript files, 15+ component screens

**Key Problems Identified:**
1. **Monolithic GameProvider** (808 lines) - God object antipattern
2. **Inconsistent State Management** - Mix of Context API, local state, props drilling
3. **Type Safety Issues** - Many `any` types, weak validation
4. **No Clear Data Flow** - Actions scattered, side effects everywhere
5. **Missing Animation System** - Everything is setTimeout hacks
6. **Poor Component Hierarchy** - Deep nesting, tight coupling
7. **No Service Layer** - Business logic mixed with UI
8. **Test Coverage Gaps** - Unit tests exist but integration tests missing

**Recommendation:**
- **NOT a complete rewrite** - too risky, loses working code
- **Incremental refactoring** - extract systems one by one
- **New architecture patterns** - introduce proper separation
- **Keep what works** - preserve working battle/equipment/djinn logic

---

## 🎯 PART 1: COMPREHENSIVE CURRENT ARCHITECTURE AUDIT

### 1.1 Project Structure Analysis

```
vale-village/
├── src/
│   ├── components/          # ✅ GOOD: Organized by feature
│   │   ├── battle/         # ⚠️ Complex, needs refactor
│   │   ├── equipment/      # ✅ GOOD: Well-structured
│   │   ├── party/          # ✅ GOOD: Clear purpose
│   │   ├── djinn/          # ✅ GOOD: Self-contained
│   │   ├── overworld/      # 🔴 BAD: Animation issues
│   │   ├── dialogue/       # ⚠️ Incomplete
│   │   ├── rewards/        # ✅ GOOD: Simple and clear
│   │   ├── shop/           # ⚠️ Partial implementation
│   │   ├── abilities/      # ✅ GOOD: Clear display
│   │   ├── summons/        # ✅ GOOD: Well-designed
│   │   ├── title/          # ✅ GOOD: Entry point
│   │   ├── intro/          # ⚠️ Basic
│   │   ├── menu/           # ✅ GOOD: Navigation hub
│   │   └── shared/         # ✅ GOOD: Reusable components
│   │
│   ├── context/            # 🔴 MAJOR ISSUE: God object
│   │   ├── GameProvider.tsx    # 808 lines - TOO BIG
│   │   ├── GameContext.tsx     # Interface definitions
│   │   └── CameraContext.tsx   # ✅ GOOD: Separate concern
│   │
│   ├── types/              # ✅ GOOD: Well-typed system
│   │   ├── Unit.ts            # 450+ lines - class-based
│   │   ├── Team.ts            # 300+ lines - complex
│   │   ├── Battle.ts          # 400+ lines - logic heavy
│   │   ├── Equipment.ts       # Clean interface
│   │   ├── Djinn.ts           # Clean interface
│   │   ├── Ability.ts         # Clean interface
│   │   ├── Stats.ts           # Clean interface
│   │   ├── Area.ts            # Clean interface
│   │   └── PlayerData.ts      # Clean interface
│   │
│   ├── data/               # ✅ GOOD: Centralized data
│   │   ├── units.ts           # Unit definitions
│   │   ├── enemies.ts         # 2000+ enemy definitions
│   │   ├── abilities.ts       # Ability catalog
│   │   ├── equipment.ts       # Equipment catalog
│   │   ├── djinn.ts           # Djinn catalog
│   │   ├── areas.ts           # World map data
│   │   └── quests.ts          # Quest definitions
│   │
│   ├── utils/              # ✅ GOOD: Pure functions
│   │   ├── Result.ts          # Result monad pattern
│   │   ├── rng.ts             # Seeded RNG
│   │   ├── calculations.ts    # Battle math
│   │   └── validators.ts      # (MISSING!)
│   │
│   ├── router/             # ⚠️ Simple but functional
│   │   ├── ScreenRouter.tsx   # Central navigation
│   │   └── ScreenTransition.tsx # Basic transitions
│   │
│   └── services/           # 🔴 MISSING: No service layer!
│
├── tests/                  # ⚠️ Incomplete coverage
│   ├── critical/          # ✅ Bug documentation tests
│   ├── ui/                # ✅ Component tests
│   └── integration/       # ⚠️ Minimal coverage
│
└── mockups/                # ✅ Design reference
```

**Assessment:**
- ✅ **Good:** Clear feature-based organization
- ✅ **Good:** Strong TypeScript usage
- ✅ **Good:** Centralized data definitions
- 🔴 **Bad:** No service layer - business logic in components/context
- 🔴 **Bad:** GameProvider is a god object (808 lines!)
- 🔴 **Bad:** No validation layer for data
- ⚠️ **Concern:** Class-based types (Unit, Team) hard to serialize/test

---

### 1.2 GameProvider Deep Dive (The Core Problem)

**File:** `src/context/GameProvider.tsx` (808 lines)

**What It Contains:**
```typescript
// 1. State management for EVERYTHING
const [state, setState] = useState<GameState>({
  currentScreen,
  playerData,       // Units, equipment, Djinn, gold, inventory
  storyFlags,       // All story progression
  locationData,     // Player position, area, steps
  lastBattleRewards,
  currentDialogue,
  currentShop,
});

// 2. Navigation actions
const navigate = useCallback(...);
const goBack = useCallback(...);

// 3. Game flow actions
const startNewGame = useCallback(...);

// 4. Unit management actions
const setActiveParty = useCallback(...);
const recruitUnit = useCallback(...);

// 5. Equipment actions
const equipItem = useCallback(...);
const unequipItem = useCallback(...);

// 6. Djinn actions
const equipDjinn = useCallback(...);
const unequipDjinn = useCallback(...);

// 7. Battle actions
const startBattle = useCallback(...);
const endBattle = useCallback(...);
const executeTurn = () => console.log('Not implemented!'); // BUG!

// 8. Story actions
const setStoryFlag = useCallback(...);

// 9. Location actions
const setLocation = useCallback(...);
const setPlayerPosition = useCallback(...);
const movePlayer = useCallback(...);
const incrementStepCounter = useCallback(...);

// 10. Area actions
const openTreasureChest = useCallback(...);
const defeatBoss = useCallback(...);
const changeArea = useCallback(...);

// 11. Shop actions
const buyItem = useCallback(...);
const sellItem = useCallback(...);
const buyEquipment = useCallback(...);
const sellEquipment = useCallback(...);

// 12. Item actions
const useItem = useCallback(...);

// 13. Gold actions
const addGold = useCallback(...);

// 14. Djinn give actions
const giveDjinn = useCallback(...);
```

**Problems:**
1. **Single Responsibility Violation:** Manages 14 different concerns
2. **Tight Coupling:** Everything depends on GameProvider
3. **Testing Nightmare:** Can't test individual systems in isolation
4. **Performance Issues:** Every state change re-renders entire tree
5. **Maintenance Hell:** 808 lines makes changes risky
6. **Memory Leaks:** All useCallback dependencies can cause stale closures

**Why This Happened:**
- Started small, grew organically
- Added features without refactoring
- No architectural planning
- "Just add it to GameProvider" became default

---

### 1.3 State Management Issues

**Current Pattern:**
```typescript
// GameProvider holds ALL state
const [state, setState] = useState<GameState>({...});

// Actions mutate via setState
const equipItem = useCallback((unitId, slot, item) => {
  setState(prev => {
    // Complex nested state mutation
    const newState = { ...prev };
    const unit = newState.playerData.unitsCollected.find(u => u.id === unitId);
    unit.equipment[slot] = item;
    // ... more mutations
    return newState;
  });
}, []);
```

**Problems:**
1. **Immutability Violations:** Direct mutations of nested objects
2. **No Validation:** State can become inconsistent
3. **No History:** Can't undo/redo
4. **No Persistence:** SaveSystem is separate, can desync
5. **Performance:** Full state replacement on every action

**Better Pattern (Not Implemented):**
```typescript
// Separate state slices
const partyState = usePartyState();
const equipmentState = useEquipmentState();
const djinnState = useDjinnState();

// Actions with validation
const { equipItem } = useEquipmentActions();
equipItem(unitId, slot, item);  // Validates, updates, persists

// Optimized re-renders
// Only equipment screen re-renders, not battle screen
```

---

### 1.4 Type System Analysis

**Strengths:**
- ✅ Strong typing throughout
- ✅ Clear interfaces for game entities
- ✅ Result<T, E> monad for error handling
- ✅ Proper enums for constants

**Weaknesses:**
- ⚠️ Class-based Unit/Team types hard to serialize
- ⚠️ No runtime validation (TypeScript types erased)
- ⚠️ Some `any` types in UI components
- ⚠️ No schema validation for data files

**Example Issues:**
```typescript
// ❌ Class instance - hard to save/load
export class Unit {
  constructor(definition, level) { ... }
  // Methods, getters, setters...
}

// ✅ Better: Plain object + functions
export interface Unit {
  id: string;
  stats: Stats;
  // ...
}
export const createUnit = (definition, level): Unit => { ... };
export const calculateStats = (unit): Stats => { ... };

// ❌ No validation
const enemy = ENEMIES['invalid-id'];  // undefined!

// ✅ Better: Validated access
const enemy = getEnemy('invalid-id');  // Result<Enemy, string>
```

---

### 1.5 Component Architecture Analysis

**Battle System:**
```
BattleScreen (500+ lines)
├── StatusBar (displays party HP/PP)
├── TurnOrderDisplay (shows next 5 turns)
├── EnemyArea
│   └── UnitRow (enemy sprites)
├── PartyArea
│   └── UnitRow (party sprites)
└── BottomPanel
    ├── PartyPortraits (redundant with StatusBar!)
    ├── CombatLog (buried in middle)
    └── ActionMenu
        ├── CommandMenu (Attack/Psynergy/Djinn/Defend/Flee)
        └── AbilityMenu (spell list)
```

**Problems:**
1. **BattleScreen does too much:** State management + UI + logic
2. **Duplicate information:** StatusBar + PartyPortraits
3. **Poor layout:** CombatLog buried, hard to read
4. **No animation system:** Everything is setTimeout hacks
5. **Tight coupling:** Can't test logic without rendering UI

**Better Structure:**
```
BattleContainer (orchestrator)
├── useBattleState() (hook)
├── useBattleActions() (hook)
├── useBattleAnimations() (hook)
└── BattleView (pure UI)
    ├── BattleField
    │   ├── EnemyFormation
    │   └── PartyFormation
    ├── BattleHUD
    │   ├── StatusBar
    │   └── TurnOrder
    └── BattleControls
        ├── ActionMenu
        └── CombatLog
```

---

### 1.6 Data Flow Analysis

**Current Flow (Messy):**
```
User Action
  ↓
Component (local state?)
  ↓
GameProvider action
  ↓
setState (merge nested objects)
  ↓
Context consumers re-render
  ↓
useEffect triggers side effects
  ↓
More setState calls
  ↓
Eventual consistency (maybe)
```

**Problems:**
1. **Unpredictable:** Side effects everywhere
2. **Race conditions:** Multiple setStates can conflict
3. **Hard to debug:** No action history
4. **No validation:** Bad data can enter system
5. **Performance:** Cascading re-renders

**Better Flow (Should Implement):**
```
User Action
  ↓
Dispatch action (validated)
  ↓
Reducer updates state (immutable)
  ↓
Middleware (logging, persistence, validation)
  ↓
Selectors derive data
  ↓
Components re-render (optimized)
```

---

### 1.7 Animation System Analysis

**Current System (Doesn't Exist!):**
```typescript
// Battle animations are just setTimeout
const executeAction = async () => {
  setPhase('animating');
  await wait(800);  // "Animation"
  applyDamage();
  await wait(300);
  setPhase('idle');
};

// Overworld movement has NO animation
// Isaac sprite just teleports between grid cells
```

**What's Missing:**
- ❌ No sprite animation system
- ❌ No damage number display
- ❌ No particle effects
- ❌ No screen shake/flash
- ❌ No walking animation for Isaac
- ❌ No attack animations
- ❌ No spell effect animations
- ❌ No transition effects

**What's Needed:**
```typescript
// Animation queue system
interface Animation {
  type: 'damage' | 'heal' | 'effect' | 'movement';
  target: Unit;
  duration: number;
  easing: EasingFunction;
  onComplete: () => void;
}

const animationQueue = useAnimationQueue();
animationQueue.push(attack);
animationQueue.push(damageNumber);
animationQueue.push(screenShake);
await animationQueue.execute();
```

---

### 1.8 Known Issues from Audit Documents

From `COMPREHENSIVE_SYSTEM_AUDIT.md`:

**🔴 Critical Bugs:**
1. ❌ `executeTurn()` not implemented (GameProvider:371)
2. ❌ useEffect dependency warnings (BattleScreen:75)
3. ❌ Negative PP costs add PP instead of consuming
4. ❌ Negative base power not validated
5. ❌ Dead units can be healed (may be fixed?)
6. ❌ Debug console logs everywhere
7. ❌ Ability/Equipment/Enemy data not validated
8. ❌ TypeScript `any` types in multiple places

From `BATTLE_SYSTEM_ANALYSIS.md`:

**⚠️ UI/UX Issues:**
1. ❌ Bottom panel overwhelmed (cramped layout)
2. ❌ Combat log visibility poor
3. ❌ Party portraits redundant
4. ❌ Turn order display unclear
5. ❌ Target selection UX weak
6. ❌ Ability menu cramping
7. ❌ No visual feedback during actions
8. ❌ Mobile experience broken
9. ❌ Battle phase states unclear
10. ❌ Defend command not implemented

From `PRIORITIZED_ACTION_PLAN.md`:

**🔥 Critical Blockers:**
1. ❌ Battle rewards not applying equipment
2. ❌ Battle triggers hit or miss
3. ❌ Overworld movement - no walking animation
4. ❌ Battle system lacks polish/feel

---

## 🏗️ PART 2: OPTIMIZED ARCHITECTURE BLUEPRINT

### 2.1 New Architecture Principles

**Core Principles:**
1. **Separation of Concerns:** UI, State, Logic, Data separate
2. **Single Responsibility:** Each module does one thing well
3. **Testability:** All business logic pure functions
4. **Type Safety:** Runtime validation + TypeScript
5. **Performance:** Optimistic updates, minimal re-renders
6. **Maintainability:** Clear boundaries, low coupling

**Key Changes:**
- Replace GameProvider god object with feature-based contexts
- Introduce service layer for business logic
- Add validation layer for all data
- Implement proper animation system
- Create clear state management pattern
- Optimize component hierarchy

---

### 2.2 New Directory Structure

```
vale-village/
├── src/
│   ├── core/                    # NEW: Core game logic (pure)
│   │   ├── models/             # Game entities (plain objects)
│   │   │   ├── Unit.ts
│   │   │   ├── Team.ts
│   │   │   ├── Battle.ts
│   │   │   ├── Equipment.ts
│   │   │   └── Djinn.ts
│   │   │
│   │   ├── services/           # NEW: Business logic layer
│   │   │   ├── UnitService.ts
│   │   │   ├── BattleService.ts
│   │   │   ├── EquipmentService.ts
│   │   │   ├── DjinnService.ts
│   │   │   ├── ProgressionService.ts
│   │   │   └── SaveService.ts
│   │   │
│   │   ├── systems/            # NEW: Game systems (stateless)
│   │   │   ├── CombatSystem.ts
│   │   │   ├── ProgressionSystem.ts
│   │   │   ├── InventorySystem.ts
│   │   │   └── QuestSystem.ts
│   │   │
│   │   └── validators/         # NEW: Runtime validation
│   │       ├── UnitValidator.ts
│   │       ├── AbilityValidator.ts
│   │       └── DataValidator.ts
│   │
│   ├── state/                   # NEW: State management
│   │   ├── slices/             # Feature-based state
│   │   │   ├── partySlice.ts
│   │   │   ├── equipmentSlice.ts
│   │   │   ├── djinnSlice.ts
│   │   │   ├── battleSlice.ts
│   │   │   ├── locationSlice.ts
│   │   │   └── storySlice.ts
│   │   │
│   │   ├── hooks/              # Custom hooks for state
│   │   │   ├── useParty.ts
│   │   │   ├── useEquipment.ts
│   │   │   ├── useDjinn.ts
│   │   │   └── useBattle.ts
│   │   │
│   │   └── store.ts            # Central store (if using Redux)
│   │
│   ├── ui/                      # Renamed from components/
│   │   ├── screens/            # Full-screen views
│   │   │   ├── TitleScreen/
│   │   │   ├── BattleScreen/
│   │   │   ├── OverworldScreen/
│   │   │   └── ...
│   │   │
│   │   ├── features/           # Feature-specific components
│   │   │   ├── battle/
│   │   │   ├── equipment/
│   │   │   ├── party/
│   │   │   └── ...
│   │   │
│   │   └── shared/             # Reusable UI components
│   │       ├── Button/
│   │       ├── Panel/
│   │       └── ...
│   │
│   ├── animations/              # NEW: Animation system
│   │   ├── types.ts
│   │   ├── AnimationQueue.ts
│   │   ├── useAnimation.ts
│   │   └── effects/
│   │       ├── DamageNumber.tsx
│   │       ├── ScreenShake.tsx
│   │       └── Particles.tsx
│   │
│   ├── data/                    # Static game data
│   │   ├── definitions/
│   │   │   ├── units.ts
│   │   │   ├── enemies.ts
│   │   │   ├── abilities.ts
│   │   │   └── equipment.ts
│   │   │
│   │   └── schemas/            # NEW: Zod schemas
│   │       ├── UnitSchema.ts
│   │       ├── AbilitySchema.ts
│   │       └── EquipmentSchema.ts
│   │
│   ├── types/                   # TypeScript types
│   │   └── ... (existing)
│   │
│   ├── utils/                   # Pure utility functions
│   │   └── ... (existing)
│   │
│   └── router/                  # Navigation
│       └── ... (existing)
│
├── tests/
│   ├── unit/                   # Unit tests (pure functions)
│   ├── integration/            # Integration tests (systems)
│   └── e2e/                    # NEW: End-to-end tests
│
└── docs/
    └── architecture/           # NEW: Architecture docs
        ├── STATE_MANAGEMENT.md
        ├── SERVICE_LAYER.md
        └── ANIMATION_SYSTEM.md
```

---

### 2.3 State Management Refactor

**Old (Current):**
```typescript
// GameProvider.tsx (808 lines)
const [state, setState] = useState<GameState>({
  currentScreen,
  playerData,      // Everything mixed together
  storyFlags,
  locationData,
  // ...
});
```

**New (Proposed):**
```typescript
// state/slices/partySlice.ts
export interface PartyState {
  unitsCollected: Unit[];
  activePartyIds: string[];
  benchedUnitIds: string[];
}

export const usePartyState = (): PartyState => {
  // Isolated party state
};

export const usePartyActions = () => {
  const setActiveParty = (ids: string[]) => {
    // Validate
    // Update
    // Persist
  };
  
  const recruitUnit = (unitId: string) => {
    // Validate
    // Add to collection
    // Persist
  };
  
  return { setActiveParty, recruitUnit };
};

// In component:
const { unitsCollected, activePartyIds } = usePartyState();
const { setActiveParty, recruitUnit } = usePartyActions();
```

**Benefits:**
- ✅ Isolated concerns - party system doesn't know about equipment
- ✅ Easy to test - just test party logic
- ✅ Performance - only party components re-render
- ✅ Maintainable - each slice is <200 lines

---

### 2.4 Service Layer Introduction

**Current (No Service Layer):**
```typescript
// Logic scattered in GameProvider
const equipItem = useCallback((unitId, slot, item) => {
  setState(prev => {
    // 30 lines of business logic mixed with state mutation
  });
}, []);
```

**New (Service Layer):**
```typescript
// core/services/EquipmentService.ts
export class EquipmentService {
  static equipItem(
    unit: Unit,
    slot: EquipmentSlot,
    item: Equipment
  ): Result<Unit, EquipmentError> {
    // Validate item exists
    if (!item) return Err('Item not found');
    
    // Validate slot matches item type
    if (!this.isValidSlot(item, slot)) {
      return Err(`${item.name} cannot be equipped in ${slot} slot`);
    }
    
    // Validate unit can equip (level, class, etc.)
    if (!this.canEquip(unit, item)) {
      return Err(`${unit.name} cannot equip ${item.name}`);
    }
    
    // Create new unit with item equipped
    const newUnit = {
      ...unit,
      equipment: {
        ...unit.equipment,
        [slot]: item,
      },
    };
    
    return Ok(newUnit);
  }
  
  static unequipItem(unit: Unit, slot: EquipmentSlot): Result<Unit, string> {
    // ...
  }
  
  static getEquippedStats(unit: Unit): Stats {
    // Pure calculation
  }
  
  private static isValidSlot(item: Equipment, slot: EquipmentSlot): boolean {
    // ...
  }
  
  private static canEquip(unit: Unit, item: Equipment): boolean {
    // Check level requirements
    // Check class restrictions
    // ...
  }
}

// In state hook:
export const useEquipmentActions = () => {
  const { updateUnit } = usePartyState();
  
  const equipItem = (unitId: string, slot: EquipmentSlot, item: Equipment) => {
    const unit = getUnit(unitId);
    const result = EquipmentService.equipItem(unit, slot, item);
    
    if (result.ok) {
      updateUnit(unitId, result.value);
      SaveService.save();
    } else {
      showError(result.error);
    }
  };
  
  return { equipItem };
};
```

**Benefits:**
- ✅ Pure functions - easy to test
- ✅ Reusable - can use in UI, tests, AI
- ✅ Type-safe - all validation in one place
- ✅ No side effects - returns new state
- ✅ Clear errors - Result type handles failures

---

### 2.5 Animation System Architecture

**New System:**
```typescript
// animations/types.ts
export interface Animation {
  id: string;
  type: AnimationType;
  duration: number;
  delay?: number;
  easing?: EasingFunction;
  onStart?: () => void;
  onComplete?: () => void;
}

export type AnimationType =
  | DamageNumberAnimation
  | ScreenShakeAnimation
  | SpriteAnimation
  | ParticleAnimation
  | FlashAnimation;

// animations/AnimationQueue.ts
export class AnimationQueue {
  private queue: Animation[] = [];
  private running = false;
  
  push(...animations: Animation[]) {
    this.queue.push(...animations);
  }
  
  async execute(): Promise<void> {
    this.running = true;
    
    for (const animation of this.queue) {
      await this.playAnimation(animation);
    }
    
    this.queue = [];
    this.running = false;
  }
  
  private async playAnimation(animation: Animation): Promise<void> {
    animation.onStart?.();
    await wait(animation.duration);
    animation.onComplete?.();
  }
}

// animations/useAnimation.ts
export const useAnimation = () => {
  const queueRef = useRef(new AnimationQueue());
  
  const playDamage = (target: Unit, damage: number) => {
    queueRef.current.push({
      type: 'damageNumber',
      target,
      value: damage,
      duration: 800,
    });
  };
  
  const playScreenShake = (intensity: number) => {
    queueRef.current.push({
      type: 'screenShake',
      intensity,
      duration: 200,
    });
  };
  
  const execute = () => queueRef.current.execute();
  
  return { playDamage, playScreenShake, execute };
};

// In BattleScreen:
const { playDamage, playScreenShake, execute } = useAnimation();

const handleAttack = async () => {
  // Calculate damage
  const damage = calculateDamage(attacker, target);
  
  // Queue animations
  playAttackAnimation(attacker);
  playDamage(target, damage);
  playScreenShake(damage > 50 ? 3 : 1);
  
  // Execute all animations
  await execute();
  
  // Apply damage after animations
  applyDamage(target, damage);
};
```

---

### 2.6 Validation Layer

**Current (No Validation):**
```typescript
// Data files have no runtime validation
export const ABILITIES = {
  'fire-blast': {
    ppCost: -10,  // BUG: Negative PP cost!
    basePower: -50,  // BUG: Negative damage!
  },
};

// Used directly without checking
const ability = ABILITIES['invalid-id'];  // undefined!
```

**New (Validated):**
```typescript
// data/schemas/AbilitySchema.ts
import { z } from 'zod';

export const AbilitySchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  description: z.string(),
  element: z.enum(['Venus', 'Mars', 'Jupiter', 'Mercury', 'Neutral']),
  ppCost: z.number().min(0).max(100),  // Can't be negative!
  basePower: z.number().min(0).max(500),  // Can't be negative!
  target: z.enum(['single-enemy', 'all-enemies', 'single-ally', 'all-allies']),
  accuracy: z.number().min(0).max(100),
  effectType: z.enum(['damage', 'heal', 'buff', 'debuff', 'status']),
  // ...
});

export type Ability = z.infer<typeof AbilitySchema>;

// core/validators/AbilityValidator.ts
export class AbilityValidator {
  static validate(data: unknown): Result<Ability, string[]> {
    const result = AbilitySchema.safeParse(data);
    
    if (result.success) {
      return Ok(result.data);
    } else {
      const errors = result.error.errors.map(e => e.message);
      return Err(errors);
    }
  }
  
  static validateAll(data: Record<string, unknown>): Result<Record<string, Ability>, string[]> {
    const errors: string[] = [];
    const validated: Record<string, Ability> = {};
    
    for (const [id, ability] of Object.entries(data)) {
      const result = this.validate(ability);
      if (result.ok) {
        validated[id] = result.value;
      } else {
        errors.push(`Ability ${id}: ${result.error.join(', ')}`);
      }
    }
    
    return errors.length === 0 ? Ok(validated) : Err(errors);
  }
}

// At startup:
const result = AbilityValidator.validateAll(RAW_ABILITIES);
if (!result.ok) {
  console.error('Invalid abilities found:', result.error);
  // Fail fast in development
  if (import.meta.env.DEV) {
    throw new Error('Invalid game data');
  }
}

export const ABILITIES = result.value;  // Guaranteed valid!
```

---

### 2.7 Component Refactoring Example: Battle

**Old (Current):**
```typescript
// BattleScreen.tsx (500+ lines)
export const BattleScreen = () => {
  // 1. Local state management
  const [currentActor, setCurrentActor] = useState(...);
  const [phase, setPhase] = useState(...);
  const [selectedAbility, setSelectedAbility] = useState(...);
  const [combatLog, setCombatLog] = useState(...);
  
  // 2. Business logic
  const calculateDamage = () => { ... };
  const applyBuff = () => { ... };
  const checkVictory = () => { ... };
  
  // 3. UI rendering
  return <div>...</div>;
};
```

**New (Proposed):**
```typescript
// ui/screens/BattleScreen/BattleScreen.tsx (orchestrator)
export const BattleScreen = () => {
  const battle = useBattleState();
  const actions = useBattleActions();
  const animations = useAnimation();
  
  return (
    <BattleView
      battle={battle}
      onAction={actions.executeAction}
      animations={animations}
    />
  );
};

// ui/screens/BattleScreen/BattleView.tsx (pure UI)
export const BattleView = ({ battle, onAction, animations }) => {
  return (
    <div className="battle-screen">
      <BattleField battle={battle} />
      <BattleHUD battle={battle} />
      <BattleControls
        currentActor={battle.currentActor}
        onAction={onAction}
      />
    </div>
  );
};

// state/hooks/useBattle.ts
export const useBattleState = () => {
  const { battleState } = useGameState();
  return battleState;
};

export const useBattleActions = () => {
  const dispatch = useDispatch();
  
  const executeAction = async (action: BattleAction) => {
    // Validate
    const result = BattleService.validateAction(battle, action);
    if (!result.ok) return;
    
    // Calculate result
    const outcome = BattleService.executeAction(battle, action);
    
    // Update state
    dispatch({ type: 'BATTLE_ACTION', payload: outcome });
    
    // Play animations
    await playActionAnimations(outcome);
    
    // Check victory/defeat
    const status = BattleService.checkBattleStatus(battle);
    if (status !== 'ongoing') {
      dispatch({ type: 'BATTLE_END', payload: status });
    }
  };
  
  return { executeAction };
};

// core/services/BattleService.ts (pure logic)
export class BattleService {
  static validateAction(battle: Battle, action: BattleAction): Result<void, string> {
    // Pure validation
  }
  
  static executeAction(battle: Battle, action: BattleAction): BattleOutcome {
    // Pure calculation
    // No state mutation!
    return {
      damage: ...,
      effects: ...,
      logs: ...,
    };
  }
  
  static checkBattleStatus(battle: Battle): BattleStatus {
    // Pure check
  }
}
```

---

## 🗺️ PART 3: MIGRATION PLAN

### 3.1 Incremental Refactoring Strategy

**NOT a rewrite!** Refactor incrementally while keeping game functional.

**Phase 1: Foundation (Week 1)**
- ✅ Create new directory structure
- ✅ Set up validation layer (Zod schemas)
- ✅ Validate all data files at startup
- ✅ Create service layer interfaces
- ✅ Write comprehensive tests for services

**Phase 2: Extract Equipment System (Week 2)**
- ✅ Create EquipmentService with all logic
- ✅ Create useEquipment hook
- ✅ Migrate EquipmentScreen to use new hook
- ✅ Remove equipment logic from GameProvider
- ✅ Verify tests pass

**Phase 3: Extract Party System (Week 2)**
- ✅ Create PartyService
- ✅ Create useParty hook
- ✅ Migrate PartyManagementScreen
- ✅ Remove party logic from GameProvider

**Phase 4: Extract Djinn System (Week 3)**
- ✅ Create DjinnService
- ✅ Create useDjinn hook
- ✅ Migrate DjinnScreen
- ✅ Remove djinn logic from GameProvider

**Phase 5: Extract Battle System (Week 3-4)**
- ✅ Create BattleService
- ✅ Implement animation system
- ✅ Create useBattle hook
- ✅ Refactor BattleScreen
- ✅ Add visual polish

**Phase 6: Polish & Optimization (Week 4)**
- ✅ Fix overworld animations
- ✅ Fix battle transitions
- ✅ Performance optimization
- ✅ Final testing

---

### 3.2 Detailed Phase 1: Foundation

**Step 1.1: Create Directory Structure**
```bash
mkdir -p src/core/{models,services,systems,validators}
mkdir -p src/state/{slices,hooks}
mkdir -p src/animations/{effects}
mkdir -p src/data/schemas
```

**Step 1.2: Install Dependencies**
```json
{
  "dependencies": {
    "zod": "^3.22.4"  // Runtime validation
  }
}
```

**Step 1.3: Create Base Schemas**
```typescript
// src/data/schemas/AbilitySchema.ts
import { z } from 'zod';

export const AbilitySchema = z.object({
  id: z.string(),
  name: z.string(),
  ppCost: z.number().min(0),
  basePower: z.number().min(0),
  // ...
});

// Validate at startup
import { ABILITIES as RAW_ABILITIES } from './definitions/abilities';
import { AbilitySchema } from './schemas/AbilitySchema';

const validated = Object.fromEntries(
  Object.entries(RAW_ABILITIES).map(([id, ability]) => {
    const result = AbilitySchema.safeParse(ability);
    if (!result.success) {
      throw new Error(`Invalid ability ${id}: ${result.error}`);
    }
    return [id, result.data];
  })
);

export const ABILITIES = validated;
```

**Step 1.4: Create Service Base Class**
```typescript
// src/core/services/BaseService.ts
export abstract class BaseService {
  protected static logger = console;
  
  protected static handleError<T>(
    operation: string,
    error: unknown
  ): Result<T, string> {
    const message = error instanceof Error ? error.message : String(error);
    this.logger.error(`[${operation}] ${message}`);
    return Err(message);
  }
}
```

**Step 1.5: Write Tests for Services**
```typescript
// tests/unit/EquipmentService.test.ts
import { EquipmentService } from '@/core/services/EquipmentService';

describe('EquipmentService', () => {
  describe('equipItem', () => {
    it('should equip valid item to correct slot', () => {
      const unit = createTestUnit();
      const sword = createTestSword();
      
      const result = EquipmentService.equipItem(unit, 'weapon', sword);
      
      expect(result.ok).toBe(true);
      expect(result.value.equipment.weapon).toEqual(sword);
    });
    
    it('should reject item in wrong slot', () => {
      const unit = createTestUnit();
      const sword = createTestSword();
      
      const result = EquipmentService.equipItem(unit, 'armor', sword);
      
      expect(result.ok).toBe(false);
      expect(result.error).toContain('cannot be equipped in armor slot');
    });
    
    // More tests...
  });
});
```

---

### 3.3 Detailed Phase 2: Equipment System

**Step 2.1: Create EquipmentService**
```typescript
// src/core/services/EquipmentService.ts
export class EquipmentService extends BaseService {
  static equipItem(
    unit: Unit,
    slot: EquipmentSlot,
    item: Equipment
  ): Result<Unit, string> {
    // Validation
    if (!this.isValidSlot(item, slot)) {
      return Err(`${item.name} cannot be equipped in ${slot} slot`);
    }
    
    if (!this.canEquip(unit, item)) {
      return Err(`${unit.name} cannot equip ${item.name} (level ${item.requiredLevel} required)`);
    }
    
    // Store old item (for inventory)
    const oldItem = unit.equipment[slot];
    
    // Create new unit
    const newUnit = {
      ...unit,
      equipment: {
        ...unit.equipment,
        [slot]: item,
      },
    };
    
    return Ok(newUnit);
  }
  
  static unequipItem(
    unit: Unit,
    slot: EquipmentSlot
  ): Result<Unit, string> {
    if (!unit.equipment[slot]) {
      return Err(`No item equipped in ${slot} slot`);
    }
    
    const newUnit = {
      ...unit,
      equipment: {
        ...unit.equipment,
        [slot]: null,
      },
    };
    
    return Ok(newUnit);
  }
  
  static calculateEquippedStats(unit: Unit): Stats {
    // Pure calculation
    let totalStats = { ...unit.baseStats };
    
    for (const item of Object.values(unit.equipment)) {
      if (item?.statBonus) {
        totalStats = addStats(totalStats, item.statBonus);
      }
    }
    
    return totalStats;
  }
  
  static getEquippedAbilities(unit: Unit): Ability[] {
    const abilities: Ability[] = [];
    
    for (const item of Object.values(unit.equipment)) {
      if (item?.grantedAbilities) {
        abilities.push(...item.grantedAbilities);
      }
    }
    
    return abilities;
  }
  
  private static isValidSlot(item: Equipment, slot: EquipmentSlot): boolean {
    return item.slot === slot;
  }
  
  private static canEquip(unit: Unit, item: Equipment): boolean {
    if (item.requiredLevel && unit.currentLevel < item.requiredLevel) {
      return false;
    }
    
    if (item.classRestrictions && !item.classRestrictions.includes(unit.class)) {
      return false;
    }
    
    return true;
  }
}
```

**Step 2.2: Create Equipment Hook**
```typescript
// src/state/hooks/useEquipment.ts
export const useEquipmentActions = () => {
  const { state, dispatch } = useGameState();
  
  const equipItem = (unitId: string, slot: EquipmentSlot, itemId: string) => {
    const unit = state.playerData.unitsCollected.find(u => u.id === unitId);
    if (!unit) return;
    
    const item = state.playerData.inventory.find(i => i.id === itemId);
    if (!item) return;
    
    // Use service
    const result = EquipmentService.equipItem(unit, slot, item);
    
    if (result.ok) {
      dispatch({
        type: 'UNIT_UPDATE',
        payload: { unitId, unit: result.value },
      });
      
      // Remove from inventory
      dispatch({
        type: 'INVENTORY_REMOVE',
        payload: { itemId },
      });
      
      // Save
      SaveService.save(state);
    } else {
      dispatch({
        type: 'SHOW_ERROR',
        payload: { message: result.error },
      });
    }
  };
  
  const unequipItem = (unitId: string, slot: EquipmentSlot) => {
    const unit = state.playerData.unitsCollected.find(u => u.id === unitId);
    if (!unit) return;
    
    const item = unit.equipment[slot];
    if (!item) return;
    
    // Use service
    const result = EquipmentService.unequipItem(unit, slot);
    
    if (result.ok) {
      dispatch({
        type: 'UNIT_UPDATE',
        payload: { unitId, unit: result.value },
      });
      
      // Add to inventory
      dispatch({
        type: 'INVENTORY_ADD',
        payload: { item },
      });
      
      // Save
      SaveService.save(state);
    }
  };
  
  return { equipItem, unequipItem };
};
```

**Step 2.3: Migrate EquipmentScreen**
```typescript
// Before:
const { equipItem } = useGame().actions;

// After:
const { equipItem } = useEquipmentActions();
```

**Step 2.4: Remove from GameProvider**
```typescript
// Delete from GameProvider.tsx:
const equipItem = useCallback(...);  // DELETE
const unequipItem = useCallback(...);  // DELETE
```

---

### 3.4 Parallel Work Streams

**While refactoring backend, improve frontend:**

**Stream 1: Battle Polish (Can do in parallel)**
- Add damage number component
- Add screen shake hook
- Add particle effects
- Add sprite animations
- Improve layout (fix bottom panel)

**Stream 2: Overworld Improvements (Can do in parallel)**
- Add walking animation system
- Fix battle triggers
- Add transition effects
- Improve camera system

**Stream 3: Data Validation (One-time task)**
- Validate all abilities
- Validate all equipment
- Validate all enemies
- Validate all units
- Fix any bad data

---

## 📋 PART 4: SPECIFIC CODE TASKS

### Task 1: Create EquipmentService (2-3 hours)

**File:** `src/core/services/EquipmentService.ts`

```typescript
import { Result, Ok, Err } from '@/utils/Result';
import type { Unit } from '@/types/Unit';
import type { Equipment, EquipmentSlot } from '@/types/Equipment';
import type { Stats } from '@/types/Stats';

export class EquipmentService {
  /**
   * Equip an item to a unit
   */
  static equipItem(
    unit: Unit,
    slot: EquipmentSlot,
    item: Equipment
  ): Result<Unit, string> {
    // TODO: Implement validation
    // TODO: Implement equipment logic
    // TODO: Return new unit
  }
  
  /**
   * Unequip an item from a unit
   */
  static unequipItem(
    unit: Unit,
    slot: EquipmentSlot
  ): Result<Unit, string> {
    // TODO: Implement
  }
  
  /**
   * Calculate total stats from equipped items
   */
  static calculateEquippedStats(unit: Unit): Stats {
    // TODO: Implement pure calculation
  }
  
  /**
   * Get abilities granted by equipped items
   */
  static getEquippedAbilities(unit: Unit): Ability[] {
    // TODO: Implement
  }
  
  // Private helpers
  private static isValidSlot(item: Equipment, slot: EquipmentSlot): boolean {
    // TODO: Implement
  }
  
  private static canEquip(unit: Unit, item: Equipment): boolean {
    // TODO: Check level, class restrictions
  }
}
```

**Tests:**
```typescript
// tests/unit/EquipmentService.test.ts
describe('EquipmentService', () => {
  test('equipItem: valid item to correct slot', () => { ... });
  test('equipItem: reject wrong slot', () => { ... });
  test('equipItem: reject insufficient level', () => { ... });
  test('unequipItem: removes item', () => { ... });
  test('calculateEquippedStats: sums all bonuses', () => { ... });
  // ... 20+ tests
});
```

---

### Task 2: Create Animation System (4-6 hours)

**File:** `src/animations/AnimationQueue.ts`

```typescript
export interface Animation {
  id: string;
  type: AnimationType;
  duration: number;
  delay?: number;
  onStart?: () => void;
  onComplete?: () => void;
  props?: Record<string, any>;
}

export class AnimationQueue {
  private queue: Animation[] = [];
  private playing = false;
  
  push(...animations: Animation[]) {
    this.queue.push(...animations);
  }
  
  async execute(): Promise<void> {
    // TODO: Implement animation playback
  }
  
  clear() {
    this.queue = [];
  }
  
  get length() {
    return this.queue.length;
  }
}
```

**Hook:**
```typescript
// src/animations/useAnimation.ts
export const useAnimation = () => {
  const queueRef = useRef(new AnimationQueue());
  
  const playDamage = (target: Unit, damage: number, position: Position) => {
    queueRef.current.push({
      type: 'damageNumber',
      duration: 800,
      props: { target, damage, position },
    });
  };
  
  const playScreenShake = (intensity: number) => {
    // TODO: Implement
  };
  
  const playSpriteAnimation = (unit: Unit, animation: string) => {
    // TODO: Implement
  };
  
  return {
    playDamage,
    playScreenShake,
    playSpriteAnimation,
    execute: () => queueRef.current.execute(),
  };
};
```

**Component:**
```typescript
// src/animations/effects/DamageNumber.tsx
export const DamageNumber: React.FC<{
  damage: number;
  position: Position;
  onComplete: () => void;
}> = ({ damage, position, onComplete }) => {
  // TODO: Implement floating damage number animation
};
```

---

### Task 3: Fix Battle Rewards Bug (1-2 hours)

**Current Issue:** Equipment rewards not being added to inventory

**File:** `src/context/GameProvider.tsx` line ~600

**Investigation:**
```typescript
const endBattle = useCallback(() => {
  // Check if equipment rewards are actually being applied
  console.log('Battle rewards:', lastBattleRewards);
  
  // TODO: Find where equipment should be added
  // TODO: Verify inventory update
  // TODO: Add test to prevent regression
}, []);
```

**Fix:**
```typescript
const endBattle = useCallback(() => {
  const rewards = state.lastBattleRewards;
  
  // Add equipment to inventory
  if (rewards?.rewards.equipmentDrops) {
    setState(prev => ({
      ...prev,
      playerData: {
        ...prev.playerData,
        inventory: [
          ...prev.playerData.inventory,
          ...rewards.rewards.equipmentDrops,
        ],
      },
    }));
  }
  
  // Navigate to rewards screen
  navigate({ type: 'REWARDS' });
}, [state.lastBattleRewards]);
```

---

### Task 4: Add Walking Animation (3-4 hours)

**File:** `src/components/overworld/NewOverworldScreen.tsx`

**Current:** Isaac sprite just teleports

**New:** Add animation state machine

```typescript
type AnimationState = 'idle' | 'walking';
type Direction = 'up' | 'down' | 'left' | 'right';

const [animationState, setAnimationState] = useState<AnimationState>('idle');
const [direction, setDirection] = useState<Direction>('down');
const [animationFrame, setAnimationFrame] = useState(0);

// Animation loop
useEffect(() => {
  if (animationState !== 'walking') return;
  
  const interval = setInterval(() => {
    setAnimationFrame(frame => (frame + 1) % 4);  // 4 walk frames
  }, 150);  // 150ms per frame = 6.6 FPS (GBA speed)
  
  return () => clearInterval(interval);
}, [animationState]);

// On movement
const handleMove = (dx: number, dy: number) => {
  // Set direction
  if (dy < 0) setDirection('up');
  if (dy > 0) setDirection('down');
  if (dx < 0) setDirection('left');
  if (dx > 0) setDirection('right');
  
  // Start walking animation
  setAnimationState('walking');
  
  // Move player
  actions.movePlayer(dx, dy);
  
  // Stop animation after move
  setTimeout(() => {
    setAnimationState('idle');
    setAnimationFrame(0);
  }, 300);
};

// Get sprite
const getSpriteUrl = () => {
  if (animationState === 'idle') {
    return `/sprites/isaac_${direction}_idle.png`;
  } else {
    return `/sprites/isaac_${direction}_walk_${animationFrame}.png`;
  }
};
```

---

## 🎯 PART 5: PRIORITY MATRIX

### Critical (Do First)
1. ✅ Create data validation layer (Week 1)
2. ✅ Fix battle rewards bug (Day 1)
3. ✅ Fix battle triggers bug (Day 1-2)
4. ✅ Create EquipmentService + tests (Week 1)

### High (Do Soon)
5. ✅ Add walking animation system (Week 2)
6. ✅ Create animation system architecture (Week 2)
7. ✅ Battle polish - damage numbers, shake (Week 2)
8. ✅ Extract party management to service (Week 2)

### Medium (Can Wait)
9. ✅ Extract Djinn system to service (Week 3)
10. ✅ Refactor BattleScreen architecture (Week 3)
11. ✅ Improve battle UI layout (Week 3)
12. ✅ Add transition effects (Week 3)

### Low (Polish)
13. ✅ Extract all systems from GameProvider (Week 4)
14. ✅ Performance optimization (Week 4)
15. ✅ Accessibility improvements (Week 4)
16. ✅ Mobile optimization (Future)

---

## 📈 SUCCESS METRICS

### After Refactoring, You Should Have:

**Architecture:**
- ✅ GameProvider < 200 lines (currently 808)
- ✅ All business logic in services (currently mixed)
- ✅ All data validated at startup (currently none)
- ✅ Clear component hierarchy (currently messy)
- ✅ Animation system (currently doesn't exist)

**Code Quality:**
- ✅ 80%+ test coverage on services
- ✅ No `any` types (currently several)
- ✅ No console.log in production (currently many)
- ✅ TypeScript strict mode enabled
- ✅ All bugs from audit fixed

**Performance:**
- ✅ Battle screen 60fps (currently janky)
- ✅ State updates < 16ms (currently slow)
- ✅ Initial load < 2s (currently ok)
- ✅ Save/load < 100ms (currently ok)

**User Experience:**
- ✅ Walking animations smooth
- ✅ Battle feels impactful
- ✅ Transitions polished
- ✅ UI responsive
- ✅ No visual bugs

---

## 🚀 GETTING STARTED

### Immediate Next Steps:

1. **Read this document fully**
2. **Run existing tests:** `npm test`
3. **Fix critical bugs:** Battle rewards + triggers
4. **Start Phase 1:** Create validation layer
5. **Choose service to extract first:** Equipment recommended

### Questions to Answer Before Starting:

1. Do you want to use Redux or stick with Context API?
2. Should we use Zod for validation or write custom validators?
3. Are you comfortable with class-based services or prefer functions?
4. What's your timeline? (Aggressive 4 weeks vs relaxed 8 weeks)
5. Do you want help with specific tasks or just the architecture?

---

## 💬 WHAT DO YOU WANT TO DO?

I can help with:

**Option A: Quick Wins**
- Fix battle rewards bug (1-2 hours)
- Fix battle triggers (2-3 hours)
- Add walking animation (3-4 hours)
→ Immediate improvements, game feels better

**Option B: Foundation First**
- Set up validation layer (4-6 hours)
- Create EquipmentService (3-4 hours)
- Extract equipment system (4-6 hours)
→ Long-term investment, better architecture

**Option C: Battle Polish**
- Create animation system (4-6 hours)
- Add damage numbers (2-3 hours)
- Fix battle UI layout (3-4 hours)
→ Make battles feel good

**Option D: Custom Plan**
- Tell me your priorities
- I'll create a custom task list

**What would you like to tackle first?** 🎮
