import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ChannelRoutingModule } from '~channel/channel-routing.module';
import { ChannelComponent } from '~channel/channel.component';
import { AboutPageComponent } from '~channel/pages/about-page/about-page.component';
import { PlaylistsPageComponent } from '~channel/pages/playlists-page/playlists-page.component';
import { VideosPageComponent } from '~channel/pages/videos-page/videos-page.component';
import { ChannelNavComponent } from '~channel/components/channel-nav/channel-nav.component';
import { ChannelAvatarComponent } from '~channel/components/channel-avatar/channel-avatar.component';
import { ChannelSkeletonComponent } from '~channel/channel.skeleton';

import { SharedModule } from '~shared/shared.module';

@NgModule({
  declarations: [
    ChannelComponent,
    VideosPageComponent,
    PlaylistsPageComponent,
    AboutPageComponent,
    ChannelNavComponent,
    ChannelAvatarComponent,
    ChannelSkeletonComponent,
  ],
  imports: [CommonModule, ChannelRoutingModule, SharedModule],
})
export class ChannelModule {}
