import { Paginated } from './paginated';
import { Session } from './session';
import { Video } from './video';

export interface ApiResponse<T> {
  success: true;
  data: T;
  message: string;
  status: 200 | 201;
}

export type User = Omit<Session, 'watchHistory'>;

export type Subscription = User & { totalSubscribers: number };

export type SubscriptionsResponse = ApiResponse<Array<Subscription>>;

export type WatchHistoryResponse = ApiResponse<Array<Video>>;

export type SubscriptionStatusResponse = ApiResponse<{ isSubscribed: boolean }>;

export type VideoWithSubscriptionInfo = Video & {
  owner: Subscription & { isSubscribed: boolean };
};

export type VideoResponse = ApiResponse<VideoWithSubscriptionInfo>;

export type VideosResponse = ApiResponse<Paginated<Array<Video>, 'videos'>>;

export type AutocompleteResponse = ApiResponse<string[]>;
