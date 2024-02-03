import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FeedComponent } from './feed.component';
import { YouPageComponent } from './pages/you-page/you-page.component';
import { SubscriptionsPageComponent } from './pages/subscriptions-page/subscriptions-page.component';
import { HistoryPageComponent } from './pages/history-page/history-page.component';
import { LikedVideosComponent } from './pages/liked-videos/liked-videos.component';

const routes: Routes = [
  {
    path: '',
    component: FeedComponent,
    children: [
      {
        path: 'you',
        component: YouPageComponent,
      },
      {
        path: 'subscriptions',
        component: SubscriptionsPageComponent,
      },
      {
        path: 'history',
        component: HistoryPageComponent,
      },
      {
        path: 'liked-videos',
        component: LikedVideosComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FeedRoutingModule {}
