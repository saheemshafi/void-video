import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs';

import { AuthService } from '~shared/services/auth.service';

import { QueryList } from '~shared/interfaces/utils';
import { PlaylistsResponse } from '~shared/interfaces/api-response';

import { environment } from '~/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PlaylistService {
  private http = inject(HttpClient);

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
