import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SvgLoaderComponent } from './components/svg-loader/svg-loader.component';
import { FieldErrorComponent } from './components/field-error/field-error.component';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { CdkMenuModule } from '@angular/cdk/menu';
import { RouterModule } from '@angular/router';
import { AppearanceMenuComponent } from './components/appearance-menu/appearance-menu.component';

@NgModule({
  declarations: [SvgLoaderComponent, FieldErrorComponent, UserProfileComponent, AppearanceMenuComponent],
  imports: [CommonModule, CdkMenuModule, RouterModule],
  exports: [SvgLoaderComponent, FieldErrorComponent, UserProfileComponent],
})
export class SharedModule {}
