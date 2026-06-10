import { describe, expect, it } from "vitest";
import { contentCollectionDeleteResponseSchema } from "../../../src/infrastructure/contentCollection/schema";

describe("contentCollectionDeleteResponseSchema", () => {
  it("deletedとidを持つAPI responseを検証する", () => {
    expect(
      contentCollectionDeleteResponseSchema.parse({
        deleted: true,
        id: "collection-1"
      })
    ).toEqual({
      deleted: true,
      id: "collection-1"
    });
  });

  it("deletedがtrue以外ならエラーにする", () => {
    expect(() =>
      contentCollectionDeleteResponseSchema.parse({
        deleted: false,
        id: "collection-1"
      })
    ).toThrow();
  });
});
