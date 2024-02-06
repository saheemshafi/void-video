import { Component, Input, inject } from '@angular/core';
import { HotToastService } from '@ngneat/hot-toast';
import { take } from 'rxjs';

import { Comment } from '~shared/interfaces/comment.interface';
import { CommentService } from '~shared/services/comment.service';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrl: './comment.component.scss',
})
export class CommentComponent {
  @Input({ required: true }) comment!: Comment;
  private commentService = inject(CommentService);
  private toast = inject(HotToastService);

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
}
