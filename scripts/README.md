# Code Consistency Fix Scripts

This directory contains scripts to fix code consistency issues identified in the audit.

## Scripts

### `convert_ability_ids_to_kebab.ts`
Converts ability IDs from snake_case to kebab-case.

**Usage:**
```bash
# Dry run (preview changes)
npx tsx scripts/convert_ability_ids_to_kebab.ts --root apps/vale-v2 --dry

# Apply changes
npx tsx scripts/convert_ability_ids_to_kebab.ts --root apps/vale-v2
```

**What it does:**
- Updates `id:` properties in ability definitions
- Updates ABILITIES Record keys (both quoted and unquoted)
- Updates references in equipment, units, tests, and other files
- Tracks ID mappings to ensure consistency

**Safety:**
- Requires clean git working directory
- Cannot run on main/master branch
- Creates ID mapping for reference updates

---

### `update_ability_schema.ts`
Updates the Zod schema to enforce kebab-case for ability IDs.

**Usage:**
```bash
npx tsx scripts/update_ability_schema.ts --root apps/vale-v2
```

**What it does:**
- Adds `abilityIdRegex` constant
- Updates `id` field validation in `AbilitySchema`

---

### `dedupe_types.ts`
Scans for duplicate type definitions across the codebase.

**Usage:**
```bash
npx tsx scripts/dedupe_types.ts --root .
```

**What it does:**
- Scans `src/types/` and `src/domain/types/`
- Reports duplicate type/interface definitions
- Suggests canonical locations
- Provides consolidation recommendations

---

### `validate_transforms.ts`
Validates that transforms were applied correctly.

**Usage:**
```bash
npx tsx scripts/validate_transforms.ts --root apps/vale-v2
```

**What it checks:**
- All ability IDs are kebab-case
- TypeScript compiles successfully
- Tests pass

---

## Execution Order

1. **Ability ID Conversion** (Critical)
   ```bash
   npx tsx scripts/convert_ability_ids_to_kebab.ts --root apps/vale-v2 --dry
   # Review output, then:
   npx tsx scripts/convert_ability_ids_to_kebab.ts --root apps/vale-v2
   npx tsx scripts/update_ability_schema.ts --root apps/vale-v2
   npx tsx scripts/validate_transforms.ts --root apps/vale-v2
   ```

2. **Type Deduplication** (High Priority)
   ```bash
   npx tsx scripts/dedupe_types.ts --root .
   # Review output, then manually consolidate
   ```

3. **Validation**
   ```bash
   pnpm test tests/ability-id-consistency.test.ts
   pnpm typecheck
   pnpm lint
   ```

---

## Dependencies

Required packages (install if missing):
```bash
pnpm install -D ts-morph yargs
```

---

## Safety Features

- **Dry-run mode** - Preview changes before applying
- **Git checks** - Requires clean working directory
- **Branch protection** - Cannot run on main/master
- **ID mapping** - Tracks changes for reference updates
- **Validation** - Post-transform validation checks

---

## Troubleshooting

### "Working directory not clean"
```bash
git stash
# or
git commit -m "WIP: before consistency fixes"
```

### "Cannot run on main branch"
```bash
git checkout -b fix/code-consistency
```

### TypeScript errors after transform
```bash
# Check for broken references
pnpm typecheck

# Review git diff
git diff apps/vale-v2/src/data/definitions/abilities.ts
```

---

## See Also

- `CODE_CONSISTENCY_FIX_PLAN.md` - Detailed execution plan
- `CODE_CONSISTENCY_AUDIT.md` - Original audit report
- `FIX_PACKAGE_REVIEW.md` - Review of fix package approach

