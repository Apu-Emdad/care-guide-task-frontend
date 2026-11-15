import { z } from 'zod';

/** Same rules as the API's CreatePostDto and UpdatePostDto. */
export const postSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, 'Title is required')
    .max(200, 'Title must be at most 200 characters'),
  content: z
    .string()
    .trim()
    .min(1, 'Content is required')
    .max(10000, 'Content must be at most 10000 characters'),
});

export type PostValues = z.infer<typeof postSchema>;
