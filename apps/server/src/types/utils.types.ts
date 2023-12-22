export type Prettify<T> = {
  [Property in keyof T]: T[Property];
};
