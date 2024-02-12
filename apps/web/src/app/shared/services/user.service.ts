import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { map } from 'rxjs';

import { ApiResponse } from '~shared/interfaces/api-response.interface';
import { QueryList } from '~shared/interfaces/query-list.interface';
import { Subscription } from '~shared/interfaces/subscription.interface';
import { Paginated } from '~shared/interfaces/utils.interface';
import { Video } from '~shared/interfaces/video.interface';

import { environment } from '~/environments/environment';
import { Channel } from '../interfaces/user.interface';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private http = inject(HttpClient);

  getWatchHistory() {
    return this.http
      .get<ApiResponse<Video[]>>(
        `${environment.serverUrl}/users/watch-history`,
        {
          withCredentials: true,
        }
      )
      .pipe(map((response) => response.data));
  }

  getSubscribedChannels() {
    return this.http
      .get<ApiResponse<Array<Subscription>>>(
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
      .get<ApiResponse<Paginated<Video[], 'videos'>>>(url.toString(), {
        withCredentials: true,
      })
      .pipe(map((response) => response.data));
  }

  getChannel(username: string) {
    return this.http
      .get<ApiResponse<Channel>>(
        `${environment.serverUrl}/users/c/${username}`,
        { withCredentials: true }
      )
      .pipe(map((response) => response.data));
  }
}
