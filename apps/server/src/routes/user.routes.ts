import { Router } from 'express';
import {
  addVideoToWatchHistory,
  changeAvatar,
  changeBanner,
  changePassword,
  createAccount,
  emailPasswordResetLink,
  getChannelProfile,
  getLikedVideos,
  getSession,
  getSubscribedChannels,
  getUserWatchHistory,
  login,
  logout,
  resetPassword,
  revalidateSession,
} from '../controllers/user.controller';
import { authorize } from '../middlewares/auth.middleware';
import upload from '../middlewares/multer.middleware';
import { rateLimiter } from '../middlewares/rate-limiter';
import { RateLimitRule } from '../utils/rate-limit-rule';
import { RATE_LIMITS_TIME } from '../constants';

const userRouter = Router();

userRouter.route('/create-account').post(
  upload.fields([
    {
      name: 'avatar',
      maxCount: 1,
    },
    { name: 'banner', maxCount: 1 },
  ]),
  createAccount
);
userRouter
  .route('/login')
  .post(
    rateLimiter(
      new RateLimitRule(
        RATE_LIMITS_TIME.FIVE_MINUTES,
        20,
        'You are doing unusual attempts, Have you forgot your password?'
      )
    ),
    login
  );
userRouter.route('/session').get(authorize(), getSession);
userRouter.route('/session/revalidate').get(revalidateSession);
userRouter.route('/logout').get(authorize(), logout);
userRouter
  .route('/forget-password')
  .post(
    rateLimiter(
      new RateLimitRule(
        RATE_LIMITS_TIME.TEN_MINUTES,
        5,
        'You can only generate another link in 10 minutes'
      )
    ),
    emailPasswordResetLink
  );
userRouter.route('/reset-password').patch(resetPassword);
userRouter.route('/change-password').patch(authorize(), changePassword);

userRouter
  .route('/change-avatar')
  .patch(
    rateLimiter(
      new RateLimitRule(
        RATE_LIMITS_TIME.FIFTEEN_DAYS,
        1,
        'Avatar can be only changed once per 15 days'
      )
    ),
    authorize(),
    upload.single('avatar'),
    changeAvatar
  );

userRouter
  .route('/change-banner')
  .patch(
    rateLimiter(
      new RateLimitRule(
        RATE_LIMITS_TIME.FIFTEEN_DAYS,
        1,
        'Banner can be only changed once per 15 days'
      )
    ),
    authorize(),
    upload.single('banner'),
    changeBanner
  );

userRouter.route('/c/:username').get(getChannelProfile);

userRouter
  .route('/watch-history')
  .get(authorize(), getUserWatchHistory)
  .post(authorize(), addVideoToWatchHistory);

userRouter
  .route('/channels-subscribed')
  .get(authorize(), getSubscribedChannels);
userRouter.route('/liked-videos').get(authorize(), getLikedVideos);

export default userRouter;
