import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { AuthRoutingModule } from '~auth/auth-routing.module';
import { AuthComponent } from '~auth/auth.component';
import { SignInComponent } from '~auth/pages/sign-in/sign-in.component';
import { SignUpComponent } from '~auth/pages/sign-up/sign-up.component';

import { SharedModule } from '~shared/shared.module';

@NgModule({
  declarations: [AuthComponent, SignInComponent, SignUpComponent],
  imports: [CommonModule, AuthRoutingModule, ReactiveFormsModule, SharedModule],
})
export class AuthModule {}
