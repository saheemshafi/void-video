import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { map } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  ApiResponse,
  VideoResponse,
  VideosResponse,
} from '../interfaces/api-response';
import { QueryList } from '../interfaces/utils';
import { response } from 'express';

@Injectable({
  providedIn: 'root',
})
export class VideoService {
  private http = inject(HttpClient);

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
    return this.http.get<ApiResponse<unknown>>(
      `${environment.serverUrl}/videos/${videoId}/toggle-like`,
      {
        withCredentials: true,
      }
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
      .pipe(map((response) => response.data));
  }
}
