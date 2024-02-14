import { isPlatformServer } from '@angular/common';
import { Injectable, OnDestroy, PLATFORM_ID, inject } from '@angular/core';
import {
  BehaviorSubject,
  Subscription,
  combineLatest,
  fromEvent,
  startWith,
} from 'rxjs';

export type Theme = 'system' | 'dark' | 'light';

@Injectable({
  providedIn: 'root',
})
export class ThemeService implements OnDestroy {
  private themeSubject = new BehaviorSubject<Theme | null>(null);
  private themeSubscription!: Subscription;
  private platformId = inject(PLATFORM_ID);

  theme$ = this.themeSubject.asObservable();

  constructor() {
    if (isPlatformServer(this.platformId)) return;

    const theme = localStorage.getItem('theme');
    this.themeSubject.next(<Theme>theme || 'system');

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    this.themeSubscription = combineLatest([
      fromEvent(mediaQuery, 'change').pipe(startWith(null)),
      this.themeSubject,
    ]).subscribe(([_, theme]) => {
      if (!theme) return;

      if (theme == 'system') {
        document.documentElement.className = mediaQuery.matches ? 'dark' : '';
        return;
      } else {
        document.documentElement.className = theme;
      }
    });
  }

  setTheme(theme: Theme): void {
    this.themeSubject.next(theme);
    localStorage.setItem('theme', theme);
  }

  ngOnDestroy(): void {
    this.themeSubscription?.unsubscribe();
    this.themeSubject.complete();
  }
}
