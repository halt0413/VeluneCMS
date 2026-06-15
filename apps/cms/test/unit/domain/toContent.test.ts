import { describe, expect, it } from "vitest";
import { toContent } from "../../../src/domain/content";
import { cmsPageResourceSchema } from "../../../src/infrastructure/content/schema";
import {
  createDraftPageResource,
  createPublishedPageResource
} from "../helpers/contentSchemaFixture";

describe("toContent", () => {
  it("下書きページをdomain型へ変換する", () => {
    const page = cmsPageResourceSchema.parse(createDraftPageResource());

    expect(toContent(page)).toEqual({
      body: "本文",
      contentType: "portfolio",
      createdAt: "2026-01-01T00:00:00.000Z",
      id: "page-1",
      slug: "welcome",
      status: "draft",
      title: "Welcome",
      updatedAt: "2026-01-01T00:00:00.000Z"
    });
  });

  it("公開ページをdomain型へ変換する", () => {
    const page = cmsPageResourceSchema.parse(createPublishedPageResource());

    expect(toContent(page)).toEqual({
      body: "本文",
      contentType: "portfolio",
      createdAt: "2026-01-01T00:00:00.000Z",
      id: "page-1",
      publishedAt: "2026-01-02T00:00:00.000Z",
      slug: "welcome",
      status: "published",
      title: "Welcome",
      updatedAt: "2026-01-01T00:00:00.000Z"
    });
  });
});
