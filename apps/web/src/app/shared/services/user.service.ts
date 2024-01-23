import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map, of, shareReplay, switchMap } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  SubscriptionsResponse,
  VideosResponse,
  WatchHistoryResponse,
} from '../interfaces/api-response';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);

  subscribedChannels$ = this.authService.session$.pipe(
    switchMap((session) =>
      session
        ? this.http
            .get<SubscriptionsResponse>(
              `${environment.serverUrl}/users/channels-subscribed`,
              {
                withCredentials: true,
              }
            )
            .pipe(map((response) => response.data))
        : of([])
    )
  );

  watchHistory$ = this.authService.session$.pipe(
    switchMap((session) =>
      session
        ? this.http
            .get<WatchHistoryResponse>(
              `${environment.serverUrl}/users/watch-history`,
              {
                withCredentials: true,
              }
            )
            .pipe(map((response) => response.data))
        : of(null)
    ),
    shareReplay(1)
  );

  getSubscribedChannels(): Observable<SubscriptionsResponse> {
    return this.http.get<SubscriptionsResponse>(
      `${environment.serverUrl}/users/channels-subscribed`,
      {
        withCredentials: true,
      }
    );
  }
}
