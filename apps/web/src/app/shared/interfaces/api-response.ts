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

export type VideoResponse = ApiResponse<Video>;

export type VideosResponse = ApiResponse<Paginated<Array<Video>, 'videos'>>;
