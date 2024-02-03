import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WatchRoutingModule } from './watch-routing.module';
import { WatchComponent } from './watch.component';
import { VideoPlayerComponent } from './components/video-player/video-player.component';
import { WatchPageChannelBarComponent } from './components/watch-page-channel-bar/watch-page-channel-bar.component';
import { SharedModule } from '../shared/shared.module';
import { WatchPageComponent } from './pages/watch/watch-page.component';

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
