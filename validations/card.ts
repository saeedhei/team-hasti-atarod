// validations/card.ts
import { z } from 'zod';

export const createCardSchema = z.object({
  title: z.string().min(1, 'Title is required'),

  position: z.number().int().nonnegative().optional(),

  description: z.string().optional(),
  priority: z.enum(['low', 'medium', 'high']).optional(),

  tags: z
    .array(
      z.object({
        id: z.string(),
        label: z.string(),
      }),
    )
    .optional(),

  progress: z.number().min(0).max(100).optional(),

  assignee: z
    .object({
      id: z.string(),
      name: z.string(),
      initials: z.string().optional(),
    })
    .optional(),
});

export const updateCardSchema = z.object({
  title: z.string().optional(),
  position: z.number().int().nonnegative().optional(),
  description: z.string().optional(),
  priority: z.enum(['low', 'medium', 'high']).optional(),

  tags: z
    .array(
      z.object({
        id: z.string(),
        label: z.string(),
      }),
    )
    .optional(),

  progress: z.number().min(0).max(100).optional(),

  assignee: z
    .object({
      id: z.string(),
      name: z.string(),
      initials: z.string().optional(),
    })
    .optional(),
});
