import { ApiResponse } from './api-response';
import { Session } from './session';

export type User = Omit<Session, 'watchHistory'>;

export type Subscription = User & { totalSubscribers: number };

export type SubscriptionsResponse = ApiResponse<Array<Subscription>>;
