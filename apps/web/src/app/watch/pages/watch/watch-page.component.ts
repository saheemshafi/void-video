import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, map, shareReplay, switchMap } from 'rxjs';

import { Subscription } from '~shared/interfaces/subscription.interface';
import { Video } from '~shared/interfaces/video.interface';
import { VideoService } from '~shared/services/video.service';

@Component({
  selector: 'app-watch',
  templateUrl: './watch-page.component.html',
  styleUrl: './watch-page.component.scss',
})
export class WatchPageComponent implements OnInit {
  private videoService = inject(VideoService);

  private activatedRoute = inject(ActivatedRoute);

  video$!: Observable<Video & { owner: Subscription }>;
  recommendation$!: Observable<Video[]>;

  ngOnInit(): void {
    this.video$ = this.activatedRoute.paramMap
      .pipe(
        switchMap((params) =>
          this.videoService.getVideo(<string>params.get('videoId'))
        )
      )
      .pipe(shareReplay(1));

    this.recommendation$ = this.video$.pipe(
      switchMap((video) =>
        this.videoService
          .getVideos({ username: video.owner.username })
          .pipe(map((data) => data.videos))
      )
    );
  }
}
