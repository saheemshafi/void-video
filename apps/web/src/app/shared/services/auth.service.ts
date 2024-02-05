import { isPlatformServer } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import {
  Inject,
  Injectable,
  OnDestroy,
  PLATFORM_ID,
  inject,
} from '@angular/core';
import { BehaviorSubject, NEVER, catchError, map, tap } from 'rxjs';

import { environment } from '~/environments/environment';

import {
  CreateAccountRequest,
  LoginRequest,
  LoginResponse,
  UserResponse,
} from '~/app/shared/interfaces/auth.interface';
import { User } from '~/app/shared/interfaces/user.interface';

@Injectable({
  providedIn: 'root',
})
export class AuthService implements OnDestroy {
  private http = inject(HttpClient);
  private sessionSubject = new BehaviorSubject<User | null | undefined>(
    undefined
  );

  session$ = this.sessionSubject.asObservable();

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    if (isPlatformServer(this.platformId)) return;

    this.getSession()
      .pipe(
        catchError(({ error }) => {
          if (error.status == 401) {
            return this.revalidateSession().pipe(
              catchError(() => {
                this.sessionSubject.next(null);
                return NEVER;
              })
            );
          }
          this.sessionSubject.next(null);
          return NEVER;
        })
      )
      .subscribe({
        next: (response) => {
          this.sessionSubject.next(response);
        },
      });
  }

  createAccount(userDetails: CreateAccountRequest) {
    const formData = new FormData();
    Object.entries(userDetails).forEach((entry) =>
      formData.set(entry[0], entry[1])
    );

    return this.http.post(
      `${environment.serverUrl}/users/create-account`,
      formData
    );
  }

  login(credentials: LoginRequest) {
    return this.http
      .post<LoginResponse>(
        `${environment.serverUrl}/users/login`,
        credentials,
        {
          withCredentials: true,
        }
      )
      .pipe(
        tap({
          next: (response) => {
            this.sessionSubject.next(response.data.user);
          },
        })
      );
  }

  getSession() {
    return this.http
      .get<UserResponse>(`${environment.serverUrl}/users/session`, {
        withCredentials: true,
      })
      .pipe(
        map((response) => response.data),
        tap({ next: (response) => this.sessionSubject.next(response) })
      );
  }

  logout() {
    return this.http
      .get(`${environment.serverUrl}/users/logout`, {
        withCredentials: true,
      })
      .pipe(tap({ next: () => this.sessionSubject.next(null) }));
  }

  revalidateSession() {
    return this.http
      .get<UserResponse>(`${environment.serverUrl}/users/session/revalidate`, {
        withCredentials: true,
      })
      .pipe(
        map((response) => response.data),
        tap({ next: (response) => this.sessionSubject.next(response) })
      );
  }

  changePassword() {}
  resetPassword() {}
  sendResetPasswordEmail() {}

  ngOnDestroy(): void {
    this.sessionSubject.complete();
  }
}
