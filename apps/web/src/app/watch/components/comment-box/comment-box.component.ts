import {
  ChangeDetectionStrategy,
  Component,
  Input,
  inject,
} from '@angular/core';
import { Observable, map } from 'rxjs';

import { Comment } from '~shared/interfaces/comment.interface';
import { Paginated } from '~shared/interfaces/utils.interface';
import { VideoService } from '~shared/services/video.service';

@Component({
  selector: 'app-comment-box',
  templateUrl: './comment-box.component.html',
  styleUrl: './comment-box.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CommentBoxComponent {
  @Input({ required: true }) videoId: string = '';
  private videoService = inject(VideoService);
  comments$!: Observable<Paginated<Comment[], 'comments'>>;

  ngOnInit() {
    this.comments$ = this.videoService.getComments(this.videoId);
  }
}
