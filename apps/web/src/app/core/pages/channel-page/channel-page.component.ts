import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-channel-page',
  templateUrl: './channel-page.component.html',
  styleUrl: './channel-page.component.scss',
})
export class ChannelPageComponent {
  @Input() username: string = '';
}
