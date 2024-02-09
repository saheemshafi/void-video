import {
  ChangeDetectionStrategy,
  Component,
  Input,
  inject,
} from '@angular/core';
import { HotToastService } from '@ngneat/hot-toast';
import { take } from 'rxjs';

import { Comment } from '~shared/interfaces/comment.interface';
import { CommentService } from '~shared/services/comment.service';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrl: './comment.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CommentComponent {
  @Input({ required: true }) comment!: Comment;
  private commentService = inject(CommentService);
  private toast = inject(HotToastService);
  showReplies: boolean = false;
  isReplying: boolean = false;

  toggleCommentLike() {
    this.commentService
      .toggleCommentLike(this.comment._id)
      .pipe(take(1))
      .subscribe({
        next: (response) => {
          this.toast.show(response.message);
        },
        error: ({ error }) => this.toast.show(error?.message),
      });
  }

  toggleReplies() {
    this.showReplies = !this.showReplies;
  }

  toggleIsReplying() {
    this.isReplying = !this.isReplying;
  }

  onReplyFormClosed(comment: Comment | undefined) {
    console.log(comment);
    if (comment) {
      this.comment.replies.push(comment);
      this.showReplies = true;
    }

    this.isReplying = false;
  }
}
