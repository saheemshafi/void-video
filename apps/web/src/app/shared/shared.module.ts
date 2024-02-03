import { CdkMenuModule } from '@angular/cdk/menu';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FieldErrorComponent } from './components/field-error/field-error.component';
import { AppearanceMenuComponent } from './components/profile-menu/appearance-menu/appearance-menu.component';
import { UserProfileComponent } from './components/profile-menu/user-profile/user-profile.component';
import { SvgLoaderComponent } from './components/svg-loader/svg-loader.component';
import { AbbreviateNumberPipe } from './pipes/abbreviate-number.pipe';
import { FullscreenInfoComponent } from './components/fullscreen-info/fullscreen-info.component';
import { ItemGridComponent } from './components/item-grid/item-grid.component';
import { ExpandableTextComponent } from './components/expandable-text/expandable-text.component';

import { CdkAccordionModule } from '@angular/cdk/accordion';
import { SubscribeButtonComponent } from './components/subscribe-button/subscribe-button.component';
import { VideoCardComponent } from './components/video-card/video-card.component';
import { PlaylistCardComponent } from './components/playlist-card/playlist-card.component';

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
];

@NgModule({
  declarations: [AppearanceMenuComponent, ItemGridComponent, ...declarations],
  imports: [
    CommonModule,
    RouterModule,
    CdkMenuModule,
    CdkAccordionModule,
    NgOptimizedImage,
  ],
  exports: [NgOptimizedImage, ...declarations],
})
export class SharedModule {}
