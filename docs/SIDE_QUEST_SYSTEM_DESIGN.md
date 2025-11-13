# Side Quest System Design
**Date:** 2025-11-13
**Status:** Prototype Design
**Purpose:** Break up linear progression with optional exploration and player choice

---

## 🎯 **DESIGN PHILOSOPHY**

**Problem:** 45 linear house battles creates repetition fatigue:
- Walk to house → battle → dialogue → repeat
- No player agency (must do all battles)
- No exploration or secrets
- Monotonous pacing

**Solution:** Mix main path with optional side content:
- **Main Path:** 12 required story battles (linear)
- **Side Quests:** 5 optional quests (exploration, secrets)
- **Secret Bosses:** 3 hidden challenges (high risk/reward)
- **Exploration Areas:** Hidden zones with lore and treasure

**Benefits:**
- Player choice (side content is optional)
- Pacing variety (not just house battles)
- Replay value (secrets to discover)
- Build diversity (side quests reward different playstyles)

---

## 🗺️ **MAP STRUCTURE TEMPLATE**

### **Chapter 2 Map Layout**

```
┌─────────────────────────────────────────────────┐
│          SHADOW FORTRESS REGION                 │
│                                                 │
│  🏠 Main Path (Linear, 12 Houses)               │
│  ├─ House 1 → House 2 → House 3 → House 4      │
│  │   (Story battles, required)                 │
│  │                                              │
│  │  🔹 Side Branch A (Optional)                │
│  │  └─ "The Lost Shrine" quest                 │
│  │      ├─ Explore ancient ruins               │
│  │      ├─ Defeat guardian boss                │
│  │      └─ Reward: Rare Venus Djinn evolution │
│  │                                              │
│  ├─ House 5 → House 6 → House 7                │
│  │                                              │
│  │  🔹 Side Branch B (Optional)                │
│  │  └─ "Bandit Camp" quest                     │
│  │      ├─ Track bandits to hideout            │
│  │      ├─ 3-wave battle encounter             │
│  │      └─ Reward: Gold + Equipment            │
│  │                                              │
│  ├─ House 8 → House 9 → House 10               │
│  │                                              │
│  │  🌟 Secret Area C (Hidden)                  │
│  │  └─ "Crystal Cave" (requires Ice ability)   │
│  │      ├─ Puzzle: Freeze 3 pillars            │
│  │      ├─ Secret boss: Frost Golem            │
│  │      └─ Reward: Master's Crest (promotion)  │
│  │                                              │
│  └─ House 11 → House 12 → BOSS FIGHT           │
│                                                 │
│  📍 Player sees branching paths:                │
│     "Continue main path? Or explore ruins?"    │
└─────────────────────────────────────────────────┘
```

### **Design Principles**

1. **Optional Branches Visible** - Player sees choice (explore or continue)
2. **Rewards Scale to Effort** - Harder side content = better rewards
3. **No Forced Completion** - Can beat chapter without side content
4. **Secrets Require Discovery** - Hidden areas need exploration/abilities

---

## 📐 **TYPESCRIPT TYPES**

### **Side Quest Schema**

```typescript
import { z } from 'zod';

/**
 * Quest types define the structure and objectives
 */
export const QuestTypeSchema = z.enum([
  'exploration',    // Find hidden area
  'combat',         // Defeat specific enemies
  'collection',     // Gather items
  'puzzle',         // Solve environmental puzzle
  'boss',           // Challenge boss fight
]);
export type QuestType = z.infer<typeof QuestTypeSchema>;

/**
 * Quest status tracks player progress
 */
export const QuestStatusSchema = z.enum([
  'locked',        // Requirements not met
  'available',     // Can start quest
  'in_progress',   // Quest started
  'completed',     // Quest finished
  'failed',        // Quest failed (optional)
]);
export type QuestStatus = z.infer<typeof QuestStatusSchema>;

/**
 * Quest objective defines a single task
 */
export const QuestObjectiveSchema = z.object({
  /** Objective ID */
  id: z.string(),

  /** Description shown to player */
  description: z.string(),

  /** Type of objective */
  type: z.enum(['explore', 'defeat', 'collect', 'interact', 'solve']),

  /** Target (e.g., enemy ID, item ID, location ID) */
  target: z.string(),

  /** Current progress (e.g., 2/5 enemies defeated) */
  current: z.number().min(0).default(0),

  /** Required amount (e.g., defeat 5 enemies) */
  required: z.number().positive(),

  /** Is objective completed? */
  completed: z.boolean().default(false),
});
export type QuestObjective = z.infer<typeof QuestObjectiveSchema>;

/**
 * Quest reward defines what player receives
 */
export const QuestRewardSchema = z.object({
  /** Reward type */
  type: z.enum(['gold', 'item', 'equipment', 'djinn', 'xp']),

  /** Item/equipment ID (if applicable) */
  itemId: z.string().optional(),

  /** Amount (gold/XP value or quantity) */
  amount: z.number().positive(),

  /** Reward description */
  description: z.string(),
});
export type QuestReward = z.infer<typeof QuestRewardSchema>;

/**
 * Side quest definition
 */
export const SideQuestSchema = z.object({
  /** Quest ID (e.g., "lost-shrine-quest") */
  id: z.string(),

  /** Quest name shown to player */
  name: z.string(),

  /** Quest type */
  type: QuestTypeSchema,

  /** Chapter this quest appears in */
  chapter: z.number().positive(),

  /** Requirements to unlock quest */
  requirements: z.object({
    /** Story flags required */
    storyFlags: z.array(z.string()).default([]),

    /** Minimum level required */
    minLevel: z.number().min(1).optional(),

    /** Abilities required (e.g., "ice-shard" to freeze pillars) */
    abilitiesRequired: z.array(z.string()).default([]),

    /** Items required in inventory */
    itemsRequired: z.array(z.string()).default([]),
  }),

  /** Quest objectives (tasks to complete) */
  objectives: z.array(QuestObjectiveSchema),

  /** Rewards for completing quest */
  rewards: z.array(QuestRewardSchema),

  /** Recommended level for this quest */
  recommendedLevel: z.number().min(1).max(20),

  /** Difficulty rating (1-5 stars) */
  difficulty: z.number().min(1).max(5),

  /** Quest description/lore */
  description: z.string(),

  /** Dialogue tree ID for quest NPCs */
  dialogueId: z.string().optional(),

  /** Map location where quest starts */
  location: z.object({
    mapId: z.string(),
    position: z.object({
      x: z.number(),
      y: z.number(),
    }),
  }),

  /** Is this a secret quest (hidden until discovered)? */
  isSecret: z.boolean().default(false),
});
export type SideQuest = z.infer<typeof SideQuestSchema>;
```

---

## 🌟 **PROTOTYPE: "THE LOST SHRINE" (EXPLORATION QUEST)**

### **Quest Design**

```typescript
export const LOST_SHRINE_QUEST: SideQuest = {
  id: 'lost-shrine-quest',
  name: 'The Lost Shrine',
  type: 'exploration',
  chapter: 2,

  requirements: {
    storyFlags: ['reached_shadow_fortress_region'], // Unlocks after House 3
    minLevel: 8,
    abilitiesRequired: [], // No special abilities needed
    itemsRequired: [],
  },

  objectives: [
    {
      id: 'find-shrine-entrance',
      description: 'Find the hidden shrine entrance',
      type: 'explore',
      target: 'shrine-entrance-trigger',
      current: 0,
      required: 1,
      completed: false,
    },
    {
      id: 'activate-3-pillars',
      description: 'Activate the three ancient pillars (0/3)',
      type: 'interact',
      target: 'shrine-pillar',
      current: 0,
      required: 3,
      completed: false,
    },
    {
      id: 'defeat-shrine-guardian',
      description: 'Defeat the Stone Guardian',
      type: 'defeat',
      target: 'stone-guardian-boss',
      current: 0,
      required: 1,
      completed: false,
    },
  ],

  rewards: [
    {
      type: 'item',
      itemId: 'promotion-seal-venus',
      amount: 1,
      description: 'Promotion Seal (Venus) - Enables class promotion',
    },
    {
      type: 'gold',
      amount: 500,
      description: '500 gold',
    },
    {
      type: 'xp',
      amount: 200,
      description: '200 XP for all party members',
    },
  ],

  recommendedLevel: 9,
  difficulty: 3, // Medium difficulty

  description: `Rumors speak of an ancient shrine hidden in the Shadow Fortress region.
  The shrine is said to hold a sacred seal that grants warriors the power to transcend
  their limits. Only those pure of heart may activate the pillars and face the guardian.`,

  dialogueId: 'lost-shrine-dialogue',

  location: {
    mapId: 'shadow-fortress-region',
    position: { x: 45, y: 22 }, // Off main path, requires exploration
  },

  isSecret: false, // Visible on map (but optional)
};
```

### **Quest Flow (In-Game)**

**Step 1: Discovery**
> *Player explores off main path*
> *Reaches position (45, 22)*
> **"You discovered: The Lost Shrine!"**
> *Quest added to quest log*

**Step 2: Exploration**
> *Player enters shrine area (new mini-map)*
> *Sees 3 glowing pillars + central altar*
> **Objective Updated: "Activate the three ancient pillars (0/3)"**

**Step 3: Puzzle Solving**
> *Player interacts with Pillar 1*
> **"The pillar glows with earth energy..."**
> *Pillar 1 activated (1/3)*

> *Repeats for Pillars 2 and 3*
> **Objective Complete: "All pillars activated!"**

**Step 4: Boss Fight**
> *Central altar opens*
> **"The Stone Guardian awakens!"**
> *Battle encounter: Stone Guardian (Lv 10, 250 HP)*

**Step 5: Rewards**
> *Boss defeated*
> **"You obtained: Promotion Seal (Venus)!"**
> **"You obtained: 500 gold!"**
> **"All party members gained 200 XP!"**
> **Quest Complete: "The Lost Shrine"**

---

## ⚔️ **PROTOTYPE: "BANDIT CAMP RAID" (COMBAT QUEST)**

### **Quest Design**

```typescript
export const BANDIT_CAMP_QUEST: SideQuest = {
  id: 'bandit-camp-raid',
  name: 'Bandit Camp Raid',
  type: 'combat',
  chapter: 2,

  requirements: {
    storyFlags: ['defeated_house_5_boss'], // Unlocks after House 5
    minLevel: 10,
    abilitiesRequired: [],
    itemsRequired: [],
  },

  objectives: [
    {
      id: 'track-bandits',
      description: 'Follow the bandit tracks to their hideout',
      type: 'explore',
      target: 'bandit-camp-location',
      current: 0,
      required: 1,
      completed: false,
    },
    {
      id: 'defeat-bandit-wave-1',
      description: 'Defeat the first wave of bandits',
      type: 'defeat',
      target: 'bandit-encounter-1',
      current: 0,
      required: 1,
      completed: false,
    },
    {
      id: 'defeat-bandit-wave-2',
      description: 'Defeat the second wave of bandits',
      type: 'defeat',
      target: 'bandit-encounter-2',
      current: 0,
      required: 1,
      completed: false,
    },
    {
      id: 'defeat-bandit-chief',
      description: 'Defeat the Bandit Chief',
      type: 'defeat',
      target: 'bandit-chief-boss',
      current: 0,
      required: 1,
      completed: false,
    },
  ],

  rewards: [
    {
      type: 'equipment',
      itemId: 'bandit-blade', // Unique weapon drop
      amount: 1,
      description: 'Bandit Blade (Weapon) - ATK +18, SPD +5',
    },
    {
      type: 'gold',
      amount: 800,
      description: '800 gold (stolen loot)',
    },
  ],

  recommendedLevel: 11,
  difficulty: 4, // Hard difficulty (3 waves + boss)

  description: `Bandits have been terrorizing the Shadow Fortress region, stealing
  from villagers and travelers. Track them to their camp and put an end to their raids.
  Be warned: they fight in coordinated waves and their chief is a master swordsman.`,

  dialogueId: 'bandit-camp-dialogue',

  location: {
    mapId: 'shadow-fortress-region',
    position: { x: 60, y: 30 }, // Hidden in forest area
  },

  isSecret: false,
};
```

### **Quest Flow**

**Step 1: Trigger**
> *NPC in House 6: "Bandits stole my gold! Please help!"*
> **Quest Added: "Bandit Camp Raid"**

**Step 2: Tracking**
> *Player follows footprints on map (visual markers)*
> *Reaches camp location*
> **"You found the bandit hideout!"**

**Step 3: Combat Waves**
> **Wave 1:** 3× Bandits (Lv 10)
> *Defeat all 3*
> **"More bandits incoming!"**

> **Wave 2:** 2× Bandits + 1× Bandit Archer (Lv 11)
> *Defeat all 3*
> **"The Bandit Chief appears!"**

> **Boss Fight:** Bandit Chief (Lv 12, 180 HP, high ATK/SPD)
> *Tactical challenge: Chief buffs allies, high crit rate*

**Step 4: Rewards**
> *Chief defeated*
> **"You obtained: Bandit Blade!"**
> **"You looted: 800 gold!"**
> **Quest Complete: "Bandit Camp Raid"**

---

## 🔐 **PROTOTYPE: "CRYSTAL CAVE" (SECRET AREA)**

### **Quest Design**

```typescript
export const CRYSTAL_CAVE_SECRET: SideQuest = {
  id: 'crystal-cave-secret',
  name: 'Crystal Cave',
  type: 'puzzle',
  chapter: 2,

  requirements: {
    storyFlags: [], // No story requirement
    minLevel: 12,
    abilitiesRequired: ['ice-shard'], // Requires ice ability to freeze pillars
    itemsRequired: [],
  },

  objectives: [
    {
      id: 'find-hidden-cave',
      description: 'Discover the hidden Crystal Cave entrance',
      type: 'explore',
      target: 'crystal-cave-entrance',
      current: 0,
      required: 1,
      completed: false,
    },
    {
      id: 'freeze-3-pillars',
      description: 'Freeze all 3 crystal pillars with ice magic (0/3)',
      type: 'solve',
      target: 'crystal-pillar',
      current: 0,
      required: 3,
      completed: false,
    },
    {
      id: 'defeat-frost-golem',
      description: 'Defeat the Frost Golem',
      type: 'defeat',
      target: 'frost-golem-boss',
      current: 0,
      required: 1,
      completed: false,
    },
  ],

  rewards: [
    {
      type: 'item',
      itemId: 'masters-crest',
      amount: 1,
      description: "Master's Crest - Enables Tier 3 class promotion",
    },
    {
      type: 'equipment',
      itemId: 'crystal-helm',
      amount: 1,
      description: 'Crystal Helm (Helmet) - DEF +15, MAG +8',
    },
  ],

  recommendedLevel: 13,
  difficulty: 5, // Very hard (secret boss)

  description: `Deep within the frozen mountains lies a cave filled with ancient crystals.
  Legend says only those who master ice magic can unlock its secrets. The cave's guardian,
  a Frost Golem, has never been defeated...`,

  location: {
    mapId: 'shadow-fortress-region',
    position: { x: 80, y: 10 }, // Far off main path, requires backtracking
  },

  isSecret: true, // NOT shown on map until discovered
};
```

### **Discovery Mechanic**

**Hidden Until Found:**
- No quest marker on map
- No NPC mentions it (pure exploration)
- Entrance is visually hidden (requires walking near it)

**Discovery Trigger:**
> *Player walks within 3 tiles of (80, 10)*
> **"⁉️ You noticed something strange..."**
> *Camera pans to reveal hidden cave entrance*
> **"You discovered a secret: Crystal Cave!"**
> *Quest added to quest log*

**Requirements Check:**
> *Player tries to enter*
> **"The cave is sealed by ancient ice magic."**
> **"You need ice abilities to proceed."**

> *Player has Ice Shard ability*
> **"Your ice magic resonates with the seal!"**
> *Cave entrance opens*

---

## 🎮 **QUEST INTEGRATION WITH MAIN STORY**

### **Chapter 2 Pacing**

```
Main Path Progress:        [========= 100% =========]
                           House 1 → 2 → 3 → ... → 12

Side Quest Unlocks:
├─ After House 3:  "Lost Shrine" unlocks
├─ After House 5:  "Bandit Camp" unlocks
├─ After House 8:  "Crystal Cave" discoverable (if have ice magic)
└─ After House 10: Final side quests unlock

Player Experience:
- House 1-3: Linear story (introduces Shadow Fortress)
- House 3: "Lost Shrine" appears → Player chooses (main path or explore?)
- House 4-5: Continue main story OR do Lost Shrine
- House 5: "Bandit Camp" appears → More choices
- House 6-12: Mix of main story + optional side content
```

### **Reward Balancing**

**Main Path Rewards:**
- Required to progress
- Moderate rewards (XP, gold, story items)
- Balanced for intended level curve

**Side Quest Rewards:**
- Optional but valuable
- High-value rewards (rare equipment, promotion items)
- Allow players to out-level main content (if they choose)

**Secret Quest Rewards:**
- Highest difficulty = best rewards
- Unique items unavailable elsewhere
- For dedicated explorers

---

## 🗺️ **MAP TRIGGER SYSTEM**

### **Quest Trigger Types**

```typescript
// Map trigger for quest locations
export interface QuestTrigger {
  id: string;
  type: 'quest_start' | 'quest_objective' | 'quest_complete';
  position: { x: number; y: number };
  questId: string;
  objectiveId?: string; // For multi-step quests
  requiresInteraction: boolean; // Auto-trigger or requires player input?
}

// Example: Lost Shrine entrance
export const SHRINE_ENTRANCE_TRIGGER: QuestTrigger = {
  id: 'shrine-entrance-trigger',
  type: 'quest_start',
  position: { x: 45, y: 22 },
  questId: 'lost-shrine-quest',
  requiresInteraction: true, // Player must press A to enter
};

// Example: Pillar interaction
export const SHRINE_PILLAR_1: QuestTrigger = {
  id: 'shrine-pillar-1',
  type: 'quest_objective',
  position: { x: 10, y: 5 }, // Inside shrine mini-map
  questId: 'lost-shrine-quest',
  objectiveId: 'activate-3-pillars',
  requiresInteraction: true,
};
```

---

## ✅ **DESIGN VALIDATION CHECKLIST**

- ✅ **Breaks up linear progression** (12 main + 5 side = variety)
- ✅ **Player choice** (side content is optional, not forced)
- ✅ **Pacing variety** (not just house battles)
- ✅ **Replay value** (secrets to discover)
- ✅ **Reward scaling** (harder content = better rewards)
- ✅ **No forced 100%** (can beat chapter without side quests)
- ✅ **Discovery mechanics** (secrets require exploration)
- ✅ **Story integration** (quests unlock as story progresses)

---

## 🎯 **CHAPTER 2 SIDE QUEST ROSTER**

### **Proposed 5 Side Quests**

| Quest | Type | Difficulty | Reward | Secret? |
|-------|------|------------|--------|---------|
| **Lost Shrine** | Exploration | ⭐⭐⭐ | Promotion Seal (Venus) | No |
| **Bandit Camp Raid** | Combat | ⭐⭐⭐⭐ | Bandit Blade (weapon) | No |
| **Crystal Cave** | Puzzle + Boss | ⭐⭐⭐⭐⭐ | Master's Crest | Yes |
| **The Forgotten Tomb** | Exploration | ⭐⭐⭐ | Djinn Evolution Item | No |
| **Rival Battle** | Boss Fight | ⭐⭐⭐⭐ | Rare equipment set | No |

---

## 🎯 **NEXT STEPS**

1. ✅ Design reviewed and approved
2. Implement `SideQuestSchema` in `data/schemas/`
3. Create `sideQuests.ts` in `data/definitions/`
4. Add quest tracking to `storySlice.ts` (Zustand)
5. Implement quest triggers in map system
6. Create quest UI (quest log, objective tracker)
7. Design 5 side quests for Chapter 2

**Status:** Ready for implementation pending approval
