import { Component, inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

import { CreateAccountRequest } from '~shared/interfaces/auth';
import { AuthService } from '~shared/services/auth.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.scss',
})
export class SignUpComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);

  isSubmitting: boolean = false;

  signupForm = this.fb.group({
    displayName: this.fb.control('', {
      validators: [Validators.required, Validators.minLength(3)],
    }),
    username: this.fb.control('', {
      validators: [Validators.required, Validators.minLength(6)],
    }),
    email: this.fb.control('', {
      validators: [Validators.required, Validators.email],
    }),
    password: this.fb.control('', {
      validators: [Validators.required, Validators.minLength(8)],
    }),
    avatar: this.fb.control<File | null>(null),
  });

  createAccount() {
    if (!this.signupForm.get('avatar')?.value) {
      this.signupForm.get('avatar')?.setErrors({ required: true });
      return;
    }
    if (this.signupForm.invalid) return;

    this.isSubmitting = true;

    this.authService
      .createAccount(<CreateAccountRequest>this.signupForm.value)
      .subscribe({
        next: (response) => {
          this.isSubmitting = false;
        },
        error: ({ error }) => {
          this.isSubmitting = false;
          if (error.errors) {
            error.errors.forEach(
              (validationError: { field: string; message: string }) => {
                this.signupForm.get(validationError.field)?.setErrors({
                  server: validationError.message,
                });
              }
            );
          } else {
            this.signupForm.setErrors({
              server: error.message,
            });
          }
        },
      });
  }

  onAvatarSelect(event: Event) {
    const input = <HTMLInputElement>event.target;
    this.signupForm.get('avatar')?.markAsTouched();

    if (input.files && input.files.length) {
      this.signupForm.get('avatar')?.setValue(input.files[0]);
    } else {
      this.signupForm.get('avatar')?.setErrors({ required: true });
    }
  }
}
