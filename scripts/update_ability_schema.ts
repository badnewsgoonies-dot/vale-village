/**
 * update_ability_schema.ts
 * 
 * Updates the Zod schema to enforce kebab-case for ability IDs
 * 
 * Usage:
 *   npx tsx scripts/update_ability_schema.ts
 *   npx tsx scripts/update_ability_schema.ts --root <path>  # Optional: specify custom root
 */

import * as fs from 'fs';
import * as path from 'path';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

const argv = await yargs(hideBin(process.argv))
  .option('root', { type: 'string', default: '.' })
  .parseAsync();

const root = path.resolve(process.cwd(), argv.root as string);
const schemaPath = path.join(root, 'src/data/schemas/AbilitySchema.ts');

function updateSchema() {
  if (!fs.existsSync(schemaPath)) {
    console.error(`❌ Schema file not found: ${schemaPath}`);
    process.exit(1);
  }

  let content = fs.readFileSync(schemaPath, 'utf-8');

  // Check if already updated
  if (content.includes('abilityIdRegex')) {
    console.log('✓ Schema already has kebab-case validation');
    return;
  }

  // Add regex constant after imports
  const importEnd = content.indexOf('export const AbilitySchema');
  if (importEnd === -1) {
    console.error('❌ Could not find AbilitySchema export');
    process.exit(1);
  }

  const regexDefinition = `
/**
 * Regex pattern for kebab-case ability IDs
 * Enforces: lowercase alphanumerics and hyphens only
 */
export const abilityIdRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
`;

  // Insert regex definition before schema
  content = content.slice(0, importEnd) + regexDefinition + '\n' + content.slice(importEnd);

  // Update id field in schema
  content = content.replace(
    /id:\s*z\.string\(\)\.min\(1\)/,
    `id: z.string().regex(abilityIdRegex, {
    message: "Ability ID must be kebab-case (lowercase alphanumerics and hyphens only)",
  })`
  );

  fs.writeFileSync(schemaPath, content, 'utf-8');
  console.log(`✅ Updated schema: ${path.relative(process.cwd(), schemaPath)}`);
}

updateSchema();

