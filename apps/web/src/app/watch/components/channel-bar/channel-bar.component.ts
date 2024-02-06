import { Component, Input } from '@angular/core';
import { VideoWithSubscriptionInfo } from '~shared/interfaces/api-response.interface';

@Component({
  selector: 'app-channel-bar',
  templateUrl: './channel-bar.component.html',
  styleUrl: './channel-bar.component.scss',
})
export class ChannelBarComponent {
  @Input() video!: VideoWithSubscriptionInfo;
}
