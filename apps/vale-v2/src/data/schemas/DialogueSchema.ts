import { z } from 'zod';

export const DialogueConditionSchema = z.object({
  type: z.enum(['flag', 'item', 'level', 'gold']),
  key: z.string(),
  operator: z.enum(['equals', 'greaterThan', 'lessThan']).optional(),
  value: z.union([z.string(), z.number(), z.boolean()]),
});

export const DialogueChoiceSchema = z.object({
  id: z.string(),
  text: z.string(),
  nextNodeId: z.string(),
  condition: DialogueConditionSchema.optional(),
  effects: z.record(z.unknown()).optional(),
});

export const DialogueNodeSchema = z.object({
  id: z.string(),
  speaker: z.string().optional(),
  text: z.string(),
  portrait: z.string().optional(),
  choices: z.array(DialogueChoiceSchema).optional(),
  nextNodeId: z.string().optional(),
  condition: DialogueConditionSchema.optional(),
  effects: z.record(z.unknown()).optional(),
});

export const DialogueTreeSchema = z.object({
  id: z.string(),
  name: z.string(),
  startNodeId: z.string(),
  nodes: z.array(DialogueNodeSchema),
});

export type DialogueCondition = z.infer<typeof DialogueConditionSchema>;
export type DialogueChoice = z.infer<typeof DialogueChoiceSchema>;
export type DialogueNode = z.infer<typeof DialogueNodeSchema>;
export type DialogueTree = z.infer<typeof DialogueTreeSchema>;
