import { describe, expect, it } from "vitest";
import { contentCollectionCreateResponseSchema } from "../../../src/infrastructure/contentCollection/schema";
import { createContentCollectionResource } from "../helpers/contentCollectionSchemaFixture";

describe("contentCollectionCreateResponseSchema", () => {
  it("createdにコンテンツコレクションresourceを持つAPI responseを検証する", () => {
    const collection = createContentCollectionResource();

    expect(
      contentCollectionCreateResponseSchema.parse({
        created: collection
      })
    ).toEqual({
      created: collection
    });
  });

  it("createdがなければエラーにする", () => {
    expect(() => contentCollectionCreateResponseSchema.parse({})).toThrow();
  });

  it("createdのresource shapeが壊れていればエラーにする", () => {
    expect(() =>
      contentCollectionCreateResponseSchema.parse({
        created: {
          id: "collection-1",
          name: "Portfolio",
          slug: "portfolio"
        }
      })
    ).toThrow();
  });
});
