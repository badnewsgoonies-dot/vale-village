/**
 * Runtime Type Guards Tests
 * Verifies type guards correctly validate data at system boundaries
 */

import { describe, test, expect } from 'vitest';
import {
  validateBattleState,
  validateTeam,
  validateUnit,
  isString,
  isNonEmptyString,
  isNumber,
  isPositiveInteger,
  isNonNegativeInteger,
  isArray,
  isNonEmptyArray,
  isObject,
  hasProperty,
  hasProperties,
  getProperty,
  formatValidationErrors,
} from '@/core/validation/typeGuards';
import { mkBattle, mkTeam, mkUnit, mkEnemy } from '@/test/factories';

describe('Type Guards - Battle State', () => {
  test('validates valid battle state', () => {
    const state = mkBattle({});

    // Convert to plain object (simulate external data)
    const plain = JSON.parse(JSON.stringify(state));

    const result = validateBattleState(plain);

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.phase).toBe('planning');
      expect(result.value.unitById).toBeDefined();
    }
  });

  test('rejects invalid battle state', () => {
    const invalidData = {
      phase: 'invalid-phase',
      // missing required fields
    };

    const result = validateBattleState(invalidData);

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.length).toBeGreaterThan(0);
    }
  });

  test('rejects battle state with mana exceeding max', () => {
    const state = mkBattle({});
    const plain = JSON.parse(JSON.stringify(state));

    plain.remainingMana = plain.maxMana + 10;

    const result = validateBattleState(plain);

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.some(e => e.path.includes('remainingMana'))).toBe(true);
    }
  });

  test('reconstructs unitById index', () => {
    const state = mkBattle({});
    const plain = JSON.parse(JSON.stringify(state));

    const result = validateBattleState(plain);

    expect(result.ok).toBe(true);
    if (result.ok) {
      // Check index was rebuilt
      expect(result.value.unitById.size).toBe(
        state.playerTeam.units.length + state.enemies.length
      );

      // Check players are marked correctly
      for (const unit of result.value.playerTeam.units) {
        const indexed = result.value.unitById.get(unit.id);
        expect(indexed?.isPlayer).toBe(true);
      }

      // Check enemies are marked correctly
      for (const unit of result.value.enemies) {
        const indexed = result.value.unitById.get(unit.id);
        expect(indexed?.isPlayer).toBe(false);
      }
    }
  });
});

describe('Type Guards - Team', () => {
  test('validates valid team', () => {
    const team = mkTeam([mkUnit({ id: 'u1' })]);
    const plain = JSON.parse(JSON.stringify(team));

    const result = validateTeam(plain);

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.units.length).toBe(team.units.length);
    }
  });

  test('rejects invalid team', () => {
    const invalidData = {
      units: 'not-an-array',
    };

    const result = validateTeam(invalidData);

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.length).toBeGreaterThan(0);
    }
  });
});

describe('Type Guards - Unit', () => {
  test('validates valid unit', () => {
    const unit = mkUnit({ id: 'u1' });
    const plain = JSON.parse(JSON.stringify(unit));

    const result = validateUnit(plain);

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.id).toBe('u1');
    }
  });

  test('rejects invalid unit', () => {
    const invalidData = {
      id: 123, // Should be string
    };

    const result = validateUnit(invalidData);

    expect(result.ok).toBe(false);
  });
});

describe('Type Guards - Primitives', () => {
  test('isString validates strings', () => {
    expect(isString('hello')).toBe(true);
    expect(isString('')).toBe(true);
    expect(isString(123)).toBe(false);
    expect(isString(null)).toBe(false);
    expect(isString(undefined)).toBe(false);
  });

  test('isNonEmptyString validates non-empty strings', () => {
    expect(isNonEmptyString('hello')).toBe(true);
    expect(isNonEmptyString('')).toBe(false);
    expect(isNonEmptyString(123)).toBe(false);
  });

  test('isNumber validates numbers', () => {
    expect(isNumber(123)).toBe(true);
    expect(isNumber(0)).toBe(true);
    expect(isNumber(-5)).toBe(true);
    expect(isNumber(3.14)).toBe(true);
    expect(isNumber(NaN)).toBe(false);
    expect(isNumber('123')).toBe(false);
  });

  test('isPositiveInteger validates positive integers', () => {
    expect(isPositiveInteger(1)).toBe(true);
    expect(isPositiveInteger(100)).toBe(true);
    expect(isPositiveInteger(0)).toBe(false);
    expect(isPositiveInteger(-5)).toBe(false);
    expect(isPositiveInteger(3.14)).toBe(false);
    expect(isPositiveInteger('5')).toBe(false);
  });

  test('isNonNegativeInteger validates non-negative integers', () => {
    expect(isNonNegativeInteger(0)).toBe(true);
    expect(isNonNegativeInteger(1)).toBe(true);
    expect(isNonNegativeInteger(100)).toBe(true);
    expect(isNonNegativeInteger(-5)).toBe(false);
    expect(isNonNegativeInteger(3.14)).toBe(false);
  });
});

describe('Type Guards - Collections', () => {
  test('isArray validates arrays', () => {
    expect(isArray([])).toBe(true);
    expect(isArray([1, 2, 3])).toBe(true);
    expect(isArray('not array')).toBe(false);
    expect(isArray({})).toBe(false);
  });

  test('isNonEmptyArray validates non-empty arrays', () => {
    expect(isNonEmptyArray([1])).toBe(true);
    expect(isNonEmptyArray([1, 2, 3])).toBe(true);
    expect(isNonEmptyArray([])).toBe(false);
    expect(isNonEmptyArray('not array')).toBe(false);
  });

  test('isObject validates objects', () => {
    expect(isObject({})).toBe(true);
    expect(isObject({ a: 1 })).toBe(true);
    expect(isObject([])).toBe(false);
    expect(isObject(null)).toBe(false);
    expect(isObject('string')).toBe(false);
  });

  test('hasProperty validates property existence', () => {
    const obj = { name: 'test', age: 25 };

    expect(hasProperty(obj, 'name')).toBe(true);
    expect(hasProperty(obj, 'age')).toBe(true);
    expect(hasProperty(obj, 'missing')).toBe(false);
    expect(hasProperty(null, 'name')).toBe(false);
    expect(hasProperty('string', 'length')).toBe(false); // Primitives fail isObject check
  });

  test('hasProperties validates multiple properties', () => {
    const obj = { name: 'test', age: 25, active: true };

    expect(hasProperties(obj, ['name', 'age'])).toBe(true);
    expect(hasProperties(obj, ['name', 'age', 'active'])).toBe(true);
    expect(hasProperties(obj, ['name', 'missing'])).toBe(false);
    expect(hasProperties(null, ['name'])).toBe(false);
  });
});

describe('Type Guards - Property Access', () => {
  test('getProperty safely accesses nested properties', () => {
    const obj = {
      user: {
        profile: {
          name: 'Alice',
          age: 30,
        },
      },
    };

    const result = getProperty(obj, ['user', 'profile', 'name'], isString);

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value).toBe('Alice');
    }
  });

  test('getProperty fails on missing property', () => {
    const obj = {
      user: {},
    };

    const result = getProperty(obj, ['user', 'profile', 'name'], isString);

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error).toContain('not found');
    }
  });

  test('getProperty fails on type mismatch', () => {
    const obj = {
      user: {
        age: 30,
      },
    };

    const result = getProperty(obj, ['user', 'age'], isString); // age is number

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error).toContain('invalid type');
    }
  });
});

describe('Type Guards - Error Formatting', () => {
  test('formatValidationErrors formats errors nicely', () => {
    const errors = [
      { path: ['user', 'name'], message: 'Required' },
      { path: ['user', 'age'], message: 'Must be positive' },
      { path: [], message: 'Invalid root' },
    ];

    const formatted = formatValidationErrors(errors);

    expect(formatted).toContain('user.name: Required');
    expect(formatted).toContain('user.age: Must be positive');
    expect(formatted).toContain('Invalid root');
  });
});

describe('Type Guards - Integration', () => {
  test('validates complex external data (round-trip)', () => {
    // Create a valid battle state
    const state = mkBattle({
      party: [
        mkUnit({ id: 'u1', level: 5 }),
        mkUnit({ id: 'u2', level: 5 }),
        mkUnit({ id: 'u3', level: 5 }),
        mkUnit({ id: 'u4', level: 5 }),
      ],
      enemies: [mkEnemy('slime', { id: 'e1' })],
    });

    // Simulate serialization/deserialization (external data)
    const serialized = JSON.parse(JSON.stringify(state));

    // Validate it
    const result = validateBattleState(serialized);

    if (!result.ok) {
      // Log errors for debugging
      console.warn('Validation errors:', formatValidationErrors(result.error));
    }

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.playerTeam.units.length).toBe(state.playerTeam.units.length);
      expect(result.value.enemies.length).toBeGreaterThan(0);
      expect(result.value.phase).toBe('planning');
      // Verify unitById was reconstructed
      expect(result.value.unitById.size).toBeGreaterThan(0);
    }
  });
});
