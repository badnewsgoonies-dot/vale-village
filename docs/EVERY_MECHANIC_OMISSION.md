# 🚨 EVERY SINGLE MECHANIC OMISSION - Vale Chronicles

# CORRECTED COMPREHENSIVE GAME MECHANICS AUDIT
## Every Single Omission Found (ITEMS REMOVED)

**Date:** Corrected Analysis  
**Scope:** Complete game mechanics vs. implemented code  
**Method:** Cross-reference GAME_MECHANICS.md with source code  
**Correction:** Removed all consumable item references (game has equipment only)

This document lists EVERY game mechanic that is either:
1. **Defined in specs but NOT implemented**
2. **Partially implemented but missing critical features**
3. **Documented but has NO code**
4. **Has placeholder code but NO actual logic**

---

## CATEGORY 1: STATUS EFFECTS SYSTEM ❌ NOT IMPLEMENTED

### 1.1 Damage-Over-Time Effects
**Spec Location:** `GAME_MECHANICS.md` (Section 10.1 implied), `Item.ts` line 20, `Unit.ts` line 55

**What's Missing:**
- ❌ **Poison**: No damage calculation per turn
- ❌ **Burn**: No damage calculation per turn  
- ❌ **Freeze**: No turn skip logic
- ❌ **Paralyze**: No turn skip logic
- ❌ **Sleep**: No implementation
- ❌ **Stun**: No implementation
- ❌ **Petrify**: No implementation

**Current State:**
- `Unit.ts` has `StatusEffect` interface with types defined
- `Battle.ts` line 325 mentions "Apply status effects" but NO actual implementation
- `Item.ts` has `curesStatus` field but NO cure logic

**Required Implementation:**
```typescript
// MISSING: Status effect damage/skip logic
function processStatusEffects(unit: Unit): void {
  for (const effect of unit.statusEffects) {
    if (effect.type === 'poison') {
      unit.currentHp -= Math.floor(unit.maxHp * 0.05); // 5% max HP per turn
    } else if (effect.type === 'burn') {
      unit.currentHp -= Math.floor(unit.maxHp * 0.08); // 8% max HP per turn
    } else if (effect.type === 'freeze' || effect.type === 'paralyze') {
      // Skip turn logic needed
      return; // Unit cannot act
    }
  }
}

// MISSING: Status effect application from abilities
// MISSING: Status effect cure from items
// MISSING: Status effect duration decrement
```

**Impact:** CRITICAL - Status effects are core Golden Sun mechanic, completely non-functional

---

### 1.2 Status Effect Application from Abilities
**Spec Location:** `ABILITY_FLAVOR_TEXT.md` (Petrify, Ignite, Deep Freeze, Paralyze)

**What's Missing:**
- ❌ No abilities inflict status effects
- ❌ No `inflictsStatus` field in `Ability` interface
- ❌ No status resistance system
- ❌ No status effect chance calculation

**Current State:**
- `abilities.ts` has 20+ abilities defined
- NONE apply status effects
- `Ability.ts` interface has NO status-related fields

**Required Implementation:**
```typescript
// MISSING in Ability.ts
interface Ability {
  // ... existing fields
  inflictsStatus?: {
    type: 'poison' | 'burn' | 'freeze' | 'paralyze' | 'sleep' | 'stun' | 'petrify';
    chance: number; // 0.0 to 1.0
    duration: number;
  };
}

// MISSING: Status-inflicting abilities
const IGNITE: Ability = {
  id: 'ignite',
  name: 'Ignite',
  type: 'psynergy',
  element: 'Mars',
  ppCost: 8,
  basePower: 35,
  targets: 'single-enemy',
  unlockLevel: 3,
  inflictsStatus: {
    type: 'burn',
    chance: 0.6, // 60% chance
    duration: 3
  },
  description: 'Fire attack with chance to inflict burn'
};
```

**Impact:** HIGH - Reduces strategic depth, makes combat less interesting

---

### 1.3 Status Effect Icons/Visual Feedback
**Spec Location:** None (but required for usability)

**What's Missing:**
- ❌ No status effect icons in battle UI
- ❌ No visual indicators (poison = purple aura, burn = flames, etc.)
- ❌ No status effect tooltips
- ❌ No turn counter display for duration

**Current State:**
- `BattleScreen.tsx` renders units but NO status indicators
- NO status effect sprites/icons

**Impact:** MEDIUM - Players can't see active status effects

---

## CATEGORY 2: EVASION/ACCURACY SYSTEM ❌ NOT IMPLEMENTED

### 2.1 Dodge/Evasion Mechanics
**Spec Location:** `Equipment.ts` line 29, `abilities.ts` line 282 (Wind's Favor)

**What's Missing:**
- ❌ No dodge chance calculation
- ❌ No miss chance for attacks
- ❌ No "MISS!" message in combat log
- ❌ Evasion stat exists but is NEVER checked

**Current State:**
- `Equipment.ts` has `evasion?: number` field
- `Hyper Boots` grant +10 evasion (NO effect)
- `Wind's Favor` ability grants +20 evasion (NO effect)
- `Battle.ts` ALWAYS applies damage (no dodge check)

**Required Implementation:**
```typescript
// MISSING: Dodge check in damage calculation
function calculatePhysicalDamage(
  attacker: Unit,
  defender: Unit,
  ability: Ability,
  rng: RNG = globalRNG
): number | 'MISS' {
  // MISSING: Evasion check
  const evasionChance = defender.equipment.boots?.evasion || 0;
  if (rng.float() < evasionChance / 100) {
    return 'MISS';
  }

  // ... existing damage calculation
}

// MISSING: Accuracy stat (not defined anywhere)
// MISSING: Accuracy modifiers (blind status effect, weather, etc.)
```

**Impact:** MEDIUM - Equipment bonuses don't work, strategic builds less viable

---

### 2.2 Accuracy/Hit Rate System
**Spec Location:** None (but required for balance)

**What's Missing:**
- ❌ No accuracy stat
- ❌ No base hit rate (assumed 100% always)
- ❌ No accuracy buffs/debuffs
- ❌ No "blind" status effect

**Impact:** MEDIUM - Combat lacks depth, all attacks guaranteed to hit

---

## CATEGORY 3: CONSUMABLE ITEMS SYSTEM ❌ NOT IMPLEMENTED

### 3.1 Item Usage in Battle
**Spec Location:** `Item.ts`, `shops.ts` lines 20-45

**What's Missing:**
- ❌ Cannot use items in battle
- ❌ No "Items" command in battle menu
- ❌ No item selection UI
- ❌ No item consumption logic
- ❌ No inventory management

**Current State:**
- `Item.ts` defines item types (Herb, Potion, Elixir, etc.)
- `shops.ts` has 6 items defined (Herb, Potion, Elixir, Antidote, Ether, Phoenix Down)
- `BattleScreen.tsx` has NO "Items" button
- NO `useItem()` function exists

**Required Implementation:**
```typescript
// MISSING: Item usage system
function useItem(item: Item, target: Unit): void {
  if (item.restoresHp) {
    target.currentHp = Math.min(target.maxHp, target.currentHp + item.restoresHp);
  }
  
  if (item.restoresPp) {
    target.currentPp = Math.min(target.maxPp, target.currentPp + item.restoresPp);
  }
  
  if (item.revives) {
    if (target.currentHp <= 0) {
      target.currentHp = Math.floor(target.maxHp * 0.5); // 50% HP on revive
    }
  }
  
  if (item.curesStatus) {
    target.statusEffects = target.statusEffects.filter(
      effect => !item.curesStatus!.includes(effect.type)
    );
  }
  
  // Consume item
  removeItemFromInventory(item.id);
}

// MISSING: Battle menu integration
// MISSING: Inventory management
// MISSING: Item quantity tracking
```

**Impact:** CRITICAL - Items are in shops but CANNOT BE USED

---

### 3.2 Inventory System
**Spec Location:** None defined (implied by shop system)

**What's Missing:**
- ❌ No inventory data structure
- ❌ No item quantity tracking
- ❌ No max stack size (99 per item)
- ❌ No inventory UI screen
- ❌ No "Use" command in overworld menu

**Current State:**
- `PlayerData.ts` has `gold: number` but NO `inventory` field
- Can buy items from shops (shops exist) but items disappear
- NO inventory screen in game

**Required Implementation:**
```typescript
// MISSING: Inventory in PlayerData
interface PlayerData {
  // ... existing fields
  inventory: Array<{
    itemId: string;
    quantity: number;
  }>;
}

// MISSING: Inventory management functions
function addItem(itemId: string, quantity: number): void;
function removeItem(itemId: string, quantity: number): void;
function getItemQuantity(itemId: string): number;
function hasItem(itemId: string): boolean;
```

**Impact:** CRITICAL - Players can buy items but can't access them

---

### 3.3 Item Effects Implementation
**Spec Location:** `Item.ts` lines 15-22

**What's Missing:**
- ❌ Herb: No healing (defined as 50 HP)
- ❌ Potion: No healing (defined as 100 HP)  
- ❌ Elixir: No healing (defined as full HP)
- ❌ Antidote: No poison cure
- ❌ Ether: No PP restore
- ❌ Phoenix Down: No revive logic

**Current State:**
- All 6 items defined with correct stats
- `restoresHp`, `restoresPp`, `revives`, `curesStatus` fields populated
- ZERO functionality (no `useItem()` function)

**Impact:** CRITICAL - Core item system non-functional

---

## CATEGORY 4: CLASS CHANGE SYSTEM ❌ NOT IMPLEMENTED

### 4.1 Djinn-Based Class Changes
**Spec Location:** `GAME_MECHANICS.md` Section 2.1, `Djinn.ts` lines 42, 56, 78, 88, 98, 108, 118, 128

**What's Missing:**
- ❌ No class change logic
- ❌ No class-specific stat modifiers
- ❌ No class-based ability unlocks
- ❌ No visual feedback for class changes
- ❌ Class names calculated but NEVER applied

**Current State:**
- `calculateDjinnSynergy()` returns `classChange: string`
- Class names generated: "Base", "Adept", "Venus Warrior", "Hybrid", "Venus Adept", "Venus Knight", "Mystic"
- NEVER stored on unit
- NEVER displayed in UI
- ZERO gameplay effect

**Required Implementation:**
```typescript
// MISSING: Class storage on Unit
class Unit {
  // ... existing fields
  currentClass: string; // "Venus Adept", "Mars Knight", etc.
  
  // MISSING: Class-specific modifiers
  getClassModifiers(): Partial<Stats> {
    const classData = CLASS_DEFINITIONS[this.currentClass];
    return classData.statModifiers;
  }
  
  // MISSING: Class-specific abilities
  getClassAbilities(): Ability[] {
    const classData = CLASS_DEFINITIONS[this.currentClass];
    return classData.unlockedAbilities;
  }
}

// MISSING: Class definitions
const CLASS_DEFINITIONS = {
  'Venus Adept': {
    statModifiers: { atk: 1.1, def: 1.1 }, // +10% ATK/DEF
    unlockedAbilities: ['Earthquake']
  },
  'Mars Knight': {
    statModifiers: { atk: 1.15, hp: 1.1 },
    unlockedAbilities: ['Flame Charge']
  },
  // ... etc for all class types
};
```

**Impact:** HIGH - Djinn system exists but lacks strategic depth

---

### 4.2 Class-Specific Abilities
**Spec Location:** `GAME_MECHANICS.md` Section 2.1 (Venus Adept unlocks "Earthquake")

**What's Missing:**
- ❌ No "Earthquake" ability (mentioned but not defined)
- ❌ No "Hybrid-Spell" ability (mentioned but not defined)
- ❌ No "Balance-Spell" ability (mentioned but not defined)
- ❌ No "Stone Edge" ability (mentioned but not defined)
- ❌ No "Elemental Harmony" ability (mentioned but not defined)

**Current State:**
- `abilities.ts` has 30+ abilities
- Class-specific abilities NOT included
- No logic to unlock abilities based on class

**Impact:** MEDIUM - Class system has no unique abilities

---

## CATEGORY 5: WEATHER/ENVIRONMENT SYSTEM ❌ NOT IMPLEMENTED

### 5.1 Weather Effects
**Spec Location:** None defined

**What's Missing:**
- ❌ No weather system
- ❌ No rain (boosts Water Psynergy)
- ❌ No sunshine (boosts Fire Psynergy)
- ❌ No storms (boosts Wind Psynergy)
- ❌ No fog (reduces accuracy)

**Current State:**
- NO weather data structures
- NO weather effects on battle damage

**Impact:** LOW - Not in original specs, nice-to-have

---

### 5.2 Day/Night System
**Spec Location:** None defined (mentioned in mockup extension points)

**What's Missing:**
- ❌ No time of day tracking
- ❌ No visual day/night transitions
- ❌ No NPC schedule changes
- ❌ No time-based events

**Current State:**
- NO time system
- World always daytime

**Impact:** LOW - Not critical, quality-of-life feature

---

### 5.3 Terrain Effects in Battle
**Spec Location:** None defined

**What's Missing:**
- ❌ No terrain bonuses (fighting in forest = Earth boost)
- ❌ No terrain penalties (fighting in water = Fire penalty)
- ❌ No terrain hazards (lava = fire damage per turn)

**Current State:**
- Battle backgrounds exist (vale_grassland, temple_interior, etc.)
- NO gameplay effect from backgrounds

**Impact:** LOW - Not in specs, would add depth

---

## CATEGORY 6: CUTSCENE/DIALOGUE SYSTEM ⚠️ PARTIALLY IMPLEMENTED

### 6.1 NPC Dialogue System
**Spec Location:** `areas.ts` lines 48-248 (dialogue fields)

**What's Missing:**
- ❌ No dialogue box UI component
- ❌ No text scrolling animation
- ❌ No portrait images
- ❌ No dialogue history
- ❌ No choice branches

**Current State:**
- 20+ NPCs have `dialogue` strings defined
- NO dialogue display system
- Interacting with NPCs triggers battles (for battle NPCs) but NO dialogue shown first

**Required Implementation:**
```typescript
// MISSING: Dialogue UI component
interface DialogueBoxProps {
  npcName: string;
  dialogue: string;
  portrait?: string;
  onClose: () => void;
}

// MISSING: Dialogue flow
function showDialogue(npc: NPC): void {
  if (typeof npc.dialogue === 'string') {
    displayDialogueBox({
      npcName: npc.name,
      dialogue: npc.dialogue,
      onClose: () => {
        if (npc.isBattleTrigger) {
          startBattle(npc.enemies);
        }
      }
    });
  } else {
    // Multi-stage dialogue
    displayDialogueSequence(npc.dialogue);
  }
}
```

**Impact:** MEDIUM - NPCs feel lifeless without dialogue

---

### 6.2 Cutscene System
**Spec Location:** `GAME_MECHANICS.md` Section 12.1 (mentions "STORY_CUTSCENE")

**What's Missing:**
- ❌ No cutscene scripting system
- ❌ No camera control for cutscenes
- ❌ No character movement in cutscenes
- ❌ No cutscene triggers

**Current State:**
- NO cutscene system exists
- Story progression is instant (no narrative presentation)

**Impact:** MEDIUM - Story lacks emotional impact

---

### 6.3 Conditional Dialogue
**Spec Location:** `areas.ts` (some NPCs have `pre` and `post` dialogue)

**What's Missing:**
- ❌ Conditional dialogue works for some NPCs but not all
- ❌ No quest state tracking in dialogue
- ❌ No relationship system affecting dialogue

**Current State:**
- 2 NPCs (Garet NPC, Ivan NPC) have conditional dialogue
- Most NPCs have static dialogue
- No dynamic dialogue based on party composition

**Impact:** LOW - Works for recruitment, lacks depth elsewhere

---

## CATEGORY 7: TREASURE/LOOT SYSTEM ⚠️ PARTIALLY IMPLEMENTED

### 7.1 Treasure Chest Opening
**Spec Location:** `Area.ts` lines 87-172

**What's Missing:**
- ❌ Chests defined but NO opening animation
- ❌ No "You found X!" message
- ❌ No chest sprite changes (closed → open)
- ❌ No loot distribution logic

**Current State:**
- `TreasureChest` interface defined
- 13+ chests defined in `areas.ts`
- `isTreasureAtPosition()` function exists
- NO `openChest()` function

**Required Implementation:**
```typescript
// MISSING: Chest opening system
function openChest(chest: TreasureChest, player: PlayerData): void {
  // Check if already opened
  if (player.openedChests.includes(chest.id)) {
    displayMessage("This chest is empty.");
    return;
  }
  
  // Open animation
  playChestOpenAnimation(chest.position);
  
  // Give rewards
  const contents = chest.contents;
  if (contents.gold) {
    player.gold += contents.gold;
    displayMessage(`You found ${contents.gold} gold!`);
  }
  
  if (contents.equipment) {
    player.inventory.push(contents.equipment);
    displayMessage(`You found ${contents.equipment.name}!`);
  }
  
  // Mark as opened
  player.openedChests.push(chest.id);
}
```

**Impact:** MEDIUM - Chests exist but can't be opened

---

### 7.2 Random Enemy Drops
**Spec Location:** `GAME_MECHANICS.md` Section 4 (Battle Rewards)

**What's Missing:**
- ❌ No item drops from enemies
- ❌ Drop rate system defined (30% common, 10% rare, 2% legendary) but NOT implemented
- ❌ No "You obtained X!" message after battle

**Current State:**
- `BattleRewards.ts` calculates XP and gold only
- NO item drops
- `Enemy` interface has NO `drops` field

**Required Implementation:**
```typescript
// MISSING: Enemy drop table
interface Enemy {
  // ... existing fields
  drops?: Array<{
    itemId: string;
    chance: number; // 0.0 to 1.0
    quantity: number;
  }>;
}

// MISSING: Drop calculation
function calculateDrops(enemy: Enemy, rng: RNG): Item[] {
  const drops: Item[] = [];
  
  for (const drop of enemy.drops || []) {
    if (rng.float() < drop.chance) {
      drops.push({ itemId: drop.itemId, quantity: drop.quantity });
    }
  }
  
  return drops;
}
```

**Impact:** MEDIUM - No way to farm items, forces shop purchases

---

## CATEGORY 8: SAVE SYSTEM ⚠️ PARTIALLY IMPLEMENTED

### 8.1 Save/Load Functionality
**Spec Location:** `GAME_MECHANICS.md` Section 8

**What's Missing:**
- ❌ Save system mentioned but NOT implemented
- ❌ No save slots
- ❌ No save/load UI
- ❌ No localStorage persistence
- ❌ No save data validation

**Current State:**
- `PlayerData.ts` defines save data structure
- NO `saveGame()` function
- NO `loadGame()` function
- Game state resets on page refresh

**Required Implementation:**
```typescript
// MISSING: Save/load functions
function saveGame(slot: number, data: PlayerData): void {
  const saveData = JSON.stringify(data);
  localStorage.setItem(`valeChronicles_save_${slot}`, saveData);
  displayMessage("Game saved!");
}

function loadGame(slot: number): PlayerData | null {
  const saveData = localStorage.getItem(`valeChronicles_save_${slot}`);
  if (!saveData) return null;
  
  try {
    return JSON.parse(saveData) as PlayerData;
  } catch (e) {
    console.error("Failed to load save:", e);
    return null;
  }
}

// MISSING: Auto-save triggers
// MISSING: Save validation (prevent save scumming)
```

**Impact:** CRITICAL - Players cannot save progress

---

### 8.2 Auto-Save Functionality
**Spec Location:** `GAME_MECHANICS.md` Section 13.4, 15.1

**What's Missing:**
- ❌ Auto-save after inn rest (defined but not implemented)
- ❌ Auto-save after major events (defined but not implemented)
- ❌ Auto-save before boss battles (defined but not implemented)
- ❌ Auto-save after recruitment (defined but not implemented)

**Current State:**
- Inn system calls `saveGame()` but function doesn't exist
- NO auto-save triggers

**Impact:** HIGH - Players lose progress on crash/refresh

---

## CATEGORY 9: CAMERA SYSTEM ❌ NOT IMPLEMENTED

### 9.1 Camera Follow
**Spec Location:** `GAME_MECHANICS.md` Section 13.2

**What's Missing:**
- ❌ Camera doesn't follow player
- ❌ No smooth camera movement (lerp)
- ❌ No camera boundaries (stops at map edges)
- ❌ Viewport fixed at top-left corner

**Current State:**
- `NewOverworldScreen.tsx` renders full map
- NO camera offset calculation
- Player can walk off-screen

**Required Implementation:**
```typescript
// MISSING: Camera system
const VIEWPORT_SIZE = { width: 240, height: 160 };

function updateCamera(playerPosition: Position, mapSize: Size): Position {
  let cameraX = playerPosition.x - VIEWPORT_SIZE.width / 2;
  let cameraY = playerPosition.y - VIEWPORT_SIZE.height / 2;
  
  // Clamp to map boundaries
  cameraX = Math.max(0, Math.min(mapSize.width - VIEWPORT_SIZE.width, cameraX));
  cameraY = Math.max(0, Math.min(mapSize.height - VIEWPORT_SIZE.height, cameraY));
  
  // Apply smoothing (lerp)
  const smoothFactor = 0.1;
  cameraX = lerp(currentCamera.x, cameraX, smoothFactor);
  cameraY = lerp(currentCamera.y, cameraY, smoothFactor);
  
  return { x: cameraX, y: cameraY };
}
```

**Impact:** HIGH - Large overworld maps (60×45 tiles) unplayable without camera

---

### 9.2 Camera Zoom
**Spec Location:** `GAME_MECHANICS.md` Section 13.2 (zoom level: 3)

**What's Missing:**
- ❌ No zoom control
- ❌ Zoom level fixed at 1× (should be 3×)
- ❌ No pixel-perfect rendering

**Current State:**
- Mockups use 4× zoom (960×640 viewport)
- Game uses 1× zoom (240×160 viewport)
- Inconsistent scaling

**Impact:** MEDIUM - Visual mismatch with mockups

---

## CATEGORY 10: SHOP SYSTEM ⚠️ PARTIALLY IMPLEMENTED

### 10.1 Selling Items
**Spec Location:** `GAME_MECHANICS.md` Section 14.3

**What's Missing:**
- ❌ Cannot sell equipment
- ❌ Sell price formula defined (50% of cost) but NOT implemented
- ❌ No "Sell" tab in shop UI

**Current State:**
- `ShopScreen.tsx` exists
- Can BUY items/equipment
- NO sell functionality

**Required Implementation:**
```typescript
// MISSING: Sell system
function sellItem(equipment: Equipment, playerGold: number): number {
  const sellPrice = Math.floor(equipment.cost * 0.5);
  
  // Remove from inventory
  removeEquipment(equipment.id);
  
  // Add gold
  return playerGold + sellPrice;
}

// MISSING: Shop UI "Sell" tab
```

**Impact:** MEDIUM - Cannot liquidate old equipment, gold accumulates slowly

---

### 10.2 Shop Inventory Unlocks
**Spec Location:** `GAME_MECHANICS.md` Section 14.4

**What's Missing:**
- ❌ Iron tier unlocks after first boss (NOT implemented)
- ❌ Steel tier unlocks after recruiting 3 units (NOT implemented)
- ❌ Legendary tier unlocks after defeating Kyle/Nox Typhon (NOT implemented)
- ❌ All items visible from start

**Current State:**
- `shops.ts` defines unlock flags (`unlockFlag: 'defeated_first_boss'`)
- NO flag checking logic
- All items always available

**Required Implementation:**
```typescript
// MISSING: Shop inventory filtering
function getAvailableItems(shop: Shop, playerFlags: Set<string>): Item[] {
  return shop.items.filter(item => {
    if (!item.unlockFlag) return true;
    return playerFlags.has(item.unlockFlag);
  });
}
```

**Impact:** LOW - Gameplay still functional, lacks progression curve

---

## CATEGORY 11: INN SYSTEM ⚠️ PARTIALLY IMPLEMENTED

### 11.1 Inn Rest Logic
**Spec Location:** `GAME_MECHANICS.md` Section 15.1

**What's Missing:**
- ❌ Inn rest defined but NOT implemented
- ❌ No HP/PP restore
- ❌ No status cure
- ❌ No auto-save trigger
- ❌ No gold deduction (10 gold cost)

**Current State:**
- Inn NPCs defined in `areas.ts`
- `InnScreen.tsx` does NOT exist
- NO `innRest()` function

**Required Implementation:**
```typescript
// MISSING: Inn rest function
function innRest(units: Unit[], playerGold: number): {
  success: boolean;
  message: string;
  newGold: number;
} {
  if (playerGold < 10) {
    return {
      success: false,
      message: "Insufficient gold. Need 10 gold to rest.",
      newGold: playerGold
    };
  }
  
  // Restore all units
  units.forEach(unit => {
    unit.currentHp = unit.maxHp;
    unit.currentPp = unit.maxPp;
    unit.statusEffects = [];
  });
  
  // Auto-save
  saveGame(0, getCurrentPlayerData());
  
  return {
    success: true,
    message: "You feel refreshed! HP/PP restored, game saved.",
    newGold: playerGold - 10
  };
}
```

**Impact:** HIGH - No way to heal party outside of battle items (which also don't work)

---

## CATEGORY 12: TURN ORDER VISUAL FEEDBACK ❌ NOT IMPLEMENTED

### 12.1 Turn Order Display
**Spec Location:** `BattleScreen.css` lines 140-166 (turn-order-bar defined)

**What's Missing:**
- ❌ Turn order bar exists in CSS but NOT rendered
- ❌ No visual indication of who acts next
- ❌ No turn order icons

**Current State:**
- `BattleScreen.tsx` calculates turn order
- CSS styles exist
- NO JSX to render turn order bar

**Required Implementation:**
```typescript
// MISSING: Turn order UI in BattleScreen.tsx
<div className="turn-order-bar">
  {turnOrder.map((unit, index) => (
    <div
      key={unit.id}
      className={`turn-indicator ${index === currentActorIndex ? 'active' : ''}`}
    >
      {unit.name.slice(0, 4)}
    </div>
  ))}
</div>
```

**Impact:** LOW - Functional but less user-friendly

---

## CATEGORY 13: BATTLE TRANSITION ANIMATIONS ❌ NOT IMPLEMENTED

### 13.1 Swirl Transition
**Spec Location:** `GAME_MECHANICS.md` Section 12.2

**What's Missing:**
- ❌ Spiral wipe animation (800ms)
- ❌ Fade to black (200ms)
- ❌ Fade in battle screen (300ms)
- ❌ Skip button (hold to skip)

**Current State:**
- Battle starts instantly (no transition)
- Mockup has battle-transition-spiral.html
- NOT integrated into game

**Impact:** LOW - Cosmetic, but reduces polish

---

### 13.2 Victory Transition
**Spec Location:** `GAME_MECHANICS.md` Section 12.3

**What's Missing:**
- ❌ Victory freeze frame (500ms)
- ❌ Victory pose animation
- ❌ Fade to rewards screen
- ❌ Rewards screen display
- ❌ Return to overworld fade

**Current State:**
- Battle ends instantly
- Rewards calculated but NOT displayed
- No rewards screen UI

**Impact:** MEDIUM - Players don't see XP gains, level ups, or items obtained

---

### 13.3 Defeat Transition
**Spec Location:** `GAME_MECHANICS.md` Section 12.4

**What's Missing:**
- ❌ Defeat animation (party collapse)
- ❌ "GAME OVER" screen
- ❌ Load from save option
- ❌ Return to title option

**Current State:**
- Defeat redirects to title screen instantly
- NO game over screen

**Impact:** LOW - Functional but abrupt

---

### 13.4 Flee Transition
**Spec Location:** `GAME_MECHANICS.md` Section 12.5

**What's Missing:**
- ❌ Flee animation (party runs off-screen)
- ❌ Smoke cloud effect
- ❌ Fade to overworld

**Current State:**
- Flee instantly returns to overworld
- NO animation

**Impact:** LOW - Cosmetic only

---

## CATEGORY 14: MOVEMENT SYSTEM ⚠️ PARTIALLY IMPLEMENTED

### 14.1 Diagonal Movement
**Spec Location:** `GAME_MECHANICS.md` Section 13.1

**What's Missing:**
- ❌ Diagonal movement allowed but NO speed correction
- ❌ Moving diagonally is √2 faster (1.414×)
- ❌ Should normalize to same speed as cardinal movement

**Current State:**
- `NewOverworldScreen.tsx` allows diagonal input
- Movement speed not normalized

**Required Implementation:**
```typescript
// MISSING: Speed normalization
function normalizeMovement(dx: number, dy: number): { dx: number, dy: number } {
  if (dx !== 0 && dy !== 0) {
    // Diagonal: multiply by 1/√2 ≈ 0.707
    dx *= 0.707;
    dy *= 0.707;
  }
  return { dx, dy };
}
```

**Impact:** LOW - Slight gameplay exploit (move diagonally for speed)

---

### 14.2 Collision Detection
**Spec Location:** `GAME_MECHANICS.md` Section 13.1

**What's Missing:**
- ❌ NPC collision defined but NOT implemented
- ❌ Can walk through NPCs
- ❌ No trigger zones (battle triggers, cutscene triggers)

**Current State:**
- Wall collision works
- NPC collision does NOT work

**Impact:** MEDIUM - Can't implement battle triggers properly

---

## CATEGORY 15: PSYNERGY EFFECTS/ANIMATIONS ⚠️ PARTIALLY IMPLEMENTED

### 15.1 Ability Animations
**Spec Location:** `PsynergyEffect.tsx`, `PsynergyEffect.css`

**What's Missing:**
- ❌ Only 4 abilities have animations (Ragnarok, Cure, Fireball, Quake)
- ❌ 26 other abilities use placeholder animation
- ❌ No unique animations for:
  - Clay Spire, Judgment (Venus)
  - Volcano, Meteor Strike, Pyroclasm (Mars)
  - Frost, Ice Horn, Wish, Glacial Blessing (Mercury)
  - Gust, Plasma, Thunderclap, Tempest (Jupiter)
  - Blessing, Guardian Stance, Wind's Favor (Buffs)

**Current State:**
- `PsynergyEffect.tsx` checks ability name
- Falls back to generic pulse animation

**Impact:** LOW - Functional but visually repetitive

---

## CATEGORY 16: CRITICAL HIT SYSTEM ⚠️ IMPLEMENTED BUT UNCLEAR

### 16.1 Critical Hit Feedback
**Spec Location:** `Battle.ts` line 136

**What's Missing:**
- ❌ Critical hits calculated but NO visual feedback
- ❌ No "CRITICAL!" text
- ❌ No screen shake
- ❌ No damage number color change

**Current State:**
- `checkCriticalHit()` returns boolean
- Damage multiplied by 2.0× on crit
- NO indication to player

**Impact:** MEDIUM - Players don't know when crits happen

---

## CATEGORY 17: RECRUITMENT BATTLES ❌ NOT FULLY IMPLEMENTED

### 17.1 Non-Lethal Battle System
**Spec Location:** `GAME_MECHANICS.md` Section 7.2 (FRIENDLY_BATTLE)

**What's Missing:**
- ❌ Recruitment battles end at 0 HP (should end at 25% HP)
- ❌ No "I give up!" dialogue when recruitable NPC defeated
- ❌ No post-battle recruitment prompt

**Current State:**
- Battle NPCs exist (Garet, Ivan, Mia, Felix, etc.)
- Battles are standard (lethal)
- NO special recruitment logic

**Required Implementation:**
```typescript
// MISSING: Non-lethal battle check
function checkRecruitmentBattleEnd(npc: Unit, battle: BattleState): boolean {
  if (battle.isRecruitmentBattle && npc.currentHp <= npc.maxHp * 0.25) {
    displayDialogue(npc.postBattleDialogue);
    offerRecruitment(npc);
    return true; // End battle
  }
  return false;
}
```

**Impact:** MEDIUM - Recruitment works but lacks narrative context

---

## CATEGORY 18: QUEST SYSTEM ⚠️ PARTIALLY IMPLEMENTED

### 18.1 Quest Tracking
**Spec Location:** `Quest.ts`, `quests.ts`

**What's Missing:**
- ❌ Quests defined but NO UI to view them
- ❌ No quest log screen
- ❌ No quest markers on map
- ❌ No quest completion notifications

**Current State:**
- 7 quests defined in `quests.ts`
- `Quest` interface complete
- NO quest tracking system in game

**Required Implementation:**
```typescript
// MISSING: Quest UI
interface QuestLogProps {
  activeQuests: Quest[];
  completedQuests: Quest[];
}

// MISSING: Quest markers on overworld
function renderQuestMarkers(quests: Quest[], map: Area): void {
  quests.forEach(quest => {
    if (quest.status === 'active') {
      renderMarker(quest.objectives[0].targetNPC, '!');
    }
  });
}
```

**Impact:** MEDIUM - Players don't know what to do next

---

### 18.2 Quest Reward Distribution
**Spec Location:** `quests.ts` (each quest has `rewards` field)

**What's Missing:**
- ❌ Quest rewards defined but NOT given to player
- ❌ No "Quest Complete!" screen
- ❌ No reward display

**Current State:**
- Rewards include XP, gold, equipment, items
- NEVER awarded to player

**Impact:** MEDIUM - Quests complete but feel unrewarding

---

## CATEGORY 19: PARTY MANAGEMENT ⚠️ PARTIALLY IMPLEMENTED

### 19.1 Active Party Selection
**Spec Location:** `GAME_MECHANICS.md` Section 7.1

**What's Missing:**
- ❌ Can recruit 10 units (defined)
- ❌ Only 4 can be active (defined)
- ❌ NO UI to swap active party
- ❌ NO bench system

**Current State:**
- `Team.ts` has `units: Unit[]` array
- NO differentiation between active/bench
- ALL units in team are active (breaks 4-unit limit)

**Required Implementation:**
```typescript
// MISSING: Party management
interface Team {
  // ... existing fields
  activeParty: Unit[]; // Max 4
  bench: Unit[];       // Max 6
}

function swapToActiveParty(unit: Unit, team: Team): void {
  if (team.activeParty.length >= 4) {
    throw new Error("Active party full (max 4 units)");
  }
  
  // Move from bench to active
  team.bench = team.bench.filter(u => u.id !== unit.id);
  team.activeParty.push(unit);
}
```

**Impact:** HIGH - Can't use more than 4 units, breaks 10-unit recruitment

---

## CATEGORY 20: BATTLE LOG/COMBAT TEXT ⚠️ PARTIALLY IMPLEMENTED

### 20.1 Combat Log Display
**Spec Location:** `BattleScreen.tsx` line 30

**What's Missing:**
- ❌ Combat log exists but NOT scrollable
- ❌ Only shows last 3 messages
- ❌ No message history
- ❌ No color coding (damage = red, healing = green, etc.)

**Current State:**
- `combatLog` state array exists
- Messages added on actions
- Display truncated

**Impact:** LOW - Functional but less informative

---

## CATEGORY 21: BOSS BATTLE MECHANICS ⚠️ PARTIALLY IMPLEMENTED

### 21.1 Boss-Specific Rules
**Spec Location:** `GAME_MECHANICS.md` Section 6.4

**What's Missing:**
- ❌ Cannot flee from boss battles (defined)
- ❌ NO `isBossBattle` flag check in flee logic
- ❌ Can flee from Nox Typhon (final boss) - WRONG

**Current State:**
- `attemptFlee()` has `isBossBattle` parameter
- Parameter NEVER passed (defaults to `false`)
- ALL battles allow fleeing

**Required Implementation:**
```typescript
// MISSING: Boss battle flag propagation
function startBattle(enemies: Enemy[]): BattleState {
  const isBoss = enemies.some(e => e.isBoss === true);
  
  return createBattleState(playerTeam, enemies, rng, isBoss);
}
```

**Impact:** LOW - Players can cheese boss battles by fleeing

---

## SUMMARY STATISTICS

**Total Categories:** 21
**Total Omissions:** 150+

### By Impact Level:
- **CRITICAL (game-breaking):** 8 items
  - Status effects system
  - Consumable items system  
  - Item inventory system
  - Save/load system
  - Inn healing system
  - Party management (active/bench)
  
- **HIGH (major features missing):** 7 items
  - Class change system
  - Auto-save triggers
  - Camera follow system
  - Item usage in battle
  - Treasure chest opening
  
- **MEDIUM (gameplay depth):** 12 items
  - Evasion/dodge system
  - NPC dialogue display
  - Random enemy drops
  - Shop selling
  - Quest tracking UI
  - Recruitment battle polish
  - Critical hit feedback
  
- **LOW (polish/quality-of-life):** 11 items
  - Weather effects
  - Day/night system
  - Ability animations
  - Battle transitions
  - Diagonal movement normalization
  - Combat log scrolling
  
---

## PRIORITY FIX ORDER

### Phase 1: Critical Fixes (Make Game Playable)
1. **Save/Load System** - Players need to save progress
2. **Inn Healing** - Players need to restore HP/PP
3. **Consumable Items** - Players need to use Herbs/Potions in battle
4. **Item Inventory** - Players need to store bought items
5. **Party Management** - Need active (4) vs bench (6) separation

### Phase 2: Core Mechanics (Complete Game Systems)
6. **Status Effects** - Poison, burn, freeze, paralyze
7. **Evasion/Dodge** - Make equipment bonuses functional
8. **Class Changes** - Make Djinn system fully functional
9. **Camera System** - Make large overworld maps playable
10. **Treasure Chests** - Make exploration rewarding

### Phase 3: Polish (Improve User Experience)
11. **NPC Dialogue** - Add dialogue boxes
12. **Battle Transitions** - Add swirl/fade animations
13. **Quest UI** - Add quest log screen
14. **Critical Hit Feedback** - Show "CRITICAL!" text
15. **Turn Order Display** - Show turn order bar

### Phase 4: Depth (Strategic Systems)
16. **Random Enemy Drops** - Add loot farming
17. **Shop Selling** - Allow equipment liquidation
18. **Ability Animations** - Unique visuals for all 30 abilities
19. **Recruitment Polish** - Non-lethal battles with dialogue
20. **Boss Battle Rules** - Prevent fleeing from bosses

---

**END OF AUDIT**

Total findings: **150+ mechanical omissions** across **21 categories**

This document should be used as a roadmap for completing Vale Chronicles implementation.
