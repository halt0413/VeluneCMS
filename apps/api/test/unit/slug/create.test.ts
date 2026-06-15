import { describe, expect, it } from "vitest";
import { Slug } from "../../../src/domain";

describe("Slug.create", () => {
  it("空白とアンダースコアをハイフンへ変換する", () => {
    expect(Slug.create("my_portfolio page").toString()).toBe(
      "my-portfolio-page"
    );
  });

  it("前後のスラッシュを削除する", () => {
    expect(Slug.create("/portfolio/detail/").toString()).toBe(
      "portfolio/detail"
    );
  });

  it("空文字はエラーにする", () => {
    expect(() => Slug.create("///")).toThrow("Slug is required");
  });
});
