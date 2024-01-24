import { Component, inject } from '@angular/core';
import { UserService } from '../../../shared/services/user.service';
import { map } from 'rxjs';
import { AuthService } from '../../../shared/services/auth.service';

@Component({
  selector: 'app-sidebar-subscription-list',
  templateUrl: './sidebar-subscription-list.component.html',
  styleUrl: './sidebar-subscription-list.component.scss',
})
export class SidebarSubscriptionListComponent {
  private userService = inject(UserService);
  private authService = inject(AuthService);

  session$ = this.authService.session$;
  subscriptions$ = this.userService.getSubscribedChannels();
}
