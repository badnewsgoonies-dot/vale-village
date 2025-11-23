# Fix Prompt: NPC Dialogue Not Triggering

**Priority:** HIGH  
**Category:** Story System  
**Tests Affected:** 7 tests in `npc-dialogue.spec.ts`

---

## Problem

All NPC dialogue tests timeout waiting for 'dialogue' mode. Dialogue never triggers when player walks to NPC position.

**Test Failures (all timeouts):**
1. `triggers dialogue when walking to NPC` - Timeout waiting for 'dialogue' mode
2. `dialogue screen opens and displays text` - Timeout
3. `advances dialogue to next node` - Timeout
4. `dialogue choices work` - Timeout
5. `story flag set from dialogue choice` - Timeout
6. `exit dialogue returns to overworld` - Timeout
7. `player position preserved after dialogue` - Timeout

**NPC Tested:** Elder at position (15, 5) in `vale-village` map

---

## Investigation Steps

1. **Check NPC trigger detection:**
   - Review `overworldSlice.ts` or movement handler
   - Verify NPC triggers fire when player position matches NPC position
   - Check if `handleTrigger()` is called for NPCs

2. **Check dialogue system:**
   - Review `dialogueSlice.ts` for `startDialogueTree()` function
   - Verify dialogue tree is loaded from `DIALOGUES` record
   - Check if mode transitions to 'dialogue' when dialogue starts

3. **Check NPC data:**
   - Verify NPC exists in map definition:
     ```typescript
     // In maps.ts, vale-village should have:
     { id: 'npc-elder', type: 'npc', position: { x: 15, y: 5 }, data: { npcId: 'elder-vale' } }
     ```
   - Verify dialogue tree exists: `DIALOGUES['elder-vale']`

4. **Check trigger system:**
   - Review how triggers are processed in overworld
   - Verify NPC triggers are handled differently from battle/shop triggers
   - Check if trigger detection happens on movement or on position match

---

## Expected Behavior

**When player walks to NPC position:**
1. Trigger detection fires (NPC at same position as player)
2. `handleTrigger()` is called with NPC trigger data
3. `startDialogueTree()` is called with dialogue tree from `DIALOGUES[npcId]`
4. Mode transitions to 'dialogue'
5. Dialogue UI displays first node text

**When dialogue advances:**
1. Clicking "Next" or pressing Space/Enter calls `advanceCurrentDialogue()`
2. Current node advances to `nextNodeId`
3. Text updates to new node's text

**When dialogue choice is made:**
1. Clicking choice calls `makeChoice(choiceId)`
2. Choice effects are processed (`processDialogueEffects()`)
3. Dialogue advances to choice's `nextNodeId`

---

## Files to Check

1. `apps/vale-v2/src/ui/state/overworldSlice.ts` - Trigger detection
2. `apps/vale-v2/src/ui/state/dialogueSlice.ts` - Dialogue system
3. `apps/vale-v2/src/data/definitions/maps.ts` - NPC definitions
4. `apps/vale-v2/src/data/definitions/dialogues.ts` - Dialogue trees
5. `apps/vale-v2/src/ui/components/OverworldMap.tsx` - Movement/trigger handling

---

## Fix Requirements

1. **Fix NPC trigger detection:**
   - Ensure NPC triggers fire when player position matches NPC position
   - Call `handleTrigger()` with NPC trigger data
   - Verify trigger type is 'npc' and data contains `npcId`

2. **Fix dialogue system startup:**
   - Ensure `startDialogueTree()` is called when NPC trigger fires
   - Load dialogue tree from `DIALOGUES[npcId]`
   - Set mode to 'dialogue'

3. **Fix dialogue UI:**
   - Ensure dialogue UI displays when mode is 'dialogue'
   - Display current node text and speaker
   - Show choices if current node has choices

4. **Update tests if needed:**
   - Verify test waits for correct mode transition
   - Ensure test navigates to correct NPC position
   - Check if test needs to wait for dialogue UI to render

---

## Acceptance Criteria

✅ Walking to NPC position triggers dialogue  
✅ Mode transitions to 'dialogue'  
✅ Dialogue screen displays text and speaker  
✅ Dialogue advances to next node on "Next" click  
✅ Dialogue choices work and advance to correct node  
✅ Story flags set from dialogue choices  
✅ Exiting dialogue returns to overworld  
✅ Player position preserved after dialogue  
✅ All 7 tests in `npc-dialogue.spec.ts` pass

---

## Testing

After fixes, run:
```bash
cd apps/vale-v2
pnpm test:e2e tests/e2e/npc-dialogue.spec.ts
```

Expected: All 7 tests pass.

---

## Notes

- NPC dialogue is critical for story progression
- Dialogue effects (story flags, battle triggers) must work correctly
- Test uses elder at (15, 5) - verify this NPC exists and has dialogue tree

