type NextPage =
  | { hasNextPage: true; nextPage: number }
  | { hasNextPage: false; nextPage: null };

type PrevPage =
  | { hasPrevPage: true; prevPage: number }
  | { hasPrevPage: false; prevPage: null };

type Pages = PrevPage & NextPage;

type Pagination = {
  totalDocs: number;
  limit: number;
  page: number;
  totalPages: number;
  pagingCounter: number;
} & Pages;

export type Paginated<
  TDocumentType,
  TPropertyName extends PropertyKey,
> = Pagination & {
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
