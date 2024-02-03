import { isPlatformServer } from '@angular/common';
import {
  Component,
  Inject,
  Input,
  OnInit,
  PLATFORM_ID,
  SimpleChanges,
  inject,
} from '@angular/core';
import { Router } from '@angular/router';
import {
  Observable,
  of,
  shareReplay,
  switchMap,
  take,
  tap
} from 'rxjs';
import { AuthService } from '~/app/shared/services/auth.service';
import { VideoWithSubscriptionInfo } from '~shared/interfaces/api-response';
import { VideoService } from '~shared/services/video.service';

@Component({
  selector: 'app-watch-page-channel-bar',
  templateUrl: './watch-page-channel-bar.component.html',
  styleUrl: './watch-page-channel-bar.component.scss',
})
export class WatchPageChannelBarComponent implements OnInit {
  @Input() video!: VideoWithSubscriptionInfo;
  private videoService = inject(VideoService);
  private authService = inject(AuthService);
  private router = inject(Router);

  session$ = this.authService.session$;

  isLiked$: Observable<boolean | undefined> = of(undefined);

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit() {
    if (isPlatformServer(this.platformId)) return;
    this.isLiked$ = this.videoService
      .getLikeStatus(this.video._id)
      .pipe(shareReplay(1));
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['video'].isFirstChange() || isPlatformServer(this.platformId))
      return;
    this.isLiked$ = this.videoService.getLikeStatus(this.video._id);
  }

  toggleLike(): void {
    this.authService.session$
      .pipe(
        tap(
          (session) =>
            !session &&
            this.router.navigate(['/auth'], {
              queryParams: { 'callback-url': this.router.url },
            })
        ),
        switchMap(() => this.videoService.toggleVideoLike(this.video._id))
      )
      .pipe(take(1))
      .subscribe((response) => {
        if (response.status == 201) {
          this.isLiked$ = of(true);
          this.video.likes++;
        } else if (response.status == 200) {
          this.isLiked$ = of(false);
          this.video.likes--;
        }
      });
  }
}
