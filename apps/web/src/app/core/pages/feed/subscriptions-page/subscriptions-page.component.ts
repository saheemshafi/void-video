import { Component, Inject, OnInit, PLATFORM_ID, inject } from '@angular/core';
import { UserService } from '../../../../shared/services/user.service';
import { AuthService } from '../../../../shared/services/auth.service';
import { isPlatformServer } from '@angular/common';
import { Observable, of } from 'rxjs';
import { Subscription } from '../../../../shared/interfaces/api-response';

@Component({
  selector: 'app-subscriptions-page',
  templateUrl: './subscriptions-page.component.html',
  styleUrl: './subscriptions-page.component.scss',
})
export class SubscriptionsPageComponent implements OnInit {
  private userService = inject(UserService);
  private authService = inject(AuthService);
  session$ = this.authService.session$;
  subscriptions$: Observable<Subscription[]> = of();

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}
  ngOnInit(): void {
    if (isPlatformServer(this.platformId)) return;
    this.subscriptions$ = this.userService.getSubscribedChannels();
  }
}
