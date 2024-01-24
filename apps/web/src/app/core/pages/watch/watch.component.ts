import { isPlatformServer } from '@angular/common';
import {
  Component,
  Inject,
  Input,
  OnInit,
  PLATFORM_ID,
  inject,
} from '@angular/core';
import { Observable, of } from 'rxjs';
import { Video } from '../../../shared/interfaces/video';
import { VideoService } from '../../../shared/services/video.service';

@Component({
  selector: 'app-watch',
  templateUrl: './watch.component.html',
  styleUrl: './watch.component.scss',
})
export class WatchComponent implements OnInit {
  private videoService = inject(VideoService);
  @Input() videoId: string = '';
  video$: Observable<Video> = of();

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit(): void {
    if (isPlatformServer(this.platformId)) return;
    this.video$ = this.videoService.getVideo(this.videoId);
  }
}
