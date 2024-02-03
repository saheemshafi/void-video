import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { NEVER, catchError, map } from 'rxjs';

import { AutocompleteResponse } from '~shared/interfaces/api-response';

import { environment } from '~/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SearchService {
  private http = inject(HttpClient);

  constructor() {}

  autocomplete(query: string) {
    return this.http
      .get<AutocompleteResponse>(
        `${environment.serverUrl}/search/autocomplete-suggestions?searchTerm=${query}`
      )
      .pipe(
        map((response) => response.data),
        catchError(({ error }) => {
          const AVAILABLE_ON_ATLAS_ONLY = 6047401;
          if (error.code === AVAILABLE_ON_ATLAS_ONLY) {
            console.warn(error.message);
          }
          return NEVER;
        })
      );
  }
}
