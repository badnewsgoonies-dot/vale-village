# Queue-Based Battle System - Complete Design Plan

## System Overview

### Core Mechanic Flow
```
PLANNING PHASE
├─ Select Unit 1 action (mana deducted from pool)
├─ Select Unit 2 action (mana deducted from pool)
├─ Select Unit 3 action (mana deducted from pool)
├─ Select Unit 4 action (mana deducted from pool)
├─ [Optional] Activate Djinn at any point
└─ Click EXECUTE when all 4 actions queued

EXECUTION PHASE
├─ Djinn summons execute FIRST (if activated)
├─ Player queued actions execute (SPD order)
├─ Enemy actions execute (SPD order)
├─ Check victory/defeat
└─ Return to PLANNING PHASE (mana refreshes, Djinn may recover)
```

---

## 1. MANA CIRCLE SYSTEM

### Mechanics
- **Team-wide pool:** Sum of all 4 units' manaContribution
  - Example: Isaac(+2) + Garet(+1) + Ivan(+3) + Mia(+2) = **8 total**
- **Refreshes EVERY turn:** Full pool available at start of planning
- **Deducts during planning:** As you queue actions, mana circles are spent
- **Validates before execute:** Can't execute if over budget

### Ability Costs
```
0○ - Basic attacks (always free)
1○ - Weak spells (Fireball, Ply, Gust)
2○ - Medium spells (Clay Spire, Volcano, Blessing)
3○ - Strong spells (Ragnarok, Wish, Thunderclap)
4○ - Ultimate spells (Judgment, Pyroclasm, Tempest)
5○ - Legendary (Glacial Blessing)
```

### UI Display
- **Top bar:** `MANA: ●●●●●●○○○○ 6/10`
  - Filled circles = available
  - Empty circles = spent
- **Ability menu:** Each ability shows cost `[2○]`
  - Red if can't afford
  - Grayed out if insufficient PP or mana

---

## 2. DJINN SYSTEM INTEGRATION

### Current Djinn Mechanics (from docs)
- **Team has 3 Djinn slots** (global, not per-unit)
- **Passive bonuses** apply to ALL 4 units
  - Example: 3 Venus Djinn = +12 ATK, +8 DEF to entire party
- **Activation:**
  - Requirement: Unit dealt/taken 30+ damage
  - Effect: Burst damage/heal/buff
  - Penalty: Lose passive for 2 turns (affects ALL units)
  - Recovery: After 2 turns, returns to Set state

### Battle UI Design for Djinn

**Option A: Separate Djinn Panel (Right Side)**
```
┌─ DJINN (Team) ──────┐
│ Flint    [Set]   ✓  │ ← Can activate
│ Granite  [Set]   ✓  │
│ Bane     [CD:1]  ✗  │ ← Cooling down
└─────────────────────┘
```
- Always visible
- Click to activate during planning
- Shows state (Set/Standby/Recovery)
- Shows turns until recovery

**Option B: Djinn Button in Command Menu**
```
Commands:
┌─ ATTACK     [0○] ─┐
│  ABILITIES        │
│  DJINN            │ ← Opens Djinn submenu
│  DEFEND           │
└───────────────────┘
```
- Part of normal action flow
- Opens Djinn menu showing team's 3 Djinn
- Can activate as unit's action

**Option C: Global Djinn Bar (Top)**
```
MANA: ●●●●○○○○ 4/8  |  DJINN: Flint[Set] Granite[Set] Bane[CD:1]
                         ↑ Click to activate
```
- Always visible at top
- Independent of unit actions
- Can activate multiple Djinn in one turn

### Recommended: **Option C** (Global Djinn Bar)

**Why:**
- Djinn are TEAM resources (not unit-specific)
- Activation should be independent of unit actions
- Matches the "separate button" old design idea
- Always visible, no menu diving
- Can activate at ANY point during planning

### Djinn Activation & Summon Flow

**Activation Options:**

**1 Djinn (Individual Attack):**
```
Flint activated alone
→ 80 damage attack
→ Flint → Standby (loses portion of synergy)
→ Next turn: Flint recovers → Set
```

**2 Djinn (Medium Summon):**
```
Flint + Granite activated together
→ Medium summon (e.g., Rampart - 150 damage)
→ Both → Standby (lose 2/3 synergy)
→ Turn +1: First chosen Djinn recovers
→ Turn +2: Second chosen Djinn recovers
```

**3 Djinn (Mega Summon):**
```
Flint + Granite + Bane activated together
→ Mega summon (e.g., Judgment - 300 damage to all)
→ All 3 → Standby (lose ALL synergy - 0 Djinn state)
→ Turn +1: First chosen Djinn recovers (1/3 synergy back)
→ Turn +2: Second chosen Djinn recovers (2/3 synergy back)
→ Turn +3: Third chosen Djinn recovers (FULL synergy restored)
```

**Example Timeline:**
```
Turn 1: Mega summon (all 3 Djinn used)
  - Judgment: 300 damage to all enemies
  - ALL 3 → Standby
  - Team bonuses: +0 ATK, +0 DEF (ZERO state)
  - No unlocked abilities

Turn 2: Choose recovery order
  - You select: Flint recovers first
  - Flint → Set
  - Team bonuses: +4 ATK, +3 DEF (1 Djinn)
  - Granite, Bane still Standby

Turn 3:
  - You select: Granite recovers next
  - Granite → Set
  - Team bonuses: +8 ATK, +5 DEF (2 Djinn)
  - Bane still Standby

Turn 4:
  - Bane recovers automatically
  - Bane → Set
  - Team bonuses: +12 ATK, +8 DEF (FULL 3 Djinn)
  - Unlocked abilities restored
```

**Penalty Mechanics:**
- **While in Standby:** Djinn does NOT contribute to team synergy
- **Example:** 3 Venus Djinn give +12 ATK, +8 DEF, "Earthquake" ability
  - Activate all 3 for mega summon
  - Team immediately has: +0 ATK, +0 DEF, NO "Earthquake"
  - As each recovers, bonuses gradually return

### Djinn Mana Cost
**DECISION: FREE (0○)**
- Djinn penalty (synergy loss) is already significant
- Encourages strategic Djinn use
- Mana reserved for abilities only

---

## 3. QUEUE-BASED BATTLE FLOW

### Planning Phase UI Layout

```
┌────────────────────────────────────────────────────────────┐
│  HP/PP Status Bar (Top)                                    │
├────────────────────────────────────────────────────────────┤
│  MANA: ●●●●●●●○○○ 7/10  |  DJINN: [Flint] [Granite] [Bane]│
├────────────────────────────────────────────────────────────┤
│                                                            │
│  [Enemy Sprites - NO HP BARS]                              │
│                                                            │
├────────────────────────────────────────────────────────────┤
│  [Party Sprites]                                           │
│   Isaac  Garet  Ivan  Mia                                  │
├────────────────────────────────────────────────────────────┤
│ ACTION QUEUE (40%)        │  COMMANDS (60%)                │
│                           │                                │
│ 1. Isaac: Meteor [4○]     │  Current: Isaac                │
│    → Wolf                 │  ┌─ ATTACK [0○]               │
│                           │  │  ABILITIES                  │
│ 2. Garet: ????            │  │  DEFEND                     │
│ 3. Ivan: ????             │  └────────────────             │
│ 4. Mia: ????              │                                │
│                           │  Remaining Mana: 3/10          │
│ [EXECUTE] (grayed)        │  [CLEAR QUEUE]                 │
└────────────────────────────────────────────────────────────┘
```

### Execution Phase UI Layout

```
┌────────────────────────────────────────────────────────────┐
│  HP/PP Status Bar                                          │
├────────────────────────────────────────────────────────────┤
│  MANA: ●●●●●●●●●● 10/10 (REFRESHED!)                       │
├────────────────────────────────────────────────────────────┤
│  [Enemy Sprites with floating damage numbers]              │
│       -78!        -45!         -52!                        │
├────────────────────────────────────────────────────────────┤
│  [Party Sprites]                                           │
├────────────────────────────────────────────────────────────┤
│                COMBAT LOG (100% width)                     │
│                                                            │
│  Turn 3 - Execution Phase                                  │
│  ──────────────────────────────────────                    │
│  → Isaac casts METEOR on Wolf! Wolf takes 78 damage!       │
│  → Garet attacks Skeleton! Skeleton takes 34 damage!       │
│  → Ivan casts PLASMA on all! Mage -45, Wolf -32, Lizard -52│
│  → Mia casts CURE on Isaac! Isaac recovers 25 HP!          │
│                                                            │
│  [Enemy Turn]                                              │
│  → Mage casts Fireball on Isaac! Isaac takes 18 damage!    │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

---

## 4. CRITICAL REQUIREMENTS

### User Requirements
- ✅ **NO turn order display** anywhere
- ✅ **NO enemy HP bars** (hidden info)
- ✅ **Queue all 4 actions** before execution
- ✅ **Mana system** with team pool
- ✅ **Damage numbers** as only enemy HP feedback

### Djinn Requirements
- ✅ **3 team slots** (global)
- ✅ **Passive bonuses** to all units
- ✅ **Activation** during planning
- ✅ **Penalty** when activated (lose passive 2 turns)
- ✅ **Separate from unit actions** (can activate independent of queue)

---

## 5. EXECUTION ORDER

### Question: How to order queued actions?

**Option A: Queue Order (1→2→3→4)**
- Pro: Player knows exact sequence
- Pro: Simple to understand
- Con: Ignores SPD stat

**Option B: SPD Order (Fastest→Slowest)**
- Pro: SPD matters
- Pro: More tactical (fast units go first)
- Con: Player doesn't control order

**Option C: Hybrid (Djinn first, then SPD order)**
- Pro: Best of both
- Pro: Djinn activations always first
- Con: Slightly more complex

**Recommendation: Option C**
```
1. Djinn activations (if any)
2. Player actions (SPD order)
3. Enemy actions (SPD order)
```

---

## 6. STATE MACHINE

```typescript
type BattlePhase =
  | 'planning'      // Queue actions for 4 units
  | 'executing'     // Play all actions
  | 'victory'       // Battle won
  | 'defeat';       // Battle lost

interface BattleState {
  phase: BattlePhase;

  // Planning phase
  currentQueueIndex: number;           // Which unit we're selecting for (0-3)
  queuedActions: QueuedAction[];       // All 4 actions
  queuedDjinn: string[];               // Djinn marked for activation
  remainingMana: number;               // Mana left in pool

  // Execution phase
  executionIndex: number;              // Which action is executing
  combatLog: string[];                 // Battle messages

  // Round tracking
  roundNumber: number;                 // Current round
  djinnRecoveryTimers: Map<string, number>; // Djinn → turns until recovery
}
```

---

## 7. COMPONENT ARCHITECTURE

```
QueueBattleScreen (New from scratch)
├─ StatusBar (Reuse)
├─ ManaCircles (Just created)
├─ DjinnBar (New component)
├─ BattlefieldArea
│  ├─ EnemyRow (No HP bars!)
│  └─ PartyRow
└─ BottomPanel
   ├─ Planning Mode
   │  ├─ ActionQueue (New - shows 4 queued actions)
   │  └─ CommandPanel
   │     ├─ CommandMenu (Reuse)
   │     ├─ AbilityMenu (Reuse, with mana validation)
   │     └─ TargetSelector (New)
   └─ Execution Mode
      └─ CombatLog (Reuse, full width)
```

---

## 8. IMPLEMENTATION CHECKLIST

### Phase 1: Core Queue System
- [ ] Create QueueBattleScreen.tsx
- [ ] Implement planning state (queue 4 actions)
- [ ] Implement mana deduction during planning
- [ ] Implement execution state (play queue)
- [ ] Mana refresh after round

### Phase 2: Djinn Integration
- [ ] Create DjinnBar component
- [ ] Djinn activation during planning
- [ ] Djinn execute first in execution
- [ ] Passive bonus loss/recovery tracking
- [ ] Visual feedback for synergy changes

### Phase 3: UI Polish
- [ ] Floating damage numbers
- [ ] Target selection highlights
- [ ] Action queue display
- [ ] Execution animations
- [ ] Mobile optimization

### Phase 4: Edge Cases
- [ ] Unit KO'd before action executes
- [ ] Cancel/edit queued actions
- [ ] Over-budget validation
- [ ] Enemy AI (random abilities)
- [ ] Victory/defeat screens

---

## 9. DESIGN DECISIONS (ANSWERED)

1. **Action execution order?**
   - ✅ **SPD ORDER** (fastest → slowest)
   - Equipment provides SPD, allowing tactical party building
   - Order: Djinn summons → Player actions (SPD) → Enemy actions (SPD)

2. **Djinn mana cost?**
   - ✅ **FREE (0○)**
   - Penalty (synergy loss) is already significant
   - Losing stats/abilities is enough cost

3. **Can you edit queue?**
   - ✅ **YES** - Back button goes to previous unit
   - Can change any queued action before executing

4. **What if you queue invalid action?**
   - Target dies before execution?
   - **Implementation: Auto-retarget random alive enemy** (or skip if all-ally heal)

5. **Multiple Djinn activations per turn?**
   - ✅ **YES** - Can use 1, 2, or 3 Djinn together
   - 1 Djinn = Individual attack (80 dmg)
   - 2 Djinn = Medium summon (150 dmg)
   - 3 Djinn = Mega summon (300 dmg to all)
   - Using all 3 = ZERO team bonuses until recovery

6. **Djinn recovery order?**
   - ✅ **PLAYER CHOOSES** - Select which Djinn recovers first
   - Allows strategic timing of synergy restoration

---

## 10. KEY DIFFERENCES FROM OLD SYSTEM

| Old System | New Queue System |
|------------|------------------|
| Sequential turns | Queue all 4 actions first |
| Turn order visible | NO turn order display |
| Individual PP pools | Team mana pool |
| Per-unit Djinn | Team Djinn (3 global slots) |
| Enemy HP shown | Enemy HP HIDDEN |
| Execute immediately | Execute after planning |
| PP carries over | Mana refreshes each turn |

---

**Ready to build! 🚀**
