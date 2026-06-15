import { describe, expect, test } from "vitest";
import { normalizeSlug } from "../../src/slug";

describe("normalizeSlug", () => {
  test("前後の空白を削除して空白とアンダースコアをハイフンへ変換する", () => {
    expect(normalizeSlug("  my_portfolio page  ")).toBe("my-portfolio-page");
  });

  test("連続したハイフンを1つにまとめる", () => {
    expect(normalizeSlug("portfolio---detail")).toBe("portfolio-detail");
  });

  test("前後のスラッシュを削除する", () => {
    expect(normalizeSlug("/portfolio/detail/")).toBe("portfolio/detail");
  });
});
