# Implementation Prompts - Quick Reference

## Model Selection Guide

### Claude 4.5 Sonnet (200k context) - **RECOMMENDED FOR COMPLEX TASKS**
**Best for:**
- Complex refactoring (XL/L effort)
- Large codebase understanding
- Architectural changes
- Multi-file refactoring

**Use for:**
- ✅ **System 2: Code Quality Refactoring** (XL effort, 2-4 days)
- ✅ Any task requiring deep codebase understanding

### Claude 3.5 Sonnet (200k context) - **SUFFICIENT FOR MOST TASKS**
**Best for:**
- Straightforward bug fixes
- Pattern-based improvements
- Integration work
- Simple cleanup tasks

**Use for:**
- ✅ **System 1: Critical Bug Fixes** (M effort, 4-6 hours)
- ✅ **System 3: Error Handling** (M effort, 1 day)
- ✅ **System 4: Overworld Integration** (L effort, 1-2 days)
- ✅ **System 5: Console Cleanup** (S effort, 2-4 hours)
- ✅ **System 6: TODO Resolution** (S-M effort, varies)

## Quick Answer: Which Model?

**For System 2 (Code Quality Refactoring):** Use **Claude 4.5 Sonnet** - This is the most complex task requiring deep understanding of the codebase structure.

**For all other systems:** Use **Claude 3.5 Sonnet** - These are more straightforward tasks that don't require the advanced reasoning of 4.5.

## Implementation Order

### Phase 1: Critical Fixes (Week 1)
1. **System 1: Critical Bug Fixes** → Claude 3.5 Sonnet
2. **System 3: Error Handling** → Claude 3.5 Sonnet

### Phase 2: Code Quality (Week 2-3)
3. **System 2: Code Quality Refactoring** → **Claude 4.5 Sonnet** ⭐

### Phase 3: Integration & Polish (Week 4)
4. **System 4: Overworld Integration** → Claude 3.5 Sonnet
5. **System 6: TODO Resolution** → Claude 3.5 Sonnet
6. **System 5: Console Cleanup** → Claude 3.5 Sonnet

## Prompt Files

Each system has a dedicated prompt file:

1. `01-critical-bug-fixes.md` - Fix HP validation, PRNG, Djinn, Equipment bugs
2. `02-code-quality-refactoring.md` - Refactor executeRound, split BattleState, extract constants
3. `03-error-handling.md` - Add error boundary, Result types, handle edge cases
4. `04-overworld-integration.md` - Complete overworld/battle integration
5. `05-console-cleanup.md` - Remove console.log, review console.warn
6. `06-todo-resolution.md` - Implement or document all TODOs

## Usage Instructions

1. **Read the main audit document:** `SYSTEMS_AUDIT_AND_IMPLEMENTATION_PROMPTS.md`
2. **Select a system** from the implementation order above
3. **Open the corresponding prompt file** (e.g., `01-critical-bug-fixes.md`)
4. **Copy the prompt** and provide it to Claude AI (3.5 or 4.5 as recommended)
5. **Provide context** by attaching relevant files from the codebase
6. **Review and test** the implementation

## Success Criteria

After completing all systems:
- ✅ All critical bugs fixed
- ✅ Code complexity reduced (executeRound < 50 lines)
- ✅ Error handling improved (error boundary, Result types)
- ✅ Overworld integration complete
- ✅ All TODOs resolved or documented
- ✅ Console statements cleaned up
- ✅ All tests passing
- ✅ No regressions

---

**Note:** Claude 4.5 Sonnet is recommended for System 2 due to its complexity. For all other systems, Claude 3.5 Sonnet is sufficient and more cost-effective.


