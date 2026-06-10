import { describe, expect, it } from "vitest";
import { cmsPagePatchSchema } from "../../../src/infrastructure/content/schema";

describe("cmsPagePatchSchema", () => {
  it("patchは部分入力を許可する", () => {
    expect(cmsPagePatchSchema.parse({ title: "更新タイトル" })).toEqual({
      title: "更新タイトル"
    });
  });

  it("titleが空ならエラーにする", () => {
    expect(() => cmsPagePatchSchema.parse({ title: "" })).toThrow();
  });

  it("bodyが空ならエラーにする", () => {
    expect(() => cmsPagePatchSchema.parse({ body: "" })).toThrow();
  });

  it("slugが空ならエラーにする", () => {
    expect(() => cmsPagePatchSchema.parse({ slug: "" })).toThrow();
  });

  it("statusがdraft/published以外ならエラーにする", () => {
    expect(() => cmsPagePatchSchema.parse({ status: "archived" })).toThrow();
  });
});
