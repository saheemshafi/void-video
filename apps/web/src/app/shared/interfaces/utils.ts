export type Paginated<TDocumentType, TPropertyName extends PropertyKey> = {
  totalDocs: number;
  limit: number;
  page: number;
  totalPages: number;
  pagingCounter: number;
  hasPrevPage: boolean;
  hasNextPage: boolean;
  prevPage: number | null;
  nextPage: number | null;
} & {
  [P in TPropertyName]: TDocumentType;
};

export type QueryList = {
  userId: string;
  sort: 'views.asc' | 'views.desc' | 'title.asc' | 'title.desc';
  page: number;
  limit: number;
  query: string;
};

export type Populated<T, TFieldName extends PropertyKey, TFieldType> = {
  [P in keyof T]: T[P];
} & {
  [P in TFieldName]: TFieldType;
};
