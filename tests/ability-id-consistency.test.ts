/**
 * Test: Ability ID Consistency
 * 
 * Ensures all ability IDs conform to kebab-case format
 * 
 * Usage:
 *   pnpm test tests/ability-id-consistency.test.ts
 */

import { describe, it, expect } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';

const abilityIdRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

/**
 * Extract ability IDs from a TypeScript file
 */
function extractAbilityIds(filePath: string): string[] {
  if (!fs.existsSync(filePath)) {
    return [];
  }

  const content = fs.readFileSync(filePath, 'utf-8');
  const ids: string[] = [];

  // Match id: 'value' or id: "value"
  const idPropertyRe = /id:\s*['"]([^'"]+)['"]/g;
  let match;
  while ((match = idPropertyRe.exec(content)) !== null) {
    ids.push(match[1]);
  }

  // Match ABILITIES Record keys (both quoted and unquoted)
  const abilitiesRecordRe = /ABILITIES[^}]*\{([^}]+)\}/s;
  const abilitiesMatch = abilitiesRecordRe.exec(content);
  if (abilitiesMatch) {
    const recordContent = abilitiesMatch[1];
    // Match keys: 'key': or key: (identifier)
    const keyRe = /(?:['"]([^'"]+)['"]|([a-z0-9_]+)):\s*[A-Z_]+/g;
    let keyMatch;
    while ((keyMatch = keyRe.exec(recordContent)) !== null) {
      const key = keyMatch[1] || keyMatch[2];
      if (key) {
        ids.push(key);
      }
    }
  }

  return ids;
}

describe('Ability ID Consistency', () => {
  const abilityFiles = [
    path.resolve(process.cwd(), 'apps/vale-v2/src/data/definitions/abilities.ts'),
    path.resolve(process.cwd(), 'src/data/abilities.ts'),
  ].filter(fs.existsSync);

  it('should have ability definition files', () => {
    expect(abilityFiles.length).toBeGreaterThan(0);
  });

  abilityFiles.forEach(filePath => {
    const relativePath = path.relative(process.cwd(), filePath);
    
    describe(`File: ${relativePath}`, () => {
      it('should have all ability IDs in kebab-case', () => {
        const ids = extractAbilityIds(filePath);
        
        expect(ids.length).toBeGreaterThan(0);
        
        const invalidIds = ids.filter(id => !abilityIdRegex.test(id));
        
        if (invalidIds.length > 0) {
          console.error(`\n❌ Invalid ability IDs found in ${relativePath}:`);
          invalidIds.forEach(id => {
            const suggested = id.replace(/_/g, '-');
            console.error(`   "${id}" → "${suggested}"`);
          });
        }
        
        expect(invalidIds).toEqual([]);
      });

      it('should have ABILITIES Record keys matching ability IDs', () => {
        const content = fs.readFileSync(filePath, 'utf-8');
        
        // Extract all ability IDs from id: properties
        const idPropertyRe = /id:\s*['"]([^'"]+)['"]/g;
        const abilityIds = new Set<string>();
        let match;
        while ((match = idPropertyRe.exec(content)) !== null) {
          abilityIds.add(match[1]);
        }

        // Extract ABILITIES Record keys
        const abilitiesRecordRe = /ABILITIES[^}]*\{([^}]+)\}/s;
        const abilitiesMatch = abilitiesRecordRe.exec(content);
        
        if (abilitiesMatch && abilityIds.size > 0) {
          const recordContent = abilitiesMatch[1];
          const keyRe = /(?:['"]([^'"]+)['"]|([a-z0-9_-]+)):\s*[A-Z_]+/g;
          const recordKeys = new Set<string>();
          
          let keyMatch;
          while ((keyMatch = keyRe.exec(recordContent)) !== null) {
            const key = keyMatch[1] || keyMatch[2];
            if (key) {
              recordKeys.add(key);
            }
          }

          // Check that all ability IDs have corresponding Record keys
          const missingKeys: string[] = [];
          abilityIds.forEach(id => {
            if (!recordKeys.has(id)) {
              missingKeys.push(id);
            }
          });

          if (missingKeys.length > 0) {
            console.error(`\n❌ Missing ABILITIES Record keys for:`);
            missingKeys.forEach(id => {
              console.error(`   "${id}"`);
            });
          }

          expect(missingKeys).toEqual([]);
        }
      });
    });
  });
});

