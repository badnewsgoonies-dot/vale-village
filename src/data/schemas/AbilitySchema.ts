import { z } from 'zod';

/**
 * Zod schema for Ability validation
 * Single source of truth for ability data structure
 */

/**
 * Regex pattern for kebab-case ability IDs
 * Enforces: lowercase alphanumerics and hyphens only
 */
export const abilityIdRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const AbilitySchema = z.object({
  id: z.string().regex(abilityIdRegex, {
    message: "Ability ID must be kebab-case (lowercase alphanumerics and hyphens only)",
  }),
  name: z.string().min(1),
  type: z.enum(['physical', 'psynergy', 'healing', 'buff', 'debuff', 'summon']),
  element: z.enum(['Venus', 'Mars', 'Jupiter', 'Mercury', 'Neutral']).optional(),
  manaCost: z.number().int().min(0).max(5), // Cannot be negative! Max 5 for mana pool system
  basePower: z.number().int().min(0), // Cannot be negative!
  targets: z.enum(['single-enemy', 'all-enemies', 'single-ally', 'all-allies', 'self']),
  unlockLevel: z.number().int().min(1).max(20),
  kind: z.enum(['attack', 'psynergy']).optional(),
  description: z.string(),
  
  // Optional properties
  chainDamage: z.boolean().optional(),
  revivesFallen: z.boolean().optional(),
  buffEffect: z.object({
    atk: z.number().optional(),
    def: z.number().optional(),
    mag: z.number().optional(),
    spd: z.number().optional(),
  }).optional(),
  duration: z.number().int().min(1).optional(),
  
  // Status effect applied on hit (for physical/psynergy abilities)
  statusEffect: z.object({
    type: z.enum(['poison', 'burn', 'freeze', 'paralyze', 'stun']),
    duration: z.number().int().min(1),
    chance: z.number().min(0).max(1).optional(), // Probability of applying (0-1), defaults to 1.0
  }).optional(),

  // Debuff effects (stat reductions applied to targets)
  debuffEffect: z.object({
    atk: z.number().optional(),
    def: z.number().optional(),
    mag: z.number().optional(),
    spd: z.number().optional(),
    hp: z.number().optional(), // Max HP reduction
  }).optional(),

  // Heal over time effect
  healOverTime: z.object({
    amount: z.number().int().min(1), // HP restored per turn
    duration: z.number().int().min(1), // Number of turns
  }).optional(),

  // Multi-hit attacks
  hitCount: z.number().int().min(1).max(10).optional(), // Number of hits (2-4 typical)

  // Revive mechanics
  revive: z.boolean().optional(), // Can revive KO'd units
  reviveHPPercent: z.number().min(0).max(1).optional(), // HP% restored when reviving (0-1)

  // Phase 2: Advanced offense mechanics
  ignoreDefensePercent: z.number().min(0).max(1).optional(), // % of target DEF to ignore (default 0)
  splashDamagePercent: z.number().min(0).max(1).optional(), // % damage dealt to non-primary targets (default 0)

  // Phase 2: Shield granting
  shieldCharges: z.number().int().min(1).max(99).optional(), // Number of hit charges granted when cast

  // Phase 2: Status cleanse
  removeStatusEffects: z.union([
    z.object({ type: z.literal('all') }),
    z.object({ type: z.literal('negative') }),
    z.object({
      type: z.literal('byType'),
      statuses: z.array(z.enum(['poison', 'burn', 'freeze', 'paralyze', 'stun', 'debuff'])),
    }),
  ]).optional(),

  // Phase 2: Damage reduction granting
  damageReductionPercent: z.number().min(0).max(1).optional(), // % damage reduction granted to target(s)

  // Phase 2: Elemental resistance granting
  elementalResistance: z.object({
    element: z.enum(['Venus', 'Mars', 'Mercury', 'Jupiter']),
    modifier: z.number(), // Positive = resistance, negative = weakness
  }).optional(),

  // Phase 2: Immunity granting
  grantImmunity: z.object({
    all: z.boolean(), // If true, immune to all negative statuses
    types: z.array(z.enum(['poison', 'burn', 'freeze', 'paralyze', 'stun', 'debuff'])).optional(), // Specific immunities
    duration: z.number().int().min(1), // Duration in turns
  }).optional(),

  // AI hints (optional metadata for AI decision-making)
  aiHints: z.object({
    priority: z.number().min(0).max(3).optional(),
    target: z.enum(['weakest', 'random', 'lowestRes', 'healerFirst', 'highestDef']).optional(),
    avoidOverkill: z.boolean().optional(),
    opener: z.boolean().optional(),
  }).optional(),
});

export type Ability = z.infer<typeof AbilitySchema>;
