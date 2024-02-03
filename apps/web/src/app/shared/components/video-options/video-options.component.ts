import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-video-options',
  templateUrl: './video-options.component.html',
  styleUrl: './video-options.component.scss',
})
export class VideoOptionsComponent {
  @Input({ required: true }) videoId: string = '';
}
