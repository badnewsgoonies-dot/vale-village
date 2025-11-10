# Quick Start: Code Consistency Fixes

**TL;DR:** Run these commands to fix ability ID inconsistencies.

## Prerequisites

```bash
# Ensure you're on a feature branch
git checkout -b fix/code-consistency

# Install dependencies (if needed)
pnpm install -D ts-morph yargs
```

## Step-by-Step Execution

### 1. Preview Changes (Dry Run)
```bash
npx tsx scripts/convert_ability_ids_to_kebab.ts --root apps/vale-v2 --dry
```

**Review the output** - it shows what will change.

### 2. Apply Ability ID Fixes
```bash
npx tsx scripts/convert_ability_ids_to_kebab.ts --root apps/vale-v2
```

This converts:
- `id: 'heavy_strike'` → `id: 'heavy-strike'`
- `heavy_strike: HEAVY_STRIKE` → `'heavy-strike': HEAVY_STRIKE`
- References in other files

### 3. Update Zod Schema
```bash
npx tsx scripts/update_ability_schema.ts --root apps/vale-v2
```

Adds kebab-case validation to the schema.

### 4. Validate Changes
```bash
# Run validation script
npx tsx scripts/validate_transforms.ts --root apps/vale-v2

# Run tests
pnpm test tests/ability-id-consistency.test.ts

# Type check
pnpm typecheck
```

### 5. Review & Commit
```bash
# Review changes
git diff apps/vale-v2/src/data/definitions/abilities.ts

# Commit
git add .
git commit -m "fix: convert ability IDs to kebab-case"
```

## What Gets Fixed

✅ Ability definition IDs: `heavy_strike` → `heavy-strike`  
✅ ABILITIES Record keys: `heavy_strike:` → `'heavy-strike':`  
✅ Equipment references: `unlocksAbility: 'heavy_strike'` → `unlocksAbility: 'heavy-strike'`  
✅ Unit ability arrays  
✅ Test files  
✅ Story/encounter data  

## Troubleshooting

**"Working directory not clean"**
```bash
git stash  # or commit your changes
```

**"Cannot run on main branch"**
```bash
git checkout -b fix/code-consistency
```

**TypeScript errors after transform**
```bash
pnpm typecheck  # Check for broken references
git diff        # Review changes
```

## Next Steps

After ability IDs are fixed, you can:
1. Run `npx tsx scripts/dedupe_types.ts` to find duplicate types
2. Manually consolidate duplicate type definitions
3. Add ESLint rule (see `CODE_CONSISTENCY_FIX_PLAN.md`)

## Full Documentation

- `CODE_CONSISTENCY_FIX_PLAN.md` - Detailed execution plan
- `scripts/README.md` - Script documentation
- `CODE_CONSISTENCY_AUDIT.md` - Original audit report

