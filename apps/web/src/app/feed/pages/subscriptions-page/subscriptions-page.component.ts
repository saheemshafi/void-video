import { isPlatformServer } from '@angular/common';
import { Component, OnInit, PLATFORM_ID, inject } from '@angular/core';
import { Observable, of } from 'rxjs';

import { Subscription } from '~shared/interfaces/subscription.interface';
import { AuthService } from '~shared/services/auth.service';
import { UserService } from '~shared/services/user.service';

@Component({
  selector: 'app-subscriptions-page',
  templateUrl: './subscriptions-page.component.html',
  styleUrl: './subscriptions-page.component.scss',
})
export class SubscriptionsPageComponent implements OnInit {
  private userService = inject(UserService);
  private authService = inject(AuthService);
  private platformId = inject(PLATFORM_ID);
  session$ = this.authService.session$;
  subscriptions$: Observable<Subscription[]> = of();

  ngOnInit(): void {
    if (isPlatformServer(this.platformId)) return;
    this.subscriptions$ = this.userService.getSubscribedChannels();
  }
}
