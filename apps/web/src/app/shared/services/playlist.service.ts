import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { map } from 'rxjs';

import { ApiResponse } from '~shared/interfaces/api-response.interface';
import { Playlist } from '~shared/interfaces/playlist.interface';
import { QueryList } from '~shared/interfaces/query-list.interface';
import { Paginated } from '~shared/interfaces/utils.interface';

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
      .get<ApiResponse<Paginated<Playlist[], 'playlists'>>>(url.toString())
      .pipe(map((response) => response.data));
  }
}
