import z from 'zod';
import { videoSortOptions } from '../validations/video.validation';

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

export type VideoSortOptions = z.infer<typeof videoSortOptions>;

export type ValidateRequestResult<T extends z.ZodSchema> = z.infer<T>;
