import {
  Component,
  Inject,
  Input,
  OnInit,
  PLATFORM_ID,
  inject,
} from '@angular/core';
import { Video } from '../../../shared/interfaces/video';
import { VideoWithSubscriptionInfo } from '../../../shared/interfaces/api-response';
import { isPlatformServer } from '@angular/common';
import { BehaviorSubject, Observable, map, of, take } from 'rxjs';
import { VideoService } from '../../../shared/services/video.service';

@Component({
  selector: 'app-watch-page-channel-bar',
  templateUrl: './watch-page-channel-bar.component.html',
  styleUrl: './watch-page-channel-bar.component.scss',
})
export class WatchPageChannelBarComponent implements OnInit {
  @Input() video!: VideoWithSubscriptionInfo;
  private videoService = inject(VideoService);

  isLiked$: Observable<boolean | undefined> = of(undefined);

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit() {
    if (isPlatformServer(this.platformId)) return;

    this.isLiked$ = this.videoService
      .getLikeStatus(this.video._id)
      .pipe(map((response) => response.isLiked));
  }

  ngOnChanges() {
    this.isLiked$ = this.videoService
      .getLikeStatus(this.video._id)
      .pipe(map((response) => response.isLiked));
  }

  toggleLike(): void {
    this.videoService
      .toggleVideoLike(this.video._id)
      .pipe(take(1))
      .subscribe({
        next: (response) => {
          if (response.status == 201) {
            this.isLiked$ = of(true);
            this.video.likes++;
          } else if (response.status == 200) {
            this.isLiked$ = of(false);
            this.video.likes--;
          }
        },
        error: () => {
          // TODO: Show error toast
        },
      });
  }
}
