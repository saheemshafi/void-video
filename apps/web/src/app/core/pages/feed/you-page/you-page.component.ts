import { isPlatformServer } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID, inject } from '@angular/core';
import { Observable, map, of, switchMap } from 'rxjs';
import { Video } from '../../../../shared/interfaces/video';
import { AuthService } from '../../../../shared/services/auth.service';
import { UserService } from '../../../../shared/services/user.service';
import { VideoService } from '../../../../shared/services/video.service';

@Component({
  selector: 'app-you-page',
  templateUrl: './you-page.component.html',
  styleUrl: './you-page.component.scss',
})
export class YouPageComponent implements OnInit {
  private userService = inject(UserService);
  private videoService = inject(VideoService);
  private authService = inject(AuthService);

  history$: Observable<Video[] | null> = of(null);
  uploads$: Observable<Video[] | null> = of(null);

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}
  ngOnInit(): void {
    if (isPlatformServer(this.platformId)) return;

    this.history$ = this.userService.getWatchHistory();

    this.uploads$ = this.authService.session$.pipe(
      switchMap((session) =>
        this.videoService
          .getVideos({ userId: session?._id, limit: 6 })
          .pipe(map((data) => data.videos))
      )
    );
  }
}
