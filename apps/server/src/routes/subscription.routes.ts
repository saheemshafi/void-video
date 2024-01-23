import { Router } from 'express';
import { authorize } from '../middlewares/auth.middleware';
import {
  getSubscriptionStatus,
  toggleSubscription,
} from '../controllers/subscription.controller';

const subscriptionRouter = Router();

subscriptionRouter.use(authorize());

subscriptionRouter.route('/channels/:channelId').get(toggleSubscription);
subscriptionRouter
  .route('/channels/:channelId/status')
  .get(getSubscriptionStatus);

export default subscriptionRouter;
