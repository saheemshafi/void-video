import {
  Component,
  Input
} from '@angular/core';
import { VideoWithSubscriptionInfo } from '~/app/shared/interfaces/api-response.interface';

@Component({
  selector: 'app-watch-page-channel-bar',
  templateUrl: './watch-page-channel-bar.component.html',
  styleUrl: './watch-page-channel-bar.component.scss',
})
export class WatchPageChannelBarComponent {
  @Input() video!: VideoWithSubscriptionInfo;
}
