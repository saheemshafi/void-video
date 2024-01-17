import { isPlatformServer } from '@angular/common';
import { Inject, Injectable, OnDestroy, PLATFORM_ID } from '@angular/core';
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
  private themeSubject = new BehaviorSubject<Theme>('system');
  private themeSubscription!: Subscription;

  theme$ = this.themeSubject.asObservable();

  constructor(@Inject(PLATFORM_ID) private _platformId: Object) {
    if (isPlatformServer(this._platformId)) return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    this.themeSubscription = combineLatest([
      fromEvent(mediaQuery, 'change').pipe(startWith(null)),
      this.themeSubject,
    ]).subscribe(([_, theme]) => {
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
  }

  ngOnDestroy(): void {
    this.themeSubscription?.unsubscribe();
    this.themeSubject.complete();
  }
}
