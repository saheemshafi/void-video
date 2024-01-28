import z from 'zod';
import { sortOptions } from '../validations/utils.validation';

export interface ValidationError {
  field: z.ZodIssue['path'][number] | undefined;
  message: string;
}

export type Models =
  | 'Video'
  | 'Playlist'
  | 'Post'
  | 'User'
  | 'Subscription'
  | 'Comment';

export type SortOptions = z.infer<typeof sortOptions>;

export type ValidateRequestResult<T extends z.ZodSchema> = z.infer<T>;
