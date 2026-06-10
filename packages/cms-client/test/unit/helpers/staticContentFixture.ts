import type { CmsPage, VeluneContentFile } from "../../../src/content/types.js";

export const publishedContent: CmsPage = {
  body: "published body",
  contentType: "portfolio",
  createdAt: "2026-01-01T00:00:00.000Z",
  id: "published-1",
  publishedAt: "2026-01-02T00:00:00.000Z",
  slug: "published-entry",
  status: "published",
  title: "Published",
  updatedAt: "2026-01-02T00:00:00.000Z"
};

export const draftContent: CmsPage = {
  body: "draft body",
  contentType: "portfolio",
  createdAt: "2026-01-03T00:00:00.000Z",
  id: "draft-1",
  slug: "draft-entry",
  status: "draft",
  title: "Draft",
  updatedAt: "2026-01-03T00:00:00.000Z"
};

export const blogContent: CmsPage = {
  body: "blog body",
  contentType: "blog",
  createdAt: "2026-01-04T00:00:00.000Z",
  id: "blog-1",
  publishedAt: "2026-01-05T00:00:00.000Z",
  slug: "blog-entry",
  status: "published",
  title: "Blog",
  updatedAt: "2026-01-05T00:00:00.000Z"
};

export function createContentFile(): VeluneContentFile {
  return {
    collections: [
      {
        createdAt: "2026-01-01T00:00:00.000Z",
        id: "collection-portfolio",
        name: "Portfolio",
        slug: "portfolio",
        updatedAt: "2026-01-01T00:00:00.000Z"
      }
    ],
    contents: [publishedContent, draftContent, blogContent],
    generatedAt: "2026-01-06T00:00:00.000Z"
  };
}
