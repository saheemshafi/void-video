import { Component, inject } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { AuthService } from '../../../shared/services/auth.service';
import { filter, map, startWith, tap } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  currentPageUrl$ = this.router.events.pipe(
    filter((event) => event instanceof NavigationEnd),
    map((event) => (event.type == 1 ? event.url : '')),
    startWith(this.router.url)
  );

  session$ = this.authService.session$;
}
