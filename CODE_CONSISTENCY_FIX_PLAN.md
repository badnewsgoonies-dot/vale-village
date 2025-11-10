# Code Consistency Fix Plan - Vale Chronicles

**Date:** 2025-01-27  
**Status:** Ready for Execution

## Overview

This plan addresses the three critical consistency issues identified in the audit:
1. **Ability ID format mismatch** (snake_case vs kebab-case)
2. **Duplicate type definitions** (src/types vs src/domain/types)
3. **Service pattern inconsistency** (classes vs functions)

---

## Prerequisites

```bash
# Install dependencies
pnpm install -D ts-morph yargs

# Ensure you're on a feature branch
git checkout -b fix/code-consistency
```

---

## Phase 1: Ability ID Conversion (CRITICAL)

### Step 1.1: Dry Run
```bash
npx tsx scripts/convert_ability_ids_to_kebab.ts --root apps/vale-v2 --dry
```

**Review output:**
- Check which IDs will be converted
- Verify no unintended changes
- Note the ID mappings

### Step 1.2: Apply Changes
```bash
npx tsx scripts/convert_ability_ids_to_kebab.ts --root apps/vale-v2
```

**What it does:**
- Converts `id: 'heavy_strike'` → `id: 'heavy-strike'`
- Updates ABILITIES Record keys: `heavy_strike: HEAVY_STRIKE` → `'heavy-strike': HEAVY_STRIKE`
- Updates references in equipment, units, tests, etc.

### Step 1.3: Update Zod Schema
```bash
npx tsx scripts/update_ability_schema.ts --root apps/vale-v2
```

**What it does:**
- Adds `abilityIdRegex` constant
- Updates `id` field to enforce kebab-case

### Step 1.4: Validate
```bash
# Run validation script
npx tsx scripts/validate_transforms.ts --root apps/vale-v2

# Run tests
pnpm test tests/ability-id-consistency.test.ts

# Type check
pnpm typecheck
```

### Step 1.5: Review & Commit
```bash
git diff apps/vale-v2/src/data/definitions/abilities.ts
git add .
git commit -m "fix: convert ability IDs to kebab-case

- Convert snake_case ability IDs to kebab-case
- Update ABILITIES Record keys to match
- Update references in equipment and other files
- Add Zod schema validation for kebab-case format"
```

---

## Phase 2: Type Deduplication (HIGH PRIORITY)

### Step 2.1: Detect Duplicates
```bash
npx tsx scripts/dedupe_types.ts --root .
```

**Review output:**
- Lists all duplicate type definitions
- Shows file locations
- Suggests canonical locations

### Step 2.2: Manual Consolidation

**Strategy:**
1. Keep types in `src/types/` (canonical)
2. Remove duplicates from `src/domain/types/`
3. Update imports to reference `src/types/`

**Example:**
```typescript
// Before (duplicate)
// src/types/Unit.ts
export interface Unit { ... }

// src/domain/types/Unit.ts  
export interface Unit { ... }

// After (consolidated)
// src/types/Unit.ts
export interface Unit { ... }

// src/domain/types/Unit.ts (removed or re-export)
export { Unit } from '@/types/Unit';
```

### Step 2.3: Update Imports

Search and replace imports:
```bash
# Find all imports from domain/types
grep -r "from '@/domain/types" src/

# Update to use src/types instead
# (Manual or script-assisted)
```

### Step 2.4: Validate
```bash
pnpm typecheck
pnpm test
```

### Step 2.5: Commit
```bash
git add .
git commit -m "refactor: consolidate duplicate type definitions

- Remove duplicates from src/domain/types/
- Update imports to use src/types/ as canonical location
- Add re-exports where needed for backward compatibility"
```

---

## Phase 3: Service Pattern Alignment (MEDIUM PRIORITY)

**Note:** Vale-v2 already uses functions (correct pattern).  
Main codebase (`src/core/services/`) uses classes - this is acceptable for now.

**Future work:** Migrate main codebase services to functions when refactoring.

---

## Phase 4: Enforcement (LOW PRIORITY)

### Step 4.1: Add ESLint Rule

Update `apps/vale-v2/.eslintrc.cjs`:

```javascript
const path = require('node:path');

module.exports = {
  // ... existing config
  plugins: ['@typescript-eslint', 'import', 'vale-rules'],
  rules: {
    // ... existing rules
    'vale-rules/kebab-ability-ids': 'error',
  },
};
```

Create `apps/vale-v2/eslint/vale-rules.js`:

```javascript
module.exports = {
  rules: {
    'kebab-ability-ids': require('../../eslint/rules/kebab-ability-ids'),
  },
};
```

### Step 4.2: Add CI Check

Update `.github/workflows/ci.yml` (or create):

```yaml
- name: Check ability ID consistency
  run: pnpm test tests/ability-id-consistency.test.ts
```

### Step 4.3: Commit
```bash
git add .
git commit -m "chore: add ability ID consistency enforcement

- Add ESLint rule for kebab-case ability IDs
- Add CI check for ability ID format
- Add validation test"
```

---

## Validation Checklist

After completing all phases:

- [ ] All ability IDs are kebab-case
- [ ] ABILITIES Record keys match ability IDs
- [ ] Zod schema enforces kebab-case
- [ ] No duplicate type definitions
- [ ] TypeScript compiles without errors
- [ ] All tests pass
- [ ] ESLint passes
- [ ] Git diff reviewed and approved

---

## Rollback Plan

If something goes wrong:

```bash
# Rollback ability ID changes
git checkout HEAD -- apps/vale-v2/src/data/definitions/abilities.ts
git checkout HEAD -- apps/vale-v2/src/data/schemas/AbilitySchema.ts

# Rollback all changes
git reset --hard HEAD~1

# Or restore from backup branch
git checkout backup-before-fixes
```

---

## Estimated Time

- Phase 1 (Ability IDs): 30-45 minutes
- Phase 2 (Type Deduplication): 20-30 minutes  
- Phase 3 (Service Pattern): Deferred
- Phase 4 (Enforcement): 15-20 minutes

**Total:** ~1.5-2 hours

---

## Success Criteria

✅ All ability IDs use kebab-case format  
✅ No duplicate type definitions  
✅ TypeScript compiles successfully  
✅ All tests pass  
✅ ESLint passes  
✅ CI checks pass  

---

## Questions or Issues?

If you encounter issues:
1. Check the validation script output
2. Review git diff carefully
3. Run tests to identify broken references
4. Consult the audit report for context

