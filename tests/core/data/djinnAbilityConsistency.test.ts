import { describe, test, expect } from 'vitest';
import { DJINN } from '@/data/definitions/djinn';
import { DJINN_ABILITIES } from '@/data/definitions/djinnAbilities';

describe('Djinn Ability ID Consistency', () => {
  test('all Djinn-granted ability IDs exist in DJINN_ABILITIES registry', () => {
    const missingAbilities: string[] = [];

    for (const [djinnId, djinn] of Object.entries(DJINN)) {
      for (const [unitId, compatibilityMap] of Object.entries(djinn.grantedAbilities)) {
        const allAbilityIds = [
          ...compatibilityMap.same,
          ...compatibilityMap.counter,
          ...compatibilityMap.neutral,
        ];

        for (const abilityId of allAbilityIds) {
          if (!DJINN_ABILITIES[abilityId]) {
            missingAbilities.push(`${djinnId}.${unitId}: ${abilityId}`);
          }
        }
      }
    }

    if (missingAbilities.length > 0) {
      // Helpful debug output if this ever fails
      // eslint-disable-next-line no-console
      console.error('Missing ability definitions:');
      for (const msg of missingAbilities) {
        // eslint-disable-next-line no-console
        console.error(`  - ${msg}`);
      }
    }

    expect(missingAbilities).toHaveLength(0);
  });

  test('DJINN_ABILITIES registry has no duplicate IDs', () => {
    const ids = Object.keys(DJINN_ABILITIES);
    const uniqueIds = new Set(ids);

    expect(ids.length).toBe(uniqueIds.size);
  });

  test('all Djinn have grantedAbilities for all 6 unit types', () => {
    const expectedUnitTypes = ['adept', 'sentinel', 'war-mage', 'mystic', 'ranger', 'stormcaller'] as const;
    const missingMappings: string[] = [];

    for (const [djinnId, djinn] of Object.entries(DJINN)) {
      for (const unitType of expectedUnitTypes) {
        if (!djinn.grantedAbilities[unitType]) {
          missingMappings.push(`${djinnId} missing ${unitType}`);
        }
      }
    }

    if (missingMappings.length > 0) {
      // eslint-disable-next-line no-console
      console.error('Missing Djinn → unitType mappings:');
      for (const msg of missingMappings) {
        // eslint-disable-next-line no-console
        console.error(`  - ${msg}`);
      }
    }

    expect(missingMappings).toHaveLength(0);
  });
});
