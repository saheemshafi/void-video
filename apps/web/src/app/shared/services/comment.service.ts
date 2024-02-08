import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '~/environments/environment';
import { ApiResponse } from '../interfaces/api-response.interface';

@Injectable({
  providedIn: 'root',
})
export class CommentService {
  private http = inject(HttpClient);

  constructor() {}

  toggleCommentLike(commentId: string) {
    return this.http.get<ApiResponse<null>>(
      `${environment.serverUrl}/comments/${commentId}/toggle-like`,
      { withCredentials: true }
    );
  }
}
