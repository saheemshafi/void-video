import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CoreComponent } from './core.component';
import { ChannelHomePageComponent } from './pages/channel/channel-home-page/channel-home-page.component';
import { ChannelLayoutComponent } from './pages/channel/channel-layout/channel-layout.component';
import { HistoryPageComponent } from './pages/feed/history-page/history-page.component';
import { SubscriptionsPageComponent } from './pages/feed/subscriptions-page/subscriptions-page.component';
import { YouPageComponent } from './pages/feed/you-page/you-page.component';
import { HomeComponent } from './pages/home/home.component';

const routes: Routes = [
  {
    path: '',
    component: CoreComponent,
    children: [
      {
        path: '',
        component: HomeComponent,
      },
      {
        path: 'c/:username',
        component: ChannelLayoutComponent,
        children: [
          {
            path: '',
            component: ChannelHomePageComponent,
          },
        ],
      },
      {
        path: 'feed/you',
        component: YouPageComponent,
      },
      {
        path: 'feed/subscriptions',
        component: SubscriptionsPageComponent,
      },
      {
        path: 'feed/history',
        component: HistoryPageComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CoreRoutingModule {}
