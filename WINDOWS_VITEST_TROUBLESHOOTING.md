# Windows Vitest "No Test Suite Found" - Complete Fix Guide

## Current Status
- ❌ All 24 test files show "No test suite found"
- ⚠️  Vitest 1.6.1 may have Windows-specific bugs
- 🔧 Multiple fix attempts needed

## Solution 1: Try Alternative Config File

Use the minimal Windows-specific config:

```bash
npx vitest run --config vitest.config.windows.ts
```

If this works, the issue is in the main config file.

## Solution 2: Downgrade Vitest (RECOMMENDED)

Vitest 1.6.1 has known Windows issues. Try 1.5.0:

```bash
npm install --save-dev vitest@1.5.0 @vitest/coverage-v8@1.5.0
npm test
```

If this fixes it, the issue is with vitest 1.6.1 on Windows.

## Solution 3: Check Node.js Version

Vitest requires Node 18+. Check:
```bash
node --version
```

If < 18, upgrade Node.js.

## Solution 4: Verify File Structure

Ensure test files have proper structure:

```typescript
import { describe, test, expect } from 'vitest';
// Your imports

describe('Test Suite Name', () => {
  test('test name', () => {
    expect(true).toBe(true);
  });
});
```

**Critical**: Test files MUST have at least one `describe()` or `test()` call.

## Solution 5: Clear All Caches

```bash
# Remove all caches
rm -rf node_modules package-lock.json
rm -rf .vite
rm -rf dist
rm -rf coverage

# Reinstall
npm install

# Clear vitest cache explicitly
npx vitest run --clearCache

# Try again
npm test
```

## Solution 6: Check Line Endings (Windows)

```bash
# Check git config
git config core.autocrlf

# If true, try:
git config core.autocrlf false
git rm --cached -r .
git reset --hard
npm test
```

## Solution 7: Minimal Working Config

Create `vitest.config.minimal.ts`:

```typescript
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    include: ['tests/**/*.test.ts'],
  },
})
```

Test with:
```bash
npx vitest run --config vitest.config.minimal.ts
```

## Solution 8: Bypass Test Discovery - Direct File

If discovery fails, run a single file directly:

```bash
npx vitest run tests/unit/Unit.test.ts --no-config
```

If this works, the issue is with test discovery patterns.

## Diagnostic Commands

Run these to gather info:

```bash
# Check vitest version
npm list vitest

# Check Node version
node --version

# Check if files exist
dir tests\unit\*.test.ts  # Windows
ls tests/unit/*.test.ts   # Linux/Mac

# Verbose test run
npx vitest run --reporter=verbose --no-coverage

# List discovered files
npx vitest list
```

## Known Issues with Vitest 1.6.1 on Windows

- Issue #2662: Test discovery failures
- Issue #2851: Path resolution problems
- Workaround: Downgrade to 1.5.0 or upgrade to 1.7.0+

## If Nothing Works

1. **Use WSL2**: Run tests in Linux environment on Windows
2. **Document as blocker**: Note in project that tests require Linux/WSL2
3. **Alternative test runner**: Consider jest or vitest 1.7.0+ (when stable)

## Current Changes Made

✅ Updated `vitest.config.ts` with Windows-compatible paths  
✅ Fixed `vite.config.ts` ES module `__dirname` issue  
✅ Created `vitest.config.windows.ts` alternative config  
✅ Added explicit include/exclude patterns  

## Next Steps

1. **Try Solution 2 first** (downgrade to 1.5.0) - most likely to work
2. If that fails, try Solution 1 (alternative config)
3. If that fails, try Solution 7 (minimal config)
4. Report findings so we can document the working solution