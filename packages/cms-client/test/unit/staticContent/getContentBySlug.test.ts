import { describe, expect, it } from "vitest";
import { getContentBySlug } from "../../../src/content/staticContent.js";
import {
  createContentFile,
  publishedContent
} from "../helpers/staticContentFixture.js";

describe("getContentBySlug", () => {
  it("contentTypeで絞り込んだうえでslugから取得できる", () => {
    expect(
      getContentBySlug(createContentFile(), "published-entry", {
        contentType: "portfolio"
      })
    ).toBe(publishedContent);
  });

  it("公開可否とcontentTypeで絞り込んだ結果slugが見つからなければエラーにする", () => {
    expect(() =>
      getContentBySlug(createContentFile(), "draft-entry", {
        contentType: "portfolio"
      })
    ).toThrow("VeluneCMS content not found: draft-entry");
  });
});
