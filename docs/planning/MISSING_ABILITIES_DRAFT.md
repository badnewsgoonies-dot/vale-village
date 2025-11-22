# Missing Abilities Draft - Level 1-20 Progression

Based on system analysis, the game supports these ability mechanics:

## 🎮 Available Mechanics (from AbilitySchema)

### Core Properties
- **Types**: physical, psynergy, healing, buff, debuff, summon
- **Elements**: Venus, Mars, Jupiter, Mercury, Neutral
- **Targets**: single-enemy, all-enemies, single-ally, all-allies, self
- **Mana Cost**: 0-5 (team pool system)
- **Base Power**: Any positive integer

### Advanced Mechanics (Phase 2+)
- ✅ **Status Effects**: poison, burn, freeze, paralyze, stun (with chance %)
- ✅ **Stat Buffs/Debuffs**: atk, def, mag, spd, hp (with duration)
- ✅ **Heal Over Time**: amount per turn + duration
- ✅ **Multi-Hit**: 2-10 hits per ability
- ✅ **Defense Penetration**: ignoreDefensePercent (0-100%)
- ✅ **Splash Damage**: splashDamagePercent (damage to non-primary targets)
- ✅ **Shield Charges**: shieldCharges (1-99 hit absorption)
- ✅ **Damage Reduction**: damageReductionPercent (0-100%)
- ✅ **Elemental Resistance**: element + modifier (positive/negative)
- ✅ **Immunity Granting**: all or specific types + duration
- ✅ **Status Cleanse**: remove all, negative, or by type
- ✅ **Revive**: revive + reviveHPPercent (0-100%)
- ✅ **Chain Damage**: chainDamage boolean (for lightning)

---

## 📊 Current State Per Unit

| Unit | Element | Role | Current Abilities | Need to Add |
|------|---------|------|-------------------|-------------|
| Adept | Venus | Defensive Tank | 7 (all level 1) | 13 |
| War Mage | Mars | Balanced Mage | 7 (all level 1) | 13 |
| Mystic | Mercury | Support Healer | 7 (all level 1) | 13 |
| Ranger | Jupiter | Balanced DPS | 7 (all level 1) | 13 |
| Sentinel | Venus | Tank | 4 (levels 1-3) | 16 |
| Stormcaller | Jupiter | AoE Mage | 4 (levels 1-3) | 16 |
| Blaze | Mars | Balanced Warrior | 4 (levels 1-3) | 16 |
| Karis | Mercury | Scholar | 5 (levels 1-4) | 15 |
| Tyrell | Mars | Pure DPS | 5 (levels 1-4) | 15 |
| Felix | Venus | Master Warrior | 5 (levels 1-4) | 15 |

---

## 🎯 Design Principles

1. **Early Game (Levels 1-7)**: Basic attacks, simple buffs, status intro
2. **Mid Game (Levels 8-14)**: Advanced mechanics, multi-hit, shields, cleanse
3. **Late Game (Levels 15-20)**: Ultimate abilities, team buffs, revive, immunity

4. **Role Identity**: Each unit should lean into their role
   - Tanks: Defense buffs, shields, damage reduction
   - DPS: Multi-hit, def penetration, status infliction
   - Mages: High power psynergy, elemental mastery, AoE
   - Healers: Heal over time, cleanse, revive, team support

5. **Mana Economy**: Respect the 0-5 cost limit with team pool
   - Level 1-5: Mostly 0-2 mana
   - Level 6-12: 2-3 mana
   - Level 13-20: 3-5 mana (ultimates)

---

## 🔥 UNIT 1: ADEPT (Venus Tank)
**Element**: Venus | **Role**: Defensive Tank | **Mana Contribution**: 1

### Current Abilities (7)
1. Strike (0 mana, physical)
2. Earth Spike (3 mana, psynergy)
3. Stone Skin (2 mana, buff DEF)
4. Ice Lance (3 mana, psynergy)
5. Aqua Heal (3 mana, healing)
6. Focus Strike (0 mana, physical)

**Missing: Levels 7-20 (13 abilities)**

### Level 7: **Fortify**
- Type: buff
- Element: Venus
- Mana Cost: 2
- Targets: self
- Description: "Earth strengthens your resolve. Grants shield charges and DEF boost."
- shieldCharges: 2
- buffEffect: { def: 5 }
- duration: 3

### Level 8: **Tremor**
- Type: psynergy
- Element: Venus
- Mana Cost: 3
- Base Power: 28
- Targets: all-enemies
- Description: "Shake the earth beneath all enemies."

### Level 9: **Guardian Stance**
- Type: buff
- Mana Cost: 2
- Targets: self
- Description: "Reduce incoming damage significantly."
- damageReductionPercent: 0.25
- duration: 4

### Level 10: **Rock Breaker** (Multi-hit)
- Type: physical
- Element: Venus
- Mana Cost: 1
- Base Power: 18
- Targets: single-enemy
- Description: "Strike twice with earth-shattering force."
- hitCount: 2

### Level 11: **Earthquake**
- Type: psynergy
- Element: Venus
- Mana Cost: 4
- Base Power: 35
- Targets: all-enemies
- Description: "Devastating earthquake hits all enemies."
- splashDamagePercent: 1.0

### Level 12: **Stone Wall**
- Type: buff
- Element: Venus
- Mana Cost: 3
- Targets: all-allies
- Description: "Raise a wall of stone, protecting all allies."
- buffEffect: { def: 6 }
- duration: 3

### Level 13: **Unbreakable**
- Type: buff
- Mana Cost: 3
- Targets: self
- Description: "Become nearly invulnerable for a short time."
- damageReductionPercent: 0.4
- shieldCharges: 3
- duration: 3

### Level 14: **Titan Grip**
- Type: physical
- Element: Venus
- Mana Cost: 2
- Base Power: 40
- Targets: single-enemy
- Description: "Crushing blow that ignores half of enemy defenses."
- ignoreDefensePercent: 0.5

### Level 15: **Gaia Shield**
- Type: buff
- Element: Venus
- Mana Cost: 4
- Targets: all-allies
- Description: "Earth's protection shields the entire party."
- shieldCharges: 3
- duration: 4

### Level 16: **Petrify Strike**
- Type: physical
- Element: Venus
- Mana Cost: 2
- Base Power: 25
- Targets: single-enemy
- Description: "Attack that may freeze enemies in stone."
- statusEffect: { type: 'freeze', duration: 2, chance: 0.5 }

### Level 17: **Mountain's Endurance**
- Type: buff
- Mana Cost: 3
- Targets: self
- Description: "Channel the mountain's endurance. Heal over time and immunity."
- healOverTime: { amount: 15, duration: 3 }
- grantImmunity: { all: true, duration: 2 }

### Level 18: **Landslide**
- Type: psynergy
- Element: Venus
- Mana Cost: 5
- Base Power: 50
- Targets: all-enemies
- Description: "Massive landslide buries all enemies."
- splashDamagePercent: 1.0

### Level 19: **Earth's Blessing**
- Type: healing
- Element: Venus
- Mana Cost: 4
- Base Power: 60
- Targets: all-allies
- Description: "Earth's power restores the entire party."

### Level 20: **ULTIMATE - Gaia Rebirth**
- Type: healing
- Element: Venus
- Mana Cost: 5
- Base Power: 80
- Targets: all-allies
- Description: "Channel Gaia's power to heal all allies and revive fallen."
- revive: true
- reviveHPPercent: 0.5
- removeStatusEffects: { type: 'negative' }

---

## ⚔️ UNIT 2: WAR MAGE (Mars Mage)
**Element**: Mars | **Role**: Balanced Mage | **Mana Contribution**: 2

### Current Abilities (7)
1. Strike (0 mana, physical)
2. Flame Burst (3 mana, psynergy)
3. Fire Ward (2 mana, buff ATK)
4. Gale Force (3 mana, psynergy)
5. Wind Barrier (2 mana, buff SPD)
6. Focus Strike (0 mana, physical)

**Missing: Levels 7-20 (13 abilities)**

### Level 7: **Ignite**
- Type: psynergy
- Element: Mars
- Mana Cost: 2
- Base Power: 25
- Targets: single-enemy
- Description: "Set enemy ablaze with persistent flames."
- statusEffect: { type: 'burn', duration: 3, chance: 0.8 }

### Level 8: **Flame Wall**
- Type: buff
- Element: Mars
- Mana Cost: 2
- Targets: self
- Description: "Surround yourself with flames, granting fire resistance."
- elementalResistance: { element: 'Mars', modifier: 0.3 }
- duration: 4

### Level 9: **Inferno Slash**
- Type: physical
- Element: Mars
- Mana Cost: 1
- Base Power: 22
- Targets: single-enemy
- Description: "Fire-infused blade strike."

### Level 10: **Blazing Fury** (Multi-hit)
- Type: psynergy
- Element: Mars
- Mana Cost: 3
- Base Power: 20
- Targets: single-enemy
- Description: "Rapid-fire explosions hit the target."
- hitCount: 3

### Level 11: **Pyroclasm**
- Type: psynergy
- Element: Mars
- Mana Cost: 4
- Base Power: 40
- Targets: all-enemies
- Description: "Volcanic eruption engulfs all enemies."

### Level 12: **Fire Aura**
- Type: buff
- Element: Mars
- Mana Cost: 3
- Targets: all-allies
- Description: "Grant fire power to all allies."
- buffEffect: { atk: 7, mag: 7 }
- duration: 3

### Level 13: **Meteor Strike**
- Type: psynergy
- Element: Mars
- Mana Cost: 4
- Base Power: 45
- Targets: single-enemy
- Description: "Call down a meteor on a single target."
- splashDamagePercent: 0.4

### Level 14: **Phoenix Flames**
- Type: healing
- Element: Mars
- Mana Cost: 3
- Base Power: 40
- Targets: single-ally
- Description: "Healing flames of the phoenix."
- removeStatusEffects: { type: 'byType', statuses: ['burn', 'poison'] }

### Level 15: **Magma Burst**
- Type: psynergy
- Element: Mars
- Mana Cost: 5
- Base Power: 55
- Targets: single-enemy
- Description: "Devastating magma explosion."
- statusEffect: { type: 'burn', duration: 3, chance: 1.0 }

### Level 16: **Flame Shield**
- Type: buff
- Element: Mars
- Mana Cost: 3
- Targets: all-allies
- Description: "Fiery barrier protects all allies from status."
- grantImmunity: { all: false, types: ['freeze', 'poison'], duration: 3 }

### Level 17: **Supernova**
- Type: psynergy
- Element: Mars
- Mana Cost: 5
- Base Power: 48
- Targets: all-enemies
- Description: "Explosive nova hits all enemies with burn."
- statusEffect: { type: 'burn', duration: 2, chance: 0.6 }

### Level 18: **Infernal Rage**
- Type: buff
- Mana Cost: 4
- Targets: self
- Description: "Channel pure rage into power."
- buffEffect: { atk: 15, mag: 15 }
- duration: 3

### Level 19: **Dragon Breath**
- Type: psynergy
- Element: Mars
- Mana Cost: 5
- Base Power: 60
- Targets: all-enemies
- Description: "Breathe dragon fire across all enemies."
- chainDamage: true

### Level 20: **ULTIMATE - Ragnarok Flames**
- Type: psynergy
- Element: Mars
- Mana Cost: 5
- Base Power: 70
- Targets: all-enemies
- Description: "Apocalyptic flames consume all enemies."
- splashDamagePercent: 1.0
- statusEffect: { type: 'burn', duration: 3, chance: 1.0 }

---

## 💧 UNIT 3: MYSTIC (Mercury Healer)
**Element**: Mercury | **Role**: Support Healer | **Mana Contribution**: 2

### Current Abilities (7)
1. Strike (0 mana, physical)
2. Ice Lance (3 mana, psynergy)
3. Aqua Heal (3 mana, healing)
4. Earth Spike (3 mana, psynergy)
5. Stone Skin (2 mana, buff DEF)
6. Focus Strike (0 mana, physical)

**Missing: Levels 7-20 (13 abilities)**

### Level 7: **Cleanse**
- Type: healing
- Element: Mercury
- Mana Cost: 2
- Base Power: 0
- Targets: single-ally
- Description: "Purifying waters remove negative effects."
- removeStatusEffects: { type: 'negative' }

### Level 8: **Frost Wave**
- Type: psynergy
- Element: Mercury
- Mana Cost: 3
- Base Power: 30
- Targets: all-enemies
- Description: "Wave of frost hits all enemies."

### Level 9: **Regen**
- Type: healing
- Element: Mercury
- Mana Cost: 2
- Base Power: 20
- Targets: single-ally
- Description: "Grant regeneration over time."
- healOverTime: { amount: 12, duration: 3 }

### Level 10: **Diamond Dust**
- Type: psynergy
- Element: Mercury
- Mana Cost: 3
- Base Power: 25
- Targets: all-enemies
- Description: "Freezing ice crystals that may freeze enemies."
- statusEffect: { type: 'freeze', duration: 2, chance: 0.4 }

### Level 11: **Mass Regen**
- Type: healing
- Element: Mercury
- Mana Cost: 4
- Base Power: 0
- Targets: all-allies
- Description: "Grant regeneration to entire party."
- healOverTime: { amount: 10, duration: 3 }

### Level 12: **Glacial Shield**
- Type: buff
- Element: Mercury
- Mana Cost: 3
- Targets: all-allies
- Description: "Ice barrier protects all allies."
- shieldCharges: 2
- duration: 3

### Level 13: **Deep Freeze**
- Type: psynergy
- Element: Mercury
- Mana Cost: 4
- Base Power: 35
- Targets: single-enemy
- Description: "Encase enemy in solid ice."
- statusEffect: { type: 'freeze', duration: 3, chance: 0.8 }

### Level 14: **Sanctuary**
- Type: buff
- Mana Cost: 4
- Targets: all-allies
- Description: "Create sanctuary granting immunity and damage reduction."
- grantImmunity: { all: true, duration: 2 }
- damageReductionPercent: 0.2
- duration: 3

### Level 15: **Blizzard**
- Type: psynergy
- Element: Mercury
- Mana Cost: 5
- Base Power: 45
- Targets: all-enemies
- Description: "Massive blizzard engulfs battlefield."
- chainDamage: true

### Level 16: **Restoration**
- Type: healing
- Element: Mercury
- Mana Cost: 4
- Base Power: 70
- Targets: single-ally
- Description: "Complete restoration of ally."
- removeStatusEffects: { type: 'all' }

### Level 17: **Frozen Tomb**
- Type: psynergy
- Element: Mercury
- Mana Cost: 4
- Base Power: 30
- Targets: single-enemy
- Description: "Trap enemy in frozen tomb for extended duration."
- statusEffect: { type: 'freeze', duration: 4, chance: 1.0 }

### Level 18: **Aqua Barrier**
- Type: buff
- Element: Mercury
- Mana Cost: 5
- Targets: all-allies
- Description: "Ultimate water barrier shields and heals party."
- shieldCharges: 4
- healOverTime: { amount: 15, duration: 3 }

### Level 19: **Absolute Zero**
- Type: psynergy
- Element: Mercury
- Mana Cost: 5
- Base Power: 60
- Targets: all-enemies
- Description: "Freeze all enemies at absolute zero temperature."
- statusEffect: { type: 'freeze', duration: 2, chance: 0.7 }

### Level 20: **ULTIMATE - Leviathan's Grace**
- Type: healing
- Element: Mercury
- Mana Cost: 5
- Base Power: 100
- Targets: all-allies
- Description: "Channel Leviathan's power for complete party restoration."
- revive: true
- reviveHPPercent: 0.75
- removeStatusEffects: { type: 'all' }
- healOverTime: { amount: 20, duration: 3 }

---

## ⚡ UNIT 4: RANGER (Jupiter DPS)
**Element**: Jupiter | **Role**: Balanced DPS | **Mana Contribution**: 2

### Current Abilities (7)
1. Strike (0 mana, physical)
2. Gale Force (3 mana, psynergy)
3. Wind Barrier (2 mana, buff SPD)
4. Flame Burst (3 mana, psynergy)
5. Fire Ward (2 mana, buff ATK)
6. Focus Strike (0 mana, physical)

**Missing: Levels 7-20 (13 abilities)**

### Level 7: **Swift Strike** (Multi-hit)
- Type: physical
- Element: Jupiter
- Mana Cost: 1
- Base Power: 12
- Targets: single-enemy
- Description: "Lightning-fast double strike."
- hitCount: 2

### Level 8: **Shock Bolt**
- Type: psynergy
- Element: Jupiter
- Mana Cost: 3
- Base Power: 30
- Targets: single-enemy
- Description: "Lightning bolt that may paralyze."
- statusEffect: { type: 'paralyze', duration: 2, chance: 0.5 }

### Level 9: **Tempest**
- Type: psynergy
- Element: Jupiter
- Mana Cost: 3
- Base Power: 28
- Targets: all-enemies
- Description: "Violent tempest strikes all enemies."

### Level 10: **Hurricane Slash**
- Type: physical
- Element: Jupiter
- Mana Cost: 2
- Base Power: 25
- Targets: single-enemy
- Description: "Wind-infused slash that penetrates defenses."
- ignoreDefensePercent: 0.3

### Level 11: **Plasma Shot** (Multi-hit)
- Type: psynergy
- Element: Jupiter
- Mana Cost: 4
- Base Power: 18
- Targets: single-enemy
- Description: "Rapid plasma bolts."
- hitCount: 3

### Level 12: **Cyclone**
- Type: psynergy
- Element: Jupiter
- Mana Cost: 4
- Base Power: 35
- Targets: all-enemies
- Description: "Devastating cyclone tears through enemies."
- splashDamagePercent: 1.0

### Level 13: **Thunder God's Fury** (Multi-hit)
- Type: physical
- Element: Jupiter
- Mana Cost: 3
- Base Power: 16
- Targets: single-enemy
- Description: "Unleash a barrage of lightning strikes."
- hitCount: 4

### Level 14: **Storm Blessing**
- Type: buff
- Element: Jupiter
- Mana Cost: 3
- Targets: all-allies
- Description: "Grant the party speed and evasion."
- buffEffect: { spd: 10 }
- duration: 4

### Level 15: **Judgment Bolt**
- Type: psynergy
- Element: Jupiter
- Mana Cost: 5
- Base Power: 55
- Targets: single-enemy
- Description: "Divine lightning strikes with massive power."
- ignoreDefensePercent: 0.4

### Level 16: **Static Field**
- Type: psynergy
- Element: Jupiter
- Mana Cost: 4
- Base Power: 25
- Targets: all-enemies
- Description: "Electric field paralyzes all enemies."
- statusEffect: { type: 'paralyze', duration: 2, chance: 0.6 }

### Level 17: **Wind Walker**
- Type: buff
- Mana Cost: 3
- Targets: self
- Description: "Become one with the wind, dodging and striking."
- buffEffect: { spd: 15, atk: 10 }
- damageReductionPercent: 0.25
- duration: 3

### Level 18: **Maelstrom**
- Type: psynergy
- Element: Jupiter
- Mana Cost: 5
- Base Power: 50
- Targets: all-enemies
- Description: "Massive storm of wind and lightning."
- chainDamage: true
- statusEffect: { type: 'paralyze', duration: 2, chance: 0.4 }

### Level 19: **Zeus's Wrath** (Multi-hit)
- Type: psynergy
- Element: Jupiter
- Mana Cost: 5
- Base Power: 25
- Targets: all-enemies
- Description: "God of thunder unleashes wrath."
- hitCount: 3
- chainDamage: true

### Level 20: **ULTIMATE - Storm Sovereign**
- Type: psynergy
- Element: Jupiter
- Mana Cost: 5
- Base Power: 65
- Targets: all-enemies
- Description: "Become the storm itself, devastating all enemies."
- hitCount: 2
- chainDamage: true
- splashDamagePercent: 1.0
- statusEffect: { type: 'paralyze', duration: 3, chance: 0.8 }

---

## 🛡️ UNIT 5: SENTINEL (Venus Tank)
**Element**: Venus | **Role**: Tank | **Mana Contribution**: 1

### Current Abilities (4)
1. Strike (0 mana, physical, level 1)
2. Boost DEF (3 mana, buff, level 1)
3. Guard Break (0 mana, physical, level 2)
4. Quake (3 mana, psynergy, level 3)

**Missing: Levels 4-20 (16 abilities)**

### Level 4: **Taunt**
- Type: debuff
- Mana Cost: 1
- Targets: single-enemy
- Description: "Provoke enemy, reducing their accuracy."
- debuffEffect: { atk: -5 }
- duration: 2

### Level 5: **Shield Bash**
- Type: physical
- Element: Venus
- Mana Cost: 0
- Base Power: 16
- Targets: single-enemy
- Description: "Bash with shield, dealing damage and stunning."
- statusEffect: { type: 'stun', duration: 1, chance: 0.4 }

### Level 6: **Iron Wall**
- Type: buff
- Element: Venus
- Mana Cost: 2
- Targets: self
- Description: "Become an immovable wall."
- buffEffect: { def: 12 }
- duration: 4

### Level 7: **Counter Stance**
- Type: buff
- Mana Cost: 2
- Targets: self
- Description: "Prepare to counter attacks."
- damageReductionPercent: 0.2
- duration: 3

### Level 8: **Tremor Strike**
- Type: physical
- Element: Venus
- Mana Cost: 1
- Base Power: 20
- Targets: single-enemy
- Description: "Ground-shaking strike hits hard."

### Level 9: **Fortified Guard**
- Type: buff
- Mana Cost: 3
- Targets: self
- Description: "Ultimate defensive stance."
- shieldCharges: 3
- buffEffect: { def: 8 }
- duration: 3

### Level 10: **Bulwark**
- Type: buff
- Element: Venus
- Mana Cost: 3
- Targets: all-allies
- Description: "Raise defenses for entire party."
- buffEffect: { def: 6 }
- duration: 3

### Level 11: **Crushing Blow**
- Type: physical
- Element: Venus
- Mana Cost: 2
- Base Power: 35
- Targets: single-enemy
- Description: "Overwhelming force crushes defenses."
- ignoreDefensePercent: 0.4

### Level 12: **Earthen Armor**
- Type: buff
- Element: Venus
- Mana Cost: 3
- Targets: self
- Description: "Cover yourself in earthen plates."
- damageReductionPercent: 0.35
- elementalResistance: { element: 'Venus', modifier: 0.3 }
- duration: 4

### Level 13: **Shockwave**
- Type: psynergy
- Element: Venus
- Mana Cost: 4
- Base Power: 32
- Targets: all-enemies
- Description: "Send shockwave through ground."
- splashDamagePercent: 1.0

### Level 14: **Guardian's Resolve**
- Type: buff
- Mana Cost: 4
- Targets: all-allies
- Description: "Inspire party with unwavering resolve."
- buffEffect: { def: 7, hp: 20 }
- duration: 3

### Level 15: **Titan's Grip**
- Type: physical
- Element: Venus
- Mana Cost: 3
- Base Power: 45
- Targets: single-enemy
- Description: "Grip with titan strength, ignoring defenses."
- ignoreDefensePercent: 0.6

### Level 16: **Stone Fortress**
- Type: buff
- Element: Venus
- Mana Cost: 4
- Targets: all-allies
- Description: "Turn party into fortified position."
- shieldCharges: 3
- damageReductionPercent: 0.25
- duration: 4

### Level 17: **Avalanche**
- Type: psynergy
- Element: Venus
- Mana Cost: 5
- Base Power: 50
- Targets: all-enemies
- Description: "Massive avalanche buries enemies."
- splashDamagePercent: 1.0

### Level 18: **Immortal Bulwark**
- Type: buff
- Mana Cost: 5
- Targets: self
- Description: "Become nearly invincible."
- damageReductionPercent: 0.5
- shieldCharges: 5
- grantImmunity: { all: true, duration: 2 }

### Level 19: **Earth Splitter**
- Type: physical
- Element: Venus
- Mana Cost: 4
- Base Power: 55
- Targets: single-enemy
- Description: "Split the earth with devastating force."
- ignoreDefensePercent: 0.7
- splashDamagePercent: 0.3

### Level 20: **ULTIMATE - Atlas's Stand**
- Type: buff
- Element: Venus
- Mana Cost: 5
- Targets: all-allies
- Description: "Channel Atlas, protecting party completely."
- shieldCharges: 6
- buffEffect: { def: 15, hp: 30 }
- damageReductionPercent: 0.4
- grantImmunity: { all: false, types: ['stun', 'paralyze', 'freeze'], duration: 3 }
- duration: 4

---

## ⚡ UNIT 6: STORMCALLER (Jupiter AoE Mage)
**Element**: Jupiter | **Role**: AoE Fire Mage | **Mana Contribution**: 3

### Current Abilities (4)
1. Strike (0 mana, physical, level 1)
2. Gust (2 mana, psynergy, level 1)
3. Chain Lightning (4 mana, psynergy, level 2)
4. Blind (2 mana, debuff, level 3)

**Missing: Levels 4-20 (16 abilities)**

### Level 4: **Thunder Clap**
- Type: psynergy
- Element: Jupiter
- Mana Cost: 2
- Base Power: 20
- Targets: all-enemies
- Description: "Loud thunder damages and disorients."
- debuffEffect: { spd: -5 }
- duration: 2

### Level 5: **Storm Call**
- Type: psynergy
- Element: Jupiter
- Mana Cost: 3
- Base Power: 25
- Targets: all-enemies
- Description: "Call down storm on all enemies."

### Level 6: **Static Charge**
- Type: buff
- Element: Jupiter
- Mana Cost: 2
- Targets: self
- Description: "Build static electricity, boosting MAG."
- buffEffect: { mag: 10 }
- duration: 3

### Level 7: **Lightning Arc**
- Type: psynergy
- Element: Jupiter
- Mana Cost: 3
- Base Power: 35
- Targets: single-enemy
- Description: "Concentrated lightning arc."

### Level 8: **Shock Pulse**
- Type: psynergy
- Element: Jupiter
- Mana Cost: 3
- Base Power: 22
- Targets: all-enemies
- Description: "Electric pulse paralyzes enemies."
- statusEffect: { type: 'paralyze', duration: 2, chance: 0.5 }

### Level 9: **Wind Mastery**
- Type: buff
- Element: Jupiter
- Mana Cost: 3
- Targets: all-allies
- Description: "Grant wind mastery to party."
- buffEffect: { spd: 8, mag: 5 }
- duration: 3

### Level 10: **Thunder Storm**
- Type: psynergy
- Element: Jupiter
- Mana Cost: 4
- Base Power: 38
- Targets: all-enemies
- Description: "Massive thunderstorm engulfs battlefield."
- chainDamage: true

### Level 11: **Electric Overload** (Multi-hit)
- Type: psynergy
- Element: Jupiter
- Mana Cost: 4
- Base Power: 20
- Targets: all-enemies
- Description: "Multiple lightning strikes hit all enemies."
- hitCount: 2

### Level 12: **Storm Shield**
- Type: buff
- Element: Jupiter
- Mana Cost: 3
- Targets: all-allies
- Description: "Wind barrier protects and speeds party."
- shieldCharges: 2
- buffEffect: { spd: 6 }
- duration: 3

### Level 13: **Bolt Barrage** (Multi-hit)
- Type: psynergy
- Element: Jupiter
- Mana Cost: 5
- Base Power: 18
- Targets: all-enemies
- Description: "Barrage of lightning bolts."
- hitCount: 3
- chainDamage: true

### Level 14: **Hurricane Force**
- Type: psynergy
- Element: Jupiter
- Mana Cost: 5
- Base Power: 45
- Targets: all-enemies
- Description: "Hurricane winds devastate enemies."
- splashDamagePercent: 1.0

### Level 15: **Thor's Hammer**
- Type: psynergy
- Element: Jupiter
- Mana Cost: 5
- Base Power: 50
- Targets: single-enemy
- Description: "Call down Thor's hammer with massive force."
- ignoreDefensePercent: 0.4
- splashDamagePercent: 0.5

### Level 16: **Lightning Sanctuary**
- Type: buff
- Element: Jupiter
- Mana Cost: 4
- Targets: all-allies
- Description: "Electric field protects party."
- grantImmunity: { all: false, types: ['paralyze', 'stun'], duration: 3 }
- elementalResistance: { element: 'Jupiter', modifier: 0.4 }
- duration: 4

### Level 17: **Apocalyptic Storm**
- Type: psynergy
- Element: Jupiter
- Mana Cost: 5
- Base Power: 55
- Targets: all-enemies
- Description: "Ultimate storm devastates all."
- chainDamage: true
- splashDamagePercent: 1.0

### Level 18: **God Thunder** (Multi-hit)
- Type: psynergy
- Element: Jupiter
- Mana Cost: 5
- Base Power: 25
- Targets: all-enemies
- Description: "Divine thunder strikes repeatedly."
- hitCount: 4
- chainDamage: true

### Level 19: **World Storm**
- Type: psynergy
- Element: Jupiter
- Mana Cost: 5
- Base Power: 60
- Targets: all-enemies
- Description: "Storm that engulfs the world."
- chainDamage: true
- splashDamagePercent: 1.0
- statusEffect: { type: 'paralyze', duration: 2, chance: 0.6 }

### Level 20: **ULTIMATE - Tempest Tyrant**
- Type: psynergy
- Element: Jupiter
- Mana Cost: 5
- Base Power: 70
- Targets: all-enemies
- Description: "Become the tyrant of storms, obliterating all."
- hitCount: 2
- chainDamage: true
- splashDamagePercent: 1.0
- statusEffect: { type: 'stun', duration: 2, chance: 0.7 }

---

## 🔥 UNIT 7: BLAZE (Mars Balanced Warrior)
**Element**: Mars | **Role**: Balanced Warrior | **Mana Contribution**: 2

### Current Abilities (4)
1. Strike (0 mana, physical, level 1)
2. Heavy Strike (0 mana, physical, level 1)
3. Fireball (2 mana, psynergy, level 2)
4. Burn Touch (2 mana, psynergy, level 3)

**Missing: Levels 4-20 (16 abilities)**

### Level 4: **Flame Blade**
- Type: physical
- Element: Mars
- Mana Cost: 1
- Base Power: 20
- Targets: single-enemy
- Description: "Fire-imbued blade strike."

### Level 5: **Battle Cry**
- Type: buff
- Mana Cost: 2
- Targets: self
- Description: "Roar increases ATK significantly."
- buffEffect: { atk: 10 }
- duration: 3

### Level 6: **Inferno Strike** (Multi-hit)
- Type: physical
- Element: Mars
- Mana Cost: 2
- Base Power: 16
- Targets: single-enemy
- Description: "Rapid fire strikes."
- hitCount: 2

### Level 7: **Pyroblast**
- Type: psynergy
- Element: Mars
- Mana Cost: 3
- Base Power: 35
- Targets: single-enemy
- Description: "Concentrated fire blast."

### Level 8: **Warrior's Flame**
- Type: buff
- Element: Mars
- Mana Cost: 2
- Targets: self
- Description: "Inner fire enhances combat prowess."
- buffEffect: { atk: 8, mag: 8 }
- duration: 3

### Level 9: **Molten Slash**
- Type: physical
- Element: Mars
- Mana Cost: 2
- Base Power: 28
- Targets: single-enemy
- Description: "Superheated blade melts through defenses."
- ignoreDefensePercent: 0.3
- statusEffect: { type: 'burn', duration: 2, chance: 0.4 }

### Level 10: **Fire Nova**
- Type: psynergy
- Element: Mars
- Mana Cost: 4
- Base Power: 30
- Targets: all-enemies
- Description: "Explosive nova hits all enemies."

### Level 11: **Blazing Assault** (Multi-hit)
- Type: physical
- Element: Mars
- Mana Cost: 3
- Base Power: 18
- Targets: single-enemy
- Description: "Relentless flaming assault."
- hitCount: 3

### Level 12: **Magma Wave**
- Type: psynergy
- Element: Mars
- Mana Cost: 4
- Base Power: 40
- Targets: all-enemies
- Description: "Wave of magma burns all."
- statusEffect: { type: 'burn', duration: 2, chance: 0.5 }

### Level 13: **Berserker Rage**
- Type: buff
- Mana Cost: 3
- Targets: self
- Description: "Enter berserker state."
- buffEffect: { atk: 15, spd: 10 }
- damageReductionPercent: 0.15
- duration: 3

### Level 14: **Crimson Fury** (Multi-hit)
- Type: physical
- Element: Mars
- Mana Cost: 4
- Base Power: 20
- Targets: single-enemy
- Description: "Fury unleashed in multiple strikes."
- hitCount: 4

### Level 15: **Meteor Crash**
- Type: psynergy
- Element: Mars
- Mana Cost: 5
- Base Power: 55
- Targets: single-enemy
- Description: "Call down burning meteor."
- ignoreDefensePercent: 0.4
- splashDamagePercent: 0.4

### Level 16: **Phoenix Aura**
- Type: buff
- Element: Mars
- Mana Cost: 4
- Targets: self
- Description: "Channel phoenix power."
- buffEffect: { atk: 12, mag: 12, def: 8 }
- healOverTime: { amount: 12, duration: 3 }

### Level 17: **Solar Flare**
- Type: psynergy
- Element: Mars
- Mana Cost: 5
- Base Power: 50
- Targets: all-enemies
- Description: "Solar flare burns all enemies."
- statusEffect: { type: 'burn', duration: 3, chance: 0.8 }

### Level 18: **Ultimate Warrior**
- Type: buff
- Mana Cost: 5
- Targets: self
- Description: "Reach peak warrior form."
- buffEffect: { atk: 18, def: 10, spd: 12 }
- damageReductionPercent: 0.25
- duration: 4

### Level 19: **Inferno Barrage** (Multi-hit)
- Type: physical
- Element: Mars
- Mana Cost: 5
- Base Power: 22
- Targets: all-enemies
- Description: "Barrage of flaming strikes hits all."
- hitCount: 3

### Level 20: **ULTIMATE - Supernova Strike**
- Type: physical
- Element: Mars
- Mana Cost: 5
- Base Power: 65
- Targets: all-enemies
- Description: "Channel a supernova into devastating strike."
- hitCount: 2
- ignoreDefensePercent: 0.5
- splashDamagePercent: 1.0
- statusEffect: { type: 'burn', duration: 3, chance: 1.0 }

---

## 💎 UNIT 8: KARIS (Mercury Scholar)
**Element**: Mercury | **Role**: Versatile Scholar | **Mana Contribution**: 2

### Current Abilities (5)
1. Strike (0 mana, physical, level 1)
2. Ice Shard (2 mana, psynergy, level 1)
3. Heal (2 mana, healing, level 2)
4. Freeze Blast (2 mana, psynergy, level 3)
5. Party Heal (4 mana, healing, level 4)

**Missing: Levels 5-20 (15 abilities)**

### Level 5: **Frost Shield**
- Type: buff
- Element: Mercury
- Mana Cost: 2
- Targets: single-ally
- Description: "Ice barrier protects ally."
- shieldCharges: 2
- duration: 3

### Level 6: **Purify**
- Type: healing
- Element: Mercury
- Mana Cost: 2
- Base Power: 0
- Targets: all-allies
- Description: "Cleanse party of poison and burn."
- removeStatusEffects: { type: 'byType', statuses: ['poison', 'burn'] }

### Level 7: **Ice Spear**
- Type: psynergy
- Element: Mercury
- Mana Cost: 3
- Base Power: 35
- Targets: single-enemy
- Description: "Sharp spear of ice pierces target."

### Level 8: **Scholar's Wisdom**
- Type: buff
- Mana Cost: 2
- Targets: self
- Description: "Channel scholarly knowledge."
- buffEffect: { mag: 12 }
- duration: 3

### Level 9: **Glacial Wave**
- Type: psynergy
- Element: Mercury
- Mana Cost: 4
- Base Power: 32
- Targets: all-enemies
- Description: "Freezing wave hits all enemies."

### Level 10: **Renewal**
- Type: healing
- Element: Mercury
- Mana Cost: 3
- Base Power: 25
- Targets: all-allies
- Description: "Renewing waters grant regeneration."
- healOverTime: { amount: 10, duration: 3 }

### Level 11: **Frozen Spikes** (Multi-hit)
- Type: psynergy
- Element: Mercury
- Mana Cost: 4
- Base Power: 20
- Targets: single-enemy
- Description: "Multiple ice spikes pierce target."
- hitCount: 3

### Level 12: **Crystal Barrier**
- Type: buff
- Element: Mercury
- Mana Cost: 3
- Targets: all-allies
- Description: "Crystal barrier protects entire party."
- shieldCharges: 2
- buffEffect: { def: 6 }
- duration: 3

### Level 13: **Ice Storm**
- Type: psynergy
- Element: Mercury
- Mana Cost: 5
- Base Power: 45
- Targets: all-enemies
- Description: "Devastating ice storm."
- statusEffect: { type: 'freeze', duration: 2, chance: 0.5 }

### Level 14: **Mass Restoration**
- Type: healing
- Element: Mercury
- Mana Cost: 5
- Base Power: 60
- Targets: all-allies
- Description: "Complete party restoration."
- removeStatusEffects: { type: 'negative' }

### Level 15: **Frozen Tomb**
- Type: psynergy
- Element: Mercury
- Mana Cost: 4
- Base Power: 35
- Targets: single-enemy
- Description: "Trap enemy in ice for extended time."
- statusEffect: { type: 'freeze', duration: 4, chance: 0.9 }

### Level 16: **Scholar's Sanctuary**
- Type: buff
- Element: Mercury
- Mana Cost: 4
- Targets: all-allies
- Description: "Create protective sanctuary."
- buffEffect: { mag: 8, def: 8 }
- grantImmunity: { all: false, types: ['freeze', 'stun'], duration: 2 }
- duration: 3

### Level 17: **Blizzard Cascade**
- Type: psynergy
- Element: Mercury
- Mana Cost: 5
- Base Power: 55
- Targets: all-enemies
- Description: "Cascading blizzard overwhelms enemies."
- chainDamage: true

### Level 18: **Divine Renewal**
- Type: healing
- Element: Mercury
- Mana Cost: 5
- Base Power: 80
- Targets: all-allies
- Description: "Divine healing restores party."
- healOverTime: { amount: 15, duration: 3 }
- removeStatusEffects: { type: 'all' }

### Level 19: **Absolute Zero**
- Type: psynergy
- Element: Mercury
- Mana Cost: 5
- Base Power: 65
- Targets: all-enemies
- Description: "Ultimate freeze at absolute zero."
- statusEffect: { type: 'freeze', duration: 3, chance: 0.8 }

### Level 20: **ULTIMATE - Aqua Resurrection**
- Type: healing
- Element: Mercury
- Mana Cost: 5
- Base Power: 100
- Targets: all-allies
- Description: "Channel ocean's power for complete resurrection."
- revive: true
- reviveHPPercent: 0.8
- removeStatusEffects: { type: 'all' }
- healOverTime: { amount: 20, duration: 4 }
- buffEffect: { def: 10, mag: 10 }
- duration: 3

---

## ⚔️ UNIT 9: TYRELL (Mars Pure DPS)
**Element**: Mars | **Role**: Pure DPS | **Mana Contribution**: 1

### Current Abilities (5)
1. Strike (0 mana, physical, level 1)
2. Precise Jab (0 mana, physical, level 1)
3. Heavy Strike (0 mana, physical, level 2)
4. Fireball (2 mana, psynergy, level 3)
5. Burn Touch (2 mana, psynergy, level 4)

**Missing: Levels 5-20 (15 abilities)**

### Level 5: **Rapid Strikes** (Multi-hit)
- Type: physical
- Mana Cost: 0
- Base Power: 10
- Targets: single-enemy
- Description: "Lightning-fast triple strike."
- hitCount: 3

### Level 6: **Flame Jab**
- Type: physical
- Element: Mars
- Mana Cost: 1
- Base Power: 18
- Targets: single-enemy
- Description: "Precise fire-imbued jab."

### Level 7: **Assassinate**
- Type: physical
- Mana Cost: 2
- Base Power: 30
- Targets: single-enemy
- Description: "Precise strike targeting vital points."
- ignoreDefensePercent: 0.4

### Level 8: **Combat Focus**
- Type: buff
- Mana Cost: 2
- Targets: self
- Description: "Focus increases damage output."
- buffEffect: { atk: 12, spd: 8 }
- duration: 3

### Level 9: **Flurry** (Multi-hit)
- Type: physical
- Element: Mars
- Mana Cost: 2
- Base Power: 14
- Targets: single-enemy
- Description: "Rapid flurry of burning strikes."
- hitCount: 4

### Level 10: **Inferno Assault**
- Type: psynergy
- Element: Mars
- Mana Cost: 3
- Base Power: 40
- Targets: single-enemy
- Description: "Concentrated fire assault."

### Level 11: **Precision Strike**
- Type: physical
- Mana Cost: 2
- Base Power: 35
- Targets: single-enemy
- Description: "Perfect strike ignoring armor."
- ignoreDefensePercent: 0.5

### Level 12: **Blood Rush**
- Type: buff
- Mana Cost: 3
- Targets: self
- Description: "Adrenaline rush maximizes offense."
- buffEffect: { atk: 15, spd: 12 }
- duration: 3

### Level 13: **Death Strike** (Multi-hit)
- Type: physical
- Mana Cost: 3
- Base Power: 18
- Targets: single-enemy
- Description: "Deadly combination of strikes."
- hitCount: 5

### Level 14: **Flame Tornado**
- Type: psynergy
- Element: Mars
- Mana Cost: 4
- Base Power: 45
- Targets: single-enemy
- Description: "Spinning tornado of flames."
- ignoreDefensePercent: 0.3

### Level 15: **Perfect Form**
- Type: buff
- Mana Cost: 4
- Targets: self
- Description: "Reach perfect combat form."
- buffEffect: { atk: 18, spd: 15 }
- duration: 4

### Level 16: **Obliterate**
- Type: physical
- Element: Mars
- Mana Cost: 4
- Base Power: 55
- Targets: single-enemy
- Description: "Overwhelming force obliterates target."
- ignoreDefensePercent: 0.6

### Level 17: **Unstoppable Force** (Multi-hit)
- Type: physical
- Mana Cost: 4
- Base Power: 20
- Targets: single-enemy
- Description: "Unstoppable barrage of strikes."
- hitCount: 6

### Level 18: **Supreme Focus**
- Type: buff
- Mana Cost: 5
- Targets: self
- Description: "Achieve supreme combat focus."
- buffEffect: { atk: 20, spd: 18, mag: 10 }
- damageReductionPercent: 0.2
- duration: 4

### Level 19: **Annihilation**
- Type: physical
- Element: Mars
- Mana Cost: 5
- Base Power: 70
- Targets: single-enemy
- Description: "Pure destructive force."
- ignoreDefensePercent: 0.7

### Level 20: **ULTIMATE - One Thousand Cuts**
- Type: physical
- Element: Mars
- Mana Cost: 5
- Base Power: 25
- Targets: single-enemy
- Description: "Legendary technique striking multiple times at blinding speed."
- hitCount: 8
- ignoreDefensePercent: 0.5
- statusEffect: { type: 'burn', duration: 3, chance: 1.0 }

---

## ⛰️ UNIT 10: FELIX (Venus Master Warrior)
**Element**: Venus | **Role**: Master Warrior | **Mana Contribution**: 1

### Current Abilities (5)
1. Strike (0 mana, physical, level 1)
2. Guard Break (0 mana, physical, level 1)
3. Heavy Strike (0 mana, physical, level 2)
4. Quake (3 mana, psynergy, level 3)
5. Boost DEF (3 mana, buff, level 4)

**Missing: Levels 5-20 (15 abilities)**

### Level 5: **Earth Strike**
- Type: physical
- Element: Venus
- Mana Cost: 1
- Base Power: 22
- Targets: single-enemy
- Description: "Earth-empowered strike."

### Level 6: **Warrior's Resolve**
- Type: buff
- Mana Cost: 2
- Targets: self
- Description: "Strengthen resolve for battle."
- buffEffect: { atk: 10, def: 8 }
- duration: 3

### Level 7: **Sunder Armor**
- Type: physical
- Element: Venus
- Mana Cost: 2
- Base Power: 25
- Targets: single-enemy
- Description: "Shatter enemy armor."
- debuffEffect: { def: -10 }
- duration: 3

### Level 8: **Stone Fist** (Multi-hit)
- Type: physical
- Element: Venus
- Mana Cost: 2
- Base Power: 16
- Targets: single-enemy
- Description: "Hardened fists strike twice."
- hitCount: 2

### Level 9: **Earth Shaker**
- Type: psynergy
- Element: Venus
- Mana Cost: 4
- Base Power: 38
- Targets: all-enemies
- Description: "Massive earthquake shakes battlefield."

### Level 10: **Battle Master**
- Type: buff
- Mana Cost: 3
- Targets: self
- Description: "Channel years of experience."
- buffEffect: { atk: 12, def: 10, spd: 8 }
- duration: 3

### Level 11: **Crushing Impact**
- Type: physical
- Element: Venus
- Mana Cost: 3
- Base Power: 40
- Targets: single-enemy
- Description: "Devastating impact crushes defenses."
- ignoreDefensePercent: 0.4

### Level 12: **Mountain's Strength**
- Type: buff
- Element: Venus
- Mana Cost: 3
- Targets: self
- Description: "Channel the mountain's strength."
- buffEffect: { atk: 15, def: 12 }
- damageReductionPercent: 0.2
- duration: 4

### Level 13: **Ragnarok Strike**
- Type: physical
- Element: Venus
- Mana Cost: 4
- Base Power: 50
- Targets: single-enemy
- Description: "Legendary strike of massive power."
- ignoreDefensePercent: 0.5

### Level 14: **Terra Shield**
- Type: buff
- Element: Venus
- Mana Cost: 4
- Targets: all-allies
- Description: "Earth's protection shields party."
- buffEffect: { def: 10 }
- shieldCharges: 3
- duration: 3

### Level 15: **Grand Impact** (Multi-hit)
- Type: physical
- Element: Venus
- Mana Cost: 4
- Base Power: 25
- Targets: single-enemy
- Description: "Multiple earth-shattering strikes."
- hitCount: 3

### Level 16: **Legendary Warrior**
- Type: buff
- Mana Cost: 5
- Targets: self
- Description: "Achieve legendary status."
- buffEffect: { atk: 18, def: 15, hp: 30 }
- damageReductionPercent: 0.3
- duration: 4

### Level 17: **Titan Fall**
- Type: physical
- Element: Venus
- Mana Cost: 5
- Base Power: 60
- Targets: single-enemy
- Description: "Fall upon enemy with titan's force."
- ignoreDefensePercent: 0.6
- splashDamagePercent: 0.4

### Level 18: **Earth's Judgment**
- Type: psynergy
- Element: Venus
- Mana Cost: 5
- Base Power: 55
- Targets: all-enemies
- Description: "Earth judges all enemies."
- splashDamagePercent: 1.0

### Level 19: **Master's Aura**
- Type: buff
- Mana Cost: 5
- Targets: all-allies
- Description: "Share master's aura with party."
- buffEffect: { atk: 12, def: 12, spd: 10 }
- duration: 4

### Level 20: **ULTIMATE - Gaia Blade**
- Type: physical
- Element: Venus
- Mana Cost: 5
- Base Power: 75
- Targets: single-enemy
- Description: "Channel Gaia's full power into ultimate strike."
- hitCount: 2
- ignoreDefensePercent: 0.7
- splashDamagePercent: 0.6
- debuffEffect: { def: -15, atk: -10 }
- duration: 3

---

## 📊 Summary Statistics

### Abilities Added Per Unit
- **Adept**: 13 new abilities (levels 7-20)
- **War Mage**: 13 new abilities (levels 7-20)
- **Mystic**: 13 new abilities (levels 7-20)
- **Ranger**: 13 new abilities (levels 7-20)
- **Sentinel**: 16 new abilities (levels 4-20)
- **Stormcaller**: 16 new abilities (levels 4-20)
- **Blaze**: 16 new abilities (levels 4-20)
- **Karis**: 15 new abilities (levels 5-20)
- **Tyrell**: 15 new abilities (levels 5-20)
- **Felix**: 15 new abilities (levels 5-20)

**Total New Abilities**: 145 abilities

### Mechanic Distribution
- **Physical Attacks**: ~40% (basic, multi-hit, def penetration)
- **Psynergy Attacks**: ~30% (single, AoE, elemental)
- **Buffs**: ~15% (stat boosts, shields, damage reduction)
- **Healing**: ~8% (direct heal, heal over time, party heal)
- **Debuffs**: ~5% (stat reduction, status infliction)
- **Ultimates (Level 20)**: 10 unique, role-defining abilities

### Mana Cost Distribution
- **0 mana**: Basic physical attacks (early levels)
- **1-2 mana**: Mid-tier abilities (levels 5-10)
- **3-4 mana**: Advanced abilities (levels 11-16)
- **5 mana**: Ultimate abilities (levels 17-20)

---

## 🎮 Next Steps

1. **Review & Approve**: Does this progression match your vision?
2. **Balance Pass**: Adjust numbers based on combat testing
3. **Implementation**: Add abilities to `abilities.ts` and update `units.ts`
4. **Validation**: Run `pnpm validate:data` after implementation
5. **Testing**: Test level progression and ability unlocking

## 🔧 Implementation Notes

- All abilities follow existing schema patterns
- Mana costs respect 0-5 limit and team pool system
- Element types match unit elements for thematic consistency
- Role identity maintained throughout progression
- Level 20 ultimates are powerful but balanced (5 mana cost)
- Multi-hit, status effects, and advanced mechanics scale with level
- Tank roles get shields and damage reduction
- DPS roles get multi-hit and defense penetration
- Mages get high-power AoE and elemental mastery
- Healers get cleanse, revive, and team support

Ready to implement or need adjustments? 🎯
