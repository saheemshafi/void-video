import { Router } from 'express';
import { getUserVideos, getUserPosts } from '../controllers/user.controller';

const userRouter = Router();

userRouter.route('/:userId/videos').get(getUserVideos);
userRouter.route('/:userId/posts').get(getUserPosts);

export default userRouter;
