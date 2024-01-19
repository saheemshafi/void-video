import { Component, inject } from '@angular/core';
import { UserService } from '../../../../shared/services/user.service';

@Component({
  selector: 'app-subscriptions-page',
  templateUrl: './subscriptions-page.component.html',
  styleUrl: './subscriptions-page.component.scss',
})
export class SubscriptionsPageComponent {

  private userService = inject(UserService);
  subscriptions$ = this.userService.subscribedChannels$;
  
}
