import { Component, inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../../shared/services/auth.service';
import { LoginRequest } from '../../../shared/interfaces/auth';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.scss',
})
export class SignInComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);

  isSubmitting: boolean = false;

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
    this.isSubmitting = true;
    this.authService.login(<LoginRequest>this.loginForm.value).subscribe({
      next: (response) => {
        this.isSubmitting = false;
        // show an alert that you are logged in
      },
      error: ({ error }) => {
        this.isSubmitting = false;
        if (error.errors) {
          error.errors.forEach(
            (validationError: { field: string; message: string }) => {
              this.loginForm.get(validationError.field)?.setErrors({
                server: validationError.message,
              });
            }
          );
        } else {
          this.loginForm.setErrors({
            server: error.message,
          });
        }
      },
    });
  }
}
