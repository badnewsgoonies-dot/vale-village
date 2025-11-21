/**
 * dedupe_types.ts
 * 
 * Scans for duplicate type and interface definitions across:
 * - src/types
 * - src/domain/types
 * 
 * Reports duplicates and suggests consolidation strategy.
 * 
 * Usage:
 *   npx tsx scripts/dedupe_types.ts
 *   npx tsx scripts/dedupe_types.ts --root <path>  # Optional: specify custom root
 */

import * as fs from 'fs';
import * as path from 'path';

const argv = require('yargs')
  .option('root', { type: 'string', default: '.' })
  .argv;

const root = path.resolve(process.cwd(), argv.root as string);

interface TypeLocation {
  name: string;
  file: string;
  kind: 'type' | 'interface';
  line: number;
}

function collectTypes(dir: string, baseDir: string): TypeLocation[] {
  const results: TypeLocation[] = [];
  
  if (!fs.existsSync(dir)) return results;

  const files = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const file of files) {
    const fullPath = path.join(dir, file.name);
    
    if (file.isDirectory()) {
      results.push(...collectTypes(fullPath, baseDir));
    } else if (file.isFile() && /\.tsx?$/.test(file.name)) {
      const content = fs.readFileSync(fullPath, 'utf-8');
      const lines = content.split('\n');
      
      // Match type and interface declarations
      const typeRe = /\b(?:export\s+)?(type|interface)\s+([A-Z][A-Za-z0-9_]*)/g;
      let match;
      
      while ((match = typeRe.exec(content)) !== null) {
        const kind = match[1] as 'type' | 'interface';
        const name = match[2];
        const line = content.substring(0, match.index).split('\n').length;
        
        results.push({
          name,
          file: path.relative(baseDir, fullPath),
          kind,
          line,
        });
      }
    }
  }
  
  return results;
}

function main() {
  console.log('🔍 Scanning for duplicate type definitions...\n');

  // Check both main codebase and vale-v2
  const searchDirs = [
    path.join(process.cwd(), 'src/types'),
    path.join(process.cwd(), 'src/domain/types'),
    path.join(root, 'src/types'),
    path.join(root, 'src/domain/types'),
  ].filter(fs.existsSync);

  if (searchDirs.length === 0) {
    console.log('⚠️  No type directories found');
    return;
  }

  const allTypes = new Map<string, TypeLocation[]>();
  
  for (const dir of searchDirs) {
    const types = collectTypes(dir, process.cwd());
    for (const type of types) {
      if (!allTypes.has(type.name)) {
        allTypes.set(type.name, []);
      }
      allTypes.get(type.name)!.push(type);
    }
  }

  // Find duplicates
  const duplicates = Array.from(allTypes.entries())
    .filter(([, locations]) => locations.length > 1)
    .sort(([a], [b]) => a.localeCompare(b));

  if (duplicates.length === 0) {
    console.log('✅ No duplicate types found!\n');
    return;
  }

  console.log(`❌ Found ${duplicates.length} duplicate type(s):\n`);

  for (const [name, locations] of duplicates) {
    console.log(`📌 ${name} (${locations.length} definitions):`);
    
    // Group by file
    const byFile = new Map<string, TypeLocation[]>();
    for (const loc of locations) {
      if (!byFile.has(loc.file)) {
        byFile.set(loc.file, []);
      }
      byFile.get(loc.file)!.push(loc);
    }

    for (const [file, locs] of byFile.entries()) {
      const kinds = locs.map(l => l.kind).join(', ');
      const lines = locs.map(l => l.line).join(', ');
      console.log(`   ${file}:${lines} (${kinds})`);
    }
    console.log();
  }

  // Recommendations
  console.log('💡 Recommendations:\n');
  console.log('1. Choose canonical location (prefer src/types/ over src/domain/types/)');
  console.log('2. Remove duplicates from non-canonical location');
  console.log('3. Update imports to reference canonical location');
  console.log('4. Consider adding barrel exports (index.ts) for convenience\n');

  // Generate import update suggestions
  console.log('📝 Suggested consolidation:\n');
  for (const [name, locations] of duplicates) {
    // Prefer src/types/ over src/domain/types/
    const canonical = locations.find(l => l.file.includes('src/types/')) ||
                     locations.find(l => !l.file.includes('src/domain/types/')) ||
                     locations[0];
    
    const others = locations.filter(l => l.file !== canonical.file);
    
    if (others.length > 0) {
      console.log(`${name}:`);
      console.log(`  Keep: ${canonical.file}`);
      console.log(`  Remove: ${others.map(o => o.file).join(', ')}`);
      console.log();
    }
  }
}

main();

