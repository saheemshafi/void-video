import { CdkMenuModule } from '@angular/cdk/menu';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CdkAccordionModule } from '@angular/cdk/accordion';
import { ReactiveFormsModule } from '@angular/forms';

import { FieldErrorComponent } from '~shared/components/field-error/field-error.component';
import { AppearanceMenuComponent } from '~shared/components/profile-menu/appearance-menu/appearance-menu.component';
import { UserProfileComponent } from '~shared/components/profile-menu/user-profile/user-profile.component';
import { SvgLoaderComponent } from '~shared/components/svg-loader/svg-loader.component';
import { AbbreviateNumberPipe } from '~shared/pipes/abbreviate-number.pipe';
import { FullscreenInfoComponent } from '~shared/components/fullscreen-info/fullscreen-info.component';
import { ItemGridComponent } from '~shared/components/item-grid/item-grid.component';
import { ExpandableTextComponent } from '~shared/components/expandable-text/expandable-text.component';
import { SubscribeButtonComponent } from '~shared/components/subscribe-button/subscribe-button.component';
import { VideoCardComponent } from '~shared/components/video-card/video-card.component';
import { PlaylistCardComponent } from '~shared/components/playlist-card/playlist-card.component';
import { VideoOptionsComponent } from '~shared/components/video-options/video-options.component';
import { CommentComponent } from '~shared/components/comment/comment.component';

import { ReplaceLinksPipe } from '~shared/pipes/replace-links.pipe';
import { ReplyFormComponent } from '~shared/components/reply-form/reply-form.component';
import { IfSessionComponent } from '~shared/components/if-session/if-session.component';
import { TemplateRendererComponent } from '~shared/components/template-renderer/template-renderer.component';
import { VideoCardSkeletonComponent } from '~shared/components/video-card/video-card.skeleton';
import { PlaylistCardSkeleton } from '~shared/components/playlist-card/playlist-card.skeleton';

import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { NotFoundComponent } from './components/not-found/not-found.component';

const declarations = [
  SvgLoaderComponent,
  FieldErrorComponent,
  UserProfileComponent,
  AbbreviateNumberPipe,
  FullscreenInfoComponent,
  ItemGridComponent,
  ExpandableTextComponent,
  SubscribeButtonComponent,
  VideoCardComponent,
  PlaylistCardComponent,
  VideoOptionsComponent,
  CommentComponent,
  ReplaceLinksPipe,
  IfSessionComponent,
  TemplateRendererComponent,
  VideoCardSkeletonComponent,
  PlaylistCardSkeleton,
];

@NgModule({
  declarations: [
    AppearanceMenuComponent,
    ItemGridComponent,
    ReplyFormComponent,
    ...declarations,
    NotFoundComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    CdkMenuModule,
    CdkAccordionModule,
    ReactiveFormsModule,
    NgOptimizedImage,
  ],
  exports: [
    NgOptimizedImage,
    CdkMenuModule,
    InfiniteScrollModule,
    ...declarations,
  ],
})
export class SharedModule {}
