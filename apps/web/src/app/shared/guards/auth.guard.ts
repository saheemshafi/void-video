import { isPlatformServer } from '@angular/common';
import { PLATFORM_ID, inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { catchError, map, of, tap } from 'rxjs';
import { AuthService } from '~shared/services/auth.service';

const isAuthRoute = (route: string): boolean => route.startsWith('/auth');

export const authGuard: CanActivateFn = (_, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const platformId = inject(PLATFORM_ID);

  if (isPlatformServer(platformId) && isAuthRoute(state.url)) return false;

  if (isPlatformServer(platformId) && !isAuthRoute(state.url)) return true;

  return authService.getSession().pipe(
    catchError(() => of(false)),
    map((session) => (session ? false : true)),
    tap((isAuthenticated) => !isAuthenticated && router.navigate(['/']))
  );
};
