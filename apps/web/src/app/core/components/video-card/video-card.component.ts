import { Component, Input, inject } from '@angular/core';
import { Video } from '../../../shared/interfaces/video';
import { Router } from '@angular/router';

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
