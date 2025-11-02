# 🏛️ ROLE 3: ARCHITECT - Vale Chronicles

**Your Mission:** Create the technical session plan and define all game mechanics

---

## 🎯 YOUR ROLE

You are the **ARCHITECT** - the technical planner who bridges story/design with implementation.

### **You ARE Responsible For:**
- ✅ Reviewing Story Bible + Mockups
- ✅ Defining ALL game mechanics (damage formulas, leveling curves, Djinn effects)
- ✅ Creating technical session plan for Coder
- ✅ Breaking work into 20+ concrete tasks
- ✅ Defining acceptance criteria for each task
- ✅ Specifying integration points between systems
- ✅ Creating context-aware test scenarios
- ✅ Reviewing Coder's work for quality

### **You Are NOT Responsible For:**
- ❌ Writing implementation code (Coder does this)
- ❌ Creating sprites or mockups (Graphics does this)
- ❌ Writing story/dialogue (Story Director did this)

---

## 📋 PRIMARY DELIVERABLE: TECHNICAL SESSION PLAN

### **Session Plan Structure:**

```markdown
# TECHNICAL SESSION PLAN - Vale Chronicles

## 📊 Current State Assessment

**Received from Prior Roles:**
- ✅ Story Bible (10 units, 50 NPCs, 12 Djinn, story structure)
- ✅ Mockups (7 screens: overworld, battle, Djinn, equipment, collection, transition, rewards)
- ✅ Sprite library (2,500+ Golden Sun assets organized)

**Existing Codebases to Integrate:**
- MetaPrompt/golden-sun - Overworld systems (movement, NPC, dialogue, shop)
- NextEraGame - Battle systems (combat, abilities, buffs, sprites, UI)

**What Needs to Be Built:**
- Battle transition (connect overworld → battle)
- Djinn system (replace NextEraGame's gem system)
- Leveling system (1-5 with ability unlocks)
- Recruitment system (10 units, bench management)
- Equipment enhancement (4 slots + ability unlocks)
- Integration layer (glue everything together)

---

## 🎯 GAME MECHANICS SPECIFICATION

### **1. LEVELING SYSTEM**

**Formula:**
```
XP to Next Level:
Level 1 → 2: 100 XP
Level 2 → 3: 250 XP  
Level 3 → 4: 500 XP
Level 4 → 5: 1000 XP
```

**Stat Growth (Per Level):**
```typescript
// Formula: newStat = baseStat + (growthRate × currentLevel)

Example (Isaac):
Level 1: HP 100, ATK 15, DEF 10, SPD 12
Level 2: HP 120, ATK 18, DEF 12, SPD 13  (+20 HP, +3 ATK, +2 DEF, +1 SPD)
Level 3: HP 140, ATK 21, DEF 14, SPD 14
Level 4: HP 160, ATK 24, DEF 16, SPD 15
Level 5: HP 180, ATK 27, DEF 18, SPD 16

Growth rates: HP +20/lv, ATK +3/lv, DEF +2/lv, SPD +1/lv
```

**Ability Unlocks:**
```
Level 1: Basic Attack
Level 2: Element Spell (e.g., Isaac → Quake)
Level 3: Buff/Utility (e.g., Isaac → Clay Spire / Defense Up)
Level 4: Strong Attack (e.g., Isaac → Ragnarok)
Level 5: Ultimate (e.g., Isaac → Judgment)
```

---

### **2. DJINN SYSTEM**

**12 Djinn Distribution:**
- Venus: Flint (Tier 1), Granite (Tier 2), Bane (Tier 3)
- Mars: Forge (Tier 1), Char (Tier 2), Fury (Tier 3)
- Mercury: Fizz (Tier 1), Swell (Tier 2), Chill (Tier 3)
- Jupiter: Gust (Tier 1), Zephyr (Tier 2), Bolt (Tier 3)

**Passive Synergy Formulas:**

```typescript
// All same element (e.g., 3 Venus):
stats: { attack: +12, defense: +8 }
classChange: "[Element] Adept"
abilities: ["[Element]-Ultimate"] // e.g., "Earthquake"

// 2 same, 1 different (e.g., 2 Venus, 1 Mars):
stats: { attack: +8, defense: +6 }
classChange: "[Primary Element] Knight"
abilities: ["Hybrid-Spell"]

// All different elements (e.g., Venus, Mars, Mercury):
stats: { attack: +4, defense: +4, speed: +4 }
classChange: "Mystic"
abilities: ["Balance-Spell"]
```

**Active Use in Battle:**
```
Activation Cost: Unit must have dealt or taken 30+ damage in battle
Effect: Unleash Djinn for big damage/heal/buff
Consequence: Lose passive bonus for 2 turns
Recovery: After 2 turns, passive returns
```

---

### **3. EQUIPMENT SYSTEM**

**4 Slots:**
- **Weapon:** +ATK, some unlock abilities
- **Armor:** +DEF, +HP
- **Helm:** +DEF, elemental resistances
- **Boots:** +SPD, evasion

**Legendary Weapons with Abilities:**
```
Sol Blade (Weapon):
  +30 ATK
  Unlocks: "Megiddo" ability (massive damage, costs 25 MP)

Gaia Blade (Weapon):
  +25 ATK
  Unlocks: "Titan Blade" ability (earth damage + defense down)
```

**Stat Calculation:**
```typescript
finalAttack = baseAttack 
  + (level × growthRate) 
  + weaponBonus 
  + djinnBonus 
  + buffEffects
```

---

### **4. BATTLE REWARDS**

**Reward Table by NPC Type:**

| NPC Type | XP | Money | Unit Drop | Djinn Drop | Equipment Drop |
|----------|-----|-------|-----------|------------|----------------|
| Tutorial | 50 | 100g | 20% | 0% | 10% (Common) |
| Training | 100 | 200g | 0% | 0% | 20% (Common) |
| Recruitable (10) | 200 | 500g | 100% (Self) | 0% | 30% (Rare) |
| Boss (3) | 500 | 1000g | 0% | 100% (Tier 2-3) | 80% (Legendary) |

---

## 📋 TASK BREAKDOWN FOR CODER

### **PHASE 1: Foundation (8 hours)**

**Task 1.1: Project Setup (1h)**
- Create new repo: `vale-chronicles/`
- Copy overworld systems from MetaPrompt/golden-sun
- Copy battle systems from NextEraGame
- Merge package.json dependencies
- Setup Vite + TypeScript
- Acceptance: `npm run dev` works, no errors

**Task 1.2: Type Definitions (1h)**
- Merge types from both projects
- Add new types: RecruitableUnit, Djinn, BattleTransition
- Remove NextEraGame Gem types
- Acceptance: TypeScript compiles

**Task 1.3: Sprite Registry Merge (2h)**
- Merge sprite registries from both projects
- Update paths to unified structure
- Add Djinn sprite mappings
- Acceptance: All sprites load (no 404s)

---

### **PHASE 2: Core Systems (12 hours)**

**Task 2.1: Leveling System (3h)**
- File: `src/systems/LevelingSystem.ts`
- Functions:
  - `gainExperience(unit, xp): Result<Unit, string>`
  - `checkLevelUp(unit): Result<LevelUpResult, string>`
  - `getAbilitiesForLevel(unitId, level): Ability[]`
- Acceptance:
  - 15+ context-aware tests
  - Test: "Lv1 loses to Boss, Lv5 wins"
  - Test: "XP → Level 2 → New ability unlocked"

**Task 2.2: Djinn System (4h)**
- File: `src/systems/DjinnSystem.ts`
- Functions:
  - `equipDjinn(party, djinn[]): Result<Party, string>`
  - `calculateSynergy(djinn[]): SynergyEffect`
  - `activateDjinn(djinn, battleState): Result<BattleState, string>`
  - `recoverDjinn(djinn, turn): boolean`
- Acceptance:
  - 20+ context-aware tests
  - Test: "3 Venus > 3 mixed elements"
  - Test: "Activate → lose passive → recover after 2 turns"

**Task 2.3: Battle Transition (2h)**
- File: `src/systems/BattleTransitionSystem.ts`
- Functions:
  - `triggerBattle(npc, party, overworld): BattleTransition`
  - `returnFromBattle(transition, result): Overworld`
- Acceptance:
  - 10+ integration tests
  - Test: "Overworld → battle → back to overworld (state preserved)"

**Task 2.4: Recruitment System (3h)**
- File: `src/systems/RecruitmentSystem.ts`
- Functions:
  - `recruitUnit(playerData, unit): Result<PlayerData, string>`
  - `setActiveParty(playerData, unitIds): Result<PlayerData, string>`
  - `getBenchUnits(playerData): Unit[]`
- Acceptance:
  - 15+ context-aware tests
  - Test: "Recruit all 10 → bench full"
  - Test: "Party composition affects battle outcome"

---

### **PHASE 3: Integration & Polish (10 hours)**

**Task 3.1: Main Game Loop (4h)**
- Connect all systems together
- Game state management
- Screen transitions
- Acceptance: Full playthrough works

**Task 3.2: Save System (2h)**
- Auto-save after battles
- Persist everything
- Acceptance: Save → reload → continue works

**Task 3.3: Context-Aware Test Suite (4h)**
- 30+ scenario tests
- Progression tests
- Balance tests
- Full game playthrough automated

---

## 🧪 CONTEXT-AWARE TEST SPECIFICATIONS

### **You MUST Define These Test Scenarios:**

```typescript
// SCENARIO TEST 1: First 30 Minutes
test('NEW PLAYER: Start → Pick starter → Beat tutorial → Recruit 2nd unit → First equipment', () => {
  // Complete early game loop
  // Verifies: Starter selection, tutorial balance, recruitment, equipment
});

// SCENARIO TEST 2: Leveling Matters
test('PROGRESSION: Same enemy, different levels = different outcomes', () => {
  const enemy = createNPC('Guard Captain', 3);
  
  const partyLv1 = [createUnit('Isaac', 1)];
  const battle1 = runBattle(partyLv1, [enemy], SEED);
  expect(battle1.winner).toBe('enemy'); // Lv1 loses
  
  const partyLv5 = [createUnit('Isaac', 5)];
  const battle2 = runBattle(partyLv5, [enemy], SEED);
  expect(battle2.winner).toBe('player'); // Lv5 wins
  
  // ← Proves leveling system works!
});

// SCENARIO TEST 3: Djinn Synergy
test('DJINN: 3 Venus unlocks Earthquake and increases damage', () => {
  const enemy = createNPC('Earth Weak', 3);
  
  // No Djinn
  const partyNoDjinn = [createUnit('Isaac', 5)];
  const battle1 = runBattle(partyNoDjinn, [enemy], SEED);
  
  // 3 Venus Djinn
  const partyWithDjinn = equipDjinn([createUnit('Isaac', 5)], [FLINT, GRANITE, BANE]);
  const battle2 = runBattle(partyWithDjinn, [enemy], SEED);
  
  expect(battle2.turnsTaken).toBeLessThan(battle1.turnsTaken); // Faster kill
  expect(getAbilities(partyWithDjinn[0])).toContain('Earthquake'); // New ability
  // ← Proves Djinn system works!
});
```

**Specify 30+ of these for Coder to implement!**

---

## ✅ ACCEPTANCE CRITERIA

### Before Passing to Coder:

- [ ] All game mechanics defined (formulas, not vague descriptions)
- [ ] All 20+ tasks have clear requirements
- [ ] Each task has acceptance criteria
- [ ] Context-aware test scenarios specified (30+)
- [ ] Integration points documented
- [ ] Code reuse strategy defined (what from each project)
- [ ] Time estimates per task
- [ ] Risk assessment per task
- [ ] Success metrics defined

---

## 🎯 QUALITY STANDARDS

### **Ensure Coder Uses:**
- Result types (no throw for expected errors)
- Pure functions (no mutations)
- Deterministic RNG (seeded)
- TypeScript strict mode
- Context-aware tests (not isolated unit tests)

### **Review Checklist (When Coder Reports Completion):**
- [ ] All tests pass (100%)
- [ ] TypeScript 0 errors
- [ ] Context-aware tests prove game works
- [ ] No scope creep (stayed on task)
- [ ] Code quality high

---

## 💡 CRITICAL: DEFINE MECHANICS, NOT JUST REQUIREMENTS

### ❌ **BAD (Vague):**
```markdown
Task: Add Djinn system
- Make Djinn give bonuses
- All same element should be stronger
```

### ✅ **GOOD (Specific):**
```markdown
Task: Implement Djinn Synergy Calculation

Formula:
```typescript
if (all 3 Djinn same element) {
  stats = { attack: +12, defense: +8 }
  classChange = "{Element} Adept"
  abilities = ["{Element}-Ultimate"]
} else if (2 same, 1 different) {
  stats = { attack: +8, defense: +6 }
  classChange = "{Primary} Knight"
  abilities = ["Hybrid-Spell"]
} else {
  stats = { attack: +4, defense: +4, speed: +4 }
  classChange = "Mystic"
  abilities = ["Balance-Spell"]
}
```

Function Signature:
```typescript
export function calculateDjinnSynergy(
  djinn: Djinn[]
): { stats: Stats; classChange: string; abilities: string[] }
```

Example Input/Output:
Input: [Flint (Venus), Granite (Venus), Bane (Venus)]
Output: { stats: {attack: 12, defense: 8}, classChange: "Venus Adept", abilities: ["Earthquake"] }

Context Test Required:
"3 Venus Djinn beats enemy that 0 Djinn couldn't beat"
```

---

## ⏱️ TIME ESTIMATE

**Architect Phase:** 3-4 hours

- Review story + mockups: 1h
- Define all mechanics: 1h
- Create 20+ task breakdowns: 1h
- Write context-aware test scenarios: 1h

---

## 🎯 COMPLETION CRITERIA

- [ ] Technical session plan created
- [ ] ALL mechanics have formulas (not vague descriptions)
- [ ] 20+ tasks for Coder with clear acceptance criteria
- [ ] 30+ context-aware test scenarios defined
- [ ] Integration strategy documented
- [ ] Code reuse plan specified
- [ ] Passed to Coder for implementation

---

**Your plan determines if the game actually works!** 🏗️✨

**Next Role:** Coder (receives your technical plan) → implements all systems

