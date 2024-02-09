import { Router } from 'express';
import { authorize } from '../middlewares/auth.middleware';
import {
  deleteComment,
  replyToComment,
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

commentRouter.route('/:commentId/reply').post(authorize(), replyToComment);

export default commentRouter;
