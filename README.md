# 🎮 Vale Chronicles

**Golden Sun Overworld + NextEraGame Battles**

A Golden Sun-inspired RPG built using a 6-role AI workflow with context-aware testing.

---

## 🚀 QUICK START

### **For Codex Users:**

Read: `CODEX_HANDOFF_SEQUENCE.md` for complete instructions!

**TL;DR:** Create 6 separate Codex chats (one per role), follow the handoff sequence.

---

### **Starting Chat 1 (Story Director):**

```
Repository: C:\Dev\AiGames\Zzzzzzzzz\vale-chronicles

Read: ROLE_1_STORY_DIRECTOR_ONBOARDING.md

Create story content for Vale Chronicles.
```

---

## 📚 DOCUMENTATION

### **Workflow Guides:**
- `CODEX_HANDOFF_SEQUENCE.md` - Complete handoff instructions
- `6_ROLE_WORKFLOW_README.md` - Workflow overview
- `MOCKUP_INVENTORY.md` - Approved mockups reference

### **Role Onboarding (Read for Your Role):**
- `ROLE_1_STORY_DIRECTOR_ONBOARDING.md` - Narrative design
- `ROLE_2_GRAPHICS_MOCKUP_ONBOARDING.md` - Mockup creation
- `ROLE_3_ARCHITECT_ONBOARDING.md` - Technical planning
- `ROLE_4_CODER_ONBOARDING.md` - Implementation + testing
- `ROLE_5_GRAPHICS_INTEGRATION_ONBOARDING.md` - Visual polish
- `ROLE_6_QA_VERIFIER_ONBOARDING.md` - Quality assurance

### **Technical:**
- `VALE_CHRONICLES_ARCHITECTURE.md` - System architecture
- `VALE_CHRONICLES_SETUP_COMPLETE.md` - Setup summary

---

## 🎯 GAME DESIGN

**Core Features:**
- **Overworld:** Vale Village exploration (Golden Sun style)
- **Battles:** 4v4 turn-based combat (NextEraGame system)
- **Units:** 10 recruitable, Levels 1-5, ability unlocks
- **Djinn:** 12 collectible (3 per element), team synergy bonuses
- **Equipment:** 4 slots (Weapon/Armor/Helm/Boots)
- **Progression:** XP-based leveling, equipment upgrades, Djinn collection

---

## 🧪 TESTING PHILOSOPHY

**Context-Aware Testing (Revolutionary!):**

```typescript
// ✅ GOOD TEST (Proves game works)
test('Level 1 loses to Boss, Level 5 wins', () => {
  // Tests real progression
});

// ❌ BAD TEST (Tests nothing)
test('function returns number', () => {
  // Useless!
});
```

**See `ROLE_4_CODER_ONBOARDING.md` for complete testing guide.**

---

## 📊 PROJECT STATUS

| Phase | Status | Progress |
|-------|--------|----------|
| Story Director | 🆕 Not started | 0% |
| Graphics Mockup | 🔄 Partial | 43% (3 of 7 mockups) |
| Architect | 🆕 Not started | 0% |
| Coder | 🆕 Not started | 0% |
| Graphics Integration | 🆕 Not started | 0% |
| QA/Verifier | 🆕 Not started | 0% |

**Overall:** ~6% complete

---

## 🎨 MOCKUPS

**Approved (3 of 7):**
- ✅ Vale Village Overworld
- ✅ Djinn Menu
- ✅ Battle Screen

**Needed (4 remaining):**
- 🆕 Equipment Screen
- 🆕 Unit Collection
- 🆕 Rewards Screen
- 🆕 Battle Transition

---

## 🏗️ CODE REUSE

**From:**
- `../MetaPrompt/golden-sun/` - Overworld systems
- `../NextEraGame/` - Battle systems + 2,500+ sprites

**Build New:**
- Djinn system (replaces gems)
- Leveling 1-5
- 10 recruitable units
- Battle transitions
- Integration layer

---

## ⏱️ TIMELINE

**Estimated:** 53-68 hours total

- Story: 6-8h
- Mockups: 12-15h (8h remaining)
- Architect: 3-4h
- Coder: 20-25h
- Graphics: 5-6h
- QA: 4-5h

---

## 📞 QUESTIONS?

See `CODEX_HANDOFF_SEQUENCE.md` for step-by-step instructions!

---

**Built with ❤️ using the 6-role AI workflow**

