import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-channel-home-page',
  templateUrl: './channel-home-page.component.html',
  styleUrl: './channel-home-page.component.scss',
})
export class ChannelHomePageComponent {
  @Input() username: string = '';
}
