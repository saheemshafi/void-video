import { isPlatformServer } from '@angular/common';
import { Component, Input, PLATFORM_ID, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, switchMap } from 'rxjs';

import { Channel } from '~shared/interfaces/user.interface';
import { UserService } from '~shared/services/user.service';

@Component({
  selector: 'app-channel-layout',
  templateUrl: './channel-layout.component.html',
  styleUrl: './channel-layout.component.scss',
})
export class ChannelLayoutComponent {
  private userService = inject(UserService);
  private activatedRoute = inject(ActivatedRoute);
  @Input() username: string = '';
  channel$!: Observable<Channel>;
  private _platformId = inject(PLATFORM_ID);

  ngOnInit(): void {
    if (isPlatformServer(this._platformId)) return;
    this.channel$ = this.activatedRoute.paramMap.pipe(
      switchMap((params) =>
        this.userService.getChannel(<string>params.get('username'))
      )
    );
  }
}
