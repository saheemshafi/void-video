import { isPlatformServer } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  PLATFORM_ID,
  inject,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  BehaviorSubject,
  Observable,
  map,
  shareReplay,
  switchMap,
  tap
} from 'rxjs';

import { Channel } from '~shared/interfaces/user.interface';
import { SubscriptionService } from '~shared/services/subscription.service';
import { UserService } from '~shared/services/user.service';

@Component({
  selector: 'app-channel',
  templateUrl: './channel.component.html',
  styleUrl: './channel.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChannelComponent {
  private userService = inject(UserService);
  private subscriptionService = inject(SubscriptionService);
  private activatedRoute = inject(ActivatedRoute);
  private platformId = inject(PLATFORM_ID);

  username$ = new BehaviorSubject<string>('');
  isSubscribed$ = new BehaviorSubject(false);
  loading$ = new BehaviorSubject(false);

  channel$!: Observable<Channel>;

  ngOnInit(): void {
    this.channel$ = this.activatedRoute.paramMap.pipe(
      tap(() => this.loading$.next(true)),
      tap((params) => this.username$.next(params.get('username') as string)),
      switchMap((params) =>
        this.userService.getChannel(<string>params.get('username'))
      ),
      tap(() => this.loading$.next(false)),
      shareReplay(1)
    );

    if (isPlatformServer(this.platformId)) return;
    this.channel$
      .pipe(
        switchMap((channel) =>
          this.subscriptionService
            .getSubscriptionStatus(channel._id)
            .pipe(map((status) => status.isSubscribed))
        )
      )
      .subscribe({
        next: (isSubscribed) => this.isSubscribed$.next(isSubscribed),
      });
  }
}
