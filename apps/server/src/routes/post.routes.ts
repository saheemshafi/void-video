import { Router } from 'express';
import upload from '../middlewares/multer.middleware';
import { authorize } from '../middlewares/auth.middleware';
import {
  deletePost,
  getPost,
  getPostComments,
  likePost,
  updatePost,
  uploadPost,
} from '../controllers/post.controller';

const postRouter = Router();

postRouter.route('/').post(authorize, upload.array('images', 4), uploadPost);
postRouter.route('/:postId').get(getPost);
postRouter.route('/:postId/like').get(authorize, likePost);
postRouter.route('/:postId/comments').get(getPostComments);
postRouter.route('/:postId').put(authorize, updatePost);
postRouter.route('/:postId').delete(authorize, deletePost);

export default postRouter;
