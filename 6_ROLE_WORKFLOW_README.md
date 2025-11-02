# 🎭 VALE CHRONICLES - 6-ROLE AI WORKFLOW

**The Complete Development System**

---

## 📚 QUICK START

### **Choose Your Role:**

| Role | Read This File | Time Commitment |
|------|---------------|-----------------|
| **📖 Story Director** | `ROLE_1_STORY_DIRECTOR_ONBOARDING.md` | 6-8 hours |
| **🎨 Graphics Mockup** | `ROLE_2_GRAPHICS_MOCKUP_ONBOARDING.md` | 15-20 hours |
| **🏛️ Architect** | `ROLE_3_ARCHITECT_ONBOARDING.md` | 3-4 hours |
| **💻 Coder** | `ROLE_4_CODER_ONBOARDING.md` | 20-25 hours |
| **✨ Graphics Integration** | `ROLE_5_GRAPHICS_INTEGRATION_ONBOARDING.md` | 5-6 hours |
| **✅ QA/Verifier** | `ROLE_6_QA_VERIFIER_ONBOARDING.md` | 4-5 hours |

**Total Project Time:** 50-70 hours

---

## 🔄 WORKFLOW SEQUENCE

```
1. STORY DIRECTOR (6-8h)
   Creates: Story bible, unit profiles, NPC dialogues, Djinn lore
   Passes to: Graphics Phase 1
   ↓

2. GRAPHICS PHASE 1: MOCKUP (15-20h)
   Creates: 7 HTML/CSS mockups, sprite maps, design tokens
   Passes to: Architect
   ↓

3. ARCHITECT (3-4h)
   Creates: Technical session plan, 20+ tasks, mechanics formulas
   Passes to: Coder
   ↓

4. CODER (20-25h)
   Creates: All systems, 72+ context-aware tests, integration
   Passes to: Graphics Phase 2
   ↓

5. GRAPHICS PHASE 2: INTEGRATION (5-6h)
   Creates: React components, animations, visual polish
   Passes to: QA
   ↓

6. QA / VERIFIER (4-5h)
   Creates: Test reports, bug reports, approval decision
   Decision: SHIP / FIX / REVISE
```

---

## 🎯 ROLE BOUNDARIES

### **What Each Role DOES and DOES NOT Do:**

| Role | Does | Does NOT |
|------|------|----------|
| **Story Director** | Write narrative, create characters, design world | Define mechanics, write code, create sprites |
| **Graphics Mockup** | Create HTML/CSS mockups, gather sprites, design UI | Write React code, implement logic |
| **Architect** | Define mechanics (formulas), create technical plan | Write implementation code, make sprites |
| **Coder** | Implement systems, write context-aware tests | Make strategic decisions, design mechanics |
| **Graphics Integration** | Convert mockups to React, add animations | Change game logic, modify systems |
| **QA** | Test game, verify quality, approve/reject | Fix bugs, redesign features |

---

## 📋 CRITICAL SUCCESS FACTORS

### **1. Context-Aware Testing (Revolutionary!)**

**OLD WAY:**
```typescript
test('function returns number', () => {
  expect(typeof result).toBe('number');
}); // ← Tests nothing!
```

**NEW WAY:**
```typescript
test('SCENARIO: Level 1 loses to Boss, Level 5 wins', () => {
  // Tests real game progression
  // Proves leveling system works
  // Actually meaningful!
});
```

**Why This Matters:**
- ✅ Tests prove game actually works
- ✅ Catches real gameplay issues
- ✅ Verifies systems integrate correctly
- ✅ Ensures progression matters
- ❌ NO MORE useless unit tests!

---

### **2. Clear Hand-Offs**

Each role passes deliverables to next role:

**Story Director → Graphics Mockup:**
- ✅ Story bible (10 units, 50 NPCs, 12 Djinn)
- ✅ All dialogue written
- ✅ Clear visual requirements

**Graphics Mockup → Architect:**
- ✅ 7 mockup HTML files
- ✅ Sprite maps (JSON)
- ✅ Design tokens (CSS)
- ✅ MOCKUP_APPROVED.md for each

**Architect → Coder:**
- ✅ Technical session plan
- ✅ 20+ task prompts
- ✅ All formulas/mechanics defined
- ✅ Context-aware test scenarios specified

**Coder → Graphics Integration:**
- ✅ All systems implemented
- ✅ 72+ tests passing
- ✅ Full game loop working
- ✅ Ready for visual polish

**Graphics Integration → QA:**
- ✅ All mockups converted to React
- ✅ All sprites integrated
- ✅ Animations complete
- ✅ Visually polished

**QA → SHIP:**
- ✅ Comprehensive testing complete
- ✅ Bugs reported/fixed
- ✅ Final approval given

---

## 🎨 MOCKUP REFERENCES

**📋 COMPLETE INVENTORY:** `MOCKUP_INVENTORY.md` lists all approved and rejected mockups!

### **✅ APPROVED Reference Mockups (USE THESE!):**

**1. Vale Village Overworld**
- **File:** `MetaPrompt/golden-sun/mockups/vale-village.html`
- **Quality:** ✅ Excellent
- **Shows:** 16 NPCs properly positioned, 7 buildings, paths, dialogue box, proper entity grounding

**2. Djinn Menu**
- **File:** `c:\Users\gxpai\Desktop\New folder (5)\djinn-menu.html`
- **Quality:** ✅ Excellent
- **Shows:** 4-column layout, element color coding, party portraits, Psynergy lists

**3. Battle Screen**
- **File:** `c:\Users\gxpai\Desktop\New folder (5)\golden-sun-battle.html`
- **Quality:** ✅ Excellent
- **Shows:** Cave background, proper sprite positioning, command menu, combat log, turn order

---

### **❌ REJECTED Mockups (DON'T USE!):**

**Location:** `MetaPrompt/mockup-examples/` (PR #24)

**Why Rejected:**
- Units floating (no grounding/platforms)
- Random objects (boats in wrong places)
- Everything centered (poor composition)
- These are BAD EXAMPLES of what NOT to do

---

**Graphics roles: Copy the 3 APPROVED mockups, ignore PR #24 examples!**

---

## 🏗️ CODE REUSE STRATEGY

### **MetaPrompt/golden-sun Provides:**
✅ Overworld systems (NPC, movement, dialogue, shop)
✅ Overworld components (GameWorld, DialogueBox, ShopMenu)
✅ Vale Village data (50 NPCs, map layout)

### **NextEraGame Provides:**
✅ Battle systems (combat, abilities, buffs)
✅ Battle components (BattleScreen, AnimatedSprite, all UI)
✅ Golden Sun sprites (2,500+ assets)
✅ Sprite registry + animations
✅ Save system foundation

### **New Development Required:**
🆕 Battle transition system
🆕 Djinn system (replace gems)
🆕 Leveling 1-5 with ability unlocks
🆕 10 unique recruitable units
🆕 Recruitment + bench management
🆕 Equipment 4-slot system
🆕 Integration layer

---

## 📊 PROJECT METRICS

### **Estimated Totals:**

| Phase | Hours | Lines of Code | Tests |
|-------|-------|---------------|-------|
| Story Director | 6-8h | 0 (narrative only) | 0 |
| Graphics Mockup | 15-20h | ~3,000 (HTML/CSS) | 0 |
| Architect | 3-4h | 0 (planning only) | 0 |
| Coder | 20-25h | ~8,000 (TypeScript) | 72+ |
| Graphics Integration | 5-6h | ~2,000 (React/CSS) | 0 |
| QA | 4-5h | 0 (testing only) | 0 |
| **TOTAL** | **53-68h** | **~13,000 lines** | **72+ tests** |

---

## ✅ QUALITY GATES

### **After Each Role:**

**Story Director → Graphics:**
- [ ] All 10 units have complete profiles
- [ ] All 50 NPC dialogues written
- [ ] Story structure clear
- [ ] No mechanical details (just narrative)

**Graphics Mockup → Architect:**
- [ ] All 7 mockups created
- [ ] Pixel-perfect Golden Sun aesthetic
- [ ] WCAG 2.1 AA accessible
- [ ] Sprite maps documented

**Architect → Coder:**
- [ ] All mechanics have formulas
- [ ] 20+ clear tasks
- [ ] Context-aware test scenarios defined
- [ ] Integration points specified

**Coder → Graphics Integration:**
- [ ] All systems implemented
- [ ] 72+ context-aware tests passing (100%)
- [ ] TypeScript 0 errors
- [ ] Full game loop working

**Graphics Integration → QA:**
- [ ] All mockups converted to React
- [ ] All sprites integrated (0 console 404s)
- [ ] Animations complete
- [ ] Visually polished

**QA → SHIP:**
- [ ] 2+ full playthroughs
- [ ] All acceptance criteria met
- [ ] Accessibility compliant
- [ ] Performance targets met
- [ ] Final approval given

---

## 🚀 HOW TO USE THIS WORKFLOW

### **Option A: Sequential (Full Workflow)**

```
Week 1: Story Director creates all narrative
Week 2: Graphics Mockup creates all screens
Week 3: Architect plans technical implementation
Weeks 4-5: Coder implements all systems
Week 6: Graphics Integration adds polish
Week 7: QA verifies and approves
```

**Total:** 7 weeks (part-time) or 2 weeks (full-time)

---

### **Option B: Parallel (Faster)**

```
Day 1-2: Story Director + Graphics Mockup (parallel)
Day 3: Architect reviews both
Day 4-8: Coder implements (while Graphics sources more sprites)
Day 9-10: Graphics Integration + QA (parallel)
```

**Total:** 10 days (full-time)

---

### **Option C: Iterative (Agile)**

```
Sprint 1: Story (2 units) → Graphics (battle mockup) → Architect (battle plan) → Coder (battle) → Graphics (polish) → QA
Sprint 2: Story (4 units) → Graphics (Djinn mockup) → Architect (Djinn plan) → Coder (Djinn) → Graphics (effects) → QA
Sprint 3: Story (4 units) → Graphics (equipment) → Architect (full integration) → Coder (integration) → Graphics (polish) → QA → SHIP
```

**Total:** 3 sprints, ship incrementally

---

## 🎯 RECOMMENDED APPROACH

**For Vale Chronicles:**

Use **Option A (Sequential)** with these optimizations:

1. **Story Director:** Create 3 starter units first → Quick Graphics mockup → Early Coder prototype
2. **Then:** Complete remaining 7 units + full mockups
3. **Then:** Full Architect plan → Full Coder implementation
4. **Then:** Graphics polish → QA → Ship

**Benefit:** Working prototype in 1 week, full game in 4-6 weeks

---

## 📞 SUPPORT & QUESTIONS

### **If Roles Get Confused:**
- Read `VALE_CHRONICLES_ARCHITECTURE.md` for system overview
- Check role boundaries in this README
- Verify you're doing your role's work (not another role's)

### **If Handoffs Are Unclear:**
- Story → Graphics: Needs complete story bible
- Graphics → Architect: Needs all mockups + sprite maps
- Architect → Coder: Needs formulas + test scenarios
- Coder → Graphics: Needs working systems + tests passing
- Graphics → QA: Needs polished, integrated game

### **If Quality Issues Arise:**
- Coder: Run `npm test && npm run type-check`
- Graphics: Verify mockups match, sprites load (no 404s)
- QA: Report bugs, don't fix them yourself

---

## 🎉 READY TO BUILD VALE CHRONICLES!

**You now have:**
- ✅ Complete architecture document
- ✅ 6-role workflow onboarding (6 files)
- ✅ Context-aware testing framework
- ✅ Reference mockups (battle + Djinn)
- ✅ Clear handoff procedures
- ✅ Quality gates per phase

**Start with Role 1 (Story Director) and work through sequentially!**

**Or jump to Role 4 (Coder) if you want to start building immediately!**

---

## 📝 FILES CREATED

```
✅ VALE_CHRONICLES_ARCHITECTURE.md - Complete system architecture
✅ ROLE_1_STORY_DIRECTOR_ONBOARDING.md - Narrative design guide
✅ ROLE_2_GRAPHICS_MOCKUP_ONBOARDING.md - Mockup creation guide
✅ ROLE_3_ARCHITECT_ONBOARDING.md - Technical planning guide
✅ ROLE_4_CODER_ONBOARDING.md - Implementation guide
✅ ROLE_5_GRAPHICS_INTEGRATION_ONBOARDING.md - Visual polish guide
✅ ROLE_6_QA_VERIFIER_ONBOARDING.md - Quality assurance guide
✅ 6_ROLE_WORKFLOW_README.md - This file (master overview)
```

**All docs created in:** `C:\Dev\AiGames\Zzzzzzzzz\`

---

**🎮 LET'S BUILD THE BEST GOLDEN SUN RPG EVER! 🎮**

