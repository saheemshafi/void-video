import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, map, switchMap } from 'rxjs';

import { Video } from '~shared/interfaces/video.interface';
import { VideoService } from '~shared/services/video.service';

@Component({
  selector: 'app-videos-page',
  templateUrl: './videos-page.component.html',
  styleUrl: './videos-page.component.scss',
})
export class VideosPageComponent implements OnInit {
  private videoService = inject(VideoService);
  private activatedRoute = inject(ActivatedRoute);
  videos!: Observable<Video[]>;

  ngOnInit(): void {
    if (!this.activatedRoute.parent) return;

    this.videos = this.activatedRoute.parent.paramMap.pipe(
      switchMap((params) =>
        this.videoService
          .getVideos({ username: <string>params.get('username') })
          .pipe(map((response) => response.videos))
      )
    );
  }
}
