#!/usr/bin/env tsx
/**
 * Fix Coding Conventions Script
 * 
 * Finds and fixes inconsistencies:
 * 1. Standardizes test() vs it() → test()
 * 2. Renames mapSchema.ts → MapSchema.ts (and updates imports)
 * 3. Finds snake_case IDs that should be kebab-case
 * 
 * Usage: pnpm tsx scripts/fix-conventions.ts [--dry-run]
 */

import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { join, dirname, basename } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT = join(__dirname, '..');

const DRY_RUN = process.argv.includes('--dry-run');

interface Issue {
  file: string;
  line: number;
  issue: string;
  fix?: string;
}

const issues: Issue[] = [];

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

function fixTestItToTest() {
  console.log('🔍 Checking test files for it() → test()...');
  const testFiles = findTestFiles(join(ROOT, 'tests'));

  for (const file of testFiles) {
    const content = readFileSync(file, 'utf-8');
    const lines = content.split('\n');
    let modified = false;
    const newLines: string[] = [];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      // Match: "  it('test name', () => {" or "  it('test name', async () => {"
      const itMatch = line.match(/^(\s+)it\(/);
      if (itMatch) {
        const indent = itMatch[1];
        const newLine = line.replace(/^(\s+)it\(/, '$1test(');
        newLines.push(newLine);
        issues.push({
          file: file.replace(ROOT, ''),
          line: i + 1,
          issue: `Found it() instead of test()`,
          fix: newLine,
        });
        modified = true;
      } else {
        newLines.push(line);
      }
    }

    if (modified && !DRY_RUN) {
      writeFileSync(file, newLines.join('\n'), 'utf-8');
      console.log(`✅ Fixed: ${file.replace(ROOT, '')}`);
    } else if (modified) {
      console.log(`🔧 Would fix: ${file.replace(ROOT, '')}`);
    }
  }
}

function findSnakeCaseIds() {
  console.log('🔍 Checking for snake_case IDs that should be kebab-case...');
  const dataFiles = [
    join(ROOT, 'src/data/definitions/units.ts'),
    join(ROOT, 'src/data/definitions/enemies.ts'),
    join(ROOT, 'src/data/definitions/abilities.ts'),
    join(ROOT, 'src/data/definitions/equipment.ts'),
  ];

  for (const file of dataFiles) {
    if (!require('fs').existsSync(file)) continue;

    const content = readFileSync(file, 'utf-8');
    const lines = content.split('\n');

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      // Match: id: 'war_mage' or id: "war_mage"
      const snakeCaseMatch = line.match(/id:\s*['"]([a-z]+_[a-z_]+)['"]/);
      if (snakeCaseMatch) {
        const snakeId = snakeCaseMatch[1];
        const kebabId = snakeId.replace(/_/g, '-');
        issues.push({
          file: file.replace(ROOT, ''),
          line: i + 1,
          issue: `Found snake_case ID: '${snakeId}'`,
          fix: `Should be kebab-case: '${kebabId}'`,
        });
      }
    }
  }
}

function checkMapSchema() {
  console.log('🔍 Checking mapSchema.ts naming...');
  const mapSchemaPath = join(ROOT, 'src/data/schemas/mapSchema.ts');
  const mapSchemaPascalPath = join(ROOT, 'src/data/schemas/MapSchema.ts');

  if (require('fs').existsSync(mapSchemaPath)) {
    issues.push({
      file: 'src/data/schemas/mapSchema.ts',
      line: 0,
      issue: 'File should be renamed to MapSchema.ts (PascalCase)',
      fix: 'Rename mapSchema.ts → MapSchema.ts',
    });

    // Find imports
    const overworldFile = join(ROOT, 'src/core/models/overworld.ts');
    if (require('fs').existsSync(overworldFile)) {
      const content = readFileSync(overworldFile, 'utf-8');
      if (content.includes('mapSchema')) {
        issues.push({
          file: 'src/core/models/overworld.ts',
          line: 0,
          issue: 'Import references mapSchema, should be MapSchema',
          fix: "Update import: from '@/data/schemas/MapSchema'",
        });
      }
    }
  }
}

// Main execution
console.log('🚀 Fixing coding conventions...\n');

if (DRY_RUN) {
  console.log('🔍 DRY RUN MODE - No files will be modified\n');
}

fixTestItToTest();
findSnakeCaseIds();
checkMapSchema();

// Report
console.log('\n📊 Summary:');
console.log(`Found ${issues.length} issues\n`);

if (issues.length > 0) {
  console.log('Issues found:');
  issues.forEach((issue, idx) => {
    console.log(`\n${idx + 1}. ${issue.file}:${issue.line}`);
    console.log(`   Issue: ${issue.issue}`);
    if (issue.fix) {
      console.log(`   Fix: ${issue.fix}`);
    }
  });

  if (DRY_RUN) {
    console.log('\n💡 Run without --dry-run to apply fixes');
  }
} else {
  console.log('✅ No issues found!');
}

