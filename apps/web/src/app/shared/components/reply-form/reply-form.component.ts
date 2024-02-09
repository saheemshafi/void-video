import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  Output,
  inject,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { CommentService } from '~shared/services/comment.service';
import { Comment } from '~shared/interfaces/comment.interface';

@Component({
  selector: 'app-reply-form',
  templateUrl: './reply-form.component.html',
  styleUrl: './reply-form.component.scss',
})
export class ReplyFormComponent {
  @Input({ required: true }) commentId: string = '';
  @Output() close = new EventEmitter<Comment | undefined>();
  private fb = inject(FormBuilder);
  private commentService = inject(CommentService);

  replyForm!: FormGroup;

  ngOnInit() {
    this.replyForm = this.fb.group({
      [`reply-${this.commentId}`]: this.fb.control('', {
        validators: [Validators.minLength(3)],
      }),
    });
  }

  reply(): void {
    if (this.replyForm.invalid) return;

    this.commentService
      .replyToComment(
        this.commentId,
        this.replyForm.get(`reply-${this.commentId}`)?.value
      )
      .subscribe({
        next: (response) => {
          this.replyForm.reset();
          this.close.emit(response);
        },
      });
  }

  cancel(): void {
    this.close.emit();
  }
}
