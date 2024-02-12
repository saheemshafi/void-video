import {
  Component,
  Input,
  OnChanges,
  PLATFORM_ID,
  inject
} from '@angular/core';
import { isPlatformServer } from '@angular/common';
import { map, take } from 'rxjs';


import { Subscription } from '~shared/interfaces/subscription.interface';
import { Video } from '~shared/interfaces/video.interface';
import { SubscriptionService } from '~shared/services/subscription.service';

@Component({
  selector: 'app-channel-bar',
  templateUrl: './channel-bar.component.html',
  styleUrl: './channel-bar.component.scss',
})
export class ChannelBarComponent implements OnChanges {
  @Input() video!: Video & { owner: Subscription };
  private subscriptionService = inject(SubscriptionService);
  private _platformId = inject(PLATFORM_ID);
  isSubscribed = false;

  ngOnChanges(): void {
    if (isPlatformServer(this._platformId)) return;

    this.subscriptionService
      .getSubscriptionStatus(this.video.owner._id)
      .pipe(
        map((status) => status.isSubscribed),
        take(1)
      )
      .subscribe({
        next: (isSubscribed) => (this.isSubscribed = isSubscribed),
      });
  }
}
