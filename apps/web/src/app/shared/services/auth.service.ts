import { isPlatformServer } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Injectable, OnDestroy, PLATFORM_ID, inject } from '@angular/core';
import {
  BehaviorSubject,
  NEVER,
  Observable,
  catchError,
  map,
  of,
  shareReplay,
  tap,
} from 'rxjs';

import { environment } from '~/environments/environment';

import {
  CreateAccountRequest,
  LoginRequest,
  LoginResponse,
  UserResponse,
} from '~shared/interfaces/auth.interface';
import { User } from '~shared/interfaces/user.interface';

@Injectable({
  providedIn: 'root',
})
export class AuthService implements OnDestroy {
  private http = inject(HttpClient);
  private platformId = inject(PLATFORM_ID);
  private sessionSubject = new BehaviorSubject<User | null | undefined>(
    undefined
  );

  session$ = this.sessionSubject.asObservable().pipe(shareReplay(1));

  constructor() {
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
      .pipe(tap(() => this.sessionSubject.next(null)));
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

  changeAvatar(avatar: File) {
    const formData = new FormData();
    formData.append('avatar', avatar);

    return this.http.patch(
      `${environment.serverUrl}/users/change-avatar`,
      formData,
      { withCredentials: true, reportProgress: true, observe: 'events' }
    );
  }

  isAuthenticated(): Observable<boolean> {
    return this.getSession().pipe(
      catchError(() => of(false)),
      map((session) => !!session)
    );
  }

  ngOnDestroy(): void {
    this.sessionSubject.complete();
  }
}
