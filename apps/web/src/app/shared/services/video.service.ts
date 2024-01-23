import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '../../../environments/environment';
import { VideoResponse, VideosResponse } from '../interfaces/api-response';
import { BehaviorSubject, Subject, map, shareReplay, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class VideoService {
  private http = inject(HttpClient);

  videos$ = this.http
    .get<VideosResponse>(`${environment.serverUrl}/videos`)
    .pipe(
      map((response) => response.data),
      shareReplay(1)
    );

  getVideo(videoId: string) {
    return this.http
      .get<VideoResponse>(`${environment.serverUrl}/videos/${videoId}`)
      .pipe(map((response) => response.data));
  }
}
