import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FeedRoutingModule } from '~feed/feed-routing.module';
import { FeedComponent } from '~feed/feed.component';
import { SubscriptionsPageComponent } from '~feed/pages/subscriptions-page/subscriptions-page.component';
import { HistoryPageComponent } from '~feed/pages/history-page/history-page.component';
import { YouPageComponent } from '~feed/pages/you-page/you-page.component';
import { LikedVideosComponent } from '~feed/pages/liked-videos/liked-videos.component';
import { SubscriptionListComponent } from '~feed/components/subscription-list/subscription-list.component';
import { SubscriptionCardComponent } from '~feed/components/subscription-card/subscription-card.component';

import { SharedModule } from '~shared/shared.module';

@NgModule({
  declarations: [
    FeedComponent,
    SubscriptionsPageComponent,
    HistoryPageComponent,
    YouPageComponent,
    LikedVideosComponent,
    SubscriptionListComponent,
    SubscriptionCardComponent,
  ],
  imports: [CommonModule, FeedRoutingModule, SharedModule],
})
export class FeedModule {}
