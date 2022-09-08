# `postgrest-js-tools`

[![Package](https://img.shields.io/npm/v/postgrest-js-tools)](https://www.npmjs.com/package/postgrest-js-tools)
[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)

Tiny tools library for [@supabase/supabase-js](https://github.com/supabase/supabase-js).

### TLDR

```ts
type User = { id: string; email: string };
const shape = getShape<User>()({ id: true }); // with intellisense!

// typeof shape => { id: string; }
// getFields(shape) => "id"

const result = await supabase
  .from<typeof shape>("users")
  .select(getFields(shape));

// typeof result => PostgrestResponse<{ id: string; }>
```

### Features:

1. intellisense while selecting fields (`getShape`)
2. auto generated select string (`getFields`)
3. return type based on the selected fields (`typeof shape`)
4. 1:1, 1:m & n:m relations support

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

Let's assume we work on a following data structure:

- Each **University** has many **Scholars**
- Each **Scholar** has many **Papers**

```ts
import { definitions } from "path/to/types";

type UniversityBase = definitions["universities"]; // { id: string; name: string }
type ScholarBase = definitions["scholars"]; // { id: string; email: string; university_id: string }
type PaperBase = definitions["papers"]; // { id: string; title: string; scholar_id: string }

type University = UniversityBase & {
  scholars: Scholar[];
};

type Scholar = ScholarBase & {
  university: University;
  papers: Paper[];
};

type Paper = PaperBase & {
  scholar: Scholar;
};

// with intellisense!
const shape = getShape<Scholar>()({
  id: true,
  email: false, // if value === false then we skip the key
  university: { _: "university_id", name: true }, // _ is the key to join by
  papers: [{ "*": true }], // * selects all the fields
});

// typeof shape => { id: string; university: { name: string }; papers: { id: string; title: string; scholar_id: string }[] }
// getFields(shape) => "id,university:university_id(name),papers(*)"

const result = await supabase
  .from<typeof shape>("scholars")
  .select(getFields(shape));

// typeof result => PostgrestResponse<{ id: string; university: { name: string }; papers: { id: string, title: string; scholar_id: string }[] }>
```
