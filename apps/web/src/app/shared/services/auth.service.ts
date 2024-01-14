import { isPlatformServer } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import {
  Inject,
  Injectable,
  OnDestroy,
  PLATFORM_ID,
  inject
} from '@angular/core';
import {
  BehaviorSubject,
  NEVER,
  Observable,
  catchError,
  map,
  retry,
  tap
} from 'rxjs';
import { environment } from '../../../environments/environment';
import { LoginResponse, SessionResponse } from '../interfaces/auth';
import { Session } from '../interfaces/session';

@Injectable({
  providedIn: 'root',
})
export class AuthService implements OnDestroy {
  private http = inject(HttpClient);
  private sessionSubject = new BehaviorSubject<Session | null>(null);
  session$ = this.sessionSubject.asObservable();

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    if (isPlatformServer(this.platformId)) return;

    this.getSession()
      .pipe(
        catchError((error) => {
          if (error.error.status == 401) {
            return this.revalidateSession();
          }
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

  createAccount() {}

  login(email: string, password: string): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(
        `${environment.serverUrl}/users/login`,
        { email, password },
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
    return this.http.get(`${environment.serverUrl}/users/logout`, {
      withCredentials: true,
    });
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
