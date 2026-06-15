import { describe, expect, it } from "vitest";
import { toContentCollection } from "../../../src/domain/contentCollection";
import { contentCollectionResourceSchema } from "../../../src/infrastructure/contentCollection/schema";
import { createContentCollectionResource } from "../helpers/contentCollectionSchemaFixture";

describe("toContentCollection", () => {
  it("API resourceをdomain型へ変換する", () => {
    const collection = contentCollectionResourceSchema.parse(
      createContentCollectionResource()
    );

    expect(toContentCollection(collection)).toEqual({
      createdAt: "2026-01-01T00:00:00.000Z",
      id: "collection-1",
      name: "Portfolio",
      slug: "portfolio",
      updatedAt: "2026-01-01T00:00:00.000Z"
    });
  });
});
