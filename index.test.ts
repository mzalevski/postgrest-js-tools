import { getShape, getFields } from "./src";
import { expectType } from "tsd";

type CheckBase = { id: string; place_id: string; user_id: string };
type PlaceBase = { id: string; title: string };
type UserBase = { id: string; name: string };

type Check = CheckBase & {
  /** user relation */
  user: UserBase;
  /** place relation */
  place: PlaceBase;
};

test("some fields, no relations & no omissions", () => {
  const shape = getShape<Check>()({
    id: true,
  });

  expectType<{
    id: string;
  }>(shape);

  const fields = getFields(shape);

  expect(fields).toBe("id");
});

test("some fields, relations & no omissions", () => {
  const shape = getShape<Check>()({
    id: true,
    place: { _: "place_id", id: true },
    user: { _: "user_id", id: true },
  });

  expectType<{
    id: string;
    place: { id: string };
    user: { id: string };
  }>(shape);

  const fields = getFields(shape);

  expect(fields).toBe("id,place:place_id(id),user:user_id(id)");
});

test("many fields, relations & no omissions", () => {
  const shape = getShape<Check>()({
    id: true,
    place: { _: "place_id", id: true, title: true },
    user: { _: "user_id", id: true, name: true },
  });

  expectType<{
    id: string;
    place: { id: string; title: string };
    user: { id: string; name: string };
  }>(shape);

  const fields = getFields(shape);

  expect(fields).toBe("id,place:place_id(id,title),user:user_id(id,name)");
});

test("many fields, relations & some omissions", () => {
  const shape = getShape<Check>()({
    id: true,
    place: { _: "place_id", id: true, title: true },
    user: { _: "user_id", id: true, name: false },
  });

  expectType<{
    id: string;
    place: { id: string; title: string };
    user: { id: string };
  }>(shape);

  const fields = getFields(shape);

  expect(fields).toBe("id,place:place_id(id,title),user:user_id(id)");
});

test("many fields, relations & many omissions", () => {
  const shape = getShape<Check>()({
    id: false,
    place: { _: "place_id", id: false, title: true },
    user: { _: "user_id", id: true, name: false },
  });

  expectType<{
    place: { title: string };
    user: { id: string };
  }>(shape);

  const fields = getFields(shape);

  expect(fields).toBe("place:place_id(title),user:user_id(id)");
});
