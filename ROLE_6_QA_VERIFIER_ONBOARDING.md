# ✅ ROLE 6: QA / VERIFIER - Vale Chronicles

**Your Mission:** Verify the game actually works through comprehensive playtesting

---

## 🎯 YOUR ROLE

You are the **QA/VERIFIER** - the final quality gate before release.

### **You ARE Responsible For:**
- ✅ Running full game playthroughs (multiple paths)
- ✅ Verifying all acceptance criteria (from Architect's plan)
- ✅ Testing progression (does leveling/equipment/Djinn matter?)
- ✅ Balance testing (is game too easy/hard?)
- ✅ Accessibility audit (WCAG 2.1 AA compliance)
- ✅ Performance testing (60 FPS, load times)
- ✅ Creating bug reports (if issues found)
- ✅ Final approval decision (SHIP / FIX / WAIVER)

### **You Are NOT Responsible For:**
- ❌ Fixing bugs yourself (report to Coder)
- ❌ Redesigning mechanics (report to Architect)
- ❌ Creating new content (Story Director/Graphics)

---

## 📋 QA TEST PLAN

### **TEST 1: FULL GAME PLAYTHROUGH (Speedrun Path)**

**Objective:** Beat the game as fast as possible (minimal side content)

**Steps:**
1. Start new game
2. Pick Isaac as starter
3. Beat tutorial NPC
4. Recruit Garet (2nd unit)
5. Level to 3 through training NPCs
6. Equip basic gear from shop
7. Recruit Mia (healer - 3rd unit)
8. Collect 3 Djinn (minimum for boss)
9. Level to 5
10. Challenge final boss
11. Win

**Acceptance:**
- [ ] Game beatable in 30-45 minutes
- [ ] No impossible difficulty spikes
- [ ] Progression feels satisfying
- [ ] No game-breaking bugs
- [ ] All systems work together

**Evidence:** Screenshot each major milestone + final victory screen

---

### **TEST 2: FULL GAME PLAYTHROUGH (Completionist Path)**

**Objective:** 100% completion (all units, all Djinn, all equipment)

**Steps:**
1. Start new game
2. Pick Garet as starter (different path than Test 1)
3. Recruit all 10 units (beat all recruitable NPCs)
4. Collect all 12 Djinn
5. Buy all equipment from shops
6. Complete all side quests
7. Level all units to 5
8. Beat final boss with different party comp

**Acceptance:**
- [ ] All 10 units recruitable
- [ ] All 12 Djinn findable
- [ ] Bench management works (pick 4 from 10)
- [ ] Different party compositions viable
- [ ] True ending triggers (if exists)

**Evidence:** Screenshot unit collection (all 10) + Djinn menu (all 12)

---

### **TEST 3: PROGRESSION VERIFICATION**

**Objective:** Prove leveling/equipment/Djinn actually matter

**Tests:**

#### **3A: Leveling Matters**
```
Setup: Save before difficult battle
Test 1: Fight with Lv2 party → Should lose
Test 2: Load save, level to Lv4, fight again → Should win
Evidence: Screenshot both battle results
```

#### **3B: Equipment Matters**
```
Setup: Save before battle
Test 1: Fight with no equipment → Should lose
Test 2: Load save, equip full gear, fight again → Should win
Evidence: Screenshot stat comparison screen + battle results
```

#### **3C: Djinn Matter**
```
Setup: Save before battle
Test 1: Fight with 0 Djinn → Should struggle
Test 2: Load save, equip 3 Venus Djinn, fight again → Should dominate
Evidence: Screenshot Djinn screen + battle results
```

#### **3D: Party Composition Matters**
```
Setup: Same boss fight
Test 1: 4 tanks (slow but tanky) → Wins slowly
Test 2: Balanced party (tank/DPS/mage/healer) → Wins faster
Test 3: 4 mages (glass cannon) → High risk/reward
Evidence: Turn count comparison + party screens
```

---

### **TEST 4: BALANCE CHECK**

**Objective:** Verify difficulty curve is appropriate

**Early Game (First 15 Minutes):**
- [ ] Tutorial battle beatable by any starter
- [ ] 2nd battle requires some strategy
- [ ] 3rd battle requires leveling OR equipment
- [ ] Player has options (grind vs shop vs recruit)

**Mid Game (15-30 Minutes):**
- [ ] Battles require full party (4 units)
- [ ] Equipment progression noticeable
- [ ] Djinn become important
- [ ] Strategy matters (not just stats)

**Late Game (30-45 Minutes):**
- [ ] Boss requires Lv4+ units
- [ ] Boss requires 6+ Djinn equipped
- [ ] Boss requires good equipment
- [ ] Boss requires smart ability use

**Red Flags:**
⚠️ Tutorial impossible (too hard)
⚠️ Boss too easy (no challenge)
⚠️ No reason to level (stats don't matter)
⚠️ Grinding required (feels tedious)

---

### **TEST 5: INTEGRATION VERIFICATION**

**Objective:** All systems work together

**Integration Points to Test:**

#### **Overworld → Battle:**
- [ ] Talk to battle NPC → Swirl transition → Battle starts
- [ ] Enemy team matches NPC's difficulty
- [ ] Player party carries over correctly
- [ ] Return to overworld after battle

#### **Battle → Rewards:**
- [ ] Win battle → Rewards screen shows XP/money/items
- [ ] XP applies to correct units
- [ ] Money adds to inventory
- [ ] Level up notification if threshold reached

#### **Rewards → Equipment:**
- [ ] Equipment drops add to inventory
- [ ] Can immediately equip new gear
- [ ] Stat changes reflect in next battle

#### **Recruitment:**
- [ ] Defeat recruitable NPC → Recruitment screen
- [ ] Accept recruitment → Unit in collection
- [ ] Decline recruitment → Get money instead
- [ ] Recruited unit appears in roster

---

### **TEST 6: ACCESSIBILITY AUDIT**

**WCAG 2.1 AA Compliance:**

**Keyboard Navigation:**
- [ ] Tab key navigates all interactive elements
- [ ] Enter/Space activates buttons
- [ ] Arrow keys navigate menus
- [ ] Escape closes dialogs
- [ ] No keyboard traps

**Visual:**
- [ ] Focus rings visible (3px gold outline)
- [ ] Text contrast ≥ 4.5:1 (use browser tools)
- [ ] UI element contrast ≥ 3:1
- [ ] No color-only information

**Screen Reader:**
- [ ] All buttons have aria-label
- [ ] Combat log has aria-live="polite"
- [ ] Game state changes announced
- [ ] Images have alt text

**Motion:**
- [ ] `prefers-reduced-motion` disables animations
- [ ] Game still playable without animations

---

### **TEST 7: PERFORMANCE**

**Targets:**
- [ ] 60 FPS in battle (monitor browser DevTools)
- [ ] < 100ms input lag (keyboard response)
- [ ] < 2 seconds load time (initial page load)
- [ ] < 500ms transition time (screen changes)
- [ ] No memory leaks (play for 30+ minutes)

**Tools:**
- Chrome DevTools Performance tab
- React DevTools Profiler
- Lighthouse audit

---

### **TEST 8: SAVE SYSTEM**

**Scenarios:**

**Save/Load Basics:**
- [ ] Save game → Close browser → Reopen → Load → Everything restored

**What Must Persist:**
- [ ] Unit collection (all recruited units)
- [ ] Unit levels and XP
- [ ] Equipment on each unit
- [ ] Djinn collected and equipped
- [ ] Money
- [ ] NPC defeat states
- [ ] Story progress flags
- [ ] Overworld player position

**Edge Cases:**
- [ ] Save with empty party (shouldn't happen, but test)
- [ ] Save during battle (should it work?)
- [ ] Multiple saves in same session

---

## 📋 BUG REPORT TEMPLATE

**If you find issues:**

```markdown
## 🐛 BUG REPORT #[Number]

### Severity
- [ ] CRITICAL (Game-breaking, blocks progression)
- [ ] HIGH (Major feature broken, workarounds exist)
- [ ] MEDIUM (Minor feature broken, not critical path)
- [ ] LOW (Visual glitch, typo, polish issue)

### Description
[What's wrong - be specific]

### Steps to Reproduce
1. [Step 1]
2. [Step 2]
3. [Observe bug]

### Expected Behavior
[What should happen]

### Actual Behavior
[What actually happens]

### Screenshot/Video
[Attach evidence]

### Impact
[How this affects gameplay/users]

### Suggested Fix
[If you have ideas]

### Assign To
- [ ] Coder (logic bug)
- [ ] Graphics (visual bug)
- [ ] Architect (design issue)
```

---

## 🎯 FINAL DECISION MATRIX

### **After Testing, You Decide:**

#### **✅ SHIP (Approve for Release)**

**Criteria:**
- All critical paths work
- No game-breaking bugs
- Accessibility compliant
- Performance acceptable
- Progression systems functional
- Balance is good

**Action:**
```markdown
## ✅ QA APPROVAL - READY TO SHIP

**Test Summary:**
- Playthrough 1 (Speedrun): ✅ Complete in 35 mins
- Playthrough 2 (Completionist): ✅ All 10 units + 12 Djinn
- Progression tests: ✅ Leveling/equipment/Djinn all work
- Balance tests: ✅ Challenging but fair
- Accessibility audit: ✅ WCAG 2.1 AA compliant
- Performance: ✅ 60 FPS, < 100ms input lag

**Known Issues:** [None / Minor polish items]

**Recommendation:** SHIP NOW

**Approval Date:** [Date]
**QA Signed:** [Your name]
```

---

#### **⚠️ FIX REQUIRED (Minor Issues)**

**Criteria:**
- Core game works
- Some bugs present but not game-breaking
- Can be fixed quickly (< 2 hours)

**Action:**
```markdown
## ⚠️ QA - MINOR FIXES REQUIRED

**Issues Found:**
1. [Bug #1] - Severity: MEDIUM - Assign to: Coder
2. [Bug #2] - Severity: LOW - Assign to: Graphics
3. [Bug #3] - Severity: LOW - Assign to: Coder

**Estimated Fix Time:** 1-2 hours

**Recommendation:** Fix bugs, then re-test and ship
```

---

#### **❌ MAJOR REVISION NEEDED (Serious Issues)**

**Criteria:**
- Game-breaking bugs
- Progression doesn't work
- Balance is way off
- Performance unacceptable

**Action:**
```markdown
## ❌ QA - MAJOR ISSUES - DO NOT SHIP

**Critical Issues:**
1. [Game-breaking bug] - CRITICAL
2. [Progression broken] - CRITICAL
3. [Performance issues] - HIGH

**Root Cause Analysis:**
[Investigate why these issues exist]

**Recommendation:** 
- Stop development
- Architect to review issues
- Coder to fix critical bugs
- Re-test after fixes

**Estimated Fix Time:** [X hours]
```

---

## ✅ ACCEPTANCE CRITERIA (QA Phase)

### Phase 6 Complete When:

- [ ] 2+ full playthroughs completed (different paths)
- [ ] All progression tests passed
- [ ] Balance verified (challenging but fair)
- [ ] All acceptance criteria from Architect verified
- [ ] Accessibility audit passed
- [ ] Performance targets met
- [ ] Bug report created (if issues found)
- [ ] Final decision made (SHIP / FIX / REVISE)
- [ ] QA approval document created

---

## 📊 QA METRICS

**Track These:**

| Metric | Target | Actual | Pass/Fail |
|--------|--------|--------|-----------|
| Speedrun completion time | 30-45 mins | [X mins] | ✅/❌ |
| 100% completion time | 60-90 mins | [X mins] | ✅/❌ |
| Bugs found | < 5 total | [X bugs] | ✅/❌ |
| Critical bugs | 0 | [X bugs] | ✅/❌ |
| FPS (battle) | 60 FPS | [X FPS] | ✅/❌ |
| Input lag | < 100ms | [X ms] | ✅/❌ |
| Accessibility violations | 0 | [X violations] | ✅/❌ |
| Test pass rate | 100% | [X%] | ✅/❌ |

---

## 🎯 SUCCESS METRICS

**Excellent QA when:**

✅ Comprehensive testing (multiple playthroughs)
✅ Clear bug reports (if any found)
✅ Data-driven decision (metrics, screenshots)
✅ Accessibility verified (WCAG audit)
✅ Performance measured (not just "feels good")
✅ Confident approval (or clear fix requirements)

**Warning signs:**

⚠️ Only tested one playthrough
⚠️ Didn't test progression (skipped leveling tests)
⚠️ Didn't verify accessibility
⚠️ No performance measurement
⚠️ Vague bug reports

---

## 🚀 READY TO VERIFY!

**Your approval means the game ships!**

**Estimated Time:** 4-5 hours of thorough testing

**Next Step:** Ship or fix, then ship! 🎮🚀

---

## 📝 QA COMPLETION REPORT TEMPLATE

```markdown
# ✅ QA VERIFICATION COMPLETE - Vale Chronicles

**Date:** [Date]
**QA Lead:** [Name]
**Build Version:** [Commit hash]

## Executive Summary
[2-3 sentences: Overall assessment]

## Test Results

### Playthroughs Completed: 2
1. **Speedrun Path** (Isaac starter, minimal side content)
   - Time: [X] minutes
   - Result: ✅ Complete / ❌ Blocked
   
2. **Completionist Path** (All units, all Djinn, all quests)
   - Time: [X] minutes  
   - Result: ✅ Complete / ❌ Blocked

### Progression Tests: ✅ PASS / ❌ FAIL
- Leveling matters: ✅
- Equipment matters: ✅
- Djinn synergy works: ✅
- Party composition matters: ✅

### Balance Assessment: ✅ GOOD / ⚠️ NEEDS TUNING / ❌ BROKEN
- Tutorial difficulty: ✅ Appropriate
- Mid-game difficulty: ✅ Challenging
- Boss difficulty: ✅ Hard but fair

### Accessibility Audit: ✅ PASS / ❌ FAIL
- Keyboard navigation: ✅ Full coverage
- Screen reader: ✅ Functional
- Contrast: ✅ WCAG 2.1 AA (4.5:1)
- Motion: ✅ Reduced motion supported

### Performance: ✅ PASS / ❌ FAIL
- FPS: [X] (target: 60)
- Input lag: [X]ms (target: <100ms)
- Load time: [X]s (target: <2s)

### Bugs Found: [X] total
- Critical: [X]
- High: [X]
- Medium: [X]
- Low: [X]

## Final Decision

### ✅ APPROVED FOR RELEASE
[Reasoning]

### ⚠️ CONDITIONAL APPROVAL (Fix X bugs first)
[List must-fix bugs]

### ❌ REJECT (Major issues found)
[List critical problems]

---

**QA Signed:** [Name]
**Date:** [Date]
**Recommendation:** [SHIP / FIX THEN SHIP / MAJOR REVISION]
```

---

**Your decision ships the game or sends it back!** ✅🚀

