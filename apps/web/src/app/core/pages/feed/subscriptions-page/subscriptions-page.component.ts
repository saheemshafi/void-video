import { Component, inject } from '@angular/core';
import { UserService } from '../../../../shared/services/user.service';
import { AuthService } from '../../../../shared/services/auth.service';

@Component({
  selector: 'app-subscriptions-page',
  templateUrl: './subscriptions-page.component.html',
  styleUrl: './subscriptions-page.component.scss',
})
export class SubscriptionsPageComponent {
  private userService = inject(UserService);
  private authService = inject(AuthService);
  session$ = this.authService.session$;
  subscriptions$ = this.userService.subscribedChannels$;
}
