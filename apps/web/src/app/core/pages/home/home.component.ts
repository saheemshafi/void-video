import { Component, inject } from '@angular/core';
import { map } from 'rxjs';

import { VideoService } from '~shared/services/video.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  private videoService = inject(VideoService);
  videos$ = this.videoService
    .getVideos({ limit: 21 })
    .pipe(map((data) => data.videos));
}
