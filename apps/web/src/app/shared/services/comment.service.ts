import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';

import { ApiResponse } from '~shared/interfaces/api-response.interface';
import { Comment } from '~shared/interfaces/comment.interface';

import { environment } from '~/environments/environment';
import { map, tap } from 'rxjs';
import { HotToastService } from '@ngneat/hot-toast';

@Injectable({
  providedIn: 'root',
})
export class CommentService {
  private http = inject(HttpClient);
  private toast = inject(HotToastService);

  toggleCommentLike(commentId: string) {
    return this.http.get<ApiResponse<null>>(
      `${environment.serverUrl}/comments/${commentId}/toggle-like`,
      { withCredentials: true }
    );
  }

  replyToComment(commentId: string, content: string) {
    return this.http
      .post<ApiResponse<Comment>>(
        `${environment.serverUrl}/comments/${commentId}/reply`,
        {
          content,
        },
        { withCredentials: true }
      )
      .pipe(
        map((response) => response.data),
        tap({
          next: (response) => {
            if (response) {
              this.toast.show(`Reply added`);
            }
          },
          error: ({ error }) =>
            this.toast.show(
              `Failed to reply <p class='toast-description'>${error?.message}</p>`
            ),
        })
      );
  }
}
