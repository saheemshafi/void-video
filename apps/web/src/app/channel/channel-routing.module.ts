import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ChannelComponent } from '~channel/channel.component';
import { ChannelHomePageComponent } from '~channel/pages/channel-home-page/channel-home-page.component';
import { VideosPageComponent } from '~channel/pages/videos-page/videos-page.component';
import { PlaylistsPageComponent } from '~channel/pages/playlists-page/playlists-page.component';
import { AboutPageComponent } from '~channel/pages/about-page/about-page.component';

const routes: Routes = [
  {
    path: '',
    component: ChannelComponent,
    children: [
      {
        path: '',
        component: ChannelHomePageComponent,
      },
      {
        path: 'videos',
        component: VideosPageComponent,
      },
      {
        path: 'playlists',
        component: PlaylistsPageComponent,
      },
      {
        path: 'about',
        component: AboutPageComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ChannelRoutingModule {}
