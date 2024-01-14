import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../../shared/services/auth.service';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.scss',
})
export class SignInComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);

  loginForm = this.fb.group({
    email: this.fb.control('', {
      validators: [Validators.required, Validators.email],
    }),
    password: this.fb.control('', {
      validators: [Validators.required, Validators.minLength(2)],
    }),
  });

  login() {
    if (this.loginForm.invalid) return;
    this.authService
      .login(
        this.loginForm.value.email ?? '',
        this.loginForm.value.password ?? ''
      )
      .subscribe({
        next: (response) => {
          console.log(response);
        },
        error: ({ error }) => {
          console.log(error);
          if (error.errors) {
            error.errors.forEach(
              (validationError: { field: string; message: string }) => {
                this.loginForm.get(validationError.field)?.setErrors({
                  server: [true, validationError.message],
                });
              }
            );
          } else {
            this.loginForm.setErrors({
              server: [true, error.message],
            });
          }
        },
      });
  }
}
