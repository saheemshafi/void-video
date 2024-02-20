import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ChannelRoutingModule } from '~channel/channel-routing.module';
import { ChannelComponent } from '~channel/channel.component';
import { AboutPageComponent } from '~channel/pages/about-page/about-page.component';
import { PlaylistsPageComponent } from '~channel/pages/playlists-page/playlists-page.component';
import { VideosPageComponent } from '~channel/pages/videos-page/videos-page.component';
import { SharedModule } from '~shared/shared.module';
import { ChannelNavComponent } from './components/channel-nav/channel-nav.component';

@NgModule({
  declarations: [
    ChannelComponent,
    VideosPageComponent,
    PlaylistsPageComponent,
    AboutPageComponent,
    ChannelNavComponent,
  ],
  imports: [CommonModule, ChannelRoutingModule, SharedModule],
})
export class ChannelModule {}
