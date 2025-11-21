# Monorepo Migration - Quick Reference

## Current State
- **Structure:** pnpm workspace with game in `apps/vale-v2/`
- **Root:** Contains workspace config, docs, and forwarding scripts
- **Game:** All actual code in `apps/vale-v2/`

## Target State
- **Structure:** Single flat repository
- **Root:** Contains all game code directly
- **No workspace:** Standard project layout

## Key Statistics
- **Files to move:** ~3,000+ files from `apps/vale-v2/` to root
- **Scripts to update:** 5 files in `scripts/` directory
- **Docs to update:** 112+ files with `apps/vale-v2` references
- **Dependencies:** Merge 2 package.json files

## Critical Path

### 1. Move Core Files
```bash
# Source code
apps/vale-v2/src/ → src/
apps/vale-v2/tests/ → tests/
apps/vale-v2/public/ → public/
apps/vale-v2/sprite-sheets/ → sprite-sheets/

# Config files
apps/vale-v2/tsconfig.json → tsconfig.json
apps/vale-v2/vite.config.ts → vite.config.ts
apps/vale-v2/vitest.config.ts → vitest.config.ts
apps/vale-v2/playwright.config.ts → playwright.config.ts
apps/vale-v2/index.html → index.html
```

### 2. Merge package.json
- Copy dependencies from `apps/vale-v2/package.json` to root
- Remove `workspaces` field
- Update scripts (remove `--filter vale-v2`)

### 3. Update Path References
- `scripts/*.ts` - Remove `--root apps/vale-v2` defaults
- All `.md` files - Replace `apps/vale-v2` with appropriate paths

### 4. Clean Up
- Delete `apps/` directory
- Delete `pnpm-workspace.yaml`
- Delete root `src/` (old v1 files)
- Delete `dinerdash/` directory

### 5. Verify
```bash
pnpm install
pnpm typecheck
pnpm lint
pnpm validate:data
pnpm test
pnpm test:e2e
pnpm dev
pnpm build
```

## Files Requiring Updates

### Scripts (5 files)
- `scripts/validate_transforms.ts`
- `scripts/dedupe_types.ts`
- `scripts/update_ability_schema.ts`
- `scripts/convert_ability_ids_to_kebab.ts`
- `scripts/README.md`

### Documentation (112+ files)
- All files in `prompts/`
- All files in `docs/`
- Root markdown files
- `README.md`
- `CLAUDE.md`

## Risk Mitigation
1. **Create backup branch** before starting
2. **Commit after each phase** for easy rollback
3. **Test incrementally** after each change
4. **Use grep** to find all references before updating

## Estimated Time
- **Total:** ~2.5 hours
- **File movement:** 30 min
- **Configuration:** 20 min
- **Path updates:** 45 min
- **Testing:** 30 min
- **Cleanup:** 15 min

## Full Plan
See `MONOREPO_TO_SINGLE_REPO_MIGRATION_PLAN.md` for complete details.
