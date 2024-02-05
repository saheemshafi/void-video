export interface QueryList {
  userId: string;
  sort: 'views.asc' | 'views.desc' | 'title.asc' | 'title.desc';
  page: number;
  limit: number;
  query: string;
}
