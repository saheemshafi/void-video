import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FeedRoutingModule } from './feed-routing.module';
import { FeedComponent } from './feed.component';
import { SubscriptionsPageComponent } from './pages/subscriptions-page/subscriptions-page.component';
import { HistoryPageComponent } from './pages/history-page/history-page.component';
import { YouPageComponent } from './pages/you-page/you-page.component';
import { LikedVideosComponent } from './pages/liked-videos/liked-videos.component';
import { SharedModule } from '../shared/shared.module';
import { SubscriptionListComponent } from './components/subscription-list/subscription-list.component';
import { SubscriptionCardComponent } from './components/subscription-card/subscription-card.component';

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
