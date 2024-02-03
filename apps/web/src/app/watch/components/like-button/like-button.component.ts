import { isPlatformServer } from '@angular/common';
import {
  Component,
  Inject,
  Input,
  PLATFORM_ID,
  SimpleChanges,
  inject,
} from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of, shareReplay, tap, switchMap, take } from 'rxjs';

import { AuthService } from '~/app/shared/services/auth.service';
import { VideoService } from '~/app/shared/services/video.service';

@Component({
  selector: 'app-like-button',
  templateUrl: './like-button.component.html',
  styleUrl: './like-button.component.scss',
})
export class LikeButtonComponent {
  @Input({ required: true }) videoId: string = '';
  @Input({ required: true }) totalLikes: number = 0;

  private videoService = inject(VideoService);
  private authService = inject(AuthService);
  private router = inject(Router);

  session$ = this.authService.session$;

  isLiked$: Observable<boolean | undefined> = of(undefined);

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit() {
    if (isPlatformServer(this.platformId)) return;
    this.isLiked$ = this.videoService
      .getLikeStatus(this.videoId)
      .pipe(shareReplay(1));
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['videoId'].isFirstChange() || isPlatformServer(this.platformId))
      return;
    this.isLiked$ = this.videoService.getLikeStatus(this.videoId);
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
        switchMap(() => this.videoService.toggleVideoLike(this.videoId))
      )
      .pipe(take(1))
      .subscribe((response) => {
        if (response.status == 201) {
          this.isLiked$ = of(true);
          this.totalLikes++;
        } else if (response.status == 200) {
          this.isLiked$ = of(false);
          this.totalLikes--;
        }
      });
  }
}
