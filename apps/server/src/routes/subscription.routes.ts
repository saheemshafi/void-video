import { Router } from 'express';
import { authorize } from '../middlewares/auth.middleware';
import {
  createSubscription,
  removeSubscription,
} from '../controllers/subscription.controller';

const subscriptionRouter = Router();

subscriptionRouter
  .route('/channels/:channelId')
  .post(authorize, createSubscription)
  .delete(removeSubscription);

export default subscriptionRouter;
