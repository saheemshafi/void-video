import { User } from './user.interface';
import { AddFields } from './utils.interface';

export interface Subscription
  extends AddFields<
    User,
    {
      totalSubscribers: number;
    }
  > {}
