╔═══════════════════════════════════════════════════════════════╗
║                                                               ║
║              ╔═══════════════════════════════╗               ║
║              ║                               ║               ║
║              ║     VALE CHRONICLES           ║               ║
║              ║                               ║               ║
║              ║     INSTRUCTION BOOKLET       ║               ║
║              ║                               ║               ║
║              ╚═══════════════════════════════╝               ║
║                                                               ║
║                    Version 2.0                                ║
║                                                               ║
╚═══════════════════════════════════════════════════════════════╝


═══════════════════════════════════════════════════════════════

                        TABLE OF CONTENTS

═══════════════════════════════════════════════════════════════

  Getting Started .................................. Page 3
  How to Play ...................................... Page 4
  Battle System .................................... Page 6
  Djinn System ..................................... Page 9
  Units & Stats .................................... Page 14
  Equipment ........................................ Page 16
  Abilities ........................................ Page 19
  Leveling Up ...................................... Page 21
  Party Management ................................. Page 22
  Overworld & Exploration .......................... Page 23
  Tips & Strategy .................................. Page 24
  Quick Reference .................................. Page 26


═══════════════════════════════════════════════════════════════

                        GETTING STARTED

═══════════════════════════════════════════════════════════════

Welcome to Vale Chronicles.

This is a tactical turn-based RPG where you command a party of
heroes, explore the world, battle enemies, and collect powerful
Djinn to strengthen your team.

═══════════════════════════════════════════════════════════════

BASIC CONTROLS

Overworld:
  Arrow Keys / WASD ................ Move character
  Enter / Space .................... Interact with NPCs
  Esc ............................. Open menu

Battle:
  Mouse / Click ................... Select actions
  Arrow Keys / Tab ................ Navigate menus
  Number Keys (1-4) ............... Quick-select units
  Enter ........................... Confirm / Execute round
  Esc ............................. Cancel / Back

═══════════════════════════════════════════════════════════════

                        HOW TO PLAY

═══════════════════════════════════════════════════════════════

THE BASIC FLOW

┌─────────────────────────────────────────────────────────┐
│                                                         │
│  1. Explore Overworld (guided path)                    │
│     ↓                                                   │
│  2. Talk to Specific NPC (encounter trigger)           │
│     ↓                                                   │
│  3. Pre-Battle Setup:                                  │
│     • Pick Your Team (select 4 units)                  │
│     • Pick Your Djinn (select 3 Djinn)                 │
│     • Equip Equipment (unit-specific items)            │
│     ↓                                                   │
│  4. Enter Battle                                        │
│     ↓                                                   │
│  5. Plan Round (Queue Actions)                         │
│     ↓                                                   │
│  6. Execute Round (SPD order - player & enemy mixed)   │
│     ↓                                                   │
│  7. Repeat until Victory/Defeat                        │
│     ↓                                                   │
│  8. Receive Rewards (XP, Gold, Equipment Choice)       │
│     ↓                                                   │
│  9. Auto-Heal (Full HP, status cured)                  │
│     ↓                                                   │
│  10. Return to Overworld                                │
│                                                         │
└─────────────────────────────────────────────────────────┘

═══════════════════════════════════════════════════════════════

                        BATTLE SYSTEM

═══════════════════════════════════════════════════════════════

Battles use a QUEUE-BASED PLANNING SYSTEM. Each round has two
phases:

┌─────────────────────────────────────────────────────────┐
│                                                         │
│  PHASE 1: PLANNING                                      │
│  ─────────────────                                      │
│  • Queue actions for all 4 party members               │
│  • Queue Djinn activations (up to 3)                   │
│  • Actions cost mana (0-4 per action)                  │
│  • Basic attacks cost 0 mana to queue                  │
│  • Basic attacks generate +1 mana when they hit        │
│  • Can clear actions to refund mana                    │
│                                                         │
│  PHASE 2: EXECUTION                                     │
│  ─────────────────                                      │
│  • Djinn summons execute first                         │
│  • All actions execute in SPD order (fastest first)    │
│    - Player and enemy actions are mixed together       │
│    - Higher SPD = acts first, regardless of side       │
│  • Basic attacks generate +1 mana when they hit        │
│    (gained immediately, timing matters!)               │
│  • Status effects tick                                 │
│  • Battle end check                                    │
│                                                         │
└─────────────────────────────────────────────────────────┘

═══════════════════════════════════════════════════════════════

MANA SYSTEM

Your team shares a MANA POOL for queuing actions.

• Each unit contributes mana circles (varies by unit: 1-3 per unit)
• Total pool = sum of all 4 units' contributions
• Typical party: 1 + 2 + 2 + 3 = 8 mana total
• Mana fully regenerates each planning phase
• Basic attacks: 0 mana to queue
• Abilities: 0-4 mana to queue (varies by ability)
• Djinn activation: 0 mana (separate from actions)

BASIC ATTACK MANA GENERATION:
  When a basic attack HITS an enemy, your team gains +1 mana
  immediately during execution. Missed or dodged attacks do
  NOT generate mana.
  
  This mana is gained when the attack executes (in turn order),
  so timing matters strategically! You can use mana generated
  in the SAME ROUND if slower units act after the basic attack.

┌─────────────────────────────────────────────────────────┐
│ EXAMPLE: Mana Generation Helps Later Units             │
│ ─────────────────────────────────                       │
│ Team Mana Pool: 8 circles                              │
│                                                         │
│ Planning Phase (Queue Actions):                        │
│   Unit 1 (SPD 20): Basic Attack → 0 mana              │
│   Unit 2 (SPD 15): Fireball → 4 mana (4 left)        │
│   Unit 3 (SPD 12): Heal → 2 mana (2 left)            │
│   Unit 4 (SPD 10): ??? Only 2 mana left!              │
│                                                         │
│ Execution Phase (Turn Order):                          │
│   Unit 1 acts → Basic Attack HITS → +1 mana!          │
│   → Pool now: 3 circles                                 │
│   Unit 2 acts → Fireball                               │
│   Unit 3 acts → Heal                                    │
│   Unit 4 acts → Can now afford 3-mana spell!           │
│                                                         │
│ STRATEGIC NOTE:                                        │
│   Fast units using Basic Attack can generate mana for  │
│   slower units in the SAME ROUND! Plan turn order.     │
└─────────────────────────────────────────────────────────┘

═══════════════════════════════════════════════════════════════

TURN ORDER

Turn order is determined by SPD (Speed) stat:

• Higher SPD = acts first
• Player and enemy actions are mixed together in SPD order
• If a player unit has SPD 20 and an enemy has SPD 15, the
  player acts first
• Ties broken by party placement order (1st, 2nd, 3rd, 4th)
  for player units
• Plan turn order before battle by checking unit stats and
  adjusting speed through equipment and Djinn bonuses

═══════════════════════════════════════════════════════════════

VICTORY & DEFEAT

VICTORY:
  All enemies KO'd (HP ≤ 0)
  → Rewards screen appears
  → XP, Gold, Equipment rewards
  → Auto-heal (Full HP, status cured)
  → Return to overworld

DEFEAT:
  All party members KO'd
  → Auto-heal (Full HP, status cured)
  → Game Over screen
  → Continue from save or Return to title

═══════════════════════════════════════════════════════════════

POST-BATTLE HEALING

After every battle (win or lose):
  • All units: Full HP restored automatically
  • All status effects: Cured automatically
  • Ready for next battle immediately

═══════════════════════════════════════════════════════════════

                        DJINN SYSTEM

═══════════════════════════════════════════════════════════════

WHAT ARE DJINN?

Djinn are powerful elemental spirits that provide passive
bonuses to your ENTIRE PARTY. You can collect up to 12 Djinn
(3 per element) and equip any 3 to your team.

═══════════════════════════════════════════════════════════════

KEY CONCEPTS

┌─────────────────────────────────────────────────────────┐
│                                                         │
│  GLOBAL TEAM SLOTS                                      │
│  ─────────────────                                      │
│  • Your team has exactly 3 Djinn slots                 │
│  • NOT per-unit! All 4 party members affected          │
│  • Equip Djinn to the team, not individual units      │
│                                                         │
│  DJINN STATES                                          │
│  ────────────                                          │
│  • Set: Providing passive bonuses and abilities       │
│  • Standby: Just activated, bonuses lost              │
│  • Recovery: Recovering, returns to Set after turns   │
│                                                         │
│  ELEMENT PAIRS                                         │
│  ──────────────                                        │
│  • Venus ↔ Mars (Earth vs Fire - opposites)          │
│  • Jupiter ↔ Mercury (Wind vs Water - opposites)     │
│                                                         │
└─────────────────────────────────────────────────────────┘

═══════════════════════════════════════════════════════════════

PASSIVE BONUSES & ABILITY UNLOCKING

Each Djinn provides bonuses and abilities to ALL party members,
but effectiveness varies based on element compatibility:

ELEMENT COMPATIBILITY:
  • Same Element: Best stat bonuses + 3-5 abilities unlocked
  • Counter Element: Stat penalty + 1-2 abilities unlocked
  • Neutral Element: Moderate bonuses + 4-5 abilities unlocked

┌─────────────────────────────────────────────────────────┐
│ EXAMPLE: Flint (Venus Djinn) Equipped                  │
│ ───────────────────────────────────                     │
│                                                         │
│ Isaac (Venus - Same Element):                          │
│   Stats: +4 ATK, +3 DEF                                │
│   Abilities: "Stone Fist", "Granite Guard",            │
│              "Stone Spike", "Terra Armor",              │
│              "Earthquake Punch" (5 abilities)          │
│                                                         │
│ Garet (Mars - Counter Element):                        │
│   Stats: -3 ATK, -2 DEF (PENALTY!)                    │
│   Abilities: "Lava Stone", "Magma Shield",             │
│              "Molten Burst", "Volcanic Guard"          │
│              (4 abilities)                             │
│   Trade-off: Lose stats, gain earth abilities!         │
│                                                         │
│ Ivan (Jupiter - Neutral):                              │
│   Stats: +2 ATK, +2 DEF                                │
│   Abilities: "Earth Pulse", "Ground Shield",            │
│              "Rock Barrage" (3 abilities)              │
│                                                         │
│ Mia (Mercury - Neutral):                               │
│   Stats: +2 ATK, +2 DEF                                │
│   Abilities: "Earth Pulse", "Ground Shield",            │
│              "Rock Barrage" (3 abilities)              │
│                                                         │
└─────────────────────────────────────────────────────────┘

STRATEGIC VALUE OF COUNTER ELEMENT:

Counter-element units receive stat penalties BUT unlock valuable
abilities they normally couldn't access:

  • Fire units gain earth abilities (defensive options)
  • Earth units gain fire abilities (offensive burst)
  • Wind units gain water abilities (healing/support)
  • Water units gain wind abilities (speed/mobility)

This creates meaningful trade-off decisions: Do you prioritize
raw stats or ability diversity?

SYNERGY WITH MULTIPLE DJINN:

When equipping 2-3 Djinn, bonuses stack:

┌─────────────────────────────────────────────────────────┐
│ 3 VENUS DJINN (Flint + Granite + Bane):                │
│                                                         │
│ Isaac (Venus):                                          │
│   Stats: +12 ATK, +9 DEF (3× same bonus)              │
│   Abilities: ~15 earth abilities unlocked              │
│              (5 per Djinn × 3 Djinn)                   │
│                                                         │
│ Garet (Mars):                                           │
│   Stats: -9 ATK, -6 DEF (3× counter penalty)          │
│   Abilities: ~12 earth abilities unlocked               │
│              (4 per Djinn × 3 Djinn)                   │
│   Strategy: Huge penalty but rare ability access!      │
│                                                         │
│ Ivan (Jupiter):                                         │
│   Stats: +6 ATK, +6 DEF (3× neutral)                  │
│   Abilities: ~9 earth abilities unlocked               │
│              (3 per Djinn × 3 Djinn)                   │
│                                                         │
└─────────────────────────────────────────────────────────┘

STRATEGIC DEPTH:

With 12 Djinn collected, you choose which 3 to equip. Each
combination creates different ability loadouts across your party.

Examples:
  • 3 Venus Djinn = Earth specialization
  • 3 Mars Djinn = Fire specialization
  • Mixed (Venus + Mars + Jupiter) = Versatility

Total possible Djinn-granted abilities: 180 unique abilities
across all combinations!

✅ **COMPLETE:** The full Djinn ability system is now fully implemented.
Each of the 12 Djinn grants 15 unique abilities (180 total), distributed
across same/counter/neutral element compatibility. Abilities unlock
automatically when Djinn are equipped and are removed when Djinn enter
Standby state, then restored when they recover.

═══════════════════════════════════════════════════════════════

ACTIVATING DJINN (SUMMONS)

During battle planning, you can activate Djinn for powerful
effects:

REQUIREMENTS:
  • Djinn must be in "Set" state
  • Can activate up to 3 Djinn per round
  • Costs 0 mana (separate from action queue)

DJINN SUMMON EFFECTS:

Each Djinn has unique summon effects when activated:
  • Damage abilities (single target or area)
  • Healing abilities
  • Buff/debuff effects
  • Status effects (freeze, burn, etc.)
  • Defensive barriers
  • Party-wide enhancements

Effects vary by Djinn and tier. When you activate multiple
Djinn together, their effects combine or synergize.

ACTIVATION STRATEGIES:

You can activate your 3 equipped Djinn in any combination:

  1+1+1 Strategy (Frequent Summons):
    • Activate 1 Djinn per round
    • Each recovers in 2 turns
    • Continuous pressure

  2+1 Strategy (Mixed Burst):
    • Activate 2 Djinn together (3-turn cooldown)
    • Activate 1 solo (2-turn cooldown)
    • Balanced approach

  3 Strategy (Maximum Burst):
    • Activate all 3 together (4-turn cooldown)
    • Devastating combined effect
    • Long recovery period

RECOVERY INDEPENDENCE:

While some Djinn are recovering, you can activate others that
are ready! This creates strategic timing decisions.

═══════════════════════════════════════════════════════════════

THE TRADE-OFF

When you activate a Djinn, it moves to "Standby" state:

WHAT YOU LOSE (Until Recovery):
  ❌ That Djinn's stat bonuses/penalties
  ❌ All abilities that Djinn unlocked for your team
  
  These losses affect YOUR ENTIRE PARTY immediately!

WHAT YOU GAIN:
  ✅ Powerful summon effect

RECOVERY TIME:
  • 1 Djinn activated: 2 rounds to recover
  • 2 Djinn activated: 3 rounds to recover each
  • 3 Djinn activated: 4 rounds to recover each

WHEN RECOVERED:
  ✅ Djinn returns to "Set" state
  ✅ All stat bonuses/penalties restored
  ✅ All abilities unlocked again

┌─────────────────────────────────────────────────────────┐
│ EXAMPLE: Flint Activation Cycle                        │
│ ────────────────────────                                │
│ Round 1 - Before Activation:                           │
│   Flint is Set                                         │
│   Isaac: +4 ATK, +3 DEF, has "Stone Fist" ability     │
│   Garet: -3 ATK, -2 DEF, has "Lava Stone" ability     │
│                                                         │
│ Round 1 - Activate Flint:                              │
│   Flint unleashes summon effect!                       │
│   Flint → Standby (2-turn recovery)                    │
│   Isaac: LOSES +4 ATK, +3 DEF, loses "Stone Fist"     │
│   Garet: LOSES -3 ATK, -2 DEF penalty (temp boost!),  │
│          loses "Lava Stone"                            │
│                                                         │
│ Round 2-3 - Recovering:                                │
│   Flint in Standby                                     │
│   Bonuses still lost, abilities still locked           │
│                                                         │
│ Round 4 - Flint Recovers:                              │
│   Flint returns to Set                                 │
│   Isaac: REGAINS +4 ATK, +3 DEF, "Stone Fist" back    │
│   Garet: REGAINS -3 ATK, -2 DEF penalty, "Lava Stone" │
│          back                                           │
│                                                         │
└─────────────────────────────────────────────────────────┘

STRATEGIC NOTE (Counter Elements):

Counter-element units (like Garet with Venus Djinn) actually
BENEFIT temporarily when that Djinn is in Standby - they lose
their stat penalty! But they also lose the unique abilities,
so activation timing is a strategic decision.

═══════════════════════════════════════════════════════════════

COLLECTING DJINN

Djinn are found throughout the game world:
  • Defeat specific enemies
  • Complete quests
  • Explore hidden areas
  • Defeat bosses

Once collected, Djinn are permanently added to your collection.
You can equip/unequip them at any time (outside of battle).

═══════════════════════════════════════════════════════════════

                        UNITS & STATS

═══════════════════════════════════════════════════════════════

CORE STATS

Each unit has 5 core stats:

┌─────────────────────────────────────────────────────────┐
│ HP (Hit Points)                                        │
│   Maximum health. Unit is KO'd when HP reaches 0.      │
│                                                         │
│ ATK (Attack)                                           │
│   Physical damage. Used by basic attacks and           │
│   physical abilities.                                  │
│                                                         │
│ DEF (Defense)                                          │
│   Reduces physical damage. Also reduces magic damage    │
│   (30% effectiveness).                                 │
│                                                         │
│ MAG (Magic)                                            │
│   Spell damage and healing power. Used by psynergy     │
│   abilities.                                           │
│                                                         │
│ SPD (Speed)                                            │
│   Determines turn order. Higher SPD = acts first.      │
│                                                         │
└─────────────────────────────────────────────────────────┘

═══════════════════════════════════════════════════════════════

STAT CALCULATION

Final stats are calculated as:

  Final Stat = Base Stat + Level Bonus + Equipment Bonus
               + Djinn Bonus + Buffs

Level Bonus:
  Stat at Level N = Base Stat + (Growth Rate × (Level - 1))

┌─────────────────────────────────────────────────────────┐
│ EXAMPLE:                                                │
│ ────────                                                │
│ Isaac Level 5:                                          │
│   Base ATK: 26 (from leveling)                          │
│   Iron Sword: +14 ATK                                   │
│   Flint (Venus Djinn, same element): +4 ATK            │
│   Total: 44 ATK                                         │
└─────────────────────────────────────────────────────────┘

═══════════════════════════════════════════════════════════════

UNIT ROLES

Units fall into different archetypes:

  Balanced Warrior: Even stats, versatile
  Pure DPS: High ATK, low DEF (glass cannon)
  Elemental Mage: High MAG, low HP/DEF
  Healer: High MAG, supportive abilities
  Tank: High HP/DEF, low ATK
  Rogue: High SPD, high ATK

UNIT LIMITS:
  • Active Party: 4 units maximum
  • Total Recruitable: 10 units
  • Bench: 6 units (not in active party)
  • Max Level: 20

═══════════════════════════════════════════════════════════════

                        EQUIPMENT

═══════════════════════════════════════════════════════════════

EQUIPMENT SLOTS

Each unit can equip 5 pieces of equipment:

  1. Weapon: Typically increases ATK
  2. Armor: Typically increases DEF and HP
  3. Helm: Typically increases DEF
  4. Boots: Typically increases SPD
  5. Accessory: Various bonuses

Note: Rare and legendary equipment can provide any combination
of stat bonuses, not just their typical stats. All equipment
has special effects.

═══════════════════════════════════════════════════════════════

UNIT-LOCKED EQUIPMENT SYSTEM

Equipment is UNIT-SPECIFIC. Each character has their own
exclusive equipment that only they can use.

HOW IT WORKS:
  • Isaac has Isaac-specific equipment (Isaac's swords, armor)
  • Garet has Garet-specific equipment (Garet's axes, armor)
  • Each unit has completely separate equipment pools
  • No sharing equipment between units

This creates distinct progression paths for each character.

═══════════════════════════════════════════════════════════════

SHOP SYSTEM (Equipment Unlocks)

Shops function as UNLOCK MENUS accessed from the game UI:

STARTER KITS:
  When you recruit a unit, their Starter Kit becomes available:
  
  • Contains: Full equipment set (5 pieces)
  • Cost: Varies by unit (typically 200-500g)
  • Purchase unlocks that unit's equipment store

UNIT EQUIPMENT STORES:
  After buying a Starter Kit, that unit's full equipment store
  unlocks:
  
  • Browse all equipment exclusive to that unit
  • Progression tiers available:
    - Basic (50-100g per piece)
    - Bronze (100-200g per piece)
    - Iron (150-400g per piece)
    - Steel (400-1000g per piece)
    - Silver (1000-2500g per piece)
    - Mythril (2500-5000g per piece)
    - Legendary (5000-15000g per piece)
    - Artifact (15000+ per piece)
  
  • Pay gold to permanently unlock each piece
  • No selling - all unlocks are permanent
  • Choose unlock order based on your strategy

EXAMPLE FLOW:
  1. Recruit Isaac
  2. Isaac's Starter Kit appears in shop (350g)
  3. Buy Starter Kit → Unlocks Isaac's Equipment Store
  4. Browse Isaac-exclusive items:
     - Gaia Blade (Venus legendary sword)
     - Sol Blade (ultimate artifact weapon)
     - Earth Mail (defense armor)
     - Etc.
  5. Unlock items as you earn gold

═══════════════════════════════════════════════════════════════

EQUIPMENT TIERS (General Examples)

Note: Actual equipment is unit-specific with unique names
and stat combinations.

┌─────────────────────────────────────────────────────────┐
│ BASIC TIER:                                             │
│   Weapon: +5-7 ATK                                     │
│   Armor: +6 DEF, +10 HP                                │
│   Helm: +4 DEF                                         │
│   Boots: +2 SPD                                        │
│   Accessory: Small stat boost                          │
│                                                         │
│ IRON TIER:                                              │
│   Weapon: +12-16 ATK                                   │
│   Armor: +10 DEF, +20 HP                               │
│   Helm: +5 DEF                                         │
│   Boots: +3 SPD                                        │
│   Accessory: Moderate stat boost                       │
│                                                         │
│ STEEL TIER:                                             │
│   Weapon: +20-25 ATK                                   │
│   Armor: +18 DEF, +40 HP                               │
│   Helm: +10 DEF                                        │
│   Boots: +5-8 SPD                                      │
│   Accessory: Large stat boost                          │
│                                                         │
│ LEGENDARY TIER:                                         │
│   Weapon: +50-72 ATK, unlocks abilities                │
│   Armor: +35 DEF, +60 HP, multi-stat bonuses           │
│   Helm: +25 DEF, +10 MAG, +special effects             │
│   Boots: +10 SPD, always acts first                    │
│   Accessory: Unique powerful effects                   │
└─────────────────────────────────────────────────────────┘

═══════════════════════════════════════════════════════════════

SPECIAL PROPERTIES

Higher-tier equipment (Steel, Silver, Mythril, Legendary, Artifact)
typically has special effects:

COMMON SPECIAL PROPERTIES:
  • Ability Unlocks: Legendary weapons grant unique abilities
  • Always First Turn: Guarantees acting first in battle
  • Multi-Stat Bonuses: Boosts 3-4 different stats simultaneously
  • Percentage Bonuses: Multipliers instead of flat bonuses
  • Element Synergies: Enhanced effects with matching element
  • Combat Modifiers: Special battle mechanics when equipped

EQUIPMENT TIERS WITH SPECIAL EFFECTS:
  • Basic/Bronze: Stat bonuses only (no special effects)
  • Iron: Mostly stat bonuses, occasional special effect
  • Steel/Silver: Often have 1 special effect
  • Mythril/Legendary/Artifact: Always have special effects

═══════════════════════════════════════════════════════════════

GOLD & PURCHASING

  Starting Gold: 500 gold
  
  Purchase Flow:
    1. Recruit new unit
    2. Their Starter Kit appears in shop menu
    3. Buy Starter Kit to unlock their equipment store
    4. Browse and unlock individual items with gold
    5. All unlocks are permanent (no selling)

═══════════════════════════════════════════════════════════════

                        ABILITIES & PSYNERGY

═══════════════════════════════════════════════════════════════

ABILITY TYPES

┌─────────────────────────────────────────────────────────┐
│ Physical Attack:                                        │
│   Uses ATK stat, costs 0 mana, single target            │
│   Example: Strike, Cleave                               │
│                                                         │
│ Psynergy Attack:                                        │
│   Uses MAG stat, costs mana to queue, can be AoE        │
│   Has element type                                      │
│   Example: Fireball, Quake, Ice Shard                  │
│                                                         │
│ Healing:                                                │
│   Uses MAG stat, costs mana to queue, restores HP       │
│   Can target single ally or all allies                 │
│   Example: Heal, Party Heal, Wish                      │
│                                                         │
│ Buff:                                                   │
│   Increases stats temporarily, costs mana              │
│   Duration: 2-3 turns                                   │
│   Example: Boost ATK, Boost DEF, Blessing              │
│                                                         │
│ Debuff:                                                 │
│   Reduces enemy stats or applies status, costs mana    │
│   Duration: 2-5 turns                                  │
│   Example: Blind, Poison Strike, Burn Touch            │
└─────────────────────────────────────────────────────────┘

═══════════════════════════════════════════════════════════════

MANA COSTS

Abilities cost mana to queue during planning phase:

  • Basic Attack: 0 mana (always free)
  • Low-cost abilities: 1 mana
  • Mid-tier abilities: 2-3 mana
  • Ultimate abilities: 4 mana

Your team's mana pool FULLY REFILLS at the start of each
planning phase. Abilities are unlimited per battle - the only
limit is how much mana you have per round.

This makes resource management about planning each round
efficiently, not conserving resources across the entire battle.

═══════════════════════════════════════════════════════════════

ABILITY EXAMPLES BY ELEMENT

VENUS (Earth) Abilities:
  • Quake (Level 2): 1 mana, ~30 base power, all enemies
  • Clay Spire (Level 3): 2 mana, ~60 power, single target
  • Ragnarok (Level 4): 3 mana, ~100 power, single target
  • Judgment (Level 5): 4 mana, ~150 power, all enemies

MARS (Fire) Abilities:
  • Fireball (Level 2): 1 mana, ~32 power, single target
  • Volcano (Level 3): 3 mana, ~65 power, all enemies
  • Meteor Strike (Level 4): 3 mana, ~110 power, single target
  • Pyroclasm (Level 5): 4 mana, ~170 power, all enemies

MERCURY (Water) Abilities:
  • Ply (Level 1): 1 mana, heals ~50 HP, single ally
  • Frost (Level 2): 1 mana, ~28 power, all enemies
  • Ice Horn (Level 3): 2 mana, ~58 power, single target
  • Wish (Level 4): 3 mana, heals ~90 HP, all allies
  • Glacial Blessing (Level 5): 4 mana, ~140 HP + revive, all allies

JUPITER (Wind) Abilities:
  • Gust (Level 2): 1 mana, ~25 power, single target
  • Plasma (Level 3): 2 mana, ~55 power, all enemies (chain)
  • Thunderclap (Level 4): 3 mana, ~95 power, all enemies
  • Tempest (Level 5): 4 mana, ~160 power, all enemies

BUFF/DEBUFF Examples:
  • Blessing: 2 mana, +25% ATK/DEF to all allies, 3 turns
  • Guardian Stance: 2 mana, +50% DEF to all allies, 2 turns
  • Wind's Favor: 2 mana, +40% SPD to all allies, 3 turns

Note: Power values are approximate and subject to balancing.

═══════════════════════════════════════════════════════════════

ABILITY SOURCES

Abilities come from three sources:

  1. LEVEL UNLOCKS:
     Units unlock abilities as they level up
     Example: Isaac unlocks "Quake" at Level 2

  2. EQUIPMENT UNLOCKS:
     Legendary weapons grant special abilities
     Example: Sol Blade unlocks "Megiddo"

  3. DJINN UNLOCKS:
     Equipped Djinn grant abilities based on compatibility
     Example: Flint grants Isaac "Stone Fist" + "Granite Guard"

Total ability pool per unit: Base abilities + equipment +
Djinn (potentially 20+ abilities at high levels with good
equipment and Djinn choices!)

═══════════════════════════════════════════════════════════════

ELEMENTAL ADVANTAGES

Elements have a rock-paper-scissors relationship:

┌─────────────────────────────────────────────────────────┐
│ STRONG AGAINST (1.5× damage):                          │
│   Venus → Jupiter (Earth beats Wind)                    │
│   Mars → Venus (Fire beats Earth)                      │
│   Mercury → Mars (Water beats Fire)                     │
│   Jupiter → Mercury (Wind beats Water)                  │
│                                                         │
│ WEAK AGAINST (0.67× damage):                           │
│   Reverse of above (e.g., Jupiter → Venus is weak)     │
│                                                         │
│ NEUTRAL:                                                │
│   Same element or no element = 1.0× damage             │
│                                                         │
│ COUNTER PAIRS (Opposites):                             │
│   Venus ↔ Mars (Earth vs Fire)                        │
│   Jupiter ↔ Mercury (Wind vs Water)                    │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│ EXAMPLE:                                                │
│ ────────                                                │
│ Isaac (Venus) casts Quake on Wind Wisp (Jupiter)       │
│   Base damage: 47                                       │
│   Element advantage: 1.5×                              │
│   Final damage: 70 (47 × 1.5)                          │
└─────────────────────────────────────────────────────────┘

Note: Element advantage values are placeholders for testing.

═══════════════════════════════════════════════════════════════

STATUS EFFECTS

Note: All status effect values below are placeholders for
testing and subject to balancing adjustments.

┌─────────────────────────────────────────────────────────┐
│ POISON:                                                 │
│   8% max HP damage per turn (placeholder)              │
│   Duration: 5 turns (placeholder)                       │
│   Cured by: Heal abilities, Wish, auto-heal            │
│                                                         │
│ BURN:                                                   │
│   10% max HP damage per turn (placeholder)              │
│   Duration: 3 turns (placeholder)                      │
│   Cured by: Heal abilities, Wish, auto-heal            │
│                                                         │
│ FREEZE:                                                 │
│   Unit cannot act                                       │
│   30% chance to break free each turn (placeholder)      │
│   Cured by: Fire spells, auto-heal                     │
│   Frozen units take no damage                          │
│                                                         │
│ PARALYZE:                                               │
│   50% chance to fail action each turn (placeholder)     │
│   Duration: 2 turns (placeholder)                      │
│   Cured by: Restore ability, Wish, auto-heal           │
└─────────────────────────────────────────────────────────┘

═══════════════════════════════════════════════════════════════

BUFF & DEBUFF MECHANICS

DURATION COUNTDOWN:
  Buffs and debuffs count down at the END of the affected
  unit's turn (not at round start).
  
  Example: Isaac casts Blessing (duration 3) on himself
    • Isaac's turn: Buff applied, duration = 3
    • Garet's turn: Buff still active (3)
    • Enemy's turn: Buff still active (3)
    • Isaac's turn ends: Duration decrements to 2
    • Next round: Buff still active (2)
    • Continues for 3 of Isaac's turns total

STACKING RULES:
  • Same Buff: Recasting refreshes duration (doesn't stack)
    - Blessing active with 1 turn left
    - Cast Blessing again → Duration resets to 3
    - Does NOT become 2× bonus (no double-stacking)
  
  • Different Buffs: Stack multiplicatively (max 5 buffs active)
    - Blessing (+25% ATK) + another ATK buff
    - Both bonuses apply simultaneously
  
  • Buff + Debuff: Can have both on same unit

REMOVAL:
  • Duration expires (reaches 0)
  • Dispel abilities remove all buffs
  • Death removes all buffs/debuffs
  • Auto-heal after battle clears all

═══════════════════════════════════════════════════════════════

ABILITY UNLOCKS BY LEVEL

  Level 1: Basic Attack (always available)
  Level 2: First elemental spell
  Level 3: Utility ability (buff/debuff/special)
  Level 4: Strong attack spell
  Level 5: Powerful ability
  ...
  Level 10: Advanced abilities
  Level 15: Master-tier abilities
  Level 20: Ultimate ability

═══════════════════════════════════════════════════════════════

                        LEVELING UP

═══════════════════════════════════════════════════════════════

EXPERIENCE POINTS (XP)

XP SOURCES:
  • Winning battles
  • Defeating enemies
  • Completing quests (bonus XP)

XP DISTRIBUTION:
  • Each active party member gets FULL XP (not split!)
  • KO'd units gain XP
  • Bench units do not gain XP

┌─────────────────────────────────────────────────────────┐
│ EXAMPLE:                                                │
│ ────────                                                │
│ Battle rewards 80 XP                                   │
│ Party of 4 units:                                      │
│   Isaac: +80 XP ✓                                      │
│   Garet: +80 XP ✓                                      │
│   Mystic: +80 XP ✓                                     │
│   Ranger: +80 XP ✓                                     │
│ Total XP awarded: 320 XP                               │
└─────────────────────────────────────────────────────────┘

═══════════════════════════════════════════════════════════════

LEVEL REQUIREMENTS

  Level 1 → 2: 100 XP
  Level 2 → 3: 250 XP
  Level 3 → 4: 500 XP
  Level 4 → 5: 1,000 XP
  Level 5 → 6: 1,250 XP
  Level 6 → 7: 1,600 XP
  Level 7 → 8: 2,000 XP
  Level 8 → 9: 2,500 XP
  Level 9 → 10: 3,100 XP
  Level 10 → 11: 3,700 XP
  Level 11 → 12: 4,400 XP
  Level 12 → 13: 5,200 XP
  Level 13 → 14: 6,100 XP
  Level 14 → 15: 7,100 XP
  Level 15 → 16: 8,200 XP
  Level 16 → 17: 9,400 XP
  Level 17 → 18: 10,700 XP
  Level 18 → 19: 12,100 XP
  Level 19 → 20: 13,600 XP
  
  Total to reach Level 20: 92,800 XP

XP FORMULA:
  Base XP = 50 + (enemy level × 10)
  Party Penalty: ×0.8 if party size > 1

  Example:
    Solo vs Level 3 enemy: 50 + (3 × 10) = 80 XP
    Party of 4 vs Level 3 enemy: 80 × 0.8 = 64 XP per unit

═══════════════════════════════════════════════════════════════

STAT GROWTH

Stats increase automatically when leveling:

  New Stat = Base Stat + (Growth Rate × (Level - 1))

When a unit levels up:
  • All stats increase (based on growth rates)
  • New abilities may unlock (if at unlock level)
  • Max HP increases
  • Current HP is NOT restored on level up

═══════════════════════════════════════════════════════════════

                        PARTY MANAGEMENT

═══════════════════════════════════════════════════════════════

ACTIVE PARTY

  • Maximum: 4 units in active party
  • Total Recruitable: 10 units
  • Bench: 6 units (not in active party)
  • Max Level: 20

═══════════════════════════════════════════════════════════════

RECRUITING UNITS

Units join your party through various methods:
  • Story progression
  • Defeating them in battle
  • Completing quests
  • Finding them in the overworld

Recruitment Levels:
  Units join at specific levels based on story progression:
  
  Early Recruits (Tutorial):
    • Starter units: Level 1 (Isaac, Garet, Ivan)
  
  Early Game:
    • Mia: Level 2
  
  Mid Game:
    • Felix, Jenna, Sheba: Level 3
  
  Late Game:
    • Piers, Kraden: Level 4
  
  Final Recruitment:
    • Kyle: Level 5 (hardest recruitment battle)

Recruitment Battles:
  Must defeat to recruit

═══════════════════════════════════════════════════════════════

SWAPPING PARTY MEMBERS

You can swap active party members with bench units:
  • Access party screen from menu
  • Select unit to swap
  • Choose replacement from bench
  • Changes take effect immediately
  • Djinn bonuses apply to new active members automatically

═══════════════════════════════════════════════════════════════

DJINN MANAGEMENT

Equipping Djinn:
  • Access Djinn menu from pause menu
  • View all 12 collected Djinn
  • Select 3 Djinn for team slots
  • Bonuses and abilities apply to all 4 active party members
    (effectiveness varies by element compatibility)

Djinn Collection:
  • Collect Djinn throughout the game
  • Once collected, Djinn is permanently available
  • Can equip/unequip at any time (outside battle)

═══════════════════════════════════════════════════════════════

                        OVERWORLD & EXPLORATION

═══════════════════════════════════════════════════════════════

MOVEMENT

  Controls: Arrow keys or WASD
  Type: Tile-based movement
  Diagonal: Can move diagonally
  Collision: Walls, NPCs, obstacles block movement

═══════════════════════════════════════════════════════════════

ENCOUNTERS

NO RANDOM ENCOUNTERS:
  Vale Chronicles has NO random encounters anywhere in the game.
  You will never be ambushed while exploring (not in towns,
  dungeons, forests, or any area).

ALL BATTLES ARE NPC-TRIGGERED:
  Every battle is triggered by talking to specific NPCs:
  • Walk up to NPC marked with exclamation mark (!)
  • Press interact button (Enter/Space) to start battle
  • You have complete control over when to fight
  • Plan your party/equipment before each battle

GUIDED PATH:
  Exploration follows a guided path. You'll encounter specific
  NPCs in a set order as you progress through the story.

STRATEGIC ADVANTAGE:
  • No grinding required
  • Predictable difficulty progression
  • Can explore safely between battles
  • Return to prepare if NPC looks too tough

PRE-BATTLE SETUP:
  Before entering battle, you'll be prompted to:
  • Select your team (choose 4 units from your roster)
  • Select your Djinn (choose 3 Djinn to equip)
  • Equip equipment (assign items to your units)

ENCOUNTER TYPES:
  • Normal Enemies: Standard battles
  • Recruitment Battles: Defeat to recruit unit
  • Boss Battles: Story bosses
  • Training Dummies: Practice battles

═══════════════════════════════════════════════════════════════

NPCS

NPCs serve various functions:
  • Battle NPCs: Trigger encounters
  • Story NPCs: Advance plot, give quests
  • Djinn NPCs: Give Djinn after completing tasks

═══════════════════════════════════════════════════════════════

SAVE SYSTEM

Manual Saves:
  • 3 save slots
  • Can save from menu

Auto-Save:
  • 1 slot
  • Triggers: After battle victory, after recruitment,
    before boss battles

═══════════════════════════════════════════════════════════════

                        TIPS & STRATEGY

═══════════════════════════════════════════════════════════════

BATTLE STRATEGY

MANA MANAGEMENT:
  • Basic attacks cost 0 mana to queue
  • Basic attacks generate +1 mana when they hit (timing matters!)
  • Use fast units' basic attacks early to generate mana for
    slower units' expensive abilities
  • Don't queue more actions than you can afford
  • Plan your round before queuing actions
  • Mana refills completely each round - use it!

TURN ORDER:
  • Higher SPD = acts first
  • Ties broken by party placement order (1st, 2nd, 3rd, 4th)
  • Plan turn order before battle by checking unit stats
  • Adjust speed through equipment (boots) and Djinn bonuses
  • Use speed to your advantage:
    - Fast units can finish enemies before they act
    - Slow units can clean up after fast units weaken enemies
  • Party placement matters for tiebreakers - arrange your party
    strategically if units have similar SPD

ELEMENTAL STRATEGY:
  • Exploit elemental advantages (1.5× damage)
  • Avoid using weak elements (0.67× damage)
  • Match abilities to enemy weaknesses

DJINN ACTIVATION:
  • Save Djinn for tough battles or bosses
  • Stagger activations (1+1+1) to maintain some bonuses
  • Use big bursts (2 or 3 together) when you need massive damage
  • Remember: Activated Djinn removes bonuses AND abilities
    from entire party until recovery!
  • Counter-element units get temporary stat boost when their
    penalty Djinn are in Standby

═══════════════════════════════════════════════════════════════

PARTY COMPOSITION

BALANCED TEAM:
  • 1 Tank (high HP/DEF)
  • 1 Healer (support abilities)
  • 1-2 DPS (high ATK or MAG)
  • Cover all 4 elements if possible

DJINN SYNERGY:
  • All same element = specialization (high bonuses for matching
    units, penalties for counter units)
  • Mixed elements = versatility (balanced bonuses across party)
  • Counter builds = trade stats for rare ability access
  • Choose based on your party's needs and strategy

═══════════════════════════════════════════════════════════════

EQUIPMENT PRIORITY

EARLY GAME:
  • Buy Starter Kits for your first recruited units
  • Focus on unlocking weapons first (more damage = faster battles)
  • Unlock armor when enemies hit harder

MID GAME:
  • Unlock Iron tier items for active party
  • Prioritize weapons and armor
  • Boots become important for turn order

LATE GAME:
  • Save for Steel and Legendary tier equipment
  • Legendary items are expensive but powerful
  • Consider special properties and ability unlocks

═══════════════════════════════════════════════════════════════

LEVELING TIPS

XP DISTRIBUTION:
  • All active units get full XP
  • Rotate party members to keep everyone leveled
  • Don't neglect bench units (you may need them later)

EFFICIENT LEVELING:
  • Fight enemies at or slightly above your level
  • Boss battles give bonus XP
  • Complete quests for bonus XP

═══════════════════════════════════════════════════════════════

RESOURCE MANAGEMENT

GOLD:
  • Prioritize Starter Kits for newly recruited units
  • Unlock equipment progression (Basic → Legendary)
  • Save gold for important upgrades

MANA MANAGEMENT:
  • Basic attacks don't cost mana
  • Use abilities strategically each round
  • Fast units can generate mana for slow units (same round!)
  • Mana refills every planning phase - don't hoard it

═══════════════════════════════════════════════════════════════

                        QUICK REFERENCE

═══════════════════════════════════════════════════════════════

STAT ABBREVIATIONS

  HP  = Hit Points (health)
  ATK = Attack (physical damage)
  DEF = Defense (damage reduction)
  MAG = Magic (spell power)
  SPD = Speed (turn order)

  MANA = Team resource (shared pool, refills each round)

═══════════════════════════════════════════════════════════════

ELEMENTAL ADVANTAGES

  Venus → Jupiter: 1.5× damage
  Mars → Venus: 1.5× damage
  Mercury → Mars: 1.5× damage
  Jupiter → Mercury: 1.5× damage
  Reverse = 0.67× damage
  Same/Neutral = 1.0× damage

  Note: Values are placeholders for testing.

═══════════════════════════════════════════════════════════════

ELEMENT COUNTER PAIRS

  Venus ↔ Mars (Earth vs Fire - opposites)
  Jupiter ↔ Mercury (Wind vs Water - opposites)

═══════════════════════════════════════════════════════════════

DJINN BONUSES QUICK REFERENCE

SAME ELEMENT:
  Single Djinn: +4 ATK, +3 DEF, 2 abilities
  3 Same Djinn: +12 ATK, +8 DEF, 6 abilities

COUNTER ELEMENT:
  Single Djinn: -3 ATK, -2 DEF, 2 abilities
  3 Counter Djinn: -9 ATK, -6 DEF, 6 abilities

NEUTRAL ELEMENT:
  Single Djinn: +2 ATK, +2 DEF, 1 ability
  3 Neutral Djinn: +6 ATK, +6 DEF, 3 abilities

Note: Values are placeholders for testing and subject to
balancing adjustments.

═══════════════════════════════════════════════════════════════

DJINN RECOVERY TIMING

  1 Djinn activated: 2 rounds to recover
  2 Djinn activated: 3 rounds to recover each
  3 Djinn activated: 4 rounds to recover each
  
  Recovery order: First activated returns first

═══════════════════════════════════════════════════════════════

BATTLE FLOW

  1. Planning Phase: Queue actions (costs mana)
  2. Execute Round: Djinn summons → Actions in SPD order
  3. Status Effects Tick
  4. Battle End Check
  5. Repeat or Victory/Defeat
  6. Auto-Heal: Full HP, status cured

═══════════════════════════════════════════════════════════════

KEY NUMBERS

  Max Level: 20
  Max Units: 10 (4 active, 6 bench)
  Max Djinn: 12 (3 equipped)
  Equipment Slots: 5 (weapon, armor, helm, boots, accessory)
  Equipment: Unit-locked (each unit has exclusive items)
  Mana Pool: Varies (sum of unit contributions)
  Mana Cost Range: 0-4 (current balancing)
  Basic Attack Mana: +1 mana when hit connects
  Starting Gold: 500
  XP to Level 20: 92,800 total

═══════════════════════════════════════════════════════════════

                        DAMAGE CALCULATION

═══════════════════════════════════════════════════════════════

PHYSICAL DAMAGE

  Damage = (Base Damage + ATK - (DEF × 0.5))
  Minimum: 1 damage

═══════════════════════════════════════════════════════════════

PSYNERGY DAMAGE

  Damage = (Base Power + MAG - (DEF × 0.3)) × Element Modifier
  Element Modifier: 1.5× (strong), 0.67× (weak), 1.0× (neutral)
  Minimum: 1 damage

═══════════════════════════════════════════════════════════════

AOE DAMAGE RULE

  Mode: Damage distribution varies by ability (in development)
  
  Current Testing Behavior:
    • Split evenly among targets
    • Example: Quake (100 power) vs 3 enemies = 33 each
    • Total 99 damage dealt
  
  Final Design (TBD):
    • May vary by ability type
    • Some abilities: Full damage to each target
    • Some abilities: Split evenly among targets
    • Some abilities: Weighted (front takes more, back less)
  
  Note: AoE mechanics subject to balancing during development.

═══════════════════════════════════════════════════════════════

                        BATTLE REWARDS

═══════════════════════════════════════════════════════════════

XP REWARDS

  Formula: 50 + (enemy level × 10), ×0.8 for parties
  Distribution: Each active unit gets full XP
  KO'd Units: Do gain XP

═══════════════════════════════════════════════════════════════

GOLD REWARDS

  Formula: 25 + (enemy level × 15)
  Examples:
    Level 1 enemy: 40 gold
    Level 3 enemy: 70 gold
    Level 5 enemy: 100 gold

═══════════════════════════════════════════════════════════════

EQUIPMENT REWARDS

  NPCs provide predetermined equipment rewards:
    • Fixed rewards per NPC battle
    • May offer choice (pick 1 of 3 items)
    • Encourages replay with different choices
  
  All rewards are planned and balanced (no random drops).

═══════════════════════════════════════════════════════════════

RECRUITMENT REWARDS

  Unit Recruitment: Unit joins party
  Bonus XP: 200 XP flat bonus
  Bonus Gold: 500 gold flat bonus
  Equipment Reward: Choice of 1 rare item

═══════════════════════════════════════════════════════════════

                        END OF BOOKLET

═══════════════════════════════════════════════════════════════

Thank you for playing Vale Chronicles!

For technical details and exact formulas, see the game's
technical documentation.

═══════════════════════════════════════════════════════════════

