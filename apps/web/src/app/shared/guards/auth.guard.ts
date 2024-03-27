import { isPlatformServer } from '@angular/common';
import { inject, PLATFORM_ID } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map, tap } from 'rxjs';
import { AuthService } from '~shared/services/auth.service';

const protectedRoutes = ['/studio'] as const;

const isAuthRoute = (route: string): boolean => route.startsWith('/auth');
const needsAuth = (route: string) =>
  protectedRoutes.some((basePath) => route.startsWith(basePath));

export const authGuard: CanActivateFn = (_, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const platformId = inject(PLATFORM_ID);

  if (
    isPlatformServer(platformId) &&
    (isAuthRoute(state.url) || needsAuth(state.url))
  ) {
    return false;
  }

  return authService.isAuthenticated().pipe(
    map((isAuthenticated) => {
      if (isAuthRoute(state.url) && !isAuthenticated) {
        return true;
      }

      if (isAuthRoute(state.url) && isAuthenticated) {
        router.navigate(['/']);
        return false;
      }

      return isAuthenticated;
    }),
    tap((isAllowed) => !isAllowed && router.navigate(['/auth']))
  );
};
