# Pre-Battle Screen Fix Request

## Problem
Pre-battle team selection screen renders as plain text instead of styled React components.

## Screenshot Evidence
See earlier session - screen showed:
- Text "YOUR TEAM (1/4)" but no unit cards
- Text "EQUIPMENT (SHARED)" (this text doesn't exist in code!)
- Raw equipment list in console (data loads correctly)
- No CSS styling applied
- Complete layout breakdown

## Current Status
**Working:** Game loads normally after dev mode revert
**Broken:** Pre-battle screen still broken (CSS/rendering issue)

## Files Involved
```
apps/vale-v2/src/ui/components/PreBattleTeamSelectScreen.tsx
apps/vale-v2/src/ui/components/PreBattleTeamSelectScreen.css
apps/vale-v2/src/ui/components/TeamBenchSection.tsx
apps/vale-v2/src/ui/components/EquipmentSection.tsx
apps/vale-v2/src/ui/components/DjinnSection.tsx
apps/vale-v2/src/ui/components/EnemyPortalTile.tsx
```

## Quick Diagnostic Steps
1. **Hard refresh browser** (Ctrl+Shift+R) - Try this FIRST
2. **Check browser console** for React errors or CSS 404s
3. **Verify CSS file exists:** `ls -la apps/vale-v2/src/ui/components/PreBattleTeamSelectScreen.css`
4. **Check CSS import:** `grep "import.*css" apps/vale-v2/src/ui/components/PreBattleTeamSelectScreen.tsx`

## Most Likely Causes
1. **Vite HMR confused** - Browser cached old broken version (FIX: hard refresh)
2. **CSS not loading** - Import path broken or Vite not serving it
3. **Component crash** - React error boundary showing fallback
4. **Stale browser cache** - Old version persisted

## Request
Please investigate and fix the pre-battle screen rendering issue. Focus on CSS loading and component rendering. The data pipeline works (equipment loads in console), so this is purely a UI/styling problem.

## Dev Server
Currently running on: `http://127.0.0.1:8000/` (Firefox)

## Testing
After fix, verify:
1. Navigate to overworld
2. Click enemy portal tile
3. Pre-battle screen should show styled UI with:
   - 2x2 grid for party slots (with unit cards)
   - Bench units list on right
   - Equipment slots panel
   - Djinn configuration panel
   - Enemy portal display

## Priority
**HIGH** - Blocks battle access (core gameplay feature)
