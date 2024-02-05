import { Subscription } from '~shared/interfaces/subscription.interface';
import { Video } from '~shared/interfaces/video.interface';

export interface ApiResponse<T> {
  success: true;
  data: T;
  message: string;
  status: 200 | 201;
}

export type SubscriptionStatusResponse = ApiResponse<{ isSubscribed: boolean }>;

export type VideoWithSubscriptionInfo = Video & {
  owner: Subscription & { isSubscribed: boolean };
};

export type VideoResponse = ApiResponse<VideoWithSubscriptionInfo>;
