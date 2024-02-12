import { isPlatformServer } from '@angular/common';
import { Component, PLATFORM_ID, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, map, shareReplay, switchMap, tap } from 'rxjs';

import { Channel } from '~shared/interfaces/user.interface';
import { SubscriptionService } from '~shared/services/subscription.service';
import { UserService } from '~shared/services/user.service';

@Component({
  selector: 'app-channel',
  templateUrl: './channel.component.html',
  styleUrl: './channel.component.scss',
})
export class ChannelComponent {
  private userService = inject(UserService);
  private subscriptionService = inject(SubscriptionService);
  private activatedRoute = inject(ActivatedRoute);
  username: string = '';
  channel$!: Observable<Channel>;
  isSubscribed = false;
  private _platformId = inject(PLATFORM_ID);

  ngOnInit(): void {
    this.channel$ = this.activatedRoute.paramMap
      .pipe(
        tap((params) => (this.username = <string>params.get('username'))),
        switchMap((params) =>
          this.userService.getChannel(<string>params.get('username'))
        )
      )
      .pipe(shareReplay(1));

    if (isPlatformServer(this._platformId)) return;
    this.channel$
      .pipe(
        switchMap((channel) =>
          this.subscriptionService
            .getSubscriptionStatus(channel._id)
            .pipe(map((status) => status.isSubscribed))
        )
      )
      .subscribe({
        next: (isSubscribed) => (this.isSubscribed = isSubscribed),
      });
  }
}
