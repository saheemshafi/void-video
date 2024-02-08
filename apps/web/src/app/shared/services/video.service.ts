import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID, inject } from '@angular/core';
import { EMPTY, Observable, catchError, map, of, tap } from 'rxjs';

import { HotToastService } from '@ngneat/hot-toast';

import {
  ApiResponse,
  VideoResponse,
} from '~shared/interfaces/api-response.interface';
import { QueryList } from '~shared/interfaces/query-list.interface';
import { Video } from '~shared/interfaces/video.interface';
import { Paginated } from '~shared/interfaces/utils.interface';
import { Comment } from '~shared/interfaces/comment.interface';

import { environment } from '~/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class VideoService {
  private http = inject(HttpClient);
  private toast = inject(HotToastService);

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  getVideos(
    queryParams?: Partial<QueryList>
  ): Observable<Paginated<Video[], 'videos'>> {
    const url = new URL(`${environment.serverUrl}/videos`);

    for (let [param, value] of Object.entries(queryParams || {})) {
      url.searchParams.set(param, String(value));
    }

    return this.http
      .get<ApiResponse<Paginated<Video[], 'videos'>>>(url.toString())
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

  getComments(videoId: string) {
    return this.http
      .get<ApiResponse<Paginated<Comment[], 'comments'>>>(
        `${environment.serverUrl}/videos/${videoId}/comments`,
        {
          withCredentials: true,
        }
      )
      .pipe(map((response) => response.data));
  }

  comment(videoId: string, content: string) {
    return this.http
      .post<ApiResponse<Comment>>(
        `${environment.serverUrl}/videos/${videoId}/comments`,
        {
          content,
        },
        {
          withCredentials: true,
        }
      )
      .pipe(
        map((response) => response.data),
        tap({
          next: (response) => {
            if (response) {
              this.toast.show(`Comment added to video`);
            }
          },
          error: ({ error }) =>
            this.toast.show(
              `Failed to comment <p class='toast-description'>${error?.message}</p>`
            ),
        })
      );
  }
}
