import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  Output,
  inject,
} from '@angular/core';
import { FormBuilder, NgForm, Validators } from '@angular/forms';
import { BehaviorSubject, Subject, take } from 'rxjs';

import { Comment } from '~shared/interfaces/comment.interface';
import { VideoService } from '~shared/services/video.service';

@Component({
  selector: 'app-comment-form',
  templateUrl: './comment-form.component.html',
  styleUrl: './comment-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CommentFormComponent {
  @Input({ required: true }) videoId: string = '';
  private fb = inject(FormBuilder);
  private videoService = inject(VideoService);
  private cdr = inject(ChangeDetectorRef);
  @Output() commentAdded = new EventEmitter<Comment>();

  submitting = false;

  commentForm = this.fb.group({
    comment: this.fb.control('', {
      validators: [Validators.required, Validators.minLength(3)],
    }),
  });

  comment(): void {
    if (this.commentForm.invalid) return;

    this.submitting = true;
    // Async pipe not triggering change detection for some reason. CONFIRMATION NEEDED
    this.cdr.detectChanges();

    this.videoService
      .comment(this.videoId, this.commentForm.value?.comment || '')
      .pipe(take(1))
      .subscribe({
        next: (response) => {
          this.commentForm.reset();
          this.commentAdded.emit(response);
        },
      });

    this.submitting = false;
    // Async pipe not triggering change detection for some reason. CONFIRMATION NEEDED
    this.cdr.detectChanges();
  }
}
