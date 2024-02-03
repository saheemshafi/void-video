import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID, inject } from '@angular/core';
import { EMPTY, catchError, map, of } from 'rxjs';

import {
  ApiResponse,
  VideoResponse,
  VideosResponse,
} from '~shared/interfaces/api-response';
import { QueryList } from '~shared/interfaces/utils';

import { HotToastService } from '@ngneat/hot-toast';
import { environment } from '~/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class VideoService {
  private http = inject(HttpClient);
  private toast = inject(HotToastService);

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  getVideos(queryParams?: Partial<QueryList>) {
    const url = new URL(`${environment.serverUrl}/videos`);

    for (let [param, value] of Object.entries(queryParams || {})) {
      url.searchParams.set(param, String(value));
    }

    return this.http
      .get<VideosResponse>(url.toString())
      .pipe(map((response) => response.data));
  }

  getVideo(videoId: string) {
    return this.http
      .get<VideoResponse>(`${environment.serverUrl}/videos/${videoId}`, {
        withCredentials: true,
      })
      .pipe(map((response) => response.data));
  }

  toggleVideoLike(videoId: string) {
    return this.http
      .get<ApiResponse<unknown>>(
        `${environment.serverUrl}/videos/${videoId}/toggle-like`,
        {
          withCredentials: true,
        }
      )
      .pipe(
        catchError(({ error }: HttpErrorResponse) => {
          this.toast.show(
            `Failed to like <p class='toast-description'>${error.message}</p>`
          );
          return EMPTY;
        })
      );
  }

  getLikeStatus(videoId: string) {
    return this.http
      .get<ApiResponse<{ isLiked: boolean; _id: string }>>(
        `${environment.serverUrl}/videos/${videoId}/status`,
        {
          withCredentials: true,
        }
      )
      .pipe(
        map((response) => response.data.isLiked),
        catchError(() => of(false))
      );
  }
}
