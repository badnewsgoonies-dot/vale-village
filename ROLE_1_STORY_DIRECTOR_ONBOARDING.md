<<<<<<< HEAD
# 📖 ROLE 1: STORY DIRECTOR - Vale Chronicles

**Your Mission:** Design the narrative, characters, and world for Vale Chronicles

---

## 🎯 YOUR ROLE

You are the **STORY DIRECTOR** - the first role in the 6-role workflow.

### **You ARE Responsible For:**
- ✅ Designing all 10 recruitable units (names, personalities, backstories, motivations)
- ✅ Writing NPC dialogues (50 NPCs: 10 battle NPCs, 40 dialogue/shop NPCs)
- ✅ Creating Vale Village story structure
- ✅ Designing 12 Djinn (names, lore, personality, elemental themes)
- ✅ Writing final boss narrative and motivation
- ✅ Defining quests and side-stories
- ✅ Creating ability/spell flavor text

### **You Are NOT Responsible For:**
- ❌ Game mechanics (Architect handles this)
- ❌ Implementation details (Coder handles this)
- ❌ Visual design (Graphics handles this)
- ❌ Technical specifications

---

## 📋 DELIVERABLES

### **1. RECRUITABLE UNITS BIBLE** (Primary Deliverable)

Create profiles for all 10 recruitable units:

```markdown
# RECRUITABLE UNITS - Vale Chronicles

## UNIT 1: Isaac (Starter Choice)

### Basic Info
- **Name:** Isaac
- **Element:** Venus (Earth)
- **Age:** 17
- **Hometown:** Vale Village
- **Base Class:** Squire → Earth Adept (with Djinn)

### Personality
- **Core Traits:** Brave, determined, compassionate
- **Speech Pattern:** Direct but kind, doesn't waste words
- **Motivation:** Protect Vale from the rising darkness
- **Relationship to Player:** The heroic protagonist, natural leader

### Combat Role
- **Archetype:** Balanced Fighter (Tank/DPS hybrid)
- **Weapon:** Sword
- **Strengths:** High HP, strong physical attacks, earth Psynergy
- **Weaknesses:** No healing, medium speed

### Abilities by Level (Flavor only - mechanics by Architect)
- **Level 1:** Basic sword attack
  - *Flavor:* "A straightforward slash with his trusty blade"
- **Level 2:** Quake
  - *Flavor:* "Channels earth energy to shake the ground beneath enemies"
- **Level 3:** Clay Spire
  - *Flavor:* "Summons stone pillars from the earth to pierce foes"
- **Level 4:** Ragnarok
  - *Flavor:* "A massive blade of earth energy crashes down from above"
- **Level 5:** Judgment
  - *Flavor:* "The ultimate earth technique - a pillar of divine earth power"

### Dialogue Samples
**When First Met (Tutorial NPC):**
> "I'm Isaac. My dad was a warrior who protected this village. Now it's my turn to prove myself. Will you help me train?"

**After Recruitment:**
> "Together we'll protect Vale from whatever threatens it."

**In Battle (Low HP):**
> "I can't fall here... Vale needs me!"

**In Battle (Critical Hit):**
> "For Vale!"

### Recruitment Method
- **Source:** Starter choice (player picks 1 of 3 starters)
- **Level When Joined:** 1
- **Recruitment Flag:** `starter_selected_isaac`

---

## UNIT 2: Garet

[Repeat structure for all 10 units]
- Garet (Mars/Fire Warrior - Starter Choice)
- Ivan (Jupiter/Wind Mage - Starter Choice)
- Mia (Mercury/Water Healer - Defeat her in friendly spar)
- Felix (Venus/Earth Rogue - Defeat in honor duel)
- Jenna (Mars/Fire Mage - Rescue quest reward)
- Sheba (Jupiter/Wind Support - Find lost in forest)
- Piers (Mercury/Water Tank - Defeat harbor guardian)
- Kraden (Scholar - Special quest)
- Kyle (Guard Captain - Defeat in warrior trial)
```

---

### **2. NPC DIALOGUE SCRIPT**

Write dialogues for 50 NPCs:

```markdown
# NPC DIALOGUES - Vale Chronicles

## BATTLE NPCs (10) - Recruitable Units

### NPC: Garet's Challenge
**ID:** npc-garet-battle
**Location:** Training Grounds
**Type:** Battle NPC (Recruitable)

**Dialogue (Before Battle):**
> "Hey! Want to test your skills? I've been training with my dad Kyle. Let's have a friendly sparring match!"

**Dialogue (After Defeat - Recruitment):**
> "Whoa! You're pretty strong! Mind if I join you? We could do great things together!"

**Dialogue (After Recruitment):**
> "Ready for our next adventure? Let's go!"

---

## DIALOGUE NPCs (40) - Story/Flavor

### NPC: Dora (Isaac's Mother)
**ID:** npc-dora
**Location:** Near Isaac's House
**Type:** Story NPC

**Dialogue (First Time):**
> "Isaac, be careful out there. Ever since your father... just promise me you'll come home safe."

**Dialogue (After First Battle):**
> "You're becoming stronger, just like your father. He'd be proud."

**Dialogue (Late Game):**
> "The whole village is talking about your victories. You've given us hope."

[Continue for all 40 NPCs...]
```

---

### **3. DJINN LORE & DESCRIPTIONS**

```markdown
# DJINN - Vale Chronicles

## Venus Djinn (Earth)

### DJINN 1: Flint
- **Element:** Venus (Earth)
- **Tier:** 1 (Basic)
- **Personality:** Sturdy and reliable, never backs down
- **Lore:** "A Venus Djinni found in the rocky caves near Vale. Known for its unwavering defense."
- **Passive Effect (Flavor):** "Hardens your party's resolve like stone"
- **Active Use (Flavor):** "Unleash Flint to summon a boulder that crushes all foes!"
- **How to Obtain:** Reward for defeating Village Guard Captain

### DJINN 2: Granite
- **Element:** Venus (Earth)
- **Tier:** 2 (Intermediate)
- **Personality:** Ancient and wise, slow to anger
- **Lore:** "An elder Djinni from the depths of Mt. Aleph. Its power flows like shifting earth."
- **Passive Effect (Flavor):** "Channels ancient earth power into your attacks"
- **Active Use (Flavor):** "Unleash Granite for a devastating earthquake!"
- **How to Obtain:** Hidden in Sol Sanctum (boss reward)

[Continue for all 12 Djinn: 3 Venus, 3 Mercury, 3 Mars, 3 Jupiter]
```

---

### **4. VALE VILLAGE STORY STRUCTURE**

```markdown
# STORY STRUCTURE - Vale Chronicles

## ACT 1: PROVING GROUND

### Beat 1: The Beginning
**Setup:** Isaac decides to prove himself as a warrior like his fallen father

**NPCs Introduced:**
- Dora (Mother - concerned)
- Elder (Village leader - skeptical)
- Garet (Best friend - supportive)

**Player Goal:** Win first tutorial battle

---

### Beat 2: Building Strength
**Setup:** Word spreads of Isaac's skill. Warriors challenge him.

**NPCs to Defeat:**
- Training NPCs (3) - Low level sparring
- Garet - First real recruitment
- Mia - Healer recruit
- Ivan - Mage recruit

**Player Goal:** Build a party of 4

---

### Beat 3: The Trials
**Setup:** Elder demands Isaac prove worth by defeating Vale's champions

**NPCs to Defeat:**
- Kyle (Guard Captain) - Legendary warrior
- Felix (Wandering Swordsman) - Honor duel
- Jenna (Fire Adept) - Rescue quest battle

**Reward:** Access to Sol Sanctum

---

## ACT 2: THE GATHERING STORM

### Beat 4: Djinn Collection
**Setup:** Mysterious Djinn appear around Vale. Collect them for power.

**Djinn Locations:**
- 4 Djinn from boss NPC rewards
- 4 Djinn from hidden quests
- 4 Djinn from shops (expensive)

**Player Goal:** Collect 9+ Djinn (minimum for final boss)

---

## ACT 3: THE FINAL CHALLENGE

### Beat 5: The Awakening
**Setup:** Darkness stirs in Sol Sanctum. Final boss reveals itself.

**Final Boss:** [Name TBD - your choice!]
- Requires: Level 4+ units, Full party of 4, 6+ Djinn equipped
- Narrative: Ancient evil sealed in sanctum, now awakened
- Victory: Vale saved, game complete

**Endings:**
- Standard Ending: Defeat boss with minimal requirements
- True Ending: Defeat boss with all 10 units recruited, all 12 Djinn collected, max level party

---

## OPTIONAL SIDE CONTENT

### Side Quest 1: The Lost Djinni
- Find Djinn hidden in town
- Reward: Rare equipment

### Side Quest 2: Elder's Test
- Defeat all 10 recruitable NPCs
- Reward: Access to legendary weapon shop

### Side Quest 3: Kraden's Research
- Bring Kraden specific items
- Reward: Lore about Alchemy, stat boost items
```

---

### **5. ABILITY FLAVOR TEXT**

```markdown
# ABILITY FLAVOR TEXT - Vale Chronicles

## Venus (Earth) Abilities

**Quake**
> "The ground trembles and cracks beneath your enemies' feet!"

**Ragnarok**
> "A colossal blade of earth energy falls from the heavens!"

**Clay Spire**
> "Stone pillars erupt from the earth, impaling foes!"

## Mercury (Water/Ice) Abilities

**Ply**
> "Gentle waters wash over your wounds, restoring vitality."

**Ice Horn**
> "Frozen spears pierce through enemy defenses!"

**Wish**
> "A healing prayer that restores your entire party!"

[Continue for all abilities across all 4 elements...]
```

---

## ✅ ACCEPTANCE CRITERIA

### Before Passing to Graphics:

- [ ] **All 10 recruitable units** have complete profiles (name, personality, combat role, abilities 1-5, dialogue, recruitment method)
- [ ] **All 50 NPC dialogues** written (battle NPCs, shop NPCs, story NPCs, flavor NPCs)
- [ ] **All 12 Djinn** have lore, personalities, and flavor text
- [ ] **Story structure** has clear beats (beginning → middle → final boss)
- [ ] **Ability flavor text** for all elemental Psynergy spells
- [ ] **Quest structure** defined (main path + optional side content)
- [ ] **No mechanical details** (stats, damage numbers, formulas - that's Architect's job)
- [ ] **Everything is narrative/flavor** (focus on story, characters, world)

---

## 🎯 WHAT SUCCESS LOOKS LIKE

**Good Story Director Work:**
```markdown
✅ Unit Profile: Isaac
- Personality: "Brave, determined, haunted by father's death"
- Speech: "Short sentences, doesn't mince words, 'Let's go' not 'Perhaps we should'"
- Motivation: "Prove himself worthy of father's legacy"
- Combat Role: "Balanced earth warrior"
- Level 5 Ability: "Judgment - channels father's spirit for ultimate attack"
```

**Bad Story Director Work:**
```markdown
❌ Unit Profile: Isaac
- "He's a warrior"
- "Fights with sword"
- "Has earth powers"
- [No personality, no motivation, generic]
```

---

## 🚫 COMMON MISTAKES

### ❌ DON'T:
- Define damage numbers or stats (that's Architect)
- Design battle mechanics (that's Architect)
- Specify sprite paths or technical details (that's Graphics)
- Create gameplay formulas (that's Architect)

### ✅ DO:
- Create rich personalities and backstories
- Write compelling dialogues
- Design narrative progression
- Develop world lore and flavor
- Make every unit/NPC feel unique

---

## 📚 REFERENCE EXAMPLES

**From Golden Sun (Your Style Guide):**
- NPCs have distinct personalities (Elder = wise/serious, Garet = energetic/loyal)
- Djinn have character (not just stat boosts)
- Abilities have flavor ("Ragnarok" not "Earth Attack 3")
- Story beats create emotional moments

**From Your Design:**
- 10 units (not 50) - each must feel VERY unique
- Djinn are collectibles with personality
- Vale Village is the hub (intimate, not sprawling)
- Battles are against characters (not random monsters)

---

## 🎉 READY TO CREATE!

Once you complete your deliverables, pass to **Graphics Phase 1** for mockup creation!

**Estimated Time:** 6-8 hours for complete story bible

**Your work enables everything else - no pressure! 😄**

---

## 📝 TEMPLATE TO USE

See attached: `STORY_DIRECTOR_TEMPLATE.md` for copy-paste structure

**Next Role:** Graphics Phase 1 (Mockup) → receives your story bible

=======
# 📖 ROLE 1: STORY DIRECTOR - Vale Chronicles

**Your Mission:** Design the narrative, characters, and world for Vale Chronicles

---

## 🎯 YOUR ROLE

You are the **STORY DIRECTOR** - the first role in the 6-role workflow.

### **You ARE Responsible For:**
- ✅ Designing all 10 recruitable units (names, personalities, backstories, motivations)
- ✅ Writing NPC dialogues (50 NPCs: 10 battle NPCs, 40 dialogue/shop NPCs)
- ✅ Creating Vale Village story structure
- ✅ Designing 12 Djinn (names, lore, personality, elemental themes)
- ✅ Writing final boss narrative and motivation
- ✅ Defining quests and side-stories
- ✅ Creating ability/spell flavor text

### **You Are NOT Responsible For:**
- ❌ Game mechanics (Architect handles this)
- ❌ Implementation details (Coder handles this)
- ❌ Visual design (Graphics handles this)
- ❌ Technical specifications

---

## 📋 DELIVERABLES

### **1. RECRUITABLE UNITS BIBLE** (Primary Deliverable)

Create profiles for all 10 recruitable units:

```markdown
# RECRUITABLE UNITS - Vale Chronicles

## UNIT 1: Isaac (Starter Choice)

### Basic Info
- **Name:** Isaac
- **Element:** Venus (Earth)
- **Age:** 17
- **Hometown:** Vale Village
- **Base Class:** Squire → Earth Adept (with Djinn)

### Personality
- **Core Traits:** Brave, determined, compassionate
- **Speech Pattern:** Direct but kind, doesn't waste words
- **Motivation:** Protect Vale from the rising darkness
- **Relationship to Player:** The heroic protagonist, natural leader

### Combat Role
- **Archetype:** Balanced Fighter (Tank/DPS hybrid)
- **Weapon:** Sword
- **Strengths:** High HP, strong physical attacks, earth Psynergy
- **Weaknesses:** No healing, medium speed

### Abilities by Level (Flavor only - mechanics by Architect)
- **Level 1:** Basic sword attack
  - *Flavor:* "A straightforward slash with his trusty blade"
- **Level 2:** Quake
  - *Flavor:* "Channels earth energy to shake the ground beneath enemies"
- **Level 3:** Clay Spire
  - *Flavor:* "Summons stone pillars from the earth to pierce foes"
- **Level 4:** Ragnarok
  - *Flavor:* "A massive blade of earth energy crashes down from above"
- **Level 5:** Judgment
  - *Flavor:* "The ultimate earth technique - a pillar of divine earth power"

### Dialogue Samples
**When First Met (Tutorial NPC):**
> "I'm Isaac. My dad was a warrior who protected this village. Now it's my turn to prove myself. Will you help me train?"

**After Recruitment:**
> "Together we'll protect Vale from whatever threatens it."

**In Battle (Low HP):**
> "I can't fall here... Vale needs me!"

**In Battle (Critical Hit):**
> "For Vale!"

### Recruitment Method
- **Source:** Starter choice (player picks 1 of 3 starters)
- **Level When Joined:** 1
- **Recruitment Flag:** `starter_selected_isaac`

---

## UNIT 2: Garet

[Repeat structure for all 10 units]
- Garet (Mars/Fire Warrior - Starter Choice)
- Ivan (Jupiter/Wind Mage - Starter Choice)
- Mia (Mercury/Water Healer - Defeat her in friendly spar)
- Felix (Venus/Earth Rogue - Defeat in honor duel)
- Jenna (Mars/Fire Mage - Rescue quest reward)
- Sheba (Jupiter/Wind Support - Find lost in forest)
- Piers (Mercury/Water Tank - Defeat harbor guardian)
- Kraden (Scholar - Special quest)
- Kyle (Guard Captain - Defeat in warrior trial)
```

---

### **2. NPC DIALOGUE SCRIPT**

Write dialogues for 50 NPCs:

```markdown
# NPC DIALOGUES - Vale Chronicles

## BATTLE NPCs (10) - Recruitable Units

### NPC: Garet's Challenge
**ID:** npc-garet-battle
**Location:** Training Grounds
**Type:** Battle NPC (Recruitable)

**Dialogue (Before Battle):**
> "Hey! Want to test your skills? I've been training with my dad Kyle. Let's have a friendly sparring match!"

**Dialogue (After Defeat - Recruitment):**
> "Whoa! You're pretty strong! Mind if I join you? We could do great things together!"

**Dialogue (After Recruitment):**
> "Ready for our next adventure? Let's go!"

---

## DIALOGUE NPCs (40) - Story/Flavor

### NPC: Dora (Isaac's Mother)
**ID:** npc-dora
**Location:** Near Isaac's House
**Type:** Story NPC

**Dialogue (First Time):**
> "Isaac, be careful out there. Ever since your father... just promise me you'll come home safe."

**Dialogue (After First Battle):**
> "You're becoming stronger, just like your father. He'd be proud."

**Dialogue (Late Game):**
> "The whole village is talking about your victories. You've given us hope."

[Continue for all 40 NPCs...]
```

---

### **3. DJINN LORE & DESCRIPTIONS**

```markdown
# DJINN - Vale Chronicles

## Venus Djinn (Earth)

### DJINN 1: Flint
- **Element:** Venus (Earth)
- **Tier:** 1 (Basic)
- **Personality:** Sturdy and reliable, never backs down
- **Lore:** "A Venus Djinni found in the rocky caves near Vale. Known for its unwavering defense."
- **Passive Effect (Flavor):** "Hardens your party's resolve like stone"
- **Active Use (Flavor):** "Unleash Flint to summon a boulder that crushes all foes!"
- **How to Obtain:** Reward for defeating Village Guard Captain

### DJINN 2: Granite
- **Element:** Venus (Earth)
- **Tier:** 2 (Intermediate)
- **Personality:** Ancient and wise, slow to anger
- **Lore:** "An elder Djinni from the depths of Mt. Aleph. Its power flows like shifting earth."
- **Passive Effect (Flavor):** "Channels ancient earth power into your attacks"
- **Active Use (Flavor):** "Unleash Granite for a devastating earthquake!"
- **How to Obtain:** Hidden in Sol Sanctum (boss reward)

[Continue for all 12 Djinn: 3 Venus, 3 Mercury, 3 Mars, 3 Jupiter]
```

---

### **4. VALE VILLAGE STORY STRUCTURE**

```markdown
# STORY STRUCTURE - Vale Chronicles

## ACT 1: PROVING GROUND

### Beat 1: The Beginning
**Setup:** Isaac decides to prove himself as a warrior like his fallen father

**NPCs Introduced:**
- Dora (Mother - concerned)
- Elder (Village leader - skeptical)
- Garet (Best friend - supportive)

**Player Goal:** Win first tutorial battle

---

### Beat 2: Building Strength
**Setup:** Word spreads of Isaac's skill. Warriors challenge him.

**NPCs to Defeat:**
- Training NPCs (3) - Low level sparring
- Garet - First real recruitment
- Mia - Healer recruit
- Ivan - Mage recruit

**Player Goal:** Build a party of 4

---

### Beat 3: The Trials
**Setup:** Elder demands Isaac prove worth by defeating Vale's champions

**NPCs to Defeat:**
- Kyle (Guard Captain) - Legendary warrior
- Felix (Wandering Swordsman) - Honor duel
- Jenna (Fire Adept) - Rescue quest battle

**Reward:** Access to Sol Sanctum

---

## ACT 2: THE GATHERING STORM

### Beat 4: Djinn Collection
**Setup:** Mysterious Djinn appear around Vale. Collect them for power.

**Djinn Locations:**
- 4 Djinn from boss NPC rewards
- 4 Djinn from hidden quests
- 4 Djinn from shops (expensive)

**Player Goal:** Collect 9+ Djinn (minimum for final boss)

---

## ACT 3: THE FINAL CHALLENGE

### Beat 5: The Awakening
**Setup:** Darkness stirs in Sol Sanctum. Final boss reveals itself.

**Final Boss:** [Name TBD - your choice!]
- Requires: Level 4+ units, Full party of 4, 6+ Djinn equipped
- Narrative: Ancient evil sealed in sanctum, now awakened
- Victory: Vale saved, game complete

**Endings:**
- Standard Ending: Defeat boss with minimal requirements
- True Ending: Defeat boss with all 10 units recruited, all 12 Djinn collected, max level party

---

## OPTIONAL SIDE CONTENT

### Side Quest 1: The Lost Djinni
- Find Djinn hidden in town
- Reward: Rare equipment

### Side Quest 2: Elder's Test
- Defeat all 10 recruitable NPCs
- Reward: Access to legendary weapon shop

### Side Quest 3: Kraden's Research
- Bring Kraden specific items
- Reward: Lore about Alchemy, stat boost items
```

---

### **5. ABILITY FLAVOR TEXT**

```markdown
# ABILITY FLAVOR TEXT - Vale Chronicles

## Venus (Earth) Abilities

**Quake**
> "The ground trembles and cracks beneath your enemies' feet!"

**Ragnarok**
> "A colossal blade of earth energy falls from the heavens!"

**Clay Spire**
> "Stone pillars erupt from the earth, impaling foes!"

## Mercury (Water/Ice) Abilities

**Ply**
> "Gentle waters wash over your wounds, restoring vitality."

**Ice Horn**
> "Frozen spears pierce through enemy defenses!"

**Wish**
> "A healing prayer that restores your entire party!"

[Continue for all abilities across all 4 elements...]
```

---

## ✅ ACCEPTANCE CRITERIA

### Before Passing to Graphics:

- [ ] **All 10 recruitable units** have complete profiles (name, personality, combat role, abilities 1-5, dialogue, recruitment method)
- [ ] **All 50 NPC dialogues** written (battle NPCs, shop NPCs, story NPCs, flavor NPCs)
- [ ] **All 12 Djinn** have lore, personalities, and flavor text
- [ ] **Story structure** has clear beats (beginning → middle → final boss)
- [ ] **Ability flavor text** for all elemental Psynergy spells
- [ ] **Quest structure** defined (main path + optional side content)
- [ ] **No mechanical details** (stats, damage numbers, formulas - that's Architect's job)
- [ ] **Everything is narrative/flavor** (focus on story, characters, world)

---

## 🎯 WHAT SUCCESS LOOKS LIKE

**Good Story Director Work:**
```markdown
✅ Unit Profile: Isaac
- Personality: "Brave, determined, haunted by father's death"
- Speech: "Short sentences, doesn't mince words, 'Let's go' not 'Perhaps we should'"
- Motivation: "Prove himself worthy of father's legacy"
- Combat Role: "Balanced earth warrior"
- Level 5 Ability: "Judgment - channels father's spirit for ultimate attack"
```

**Bad Story Director Work:**
```markdown
❌ Unit Profile: Isaac
- "He's a warrior"
- "Fights with sword"
- "Has earth powers"
- [No personality, no motivation, generic]
```

---

## 🚫 COMMON MISTAKES

### ❌ DON'T:
- Define damage numbers or stats (that's Architect)
- Design battle mechanics (that's Architect)
- Specify sprite paths or technical details (that's Graphics)
- Create gameplay formulas (that's Architect)

### ✅ DO:
- Create rich personalities and backstories
- Write compelling dialogues
- Design narrative progression
- Develop world lore and flavor
- Make every unit/NPC feel unique

---

## 📚 REFERENCE EXAMPLES

**From Golden Sun (Your Style Guide):**
- NPCs have distinct personalities (Elder = wise/serious, Garet = energetic/loyal)
- Djinn have character (not just stat boosts)
- Abilities have flavor ("Ragnarok" not "Earth Attack 3")
- Story beats create emotional moments

**From Your Design:**
- 10 units (not 50) - each must feel VERY unique
- Djinn are collectibles with personality
- Vale Village is the hub (intimate, not sprawling)
- Battles are against characters (not random monsters)

---

## 🎉 READY TO CREATE!

Once you complete your deliverables, pass to **Graphics Phase 1** for mockup creation!

**Estimated Time:** 6-8 hours for complete story bible

**Your work enables everything else - no pressure! 😄**

---

## 📝 TEMPLATE TO USE

See attached: `STORY_DIRECTOR_TEMPLATE.md` for copy-paste structure

**Next Role:** Graphics Phase 1 (Mockup) → receives your story bible

>>>>>>> da011dae5a42c00b1fdb0e0f62b8f00e0a566dcf
