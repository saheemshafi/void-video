import { Router } from 'express';
import { authorize } from '../middlewares/auth.middleware';
import {
  deleteComment,
  toggleCommentLike,
  updateComment,
} from '../controllers/comment.controller';

const commentRouter = Router();

commentRouter
  .route('/:commentId/toggle-like')
  .get(authorize(), toggleCommentLike);

commentRouter
  .route('/:commentId')
  .patch(updateComment)
  .delete(authorize(), deleteComment);

export default commentRouter;
