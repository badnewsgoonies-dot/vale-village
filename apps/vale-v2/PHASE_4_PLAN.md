# Phase 4: Content & AI - Plan

## Overview

Phase 4 focuses on populating the battle system with content (abilities, enemies, units) and implementing deterministic enemy AI. This brings the battle system to a playable state with meaningful content.

## Goals

1. **Content Population** - Add real abilities, enemies, and unit definitions
2. **Enemy AI** - Deterministic AI decision-making using PRNG
3. **UI Polish** - Basic styling and visual feedback
4. **Testing** - UI component tests and integration tests

## Tasks

### 1. Content Definitions

**Abilities** (`src/data/definitions/abilities.ts`):
- [ ] Physical abilities (Slash, Power Strike, etc.)
- [ ] Psynergy abilities (Fireball, Ice Shard, etc.)
- [ ] Healing abilities (Heal, Cure, etc.)
- [ ] Buff/Debuff abilities (Haste, Slow, etc.)
- [ ] At least 3-5 abilities per unit type

**Enemies** (`src/data/definitions/enemies.ts`):
- [ ] Basic enemies (Goblin, Wolf, etc.)
- [ ] Elite enemies (Orc Warrior, Mage, etc.)
- [ ] Boss enemies (with unique abilities)
- [ ] Enemy abilities and drops

**Units** (`src/data/definitions/units.ts`):
- [ ] 4 starter units (one per element)
- [ ] 6 recruitable units
- [ ] Unit abilities per level
- [ ] Growth rates and roles

### 2. Enemy AI System

**AI Service** (`src/core/services/AIService.ts`):
- [ ] Deterministic ability selection (uses PRNG)
- [ ] Target selection logic (weakest, strongest, random)
- [ ] AI difficulty levels (easy, normal, hard)
- [ ] Boss AI patterns

**Integration**:
- [ ] Wire AI into `ActionBar` for enemy turns
- [ ] Auto-execute enemy actions
- [ ] Show AI decision in battle log

### 3. UI Polish

**Styling**:
- [ ] CSS variables for theming
- [ ] Responsive layout improvements
- [ ] Visual feedback for events (damage numbers, status icons)
- [ ] Battle animations (basic CSS transitions)

**Components**:
- [ ] Damage number popups
- [ ] Status effect icons
- [ ] HP/PP bar animations
- [ ] Turn indicator improvements

### 4. Testing

**UI Tests** (`tests/ui/`):
- [ ] BattleView integration test
- [ ] ActionBar interaction test
- [ ] Event consumption test
- [ ] Battle end handling test

**AI Tests** (`tests/core/services/ai.test.ts`):
- [ ] Deterministic AI decisions
- [ ] Target selection logic
- [ ] Difficulty scaling

## Acceptance Criteria

✅ **Content**
- At least 20 abilities defined
- At least 10 enemies defined
- At least 4 units with full ability sets
- All content validates against schemas

✅ **Enemy AI**
- AI makes deterministic decisions (same seed → same choices)
- AI selects appropriate targets
- AI uses abilities correctly
- Boss AI has unique patterns

✅ **UI Polish**
- Visual feedback for all event types
- Responsive layout works on mobile
- Animations don't block gameplay
- Accessibility maintained

✅ **Testing**
- UI component tests cover happy path
- AI tests verify determinism
- Integration test: full battle with AI
- All tests passing

## Estimated Time

- Content definitions: 2-3 hours
- Enemy AI: 3-4 hours
- UI Polish: 2-3 hours
- Testing: 2-3 hours

**Total: 9-13 hours**

## Dependencies

- Phase 3 complete ✅
- Battle system functional ✅
- Event system working ✅
- PRNG deterministic ✅

## Risks & Mitigations

**Risk**: Content balance issues
- **Mitigation**: Start with simple abilities, iterate based on playtesting

**Risk**: AI too predictable or too random
- **Mitigation**: Use difficulty levels, test with multiple seeds

**Risk**: UI polish takes too long
- **Mitigation**: Focus on functional polish first, visual polish later

## Next Phase Preview

**Phase 5** (Future):
- Overworld integration
- NPC system
- Story progression
- Full game loop

---

**Ready to proceed?** This phase will make the battle system fully playable with content and AI!

