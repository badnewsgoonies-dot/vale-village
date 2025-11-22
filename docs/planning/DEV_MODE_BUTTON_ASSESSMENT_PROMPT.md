# Dev Mode Button Implementation - Code Review Request

## What Was Implemented

A "🎮 Dev Mode" button was added to the overworld screen that unlocks all game content (units, Djinn, equipment, gold) and persists across page reloads using localStorage.

## Problem That Was Solved

**Original Issue:**
- Dev mode button existed but didn't work
- Clicked button → updated Zustand state → called `window.location.reload()`
- State updates were in-memory only (Zustand has no persist middleware)
- Page reload destroyed JavaScript runtime before state could persist
- Result: All unlocked content was lost on reload

**Solution Implemented:**
- Use localStorage flag instead of trying to persist Zustand state
- Button sets `'vale-v2-dev-mode-active'` flag, then reloads
- App.tsx checks flag on startup, applies dev mode if present
- Flag is cleared after applying to prevent re-triggering

## Files Modified

### 1. OverworldMap.tsx
**File:** `src/ui/components/OverworldMap.tsx`

**Changes:**
```tsx
// BEFORE (lines 34-43)
if (confirmed) {
  const devState = initFullDevMode();
  setTeam(devState.team);
  setRoster(devState.roster);
  useStore.getState().addEquipment(devState.equipment);
  useStore.getState().addGold(devState.gold);

  alert('✅ Dev Mode Activated!\n\nReloading game...');
  window.location.reload();
}

// AFTER (lines 34-38)
if (confirmed) {
  localStorage.setItem('vale-v2-dev-mode-active', 'true');
  alert('✅ Dev Mode Activated!\n\nReloading game...');
  window.location.reload();
}
```

**Also removed unused imports:**
- `initFullDevMode` (no longer called here)
- `setTeam`, `setRoster` (no longer needed from useStore selector)

### 2. App.tsx
**File:** `src/App.tsx`

**Changes:**
```tsx
// BEFORE (line 64-74)
useEffect(() => {
  if (!team) {
    if (ENABLE_DEV_MODE_ON_START) {
      const devState = initFullDevMode();
      // ... apply dev mode
    }
    // ... normal initialization
  }
}, [team, setTeam, setRoster]);

// AFTER (line 64-86)
useEffect(() => {
  if (!team) {
    // NEW: Check localStorage flag first
    const devModeFlag = localStorage.getItem('vale-v2-dev-mode-active');
    if (devModeFlag === 'true') {
      const devState = initFullDevMode();
      setTeam(devState.team);
      setRoster(devState.roster);
      useStore.getState().addEquipment(devState.equipment);
      useStore.getState().addGold(devState.gold);
      localStorage.removeItem('vale-v2-dev-mode-active'); // Clear flag
      console.warn('🎮 Dev mode restored from localStorage flag');
      return;
    }

    // EXISTING: Check constant (unchanged)
    if (ENABLE_DEV_MODE_ON_START) {
      // ... same as before
    }

    // ... normal initialization
  }
}, [team, setTeam, setRoster]);
```

## Implementation Flow

```
1. User on overworld screen
2. Clicks "🎮 Dev Mode" button (purple, bottom-right)
3. Confirms dialog
4. OverworldMap.tsx: localStorage.setItem('vale-v2-dev-mode-active', 'true')
5. Alert shows: "✅ Dev Mode Activated! Reloading game..."
6. window.location.reload() executes
7. Page reloads, App.tsx mounts
8. useEffect runs → checks if (!team)
9. Reads localStorage flag → 'true' found
10. Calls initFullDevMode() → creates state object
11. Applies state: setTeam/setRoster/addEquipment/addGold
12. Clears flag: localStorage.removeItem('vale-v2-dev-mode-active')
13. Logs: "🎮 Dev mode restored from localStorage flag"
14. Returns early (skips normal initialization)
15. Game loads with all content unlocked
```

## Design Decisions

### Why localStorage Flag Instead of saveGame()?

**Option 1 (Rejected): Use existing save system**
```tsx
useStore.getState().saveGame();  // Writes to slot 0
window.location.reload();
```
- ❌ Would overwrite user's real save in slot 0
- ❌ Risk of corrupting legitimate progress
- ❌ Mixes dev mode with production saves

**Option 2 (Rejected): Use dedicated save slot**
```tsx
useStore.getState().saveGameSlot(99);  // Dev-only slot
window.location.reload();
```
- ❌ More complex (save system overhead)
- ❌ Abuses save system for non-user data
- ✅ Would persist correctly

**Option 3 (Chosen): localStorage flag**
```tsx
localStorage.setItem('vale-v2-dev-mode-active', 'true');
window.location.reload();
```
- ✅ No save corruption risk
- ✅ Simple implementation (~16 lines total)
- ✅ Clear separation from real saves
- ✅ Self-cleaning (flag removed after use)
- ⚠️ Clears if user clears browser data (acceptable for dev feature)

### Why Clear Flag After Applying?

**Without cleanup:**
```tsx
// App.tsx
if (devModeFlag === 'true') {
  initFullDevMode();
  // Flag stays in localStorage
}
```
- ❌ Every reload re-applies dev mode
- ❌ User can't disable it without console
- ❌ Flag lingers forever

**With cleanup (implemented):**
```tsx
if (devModeFlag === 'true') {
  initFullDevMode();
  localStorage.removeItem('vale-v2-dev-mode-active'); // Clear
}
```
- ✅ One-time application per button click
- ✅ User can re-enable by clicking button again
- ✅ Clean localStorage management

## Architecture Compliance

**Project follows strict clean architecture:**
- ✅ Core logic (`initFullDevMode`) stays in `core/services/`
- ✅ UI components (`OverworldMap.tsx`) only handle UI events
- ✅ State management via Zustand (`useStore.getState()`)
- ✅ No React in core layer
- ✅ No business logic in components

**Zustand patterns:**
- ✅ Uses existing slices (teamSlice, inventorySlice)
- ✅ No new state added for this feature
- ✅ No persist middleware needed (intentional)

## Questions for Assessment

### 1. Code Quality
- Is the implementation clean and maintainable?
- Are there any edge cases not handled?
- Is the error handling adequate? (Currently none)
- Should we validate the flag value more strictly?

### 2. Architecture
- Does this follow the project's clean architecture principles?
- Is localStorage usage appropriate here?
- Should this be abstracted into a service?
- Does it violate any separation of concerns?

### 3. Security & Data Integrity
- Any risk of localStorage injection/tampering?
- Could malicious flag value cause issues?
- What happens if initFullDevMode() throws an error?
- Should we add error boundaries?

### 4. Testing Coverage Gaps
- Should this have unit tests?
- How to test localStorage flag lifecycle?
- How to test the cleanup behavior?
- Integration tests needed?

### 5. Potential Improvements
- Should we add a "Disable Dev Mode" button?
- Should flag have expiration timestamp?
- Should we show visual indicator when dev mode is active?
- Better console logging for debugging?

### 6. User Experience
- Is the flow intuitive?
- Should we skip the reload and apply immediately?
- Should we show loading state during reload?
- Any accessibility concerns?

### 7. Edge Cases
- What if user clicks button rapidly (race condition)?
- What if localStorage is full?
- What if localStorage is disabled by browser?
- What if initFullDevMode() returns partial data?

## What I Need From Review

**Please assess and provide:**

1. **Overall Code Quality Grade (A-F)**
   - Readability
   - Maintainability
   - Following project conventions

2. **Architecture Compliance (Pass/Fail)**
   - Clean architecture adherence
   - Separation of concerns
   - Use of existing patterns

3. **Critical Issues (Blocking)**
   - Bugs that would cause crashes
   - Data corruption risks
   - Security vulnerabilities

4. **Non-Critical Issues (Nice-to-have)**
   - Code smells
   - Potential refactoring
   - Style improvements

5. **Testing Recommendations**
   - What tests are missing?
   - How to test this feature?
   - Mock/stub strategies

6. **Documentation Gaps**
   - Missing JSDoc comments?
   - Unclear variable names?
   - Need inline comments?

## Current Status

- ✅ Implementation complete
- ✅ TypeScript compiles (pre-existing errors unrelated)
- ✅ Dev server running on localhost:8000
- ⏳ Manual testing pending
- ⏳ Automated tests not written
- ⏳ Documentation not updated

## Context Links

**Project Architecture:**
- See: `CLAUDE.md` (root) - Repository-wide architecture
- See: `CLAUDE.md` - Detailed development patterns
- See: `ARCHITECTURE_REBUILD_SUMMARY.md` - Recent Zustand migration

**Related Services:**
- `src/core/services/DevModeService.ts` - Creates dev state object
- `src/ui/state/teamSlice.ts` - Team state management
- `src/ui/state/inventorySlice.ts` - Equipment/gold state

**Current Git Branch:** `main` (latest commit: `00a46f2`)

---

**Priority:** MEDIUM - Dev feature, not user-facing
**Complexity:** LOW - Simple localStorage flag pattern
**Lines Changed:** ~16 lines across 2 files
**Testing Required:** Manual testing + localStorage edge cases

## Acceptance Criteria (To Verify)

- [ ] Button click sets localStorage flag
- [ ] Page reload preserves flag
- [ ] App.tsx reads flag on startup
- [ ] initFullDevMode() called if flag exists
- [ ] All content unlocked (10 units, 12 Djinn, 57 items, 99,999 gold)
- [ ] Flag cleared after applying
- [ ] Second reload does NOT re-apply dev mode
- [ ] Clicking button again re-enables dev mode
- [ ] No user save data corrupted
- [ ] Console shows confirmation message
