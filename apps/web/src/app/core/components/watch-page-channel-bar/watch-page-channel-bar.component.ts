import { Component, Input } from '@angular/core';
import { Video } from '../../../shared/interfaces/video';

@Component({
  selector: 'app-watch-page-channel-bar',
  templateUrl: './watch-page-channel-bar.component.html',
  styleUrl: './watch-page-channel-bar.component.scss',
})
export class WatchPageChannelBarComponent {
  @Input() video!: Video;
}
