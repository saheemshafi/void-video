import { Component, inject } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Subject, filter, map, startWith, switchMap, tap } from 'rxjs';

import { UiService } from '~shared/services/ui.service';
import { AuthService } from '~shared/services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  private authService = inject(AuthService);
  private uiService = inject(UiService);
  private router = inject(Router);

  sidebarState = this.uiService.sidebarState;

  currentPageUrl$ = this.router.events.pipe(
    filter((event) => event instanceof NavigationEnd),
    map((event) => (event.type == 1 ? event.url : '')),
    startWith(this.router.url)
  );

  session$ = this.authService.session$;

  toggleSidebar() {
    this.uiService.toggleSidebar();
  }
}
