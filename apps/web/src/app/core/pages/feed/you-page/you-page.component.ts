import { isPlatformServer } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID, inject } from '@angular/core';
import { Observable, filter, map, of, switchMap } from 'rxjs';
import { Video } from '../../../../shared/interfaces/video';
import { AuthService } from '../../../../shared/services/auth.service';
import { UserService } from '../../../../shared/services/user.service';
import { VideoService } from '../../../../shared/services/video.service';
import { PlaylistService } from '../../../../shared/services/playlist.service';
import { Playlist } from '../../../../shared/interfaces/playlist';

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

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}
  ngOnInit(): void {
    if (isPlatformServer(this.platformId)) return;

    this.history$ = this.userService.getWatchHistory();

    this.uploads$ = this.authService.session$.pipe(
      filter((session) => !!session),
      switchMap((session) =>
        this.videoService
          .getVideos({ userId: session?._id, limit: 6 })
          .pipe(map((data) => data.videos))
      )
    );

    this.playlists$ = this.authService.session$.pipe(
      filter((session) => !!session),
      switchMap((session) =>
        this.playlistService
          .getPlaylists({ userId: session?._id, limit: 6 })
          .pipe(map((data) => data.playlists))
      )
    );

    this.likedVideos$ = this.userService
      .getLikedVideos()
      .pipe(map((data) => (data.videos.length > 0 ? data.videos : null)));
  }
}
