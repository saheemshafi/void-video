import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WatchRoutingModule } from '~watch/watch-routing.module';
import { WatchComponent } from '~watch/watch.component';
import { VideoPlayerComponent } from '~watch/components/video-player/video-player.component';
import { ChannelBarComponent } from '~watch/components/channel-bar/channel-bar.component';
import { WatchPageComponent } from '~watch/pages/watch/watch-page.component';
import { LikeButtonComponent } from '~watch/components/like-button/like-button.component';
import { ShareButtonComponent } from '~watch/components/share-button/share-button.component';
import { CommentBoxComponent } from '~watch/components/comment-box/comment-box.component';
import { CommentFormComponent } from '~watch/components/comment-form/comment-form.component';

import { SharedModule } from '~shared/shared.module';

@NgModule({
  declarations: [
    WatchComponent,
    VideoPlayerComponent,
    ChannelBarComponent,
    WatchPageComponent,
    LikeButtonComponent,
    ShareButtonComponent,
    CommentBoxComponent,
    CommentFormComponent,
  ],
  imports: [CommonModule, WatchRoutingModule, SharedModule],
})
export class WatchModule {}
