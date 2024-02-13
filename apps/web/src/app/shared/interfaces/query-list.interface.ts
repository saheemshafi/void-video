export interface PaginationQueryList {
  page: number;
  limit: number;
}

export interface QueryList extends PaginationQueryList {
  username: string;
  sort: 'views.asc' | 'views.desc' | 'title.asc' | 'title.desc';
  query: string;
}
