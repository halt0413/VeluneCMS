import { describe, expect, it } from "vitest";
import { ContentCollection } from "../../../src/domain";

describe("ContentCollection.create", () => {
  it("入力を正規化してcollectionを作成する", () => {
    const collection = ContentCollection.create({
      id: "collection-1",
      input: {
        name: " Portfolio ",
        slug: " portfolio_page "
      },
      now: "2026-01-01T00:00:00.000Z"
    });

    expect(collection.toSnapshot()).toEqual({
      createdAt: "2026-01-01T00:00:00.000Z",
      id: "collection-1",
      name: "Portfolio",
      slug: "portfolio-page",
      updatedAt: "2026-01-01T00:00:00.000Z"
    });
  });

  it("nameが空ならエラーにする", () => {
    expect(() =>
      ContentCollection.create({
        id: "collection-1",
        input: {
          name: " ",
          slug: "portfolio"
        },
        now: "2026-01-01T00:00:00.000Z"
      })
    ).toThrow("Name is required");
  });
});
