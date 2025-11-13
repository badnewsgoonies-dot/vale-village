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
  difficulty: 'easy',
  reward: {
    xp: 60,
    gold: 10,
    equipment: {
      type: 'fixed',
      itemId: 'wooden-sword',
    },
  },
};

export const C1_NORMAL_2_WOLF: Encounter = {
  id: 'c1_normal_2',
  name: 'Pack of Wolves',
  enemies: ['wolf', 'wolf'],
  difficulty: 'easy',
  reward: {
    xp: 60,
    gold: 16,
    equipment: {
      type: 'fixed',
      itemId: 'leather-vest',
    },
  },
};

export const C1_NORMAL_3_BANDIT: Encounter = {
  id: 'c1_normal_3',
  name: 'Bandit Ambush',
  enemies: ['bandit', 'bandit'],
  difficulty: 'easy',
  reward: {
    xp: 80,
    gold: 24,
    equipment: {
      type: 'fixed',
      itemId: 'iron-sword',
    },
  },
};

export const C1_MINI_BOSS_GLADIATOR: Encounter = {
  id: 'c1_mini_boss',
  name: 'Gladiator Champion',
  enemies: ['gladiator'],
  rules: {
    fleeDisabled: true,
  },
  difficulty: 'hard',
  reward: {
    xp: 150,
    gold: 30,
    equipment: {
      type: 'choice',
      options: ['steel-sword', 'steel-armor', 'steel-helm'],
    },
  },
};

export const C1_BOSS_ELEMENTAL_GUARDIAN: Encounter = {
  id: 'c1_boss',
  name: 'Elemental Guardian',
  enemies: ['elemental_guardian', 'guardian_shard_fire', 'guardian_shard_water'],
  difficulty: 'boss',
  rules: {
    phaseChange: {
      hpPct: 0.5, // At 50% HP
      addAbility: 'elemental_overload', // TODO: Add this ability later
    },
    fleeDisabled: true,
  },
  reward: {
    xp: 300,
    gold: 150,
    equipment: {
      type: 'choice',
      options: ['gaia-blade', 'dragon-scales', 'oracles-crown'],
    },
    unlockUnit: 'stormcaller',
  },
};

export const TRAINING_DUMMY: Encounter = {
  id: 'training_dummy',
  name: 'Training Arena',
  enemies: ['slime'],
  difficulty: 'easy',
  reward: {
    xp: 10,
    gold: 0,
    equipment: {
      type: 'none',
    },
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
  training_dummy: TRAINING_DUMMY,
};
