# Pre-Battle Team Selection - Quick Start Guide

## Overview

This guide provides step-by-step prompts for implementing the pre-battle team selection screen. Each step is self-contained and can be fed into Composer independently.

---

## Implementation Order

### 1. Foundation: State Management
**Prompt File:** `apps/vale-v2/docs/IMPLEMENTATION_PROMPT_PRE_BATTLE_FINAL.md` (Step 1)

**What it does:**
- Updates `gameFlowSlice.ts` to support team selection mode
- Adds `pendingBattleEncounterId` state
- Adds `confirmBattleTeam()` method
- Modifies battle triggers to show team selection screen

**Command to feed Composer:**
```
Read apps/vale-v2/docs/IMPLEMENTATION_PROMPT_PRE_BATTLE_FINAL.md and implement Step 1: Update GameFlowSlice for Team Selection Mode
```

---

### 2. Main Component Structure
**Prompt File:** `apps/vale-v2/docs/IMPLEMENTATION_PROMPT_PRE_BATTLE_FINAL.md` (Step 2)

**What it does:**
- Creates `PreBattleTeamSelectScreen.tsx` main component
- Sets up component structure with sub-components
- Handles team selection logic

**Command to feed Composer:**
```
Read apps/vale-v2/docs/IMPLEMENTATION_PROMPT_PRE_BATTLE_FINAL.md and implement Step 2: Create Main Component Structure
```

---

### 3. Styling
**Prompt File:** `apps/vale-v2/docs/IMPLEMENTATION_PROMPT_PRE_BATTLE_FINAL.md` (Step 3)

**What it does:**
- Creates `PreBattleTeamSelectScreen.css`
- Implements fixed-height layout (NO SCROLLING)
- Responsive fonts using `clamp()`
- CSS Grid layout

**Command to feed Composer:**
```
Read apps/vale-v2/docs/IMPLEMENTATION_PROMPT_PRE_BATTLE_FINAL.md and implement Step 3: Create CSS File
Reference the visual mockup at apps/vale-v2/mockups/pre-battle-team-select-final.html for exact styling
```

---

### 4. Team & Bench Section
**Prompt File:** `apps/vale-v2/docs/IMPLEMENTATION_PROMPT_PRE_BATTLE_FINAL.md` (Step 4)

**What it does:**
- Creates `TeamBenchSection.tsx` component
- Displays active party (2x2 grid)
- Displays bench units (vertical list, NO scrolling)
- Handles adding/removing units

**Command to feed Composer:**
```
Read apps/vale-v2/docs/IMPLEMENTATION_PROMPT_PRE_BATTLE_FINAL.md and implement Step 4: Create TeamBenchSection Component
```

---

### 5. Equipment Section
**Prompt File:** `apps/vale-v2/docs/IMPLEMENTATION_PROMPT_PRE_BATTLE_FINAL.md` (Step 5)

**What it does:**
- Creates `EquipmentSection.tsx` component
- Equipment slots layout (Helm full width, Weapon/Armor row, Boots/Accessory row)
- Equipment compendium with tabs
- Equipment selection and equipping

**Command to feed Composer:**
```
Read apps/vale-v2/docs/IMPLEMENTATION_PROMPT_PRE_BATTLE_FINAL.md and implement Step 5: Create EquipmentSection Component
```

---

### 6. Djinn Section
**Prompt File:** `apps/vale-v2/docs/IMPLEMENTATION_PROMPT_PRE_BATTLE_FINAL.md` (Step 6)

**What it does:**
- Creates `DjinnSection.tsx` component
- 3 Djinn slots with sprites
- Granted abilities panel (NO scrolling)
- Djinn selection and equipping

**Command to feed Composer:**
```
Read apps/vale-v2/docs/IMPLEMENTATION_PROMPT_PRE_BATTLE_FINAL.md and implement Step 6: Create DjinnSection Component
```

---

### 7. Enemy Portal Tile
**Prompt File:** `apps/vale-v2/docs/IMPLEMENTATION_PROMPT_PRE_BATTLE_FINAL.md` (Step 7)

**What it does:**
- Creates `EnemyPortalTile.tsx` component
- Minimal enemy display (illustrative, not informational)
- Portal tile design with animated glow
- Shows enemy names only

**Command to feed Composer:**
```
Read apps/vale-v2/docs/IMPLEMENTATION_PROMPT_PRE_BATTLE_FINAL.md and implement Step 7: Create EnemyPortalTile Component
```

---

### 8. Integration
**Prompt File:** `apps/vale-v2/docs/IMPLEMENTATION_PROMPT_PRE_BATTLE_FINAL.md` (Step 8)

**What it does:**
- Integrates `PreBattleTeamSelectScreen` into `App.tsx`
- Adds conditional rendering for `mode === 'team-select'`
- Connects to state management

**Command to feed Composer:**
```
Read apps/vale-v2/docs/IMPLEMENTATION_PROMPT_PRE_BATTLE_FINAL.md and implement Step 8: Integrate into App.tsx
```

---

## Quality Checklist (After Each Step)

After implementing each step, verify:

- [ ] TypeScript compiles without errors (`pnpm typecheck`)
- [ ] No linter errors (`pnpm lint`)
- [ ] No `any` types used
- [ ] Proper null/undefined handling
- [ ] Immutable state updates
- [ ] Clean architecture boundaries respected
- [ ] Component renders without errors
- [ ] Props are properly typed

---

## Testing After Full Implementation

### Functional Tests
```bash
# Run tests
pnpm test

# Check for TypeScript errors
pnpm typecheck

# Check for linter errors
pnpm lint

# Validate data
pnpm validate:data
```

### Visual Tests
1. Trigger a battle (VS1 encounter)
2. Verify team selection screen appears
3. Check NO vertical scrolling at different resolutions:
   - 1920x1080
   - 1366x768
   - 1280x720
4. Verify all sections fit in viewport
5. Test team selection (1-4 units)
6. Test equipment changes
7. Test Djinn management
8. Test "Start Battle" button
9. Test "Cancel" button

---

## Reference Files

- **Main Prompt:** `apps/vale-v2/docs/IMPLEMENTATION_PROMPT_PRE_BATTLE_FINAL.md`
- **Visual Mockup:** `apps/vale-v2/mockups/pre-battle-team-select-final.html`
- **Design Doc:** `apps/vale-v2/docs/IMPROVED_PRE_BATTLE_DESIGN.md`
- **Architecture:** `apps/vale-v2/CLAUDE.md`
- **Quality Guidelines:** `apps/vale-v2/CLAUDE.md` (sections on Clean Architecture, TypeScript, React Patterns)

---

## Common Issues & Solutions

### Issue: Scrolling appears
**Solution:** Check fixed heights, use `overflow: hidden`, limit visible items

### Issue: TypeScript errors
**Solution:** Check imports, use proper types, handle null/undefined

### Issue: State not updating
**Solution:** Use Zustand slice methods, ensure immutable updates

### Issue: Component not rendering
**Solution:** Check `mode === 'team-select'` condition, verify `pendingBattleEncounterId` is set

---

## Next Steps After Implementation

1. Test all functionality
2. Verify no scrolling at all resolutions
3. Polish visual design
4. Add error handling
5. Add loading states (if needed)
6. Update documentation

---

## Support

If you encounter issues:
1. Check `apps/vale-v2/CLAUDE.md` for architecture guidelines
2. Review `apps/vale-v2/mockups/pre-battle-team-select-final.html` for visual reference
3. Check existing components for patterns (e.g., `QueueBattleView.tsx`)

