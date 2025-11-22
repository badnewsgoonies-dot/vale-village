# Tutorial & Guidance System - Brainstorming Document

**Goal:** Add tutorials, contextual hints, and player guidance without breaking the existing dialogue system.

**Date:** 2025-01-XX  
**Status:** 🧠 BRAINSTORMING PHASE (No code yet)

---

## 🎯 Current System Assessment

### ✅ What Works Well

1. **Dialogue System Architecture**
   - Clean separation: `DialogueTree` (data) → `DialogueService` (core logic) → `DialogueSlice` (state) → `DialogueBox` (UI)
   - Supports choices, conditions, effects (recruit units, grant djinn, set flags, trigger battles)
   - Already handles NPC dialogues, story scenes, recruitment dialogues
   - Type-safe with Zod schemas

2. **Game Flow Modes**
   - Clear mode system: `overworld | battle | rewards | dialogue | shop | team-select`
   - Mode transitions are well-defined
   - Dialogue mode doesn't interfere with other modes

3. **Story Flag System**
   - Tracks progression (`story.flags`)
   - Can gate content based on flags
   - Already used for unlocking encounters, tracking quests

4. **Trigger System**
   - Map triggers handle NPCs, battles, shops
   - Overworld movement triggers dialogues automatically
   - Battle triggers can be filtered by story flags

### ⚠️ Potential Concerns

1. **Dialogue Mode Conflicts**
   - If tutorial triggers during battle → could break battle flow
   - If tutorial triggers during dialogue → could stack dialogues (bad UX)
   - Need to prevent overlapping dialogue states

2. **State Management**
   - No tutorial state tracking currently
   - No way to mark tutorials as "seen" or "dismissed"
   - No priority system for which guidance should show first

3. **Context Awareness**
   - Current dialogue is mostly NPC-triggered or story-triggered
   - No system for contextual hints (e.g., "Press Q for Quest Log" when near quest giver)
   - No system for battle tutorials (e.g., "Click here to use an ability")

---

## 💡 Proposed Solutions

### Option 1: Extend Existing Dialogue System (RECOMMENDED)

**Approach:** Use the existing `DialogueTree` system for tutorials, but add a new "tutorial" mode or priority system.

**Pros:**
- Reuses all existing infrastructure
- No new components needed
- Consistent UX (players already know how dialogues work)
- Can use same effects system (set flags, trigger actions)

**Cons:**
- Tutorials might feel "heavy" (full dialogue box for simple hints)
- Need to prevent tutorial dialogues from conflicting with story/NPC dialogues

**Implementation Sketch:**
```
1. Add "tutorial" type to DialogueTree (or use metadata)
2. Add tutorial state tracking to storySlice or new tutorialSlice
3. Create tutorial trigger system (context-aware, flag-gated)
4. Add priority queue: story > NPC > tutorial (only show tutorial if no other dialogue active)
5. Store tutorial completion flags: "tutorial:first-battle", "tutorial:equipment", etc.
```

**Example Tutorial Structure:**
```typescript
const FIRST_BATTLE_TUTORIAL: DialogueTree = {
  id: 'tutorial:first-battle',
  startNodeId: 'intro',
  nodes: [
    {
      id: 'intro',
      speaker: 'Tutorial',
      text: 'Welcome to your first battle! Click on a unit to select them.',
      nextNodeId: 'select-unit',
      effects: { 'tutorial:first-battle:seen': true }
    },
    {
      id: 'select-unit',
      speaker: 'Tutorial',
      text: 'Now click an ability, then choose a target.',
      nextNodeId: null
    }
  ]
};
```

---

### Option 2: Lightweight Tooltip/Hint System (COMPLEMENTARY)

**Approach:** Add a separate, lightweight hint system for contextual tips that don't need full dialogue.

**Pros:**
- Non-intrusive (small tooltips, not full-screen dialogues)
- Can show multiple hints simultaneously
- Good for UI element explanations
- Doesn't block gameplay

**Cons:**
- Requires new component system
- Different from dialogue UX (might be inconsistent)
- Need to manage tooltip positioning/lifecycle

**Implementation Sketch:**
```
1. Create TooltipSlice (Zustand) for active tooltips
2. Create TooltipOverlay component (renders on top of game)
3. Add trigger conditions: position-based, UI element hover, story flag gates
4. Auto-dismiss after timeout or player action
5. Store dismissed hints in story flags: "hint:dismissed:quest-log"
```

**Example Tooltip Structure:**
```typescript
interface Tooltip {
  id: string;
  text: string;
  position: { x: number; y: number } | 'element' | 'center';
  targetElement?: string; // CSS selector
  duration?: number; // auto-dismiss after ms
  dismissible?: boolean; // can player close it?
  condition?: DialogueCondition; // when to show
}
```

---

### Option 3: Hybrid Approach (BEST)

**Approach:** Use Option 1 (dialogue) for substantial tutorials, Option 2 (tooltips) for quick hints.

**When to Use Each:**

| Type | Use Dialogue | Use Tooltip |
|------|--------------|-------------|
| First-time battle explanation | ✅ | ❌ |
| "Press Q for Quest Log" | ❌ | ✅ |
| Equipment tutorial (multi-step) | ✅ | ❌ |
| "This is your HP bar" | ❌ | ✅ |
| Story context before boss | ✅ | ❌ |
| "You can skip this dialogue" | ❌ | ✅ |

**Implementation:**
- Tutorials = DialogueTree with `type: 'tutorial'` metadata
- Hints = TooltipSlice + TooltipOverlay component
- Priority: story dialogue > NPC dialogue > tutorial dialogue > tooltips

---

## 🏗️ Architecture Design

### New Components Needed

1. **TutorialService** (core/services/)
   - `shouldShowTutorial(tutorialId, story, context): boolean`
   - `getActiveTutorials(context): DialogueTree[]`
   - `markTutorialComplete(tutorialId): void`
   - Pure functions, no React

2. **TutorialSlice** (ui/state/) - OPTIONAL
   - Could extend storySlice instead
   - Tracks: `completedTutorials: Set<string>`
   - Methods: `completeTutorial(id)`, `hasSeenTutorial(id): boolean`

3. **TooltipSlice** (ui/state/)
   - `activeTooltips: Tooltip[]`
   - `showTooltip(tooltip)`, `dismissTooltip(id)`, `clearTooltips()`

4. **TooltipOverlay** (ui/components/)
   - Renders tooltips positioned on screen
   - Handles auto-dismiss, click-to-dismiss
   - Portal-based (like DialogueBox)

5. **TutorialTrigger** (core/services/)
   - Context-aware tutorial detection
   - Checks: story flags, player position, UI state, battle state
   - Returns: `{ tutorialId: string, priority: number } | null`

### Data Structure Additions

**Tutorial Definitions** (`data/definitions/tutorials.ts`):
```typescript
export interface TutorialDefinition {
  id: string; // "tutorial:first-battle"
  dialogueTree: DialogueTree; // Reuse existing structure
  trigger: {
    type: 'on-encounter' | 'on-ui-open' | 'on-position' | 'on-flag';
    condition: DialogueCondition; // When to show
    priority: number; // Higher = more important
  };
  oneTimeOnly: boolean; // If true, mark as seen after showing
}

export const TUTORIALS: Record<string, TutorialDefinition> = {
  'first-battle': {
    id: 'first-battle',
    dialogueTree: FIRST_BATTLE_TUTORIAL,
    trigger: {
      type: 'on-encounter',
      condition: { type: 'flag', key: 'tutorial:first-battle:seen', value: false },
      priority: 10
    },
    oneTimeOnly: true
  },
  // ...
};
```

**Tooltip Definitions** (`data/definitions/tooltips.ts`):
```typescript
export interface TooltipDefinition {
  id: string;
  text: string;
  position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center' | { x: number, y: number };
  targetElement?: string; // CSS selector for element-based positioning
  duration: number; // ms, 0 = manual dismiss only
  condition: DialogueCondition;
  priority: number;
}

export const TOOLTIPS: Record<string, TooltipDefinition> = {
  'quest-log-hint': {
    id: 'quest-log-hint',
    text: 'Press Q to open Quest Log',
    position: 'top-right',
    duration: 5000,
    condition: { type: 'flag', key: 'hint:dismissed:quest-log', value: false },
    priority: 1
  },
  // ...
};
```

---

## 🔄 Integration Points

### Where Tutorials/Hints Should Trigger

1. **Battle Tutorials**
   - Trigger: First battle encounter (`encounterId === 'house-01'`)
   - Check: `story.flags['tutorial:first-battle:seen'] === false`
   - Show: Before battle starts (in team-select or pre-battle)
   - Priority: HIGH (block battle until tutorial seen)

2. **Equipment Tutorial**
   - Trigger: Opening equipment screen for first time
   - Check: `story.flags['tutorial:equipment:seen'] === false`
   - Show: Overlay dialogue when equipment screen opens
   - Priority: MEDIUM (can be dismissed)

3. **Quest Log Hint**
   - Trigger: Player near quest giver NPC OR after first quest accepted
   - Check: `story.flags['hint:dismissed:quest-log'] === false`
   - Show: Small tooltip in corner
   - Priority: LOW (non-blocking)

4. **Djinn Tutorial**
   - Trigger: First Djinn collected
   - Check: `story.flags['tutorial:djinn:seen'] === false`
   - Show: Full dialogue explaining Djinn system
   - Priority: HIGH (important mechanic)

5. **Contextual Battle Hints**
   - Trigger: During battle, when player hovers over UI element
   - Check: Element-specific flags
   - Show: Tooltip near element
   - Priority: LOW (on-demand)

### Integration with Existing Systems

**DialogueSlice Enhancement:**
```typescript
// Add priority check before starting dialogue
startDialogueTree: (tree, priority = 0) => {
  const currentPriority = getCurrentDialoguePriority(); // story > NPC > tutorial
  if (priority < currentPriority) {
    // Queue tutorial for later
    queueTutorial(tree);
    return;
  }
  // Existing logic...
}
```

**GameFlowSlice Enhancement:**
```typescript
// Check for tutorials before mode transitions
setMode: (mode) => {
  if (mode === 'battle' && shouldShowTutorial('first-battle')) {
    // Show tutorial first, then battle
    showTutorialThenTransition('first-battle', 'battle');
    return;
  }
  // Existing logic...
}
```

**OverworldSlice Enhancement:**
```typescript
// Check for contextual hints on movement
movePlayer: (direction) => {
  // Existing movement logic...
  
  // Check for tooltips (non-blocking)
  checkContextualTooltips(getStore());
  
  // Check for tutorials (blocking if high priority)
  const tutorial = getActiveTutorial(getStore());
  if (tutorial && tutorial.priority >= 5) {
    startDialogueTree(tutorial.dialogueTree);
  }
}
```

---

## 🛡️ Safety Mechanisms

### Preventing Conflicts

1. **Dialogue Priority Queue**
   ```
   Priority 10: Story-critical dialogues (can't skip)
   Priority 5:  Tutorial dialogues (can skip after first view)
   Priority 1:  NPC dialogues (can skip)
   Priority 0:  Tooltips (non-blocking)
   ```

2. **State Guards**
   ```typescript
   // Never show tutorial during battle
   if (mode === 'battle') return null;
   
   // Never show tutorial if dialogue already active
   if (currentDialogueTree) return null;
   
   // Never show tutorial if in shop
   if (mode === 'shop') return null;
   ```

3. **One-Time Flags**
   ```typescript
   // Mark tutorial as seen after first display
   if (tutorial.oneTimeOnly) {
     setStoryFlag(`tutorial:${tutorial.id}:seen`, true);
   }
   ```

4. **Dismissal System**
   ```typescript
   // Allow skipping tutorials after first view
   if (hasSeenTutorial(tutorialId)) {
     // Show "Skip Tutorial" button
   }
   ```

---

## 📋 Implementation Checklist (When Ready)

### Phase 1: Foundation
- [ ] Create `TutorialService` (core/services/)
- [ ] Create `TooltipSlice` (ui/state/)
- [ ] Create `TooltipOverlay` component
- [ ] Add tutorial/tooltip data structures to Zod schemas
- [ ] Add tutorial completion tracking to story flags

### Phase 2: Tutorial System
- [ ] Create `tutorials.ts` data file with first 3-5 tutorials
- [ ] Integrate tutorial checking into `DialogueSlice`
- [ ] Add priority queue system
- [ ] Add "Skip Tutorial" functionality
- [ ] Test tutorial → battle → dialogue flow

### Phase 3: Tooltip System
- [ ] Create `tooltips.ts` data file with first 5-10 hints
- [ ] Integrate tooltip checking into overworld/battle components
- [ ] Add auto-dismiss and click-to-dismiss
- [ ] Test tooltip positioning and timing

### Phase 4: Content Creation
- [ ] Write tutorial dialogues for:
  - First battle
  - Equipment system
  - Djinn system
  - Quest system
  - Party management
- [ ] Write tooltip hints for:
  - Quest log (Q key)
  - Main menu (ESC key)
  - Battle UI elements
  - Overworld interactions

### Phase 5: Polish
- [ ] Add tutorial progress tracking (optional)
- [ ] Add "Replay Tutorials" menu option
- [ ] Add visual indicators (e.g., "New!" badge on tutorial-gated content)
- [ ] Test all flows end-to-end

---

## 🎨 UX Considerations

### Tutorial UX Patterns

1. **Progressive Disclosure**
   - Don't dump all info at once
   - Show tutorial in steps (dialogue nodes)
   - Let player practice between steps

2. **Non-Intrusive Defaults**
   - Tutorials should be skippable after first view
   - Tooltips should auto-dismiss
   - Don't block critical gameplay

3. **Contextual Timing**
   - Show battle tutorial RIGHT BEFORE first battle (not hours earlier)
   - Show equipment tutorial when player opens equipment screen
   - Show hints when player is near relevant content

4. **Visual Distinction**
   - Tutorial dialogues might have different styling (e.g., "TUTORIAL" header)
   - Tooltips should be visually distinct from dialogue boxes
   - Use icons/badges to indicate tutorial content

5. **Player Control**
   - Always allow skipping (after first view)
   - Allow replaying tutorials from menu
   - Don't force tutorials on experienced players

---

## 🔍 Risk Assessment

### Low Risk Changes
- ✅ Adding tutorial data files (no code changes)
- ✅ Creating TooltipOverlay component (isolated)
- ✅ Adding tutorial flags to story system (already supports arbitrary flags)

### Medium Risk Changes
- ⚠️ Modifying DialogueSlice to handle priorities (could break existing dialogues)
- ⚠️ Adding tutorial checks to game flow (could cause performance issues)
- ⚠️ Integrating tooltips into battle UI (could interfere with battle logic)

### High Risk Changes
- ❌ Modifying core DialogueService (used everywhere)
- ❌ Changing dialogue mode behavior (breaks existing flows)
- ❌ Adding blocking tutorials during battles (breaks battle system)

### Mitigation Strategies
1. **Test Existing Flows First**
   - Run E2E tests before making changes
   - Verify NPC dialogues still work
   - Verify recruitment dialogues still work

2. **Feature Flags**
   - Add `enableTutorials: boolean` flag
   - Can disable tutorials if they cause issues
   - Gradual rollout

3. **Backwards Compatibility**
   - Tutorials should be opt-in (gated by flags)
   - Existing dialogues should work exactly as before
   - No breaking changes to DialogueTree structure

---

## 💭 Alternative Approaches Considered

### Option A: Separate Tutorial Mode
**Rejected because:** Adds complexity, breaks mode system, unnecessary separation

### Option B: Inline Help Text
**Rejected because:** Clutters UI, hard to maintain, not contextual

### Option C: Video Tutorials
**Rejected because:** Requires video assets, harder to update, not in-game

### Option D: Full Tutorial Level
**Rejected because:** Too heavy, breaks game flow, hard to skip

---

## 📊 Success Metrics

When implemented, the system should:

1. ✅ Show tutorials at appropriate times (not too early, not too late)
2. ✅ Not break existing dialogue flows
3. ✅ Allow players to skip/replay tutorials
4. ✅ Provide helpful guidance without being annoying
5. ✅ Work seamlessly with story flags and progression
6. ✅ Perform well (no lag from tutorial checks)
7. ✅ Be maintainable (easy to add new tutorials/hints)

---

## 🚀 Next Steps

1. **Review this brainstorm** - Get feedback on approach
2. **Prototype one tutorial** - Test the dialogue-based approach with one simple tutorial
3. **Prototype one tooltip** - Test the tooltip system with one hint
4. **Validate architecture** - Ensure it doesn't break existing systems
5. **Create implementation plan** - Break down into specific tasks
6. **Implement incrementally** - One tutorial at a time, test thoroughly

---

## 📝 Notes

- **Dialogue system is robust** - Can handle tutorials without major changes
- **Story flags are flexible** - Can track tutorial completion easily
- **Mode system is clear** - Tutorials fit naturally into dialogue mode
- **Need priority system** - Prevent tutorial/NPC dialogue conflicts
- **Tooltips complement dialogues** - Use both for different use cases
- **Start small** - One tutorial, one tooltip, validate approach

---

**Status:** Ready for review and feedback before implementation begins.
