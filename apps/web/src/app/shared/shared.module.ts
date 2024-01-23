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

const exports = [
  SvgLoaderComponent,
  FieldErrorComponent,
  UserProfileComponent,
  AbbreviateNumberPipe,
  FullscreenInfoComponent,
  ItemGridComponent,
];

@NgModule({
  declarations: [AppearanceMenuComponent, ItemGridComponent, ...exports],
  imports: [CommonModule, CdkMenuModule, RouterModule, NgOptimizedImage],
  exports: exports,
})
export class SharedModule {}
