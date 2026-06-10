import { describe, expect, it } from "vitest";
import { getContent } from "../../../src/content/staticContent.js";
import {
  createContentFile,
  draftContent,
  publishedContent
} from "../helpers/staticContentFixture.js";

describe("getContent", () => {
  it("公開済みコンテンツをidで取得できる", () => {
    expect(getContent(createContentFile(), "published-1")).toBe(
      publishedContent
    );
  });

  it("includeDraftsなしで下書きを読むとエラーにする", () => {
    expect(() => getContent(createContentFile(), "draft-1")).toThrow(
      "VeluneCMS content is not readable: draft-1"
    );
  });

  it("includeDraftsがtrueなら下書きを取得できる", () => {
    expect(getContent(createContentFile(), "draft-1", { includeDrafts: true })).toBe(
      draftContent
    );
  });
});
