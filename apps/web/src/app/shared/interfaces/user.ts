import { ApiResponse } from './api-response';
import { Session } from './session';

export type User = Omit<Session, 'watchHistory'>;

export type SubscriptionsResponse = ApiResponse<
  Array<User & { totalSubscribers: number }>
>;
