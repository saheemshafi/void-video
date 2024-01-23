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
