import { Component, Input, inject } from '@angular/core';
import { Router } from '@angular/router';

import { Video } from '~/app/shared/interfaces/video.interface';

@Component({
  selector: 'app-video-card',
  templateUrl: './video-card.component.html',
  styleUrl: './video-card.component.scss',
})
export class VideoCardComponent {
  @Input({ required: true }) video!: Video;
  private router = inject(Router);

  navigateToVideo() {
    this.router.navigate(['/watch', this.video._id]);
  }
}
