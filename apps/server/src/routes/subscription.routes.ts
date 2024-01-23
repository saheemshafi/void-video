import { Router } from 'express';
import { authorize } from '../middlewares/auth.middleware';
import { toggleSubscription } from '../controllers/subscription.controller';

const subscriptionRouter = Router();

subscriptionRouter.use(authorize());

subscriptionRouter.route('/channels/:channelId').get(toggleSubscription);

export default subscriptionRouter;
