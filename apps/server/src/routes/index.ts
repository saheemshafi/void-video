import { Router } from 'express';
import userRouter from './user.routes';
import postRouter from './post.routes';
import videoRouter from './video.routes';
import subscriptionRouter from './subscription.routes';
import playlistRouter from './playlist.routes';
import commentRouter from './comment.routes';

const router = Router();
router.get('/', (_, res) => {
  res.send('Api is ready to serve requests.');
});

router.use('/users', userRouter);
router.use('/videos', videoRouter);
router.use('/posts', postRouter);
router.use('/subscriptions', subscriptionRouter);
router.use('/playlists', playlistRouter);
router.use('/comments', commentRouter);

export default router;
