import { isPlatformServer } from '@angular/common';
import {
  Injectable,
  OnDestroy,
  PLATFORM_ID,
  inject,
  signal,
} from '@angular/core';
import { Subject, debounceTime, fromEvent, takeUntil, timer } from 'rxjs';

type SidebarState = 'expanded' | 'collapsed';

@Injectable({
  providedIn: 'root',
})
export class UiService implements OnDestroy {
  sidebarState = signal<SidebarState>('collapsed');
  private destroy$ = new Subject<void>();
  private platformId = inject(PLATFORM_ID);
  private readonly SMALL_SCREEN_WIDTH: number = 640;

  toggleSidebar() {
    this.sidebarState.set(
      this.sidebarState() == 'expanded' ? 'collapsed' : 'expanded'
    );
  }

  constructor() {
    if (isPlatformServer(this.platformId)) return;

    timer(500)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.handleSidebarState();
      });

    const initialWindowWidth = window.innerWidth;
    fromEvent(window, 'resize')
      .pipe(debounceTime(100), takeUntil(this.destroy$))
      .subscribe((e) => {
        if (initialWindowWidth !== window.innerWidth) {
          this.handleSidebarState();
        }
      });
  }

  private handleSidebarState() {
    const isSmallScreen = window.innerWidth < this.SMALL_SCREEN_WIDTH;

    if (isSmallScreen && this.sidebarState() == 'expanded') {
      this.sidebarState.set('collapsed');
    } else if (!isSmallScreen && this.sidebarState() == 'collapsed') {
      this.sidebarState.set('expanded');
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
