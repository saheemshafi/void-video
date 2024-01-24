import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Subject, map, shareReplay } from 'rxjs';
import { environment } from '../../../environments/environment';
import { VideoResponse, VideosResponse } from '../interfaces/api-response';
import { Video } from '../interfaces/video';

type DeepPartial<T> = {
  [P in keyof T]?: DeepPartial<P>;
};

@Injectable({
  providedIn: 'root',
})
export class VideoService {
  private http = inject(HttpClient);

  getVideos() {
    return this.http
      .get<VideosResponse>(`${environment.serverUrl}/videos`)
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
