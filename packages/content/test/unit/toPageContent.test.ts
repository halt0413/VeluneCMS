import { describe, expect, it } from "vitest";
import { toPageContent } from "../../src/toPageContent";
import type { CmsPageInput } from "../../src/types";

const validInput: CmsPageInput = {
  body: "  本文です  ",
  contentType: "portfolio",
  slug: " My Portfolio ",
  status: "published",
  title: "  タイトル  "
};

describe("toPageContent", () => {
  it("CMS入力を公開用コンテンツに変換する", () => {
    expect(toPageContent(validInput)).toEqual({
      body: "本文です",
      slug: "My-Portfolio",
      title: "タイトル"
    });
  });

  it("公開用コンテンツには管理用の項目を含めない", () => {
    const content = toPageContent(validInput);

    expect(content).not.toHaveProperty("contentType");
    expect(content).not.toHaveProperty("status");
  });

  it("slugが空ならエラーにする", () => {
    expect(() =>
      toPageContent({
        ...validInput,
        slug: ""
      })
    ).toThrow();
  });

  it("titleが空ならエラーにする", () => {
    expect(() =>
      toPageContent({
        ...validInput,
        title: ""
      })
    ).toThrow();
  });

  it("bodyが空ならエラーにする", () => {
    expect(() =>
      toPageContent({
        ...validInput,
        body: ""
      })
    ).toThrow();
  });

  it("statusがdraft/published以外ならエラーにする", () => {
    expect(() =>
      toPageContent({
        ...validInput,
        status: "archived"
      } as unknown as CmsPageInput)
    ).toThrow();
  });
});
