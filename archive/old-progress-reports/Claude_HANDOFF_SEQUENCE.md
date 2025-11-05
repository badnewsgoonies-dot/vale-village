<<<<<<< HEAD
# 🤝 CLAUDE CODE HANDOFF SEQUENCE - Vale Chronicles

**How to execute the 6-role workflow with separate Claude Code chats in Cursor**

---

## 🎯 REPOSITORY SETUP

### **Repository:** 
```
C:\Dev\AiGames\Zzzzzzzzz\vale-chronicles\
```

**This is your MAIN repository for Vale Chronicles.**

**DON'T use:**
- ❌ `MetaPrompt/` - That's the reference project
- ❌ `NextEraGame/` - That's the reference project
- ❌ `Zzzzzzzzz/` root - Keep it clean

**DO use:**
- ✅ `vale-chronicles/` - Your new game project

---

## 📋 WORKFLOW SEQUENCE

### **You'll Create 6 Separate Claude Code Sessions in Cursor:**

```
Session 1: 📖 Story Director
Session 2: 🎨 Graphics Mockup  
Session 3: 🏛️ Architect
Session 4: 💻 Coder
Session 5: ✨ Graphics Integration
Session 6: ✅ QA/Verifier
```

**Each session gets ONE role, completes their work, hands off to next session.**

**TIP:** Use Cursor's "New Chat" feature to start fresh sessions for each role!

---

## 🚀 HANDOFF #1: STORY DIRECTOR (First Chat)

### **Repository Context:**
```
Repository: C:\Dev\AiGames\Zzzzzzzzz\vale-chronicles
Working Directory: vale-chronicles/
Branch: main (will create story-director branch)
```

### **📝 EXACT PROMPT TO USE:**

```markdown
You are the STORY DIRECTOR for Vale Chronicles.

Repository: C:\Dev\AiGames\Zzzzzzzzz\vale-chronicles

Read your onboarding document:
C:\Dev\AiGames\Zzzzzzzzz\vale-chronicles\ROLE_1_STORY_DIRECTOR_ONBOARDING.md

After reading, confirm you understand your role and are ready to create:
1. 10 recruitable unit profiles (names, personalities, abilities, dialogues)
2. 50 NPC dialogues (10 battle NPCs, 40 dialogue NPCs)
3. 12 Djinn lore (names, personalities, descriptions)
4. Vale Village story structure
5. Final boss narrative

Your deliverables will be passed to Graphics Mockup (Chat 2).

Confirm reading and understanding, then begin.
```

### **What Story Director Will Create:**

**Output Files:**
- `docs/story/RECRUITABLE_UNITS_BIBLE.md` - All 10 units
- `docs/story/NPC_DIALOGUES.md` - All 50 NPCs
- `docs/story/DJINN_LORE.md` - All 12 Djinn
- `docs/story/STORY_STRUCTURE.md` - Narrative arc
- `docs/story/ABILITY_FLAVOR_TEXT.md` - All spell descriptions

**Time:** 6-8 hours

**Branch:** `story-director` (create from main)

---

## 🚀 HANDOFF #2: GRAPHICS MOCKUP (Second Chat)

### **After Story Director Completes:**

**Repository Context:**
```
Repository: C:\Dev\AiGames\Zzzzzzzzz\vale-chronicles
Working Directory: vale-chronicles/
Branch: graphics-mockup (create from story-director)
Receives: All docs from docs/story/
```

### **📝 EXACT PROMPT TO USE:**

```markdown
You are the GRAPHICS MOCKUP designer for Vale Chronicles.

Repository: C:\Dev\AiGames\Zzzzzzzzz\vale-chronicles

Read your onboarding document:
C:\Dev\AiGames\Zzzzzzzzz\vale-chronicles\ROLE_2_GRAPHICS_MOCKUP_ONBOARDING.md

Also read:
C:\Dev\AiGames\Zzzzzzzzz\vale-chronicles\MOCKUP_INVENTORY.md

You have 3 APPROVED reference mockups (study these first):
1. Vale Village Overworld (GOOD example)
2. Djinn Menu (GOOD example)
3. Battle Screen (GOOD example)

IGNORE mockup-examples/ folder (bad examples).

Your job: Create 4 NEW mockups:
1. Equipment Screen
2. Unit Collection Screen
3. Rewards Screen
4. Battle Transition

Receive story content from: docs/story/

Confirm reading and understanding, then begin creating mockups.
```

**What Graphics Will Create:**

**Output Files:**
- `mockups/equipment-screen.html` + CSS + JSON
- `mockups/unit-collection.html` + CSS + JSON
- `mockups/rewards-screen.html` + CSS + JSON
- `mockups/battle-transition.html` + CSS + JSON
- `mockups/MOCKUP_APPROVED.md` for each

**Time:** 15-20 hours (or 8-10 if reusing approved patterns heavily)

**Branch:** `graphics-mockup`

---

## 🚀 HANDOFF #3: ARCHITECT (Third Chat)

### **After Graphics Mockup Completes:**

**Repository Context:**
```
Repository: C:\Dev\AiGames\Zzzzzzzzz\vale-chronicles
Working Directory: vale-chronicles/
Branch: architect-plan (create from graphics-mockup)
Receives: docs/story/ + mockups/
```

### **📝 EXACT PROMPT TO USE:**

```markdown
You are the ARCHITECT for Vale Chronicles.

Repository: C:\Dev\AiGames\Zzzzzzzzz\vale-chronicles

Read your onboarding document:
C:\Dev\AiGames\Zzzzzzzzz\vale-chronicles\ROLE_3_ARCHITECT_ONBOARDING.md

You have received:
- Story bible (docs/story/)
- All 7 mockups (mockups/)
- Architecture doc (VALE_CHRONICLES_ARCHITECTURE.md)

Your job: Create technical session plan with:
1. ALL game mechanic formulas (leveling, Djinn synergy, equipment stats, etc.)
2. 20+ task prompts for Coder
3. 30+ context-aware test scenarios
4. Integration point specifications
5. Code reuse strategy

Output: docs/architect/TECHNICAL_SESSION_PLAN.md

Confirm reading and understanding, then begin planning.
```

**What Architect Will Create:**

**Output Files:**
- `docs/architect/TECHNICAL_SESSION_PLAN.md`
- `docs/architect/GAME_MECHANICS.md` (all formulas)
- `docs/architect/TEST_SCENARIOS.md` (30+ context-aware tests)
- `docs/architect/TASK_BREAKDOWN.md` (20+ tasks for Coder)

**Time:** 3-4 hours

**Branch:** `architect-plan`

---

## 🚀 HANDOFF #4: CODER (Fourth Chat)

### **After Architect Completes:**

**Repository Context:**
```
Repository: C:\Dev\AiGames\Zzzzzzzzz\vale-chronicles
Working Directory: vale-chronicles/
Branch: coder-implementation (create from main, fresh)
Receives: docs/architect/TECHNICAL_SESSION_PLAN.md
```

### **📝 EXACT PROMPT TO USE:**

```markdown
You are the CODER for Vale Chronicles.

Repository: C:\Dev\AiGames\Zzzzzzzzz\vale-chronicles

Read your onboarding document:
C:\Dev\AiGames\Zzzzzzzzz\vale-chronicles\ROLE_4_CODER_ONBOARDING.md

Read the technical plan:
C:\Dev\AiGames\Zzzzzzzzz\vale-chronicles\docs\architect\TECHNICAL_SESSION_PLAN.md

You must:
1. Implement all 8 core systems
2. Write 72+ context-aware tests (NOT isolated unit tests!)
3. Integrate MetaPrompt/golden-sun (overworld) + NextEraGame (battle)
4. Follow patterns: Result types, pure functions, deterministic RNG
5. Maintain 100% test pass rate

Reference projects:
- MetaPrompt/golden-sun/ (for overworld code)
- NextEraGame/ (for battle code)

Confirm reading, then execute tasks from Technical Session Plan.
```

**What Coder Will Create:**

**Output:** Entire working game!
- `src/` directory (all systems)
- `tests/` directory (72+ context-aware tests)
- Full integration

**Time:** 20-25 hours

**Branch:** `coder-implementation`

---

## 🚀 HANDOFF #5: GRAPHICS INTEGRATION (Fifth Chat)

### **After Coder Completes:**

**Repository Context:**
```
Repository: C:\Dev\AiGames\Zzzzzzzzz\vale-chronicles
Working Directory: vale-chronicles/
Branch: graphics-integration (create from coder-implementation)
Receives: Working game from Coder
```

### **📝 EXACT PROMPT TO USE:**

```markdown
You are the GRAPHICS INTEGRATION specialist for Vale Chronicles.

Repository: C:\Dev\AiGames\Zzzzzzzzz\vale-chronicles

Read your onboarding document:
C:\Dev\AiGames\Zzzzzzzzz\vale-chronicles\ROLE_5_GRAPHICS_INTEGRATION_ONBOARDING.md

You have:
- Working game (from Coder)
- 7 HTML/CSS mockups (mockups/)
- 2,500+ Golden Sun sprites (NextEraGame/public/sprites/)

Your job:
1. Convert mockups to React components
2. Integrate all sprites
3. Add animations (swirl, level up, Djinn activation, etc.)
4. Visual polish
5. DON'T break Coder's tests!

Confirm reading, then begin integration.
```

**What Graphics Integration Will Create:**

**Output:**
- React components from mockups
- Animations and effects
- Visual polish
- Sprite integration complete

**Time:** 5-6 hours

**Branch:** `graphics-integration`

---

## 🚀 HANDOFF #6: QA/VERIFIER (Sixth Chat)

### **After Graphics Integration Completes:**

**Repository Context:**
```
Repository: C:\Dev\AiGames\Zzzzzzzzz\vale-chronicles
Working Directory: vale-chronicles/
Branch: qa-verification (from graphics-integration)
Receives: Polished, complete game
```

### **📝 EXACT PROMPT TO USE:**

```markdown
You are the QA/VERIFIER for Vale Chronicles.

Repository: C:\Dev\AiGames\Zzzzzzzzz\vale-chronicles

Read your onboarding document:
C:\Dev\AiGames\Zzzzzzzzz\vale-chronicles\ROLE_6_QA_VERIFIER_ONBOARDING.md

Your job:
1. Run 2+ full playthroughs (speedrun + completionist)
2. Verify progression (leveling/equipment/Djinn matter?)
3. Test balance (too easy? too hard?)
4. Accessibility audit (WCAG 2.1 AA)
5. Performance testing
6. Create bug reports
7. Final decision: SHIP / FIX / REVISE

Confirm reading, then begin testing.
```

**What QA Will Create:**

**Output:**
- `docs/qa/QA_REPORT.md`
- `docs/qa/BUG_REPORTS.md` (if any)
- `docs/qa/FINAL_APPROVAL.md`

**Time:** 4-5 hours

**Branch:** `qa-verification`

---

## 📁 REPOSITORY STRUCTURE

### **Vale Chronicles Repository:**

```
C:\Dev\AiGames\Zzzzzzzzz\vale-chronicles/
├── docs/
│   ├── story/              # Story Director outputs
│   ├── architect/          # Architect outputs
│   ├── qa/                 # QA outputs
│   ├── ROLE_1_STORY_DIRECTOR_ONBOARDING.md
│   ├── ROLE_2_GRAPHICS_MOCKUP_ONBOARDING.md
│   ├── ROLE_3_ARCHITECT_ONBOARDING.md
│   ├── ROLE_4_CODER_ONBOARDING.md
│   ├── ROLE_5_GRAPHICS_INTEGRATION_ONBOARDING.md
│   ├── ROLE_6_QA_VERIFIER_ONBOARDING.md
│   └── 6_ROLE_WORKFLOW_README.md
│
├── mockups/                # Graphics Mockup outputs
│   ├── vale-village.html (will copy from MetaPrompt)
│   ├── djinn-menu.html (will copy from New folder 5)
│   ├── battle-screen.html (will copy from New folder 5)
│   ├── equipment-screen.html (NEW)
│   ├── unit-collection.html (NEW)
│   ├── rewards-screen.html (NEW)
│   └── battle-transition.html (NEW)
│
├── src/                    # Coder outputs
│   ├── overworld/          # From MetaPrompt
│   ├── battle/             # From NextEraGame
│   ├── progression/        # NEW (Djinn, leveling, recruitment)
│   └── integration/        # NEW (glue layer)
│
├── tests/                  # Coder outputs
│   ├── scenarios/          # Context-aware tests!
│   └── integration/
│
├── public/
│   └── sprites/            # Will copy from NextEraGame
│
├── package.json
├── vite.config.ts
└── tsconfig.json
```

---

## 🎯 STARTING SEQUENCE

### **Step 1: Initialize Repository (Do This Now)**

```bash
cd C:\Dev\AiGames\Zzzzzzzzz\vale-chronicles

# Create directory structure
mkdir docs\story
mkdir docs\architect
mkdir docs\qa
mkdir mockups
mkdir src
mkdir tests
mkdir public

# Copy approved mockups
copy "..\c:\Users\gxpai\Desktop\New folder (5)\djinn-menu.html" mockups\
copy "..\c:\Users\gxpai\Desktop\New folder (5)\golden-sun-battle.html" mockups\
copy "..\MetaPrompt\golden-sun\mockups\vale-village.html" mockups\

# Initial commit
git add .
git commit -m "Initial Vale Chronicles setup - 6-role workflow docs"
```

---

### **Step 2: Start Chat 1 (Story Director)**

**Open NEW Codex chat, paste this:**

```markdown
Repository: C:\Dev\AiGames\Zzzzzzzzz\vale-chronicles

You are ROLE 1: STORY DIRECTOR for Vale Chronicles.

🚨 CRITICAL: Read this file FIRST:
C:\Dev\AiGames\Zzzzzzzzz\vale-chronicles\ROLE_1_STORY_DIRECTOR_ONBOARDING.md

After reading, confirm you understand you are creating:
1. 10 recruitable unit profiles (full personalities, abilities, dialogues)
2. 50 NPC dialogues (battle NPCs + story NPCs + shopkeepers)
3. 12 Djinn lore (names, personalities, elemental themes)
4. Story structure (beginning → boss)
5. Ability flavor text

Your outputs go to: docs/story/

Branch: Create story-director branch from main

Confirm reading and begin creating story content.
```

---

### **Step 3: After Story Director Completes → Chat 2 (Graphics Mockup)**

**Open NEW Codex chat (separate from Chat 1), paste this:**

```markdown
Repository: C:\Dev\AiGames\Zzzzzzzzz\vale-chronicles

You are ROLE 2: GRAPHICS MOCKUP for Vale Chronicles.

🚨 CRITICAL: Read these files FIRST:
1. C:\Dev\AiGames\Zzzzzzzzz\vale-chronicles\ROLE_2_GRAPHICS_MOCKUP_ONBOARDING.md
2. C:\Dev\AiGames\Zzzzzzzzz\vale-chronicles\MOCKUP_INVENTORY.md

You RECEIVED from Story Director (Chat 1):
- docs/story/RECRUITABLE_UNITS_BIBLE.md ✅
- docs/story/NPC_DIALOGUES.md ✅
- docs/story/DJINN_LORE.md ✅
- docs/story/STORY_STRUCTURE.md ✅

You have 3 APPROVED reference mockups:
✅ mockups/vale-village.html (GOOD!)
✅ mockups/djinn-menu.html (GOOD!)
✅ mockups/battle-screen.html (GOOD!)

❌ IGNORE: MetaPrompt/mockup-examples/ (BAD examples - floating units, bad composition)

Your job: Create 4 NEW mockups:
1. mockups/equipment-screen.html
2. mockups/unit-collection.html
3. mockups/rewards-screen.html
4. mockups/battle-transition.html

Branch: Create graphics-mockup branch from story-director

Confirm reading and begin creating mockups.
```

---

### **Step 4: After Graphics Mockup Completes → Chat 3 (Architect)**

**Open NEW Codex chat, paste this:**

```markdown
Repository: C:\Dev\AiGames\Zzzzzzzzz\vale-chronicles

You are ROLE 3: ARCHITECT for Vale Chronicles.

🚨 CRITICAL: Read this file FIRST:
C:\Dev\AiGames\Zzzzzzzzz\vale-chronicles\ROLE_3_ARCHITECT_ONBOARDING.md

You RECEIVED:
- docs/story/ (all story content) ✅
- mockups/ (all 7 mockups) ✅
- VALE_CHRONICLES_ARCHITECTURE.md ✅

Your job: Create technical session plan with:
1. ALL game mechanic FORMULAS (not vague descriptions!)
2. 20+ specific tasks for Coder
3. 30+ context-aware test scenarios
4. Integration point specs
5. Code reuse strategy

Outputs go to: docs/architect/

Branch: Create architect-plan branch from graphics-mockup

Confirm reading and begin technical planning.
```

---

### **Step 5: After Architect Completes → Chat 4 (Coder)**

**Open NEW Codex chat, paste this:**

```markdown
Repository: C:\Dev\AiGames\Zzzzzzzzz\vale-chronicles

You are ROLE 4: CODER for Vale Chronicles.

🚨 CRITICAL: Read this file FIRST:
C:\Dev\AiGames\Zzzzzzzzz\vale-chronicles\ROLE_4_CODER_ONBOARDING.md

You RECEIVED from Architect (Chat 3):
- docs/architect/TECHNICAL_SESSION_PLAN.md ✅
- docs/architect/GAME_MECHANICS.md (all formulas) ✅
- docs/architect/TEST_SCENARIOS.md (30+ tests to implement) ✅

Reference code to copy from:
- C:\Dev\AiGames\Zzzzzzzzz\MetaPrompt\golden-sun\ (overworld)
- C:\Dev\AiGames\Zzzzzzzzz\NextEraGame\ (battle)

Your job:
1. Implement all 8 core systems
2. Write 72+ context-aware tests (SCENARIO tests, not unit tests!)
3. Integrate overworld + battle
4. 100% test pass rate
5. 0 TypeScript errors

Branch: Create coder-implementation branch from main (fresh)

CRITICAL: Use context-aware testing:
✅ "Level 1 loses, Level 5 wins" (proves leveling works)
✅ "No Djinn vs 3 Djinn different outcome" (proves Djinn work)
❌ NOT "function returns boolean" (useless!)

Confirm reading and begin implementation.
```

---

### **Step 6: After Coder Completes → Chat 5 (Graphics Integration)**

**Open NEW Codex chat, paste this:**

```markdown
Repository: C:\Dev\AiGames\Zzzzzzzzz\vale-chronicles

You are ROLE 5: GRAPHICS INTEGRATION for Vale Chronicles.

🚨 CRITICAL: Read this file FIRST:
C:\Dev\AiGames\Zzzzzzzzz\vale-chronicles\ROLE_5_GRAPHICS_INTEGRATION_ONBOARDING.md

You RECEIVED from Coder (Chat 4):
- Working game (src/ directory) ✅
- 72+ tests passing ✅
- All systems functional ✅

You have:
- mockups/ (7 HTML/CSS mockups to convert)
- NextEraGame/public/sprites/ (2,500+ Golden Sun sprites)

Your job:
1. Convert mockups to React components
2. Integrate all sprites
3. Add animations (swirl, level up, Djinn activation)
4. Visual polish
5. DON'T break Coder's tests!

Branch: Create graphics-integration branch from coder-implementation

Confirm reading and begin visual integration.
```

---

### **Step 7: After Graphics Integration Completes → Chat 6 (QA)**

**Open NEW Codex chat, paste this:**

```markdown
Repository: C:\Dev\AiGames\Zzzzzzzzz\vale-chronicles

You are ROLE 6: QA/VERIFIER for Vale Chronicles.

🚨 CRITICAL: Read this file FIRST:
C:\Dev\AiGames\Zzzzzzzzz\vale-chronicles\ROLE_6_QA_VERIFIER_ONBOARDING.md

You RECEIVED: Complete, polished game ✅

Your job:
1. Run 2+ full playthroughs (speedrun + completionist)
2. Verify progression (does leveling/Djinn/equipment matter?)
3. Test balance (too easy? too hard?)
4. Accessibility audit
5. Performance testing
6. Create bug reports
7. FINAL DECISION: SHIP / FIX / REVISE

Output: docs/qa/FINAL_APPROVAL.md

Branch: qa-verification branch from graphics-integration

Confirm reading and begin testing.
```

---

## ✅ QUICK REFERENCE

### **Handoff Checklist:**

- [ ] **Chat 1 (Story Director):** Create story content → outputs to `docs/story/`
- [ ] **Chat 2 (Graphics Mockup):** Create 4 mockups → outputs to `mockups/`
- [ ] **Chat 3 (Architect):** Define mechanics → outputs to `docs/architect/`
- [ ] **Chat 4 (Coder):** Implement systems → outputs to `src/` + `tests/`
- [ ] **Chat 5 (Graphics Integration):** Add polish → enhances `src/`
- [ ] **Chat 6 (QA):** Test & approve → outputs to `docs/qa/`

### **Each Chat:**
1. Gets its own onboarding doc
2. Works on its own branch
3. Receives outputs from prior chat
4. Creates specific deliverables
5. Hands off to next chat

---

## 🎯 **START WITH CHAT 1 NOW!**

**Copy the exact prompt above for Story Director and paste into your first Codex chat!**

Repository is ready: `C:\Dev\AiGames\Zzzzzzzzz\vale-chronicles\`

---

**Let's build Vale Chronicles! 🎮🚀**

=======
# 🤝 CLAUDE CODE HANDOFF SEQUENCE - Vale Chronicles

**How to execute the 6-role workflow with separate Claude Code chats in Cursor**

---

## 🎯 REPOSITORY SETUP

### **Repository:** 
```
C:\Dev\AiGames\Zzzzzzzzz\vale-chronicles\
```

**This is your MAIN repository for Vale Chronicles.**

**DON'T use:**
- ❌ `MetaPrompt/` - That's the reference project
- ❌ `NextEraGame/` - That's the reference project
- ❌ `Zzzzzzzzz/` root - Keep it clean

**DO use:**
- ✅ `vale-chronicles/` - Your new game project

---

## 📋 WORKFLOW SEQUENCE

### **You'll Create 6 Separate Claude Code Sessions in Cursor:**

```
Session 1: 📖 Story Director
Session 2: 🎨 Graphics Mockup  
Session 3: 🏛️ Architect
Session 4: 💻 Coder
Session 5: ✨ Graphics Integration
Session 6: ✅ QA/Verifier
```

**Each session gets ONE role, completes their work, hands off to next session.**

**TIP:** Use Cursor's "New Chat" feature to start fresh sessions for each role!

---

## 🚀 HANDOFF #1: STORY DIRECTOR (First Chat)

### **Repository Context:**
```
Repository: C:\Dev\AiGames\Zzzzzzzzz\vale-chronicles
Working Directory: vale-chronicles/
Branch: main (will create story-director branch)
```

### **📝 EXACT PROMPT TO USE:**

```markdown
You are the STORY DIRECTOR for Vale Chronicles.

Repository: C:\Dev\AiGames\Zzzzzzzzz\vale-chronicles

Read your onboarding document:
C:\Dev\AiGames\Zzzzzzzzz\vale-chronicles\ROLE_1_STORY_DIRECTOR_ONBOARDING.md

After reading, confirm you understand your role and are ready to create:
1. 10 recruitable unit profiles (names, personalities, abilities, dialogues)
2. 50 NPC dialogues (10 battle NPCs, 40 dialogue NPCs)
3. 12 Djinn lore (names, personalities, descriptions)
4. Vale Village story structure
5. Final boss narrative

Your deliverables will be passed to Graphics Mockup (Chat 2).

Confirm reading and understanding, then begin.
```

### **What Story Director Will Create:**

**Output Files:**
- `docs/story/RECRUITABLE_UNITS_BIBLE.md` - All 10 units
- `docs/story/NPC_DIALOGUES.md` - All 50 NPCs
- `docs/story/DJINN_LORE.md` - All 12 Djinn
- `docs/story/STORY_STRUCTURE.md` - Narrative arc
- `docs/story/ABILITY_FLAVOR_TEXT.md` - All spell descriptions

**Time:** 6-8 hours

**Branch:** `story-director` (create from main)

---

## 🚀 HANDOFF #2: GRAPHICS MOCKUP (Second Chat)

### **After Story Director Completes:**

**Repository Context:**
```
Repository: C:\Dev\AiGames\Zzzzzzzzz\vale-chronicles
Working Directory: vale-chronicles/
Branch: graphics-mockup (create from story-director)
Receives: All docs from docs/story/
```

### **📝 EXACT PROMPT TO USE:**

```markdown
You are the GRAPHICS MOCKUP designer for Vale Chronicles.

Repository: C:\Dev\AiGames\Zzzzzzzzz\vale-chronicles

Read your onboarding document:
C:\Dev\AiGames\Zzzzzzzzz\vale-chronicles\ROLE_2_GRAPHICS_MOCKUP_ONBOARDING.md

Also read:
C:\Dev\AiGames\Zzzzzzzzz\vale-chronicles\MOCKUP_INVENTORY.md

You have 3 APPROVED reference mockups (study these first):
1. Vale Village Overworld (GOOD example)
2. Djinn Menu (GOOD example)
3. Battle Screen (GOOD example)

IGNORE mockup-examples/ folder (bad examples).

Your job: Create 4 NEW mockups:
1. Equipment Screen
2. Unit Collection Screen
3. Rewards Screen
4. Battle Transition

Receive story content from: docs/story/

Confirm reading and understanding, then begin creating mockups.
```

**What Graphics Will Create:**

**Output Files:**
- `mockups/equipment-screen.html` + CSS + JSON
- `mockups/unit-collection.html` + CSS + JSON
- `mockups/rewards-screen.html` + CSS + JSON
- `mockups/battle-transition.html` + CSS + JSON
- `mockups/MOCKUP_APPROVED.md` for each

**Time:** 15-20 hours (or 8-10 if reusing approved patterns heavily)

**Branch:** `graphics-mockup`

---

## 🚀 HANDOFF #3: ARCHITECT (Third Chat)

### **After Graphics Mockup Completes:**

**Repository Context:**
```
Repository: C:\Dev\AiGames\Zzzzzzzzz\vale-chronicles
Working Directory: vale-chronicles/
Branch: architect-plan (create from graphics-mockup)
Receives: docs/story/ + mockups/
```

### **📝 EXACT PROMPT TO USE:**

```markdown
You are the ARCHITECT for Vale Chronicles.

Repository: C:\Dev\AiGames\Zzzzzzzzz\vale-chronicles

Read your onboarding document:
C:\Dev\AiGames\Zzzzzzzzz\vale-chronicles\ROLE_3_ARCHITECT_ONBOARDING.md

You have received:
- Story bible (docs/story/)
- All 7 mockups (mockups/)
- Architecture doc (VALE_CHRONICLES_ARCHITECTURE.md)

Your job: Create technical session plan with:
1. ALL game mechanic formulas (leveling, Djinn synergy, equipment stats, etc.)
2. 20+ task prompts for Coder
3. 30+ context-aware test scenarios
4. Integration point specifications
5. Code reuse strategy

Output: docs/architect/TECHNICAL_SESSION_PLAN.md

Confirm reading and understanding, then begin planning.
```

**What Architect Will Create:**

**Output Files:**
- `docs/architect/TECHNICAL_SESSION_PLAN.md`
- `docs/architect/GAME_MECHANICS.md` (all formulas)
- `docs/architect/TEST_SCENARIOS.md` (30+ context-aware tests)
- `docs/architect/TASK_BREAKDOWN.md` (20+ tasks for Coder)

**Time:** 3-4 hours

**Branch:** `architect-plan`

---

## 🚀 HANDOFF #4: CODER (Fourth Chat)

### **After Architect Completes:**

**Repository Context:**
```
Repository: C:\Dev\AiGames\Zzzzzzzzz\vale-chronicles
Working Directory: vale-chronicles/
Branch: coder-implementation (create from main, fresh)
Receives: docs/architect/TECHNICAL_SESSION_PLAN.md
```

### **📝 EXACT PROMPT TO USE:**

```markdown
You are the CODER for Vale Chronicles.

Repository: C:\Dev\AiGames\Zzzzzzzzz\vale-chronicles

Read your onboarding document:
C:\Dev\AiGames\Zzzzzzzzz\vale-chronicles\ROLE_4_CODER_ONBOARDING.md

Read the technical plan:
C:\Dev\AiGames\Zzzzzzzzz\vale-chronicles\docs\architect\TECHNICAL_SESSION_PLAN.md

You must:
1. Implement all 8 core systems
2. Write 72+ context-aware tests (NOT isolated unit tests!)
3. Integrate MetaPrompt/golden-sun (overworld) + NextEraGame (battle)
4. Follow patterns: Result types, pure functions, deterministic RNG
5. Maintain 100% test pass rate

Reference projects:
- MetaPrompt/golden-sun/ (for overworld code)
- NextEraGame/ (for battle code)

Confirm reading, then execute tasks from Technical Session Plan.
```

**What Coder Will Create:**

**Output:** Entire working game!
- `src/` directory (all systems)
- `tests/` directory (72+ context-aware tests)
- Full integration

**Time:** 20-25 hours

**Branch:** `coder-implementation`

---

## 🚀 HANDOFF #5: GRAPHICS INTEGRATION (Fifth Chat)

### **After Coder Completes:**

**Repository Context:**
```
Repository: C:\Dev\AiGames\Zzzzzzzzz\vale-chronicles
Working Directory: vale-chronicles/
Branch: graphics-integration (create from coder-implementation)
Receives: Working game from Coder
```

### **📝 EXACT PROMPT TO USE:**

```markdown
You are the GRAPHICS INTEGRATION specialist for Vale Chronicles.

Repository: C:\Dev\AiGames\Zzzzzzzzz\vale-chronicles

Read your onboarding document:
C:\Dev\AiGames\Zzzzzzzzz\vale-chronicles\ROLE_5_GRAPHICS_INTEGRATION_ONBOARDING.md

You have:
- Working game (from Coder)
- 7 HTML/CSS mockups (mockups/)
- 2,500+ Golden Sun sprites (NextEraGame/public/sprites/)

Your job:
1. Convert mockups to React components
2. Integrate all sprites
3. Add animations (swirl, level up, Djinn activation, etc.)
4. Visual polish
5. DON'T break Coder's tests!

Confirm reading, then begin integration.
```

**What Graphics Integration Will Create:**

**Output:**
- React components from mockups
- Animations and effects
- Visual polish
- Sprite integration complete

**Time:** 5-6 hours

**Branch:** `graphics-integration`

---

## 🚀 HANDOFF #6: QA/VERIFIER (Sixth Chat)

### **After Graphics Integration Completes:**

**Repository Context:**
```
Repository: C:\Dev\AiGames\Zzzzzzzzz\vale-chronicles
Working Directory: vale-chronicles/
Branch: qa-verification (from graphics-integration)
Receives: Polished, complete game
```

### **📝 EXACT PROMPT TO USE:**

```markdown
You are the QA/VERIFIER for Vale Chronicles.

Repository: C:\Dev\AiGames\Zzzzzzzzz\vale-chronicles

Read your onboarding document:
C:\Dev\AiGames\Zzzzzzzzz\vale-chronicles\ROLE_6_QA_VERIFIER_ONBOARDING.md

Your job:
1. Run 2+ full playthroughs (speedrun + completionist)
2. Verify progression (leveling/equipment/Djinn matter?)
3. Test balance (too easy? too hard?)
4. Accessibility audit (WCAG 2.1 AA)
5. Performance testing
6. Create bug reports
7. Final decision: SHIP / FIX / REVISE

Confirm reading, then begin testing.
```

**What QA Will Create:**

**Output:**
- `docs/qa/QA_REPORT.md`
- `docs/qa/BUG_REPORTS.md` (if any)
- `docs/qa/FINAL_APPROVAL.md`

**Time:** 4-5 hours

**Branch:** `qa-verification`

---

## 📁 REPOSITORY STRUCTURE

### **Vale Chronicles Repository:**

```
C:\Dev\AiGames\Zzzzzzzzz\vale-chronicles/
├── docs/
│   ├── story/              # Story Director outputs
│   ├── architect/          # Architect outputs
│   ├── qa/                 # QA outputs
│   ├── ROLE_1_STORY_DIRECTOR_ONBOARDING.md
│   ├── ROLE_2_GRAPHICS_MOCKUP_ONBOARDING.md
│   ├── ROLE_3_ARCHITECT_ONBOARDING.md
│   ├── ROLE_4_CODER_ONBOARDING.md
│   ├── ROLE_5_GRAPHICS_INTEGRATION_ONBOARDING.md
│   ├── ROLE_6_QA_VERIFIER_ONBOARDING.md
│   └── 6_ROLE_WORKFLOW_README.md
│
├── mockups/                # Graphics Mockup outputs
│   ├── vale-village.html (will copy from MetaPrompt)
│   ├── djinn-menu.html (will copy from New folder 5)
│   ├── battle-screen.html (will copy from New folder 5)
│   ├── equipment-screen.html (NEW)
│   ├── unit-collection.html (NEW)
│   ├── rewards-screen.html (NEW)
│   └── battle-transition.html (NEW)
│
├── src/                    # Coder outputs
│   ├── overworld/          # From MetaPrompt
│   ├── battle/             # From NextEraGame
│   ├── progression/        # NEW (Djinn, leveling, recruitment)
│   └── integration/        # NEW (glue layer)
│
├── tests/                  # Coder outputs
│   ├── scenarios/          # Context-aware tests!
│   └── integration/
│
├── public/
│   └── sprites/            # Will copy from NextEraGame
│
├── package.json
├── vite.config.ts
└── tsconfig.json
```

---

## 🎯 STARTING SEQUENCE

### **Step 1: Initialize Repository (Do This Now)**

```bash
cd C:\Dev\AiGames\Zzzzzzzzz\vale-chronicles

# Create directory structure
mkdir docs\story
mkdir docs\architect
mkdir docs\qa
mkdir mockups
mkdir src
mkdir tests
mkdir public

# Copy approved mockups
copy "..\c:\Users\gxpai\Desktop\New folder (5)\djinn-menu.html" mockups\
copy "..\c:\Users\gxpai\Desktop\New folder (5)\golden-sun-battle.html" mockups\
copy "..\MetaPrompt\golden-sun\mockups\vale-village.html" mockups\

# Initial commit
git add .
git commit -m "Initial Vale Chronicles setup - 6-role workflow docs"
```

---

### **Step 2: Start Chat 1 (Story Director)**

**Open NEW Codex chat, paste this:**

```markdown
Repository: C:\Dev\AiGames\Zzzzzzzzz\vale-chronicles

You are ROLE 1: STORY DIRECTOR for Vale Chronicles.

🚨 CRITICAL: Read this file FIRST:
C:\Dev\AiGames\Zzzzzzzzz\vale-chronicles\ROLE_1_STORY_DIRECTOR_ONBOARDING.md

After reading, confirm you understand you are creating:
1. 10 recruitable unit profiles (full personalities, abilities, dialogues)
2. 50 NPC dialogues (battle NPCs + story NPCs + shopkeepers)
3. 12 Djinn lore (names, personalities, elemental themes)
4. Story structure (beginning → boss)
5. Ability flavor text

Your outputs go to: docs/story/

Branch: Create story-director branch from main

Confirm reading and begin creating story content.
```

---

### **Step 3: After Story Director Completes → Chat 2 (Graphics Mockup)**

**Open NEW Codex chat (separate from Chat 1), paste this:**

```markdown
Repository: C:\Dev\AiGames\Zzzzzzzzz\vale-chronicles

You are ROLE 2: GRAPHICS MOCKUP for Vale Chronicles.

🚨 CRITICAL: Read these files FIRST:
1. C:\Dev\AiGames\Zzzzzzzzz\vale-chronicles\ROLE_2_GRAPHICS_MOCKUP_ONBOARDING.md
2. C:\Dev\AiGames\Zzzzzzzzz\vale-chronicles\MOCKUP_INVENTORY.md

You RECEIVED from Story Director (Chat 1):
- docs/story/RECRUITABLE_UNITS_BIBLE.md ✅
- docs/story/NPC_DIALOGUES.md ✅
- docs/story/DJINN_LORE.md ✅
- docs/story/STORY_STRUCTURE.md ✅

You have 3 APPROVED reference mockups:
✅ mockups/vale-village.html (GOOD!)
✅ mockups/djinn-menu.html (GOOD!)
✅ mockups/battle-screen.html (GOOD!)

❌ IGNORE: MetaPrompt/mockup-examples/ (BAD examples - floating units, bad composition)

Your job: Create 4 NEW mockups:
1. mockups/equipment-screen.html
2. mockups/unit-collection.html
3. mockups/rewards-screen.html
4. mockups/battle-transition.html

Branch: Create graphics-mockup branch from story-director

Confirm reading and begin creating mockups.
```

---

### **Step 4: After Graphics Mockup Completes → Chat 3 (Architect)**

**Open NEW Codex chat, paste this:**

```markdown
Repository: C:\Dev\AiGames\Zzzzzzzzz\vale-chronicles

You are ROLE 3: ARCHITECT for Vale Chronicles.

🚨 CRITICAL: Read this file FIRST:
C:\Dev\AiGames\Zzzzzzzzz\vale-chronicles\ROLE_3_ARCHITECT_ONBOARDING.md

You RECEIVED:
- docs/story/ (all story content) ✅
- mockups/ (all 7 mockups) ✅
- VALE_CHRONICLES_ARCHITECTURE.md ✅

Your job: Create technical session plan with:
1. ALL game mechanic FORMULAS (not vague descriptions!)
2. 20+ specific tasks for Coder
3. 30+ context-aware test scenarios
4. Integration point specs
5. Code reuse strategy

Outputs go to: docs/architect/

Branch: Create architect-plan branch from graphics-mockup

Confirm reading and begin technical planning.
```

---

### **Step 5: After Architect Completes → Chat 4 (Coder)**

**Open NEW Codex chat, paste this:**

```markdown
Repository: C:\Dev\AiGames\Zzzzzzzzz\vale-chronicles

You are ROLE 4: CODER for Vale Chronicles.

🚨 CRITICAL: Read this file FIRST:
C:\Dev\AiGames\Zzzzzzzzz\vale-chronicles\ROLE_4_CODER_ONBOARDING.md

You RECEIVED from Architect (Chat 3):
- docs/architect/TECHNICAL_SESSION_PLAN.md ✅
- docs/architect/GAME_MECHANICS.md (all formulas) ✅
- docs/architect/TEST_SCENARIOS.md (30+ tests to implement) ✅

Reference code to copy from:
- C:\Dev\AiGames\Zzzzzzzzz\MetaPrompt\golden-sun\ (overworld)
- C:\Dev\AiGames\Zzzzzzzzz\NextEraGame\ (battle)

Your job:
1. Implement all 8 core systems
2. Write 72+ context-aware tests (SCENARIO tests, not unit tests!)
3. Integrate overworld + battle
4. 100% test pass rate
5. 0 TypeScript errors

Branch: Create coder-implementation branch from main (fresh)

CRITICAL: Use context-aware testing:
✅ "Level 1 loses, Level 5 wins" (proves leveling works)
✅ "No Djinn vs 3 Djinn different outcome" (proves Djinn work)
❌ NOT "function returns boolean" (useless!)

Confirm reading and begin implementation.
```

---

### **Step 6: After Coder Completes → Chat 5 (Graphics Integration)**

**Open NEW Codex chat, paste this:**

```markdown
Repository: C:\Dev\AiGames\Zzzzzzzzz\vale-chronicles

You are ROLE 5: GRAPHICS INTEGRATION for Vale Chronicles.

🚨 CRITICAL: Read this file FIRST:
C:\Dev\AiGames\Zzzzzzzzz\vale-chronicles\ROLE_5_GRAPHICS_INTEGRATION_ONBOARDING.md

You RECEIVED from Coder (Chat 4):
- Working game (src/ directory) ✅
- 72+ tests passing ✅
- All systems functional ✅

You have:
- mockups/ (7 HTML/CSS mockups to convert)
- NextEraGame/public/sprites/ (2,500+ Golden Sun sprites)

Your job:
1. Convert mockups to React components
2. Integrate all sprites
3. Add animations (swirl, level up, Djinn activation)
4. Visual polish
5. DON'T break Coder's tests!

Branch: Create graphics-integration branch from coder-implementation

Confirm reading and begin visual integration.
```

---

### **Step 7: After Graphics Integration Completes → Chat 6 (QA)**

**Open NEW Codex chat, paste this:**

```markdown
Repository: C:\Dev\AiGames\Zzzzzzzzz\vale-chronicles

You are ROLE 6: QA/VERIFIER for Vale Chronicles.

🚨 CRITICAL: Read this file FIRST:
C:\Dev\AiGames\Zzzzzzzzz\vale-chronicles\ROLE_6_QA_VERIFIER_ONBOARDING.md

You RECEIVED: Complete, polished game ✅

Your job:
1. Run 2+ full playthroughs (speedrun + completionist)
2. Verify progression (does leveling/Djinn/equipment matter?)
3. Test balance (too easy? too hard?)
4. Accessibility audit
5. Performance testing
6. Create bug reports
7. FINAL DECISION: SHIP / FIX / REVISE

Output: docs/qa/FINAL_APPROVAL.md

Branch: qa-verification branch from graphics-integration

Confirm reading and begin testing.
```

---

## ✅ QUICK REFERENCE

### **Handoff Checklist:**

- [ ] **Chat 1 (Story Director):** Create story content → outputs to `docs/story/`
- [ ] **Chat 2 (Graphics Mockup):** Create 4 mockups → outputs to `mockups/`
- [ ] **Chat 3 (Architect):** Define mechanics → outputs to `docs/architect/`
- [ ] **Chat 4 (Coder):** Implement systems → outputs to `src/` + `tests/`
- [ ] **Chat 5 (Graphics Integration):** Add polish → enhances `src/`
- [ ] **Chat 6 (QA):** Test & approve → outputs to `docs/qa/`

### **Each Chat:**
1. Gets its own onboarding doc
2. Works on its own branch
3. Receives outputs from prior chat
4. Creates specific deliverables
5. Hands off to next chat

---

## 🎯 **START WITH CHAT 1 NOW!**

**Copy the exact prompt above for Story Director and paste into your first Codex chat!**

Repository is ready: `C:\Dev\AiGames\Zzzzzzzzz\vale-chronicles\`

---

**Let's build Vale Chronicles! 🎮🚀**

>>>>>>> da011dae5a42c00b1fdb0e0f62b8f00e0a566dcf
