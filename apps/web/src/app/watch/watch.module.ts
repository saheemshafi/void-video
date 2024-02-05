import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WatchRoutingModule } from '~watch/watch-routing.module';
import { WatchComponent } from '~watch/watch.component';
import { VideoPlayerComponent } from '~watch/components/video-player/video-player.component';
import { WatchPageChannelBarComponent } from '~watch/components/watch-page-channel-bar/watch-page-channel-bar.component';
import { WatchPageComponent } from '~watch/pages/watch/watch-page.component';

import { SharedModule } from '~shared/shared.module';
import { LikeButtonComponent } from './components/like-button/like-button.component';
import { ShareButtonComponent } from './components/share-button/share-button.component';
import { CommentBoxComponent } from './components/comment-box/comment-box.component';
import { CommentFormComponent } from './components/comment-form/comment-form.component';

@NgModule({
  declarations: [
    WatchComponent,
    VideoPlayerComponent,
    WatchPageChannelBarComponent,
    WatchPageComponent,
    LikeButtonComponent,
    ShareButtonComponent,
    CommentBoxComponent,
    CommentFormComponent,
  ],
  imports: [CommonModule, WatchRoutingModule, SharedModule],
})
export class WatchModule {}
