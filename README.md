# `postgrest-js-tools`

[![Package](https://img.shields.io/npm/v/postgrest-js-tools)](https://www.npmjs.com/package/postgrest-js-tools)
[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)

Tiny tools library for `@supabase/postgrest-js`.

### Features:

1. intellisense while selecting fields (`getShape`)
2. auto generated select string (`getFields`)
3. return type based on the selected fields (`typeof shape`)

### Quick start

Installation

```bash
npm i postgrest-js-tools
```

```bash
yarn add postgrest-js-tools
```

```bash
pnpm i postgrest-js-tools
```

Imports

Node

```ts
import { getShape, getFields } from "postgrest-js-tools";
```

Deno

```ts
import {
  getShape,
  getFields,
} from "https://cdn.skypack.dev/postgrest-js-tools?dts";
```

Usage

Click [here](https://supabase.com/docs/reference/javascript/generating-types#generate-database-types-from-openapi-specification) to read about how to generate database types. These are the `definitions` from the example below.

```ts
// import { definitions } from "path/to/types";

// or definitions["users"]
type User = {
  id: string;
  email: string;
  unused: string; // field we don't want to select
};

// or definitions["posts"] & { user: definitions["users"] }
type Post = {
  id: string;
  title: string;
  user_id: string;
  user: User;
  unused: string; // field we don't want to select
};

// with intellisense!
const shape = getShape<Post>()({
  id: true,
  title: false, // if value === false then we skip the key
  user: { _: "user_id", id: true, email: true },
  // user: { _: "user_id", "*": true }, // "*": true gets all the fields
});

// typeof shape => { id: string; user: { id: string; email: string; } }
// getFields(shape) => "id,user:user_id(id,email)"

const result = await supabase
  .from<typeof shape>("posts")
  .select(getFields(shape));

// typeof result => PostgrestResponse<{ id: string; user: { id: string; email: string; }>
```
