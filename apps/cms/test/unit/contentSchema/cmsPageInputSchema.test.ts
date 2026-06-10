import { describe, expect, it } from "vitest";
import { cmsPageInputSchema } from "../../../src/infrastructure/content/schema";

describe("cmsPageInputSchema", () => {
  it("CMSページ入力を検証する", () => {
    expect(
      cmsPageInputSchema.parse({
        body: "本文",
        contentType: "portfolio",
        slug: "welcome",
        status: "draft",
        title: "Welcome"
      })
    ).toEqual({
      body: "本文",
      contentType: "portfolio",
      slug: "welcome",
      status: "draft",
      title: "Welcome"
    });
  });

  it("必須入力が空ならエラーにする", () => {
    expect(() =>
      cmsPageInputSchema.parse({
        body: "",
        contentType: "portfolio",
        slug: "welcome",
        status: "draft",
        title: "Welcome"
      })
    ).toThrow();
  });
});
