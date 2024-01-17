import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SvgLoaderComponent } from './components/svg-loader/svg-loader.component';
import { FieldErrorComponent } from './components/field-error/field-error.component';
import { UserProfileComponent } from './components/profile-menu/user-profile/user-profile.component';
import { CdkMenuModule } from '@angular/cdk/menu';
import { RouterModule } from '@angular/router';
import { AppearanceMenuComponent } from './components/profile-menu/appearance-menu/appearance-menu.component';
import { ProfileMenuHeaderComponent } from './components/profile-menu/profile-menu-header/profile-menu-header.component';

@NgModule({
  declarations: [
    SvgLoaderComponent,
    FieldErrorComponent,
    UserProfileComponent,
    AppearanceMenuComponent,
    ProfileMenuHeaderComponent,
  ],
  imports: [CommonModule, CdkMenuModule, RouterModule],
  exports: [SvgLoaderComponent, FieldErrorComponent, UserProfileComponent],
})
export class SharedModule {}
