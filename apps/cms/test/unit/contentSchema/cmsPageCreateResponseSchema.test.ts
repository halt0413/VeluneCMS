import { describe, expect, it } from "vitest";
import { cmsPageCreateResponseSchema } from "../../../src/infrastructure/content/schema";
import { createDraftPageResource } from "../helpers/contentSchemaFixture";

describe("cmsPageCreateResponseSchema", () => {
  it("createdにページresourceを持つAPI responseを検証する", () => {
    const page = createDraftPageResource();

    expect(cmsPageCreateResponseSchema.parse({ created: page })).toEqual({
      created: page
    });
  });

  it("createdがなければエラーにする", () => {
    expect(() => cmsPageCreateResponseSchema.parse({})).toThrow();
  });

  it("createdのresource shapeが壊れていればエラーにする", () => {
    expect(() =>
      cmsPageCreateResponseSchema.parse({
        created: {
          id: "page-1",
          slug: "welcome",
          status: "draft",
          title: "Welcome"
        }
      })
    ).toThrow();
  });
});
