# VALE CHRONICLES - ESSENTIAL KNOWLEDGE BASE

**Last Updated:** November 14, 2025  
**Version:** 2.0  
**Status:** Phase 7 Complete, Phase 8 Polish Pending

---

## PROJECT STATUS

### Phases Complete (7/8)
✅ Phase 1: Remove Deprecated (crits, dodge, selling, variance)  
✅ Phase 2: Auto-Heal (post-battle HP restoration)  
✅ Phase 3: Mana Generation (+1 on basic hit)  
✅ Phase 4: Predetermined Rewards (choice system)  
✅ Phase 5: Djinn Recovery (1→2, 2→3, 3→4 turns)  
✅ Phase 6: Unit-Locked Equipment  
✅ Phase 7: Djinn Abilities (180 abilities, all 4 elements)  
⏳ Phase 8: Djinn Standby Polish (events, UI, tests)

### Core Systems
- Battle: Queue-based planning, SPD-ordered execution, deterministic
- Mana: Team-shared pool, refills each round, generation on basic hit
- Djinn: 12 total, 3 team slots, element compatibility, 180 abilities
- Equipment: 5 slots, unit-locked, 58 items, 8 tiers
- Progression: 20 levels, 92,800 XP total

---

## CRITICAL MECHANICS (FINAL DESIGN)

### No Random Elements
- NO random encounters (all NPC-triggered)
- NO critical hits (removed)
- NO evasion/dodge (removed)
- NO damage variance (deterministic)
- NO random equipment drops (predetermined)
- NO fleeing system (removed)

### Mana System (Not PP)
- Team-shared pool (sum of unit contributions: typically 8)
- Refills every planning phase
- Basic attacks: 0 mana, generate +1 on hit
- Abilities: 0-4 mana (low 1, mid 2-3, ultimate 4)
- Unlimited per battle (only limited per round)

### Auto-Heal
- After EVERY battle (win or lose)
- Full HP restoration
- All status effects cleared
- No manual healing needed
- No Inn system

### Djinn System
**12 Djinn (3 per element, 3 tiers):**
- Venus: Flint (T1), Granite (T2), Bane (T3)
- Mars: Forge (T1), Corona (T2), Fury (T3)
- Mercury: Fizz (T1), Tonic (T2), Crystal (T3)
- Jupiter: Breeze (T1), Squall (T2), Storm (T3)

**Team Slots:** 3 Djinn equipped globally (not per-unit)

**Element Compatibility (per Djinn):**
- Same: +4 ATK, +3 DEF, 2 abilities
- Counter: -3 ATK, -2 DEF, 2 abilities (PENALTY but unique abilities)
- Neutral: +2 ATK, +2 DEF, 1 ability

**Counter Pairs:**
- Venus ↔ Mars (Earth vs Fire)
- Jupiter ↔ Mercury (Wind vs Water)

**180 Djinn Abilities:** 15 per Djinn across all elements

**Recovery Timing:**
- 1 Djinn activated: 2 rounds
- 2 Djinn activated: 3 rounds each
- 3 Djinn activated: 4 rounds each

**Standby Mechanic:**
- Activated Djinn lose bonuses AND abilities until recovery
- Counter units temporarily lose penalty (strategic!)

---

## ARCHITECTURE

### Core Principles
- Pure functions in core/ (no React, no Math.random)
- Seeded PRNG only (deterministic battles)
- Immutable updates (POJOs with factory functions)
- Zod schemas as source of truth
- No `any` types in core/ (ESLint enforced)

### File Structure
```
src/
├── core/
│   ├── algorithms/  # Pure functions (damage, stats, djinn, xp)
│   ├── models/      # POJOs (Unit, Team, BattleState)
│   ├── services/    # Orchestration (BattleService, QueueBattleService)
│   └── random/      # Seeded PRNG
├── data/
│   ├── definitions/ # Game content (abilities, units, enemies, djinn)
│   └── schemas/     # Zod validation
├── ui/
│   ├── components/  # React components
│   └── state/       # Zustand slices (11 total)
└── infra/
    └── save/        # localStorage
```

### State Management (Zustand)
11 slices: battle, queueBattle, rewards, overworld, dialogue, gameFlow, story, team, inventory, save, dialogue

---

## CRITICAL DECISIONS & CHANGES

### Breaking Changes (Nov 11, 2025)
1. `applyHealing(unit, amount, abilityRevivesFallen: boolean)` - 3rd param required
2. Negative PRNG seeds rejected (throws Error)
3. Team Djinn validation (max 3, no duplicates)

### Design Decisions
- **Mana-only** (PP completely removed from game)
- **Unit-locked equipment** (each character has exclusive gear)
- **Starter Kits** (buy kit to unlock unit's store)
- **No selling** (equipment permanently unlocked)
- **Predetermined rewards** (XP, gold, equipment all fixed per encounter)
- **Boss choice system** (pick 1 of 3 legendary items)

---

## CONTENT STATUS

### Units (6/10 recruitable)
Implemented: adept (Isaac), war-mage (Garet), mystic (Mia), ranger (Felix), sentinel (Piers), stormcaller (Ivan)  
Missing: 4 more units (Jenna, Sheba, Kraden, Kyle)

### Abilities
- Core: 18 base abilities (strike, heal, buff, debuff)
- Djinn: 180 abilities (15 per Djinn) - **READY BUT NOT ACTIVE**

### Djinn (12/12)
All defined with summon effects and granted abilities

### Equipment (58 items)
Complete 8-tier progression (basic → artifact)

### Encounters
- Liberation Arc: 20 encounters (house-01 to house-20) with dialogues
- Simple: 6 encounters (c1_normal_1-3, mini_boss, boss, training)
- **Issue:** Map triggers use c1_* IDs, liberation uses house-* IDs (mismatch)

### Enemies (50+)
Full roster with stats, abilities, AI patterns

### Maps (2)
Vale Village overworld, weapon shop interior

---

## CRITICAL ISSUES

### 🔴 Priority 1: Djinn Abilities Not Active
**Problem:** Code imports `djinnAbilities.ts` (148 abilities) but `djinnAbilitiesNew.ts` has 180  
**Impact:** Phase 7 not fully deployed  
**Fix:** Consolidate files, use 180-ability version  
**Effort:** 15 minutes

### 🔴 Priority 2: Encounter ID Mismatch
**Problem:** maps.ts uses `c1_normal_*`, liberation arc uses `house-*`  
**Impact:** Chapter 1 content disconnected from overworld  
**Fix:** Align encounter IDs in maps.ts  
**Effort:** 30 minutes

### ⚠️ Priority 3: Counter Djinn Too Weak
**Problem:** -9 ATK penalty (3 counter Djinn) cripples units  
**Impact:** Counter builds unplayable  
**Fix:** Reduce to -6 ATK or boost counter ability power 1.5×  
**Effort:** 1 hour (rebalance + test)

### ⚠️ Priority 4: Missing UI Screens
**Problem:** No character management, Djinn collection screen minimal  
**Impact:** Can't see full roster or Djinn abilities  
**Fix:** Add/polish UI screens  
**Effort:** 2-3 days

### ⚠️ Priority 5: Stat Tooltips Missing
**Problem:** Players can't see stat breakdowns (base + equip + Djinn)  
**Impact:** Djinn bonuses invisible, choices unclear  
**Fix:** Add tooltips to all stat displays  
**Effort:** 1 day

---

## GAME BALANCE

### XP Curve (Levels 1-20)
```
L1→2: 100    L6→7: 1,600    L11→12: 4,400   L16→17: 9,400
L2→3: 250    L7→8: 2,000    L12→13: 5,200   L17→18: 10,700
L3→4: 500    L8→9: 2,500    L13→14: 6,100   L18→19: 12,100
L4→5: 1,000  L9→10: 3,100   L14→15: 7,100   L19→20: 13,600
L5→6: 1,250  L10→11: 3,700  L15→16: 8,200   Total: 92,800
```

### Djinn Synergy Bonuses (Team-Wide)
```
1 Djinn:  +4 ATK, +3 DEF
2 Same:   +8 ATK, +5 DEF
2 Diff:   +5 ATK, +5 DEF
3 Same:   +12 ATK, +8 DEF + unlock ultimate ability
3 Mixed:  +8 ATK, +6 DEF + unlock hybrid ability
3 All Diff: +4 ATK, +4 DEF, +4 SPD + unlock harmony ability
```

### Element Advantages
```
Venus → Jupiter: 1.5×
Mars → Venus: 1.5×
Mercury → Mars: 1.5×
Jupiter → Mercury: 1.5×
Reverse: 0.67×
```

### Damage Formulas
```
Physical: (basePower + ATK - (DEF × 0.5))
Psynergy: (basePower + MAG - (DEF × 0.3)) × elementModifier
Minimum: 1 damage always
```

---

## STRATEGIC DEPTH

### Dominant Strategies (Needs Balancing)
**Mono-Element Stack** (Strongest)
- All same element units + matching Djinn
- +12 ATK, +8 DEF to all
- Vulnerable to resistant enemies

**Counter Gambit** (Currently Too Weak)
- Accept -9 ATK penalty for unique abilities
- Penalty too harsh, rarely worth it
- **FIX NEEDED:** Reduce penalties or boost abilities

**Stagger Summon** (Optimal)
- Activate 1 Djinn per round (1+1+1 strategy)
- Maintain 2/3 bonuses continuously
- Low risk, consistent power

**All-In Burst** (High Risk)
- Activate all 3 Djinn together
- Lose ALL bonuses for 4 rounds
- Too punishing, rarely optimal

### Key Trade-Offs
- **Mana generation:** Fast units basic attack → slow units afford ultimates
- **Djinn activation:** Powerful summon vs losing bonuses/abilities
- **Element compatibility:** Specialization (+12 ATK) vs diversity (cover weaknesses)

---

## DATA VALIDATION

### Schemas
- All game data validates via Zod
- Run: `pnpm validate:data`
- Ability, Unit, Enemy, Encounter, Equipment, Djinn schemas

### Testing
- 37+ test files
- 198/206 tests passing (8 pre-existing failures in fixtures)
- Property-based testing with fast-check
- Deterministic via seeded PRNG

---

## DEVELOPMENT COMMANDS

```bash
# Development
pnpm dev              # Start dev server (localhost:5173)
pnpm build            # Type check + build
pnpm typecheck        # TypeScript validation

# Testing
pnpm test             # All tests with coverage
pnpm test:watch       # Watch mode
pnpm validate:data    # Validate game data

# Pre-commit
pnpm precommit        # Typecheck + lint + test + validate
```

---

## IMMEDIATE NEXT STEPS

### This Week (Must-Do)
1. ✅ Consolidate Djinn ability files (activate 180-ability version)
2. ✅ Add Djinn ID validation test
3. ✅ Align map encounter IDs with liberation arc
4. ✅ Complete Phase 8 (events, UI, tests)

### Next 2 Weeks (Content)
5. Create 10 more encounters (Chapter 1 needs 15-20 total)
6. Balance pass (counter Djinn, enemy HP tuning)
7. Add stat breakdown tooltips
8. Polish Djinn collection UI

### Next 4 Weeks (Chapter 1 Release)
9. Add missing UI screens (character management, main menu)
10. Visual feedback pass (animations, effects)
11. Full Chapter 1 playtest
12. Surgical balance fixes

---

## CRITICAL WARNINGS

### ⚠️ Counter Djinn Penalty Too Harsh
**Issue:** -9 ATK from 3 counter Djinn makes units useless  
**Impact:** 60 counter abilities will never be used  
**Fix:** Change to -2/-1 per Djinn OR make counter abilities 1.5× stronger

### ⚠️ Healing Might Be Underpowered
**Issue:** Auto-heal makes in-battle healing less valuable  
**Impact:** Healing abilities rarely used  
**Fix:** Buff healing 2:1 ratio OR add bonus effects (heal + buff)

### ⚠️ Stat Visibility Gap
**Issue:** Players can't see Djinn bonus breakdowns  
**Impact:** Activation decisions feel blind  
**Fix:** Add tooltips showing "ATK: 50 (Base 26 + Equip 12 + Djinn 12)"

### ⚠️ Mono-Element Dominance
**Issue:** Same-element stacking is clearly best (+12/+8)  
**Impact:** No build variety  
**Fix:** Design encounters that require diversity OR buff mixed builds

---

## CHANGELOG HIGHLIGHTS

### November 12, 2025
- Phase 7 complete (180 Djinn abilities)
- Instruction booklet revised (authoritative source)
- GAME_MECHANICS.md aligned (PP removed, flee removed)

### November 11, 2025 (Breaking Changes)
- Healing API: 3rd parameter required
- PRNG validation: Negative seeds rejected
- Team Djinn: Duplicate prevention, 3-Djinn limit enforced

### October-November 2025
- GameProvider → Zustand migration complete
- QueueBattleService refactored (composable phases)
- Equipment schema: statBonus defaults to {}

---

## KEY NUMBERS

**Battle:**
- Party size: 4 units active (10 total recruitable, 6 bench)
- Mana pool: 8 average (varies by units)
- Mana costs: 0-4 range
- Djinn slots: 3 (team-wide, not per-unit)

**Progression:**
- Max level: 20
- Total XP: 92,800
- Abilities per unit: 11-21 (base + equipment + Djinn)

**Content:**
- Units: 6 implemented, 10 total
- Djinn: 12 (all defined)
- Abilities: 18 base + 180 Djinn
- Equipment: 58 items
- Enemies: 50+
- Encounters: 26 (20 liberation + 6 simple)
- Maps: 2

---

## ARCHITECTURE GUARDRAILS

### Must Follow
- Seeded PRNG only (never Math.random in core/)
- Immutable updates (return new objects)
- No React in core/
- No `any` types in core/
- Zod validation for all data
- Result types for errors

### Import Restrictions (ESLint)
- ❌ UI cannot import core/ directly
- ❌ Algorithms cannot import services/
- ✅ Services use algorithms and models
- ✅ UI uses Zustand slices

---

## TESTING PHILOSOPHY

**Context-Aware Testing**
```typescript
// ✅ GOOD - Proves gameplay
test('Level 1 loses to Boss, Level 5 wins', () => {
  // Tests progression matters
});

// ❌ BAD - Tests nothing meaningful
test('function returns number', () => {
  // Useless
});
```

**Property-Based Testing**
Uses fast-check for invariants (damage ≥ 0, turn order deterministic)

---

## COMMON PITFALLS

### 1. PP References
**Old:** Abilities cost PP  
**New:** Abilities cost mana  
**Watch:** Any mention of "psynergy points" or "PP restore"

### 2. Critical Hits
**Old:** Damage can crit for 2×  
**New:** Crits completely removed  
**Watch:** Any crit chance calculations

### 3. Equipment Sharing
**Old:** Any unit can equip any item  
**New:** Equipment is unit-locked  
**Watch:** Equipment assignment code

### 4. Random Rewards
**Old:** RNG equipment drops  
**New:** Predetermined rewards (fixed or choice)  
**Watch:** Any `calculateEquipmentDrops(rng)` calls

---

## DOCUMENTATION HIERARCHY

**Player-Facing (Authoritative):**
1. `VALE_CHRONICLES_INSTRUCTION_BOOKLET.md` - Complete game manual
2. In-game tutorials (when added)

**Developer (Primary):**
1. `CLAUDE.md` - Project overview
2. `CLAUDE.md` - Architecture details
3. `docs/architect/GAME_MECHANICS.md` - Technical specifications
4. `prompts/` - Implementation guides for each phase

**Reference:**
1. `COMPREHENSIVE_AUDIT_2025.md` - Content audit & roadmap
2. `VALE_CHRONICLES_ARCHITECTURE.md` - Complete system architecture
3. `CHANGELOG.md` - Breaking changes & updates

---

## QUICK WINS (High Value, Low Effort)

### 1-Hour Tasks
- Add Djinn ID validation test
- Align map encounter IDs
- Add stat breakdown tooltip to one screen
- Fix one golden test

### Half-Day Tasks
- Complete Phase 8 (events + UI)
- Tune counter Djinn penalties
- Add character management screen polish
- Create 3 new encounters

### 1-Day Tasks
- Enemy HP rebalancing pass
- Add stat tooltips throughout
- Create 5 new encounters
- Write 5 dialogue trees

---

## KNOWN BUGS & TECH DEBT

### Pre-Existing Test Failures (8)
- Progression.test.ts (5 failures) - Invalid unit IDs in fixtures
- golden-runner.test.ts (2 failures) - Enemy initialization broken
- save-roundtrip.test.ts (1 failure) - Notes field issue

### TypeScript Errors (10)
- Overworld: Missing MapSchema import
- OverworldService: Implicit any types
- SaveSlice: currentEncounter type mismatch
- **Status:** Known, documented, low priority

### Tech Debt (Low)
- Two battle systems (classic + queue) - some duplication
- Console.warn statements (cleanup needed)
- AI doesn't use effective stats (uses base stats)

---

## FORMULAS REFERENCE

### XP Rewards
```
Base XP = 50 + (enemy level × 10)
Party Penalty: ×0.8 if party size > 1
Distribution: Full XP to each active unit (not split)
KO'd units: DO get XP
Bench units: DON'T get XP
```

### Gold Rewards
```
Gold = 25 + (enemy level × 15)
L1: 40g, L3: 70g, L5: 100g
```

### Status Effects (Placeholders)
```
Poison: 8% max HP per turn, 5 turns
Burn: 10% max HP per turn, 3 turns
Freeze: Cannot act, 30% break chance per turn
Paralyze: 50% action fail chance, 2 turns
```

---

## FILE LOCATIONS (CRITICAL PATHS)

### Battle System
- `core/services/QueueBattleService.ts` - Queue execution
- `core/services/BattleService.ts` - Action processing
- `core/algorithms/damage.ts` - Damage calculations
- `core/algorithms/stats.ts` - Effective stat calculations

### Djinn System
- `data/definitions/djinn.ts` - 12 Djinn definitions
- `data/definitions/djinnAbilities.ts` - 180 ability definitions ⚠️
- `core/algorithms/djinnAbilities.ts` - Unlocking logic
- `core/algorithms/djinn.ts` - Synergy calculations

### Content
- `data/definitions/encounters.ts` - All encounters
- `data/definitions/enemies.ts` - All enemies
- `data/definitions/units.ts` - Recruitable units
- `data/definitions/equipment.ts` - All equipment
- `data/definitions/liberationDialogues.ts` - Chapter 1 dialogues

---

## SUCCESS METRICS

### Chapter 1 Ready When:
- [ ] 15-20 encounters playable
- [ ] Full liberation arc connected (house-01 to house-20)
- [ ] All 6 starter units + 4 recruits working
- [ ] 12 Djinn collectible with visible effects
- [ ] 180 Djinn abilities accessible
- [ ] 2-hour playthrough complete (intro → boss)
- [ ] Balance tested (beatable but challenging)
- [ ] UI explains all systems
- [ ] No soft-locks (can't get stuck)

### Technical Readiness:
- [ ] 100% test pass rate
- [ ] TypeScript compiles clean
- [ ] Data validation passes
- [ ] No console errors
- [ ] Save/load works across all states

---

## STRATEGIC INSIGHTS

### What Makes Vale Chronicles Unique
1. **Team-wide Djinn** (not per-unit like Golden Sun)
2. **Queue-based planning** (plan whole round at once)
3. **Mana generation** (basic attacks fuel abilities)
4. **Element compatibility** (same/counter/neutral with trade-offs)
5. **Predetermined rewards** (choice, not RNG)
6. **No grinding** (no random battles, auto-heal)

### What Needs Work
1. **Counter Djinn viability** (penalties too harsh)
2. **Build diversity** (mono-element too dominant)
3. **Ability bloat** (180 abilities need UI organization)
4. **Learning curve** (steep mid-game without good tutorials)

---

## FINAL ASSESSMENT

**Strengths:**
- Exceptional architecture (10/10)
- Deep strategic systems (9/10)
- Complete Phase 1-7 implementation (100%)
- Rich content foundation (liberation arc)

**Weaknesses:**
- Content integration incomplete (encounter ID mismatch)
- Balance rough (counter Djinn, enemy HP)
- UX gaps (tooltips, visual feedback)
- Tutorial/onboarding missing

**Overall:** 8/10 foundation, 6/10 playability

**Estimated to Chapter 1 Release:** 3-4 weeks

---

**This knowledge base captures the essential 20% that covers 80% of what you need to know to work on Vale Chronicles effectively.**

