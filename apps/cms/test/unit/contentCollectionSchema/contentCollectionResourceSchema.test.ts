import { describe, expect, it } from "vitest";
import { contentCollectionResourceSchema } from "../../../src/infrastructure/contentCollection/schema";
import { createContentCollectionResource } from "../helpers/contentCollectionSchemaFixture";

describe("contentCollectionResourceSchema", () => {
  it("resourceのshapeを検証する", () => {
    const collection = createContentCollectionResource();

    expect(contentCollectionResourceSchema.parse(collection)).toEqual(
      collection
    );
  });

  it("idがなければエラーにする", () => {
    const { id: _id, ...collection } = createContentCollectionResource();

    expect(() => contentCollectionResourceSchema.parse(collection)).toThrow();
  });

  it("createdAtがなければエラーにする", () => {
    const { createdAt: _createdAt, ...collection } =
      createContentCollectionResource();

    expect(() => contentCollectionResourceSchema.parse(collection)).toThrow();
  });

  it("nameが空ならエラーにする", () => {
    expect(() =>
      contentCollectionResourceSchema.parse({
        ...createContentCollectionResource(),
        name: ""
      })
    ).toThrow();
  });
});
