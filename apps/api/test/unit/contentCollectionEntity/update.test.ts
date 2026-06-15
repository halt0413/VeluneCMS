import { describe, expect, it } from "vitest";
import { ContentCollection } from "../../../src/domain";

describe("ContentCollection.update", () => {
  it("nameとslugを更新する", () => {
    const collection = ContentCollection.create({
      id: "collection-1",
      input: {
        name: "Portfolio",
        slug: "portfolio"
      },
      now: "2026-01-01T00:00:00.000Z"
    });

    collection.update(
      {
        name: " Blog ",
        slug: " blog_page "
      },
      "2026-01-02T00:00:00.000Z"
    );

    expect(collection.toSnapshot()).toEqual({
      createdAt: "2026-01-01T00:00:00.000Z",
      id: "collection-1",
      name: "Blog",
      slug: "blog-page",
      updatedAt: "2026-01-02T00:00:00.000Z"
    });
  });

  it("slugが空ならエラーにする", () => {
    const collection = ContentCollection.create({
      id: "collection-1",
      input: {
        name: "Portfolio",
        slug: "portfolio"
      },
      now: "2026-01-01T00:00:00.000Z"
    });

    expect(() =>
      collection.update({ slug: " / " }, "2026-01-02T00:00:00.000Z")
    ).toThrow("Slug is required");
  });
});
