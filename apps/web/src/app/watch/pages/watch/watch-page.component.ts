import { isPlatformServer } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, map, switchMap } from 'rxjs';

import { VideoWithSubscriptionInfo } from '~/app/shared/interfaces/api-response.interface';
import { Video } from '~/app/shared/interfaces/video.interface';
import { VideoService } from '~shared/services/video.service';

@Component({
  selector: 'app-watch',
  templateUrl: './watch-page.component.html',
  styleUrl: './watch-page.component.scss',
})
export class WatchPageComponent implements OnInit {
  private videoService = inject(VideoService);
  private activatedRoute = inject(ActivatedRoute);

  video$!: Observable<VideoWithSubscriptionInfo>;
  recommendation$!: Observable<Video[]>;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit(): void {
    if (isPlatformServer(this.platformId)) return;

    this.video$ = this.activatedRoute.paramMap.pipe(
      switchMap((params) =>
        this.videoService.getVideo(<string>params.get('videoId'))
      )
    );

    this.recommendation$ = this.video$.pipe(
      switchMap((video) =>
        this.videoService
          .getVideos({ userId: video.owner._id })
          .pipe(map((data) => data.videos))
      )
    );
  }
}
