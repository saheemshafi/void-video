import { Router } from 'express';
import { authorize } from '../middlewares/auth.middleware';
import {
  createSubscription,
  removeSubscription,
} from '../controllers/subscription.controller';

const subscriptionRouter = Router();

subscriptionRouter.route('/').post(authorize, createSubscription);
subscriptionRouter.route('/').delete(authorize, removeSubscription);

export default subscriptionRouter;
