import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-channel-layout',
  templateUrl: './channel-layout.component.html',
  styleUrl: './channel-layout.component.scss',
})
export class ChannelLayoutComponent {
  @Input() username: string = '';
}
