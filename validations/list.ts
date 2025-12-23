// validations/list.ts

import { z } from 'zod';

export const createListSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  position: z.number().int().nonnegative().optional(),
  color: z.string().optional(),
});

export const updateListSchema = z.object({
  title: z.string().optional(),
  position: z.number().int().nonnegative().optional(),
  color: z.string().optional(),
});
