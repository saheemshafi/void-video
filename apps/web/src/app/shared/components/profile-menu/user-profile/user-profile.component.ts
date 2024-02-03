import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { AuthService } from '~shared/services/auth.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserProfileComponent {
  private authService = inject(AuthService);
  session$ = this.authService.session$;

  logout(): void {
    this.authService.logout().subscribe(() => {
      location.reload();
    });
  }
}
