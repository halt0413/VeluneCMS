import { describe, expect, it } from "vitest";
import { cmsPageResourceSchema } from "../../../src/infrastructure/content/schema";
import {
  createDraftPageResource,
  createPageResourceBase,
  createPublishedPageResource
} from "../helpers/contentSchemaFixture";

describe("cmsPageResourceSchema", () => {
  it("draftはpublishedAtなしで通す", () => {
    expect(cmsPageResourceSchema.parse(createDraftPageResource())).toMatchObject({
      id: "page-1",
      status: "draft"
    });
  });

  it("draftにpublishedAtがある場合はエラーにする", () => {
    expect(() =>
      cmsPageResourceSchema.parse({
        ...createPageResourceBase(),
        publishedAt: "2026-01-02T00:00:00.000Z",
        status: "draft"
      })
    ).toThrow();
  });

  it("publishedはpublishedAtを必須にする", () => {
    expect(
      cmsPageResourceSchema.parse(createPublishedPageResource())
    ).toMatchObject({
      publishedAt: "2026-01-02T00:00:00.000Z",
      status: "published"
    });
    expect(() =>
      cmsPageResourceSchema.parse({
        ...createPageResourceBase(),
        status: "published"
      })
    ).toThrow();
  });
});
