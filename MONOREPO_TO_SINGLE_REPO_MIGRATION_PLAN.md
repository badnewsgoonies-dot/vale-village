# Monorepo to Single Repo Migration Plan

## Executive Summary

This document outlines a comprehensive plan to migrate Vale Chronicles V2 from a pnpm workspace monorepo structure (`apps/vale-v2/`) to a single, flat repository structure. This will simplify the project structure, reduce complexity, and align with the goal of having the game as the only project in the repository.

---

## Current Structure Audit

### Root Level (`/workspace/`)
- **Workspace Configuration:**
  - `package.json` - Workspace config with forwarding scripts
  - `pnpm-workspace.yaml` - Defines `apps/*` workspace
  - `pnpm-lock.yaml` - Workspace lockfile

- **Documentation:**
  - 50+ markdown files (project docs, prompts, summaries)
  - `docs/` directory (architectural docs, ADRs, archive)
  - `prompts/` directory (23 prompt files)
  - `README.md` - Main project readme

- **Legacy/Stale Files:**
  - `src/` - Contains old `main.tsx` and `EquipmentSchema.ts` (likely from v1)
  - `scripts/` - Utility scripts that reference `apps/vale-v2` paths
  - `story/` - Story content (15 .ts files, 5 .md files)
  - `eslint/` - ESLint rules
  - `dinerdash/` - Old project directory (should be removed)
  - `mockups/` - Mockup files (1560 files)
  - Various `.md` files scattered at root

- **Other:**
  - `libatomic1_14.2.0-4ubuntu2~24.04_amd64.deb` - System package (should be removed)
  - `screenshot-mockups.cjs`, `take-screenshots.cjs` - Utility scripts

### Game Directory (`/workspace/apps/vale-v2/`)
- **Core Application:**
  - `src/` - All game source code (211 files)
  - `tests/` - Test suite (115 files)
  - `public/` - Public assets (2572 sprites)
  - `sprite-sheets/` - Sprite sheet PNGs (25 files)

- **Configuration:**
  - `package.json` - Actual dependencies (React, Vite, Vitest, etc.)
  - `tsconfig.json`, `tsconfig.node.json` - TypeScript config
  - `vite.config.ts` - Vite config
  - `vitest.config.ts` - Vitest config
  - `playwright.config.ts` - Playwright config
  - `pnpm-lock.yaml` - App-specific lockfile

- **Documentation:**
  - `CLAUDE.md` - Development guide
  - `README.md` - App readme
  - `docs/` - App-specific docs
  - Various phase completion and status markdown files

- **Scripts:**
  - `scripts/` - Build and validation scripts

---

## Migration Strategy

### Phase 1: Preparation & Backup
1. **Create backup branch** (safety net)
2. **Document current state** (this document)
3. **Identify conflicts** (duplicate files, path references)

### Phase 2: File Consolidation
1. **Move game code to root:**
   - Move `apps/vale-v2/src/` → `src/`
   - Move `apps/vale-v2/tests/` → `tests/`
   - Move `apps/vale-v2/public/` → `public/`
   - Move `apps/vale-v2/sprite-sheets/` → `sprite-sheets/`
   - Move `apps/vale-v2/scripts/` → `scripts/` (merge with existing)
   - Move `apps/vale-v2/mockups/` → `mockups/` (merge with existing)

2. **Move configuration files:**
   - Move `apps/vale-v2/tsconfig.json` → `tsconfig.json`
   - Move `apps/vale-v2/tsconfig.node.json` → `tsconfig.node.json`
   - Move `apps/vale-v2/vite.config.ts` → `vite.config.ts`
   - Move `apps/vale-v2/vitest.config.ts` → `vitest.config.ts`
   - Move `apps/vale-v2/playwright.config.ts` → `playwright.config.ts`
   - Move `apps/vale-v2/index.html` → `index.html`

3. **Handle documentation:**
   - Keep root `docs/` as-is (architectural docs)
   - Move `apps/vale-v2/docs/` → `docs/app/` (app-specific docs)
   - Move `apps/vale-v2/CLAUDE.md` → `CLAUDE.md` (replace root version)
   - Consolidate duplicate markdown files

### Phase 3: Dependency & Configuration Updates
1. **Merge package.json:**
   - Merge dependencies from `apps/vale-v2/package.json` into root
   - Remove workspace configuration
   - Update scripts to work from root
   - Remove `--filter vale-v2` references

2. **Update path references:**
   - Update all `apps/vale-v2` references in:
     - Scripts (`scripts/*.ts`)
     - Documentation (markdown files)
     - Configuration files
     - Code comments

3. **Remove workspace files:**
   - Delete `pnpm-workspace.yaml`
   - Delete `apps/vale-v2/pnpm-lock.yaml`
   - Keep root `pnpm-lock.yaml` (will regenerate)

4. **Clean up stale files:**
   - Remove root `src/` (old v1 files)
   - Remove `dinerdash/` directory
   - Remove `libatomic1_14.2.0-4ubuntu2~24.04_amd64.deb`
   - Review and consolidate duplicate documentation

### Phase 4: Path Alias & Import Updates
1. **Verify path aliases:**
   - Ensure `@/*` alias points to `./src/*` (should already be correct)
   - Update any absolute imports if needed

2. **Update script paths:**
   - Update `scripts/validate_transforms.ts` (remove `--root` option or default to `.`)
   - Update `scripts/dedupe_types.ts` (remove `--root` option)
   - Update `scripts/update_ability_schema.ts` (remove `--root` option)
   - Update `scripts/convert_ability_ids_to_kebab.ts` (remove `--root` option)

### Phase 5: Testing & Validation
1. **Run validation:**
   - `pnpm install` - Verify dependencies install correctly
   - `pnpm typecheck` - Verify TypeScript compiles
   - `pnpm lint` - Verify linting passes
   - `pnpm validate:data` - Verify data validation
   - `pnpm test` - Verify all tests pass
   - `pnpm test:e2e` - Verify E2E tests pass
   - `pnpm dev` - Verify dev server starts
   - `pnpm build` - Verify production build works

2. **Manual verification:**
   - Check that all imports resolve correctly
   - Verify sprite paths work
   - Test game functionality

### Phase 6: Documentation Updates
1. **Update documentation:**
   - Update `README.md` - Remove workspace references
   - Update `CLAUDE.md` - Remove workspace references
   - Update all markdown files that reference `apps/vale-v2`
   - Update `CHANGELOG.md` with migration notes

2. **Clean up:**
   - Remove `apps/` directory
   - Final review of file structure

---

## Detailed File Mapping

### Files to Move
```
apps/vale-v2/src/                    → src/
apps/vale-v2/tests/                  → tests/
apps/vale-v2/public/                 → public/
apps/vale-v2/sprite-sheets/          → sprite-sheets/
apps/vale-v2/scripts/                → scripts/ (merge)
apps/vale-v2/mockups/                → mockups/ (merge)
apps/vale-v2/docs/                   → docs/app/
apps/vale-v2/tsconfig.json           → tsconfig.json (replace)
apps/vale-v2/tsconfig.node.json      → tsconfig.node.json (replace)
apps/vale-v2/vite.config.ts          → vite.config.ts (replace)
apps/vale-v2/vitest.config.ts        → vitest.config.ts (replace)
apps/vale-v2/playwright.config.ts    → playwright.config.ts (replace)
apps/vale-v2/index.html              → index.html (replace)
apps/vale-v2/CLAUDE.md               → CLAUDE.md (replace)
apps/vale-v2/README.md               → README.md (merge/replace)
```

### Files to Delete
```
apps/                                 → (entire directory)
pnpm-workspace.yaml                   → (delete)
src/                                  → (delete - old v1 files)
dinerdash/                            → (delete - old project)
libatomic1_14.2.0-4ubuntu2~24.04_amd64.deb → (delete)
```

### Files to Update
```
package.json                          → (merge dependencies, remove workspace config)
scripts/validate_transforms.ts        → (update paths)
scripts/dedupe_types.ts               → (update paths)
scripts/update_ability_schema.ts      → (update paths)
scripts/convert_ability_ids_to_kebab.ts → (update paths)
README.md                             → (remove workspace references)
CLAUDE.md                             → (remove workspace references)
All .md files with "apps/vale-v2"     → (update paths)
```

---

## Risk Assessment

### Low Risk
- Moving source files (straightforward file operations)
- Moving configuration files (standard locations)
- Updating package.json (well-defined structure)

### Medium Risk
- Path reference updates (many files, need thorough search)
- Documentation updates (easy to miss references)
- Script path updates (need to test thoroughly)

### High Risk
- Dependency conflicts (root has some devDependencies that might conflict)
- Lockfile regeneration (need to ensure consistency)
- Import path resolution (need to verify all imports work)

### Mitigation Strategies
1. **Create backup branch** before starting
2. **Test incrementally** - move files in batches, test after each batch
3. **Use git** - commit after each successful phase
4. **Automated checks** - run tests after each change
5. **Search and replace** - use grep to find all references before updating

---

## Execution Checklist

### Pre-Migration
- [ ] Create backup branch: `git checkout -b backup/pre-migration`
- [ ] Document current git status
- [ ] Run full test suite and capture results
- [ ] Verify all scripts work from root

### Phase 1: File Movement
- [ ] Move `apps/vale-v2/src/` → `src/`
- [ ] Move `apps/vale-v2/tests/` → `tests/`
- [ ] Move `apps/vale-v2/public/` → `public/`
- [ ] Move `apps/vale-v2/sprite-sheets/` → `sprite-sheets/`
- [ ] Move `apps/vale-v2/scripts/` → `scripts/` (merge)
- [ ] Move `apps/vale-v2/mockups/` → `mockups/` (merge)
- [ ] Move `apps/vale-v2/docs/` → `docs/app/`
- [ ] Move configuration files
- [ ] Move `apps/vale-v2/index.html` → `index.html`
- [ ] Move `apps/vale-v2/CLAUDE.md` → `CLAUDE.md` (replace)
- [ ] Commit: "Move game files from apps/vale-v2 to root"

### Phase 2: Configuration Updates
- [ ] Merge `apps/vale-v2/package.json` into root `package.json`
- [ ] Remove workspace configuration from `package.json`
- [ ] Update scripts in `package.json`
- [ ] Delete `pnpm-workspace.yaml`
- [ ] Delete root `src/` (old v1 files)
- [ ] Delete `dinerdash/` directory
- [ ] Delete `libatomic1_14.2.0-4ubuntu2~24.04_amd64.deb`
- [ ] Commit: "Update configuration for single repo structure"

### Phase 3: Path Reference Updates
- [ ] Update `scripts/validate_transforms.ts`
- [ ] Update `scripts/dedupe_types.ts`
- [ ] Update `scripts/update_ability_schema.ts`
- [ ] Update `scripts/convert_ability_ids_to_kebab.ts`
- [ ] Search and update all markdown files with `apps/vale-v2` references
- [ ] Commit: "Update path references from apps/vale-v2 to root"

### Phase 4: Testing
- [ ] Run `pnpm install`
- [ ] Run `pnpm typecheck`
- [ ] Run `pnpm lint`
- [ ] Run `pnpm validate:data`
- [ ] Run `pnpm test`
- [ ] Run `pnpm test:e2e`
- [ ] Run `pnpm dev` (verify it starts)
- [ ] Run `pnpm build` (verify it builds)
- [ ] Commit: "Verify all tests and builds pass"

### Phase 5: Cleanup
- [ ] Delete `apps/` directory
- [ ] Final review of file structure
- [ ] Update `CHANGELOG.md` with migration notes
- [ ] Commit: "Complete monorepo to single repo migration"

### Post-Migration
- [ ] Update CI/CD workflows if needed
- [ ] Update any external documentation
- [ ] Verify git history is preserved
- [ ] Tag release: `git tag v2.0.0-migration-complete`

---

## Post-Migration Structure

```
/workspace/
├── src/                    # Game source code
├── tests/                  # Test suite
├── public/                 # Public assets (sprites)
├── sprite-sheets/          # Sprite sheet PNGs
├── scripts/                # Build and utility scripts
├── docs/                   # Documentation
│   ├── app/                # App-specific docs (from apps/vale-v2/docs/)
│   ├── adr/                # Architecture Decision Records
│   ├── architect/          # Technical specifications
│   └── archive/            # Archived docs
├── prompts/                # Prompt files
├── story/                  # Story content
├── mockups/                # Mockup files
├── eslint/                 # ESLint rules
├── package.json            # Dependencies and scripts
├── pnpm-lock.yaml          # Dependency lockfile
├── tsconfig.json           # TypeScript config
├── tsconfig.node.json      # TypeScript node config
├── vite.config.ts          # Vite config
├── vitest.config.ts        # Vitest config
├── playwright.config.ts    # Playwright config
├── index.html              # Entry HTML
├── README.md               # Main readme
├── CLAUDE.md               # Development guide
└── CHANGELOG.md            # Changelog
```

---

## Benefits of Migration

1. **Simplified Structure:**
   - No workspace complexity
   - Standard project layout
   - Easier for new contributors

2. **Reduced Cognitive Load:**
   - All code in one place
   - No path confusion
   - Standard tooling expectations

3. **Better Tooling Support:**
   - IDEs work better with standard layouts
   - Easier debugging
   - Simpler CI/CD setup

4. **Forward Compatibility:**
   - Standard structure is more maintainable
   - Easier to add new features
   - Better alignment with community practices

---

## Rollback Plan

If issues arise during migration:

1. **Immediate Rollback:**
   ```bash
   git checkout backup/pre-migration
   ```

2. **Partial Rollback:**
   - Revert specific commits
   - Fix issues incrementally
   - Continue migration

3. **Data Recovery:**
   - All files are in git history
   - No data loss risk
   - Can cherry-pick changes

---

## Timeline Estimate

- **Phase 1 (File Movement):** 30 minutes
- **Phase 2 (Configuration):** 20 minutes
- **Phase 3 (Path Updates):** 45 minutes
- **Phase 4 (Testing):** 30 minutes
- **Phase 5 (Cleanup):** 15 minutes
- **Total:** ~2.5 hours (with testing and verification)

---

## Notes

- This migration preserves all git history
- No data will be lost (everything is in git)
- Can be done incrementally with commits after each phase
- All tests should pass before and after migration
- Documentation updates can be done gradually after core migration

---

**Status:** Ready for execution
**Last Updated:** 2025-01-XX
**Author:** Migration Plan Generator
