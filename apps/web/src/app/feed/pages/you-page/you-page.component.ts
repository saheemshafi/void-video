import { isPlatformServer } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID, inject } from '@angular/core';
import { Observable, filter, map, of, switchMap } from 'rxjs';

import { UserService } from '~shared/services/user.service';
import { VideoService } from '~shared/services/video.service';
import { AuthService } from '~shared/services/auth.service';
import { PlaylistService } from '~shared/services/playlist.service';
import { Video } from '~/app/shared/interfaces/video.interface';
import { Playlist } from '~/app/shared/interfaces/playlist.interface';

@Component({
  selector: 'app-you-page',
  templateUrl: './you-page.component.html',
  styleUrl: './you-page.component.scss',
})
export class YouPageComponent implements OnInit {
  private userService = inject(UserService);
  private videoService = inject(VideoService);
  private authService = inject(AuthService);
  private playlistService = inject(PlaylistService);

  history$: Observable<Video[] | null> = of(null);
  uploads$: Observable<Video[] | null> = of(null);
  playlists$: Observable<Playlist[] | null> = of(null);
  likedVideos$: Observable<Video[] | null> = of(null);

  session$ = this.authService.session$;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}
  ngOnInit(): void {
    if (isPlatformServer(this.platformId)) return;

    this.history$ = this.userService.getWatchHistory();

    this.uploads$ = this.session$.pipe(
      filter((session) => !!session),
      switchMap((session) =>
        this.videoService
          .getVideos({ userId: session?._id, limit: 6 })
          .pipe(map((data) => data.videos))
      )
    );

    this.playlists$ = this.session$.pipe(
      filter((session) => !!session),
      switchMap((session) =>
        this.playlistService
          .getPlaylists({ userId: session?._id, limit: 6 })
          .pipe(map((data) => data.playlists))
      )
    );

    this.likedVideos$ = this.userService
      .getLikedVideos({ limit: 6 })
      .pipe(map((data) => (data.videos.length > 0 ? data.videos : null)));
  }
}
