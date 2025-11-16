# Dev Mode Guide

This guide explains how to enable dev mode for testing Vale Chronicles V2.

## Two Ways to Enable Dev Mode

### Option 1: Start-Up Dev Mode (Recommended for Testing)

**Best for:** Long testing sessions, content development, balance testing

**How to enable:**
1. Open `src/App.tsx`
2. Find line ~27: `const ENABLE_DEV_MODE_ON_START = false;`
3. Change to: `const ENABLE_DEV_MODE_ON_START = true;`
4. Save and reload the page

**What you get:**
- All 10 units unlocked at level 5
- All 12 Djinn collected and Set
- All 57 equipment items in inventory
- 99,999 gold
- Everything available immediately on game start

**Advantages:**
- ✅ All screens show correct data from the start
- ✅ No need to remember hotkeys
- ✅ Persistent across page reloads

---

### Option 2: Runtime Dev Mode (F1 Hotkey)

**Best for:** Quick testing during play, debugging specific scenarios

**How to use:**
1. Start the game normally
2. Press **F1** from the overworld
3. Check console for confirmation
4. Close and reopen screens to see changes (D for Djinn, P for units, etc.)

**What you get:**
- Same as Option 1 (all content unlocked)
- Triggered on-demand mid-game

**Limitations:**
- ⚠️ Already-open screens won't auto-refresh
- ⚠️ Must navigate away and back to see changes
- ⚠️ Console shows instructions after activation

**Why screens don't auto-refresh:**
React components only re-render when they're subscribed to the state that changed. If a screen is already mounted when you press F1, it won't see the state updates until it remounts (closes and reopens).

---

## What Dev Mode Unlocks

| Content | Count | Level/Tier |
|---------|-------|------------|
| Units | 10 | Level 5 |
| Djinn | 12 | All Set state |
| Equipment | 57 | One of each |
| Gold | 99,999 | Max |

### Units Unlocked
- Adept (Venus Warrior)
- Squire (Mars Warrior)
- Mage (Mercury Mage)
- Wind Mage (Jupiter Mage)
- Guard (Venus Tank)
- Guard Elite (Venus Tank Elite)

### Djinn Unlocked
All 12 Djinn (3 per element):
- **Venus:** Flint, Granite, Quartz
- **Mars:** Forge, Fever, Corona
- **Mercury:** Sleet, Mist, Spritz
- **Jupiter:** Gust, Breeze, Zephyr

---

## Technical Details

### Service Location
- **Service:** `src/core/services/DevModeService.ts`
- **Hook:** `src/ui/hooks/useDevMode.ts`
- **Integration:** `src/App.tsx` (lines ~27 and ~58)

### How It Works

**Start-Up Mode:**
```typescript
if (ENABLE_DEV_MODE_ON_START) {
  const devState = initFullDevMode();
  setTeam(devState.team);
  setRoster(devState.roster);
  useStore.getState().addEquipment(devState.equipment);
  useStore.getState().addGold(devState.gold);
}
```

**Runtime Mode:**
```typescript
// Press F1 → useDevMode hook triggers
// → Updates Zustand state directly
// → Console shows instructions to refresh screens
```

### Why Runtime Mode Has Limitations

Zustand state updates are synchronous, but React re-renders are asynchronous and component-specific. When you press F1:

1. ✅ State updates immediately in Zustand store
2. ❌ Mounted components don't re-render (they're not subscribed to those specific state slices)
3. ✅ Closing and reopening screens remounts them, so they read fresh state

**Example:**
- DjinnCollectionScreen only reads `team.djinn` when it mounts
- Pressing F1 updates `team.djinn` in the store
- But DjinnCollectionScreen is still showing old state from when it mounted
- Solution: Press Esc to close, press D to reopen → fresh state!

---

## Troubleshooting

### "Equipment still shows 0 items after F1"
- Check console - should show "Inventory after adding: 57 items"
- If it shows 0, there's a bug in addEquipment
- Try start-up dev mode instead

### "Djinn screen doesn't update after F1"
- This is expected! Close the screen (Esc) and reopen (D)
- Or use start-up dev mode for immediate results

### "Units not showing in party management"
- Same issue - close and reopen the screen
- Or use start-up dev mode

---

## Future Improvements

**Potential Enhancements:**
1. Add "Force Refresh" button to screens that reads current state
2. Auto-close all open screens when F1 is pressed
3. Add visual notification banner when dev mode activates
4. Create custom dev mode configs (e.g., "Level 10 mode", "All equipment mode")

**Implementation Ideas:**
```typescript
// Auto-close screens on F1
if (event.key === 'F1') {
  // Trigger a global "close all modals" action
  useStore.getState().closeAllScreens();
  // Then activate dev mode
  activateDevMode();
}
```

---

## Remember

🚨 **Always disable dev mode before committing!**

Set `ENABLE_DEV_MODE_ON_START = false` in production builds.

✅ **For testing:** Use start-up dev mode  
✅ **For quick checks:** Use F1 runtime mode (and remember to refresh screens!)
