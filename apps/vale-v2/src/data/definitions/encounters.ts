/**
 * Encounter definitions
 * These will be validated against EncounterSchema at startup
 * 
 * Golden Path (Chapter 1): 5 encounters
 * - 3 normal fights (Slime, Wolf, Bandit)
 * - 1 mini-boss (Gladiator)
 * - 1 boss (Elemental Guardian)
 */
import type { Encounter } from '../schemas/EncounterSchema';

// ============================================================================
// Chapter 1 Encounters (5)
// ============================================================================

export const C1_NORMAL_1_SLIME: Encounter = {
  id: 'c1_normal_1',
  name: 'Wild Slimes',
  enemies: ['slime', 'slime'],
  reward: {
    gold: 10,
  },
};

export const C1_NORMAL_2_WOLF: Encounter = {
  id: 'c1_normal_2',
  name: 'Pack of Wolves',
  enemies: ['wolf', 'wolf'],
  reward: {
    gold: 16,
  },
};

export const C1_NORMAL_3_BANDIT: Encounter = {
  id: 'c1_normal_3',
  name: 'Bandit Ambush',
  enemies: ['bandit', 'bandit'],
  reward: {
    gold: 24,
  },
};

export const C1_MINI_BOSS_GLADIATOR: Encounter = {
  id: 'c1_mini_boss',
  name: 'Gladiator Champion',
  enemies: ['gladiator'],
  rules: {
    fleeDisabled: true,
  },
  reward: {
    gold: 30,
  },
};

export const C1_BOSS_ELEMENTAL_GUARDIAN: Encounter = {
  id: 'c1_boss',
  name: 'Elemental Guardian',
  enemies: ['elemental_guardian', 'guardian_shard_fire', 'guardian_shard_water'],
  rules: {
    phaseChange: {
      hpPct: 0.5, // At 50% HP
      addAbility: 'elemental_overload', // TODO: Add this ability later
    },
    fleeDisabled: true,
  },
  reward: {
    gold: 150,
    unlockUnit: 'stormcaller',
  },
};

// ============================================================================
// Export all encounters
// ============================================================================

export const ENCOUNTERS: Record<string, Encounter> = {
  c1_normal_1: C1_NORMAL_1_SLIME,
  c1_normal_2: C1_NORMAL_2_WOLF,
  c1_normal_3: C1_NORMAL_3_BANDIT,
  c1_mini_boss: C1_MINI_BOSS_GLADIATOR,
  c1_boss: C1_BOSS_ELEMENTAL_GUARDIAN,
};

