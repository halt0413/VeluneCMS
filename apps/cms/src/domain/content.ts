import type { CmsPageResource } from "../infrastructure/content/types";

export type ContentStatus = "draft" | "published";

export type ContentUser = {
  id: number;
  login: string;
};

type ContentBase = {
  body: string;
  contentType: string;
  createdAt: string;
  createdBy?: ContentUser;
  id: string;
  owner?: ContentUser;
  slug: string;
  title: string;
  updatedAt: string;
  updatedBy?: ContentUser;
};

export type DraftContent = ContentBase & {
  publishedAt?: never;
  status: "draft";
};

export type PublishedContent = ContentBase & {
  publishedAt: string;
  status: "published";
};

export type Content = DraftContent | PublishedContent;

export function toContent(page: CmsPageResource): Content {
  if (page.status === "published") {
    return {
      ...page,
      status: "published"
    };
  }

  return {
    ...page,
    status: "draft"
  };
}
