import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-share-button',
  templateUrl: './share-button.component.html',
  styleUrl: './share-button.component.scss',
})
export class ShareButtonComponent {
  @Input({ required: true }) videoId: string = '';
}
