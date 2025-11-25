// validations/board.ts
import { z } from 'zod';

export const createBoardSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
});

export const updateBoardSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
});
