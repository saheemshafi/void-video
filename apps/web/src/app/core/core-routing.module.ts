import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CoreComponent } from '~core/core.component';
import { ChannelHomePageComponent } from '~core/pages/channel/channel-home-page/channel-home-page.component';
import { ChannelLayoutComponent } from '~core/pages/channel/channel-layout/channel-layout.component';
import { HomeComponent } from '~core/pages/home/home.component';

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
        path: 'watch',
        loadChildren: () =>
          import('~watch/watch.module').then((m) => m.WatchModule),
      },
      {
        path: 'feed',
        loadChildren: () =>
          import('~feed/feed.module').then((m) => m.FeedModule),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CoreRoutingModule {}
