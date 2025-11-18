# Vale Chronicles V2 - Gameplay & Mechanics Guide

**Genre:** Turn-based Tactical RPG
**Inspiration:** Golden Sun series
**Platform:** Web-based (React/TypeScript)

---

## Table of Contents

1. [Core Concept](#core-concept)
2. [Battle System](#battle-system)
3. [Elemental System](#elemental-system)
4. [Abilities & Psynergy](#abilities--psynergy)
5. [Damage & Healing](#damage--healing)
6. [Djinn System](#djinn-system)
7. [Equipment](#equipment)
8. [Character Progression](#character-progression)
9. [Status Effects](#status-effects)
10. [Party Management](#party-management)
11. [Quick Reference](#quick-reference)

---

## Core Concept

Vale Chronicles is a **strategic turn-based RPG** where you build a party of up to 4 heroes, each aligned with one of four elemental forces (Venus, Mars, Mercury, Jupiter). Combat is **planning-based** - you queue up all your team's actions for the round, manage a shared mana pool, and activate powerful Djinn spirits to turn the tide of battle.

**Key Features:**
- **Queue-based combat** - Plan all 4 actions before executing
- **Team mana pool** - Shared resource for powerful abilities
- **12 Djinn spirits** - Collectible allies that grant abilities and stat bonuses
- **Element-based equipment** - Gear restricted by character element
- **20 levels of progression** - Unlock new abilities as you level up
- **Deterministic battles** - Same inputs always produce same results (perfect for replays)

---

## Battle System

### How Combat Works

Battles use a **planning phase → execution phase** structure:

#### Planning Phase
1. **Queue Actions** - Select an ability or basic attack for each of your 4 units
2. **Spend Mana** - Powerful abilities cost mana from your shared team pool (8 mana max)
3. **Activate Djinn** (Optional) - Use Set Djinn for their powerful effects
4. **Execute Round** - Watch the turn order unfold!

#### Execution Phase
1. **Turn Order Calculated** - Based on each unit's Speed (SPD) stat
2. **Actions Execute** - Units act in order: fastest → slowest
3. **Status Effects Tick** - Poison, burn, freeze effects process
4. **Round Ends** - Mana refills, back to planning phase

### Turn Order

Turn order is determined by:
1. **Priority Tier** - Hermes' Sandals boots grant "always first turn"
2. **Effective Speed (SPD)** - Higher SPD = earlier turn
3. **Tiebreaker** - Player units before enemies, then deterministic RNG

### Basic Attack Mana Generation

When a unit performs a **basic attack** (mana cost: 0) and successfully hits an enemy, they generate **+1 mana** for the team pool. This is the only way to exceed your base mana pool!

**Strategy Tip:** Mix basic attacks with powerful abilities to sustain your mana over long battles.

---

## Elemental System

The world of Vale Chronicles is governed by four elemental forces:

| Element | Symbol | Description | Character Classes |
|---------|--------|-------------|-------------------|
| **Venus** | 🪨 Earth | Defensive, physical power | Adept, Sentinel |
| **Mars** | 🔥 Fire | Offensive magic, burns | War Mage |
| **Mercury** | 💧 Water | Healing, support | Mystic |
| **Jupiter** | 🌪️ Wind | Speed, precision | Ranger, Stormcaller |

### Elemental Advantage Triangle

Elements have strengths and weaknesses in a cyclical pattern:

```
Venus → Jupiter → Mercury → Mars → Venus
(Earth beats Wind beats Water beats Fire beats Earth)
```

**Damage Modifiers:**
- **Advantage:** 1.5× damage (50% bonus)
- **Disadvantage:** 0.67× damage (33% penalty)
- **Neutral:** 1.0× damage (no modifier)

**Example:** A Mars Fireball against a Venus enemy deals 1.5× damage!

---

## Abilities & Psynergy

Every unit has access to abilities that unlock as they level up. Abilities fall into several categories:

### Ability Types

#### 1. Physical Attacks
- **Cost:** 0 mana (free)
- **Damage:** Based on ATK stat and weapon power
- **Defense:** Reduced by enemy DEF × 0.5
- **Examples:** Strike, Heavy Strike, Guard Break, Precise Jab

#### 2. Psynergy (Magic)
- **Cost:** 2-4 mana
- **Damage:** Based on MAG stat and ability power
- **Defense:** Reduced by enemy DEF × 0.3 (less effective than vs physical)
- **Elemental:** Uses elemental advantage/disadvantage
- **Examples:** Fireball (Mars), Ice Shard (Mercury), Quake (Venus), Gust (Jupiter)

#### 3. Healing
- **Cost:** 2-4 mana
- **Healing:** basePower + MAG stat
- **Targets:** Single ally or entire party
- **Examples:** Heal (single target), Party Heal (all allies)

#### 4. Buffs/Debuffs
- **Cost:** 1-3 mana
- **Duration:** 2-3 turns
- **Effects:** Boost ATK/DEF/SPD or weaken enemy stats
- **Examples:** Boost ATK (+8 ATK for 3 turns), Guard Break (-6 DEF for 2 turns)

#### 5. Status Effects
- **Cost:** 2-3 mana
- **Duration:** 2-4 turns
- **Effects:** Poison, Burn, Freeze, Paralyze, Blind
- **Examples:** Poison Strike, Burn Touch, Freeze Blast, Paralyze Shock

---

## Damage & Healing

### Physical Damage Formula

```
Damage = (basePower + ATK - DEF×0.5) × elementModifier
Minimum: 1 damage (always deal at least 1)
```

**Factors:**
- `basePower` - Ability's base damage (or ATK for basic attacks)
- `ATK` - Attacker's effective Attack stat
- `DEF` - Defender's effective Defense stat
- `elementModifier` - 1.5 / 0.67 / 1.0 based on element matchup

### Psynergy Damage Formula

```
Damage = (basePower + MAG - DEF×0.3) × elementModifier × resistModifier
Minimum: 1 damage
```

**Factors:**
- `MAG` - Attacker's effective Magic stat
- `resistModifier` - Some armor provides elemental resistance (e.g., Dragon Scales)
- Psynergy is less affected by defense (×0.3 instead of ×0.5)

### Healing Formula

```
Healing = basePower + MAG
Minimum: 1 healing (if basePower > 0)
Maximum: Cannot exceed unit's max HP
```

**Revival:** Standard healing abilities cannot revive KO'd units. Only abilities with the `revivesFallen` flag (like Phoenix summon) can bring back fallen allies at 50% max HP.

### Damage Modifiers (Advanced)

Status effects can further modify damage:
- **Elemental Resistance** - Reduces damage from specific element
- **Elemental Weakness** - Increases damage from specific element
- **Damage Reduction** - Flat % reduction (from buffs/shields)
- **Invulnerability** - Blocks ALL damage
- **Shield** - Blocks one hit, consumes 1 charge
- **Auto-Revive** - Revives unit at X% HP if KO'd

---

## Djinn System

Djinn are elemental spirits you collect throughout your journey. They're the heart of the game's strategic depth!

### Djinn Basics

- **Total Djinn:** 12 (3 per element)
- **Team-Wide:** Djinn affect your entire party, not individual units
- **Slots:** You can equip up to 3 Djinn at once
- **States:** Set → Standby → Recovery → Set

### Djinn States

#### Set (Passive Bonuses)
When equipped and in "Set" state, Djinn provide:
- **Stat Bonuses** - Based on synergy (see below)
- **Ability Unlocks** - Djinn grant class-specific abilities to compatible units
- **Example:** Equipping Flint (Venus) grants Venus units like Adept new earth-based abilities

#### Standby (After Activation)
When you activate a Djinn in battle:
- **Immediate Effect** - Djinn ability triggers (damage/buff/debuff)
- **Loses Passive** - No longer provides stat bonuses or abilities
- **Summon Ready** - Standby Djinn can be combined to summon powerful attacks

#### Recovery
After being in Standby for several turns:
- **Djinn Tier 1:** Recovers after 2 turns
- **Djinn Tier 2:** Recovers after 3 turns
- **Djinn Tier 3:** Recovers after 4 turns
- Once recovered, returns to **Set** state automatically

### Djinn Synergy

The combination of Djinn you equip determines your team's stat bonuses:

#### 1 Djinn (Any Element)
- **ATK:** +4
- **DEF:** +3
- **Class:** Adept

#### 2 Djinn (Same Element)
- **ATK:** +8
- **DEF:** +5
- **Class:** [Element] Warrior (e.g., "Venus Warrior")

#### 2 Djinn (Different Elements)
- **ATK:** +5
- **DEF:** +5
- **Class:** Hybrid

#### 3 Djinn (All Same Element)
- **ATK:** +12
- **DEF:** +8
- **Class:** [Element] Adept (e.g., "Venus Adept")
- **Bonus:** Unlocks ultimate ability for that element!

#### 3 Djinn (2 Same + 1 Different)
- **ATK:** +8
- **DEF:** +6
- **Class:** [Primary Element] Knight
- **Bonus:** Unlocks hybrid spell

#### 3 Djinn (All Different Elements)
- **ATK:** +4
- **DEF:** +4
- **SPD:** +4
- **Class:** Mystic
- **Bonus:** Unlocks "Elemental Harmony"

### Djinn Abilities

Each Djinn grants different abilities based on the unit's class:

- **Same Element:** 5 powerful abilities (best synergy)
- **Counter Element:** 4 moderate abilities (opposing element in advantage triangle)
- **Neutral:** 3-5 utility abilities (no synergy)

**Example:** Flint (Venus Djinn) grants Adept (Venus unit):
- **Same:** Stone Fist, Granite Guard, Stone Spike, Terra Armor, Earthquake Punch
- **Neutral:** Earth Pulse, Ground Shield, Rock Barrage

### Summon Attacks

Combine Standby Djinn to unleash devastating summon attacks!

| Djinn Count | Damage | Target |
|-------------|--------|--------|
| 1 Djinn | 80 | Single enemy |
| 2 Djinn | 150 | Single enemy |
| 3 Djinn | 300 | ALL enemies |

**Note:** After summoning, Djinn return to Recovery state and must wait to return to Set.

---

## Equipment

Your units can equip gear in **5 slots**, each providing different benefits:

### Equipment Slots

| Slot | Primary Stat | Examples |
|------|--------------|----------|
| **Weapon** | ATK | Swords, Axes, Staves, Bows |
| **Armor** | DEF, HP | Leather, Bronze, Steel, Dragon Scales |
| **Helm** | DEF | Cap, Bronze Helm, Mythril Crown |
| **Boots** | SPD | Leather Boots, Hermes' Sandals |
| **Accessory** | Various | Rings, Amulets (DEF/HP/MAG bonuses) |

### Element Restrictions

Equipment is **element-locked**, not unit-locked:

- **Venus (Earth):** Swords, heavy armor
- **Mars (Fire):** Axes/maces, medium armor
- **Mercury (Water):** Staves, light armor, robes
- **Jupiter (Wind):** Bows, mixed weapons, light armor

**Example:** Both Adept and Sentinel (both Venus) can use the same swords and armor, but War Mage (Mars) cannot.

### Equipment Tiers

8 progression tiers mirror classic RPG advancement:

1. **Basic** - Starting gear (e.g., Wooden Sword: +5 ATK)
2. **Bronze** - Early game (e.g., Bronze Sword: +9 ATK)
3. **Iron** - Mid-early (e.g., Iron Sword: +14 ATK)
4. **Steel** - Mid-game (e.g., Steel Sword: +22 ATK)
5. **Silver** - Mid-late (e.g., Silver Blade: +32 ATK)
6. **Mythril** - Late game (e.g., Mythril Blade: +45 ATK)
7. **Legendary** - Endgame (e.g., Gaia Blade: +58 ATK)
8. **Artifact** - Ultimate (e.g., Sol Blade: +72 ATK)

### Special Equipment

Some equipment has unique properties:
- **Hermes' Sandals** - Unit always acts first in turn order
- **Dragon Scales** - 20% elemental resistance against all elements
- **Mythril Crown** - +15 DEF, +10 HP
- **Legendary weapons** - Some unlock unique abilities

---

## Character Progression

### Experience & Leveling

#### XP Curve (Non-Linear)

| Level | Total XP Needed | XP to Next Level |
|-------|----------------|------------------|
| 1 | 0 | 100 |
| 2 | 100 | 250 |
| 3 | 350 | 500 |
| 4 | 850 | 1,000 |
| 5 | 1,850 | 1,250 |
| 10 | 12,300 | 3,700 |
| 15 | 38,800 | 8,200 |
| 20 | 92,800 | MAX |

**Level Cap:** 20

### Stat Growth

Each unit has **base stats** and **growth rates** per level:

```
Effective Stat = Base + (Level - 1) × Growth Rate + Equipment + Djinn
```

#### Core Stats

- **HP** - Hit Points (health)
- **PP** - Psynergy Points (unused in current queue system, abilities cost mana instead)
- **ATK** - Attack (physical damage)
- **DEF** - Defense (reduces incoming damage)
- **MAG** - Magic (psynergy damage and healing power)
- **SPD** - Speed (determines turn order)

### Ability Unlocks

Each unit unlocks new abilities at specific levels:

**Example - Adept (Venus Tank):**
- Level 1: Strike (basic attack)
- Level 2: Guard Break (defense debuff)
- Level 3: Quake (AoE earth attack)
- Level 4: Poison Strike (status effect)

**Example - War Mage (Mars Caster):**
- Level 1: Strike, Fireball
- Level 2: Boost ATK
- Level 3: Burn Touch

### Level-Up Benefits

When you level up:
- **HP Restored** - Full HP recovery
- **Stats Increase** - Based on growth rates
- **Abilities Unlock** - New abilities become available
- **Persists** - Level-ups carry over between battles

---

## Status Effects

Status effects add tactical depth to combat. They tick at the start of each affected unit's turn.

### Damage Over Time

#### Poison
- **Effect:** 8% max HP damage per turn
- **Duration:** 2-4 turns
- **Applied by:** Poison Strike ability
- **Counterplay:** Antidote (not yet implemented) or wait it out

#### Burn
- **Effect:** 10% max HP damage per turn
- **Duration:** 2-4 turns
- **Applied by:** Burn Touch ability, fire-based abilities
- **Counterplay:** Resist or cleanse

### Crowd Control

#### Freeze
- **Effect:** Unit cannot act
- **Duration:** 2-3 turns
- **Break Chance:** 30% chance to break free each turn
- **Applied by:** Freeze Blast, ice-based abilities
- **Counterplay:** Hope for lucky break roll

#### Stun
- **Effect:** Unit skips turn completely
- **Duration:** 1-2 turns
- **No Break:** Cannot break free early
- **Applied by:** Stun abilities
- **Counterplay:** Prevent with high DEF or cleanse

#### Paralyze
- **Effect:** 25% chance to fail action each turn
- **Duration:** 2-3 turns
- **Applied by:** Paralyze Shock, lightning abilities
- **Counterplay:** Action may still succeed

#### Blind
- **Effect:** Reduces accuracy (ability-specific implementation)
- **Duration:** 2-3 turns
- **Applied by:** Blind ability
- **Counterplay:** Use non-accuracy-based abilities

### Defensive Buffs

#### Invulnerability
- **Effect:** Blocks ALL damage (including status damage)
- **Duration:** Varies
- **Does NOT:** Consume shield charges
- **Applied by:** Special abilities (rare)

#### Shield
- **Effect:** Blocks one hit completely, consumes 1 charge
- **Charges:** 1-3 (ability-dependent)
- **Removed:** When charges reach 0
- **Applied by:** Shield abilities

#### Damage Reduction
- **Effect:** Reduces all damage by X%
- **Stacks:** Multiple sources stack additively
- **Capped:** 100% max (cannot go negative)
- **Applied by:** Defensive buffs, equipment

#### Auto-Revive
- **Effect:** If unit is KO'd, revive at X% HP
- **Uses:** Limited (1-2 uses before effect expires)
- **Triggered:** Automatically when HP reaches 0
- **Applied by:** Phoenix summon (not yet implemented)

### Stat Modifications

#### ATK/DEF/SPD Buffs
- **Effect:** +6 to +10 to stat
- **Duration:** 2-3 turns
- **Stacks:** Multiple buffs stack
- **Examples:** Boost ATK (+8 ATK, 3 turns)

#### Stat Debuffs
- **Effect:** -4 to -8 to stat
- **Duration:** 2-3 turns
- **Examples:** Guard Break (-6 DEF, 2 turns)

### Healing Over Time

#### Heal Over Time (HoT)
- **Effect:** Restore X HP at start of turn
- **Duration:** 3-5 turns
- **Applied by:** Regeneration abilities
- **Stacks:** Multiple HoT effects stack

---

## Party Management

### Team Composition

- **Party Size:** 1-4 units (4 recommended for full tactical options)
- **Balanced Comp:** Mix elements for versatility
- **Min-Max Comp:** Stack same element for maximum Djinn synergy bonuses

#### Sample Balanced Party
1. **Adept (Venus)** - Tank with high DEF
2. **War Mage (Mars)** - Magic DPS with elemental damage
3. **Mystic (Mercury)** - Healer and support
4. **Ranger (Jupiter)** - Fast physical DPS

### Recruitable Units (Chapter 1)

**Starter Units (4):**
- **Adept** - Venus tank
- **War Mage** - Mars mage
- **Mystic** - Mercury healer
- **Ranger** - Jupiter archer

**Recruits (2):**
- **Sentinel** - Venus warrior (defensive)
- **Stormcaller** - Jupiter caster (offensive magic)

**Future Recruits:** 4 more units (10 total planned)

### Team Mana Pool

Your party shares a **team-wide mana pool**:

- **Base Pool:** 8 mana
- **Unit Contribution:** Each unit contributes 1-2 mana
- **Calculation:** Sum of all unit `manaContribution` values
- **Refills:** Every round (planning phase)
- **Generation:** Basic attacks generate +1 mana when they hit

**Example Team Mana:**
```
Adept:     1 mana
War Mage:  2 mana
Mystic:    1 mana
Ranger:    1 mana
----------
Total:     5 mana base (refills to 5 each round)
Max Pool:  8 mana (can exceed via basic attack generation)
```

---

## Quick Reference

### Combat Cheat Sheet

| Action | Mana Cost | Effect |
|--------|-----------|--------|
| Basic Attack | 0 | Physical damage, generates +1 mana on hit |
| Psynergy | 2-4 | Magic damage with elemental advantage |
| Heal | 2 | Single-target healing |
| Party Heal | 4 | Full-party healing |
| Buff | 2-3 | +6 to +10 stat for 2-3 turns |
| Debuff | 2-3 | -4 to -8 stat for 2-3 turns |
| Djinn Activation | 0 | Immediate effect, Djinn enters Standby |
| Summon (1 Djinn) | 0 | 80 damage to single enemy |
| Summon (2 Djinn) | 0 | 150 damage to single enemy |
| Summon (3 Djinn) | 0 | 300 damage to ALL enemies |

### Elemental Matchups

```
Venus (Earth) → Jupiter (Wind)   [1.5× damage]
Jupiter (Wind) → Mercury (Water) [1.5× damage]
Mercury (Water) → Mars (Fire)    [1.5× damage]
Mars (Fire) → Venus (Earth)      [1.5× damage]
```

### Stat Priorities by Role

| Role | Primary | Secondary | Tertiary |
|------|---------|-----------|----------|
| Tank | DEF, HP | ATK | SPD |
| Physical DPS | ATK, SPD | DEF | HP |
| Magic DPS | MAG, SPD | HP | DEF |
| Healer | MAG, DEF | HP | SPD |
| Support | SPD, MAG | DEF | HP |

### Status Effect Durations

| Status | Damage/Effect | Duration | Notes |
|--------|---------------|----------|-------|
| Poison | 8% max HP/turn | 2-4 turns | DoT |
| Burn | 10% max HP/turn | 2-4 turns | DoT |
| Freeze | Skip turn | 2-3 turns | 30% break chance |
| Stun | Skip turn | 1-2 turns | No break |
| Paralyze | 25% fail chance | 2-3 turns | May still act |
| Blind | Accuracy down | 2-3 turns | Ability-dependent |

### Equipment Slot Priority

1. **Weapon** - Biggest ATK boost for damage dealers
2. **Armor** - Essential DEF/HP for survival
3. **Boots** - SPD determines turn order (Hermes' Sandals = game-changer)
4. **Helm** - Additional DEF
5. **Accessory** - Utility bonuses (varies)

---

## Strategy Tips

### Early Game (Levels 1-5)
- Focus on balanced team composition
- Collect your first 3 Djinn ASAP for synergy bonuses
- Upgrade to Bronze tier equipment
- Save mana for healing when HP is low

### Mid Game (Levels 6-12)
- Experiment with Djinn synergies (all same element vs mixed)
- Use basic attacks to generate mana during easy fights
- Stack buffs before boss battles
- Learn enemy elemental weaknesses

### Late Game (Levels 13-20)
- Optimize Djinn setup for specific encounters
- Master summon timing (when to sacrifice passive bonuses)
- Use status effects strategically (freeze high-SPD enemies)
- Combine buffs + debuffs for massive damage swings

### Boss Battle Tactics
1. **Round 1:** Queue buffs (Boost ATK/DEF) and debuffs (Guard Break on boss)
2. **Round 2-3:** Activate 1-2 Djinn for immediate effects
3. **Round 4:** Unleash 3-Djinn summon if available (300 AoE damage!)
4. **Sustain:** Mix basic attacks to regenerate mana
5. **Emergency:** Save Party Heal for when multiple units are below 50% HP

---

## Glossary

- **Djinn** - Elemental spirits that grant abilities and stat bonuses
- **Psynergy** - Magic abilities powered by elemental forces
- **Queue** - Pre-planned sequence of actions for the round
- **Mana** - Shared resource pool for casting abilities
- **Element** - Venus/Mars/Mercury/Jupiter
- **Synergy** - Stat bonuses from Djinn combinations
- **Set** - Djinn in passive state (granting bonuses)
- **Standby** - Djinn after activation (ready for summon)
- **Recovery** - Djinn returning to Set state
- **Effective Stats** - Total stats including base + level + equipment + Djinn
- **Turn Order** - Sequence units act (SPD-based)
- **DoT** - Damage over Time (poison, burn)
- **CC** - Crowd Control (freeze, stun, paralyze)
- **AoE** - Area of Effect (hits multiple/all enemies)

---

**Game Version:** Vale Chronicles V2
**Build:** Battle Sandbox (Queue-based combat system)
**Last Updated:** November 2025

**Enjoy your journey through the world of Vale!**
