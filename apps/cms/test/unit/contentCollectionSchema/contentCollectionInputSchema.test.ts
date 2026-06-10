import { describe, expect, it } from "vitest";
import { contentCollectionInputSchema } from "../../../src/infrastructure/contentCollection/schema";

describe("contentCollectionInputSchema", () => {
  it("コンテンツコレクション入力を検証する", () => {
    expect(
      contentCollectionInputSchema.parse({
        name: "Portfolio",
        slug: "portfolio"
      })
    ).toEqual({
      name: "Portfolio",
      slug: "portfolio"
    });
  });

  it("必須入力が空ならエラーにする", () => {
    expect(() =>
      contentCollectionInputSchema.parse({
        name: "",
        slug: "portfolio"
      })
    ).toThrow();
  });
});
