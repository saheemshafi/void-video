import z from 'zod';
import {
  ValidationError,
  ValidateRequestResult,
} from '../types/validation.types';
import { Request } from 'express';
import ApiError from './api-error';
import { STATUS_CODES } from '../constants';
import { IComment } from '../models/comment.model';

export const formatZodIssue = (error: z.ZodIssue): ValidationError => {
  return {
    field: error.path[1] || error.path[0],
    message: error.message,
  };
};

type Validator<T extends z.ZodRawShape> =
  | z.ZodObject<T>
  | z.ZodEffects<z.ZodObject<T>>;

export const validateRequest = <T extends z.ZodRawShape>(
  req: Request,
  validator: Validator<T>
): ValidateRequestResult<z.ZodObject<T>> => {
  const parsedRequest = validator.safeParse(req);

  if (parsedRequest.success) {
    return parsedRequest.data;
  }

  throw new ApiError(
    STATUS_CODES.BAD_REQUEST,
    'Failed to validate request.',
    parsedRequest.error.errors?.map((error) => formatZodIssue(error))
  );
};

type Comment = IComment & { replies: Comment[] };

export function buildCommentTree(comments: Comment[]) {
  const commentMap = new Map();
  const rootComments: Comment[] = [];

  comments.forEach((commentData) => {
    const comment = { ...commentData, replies: [] };
    commentMap.set(comment._id.toString(), comment);
    if (!comment.inReplyTo) {
      rootComments.push(comment);
    }
  });

  comments.forEach((commentData) => {
    const { _id, inReplyTo } = commentData;
    if (inReplyTo) {
      const parentComment = commentMap.get(inReplyTo.toString());
      if (parentComment) {
        const comment = commentMap.get(_id.toString());
        if (comment) {
          parentComment.replies.push(comment);
        }
      }
    }
  });

  return rootComments;
}
