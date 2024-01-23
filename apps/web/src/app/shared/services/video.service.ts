import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '../../../environments/environment';
import { VideosResponse } from '../interfaces/api-response';
import { map, shareReplay } from 'rxjs';

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
}
