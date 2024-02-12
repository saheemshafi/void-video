import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CoreComponent } from '~core/core.component';
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
        path: 'watch',
        loadChildren: () =>
          import('~watch/watch.module').then((m) => m.WatchModule),
      },
      {
        path: 'feed',
        loadChildren: () =>
          import('~feed/feed.module').then((m) => m.FeedModule),
      },
      {
        path: 'c/:username',
        loadChildren: () =>
          import('~channel/channel.module').then((m) => m.ChannelModule),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CoreRoutingModule {}
