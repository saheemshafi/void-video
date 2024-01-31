import { Component, TemplateRef, ViewChild, inject } from '@angular/core';
import {
  Subject,
  debounceTime,
  distinctUntilChanged,
  filter,
  switchMap,
} from 'rxjs';
import { SearchService } from '../../../shared/services/search.service';
import { Router } from '@angular/router';
import { CdkOption } from '@angular/cdk/listbox';

@Component({
  selector: 'app-searchbar',
  templateUrl: './searchbar.component.html',
  styleUrl: './searchbar.component.scss',
})
export class SearchbarComponent {
  private searchService = inject(SearchService);
  private router = inject(Router);
  search: string = '';
  private searchQuery$ = new Subject<string>();
  @ViewChild(CdkOption) cdkOption!: CdkOption;

  items$ = this.searchQuery$.pipe(
    debounceTime(250),
    distinctUntilChanged(),
    filter((query) => query.length > 0),
    switchMap((query) => this.searchService.autocomplete(query))
  );

  onModelChange(): void {
    this.searchQuery$.next(this.search.trim());
  }

  onKeypress(event: KeyboardEvent) {
    if (event.key == 'ArrowDown') {
      this.cdkOption.focus();
    }
  }

  onAutocompleteSelect(value: unknown) {
    if (typeof value !== 'string') return;
    this.router.navigate(['/search'], { queryParams: { query: value } });
  }
}
