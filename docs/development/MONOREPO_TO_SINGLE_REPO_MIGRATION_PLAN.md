# Monorepo to Single Repo Migration Plan

## Executive Summary

This document outlines a comprehensive plan to migrate Vale Chronicles V2 from a pnpm workspace monorepo structure (``) to a single, flat repository structure. This will simplify the project structure, reduce complexity, and align with the goal of having the game as the only project in the repository.

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
  - `scripts/` - Utility scripts that reference `root` paths
  - `story/` - Story content (15 .ts files, 5 .md files)
  - `eslint/` - ESLint rules
  - `dinerdash/` - Old project directory (should be removed)
  - `mockups/` - Mockup files (1560 files)
  - Various `.md` files scattered at root

- **Other:**
  - `libatomic1_14.2.0-4ubuntu2~24.04_amd64.deb` - System package (should be removed)
  - `screenshot-mockups.cjs`, `take-screenshots.cjs` - Utility scripts

### Game Directory (`/workspace/`)
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
   - Move `src/` → `src/`
   - Move `tests/` → `tests/`
   - Move `public/` → `public/`
   - Move `sprite-sheets/` → `sprite-sheets/`
   - Move `scripts/` → `scripts/` (merge with existing)
   - Move `mockups/` → `mockups/` (merge with existing)

2. **Move configuration files:**
   - Move `tsconfig.json` → `tsconfig.json`
   - Move `tsconfig.node.json` → `tsconfig.node.json`
   - Move `vite.config.ts` → `vite.config.ts`
   - Move `vitest.config.ts` → `vitest.config.ts`
   - Move `playwright.config.ts` → `playwright.config.ts`
   - Move `index.html` → `index.html`

3. **Handle documentation:**
   - Keep root `docs/` as-is (architectural docs)
   - Move `docs/` → `docs/app/` (app-specific docs)
   - Move `CLAUDE.md` → `CLAUDE.md` (replace root version)
   - Consolidate duplicate markdown files

### Phase 3: Dependency & Configuration Updates
1. **Merge package.json:**
   - Merge dependencies from `package.json` into root
   - Remove workspace configuration (`workspaces` field)
   - Update scripts to work from root (remove `--filter vale-v2`)
   - **Keep root devDependencies that are used by scripts:**
     - `ts-morph` (used by `convert_ability_ids_to_kebab.ts`)
     - `yargs` (used by all scripts)
     - `@dqbd/tiktoken` (verify if used, otherwise remove)
   - **Remove duplicate `vite` from root** (already in root dependencies)

2. **Handle ESLint configuration:**
   - **Keep `.eslintrc.cjs`** (more complete, has proper path resolution)
   - Move `.eslintrc.cjs` → `.eslintrc.cjs` (replace root version)
   - Update `__dirname` path resolution in ESLint config if needed

3. **Update path references:**
   - Update all `root` references in:
     - Scripts (`scripts/*.ts`) - Change default `--root` from `root` to `.`
     - CI/CD workflows (`.github/workflows/*.yml`) - Remove `--filter vale-v2`
     - GitHub instructions (`.github/copilot-instructions.md`)
     - Documentation (markdown files)
     - Configuration files
     - Code comments

4. **Update scripts path resolution:**
   - **Root scripts** (`scripts/validate_transforms.ts`, etc.):
     - Change default `--root` from `root` to `.`
     - Update `process.cwd()` usage if needed
   - **App scripts** (`scripts/*.cjs`, `*.ts`):
     - Scripts using `__dirname` with relative paths (`../src`, `../public`) will work correctly after move
     - Verify paths after moving to root `scripts/` directory

5. **Remove workspace files:**
   - Delete `pnpm-workspace.yaml`
   - Delete `pnpm-lock.yaml`
   - **Regenerate root `pnpm-lock.yaml`** after merging package.json

6. **Clean up stale files:**
   - Remove root `src/` (old v1 files)
   - Remove `dinerdash/` directory
   - Remove `libatomic1_14.2.0-4ubuntu2~24.04_amd64.deb`
   - Review and consolidate duplicate documentation

### Phase 4: Path Alias & Import Updates
1. **Verify path aliases:**
   - Ensure `@/*` alias points to `./src/*` in `vite.config.ts` and `vitest.config.ts`
   - Both use `path.resolve(__dirname, './src')` which will work correctly after move
   - Update any absolute imports if needed

2. **Update script paths:**
   - Update `scripts/validate_transforms.ts` (change default `--root` from `root` to `.`)
   - Update `scripts/dedupe_types.ts` (already defaults to `.`, but update usage docs)
   - Update `scripts/update_ability_schema.ts` (change default `--root` from `root` to `.`)
   - Update `scripts/convert_ability_ids_to_kebab.ts` (change default `--root` from `root` to `.`)
   - **Note:** Scripts using `__dirname` with relative paths will work correctly after move

### Phase 5: Testing & Validation
1. **Run validation:**
   - `pnpm install` - Verify dependencies install correctly (regenerates lockfile)
   - `pnpm typecheck` - Verify TypeScript compiles
   - `pnpm lint` - Verify linting passes (uses new ESLint config)
   - `pnpm validate:data` - Verify data validation
   - `pnpm test` - Verify all tests pass
   - `pnpm test:e2e` - Verify E2E tests pass
   - `pnpm dev` - Verify dev server starts
   - `pnpm build` - Verify production build works

2. **Verify scripts work:**
   - Test `scripts/validate_transforms.ts` (should work without `--root` flag)
   - Test `scripts/convert_ability_ids_to_kebab.ts --dry` (should work without `--root` flag)
   - Test sprite generation scripts (`pnpm generate:sprites`)

3. **Manual verification:**
   - Check that all imports resolve correctly
   - Verify sprite paths work (check `public/sprites/` access)
   - Test game functionality
   - Verify CI would pass (check workflow syntax)

### Phase 6: Documentation & CI/CD Updates
1. **Update CI/CD workflows:**
   - Update `.github/workflows/ci.yml` - Remove all `--filter vale-v2` flags
   - Update `.github/workflows/claude.yml` (if exists) - Remove workspace references
   - Update `.github/workflows/claude-code-review.yml` (if exists) - Remove workspace references

2. **Update GitHub instructions:**
   - Update `.github/copilot-instructions.md` - Replace all `root` references with root paths

3. **Update documentation:**
   - Update `README.md` - Remove workspace references
   - Update `CLAUDE.md` - Remove workspace references
   - Update all markdown files that reference `root` (112+ files)
   - Update `CHANGELOG.md` with migration notes

4. **Clean up:**
   - Remove `apps/` directory
   - Final review of file structure

---

## Detailed File Mapping

### Files to Move
```
src/                    → src/
tests/                  → tests/
public/                 → public/
sprite-sheets/          → sprite-sheets/
scripts/                → scripts/ (merge)
mockups/                → mockups/ (merge)
docs/                   → docs/app/
tsconfig.json           → tsconfig.json (replace)
tsconfig.node.json      → tsconfig.node.json (replace)
vite.config.ts          → vite.config.ts (replace)
vitest.config.ts        → vitest.config.ts (replace)
playwright.config.ts    → playwright.config.ts (replace)
index.html              → index.html (replace)
CLAUDE.md               → CLAUDE.md (replace)
README.md               → README.md (merge/replace)
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
.eslintrc.cjs                         → (replace with root version)
scripts/validate_transforms.ts        → (change default --root to ".")
scripts/dedupe_types.ts               → (update usage docs, already defaults to ".")
scripts/update_ability_schema.ts      → (change default --root to ".")
scripts/convert_ability_ids_to_kebab.ts → (change default --root to ".")
.github/workflows/ci.yml              → (remove --filter vale-v2 flags)
.github/workflows/claude.yml          → (remove workspace references if exists)
.github/workflows/claude-code-review.yml → (remove workspace references if exists)
.github/copilot-instructions.md       → (update all root references)
README.md                             → (remove workspace references)
CLAUDE.md                             → (remove workspace references)
All .md files with "root"     → (update paths - 112+ files)
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
- ESLint config merge (two configs exist, need to choose correct one)
- CI/CD workflow updates (need to verify syntax)

### High Risk
- Dependency conflicts (root has some devDependencies that might conflict)
- Lockfile regeneration (need to ensure consistency - two lockfiles exist)
- Import path resolution (need to verify all imports work)
- Script path resolution (scripts use `__dirname` and `process.cwd()` - need to verify)
- ESLint path restrictions (config has path-based rules that need to work after move)

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
- [ ] Move `src/` → `src/`
- [ ] Move `tests/` → `tests/`
- [ ] Move `public/` → `public/`
- [ ] Move `sprite-sheets/` → `sprite-sheets/`
- [ ] Move `scripts/` → `scripts/` (merge)
- [ ] Move `mockups/` → `mockups/` (merge)
- [ ] Move `docs/` → `docs/app/`
- [ ] Move configuration files
- [ ] Move `index.html` → `index.html`
- [ ] Move `CLAUDE.md` → `CLAUDE.md` (replace)
- [ ] Commit: "Move game files from root to root"

### Phase 2: Configuration Updates
- [ ] Merge `package.json` into root `package.json`
- [ ] Remove workspace configuration from `package.json`
- [ ] Update scripts in `package.json` (remove `--filter vale-v2`)
- [ ] Keep root devDependencies: `ts-morph`, `yargs` (used by scripts)
- [ ] Remove duplicate `vite` from root devDependencies
- [ ] Move `.eslintrc.cjs` → `.eslintrc.cjs` (replace root version)
- [ ] Delete `pnpm-workspace.yaml`
- [ ] Delete root `src/` (old v1 files)
- [ ] Delete `dinerdash/` directory
- [ ] Delete `libatomic1_14.2.0-4ubuntu2~24.04_amd64.deb`
- [ ] Commit: "Update configuration for single repo structure"

### Phase 3: Path Reference Updates
- [ ] Update `scripts/validate_transforms.ts` (default `--root` to `.`)
- [ ] Update `scripts/dedupe_types.ts` (update usage docs)
- [ ] Update `scripts/update_ability_schema.ts` (default `--root` to `.`)
- [ ] Update `scripts/convert_ability_ids_to_kebab.ts` (default `--root` to `.`)
- [ ] Update `.github/workflows/ci.yml` (remove `--filter vale-v2`)
- [ ] Update `.github/workflows/claude.yml` (if exists, remove workspace refs)
- [ ] Update `.github/workflows/claude-code-review.yml` (if exists, remove workspace refs)
- [ ] Update `.github/copilot-instructions.md` (replace all `root` references)
- [ ] Search and update all markdown files with `root` references (112+ files)
- [ ] Commit: "Update path references from root to root"

### Phase 4: Testing
- [ ] Run `pnpm install` (regenerates lockfile)
- [ ] Run `pnpm typecheck`
- [ ] Run `pnpm lint` (uses new ESLint config)
- [ ] Run `pnpm validate:data`
- [ ] Run `pnpm test`
- [ ] Run `pnpm test:e2e`
- [ ] Run `pnpm dev` (verify it starts)
- [ ] Run `pnpm build` (verify it builds)
- [ ] Test `scripts/validate_transforms.ts` (without `--root` flag)
- [ ] Test `pnpm generate:sprites` (verify sprite scripts work)
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
│   ├── app/                # App-specific docs (from docs/)
│   ├── adr/                # Architecture Decision Records
│   ├── architect/          # Technical specifications
│   └── archive/            # Archived docs
├── prompts/                # Prompt files
├── story/                  # Story content
├── mockups/                # Mockup files
├── eslint/                 # ESLint rules
├── .eslintrc.cjs           # ESLint config (from root)
├── package.json            # Dependencies and scripts
├── pnpm-lock.yaml          # Dependency lockfile (regenerated)
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

## Audit Findings & Additional Considerations

### Critical Issues Found During Audit

1. **ESLint Configuration Conflict:**
   - Two `.eslintrc.cjs` files exist (root and ``)
   - `.eslintrc.cjs` is more complete with proper path resolution
   - **Solution:** Use `root` version as the canonical config

2. **CI/CD Workflow Dependencies:**
   - `.github/workflows/ci.yml` uses `pnpm --filter vale-v2` in all steps
   - Must update all workflow files to remove workspace references
   - **Solution:** Remove `--filter vale-v2` from all workflow commands

3. **GitHub Copilot Instructions:**
   - `.github/copilot-instructions.md` has extensive `root` references
   - Used by AI agents, must be accurate
   - **Solution:** Update all path references to root structure

4. **Script Path Resolution:**
   - Root scripts use `--root root` as default
   - App scripts use `__dirname` with relative paths (`../src`, `../public`)
   - **Solution:** Change root script defaults to `.`, verify app scripts after move

5. **Dependency Management:**
   - Root has `vite` in devDependencies (duplicate)
   - Root has `@dqbd/tiktoken` (verify if actually used)
   - `ts-morph` and `yargs` are needed by scripts
   - **Solution:** Merge carefully, remove duplicates, verify usage

6. **Lockfile Strategy:**
   - Two lockfiles exist (root workspace + app-specific)
   - Must regenerate after merging package.json
   - **Solution:** Delete app lockfile, regenerate root lockfile after merge

7. **Path Alias Configuration:**
   - `vite.config.ts` and `vitest.config.ts` use `path.resolve(__dirname, './src')`
   - Will work correctly after move (relative to config file location)
   - **Solution:** No changes needed, but verify after move

8. **ESLint Path Restrictions:**
   - ESLint config has path-based import restrictions (`./src/core`, `./src/ui`)
   - These are relative paths, should work after move
   - **Solution:** Verify ESLint rules work correctly after migration

### Verification Checklist

After migration, verify:
- [ ] All scripts work without `--root` flag
- [ ] ESLint rules still enforce architecture boundaries
- [ ] CI/CD workflows pass
- [ ] Sprite generation scripts work (`pnpm generate:sprites`)
- [ ] Path aliases resolve correctly (`@/*` → `src/*`)
- [ ] All imports resolve (no broken paths)
- [ ] Dev server starts and serves assets correctly
- [ ] Production build succeeds
- [ ] Tests pass (unit + E2E)

---

## Notes

- This migration preserves all git history
- No data will be lost (everything is in git)
- Can be done incrementally with commits after each phase
- All tests should pass before and after migration
- Documentation updates can be done gradually after core migration
- **Important:** Test scripts thoroughly after path updates (they use dynamic path resolution)

---

**Status:** Ready for execution (audited and optimized)
**Last Updated:** 2025-01-XX
**Author:** Migration Plan Generator (with comprehensive audit)
