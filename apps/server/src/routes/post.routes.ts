import { Router } from 'express';
import upload from '../middlewares/multer.middleware';
import { authorize } from '../middlewares/auth.middleware';
import {
  addCommentToPost,
  changePostImages,
  deletePost,
  getPost,
  getPostComments,
  getPosts,
  togglePostLike,
  updatePost,
  uploadPost,
} from '../controllers/post.controller';

const postRouter = Router();

postRouter
  .route('/')
  .post(authorize(), upload.array('images', 4), uploadPost)
  .get(getPosts);

postRouter
  .route('/:postId')
  .get(getPost)
  .patch(authorize(), updatePost)
  .delete(authorize(), deletePost);

postRouter.route('/:postId/toggle-like').get(authorize(), togglePostLike);

postRouter
  .route('/:postId/comments')
  .get(getPostComments)
  .post(authorize(), addCommentToPost);

postRouter
  .route('/:postId/change-images')
  .patch(authorize(), upload.array('images', 4), changePostImages);

export default postRouter;
