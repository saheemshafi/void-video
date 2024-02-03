import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { map } from 'rxjs';

import {
  SubscriptionsResponse,
  VideosResponse,
  WatchHistoryResponse,
} from '~shared/interfaces/api-response';
import { QueryList } from '~shared/interfaces/utils';

import { AuthService } from '~shared/services/auth.service';

import { environment } from '~/environments/environment';

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

  getLikedVideos(queryParams?: Partial<QueryList>) {
    const url = new URL(`${environment.serverUrl}/users/liked-videos`);

    for (let [param, value] of Object.entries(queryParams || {})) {
      url.searchParams.set(param, String(value));
    }

    return this.http
      .get<VideosResponse>(url.toString(), {
        withCredentials: true,
      })
      .pipe(map((response) => response.data));
  }
}
