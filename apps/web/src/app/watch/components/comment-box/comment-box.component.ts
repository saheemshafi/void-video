import {
  ChangeDetectionStrategy,
  Component,
  Input,
  inject,
} from '@angular/core';
import { Observable, Subject, filter, map, startWith, switchMap } from 'rxjs';

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
  private commentAdded = new Subject<Comment>();
  comments$!: Observable<Comment[]>;

  ngOnInit() {
    this.comments$ = this.commentAdded.pipe(
      startWith(null),
      switchMap(() => this.videoService.getComments(this.videoId))
    );
  }

  onAddComment(comment: Comment) {
    this.commentAdded.next(comment);
  }
}
