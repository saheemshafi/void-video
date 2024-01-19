import { ApiResponse } from './api-response';
import { Session } from './session';
import { Video } from './video';

export type User = Omit<Session, 'watchHistory'>;

export type Subscription = User & { totalSubscribers: number };

export type SubscriptionsResponse = ApiResponse<Array<Subscription>>;

export type WatchHistoryResponse = ApiResponse<Array<Video>>;
