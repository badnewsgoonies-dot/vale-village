import { describe, it, expect } from 'vitest';
import {
  calculateDjinnStatBonuses,
  getDjinnGrantedAbilities,
  getDjinnImpactOnUnit,
  getCounterElement,
} from '../../src/utils/djinnCalculations';
import { FLINT, FORGE, FIZZ, BREEZE } from '../../src/data/djinn';
import { Unit } from '../../src/types/Unit';
import { UNIT_DEFINITIONS } from '../../src/data/unitDefinitions';

describe('Djinn Calculations', () => {
  // Create test units
  const isaac = new Unit(UNIT_DEFINITIONS.isaac); // Venus
  const garet = new Unit(UNIT_DEFINITIONS.garet); // Mars
  const ivan = new Unit(UNIT_DEFINITIONS.ivan);   // Jupiter
  const mia = new Unit(UNIT_DEFINITIONS.mia);     // Mercury

  describe('calculateDjinnStatBonuses', () => {
    it('grants correct bonuses for matching element', () => {
      // Isaac (Venus) + Flint (Venus) = matching
      const bonuses = calculateDjinnStatBonuses(isaac, [FLINT]);
      expect(bonuses.atk).toBe(5);  // +5 ATK per matching Djinn
      expect(bonuses.def).toBe(3);  // +3 DEF per matching Djinn
    });

    it('applies penalties for counter element', () => {
      // Isaac (Venus) + Forge (Mars) = counter
      const bonuses = calculateDjinnStatBonuses(isaac, [FORGE]);
      expect(bonuses.atk).toBe(-3);  // -3 ATK per counter Djinn
      expect(bonuses.def).toBe(-2);  // -2 DEF per counter Djinn
    });

    it('grants small bonus for neutral element', () => {
      // Isaac (Venus) + Fizz (Mercury) = neutral
      const bonuses = calculateDjinnStatBonuses(isaac, [FIZZ]);
      expect(bonuses.atk).toBe(2);  // +2 ATK per neutral Djinn
      expect(bonuses.def).toBe(1);  // +1 DEF per neutral Djinn
    });

    it('stacks bonuses linearly with multiple Djinn', () => {
      // Isaac (Venus) + 2 Venus Djinn + 1 Mars Djinn
      const bonuses = calculateDjinnStatBonuses(isaac, [FLINT, FORGE]);
      expect(bonuses.atk).toBe(2);  // +5 (Flint) -3 (Forge) = +2
      expect(bonuses.def).toBe(1);  // +3 (Flint) -2 (Forge) = +1
    });

    it('calculates correctly for 3 matching Djinn', () => {
      // Garet (Mars) + 3 Venus Djinn (all counter)
      const bonuses = calculateDjinnStatBonuses(garet, [FLINT, FLINT, FLINT]);
      expect(bonuses.atk).toBe(-9);  // -3 × 3 = -9
      expect(bonuses.def).toBe(-6);  // -2 × 3 = -6
    });
  });

  describe('getDjinnGrantedAbilities', () => {
    it('grants matching ability for same element', () => {
      // Isaac (Venus) + Flint (Venus)
      const abilities = getDjinnGrantedAbilities(isaac, [FLINT]);
      expect(abilities).toEqual(['earthquake']); // Flint's matching ability
    });

    it('grants counter ability for counter element', () => {
      // Garet (Mars) + Flint (Venus counter)
      const abilities = getDjinnGrantedAbilities(garet, [FLINT]);
      expect(abilities).toEqual(['magma-surge']); // Flint's counter ability
    });

    it('grants no abilities for neutral element', () => {
      // Ivan (Jupiter) + Flint (Venus neutral)
      const abilities = getDjinnGrantedAbilities(ivan, [FLINT]);
      expect(abilities).toEqual([]);
    });

    it('grants multiple abilities from multiple Djinn', () => {
      // Isaac (Venus) + Flint (Venus) + Fizz (Mercury neutral)
      const abilities = getDjinnGrantedAbilities(isaac, [FLINT, FIZZ]);
      expect(abilities).toEqual(['earthquake']); // Only Flint grants ability
    });

    it('grants both matching and counter abilities', () => {
      // Isaac (Venus) + Flint (matching) + Forge (counter to Venus)
      const abilities = getDjinnGrantedAbilities(isaac, [FLINT, FORGE]);
      expect(abilities).toContain('earthquake');   // Flint matching
      expect(abilities).toContain('gaia-shield'); // Forge counter
      expect(abilities.length).toBe(2);
    });
  });

  describe('getDjinnImpactOnUnit', () => {
    it('returns correct impact details for matching Djinn', () => {
      const impacts = getDjinnImpactOnUnit(isaac, [FLINT]);
      expect(impacts).toHaveLength(1);
      expect(impacts[0].relationship).toBe('matching');
      expect(impacts[0].atkBonus).toBe(5);
      expect(impacts[0].defBonus).toBe(3);
      expect(impacts[0].grantedAbility).toBe('earthquake');
    });

    it('returns correct impact details for counter Djinn', () => {
      const impacts = getDjinnImpactOnUnit(garet, [FLINT]);
      expect(impacts).toHaveLength(1);
      expect(impacts[0].relationship).toBe('counter');
      expect(impacts[0].atkBonus).toBe(-3);
      expect(impacts[0].defBonus).toBe(-2);
      expect(impacts[0].grantedAbility).toBe('magma-surge');
    });

    it('returns correct impact details for neutral Djinn', () => {
      const impacts = getDjinnImpactOnUnit(ivan, [FLINT]);
      expect(impacts).toHaveLength(1);
      expect(impacts[0].relationship).toBe('neutral');
      expect(impacts[0].atkBonus).toBe(2);
      expect(impacts[0].defBonus).toBe(1);
      expect(impacts[0].grantedAbility).toBeNull();
    });
  });

  describe('getCounterElement', () => {
    it('returns correct counter elements', () => {
      expect(getCounterElement('Venus')).toBe('Mars');
      expect(getCounterElement('Mars')).toBe('Venus');
      expect(getCounterElement('Mercury')).toBe('Jupiter');
      expect(getCounterElement('Jupiter')).toBe('Mercury');
    });

    it('returns undefined for Neutral', () => {
      expect(getCounterElement('Neutral')).toBeUndefined();
    });
  });
});
