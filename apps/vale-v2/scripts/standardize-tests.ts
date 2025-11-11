#!/usr/bin/env tsx
/**
 * Standardize test() vs it() → test()
 * Converts all it() calls to test() for consistency
 */

import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT = join(__dirname, '..');

function findTestFiles(dir: string): string[] {
  const files: string[] = [];
  const entries = readdirSync(dir);

  for (const entry of entries) {
    const fullPath = join(dir, entry);
    const stat = statSync(fullPath);

    if (stat.isDirectory()) {
      files.push(...findTestFiles(fullPath));
    } else if (entry.endsWith('.test.ts') || entry.endsWith('.test.tsx')) {
      files.push(fullPath);
    }
  }

  return files;
}

const testFiles = findTestFiles(join(ROOT, 'tests'));

for (const file of testFiles) {
  let content = readFileSync(file, 'utf-8');
  let modified = false;

  // Replace import { describe, it, expect } with { describe, test, expect }
  if (content.includes("import { describe, it, expect }")) {
    content = content.replace(/import \{ describe, it, expect \}/g, 'import { describe, test, expect }');
    modified = true;
  }
  if (content.includes("import { describe, it, expect, beforeEach }")) {
    content = content.replace(/import \{ describe, it, expect, beforeEach \}/g, 'import { describe, test, expect, beforeEach }');
    modified = true;
  }
  if (content.includes("import { describe, it }")) {
    content = content.replace(/import \{ describe, it \}/g, 'import { describe, test }');
    modified = true;
  }

  // Replace all it( with test(
  if (content.includes('  it(')) {
    content = content.replace(/  it\(/g, '  test(');
    modified = true;
  }

  if (modified) {
    writeFileSync(file, content, 'utf-8');
    console.log(`✅ Fixed: ${file.replace(ROOT, '')}`);
  }
}

console.log(`\n✅ Processed ${testFiles.length} test files`);

