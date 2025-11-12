# Clean Up Console Statements

## Context
Review and clean up console statements according to project rules: only console.warn and console.error are allowed, no console.log.

## Current State
- 45 console statements found across codebase
- Most are console.error/warn (allowed)
- Some may be console.log (needs removal)
- Some console.warn may need to be converted to proper error handling

## Tasks

### Task 1: Audit All Console Statements
**Action:** Review all console statements in `apps/vale-v2/src/`

**Rules:**
- ✅ `console.error()` - Allowed for errors
- ✅ `console.warn()` - Allowed for warnings
- ❌ `console.log()` - Must be removed
- ❌ `console.debug()` - Must be removed

### Task 2: Remove console.log Statements
**Action:** Remove all console.log statements

**Options:**
- Delete if debug-only
- Convert to console.warn if important
- Convert to proper error handling if error case

### Task 3: Review console.warn Usage
**Action:** Review each console.warn

**Questions:**
- Should this be proper error handling instead?
- Is this warning actionable?
- Should this be logged to error tracking service?

**Keep if:**
- User-actionable warnings
- Data validation warnings
- Fallback behavior notifications

**Convert to error handling if:**
- Represents actual error condition
- Should be caught and handled
- User shouldn't see technical details

### Task 4: Ensure Consistency
**Action:** Ensure all error logging follows patterns

**Pattern:**
```typescript
// Good
console.error('Failed to save game:', error);
return Result.err(error);

// Bad
console.log('Saving game...');
console.error('Error:', error);
```

## Success Criteria
- No console.log statements remain
- All console.warn are appropriate
- Error handling improved where needed
- ESLint passes (no console.log violations)

## Files to Review
- All files with console statements (45 found)
- `apps/vale-v2/.eslintrc` (verify rules)

## Recommended Model
**Claude 3.5 Sonnet** (200k context) - Sufficient for simple cleanup task


