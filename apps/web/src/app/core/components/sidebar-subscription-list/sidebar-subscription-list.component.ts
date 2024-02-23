import { isPlatformServer } from '@angular/common';
import { Component, PLATFORM_ID, inject } from '@angular/core';
import { Observable, startWith } from 'rxjs';
import { Subscription } from '~/app/shared/interfaces/subscription.interface';

import { AuthService } from '~shared/services/auth.service';
import { UserService } from '~shared/services/user.service';

@Component({
  selector: 'app-sidebar-subscription-list',
  templateUrl: './sidebar-subscription-list.component.html',
  styleUrl: './sidebar-subscription-list.component.scss',
})
export class SidebarSubscriptionListComponent {
  private userService = inject(UserService);
  private authService = inject(AuthService);
  private platformId = inject(PLATFORM_ID);

  placeholders = Array.from(new Array(5), (_, i) => i);
  session$ = this.authService.session$;
  subscriptions$!: Observable<Subscription[]>;

  ngOnInit() {
    if (isPlatformServer(this.platformId)) return;

    this.subscriptions$ = this.userService.getSubscribedChannels();
  }
}
