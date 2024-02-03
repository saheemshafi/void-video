import { isPlatformServer } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID, inject } from '@angular/core';
import { NEVER, catchError, map, of } from 'rxjs';

import { SubscriptionStatusResponse } from '~shared/interfaces/api-response';

import { environment } from '~/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SubscriptionService {
  private http = inject(HttpClient);

  constructor(@Inject(PLATFORM_ID) private _platformId: Object) {}

  getSubscriptionStatus(channelId: string) {
    if (isPlatformServer(this._platformId)) return;
    return this.http
      .get<SubscriptionStatusResponse>(
        `${environment.serverUrl}/subscriptions/channels/${channelId}/status`,
        { withCredentials: true }
      )
      .pipe(
        map((response) => response.data),
        catchError(({ error }) =>
          error.status === 401 ? of({ isSubscribed: false }) : NEVER
        )
      );
  }

  toggleSubscription(channelId: string) {
    return this.http
      .get<SubscriptionStatusResponse>(
        `${environment.serverUrl}/subscriptions/channels/${channelId}`,
        { withCredentials: true }
      )
      .pipe(map((response) => response.data));
  }
}
