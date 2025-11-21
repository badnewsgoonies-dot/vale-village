# Pre-Battle Screen Rendering Issue - Diagnostic Request

## Problem Statement
The Pre-Battle Team Selection screen is rendering as plain text instead of styled UI components. Equipment data is loading correctly (visible in console), but the React components are not rendering properly.

## Screenshot Evidence
See: `/tmp/mate-screenshot.1079100.0/Screenshot.png`

**What's Broken:**
- ✅ Equipment data loads correctly (console shows all items)
- ❌ UI renders as raw text dump instead of styled components
- ❌ No unit cards visible in "YOUR TEAM (1/4)" section
- ❌ Equipment section shows raw list instead of grid
- ❌ Djinn section shows empty text
- ❌ Layout is completely broken (no proper spacing/styling)

## Context

**When This Happens:**
- Screen appears when clicking on encounter portal (enemy) in overworld
- Should show pre-battle team selection interface
- User should be able to swap units, equip items, configure Djinn

**Recent Changes:**
- Added keyboard controls for save/load (commit `3a4f3fc`)
- Added dev mode button with localStorage persistence
- Working on TODO 1: Hydrating team/equipment/Djinn from saves

**Stack:**
- React 18
- TypeScript
- Vite dev server running on `localhost:8000`
- CSS modules imported via `import './PreBattleTeamSelectScreen.css'`

## File Structure

**Main Component:**
```
src/ui/components/PreBattleTeamSelectScreen.tsx
src/ui/components/PreBattleTeamSelectScreen.css
```

**Child Components:**
```
src/ui/components/TeamBenchSection.tsx
src/ui/components/EquipmentSection.tsx
src/ui/components/DjinnSection.tsx
src/ui/components/EnemyPortalTile.tsx
```

**All components exist and code looks correct** - This appears to be a CSS/rendering issue, not a logic issue.

## Symptoms

1. **Text renders but no styling:**
   - Section titles show ("YOUR TEAM", "EQUIPMENT", "DJINN CONFIGURATION")
   - But no cards, grids, or layout structure
   - Everything appears as plain text dump

2. **Console shows data loading:**
   - Equipment array visible with all items
   - No React errors
   - No CSS loading errors visible

3. **Buttons at bottom exist but misaligned:**
   - Equipment slot buttons (weapon/armor/helm/boots/accessory) are visible
   - But positioned incorrectly

## Questions for Claude

1. **CSS Loading Issue?**
   - Is the CSS file being imported correctly?
   - Vite/React issue with CSS modules?
   - Need to check dev server logs?

2. **Component Rendering Issue?**
   - Are child components actually rendering?
   - React error boundary catching something?
   - Missing wrapper divs breaking layout?

3. **Recent Commit Broke Something?**
   - Did keyboard controls commit break something?
   - Dev mode localStorage causing conflict?
   - Save/load hydration causing render issues?

4. **Quick Fixes to Try:**
   - Hard refresh (Ctrl+Shift+R)?
   - Clear Vite cache?
   - Restart dev server?
   - Check browser console for hidden errors?

## What I Need

**Please investigate and provide:**

1. **Root Cause Analysis:**
   - Why is CSS not applying?
   - Why are components rendering as plain text?
   - What broke between working state and now?

2. **Fix Strategy:**
   - Minimal changes to restore rendering
   - Don't redesign - just fix what's broken
   - Preserve all existing functionality

3. **Testing Instructions:**
   - How to verify fix works
   - What to check in browser
   - Any console logs to confirm

## Architecture Context

**This codebase follows strict clean architecture:**
- Core logic in `core/` (pure TypeScript, no React)
- UI components in `ui/components/` (React only)
- State management via Zustand (`ui/state/`)
- CSS imported per-component

**Component Pattern:**
```tsx
import './Component.css'; // CSS import
export function Component() {
  return <div className="component">...</div>;
}
```

## Additional Notes

- Dev server is currently running (don't need to restart unless necessary)
- This screen worked before (recent commit may have broken it)
- Equipment data pipeline is working (proven by console output)
- Only the rendering/styling is broken

---

**Priority:** HIGH - This screen blocks battle access, core gameplay feature

**Expected Time:** Should be quick fix once root cause identified (CSS import issue, missing wrapper, etc.)

**Current Git Branch:** `main` (latest commit: `00a46f2`)
