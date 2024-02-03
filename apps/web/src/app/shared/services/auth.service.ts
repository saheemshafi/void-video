import { isPlatformServer } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import {
  Inject,
  Injectable,
  OnDestroy,
  PLATFORM_ID,
  inject,
} from '@angular/core';
import {
  BehaviorSubject,
  NEVER,
  Observable,
  catchError,
  map,
  retry,
  tap,
} from 'rxjs';

import { environment } from '~/environments/environment';

import {
  CreateAccountRequest,
  LoginRequest,
  LoginResponse,
  SessionResponse,
} from '~shared/interfaces/auth';
import { Session } from '~shared/interfaces/session';

@Injectable({
  providedIn: 'root',
})
export class AuthService implements OnDestroy {
  private http = inject(HttpClient);
  private sessionSubject = new BehaviorSubject<Session | null | undefined>(
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

  ngOnDestroy(): void {
    this.sessionSubject.complete();
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

  login(credentials: LoginRequest): Observable<LoginResponse> {
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

  getSession(): Observable<Session> {
    return this.http
      .get<SessionResponse>(`${environment.serverUrl}/users/session`, {
        withCredentials: true,
      })
      .pipe(
        retry(1),
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

  changePassword() {
    return this.http.get(`${environment.serverUrl}/users/session`, {
      withCredentials: true,
    });
  }

  revalidateSession(): Observable<Session> {
    return this.http
      .get<SessionResponse>(
        `${environment.serverUrl}/users/session/revalidate`,
        {
          withCredentials: true,
        }
      )
      .pipe(
        map((response) => response.data),
        tap({ next: (response) => this.sessionSubject.next(response) })
      );
  }

  resetPassword() {}
  sendResetPasswordEmail() {}
}
