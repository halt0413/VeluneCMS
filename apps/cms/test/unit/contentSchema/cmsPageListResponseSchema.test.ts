import { describe, expect, it } from "vitest";
import { cmsPageListResponseSchema } from "../../../src/infrastructure/content/schema";
import { createDraftPageResource } from "../helpers/contentSchemaFixture";

describe("cmsPageListResponseSchema", () => {
  it("itemsとtotalを持つAPI responseを検証する", () => {
    const page = createDraftPageResource();

    expect(
      cmsPageListResponseSchema.parse({
        items: [page],
        total: 1
      })
    ).toEqual({
      items: [page],
      total: 1
    });
  });

  it("itemsがなければエラーにする", () => {
    expect(() =>
      cmsPageListResponseSchema.parse({
        total: 1
      })
    ).toThrow();
  });

  it("totalがなければエラーにする", () => {
    const page = createDraftPageResource();

    expect(() =>
      cmsPageListResponseSchema.parse({
        items: [page]
      })
    ).toThrow();
  });

  it("items内のresource shapeが壊れていればエラーにする", () => {
    expect(() =>
      cmsPageListResponseSchema.parse({
        items: [
          {
            id: "page-1",
            slug: "welcome",
            status: "draft",
            title: "Welcome"
          }
        ],
        total: 1
      })
    ).toThrow();
  });
});
