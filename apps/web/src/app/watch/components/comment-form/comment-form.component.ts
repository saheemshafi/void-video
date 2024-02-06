import { Component, Input, inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { take } from 'rxjs';

import { VideoService } from '~shared/services/video.service';

@Component({
  selector: 'app-comment-form',
  templateUrl: './comment-form.component.html',
  styleUrl: './comment-form.component.scss',
})
export class CommentFormComponent {
  @Input({ required: true }) videoId: string = '';
  private fb = inject(FormBuilder);
  private videoService = inject(VideoService);
  commentForm = this.fb.group({
    comment: this.fb.control('', { validators: [Validators.minLength(2)] }),
  });

  comment(): void {
    if (this.commentForm.invalid) return;

    this.videoService
      .comment(this.videoId, this.commentForm.value?.comment || '')
      .pipe(take(1))
      .subscribe({ next: () => this.commentForm.reset() });
  }
}
