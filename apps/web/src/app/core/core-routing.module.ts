import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CoreComponent } from './core.component';
import { ChannelHomePageComponent } from './pages/channel/channel-home-page/channel-home-page.component';
import { ChannelLayoutComponent } from './pages/channel/channel-layout/channel-layout.component';
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
        path: 'watch',
        loadChildren: () =>
          import('../watch/watch.module').then((m) => m.WatchModule),
      },
      {
        path: 'feed',
        loadChildren: () =>
          import('../feed/feed.module').then((m) => m.FeedModule),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CoreRoutingModule {}
