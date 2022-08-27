type MakePropTypesBoolean<T, A = T> = T extends object
  ? { [K in keyof T]: MakePropTypesBoolean<Partial<T[K]>, T> } & {
      /** which field to join by */
      _?: keyof A;
      /** wheter to get all the fields */
      "*"?: true;
    }
  : boolean;

type OmitFalseKeys<T> = {
  [K in keyof T as T[K] extends false ? never : K]: T[K];
};

export type ParseReturnType<T, U> = U extends { "*": true }
  ? T
  : U extends Array<infer UE>
  ? ParseReturnType<T extends Array<infer TE> ? TE : T, UE>[]
  : U extends Record<string, unknown>
  ? Omit<
      {
        [K in keyof OmitFalseKeys<U>]: ParseReturnType<
          T[Extract<K, keyof T>],
          U[K extends string ? K : never]
        >;
      },
      "_"
    >
  : T;

/**
 * @example
 * const shape = getShape<Post>()({
 *   id: true,
 *   title: false, // if value === false then we skip the key
 *   user: { _: "user_id", id: true, email: true },
 * });
 *
 * typeof shape => { id: string; user: { id: string; email: string; } }
 * getFields(shape) => "id,user:user_id(id,email)"
 */
export const getShape =
  <T>() =>
  <U extends Partial<MakePropTypesBoolean<T>>>(
    fields: U
  ): ParseReturnType<T, U> => {
    return fields as any;
  };

/**
 * @example
 * const shape = getShape<Post>()({
 *   id: true,
 *   title: false, // if value === false then we skip the key
 *   user: { _: "user_id", id: true, email: true },
 * });
 *
 * typeof shape => { id: string; user: { id: string; email: string; } }
 * getFields(shape) => "id,user:user_id(id,email)"
 */
export const getFields = (shape: Record<string, any>) => {
  const joins: Record<string, string> = {};

  let lastKey = "";

  const fields = `${JSON.stringify(shape, (k, v) => {
    if (typeof v === "object") {
      lastKey = k;
      return v;
    }

    if (v === true) {
      return "";
    }

    if (k === "_") {
      joins[lastKey] = v;
    }

    return undefined;
  })
    .replace(/[(": \n)(\[)(\])]/g, "")
    .replace(/\{/g, "(")
    .replace(/\}/g, ")")
    .slice(1, -1)}`;

  if (Object.keys(joins).length > 0)
    return fields.replace(
      new RegExp(
        Object.keys(joins)
          .map((joinKey) => `${joinKey}(?=\\()`)
          .join("|"),
        "g"
      ),
      (m) => `${m}:${joins[m]}`
    );

  return fields;
};
