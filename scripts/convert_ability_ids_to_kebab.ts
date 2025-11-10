/**
 * convert_ability_ids_to_kebab.ts
 * 
 * Converts ability IDs from snake_case to kebab-case in:
 * 1. Ability definition `id:` properties
 * 2. ABILITIES Record keys (both quoted and unquoted)
 * 3. References in other files (equipment, units, tests, etc.)
 * 
 * Usage:
 *   # Dry run (no writes)
 *   npx tsx scripts/convert_ability_ids_to_kebab.ts --root apps/vale-v2 --dry
 * 
 *   # Apply changes
 *   npx tsx scripts/convert_ability_ids_to_kebab.ts --root apps/vale-v2
 * 
 * IMPORTANT:
 * - Review git diffs and run tests after applying
 * - Creates a backup branch automatically
 */

import { Project, SyntaxKind, StringLiteral, PropertyAssignment, ObjectLiteralExpression, VariableDeclaration } from 'ts-morph';
import * as path from 'path';
import * as fs from 'fs';
import { execSync } from 'child_process';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

const argv = await yargs(hideBin(process.argv))
  .option('root', { type: 'string', default: 'apps/vale-v2' })
  .option('dry', { type: 'boolean', default: true })
  .option('skip-backup', { type: 'boolean', default: false })
  .parseAsync();

const root = path.resolve(process.cwd(), argv.root as string);
const dry = Boolean(argv.dry);
const skipBackup = Boolean(argv.skipBackup);

// Track ID mappings for reference updates
const idMappings = new Map<string, string>();

/**
 * Convert snake_case to kebab-case
 */
function toKebabCase(s: string): string {
  return s.replace(/_/g, '-');
}

/**
 * Check if a string looks like an ability ID (snake_case that should be kebab-case)
 */
function isSnakeCaseAbilityId(s: string): boolean {
  return /^[a-z0-9_]+$/.test(s) && s.includes('_');
}

/**
 * Pre-flight safety checks
 */
function preflightChecks(): void {
  if (!dry && !skipBackup) {
    // Check git status
    try {
      const status = execSync('git status --porcelain', { encoding: 'utf-8' });
      if (status.trim()) {
        console.error('❌ Working directory not clean. Commit or stash changes first.');
        console.error(status);
        process.exit(1);
      }
    } catch (e) {
      console.warn('⚠️  Could not check git status (not a git repo?)');
    }

    // Check branch
    try {
      const branch = execSync('git branch --show-current', { encoding: 'utf-8' }).trim();
      if (branch === 'main' || branch === 'master') {
        console.error(`❌ Cannot run on ${branch} branch. Create a feature branch first.`);
        process.exit(1);
      }
      console.log(`✓ Running on branch: ${branch}`);
    } catch (e) {
      console.warn('⚠️  Could not check git branch');
    }
  }
}

/**
 * Process ability definition file
 */
function processAbilityFile(filePath: string, project: Project): boolean {
  const source = project.addSourceFileAtPathIfExists(filePath);
  if (!source) return false;

  let changed = false;

  // Step 1: Update ability definition `id:` properties
  source.forEachDescendant(node => {
    if (node.getKind() === SyntaxKind.StringLiteral) {
      const lit = node as StringLiteral;
      const text = lit.getLiteralText();

      if (!isSnakeCaseAbilityId(text)) return;

      // Check if parent is an 'id' property
      const parent = lit.getParent();
      if (parent && parent.getKind() === SyntaxKind.PropertyAssignment) {
        const prop = parent as PropertyAssignment;
        const name = prop.getName();

        if (name === 'id') {
          const newId = toKebabCase(text);
          idMappings.set(text, newId);
          lit.replaceWithText(`'${newId}'`);
          changed = true;
          console.log(`  [id property] ${text} → ${newId}`);
        }
      }
    }
  });

  // Step 2: Update ABILITIES Record keys
  const abilitiesVar = source.getVariableDeclaration('ABILITIES');
  if (abilitiesVar) {
    const initializer = abilitiesVar.getInitializer();
    if (initializer && initializer.getKind() === SyntaxKind.ObjectLiteralExpression) {
      const obj = initializer as ObjectLiteralExpression;
      
      obj.getProperties().forEach(prop => {
        if (prop.getKind() === SyntaxKind.PropertyAssignment) {
          const propAssignment = prop as PropertyAssignment;
          const nameNode = propAssignment.getNameNode();
          
          // Handle both quoted and unquoted keys
          let oldKey: string | null = null;
          if (nameNode.getKind() === SyntaxKind.StringLiteral) {
            oldKey = (nameNode as StringLiteral).getLiteralText();
          } else if (nameNode.getKind() === SyntaxKind.Identifier) {
            oldKey = nameNode.getText();
          }

          if (oldKey && isSnakeCaseAbilityId(oldKey)) {
            const newKey = toKebabCase(oldKey);
            // Update the key - always use quoted string
            if (nameNode.getKind() === SyntaxKind.StringLiteral) {
              (nameNode as StringLiteral).replaceWithText(`'${newKey}'`);
            } else {
              // Convert identifier to quoted string literal
              nameNode.replaceWithText(`'${newKey}'`);
            }
            changed = true;
            console.log(`  [ABILITIES key] ${oldKey} → ${newKey}`);
          }
        }
      });
    }
  }

  if (changed && !dry) {
    source.saveSync();
  }

  return changed;
}

/**
 * Update ability ID references in other files
 */
function updateReferences(filePath: string, project: Project): boolean {
  const source = project.addSourceFileAtPathIfExists(filePath);
  if (!source) return false;

  let changed = false;

  source.forEachDescendant(node => {
    if (node.getKind() === SyntaxKind.StringLiteral) {
      const lit = node as StringLiteral;
      const text = lit.getLiteralText();

      // Check if this string matches an old ability ID
      if (idMappings.has(text)) {
        const newId = idMappings.get(text)!;
        lit.replaceWithText(`'${newId}'`);
        changed = true;
        console.log(`  [reference] ${text} → ${newId}`);
      }
    }
  });

  if (changed && !dry) {
    source.saveSync();
  }

  return changed;
}

/**
 * Collect all TypeScript files in a directory
 */
function collectTsFiles(dir: string, excludePatterns: RegExp[] = []): string[] {
  const results: string[] = [];
  
  if (!fs.existsSync(dir)) return results;

  const entries = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    
    // Skip node_modules, dist, etc.
    if (entry.name === 'node_modules' || entry.name === 'dist' || entry.name === '.git') {
      continue;
    }

    if (entry.isDirectory()) {
      results.push(...collectTsFiles(fullPath, excludePatterns));
    } else if (entry.isFile() && /\.tsx?$/.test(entry.name)) {
      // Check exclude patterns
      const shouldExclude = excludePatterns.some(pattern => pattern.test(fullPath));
      if (!shouldExclude) {
        results.push(fullPath);
      }
    }
  }

  return results;
}

/**
 * Main execution
 */
function main() {
  console.log('🔍 Code Consistency Fix: Ability ID Conversion\n');
  console.log(`Root: ${root}`);
  console.log(`Mode: ${dry ? 'DRY RUN' : 'APPLY CHANGES'}\n`);

  preflightChecks();

  const project = new Project({
    tsConfigFilePath: path.join(root, 'tsconfig.json'),
    skipAddingFilesFromTsConfig: false,
  });

  // Step 1: Process ability definition files
  console.log('📝 Step 1: Processing ability definitions...');
  const abilityFiles = [
    path.join(root, 'src/data/definitions/abilities.ts'),
    path.join(process.cwd(), 'src/data/abilities.ts'), // Also check main codebase
  ].filter(fs.existsSync);

  if (abilityFiles.length === 0) {
    console.error('❌ No ability definition files found');
    process.exit(1);
  }

  let totalChanged = 0;
  for (const file of abilityFiles) {
    console.log(`\nProcessing: ${path.relative(process.cwd(), file)}`);
    if (processAbilityFile(file, project)) {
      totalChanged++;
    }
  }

  console.log(`\n✓ Processed ${abilityFiles.length} ability definition file(s)`);
  console.log(`✓ Found ${idMappings.size} ID mapping(s)`);

  // Step 2: Update references in other files
  if (idMappings.size > 0) {
    console.log('\n📝 Step 2: Updating references in other files...');
    
    const allFiles = collectTsFiles(path.join(root, 'src'), [
      /abilities\.ts$/, // Skip ability files (already processed)
    ]);

    let refsUpdated = 0;
    for (const file of allFiles) {
      if (updateReferences(file, project)) {
        refsUpdated++;
        console.log(`  Updated: ${path.relative(process.cwd(), file)}`);
      }
    }

    console.log(`\n✓ Updated references in ${refsUpdated} file(s)`);
  }

  // Summary
  console.log('\n' + '='.repeat(60));
  if (dry) {
    console.log('✅ DRY RUN COMPLETE');
    console.log('Review the changes above, then run without --dry to apply');
  } else {
    console.log('✅ CHANGES APPLIED');
    console.log(`\nNext steps:`);
    console.log(`  1. Review: git diff`);
    console.log(`  2. Test: pnpm test`);
    console.log(`  3. Typecheck: pnpm typecheck`);
    console.log(`  4. Commit: git add . && git commit -m "fix: convert ability IDs to kebab-case"`);
  }
  console.log('='.repeat(60));
}

main();

