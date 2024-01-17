import { CdkMenuModule } from '@angular/cdk/menu';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FieldErrorComponent } from './components/field-error/field-error.component';
import { AppearanceMenuComponent } from './components/profile-menu/appearance-menu/appearance-menu.component';
import { UserProfileComponent } from './components/profile-menu/user-profile/user-profile.component';
import { SvgLoaderComponent } from './components/svg-loader/svg-loader.component';

@NgModule({
  declarations: [
    SvgLoaderComponent,
    FieldErrorComponent,
    UserProfileComponent,
    AppearanceMenuComponent,
  ],
  imports: [CommonModule, CdkMenuModule, RouterModule],
  exports: [SvgLoaderComponent, FieldErrorComponent, UserProfileComponent],
})
export class SharedModule {}
