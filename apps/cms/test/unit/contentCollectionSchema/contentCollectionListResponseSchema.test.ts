import { describe, expect, it } from "vitest";
import { contentCollectionListResponseSchema } from "../../../src/infrastructure/contentCollection/schema";
import { createContentCollectionResource } from "../helpers/contentCollectionSchemaFixture";

describe("contentCollectionListResponseSchema", () => {
  it("itemsとtotalを持つAPI responseを検証する", () => {
    const collection = createContentCollectionResource();

    expect(
      contentCollectionListResponseSchema.parse({
        items: [collection],
        total: 1
      })
    ).toEqual({
      items: [collection],
      total: 1
    });
  });

  it("itemsがなければエラーにする", () => {
    expect(() =>
      contentCollectionListResponseSchema.parse({
        total: 1
      })
    ).toThrow();
  });

  it("totalがなければエラーにする", () => {
    const collection = createContentCollectionResource();

    expect(() =>
      contentCollectionListResponseSchema.parse({
        items: [collection]
      })
    ).toThrow();
  });

  it("items内のresource shapeが壊れていればエラーにする", () => {
    expect(() =>
      contentCollectionListResponseSchema.parse({
        items: [
          {
            id: "collection-1",
            name: "Portfolio",
            slug: "portfolio"
          }
        ],
        total: 1
      })
    ).toThrow();
  });
});
