# INTEGRATION SPECIFICATIONS - Vale Chronicles

**Architect Deliverable - Phase 3**

This document defines how all game systems connect and integrate with each other.

---

## TABLE OF CONTENTS

1. [System Architecture Overview](#1-system-architecture-overview)
2. [Data Flow Diagrams](#2-data-flow-diagrams)
3. [State Management](#3-state-management)
4. [Event System](#4-event-system)
5. [API Contracts](#5-api-contracts)
6. [React Component Hierarchy](#6-react-component-hierarchy)

---

## 1. SYSTEM ARCHITECTURE OVERVIEW

### 1.1 Core Systems

```
┌─────────────────────────────────────────────────┐
│                  GAME STATE                     │
│  - Units (stats, equipment, Djinn, XP)         │
│  - Inventory (items, equipment, Djinn)         │
│  - Story Flags (recruitment, quests, progress) │
│  - Player Data (gold, overworld position)      │
└──────────────┬──────────────────────────────────┘
               │
       ┌───────┴───────┐
       │               │
┌──────▼──────┐  ┌────▼─────┐
│  OVERWORLD  │  │  BATTLE  │
│   SYSTEM    │  │  SYSTEM  │
└──────┬──────┘  └────┬─────┘
       │               │
       │         ┌─────▼──────┐
       │         │  REWARDS   │
       │         │  SYSTEM    │
       │         └─────┬──────┘
       │               │
┌──────▼───────────────▼──────┐
│     UI LAYER (React)        │
│  - Equipment Screen         │
│  - Unit Collection Screen   │
│  - Battle Scene             │
│  - Rewards Screen           │
└─────────────────────────────┘
```

### 1.2 System Dependencies

```typescript
// Core dependency graph
const SYSTEM_DEPENDENCIES = {
  GameState: [],  // No dependencies (root)

  UnitSystem: ["GameState"],
  EquipmentSystem: ["GameState", "UnitSystem"],
  DjinnSystem: ["GameState", "UnitSystem"],

  BattleSystem: ["GameState", "UnitSystem", "EquipmentSystem", "DjinnSystem"],
  RewardsSystem: ["GameState", "UnitSystem", "BattleSystem"],

  OverworldSystem: ["GameState", "BattleSystem"],

  UILayer: ["GameState", "UnitSystem", "EquipmentSystem", "DjinnSystem", "BattleSystem", "RewardsSystem"]
};
```

---

## 2. DATA FLOW DIAGRAMS

### 2.1 Battle Flow

```
┌────────────┐
│ OVERWORLD  │
│ - Walking  │
└─────┬──────┘
      │ Random encounter triggered (5% per step)
      │
┌─────▼───────────┐
│ TRANSITION      │  Duration: 2.3s
│ - Swirl anim    │
└─────┬───────────┘
      │
┌─────▼─────────────────────────────┐
│ BATTLE                            │
│ 1. Initialize battle state        │
│ 2. Calculate turn order (SPD)     │
│ 3. Each unit acts in order        │
│ 4. Check battle end after actions │
│ 5. Repeat until victory/defeat    │
└─────┬─────────────────────────────┘
      │ Victory
┌─────▼──────────────────────────────┐
│ REWARDS                            │
│ - Calculate XP, gold, items        │
│ - Check for level ups              │
│ - Check for recruitments           │
│ - Display animations (staggered)   │
└─────┬──────────────────────────────┘
      │ Continue clicked
┌─────▼────────┐
│ OVERWORLD    │
│ - Resume     │
└──────────────┘
```

### 2.2 Equipment Flow

```
┌────────────────┐
│ Unit Selected  │
└────┬───────────┘
     │
┌────▼──────────────────────┐
│ Equipment Screen          │
│ - Show current equipment  │
│ - Show inventory          │
└────┬──────────────────────┘
     │ User clicks item in inventory
┌────▼──────────────────────┐
│ Stat Comparison           │
│ - Calculate current stats │
│ - Calculate new stats     │
│ - Show diff with colors   │
└────┬──────────────────────┘
     │ User confirms equip
┌────▼──────────────────────┐
│ Equip Item                │
│ 1. Remove old item        │
│ 2. Add to inventory       │
│ 3. Equip new item         │
│ 4. Remove from inventory  │
│ 5. Recalculate stats      │
│ 6. Update UI              │
└───────────────────────────┘
```

### 2.3 Djinn Flow

```
┌────────────────┐
│ Djinn Obtained │ (Quest reward, boss drop, etc.)
└────┬───────────┘
     │
┌────▼──────────────────────┐
│ Djinn Collection          │
│ - Add to collection       │
│ - Set unlock flag         │
└────┬──────────────────────┘
     │ User equips to unit
┌────▼──────────────────────┐
│ Calculate Synergy         │
│ - Count by element        │
│ - Apply synergy formula   │
│ - Add stat bonuses        │
│ - Update class name       │
│ - Unlock abilities        │
└────┬──────────────────────┘
     │ In battle
┌────▼──────────────────────┐
│ Activate Djinn            │
│ 1. Check requirement met  │
│ 2. Unleash effect         │
│ 3. Set to Standby state   │
│ 4. Remove passive bonus   │
│ 5. Start 2-turn timer     │
└────┬──────────────────────┘
     │ After 2 turns
┌────▼──────────────────────┐
│ Djinn Returns to Set      │
│ - Restore passive bonus   │
│ - Recalculate synergy     │
└───────────────────────────┘
```

---

## 3. STATE MANAGEMENT

### 3.1 Global Game State

```typescript
interface GameState {
  // Core data
  version: string;
  timestamp: number;

  // Player progress
  player: {
    gold: number;
    overworldPosition: { x: number; y: number };
    currentArea: string;
  };

  // Units
  units: Map<string, Unit>;  // All recruited units (max 10)
  activeParty: string[];     // IDs of 4 active units

  // Collections
  inventory: Inventory;       // Equipment and items
  djinnCollection: DjinnCollection;  // All 12 Djinn

  // Flags
  recruitmentFlags: Map<string, boolean>;
  storyFlags: Map<string, boolean>;

  // Current scene
  currentScene: "overworld" | "battle" | "transition" | "rewards" | "equipment" | "collection";

  // Battle state (when in battle)
  currentBattle: Battle | null;

  // Rewards state (when showing rewards)
  rewardsData: RewardsData | null;
}
```

### 3.2 State Update Flow

```typescript
// State updates follow this pattern:

// 1. Action dispatched
game.dispatch({ type: "EQUIP_ITEM", unitId: "isaac", slot: "weapon", item: WEAPONS.iron });

// 2. Reducer processes action
function gameReducer(state: GameState, action: Action): GameState {
  switch (action.type) {
    case "EQUIP_ITEM":
      return {
        ...state,
        units: new Map(state.units).set(
          action.unitId,
          equipItemToUnit(state.units.get(action.unitId), action.slot, action.item)
        )
      };
  }
}

// 3. UI re-renders with new state
// React components automatically re-render when state changes
```

### 3.3 Persistence

```typescript
// Auto-save triggers
const AUTO_SAVE_TRIGGERS = [
  "BATTLE_VICTORY",
  "UNIT_RECRUITED",
  "UNIT_LEVELED_UP",
  "EQUIPMENT_CHANGED",
  "DJINN_COLLECTED",
  "INN_RESTED"
];

// Save function
function autoSave(state: GameState): void {
  localStorage.setItem("vale_chronicles_save", JSON.stringify(state));
  console.log("Auto-saved at", new Date().toISOString());
}

// Load function
function loadSave(): GameState | null {
  const saved = localStorage.getItem("vale_chronicles_save");
  if (!saved) return null;

  return JSON.parse(saved);
}
```

---

## 4. EVENT SYSTEM

### 4.1 Event Bus

```typescript
// Centralized event system for cross-system communication

class EventBus {
  private listeners: Map<string, Set<Function>> = new Map();

  on(event: string, callback: Function): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(callback);
  }

  emit(event: string, data?: any): void {
    if (!this.listeners.has(event)) return;

    this.listeners.get(event)!.forEach(callback => {
      callback(data);
    });
  }

  off(event: string, callback: Function): void {
    if (!this.listeners.has(event)) return;
    this.listeners.get(event)!.delete(callback);
  }
}

const eventBus = new EventBus();
```

### 4.2 Event Catalog

```typescript
const GAME_EVENTS = {
  // Battle events
  "battle:started": "Battle initialized",
  "battle:turn:start": "Unit's turn started",
  "battle:turn:end": "Unit's turn ended",
  "battle:damage:dealt": "Damage dealt to unit",
  "battle:unit:ko": "Unit knocked out",
  "battle:victory": "Battle won",
  "battle:defeat": "Battle lost",

  // Unit events
  "unit:recruited": "New unit joined party",
  "unit:levelup": "Unit gained a level",
  "unit:ability:unlocked": "New ability unlocked",

  // Equipment events
  "equipment:equipped": "Item equipped",
  "equipment:unequipped": "Item unequipped",

  // Djinn events
  "djinn:collected": "New Djinn obtained",
  "djinn:equipped": "Djinn equipped to unit",
  "djinn:activated": "Djinn used in battle",
  "djinn:recovered": "Djinn returned to Set state",

  // Overworld events
  "overworld:step": "Player took a step",
  "overworld:encounter": "Random encounter triggered",
  "overworld:area:changed": "Entered new area",

  // Save events
  "save:autosave": "Auto-save triggered",
  "save:manual": "Manual save triggered",
  "save:loaded": "Save file loaded"
};
```

### 4.3 Event Usage Examples

```typescript
// Battle system emits damage event
eventBus.emit("battle:damage:dealt", {
  attacker: isaac,
  defender: goblin,
  damage: 47,
  isCrit: false
});

// UI listens for damage event to show animation
eventBus.on("battle:damage:dealt", (data) => {
  showDamageAnimation(data.defender, data.damage);
  playSound(data.isCrit ? "crit.mp3" : "hit.mp3");
});

// Stats tracker listens for damage event
eventBus.on("battle:damage:dealt", (data) => {
  gameStats.totalDamageDealt += data.damage;
});

// Achievement system listens for damage event
eventBus.on("battle:damage:dealt", (data) => {
  if (data.damage >= 100) {
    unlockAchievement("HEAVY_HITTER");
  }
});
```

---

## 5. API CONTRACTS

### 5.1 Unit System

```typescript
interface UnitAPI {
  // Creation
  createUnit(id: string, level: number): Unit;

  // Stats
  calculateFinalStats(unit: Unit): Stats;
  getBaseStats(unit: Unit): Stats;

  // Leveling
  addXP(unit: Unit, xp: number): LevelUpResult;
  checkLevelUp(unit: Unit): boolean;
  applyLevelUp(unit: Unit): void;

  // Abilities
  canUseAbility(unit: Unit, abilityId: string): boolean;
  useAbility(unit: Unit, ability: Ability, targets: Unit[]): AbilityResult;

  // Equipment
  equip(unit: Unit, slot: Slot, item: Equipment): boolean;
  unequip(unit: Unit, slot: Slot): Equipment | null;

  // Djinn
  equipDjinn(unit: Unit, djinn: Djinn): boolean;
  unequipDjinn(unit: Unit, djinn: Djinn): boolean;
  activateDjinn(unit: Unit, djinnId: string): DjinnResult;
}

// Return types
interface LevelUpResult {
  leveled: boolean;
  newLevel: number;
  abilitiesUnlocked: string[];
}

interface AbilityResult {
  success: boolean;
  damage?: number;
  healing?: number;
  targets: Unit[];
  ppCost: number;
}

interface DjinnResult {
  success: boolean;
  damage?: number;
  healing?: number;
  buffApplied?: StatusEffect;
}
```

### 5.2 Battle System

```typescript
interface BattleAPI {
  // Battle lifecycle
  startBattle(playerParty: Unit[], enemies: Enemy[]): Battle;
  executeTurn(battle: Battle, unit: Unit, action: Action): TurnResult;
  checkBattleEnd(battle: Battle): BattleResult | null;
  endBattle(battle: Battle, result: BattleResult): void;

  // Combat
  calculatePhysicalDamage(attacker: Unit, defender: Unit, ability: Ability): number;
  calculatePsynergyDamage(attacker: Unit, defender: Unit, ability: Ability): number;
  calculateHealAmount(caster: Unit, ability: Ability): number;

  // Turn order
  calculateTurnOrder(units: Unit[]): Unit[];

  // Special
  checkCriticalHit(attacker: Unit): boolean;
  attemptFlee(battle: Battle): boolean;
}

// Return types
interface TurnResult {
  actionTaken: Action;
  damage?: number;
  healing?: number;
  targetedUnits: Unit[];
  effects: StatusEffect[];
}

interface BattleResult {
  victory: boolean;
  rewards: RewardsData;
}
```

### 5.3 Rewards System

```typescript
interface RewardsAPI {
  // Calculation
  calculateBattleXP(enemyLevel: number, partySize: number): number;
  calculateBattleGold(enemyLevel: number): number;
  rollItemDrop(dropTable: DropTable): Item | null;

  // Distribution
  distributeXP(units: Unit[], xp: number): LevelUpResult[];
  addGold(amount: number): void;
  addItem(item: Item): void;

  // Special rewards
  checkRecruitment(battle: Battle): RecruitmentData | null;
  handleRecruitment(unitId: string, level: number): void;
}

// Return types
interface RewardsData {
  xp: number;
  gold: number;
  items: Item[];
  recruitment: RecruitmentData | null;
  levelUps: LevelUpResult[];
}

interface RecruitmentData {
  unitId: string;
  name: string;
  class: string;
  level: number;
  element: Element;
}
```

### 5.4 Equipment System

```typescript
interface EquipmentAPI {
  // Inventory management
  addToInventory(item: Equipment): void;
  removeFromInventory(item: Equipment): boolean;
  getInventory(filter?: EquipmentType): Equipment[];
  sortInventory(by: "atk" | "def" | "cost"): Equipment[];

  // Equipment comparison
  compareEquipment(unit: Unit, newItem: Equipment, slot: Slot): StatComparison;

  // Special equipment
  checkLegendaryUnlock(unit: Unit, item: Equipment): string[] | null;  // Unlocked abilities
}

// Return types
interface StatComparison {
  current: Stats;
  new: Stats;
  diff: Stats;  // Positive or negative values
}
```

### 5.5 Djinn System

```typescript
interface DjinnAPI {
  // Collection
  unlockDjinn(djinnId: string): void;
  getDjinnCollection(element?: Element): Djinn[];

  // Synergy
  calculateDjinnSynergy(djinn: Djinn[]): SynergyBonus;

  // Battle usage
  canActivateDjinn(unit: Unit, djinnId: string): boolean;
  activateDjinn(unit: Unit, djinnId: string): DjinnResult;
  advanceDjinnRecovery(unit: Unit): void;  // Call each turn
}

// Return types
interface SynergyBonus {
  atk: number;
  def: number;
  spd: number;
  class: string;
  abilitiesUnlocked: string[];
}
```

---

## 6. REACT COMPONENT HIERARCHY

### 6.1 Component Tree

```
<App>
  <GameStateProvider>  // Global state context
    <Router>
      <Route path="/overworld">
        <OverworldScene>
          <PlayerSprite />
          <NPCSprites />
          <EncounterTrigger />
        </OverworldScene>
      </Route>

      <Route path="/battle">
        <BattleTransition />  // Plays, then fades to BattleScene
        <BattleScene>
          <PlayerParty>
            <UnitCard /> × 4
          </PlayerParty>
          <EnemyParty>
            <EnemySprite /> × N
          </EnemyParty>
          <ActionMenu>
            <AttackButton />
            <PsynergyMenu>
              <AbilityButton /> × N
            </PsynergyMenu>
            <DjinnMenu>
              <DjinnButton /> × 3
            </DjinnMenu>
            <FleeButton />
          </ActionMenu>
          <BattleLog />
        </BattleScene>
      </Route>

      <Route path="/rewards">
        <RewardsScreen>
          <VictoryBanner />
          <RewardsGrid>
            <XPCard />
            <GoldCard />
          </RewardsGrid>
          <ItemsPanel>
            <ItemCard /> × N
          </ItemsPanel>
          <RecruitmentAnnouncement />  // Conditional
          <LevelUpNotification>       // Conditional
            <LevelUpUnit /> × N
          </LevelUpNotification>
          <ContinueButton />
        </RewardsScreen>
      </Route>

      <Route path="/equipment">
        <EquipmentScreen>
          <UnitSelector>
            <UnitCard /> × 10
          </UnitSelector>
          <EquipmentPanel>
            <EquipmentSlot slot="weapon" />
            <EquipmentSlot slot="armor" />
            <EquipmentSlot slot="helm" />
            <EquipmentSlot slot="boots" />
            <StatComparison />
          </EquipmentPanel>
          <InventoryPanel>
            <EquipmentItem /> × N
          </InventoryPanel>
        </EquipmentScreen>
      </Route>

      <Route path="/collection">
        <UnitCollectionScreen>
          <UnitsGrid>
            <UnitCard /> × 10
          </UnitsGrid>
          <StatsPanel>
            <UnitDetails />
            <ActionButtons>
              <AddToPartyButton />
              <RemoveFromPartyButton />
              <ViewEquipmentButton />
            </ActionButtons>
          </StatsPanel>
        </UnitCollectionScreen>
      </Route>
    </Router>
  </GameStateProvider>
</App>
```

### 6.2 Component Props

```typescript
// Example component interfaces

interface UnitCardProps {
  unit: Unit;
  isSelected?: boolean;
  isActive?: boolean;  // In active party
  onClick?: (unit: Unit) => void;
}

interface EquipmentSlotProps {
  unit: Unit;
  slot: "weapon" | "armor" | "helm" | "boots";
  equippedItem: Equipment | null;
  onEquip: (item: Equipment) => void;
  onUnequip: () => void;
}

interface RewardsScreenProps {
  rewards: RewardsData;
  onContinue: () => void;
}

interface BattleSceneProps {
  battle: Battle;
  onTurnComplete: (result: TurnResult) => void;
  onBattleEnd: (result: BattleResult) => void;
}
```

### 6.3 State Management in React

```typescript
// Context-based state management

// GameState context
const GameStateContext = createContext<GameState | null>(null);

// Provider
function GameStateProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(gameReducer, initialGameState);

  useEffect(() => {
    // Auto-save on state changes
    if (AUTO_SAVE_TRIGGERS.some(trigger => /* check if triggered */)) {
      autoSave(state);
    }
  }, [state]);

  return (
    <GameStateContext.Provider value={{ state, dispatch }}>
      {children}
    </GameStateContext.Provider>
  );
}

// Hook to use game state
function useGameState() {
  const context = useContext(GameStateContext);
  if (!context) throw new Error("useGameState must be used within GameStateProvider");
  return context;
}

// Usage in components
function EquipmentScreen() {
  const { state, dispatch } = useGameState();

  const handleEquip = (unitId: string, slot: Slot, item: Equipment) => {
    dispatch({ type: "EQUIP_ITEM", unitId, slot, item });
  };

  return (
    <div>
      {/* Render equipment screen */}
    </div>
  );
}
```

---

## 7. INTEGRATION CHECKLIST

### 7.1 System Integration Verification

**Before considering a system "integrated", verify:**

```typescript
const INTEGRATION_CHECKLIST = {
  unitSystem: {
    "Creates units correctly": true,
    "Calculates stats from all sources": true,
    "Levels up correctly": true,
    "Unlocks abilities": true,
    "Equips items": true,
    "Equips Djinn": true
  },

  battleSystem: {
    "Reads unit stats correctly": true,
    "Turn order uses SPD": true,
    "Damage formulas use ATK/MAG": true,
    "Abilities cost PP": true,
    "KO'd units skip turns": true,
    "Victory triggers rewards": true
  },

  rewardsSystem: {
    "XP distributes to active party": true,
    "Gold adds to player": true,
    "Items add to inventory": true,
    "Recruitment works": true,
    "Level ups trigger": true,
    "Rewards screen displays": true
  },

  equipmentSystem: {
    "Items equip to slots": true,
    "Stat bonuses apply": true,
    "Legendary abilities unlock": true,
    "Inventory updates": true,
    "Stat comparison correct": true
  },

  djinnSystem: {
    "Djinn collect correctly": true,
    "Synergy calculates correctly": true,
    "Activation works in battle": true,
    "Recovery timer works": true,
    "Passive loss when activated": true
  },

  uiLayer: {
    "All screens render": true,
    "State updates reflect in UI": true,
    "User actions dispatch correctly": true,
    "Navigation works": true,
    "Animations play": true
  }
};
```

---

## SUMMARY

**Integration Points Defined:**
- ✅ System architecture diagram
- ✅ Data flow for all major features
- ✅ State management strategy
- ✅ Event system for cross-system communication
- ✅ API contracts for all systems
- ✅ React component hierarchy

**All systems are designed to work together seamlessly!**

**Next Document:** TECHNICAL_SESSION_PLAN.md (master plan for Coder)
