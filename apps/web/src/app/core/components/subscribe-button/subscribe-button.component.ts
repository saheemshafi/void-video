import { Component, Input, inject } from '@angular/core';
import { Observable, of, take } from 'rxjs';
import { SubscriptionService } from '../../../shared/services/subscription.service';

@Component({
  selector: 'app-subscribe-button',
  templateUrl: './subscribe-button.component.html',
  styleUrl: './subscribe-button.component.scss',
})
export class SubscribeButtonComponent {
  @Input({ required: true }) channelId!: string;
  private subscriptionService = inject(SubscriptionService);
  subscriptionStatus$!: Observable<{ isSubscribed: boolean }> | undefined;

  ngOnInit() {
    this.subscriptionStatus$ = this.subscriptionService.getSubscriptionStatus(
      this.channelId
    );
  }

  toggleSubscription(): void {
    this.subscriptionService
      .toggleSubscription(this.channelId)
      .pipe(take(1))
      .subscribe((response) => {
        this.subscriptionStatus$ = of(response);
      });
  }
}
