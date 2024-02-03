import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WatchRoutingModule } from '~watch/watch-routing.module';
import { WatchComponent } from '~watch/watch.component';
import { VideoPlayerComponent } from '~watch/components/video-player/video-player.component';
import { WatchPageChannelBarComponent } from '~watch/components/watch-page-channel-bar/watch-page-channel-bar.component';
import { WatchPageComponent } from '~watch/pages/watch/watch-page.component';

import { SharedModule } from '~shared/shared.module';

@NgModule({
  declarations: [
    WatchComponent,
    VideoPlayerComponent,
    WatchPageChannelBarComponent,
    WatchPageComponent,
  ],
  imports: [CommonModule, WatchRoutingModule, SharedModule],
})
export class WatchModule {}
