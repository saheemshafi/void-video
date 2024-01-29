import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { VideoResponse, VideosResponse } from '../interfaces/api-response';
import { QueryList } from '../interfaces/utils';

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
}
