import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
  OnDestroy,
  SimpleChanges,
  inject,
} from '@angular/core';
import { BehaviorSubject, take } from 'rxjs';

import { SubscriptionService } from '~shared/services/subscription.service';

@Component({
  selector: 'app-subscribe-button',
  templateUrl: './subscribe-button.component.html',
  styleUrl: './subscribe-button.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SubscribeButtonComponent implements OnChanges, OnDestroy {
  @Input({ required: true }) channelId!: string;
  @Input({ required: true }) isSubscribed!: boolean;

  isSubscribed$ = new BehaviorSubject<boolean>(this.isSubscribed);
  private subscriptionService = inject(SubscriptionService);

  ngOnChanges(changes: SimpleChanges) {
    if (changes['isSubscribed']) this.isSubscribed$.next(this.isSubscribed);
  }

  toggleSubscription(): void {
    this.subscriptionService
      .toggleSubscription(this.channelId)
      .pipe(take(1))
      .subscribe((response) => {
        this.isSubscribed$.next(response.isSubscribed);
      });
  }

  ngOnDestroy(): void {
    this.isSubscribed$.complete();
  }
}
