import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'app-comment-box',
  templateUrl: './comment-box.component.html',
  styleUrl: './comment-box.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CommentBoxComponent {
  @Input({ required: true }) videoId: string = '';
}
