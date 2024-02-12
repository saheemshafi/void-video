import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { EMPTY, catchError, map, of, tap } from 'rxjs';

import { SubscriptionStatusResponse } from '~shared/interfaces/api-response.interface';

import { HotToastService } from '@ngneat/hot-toast';
import { environment } from '~/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SubscriptionService {
  private http = inject(HttpClient);
  private toast = inject(HotToastService);

  getSubscriptionStatus(channelId: string) {
    return this.http
      .get<SubscriptionStatusResponse>(
        `${environment.serverUrl}/subscriptions/channels/${channelId}/status`,
        { withCredentials: true }
      )
      .pipe(
        map((response) => response.data),
        catchError(() => of({ isSubscribed: false }))
      );
  }

  toggleSubscription(channelId: string) {
    return this.http
      .get<SubscriptionStatusResponse>(
        `${environment.serverUrl}/subscriptions/channels/${channelId}`,
        { withCredentials: true }
      )
      .pipe(
        map((response) => response.data),
        tap((response) => {
          if (response.isSubscribed) {
            this.toast.show(
              `Subscribed this channel <p class='toast-description'>You'll get upload notifications from this channel</p>`
            );
          } else {
            this.toast.show(
              `Unsubscribed from this channel <p class='toast-description'>You'll no longer get notifications from this channel</p>`
            );
          }
        }),
        catchError(({ error }: HttpErrorResponse) => {
          this.toast.show(`${error.message}`);

          return EMPTY;
        })
      );
  }
}
