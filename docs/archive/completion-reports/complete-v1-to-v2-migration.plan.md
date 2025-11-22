<!-- 48714f94-5c98-4ef7-bdd0-b30cac42a451 62ef9518-8700-43b5-9958-64f3017339d8 -->
# Complete V1 → V2 Migration & Delete V1

## Status: Assets ✅ Equipment ✅ | Skip: Enemy/Overworld data

## Phase 1: Archive/Delete Documentation

**Create `docs/legacy/` and archive generic patterns:**
- `docs/CAMERA_SYSTEM.md` → `docs/legacy/` (generic React camera pattern)
- `docs/MOVEMENT_OPTIMIZATION.md` → `docs/legacy/` (if generic, else delete)

**Delete V1 Root Docs (6 files):**
- `GAME_VISION_SUMMARY.md` (V1 vision, MetaPrompt references)
- `docs/OVERWORLD_ENHANCEMENT_SPEC.md` (V1 technical spec)
- `docs/NPC_BATTLE_SYSTEM.md` (V1 completed feature)
- `docs/ELEVATION_SYSTEM.md` (V1 implemented)
- `docs/VISUAL_EFFECTS_GUIDE.md` (V1 implementation)
- `docs/ENEMY_IMPLEMENTATION_PLAN.md` (V1 plan, never started)

**Delete V1 Workflow Docs (6 files with merge conflicts):**
- `ROLE_1_STORY_DIRECTOR_ONBOARDING.md`
- `ROLE_2_GRAPHICS_MOCKUP_ONBOARDING.md`
- `ROLE_3_ARCHITECT_ONBOARDING.md`
- `ROLE_4_CODER_ONBOARDING.md`
- `ROLE_5_GRAPHICS_INTEGRATION_ONBOARDING.md`
- `ROLE_6_QA_VERIFIER_ONBOARDING.md`

**Delete Status/Audit Files:**
- All `PHASE_*.md`, `IMPLEMENTATION_*.md`, `*_AUDIT*.md`, `*_ANALYSIS*.md`, `CLEANUP_*.md`, `CODE_*.md` in root
- `ARCHITECTURAL_ASSESSMENT.md`, `BATTLE_SYSTEM_ANALYSIS.md`, `BUG_FIX_*.md`, `COMPREHENSIVE_SYSTEM_AUDIT.md`, `DEEP_ARCHITECTURAL_AUDIT_AND_BLUEPRINT.md`, `DRY_RUN_ANALYSIS.md`, `FIX_PACKAGE_REVIEW.md`, `PRIORITIZED_ACTION_PLAN.md`, `QUICK_START_FIXES.md`, `REBUILD_PLAYBOOK_STATUS.md`, `SPRITE_AUDIT_REPORT.md`, `TARGETING_FIXES.md`, `test_output.txt`, `test-output.log`

## Phase 2: Delete V1 Code
- Delete `/src/` (entire v1 codebase)
- Delete `/tests/` (v1 tests)
- Delete `/public/` and `/sprite-sheets/` if empty

## Phase 3: Clean Root Configs
- Delete: `index.html`, `vite.config.ts`, `tsconfig.json`, `tsconfig.node.json`, `vitest.config.ts`, `package-lock.json`
- Keep: `package.json`, `pnpm-lock.yaml`, `.gitignore`

## Phase 4: Update Documentation

**Update `CLAUDE.md`:**
- Change migration status from "in progress" to "~80% complete"
- Add recent progress: Post-battle rewards, victory UI, turn handling improvements
- Clarify ESLint import rules (verify UI can import from core)
- Remove stale "barely working" language
- Add "Last Updated: 2025-11-10"

**Update `README.md`:**
- Remove v1 references, 6-role workflow mentions
- Point all paths to ``
- Remove `/src/` directory mentions

**Update `START_HERE.md`:**
- Update paths to v2 structure
- Remove V1 workflow references

**Update `V1_TO_V2_MIGRATION_STATUS.md`:**
- Mark complete, document migrated/skipped/deleted items

**Verify `VALE_CHRONICLES_ARCHITECTURE.md`:**
- Already resolved, verify clean

## Phase 5: Verify
- `cd root && pnpm validate:data && pnpm test && pnpm typecheck && pnpm lint`

## Phase 6: Commit
```
git add -A
git commit -m "refactor: complete v1 to v2 migration and remove legacy codebase

- Migrated assets (2,572 sprites, 25 sprite sheets) to v2
- Migrated equipment data (58 items) to v2
- Archived generic design docs to docs/legacy/
- Deleted v1 codebase (/src/, /tests/)
- Deleted v1 documentation (12 files: 6 root docs + 6 role files)
- Cleaned up root config files
- Updated CLAUDE.md with current status
- Updated docs for v2-only structure"
```

## Final Structure
```
vale-village/
├──           # ONLY CODEBASE
│   ├── public/            # Migrated sprites
│   ├── sprite-sheets/     # Migrated sheets
│   ├── src/data/definitions/equipment.ts  # 58 items
│   └── docs/legacy/       # Generic design patterns only
├── docs/                  # V2 ADRs (keep)
├── story/                 # Story content (keep)
├── mockups/               # Mockups (keep)
├── scripts/               # Scripts (keep)
├── README.md              # Updated (v2-only)
├── START_HERE.md          # Updated (v2-only)
├── VALE_CHRONICLES_ARCHITECTURE.md
├── V1_TO_V2_MIGRATION_STATUS.md
├── package.json
└── pnpm-lock.yaml
```
