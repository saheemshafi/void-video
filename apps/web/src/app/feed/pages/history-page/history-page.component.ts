import { Component, Inject, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformServer } from '@angular/common';
import { Observable } from 'rxjs';

import { UserService } from '~shared/services/user.service';
import { Video } from '~shared/interfaces/video';

@Component({
  selector: 'app-history-page',
  templateUrl: './history-page.component.html',
  styleUrl: './history-page.component.scss',
})
export class HistoryPageComponent {
  private userService = inject(UserService);
  watchHistory$!: Observable<Video[]>;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}
  ngOnInit() {
    if (isPlatformServer(this.platformId)) return;
    this.watchHistory$ = this.userService.getWatchHistory();
  }
}
