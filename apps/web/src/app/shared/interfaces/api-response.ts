import { Playlist } from '~shared/interfaces/playlist';
import { Session } from '~shared/interfaces/session';
import { Paginated } from '~shared/interfaces/utils';
import { Video } from '~shared/interfaces/video';

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

export type PlaylistsResponse = ApiResponse<
  Paginated<Array<Playlist>, 'playlists'>
>;

export type AutocompleteResponse = ApiResponse<string[]>;
