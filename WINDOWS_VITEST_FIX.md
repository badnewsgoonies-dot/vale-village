# Windows Vitest "No Test Suite Found" Fix

## Changes Made

### 1. Fixed `vitest.config.ts` for Windows Path Compatibility

**Problem**: Relative paths like `'./tests/setup.ts'` can resolve differently on Windows vs Linux.

**Solution**: 
- Used `path.resolve()` with proper `__dirname` via `fileURLToPath(import.meta.url)` (ES module compatible)
- Changed `setupFiles` from string to array with absolute path
- Added explicit `include` pattern to ensure test discovery works on Windows

```typescript
// Before:
setupFiles: './tests/setup.ts',

// After:
setupFiles: [path.resolve(__dirname, './tests/setup.ts')],
include: ['**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
```

### 2. Updated `tsconfig.json` to Include Tests

Added `tests` directory to TypeScript include patterns for better type checking support.

## Testing on Windows

After pulling these changes, try:

```bash
# 1. Verify Node.js version (should be 18+)
node --version

# 2. Clean reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# 3. Run tests
npm test

# 4. If still failing, try verbose mode
npx vitest run --reporter=verbose

# 5. Test a single file to isolate issues
npx vitest run tests/unit/Unit.test.ts
```

## If Issues Persist on Windows

### Check Node.js Version
Vitest 1.6.1 requires Node.js 18+. Check with:
```bash
node --version
```

If using an older version, upgrade or use a Node version manager (nvm).

### Check Line Endings
Windows uses CRLF, Linux uses LF. Some tools can have issues. Check:
```bash
# Check if files have CRLF
git config core.autocrlf
```

If set to `true`, try:
```bash
git config core.autocrlf false
git rm --cached -r .
git reset --hard
```

### Clear Vitest Cache
```bash
npx vitest run --clearCache
npm test
```

### Check for Antivirus Interference
Some antivirus software can interfere with file watching. Try temporarily disabling or adding exceptions for:
- `node_modules/`
- `tests/`
- `.vite/`

### Try Explicit Test Pattern
If auto-discovery still fails, try explicitly specifying test files:
```bash
npx vitest run tests/**/*.test.ts
```

### Check File Permissions
Ensure you have read/write permissions to the `tests/` directory and all files within.

### Alternative: Use WSL2
If issues persist, consider using WSL2 (Windows Subsystem for Linux) which provides a Linux environment within Windows.

## What Should Work Now

✅ Path resolution uses absolute paths (Windows-compatible)
✅ Explicit test file patterns for discovery
✅ TypeScript includes test files
✅ ES module compatible `__dirname` usage

These changes ensure the configuration works identically on Windows, Linux, and macOS.