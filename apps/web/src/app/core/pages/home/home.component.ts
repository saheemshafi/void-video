import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import {
  BehaviorSubject,
  Subscription,
  exhaustMap,
  tap,
  throttleTime,
} from 'rxjs';

import { Video } from '~shared/interfaces/video.interface';
import { VideoService } from '~shared/services/video.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit, OnDestroy {
  private videoService = inject(VideoService);

  private nextPage: number | null = null;
  private videosSubscription!: Subscription;
  private totalPages: number = 1;
  private page$ = new BehaviorSubject(1);

  placeholders = Array.from(new Array(6), (_, i) => i);
  loading$ = new BehaviorSubject(false);
  videos!: Video[];

  ngOnInit(): void {
    this.videosSubscription = this.page$
      .pipe(
        tap(() => this.loading$.next(true)),
        exhaustMap((page) => this.videoService.getVideos({ limit: 9, page })),
        tap(() => this.loading$.next(false)),
        throttleTime(200)
      )
      .subscribe((data) => {
        this.nextPage = data.nextPage;
        this.totalPages = data.totalPages;

        this.videos = (this.videos ?? []).concat(data.videos);
      });
  }

  next() {
    if (this.nextPage) {
      this.page$.next(this.nextPage);
    }
  }

  ngOnDestroy(): void {
    this.videosSubscription?.unsubscribe();
  }
}
