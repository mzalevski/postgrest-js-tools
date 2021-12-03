# `postgrest-js-tools`

[![Package](https://img.shields.io/npm/v/postgrest-js-tools)](https://www.npmjs.com/package/postgrest-js-tools)
[![License: ISC](https://img.shields.io/npm/l/postgrest-js-tools)](#license)

Tiny tools library for `@supabase/postgrest-js`.

### Features:

1. intellisense while selecting fields (`getShape`)
2. auto generated select string (`getFields`)
3. return type based on the selected fields (`typeof shape`)

### Quick start

Install

```bash
npm i postgrest-js-tools
```

Usage

[click here to read how to generate database types -> `definitions`](https://supabase.com/docs/reference/javascript/generating-types#generate-database-types-from-openapi-specification)

```ts
// import { definitions } from "path/to/types";
import { getShape, getFields } from "postgrest-js-tools";

// or definitions["users"]
type User = {
  id: string;
  email: string;
  unused: string; // field we don't want
};

// or definitions["posts"]
type Post = {
  id: string;
  user_id: string;
  unused: string; // field we don't want
  user: User;
};

// with intellisense!
const shape = getShape<Post>()({
  id: true,
  user: { _: "user_id", id: true, email: true },
});

// typeof shape => { id:string; user: { id: string; email: string; } }
// getFields(shape) => "id,user:user_id(id,email)"

const result = await supabase
  .from<typeof shape>("posts")
  .select(getFields(shape));

// typeof result => PostgrestResponse<{ id:string; user: { id: string; email: string; }>
```

### Methods

`getShape: <T>() => <U extends Partial<MakePropTypesBoolean<T, T>>>(fields: U) => ParseReturnType<T, U>`

`getFields: (shape: Record<string, any>) => string`
