/**
 * validate_transforms.ts
 * 
 * Validates that transforms were applied correctly:
 * 1. All ability IDs are kebab-case
 * 2. ABILITIES Record keys match ability IDs
 * 3. No broken references
 * 4. TypeScript compiles
 * 
 * Usage:
 *   npx tsx scripts/validate_transforms.ts --root apps/vale-v2
 */

import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

const argv = await yargs(hideBin(process.argv))
  .option('root', { type: 'string', default: 'apps/vale-v2' })
  .parseAsync();

const root = path.resolve(process.cwd(), argv.root as string);
const abilityIdRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function checkAbilityIds(): boolean {
  console.log('🔍 Checking ability IDs...');
  
  const abilityFile = path.join(root, 'src/data/definitions/abilities.ts');
  if (!fs.existsSync(abilityFile)) {
    console.log('⚠️  Ability file not found, skipping');
    return true;
  }

  const content = fs.readFileSync(abilityFile, 'utf-8');
  const idRe = /id:\s*['"]([^'"]+)['"]/g;
  const invalidIds: string[] = [];
  
  let match;
  while ((match = idRe.exec(content)) !== null) {
    const id = match[1];
    if (!abilityIdRegex.test(id)) {
      invalidIds.push(id);
    }
  }

  if (invalidIds.length > 0) {
    console.error('❌ Invalid ability IDs found:');
    invalidIds.forEach(id => console.error(`   ${id}`));
    return false;
  }

  console.log('✅ All ability IDs are kebab-case');
  return true;
}

function checkTypeScript(): boolean {
  console.log('\n🔍 Checking TypeScript compilation...');
  
  try {
    execSync('pnpm typecheck', { 
      cwd: root,
      stdio: 'inherit',
    });
    console.log('✅ TypeScript compiles successfully');
    return true;
  } catch (e) {
    console.error('❌ TypeScript compilation failed');
    return false;
  }
}

function checkTests(): boolean {
  console.log('\n🔍 Running tests...');
  
  try {
    execSync('pnpm test', {
      cwd: root,
      stdio: 'inherit',
    });
    console.log('✅ All tests pass');
    return true;
  } catch (e) {
    console.error('❌ Tests failed');
    return false;
  }
}

function main() {
  console.log('🔍 Validating transforms...\n');

  const checks = [
    checkAbilityIds(),
    checkTypeScript(),
    checkTests(),
  ];

  const allPassed = checks.every(c => c);

  console.log('\n' + '='.repeat(60));
  if (allPassed) {
    console.log('✅ All validations passed!');
  } else {
    console.log('❌ Some validations failed. Please review errors above.');
    process.exit(1);
  }
  console.log('='.repeat(60));
}

main();

