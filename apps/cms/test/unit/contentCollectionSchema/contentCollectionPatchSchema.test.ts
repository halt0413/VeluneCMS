import { describe, expect, it } from "vitest";
import { contentCollectionPatchSchema } from "../../../src/infrastructure/contentCollection/schema";

describe("contentCollectionPatchSchema", () => {
  it("patchは部分入力を許可する", () => {
    expect(contentCollectionPatchSchema.parse({ name: "Blog" })).toEqual({
      name: "Blog"
    });
  });

  it("nameが空ならエラーにする", () => {
    expect(() => contentCollectionPatchSchema.parse({ name: "" })).toThrow();
  });

  it("slugが空ならエラーにする", () => {
    expect(() => contentCollectionPatchSchema.parse({ slug: "" })).toThrow();
  });
});
