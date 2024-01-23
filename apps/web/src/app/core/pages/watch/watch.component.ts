import { Component, Input, OnInit, inject } from '@angular/core';
import { VideoService } from '../../../shared/services/video.service';
import { ActivatedRoute } from '@angular/router';
import { Observable, map, of, switchMap, tap } from 'rxjs';
import { Video } from '../../../shared/interfaces/video';

@Component({
  selector: 'app-watch',
  templateUrl: './watch.component.html',
  styleUrl: './watch.component.scss',
})
export class WatchComponent {
  private videoService = inject(VideoService);

  @Input() videoId: string = '';

  video$: Observable<Video> = of();

  ngOnInit() {
    this.video$ = this.videoService.getVideo(this.videoId);
  }
}
