import { describe, expect, it } from "vitest";
import { listContentCollections } from "../../../src/content/staticContent.js";
import { createContentFile } from "../helpers/staticContentFixture.js";

describe("listContentCollections", () => {
  it("コンテンツコレクション一覧を返す", () => {
    const contentFile = createContentFile();

    expect(listContentCollections(contentFile)).toBe(contentFile.collections);
  });
});
