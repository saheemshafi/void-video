import { Component, inject } from '@angular/core';
import { AuthService } from '../../../shared/services/auth.service';
import { VideoService } from '../../../shared/services/video.service';
import { map } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  private videoService = inject(VideoService);
  videosResponse$ = this.videoService.videos$;
  videos$ = this.videosResponse$.pipe(map((data) => data.videos));
}
