# Fix Package Review & Recommendations

## Overall Assessment: ✅ **Solid Foundation, Needs Refinements**

The fix package is comprehensive and well-structured. However, several critical improvements are needed before deployment.

---

## 🎯 Strengths

1. **Comprehensive Coverage**: Addresses all three major issues identified in the audit
2. **Safety First**: Dry-run modes, backup recommendations, feature branch workflow
3. **Multi-Layer Enforcement**: ESLint (compile-time) + Zod (runtime) + Tests (CI)
4. **Good Tooling**: Uses `ts-morph` for AST-based transformations (safer than regex)

---

## ⚠️ Critical Issues to Fix

### 1. **Ability ID Transform: Too Broad**

**Problem**: The `looksLikeAbilityId` heuristic will match ANY string with underscores, not just ability IDs.

```typescript
// Current heuristic - TOO BROAD
function looksLikeAbilityId(s: string) {
  return /^[a-z0-9_\-]+$/.test(s);  // Matches 'some_random_string' anywhere!
}
```

**Impact**: Could accidentally transform:
- Variable names: `const some_value = 'test'` → `const some-value = 'test'` ❌
- Object keys: `{ my_key: value }` → `{ my-key: value }` ❌
- Comments or strings that aren't ability IDs

**Fix Required**: Target ONLY:
1. String literals in `id:` properties of ability objects
2. Keys in `ABILITIES` Record objects
3. String literals in `unlocksAbility` properties

**Recommended Fix**:
```typescript
function processFile(filePath: string) {
  const source = project.addSourceFileAtPathIfExists(filePath);
  if (!source) return null;
  let changed = false;

  // Only process ability definition files
  if (!/abilities?.*\.ts$/i.test(filePath)) {
    return null;
  }

  source.forEachDescendant(node => {
    if (node.getKind() === SyntaxKind.StringLiteral) {
      const lit = node as StringLiteral;
      const text = lit.getLiteralText();
      
      // Check if parent is an 'id' property
      const parent = lit.getParent();
      if (parent && parent.getKind() === SyntaxKind.PropertyAssignment) {
        const prop = parent as PropertyAssignment;
        const name = prop.getName();
        
        // Only transform if it's an 'id' property OR a Record key
        if (name === 'id' || isRecordKey(parent)) {
          if (text.includes('_') && /^[a-z0-9_]+$/.test(text)) {
            const newId = text.replace(/_/g, '-');
            lit.replaceWithText(`'${newId}'`);
            changed = true;
          }
        }
      }
      
      // Also check if it's a Record key in ABILITIES
      if (isAbilitiesRecordKey(lit)) {
        if (text.includes('_') && /^[a-z0-9_]+$/.test(text)) {
          const newId = text.replace(/_/g, '-');
          lit.replaceWithText(`'${newId}'`);
          changed = true;
        }
      }
    }
  });
  
  return changed;
}
```

---

### 2. **Missing: Update ABILITIES Record Keys**

**Problem**: The script transforms ability `id:` properties but doesn't update the corresponding keys in `ABILITIES` Record.

**Current State**:
```typescript
// After transform, this would be broken:
export const HEAVY_STRIKE: Ability = {
  id: 'heavy-strike',  // ✅ Fixed
};

export const ABILITIES: Record<string, Ability> = {
  'heavy_strike': HEAVY_STRIKE,  // ❌ Still snake_case - lookup will fail!
};
```

**Fix Required**: Also update Record keys:
```typescript
// Find ABILITIES Record and update keys
const abilitiesRecord = source.getVariableDeclaration('ABILITIES');
if (abilitiesRecord) {
  const initializer = abilitiesRecord.getInitializer();
  if (initializer && initializer.getKind() === SyntaxKind.ObjectLiteralExpression) {
    const obj = initializer as ObjectLiteralExpression;
    obj.getProperties().forEach(prop => {
      if (prop.getKind() === SyntaxKind.PropertyAssignment) {
        const key = prop.getName();
        if (key.includes('_')) {
          const newKey = key.replace(/_/g, '-');
          prop.setName(newKey);
        }
      }
    });
  }
}
```

---

### 3. **Missing: Update References in Other Files**

**Problem**: Ability IDs are referenced in:
- Equipment definitions (`unlocksAbility: 'heavy_strike'`)
- Unit definitions (ability arrays)
- Test files
- Story/encounter data

**Fix Required**: Add a second pass that scans ALL files for ability ID references:

```typescript
// After transforming ability definitions, scan for references
function updateAbilityIdReferences(root: string, idMap: Map<string, string>) {
  // idMap: old_id -> new_id
  const allFiles = collectAllTsFiles(root);
  
  allFiles.forEach(filePath => {
    const source = project.addSourceFileAtPathIfExists(filePath);
    if (!source) return;
    
    source.forEachDescendant(node => {
      if (node.getKind() === SyntaxKind.StringLiteral) {
        const lit = node as StringLiteral;
        const text = lit.getLiteralText();
        
        // Check if this string matches an old ability ID
        if (idMap.has(text)) {
          const newId = idMap.get(text)!;
          lit.replaceWithText(`'${newId}'`);
        }
      }
    });
  });
}
```

---

### 4. **Service Transform: Fragile Regex**

**Problem**: The regex-based replacement in `service_class_to_function_transform.ts` is fragile:

```typescript
// Current - FRAGILE
const clean = sig.replace(/\b(static|public|private|protected)\b\s*/g, "");
return clean.replace(/^([\s\S]*?)\b([A-Za-z0-9_]+)\s*\(/, "export function $2(");
```

**Issues**:
- Doesn't preserve JSDoc comments properly
- Doesn't handle complex return types well
- Doesn't handle generic types
- Doesn't update imports/exports

**Fix Required**: Use ts-morph's AST manipulation:

```typescript
methods.forEach(method => {
  const methodName = method.getName();
  const returnType = method.getReturnTypeNode()?.getText() || 'void';
  const parameters = method.getParameters().map(p => p.getText()).join(', ');
  const jsdoc = method.getJsDocs().map(d => d.getText()).join('\n');
  
  // Create function declaration
  const functionText = `
${jsdoc}
export function ${methodName}(${parameters}): ${returnType} {
  ${method.getBody()?.getText() || '// TODO: implement'}
}
`;
  
  // Insert after class
  source.insertText(cls.getEnd(), functionText);
});
```

---

### 5. **ESLint Rule: Too Broad**

**Problem**: The ESLint rule checks ALL string literals in arrays, not just ability IDs.

```javascript
// Current - TOO BROAD
"ArrayExpression > Literal"(node) {
  if (typeof node.value === "string" && /[_]/.test(node.value)) {
    context.report({ ... });  // Will flag ANY string with underscore!
  }
}
```

**Fix Required**: Only check in specific contexts:

```javascript
create(context) {
  const filename = context.getFilename();
  
  // Only check in ability definition files
  if (!/abilities?.*\.ts$/i.test(filename)) {
    return {};
  }
  
  return {
    Property(node) {
      // Only check 'id' or 'abilityId' properties
      if (node.key.name === 'id' || node.key.name === 'abilityId') {
        if (node.value.type === 'Literal' && typeof node.value.value === 'string') {
          const val = node.value.value;
          if (/[_]/.test(val) && /^[a-z0-9_]+$/.test(val)) {
            context.report({
              node: node.value,
              message: `Ability ID should be kebab-case: "${val}" → "${val.replace(/_/g, '-')}"`,
            });
          }
        }
      }
    },
    
    // Check Record keys in ABILITIES
    "Property[key.type='Literal']"(node) {
      const parent = node.parent;
      if (parent && parent.type === 'VariableDeclarator' && 
          parent.id.name === 'ABILITIES') {
        const key = node.key.value;
        if (typeof key === 'string' && /[_]/.test(key)) {
          context.report({
            node: node.key,
            message: `ABILITIES Record key should be kebab-case: "${key}"`,
          });
        }
      }
    },
  };
}
```

---

### 6. **Test: Dynamic Requires Won't Work**

**Problem**: The test uses `require()` which won't work well with TypeScript/ESM:

```typescript
// Current - WON'T WORK
const a1 = require('../apps/vale-v2/src/data/definitions/abilities').default;
```

**Fix Required**: Use proper imports or file reading:

```typescript
import * as fs from 'fs';
import * as path from 'path';
import { abilityIdRegex } from '../schemas/abilitySchema';

// Read and parse ability files directly
function loadAbilities(filePath: string): Array<{ id: string }> {
  const content = fs.readFileSync(filePath, 'utf-8');
  // Extract ability IDs using regex or AST parsing
  const idMatches = content.matchAll(/id:\s*['"]([^'"]+)['"]/g);
  return Array.from(idMatches, m => ({ id: m[1] }));
}

test('ability ids match kebab-case regex', () => {
  const abilities1 = loadAbilities('./apps/vale-v2/src/data/definitions/abilities.ts');
  const abilities2 = loadAbilities('./src/data/abilities.ts');
  
  const allAbilities = [...abilities1, ...abilities2];
  
  expect(allAbilities.length).toBeGreaterThan(0);
  
  allAbilities.forEach(ability => {
    expect(ability.id).toMatch(abilityIdRegex);
  });
});
```

---

### 7. **Missing: Update Zod Schema**

**Problem**: The Zod schema in `apps/vale-v2/src/data/schemas/AbilitySchema.ts` doesn't enforce kebab-case.

**Current**:
```typescript
id: z.string().min(1),  // No format validation!
```

**Fix Required**: Update the existing schema:

```typescript
// apps/vale-v2/src/data/schemas/AbilitySchema.ts
export const abilityIdRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const AbilitySchema = z.object({
  id: z.string().regex(abilityIdRegex, {
    message: "Ability ID must be kebab-case (lowercase alphanumerics and hyphens only)",
  }),
  // ... rest of schema
});
```

---

## 📋 Additional Recommendations

### 1. **Add Pre-Flight Checks**

Before running transforms, validate:
- Git working directory is clean
- On a feature branch
- All tests pass

```typescript
function preflightChecks() {
  // Check git status
  const { execSync } = require('child_process');
  const status = execSync('git status --porcelain').toString();
  if (status.trim()) {
    throw new Error('Working directory not clean. Commit or stash changes first.');
  }
  
  // Check branch
  const branch = execSync('git branch --show-current').toString().trim();
  if (branch === 'main' || branch === 'master') {
    throw new Error('Cannot run on main branch. Create a feature branch first.');
  }
}
```

### 2. **Add Rollback Script**

Create a simple rollback:

```bash
#!/bin/bash
# rollback_fixes.sh
git checkout -- apps/vale-v2/src/data/definitions/abilities.ts
git checkout -- src/core/services/*.ts
# etc.
```

### 3. **Add Validation Script**

After transforms, validate changes:

```typescript
// validate_transforms.ts
function validateTransforms() {
  // 1. Check all ability IDs are kebab-case
  // 2. Check ABILITIES Record keys match ability IDs
  // 3. Check no broken references
  // 4. Run TypeScript compiler
  // 5. Run tests
}
```

### 4. **Update Fix Plan with Execution Order**

The fix plan should specify exact order:

1. **Phase 1: Preparation**
   - Create feature branch
   - Run tests (baseline)
   - Backup current state

2. **Phase 2: Ability IDs**
   - Run `dedupe_types.ts` (detection only)
   - Run `convert_ability_ids_to_kebab.ts --dry` (review)
   - Run `convert_ability_ids_to_kebab.ts` (apply)
   - Update `ABILITIES` Record keys
   - Update references in other files
   - Update Zod schema
   - Run tests

3. **Phase 3: Service Classes**
   - Run `service_class_to_function_transform.ts --dry`
   - Manual review
   - Apply transforms
   - Update imports
   - Run tests

4. **Phase 4: Type Deduplication**
   - Run `dedupe_types.ts`
   - Choose canonical location
   - Update imports manually (or create script)
   - Run tests

5. **Phase 5: Enforcement**
   - Add ESLint rule
   - Add Zod validation
   - Add CI checks
   - Run full test suite

---

## ✅ What's Good (Keep As-Is)

1. **Dry-run mode** - Essential for safety
2. **Comprehensive approach** - Multi-layer enforcement
3. **Documentation** - Good README and plan
4. **Tool choice** - ts-morph is the right tool
5. **Safety recommendations** - Feature branch, backups, etc.

---

## 🎯 Priority Fixes Before Use

**Must Fix Before Running:**
1. ✅ Narrow ability ID transform scope (only `id:` properties and Record keys)
2. ✅ Update `ABILITIES` Record keys
3. ✅ Update references in other files (equipment, units, tests)
4. ✅ Fix ESLint rule scope
5. ✅ Fix test to use file reading instead of require

**Should Fix:**
6. ✅ Improve service transform with proper AST manipulation
7. ✅ Add pre-flight checks
8. ✅ Add validation script
9. ✅ Update Zod schema in vale-v2

**Nice to Have:**
10. ✅ Add rollback script
11. ✅ Add progress reporting
12. ✅ Add detailed logging

---

## 📝 Revised Execution Plan

```markdown
### Step-by-Step Execution

1. **Setup** (5 min)
   ```bash
   git checkout -b fix/code-consistency
   npm install ts-morph typescript yargs zod
   ```

2. **Ability IDs** (30 min)
   ```bash
   # Dry run
   npx ts-node scripts/convert_ability_ids_to_kebab.ts --root . --dry > dry-run.log
   
   # Review dry-run.log
   # Apply fixes
   npx ts-node scripts/convert_ability_ids_to_kebab.ts --root .
   
   # Verify
   npm run test
   npm run typecheck
   ```

3. **Service Classes** (20 min)
   ```bash
   # Dry run
   npx ts-node scripts/service_class_to_function_transform.ts --root . --dry
   
   # Review, then apply
   npx ts-node scripts/service_class_to_function_transform.ts --root .
   
   # Verify
   npm run test
   ```

4. **Types** (15 min)
   ```bash
   # Detection only
   node scripts/dedupe_types.ts --root . > duplicates.log
   
   # Manual cleanup based on duplicates.log
   ```

5. **Enforcement** (10 min)
   - Add ESLint rule to config
   - Update Zod schema
   - Add CI check

6. **Final Validation** (10 min)
   ```bash
   npm run lint
   npm run test
   npm run typecheck
   git diff --stat
   ```
```

---

## 🎬 Conclusion

The fix package is **80% there**. With the refinements above, it will be production-ready. The main gaps are:

1. **Scope narrowing** - Transforms are too broad
2. **Reference updates** - Missing updates to dependent files
3. **Validation** - Need better pre/post checks

**Recommendation**: Implement the critical fixes (1-5) before running, then proceed with confidence.

