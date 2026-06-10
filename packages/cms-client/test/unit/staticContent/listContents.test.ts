import { describe, expect, it } from "vitest";
import { listContents } from "../../../src/content/staticContent.js";
import {
  blogContent,
  createContentFile,
  draftContent,
  publishedContent
} from "../helpers/staticContentFixture.js";

describe("listContents", () => {
  it("デフォルトでは公開済みコンテンツだけを返す", () => {
    expect(listContents(createContentFile())).toEqual([
      publishedContent,
      blogContent
    ]);
  });

  it("includeDraftsがtrueなら下書きも返す", () => {
    expect(listContents(createContentFile(), { includeDrafts: true })).toEqual([
      publishedContent,
      draftContent,
      blogContent
    ]);
  });

  it("公開可否を判定したうえでcontentTypeで絞り込む", () => {
    expect(listContents(createContentFile(), { contentType: "portfolio" })).toEqual([
      publishedContent
    ]);
  });
});
