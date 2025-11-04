# 🎮 ROLE 3: MOCKUP IMPLEMENTATION - Vale Chronicles

**Your Mission:** Transform 11 production-ready HTML/CSS mockups into fully functional React components with complete game logic, state management, and authentic Golden Sun gameplay mechanics.

---

## 🎯 YOUR ROLE

You are **MOCKUP IMPLEMENTER** - the developer who brings mockups to life with React + TypeScript + Zustand.

### **You ARE Responsible For:**
- ✅ Converting HTML/CSS mockups to React components
- ✅ Implementing game logic (battle system, Djinn mechanics, equipment, leveling)
- ✅ State management with Zustand (player data, inventory, party, game state)
- ✅ Event system integration (battle triggers, NPC interactions, door entries)
- ✅ Animation systems (transitions, battle swirl, sprite animations)
- ✅ Keyboard/gamepad controls
- ✅ Save/load system
- ✅ Testing (unit + integration tests)

### **You Are NOT Responsible For:**
- ❌ Creating new mockup designs (mockups are already approved)
- ❌ Changing core game mechanics (defined in GAME_MECHANICS.md)
- ❌ Altering sprite assets (2,500+ sprites already organized)
- ❌ Modifying story/dialogue content (defined in story bible)

---

## 📋 IMPLEMENTATION INVENTORY

You have **11 production-ready mockups** to implement, located in `mockups/improved/`:

### **🔴 HIGH PRIORITY (Core Gameplay Loop)**

#### 1. **Vale Village Overworld** (`vale-village-authentic.html`)
**Features:**
- 1920×1920px world map (120×120 tiles @ 16px)
- Real Vale building sprites (Isaac's House, Garet's House, Inn, Shop, Elder's House)
- Real NPC sprites (Innkeeper, Elder, 29 villagers)
- Real protagonist sprites (Isaac, Garet, Jenna, Kraden)
- Tiled grass terrain with path overlays
- River with bridge crossing
- WASD movement system

**Implementation Tasks:**
- [ ] Create `OverworldScreen` component with camera system
- [ ] Implement tile-based collision detection
- [ ] Add NPC interaction zones (proximity triggers)
- [ ] Wire WASD/arrow key movement with directional sprites
- [ ] Implement dialogue system integration
- [ ] Add building entry triggers (SPACE key near doors)
- [ ] Create world state manager (NPC positions, building accessibility)
- [ ] Add encounter zones for random battles
- [ ] Implement save point system (beds, sanctums)

**Data Models:**
```typescript
interface OverworldState {
  playerPosition: { x: number; y: number };
  cameraPosition: { x: number; y: number };
  currentMap: 'vale_village' | 'forest_path' | 'desert' | string;
  npcs: NPC[];
  buildings: Building[];
  activeDialogue: Dialogue | null;
  encounterZones: EncounterZone[];
}

interface NPC {
  id: string;
  name: string;
  position: { x: number; y: number };
  sprite: string;
  dialogueId: string;
  questTriggers?: string[];
  shopType?: 'item' | 'equipment' | 'inn';
}

interface Building {
  id: string;
  name: string;
  position: { x: number; y: number };
  doorPosition: { x: number; y: number };
  interiorScene: string;
  accessible: boolean;
}
```

---

#### 2. **Battle Screen Authentic** (`battle-screen-authentic.html`)
**Features:**
- Cave background with real GBA sprite (Cave.gif)
- Enemy sprites with floating animation (Goblin.gif)
- Party sprites with battle stances (Isaac_Long Sword_Front.gif, etc.)
- Turn order display with circular portraits
- 5-button command menu (Fight/Psynergy/Djinn/Items/Flee)
- Combat log with text reveal animation
- HP/PP gradient bars for 4 party members
- Keyboard navigation demo

**Implementation Tasks:**
- [ ] Create `BattleScreen` component with turn-based state machine
- [ ] Implement turn order calculation (AGI-based with variance)
- [ ] Add command selection system (Fight → Target, Psynergy → Ability → Target)
- [ ] Wire Djinn unleash mechanics (Set → Standby → Recovery cycle)
- [ ] Implement damage calculation (ATK vs DEF, elemental modifiers)
- [ ] Add HP/PP bar animations with smooth transitions
- [ ] Create combat log system with message queue
- [ ] Implement enemy AI (random attacks, healing when low HP)
- [ ] Add battle victory/defeat conditions
- [ ] Wire flee mechanic (AGI-based success rate)

**Data Models:**
```typescript
interface BattleState {
  phase: 'intro' | 'player_turn' | 'enemy_turn' | 'animation' | 'victory' | 'defeat';
  turnOrder: Combatant[];
  currentTurn: number;
  enemies: Enemy[];
  party: Unit[];
  selectedCommand: 'fight' | 'psynergy' | 'djinn' | 'items' | 'flee' | null;
  selectedTarget: Combatant | null;
  combatLog: CombatMessage[];
  background: string;
}

interface Combatant {
  id: string;
  name: string;
  hp: { current: number; max: number };
  pp: { current: number; max: number };
  stats: { atk: number; def: number; agi: number };
  status: StatusEffect[];
  djinnState?: DjinnState[];
}

interface CombatMessage {
  id: string;
  text: string;
  type: 'attack' | 'damage' | 'heal' | 'status' | 'system';
  timestamp: number;
}
```

---

#### 3. **Battle Transition Complete** (`battle-transition-complete.html`)
**Features:**
- 5-stage cinematic transition (2.7s total)
- Stage 1 (0-300ms): Tremor + darken
- Stage 2 (300-800ms): Encounter flash + text ("A wild GOBLIN appeared!")
- Stage 3 (800-1800ms): 4-circle swirl animation
- Stage 4 (1800-2000ms): Fade to black
- Stage 5 (2000-2700ms): Battle screen appears with staggered entrance
- Real overworld sprite (Isaac.gif)
- Turn indicator with stage progress

**Implementation Tasks:**
- [ ] Create `BattleTransition` component with CSS animation sequencing
- [ ] Implement 5-stage state machine with precise timing
- [ ] Add encounter text system (enemy name from battle data)
- [ ] Wire transition trigger from overworld (encounter zones)
- [ ] Add audio integration (encounter sound, swirl whoosh)
- [ ] Implement skip transition option (hold SPACE)
- [ ] Create staggered entrance animation for battle units

**Data Models:**
```typescript
interface TransitionState {
  active: boolean;
  stage: 1 | 2 | 3 | 4 | 5 | null;
  enemyName: string;
  fromScene: 'overworld' | 'dungeon';
  skipRequested: boolean;
}
```

---

#### 4. **Djinn Info Screen** (`djinn-info-screen.html`)
**Features:**
- Collection grid: 12 Djinn organized by element (Venus, Mars, Mercury, Jupiter)
- Real Djinn sprites (Venus_Djinn_Front.gif, etc.)
- Status indicators (Set/Standby/Recovery/Locked)
- Team slot badges (numbered 1-3 showing active Djinn)
- Interactive JavaScript (click to select, updates details panel)
- Detailed info panel with:
  - Large sprite + element badge
  - Description text
  - Unleash effect (battle ability)
  - Passive bonuses (HP, ATK, DEF, etc.)
- 3 active team slots display
- Collection progress (9/12 collected)

**Implementation Tasks:**
- [ ] Create `DjinnScreen` component with grid layout
- [ ] Implement Djinn selection system (click to view details)
- [ ] Add Set/Standby toggle mechanics
- [ ] Wire team slot assignment (max 3 global slots)
- [ ] Implement passive bonus calculations (apply to entire party)
- [ ] Add summon sequence integration (standby Djinn → summon attack)
- [ ] Create recovery system (1 turn recovery after unleash)
- [ ] Implement stat recalculation when Djinn state changes
- [ ] Add unlock system (discover Djinn in battles/chests)

**Data Models:**
```typescript
interface DjinnState {
  collection: Djinn[];
  teamSlots: (Djinn | null)[]; // Max 3 slots
  lockedDjinn: string[]; // IDs of undiscovered Djinn
}

interface Djinn {
  id: string;
  name: string;
  element: 'venus' | 'mars' | 'mercury' | 'jupiter';
  status: 'set' | 'standby' | 'recovery' | 'locked';
  sprite: string;
  description: string;
  unleashEffect: {
    name: string;
    description: string;
    damage?: number;
    healing?: number;
    buffTarget?: 'party' | 'single';
    buffType?: 'defense' | 'attack' | 'agility';
    buffAmount?: number;
    duration?: number;
  };
  passiveBonuses: {
    hp?: number;
    pp?: number;
    atk?: number;
    def?: number;
    agi?: number;
    elementPower?: number;
  };
  teamSlotIndex: number | null; // null if not in team
}
```

---

### **🟡 MEDIUM PRIORITY (Character Management)**

#### 5. **Character Info Screen** (`character-info-screen.html`)
**Features:**
- Large character display (Isaac with real battle sprite)
- Venus element badge (top-right, gradient)
- Level & XP system (Level 8, animated XP bar 203/300)
- Full stats panel (HP, PP, ATK, DEF, AGI, LUCK)
- Equipment grid (4 slots with real sprites):
  - Broad_Sword.gif, Chain_Mail.gif, Bronze_Helm.gif, Wooden_Shield.gif
- Psynergy abilities list (8 abilities with icons + PP costs):
  - Move (2 PP), Quake (4 PP), Cure (7 PP), Ragnarok (9 PP)
  - Growth (4 PP), Quake Sphere (15 PP), Potent Cure (12 PP), Mad Growth (10 PP)
- Footer buttons (Previous/Next/Close)

**Implementation Tasks:**
- [ ] Create `CharacterInfoScreen` component
- [ ] Implement character switcher (Previous/Next buttons)
- [ ] Add XP bar animation (smooth fill on level up)
- [ ] Wire equipment display from inventory
- [ ] Create psynergy list with PP cost display
- [ ] Implement stat calculation (base + equipment + Djinn bonuses)
- [ ] Add ability unlock tracking (level-based)
- [ ] Create responsive layout for different unit types

**Data Models:**
```typescript
interface CharacterInfo {
  id: string;
  name: string;
  class: string;
  element: 'venus' | 'mars' | 'mercury' | 'jupiter';
  level: number;
  xp: { current: number; needed: number };
  stats: {
    hp: { current: number; max: number };
    pp: { current: number; max: number };
    atk: number;
    def: number;
    agi: number;
    luck: number;
  };
  equipment: {
    weapon: Equipment | null;
    armor: Equipment | null;
    helmet: Equipment | null;
    shield: Equipment | null;
  };
  abilities: Ability[];
}
```

---

#### 6. **Equipment Screen Polished** (`equipment-screen-polished.html`)
**Features:**
- Unit selector (4 active party members)
- 4 equipment slots (Weapon/Armor/Helm/Shield)
- Stat comparison (before/after equip with +/- indicators)
- Equipment inventory grid with real sprites
- Rarity indicators (Common/Rare/Epic)
- Interactive slot system (click to equip/unequip)
- Real-time stat preview

**Implementation Tasks:**
- [ ] Create `EquipmentScreen` component with unit switcher
- [ ] Implement slot-based equip system (weapon → weapon slot only)
- [ ] Add stat comparison panel (calculate before/after)
- [ ] Create inventory filtering (show only equippable items for unit)
- [ ] Wire equip/unequip mechanics with state updates
- [ ] Add cursed equipment system (can't unequip)
- [ ] Implement artifact equipment (unique abilities)
- [ ] Create optimal equipment suggestions (best stat boost)

**Data Models:**
```typescript
interface Equipment {
  id: string;
  name: string;
  type: 'weapon' | 'armor' | 'helmet' | 'shield' | 'boots' | 'gloves';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  sprite: string;
  stats: {
    atk?: number;
    def?: number;
    agi?: number;
    hp?: number;
    pp?: number;
  };
  cursed?: boolean;
  abilities?: string[]; // Unleash abilities or passive skills
  requirements?: {
    level?: number;
    class?: string[];
    element?: string[];
  };
}
```

---

#### 7. **Unit Collection Roster** (`unit-collection-roster.html`)
**Features:**
- All collected units (up to 10)
- Active party selector (pick 4)
- Unit portraits with level indicators
- Stat preview on hover
- "View Equipment" button → Equipment screen
- Active/Bench badges
- Element badges for each unit

**Implementation Tasks:**
- [ ] Create `UnitCollectionScreen` component
- [ ] Implement active party selection (max 4, drag-and-drop)
- [ ] Add bench management (swap active/bench units)
- [ ] Wire "View Equipment" navigation
- [ ] Create unit stat preview tooltips
- [ ] Implement party order management (battle formation)
- [ ] Add unit recruitment tracking

**Data Models:**
```typescript
interface PartyState {
  activeParty: string[]; // Max 4 unit IDs
  benchUnits: string[]; // Remaining units
  allUnits: Unit[];
}
```

---

### **🟢 LOW PRIORITY (Polish & Extras)**

#### 8. **Weapon Shop Authentic** (`weapon-shop-authentic.html`)
**Features:**
- 2-column item grid (weapons + armor)
- Real weapon sprites (Broad_Sword, Claymore, Battle_Axe, Burning_Axe)
- Real armor sprites (Chain_Mail, Leather_Armor)
- Gold coin sprite display
- Price display with affordability indicator
- Buy/Sell tabs
- Details panel with stat comparison
- Gold counter

**Implementation Tasks:**
- [ ] Create `ShopScreen` component with Buy/Sell tabs
- [ ] Implement shop inventory system (varies by town)
- [ ] Add affordability checks (grayed out if insufficient gold)
- [ ] Wire buy transaction (deduct gold, add item to inventory)
- [ ] Wire sell transaction (add gold, remove item from inventory)
- [ ] Create stat comparison for equipment purchases
- [ ] Add "Equip immediately?" prompt after purchase
- [ ] Implement shop type system (item/equipment/inn)

**Data Models:**
```typescript
interface Shop {
  id: string;
  name: string;
  type: 'item' | 'equipment' | 'inn';
  inventory: ShopItem[];
  buyRate: number; // 1.0 = normal price
  sellRate: number; // 0.5 = half price
}

interface ShopItem {
  itemId: string;
  price: number;
  stock: number | 'infinite';
}
```

---

#### 9. **Rewards Screen Celebration** (`rewards-screen-celebration.html`)
**Features:**
- XP gained display with sparkle particles
- Gold gained with coin sprite
- Items dropped (equipment/consumables)
- Level up notification with celebration
- New ability learned reveal
- Stat increase display (+12 HP, +3 ATK)
- Continue button

**Implementation Tasks:**
- [ ] Create `RewardsScreen` component
- [ ] Implement XP distribution (split among party)
- [ ] Add level up detection and celebration animation
- [ ] Wire new ability unlock system
- [ ] Create item drop system (random from enemy loot table)
- [ ] Add stat increase display
- [ ] Implement continue button → return to overworld

**Data Models:**
```typescript
interface BattleRewards {
  xp: number;
  gold: number;
  items: string[]; // Item IDs
  djinn?: string; // Djinn ID if recruited
}
```

---

#### 10. **Battle Screen Refined** (`battle-screen-refined.html`)
**Features:**
- HP dot system (5 dots, color-coded by threshold)
- Cleaner UI with minimal clutter
- Turn indicator with bouncing arrow
- One-line combat log
- Tutorial overlay (first battle only)
- Real enemy/party sprites (Dire_Wolf, Isaac, Garet, Ivan, Mia)

**Implementation Tasks:**
- [ ] Create alternative `BattleScreenRefined` component
- [ ] Implement HP dots visualization (calculate dot fill based on HP%)
- [ ] Add tutorial overlay system (show once, save to localStorage)
- [ ] Create simplified combat log (one message at a time)
- [ ] Add dot pulsing animation for critical HP

**Note:** This is an alternative UI design to `battle-screen-authentic.html`. Choose one for final implementation.

---

#### 11. **Building Entry System** (`building-entry-system.html`)
**Features:**
- 3 Vale buildings with real sprites (Isaac's House, Garet's House, Inn)
- Glowing door markers (pulsing golden circles with 🚪)
- Interaction prompt ("Press SPACE to enter")
- Smooth 800ms transitions (400ms fade out + 400ms fade in)
- Interior scene with:
  - Room title display
  - Tiled floor (32×32 grid pattern)
  - 5 furniture sprites (bed, table, jars ×2, desk)
  - Interior player sprite
  - Exit door marker
- Position memory (returns to same door on exit)
- Keyboard controls (1/2/3 to teleport to doors, SPACE to enter/exit)

**Implementation Tasks:**
- [ ] Create `BuildingInterior` component
- [ ] Implement door proximity detection (trigger marker visibility)
- [ ] Add scene transition system (fade overlay)
- [ ] Wire building entry/exit mechanics
- [ ] Create interior layout system (configurable furniture placement)
- [ ] Implement NPC placement in interiors
- [ ] Add interactive objects (chests, bookshelves, jars)
- [ ] Create multi-room navigation (stairs, doors connecting rooms)
- [ ] Wire shop/inn functionality in building interiors

**Data Models:**
```typescript
interface BuildingInterior {
  id: string;
  name: string;
  layout: {
    width: number;
    height: number;
    floor: 'wood' | 'stone' | 'carpet';
  };
  furniture: FurnitureItem[];
  npcs: InteriorNPC[];
  exits: DoorExit[];
  rooms?: Room[]; // Multi-room buildings
}

interface FurnitureItem {
  id: string;
  sprite: string;
  position: { x: number; y: number };
  interactive: boolean;
  action?: 'chest' | 'bookshelf' | 'bed' | 'jar';
  contents?: string[]; // Item IDs for chests/jars
}

interface DoorExit {
  position: { x: number; y: number };
  destination: 'overworld' | string; // Room ID for multi-room
  playerSpawnPosition: { x: number; y: number };
}
```

---

## 🏗️ COMPONENT ARCHITECTURE

### **Screen Hierarchy:**

```
src/
├── screens/
│   ├── OverworldScreen.tsx (Vale Village + world navigation)
│   ├── BattleScreen.tsx (Turn-based combat)
│   ├── BattleTransition.tsx (5-stage swirl animation)
│   ├── DjinnScreen.tsx (Djinn collection + management)
│   ├── CharacterInfoScreen.tsx (Unit stats + abilities)
│   ├── EquipmentScreen.tsx (Gear management)
│   ├── UnitCollectionScreen.tsx (Party + bench roster)
│   ├── ShopScreen.tsx (Buy/sell items)
│   ├── RewardsScreen.tsx (Post-battle celebration)
│   ├── BuildingInterior.tsx (Building interiors)
│   ├── DialogueScreen.tsx (NPC conversations)
│   ├── QuestLogScreen.tsx (Quest tracking)
│   └── MainMenuScreen.tsx (ESC menu hub)
├── components/
│   ├── UI/
│   │   ├── Panel.tsx (Reusable Golden Sun panel)
│   │   ├── Button.tsx (Command button)
│   │   ├── HPBar.tsx (HP/PP gradient bar)
│   │   ├── HPDots.tsx (Alternative HP visualization)
│   │   ├── StatDisplay.tsx (ATK/DEF/AGI display)
│   │   ├── EquipmentSlot.tsx (Drag-and-drop slot)
│   │   └── TurnOrderPill.tsx (Turn indicator)
│   ├── Battle/
│   │   ├── EnemySprite.tsx (Enemy with floating animation)
│   │   ├── PartySprite.tsx (Party member with platform shadow)
│   │   ├── CommandMenu.tsx (Fight/Psynergy/Djinn/Items/Flee)
│   │   ├── CombatLog.tsx (Message queue with text reveal)
│   │   └── TargetSelector.tsx (Highlight target for actions)
│   ├── Overworld/
│   │   ├── Player.tsx (WASD movement + directional sprites)
│   │   ├── NPC.tsx (Collision + dialogue triggers)
│   │   ├── Building.tsx (Entry marker + collision)
│   │   ├── Terrain.tsx (Tiled grass, paths, water)
│   │   └── Camera.tsx (Viewport tracking player)
│   ├── Djinn/
│   │   ├── DjinnCard.tsx (Element-colored card with sprite)
│   │   ├── DjinnDetails.tsx (Unleash effect + passive bonuses)
│   │   └── TeamSlot.tsx (Active Djinn assignment)
│   └── Common/
│       ├── SpriteRenderer.tsx (Pixelated sprite display)
│       ├── TransitionOverlay.tsx (Fade to black)
│       └── KeyboardNav.tsx (Arrow key navigation)
├── store/
│   ├── playerStore.ts (Player data, inventory, gold, XP)
│   ├── partyStore.ts (Active party, bench units, formation)
│   ├── battleStore.ts (Battle state, turn order, actions)
│   ├── djinnStore.ts (Djinn collection, team slots, status)
│   ├── worldStore.ts (Current map, NPC states, building accessibility)
│   └── gameStore.ts (Save/load, settings, progression flags)
├── hooks/
│   ├── useKeyboard.ts (Keyboard input manager)
│   ├── useGamepad.ts (Gamepad support)
│   ├── useBattleLogic.ts (Damage calculation, turn order)
│   ├── useDjinnMechanics.ts (Set/Standby/Recovery logic)
│   └── useCollision.ts (Tile-based collision detection)
└── utils/
    ├── spriteRegistry.ts (Sprite path resolver)
    ├── damageFormula.ts (ATK vs DEF calculation)
    ├── levelCurve.ts (XP requirements per level)
    └── saveSystem.ts (LocalStorage save/load)
```

---

## 🎮 STATE MANAGEMENT (ZUSTAND)

### **Player Store:**
```typescript
interface PlayerState {
  // Player Data
  gold: number;
  playtime: number;

  // Inventory
  inventory: {
    items: InventoryItem[];
    equipment: Equipment[];
    keyItems: KeyItem[];
  };

  // Progression
  flags: Record<string, boolean>; // Story/quest flags
  unlockedLocations: string[];

  // Actions
  addGold: (amount: number) => void;
  addItem: (item: InventoryItem) => void;
  removeItem: (itemId: string) => void;
  setFlag: (flag: string, value: boolean) => void;
}
```

### **Party Store:**
```typescript
interface PartyState {
  // Party Management
  activePartyIds: string[]; // Max 4
  benchUnitIds: string[];
  allUnits: Record<string, Unit>;

  // Actions
  addUnit: (unit: Unit) => void;
  swapUnits: (activeId: string, benchId: string) => void;
  setActiveParty: (unitIds: string[]) => void;
  levelUp: (unitId: string) => void;
  gainXP: (unitId: string, xp: number) => void;
}
```

### **Battle Store:**
```typescript
interface BattleState {
  // Battle State
  active: boolean;
  phase: BattlePhase;
  turn: number;
  enemies: Enemy[];

  // Turn Management
  turnOrder: Combatant[];
  currentCombatant: Combatant | null;

  // Command Selection
  selectedCommand: Command | null;
  selectedAbility: Ability | null;
  selectedTarget: Combatant | null;

  // Combat Log
  messages: CombatMessage[];

  // Actions
  startBattle: (enemies: Enemy[], background: string) => void;
  selectCommand: (command: Command) => void;
  selectTarget: (target: Combatant) => void;
  executeAction: () => void;
  endTurn: () => void;
  flee: () => boolean;
}
```

### **Djinn Store:**
```typescript
interface DjinnState {
  // Collection
  collection: Djinn[];
  teamSlots: (Djinn | null)[]; // Max 3

  // Actions
  addDjinn: (djinn: Djinn) => void;
  setDjinn: (djinnId: string) => void;
  unleashDjinn: (djinnId: string) => void;
  recoverDjinn: (djinnId: string) => void;
  assignToTeamSlot: (djinnId: string, slotIndex: number) => void;
}
```

### **World Store:**
```typescript
interface WorldState {
  // Current State
  currentMap: string;
  playerPosition: { x: number; y: number };
  facing: 'up' | 'down' | 'left' | 'right';

  // NPC States
  npcs: Record<string, NPCState>;

  // Building Accessibility
  buildings: Record<string, BuildingState>;

  // Encounter System
  encounterSteps: number;
  encounterRate: number;

  // Actions
  move: (direction: 'up' | 'down' | 'left' | 'right') => void;
  interact: () => void;
  enterBuilding: (buildingId: string) => void;
  exitBuilding: () => void;
  triggerEncounter: () => void;
}
```

---

## 🎯 IMPLEMENTATION PHASES

### **Phase 1: Core Loop (10-12 hours)**
1. **Overworld Movement** (3h)
   - Implement `OverworldScreen` with Vale Village map
   - Add WASD/arrow key controls
   - Create collision detection
   - Wire camera tracking

2. **Battle System** (5h)
   - Implement `BattleScreen` with turn-based logic
   - Add command menu navigation
   - Create damage calculation
   - Wire victory/defeat conditions

3. **Battle Transition** (2h)
   - Implement `BattleTransition` 5-stage animation
   - Wire encounter triggers from overworld
   - Add encounter text display

4. **Rewards & Loop** (2h)
   - Implement `RewardsScreen` with XP distribution
   - Wire level up system
   - Connect rewards → overworld return

---

### **Phase 2: Character Systems (8-10 hours)**
1. **Djinn Management** (4h)
   - Implement `DjinnScreen` with grid layout
   - Add Set/Standby toggle mechanics
   - Wire team slot assignment
   - Create passive bonus calculations

2. **Equipment System** (3h)
   - Implement `EquipmentScreen` with slot system
   - Add stat comparison panel
   - Wire equip/unequip mechanics
   - Create inventory filtering

3. **Character Info** (2h)
   - Implement `CharacterInfoScreen`
   - Add character switcher
   - Wire ability list display
   - Create stat aggregation (base + equipment + Djinn)

4. **Unit Collection** (1h)
   - Implement `UnitCollectionScreen`
   - Add active/bench management
   - Wire party selection

---

### **Phase 3: World Exploration (6-8 hours)**
1. **Building Interiors** (3h)
   - Implement `BuildingInterior` component
   - Add door proximity detection
   - Wire scene transitions
   - Create interior layouts for Vale buildings

2. **NPC Interactions** (2h)
   - Implement dialogue system
   - Add quest trigger integration
   - Wire shop NPCs

3. **Shop System** (2h)
   - Implement `ShopScreen` with buy/sell tabs
   - Add transaction logic
   - Wire stat comparison for equipment

4. **Quest Log** (1h)
   - Implement quest tracking UI
   - Wire quest completion detection

---

### **Phase 4: Polish & Testing (4-6 hours)**
1. **Save/Load System** (2h)
   - Implement localStorage persistence
   - Add save point triggers
   - Create load game flow

2. **Audio Integration** (1h)
   - Wire battle music
   - Add sound effects (menu beeps, attack sounds)

3. **Animations** (1h)
   - Add sprite animations (walking, attacking)
   - Improve transition smoothness

4. **Testing** (2h)
   - Unit tests for battle calculations
   - Integration tests for state transitions
   - Playtesting full game loop

---

## 🛠️ TECHNICAL IMPLEMENTATION GUIDE

### **Converting Mockup CSS to Styled Components:**

**From Mockup:**
```css
.battle-container {
  width: 960px;
  height: 640px;
  background: linear-gradient(180deg, #3A2A1A 0%, #2A1A0A 50%, #1A0A00 100%);
}
```

**To React:**
```typescript
import styled from '@emotion/styled';

const BattleContainer = styled.div`
  width: ${960 / 4}rem; /* Use rem for scaling */
  height: ${640 / 4}rem;
  background: linear-gradient(180deg, #3A2A1A 0%, #2A1A0A 50%, #1A0A00 100%);
  position: relative;
  overflow: hidden;
`;
```

---

### **Implementing HP Dot System:**

```typescript
const HPDots: React.FC<{ current: number; max: number }> = ({ current, max }) => {
  const percentage = (current / max) * 100;
  const dots = 5;
  const dotsToFill = Math.ceil((percentage / 100) * dots);

  return (
    <div className="hp-dots">
      {Array.from({ length: dots }).map((_, i) => (
        <div
          key={i}
          className={`hp-dot ${
            i < dotsToFill
              ? percentage <= 20
                ? 'critical'
                : 'full'
              : 'empty'
          }`}
        />
      ))}
    </div>
  );
};
```

---

### **Implementing Turn Order Calculation:**

```typescript
function calculateTurnOrder(combatants: Combatant[]): Combatant[] {
  return [...combatants].sort((a, b) => {
    // AGI-based with random variance (±10%)
    const aAgi = a.stats.agi * (0.9 + Math.random() * 0.2);
    const bAgi = b.stats.agi * (0.9 + Math.random() * 0.2);
    return bAgi - aAgi; // Higher AGI goes first
  });
}
```

---

### **Implementing Djinn Set/Standby Mechanics:**

```typescript
const useDjinnStore = create<DjinnState>((set, get) => ({
  collection: [],
  teamSlots: [null, null, null],

  setDjinn: (djinnId: string) => {
    set((state) => ({
      collection: state.collection.map((d) =>
        d.id === djinnId ? { ...d, status: 'set' } : d
      ),
    }));

    // Recalculate party stats
    recalculatePartyStats();
  },

  unleashDjinn: (djinnId: string) => {
    const djinn = get().collection.find((d) => d.id === djinnId);
    if (!djinn || djinn.status !== 'set') return;

    // Change to standby
    set((state) => ({
      collection: state.collection.map((d) =>
        d.id === djinnId ? { ...d, status: 'standby' } : d
      ),
    }));

    // Apply unleash effect in battle
    applyUnleashEffect(djinn);

    // Remove passive bonuses
    recalculatePartyStats();
  },

  recoverDjinn: (djinnId: string) => {
    set((state) => ({
      collection: state.collection.map((d) =>
        d.id === djinnId ? { ...d, status: 'set' } : d
      ),
    }));

    // Restore passive bonuses
    recalculatePartyStats();
  },
}));
```

---

### **Implementing Building Entry System:**

```typescript
const BuildingEntry: React.FC = () => {
  const [nearDoor, setNearDoor] = useState<Building | null>(null);
  const { playerPosition, enterBuilding } = useWorldStore();

  useEffect(() => {
    // Check proximity to all buildings
    const nearby = buildings.find((building) => {
      const distance = Math.hypot(
        playerPosition.x - building.doorPosition.x,
        playerPosition.y - building.doorPosition.y
      );
      return distance < 32; // 2 tiles
    });

    setNearDoor(nearby || null);
  }, [playerPosition]);

  useKeyboard('Space', () => {
    if (nearDoor) {
      enterBuilding(nearDoor.id);
    }
  });

  return (
    <>
      {nearDoor && (
        <DoorMarker position={nearDoor.doorPosition} />
      )}
      {nearDoor && (
        <InteractionPrompt text="Press SPACE to enter" />
      )}
    </>
  );
};
```

---

## ✅ COMPLETION CRITERIA

### **MVP Complete When:**
- [ ] Vale Village fully explorable with collision
- [ ] 3+ building interiors accessible (Isaac's House, Inn, Shop)
- [ ] Battle system functional (attack/defend/flee)
- [ ] Djinn system working (Set/Standby/Unleash)
- [ ] Equipment system functional (equip/unequip with stat changes)
- [ ] XP/leveling system working (level ups + ability unlocks)
- [ ] Save/load system functional
- [ ] 3+ enemy types implemented
- [ ] 1+ boss battle implemented

### **Full Game Complete When:**
- [ ] All 11 mockups implemented as React components
- [ ] All 10 units recruitable and functional
- [ ] All 12 Djinn discoverable
- [ ] All Vale Village NPCs have dialogue
- [ ] Shop system fully functional (buy/sell/inn)
- [ ] Quest system tracking 10+ quests
- [ ] Battle backgrounds vary by location
- [ ] Audio integration complete (music + SFX)
- [ ] Playtested 2+ hour gameplay loop

---

## 📊 EXPECTED TIMELINE

**Total Implementation:** 30-38 hours

- **Phase 1 (Core Loop):** 10-12 hours
- **Phase 2 (Character Systems):** 8-10 hours
- **Phase 3 (World Exploration):** 6-8 hours
- **Phase 4 (Polish & Testing):** 4-6 hours
- **Phase 5 (Bug Fixes & Balance):** 2-4 hours

---

## 🎨 DESIGN TOKENS REFERENCE

All mockups use shared design tokens from `mockups/tokens.css`:

```css
/* Import in React */
import '../mockups/tokens.css';

/* Or use as styled-components theme */
const theme = {
  colors: {
    venus: '#E8A050',
    mars: '#E05050',
    mercury: '#5090D8',
    jupiter: '#A858D8',
    textPrimary: '#F8F8F0',
    textGold: '#FFD87F',
    bgDark: '#0F2550',
    bgPanel: '#1A3560',
    borderLight: '#4A7AB8',
    borderDark: '#0F2550',
  },
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '12px',
    lg: '16px',
    xl: '24px',
  },
  zIndex: {
    background: 0,
    scenery: 5,
    entities: 10,
    ui: 50,
    dialogue: 60,
    modal: 100,
  },
  timing: {
    fast: '150ms',
    normal: '300ms',
    slow: '500ms',
  },
};
```

---

## 📚 REFERENCE DOCUMENTATION

**Essential Reading Before Implementation:**
- `docs/GAME_MECHANICS.md` - Core formulas, XP curves, Djinn mechanics
- `docs/BATTLE_SYSTEM_REFINEMENT.md` - 5-stage transition, HP dots, UI noise reduction
- `docs/MENU_NAVIGATION_FLOW.md` - Screen routing, navigation patterns
- `docs/MOCKUP_ASSESSMENT_COMPLETE.md` - All 11 mockups detailed specifications
- `ROLE_2_GRAPHICS_MOCKUP_ONBOARDING.md` - Design patterns, sprite organization

**Sprite References:**
- `/public/sprites/` - 2,500+ authentic Golden Sun sprites
- Sprite registry: `src/utils/spriteRegistry.ts`

**State Management:**
- Battle flow: `docs/INTEGRATION_SPECS.md`
- Save system: `docs/SAVE_SYSTEM_DESIGN.md`

---

## 🚀 GETTING STARTED

### **Step 1: Review All Mockups**
Open and interact with all 11 mockups in `mockups/improved/`:
```bash
cd mockups/improved
# Open each .html file in browser
```

### **Step 2: Set Up Project Structure**
```bash
# Create component directories
mkdir -p src/screens src/components/{UI,Battle,Overworld,Djinn,Common}
mkdir -p src/store src/hooks src/utils

# Copy design tokens
cp mockups/tokens.css src/styles/tokens.css
```

### **Step 3: Implement Core Loop First**
Start with the essential gameplay loop:
1. Overworld movement in Vale Village
2. Battle trigger + transition
3. Battle system (basic attack/defend)
4. Rewards screen
5. Return to overworld

### **Step 4: Add Character Systems**
Expand with Djinn, equipment, and leveling:
1. Djinn management screen
2. Equipment screen
3. Character info screen
4. Unit collection screen

### **Step 5: Expand World**
Add exploration features:
1. Building interiors (3+ buildings)
2. NPC dialogue system
3. Shop system
4. Quest tracking

### **Step 6: Polish & Test**
Final touches:
1. Save/load system
2. Audio integration
3. Animation polish
4. Playtesting + balance

---

## 🎯 SUCCESS METRICS

**Code Quality:**
- TypeScript strict mode enabled
- 80%+ test coverage for battle logic
- Zero ESLint errors
- Accessible (WCAG 2.1 AA)

**Performance:**
- 60 FPS on target hardware
- <100ms input latency
- <2s scene transitions
- <500KB initial bundle size

**Gameplay:**
- 2+ hour gameplay loop complete
- Battle win rate balanced (not too easy/hard)
- Progression feels rewarding (level ups, Djinn unlocks)
- No game-breaking bugs

---

**Your implementation will bring 11 pixel-perfect mockups to life as a fully playable Golden Sun tribute!** 🎮✨

**Next Role:** QA Testing (plays full game) → reports bugs → balance adjustments
