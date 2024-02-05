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

export type Populated<T, TFieldName extends keyof T, TFieldType> = {
  [P in keyof Omit<T, TFieldName>]: T[P];
} & {
  [P in TFieldName]: TFieldType;
};

export type Prettify<T> = {
  [P in keyof T]: T[P];
};

export type AddFields<T, U extends Record<PropertyKey, unknown>> = {
  [P in keyof T]: T[P];
} & U;
