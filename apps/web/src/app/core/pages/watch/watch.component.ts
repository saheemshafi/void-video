import { isPlatformServer } from '@angular/common';
import {
  Component,
  Inject,
  Input,
  OnInit,
  PLATFORM_ID,
  inject,
} from '@angular/core';
import { Observable, map, of, switchMap } from 'rxjs';
import { Video } from '../../../shared/interfaces/video';
import { VideoService } from '../../../shared/services/video.service';
import { VideoWithSubscriptionInfo } from '../../../shared/interfaces/api-response';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-watch',
  templateUrl: './watch.component.html',
  styleUrl: './watch.component.scss',
})
export class WatchComponent implements OnInit {
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
