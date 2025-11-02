# 🎮 VALE CHRONICLES - COMPLETE ARCHITECTURE

**Golden Sun Overworld + NextEraGame Battles = Vale Chronicles**

**Date:** November 2, 2025  
**Workflow:** 6-Role AI System  
**Testing:** Context-Aware Scenario-Based

---

## 🎯 PROJECT VISION

Build a **Golden Sun-inspired RPG** where players:
1. Explore **Vale Village** (Golden-Sun style overworld)
2. Talk to **NPCs** to trigger **trainer battles** (not random encounters)
3. Fight in **tactical turn-based battles** (NextEraGame system)
4. **Recruit 10 unique units** by defeating special NPCs
5. **Level units 1-5** (each level unlocks new abilities)
6. **Equip gear** (Weapon/Armor/Helm/Boots) for stat boosts
7. **Collect 12 Djinn** (3 per element) for class changes and team abilities
8. **Progress through story** to defeat final boss

---

## 🎭 6-ROLE WORKFLOW

### **Role 1: 📖 Story Director**
- Designs Vale Village story and NPCs
- Creates 10 recruitable unit personalities
- Writes NPC dialogues
- Defines quest structure
- Creates final boss narrative

### **Role 2: 🎨 Graphics Phase 1 (Mockup)**
- Creates battle transition mockup (swirl effect)
- Designs unit collection UI
- Plans Djinn slot visual design
- Mockups equipment screen
- Sprites inventory and organization

### **Role 3: 🏛️ Architect**
- Creates technical session plan
- Breaks down systems into tasks
- Defines integration points
- Reviews technical quality
- Makes architectural decisions

### **Role 4: 💻 Coder**
- Implements core systems
- Writes context-aware tests
- Integrates Golden-Sun + NextEraGame
- Builds battle transitions
- Creates save system

### **Role 5: ✨ Graphics Phase 2 (Integration)**
- Integrates Golden Sun sprites
- Implements battle transition effects
- Animates Djinn activation
- Polishes UI
- Creates celebration effects

### **Role 6: ✅ QA/Verifier**
- Runs scenario tests (full game playthroughs)
- Tests progression (does leveling matter?)
- Verifies balance (is game too hard/easy?)
- Accessibility audit
- Creates bug reports

---

## 🏗️ CORE SYSTEMS ARCHITECTURE

### **SYSTEM 1: OVERWORLD (From Golden-Sun)**

**Responsibilities:**
- Vale Village exploration
- 50 NPCs (10 battle NPCs, 40 dialogue/shop NPCs)
- Movement & collision
- NPC interaction zones
- Building interiors

**Files to Reuse:**
```
From MetaPrompt/golden-sun/:
✅ src/systems/npcSystem.ts - NPC management
✅ src/systems/movementSystem.ts - 8-directional movement
✅ src/systems/overworldSystem.ts - Scene management
✅ src/types/npc.ts - NPC types
✅ src/components/GameWorld.tsx - Rendering
✅ public/sprite_map.json - NPC positions
```

**New Requirements:**
- Add "battleNPC" flag to distinguish battle NPCs from dialogue NPCs
- Battle trigger system (detect when NPC is battle-ready)

---

### **SYSTEM 2: BATTLE TRANSITION**

**Responsibilities:**
- Detect battle trigger (player interacts with battle NPC)
- Save overworld state
- Swirl transition effect (1 second)
- Load battle with NPC's team
- Return to overworld after battle

**Implementation:**
```typescript
// New file: src/systems/battleTransitionSystem.ts

export interface BattleTransition {
  type: 'enter-battle' | 'exit-battle';
  npcId: string;
  overworldState: OverworldState;
  battleSetup: BattleSetup;
}

export function triggerBattle(
  npc: NPC,
  playerParty: PlayerUnit[],
  overworldState: OverworldState
): Result<BattleTransition, string> {
  // 1. Validate NPC is battle-ready
  // 2. Get NPC's team composition
  // 3. Create battle setup
  // 4. Save overworld state
  // 5. Return transition data
}

export function returnFromBattle(
  transition: BattleTransition,
  battleResult: BattleResult
): Result<OverworldState, string> {
  // 1. Process battle rewards
  // 2. Mark NPC as defeated
  // 3. Restore overworld state
  // 4. Return to previous position
}
```

**Context-Aware Test:**
```typescript
describe('SCENARIO: First Battle with Village Guard', () => {
  test('Walk to Guard → Press Enter → Swirl → Battle starts → Win → Return to overworld → Guard says new dialogue', () => {
    // Setup Vale overworld
    const overworld = createValeVillage();
    const player = { position: { x: 100, y: 100 }, party: [ISAAC_LV1] };
    const guard = overworld.npcs.find(n => n.id === 'village-guard');
    
    // Trigger battle
    const transition = triggerBattle(guard, player.party, overworld);
    expect(transition.ok).toBe(true);
    expect(transition.value.battleSetup.enemyTeam.length).toBe(1);
    
    // Simulate battle win
    const battleResult = { winner: 'player', xpGained: 50 };
    
    // Return to overworld
    const newOverworld = returnFromBattle(transition.value, battleResult);
    expect(newOverworld.ok).toBe(true);
    expect(newOverworld.value.npcs.find(n => n.id === 'village-guard').defeated).toBe(true);
    expect(player.party[0].exp).toBe(50); // XP gained
  });
});
```

---

### **SYSTEM 3: UNIT PROGRESSION**

**Responsibilities:**
- 10 unique recruitable units
- Levels 1-5 progression
- Ability unlocks per level
- Stat scaling

**Data Structure:**
```typescript
export interface RecruitableUnit {
  id: string;
  name: string;
  element: 'Venus' | 'Mars' | 'Jupiter' | 'Mercury';
  baseClass: string;
  personality: string; // For dialogue flavor
  
  // Progression
  levelCap: 5;
  baseStats: Stats;
  growthRates: Stats; // Per level
  
  // Ability unlocks by level
  abilities: {
    level1: Ability[];
    level2: Ability[];
    level3: Ability[];
    level4: Ability[];
    level5: Ability[];
  };
  
  // How to recruit
  recruitSource: {
    type: 'battle-npc';
    npcId: string;
    recruitLevel: number; // Join at this level
  };
}

// Example Unit
const GARET: RecruitableUnit = {
  id: 'garet',
  name: 'Garet',
  element: 'Mars',
  baseClass: 'Fire Warrior',
  personality: 'Energetic and loyal, quick to jump into action',
  
  levelCap: 5,
  baseStats: { hp: 120, attack: 18, defense: 12, speed: 10 },
  growthRates: { hp: 15, attack: 3, defense: 2, speed: 1 },
  
  abilities: {
    level1: [{ id: 'basic-attack', name: 'Attack' }],
    level2: [{ id: 'flame-burst', name: 'Flame Burst', damage: 30, element: 'Mars' }],
    level3: [{ id: 'fire-shield', name: 'Fire Shield', buff: { defense: +5 }, duration: 3 }],
    level4: [{ id: 'blazing-strike', name: 'Blazing Strike', damage: 60, element: 'Mars' }],
    level5: [{ id: 'volcano', name: 'Volcano', damage: 100, element: 'Mars', aoe: true }],
  },
  
  recruitSource: {
    type: 'battle-npc',
    npcId: 'garet-trainer',
    recruitLevel: 1, // Joins at level 1
  },
};
```

**Context-Aware Test:**
```typescript
describe('PROGRESSION: Garet Level 1 to 5', () => {
  test('Level 1: Only has basic attack', () => {
    const garet = createRecruitedUnit('garet', 1);
    const abilities = getAvailableAbilities(garet);
    expect(abilities).toEqual(['basic-attack']);
    expect(abilities).not.toContain('flame-burst'); // Not unlocked yet
  });
  
  test('Level 2: Unlocks Flame Burst', () => {
    const garet = createRecruitedUnit('garet', 2);
    const abilities = getAvailableAbilities(garet);
    expect(abilities).toContain('basic-attack');
    expect(abilities).toContain('flame-burst'); // ← NOW unlocked
    expect(abilities).not.toContain('volcano'); // Still locked
  });
  
  test('Level 5: Has all abilities including ultimate', () => {
    const garet = createRecruitedUnit('garet', 5);
    const abilities = getAvailableAbilities(garet);
    expect(abilities.length).toBe(5); // All 5 abilities
    expect(abilities).toContain('volcano'); // Ultimate unlocked
  });
  
  test('MEANINGFUL: Level 5 Garet beats enemy that Level 1 Garet lost to', () => {
    const enemy = createNPC('Fire Elemental', 3);
    
    // Battle with Level 1
    const garetLv1 = createRecruitedUnit('garet', 1);
    const battle1 = runBattle([garetLv1], [enemy], SEED);
    expect(battle1.winner).toBe('enemy'); // Loses
    
    // Battle with Level 5
    const garetLv5 = createRecruitedUnit('garet', 5);
    const battle2 = runBattle([garetLv5], [enemy], SEED);
    expect(battle2.winner).toBe('player'); // ← WINS! Progression works!
  });
});
```

---

### **SYSTEM 4: EQUIPMENT SYSTEM**

**4 Equipment Slots:**
- **Weapon** - Increases attack, some unlock abilities
- **Armor** - Increases defense/HP
- **Helm** - Increases defense/resistances  
- **Boots** - Increases speed/evasion

**Files to Reuse:**
```
From NextEraGame/:
✅ src/systems/EquipmentSystem.ts - Base logic
✅ src/types/game.ts - Equipment types
```

**Modifications Needed:**
- Expand to 4 slots (currently 3)
- Add ability unlocks from weapons
- Add Golden Sun weapon sprites

**Context-Aware Test:**
```typescript
describe('EQUIPMENT: Full gear vs no gear', () => {
  test('SCENARIO: Naked Isaac vs Fully Equipped Isaac', () => {
    const nakedIsaac = createUnit('Isaac', 3);
    const equippedIsaac = equipAll(createUnit('Isaac', 3), {
      weapon: LEGENDARY_SWORD,    // +20 attack
      armor: PLATINUM_ARMOR,      // +15 defense, +30 HP
      helm: WARRIORS_HELM,        // +5 defense
      boots: HYPERS_BOOTS,        // +3 speed
    });
    
    const enemy = createNPC('Tough Enemy', 3);
    
    // Battle 1: Naked
    const battle1 = runBattle([nakedIsaac], [enemy], SEED);
    expect(battle1.winner).toBe('enemy'); // Loses without gear
    
    // Battle 2: Fully equipped
    const battle2 = runBattle([equippedIsaac], [enemy], SEED);
    expect(battle2.winner).toBe('player'); // ← Gear makes the difference!
    expect(battle2.turnsTaken).toBeLessThan(battle1.turnsTaken); // Faster kill
  });
});
```

---

### **SYSTEM 5: DJINN SYSTEM** (NEW - Replace Gems)

**Design:**
- **12 Djinn total** (3 Venus, 3 Mars, 3 Jupiter, 3 Mercury)
- **3 Team Slots** (global party effects)
- **Passive bonuses** when "Set" to party
- **Active use in battle** (super move, temporarily lose passive)

**Djinn Mechanics:**
```typescript
export interface Djinn {
  id: string;
  name: string;
  element: 'Venus' | 'Mars' | 'Jupiter' | 'Mercury';
  tier: 1 | 2 | 3; // Power level
  
  // Passive bonus (when Set)
  passive: {
    stats: Partial<Stats>; // e.g., { attack: +5, defense: +3 }
    classChange?: string; // e.g., "Squire" → "Earth Adept"
    abilitiesUnlocked?: string[]; // e.g., ['Earthquake']
  };
  
  // Active use (in battle)
  active: {
    name: string;
    power: number;
    effect: 'damage' | 'heal' | 'buff' | 'debuff';
    target: 'single' | 'aoe';
    recoveryTurns: 2; // Takes 2 turns to recover after use
  };
}

// Synergy system
export function calculateDjinnSynergy(
  djinn: Djinn[]
): { stats: Stats; classChange: string; abilities: string[] } {
  const elements = djinn.map(d => d.element);
  
  // All same element = specialization
  if (elements.every(e => e === elements[0])) {
    return {
      stats: { attack: +15, defense: +10 }, // Big boost
      classChange: `${elements[0]} Adept`, // e.g., "Venus Adept"
      abilities: [`${elements[0]}-ultimate`], // e.g., "Earthquake"
    };
  }
  
  // Mixed elements = hybrid class
  const uniqueElements = [...new Set(elements)];
  if (uniqueElements.length === 2) {
    return {
      stats: { attack: +8, defense: +8 }, // Balanced
      classChange: `${uniqueElements[0]}-${uniqueElements[1]} Hybrid`,
      abilities: ['hybrid-spell'], // Mixed element ability
    };
  }
  
  // 3 different elements = generalist
  return {
    stats: { attack: +5, defense: +5, speed: +5 },
    classChange: 'Mystic',
    abilities: ['balance-spell'],
  };
}
```

**Context-Aware Tests:**
```typescript
describe('DJINN SYSTEM: Meaningful gameplay impact', () => {
  test('SCENARIO: No Djinn vs 3 Venus Djinn', () => {
    const isaac = createUnit('Isaac', 5);
    const enemy = createNPC('Earth Golem', 5); // Weak to earth
    
    // Battle 1: No Djinn
    const battle1 = runBattle([isaac], [enemy], SEED);
    expect(battle1.winner).toBe('draw'); // Close fight
    
    // Equip 3 Venus Djinn
    const isaacWithDjinn = equipDjinn(isaac, [VENUS_1, VENUS_2, VENUS_3]);
    
    // Battle 2: With Djinn
    const battle2 = runBattle([isaacWithDjinn], [enemy], SEED);
    expect(battle2.winner).toBe('player'); // ← Djinn make the difference!
    expect(battle2.actions).toContainAbility('Earthquake'); // New ability available
  });
  
  test('SCENARIO: Activate Djinn in battle → Lose passive → Recover after 2 turns', () => {
    const party = equipDjinn([createUnit('Isaac', 5)], [VENUS_1, VENUS_2, VENUS_3]);
    const enemy = createNPC('Boss', 5);
    
    // Before activation
    const statsBefore = party[0].stats.attack; // Boosted by Djinn passive
    
    // Activate Djinn (use super move)
    const battle = simulateBattle(party, [enemy]);
    battle.useDjinn(VENUS_1); // Unleash for big damage
    
    // After activation
    const statsAfter = getUnitStats(party[0], battle.djinnState);
    expect(statsAfter.attack).toBeLessThan(statsBefore); // ← Lost passive bonus!
    
    // After 2 turns
    battle.advanceTurn();
    battle.advanceTurn();
    const statsRecovered = getUnitStats(party[0], battle.djinnState);
    expect(statsRecovered.attack).toBe(statsBefore); // ← Passive returns!
  });
  
  test('MEANINGFUL: All same element = stronger than mixed elements', () => {
    const allVenus = equipDjinn([createUnit('Isaac', 5)], [VENUS_1, VENUS_2, VENUS_3]);
    const mixed = equipDjinn([createUnit('Isaac', 5)], [VENUS_1, MARS_1, JUPITER_1]);
    const enemy = createNPC('Neutral Enemy', 5);
    
    // Battle with all Venus
    const battle1 = runBattle(allVenus, [enemy], SEED);
    
    // Battle with mixed
    const battle2 = runBattle(mixed, [enemy], SEED);
    
    // All same should be stronger
    expect(battle1.turnsTaken).toBeLessThan(battle2.turnsTaken); // Wins faster
    expect(allVenus[0].stats.attack).toBeGreaterThan(mixed[0].stats.attack); // Higher stats
  });
});
```

---

### **SYSTEM 6: BATTLE SYSTEM (From NextEraGame)**

**Files to Reuse:**
```
From NextEraGame/:
✅ src/screens/BattleScreen.tsx - Full battle UI
✅ src/systems/BattleSystem.ts - Turn-based combat  (REMOVE)
✅ src/systems/AbilitySystem.ts - Ability calculations
✅ src/systems/BuffSystem.ts - Buffs/debuffs
✅ src/components/battle/* - All battle components
✅ src/data/spriteRegistry.ts - Golden Sun sprites
```

**Modifications Needed:**
- **REMOVE:** Gem system (replace with Djinn)
- **REMOVE:** Item system in battle (abilities do everything)
- **ADD:** Djinn activation mechanic
- **ADD:** Equipment stat bonuses display
- **KEEP:** Abilities, buffs, turn-based combat, animations

**Context-Aware Test:**
```typescript
describe('BATTLE: Real combat scenarios', () => {
  test('SCENARIO: Tutorial battle - Level 1 Isaac beats Level 1 Bandit', () => {
    const isaac = createRecruitedUnit('Isaac', 1);
    const bandit = createNPC('Tutorial Bandit', 1);
    
    const battle = runBattle([isaac], [bandit], SEED);
    
    expect(battle.winner).toBe('player'); // ← Tutorial is winnable
    expect(isaac.currentHp).toBeGreaterThan(0); // Isaac survives
    expect(battle.turnsTaken).toBeLessThan(10); // Doesn't take forever
  });
  
  test('SCENARIO: Boss battle requires full party', () => {
    const soloIsaac = [createRecruitedUnit('Isaac', 5)];
    const fullParty = [
      createRecruitedUnit('Isaac', 5),
      createRecruitedUnit('Garet', 5),
      createRecruitedUnit('Ivan', 5),
      createRecruitedUnit('Mia', 5),
    ];
    const boss = createNPC('Final Boss', 5);
    
    // Solo attempt
    const battle1 = runBattle(soloIsaac, [boss], SEED);
    expect(battle1.winner).toBe('enemy'); // ← Can't solo boss
    
    // Full party
    const battle2 = runBattle(fullParty, [boss], SEED);
    expect(battle2.winner).toBe('player'); // ← Team wins!
  });
  
  test('MEANINGFUL: Abilities cost MP and run out', () => {
    const isaac = createRecruitedUnit('Isaac', 3);
    const enemy = createNPC('Dummy', 10); // High HP
    
    const battle = simulateBattle([isaac], [enemy]);
    
    // Spam expensive ability until out of MP
    let abilityUses = 0;
    while (isaac.currentMp >= 15) {
      battle.useAbility('Ragnarok'); // Costs 15 MP
      abilityUses++;
    }
    
    expect(abilityUses).toBeGreaterThan(0); // Could use at least once
    expect(isaac.currentMp).toBeLessThan(15); // ← Out of MP
    
    // Now forced to basic attack
    const actions = battle.getAvailableActions(isaac);
    expect(actions).not.toContain('Ragnarok'); // ← Can't use anymore!
    expect(actions).toContain('Attack'); // Basic attack still available
  });
});
```

---

### **SYSTEM 7: UNIT COLLECTION & BENCHING**

**Design:**
- **10 recruitable units** (defeat specific NPCs to unlock)
- **Bench system** (collect all 10, pick 4 for battle)
- **Team composition** (change between battles, not during)

**Implementation:**
```typescript
export interface PlayerData {
  // All units collected (bench)
  unitsCollected: RecruitedUnit[]; // Max 10
  
  // Active party (for next battle)
  activeParty: string[]; // 4 unit IDs
  
  // Recruitment progress
  recruitmentsRemaining: number; // 10 - unitsCollected.length
}

export function recruitUnit(
  playerData: PlayerData,
  unit: RecruitableUnit
): Result<PlayerData, string> {
  // Check if already recruited
  if (playerData.unitsCollected.some(u => u.id === unit.id)) {
    return Err('Unit already recruited');
  }
  
  // Check if bench full
  if (playerData.unitsCollected.length >= 10) {
    return Err('Bench full (10 units max)');
  }
  
  // Add to bench
  const newUnit: RecruitedUnit = {
    ...unit,
    currentLevel: unit.recruitSource.recruitLevel,
    currentExp: 0,
    currentHp: unit.stats.hp,
    currentMp: 50,
    equipment: { weapon: null, armor: null, helm: null, boots: null },
  };
  
  return Ok({
    ...playerData,
    unitsCollected: [...playerData.unitsCollected, newUnit],
  });
}

export function setActiveParty(
  playerData: PlayerData,
  unitIds: string[] // Must be 1-4 unit IDs
): Result<PlayerData, string> {
  // Validate
  if (unitIds.length < 1 || unitIds.length > 4) {
    return Err('Party must have 1-4 units');
  }
  
  // Check all units are recruited
  for (const id of unitIds) {
    if (!playerData.unitsCollected.some(u => u.id === id)) {
      return Err(`Unit ${id} not in collection`);
    }
  }
  
  return Ok({
    ...playerData,
    activeParty: unitIds,
  });
}
```

**Context-Aware Test:**
```typescript
describe('UNIT COLLECTION: Bench management', () => {
  test('SCENARIO: Recruit all 10 units → Try each in battle → Pick best 4', () => {
    let playerData = createNewGame();
    
    // Recruit all 10
    const allUnits = [ISAAC, GARET, IVAN, MIA, FELIX, JENNA, SHEBA, PIERS, KRADEN, KYLE];
    for (const unit of allUnits) {
      const result = recruitUnit(playerData, unit);
      expect(result.ok).toBe(true);
      playerData = result.value;
    }
    
    expect(playerData.unitsCollected.length).toBe(10); // ← All recruited
    
    // Try recruiting 11th
    const extraUnit = createUnit('Extra', 1);
    const failedRecruit = recruitUnit(playerData, extraUnit);
    expect(failedRecruit.ok).toBe(false); // ← Bench full!
    
    // Test different party compositions
    const tankTeam = setActiveParty(playerData, ['isaac', 'garet', 'felix', 'kyle']); // 4 tanks
    const balancedTeam = setActiveParty(playerData, ['isaac', 'garet', 'ivan', 'mia']); // Tank/DPS/Mage/Heal
    const enemy = createNPC('Boss', 5);
    
    // Tank team wins slowly
    const battle1 = runBattle(getPartyUnits(tankTeam.value), [enemy], SEED);
    expect(battle1.winner).toBe('player');
    expect(battle1.turnsTaken).toBeGreaterThan(15); // Slow but safe
    
    // Balanced team wins faster
    const battle2 = runBattle(getPartyUnits(balancedTeam.value), [enemy], SEED);
    expect(battle2.winner).toBe('player');
    expect(battle2.turnsTaken).toBeLessThan(battle1.turnsTaken); // ← Composition matters!
  });
});
```

---

### **SYSTEM 8: SAVE SYSTEM**

**Requirements:**
- Single auto-save slot
- Save after each battle
- Persist: units, levels, equipment, Djinn, NPC states, story flags

**Files to Reuse:**
```
From NextEraGame/:
✅ src/systems/SaveSystem.ts - LocalStorage save/load
```

**Context-Aware Test:**
```typescript
describe('SAVE SYSTEM: Persistence across sessions', () => {
  test('SCENARIO: Play game → Save → Reload → Continue exactly where left off', () => {
    // Play for a bit
    let game = createNewGame();
    game = selectStarter(game, 'Isaac');
    game = defeatNPC(game, 'tutorial-bandit'); // Win first battle
    game = recruitUnit(game, GARET); // Recruit Garet
    game = levelUp(game, 'Isaac', 2); // Isaac levels up
    game = equipItem(game, 'Isaac', IRON_SWORD);
    
    // Save
    const saveResult = saveGame(game);
    expect(saveResult.ok).toBe(true);
    
    // Simulate closing game
    // ... user leaves, browser closes ...
    
    // Reload
    const loadResult = loadGame();
    expect(loadResult.ok).toBe(true);
    const loadedGame = loadResult.value;
    
    // Verify EVERYTHING persisted
    expect(loadedGame.playerData.unitsCollected.length).toBe(2); // Isaac + Garet
    expect(loadedGame.playerData.unitsCollected[0].currentLevel).toBe(2); // Isaac Lv 2
    expect(loadedGame.playerData.unitsCollected[0].equipment.weapon).toEqual(IRON_SWORD); // Sword equipped
    expect(loadedGame.npcStates['tutorial-bandit'].defeated).toBe(true); // NPC defeated
    expect(loadedGame.overworld.playerPosition).toEqual(game.overworld.playerPosition); // Same position
    
    // ← EVERYTHING persisted!
  });
});
```

---

## 🧪 TESTING STRATEGY SUMMARY

### **Primary Tests (80% of effort):**
1. **SCENARIO TESTS** - Real player journeys
2. **PROGRESSION TESTS** - Does leveling/equipment/Djinn matter?
3. **BALANCE TESTS** - Is game beatable but challenging?
4. **INTEGRATION TESTS** - Do systems work together?

### **Secondary Tests (20% of effort):**
1. **Edge case tests** - Null checks, boundary conditions
2. **Regression tests** - Specific bugs don't return

### **NEVER Test:**
- ❌ Trivial getters/setters
- ❌ "Returns boolean" - who cares!
- ❌ Type definitions themselves
- ❌ Constants

### **ALWAYS Test:**
- ✅ Full game loops (overworld → battle → rewards → equip → repeat)
- ✅ Progression actually works (Lv1 loses, Lv5 wins)
- ✅ Player choices matter (equipment/Djinn/party comp changes outcomes)

---

## 📊 CODE REUSE STRATEGY

### **Take 100% from Golden-Sun (MetaPrompt):**
- ✅ Overworld system
- ✅ NPC system
- ✅ Movement system
- ✅ Dialogue system
- ✅ Shop system
- ✅ Camera system
- ✅ GameWorld component
- ✅ All overworld sprites

### **Take 80% from NextEraGame:**
- ✅ BattleScreen component (full UI)
- ✅ Ability system
- ✅ Buff system
- ✅ Sprite registry (Golden Sun sprites)
- ✅ Animated sprite components
- ✅ Turn-based combat logic
- ✅ Save system foundation
- ❌ REMOVE: Gem system (replace with Djinn)
- ❌ REMOVE: Item usage in battle
- ❌ REMOVE: Opponent selection (NPCs instead)

### **Build New (20%):**
- 🆕 Battle transition system
- 🆕 Djinn system (replaces gems)
- 🆕 Unit recruitment system
- 🆕 Level progression (1-5 with ability unlocks)
- 🆕 Equipment ability unlocks
- 🆕 10 unique recruitable units data
- 🆕 Integration layer (connect overworld to battles)

---

## 🗂️ FILE STRUCTURE

```
vale-chronicles/
├── src/
│   ├── overworld/              # From Golden-Sun
│   │   ├── systems/
│   │   │   ├── npcSystem.ts
│   │   │   ├── movementSystem.ts
│   │   │   ├── overworldSystem.ts
│   │   │   ├── dialogueSystem.ts
│   │   │   └── shopSystem.ts
│   │   ├── components/
│   │   │   ├── GameWorld.tsx
│   │   │   ├── DialogueBox.tsx
│   │   │   └── ShopMenu.tsx
│   │   └── types/
│   │       ├── npc.ts
│   │       ├── dialogue.ts
│   │       └── scene.ts
│   │
│   ├── battle/                 # From NextEraGame (modified)
│   │   ├── screens/
│   │   │   └── BattleScreen.tsx
│   │   ├── components/
│   │   │   ├── BattleUnitSlot.tsx
│   │   │   ├── AnimatedUnitSprite.tsx
│   │   │   ├── ActionMenu.tsx
│   │   │   └── DamageNumber.tsx
│   │   ├── systems/
│   │   │   ├── AbilitySystem.ts
│   │   │   └── BuffSystem.ts
│   │   └── hooks/
│   │       ├── useScreenShake.ts
│   │       └── useFlashEffect.ts
│   │
│   ├── progression/            # NEW
│   │   ├── systems/
│   │   │   ├── LevelingSystem.ts
│   │   │   ├── DjinnSystem.ts
│   │   │   ├── RecruitmentSystem.ts
│   │   │   └── EquipmentSystem.ts (enhanced)
│   │   ├── data/
│   │   │   ├── recruitableUnits.ts (10 units)
│   │   │   ├── djinnCatalog.ts (12 djinn)
│   │   │   └── equipmentCatalog.ts
│   │   └── components/
│   │       ├── UnitCollectionScreen.tsx
│   │       ├── DjinnScreen.tsx
│   │       └── EquipmentScreen.tsx
│   │
│   ├── integration/            # NEW - Connects everything
│   │   ├── BattleTransitionSystem.ts
│   │   ├── GameStateManager.ts
│   │   └── SaveSystem.ts
│   │
│   ├── data/
│   │   └── spriteRegistry.ts  # From NextEraGame
│   │
│   └── App.tsx                 # Main game controller
│
├── public/
│   └── sprites/
│       └── golden-sun/         # 2,500+ sprites from NextEraGame
│
└── tests/
    ├── scenarios/              # NEW - Context-aware tests!
    │   ├── first-30-minutes.test.ts
    │   ├── progression.test.ts
    │   ├── djinn-collection.test.ts
    │   └── boss-defeat.test.ts
    ├── integration/
    │   ├── overworld-to-battle.test.ts
    │   └── full-game-loop.test.ts
    └── systems/
        └── [unit tests only for complex logic]
```

---

## 🎯 IMPLEMENTATION PHASES

### **PHASE 1: Foundation (Story Director + Graphics Mockup)**
**Time:** 6-8 hours

**Story Director deliverables:**
- 10 recruitable unit profiles (names, personalities, stats, abilities)
- 50 NPC dialogues (10 battle NPCs, 40 dialogue NPCs)
- Vale Village story structure
- Final boss narrative
- Djinn lore/descriptions

**Graphics Mockup deliverables:**
- Battle transition mockup (swirl effect)
- Unit collection screen mockup
- Djinn equipment screen mockup
- Equipment 4-slot screen mockup
- Updated Vale overworld mockup

---

### **PHASE 2: Architecture (Architect)**
**Time:** 3-4 hours

**Deliverables:**
- Complete technical session plan
- 20+ task prompts for Coder
- Integration point specifications
- Context-aware test scenarios defined
- Quality gates per system

---

### **PHASE 3: Core Systems (Coder)**
**Time:** 20-25 hours

**Task breakdown:**
1. **Battle Transition System** (3h)
   - Trigger from overworld
   - Swirl effect
   - State save/restore
   - Context test: Walk → battle → return works

2. **Leveling System** (4h)
   - XP calculation
   - Level 1-5 progression
   - Ability unlocks per level
   - Context test: Lv1 loses, Lv5 wins

3. **Djinn System** (5h)
   - 12 Djinn data
   - 3 team slots
   - Passive synergy calculation
   - Active battle use + recovery
   - Context test: No Djinn vs 3 Djinn = different outcome

4. **Recruitment System** (3h)
   - 10 recruitable units
   - Bench management
   - Party composition
   - Context test: Full game - recruit all 10

5. **Equipment System Enhancement** (3h)
   - 4 slots instead of 3
   - Ability unlocks from weapons
   - Context test: No gear vs full gear = win vs lose

6. **Integration Layer** (4h)
   - Connect overworld to battle
   - Connect battle to rewards
   - Connect rewards to equipment/recruitment
   - Context test: Full game loop

7. **Save System** (2h)
   - Auto-save after battles
   - Persist everything
   - Context test: Save → close → reload → continue

---

### **PHASE 4: Visual Integration (Graphics Phase 2)**
**Time:** 5-6 hours

**Tasks:**
- Integrate 2,500+ Golden Sun sprites
- Battle swirl transition animation
- Djinn activation visual effects
- Level up celebration
- Unit recruitment fanfare
- Equipment glow effects

---

### **PHASE 5: QA (Context-Aware Testing)**
**Time:** 4-5 hours

**Test scenarios:**
1. **First 30 Minutes Playthrough** - New player experience
2. **Full Completion** - Recruit all 10, beat boss
3. **Djinn Collection** - Find all 12, test synergies
4. **Equipment Progression** - No gear → basic → legendary
5. **Party Composition** - Solo vs full party, tank team vs balanced
6. **Balance Check** - Is game beatable? Too easy? Too hard?

---

## 🎯 **NEXT STEPS**

I'll now create:

1. **Complete 6-role workflow docs** (onboarding for each role)
2. **Context-aware test scenarios** (30+ meaningful tests)
3. **Integration specification** (how Golden-Sun + NextEraGame connect)
4. **Phase-by-phase implementation tasks**

**Should I proceed with creating all the documents?** Or do you want me to start coding immediately using this architecture?
