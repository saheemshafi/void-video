import { isPlatformServer } from '@angular/common';
import { Component, PLATFORM_ID, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { Video } from '~shared/interfaces/video.interface';
import { UserService } from '~shared/services/user.service';

@Component({
  selector: 'app-history-page',
  templateUrl: './history-page.component.html',
  styleUrl: './history-page.component.scss',
})
export class HistoryPageComponent {
  private userService = inject(UserService);
  private platformId = inject(PLATFORM_ID);
  watchHistory$!: Observable<Video[]>;

  ngOnInit() {
    if (isPlatformServer(this.platformId)) return;
    this.watchHistory$ = this.userService.getWatchHistory();
  }
}
