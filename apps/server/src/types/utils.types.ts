
export type Prettify<T> = {
  [Property in keyof T]: T[Property];
};

export type Split<T extends string> = T extends `${infer Left}.${infer Right}`
  ? [Left, Right]
  : never;
