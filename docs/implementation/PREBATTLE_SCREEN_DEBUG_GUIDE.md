# Pre-Battle Screen Debugging Guide

## Issue Summary
Pre-battle team selection screen renders as plain text instead of styled React components.

## Quick Fixes to Try (In Order)

### 1. Hard Refresh Browser (30 seconds)
```
Press: Ctrl + Shift + R (Linux/Windows)
Press: Cmd + Shift + R (Mac)

This clears browser cache and forces full reload.
```

### 2. Check Browser Console (1 minute)
```
1. Press F12 to open dev tools
2. Go to "Console" tab
3. Look for RED errors (React errors, CSS 404s)
4. Take screenshot if errors present
5. Share error messages
```

**What to look for:**
- ❌ "Failed to load resource: net::ERR_FILE_NOT_FOUND" (CSS not loading)
- ❌ "Uncaught Error: ..." (React component crash)
- ❌ "Warning: React does not recognize..." (prop issues)
- ✅ No errors? Continue to step 3

### 3. Restart Dev Server (2 minutes)
```bash
# Kill current server
pkill -f "vite.*8000"

# Start fresh server
cd /home/geni/Documents/vale-village/root
pnpm dev
```

Then refresh browser and check if issue persists.

### 4. Clear Vite Cache (3 minutes)
```bash
cd /home/geni/Documents/vale-village/root
rm -rf node_modules/.vite
pnpm dev
```

This forces Vite to rebuild all modules from scratch.

### 5. Check React DevTools (2 minutes)
```
1. Install React DevTools extension (if not installed)
2. Open dev tools (F12)
3. Go to "Components" tab
4. Navigate to <PreBattleTeamSelectScreen>
5. Check if component tree is rendering
6. Look for error boundaries or null/undefined values
```

---

## Diagnostic Commands

### Check if CSS file exists
```bash
ls -la /home/geni/Documents/vale-village/src/ui/components/PreBattleTeamSelectScreen.css
```
**Expected:** File exists with ~10KB size

### Check if component imports CSS
```bash
grep "import.*PreBattleTeamSelectScreen.css" /home/geni/Documents/vale-village/src/ui/components/PreBattleTeamSelectScreen.tsx
```
**Expected:** `import './PreBattleTeamSelectScreen.css';`

### Check recent git changes to component
```bash
cd /home/geni/Documents/vale-village
git log --oneline -5 -- src/ui/components/PreBattleTeamSelectScreen.tsx
```

### Check TypeScript compilation
```bash
cd /home/geni/Documents/vale-village/root
pnpm typecheck
```
**Expected:** Warnings OK, but no ERRORS related to PreBattleTeamSelectScreen

---

## Possible Root Causes

### Theory 1: CSS Not Loading (Most Likely)
**Symptoms:**
- Text renders correctly
- No styling applied
- Layout completely broken

**Causes:**
- Vite HMR (Hot Module Reload) got confused
- CSS import path broken
- Browser cached old version

**Fixes:** Hard refresh, restart dev server

---

### Theory 2: React Component Crash
**Symptoms:**
- Error boundary showing fallback text
- Console has React errors
- Component tree incomplete in React DevTools

**Causes:**
- Prop type mismatch
- Undefined value passed to component
- Missing import

**Fixes:** Check console, fix React errors

---

### Theory 3: Child Component Missing/Broken
**Symptoms:**
- Parent renders but children don't
- "Component is not defined" error
- Import errors

**Files to Check:**
```
src/ui/components/TeamBenchSection.tsx
src/ui/components/EquipmentSection.tsx
src/ui/components/DjinnSection.tsx
src/ui/components/EnemyPortalTile.tsx
```

**Fixes:** Verify exports, fix imports

---

### Theory 4: State Data Issue
**Symptoms:**
- Components crash when reading undefined state
- Equipment/team data missing
- Console shows "Cannot read property 'X' of undefined"

**Causes:**
- Dev mode didn't fully apply
- Save/load issue
- State hydration problem

**Fixes:** Activate dev mode, verify state in React DevTools

---

## Investigation Script

Run this to gather diagnostic info:

```bash
#!/bin/bash
cd /home/geni/Documents/vale-village/root

echo "=== CHECKING FILES ==="
ls -lh src/ui/components/PreBattleTeamSelectScreen.*

echo ""
echo "=== CHECKING CSS IMPORT ==="
grep -n "import.*css" src/ui/components/PreBattleTeamSelectScreen.tsx

echo ""
echo "=== CHECKING CHILD COMPONENTS ==="
ls -1 src/ui/components/TeamBenchSection.tsx
ls -1 src/ui/components/EquipmentSection.tsx
ls -1 src/ui/components/DjinnSection.tsx
ls -1 src/ui/components/EnemyPortalTile.tsx

echo ""
echo "=== CHECKING DEV SERVER ==="
ps aux | grep "vite.*8000" | grep -v grep

echo ""
echo "=== CHECKING VITE CACHE ==="
ls -lh node_modules/.vite/ 2>/dev/null || echo "No Vite cache"

echo ""
echo "=== RUNNING TYPECHECK ==="
pnpm typecheck 2>&1 | grep -i "PreBattle" || echo "No PreBattle errors"
```

---

## If Nothing Works

### Nuclear Option: Full Rebuild
```bash
cd /home/geni/Documents/vale-village

# Stop all servers
pkill -f vite

# Clean everything
cd root
rm -rf node_modules/.vite
rm -rf dist

# Rebuild
pnpm install
pnpm dev
```

Then hard refresh browser (Ctrl+Shift+R).

---

## Reporting Back

If issue persists after trying above fixes, provide:

1. **Browser console screenshot** (F12 → Console tab)
2. **Network tab screenshot** (F12 → Network tab, filter: CSS)
3. **React DevTools component tree** (if component appears)
4. **Output of investigation script** (above)
5. **Did hard refresh help?** (Yes/No)
6. **Did dev server restart help?** (Yes/No)

---

## Screenshot Analysis

**What we see in `/tmp/mate-screenshot.1079100.0/Screenshot.png`:**
- ✅ Text "YOUR TEAM (1/4)" renders
- ✅ Text "EQUIPMENT (SHARED)" appears (but this text doesn't exist in code!)
- ✅ Console shows equipment data loading
- ❌ No cards/grids/styled layout
- ❌ Everything is plain text

**Conclusion:** Either CSS not loading OR component is rendering debug/fallback text instead of JSX.

**Weird Detail:** "EQUIPMENT (SHARED)" text doesn't exist in codebase - might be from old version or browser cache.

---

## Next Steps

1. **User: Hard refresh browser** (Ctrl+Shift+R)
2. **User: Check browser console for errors**
3. **User: Report back results**
4. **If still broken:** Restart dev server
5. **If still broken:** Run investigation script
6. **If still broken:** Nuclear option (full rebuild)

---

## Status: AWAITING USER TESTING

**Priority:** HIGH (blocks battle access)
**Estimated Fix Time:** 2-10 minutes (depending on cause)
**Most Likely Fix:** Hard refresh or dev server restart
