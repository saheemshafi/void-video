import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map, of, shareReplay, switchMap } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  ApiResponse,
  SubscriptionsResponse,
  VideosResponse,
  WatchHistoryResponse,
} from '../interfaces/api-response';
import { AuthService } from './auth.service';
import { Paginated } from '../interfaces/utils';
import { Video } from '../interfaces/video';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);

  getWatchHistory() {
    return this.http
      .get<WatchHistoryResponse>(
        `${environment.serverUrl}/users/watch-history`,
        {
          withCredentials: true,
        }
      )
      .pipe(map((response) => response.data));
  }

  getSubscribedChannels() {
    return this.http
      .get<SubscriptionsResponse>(
        `${environment.serverUrl}/users/channels-subscribed`,
        {
          withCredentials: true,
        }
      )
      .pipe(map((response) => response.data));
  }

  getLikedVideos() {
    return this.http
      .get<ApiResponse<Paginated<Array<Video>, 'videos'>>>(
        `${environment.serverUrl}/users/liked-videos`,
        {
          withCredentials: true,
        }
      )
      .pipe(map((response) => response.data));
  }
}
