import { Injectable, inject } from '@angular/core';
import { AuthService } from './auth.service';
import { environment } from '../../../environments/environment';
import { QueryList } from '../interfaces/utils';
import { PlaylistsResponse } from '../interfaces/api-response';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PlaylistService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);

  constructor() {}

  getPlaylists(queryParams?: Partial<QueryList>) {
    const url = new URL(`${environment.serverUrl}/playlists`);

    for (let [param, value] of Object.entries(queryParams || {})) {
      url.searchParams.set(param, String(value));
    }

    return this.http
      .get<PlaylistsResponse>(url.toString())
      .pipe(map((response) => response.data));
  }
}
