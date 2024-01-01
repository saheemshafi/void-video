import { Router } from 'express';
import upload from '../middlewares/multer.middleware';
import { authorize } from '../middlewares/auth.middleware';
import {
  addCommentToPost,
  deletePost,
  getPost,
  getPostComments,
  getPosts,
  likePost,
  updatePost,
  uploadPost,
} from '../controllers/post.controller';

const postRouter = Router();

postRouter.route('/').post(authorize, upload.array('images', 4), uploadPost);
postRouter.route('/').get(getPosts);
postRouter.route('/:postId').get(getPost);
postRouter.route('/:postId/like').get(authorize, likePost);
postRouter.route('/:postId').patch(authorize, updatePost);
postRouter.route('/:postId').delete(authorize, deletePost);
postRouter.route('/:postId/comments').get(getPostComments);
postRouter.route('/:postId/comments').post(authorize, addCommentToPost);

export default postRouter;
