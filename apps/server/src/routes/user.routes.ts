import { Router } from 'express';
import {
  createAccount,
  login,
  getSession,
  logout,
  emailPasswordResetLink,
  resetPassword,
  revalidateSession,
  changeAvatar,
  changeBanner,
  getChannelProfile,
  changePassword,
  getUserWatchHistory,
  addVideoToWatchHistory,
  getSubscribedChannels,
  getLikedVideos,
} from '../controllers/user.controller';
import upload from '../middlewares/multer.middleware';
import { authorize } from '../middlewares/auth.middleware';

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
userRouter.route('/login').post(login);
userRouter.route('/session').get(authorize, getSession);
userRouter.route('/session/revalidate').get(revalidateSession);
userRouter.route('/logout').get(authorize, logout);
userRouter.route('/forget-password').post(emailPasswordResetLink);
userRouter.route('/reset-password').patch(resetPassword);
userRouter.route('/change-password').patch(authorize, changePassword);

userRouter
  .route('/change-avatar')
  .patch(authorize, upload.single('avatar'), changeAvatar);
userRouter
  .route('/change-banner')
  .patch(authorize, upload.single('banner'), changeBanner);

userRouter.route('/c/:username').get(authorize, getChannelProfile);

userRouter
  .route('/watch-history')
  .get(authorize, getUserWatchHistory)
  .post(authorize, addVideoToWatchHistory);

userRouter.route('/channels-subscribed').get(authorize, getSubscribedChannels);
userRouter.route('/liked-videos').get(authorize, getLikedVideos);

export default userRouter;
