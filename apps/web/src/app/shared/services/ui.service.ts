import { isPlatformServer } from '@angular/common';
import {
  Injectable,
  OnDestroy,
  PLATFORM_ID,
  inject,
  signal,
} from '@angular/core';
import { Subject, debounceTime, fromEvent, takeUntil } from 'rxjs';

type SidebarState = 'expanded' | 'collapsed';

@Injectable({
  providedIn: 'root',
})
export class UiService implements OnDestroy {
  sidebarState = signal<SidebarState>('expanded');
  private destroy$ = new Subject<void>();
  private platformId = inject(PLATFORM_ID);

  toggleSidebar() {
    this.sidebarState.set(
      this.sidebarState() == 'expanded' ? 'collapsed' : 'expanded'
    );
  }

  constructor() {
    if (isPlatformServer(this.platformId)) return;

    fromEvent(window, 'resize')
      .pipe(debounceTime(100), takeUntil(this.destroy$))
      .subscribe(() => {
        const SMALL_SCREEN_WIDTH = 640;
        const isSmallScreen = window.innerWidth < SMALL_SCREEN_WIDTH;

        if (isSmallScreen && this.sidebarState() == 'expanded') {
          this.sidebarState.set('collapsed');
        } else if (!isSmallScreen && this.sidebarState() == 'collapsed') {
          this.sidebarState.set('expanded');
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
