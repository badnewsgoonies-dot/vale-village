# Battle Screen Redesign Audit - Questions Answered

**Date:** 2025-11-21  
**Context:** Addressing questions from `BATTLE_SCREEN_REDESIGN_AUDIT.md`

---

## Questions from Audit Document

The original audit identified 5 key questions/considerations. Here are the answers based on code investigation:

---

### Q1: Which battle view is primary? QueueBattleView vs BattleView

**Answer: `QueueBattleView.tsx` is the PRIMARY and ACTIVE battle system.**

**Evidence:**
- ✅ **App.tsx line 330:** `{mode === 'battle' && <QueueBattleView />}`
- ✅ **Only QueueBattleView is imported** in App.tsx (line 2)
- ✅ **BattleView.tsx is NOT imported** anywhere in App.tsx
- ❌ **BattleView.tsx appears to be DEPRECATED** - it uses an older turn-based system

**System Type:**
- **QueueBattleView:** Queue-based planning/execution system
  - Planning phase: Select actions for all units
  - Execution phase: All actions execute simultaneously
  - Uses `queueBattleSlice` for state management
  
**Recommendation:** 
- ✅ **Focus all redesign work on `QueueBattleView.tsx`**
- 🗑️ **Consider removing `BattleView.tsx`** if confirmed deprecated

---

### Q2: Ability selection flow - How should it work with new layout?

**Current Flow (QueueBattleView.tsx):**

```
1. User selects unit (sets selectedUnitIndex)
   ↓
2. User selects ability (sets selectedAbility)
   ↓
3. User selects target(s) (sets selectedTargets)
   ↓
4. User clicks "Queue Action" (calls queueUnitAction)
   ↓
5. Action added to queue, selection cleared
   ↓
6. Repeat for other units
   ↓
7. User clicks "Execute Round" (calls executeQueuedRound)
```

**State Management (QueueBattleView.tsx lines 34-36):**
```typescript
const [selectedUnitIndex, setSelectedUnitIndex] = useState<number | null>(null);
const [selectedAbility, setSelectedAbility] = useState<string | null>(null);
const [selectedTargets, setSelectedTargets] = useState<string[]>([]);
```

**Answer for New Layout:**

✅ **MAINTAIN THIS FLOW** - It's working well and logical

**Ability Details Display Strategy:**
1. **Show all abilities in bottom panel** - comprehensive cards always visible
2. **Highlight selected ability** when user clicks
3. **Ability details are ALWAYS visible** (not just on selection)
4. **Selection adds visual emphasis** (border, background color, etc.)

**Benefits:**
- Users can review all abilities before selecting
- No need to click to see details
- Reduces clicks and improves UX
- Maintains current state management (no breaking changes)

---

### Q3: Visual area content - What should be displayed?

**Current Implementation (QueueBattleView.tsx):**
- Uses `UnitCard` components for both players and enemies
- Simple sprite display with HP/status
- Positioned side-by-side (enemies left, players right)

**Answer for New Layout:**

**Visual Area Should Display:**

1. **Unit/Enemy Sprites** (KEEP)
   - Current sprite system works
   - Position for future animations
   
2. **Space for Animations** (FUTURE)
   - Reserve area for attack/ability animations
   - Background sprite support exists (BackgroundSprite component)
   
3. **Layout Strategy:**
   ```
   ┌──────────────────────────────────┐
   │                                  │
   │    [Enemy 1]  [Enemy 2]          │
   │    [Enemy 3]                     │
   │                                  │
   │         (Animation Space)        │
   │                                  │
   │          [Player 1] [Player 2]   │
   │          [Player 3] [Player 4]   │
   │                                  │
   └──────────────────────────────────┘
   ```

**Implementation Notes:**
- ✅ Keep using `UnitCard` for now (has sprite support)
- ✅ Use `BackgroundSprite` component for battlefield background
- 🔮 Future: Add animation system on top
- ⚠️ Don't use full portraits here (those go in left panel)

---

### Q4: Turn order display - How many turns ahead? How to format?

**Current Implementation (TurnOrderStrip.tsx):**
- Horizontal strip showing ALL turns in `state.turnOrder` array
- Simple text display with highlighting for current actor
- Shows: `unitName (Turn X)`

**Answer for New Layout:**

**Vertical Panel Design:**

**Show:** 
- ✅ **Next 8-10 turns** (not all - can be long list)
- ✅ **Current turn highlighted** prominently
- ✅ **Player vs Enemy distinction** (different colors/icons)
- ✅ **Round number** at top

**Format:**
```
┌─────────────────────────┐
│ TURN ORDER              │
│ Round: 3                │
├─────────────────────────┤
│ → Isaac         [YOU]   │ ← Current (green highlight)
│   Goblin A      [ENEMY] │
│   Garet         [YOU]   │
│   Goblin B      [ENEMY] │
│   Mia           [YOU]   │
│   Goblin C      [ENEMY] │
│   Ivan          [YOU]   │
│   Goblin A      [ENEMY] │
│   ...                   │
└─────────────────────────┘
```

**Implementation Notes:**
- Use `state.turnOrder` array (already available)
- Show `state.currentActorIndex` as highlighted
- Use `.slice(0, 10)` to limit display
- Add visual distinction: player units (green border) vs enemies (red border)
- Include small portrait icons next to names

---

### Q5: Ability detail level - How much information to show?

**Available Data (AbilitySchema.ts):**
- ✅ All fields documented in audit (lines 51-61)
- ✅ Rich metadata: buffs, debuffs, status effects, duration, etc.

**Current Implementation:**
- ❌ Only shows: `{name} [{manaCost}○]`
- ❌ No description, no stats, no effects

**Answer:**

✅ **SHOW COMPREHENSIVE DETAILS** - All relevant fields

**Recommended Ability Card Format:**

```
┌────────────────────────────────────────────────┐
│ [Icon] Fireball                        [2○]    │
├────────────────────────────────────────────────┤
│ Type: Psynergy | Element: Mars                 │
│ Target: Single Enemy                            │
│                                                 │
│ Description:                                    │
│ Launches a ball of fire at a single enemy,    │
│ dealing fire damage.                           │
│                                                 │
│ Power: 35                                      │
│ Effects:                                        │
│ • May apply Burn (30% chance, 3 turns)        │
│ • Elemental advantage: 1.5× vs Jupiter        │
└────────────────────────────────────────────────┘
```

**Fields to Display (Priority Order):**

**Always Show:**
1. ✅ Icon (if available)
2. ✅ Name
3. ✅ Mana cost
4. ✅ Type (physical/psynergy/healing/buff/debuff)
5. ✅ Element (if applicable)
6. ✅ Target type (single-enemy, all-enemies, etc.)
7. ✅ Description
8. ✅ Base power (if applicable)

**Show When Present:**
9. ✅ Buff effects (with values and duration)
10. ✅ Debuff effects (with values and duration)
11. ✅ Status effects (type, chance, duration)
12. ✅ Hit count
13. ✅ Special mechanics (chain damage, ignore defense %, etc.)
14. ✅ Healing amount/type
15. ✅ Shield charges
16. ✅ Element resistance granted

**Implementation Notes:**
- Use conditional rendering for optional fields
- Format numbers clearly (e.g., "+12 ATK", "-6 DEF for 2 turns")
- Use icons for elements/types
- Color code by element (Mars=red, Venus=yellow, etc.)

---

## Additional Findings

### Component Reusability Assessment

| Component | Current Location | Reusable? | Modifications Needed |
|-----------|-----------------|-----------|---------------------|
| `ManaCirclesBar` | `ui/components/ManaCirclesBar.tsx` | ✅ Yes | None - ready to use |
| `DjinnBar` | `ui/components/DjinnBar.tsx` | ✅ Yes | None - ready to use |
| `ActionQueuePanel` | `ui/components/ActionQueuePanel.tsx` | ✅ Yes | None - ready to use |
| `BattleLog` | `ui/components/BattleLog.tsx` | ✅ Yes | Optional enhancement |
| `UnitCard` | `ui/components/UnitCard.tsx` | ⚠️ Partial | Uses sprites, not portraits |
| `battle/UnitCard` | `ui/components/battle/UnitCard.tsx` | ✅ Yes | Uses portraits - perfect for left panel |
| `TurnOrderStrip` | `ui/components/TurnOrderStrip.tsx` | ⚠️ Needs work | Convert horizontal → vertical |
| `AbilityPanel` | `ui/components/battle/AbilityPanel.tsx` | ⚠️ Needs work | Enhance with more details |

### Portrait Mapping

✅ **Available:** `getPortraitSprite(unitId)` from `src/ui/sprites/mappings/portraits.ts`

**Use for:** Left panel portrait display

### Data Access

All required data is available via Zustand store:

```typescript
const battle = useStore((s) => s.battle);
// Provides:
// - battle.playerTeam.units
// - battle.enemies
// - battle.turnOrder
// - battle.currentActorIndex
// - battle.remainingMana, battle.maxMana
// - battle.queuedActions
// - battle.phase
```

---

## Recommended Implementation Order

### Phase 1: Layout Restructure (High Priority)

**Goal:** Establish new grid layout structure

**Files to Modify:**
- `src/ui/components/QueueBattleView.tsx`
- `src/ui/styles/battle-screen.css`

**Tasks:**
1. Create CSS Grid layout matching Mockup 1
2. Reposition existing components into new grid
3. Test responsive behavior

**Grid Structure:**
```css
.queue-battle-view {
  display: grid;
  grid-template-rows: 20% 50% 30%;
  grid-template-columns: 20% 60% 20%;
  grid-template-areas:
    "visual visual visual"
    "portraits battlefield turn-order"
    "actions actions actions";
}
```

### Phase 2: Component Enhancements (Medium Priority)

**Goal:** Enhance existing components for new layout

**Create New Components:**
1. `src/ui/components/battle/PortraitPanel.tsx`
   - Left side portrait list
   - Uses `battle/UnitCard` or creates new
   - Vertical list with HP/status

2. `src/ui/components/battle/AbilityDetailCard.tsx`
   - Comprehensive ability information
   - Reusable card component
   - Shows all ability metadata

3. `src/ui/components/battle/TurnOrderPanel.tsx`
   - Vertical turn order display
   - Shows next 8-10 turns
   - Highlights current turn

**Modify Existing:**
- None (create new instead of breaking existing)

### Phase 3: Visual Polish (Low Priority)

**Goal:** Final styling and UX improvements

**Tasks:**
1. Ability card styling (icons, colors, spacing)
2. Portrait panel styling
3. Turn order panel styling
4. Hover states and animations
5. Responsive adjustments
6. Accessibility (ARIA labels, keyboard nav)

---

## Implementation Checklist

**Before Starting:**
- [x] Confirm QueueBattleView is primary system
- [x] Review current state management
- [x] Identify reusable components
- [x] Review mockups and choose layout

**Phase 1: Layout**
- [ ] Create new CSS Grid structure
- [ ] Reposition ManaCirclesBar and DjinnBar
- [ ] Reposition ActionQueuePanel
- [ ] Test layout responsiveness

**Phase 2: Components**
- [ ] Create PortraitPanel component
- [ ] Create AbilityDetailCard component
- [ ] Create TurnOrderPanel component
- [ ] Wire components to battle state
- [ ] Test component functionality

**Phase 3: Polish**
- [ ] Style ability cards
- [ ] Style portrait panel
- [ ] Style turn order panel
- [ ] Add hover/focus states
- [ ] Add transitions
- [ ] Test accessibility

**Final:**
- [ ] Cross-browser testing
- [ ] Performance testing
- [ ] User acceptance testing
- [ ] Documentation update

---

## Files Reference

**Main Battle View:**
- `src/ui/components/QueueBattleView.tsx` - Primary battle view (525 lines)
- `src/App.tsx` - App router (line 330 uses QueueBattleView)

**Existing Components:**
- `src/ui/components/ManaCirclesBar.tsx` - Ready to use
- `src/ui/components/DjinnBar.tsx` - Ready to use
- `src/ui/components/ActionQueuePanel.tsx` - Ready to use
- `src/ui/components/BattleLog.tsx` - Ready to use
- `src/ui/components/TurnOrderStrip.tsx` - Needs enhancement
- `src/ui/components/battle/UnitCard.tsx` - Uses portraits (good for left panel)
- `src/ui/components/battle/AbilityPanel.tsx` - Needs enhancement

**Data Sources:**
- `src/data/definitions/abilities.ts` - All ability data
- `src/data/definitions/djinnAbilities.ts` - Djinn ability data
- `src/data/schemas/AbilitySchema.ts` - Ability type definitions
- `src/ui/sprites/mappings/portraits.ts` - Portrait mapping

**Styles:**
- `src/ui/styles/battle-screen.css` - Battle screen styles

**Mockups:**
- `mockups/battle-screen.html` - HTML mockup
- `BATTLE_SCREEN_MOCKUPS.md` - Text-based mockups (Mockup 1 recommended)

---

## Risk Assessment

### Low Risk ✅
- Layout restructure (CSS Grid)
- Component repositioning
- Creating new components (non-breaking)

### Medium Risk ⚠️
- Modifying QueueBattleView (525 lines, complex)
- State management integration
- Responsive design challenges

### High Risk ❌
- None identified

**Mitigation Strategy:**
1. Create new components first (test in isolation)
2. Modify QueueBattleView incrementally
3. Keep git commits small and focused
4. Test after each major change
5. Maintain existing functionality throughout

---

## Summary

**All questions from the audit have been answered with concrete recommendations:**

1. ✅ **Q1:** Use QueueBattleView (primary system)
2. ✅ **Q2:** Maintain current selection flow, show details always
3. ✅ **Q3:** Use sprites + space for animations
4. ✅ **Q4:** Show next 8-10 turns vertically with highlighting
5. ✅ **Q5:** Show comprehensive ability details with all relevant fields

**Ready to proceed with implementation using Mockup 1 (Grid-Based Layout).**

---

**Next Action:** Begin Phase 1 implementation (Layout Restructure)
