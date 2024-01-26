import { Injectable, inject } from '@angular/core';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class PlaylistService {
  private authService = inject(AuthService);

  constructor() {}
}
