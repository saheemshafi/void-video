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
} from '../controllers/auth.controller';
import upload from '../middlewares/multer.middleware';
import { authorize } from '../middlewares/auth.middleware';

const authRouter = Router();

authRouter.route('/create-account').post(
  upload.fields([
    {
      name: 'avatar',
      maxCount: 1,
    },
    { name: 'banner', maxCount: 1 },
  ]),
  createAccount
);
authRouter.route('/login').post(login);
authRouter.route('/session').get(authorize, getSession);
authRouter.route('/session/revalidate').get(revalidateSession);
authRouter.route('/logout').get(authorize, logout);
authRouter.route('/forget-password').post(emailPasswordResetLink);
authRouter.route('/reset-password').post(resetPassword);
authRouter
  .route('/change-avatar')
  .post(authorize, upload.single('avatar'), changeAvatar);
authRouter
  .route('/change-banner')
  .post(authorize, upload.single('banner'), changeBanner);

export default authRouter;
