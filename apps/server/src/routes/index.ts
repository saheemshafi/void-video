import { Router } from 'express';
import authRouter from './auth.routes';
import postRouter from './post.routes';
import videoRouter from './video.routes';
import userRouter from './user.routes';

const router = Router();
router.get('/', (_, res) => {
  res.send('Api is ready to serve requests.');
});

router.use('/auth', authRouter);
router.use('/users', userRouter);
router.use('/videos', videoRouter);
router.use('/posts', postRouter);

export default router;
