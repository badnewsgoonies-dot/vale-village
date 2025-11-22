# Phase 4: Verification & Final Polish

**Goal:** Verify v2 works correctly after migration, clean up phase docs, and ensure codebase is ready for continued development.

---

## Phase 4 Tasks

### 1. Verification (If pnpm Available)
- Run `pnpm validate:data` - Verify all migrated equipment data passes Zod validation
- Run `pnpm typecheck` - Verify TypeScript compiles without errors
- Run `pnpm lint` - Verify no linting errors
- Run `pnpm test` - Verify test suite passes
- Run `pnpm build` - Verify production build succeeds

**Note:** If pnpm not available, document verification steps for manual execution.

### 2. Clean Up Phase Documentation
**In ``:**
- Delete or archive phase completion docs:
  - `PHASE_1_COMPLETE.md`
  - `PHASE_1_FIXES_APPLIED.md`
  - `PHASE_2_COMPLETE.md`
  - `PHASE_2_RESTRUCTURED.md`
  - `PHASE_3_COMPLETE.md`
  - `PHASE_3_HARDENING.md`
  - `PHASE_4_PLAN.md` (this file)

**Decision:** Archive to `docs/legacy/` or delete? These are v2 phase docs, not v1 artifacts.

### 3. Final Documentation Polish
- Verify `CLAUDE.md` is accurate and up-to-date
- Verify `README.md` (root) points to correct v2 paths
- Verify `START_HERE.md` has correct v2 instructions
- Update `V1_TO_V2_MIGRATION_STATUS.md` with Phase 4 completion

### 4. Code Quality Check
- Check for any remaining references to v1 paths or old structure
- Verify all imports use correct v2 paths
- Check for any TODO comments related to migration
- Verify equipment data imports are correct

### 5. Create Migration Completion Summary
- Document what was accomplished
- List what was skipped (enemies, overworld) and why
- Provide next steps for continued development

---

## Expected Outcomes

✅ V2 codebase verified and working
✅ Phase docs cleaned up
✅ Documentation polished and accurate
✅ Codebase ready for continued development
✅ Clear migration completion summary

---

## Verification Checklist

- [ ] Data validation passes (`pnpm validate:data`)
- [ ] TypeScript compiles (`pnpm typecheck`)
- [ ] Linting passes (`pnpm lint`)
- [ ] Tests pass (`pnpm test`)
- [ ] Build succeeds (`pnpm build`)
- [ ] Phase docs cleaned up
- [ ] Documentation updated
- [ ] Migration summary created

---

## Notes

- Phase 4 focuses on verification and polish, not new features
- If verification tools unavailable, document manual steps
- Keep migration completion summary for future reference
- Ensure codebase is clean and ready for next development phase

