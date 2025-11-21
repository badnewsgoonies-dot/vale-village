import { z } from 'zod';

export const DialogueConditionSchema = z.object({
  type: z.enum(['flag', 'item', 'level', 'gold']),
  key: z.string(),
  operator: z.enum(['equals', 'greaterThan', 'lessThan']).optional(),
  value: z.union([z.string(), z.number(), z.boolean()]),
});

// Typed dialogue effects
// - Known keys are explicitly modeled (startBattle, recruitUnit, grantDjinn, etc.)
// - Additional boolean keys are allowed for story flags (e.g. first_djinn_intro_completed)
export const DialogueEffectsSchema = z
  .object({
    startBattle: z.string().optional(),
    recruitUnit: z.string().optional(),
    grantDjinn: z.string().optional(),
    questAccepted: z.boolean().optional(),
    openShop: z.boolean().optional(),
  })
  .passthrough();

export const DialogueChoiceSchema = z.object({
  id: z.string(),
  text: z.string(),
  nextNodeId: z.string(),
  condition: DialogueConditionSchema.optional(),
  effects: DialogueEffectsSchema.optional(),
});

export const DialogueNodeSchema = z.object({
  id: z.string(),
  speaker: z.string().optional(),
  text: z.string(),
  portrait: z.string().optional(),
  choices: z.array(DialogueChoiceSchema).optional(),
  nextNodeId: z.string().optional(),
  condition: DialogueConditionSchema.optional(),
  effects: DialogueEffectsSchema.optional(),
});

export const DialogueTreeSchema = z.object({
  id: z.string(),
  name: z.string(),
  startNodeId: z.string(),
  nodes: z.array(DialogueNodeSchema),
});

export type DialogueCondition = z.infer<typeof DialogueConditionSchema>;
export type DialogueEffects = z.infer<typeof DialogueEffectsSchema>;
export type DialogueChoice = z.infer<typeof DialogueChoiceSchema>;
export type DialogueNode = z.infer<typeof DialogueNodeSchema>;
export type DialogueTree = z.infer<typeof DialogueTreeSchema>;
