<<<<<<< HEAD
# TASK BREAKDOWN - Vale Chronicles

**Architect Deliverable - Phase 3**

This document contains 20+ implementation tasks for the Coder, with exact requirements and context-aware test scenarios.

---

## TASK CATEGORIES

1. **Core Systems** (Tasks 1-5): Foundational game systems
2. **Unit Management** (Tasks 6-10): Party, stats, leveling
3. **Battle System** (Tasks 11-15): Combat mechanics
4. **Equipment & Djinn** (Tasks 16-20): Gear and Djinn systems
5. **Integration** (Tasks 21-25): UI and system integration

---

## TASK 1: Implement Unit Data Models

**Objective:** Create TypeScript interfaces and classes for all game entities

**Requirements:**
- Define `Unit` class with stats, abilities, equipment, Djinn
- Define `Enemy` class extending `Unit`
- Define `Item`, `Equipment`, `Djinn` interfaces
- Include all 10 recruitable units with exact stats from GAME_MECHANICS.md
- Include all stat growth formulas

**Acceptance Criteria:**
- [x] Can instantiate any unit with `new Unit("isaac", 1)`
- [x] Stats auto-calculate based on level
- [x] Equipment slots initialized empty
- [x] Djinn slots initialized empty
- [x] All 10 units' base stats match GAME_MECHANICS.md

**Context-Aware Test:**
```typescript
const isaac = new Unit("isaac", 5);
// Expected stats:
assert(isaac.stats.hp === 180);
assert(isaac.stats.atk === 27);
assert(isaac.stats.def === 18);
assert(isaac.stats.mag === 20);
assert(isaac.stats.spd === 16);
```

**Time Estimate:** 4 hours

**Dependencies:** None (foundational task)

---

## TASK 2: Implement Stat Calculation System

**Objective:** Calculate final stats from base + level + equipment + Djinn + buffs

**Requirements:**
- Implement `calculateFinalStats(unit: Unit): Stats`
- Sum base stats, level bonuses, equipment bonuses, Djinn synergy, active buffs
- Follow exact formula from GAME_MECHANICS.md Section 3.2
- Handle edge cases (no equipment, no Djinn, etc.)

**Acceptance Criteria:**
- [x] Base stats correct for level 1 unit
- [x] Level 5 stats match growth formula
- [x] Equipment bonuses apply correctly
- [x] Djinn synergy bonuses apply correctly
- [x] Buffs multiply stats correctly

**Context-Aware Test:**
```typescript
const isaac = new Unit("isaac", 5);
isaac.equip("weapon", WEAPONS.iron);  // +12 ATK
isaac.equip("armor", ARMOR.iron);     // +14 DEF, +20 HP
isaac.setDjinn([DJINN.flint, DJINN.granite, DJINN.bane]);  // 3 Venus: +12 ATK, +8 DEF

const stats = calculateFinalStats(isaac);

assert(stats.hp === 200);   // 180 + 20
assert(stats.atk === 51);   // 27 + 12 + 12
assert(stats.def === 40);   // 18 + 14 + 8
assert(stats.mag === 20);   // No bonuses
assert(stats.spd === 16);   // No bonuses
```

**Time Estimate:** 3 hours

**Dependencies:** Task 1

---

## TASK 3: Implement XP and Leveling System

**Objective:** Track XP, check for level ups, apply stat increases

**Requirements:**
- Implement `addXP(unit: Unit, xp: number): boolean` → returns true if leveled up
- Check against XP_CURVE from GAME_MECHANICS.md Section 1.1
- When leveling up, apply stat growth from growth rates
- Unlock new abilities at levels 2, 3, 4, 5
- Handle leveling up multiple levels at once (e.g., +300 XP at level 1)

**Acceptance Criteria:**
- [x] Level 1 unit needs 100 XP to reach level 2
- [x] Gaining 100 XP triggers level up
- [x] Stats increase correctly on level up
- [x] New abilities unlock at correct levels
- [x] Can level multiple times from single XP gain

**Context-Aware Test:**
```typescript
const isaac = new Unit("isaac", 1);
assert(isaac.level === 1);
assert(isaac.stats.hp === 100);

const leveledUp = addXP(isaac, 100);
assert(leveledUp === true);
assert(isaac.level === 2);
assert(isaac.stats.hp === 120);  // +20 from growth
assert(isaac.abilities.includes("Quake"));  // Unlocked at level 2

// Test multiple levels:
const garet = new Unit("garet", 1);
addXP(garet, 1000);  // Enough for level 5
assert(garet.level === 5);
assert(garet.stats.hp === 180);  // Level 5 HP
```

**Time Estimate:** 4 hours

**Dependencies:** Task 1, Task 2

---

## TASK 4: Implement Save/Load System

**Objective:** Persist game state to localStorage, restore on load

**Requirements:**
- Serialize `SaveData` structure from GAME_MECHANICS.md Section 8.1
- Save to `localStorage` with key `vale_chronicles_save`
- Auto-save on triggers (battle win, recruitment, level up, etc.)
- Restore all units, inventory, flags, overworld state on load
- Version save data for future compatibility

**Acceptance Criteria:**
- [x] Can save game state
- [x] Can load game state
- [x] All units restored with correct stats
- [x] Inventory and gold restored
- [x] Story flags restored
- [x] Auto-save triggers work

**Context-Aware Test:**
```typescript
// Setup game state
const game = new GameState();
game.recruitUnit("isaac", 5);
game.addGold(500);
game.setFlag("defeated_mia_friendly_spar", true);

// Save
game.save();

// Reset game
const newGame = new GameState();
newGame.load();

// Verify restoration
assert(newGame.getUnit("isaac").level === 5);
assert(newGame.gold === 500);
assert(newGame.getFlag("defeated_mia_friendly_spar") === true);
```

**Time Estimate:** 5 hours

**Dependencies:** Task 1

---

## TASK 5: Implement Equipment System

**Objective:** Equip/unequip items, apply stat bonuses, unlock abilities

**Requirements:**
- Implement `equip(unit: Unit, slot: Slot, item: Equipment): boolean`
- Implement `unequip(unit: Unit, slot: Slot): Equipment | null`
- 4 slots: weapon, armor, helm, boots
- Apply stat bonuses from GAME_MECHANICS.md Section 3.1
- Legendary equipment unlocks abilities (e.g., Sol Blade → Megiddo)
- Validate equipment compatibility (class restrictions if any)

**Acceptance Criteria:**
- [x] Can equip items to 4 slots
- [x] Can unequip items
- [x] Stat bonuses apply immediately
- [x] Legendary abilities unlock
- [x] Unequipping removes bonuses
- [x] Can swap equipment (auto-unequip old item)

**Context-Aware Test:**
```typescript
const isaac = new Unit("isaac", 5);
const baseAtk = isaac.stats.atk;  // 27

// Equip Iron Sword
equip(isaac, "weapon", WEAPONS.iron);
assert(isaac.stats.atk === 39);  // 27 + 12

// Swap to Steel Sword
equip(isaac, "weapon", WEAPONS.steel);
assert(isaac.stats.atk === 47);  // 27 + 20

// Equip Sol Blade
equip(isaac, "weapon", WEAPONS.legendary);
assert(isaac.stats.atk === 57);  // 27 + 30
assert(isaac.abilities.includes("Megiddo"));  // Unlocked!

// Unequip
unequip(isaac, "weapon");
assert(isaac.stats.atk === 27);  // Back to base
assert(!isaac.abilities.includes("Megiddo"));  // Removed
```

**Time Estimate:** 4 hours

**Dependencies:** Task 1, Task 2

---

## TASK 6: Implement Party Management

**Objective:** Select active party of 4 from collection of up to 10 units

**Requirements:**
- Max 10 total units, max 4 active party, min 1 active
- Implement `addToParty(unitId: string): boolean`
- Implement `removeFromParty(unitId: string): boolean`
- Validate party size constraints
- Only active party participates in battles

**Acceptance Criteria:**
- [x] Can add units to active party (up to 4)
- [x] Cannot add 5th unit to party
- [x] Can remove units from party
- [x] Cannot remove last active unit
- [x] Bench units don't participate in battle

**Context-Aware Test:**
```typescript
const game = new GameState();
game.recruitUnit("isaac");
game.recruitUnit("garet");
game.recruitUnit("ivan");
game.recruitUnit("mia");
game.recruitUnit("felix");

// Add first 4 to party
addToParty("isaac");
addToParty("garet");
addToParty("ivan");
addToParty("mia");
assert(game.activeParty.length === 4);

// Try to add 5th - should fail
const result = addToParty("felix");
assert(result === false);
assert(game.activeParty.length === 4);

// Remove one, then add felix
removeFromParty("mia");
addToParty("felix");
assert(game.activeParty.includes("felix"));
assert(!game.activeParty.includes("mia"));

// Cannot remove last unit
removeFromParty("isaac");
removeFromParty("garet");
removeFromParty("ivan");
const lastRemove = removeFromParty("felix");
assert(lastRemove === false);  // Failed - must keep 1
assert(game.activeParty.length === 1);
```

**Time Estimate:** 3 hours

**Dependencies:** Task 1

---

## TASK 7: Implement Djinn System

**Objective:** Equip Djinn, calculate synergy bonuses, activate in battle

**Requirements:**
- Up to 3 Djinn per unit
- Calculate synergy bonuses from GAME_MECHANICS.md Section 2.1
- Implement Set/Standby/Recovery states
- Active unleash costs passive bonus for 2 turns
- Synergy effects: All same, 2 same + 1 diff, all different

**Acceptance Criteria:**
- [x] Can equip up to 3 Djinn per unit
- [x] Synergy bonuses calculate correctly
- [x] Can activate Djinn in battle (Set → Standby)
- [x] Passive bonus removed when activated
- [x] Djinn returns to Set after 2 turns

**Context-Aware Test:**
```typescript
const isaac = new Unit("isaac", 5);

// Equip 3 Venus Djinn (all same element)
isaac.setDjinn([DJINN.flint, DJINN.granite, DJINN.bane]);

const synergy = calculateDjinnSynergy(isaac.djinn);
assert(synergy.atk === 12);   // +12 ATK
assert(synergy.def === 8);    // +8 DEF
assert(synergy.class === "Venus Adept");

const stats = calculateFinalStats(isaac);
assert(stats.atk === 39);  // 27 base + 12 synergy
assert(stats.def === 26);  // 18 base + 8 synergy

// Activate Granite in battle
activateDjinn(isaac, "granite");
assert(isaac.djinnStates.granite === "Standby");

// Passive bonus lost
const newSynergy = calculateDjinnSynergy(isaac.djinn);
assert(newSynergy.atk === 8);   // Only 2 Set Djinn now (reduced bonus)

// After 2 turns
advanceTurns(2);
assert(isaac.djinnStates.granite === "Set");  // Recovered
```

**Time Estimate:** 6 hours

**Dependencies:** Task 1, Task 2

---

## TASK 8: Implement Recruitment System

**Objective:** Recruit units via battle/quest completion, enforce max 10 units

**Requirements:**
- Track recruitment flags from GAME_MECHANICS.md Section 7.3
- Implement `recruitUnit(unitId: string, level: number): boolean`
- Units join at specific levels (Section 7.4)
- Max 10 total units
- Starter choice (pick 1 of 3 at tutorial)

**Acceptance Criteria:**
- [x] Can recruit units via flags
- [x] Units join at correct levels
- [x] Cannot recruit more than 10 units
- [x] Starter choice works
- [x] Recruitment triggers rewards screen

**Context-Aware Test:**
```typescript
const game = new GameState();

// Starter choice
game.chooseStarter("isaac");
assert(game.hasUnit("isaac"));
assert(!game.hasUnit("garet"));
assert(!game.hasUnit("ivan"));

// Recruit Mia (joins at level 3)
game.setFlag("defeated_mia_friendly_spar", true);
game.recruitUnit("mia", 3);
assert(game.getUnit("mia").level === 3);

// Recruit 8 more units (total 10)
game.recruitUnit("garet", 1);
game.recruitUnit("ivan", 1);
game.recruitUnit("felix", 5);
game.recruitUnit("jenna", 4);
game.recruitUnit("sheba", 4);
game.recruitUnit("piers", 6);
game.recruitUnit("kraden", 7);
game.recruitUnit("kyle", 8);
assert(game.units.length === 10);

// Try to recruit 11th - should fail
const result = game.recruitUnit("someone", 1);
assert(result === false);
```

**Time Estimate:** 4 hours

**Dependencies:** Task 1, Task 6

---

## TASK 9: Implement Ability System

**Objective:** Use abilities in battle, calculate damage/healing, cost PP

**Requirements:**
- Implement ability data from GAME_MECHANICS.md Section 5.3
- Physical attacks use ATK, Psynergy uses MAG
- Deduct PP cost when using Psynergy
- Abilities unlock at specific levels
- Different target types (single, all-enemies, all-allies)

**Acceptance Criteria:**
- [x] Can use physical attacks (no PP cost)
- [x] Can use Psynergy (costs PP)
- [x] Damage calculates correctly
- [x] PP deducted correctly
- [x] Cannot use ability if insufficient PP
- [x] Abilities unlock at correct levels

**Context-Aware Test:**
```typescript
const isaac = new Unit("isaac", 3);
isaac.currentPp = 28;  // Level 3 has 28 PP

// Use Quake (costs 5 PP, unlocked at level 2)
const canUse = isaac.canUseAbility("Quake");
assert(canUse === true);

useAbility(isaac, "Quake", targets);
assert(isaac.currentPp === 23);  // 28 - 5

// Try to use Ragnarok (unlocked at level 4)
const canUseRagnarok = isaac.canUseAbility("Ragnarok");
assert(canUseRagnarok === false);  // Not unlocked yet

// Level up to 4
addXP(isaac, 500);  // Level 4
assert(isaac.canUseAbility("Ragnarok") === true);

// Use Ragnarok (costs 15 PP)
useAbility(isaac, "Ragnarok", target);
assert(isaac.currentPp === 8);  // 23 - 15

// Try to use Ragnarok again (not enough PP)
const canUseAgain = isaac.canUseAbility("Ragnarok");
assert(canUseAgain === false);  // Only 8 PP left
```

**Time Estimate:** 5 hours

**Dependencies:** Task 1, Task 3

---

## TASK 10: Implement Enemy AI

**Objective:** Enemies choose actions intelligently during battle

**Requirements:**
- Basic AI: Random attack or ability
- Smart AI: Prioritize low-HP targets, use heals when below 30% HP
- Boss AI: Use ultimate ability at 25% HP
- Choose targets based on strategy

**Acceptance Criteria:**
- [x] Enemies take actions on their turn
- [x] Smart AI heals when low HP
- [x] Boss AI uses ultimate when near death
- [x] AI doesn't use abilities without PP
- [x] AI chooses valid targets

**Context-Aware Test:**
```typescript
const enemy = new Enemy("Goblin", 3);
enemy.currentHp = 30;  // 30% of max HP (100)

// AI should prioritize healing
const action = enemy.chooseAction(playerParty);
assert(action.type === "heal");  // Smart AI heals

// Boss at 25% HP
const boss = new Enemy("Nox Typhon", 10);
boss.currentHp = boss.maxHp * 0.25;

const bossAction = boss.chooseAction(playerParty);
assert(bossAction.type === "ultimate");  // Uses big attack

// Enemy with no PP
const mage = new Enemy("Mage", 5);
mage.currentPp = 0;

const mageAction = mage.chooseAction(playerParty);
assert(mageAction.type === "physical");  // Falls back to physical
```

**Time Estimate:** 4 hours

**Dependencies:** Task 1, Task 9

---

## TASK 11: Implement Battle Turn System

**Objective:** Manage turn order, execute actions, check battle end

**Requirements:**
- Calculate turn order from SPD stat (Section 6.1)
- Each unit takes one action per turn
- Process actions sequentially
- Check for battle end after each action
- Handle KO'd units (skip their turn)

**Acceptance Criteria:**
- [x] Turn order based on SPD
- [x] Fastest unit acts first
- [x] All units/enemies act once per round
- [x] KO'd units don't act
- [x] Battle ends when all enemies or all players KO'd

**Context-Aware Test:**
```typescript
const isaac = new Unit("isaac", 5);  // SPD 16
const garet = new Unit("garet", 5);  // SPD 14
const enemy = new Enemy("Goblin", 3); // SPD 12

const battle = new Battle([isaac, garet], [enemy]);
const turnOrder = battle.calculateTurnOrder();

assert(turnOrder[0] === isaac);  // Fastest
assert(turnOrder[1] === garet);  // Medium
assert(turnOrder[2] === enemy);  // Slowest

// Execute round
battle.executeRound();

// All units acted once
assert(isaac.actionsTaken === 1);
assert(garet.actionsTaken === 1);
assert(enemy.actionsTaken === 1);

// KO garet
garet.currentHp = 0;

// Next round, garet shouldn't act
battle.executeRound();
assert(isaac.actionsTaken === 2);
assert(garet.actionsTaken === 1);  // Still 1 (didn't act)
assert(enemy.actionsTaken === 2);
```

**Time Estimate:** 5 hours

**Dependencies:** Task 1, Task 2, Task 9

---

## TASK 12: Implement Damage Calculation

**Objective:** Calculate damage for physical and Psynergy attacks

**Requirements:**
- Implement formulas from GAME_MECHANICS.md Section 5.2
- Physical: ATK vs DEF
- Psynergy: MAG vs (DEF * 0.3)
- Element modifiers (1.5x advantage, 0.67x disadvantage)
- Random variance (0.9 - 1.1)
- Minimum 1 damage

**Acceptance Criteria:**
- [x] Physical damage uses ATK and DEF
- [x] Psynergy damage uses MAG
- [x] Element advantage works
- [x] Element disadvantage works
- [x] Always deals at least 1 damage
- [x] Damage has variance

**Context-Aware Test:**
```typescript
const isaac = new Unit("isaac", 5);  // ATK 27, MAG 20
const enemy = new Enemy("Goblin", 3); // DEF 10

// Physical attack
const physicalDmg = calculatePhysicalDamage(isaac, enemy, { basePower: 0 });
// Expected: (27 - 5) * (0.9 to 1.1) = ~20-24 damage
assert(physicalDmg >= 19 && physicalDmg <= 25);

// Psynergy attack (Quake, base power 30)
const psynergyDmg = calculatePsynergyDamage(isaac, enemy, {
  basePower: 30,
  element: "Venus"
});
// Expected: (30 + 20 - 3) * 1.0 * (0.9-1.1) = ~42-51 damage
assert(psynergyDmg >= 40 && psynergyDmg <= 53);

// Element advantage (Venus → Jupiter)
const windEnemy = new Enemy("WindSprite", 3);
windEnemy.element = "Jupiter";

const advantageDmg = calculatePsynergyDamage(isaac, windEnemy, {
  basePower: 30,
  element: "Venus"  // Strong vs Jupiter
});
// Expected: ~63-77 damage (1.5x modifier)
assert(advantageDmg >= 60 && advantageDmg <= 80);
```

**Time Estimate:** 5 hours

**Dependencies:** Task 1, Task 2

---

## TASK 13: Implement Battle Rewards

**Objective:** Calculate and distribute XP, gold, items after battle

**Requirements:**
- Use formulas from GAME_MECHANICS.md Section 4
- XP: 50 + (level × 10), reduced by 20% for parties
- Gold: 25 + (level × 15)
- Item drops: 30% common, 10% rare, 2% legendary
- Show rewards screen with animations

**Acceptance Criteria:**
- [x] XP calculated correctly
- [x] Gold calculated correctly
- [x] Items drop based on rates
- [x] Rewards distributed to all active party members
- [x] Rewards screen displays correctly

**Context-Aware Test:**
```typescript
const party = [
  new Unit("isaac", 3),
  new Unit("garet", 3),
  new Unit("ivan", 3),
  new Unit("mia", 3)
];

const enemy = new Enemy("Goblin", 3);

const battle = new Battle(party, [enemy]);
battle.playerWins();

const rewards = battle.calculateRewards();

// XP: (50 + 10*3) * 0.8 = 64 XP per unit
assert(rewards.xp === 64);

// Gold: 25 + (15 * 3) = 70 gold
assert(rewards.gold === 70);

// Items: Random, but should respect drop rates
const numBattles = 1000;
let commonDrops = 0;
for (let i = 0; i < numBattles; i++) {
  const drop = rollItemDrop("common");
  if (drop) commonDrops++;
}
const commonRate = commonDrops / numBattles;
assert(commonRate >= 0.25 && commonRate <= 0.35);  // ~30%
```

**Time Estimate:** 4 hours

**Dependencies:** Task 1, Task 11

---

## TASK 14: Implement Critical Hit System

**Objective:** Add critical hits with 2x damage

**Requirements:**
- Base crit chance: 5%
- SPD bonus: +0.2% per SPD point
- Crits deal 2x damage
- Visual/audio feedback for crits

**Acceptance Criteria:**
- [x] Crits occur at correct rate
- [x] Crits deal 2x damage
- [x] SPD increases crit chance
- [x] Crit indicator shown in battle log

**Context-Aware Test:**
```typescript
const isaac = new Unit("isaac", 5);  // SPD 16
const enemy = new Enemy("Goblin", 3);

// Crit chance: 0.05 + (16 * 0.002) = 0.082 = 8.2%

let crits = 0;
let attacks = 1000;

for (let i = 0; i < attacks; i++) {
  const isCrit = checkCriticalHit(isaac);
  if (isCrit) crits++;
}

const critRate = crits / attacks;
assert(critRate >= 0.07 && critRate <= 0.09);  // ~8.2%

// Crit damage
const normalDmg = calculatePhysicalDamage(isaac, enemy, {});
const critDmg = calculatePhysicalDamage(isaac, enemy, {}, true);  // isCrit = true

assert(critDmg >= normalDmg * 1.9 && critDmg <= normalDmg * 2.1);
```

**Time Estimate:** 2 hours

**Dependencies:** Task 12

---

## TASK 15: Implement Flee System

**Objective:** Allow player to flee from non-boss battles

**Requirements:**
- Base flee chance: 50%
- Modified by SPD ratio (player avg vs enemy avg)
- Cannot flee from bosses or recruitment battles
- Failed flee costs a turn

**Acceptance Criteria:**
- [x] Can attempt to flee
- [x] Flee chance based on SPD
- [x] Cannot flee from bosses
- [x] Failed flee wastes turn
- [x] Successful flee ends battle

**Context-Aware Test:**
```typescript
const fastParty = [new Unit("felix", 5)];  // SPD 30
const slowEnemy = new Enemy("Goblin", 3);  // SPD 12

const battle = new Battle(fastParty, [slowEnemy]);
const fleeChance = battle.calculateFleeChance();

// Speed ratio: 30 / 12 = 2.5
// Flee chance: 0.5 * 2.5 = 1.25 → clamped to 0.9 (90%)
assert(fleeChance === 0.9);

// Boss battle - cannot flee
const bossBattle = new Battle(fastParty, [new Enemy("Nox Typhon", 10, true)]);
const canFlee = bossBattle.canFlee();
assert(canFlee === false);

// Test actual flee attempts
let successes = 0;
for (let i = 0; i < 100; i++) {
  const fled = battle.attemptFlee();
  if (fled) successes++;
  battle.reset();
}
const successRate = successes / 100;
assert(successRate >= 0.85 && successRate <= 0.95);  // ~90%
```

**Time Estimate:** 3 hours

**Dependencies:** Task 11

---

## TASK 16: Implement Equipment Inventory

**Objective:** Store, filter, and display equipment items

**Requirements:**
- Store all owned equipment
- Filter by type (weapons, armor, helms, boots)
- Sort by stats (ATK, DEF, etc.)
- Show stat comparison in Equipment Screen
- Equipment can be equipped by compatible units

**Acceptance Criteria:**
- [x] Can add items to inventory
- [x] Can filter by equipment type
- [x] Can sort by stat bonuses
- [x] Equipment Screen shows correct items
- [x] Stat comparison displays correctly

**Context-Aware Test:**
```typescript
const inventory = new Inventory();

// Add equipment
inventory.addItem(WEAPONS.iron);
inventory.addItem(WEAPONS.steel);
inventory.addItem(ARMOR.iron);
inventory.addItem(HELMS.basic);

// Filter weapons
const weapons = inventory.filter("weapon");
assert(weapons.length === 2);
assert(weapons.includes(WEAPONS.iron));
assert(weapons.includes(WEAPONS.steel));

// Sort weapons by ATK
const sortedWeapons = inventory.sort("weapon", "atk");
assert(sortedWeapons[0] === WEAPONS.steel);  // +20 ATK (highest)
assert(sortedWeapons[1] === WEAPONS.iron);   // +12 ATK

// Stat comparison
const isaac = new Unit("isaac", 5);
const comparison = inventory.compareEquipment(isaac, WEAPONS.steel);

assert(comparison.current.atk === 27);  // No weapon equipped
assert(comparison.new.atk === 47);      // +20 from Steel Sword
assert(comparison.diff.atk === +20);    // Green (increase)
```

**Time Estimate:** 4 hours

**Dependencies:** Task 1, Task 5

---

## TASK 17: Implement Djinn Collection

**Objective:** Track collected Djinn, allow equipping to units

**Requirements:**
- Store all 12 Djinn with unlock flags
- Filter by element
- Show Djinn details (tier, abilities, lore)
- Equip/unequip Djinn to units
- Display current synergy bonuses

**Acceptance Criteria:**
- [x] Can collect Djinn
- [x] Can filter by element
- [x] Can equip Djinn to units
- [x] Synergy bonuses display correctly
- [x] Cannot equip more than 3 Djinn per unit

**Context-Aware Test:**
```typescript
const djinnCollection = new DjinnCollection();

// Collect Venus Djinn
djinnCollection.unlock("flint");
djinnCollection.unlock("granite");
djinnCollection.unlock("bane");

assert(djinnCollection.total === 3);
assert(djinnCollection.getByElement("Venus").length === 3);

// Equip to Isaac
const isaac = new Unit("isaac", 5);
djinnCollection.equipToUnit(isaac, "flint");
djinnCollection.equipToUnit(isaac, "granite");
djinnCollection.equipToUnit(isaac, "bane");

assert(isaac.djinn.length === 3);

// Try to equip 4th - should fail
const result = djinnCollection.equipToUnit(isaac, "forge");
assert(result === false);

// Display synergy
const synergy = djinnCollection.getSynergy(isaac);
assert(synergy.atk === 12);
assert(synergy.def === 8);
assert(synergy.class === "Venus Adept");
```

**Time Estimate:** 4 hours

**Dependencies:** Task 1, Task 7

---

## TASK 18: Implement Status Effects

**Objective:** Apply buffs/debuffs, track duration, remove on expiration

**Requirements:**
- Status types: buff, debuff, poison, burn, freeze, paralyze
- Each has duration (number of turns)
- Buffs multiply stats (e.g., +25% ATK)
- Debuffs reduce stats
- DoT (damage over time) for poison/burn
- Remove expired effects automatically

**Acceptance Criteria:**
- [x] Can apply status effects
- [x] Effects modify stats correctly
- [x] DoT deals damage each turn
- [x] Effects expire after duration
- [x] Multiple effects stack

**Context-Aware Test:**
```typescript
const isaac = new Unit("isaac", 5);
const baseAtk = isaac.stats.atk;  // 27

// Apply Blessing (+25% ATK, +25% DEF, 3 turns)
applyStatus(isaac, {
  type: "buff",
  stat: "atk",
  modifier: 1.25,
  duration: 3
});

assert(isaac.stats.atk === 34);  // 27 * 1.25 = 33.75 → 34

// Advance turn
advanceTurn(isaac);
assert(isaac.activeStatuses[0].duration === 2);  // 3 → 2

// Advance 2 more turns
advanceTurn(isaac);
advanceTurn(isaac);
assert(isaac.activeStatuses.length === 0);  // Expired
assert(isaac.stats.atk === 27);  // Back to base

// DoT effect (burn)
applyStatus(isaac, {
  type: "burn",
  damagePerTurn: 10,
  duration: 3
});

isaac.currentHp = 100;
advanceTurn(isaac);
assert(isaac.currentHp === 90);  // -10 from burn
advanceTurn(isaac);
assert(isaac.currentHp === 80);  // -10 again
```

**Time Estimate:** 5 hours

**Dependencies:** Task 1, Task 11

---

## TASK 19: Implement Battle Transitions

**Objective:** Smoothly transition from overworld to battle with swirl animation

**Requirements:**
- Capture overworld snapshot
- Play swirl animation (CSS from mockup)
- Fade to black
- Load battle scene
- Trigger battle start
- Duration: ~2.3 seconds

**Acceptance Criteria:**
- [x] Animation plays smoothly
- [x] Overworld freezes during transition
- [x] Battle scene loads correctly
- [x] Reduced motion support works
- [x] Can be skipped (hold button)

**Context-Aware Test:**
```typescript
const game = new GameState();
game.currentScene = "overworld";

// Trigger encounter
const encounter = new Encounter([new Enemy("Goblin", 3)]);
game.startBattleTransition(encounter);

// During transition
assert(game.currentScene === "transition");
assert(game.inputEnabled === false);  // Frozen

// Wait 2.3 seconds
await sleep(2300);

assert(game.currentScene === "battle");
assert(game.inputEnabled === true);
assert(game.currentBattle !== null);
```

**Time Estimate:** 3 hours

**Dependencies:** None (uses CSS from mockup)

---

## TASK 20: Implement Rewards Screen

**Objective:** Display XP, gold, items, recruitment, level-ups after battle

**Requirements:**
- Show all rewards from GAME_MECHANICS.md Section 4
- Animate rewards appearing (staggered)
- Display recruitment announcement (conditional)
- Display level-up notifications (conditional)
- Continue button proceeds to next scene

**Acceptance Criteria:**
- [x] All rewards display correctly
- [x] Animations play smoothly
- [x] Recruitment shows when applicable
- [x] Level-ups show when applicable
- [x] Continue button works

**Context-Aware Test:**
```typescript
const battle = new Battle(playerParty, [enemy]);
battle.playerWins();

const rewards = battle.calculateRewards();
rewards.xp = 64;
rewards.gold = 70;
rewards.items = [ITEMS.herb];
rewards.levelUps = [{ unit: "isaac", oldLevel: 4, newLevel: 5 }];
rewards.recruitment = null;

const screen = new RewardsScreen(rewards);

// Check display
assert(screen.displayedXP === 64);
assert(screen.displayedGold === 70);
assert(screen.displayedItems.length === 1);
assert(screen.displayedLevelUps.length === 1);
assert(screen.displayedRecruitment === null);

// Click continue
screen.clickContinue();
assert(game.currentScene === "overworld");
```

**Time Estimate:** 4 hours

**Dependencies:** Task 13, CSS from mockup

---

## TASK 21: Implement Unit Collection Screen

**Objective:** Display all 10 units, manage active party, view details

**Requirements:**
- Show all collected units in 5×2 grid
- Highlight active party (4 units) with gold borders
- Click unit to view stats panel
- Add/Remove from party buttons
- Navigate to Equipment Screen

**Acceptance Criteria:**
- [x] All units display correctly
- [x] Active party highlighted
- [x] Stats panel updates on selection
- [x] Can add/remove from party
- [x] Equipment navigation works

**Context-Aware Test:**
```typescript
const game = new GameState();
game.recruitUnit("isaac", 5);
game.recruitUnit("garet", 5);
game.recruitUnit("ivan", 5);
game.recruitUnit("mia", 5);
game.addToParty("isaac");
game.addToParty("garet");
game.addToParty("ivan");
game.addToParty("mia");

const screen = new UnitCollectionScreen(game);

// Check display
assert(screen.displayedUnits.length === 4);
assert(screen.activeParty.length === 4);

// Select Isaac
screen.selectUnit("isaac");
assert(screen.statsPanel.unit === "isaac");
assert(screen.statsPanel.hp === 180);
assert(screen.statsPanel.atk === 27);

// Remove Isaac from party
screen.removeFromParty("isaac");
assert(game.activeParty.length === 3);
assert(!game.activeParty.includes("isaac"));

// Add Isaac back
screen.addToParty("isaac");
assert(game.activeParty.length === 4);
assert(game.activeParty.includes("isaac"));
```

**Time Estimate:** 5 hours

**Dependencies:** Task 6, CSS from mockup

---

## TASK 22: Implement Equipment Screen

**Objective:** Manage equipment for all units, view stat changes

**Requirements:**
- Show unit selector (all collected units)
- Display 4 equipment slots (weapon, armor, helm, boots)
- Show stat comparison (current → new)
- Scrollable inventory of available equipment
- Click to equip/unequip

**Acceptance Criteria:**
- [x] Unit selector works
- [x] Equipment slots display correctly
- [x] Stat comparison accurate
- [x] Can equip items from inventory
- [x] Can unequip items

**Context-Aware Test:**
```typescript
const game = new GameState();
const isaac = game.getUnit("isaac");
game.inventory.addItem(WEAPONS.iron);

const screen = new EquipmentScreen(game);

// Select Isaac
screen.selectUnit("isaac");
assert(screen.selectedUnit === "isaac");
assert(screen.equippedWeapon === null);

// Equip Iron Sword
screen.equipItem("weapon", WEAPONS.iron);
assert(isaac.equipment.weapon === WEAPONS.iron);

// Check stat comparison
const comparison = screen.getStatComparison();
assert(comparison.atk.current === 27);
assert(comparison.atk.new === 39);
assert(comparison.atk.diff === +12);
assert(comparison.atk.color === "green");

// Unequip
screen.unequipItem("weapon");
assert(isaac.equipment.weapon === null);
assert(game.inventory.has(WEAPONS.iron));  // Back in inventory
```

**Time Estimate:** 5 hours

**Dependencies:** Task 5, Task 16, CSS from mockup

---

## TASK 23: Integrate React Components

**Objective:** Convert all HTML mockups to React components

**Requirements:**
- EquipmentScreen.tsx
- BattleTransition.tsx
- UnitCollectionScreen.tsx
- RewardsScreen.tsx
- Use TypeScript interfaces for props
- Connect to game state management (Redux/Context)

**Acceptance Criteria:**
- [x] All screens converted to React
- [x] Props properly typed
- [x] State management connected
- [x] No UI regressions from mockups
- [x] All interactions work

**Context-Aware Test:**
```typescript
// React Testing Library
import { render, screen } from '@testing-library/react';
import { EquipmentScreen } from './EquipmentScreen';

const game = new GameState();
game.recruitUnit("isaac", 5);

render(<EquipmentScreen game={game} />);

// Check rendering
expect(screen.getByText("EQUIPMENT")).toBeInTheDocument();
expect(screen.getByText("Isaac")).toBeInTheDocument();

// Click unit
fireEvent.click(screen.getByText("Isaac"));
expect(screen.getByText("HP: 180")).toBeInTheDocument();
```

**Time Estimate:** 12 hours

**Dependencies:** All UI tasks (19-22)

---

## TASK 24: Implement Random Encounters

**Objective:** Trigger battles randomly while walking in overworld

**Requirements:**
- Encounter chance per step (configurable, default 5%)
- Different encounter tables per area
- Scale enemy level to party average
- Trigger battle transition on encounter

**Acceptance Criteria:**
- [x] Encounters trigger randomly
- [x] Encounter rate configurable
- [x] Enemies scale to party level
- [x] Battle transition plays
- [x] Can flee from random encounters

**Context-Aware Test:**
```typescript
const game = new GameState();
game.currentArea = "Vale Outskirts";
game.encounterRate = 0.05;  // 5%

let encounters = 0;
for (let i = 0; i < 1000; i++) {
  game.takeStep();
  if (game.currentScene === "battle") encounters++;
  game.currentScene = "overworld";  // Reset
}

const encounterRate = encounters / 1000;
assert(encounterRate >= 0.04 && encounterRate <= 0.06);  // ~5%

// Check enemy scaling
const partyAvgLevel = game.getAveragePartyLevel();  // e.g., 5
game.triggerRandomEncounter();

const enemy = game.currentBattle.enemies[0];
assert(enemy.level >= partyAvgLevel - 1);  // Within 1 level
assert(enemy.level <= partyAvgLevel + 1);
```

**Time Estimate:** 4 hours

**Dependencies:** Task 11, Task 19

---

## TASK 25: Implement Boss Battles

**Objective:** Special battles with unique enemies, no fleeing

**Requirements:**
- Boss enemies have higher stats
- Multi-phase battles (e.g., Nox Typhon)
- Cannot flee
- Special rewards (guaranteed rare drops)
- Story flags set on victory

**Acceptance Criteria:**
- [x] Boss stats match design
- [x] Cannot flee from boss
- [x] Phase transitions work
- [x] Guaranteed drops work
- [x] Story flags set correctly

**Context-Aware Test:**
```typescript
const game = new GameState();
const noxTyphon = new Enemy("Nox Typhon", 10, true);  // isBoss = true

const battle = new Battle(playerParty, [noxTyphon]);

// Cannot flee
assert(battle.canFlee() === false);

// High stats
assert(noxTyphon.maxHp >= 1000);  // Much higher than regular enemies

// Phase transition at 50% HP
noxTyphon.currentHp = noxTyphon.maxHp * 0.5;
battle.checkPhaseTransition();

assert(battle.currentPhase === 2);
assert(noxTyphon.attackPower > noxTyphon.baseAttackPower);  // Powered up

// Victory sets flag
battle.playerWins();
assert(game.getFlag("defeated_nox_typhon") === true);

// Guaranteed rare drop
const rewards = battle.calculateRewards();
assert(rewards.items.length > 0);
assert(rewards.items.some(item => item.rarity === "rare"));
```

**Time Estimate:** 6 hours

**Dependencies:** Task 11, Task 13

---

## SUMMARY

**Total Tasks:** 25
**Estimated Time:** 116 hours (~3 weeks for 1 developer)

**Critical Path:**
1. Task 1 (Data Models) → Task 2 (Stats) → Task 3 (Leveling)
2. Task 11 (Battle Turn) → Task 12 (Damage) → Task 13 (Rewards)
3. Task 23 (React Integration) - Requires all UI tasks complete

**Parallelizable:**
- Tasks 4, 5, 6, 7, 8 (independent systems)
- Tasks 16, 17, 18 (inventory systems)
- Tasks 19, 20, 21, 22 (UI screens)

**Next Document:** TEST_SCENARIOS.md (30+ context-aware tests)
=======
# TASK BREAKDOWN - Vale Chronicles

**Architect Deliverable - Phase 3**

This document contains 20+ implementation tasks for the Coder, with exact requirements and context-aware test scenarios.

---

## TASK CATEGORIES

1. **Core Systems** (Tasks 1-5): Foundational game systems
2. **Unit Management** (Tasks 6-10): Party, stats, leveling
3. **Battle System** (Tasks 11-15): Combat mechanics
4. **Equipment & Djinn** (Tasks 16-20): Gear and Djinn systems
5. **Integration** (Tasks 21-25): UI and system integration

---

## TASK 1: Implement Unit Data Models

**Objective:** Create TypeScript interfaces and classes for all game entities

**Requirements:**
- Define `Unit` class with stats, abilities, equipment, Djinn
- Define `Enemy` class extending `Unit`
- Define `Item`, `Equipment`, `Djinn` interfaces
- Include all 10 recruitable units with exact stats from GAME_MECHANICS.md
- Include all stat growth formulas

**Acceptance Criteria:**
- [x] Can instantiate any unit with `new Unit("isaac", 1)`
- [x] Stats auto-calculate based on level
- [x] Equipment slots initialized empty
- [x] Djinn slots initialized empty
- [x] All 10 units' base stats match GAME_MECHANICS.md

**Context-Aware Test:**
```typescript
const isaac = new Unit("isaac", 5);
// Expected stats:
assert(isaac.stats.hp === 180);
assert(isaac.stats.atk === 27);
assert(isaac.stats.def === 18);
assert(isaac.stats.mag === 20);
assert(isaac.stats.spd === 16);
```

**Time Estimate:** 4 hours

**Dependencies:** None (foundational task)

---

## TASK 2: Implement Stat Calculation System

**Objective:** Calculate final stats from base + level + equipment + Djinn + buffs

**Requirements:**
- Implement `calculateFinalStats(unit: Unit): Stats`
- Sum base stats, level bonuses, equipment bonuses, Djinn synergy, active buffs
- Follow exact formula from GAME_MECHANICS.md Section 3.2
- Handle edge cases (no equipment, no Djinn, etc.)

**Acceptance Criteria:**
- [x] Base stats correct for level 1 unit
- [x] Level 5 stats match growth formula
- [x] Equipment bonuses apply correctly
- [x] Djinn synergy bonuses apply correctly
- [x] Buffs multiply stats correctly

**Context-Aware Test:**
```typescript
const isaac = new Unit("isaac", 5);
isaac.equip("weapon", WEAPONS.iron);  // +12 ATK
isaac.equip("armor", ARMOR.iron);     // +14 DEF, +20 HP
isaac.setDjinn([DJINN.flint, DJINN.granite, DJINN.bane]);  // 3 Venus: +12 ATK, +8 DEF

const stats = calculateFinalStats(isaac);

assert(stats.hp === 200);   // 180 + 20
assert(stats.atk === 51);   // 27 + 12 + 12
assert(stats.def === 40);   // 18 + 14 + 8
assert(stats.mag === 20);   // No bonuses
assert(stats.spd === 16);   // No bonuses
```

**Time Estimate:** 3 hours

**Dependencies:** Task 1

---

## TASK 3: Implement XP and Leveling System

**Objective:** Track XP, check for level ups, apply stat increases

**Requirements:**
- Implement `addXP(unit: Unit, xp: number): boolean` → returns true if leveled up
- Check against XP_CURVE from GAME_MECHANICS.md Section 1.1
- When leveling up, apply stat growth from growth rates
- Unlock new abilities at levels 2, 3, 4, 5
- Handle leveling up multiple levels at once (e.g., +300 XP at level 1)

**Acceptance Criteria:**
- [x] Level 1 unit needs 100 XP to reach level 2
- [x] Gaining 100 XP triggers level up
- [x] Stats increase correctly on level up
- [x] New abilities unlock at correct levels
- [x] Can level multiple times from single XP gain

**Context-Aware Test:**
```typescript
const isaac = new Unit("isaac", 1);
assert(isaac.level === 1);
assert(isaac.stats.hp === 100);

const leveledUp = addXP(isaac, 100);
assert(leveledUp === true);
assert(isaac.level === 2);
assert(isaac.stats.hp === 120);  // +20 from growth
assert(isaac.abilities.includes("Quake"));  // Unlocked at level 2

// Test multiple levels:
const garet = new Unit("garet", 1);
addXP(garet, 1000);  // Enough for level 5
assert(garet.level === 5);
assert(garet.stats.hp === 180);  // Level 5 HP
```

**Time Estimate:** 4 hours

**Dependencies:** Task 1, Task 2

---

## TASK 4: Implement Save/Load System

**Objective:** Persist game state to localStorage, restore on load

**Requirements:**
- Serialize `SaveData` structure from GAME_MECHANICS.md Section 8.1
- Save to `localStorage` with key `vale_chronicles_save`
- Auto-save on triggers (battle win, recruitment, level up, etc.)
- Restore all units, inventory, flags, overworld state on load
- Version save data for future compatibility

**Acceptance Criteria:**
- [x] Can save game state
- [x] Can load game state
- [x] All units restored with correct stats
- [x] Inventory and gold restored
- [x] Story flags restored
- [x] Auto-save triggers work

**Context-Aware Test:**
```typescript
// Setup game state
const game = new GameState();
game.recruitUnit("isaac", 5);
game.addGold(500);
game.setFlag("defeated_mia_friendly_spar", true);

// Save
game.save();

// Reset game
const newGame = new GameState();
newGame.load();

// Verify restoration
assert(newGame.getUnit("isaac").level === 5);
assert(newGame.gold === 500);
assert(newGame.getFlag("defeated_mia_friendly_spar") === true);
```

**Time Estimate:** 5 hours

**Dependencies:** Task 1

---

## TASK 5: Implement Equipment System

**Objective:** Equip/unequip items, apply stat bonuses, unlock abilities

**Requirements:**
- Implement `equip(unit: Unit, slot: Slot, item: Equipment): boolean`
- Implement `unequip(unit: Unit, slot: Slot): Equipment | null`
- 4 slots: weapon, armor, helm, boots
- Apply stat bonuses from GAME_MECHANICS.md Section 3.1
- Legendary equipment unlocks abilities (e.g., Sol Blade → Megiddo)
- Validate equipment compatibility (class restrictions if any)

**Acceptance Criteria:**
- [x] Can equip items to 4 slots
- [x] Can unequip items
- [x] Stat bonuses apply immediately
- [x] Legendary abilities unlock
- [x] Unequipping removes bonuses
- [x] Can swap equipment (auto-unequip old item)

**Context-Aware Test:**
```typescript
const isaac = new Unit("isaac", 5);
const baseAtk = isaac.stats.atk;  // 27

// Equip Iron Sword
equip(isaac, "weapon", WEAPONS.iron);
assert(isaac.stats.atk === 39);  // 27 + 12

// Swap to Steel Sword
equip(isaac, "weapon", WEAPONS.steel);
assert(isaac.stats.atk === 47);  // 27 + 20

// Equip Sol Blade
equip(isaac, "weapon", WEAPONS.legendary);
assert(isaac.stats.atk === 57);  // 27 + 30
assert(isaac.abilities.includes("Megiddo"));  // Unlocked!

// Unequip
unequip(isaac, "weapon");
assert(isaac.stats.atk === 27);  // Back to base
assert(!isaac.abilities.includes("Megiddo"));  // Removed
```

**Time Estimate:** 4 hours

**Dependencies:** Task 1, Task 2

---

## TASK 6: Implement Party Management

**Objective:** Select active party of 4 from collection of up to 10 units

**Requirements:**
- Max 10 total units, max 4 active party, min 1 active
- Implement `addToParty(unitId: string): boolean`
- Implement `removeFromParty(unitId: string): boolean`
- Validate party size constraints
- Only active party participates in battles

**Acceptance Criteria:**
- [x] Can add units to active party (up to 4)
- [x] Cannot add 5th unit to party
- [x] Can remove units from party
- [x] Cannot remove last active unit
- [x] Bench units don't participate in battle

**Context-Aware Test:**
```typescript
const game = new GameState();
game.recruitUnit("isaac");
game.recruitUnit("garet");
game.recruitUnit("ivan");
game.recruitUnit("mia");
game.recruitUnit("felix");

// Add first 4 to party
addToParty("isaac");
addToParty("garet");
addToParty("ivan");
addToParty("mia");
assert(game.activeParty.length === 4);

// Try to add 5th - should fail
const result = addToParty("felix");
assert(result === false);
assert(game.activeParty.length === 4);

// Remove one, then add felix
removeFromParty("mia");
addToParty("felix");
assert(game.activeParty.includes("felix"));
assert(!game.activeParty.includes("mia"));

// Cannot remove last unit
removeFromParty("isaac");
removeFromParty("garet");
removeFromParty("ivan");
const lastRemove = removeFromParty("felix");
assert(lastRemove === false);  // Failed - must keep 1
assert(game.activeParty.length === 1);
```

**Time Estimate:** 3 hours

**Dependencies:** Task 1

---

## TASK 7: Implement Djinn System

**Objective:** Equip Djinn, calculate synergy bonuses, activate in battle

**Requirements:**
- Up to 3 Djinn per unit
- Calculate synergy bonuses from GAME_MECHANICS.md Section 2.1
- Implement Set/Standby/Recovery states
- Active unleash costs passive bonus for 2 turns
- Synergy effects: All same, 2 same + 1 diff, all different

**Acceptance Criteria:**
- [x] Can equip up to 3 Djinn per unit
- [x] Synergy bonuses calculate correctly
- [x] Can activate Djinn in battle (Set → Standby)
- [x] Passive bonus removed when activated
- [x] Djinn returns to Set after 2 turns

**Context-Aware Test:**
```typescript
const isaac = new Unit("isaac", 5);

// Equip 3 Venus Djinn (all same element)
isaac.setDjinn([DJINN.flint, DJINN.granite, DJINN.bane]);

const synergy = calculateDjinnSynergy(isaac.djinn);
assert(synergy.atk === 12);   // +12 ATK
assert(synergy.def === 8);    // +8 DEF
assert(synergy.class === "Venus Adept");

const stats = calculateFinalStats(isaac);
assert(stats.atk === 39);  // 27 base + 12 synergy
assert(stats.def === 26);  // 18 base + 8 synergy

// Activate Granite in battle
activateDjinn(isaac, "granite");
assert(isaac.djinnStates.granite === "Standby");

// Passive bonus lost
const newSynergy = calculateDjinnSynergy(isaac.djinn);
assert(newSynergy.atk === 8);   // Only 2 Set Djinn now (reduced bonus)

// After 2 turns
advanceTurns(2);
assert(isaac.djinnStates.granite === "Set");  // Recovered
```

**Time Estimate:** 6 hours

**Dependencies:** Task 1, Task 2

---

## TASK 8: Implement Recruitment System

**Objective:** Recruit units via battle/quest completion, enforce max 10 units

**Requirements:**
- Track recruitment flags from GAME_MECHANICS.md Section 7.3
- Implement `recruitUnit(unitId: string, level: number): boolean`
- Units join at specific levels (Section 7.4)
- Max 10 total units
- Starter choice (pick 1 of 3 at tutorial)

**Acceptance Criteria:**
- [x] Can recruit units via flags
- [x] Units join at correct levels
- [x] Cannot recruit more than 10 units
- [x] Starter choice works
- [x] Recruitment triggers rewards screen

**Context-Aware Test:**
```typescript
const game = new GameState();

// Starter choice
game.chooseStarter("isaac");
assert(game.hasUnit("isaac"));
assert(!game.hasUnit("garet"));
assert(!game.hasUnit("ivan"));

// Recruit Mia (joins at level 3)
game.setFlag("defeated_mia_friendly_spar", true);
game.recruitUnit("mia", 3);
assert(game.getUnit("mia").level === 3);

// Recruit 8 more units (total 10)
game.recruitUnit("garet", 1);
game.recruitUnit("ivan", 1);
game.recruitUnit("felix", 5);
game.recruitUnit("jenna", 4);
game.recruitUnit("sheba", 4);
game.recruitUnit("piers", 6);
game.recruitUnit("kraden", 7);
game.recruitUnit("kyle", 8);
assert(game.units.length === 10);

// Try to recruit 11th - should fail
const result = game.recruitUnit("someone", 1);
assert(result === false);
```

**Time Estimate:** 4 hours

**Dependencies:** Task 1, Task 6

---

## TASK 9: Implement Ability System

**Objective:** Use abilities in battle, calculate damage/healing, cost PP

**Requirements:**
- Implement ability data from GAME_MECHANICS.md Section 5.3
- Physical attacks use ATK, Psynergy uses MAG
- Deduct PP cost when using Psynergy
- Abilities unlock at specific levels
- Different target types (single, all-enemies, all-allies)

**Acceptance Criteria:**
- [x] Can use physical attacks (no PP cost)
- [x] Can use Psynergy (costs PP)
- [x] Damage calculates correctly
- [x] PP deducted correctly
- [x] Cannot use ability if insufficient PP
- [x] Abilities unlock at correct levels

**Context-Aware Test:**
```typescript
const isaac = new Unit("isaac", 3);
isaac.currentPp = 28;  // Level 3 has 28 PP

// Use Quake (costs 5 PP, unlocked at level 2)
const canUse = isaac.canUseAbility("Quake");
assert(canUse === true);

useAbility(isaac, "Quake", targets);
assert(isaac.currentPp === 23);  // 28 - 5

// Try to use Ragnarok (unlocked at level 4)
const canUseRagnarok = isaac.canUseAbility("Ragnarok");
assert(canUseRagnarok === false);  // Not unlocked yet

// Level up to 4
addXP(isaac, 500);  // Level 4
assert(isaac.canUseAbility("Ragnarok") === true);

// Use Ragnarok (costs 15 PP)
useAbility(isaac, "Ragnarok", target);
assert(isaac.currentPp === 8);  // 23 - 15

// Try to use Ragnarok again (not enough PP)
const canUseAgain = isaac.canUseAbility("Ragnarok");
assert(canUseAgain === false);  // Only 8 PP left
```

**Time Estimate:** 5 hours

**Dependencies:** Task 1, Task 3

---

## TASK 10: Implement Enemy AI

**Objective:** Enemies choose actions intelligently during battle

**Requirements:**
- Basic AI: Random attack or ability
- Smart AI: Prioritize low-HP targets, use heals when below 30% HP
- Boss AI: Use ultimate ability at 25% HP
- Choose targets based on strategy

**Acceptance Criteria:**
- [x] Enemies take actions on their turn
- [x] Smart AI heals when low HP
- [x] Boss AI uses ultimate when near death
- [x] AI doesn't use abilities without PP
- [x] AI chooses valid targets

**Context-Aware Test:**
```typescript
const enemy = new Enemy("Goblin", 3);
enemy.currentHp = 30;  // 30% of max HP (100)

// AI should prioritize healing
const action = enemy.chooseAction(playerParty);
assert(action.type === "heal");  // Smart AI heals

// Boss at 25% HP
const boss = new Enemy("Nox Typhon", 10);
boss.currentHp = boss.maxHp * 0.25;

const bossAction = boss.chooseAction(playerParty);
assert(bossAction.type === "ultimate");  // Uses big attack

// Enemy with no PP
const mage = new Enemy("Mage", 5);
mage.currentPp = 0;

const mageAction = mage.chooseAction(playerParty);
assert(mageAction.type === "physical");  // Falls back to physical
```

**Time Estimate:** 4 hours

**Dependencies:** Task 1, Task 9

---

## TASK 11: Implement Battle Turn System

**Objective:** Manage turn order, execute actions, check battle end

**Requirements:**
- Calculate turn order from SPD stat (Section 6.1)
- Each unit takes one action per turn
- Process actions sequentially
- Check for battle end after each action
- Handle KO'd units (skip their turn)

**Acceptance Criteria:**
- [x] Turn order based on SPD
- [x] Fastest unit acts first
- [x] All units/enemies act once per round
- [x] KO'd units don't act
- [x] Battle ends when all enemies or all players KO'd

**Context-Aware Test:**
```typescript
const isaac = new Unit("isaac", 5);  // SPD 16
const garet = new Unit("garet", 5);  // SPD 14
const enemy = new Enemy("Goblin", 3); // SPD 12

const battle = new Battle([isaac, garet], [enemy]);
const turnOrder = battle.calculateTurnOrder();

assert(turnOrder[0] === isaac);  // Fastest
assert(turnOrder[1] === garet);  // Medium
assert(turnOrder[2] === enemy);  // Slowest

// Execute round
battle.executeRound();

// All units acted once
assert(isaac.actionsTaken === 1);
assert(garet.actionsTaken === 1);
assert(enemy.actionsTaken === 1);

// KO garet
garet.currentHp = 0;

// Next round, garet shouldn't act
battle.executeRound();
assert(isaac.actionsTaken === 2);
assert(garet.actionsTaken === 1);  // Still 1 (didn't act)
assert(enemy.actionsTaken === 2);
```

**Time Estimate:** 5 hours

**Dependencies:** Task 1, Task 2, Task 9

---

## TASK 12: Implement Damage Calculation

**Objective:** Calculate damage for physical and Psynergy attacks

**Requirements:**
- Implement formulas from GAME_MECHANICS.md Section 5.2
- Physical: ATK vs DEF
- Psynergy: MAG vs (DEF * 0.3)
- Element modifiers (1.5x advantage, 0.67x disadvantage)
- Random variance (0.9 - 1.1)
- Minimum 1 damage

**Acceptance Criteria:**
- [x] Physical damage uses ATK and DEF
- [x] Psynergy damage uses MAG
- [x] Element advantage works
- [x] Element disadvantage works
- [x] Always deals at least 1 damage
- [x] Damage has variance

**Context-Aware Test:**
```typescript
const isaac = new Unit("isaac", 5);  // ATK 27, MAG 20
const enemy = new Enemy("Goblin", 3); // DEF 10

// Physical attack
const physicalDmg = calculatePhysicalDamage(isaac, enemy, { basePower: 0 });
// Expected: (27 - 5) * (0.9 to 1.1) = ~20-24 damage
assert(physicalDmg >= 19 && physicalDmg <= 25);

// Psynergy attack (Quake, base power 30)
const psynergyDmg = calculatePsynergyDamage(isaac, enemy, {
  basePower: 30,
  element: "Venus"
});
// Expected: (30 + 20 - 3) * 1.0 * (0.9-1.1) = ~42-51 damage
assert(psynergyDmg >= 40 && psynergyDmg <= 53);

// Element advantage (Venus → Jupiter)
const windEnemy = new Enemy("WindSprite", 3);
windEnemy.element = "Jupiter";

const advantageDmg = calculatePsynergyDamage(isaac, windEnemy, {
  basePower: 30,
  element: "Venus"  // Strong vs Jupiter
});
// Expected: ~63-77 damage (1.5x modifier)
assert(advantageDmg >= 60 && advantageDmg <= 80);
```

**Time Estimate:** 5 hours

**Dependencies:** Task 1, Task 2

---

## TASK 13: Implement Battle Rewards

**Objective:** Calculate and distribute XP, gold, items after battle

**Requirements:**
- Use formulas from GAME_MECHANICS.md Section 4
- XP: 50 + (level × 10), reduced by 20% for parties
- Gold: 25 + (level × 15)
- Item drops: 30% common, 10% rare, 2% legendary
- Show rewards screen with animations

**Acceptance Criteria:**
- [x] XP calculated correctly
- [x] Gold calculated correctly
- [x] Items drop based on rates
- [x] Rewards distributed to all active party members
- [x] Rewards screen displays correctly

**Context-Aware Test:**
```typescript
const party = [
  new Unit("isaac", 3),
  new Unit("garet", 3),
  new Unit("ivan", 3),
  new Unit("mia", 3)
];

const enemy = new Enemy("Goblin", 3);

const battle = new Battle(party, [enemy]);
battle.playerWins();

const rewards = battle.calculateRewards();

// XP: (50 + 10*3) * 0.8 = 64 XP per unit
assert(rewards.xp === 64);

// Gold: 25 + (15 * 3) = 70 gold
assert(rewards.gold === 70);

// Items: Random, but should respect drop rates
const numBattles = 1000;
let commonDrops = 0;
for (let i = 0; i < numBattles; i++) {
  const drop = rollItemDrop("common");
  if (drop) commonDrops++;
}
const commonRate = commonDrops / numBattles;
assert(commonRate >= 0.25 && commonRate <= 0.35);  // ~30%
```

**Time Estimate:** 4 hours

**Dependencies:** Task 1, Task 11

---

## TASK 14: Implement Critical Hit System

**Objective:** Add critical hits with 2x damage

**Requirements:**
- Base crit chance: 5%
- SPD bonus: +0.2% per SPD point
- Crits deal 2x damage
- Visual/audio feedback for crits

**Acceptance Criteria:**
- [x] Crits occur at correct rate
- [x] Crits deal 2x damage
- [x] SPD increases crit chance
- [x] Crit indicator shown in battle log

**Context-Aware Test:**
```typescript
const isaac = new Unit("isaac", 5);  // SPD 16
const enemy = new Enemy("Goblin", 3);

// Crit chance: 0.05 + (16 * 0.002) = 0.082 = 8.2%

let crits = 0;
let attacks = 1000;

for (let i = 0; i < attacks; i++) {
  const isCrit = checkCriticalHit(isaac);
  if (isCrit) crits++;
}

const critRate = crits / attacks;
assert(critRate >= 0.07 && critRate <= 0.09);  // ~8.2%

// Crit damage
const normalDmg = calculatePhysicalDamage(isaac, enemy, {});
const critDmg = calculatePhysicalDamage(isaac, enemy, {}, true);  // isCrit = true

assert(critDmg >= normalDmg * 1.9 && critDmg <= normalDmg * 2.1);
```

**Time Estimate:** 2 hours

**Dependencies:** Task 12

---

## TASK 15: Implement Flee System

**Objective:** Allow player to flee from non-boss battles

**Requirements:**
- Base flee chance: 50%
- Modified by SPD ratio (player avg vs enemy avg)
- Cannot flee from bosses or recruitment battles
- Failed flee costs a turn

**Acceptance Criteria:**
- [x] Can attempt to flee
- [x] Flee chance based on SPD
- [x] Cannot flee from bosses
- [x] Failed flee wastes turn
- [x] Successful flee ends battle

**Context-Aware Test:**
```typescript
const fastParty = [new Unit("felix", 5)];  // SPD 30
const slowEnemy = new Enemy("Goblin", 3);  // SPD 12

const battle = new Battle(fastParty, [slowEnemy]);
const fleeChance = battle.calculateFleeChance();

// Speed ratio: 30 / 12 = 2.5
// Flee chance: 0.5 * 2.5 = 1.25 → clamped to 0.9 (90%)
assert(fleeChance === 0.9);

// Boss battle - cannot flee
const bossBattle = new Battle(fastParty, [new Enemy("Nox Typhon", 10, true)]);
const canFlee = bossBattle.canFlee();
assert(canFlee === false);

// Test actual flee attempts
let successes = 0;
for (let i = 0; i < 100; i++) {
  const fled = battle.attemptFlee();
  if (fled) successes++;
  battle.reset();
}
const successRate = successes / 100;
assert(successRate >= 0.85 && successRate <= 0.95);  // ~90%
```

**Time Estimate:** 3 hours

**Dependencies:** Task 11

---

## TASK 16: Implement Equipment Inventory

**Objective:** Store, filter, and display equipment items

**Requirements:**
- Store all owned equipment
- Filter by type (weapons, armor, helms, boots)
- Sort by stats (ATK, DEF, etc.)
- Show stat comparison in Equipment Screen
- Equipment can be equipped by compatible units

**Acceptance Criteria:**
- [x] Can add items to inventory
- [x] Can filter by equipment type
- [x] Can sort by stat bonuses
- [x] Equipment Screen shows correct items
- [x] Stat comparison displays correctly

**Context-Aware Test:**
```typescript
const inventory = new Inventory();

// Add equipment
inventory.addItem(WEAPONS.iron);
inventory.addItem(WEAPONS.steel);
inventory.addItem(ARMOR.iron);
inventory.addItem(HELMS.basic);

// Filter weapons
const weapons = inventory.filter("weapon");
assert(weapons.length === 2);
assert(weapons.includes(WEAPONS.iron));
assert(weapons.includes(WEAPONS.steel));

// Sort weapons by ATK
const sortedWeapons = inventory.sort("weapon", "atk");
assert(sortedWeapons[0] === WEAPONS.steel);  // +20 ATK (highest)
assert(sortedWeapons[1] === WEAPONS.iron);   // +12 ATK

// Stat comparison
const isaac = new Unit("isaac", 5);
const comparison = inventory.compareEquipment(isaac, WEAPONS.steel);

assert(comparison.current.atk === 27);  // No weapon equipped
assert(comparison.new.atk === 47);      // +20 from Steel Sword
assert(comparison.diff.atk === +20);    // Green (increase)
```

**Time Estimate:** 4 hours

**Dependencies:** Task 1, Task 5

---

## TASK 17: Implement Djinn Collection

**Objective:** Track collected Djinn, allow equipping to units

**Requirements:**
- Store all 12 Djinn with unlock flags
- Filter by element
- Show Djinn details (tier, abilities, lore)
- Equip/unequip Djinn to units
- Display current synergy bonuses

**Acceptance Criteria:**
- [x] Can collect Djinn
- [x] Can filter by element
- [x] Can equip Djinn to units
- [x] Synergy bonuses display correctly
- [x] Cannot equip more than 3 Djinn per unit

**Context-Aware Test:**
```typescript
const djinnCollection = new DjinnCollection();

// Collect Venus Djinn
djinnCollection.unlock("flint");
djinnCollection.unlock("granite");
djinnCollection.unlock("bane");

assert(djinnCollection.total === 3);
assert(djinnCollection.getByElement("Venus").length === 3);

// Equip to Isaac
const isaac = new Unit("isaac", 5);
djinnCollection.equipToUnit(isaac, "flint");
djinnCollection.equipToUnit(isaac, "granite");
djinnCollection.equipToUnit(isaac, "bane");

assert(isaac.djinn.length === 3);

// Try to equip 4th - should fail
const result = djinnCollection.equipToUnit(isaac, "forge");
assert(result === false);

// Display synergy
const synergy = djinnCollection.getSynergy(isaac);
assert(synergy.atk === 12);
assert(synergy.def === 8);
assert(synergy.class === "Venus Adept");
```

**Time Estimate:** 4 hours

**Dependencies:** Task 1, Task 7

---

## TASK 18: Implement Status Effects

**Objective:** Apply buffs/debuffs, track duration, remove on expiration

**Requirements:**
- Status types: buff, debuff, poison, burn, freeze, paralyze
- Each has duration (number of turns)
- Buffs multiply stats (e.g., +25% ATK)
- Debuffs reduce stats
- DoT (damage over time) for poison/burn
- Remove expired effects automatically

**Acceptance Criteria:**
- [x] Can apply status effects
- [x] Effects modify stats correctly
- [x] DoT deals damage each turn
- [x] Effects expire after duration
- [x] Multiple effects stack

**Context-Aware Test:**
```typescript
const isaac = new Unit("isaac", 5);
const baseAtk = isaac.stats.atk;  // 27

// Apply Blessing (+25% ATK, +25% DEF, 3 turns)
applyStatus(isaac, {
  type: "buff",
  stat: "atk",
  modifier: 1.25,
  duration: 3
});

assert(isaac.stats.atk === 34);  // 27 * 1.25 = 33.75 → 34

// Advance turn
advanceTurn(isaac);
assert(isaac.activeStatuses[0].duration === 2);  // 3 → 2

// Advance 2 more turns
advanceTurn(isaac);
advanceTurn(isaac);
assert(isaac.activeStatuses.length === 0);  // Expired
assert(isaac.stats.atk === 27);  // Back to base

// DoT effect (burn)
applyStatus(isaac, {
  type: "burn",
  damagePerTurn: 10,
  duration: 3
});

isaac.currentHp = 100;
advanceTurn(isaac);
assert(isaac.currentHp === 90);  // -10 from burn
advanceTurn(isaac);
assert(isaac.currentHp === 80);  // -10 again
```

**Time Estimate:** 5 hours

**Dependencies:** Task 1, Task 11

---

## TASK 19: Implement Battle Transitions

**Objective:** Smoothly transition from overworld to battle with swirl animation

**Requirements:**
- Capture overworld snapshot
- Play swirl animation (CSS from mockup)
- Fade to black
- Load battle scene
- Trigger battle start
- Duration: ~2.3 seconds

**Acceptance Criteria:**
- [x] Animation plays smoothly
- [x] Overworld freezes during transition
- [x] Battle scene loads correctly
- [x] Reduced motion support works
- [x] Can be skipped (hold button)

**Context-Aware Test:**
```typescript
const game = new GameState();
game.currentScene = "overworld";

// Trigger encounter
const encounter = new Encounter([new Enemy("Goblin", 3)]);
game.startBattleTransition(encounter);

// During transition
assert(game.currentScene === "transition");
assert(game.inputEnabled === false);  // Frozen

// Wait 2.3 seconds
await sleep(2300);

assert(game.currentScene === "battle");
assert(game.inputEnabled === true);
assert(game.currentBattle !== null);
```

**Time Estimate:** 3 hours

**Dependencies:** None (uses CSS from mockup)

---

## TASK 20: Implement Rewards Screen

**Objective:** Display XP, gold, items, recruitment, level-ups after battle

**Requirements:**
- Show all rewards from GAME_MECHANICS.md Section 4
- Animate rewards appearing (staggered)
- Display recruitment announcement (conditional)
- Display level-up notifications (conditional)
- Continue button proceeds to next scene

**Acceptance Criteria:**
- [x] All rewards display correctly
- [x] Animations play smoothly
- [x] Recruitment shows when applicable
- [x] Level-ups show when applicable
- [x] Continue button works

**Context-Aware Test:**
```typescript
const battle = new Battle(playerParty, [enemy]);
battle.playerWins();

const rewards = battle.calculateRewards();
rewards.xp = 64;
rewards.gold = 70;
rewards.items = [ITEMS.herb];
rewards.levelUps = [{ unit: "isaac", oldLevel: 4, newLevel: 5 }];
rewards.recruitment = null;

const screen = new RewardsScreen(rewards);

// Check display
assert(screen.displayedXP === 64);
assert(screen.displayedGold === 70);
assert(screen.displayedItems.length === 1);
assert(screen.displayedLevelUps.length === 1);
assert(screen.displayedRecruitment === null);

// Click continue
screen.clickContinue();
assert(game.currentScene === "overworld");
```

**Time Estimate:** 4 hours

**Dependencies:** Task 13, CSS from mockup

---

## TASK 21: Implement Unit Collection Screen

**Objective:** Display all 10 units, manage active party, view details

**Requirements:**
- Show all collected units in 5×2 grid
- Highlight active party (4 units) with gold borders
- Click unit to view stats panel
- Add/Remove from party buttons
- Navigate to Equipment Screen

**Acceptance Criteria:**
- [x] All units display correctly
- [x] Active party highlighted
- [x] Stats panel updates on selection
- [x] Can add/remove from party
- [x] Equipment navigation works

**Context-Aware Test:**
```typescript
const game = new GameState();
game.recruitUnit("isaac", 5);
game.recruitUnit("garet", 5);
game.recruitUnit("ivan", 5);
game.recruitUnit("mia", 5);
game.addToParty("isaac");
game.addToParty("garet");
game.addToParty("ivan");
game.addToParty("mia");

const screen = new UnitCollectionScreen(game);

// Check display
assert(screen.displayedUnits.length === 4);
assert(screen.activeParty.length === 4);

// Select Isaac
screen.selectUnit("isaac");
assert(screen.statsPanel.unit === "isaac");
assert(screen.statsPanel.hp === 180);
assert(screen.statsPanel.atk === 27);

// Remove Isaac from party
screen.removeFromParty("isaac");
assert(game.activeParty.length === 3);
assert(!game.activeParty.includes("isaac"));

// Add Isaac back
screen.addToParty("isaac");
assert(game.activeParty.length === 4);
assert(game.activeParty.includes("isaac"));
```

**Time Estimate:** 5 hours

**Dependencies:** Task 6, CSS from mockup

---

## TASK 22: Implement Equipment Screen

**Objective:** Manage equipment for all units, view stat changes

**Requirements:**
- Show unit selector (all collected units)
- Display 4 equipment slots (weapon, armor, helm, boots)
- Show stat comparison (current → new)
- Scrollable inventory of available equipment
- Click to equip/unequip

**Acceptance Criteria:**
- [x] Unit selector works
- [x] Equipment slots display correctly
- [x] Stat comparison accurate
- [x] Can equip items from inventory
- [x] Can unequip items

**Context-Aware Test:**
```typescript
const game = new GameState();
const isaac = game.getUnit("isaac");
game.inventory.addItem(WEAPONS.iron);

const screen = new EquipmentScreen(game);

// Select Isaac
screen.selectUnit("isaac");
assert(screen.selectedUnit === "isaac");
assert(screen.equippedWeapon === null);

// Equip Iron Sword
screen.equipItem("weapon", WEAPONS.iron);
assert(isaac.equipment.weapon === WEAPONS.iron);

// Check stat comparison
const comparison = screen.getStatComparison();
assert(comparison.atk.current === 27);
assert(comparison.atk.new === 39);
assert(comparison.atk.diff === +12);
assert(comparison.atk.color === "green");

// Unequip
screen.unequipItem("weapon");
assert(isaac.equipment.weapon === null);
assert(game.inventory.has(WEAPONS.iron));  // Back in inventory
```

**Time Estimate:** 5 hours

**Dependencies:** Task 5, Task 16, CSS from mockup

---

## TASK 23: Integrate React Components

**Objective:** Convert all HTML mockups to React components

**Requirements:**
- EquipmentScreen.tsx
- BattleTransition.tsx
- UnitCollectionScreen.tsx
- RewardsScreen.tsx
- Use TypeScript interfaces for props
- Connect to game state management (Redux/Context)

**Acceptance Criteria:**
- [x] All screens converted to React
- [x] Props properly typed
- [x] State management connected
- [x] No UI regressions from mockups
- [x] All interactions work

**Context-Aware Test:**
```typescript
// React Testing Library
import { render, screen } from '@testing-library/react';
import { EquipmentScreen } from './EquipmentScreen';

const game = new GameState();
game.recruitUnit("isaac", 5);

render(<EquipmentScreen game={game} />);

// Check rendering
expect(screen.getByText("EQUIPMENT")).toBeInTheDocument();
expect(screen.getByText("Isaac")).toBeInTheDocument();

// Click unit
fireEvent.click(screen.getByText("Isaac"));
expect(screen.getByText("HP: 180")).toBeInTheDocument();
```

**Time Estimate:** 12 hours

**Dependencies:** All UI tasks (19-22)

---

## TASK 24: Implement Random Encounters

**Objective:** Trigger battles randomly while walking in overworld

**Requirements:**
- Encounter chance per step (configurable, default 5%)
- Different encounter tables per area
- Scale enemy level to party average
- Trigger battle transition on encounter

**Acceptance Criteria:**
- [x] Encounters trigger randomly
- [x] Encounter rate configurable
- [x] Enemies scale to party level
- [x] Battle transition plays
- [x] Can flee from random encounters

**Context-Aware Test:**
```typescript
const game = new GameState();
game.currentArea = "Vale Outskirts";
game.encounterRate = 0.05;  // 5%

let encounters = 0;
for (let i = 0; i < 1000; i++) {
  game.takeStep();
  if (game.currentScene === "battle") encounters++;
  game.currentScene = "overworld";  // Reset
}

const encounterRate = encounters / 1000;
assert(encounterRate >= 0.04 && encounterRate <= 0.06);  // ~5%

// Check enemy scaling
const partyAvgLevel = game.getAveragePartyLevel();  // e.g., 5
game.triggerRandomEncounter();

const enemy = game.currentBattle.enemies[0];
assert(enemy.level >= partyAvgLevel - 1);  // Within 1 level
assert(enemy.level <= partyAvgLevel + 1);
```

**Time Estimate:** 4 hours

**Dependencies:** Task 11, Task 19

---

## TASK 25: Implement Boss Battles

**Objective:** Special battles with unique enemies, no fleeing

**Requirements:**
- Boss enemies have higher stats
- Multi-phase battles (e.g., Nox Typhon)
- Cannot flee
- Special rewards (guaranteed rare drops)
- Story flags set on victory

**Acceptance Criteria:**
- [x] Boss stats match design
- [x] Cannot flee from boss
- [x] Phase transitions work
- [x] Guaranteed drops work
- [x] Story flags set correctly

**Context-Aware Test:**
```typescript
const game = new GameState();
const noxTyphon = new Enemy("Nox Typhon", 10, true);  // isBoss = true

const battle = new Battle(playerParty, [noxTyphon]);

// Cannot flee
assert(battle.canFlee() === false);

// High stats
assert(noxTyphon.maxHp >= 1000);  // Much higher than regular enemies

// Phase transition at 50% HP
noxTyphon.currentHp = noxTyphon.maxHp * 0.5;
battle.checkPhaseTransition();

assert(battle.currentPhase === 2);
assert(noxTyphon.attackPower > noxTyphon.baseAttackPower);  // Powered up

// Victory sets flag
battle.playerWins();
assert(game.getFlag("defeated_nox_typhon") === true);

// Guaranteed rare drop
const rewards = battle.calculateRewards();
assert(rewards.items.length > 0);
assert(rewards.items.some(item => item.rarity === "rare"));
```

**Time Estimate:** 6 hours

**Dependencies:** Task 11, Task 13

---

## SUMMARY

**Total Tasks:** 25
**Estimated Time:** 116 hours (~3 weeks for 1 developer)

**Critical Path:**
1. Task 1 (Data Models) → Task 2 (Stats) → Task 3 (Leveling)
2. Task 11 (Battle Turn) → Task 12 (Damage) → Task 13 (Rewards)
3. Task 23 (React Integration) - Requires all UI tasks complete

**Parallelizable:**
- Tasks 4, 5, 6, 7, 8 (independent systems)
- Tasks 16, 17, 18 (inventory systems)
- Tasks 19, 20, 21, 22 (UI screens)

**Next Document:** TEST_SCENARIOS.md (30+ context-aware tests)
>>>>>>> da011dae5a42c00b1fdb0e0f62b8f00e0a566dcf
